import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as a}from"./app-DL4DkHYg.js";var o=JSON.parse(`{"path":"/%E8%BF%90%E7%BB%B4%E4%B8%8E%E9%83%A8%E7%BD%B2/Docker_K8s/02_Docker%E8%BF%9B%E9%98%B6/02_DockerCompose%E7%BC%96%E6%8E%92.html","title":"Docker Compose 编排","lang":"zh-CN","frontmatter":{"title":"Docker Compose 编排","icon":"docker","order":2,"category":["Docker","运维与部署"],"tag":["Docker Compose","容器编排","微服务","多环境配置"]},"git":{"createdTime":1780623253000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":2}]},"readingTime":{"minutes":19.39,"words":5817},"filePathRelative":"运维与部署/Docker_K8s/02_Docker进阶/02_DockerCompose编排.md"}`),s={name:`02_DockerCompose编排.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="docker-compose-编排" tabindex="-1"><a class="header-anchor" href="#docker-compose-编排"><span>Docker Compose 编排</span></a></h1><div class="hint-container info"><p class="hint-container-title">本章导读</p><p>Docker Compose 是定义和运行多容器应用的工具。通过一个 <code>docker-compose.yml</code> 文件，你可以描述整个应用的架构——服务、网络、卷、配置——然后用一条命令启动全部。本文将深入 Compose 的每个配置项，讲解服务依赖、网络、卷、环境变量管理，以及多环境配置和完整项目实战。</p></div><h2 id="一、docker-compose-概述" tabindex="-1"><a class="header-anchor" href="#一、docker-compose-概述"><span>一、Docker Compose 概述</span></a></h2><h3 id="_1-1-什么是-docker-compose" tabindex="-1"><a class="header-anchor" href="#_1-1-什么是-docker-compose"><span>1.1 什么是 Docker Compose</span></a></h3><p>Docker Compose 是 Docker 官方的容器编排工具，用于定义和管理多容器应用。它使用 YAML 文件声明式地描述应用架构，然后通过单条命令创建和启动所有服务。</p>`,5),i(d,{code:`eJxty80KgkAUhuG9V3Fwb92ACDqjEFT0s2ghLmamU4bKyPwkgRefDMYkeJbf+5xHKwdRM2VgfwlgurS8S9GgioTseqlx8+naCqIogWwuMBewfeVeMpdJGV5RvV8CIY252iY35JCeduE/oh5lDlFmGGcaFyr3ijhFmKiXpPCEOnJArdkT4WzR/iiBeLLjEc0gVTMCXV3z1bUIvoqKUe0=`}),o[1]||=n(`<h3 id="_1-2-compose-v1-vs-v2" tabindex="-1"><a class="header-anchor" href="#_1-2-compose-v1-vs-v2"><span>1.2 Compose V1 vs V2</span></a></h3><table><thead><tr><th>特性</th><th>V1 (<code>docker-compose</code>)</th><th>V2 (<code>docker compose</code>)</th></tr></thead><tbody><tr><td>安装方式</td><td>独立二进制</td><td>Docker CLI 插件</td></tr><tr><td>命令格式</td><td><code>docker-compose up</code></td><td><code>docker compose up</code></td></tr><tr><td>Go 重写</td><td>Python 实现</td><td>Go 实现</td></tr><tr><td>性能</td><td>较慢</td><td>显著提升</td></tr><tr><td>支持</td><td>已废弃</td><td>持续维护</td></tr><tr><td>Compose 文件格式</td><td>2.x / 3.x</td><td>所有格式</td></tr></tbody></table><div class="hint-container important"><p class="hint-container-title">始终使用 Compose V2</p><p>Docker Compose V1 已于 2023 年 7 月停止维护。请使用 V2 的 <code>docker compose</code> 命令（无连字符）。</p></div><h3 id="_1-3-compose-文件版本" tabindex="-1"><a class="header-anchor" href="#_1-3-compose-文件版本"><span>1.3 Compose 文件版本</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># Compose 文件格式版本</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 版本 1：无 version 字段，仅支持 services</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 版本 2.x：支持 volumes、networks</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 版本 3.x：支持 deploy（Swarm 模式）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 当前推荐：不指定 version（Compose V2 自动推断）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 或使用 version: &quot;3.9&quot;（最广泛的兼容版本）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、docker-compose-yml-完整语法" tabindex="-1"><a class="header-anchor" href="#二、docker-compose-yml-完整语法"><span>二、docker-compose.yml 完整语法</span></a></h2><h3 id="_2-1-顶层结构" tabindex="-1"><a class="header-anchor" href="#_2-1-顶层结构"><span>2.1 顶层结构</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># docker-compose.yml 顶层结构</span></span>
<span class="line"><span style="color:#E06C75;">version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;3.9&quot;</span><span style="color:#7F848E;font-style:italic;">          # Compose 文件格式版本（可选）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:                </span><span style="color:#7F848E;font-style:italic;"># 服务定义（必需）</span></span>
<span class="line"><span style="color:#E06C75;">  service-a</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ...</span></span>
<span class="line"><span style="color:#E06C75;">  service-b</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">networks</span><span style="color:#ABB2BF;">:                </span><span style="color:#7F848E;font-style:italic;"># 自定义网络（可选）</span></span>
<span class="line"><span style="color:#E06C75;">  frontend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ...</span></span>
<span class="line"><span style="color:#E06C75;">  backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">volumes</span><span style="color:#ABB2BF;">:                 </span><span style="color:#7F848E;font-style:italic;"># 命名卷（可选）</span></span>
<span class="line"><span style="color:#E06C75;">  db-data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ...</span></span>
<span class="line"><span style="color:#E06C75;">  redis-data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">configs</span><span style="color:#ABB2BF;">:                 </span><span style="color:#7F848E;font-style:italic;"># 配置文件（Swarm 模式，可选）</span></span>
<span class="line"><span style="color:#E06C75;">  app-config</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">secrets</span><span style="color:#ABB2BF;">:                 </span><span style="color:#7F848E;font-style:italic;"># 密钥（Swarm 模式，可选）</span></span>
<span class="line"><span style="color:#E06C75;">  db-password</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ...</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-services-完整配置" tabindex="-1"><a class="header-anchor" href="#_2-2-services-完整配置"><span>2.2 Services 完整配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  myapp</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 镜像与构建 =====</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:latest</span><span style="color:#7F848E;font-style:italic;">                        # 使用已有镜像</span></span>
<span class="line"><span style="color:#E06C75;">    build</span><span style="color:#ABB2BF;">:                                     </span><span style="color:#7F848E;font-style:italic;"># 或从 Dockerfile 构建</span></span>
<span class="line"><span style="color:#E06C75;">      context</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">.</span><span style="color:#7F848E;font-style:italic;">                               # 构建上下文路径</span></span>
<span class="line"><span style="color:#E06C75;">      dockerfile</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Dockerfile.prod</span><span style="color:#7F848E;font-style:italic;">              # Dockerfile 文件名</span></span>
<span class="line"><span style="color:#E06C75;">      args</span><span style="color:#ABB2BF;">:                                    </span><span style="color:#7F848E;font-style:italic;"># 构建参数</span></span>
<span class="line"><span style="color:#E06C75;">        NODE_VERSION</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;20&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        APP_ENV</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">      cache_from</span><span style="color:#ABB2BF;">:                              </span><span style="color:#7F848E;font-style:italic;"># 缓存源</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">myapp:cache</span></span>
<span class="line"><span style="color:#E06C75;">      target</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span><span style="color:#7F848E;font-style:italic;">                      # 多阶段构建目标</span></span>
<span class="line"><span style="color:#E06C75;">      labels</span><span style="color:#ABB2BF;">:                                  </span><span style="color:#7F848E;font-style:italic;"># 构建标签</span></span>
<span class="line"><span style="color:#E06C75;">        com.example.app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;myapp&quot;</span></span>
<span class="line"><span style="color:#E06C75;">      ssh</span><span style="color:#ABB2BF;">:                                     </span><span style="color:#7F848E;font-style:italic;"># SSH 转发</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">default</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 容器配置 =====</span></span>
<span class="line"><span style="color:#E06C75;">    container_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-container</span><span style="color:#7F848E;font-style:italic;">             # 容器名称</span></span>
<span class="line"><span style="color:#E06C75;">    hostname</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-server</span><span style="color:#7F848E;font-style:italic;">                     # 容器主机名</span></span>
<span class="line"><span style="color:#E06C75;">    domainname</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">example.com</span><span style="color:#7F848E;font-style:italic;">                    # 域名</span></span>
<span class="line"><span style="color:#E06C75;">    mac_address</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;02:42:ac:11:00:01&quot;</span><span style="color:#7F848E;font-style:italic;">           # MAC 地址</span></span>
<span class="line"><span style="color:#E06C75;">    privileged</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span><span style="color:#7F848E;font-style:italic;">                          # 特权模式</span></span>
<span class="line"><span style="color:#E06C75;">    user</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1000:1000&quot;</span><span style="color:#7F848E;font-style:italic;">                          # 运行用户</span></span>
<span class="line"><span style="color:#E06C75;">    working_dir</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/app</span><span style="color:#7F848E;font-style:italic;">                          # 工作目录</span></span>
<span class="line"><span style="color:#E06C75;">    entrypoint</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;/app/entrypoint.sh&quot;</span><span style="color:#ABB2BF;">]         </span><span style="color:#7F848E;font-style:italic;"># 入口点</span></span>
<span class="line"><span style="color:#E06C75;">    command</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;node&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;server.js&quot;</span><span style="color:#ABB2BF;">]             </span><span style="color:#7F848E;font-style:italic;"># 默认命令</span></span>
<span class="line"><span style="color:#E06C75;">    init</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span><span style="color:#7F848E;font-style:italic;">                                 # 启用 tini init</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 环境变量 =====</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      NODE_ENV</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">      PORT</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;3000&quot;</span></span>
<span class="line"><span style="color:#E06C75;">      DATABASE_URL</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">postgres://user:pass@db:5432/mydb</span></span>
<span class="line"><span style="color:#E06C75;">    env_file</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">.env</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">.env.production</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 端口映射 =====</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;3000:3000&quot;</span><span style="color:#7F848E;font-style:italic;">                           # 主机:容器</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;127.0.0.1:3001:3001&quot;</span><span style="color:#7F848E;font-style:italic;">                 # 绑定到指定接口</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;9090-9091:8080-8081&quot;</span><span style="color:#7F848E;font-style:italic;">                 # 端口范围</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;127.0.0.1:50000:5000/udp&quot;</span><span style="color:#7F848E;font-style:italic;">            # UDP 协议</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 网络配置 =====</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">frontend</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">backend</span></span>
<span class="line"><span style="color:#E06C75;">    extra_hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;host.docker.internal:host-gateway&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    dns</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#D19A66;">8.8.8.8</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#D19A66;">8.8.4.4</span></span>
<span class="line"><span style="color:#E06C75;">    dns_search</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 卷挂载 =====</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-data:/app/data</span><span style="color:#7F848E;font-style:italic;">                     # 命名卷</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./src:/app/src</span><span style="color:#7F848E;font-style:italic;">                         # 绑定挂载</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">/tmp/app:/app/tmp</span><span style="color:#7F848E;font-style:italic;">                      # 绝对路径绑定</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-config:/app/config:ro</span><span style="color:#7F848E;font-style:italic;">              # 只读挂载</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">tmpfs</span><span style="color:#7F848E;font-style:italic;">                            # tmpfs 挂载</span></span>
<span class="line"><span style="color:#E06C75;">        target</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/app/tmp</span></span>
<span class="line"><span style="color:#E06C75;">        tmpfs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">100m</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 依赖关系 =====</span></span>
<span class="line"><span style="color:#E06C75;">    depends_on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      db</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_healthy</span></span>
<span class="line"><span style="color:#E06C75;">      redis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_started</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 健康检查 =====</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;curl&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;-f&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://localhost:3000/health&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">30s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">      start_period</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10s</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 重启策略 =====</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 资源限制 =====</span></span>
<span class="line"><span style="color:#E06C75;">    deploy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          cpus</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;2.0&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">512M</span></span>
<span class="line"><span style="color:#E06C75;">        reservations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          cpus</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;0.5&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">256M</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 日志配置 =====</span></span>
<span class="line"><span style="color:#E06C75;">    logging</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">json-file</span></span>
<span class="line"><span style="color:#E06C75;">      options</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        max-size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;10m&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        max-file</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;3&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 安全配置 =====</span></span>
<span class="line"><span style="color:#E06C75;">    security_opt</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">no-new-privileges:true</span></span>
<span class="line"><span style="color:#E06C75;">    read_only</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    cap_drop</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">ALL</span></span>
<span class="line"><span style="color:#E06C75;">    cap_add</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">NET_BIND_SERVICE</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 标签 =====</span></span>
<span class="line"><span style="color:#E06C75;">    labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      com.example.app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;myapp&quot;</span></span>
<span class="line"><span style="color:#E06C75;">      com.example.env</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;production&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 其他 =====</span></span>
<span class="line"><span style="color:#E06C75;">    stdin_open</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span><span style="color:#7F848E;font-style:italic;">          # -i</span></span>
<span class="line"><span style="color:#E06C75;">    tty</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span><span style="color:#7F848E;font-style:italic;">                 # -t</span></span>
<span class="line"><span style="color:#E06C75;">    stop_grace_period</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">30s</span><span style="color:#7F848E;font-style:italic;">    # 停止超时</span></span>
<span class="line"><span style="color:#E06C75;">    stop_signal</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">SIGTERM</span><span style="color:#7F848E;font-style:italic;">      # 停止信号</span></span>
<span class="line"><span style="color:#E06C75;">    tmpfs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">/app/tmp</span></span>
<span class="line"><span style="color:#E06C75;">    ulimits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      nofile</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        soft</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">65536</span></span>
<span class="line"><span style="color:#E06C75;">        hard</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">65536</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-networks-完整配置" tabindex="-1"><a class="header-anchor" href="#_2-3-networks-完整配置"><span>2.3 Networks 完整配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 默认网络（bridge）</span></span>
<span class="line"><span style="color:#E06C75;">  default</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">bridge</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 自定义 bridge 网络</span></span>
<span class="line"><span style="color:#E06C75;">  frontend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">bridge</span></span>
<span class="line"><span style="color:#E06C75;">    ipam</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"><span style="color:#E06C75;">      config</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">subnet</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;172.20.0.0/16&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          gateway</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;172.20.0.1&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    driver_opts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      com.docker.network.bridge.name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;frontend-br&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      com.example.network</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;frontend&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 后端网络</span></span>
<span class="line"><span style="color:#E06C75;">  backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">bridge</span></span>
<span class="line"><span style="color:#E06C75;">    internal</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span><span style="color:#7F848E;font-style:italic;">                    # 内部网络，无法访问外网</span></span>
<span class="line"><span style="color:#E06C75;">    ipam</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      config</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">subnet</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;172.21.0.0/16&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # overlay 网络（Swarm 模式）</span></span>
<span class="line"><span style="color:#E06C75;">  app-net</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">overlay</span></span>
<span class="line"><span style="color:#E06C75;">    attachable</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span><span style="color:#7F848E;font-style:italic;">                  # 允许独立容器连接</span></span>
<span class="line"><span style="color:#E06C75;">    driver_opts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      encrypted</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;true&quot;</span><span style="color:#7F848E;font-style:italic;">              # 加密传输</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 外部已有网络</span></span>
<span class="line"><span style="color:#E06C75;">  external-net</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    external</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">existing-network</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # macvlan 网络</span></span>
<span class="line"><span style="color:#E06C75;">  macvlan-net</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">macvlan</span></span>
<span class="line"><span style="color:#E06C75;">    driver_opts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      parent</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">eth0</span></span>
<span class="line"><span style="color:#E06C75;">    ipam</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      config</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">subnet</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;192.168.1.0/24&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          gateway</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;192.168.1.1&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-4-volumes-完整配置" tabindex="-1"><a class="header-anchor" href="#_2-4-volumes-完整配置"><span>2.4 Volumes 完整配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 命名卷（默认 local 驱动）</span></span>
<span class="line"><span style="color:#E06C75;">  db-data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">local</span></span>
<span class="line"><span style="color:#E06C75;">    driver_opts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">none</span></span>
<span class="line"><span style="color:#E06C75;">      o</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">bind</span></span>
<span class="line"><span style="color:#E06C75;">      device</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/data/postgres</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # NFS 卷</span></span>
<span class="line"><span style="color:#E06C75;">  nfs-data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">local</span></span>
<span class="line"><span style="color:#E06C75;">    driver_opts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nfs</span></span>
<span class="line"><span style="color:#E06C75;">      o</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">addr=192.168.1.100,rw,nolock</span></span>
<span class="line"><span style="color:#E06C75;">      device</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;:/export/data&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 外部已有卷</span></span>
<span class="line"><span style="color:#E06C75;">  existing-volume</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    external</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">my-existing-volume</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 带标签的卷</span></span>
<span class="line"><span style="color:#E06C75;">  app-data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">local</span></span>
<span class="line"><span style="color:#E06C75;">    labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      com.example.volume</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;app-data&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-5-configs-完整配置" tabindex="-1"><a class="header-anchor" href="#_2-5-configs-完整配置"><span>2.5 Configs 完整配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 文件配置</span></span>
<span class="line"><span style="color:#E06C75;">  app-config</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    file</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">./config/app.yml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 外部配置</span></span>
<span class="line"><span style="color:#E06C75;">  nginx-config</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    external</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx-production-config</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在服务中使用</span></span>
<span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">source</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-config</span></span>
<span class="line"><span style="color:#E06C75;">        target</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/app/config.yml</span></span>
<span class="line"><span style="color:#E06C75;">        uid</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1000&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        gid</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1000&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        mode</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">0444</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-6-secrets-完整配置" tabindex="-1"><a class="header-anchor" href="#_2-6-secrets-完整配置"><span>2.6 Secrets 完整配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">secrets</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 文件密钥</span></span>
<span class="line"><span style="color:#E06C75;">  db-password</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    file</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">./secrets/db-password.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 外部密钥</span></span>
<span class="line"><span style="color:#E06C75;">  api-key</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    external</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production-api-key</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 环境变量密钥</span></span>
<span class="line"><span style="color:#E06C75;">  tls-cert</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">TLS_CERT</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在服务中使用</span></span>
<span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    secrets</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">source</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">db-password</span></span>
<span class="line"><span style="color:#E06C75;">        target</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">db_password</span></span>
<span class="line"><span style="color:#E06C75;">        uid</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1000&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        gid</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1000&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        mode</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">0400</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、服务依赖" tabindex="-1"><a class="header-anchor" href="#三、服务依赖"><span>三、服务依赖</span></a></h2><h3 id="_3-1-depends-on-配置" tabindex="-1"><a class="header-anchor" href="#_3-1-depends-on-配置"><span>3.1 depends_on 配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  web</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx:alpine</span></span>
<span class="line"><span style="color:#E06C75;">    depends_on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      api</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_healthy</span></span>
<span class="line"><span style="color:#E06C75;">      db</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_healthy</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;80:80&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  api</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-api:latest</span></span>
<span class="line"><span style="color:#E06C75;">    depends_on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      db</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_healthy</span></span>
<span class="line"><span style="color:#E06C75;">      redis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_started</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;curl&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;-f&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://localhost:8080/health&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">5</span></span>
<span class="line"><span style="color:#E06C75;">      start_period</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">15s</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  db</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">postgres:16-alpine</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD-SHELL&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;pg_isready -U postgres&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_PASSWORD</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${DB_PASSWORD}</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_DB</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  redis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis:7-alpine</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;redis-cli&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;ping&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">5</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-服务依赖与启动顺序" tabindex="-1"><a class="header-anchor" href="#_3-2-服务依赖与启动顺序"><span>3.2 服务依赖与启动顺序</span></a></h3>`,22),i(d,{code:`eJyVkrFOwzAQhvc+hcd26AswVKJkYUEICTEi1z21UWkSYreCjQWpqVoJGFgIQyYQCyAESKTwMAgn2foKnB2IaEJUNcvZuS///19sDocDsBgYJu24tF8h+DjUFSYzHWoJssvBLbzcgxahXJeq1TGto1oBWd/eVIgqVeo4RcBoqr5BBW1RDqTq2Fx0XOBFcgfaJlfwBmVdJF21r1U0p+LVGw3DZj1w10hbV8LsPsoBGTgptWULIPYQO7+gHF3J8C1+P49DX15M5PQ1JdO+UmwidHYvx7dZxkVAp8oYvSuYoUbk3STBhHSBHoguxme9HPSj8w+X+jXrf+b79E8JTjw0Geyn6LGmtEgZyAX+TGjnBsSTydLjej4bfX1cJ8+XURgkL0/zmZfLqfmSabC3LOWiOd6czBzXS801X2KOvVXMEVWXRsmdRL4X+VM5DuTDYxzeqW8r35KIKC0=`}),o[2]||=n(`<h3 id="_3-3-condition-类型" tabindex="-1"><a class="header-anchor" href="#_3-3-condition-类型"><span>3.3 condition 类型</span></a></h3><table><thead><tr><th>condition 值</th><th>说明</th></tr></thead><tbody><tr><td><code>service_started</code></td><td>依赖服务已启动（默认）</td></tr><tr><td><code>service_healthy</code></td><td>依赖服务健康检查通过</td></tr><tr><td><code>service_completed_successfully</code></td><td>依赖服务成功退出（一次性任务）</td></tr></tbody></table><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 数据库迁移（一次性任务）</span></span>
<span class="line"><span style="color:#E06C75;">  migrate</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:latest</span></span>
<span class="line"><span style="color:#E06C75;">    command</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;python&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;manage.py&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;migrate&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">    depends_on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      db</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_healthy</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 应用服务（等待迁移完成）</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:latest</span></span>
<span class="line"><span style="color:#E06C75;">    depends_on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      migrate</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_completed_successfully</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-4-重启策略" tabindex="-1"><a class="header-anchor" href="#_3-4-重启策略"><span>3.4 重启策略</span></a></h3><table><thead><tr><th>策略</th><th>说明</th></tr></thead><tbody><tr><td><code>no</code></td><td>不自动重启（默认）</td></tr><tr><td><code>always</code></td><td>总是重启（除非手动停止）</td></tr><tr><td><code>unless-stopped</code></td><td>总是重启，除非手动停止后</td></tr><tr><td><code>on-failure[:max-retries]</code></td><td>仅在非零退出码时重启</td></tr></tbody></table><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  web</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx:alpine</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  worker</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-worker:latest</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">on-failure:5</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  db</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">postgres:16-alpine</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">always</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">重启策略的选择</p><ul><li><strong>Web 服务</strong>：使用 <code>unless-stopped</code>，确保服务持续可用</li><li><strong>Worker 服务</strong>：使用 <code>on-failure</code>，避免无限重启循环</li><li><strong>数据库</strong>：使用 <code>always</code>，确保数据服务始终可用</li><li><strong>一次性任务</strong>：使用 <code>no</code>，任务完成后不重启</li></ul></div><h2 id="四、网络配置" tabindex="-1"><a class="header-anchor" href="#四、网络配置"><span>四、网络配置</span></a></h2><h3 id="_4-1-默认网络行为" tabindex="-1"><a class="header-anchor" href="#_4-1-默认网络行为"><span>4.1 默认网络行为</span></a></h3><p>如果不指定网络，Docker Compose 会创建一个默认的 bridge 网络，所有服务都在此网络中，服务之间通过服务名作为主机名进行 DNS 解析。</p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:latest</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 自动加入默认网络 &lt;project&gt;_default</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 可以通过 http://db:5432 访问 db 服务</span></span>
<span class="line"><span style="color:#E06C75;">  db</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">postgres:16-alpine</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 可以通过 http://app:3000 访问 app 服务</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-自定义网络" tabindex="-1"><a class="header-anchor" href="#_4-2-自定义网络"><span>4.2 自定义网络</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 前端服务：只能访问 API</span></span>
<span class="line"><span style="color:#E06C75;">  web</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx:alpine</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">frontend</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;80:80&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # API 服务：连接前后端网络</span></span>
<span class="line"><span style="color:#E06C75;">  api</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-api:latest</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">frontend</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">backend</span></span>
<span class="line"><span style="color:#E06C75;">    depends_on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      db</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_healthy</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 数据库：只能被 API 访问</span></span>
<span class="line"><span style="color:#E06C75;">  db</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">postgres:16-alpine</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">backend</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_PASSWORD</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${DB_PASSWORD}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  frontend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">bridge</span></span>
<span class="line"><span style="color:#E06C75;">  backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">bridge</span></span>
<span class="line"><span style="color:#E06C75;">    internal</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span><span style="color:#7F848E;font-style:italic;">   # 内部网络，无法访问外网</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,13),i(d,{code:`eJxLy8kvT85ILCpR8AniUgCC4tKk9KLEggyFtKL8vJLUvBSFaDcY6/neic93z4kFqwOBcFenaKW89My8CpukIn07KwsDJYSkY4BntBKQUAhOLSpLLYKpgKsBGohqYVJicjbYPicoA2Ld+z0dT9taXzaveL+nE8V0ONsF6AqNgPzikvSi1OBAH4hNpibGRppIzglydfEMBqoLSk3JLIYoMTM2t4QpgbnG2cfT1S8k+sP8iUsUnk9Z8axje6yCrq5dDdDlNSD/ghUBabBgQVF+RWV8QWJxcQ3cQSAfg+SADqkBugxFLDkxOSO1BuIULgAOk3QQ`}),o[3]||=n(`<h3 id="_4-3-网络别名" tabindex="-1"><a class="header-anchor" href="#_4-3-网络别名"><span>4.3 网络别名</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  api</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-api:latest</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      frontend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        aliases</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#98C379;">api.internal</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#98C379;">app-api</span></span>
<span class="line"><span style="color:#E06C75;">      backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        aliases</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#98C379;">api.backend</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  frontend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  backend</span><span style="color:#ABB2BF;">:</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-4-端口映射详解" tabindex="-1"><a class="header-anchor" href="#_4-4-端口映射详解"><span>4.4 端口映射详解</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:latest</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 短格式</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;3000:3000&quot;</span><span style="color:#7F848E;font-style:italic;">                     # 所有接口</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;127.0.0.1:3001:3001&quot;</span><span style="color:#7F848E;font-style:italic;">           # 仅本地回环</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;9090-9091:8080-8081&quot;</span><span style="color:#7F848E;font-style:italic;">           # 端口范围</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 长格式</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">target</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span><span style="color:#7F848E;font-style:italic;">                    # 容器端口</span></span>
<span class="line"><span style="color:#E06C75;">        published</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;80&quot;</span><span style="color:#7F848E;font-style:italic;">                # 主机端口</span></span>
<span class="line"><span style="color:#E06C75;">        protocol</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">tcp</span><span style="color:#7F848E;font-style:italic;">                   # 协议</span></span>
<span class="line"><span style="color:#E06C75;">        mode</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ingress</span><span style="color:#7F848E;font-style:italic;">                   # 模式（ingress/host）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">端口映射安全建议</p><ol><li>不要将数据库端口暴露到公网（如 <code>5432:5432</code>）</li><li>绑定到 <code>127.0.0.1</code> 限制本地访问</li><li>生产环境使用反向代理（Nginx）暴露服务</li></ol></div><h3 id="_4-5-与外部网络互联" tabindex="-1"><a class="header-anchor" href="#_4-5-与外部网络互联"><span>4.5 与外部网络互联</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:latest</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">default</span><span style="color:#7F848E;font-style:italic;">           # Compose 默认网络</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">shared-net</span><span style="color:#7F848E;font-style:italic;">        # 外部共享网络</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  shared-net</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    external</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">infrastructure_shared</span><span style="color:#7F848E;font-style:italic;">  # 引用已存在的外部网络</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="五、环境变量管理" tabindex="-1"><a class="header-anchor" href="#五、环境变量管理"><span>五、环境变量管理</span></a></h2><h3 id="_5-1-环境变量优先级-从高到低" tabindex="-1"><a class="header-anchor" href="#_5-1-环境变量优先级-从高到低"><span>5.1 环境变量优先级（从高到低）</span></a></h3>`,9),i(d,{code:`eJxLy8kvT85ILCpRCHHhUgACx2hDPYWU/OTs1CKF5PzcgvziVIWi0jwF3dRYBV1dOwWnaCM9heCM1Jwched9658uan7aP+Nle38sWLMTWIlztLGegl5qXpnCs2ntT3Zvg8g5g+Vcok1gxutCjderzM1ReLJj7fNZLQpATZlF+Xm5qXklEF0uYF2u0aZ6Ci5gXWmZOakw1a5+YbFcAEfvRAw=`}),o[4]||=n(`<h3 id="_5-2-env-文件" tabindex="-1"><a class="header-anchor" href="#_5-2-env-文件"><span>5.2 .env 文件</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># .env — Compose 自动加载此文件</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 用于变量替换（\${VAR}）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 应用配置</span></span>
<span class="line"><span style="color:#E06C75;">APP_NAME</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">MyApp</span></span>
<span class="line"><span style="color:#E06C75;">APP_ENV</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">APP_PORT</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">3000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 数据库配置</span></span>
<span class="line"><span style="color:#E06C75;">DB_HOST</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">db</span></span>
<span class="line"><span style="color:#E06C75;">DB_PORT</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">5432</span></span>
<span class="line"><span style="color:#E06C75;">DB_NAME</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">myapp_production</span></span>
<span class="line"><span style="color:#E06C75;">DB_USER</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">postgres</span></span>
<span class="line"><span style="color:#E06C75;">DB_PASSWORD</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">super_secret_password</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Redis 配置</span></span>
<span class="line"><span style="color:#E06C75;">REDIS_HOST</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">redis</span></span>
<span class="line"><span style="color:#E06C75;">REDIS_PORT</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">6379</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 日志级别</span></span>
<span class="line"><span style="color:#E06C75;">LOG_LEVEL</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">info</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-env-file-指令" tabindex="-1"><a class="header-anchor" href="#_5-3-env-file-指令"><span>5.3 env_file 指令</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:latest</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 加载多个 env 文件（后面的覆盖前面的）</span></span>
<span class="line"><span style="color:#E06C75;">    env_file</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">.env.base</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">.env.production</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # env_file 中的变量会设置为容器的环境变量</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 但不会用于 Compose 文件中的变量替换</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-4-environment-指令" tabindex="-1"><a class="header-anchor" href="#_5-4-environment-指令"><span>5.4 environment 指令</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:latest</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 键值对格式</span></span>
<span class="line"><span style="color:#E06C75;">      NODE_ENV</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">      PORT</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;3000&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 支持引用 .env 中的变量</span></span>
<span class="line"><span style="color:#E06C75;">      DATABASE_URL</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">postgres://\${DB_USER}:\${DB_PASSWORD}@\${DB_HOST}:\${DB_PORT}/\${DB_NAME}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  api</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-api:latest</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 列表格式</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">NODE_ENV=production</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">PORT=8080</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">DATABASE_URL=postgres://\${DB_USER}:\${DB_PASSWORD}@\${DB_HOST}:\${DB_PORT}/\${DB_NAME}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-5-多环境变量文件组织" tabindex="-1"><a class="header-anchor" href="#_5-5-多环境变量文件组织"><span>5.5 多环境变量文件组织</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>project/</span></span>
<span class="line"><span>├── .env                    # 默认变量（Compose 自动加载，用于变量替换）</span></span>
<span class="line"><span>├── .env.base               # 基础变量</span></span>
<span class="line"><span>├── .env.development        # 开发环境变量</span></span>
<span class="line"><span>├── .env.staging            # 预发布环境变量</span></span>
<span class="line"><span>├── .env.production         # 生产环境变量</span></span>
<span class="line"><span>├── docker-compose.yml      # 基础 Compose 配置</span></span>
<span class="line"><span>├── docker-compose.dev.yml  # 开发环境覆盖</span></span>
<span class="line"><span>├── docker-compose.prod.yml # 生产环境覆盖</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">.env 文件安全</p><p><code>.env</code> 文件可能包含敏感信息，务必将其添加到 <code>.gitignore</code>。可以提供 <code>.env.example</code> 作为模板。</p></div><div class="language-gitignore line-numbers-mode" data-highlighter="shiki" data-ext="gitignore" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-gitignore"><span class="line"><span># .gitignore</span></span>
<span class="line"><span>.env</span></span>
<span class="line"><span>.env.*</span></span>
<span class="line"><span>!.env.example</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="六、卷挂载" tabindex="-1"><a class="header-anchor" href="#六、卷挂载"><span>六、卷挂载</span></a></h2><h3 id="_6-1-卷类型对比" tabindex="-1"><a class="header-anchor" href="#_6-1-卷类型对比"><span>6.1 卷类型对比</span></a></h3><table><thead><tr><th>类型</th><th>语法</th><th>说明</th><th>适用场景</th></tr></thead><tbody><tr><td>命名卷</td><td><code>vol-name:/path</code></td><td>Docker 管理</td><td>持久化数据</td></tr><tr><td>绑定挂载</td><td><code>./host:/container</code></td><td>映射主机目录</td><td>开发热加载</td></tr><tr><td>tmpfs</td><td><code>type:tmpfs</code></td><td>内存文件系统</td><td>临时数据</td></tr><tr><td>匿名卷</td><td><code>/container/path</code></td><td>一次性使用</td><td>不推荐</td></tr></tbody></table><h3 id="_6-2-命名卷" tabindex="-1"><a class="header-anchor" href="#_6-2-命名卷"><span>6.2 命名卷</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  db</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">postgres:16-alpine</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">db-data:/var/lib/postgresql/data</span><span style="color:#7F848E;font-style:italic;">    # 命名卷持久化数据</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">db-backup:/backups</span><span style="color:#7F848E;font-style:italic;">                  # 备份目录</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  redis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis:7-alpine</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">redis-data:/data</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  db-data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">local</span></span>
<span class="line"><span style="color:#E06C75;">  db-backup</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">local</span></span>
<span class="line"><span style="color:#E06C75;">  redis-data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">local</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-3-绑定挂载" tabindex="-1"><a class="header-anchor" href="#_6-3-绑定挂载"><span>6.3 绑定挂载</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 开发环境：热加载</span></span>
<span class="line"><span style="color:#E06C75;">  app-dev</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:latest</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./src:/app/src</span><span style="color:#7F848E;font-style:italic;">              # 源码目录</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./config:/app/config:ro</span><span style="color:#7F848E;font-style:italic;">     # 只读配置</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./logs:/app/logs</span><span style="color:#7F848E;font-style:italic;">            # 日志目录</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">/etc/timezone:/etc/timezone:ro</span><span style="color:#7F848E;font-style:italic;">  # 时区文件</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">/etc/localtime:/etc/localtime:ro</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 生产环境：仅挂载必要文件</span></span>
<span class="line"><span style="color:#E06C75;">  app-prod</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:latest</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./config/production.yml:/app/config.yml:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-logs:/app/logs</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">绑定挂载注意事项</p><ol><li><strong>性能</strong>：绑定挂载在 macOS/Windows 上性能较差，推荐使用 <code>:cached</code>（macOS）或 <code>:ro</code>（减少同步开销）</li><li><strong>权限</strong>：绑定挂载的文件权限与主机一致，可能导致容器内权限问题</li><li><strong>只读</strong>：配置文件建议使用 <code>:ro</code>（只读）防止容器修改主机文件</li><li><strong>SELinux</strong>：在 RHEL/CentOS 上需要加 <code>:z</code> 或 <code>:Z</code> 后缀处理 SELinux 标签</li></ol></div><h3 id="_6-4-tmpfs-挂载" tabindex="-1"><a class="header-anchor" href="#_6-4-tmpfs-挂载"><span>6.4 tmpfs 挂载</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:latest</span></span>
<span class="line"><span style="color:#E06C75;">    tmpfs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">/app/tmp</span><span style="color:#7F848E;font-style:italic;">                    # 短格式</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">tmpfs</span><span style="color:#7F848E;font-style:italic;">                 # 长格式</span></span>
<span class="line"><span style="color:#E06C75;">        target</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/app/cache</span></span>
<span class="line"><span style="color:#E06C75;">        tmpfs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          size</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">100000000</span><span style="color:#7F848E;font-style:italic;">           # 100MB 限制</span></span>
<span class="line"><span style="color:#E06C75;">          mode</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">1777</span><span style="color:#7F848E;font-style:italic;">                # 权限模式</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-5-卷挂载高级用法" tabindex="-1"><a class="header-anchor" href="#_6-5-卷挂载高级用法"><span>6.5 卷挂载高级用法</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:latest</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 命名卷 + 子路径挂载</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">data-vol:/app/data:rw</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 绑定挂载 + 只读</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./config:/app/config:ro</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 使用长格式</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">volume</span></span>
<span class="line"><span style="color:#E06C75;">        source</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">data-vol</span></span>
<span class="line"><span style="color:#E06C75;">        target</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/app/data</span></span>
<span class="line"><span style="color:#E06C75;">        volume</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          nocopy</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span><span style="color:#7F848E;font-style:italic;">              # 创建时不复制容器内容</span></span>
<span class="line"><span style="color:#E06C75;">        consistency</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">cached</span><span style="color:#7F848E;font-style:italic;">         # macOS 缓存一致性</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  data-vol</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">local</span></span>
<span class="line"><span style="color:#E06C75;">    driver_opts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">none</span></span>
<span class="line"><span style="color:#E06C75;">      o</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">bind</span></span>
<span class="line"><span style="color:#E06C75;">      device</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/data/myapp</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="七、多环境配置" tabindex="-1"><a class="header-anchor" href="#七、多环境配置"><span>七、多环境配置</span></a></h2><h3 id="_7-1-compose-override-机制" tabindex="-1"><a class="header-anchor" href="#_7-1-compose-override-机制"><span>7.1 Compose Override 机制</span></a></h3><p>Docker Compose 默认会自动合并 <code>docker-compose.yml</code> 和 <code>docker-compose.override.yml</code>。</p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># docker-compose.yml — 基础配置</span></span>
<span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:latest</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      NODE_ENV</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">development</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;3000:3000&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./src:/app/src</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># docker-compose.override.yml — 自动合并的开发覆盖</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># docker compose up 会自动合并这两个文件</span></span>
<span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 覆盖环境变量</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      NODE_ENV</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">development</span></span>
<span class="line"><span style="color:#E06C75;">      DEBUG</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;true&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 追加端口</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;9229:9229&quot;</span><span style="color:#7F848E;font-style:italic;">     # Node.js 调试端口</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 覆盖命令</span></span>
<span class="line"><span style="color:#E06C75;">    command</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;node&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;--inspect=0.0.0.0:9229&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;server.js&quot;</span><span style="color:#ABB2BF;">]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-多文件显式指定" tabindex="-1"><a class="header-anchor" href="#_7-2-多文件显式指定"><span>7.2 多文件显式指定</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 开发环境</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> docker-compose.yml</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> docker-compose.dev.yml</span><span style="color:#98C379;"> up</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 预发布环境</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> docker-compose.yml</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> docker-compose.staging.yml</span><span style="color:#98C379;"> up</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生产环境</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> docker-compose.yml</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> docker-compose.prod.yml</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-完整多环境配置示例" tabindex="-1"><a class="header-anchor" href="#_7-3-完整多环境配置示例"><span>7.3 完整多环境配置示例</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># docker-compose.yml — 基础配置</span></span>
<span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:\${APP_VERSION:-latest}</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-network</span></span>
<span class="line"><span style="color:#E06C75;">    depends_on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      db</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_healthy</span></span>
<span class="line"><span style="color:#E06C75;">      redis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_started</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;curl&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;-f&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://localhost:3000/health&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">30s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  db</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">postgres:16-alpine</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">db-data:/var/lib/postgresql/data</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_DB</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${DB_NAME}</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_USER</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${DB_USER}</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_PASSWORD</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${DB_PASSWORD}</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD-SHELL&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;pg_isready -U \${DB_USER}&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-network</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  redis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis:7-alpine</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">redis-data:/data</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;redis-cli&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;ping&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">5</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-network</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app-network</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  db-data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  redis-data</span><span style="color:#ABB2BF;">:</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># docker-compose.dev.yml — 开发环境覆盖</span></span>
<span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    build</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      context</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">.</span></span>
<span class="line"><span style="color:#E06C75;">      dockerfile</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Dockerfile.dev</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./src:/app/src</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./tests:/app/tests</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      NODE_ENV</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">development</span></span>
<span class="line"><span style="color:#E06C75;">      DEBUG</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;true&quot;</span></span>
<span class="line"><span style="color:#E06C75;">      LOG_LEVEL</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">debug</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;3000:3000&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;9229:9229&quot;</span><span style="color:#7F848E;font-style:italic;">      # 调试端口</span></span>
<span class="line"><span style="color:#E06C75;">    command</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;node&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;--inspect=0.0.0.0:9229&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;server.js&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  db</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;5432:5432&quot;</span><span style="color:#7F848E;font-style:italic;">      # 开发时暴露数据库端口</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_DB</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp_dev</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_USER</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">dev</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_PASSWORD</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">dev</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  redis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;6379:6379&quot;</span><span style="color:#7F848E;font-style:italic;">      # 开发时暴露 Redis 端口</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># docker-compose.prod.yml — 生产环境覆盖</span></span>
<span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">registry.example.com/myapp:\${APP_VERSION}</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      NODE_ENV</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">      LOG_LEVEL</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">info</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;127.0.0.1:3000:3000&quot;</span><span style="color:#7F848E;font-style:italic;">   # 仅本地可访问</span></span>
<span class="line"><span style="color:#E06C75;">    deploy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          cpus</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;2.0&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">512M</span></span>
<span class="line"><span style="color:#E06C75;">        reservations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          cpus</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;0.5&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">256M</span></span>
<span class="line"><span style="color:#E06C75;">    logging</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">json-file</span></span>
<span class="line"><span style="color:#E06C75;">      options</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        max-size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;10m&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        max-file</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;3&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    read_only</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    security_opt</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">no-new-privileges:true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  db</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">always</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_DB</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${DB_NAME}</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_USER</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${DB_USER}</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_PASSWORD</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${DB_PASSWORD}</span></span>
<span class="line"><span style="color:#E06C75;">    deploy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          cpus</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;4.0&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">2G</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  redis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">always</span></span>
<span class="line"><span style="color:#E06C75;">    deploy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          cpus</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1.0&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">256M</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="八、compose-项目与-profile" tabindex="-1"><a class="header-anchor" href="#八、compose-项目与-profile"><span>八、Compose 项目与 Profile</span></a></h2><h3 id="_8-1-项目名称-project-name" tabindex="-1"><a class="header-anchor" href="#_8-1-项目名称-project-name"><span>8.1 项目名称（Project Name）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 默认使用当前目录名作为项目名</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 可以通过以下方式指定：</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方式一：-p 参数</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> myproject</span><span style="color:#98C379;"> up</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方式二：环境变量</span></span>
<span class="line"><span style="color:#C678DD;">export</span><span style="color:#E06C75;"> COMPOSE_PROJECT_NAME</span><span style="color:#56B6C2;">=</span><span style="color:#E06C75;">myproject</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方式三：.env 文件</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># COMPOSE_PROJECT_NAME=myproject</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方式四：docker-compose.yml 顶级字段（Compose V2.22+）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># name: myproject</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># docker-compose.yml</span></span>
<span class="line"><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span><span style="color:#7F848E;font-style:italic;">            # Compose V2.22+ 支持顶级 name 字段</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:latest</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-2-profiles-—-条件启动服务" tabindex="-1"><a class="header-anchor" href="#_8-2-profiles-—-条件启动服务"><span>8.2 Profiles — 条件启动服务</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 始终启动的核心服务</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:latest</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 没有 profiles 字段，始终启动</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 仅在调试 Profile 下启动</span></span>
<span class="line"><span style="color:#E06C75;">  debug-tools</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nicolaka/netshoot</span></span>
<span class="line"><span style="color:#E06C75;">    profiles</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">debug</span></span>
<span class="line"><span style="color:#E06C75;">    command</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;sleep&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;infinity&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 仅在监控 Profile 下启动</span></span>
<span class="line"><span style="color:#E06C75;">  prometheus</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">prom/prometheus:latest</span></span>
<span class="line"><span style="color:#E06C75;">    profiles</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">monitoring</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./prometheus.yml:/etc/prometheus/prometheus.yml:ro</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  grafana</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">grafana/grafana:latest</span></span>
<span class="line"><span style="color:#E06C75;">    profiles</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">monitoring</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;3001:3000&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 多 Profile 服务</span></span>
<span class="line"><span style="color:#E06C75;">  adminer</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">adminer:latest</span></span>
<span class="line"><span style="color:#E06C75;">    profiles</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">debug</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">monitoring</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;8080:8080&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 仅启动核心服务（无 Profile 的服务）</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启动调试 Profile</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#D19A66;"> --profile</span><span style="color:#98C379;"> debug</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启动监控 Profile</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#D19A66;"> --profile</span><span style="color:#98C379;"> monitoring</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 同时启动多个 Profile</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#D19A66;"> --profile</span><span style="color:#98C379;"> debug</span><span style="color:#D19A66;"> --profile</span><span style="color:#98C379;"> monitoring</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="九、常用命令" tabindex="-1"><a class="header-anchor" href="#九、常用命令"><span>九、常用命令</span></a></h2><h3 id="_9-1-服务生命周期" tabindex="-1"><a class="header-anchor" href="#_9-1-服务生命周期"><span>9.1 服务生命周期</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 启动所有服务（前台运行）</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 后台启动</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启动并强制重建镜像</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span><span style="color:#D19A66;"> --build</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启动指定服务（自动启动依赖）</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#98C379;"> app</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 停止所有服务</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> stop</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 停止并删除容器、网络</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> down</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 停止并删除容器、网络、卷</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> down</span><span style="color:#D19A66;"> -v</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 停止并删除容器、网络、镜像</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> down</span><span style="color:#D19A66;"> --rmi</span><span style="color:#98C379;"> all</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重启服务</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> restart</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-2-服务管理" tabindex="-1"><a class="header-anchor" href="#_9-2-服务管理"><span>9.2 服务管理</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看服务状态</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> ps</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看服务日志</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> logs</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> logs</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> app</span><span style="color:#7F848E;font-style:italic;">          # 实时跟踪 app 日志</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> logs</span><span style="color:#D19A66;"> --tail=100</span><span style="color:#98C379;"> app</span><span style="color:#7F848E;font-style:italic;">  # 最后 100 行</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> logs</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> app</span><span style="color:#7F848E;font-style:italic;">          # 显示时间戳</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在服务中执行命令</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> exec</span><span style="color:#98C379;"> app</span><span style="color:#98C379;"> sh</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> exec</span><span style="color:#98C379;"> app</span><span style="color:#98C379;"> python</span><span style="color:#98C379;"> manage.py</span><span style="color:#98C379;"> migrate</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 运行一次性命令</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> run</span><span style="color:#D19A66;"> --rm</span><span style="color:#98C379;"> app</span><span style="color:#98C379;"> python</span><span style="color:#98C379;"> manage.py</span><span style="color:#98C379;"> createsuperuser</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> run</span><span style="color:#D19A66;"> --rm</span><span style="color:#98C379;"> app</span><span style="color:#98C379;"> npm</span><span style="color:#98C379;"> install</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 拉取镜像</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> pull</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 构建镜像</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> build</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> build</span><span style="color:#D19A66;"> --no-cache</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> build</span><span style="color:#D19A66;"> --parallel</span><span style="color:#7F848E;font-style:italic;">    # 并行构建</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-3-服务扩展" tabindex="-1"><a class="header-anchor" href="#_9-3-服务扩展"><span>9.3 服务扩展</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 扩展服务实例数</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span><span style="color:#D19A66;"> --scale</span><span style="color:#98C379;"> worker=</span><span style="color:#D19A66;">3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看服务进程</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> top</span><span style="color:#98C379;"> app</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-4-其他实用命令" tabindex="-1"><a class="header-anchor" href="#_9-4-其他实用命令"><span>9.4 其他实用命令</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 验证配置文件</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> config</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> config</span><span style="color:#D19A66;"> --services</span><span style="color:#7F848E;font-style:italic;">    # 列出所有服务名</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> config</span><span style="color:#D19A66;"> --volumes</span><span style="color:#7F848E;font-style:italic;">    # 列出所有卷</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看服务事件</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> events</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 暂停/恢复服务</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> pause</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> unpause</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看服务端口映射</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> port</span><span style="color:#98C379;"> app</span><span style="color:#D19A66;"> 3000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看镜像</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> images</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 复制文件</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> cp</span><span style="color:#98C379;"> app:/app/logs</span><span style="color:#98C379;"> ./logs</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="十、服务扩展与-deploy" tabindex="-1"><a class="header-anchor" href="#十、服务扩展与-deploy"><span>十、服务扩展与 Deploy</span></a></h2><h3 id="_10-1-deploy-配置" tabindex="-1"><a class="header-anchor" href="#_10-1-deploy-配置"><span>10.1 Deploy 配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:latest</span></span>
<span class="line"><span style="color:#E06C75;">    deploy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 副本数</span></span>
<span class="line"><span style="color:#E06C75;">      replicas</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 资源限制</span></span>
<span class="line"><span style="color:#E06C75;">      resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          cpus</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;2.0&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">512M</span></span>
<span class="line"><span style="color:#E06C75;">        reservations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          cpus</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;0.5&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">256M</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 重启策略</span></span>
<span class="line"><span style="color:#E06C75;">      restart_policy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">on-failure</span></span>
<span class="line"><span style="color:#E06C75;">        delay</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5s</span></span>
<span class="line"><span style="color:#E06C75;">        max_attempts</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">        window</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">120s</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 更新策略</span></span>
<span class="line"><span style="color:#E06C75;">      update_config</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        parallelism</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">1</span></span>
<span class="line"><span style="color:#E06C75;">        delay</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10s</span></span>
<span class="line"><span style="color:#E06C75;">        order</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">stop-first</span></span>
<span class="line"><span style="color:#E06C75;">        failure_action</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">rollback</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 回滚策略</span></span>
<span class="line"><span style="color:#E06C75;">      rollback_config</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        parallelism</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#E06C75;">        order</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">stop-first</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 放置约束（Swarm 模式）</span></span>
<span class="line"><span style="color:#E06C75;">      placement</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        constraints</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#98C379;">node.role == worker</span></span>
<span class="line"><span style="color:#E06C75;">        preferences</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">spread</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">node.labels.zone</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 端口配置（Swarm 模式）</span></span>
<span class="line"><span style="color:#E06C75;">      endpoint_mode</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">vip</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">Deploy 配置的限制</p><ul><li><code>deploy</code> 配置在使用 <code>docker compose up</code> 时<strong>仅 <code>resources</code> 配置生效</strong></li><li>完整的 <code>deploy</code> 功能（replicas、update_config、placement 等）仅在 <strong>Swarm 模式</strong>（<code>docker stack deploy</code>）下生效</li><li>非 Swarm 模式要扩展实例，使用 <code>docker compose up --scale</code></li></ul></div><h3 id="_10-2-非-swarm-模式下的扩展" tabindex="-1"><a class="header-anchor" href="#_10-2-非-swarm-模式下的扩展"><span>10.2 非 Swarm 模式下的扩展</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 启动 3 个 worker 实例</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span><span style="color:#D19A66;"> --scale</span><span style="color:#98C379;"> worker=</span><span style="color:#D19A66;">3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：端口映射冲突问题</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如果 worker 有端口映射（ports），多实例会冲突</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 解决方案：使用 nginx 负载均衡或只暴露内部端口</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 nginx 负载均衡多实例</span></span>
<span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:latest</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 不使用 ports，通过 nginx 代理</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-network</span></span>
<span class="line"><span style="color:#E06C75;">    deploy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      replicas</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 注意：replicas 在非 Swarm 下不生效</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 使用 --scale 替代</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  nginx</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx:alpine</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;80:80&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx.conf:/etc/nginx/nginx.conf:ro</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-network</span></span>
<span class="line"><span style="color:#E06C75;">    depends_on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="十一、完整示例-net-redis-postgresql-nginx" tabindex="-1"><a class="header-anchor" href="#十一、完整示例-net-redis-postgresql-nginx"><span>十一、完整示例：.NET + Redis + PostgreSQL + Nginx</span></a></h2><h3 id="_11-1-项目结构" tabindex="-1"><a class="header-anchor" href="#_11-1-项目结构"><span>11.1 项目结构</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>myapp/</span></span>
<span class="line"><span>├── src/</span></span>
<span class="line"><span>│   └── MyApp/</span></span>
<span class="line"><span>│       ├── MyApp.csproj</span></span>
<span class="line"><span>│       ├── Program.cs</span></span>
<span class="line"><span>│       └── appsettings.json</span></span>
<span class="line"><span>├── Dockerfile</span></span>
<span class="line"><span>├── docker-compose.yml</span></span>
<span class="line"><span>├── docker-compose.dev.yml</span></span>
<span class="line"><span>├── docker-compose.prod.yml</span></span>
<span class="line"><span>├── .env</span></span>
<span class="line"><span>├── .env.example</span></span>
<span class="line"><span>├── nginx/</span></span>
<span class="line"><span>│   └── nginx.conf</span></span>
<span class="line"><span>├── postgres/</span></span>
<span class="line"><span>│   └── init.sql</span></span>
<span class="line"><span>└── redis/</span></span>
<span class="line"><span>    └── redis.conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-2-dockerfile" tabindex="-1"><a class="header-anchor" href="#_11-2-dockerfile"><span>11.2 Dockerfile</span></a></h3><div class="language-dockerfile line-numbers-mode" data-highlighter="shiki" data-ext="dockerfile" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-dockerfile"><span class="line"><span style="color:#7F848E;font-style:italic;"># syntax=docker/dockerfile:1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 构建 =====</span></span>
<span class="line"><span style="color:#61AFEF;">FROM</span><span style="color:#ABB2BF;"> mcr.microsoft.com/dotnet/sdk:8.0 </span><span style="color:#61AFEF;">AS</span><span style="color:#ABB2BF;"> builder</span></span>
<span class="line"><span style="color:#61AFEF;">WORKDIR</span><span style="color:#ABB2BF;"> /src</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> src/MyApp/MyApp.csproj .</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> dotnet restore</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> src/MyApp/ .</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> dotnet publish -c Release -o /app/publish --no-restore</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 运行 =====</span></span>
<span class="line"><span style="color:#61AFEF;">FROM</span><span style="color:#ABB2BF;"> mcr.microsoft.com/dotnet/aspnet:8.0-alpine</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> addgroup -S appgroup &amp;&amp; adduser -S appuser -G appgroup</span></span>
<span class="line"><span style="color:#61AFEF;">WORKDIR</span><span style="color:#ABB2BF;"> /app</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> --from=builder /app/publish .</span></span>
<span class="line"><span style="color:#61AFEF;">ENV</span><span style="color:#ABB2BF;"> ASPNETCORE_URLS=http://+:8080 \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    ASPNETCORE_ENVIRONMENT=Production</span></span>
<span class="line"><span style="color:#61AFEF;">USER</span><span style="color:#ABB2BF;"> appuser</span></span>
<span class="line"><span style="color:#61AFEF;">EXPOSE</span><span style="color:#ABB2BF;"> 8080</span></span>
<span class="line"><span style="color:#61AFEF;">HEALTHCHECK</span><span style="color:#ABB2BF;"> --interval=15s --timeout=3s --retries=3 \\</span></span>
<span class="line"><span style="color:#61AFEF;">    CMD</span><span style="color:#ABB2BF;"> wget --spider http://localhost:8080/health || exit 1</span></span>
<span class="line"><span style="color:#61AFEF;">ENTRYPOINT</span><span style="color:#ABB2BF;"> [</span><span style="color:#98C379;">&quot;./MyApp&quot;</span><span style="color:#ABB2BF;">]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-3-基础-docker-compose-yml" tabindex="-1"><a class="header-anchor" href="#_11-3-基础-docker-compose-yml"><span>11.3 基础 docker-compose.yml</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ===== 应用服务 =====</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    build</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      context</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">.</span></span>
<span class="line"><span style="color:#E06C75;">      dockerfile</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Dockerfile</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      ASPNETCORE_ENVIRONMENT</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${APP_ENV}</span></span>
<span class="line"><span style="color:#E06C75;">      ConnectionStrings__Default</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;Host=db;Port=\${DB_PORT};Database=\${DB_NAME};Username=\${DB_USER};Password=\${DB_PASSWORD}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">      ConnectionStrings__Redis</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;redis:\${REDIS_PORT}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">      Redis__InstanceName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;myapp:&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    depends_on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      db</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_healthy</span></span>
<span class="line"><span style="color:#E06C75;">      redis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_healthy</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">backend</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;wget&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;--spider&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://localhost:8080/health&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">15s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">      start_period</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10s</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ===== 数据库 =====</span></span>
<span class="line"><span style="color:#E06C75;">  db</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">postgres:16-alpine</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_DB</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${DB_NAME}</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_USER</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${DB_USER}</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_PASSWORD</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${DB_PASSWORD}</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">db-data:/var/lib/postgresql/data</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./postgres/init.sql:/docker-entrypoint-initdb.d/init.sql:ro</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">backend</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD-SHELL&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;pg_isready -U \${DB_USER} -d \${DB_NAME}&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ===== 缓存 =====</span></span>
<span class="line"><span style="color:#E06C75;">  redis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis:7-alpine</span></span>
<span class="line"><span style="color:#E06C75;">    command</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis-server /usr/local/etc/redis/redis.conf</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">redis-data:/data</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./redis/redis.conf:/usr/local/etc/redis/redis.conf:ro</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">backend</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;redis-cli&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;ping&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">5</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ===== 反向代理 =====</span></span>
<span class="line"><span style="color:#E06C75;">  nginx</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx:alpine</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx/nginx.conf:/etc/nginx/nginx.conf:ro</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">frontend</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">backend</span></span>
<span class="line"><span style="color:#E06C75;">    depends_on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_healthy</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;wget&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;--spider&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://localhost:80/health&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">15s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  frontend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">bridge</span></span>
<span class="line"><span style="color:#E06C75;">  backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">bridge</span></span>
<span class="line"><span style="color:#E06C75;">    internal</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  db-data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">local</span></span>
<span class="line"><span style="color:#E06C75;">  redis-data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">local</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-4-开发环境覆盖" tabindex="-1"><a class="header-anchor" href="#_11-4-开发环境覆盖"><span>11.4 开发环境覆盖</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># docker-compose.dev.yml</span></span>
<span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    build</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      context</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">.</span></span>
<span class="line"><span style="color:#E06C75;">      dockerfile</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Dockerfile</span></span>
<span class="line"><span style="color:#E06C75;">      target</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">builder</span><span style="color:#7F848E;font-style:italic;">      # 使用构建阶段</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./src/MyApp:/app</span><span style="color:#7F848E;font-style:italic;">   # 热加载</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      ASPNETCORE_ENVIRONMENT</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Development</span></span>
<span class="line"><span style="color:#E06C75;">      Logging__LogLevel__Default</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Debug</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;8080:8080&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;5000:5000&quot;</span><span style="color:#7F848E;font-style:italic;">        # 调试端口</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  db</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;5432:5432&quot;</span><span style="color:#7F848E;font-style:italic;">        # 暴露数据库端口</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_DB</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp_dev</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_USER</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">dev</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_PASSWORD</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">dev</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  redis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;6379:6379&quot;</span><span style="color:#7F848E;font-style:italic;">        # 暴露 Redis 端口</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  nginx</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;80:80&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 开发工具</span></span>
<span class="line"><span style="color:#E06C75;">  adminer</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">adminer:latest</span></span>
<span class="line"><span style="color:#E06C75;">    profiles</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">debug</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;8888:8080&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">backend</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-5-生产环境覆盖" tabindex="-1"><a class="header-anchor" href="#_11-5-生产环境覆盖"><span>11.5 生产环境覆盖</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># docker-compose.prod.yml</span></span>
<span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">registry.example.com/myapp:\${APP_VERSION}</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"><span style="color:#E06C75;">    deploy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          cpus</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;2.0&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">512M</span></span>
<span class="line"><span style="color:#E06C75;">    logging</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">json-file</span></span>
<span class="line"><span style="color:#E06C75;">      options</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        max-size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;10m&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        max-file</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;5&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    read_only</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    security_opt</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">no-new-privileges:true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  db</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">always</span></span>
<span class="line"><span style="color:#E06C75;">    deploy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          cpus</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;4.0&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">2G</span></span>
<span class="line"><span style="color:#E06C75;">    logging</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">json-file</span></span>
<span class="line"><span style="color:#E06C75;">      options</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        max-size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;50m&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        max-file</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;10&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  redis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">always</span></span>
<span class="line"><span style="color:#E06C75;">    deploy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          cpus</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1.0&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">256M</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  nginx</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;80:80&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;443:443&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx/nginx.prod.conf:/etc/nginx/nginx.conf:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx/ssl:/etc/nginx/ssl:ro</span></span>
<span class="line"><span style="color:#E06C75;">    deploy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          cpus</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1.0&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">128M</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-6-nginx-配置" tabindex="-1"><a class="header-anchor" href="#_11-6-nginx-配置"><span>11.6 Nginx 配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># nginx/nginx.conf</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"><span style="color:#C678DD;">error_log </span><span style="color:#ABB2BF;">/var/log/nginx/error.log </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">1024</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> app {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> app:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">_;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /health {</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://app/health;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://app;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Proto $</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-7-环境变量文件" tabindex="-1"><a class="header-anchor" href="#_11-7-环境变量文件"><span>11.7 环境变量文件</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># .env.example</span></span>
<span class="line"><span style="color:#E06C75;">APP_VERSION</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">1.0.0</span></span>
<span class="line"><span style="color:#E06C75;">APP_ENV</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">Development</span></span>
<span class="line"><span style="color:#E06C75;">DB_NAME</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">DB_USER</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">postgres</span></span>
<span class="line"><span style="color:#E06C75;">DB_PASSWORD</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">changeme</span></span>
<span class="line"><span style="color:#E06C75;">DB_PORT</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">5432</span></span>
<span class="line"><span style="color:#E06C75;">REDIS_PORT</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">6379</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-8-启动命令" tabindex="-1"><a class="header-anchor" href="#_11-8-启动命令"><span>11.8 启动命令</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 开发环境</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> docker-compose.yml</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> docker-compose.dev.yml</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 开发环境 + 调试工具</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> docker-compose.yml</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> docker-compose.dev.yml</span><span style="color:#D19A66;"> --profile</span><span style="color:#98C379;"> debug</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生产环境</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> docker-compose.yml</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> docker-compose.prod.yml</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看日志</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> logs</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> app</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 运行数据库迁移</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> exec</span><span style="color:#98C379;"> app</span><span style="color:#98C379;"> dotnet</span><span style="color:#98C379;"> ef</span><span style="color:#98C379;"> database</span><span style="color:#98C379;"> update</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 停止并清理</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> docker-compose.yml</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> docker-compose.prod.yml</span><span style="color:#98C379;"> down</span><span style="color:#D19A66;"> -v</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="十二、compose-与-ci-cd" tabindex="-1"><a class="header-anchor" href="#十二、compose-与-ci-cd"><span>十二、Compose 与 CI/CD</span></a></h2><h3 id="_12-1-github-actions-集成" tabindex="-1"><a class="header-anchor" href="#_12-1-github-actions-集成"><span>12.1 GitHub Actions 集成</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">CI/CD</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  push</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    branches</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">main</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">jobs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  test</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    runs-on</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ubuntu-latest</span></span>
<span class="line"><span style="color:#E06C75;">    steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">actions/checkout@v4</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Start services</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker compose -f docker-compose.yml -f docker-compose.test.yml up -d</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Wait for services</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          timeout 60 bash -c &#39;until docker compose exec -T app curl -f http://localhost:8080/health; do sleep 2; done&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Run integration tests</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker compose exec -T app npm test</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Collect logs</span></span>
<span class="line"><span style="color:#E06C75;">        if</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">failure()</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker compose logs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Tear down</span></span>
<span class="line"><span style="color:#E06C75;">        if</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">always()</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker compose down -v</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_12-2-gitlab-ci-集成" tabindex="-1"><a class="header-anchor" href="#_12-2-gitlab-ci-集成"><span>12.2 GitLab CI 集成</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">stages</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">test</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">build</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">deploy</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">integration-test</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  stage</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">test</span></span>
<span class="line"><span style="color:#E06C75;">  services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">docker:dind</span></span>
<span class="line"><span style="color:#E06C75;">  script</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">docker compose -f docker-compose.yml -f docker-compose.test.yml up -d</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">sleep 30</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">docker compose exec -T app pytest tests/integration/</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">docker compose down -v</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">build-and-push</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  stage</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">build</span></span>
<span class="line"><span style="color:#E06C75;">  script</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">docker compose build app</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">docker tag myapp:latest $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA</span></span>
<span class="line"><span style="color:#E06C75;">  only</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">main</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="十三、compose-watch-v2-22" tabindex="-1"><a class="header-anchor" href="#十三、compose-watch-v2-22"><span>十三、Compose Watch（V2.22+）</span></a></h2><h3 id="_13-1-开发时自动同步" tabindex="-1"><a class="header-anchor" href="#_13-1-开发时自动同步"><span>13.1 开发时自动同步</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    build</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      context</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">.</span></span>
<span class="line"><span style="color:#E06C75;">      dockerfile</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Dockerfile</span></span>
<span class="line"><span style="color:#E06C75;">    develop</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      watch</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 源码变化时同步到容器</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">action</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">sync</span></span>
<span class="line"><span style="color:#E06C75;">          path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">./src</span></span>
<span class="line"><span style="color:#E06C75;">          target</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/app/src</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 配置变化时重建镜像</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">action</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">rebuild</span></span>
<span class="line"><span style="color:#E06C75;">          path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">./package.json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # Dockerfile 变化时重建并重启</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">action</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">rebuild</span></span>
<span class="line"><span style="color:#E06C75;">          path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">./Dockerfile</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 启动 watch 模式</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> watch</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="十四、compose-常见问题与排障" tabindex="-1"><a class="header-anchor" href="#十四、compose-常见问题与排障"><span>十四、Compose 常见问题与排障</span></a></h2><h3 id="_14-1-常见问题" tabindex="-1"><a class="header-anchor" href="#_14-1-常见问题"><span>14.1 常见问题</span></a></h3><table><thead><tr><th>问题</th><th>原因</th><th>解决方案</th></tr></thead><tbody><tr><td>服务间无法通信</td><td>不在同一网络</td><td>确保服务在相同网络中</td></tr><tr><td>DNS 解析失败</td><td>服务名拼写错误</td><td>使用服务名作为主机名</td></tr><tr><td>端口冲突</td><td>多服务映射同一端口</td><td>使用不同端口或只暴露内部端口</td></tr><tr><td>卷数据丢失</td><td>使用匿名卷</td><td>使用命名卷持久化</td></tr><tr><td>环境变量未生效</td><td>优先级问题</td><td>检查 <code>.env</code> 和 <code>environment</code> 的优先级</td></tr><tr><td>构建缓存失效</td><td>构建上下文过大</td><td>使用 <code>.dockerignore</code></td></tr><tr><td>健康检查超时</td><td>启动时间不够</td><td>增大 <code>start_period</code></td></tr></tbody></table><h3 id="_14-2-排障命令" tabindex="-1"><a class="header-anchor" href="#_14-2-排障命令"><span>14.2 排障命令</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看服务日志</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> logs</span><span style="color:#D19A66;"> -f</span><span style="color:#D19A66;"> --tail=100</span><span style="color:#98C379;"> app</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 进入容器调试</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> exec</span><span style="color:#98C379;"> app</span><span style="color:#98C379;"> sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看网络详情</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> network</span><span style="color:#98C379;"> inspect</span><span style="color:#98C379;"> myapp_default</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看卷详情</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> volume</span><span style="color:#98C379;"> inspect</span><span style="color:#98C379;"> myapp_db-data</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看容器进程</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> top</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证配置</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> config</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看资源使用</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> stats</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_14-3-清理资源" tabindex="-1"><a class="header-anchor" href="#_14-3-清理资源"><span>14.3 清理资源</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 停止并删除所有容器、网络</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> down</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 同时删除卷</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> down</span><span style="color:#D19A66;"> -v</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 同时删除镜像</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> down</span><span style="color:#D19A66;"> --rmi</span><span style="color:#98C379;"> all</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 删除所有停止的容器</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> container</span><span style="color:#98C379;"> prune</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 删除所有未使用的卷</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> volume</span><span style="color:#98C379;"> prune</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 删除所有未使用的网络</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> network</span><span style="color:#98C379;"> prune</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 一键清理所有未使用资源</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> system</span><span style="color:#98C379;"> prune</span><span style="color:#D19A66;"> -a</span><span style="color:#D19A66;"> --volumes</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="十五、compose-与-kubernetes-的关系" tabindex="-1"><a class="header-anchor" href="#十五、compose-与-kubernetes-的关系"><span>十五、Compose 与 Kubernetes 的关系</span></a></h2><h3 id="_15-1-从-compose-到-kubernetes" tabindex="-1"><a class="header-anchor" href="#_15-1-从-compose-到-kubernetes"><span>15.1 从 Compose 到 Kubernetes</span></a></h3>`,91),i(d,{code:`eJxLy8kvT85ILCpRCHHhUgACx+iU/OTs1CLd5PzcgvziVL3K3JxYBV1dOwWn6uez1z1b0P68b/3TRc21YNVOIJmap71Tn83Z9XRPw9P+iTUKztHPZ2951rf0yd79z6esUHABG6fgDDEuFknb8ynzn+xa/rJ5xfO9m2oUXKpfLG95tmLhyzkNzzY2QYx3gRi/oR8iVaPgGg01Lrg8sShXQRvVWKjyJcthyt2ivUuTUovyUktSi2O5wGrcwH5xj4a6zhuiX+HF3jXPehdBjHEHK/GIdkktyMmvzE3NK0EW94wOTi0qy0yG2gkR9IoOCHNGFvCOds7PS8tM900sUNBXCE5NLkoFmgIAZoOOWQ==`}),o[5]||=n(`<h3 id="_15-2-kompose-转换工具" tabindex="-1"><a class="header-anchor" href="#_15-2-kompose-转换工具"><span>15.2 Kompose 转换工具</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 Kompose</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># macOS</span></span>
<span class="line"><span style="color:#61AFEF;">brew</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> kompose</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Linux</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -L</span><span style="color:#98C379;"> https://github.com/kubernetes/kompose/releases/download/v1.34.0/kompose-linux-amd64</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> kompose</span></span>
<span class="line"><span style="color:#61AFEF;">chmod</span><span style="color:#98C379;"> +x</span><span style="color:#98C379;"> kompose</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 转换 Compose 文件到 Kubernetes 资源</span></span>
<span class="line"><span style="color:#61AFEF;">kompose</span><span style="color:#98C379;"> convert</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> docker-compose.yml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 直接部署到 Kubernetes</span></span>
<span class="line"><span style="color:#61AFEF;">kompose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> docker-compose.yml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 从 Kubernetes 删除部署</span></span>
<span class="line"><span style="color:#61AFEF;">kompose</span><span style="color:#98C379;"> down</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> docker-compose.yml</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">Compose 与 Kubernetes 的选择</p><ul><li><strong>开发环境</strong>：使用 Docker Compose，简单高效</li><li><strong>小型生产</strong>：可以使用 Docker Compose 或 Swarm</li><li><strong>大型生产</strong>：使用 Kubernetes，获得更好的扩展性和运维能力</li><li>Kompose 是一个过渡工具，但生成的 K8s 资源可能需要手动调整</li></ul></div><div class="hint-container tip"><p class="hint-container-title">本章要点回顾</p><ol><li><strong>完整语法</strong>：掌握 services、networks、volumes、configs、secrets 的完整配置</li><li><strong>服务依赖</strong>：使用 <code>depends_on</code> + <code>healthcheck</code> 确保启动顺序正确</li><li><strong>网络配置</strong>：合理划分前端/后端网络，使用 <code>internal</code> 保护内部服务</li><li><strong>环境变量</strong>：理解优先级，使用 <code>.env</code> + <code>env_file</code> + <code>environment</code> 组合管理</li><li><strong>多环境配置</strong>：使用多文件覆盖实现开发/测试/生产环境分离</li><li><strong>Profile</strong>：使用 Profile 按需启动调试/监控等非核心服务</li><li><strong>完整实战</strong>：.NET + Redis + PostgreSQL + Nginx 的完整 Compose 编排</li><li><strong>CI/CD 集成</strong>：在流水线中使用 Compose 进行集成测试</li></ol></div><h2 id="参考资源" tabindex="-1"><a class="header-anchor" href="#参考资源"><span>参考资源</span></a></h2><ul><li><a href="https://docs.docker.com/compose/" target="_blank" rel="noopener noreferrer">Docker Compose Documentation</a></li><li><a href="https://docs.docker.com/compose/compose-file/" target="_blank" rel="noopener noreferrer">Compose file reference</a></li><li><a href="https://docs.docker.com/compose/migrate/" target="_blank" rel="noopener noreferrer">Docker Compose V2</a></li><li><a href="https://kompose.io/" target="_blank" rel="noopener noreferrer">Kompose — Kubernetes Compose</a></li><li><a href="https://docs.docker.com/compose/file-watch/" target="_blank" rel="noopener noreferrer">Docker Compose Watch</a></li><li><a href="https://docs.docker.com/compose/profiles/" target="_blank" rel="noopener noreferrer">Docker Compose Profiles</a></li></ul>`,6)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};