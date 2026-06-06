import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as r}from"./app-BAWMMEAF.js";var i=JSON.parse(`{"path":"/%E8%BF%90%E7%BB%B4%E4%B8%8E%E9%83%A8%E7%BD%B2/Docker-Compose/05.%E7%94%9F%E4%BA%A7%E7%8E%AF%E5%A2%83%E5%AE%9E%E8%B7%B5.html","title":"生产环境实践","lang":"zh-CN","frontmatter":{"title":"生产环境实践","date":"2025-04-14T00:00:00.000Z","category":["Docker-Compose"],"tag":["Docker-Compose","生产环境","部署","运维"],"order":5},"git":{"createdTime":1776135420000,"updatedTime":1776135420000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":3.43,"words":1029},"filePathRelative":"运维与部署/Docker-Compose/05.生产环境实践.md"}`),a={name:`05.生产环境实践.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="生产环境实践" tabindex="-1"><a class="header-anchor" href="#生产环境实践"><span>生产环境实践</span></a></h1><p>开发环境能跑不算数，生产环境稳定跑才行。这篇整理生产环境用 Compose 部署要注意的所有事。</p><hr><h2 id="生产级-docker-compose-yml-模板" tabindex="-1"><a class="header-anchor" href="#生产级-docker-compose-yml-模板"><span>生产级 docker-compose.yml 模板</span></a></h2><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  erp-api</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">registry.company.com/erp-api:\${APP_VERSION}</span></span>
<span class="line"><span style="color:#E06C75;">    container_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">erp-api</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"><span style="color:#E06C75;">    expose</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;5000&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">ASPNETCORE_ENVIRONMENT=Production</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">ASPNETCORE_URLS=http://+:5000</span></span>
<span class="line"><span style="color:#E06C75;">    env_file</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">.env.erp-api</span></span>
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
<span class="line"><span style="color:#E06C75;">    deploy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          cpus</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;1.5&#39;</span></span>
<span class="line"><span style="color:#E06C75;">          memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">512M</span></span>
<span class="line"><span style="color:#E06C75;">    logging</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">json-file</span></span>
<span class="line"><span style="color:#E06C75;">      options</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        max-size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;50m&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        max-file</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;3&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  postgres</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">postgres:16</span></span>
<span class="line"><span style="color:#E06C75;">    container_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">postgres</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 生产不对外暴露端口</span></span>
<span class="line"><span style="color:#E06C75;">    expose</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;5432&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_USER</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">postgres</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_PASSWORD</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${DB_PASSWORD}</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_DB</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">erp</span></span>
<span class="line"><span style="color:#E06C75;">      TZ</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Asia/Shanghai</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">pgdata:/var/lib/postgresql/data</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-net</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD-SHELL&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;pg_isready -U postgres&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#E06C75;">    deploy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          cpus</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;2&#39;</span></span>
<span class="line"><span style="color:#E06C75;">          memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">1G</span></span>
<span class="line"><span style="color:#E06C75;">    logging</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">json-file</span></span>
<span class="line"><span style="color:#E06C75;">      options</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        max-size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;50m&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        max-file</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;3&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  redis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis:7-alpine</span></span>
<span class="line"><span style="color:#E06C75;">    container_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"><span style="color:#E06C75;">    expose</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;6379&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    command</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis-server --requirepass \${REDIS_PASSWORD} --maxmemory 256mb --maxmemory-policy allkeys-lru --appendonly yes</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">redis-data:/data</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-net</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;redis-cli&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;-a&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;\${REDIS_PASSWORD}&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;ping&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#E06C75;">    deploy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">512M</span></span>
<span class="line"><span style="color:#E06C75;">    logging</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">json-file</span></span>
<span class="line"><span style="color:#E06C75;">      options</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        max-size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;20m&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        max-file</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;3&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  nginx</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx:alpine</span></span>
<span class="line"><span style="color:#E06C75;">    container_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;80:80&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;443:443&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx/conf.d:/etc/nginx/conf.d:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx/ssl:/etc/nginx/ssl:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">nginx-logs:/var/log/nginx</span></span>
<span class="line"><span style="color:#E06C75;">    depends_on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      erp-api</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_healthy</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-net</span></span>
<span class="line"><span style="color:#E06C75;">    logging</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">json-file</span></span>
<span class="line"><span style="color:#E06C75;">      options</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        max-size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;50m&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        max-file</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;3&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  pgdata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  redis-data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  erp-logs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  nginx-logs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app-net</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">bridge</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="部署脚本" tabindex="-1"><a class="header-anchor" href="#部署脚本"><span>部署脚本</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># deploy.sh - 生产环境部署脚本</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -e</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">COMPOSE_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/opt/apps/erp&quot;</span></span>
<span class="line"><span style="color:#E06C75;">NEW_VERSION</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#56B6C2;">-z</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$NEW_VERSION</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;用法: ./deploy.sh v1.2.3&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#E06C75;"> $COMPOSE_DIR</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 更新版本号: \${</span><span style="color:#E06C75;">NEW_VERSION</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &quot;s/^APP_VERSION=.*/APP_VERSION=\${</span><span style="color:#E06C75;">NEW_VERSION</span><span style="color:#98C379;">}/&quot;</span><span style="color:#98C379;"> .env</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 拉取新镜像&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> pull</span><span style="color:#98C379;"> erp-api</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 重启 API（其他服务不受影响）&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;"> erp-api</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 等待健康检查...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">sleep</span><span style="color:#D19A66;"> 10</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查健康状态</span></span>
<span class="line"><span style="color:#E06C75;">STATUS</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> inspect</span><span style="color:#98C379;"> erp-api</span><span style="color:#D19A66;"> --format</span><span style="color:#98C379;"> &#39;{{.State.Health.Status}}&#39;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;unknown&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$STATUS</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;healthy&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✅ 部署成功！版本: \${</span><span style="color:#E06C75;">NEW_VERSION</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;❌ 健康检查未通过 (状态: \${</span><span style="color:#E06C75;">STATUS</span><span style="color:#98C379;">})&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 查看日志排查&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> logs</span><span style="color:#D19A66;"> --tail</span><span style="color:#D19A66;"> 30</span><span style="color:#98C379;"> erp-api</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="备份脚本" tabindex="-1"><a class="header-anchor" href="#备份脚本"><span>备份脚本</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># backup.sh - 数据备份</span></span>
<span class="line"><span style="color:#E06C75;">BACKUP_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/opt/backup&quot;</span></span>
<span class="line"><span style="color:#E06C75;">DATE</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d_%H%M%S</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#E06C75;"> $BACKUP_DIR</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 备份 PostgreSQL</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 备份数据库&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> exec</span><span style="color:#98C379;"> postgres</span><span style="color:#98C379;"> pg_dumpall</span><span style="color:#D19A66;"> -U</span><span style="color:#98C379;"> postgres</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">gzip</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$BACKUP_DIR</span><span style="color:#98C379;">/pg_\${</span><span style="color:#E06C75;">DATE</span><span style="color:#98C379;">}.sql.gz&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 备份 Redis</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 备份 Redis&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> exec</span><span style="color:#98C379;"> redis</span><span style="color:#98C379;"> redis-cli</span><span style="color:#D19A66;"> -a</span><span style="color:#ABB2BF;"> \${</span><span style="color:#E06C75;">REDIS_PASSWORD</span><span style="color:#ABB2BF;">} </span><span style="color:#98C379;">BGSAVE</span></span>
<span class="line"><span style="color:#61AFEF;">sleep</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> cp</span><span style="color:#98C379;"> redis:/data/dump.rdb</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$BACKUP_DIR</span><span style="color:#98C379;">/redis_\${</span><span style="color:#E06C75;">DATE</span><span style="color:#98C379;">}.rdb&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 备份配置文件</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 备份配置&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">tar</span><span style="color:#D19A66;"> -czf</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$BACKUP_DIR</span><span style="color:#98C379;">/config_\${</span><span style="color:#E06C75;">DATE</span><span style="color:#98C379;">}.tar.gz&quot;</span><span style="color:#D19A66;"> -C</span><span style="color:#98C379;"> /opt/apps/erp</span><span style="color:#98C379;"> config/</span><span style="color:#98C379;"> nginx/</span><span style="color:#98C379;"> .env</span><span style="color:#98C379;"> docker-compose.yml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 清理 7 天前的备份</span></span>
<span class="line"><span style="color:#61AFEF;">find</span><span style="color:#E06C75;"> $BACKUP_DIR</span><span style="color:#D19A66;"> -mtime</span><span style="color:#98C379;"> +7</span><span style="color:#D19A66;"> -delete</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 备份完成: </span><span style="color:#E06C75;">$BACKUP_DIR</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">ls</span><span style="color:#D19A66;"> -lh</span><span style="color:#E06C75;"> $BACKUP_DIR</span><span style="color:#98C379;">/</span><span style="color:#E5C07B;">*</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">DATE</span><span style="color:#ABB2BF;">}</span><span style="color:#E5C07B;">*</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># crontab</span></span>
<span class="line"><span style="color:#61AFEF;">0</span><span style="color:#D19A66;"> 2</span><span style="color:#E5C07B;"> *</span><span style="color:#E5C07B;"> *</span><span style="color:#E5C07B;"> *</span><span style="color:#98C379;"> /opt/scripts/backup.sh</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">/var/log/backup.log</span><span style="color:#ABB2BF;"> 2&gt;&amp;1</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="日常运维命令" tabindex="-1"><a class="header-anchor" href="#日常运维命令"><span>日常运维命令</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> /opt/apps/erp</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 状态检查</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> ps</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> stats</span><span style="color:#7F848E;font-style:italic;">          # 实时资源监控（ 按 Ctrl+C 退出）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 日志</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> logs</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> erp-api</span><span style="color:#D19A66;"> --tail</span><span style="color:#D19A66;"> 100</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> logs</span><span style="color:#D19A66;"> --since</span><span style="color:#98C379;"> 1h</span><span style="color:#98C379;"> postgres</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重启单个服务</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> restart</span><span style="color:#98C379;"> erp-api</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> restart</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 进入容器排查</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> exec</span><span style="color:#98C379;"> erp-api</span><span style="color:#98C379;"> /bin/bash</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> exec</span><span style="color:#98C379;"> postgres</span><span style="color:#98C379;"> psql</span><span style="color:#D19A66;"> -U</span><span style="color:#98C379;"> postgres</span><span style="color:#98C379;"> erp</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看配置</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> config</span><span style="color:#7F848E;font-style:italic;">          # 查看合并后的完整配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 更新全部服务</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> pull</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 完全停止（不删数据）</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> down</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看磁盘占用</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> system</span><span style="color:#98C379;"> df</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> logs</span><span style="color:#D19A66;"> --no-log-prefix</span><span style="color:#98C379;"> erp-api</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -c</span><span style="color:#7F848E;font-style:italic;">   # 日志大小</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="监控脚本" tabindex="-1"><a class="header-anchor" href="#监控脚本"><span>监控脚本</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># monitor.sh - 简单的健康监控</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">WEBHOOK_URL</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;https://hooks.feishu.cn/...&quot;</span><span style="color:#7F848E;font-style:italic;">  # 飞书/钉钉 webhook</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">check_service</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> name</span><span style="color:#56B6C2;">=</span><span style="color:#E06C75;font-style:italic;">$1</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> url</span><span style="color:#56B6C2;">=</span><span style="color:#E06C75;font-style:italic;">$2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">    HTTP_CODE</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> /dev/null</span><span style="color:#D19A66;"> -s</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> &quot;%{http_code}&quot;</span><span style="color:#D19A66;"> --max-time</span><span style="color:#D19A66;"> 5</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$url</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;000&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$HTTP_CODE</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> !=</span><span style="color:#98C379;"> &quot;200&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;❌ \${</span><span style="color:#E06C75;">name</span><span style="color:#98C379;">} 异常 (HTTP \${</span><span style="color:#E06C75;">HTTP_CODE</span><span style="color:#98C379;">})&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 发告警</span></span>
<span class="line"><span style="color:#61AFEF;">        curl</span><span style="color:#D19A66;"> -s</span><span style="color:#D19A66;"> -X</span><span style="color:#98C379;"> POST</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$WEBHOOK_URL</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">          -H</span><span style="color:#98C379;"> &#39;Content-Type: application/json&#39;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">          -d</span><span style="color:#98C379;"> &quot;{</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">msg_type</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">:</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">text</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">,</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">content</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">:{</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">text</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">:</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">⚠️ \${</span><span style="color:#E06C75;">name</span><span style="color:#98C379;">} 健康检查失败 (HTTP \${</span><span style="color:#E06C75;">HTTP_CODE</span><span style="color:#98C379;">})</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">}}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">check_service</span><span style="color:#98C379;"> &quot;ERP-API&quot;</span><span style="color:#98C379;"> &quot;http://localhost:5000/health&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check_service</span><span style="color:#98C379;"> &quot;Nginx&quot;</span><span style="color:#98C379;"> &quot;http://localhost:80&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 每 5 分钟检查一次</span></span>
<span class="line"><span style="color:#ABB2BF;">*/5 * * * * /opt/scripts/monitor.sh &gt;&gt; /var/log/monitor.log 2&gt;&amp;1</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="生产检查清单" tabindex="-1"><a class="header-anchor" href="#生产检查清单"><span>生产检查清单</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>上线前核对：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>配置：</span></span>
<span class="line"><span>  ✅ .env 文件已创建，密码已填写</span></span>
<span class="line"><span>  ✅ .env 不在 Git 仓库里</span></span>
<span class="line"><span>  ✅ appsettings.Production.json 配置正确</span></span>
<span class="line"><span>  ✅ Nginx SSL 证书已放好</span></span>
<span class="line"><span>  ✅ docker compose config 验证无误</span></span>
<span class="line"><span></span></span>
<span class="line"><span>安全：</span></span>
<span class="line"><span>  ✅ 数据库端口不对外暴露</span></span>
<span class="line"><span>  ✅ Redis 设置了密码</span></span>
<span class="line"><span>  ✅ API 通过 Nginx 代理，不直接暴露</span></span>
<span class="line"><span></span></span>
<span class="line"><span>可靠性：</span></span>
<span class="line"><span>  ✅ 所有服务 restart: unless-stopped</span></span>
<span class="line"><span>  ✅ 数据库和 Redis 有 healthcheck</span></span>
<span class="line"><span>  ✅ API 有 healthcheck</span></span>
<span class="line"><span>  ✅ API 等 DB 健康后才启动（condition: service_healthy）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>资源：</span></span>
<span class="line"><span>  ✅ 每个服务设了内存/CPU 限制</span></span>
<span class="line"><span>  ✅ 日志有大小限制</span></span>
<span class="line"><span>  ✅ 数据卷做了持久化</span></span>
<span class="line"><span></span></span>
<span class="line"><span>运维：</span></span>
<span class="line"><span>  ✅ 备份脚本 + crontab 定时执行</span></span>
<span class="line"><span>  ✅ 监控脚本 + 告警通知</span></span>
<span class="line"><span>  ✅ 部署脚本可一键更新</span></span>
<span class="line"><span>  ✅ 防火墙只开 80/443/22</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,22)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};