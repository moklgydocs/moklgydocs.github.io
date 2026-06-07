import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as r}from"./app-C6qeRBA8.js";var i=JSON.parse(`{"path":"/%E8%BF%90%E7%BB%B4%E4%B8%8E%E9%83%A8%E7%BD%B2/Docker-Compose/02.dotNET%E4%B8%89%E4%BB%B6%E5%A5%97%E7%BC%96%E6%8E%92.html","title":".NET + 数据库 + Redis 编排","lang":"zh-CN","frontmatter":{"title":".NET + 数据库 + Redis 编排","date":"2025-04-14T00:00:00.000Z","category":["Docker-Compose"],"tag":["Docker-Compose",".NET","PostgreSQL","Redis"],"order":2},"git":{"createdTime":1776135420000,"updatedTime":1776135420000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":2.7,"words":810},"filePathRelative":"运维与部署/Docker-Compose/02.dotNET三件套编排.md"}`),a={name:`02.dotNET三件套编排.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="net-数据库-redis-编排" tabindex="-1"><a class="header-anchor" href="#net-数据库-redis-编排"><span>.NET + 数据库 + Redis 编排</span></a></h1><p>最典型的三件套：.NET Web API + PostgreSQL + Redis。一个 compose 文件搞定开发/测试/生产环境。</p><hr><h2 id="完整的-docker-compose-yml" tabindex="-1"><a class="header-anchor" href="#完整的-docker-compose-yml"><span>完整的 docker-compose.yml</span></a></h2><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ========== .NET API ==========</span></span>
<span class="line"><span style="color:#E06C75;">  erp-api</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">registry.company.com/erp-api:\${APP_VERSION:-latest}</span></span>
<span class="line"><span style="color:#E06C75;">    container_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">erp-api</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;5000:5000&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">ASPNETCORE_ENVIRONMENT=Production</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">ASPNETCORE_URLS=http://+:5000</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">ConnectionStrings__Default=Host=postgres;Port=5432;Database=erp;Username=postgres;Password=\${DB_PASSWORD}</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">Redis__Connection=redis:6379,password=\${REDIS_PASSWORD}</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./config/appsettings.Production.json:/app/appsettings.Production.json:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">erp-logs:/app/logs</span></span>
<span class="line"><span style="color:#E06C75;">    depends_on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      postgres</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_healthy</span></span>
<span class="line"><span style="color:#E06C75;">      redis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_healthy</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-net</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;curl&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;-f&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://localhost:5000/health&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">30s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">      start_period</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">15s</span></span>
<span class="line"><span style="color:#E06C75;">    logging</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">json-file</span></span>
<span class="line"><span style="color:#E06C75;">      options</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        max-size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;50m&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        max-file</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;3&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ========== PostgreSQL ==========</span></span>
<span class="line"><span style="color:#E06C75;">  postgres</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">postgres:16</span></span>
<span class="line"><span style="color:#E06C75;">    container_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">postgres</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;5432:5432&quot;</span><span style="color:#7F848E;font-style:italic;">    # 开发时开放，生产可以去掉</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_USER</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">postgres</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_PASSWORD</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${DB_PASSWORD}</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_DB</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">erp</span></span>
<span class="line"><span style="color:#E06C75;">      TZ</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Asia/Shanghai</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">pgdata:/var/lib/postgresql/data</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./init-sql:/docker-entrypoint-initdb.d</span><span style="color:#7F848E;font-style:italic;">    # 首次启动执行的初始化SQL</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-net</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD-SHELL&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;pg_isready -U postgres&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#E06C75;">    logging</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">json-file</span></span>
<span class="line"><span style="color:#E06C75;">      options</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        max-size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;50m&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        max-file</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;3&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ========== Redis ==========</span></span>
<span class="line"><span style="color:#E06C75;">  redis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis:7-alpine</span></span>
<span class="line"><span style="color:#E06C75;">    container_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;6379:6379&quot;</span><span style="color:#7F848E;font-style:italic;">    # 开发时开放，生产可以去掉</span></span>
<span class="line"><span style="color:#E06C75;">    command</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis-server --requirepass \${REDIS_PASSWORD} --maxmemory 256mb --maxmemory-policy allkeys-lru</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">redis-data:/data</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-net</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;redis-cli&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;-a&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;\${REDIS_PASSWORD}&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;ping&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#E06C75;">    logging</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">json-file</span></span>
<span class="line"><span style="color:#E06C75;">      options</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        max-size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;20m&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        max-file</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;3&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  pgdata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  redis-data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  erp-logs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app-net</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">bridge</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="env-文件" tabindex="-1"><a class="header-anchor" href="#env-文件"><span>.env 文件</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># .env（和 docker-compose.yml 同目录）</span></span>
<span class="line"><span style="color:#E06C75;">APP_VERSION</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">v1.2.3</span></span>
<span class="line"><span style="color:#E06C75;">DB_PASSWORD</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">MySecretPassword123</span></span>
<span class="line"><span style="color:#E06C75;">REDIS_PASSWORD</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">RedisPass456</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container caution"><p class="hint-container-title">警告</p><p><code>.env</code> 文件包含密码，<strong>不要提交到 Git</strong>。在 <code>.gitignore</code> 里加上 <code>.env</code>。服务器上手动创建。</p></div><hr><h2 id="目录结构" tabindex="-1"><a class="header-anchor" href="#目录结构"><span>目录结构</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>/opt/apps/erp/</span></span>
<span class="line"><span>├── docker-compose.yml</span></span>
<span class="line"><span>├── .env                          # 密码（不进Git）</span></span>
<span class="line"><span>├── .env.example                  # 密码模板（进Git）</span></span>
<span class="line"><span>├── config/</span></span>
<span class="line"><span>│   └── appsettings.Production.json</span></span>
<span class="line"><span>└── init-sql/</span></span>
<span class="line"><span>    └── 01-init.sql               # 数据库初始化脚本</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>.env.example</code>：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># .env.example - 复制为 .env 后填入实际值</span></span>
<span class="line"><span style="color:#E06C75;">APP_VERSION</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">latest</span></span>
<span class="line"><span style="color:#E06C75;">DB_PASSWORD</span><span style="color:#56B6C2;">=</span></span>
<span class="line"><span style="color:#E06C75;">REDIS_PASSWORD</span><span style="color:#56B6C2;">=</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="操作命令" tabindex="-1"><a class="header-anchor" href="#操作命令"><span>操作命令</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 进入项目目录</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> /opt/apps/erp</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启动所有服务（后台）</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看状态</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> ps</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看日志</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> logs</span><span style="color:#D19A66;"> -f</span><span style="color:#7F848E;font-style:italic;">              # 所有服务</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> logs</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> erp-api</span><span style="color:#7F848E;font-style:italic;">      # 只看 API</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> logs</span><span style="color:#D19A66;"> --tail</span><span style="color:#D19A66;"> 50</span><span style="color:#98C379;"> postgres</span><span style="color:#7F848E;font-style:italic;">  # 最近50行</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重启单个服务</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> restart</span><span style="color:#98C379;"> erp-api</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 停止所有服务</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> down</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 停止并删除数据卷（⚠️ 数据库数据会丢失！）</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> down</span><span style="color:#D19A66;"> -v</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重新构建并启动（代码更新后）</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span><span style="color:#D19A66;"> --build</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 拉取最新镜像并重启</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> pull</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 只启动某个服务</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;"> postgres</span><span style="color:#98C379;"> redis</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="加上-nginx-反向代理" tabindex="-1"><a class="header-anchor" href="#加上-nginx-反向代理"><span>加上 Nginx 反向代理</span></a></h2><p>四件套的典型架构：</p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # Nginx 反向代理</span></span>
<span class="line"><span style="color:#E06C75;">  nginx</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx:alpine</span></span>
<span class="line"><span style="color:#E06C75;">    container_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;80:80&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;443:443&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx/nginx.conf:/etc/nginx/nginx.conf:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx/conf.d:/etc/nginx/conf.d:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx/ssl:/etc/nginx/ssl:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">nginx-logs:/var/log/nginx</span></span>
<span class="line"><span style="color:#E06C75;">    depends_on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">erp-api</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-net</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  erp-api</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ... 同上，但去掉 ports（不直接对外暴露）</span></span>
<span class="line"><span style="color:#E06C75;">    expose</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;5000&quot;</span><span style="color:#7F848E;font-style:italic;">    # 只在 Docker 网络内可见</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ports 不要了</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Nginx 配置 <code>nginx/conf.d/erp.conf</code>：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">erp.company.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://erp-api:5000;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Proto $</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="多个-net-应用" tabindex="-1"><a class="header-anchor" href="#多个-net-应用"><span>多个 .NET 应用</span></a></h2><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  erp-api</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">erp-api:v1.0</span></span>
<span class="line"><span style="color:#E06C75;">    expose</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;5000&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">ASPNETCORE_URLS=http://+:5000</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  sso-server</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">sso-server:v1.0</span></span>
<span class="line"><span style="color:#E06C75;">    expose</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;5010&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">ASPNETCORE_URLS=http://+:5010</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  auth-center</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">auth-center:v1.0</span></span>
<span class="line"><span style="color:#E06C75;">    expose</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;5020&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">ASPNETCORE_URLS=http://+:5020</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  nginx</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 统一入口，按域名/路径分发到不同应用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ...</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="部署更新流程" tabindex="-1"><a class="header-anchor" href="#部署更新流程"><span>部署更新流程</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 更新 .env 里的版本号</span></span>
<span class="line"><span style="color:#61AFEF;">vim</span><span style="color:#98C379;"> .env</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># APP_VERSION=v1.2.4</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 拉取新镜像</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> pull</span><span style="color:#98C379;"> erp-api</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 重启 API（数据库和Redis不受影响）</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;"> erp-api</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 检查</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> ps</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> logs</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> erp-api</span><span style="color:#D19A66;"> --tail</span><span style="color:#D19A66;"> 20</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#98C379;"> http://localhost:5000/health</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,29)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};