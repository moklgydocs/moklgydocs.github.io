import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as a}from"./app-C6qeRBA8.js";var o=JSON.parse(`{"path":"/%E8%BF%90%E7%BB%B4%E4%B8%8E%E9%83%A8%E7%BD%B2/Docker_K8s/03_Docker%E7%94%9F%E4%BA%A7%E5%AE%9E%E6%88%98/03_CICD%E9%9B%86%E6%88%90.html","title":"CI/CD 集成","lang":"zh-CN","frontmatter":{"title":"CI/CD 集成","icon":"fa6-solid:arrows-spin","order":3,"category":["Docker"],"tag":["CI/CD","GitHub Actions","GitLab CI","镜像构建","生产实战"]},"git":{"createdTime":1780623253000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":2}]},"readingTime":{"minutes":20.35,"words":6106},"filePathRelative":"运维与部署/Docker_K8s/03_Docker生产实战/03_CICD集成.md"}`),s={name:`03_CICD集成.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="ci-cd-集成" tabindex="-1"><a class="header-anchor" href="#ci-cd-集成"><span>CI/CD 集成</span></a></h1><p>Docker 是现代 CI/CD 流水线的核心引擎 —— 从代码提交到生产部署，Docker 贯穿构建、测试、扫描、推送、部署全流程。本文系统讲解 Docker 在 CI/CD 中的角色、主流 CI 平台集成、镜像标签策略、多架构构建、缓存优化、蓝绿部署与金丝雀发布等生产关键实践。</p><hr><h2 id="一、docker-在-ci-cd-中的角色" tabindex="-1"><a class="header-anchor" href="#一、docker-在-ci-cd-中的角色"><span>一、Docker 在 CI/CD 中的角色</span></a></h2><h3 id="_1-1-docker-在各阶段的作用" tabindex="-1"><a class="header-anchor" href="#_1-1-docker-在各阶段的作用"><span>1.1 Docker 在各阶段的作用</span></a></h3>`,5),i(d,{code:`eJx1zs9Kw0AQBvB7n2Lpva8g2KR/Uj15HXpQFD2JKN4bYqVVm6SHgBipYq0GJFZEEbKoL5OZTd7COikuBJzb7m93vm/3cPNgT6xvVMRijo63inPVsARd2ErGeXhKA7/K/DurkMqpurXJ89PkvitqtRVRB5qcoEzy4Bodr/v3ts5qAI4C7Dv0fp7NA60GqwlFQllN1gbg8xD7EQ2fyFtu3tnfrpTbmsu2i0qpvNRtG7ylCeRGec8u92uytqC4V/EX+iOtLdY25E6kPl9x8KLcOd45/5bIvn0l33R2m/9bgPYMkw+a9uhmprdbrB1Q4ZjcRxyfZfGD1g7rGmA4IXmlI38AIIWmoA==`}),o[1]||=n(`<table><thead><tr><th>阶段</th><th>Docker 作用</th><th>具体操作</th></tr></thead><tbody><tr><td>构建</td><td>可重复构建环境</td><td><code>docker build</code> — 统一构建环境</td></tr><tr><td>测试</td><td>隔离测试环境</td><td><code>docker run</code> — 一次性测试容器</td></tr><tr><td>扫描</td><td>安全基线检查</td><td><code>trivy image</code> — 漏洞扫描</td></tr><tr><td>推送</td><td>制品管理</td><td><code>docker push</code> — 镜像入库</td></tr><tr><td>签名</td><td>信任链建立</td><td><code>cosign sign</code> — 镜像签名</td></tr><tr><td>部署</td><td>一致性交付</td><td><code>docker pull + run</code> — 不可变部署</td></tr><tr><td>回滚</td><td>快速恢复</td><td>切换镜像标签 — 秒级回滚</td></tr></tbody></table><h3 id="_1-2-docker-ci-cd-核心优势" tabindex="-1"><a class="header-anchor" href="#_1-2-docker-ci-cd-核心优势"><span>1.2 Docker CI/CD 核心优势</span></a></h3><ul><li><strong>环境一致性</strong>：构建环境和运行环境完全一致，消除&quot;我本地能跑&quot;问题</li><li><strong>不可变交付物</strong>：镜像一旦构建，不再修改，确保部署一致性</li><li><strong>快速回滚</strong>：只需切换镜像标签即可回滚到任意版本</li><li><strong>隔离性</strong>：CI 任务在容器中执行，互不干扰</li><li><strong>可重复性</strong>：同一 Dockerfile 构建相同代码，产出相同的镜像</li></ul><hr><h2 id="二、github-actions-docker" tabindex="-1"><a class="header-anchor" href="#二、github-actions-docker"><span>二、GitHub Actions + Docker</span></a></h2><h3 id="_2-1-完整-workflow" tabindex="-1"><a class="header-anchor" href="#_2-1-完整-workflow"><span>2.1 完整 Workflow</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># .github/workflows/docker-ci.yml</span></span>
<span class="line"><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Docker CI/CD Pipeline</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  push</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    branches</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">main</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">develop</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">    tags</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;v*&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">  pull_request</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    branches</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">main</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">env</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  REGISTRY</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">harbor.example.com</span></span>
<span class="line"><span style="color:#E06C75;">  PROJECT</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">erp-system</span></span>
<span class="line"><span style="color:#E06C75;">  IMAGE_NAME</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">erp-api</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">jobs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ===== 测试阶段 =====</span></span>
<span class="line"><span style="color:#E06C75;">  test</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    runs-on</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ubuntu-latest</span></span>
<span class="line"><span style="color:#E06C75;">    steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">actions/checkout@v4</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Setup .NET</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">actions/setup-dotnet@v4</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          dotnet-version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;8.0.x&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Restore dependencies</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">dotnet restore</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Build</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">dotnet build --configuration Release --no-restore</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Unit Tests</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          dotnet test \\</span></span>
<span class="line"><span style="color:#98C379;">            --configuration Release \\</span></span>
<span class="line"><span style="color:#98C379;">            --no-build \\</span></span>
<span class="line"><span style="color:#98C379;">            --logger &quot;trx;LogFileName=test-results.trx&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">            --collect:&quot;XPlat Code Coverage&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">            --results-directory ./test-results</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">NuGet Audit</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">dotnet list package --vulnerable --include-transitive || true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Upload Test Results</span></span>
<span class="line"><span style="color:#E06C75;">        if</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">always()</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">actions/upload-artifact@v4</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">test-results</span></span>
<span class="line"><span style="color:#E06C75;">          path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">./test-results</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ===== 构建与推送 =====</span></span>
<span class="line"><span style="color:#E06C75;">  build</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    needs</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">test</span></span>
<span class="line"><span style="color:#E06C75;">    runs-on</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ubuntu-latest</span></span>
<span class="line"><span style="color:#E06C75;">    permissions</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      contents</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">read</span></span>
<span class="line"><span style="color:#E06C75;">      packages</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">write</span></span>
<span class="line"><span style="color:#E06C75;">      id-token</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">write</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">    outputs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      image_tag</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ steps.meta.outputs.tags }}</span></span>
<span class="line"><span style="color:#E06C75;">      image_digest</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ steps.build.outputs.digest }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">    steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">actions/checkout@v4</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Docker Meta</span></span>
<span class="line"><span style="color:#E06C75;">        id</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">meta</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/metadata-action@v5</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          images</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ env.REGISTRY }}/\${{ env.PROJECT }}/\${{ env.IMAGE_NAME }}</span></span>
<span class="line"><span style="color:#E06C75;">          tags</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">            # 分支名</span></span>
<span class="line"><span style="color:#98C379;">            type=ref,event=branch</span></span>
<span class="line"><span style="color:#98C379;">            # PR 编号</span></span>
<span class="line"><span style="color:#98C379;">            type=ref,event=pr</span></span>
<span class="line"><span style="color:#98C379;">            # 语义版本</span></span>
<span class="line"><span style="color:#98C379;">            type=semver,pattern={{version}}</span></span>
<span class="line"><span style="color:#98C379;">            type=semver,pattern={{major}}.{{minor}}</span></span>
<span class="line"><span style="color:#98C379;">            type=semver,pattern={{major}}</span></span>
<span class="line"><span style="color:#98C379;">            # Git SHA</span></span>
<span class="line"><span style="color:#98C379;">            type=sha,prefix=</span></span>
<span class="line"><span style="color:#98C379;">            # 最新标签</span></span>
<span class="line"><span style="color:#98C379;">            type=raw,value=latest,enable={{is_default_branch}}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Set up QEMU</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/setup-qemu-action@v3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Set up Docker Buildx</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/setup-buildx-action@v3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Login to Harbor</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/login-action@v3</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          registry</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ env.REGISTRY }}</span></span>
<span class="line"><span style="color:#E06C75;">          username</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ secrets.HARBOR_USERNAME }}</span></span>
<span class="line"><span style="color:#E06C75;">          password</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ secrets.HARBOR_PASSWORD }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Build and Push</span></span>
<span class="line"><span style="color:#E06C75;">        id</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">build</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/build-push-action@v5</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          context</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">.</span></span>
<span class="line"><span style="color:#E06C75;">          file</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">src/ERP.Api/Dockerfile</span></span>
<span class="line"><span style="color:#E06C75;">          push</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">          tags</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ steps.meta.outputs.tags }}</span></span>
<span class="line"><span style="color:#E06C75;">          labels</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ steps.meta.outputs.labels }}</span></span>
<span class="line"><span style="color:#E06C75;">          platforms</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">linux/amd64,linux/arm64</span></span>
<span class="line"><span style="color:#E06C75;">          cache-from</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">type=gha</span></span>
<span class="line"><span style="color:#E06C75;">          cache-to</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">type=gha,mode=max</span></span>
<span class="line"><span style="color:#E06C75;">          build-args</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">            BUILD_VERSION=\${{ github.ref_name }}</span></span>
<span class="line"><span style="color:#98C379;">            GIT_SHA=\${{ github.sha }}</span></span>
<span class="line"><span style="color:#98C379;">            BUILD_DATE=\${{ github.event.head_commit.timestamp }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ===== 安全扫描 =====</span></span>
<span class="line"><span style="color:#E06C75;">  scan</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    needs</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">build</span></span>
<span class="line"><span style="color:#E06C75;">    runs-on</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ubuntu-latest</span></span>
<span class="line"><span style="color:#E06C75;">    steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Trivy Vulnerability Scan</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">aquasecurity/trivy-action@master</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          image-ref</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ env.REGISTRY }}/\${{ env.PROJECT }}/\${{ env.IMAGE_NAME }}:\${{ needs.build.outputs.image_digest }}</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;HIGH,CRITICAL&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          exit-code</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          format</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;sarif&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          output</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;trivy-results.sarif&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Upload Trivy Results</span></span>
<span class="line"><span style="color:#E06C75;">        if</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">always()</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">github/codeql-action/upload-sarif@v3</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          sarif_file</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">trivy-results.sarif</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Trivy Config Scan</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">aquasecurity/trivy-action@master</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          scan-type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;config&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          scan-ref</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;.&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;HIGH,CRITICAL&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          exit-code</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ===== 镜像签名 =====</span></span>
<span class="line"><span style="color:#E06C75;">  sign</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    needs</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">build</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">scan</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">    runs-on</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ubuntu-latest</span></span>
<span class="line"><span style="color:#E06C75;">    steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Install Cosign</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">sigstore/cosign-installer@v3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Login to Harbor</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/login-action@v3</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          registry</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ env.REGISTRY }}</span></span>
<span class="line"><span style="color:#E06C75;">          username</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ secrets.HARBOR_USERNAME }}</span></span>
<span class="line"><span style="color:#E06C75;">          password</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ secrets.HARBOR_PASSWORD }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Sign Image</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          cosign sign --yes \\</span></span>
<span class="line"><span style="color:#98C379;">            \${{ env.REGISTRY }}/\${{ env.PROJECT }}/\${{ env.IMAGE_NAME }}@\${{ needs.build.outputs.image_digest }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Verify Signature</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          cosign verify \\</span></span>
<span class="line"><span style="color:#98C379;">            \${{ env.REGISTRY }}/\${{ env.PROJECT }}/\${{ env.IMAGE_NAME }}@\${{ needs.build.outputs.image_digest }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ===== 部署 =====</span></span>
<span class="line"><span style="color:#E06C75;">  deploy-staging</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    needs</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">sign</span></span>
<span class="line"><span style="color:#E06C75;">    runs-on</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ubuntu-latest</span></span>
<span class="line"><span style="color:#E06C75;">    if</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">github.ref == &#39;refs/heads/develop&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">staging</span></span>
<span class="line"><span style="color:#E06C75;">      url</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://staging.example.com</span></span>
<span class="line"><span style="color:#E06C75;">    steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Deploy to Staging</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          ssh deploy@staging.example.com &lt;&lt; &#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">            docker pull \${{ env.REGISTRY }}/\${{ env.PROJECT }}/\${{ env.IMAGE_NAME }}:\${{ needs.build.outputs.image_digest }}</span></span>
<span class="line"><span style="color:#98C379;">            docker compose -f /opt/apps/erp/docker-compose.yml up -d</span></span>
<span class="line"><span style="color:#98C379;">          EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  deploy-production</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    needs</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">sign</span></span>
<span class="line"><span style="color:#E06C75;">    runs-on</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ubuntu-latest</span></span>
<span class="line"><span style="color:#E06C75;">    if</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">startsWith(github.ref, &#39;refs/tags/v&#39;)</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">      url</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://erp.example.com</span></span>
<span class="line"><span style="color:#E06C75;">    steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Deploy to Production</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          ssh deploy@prod.example.com &lt;&lt; &#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">            docker pull \${{ env.REGISTRY }}/\${{ env.PROJECT }}/\${{ env.IMAGE_NAME }}:\${{ needs.build.outputs.image_digest }}</span></span>
<span class="line"><span style="color:#98C379;">            docker compose -f /opt/apps/erp/docker-compose.prod.yml up -d --no-deps erp-api</span></span>
<span class="line"><span style="color:#98C379;">          EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Health Check</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          for i in $(seq 1 30); do</span></span>
<span class="line"><span style="color:#98C379;">            if curl -sf https://erp.example.com/health | grep -q &quot;Healthy&quot;; then</span></span>
<span class="line"><span style="color:#98C379;">              echo &quot;Deployment successful&quot;</span></span>
<span class="line"><span style="color:#98C379;">              exit 0</span></span>
<span class="line"><span style="color:#98C379;">            fi</span></span>
<span class="line"><span style="color:#98C379;">            echo &quot;Waiting for healthy response... ($i/30)&quot;</span></span>
<span class="line"><span style="color:#98C379;">            sleep 10</span></span>
<span class="line"><span style="color:#98C379;">          done</span></span>
<span class="line"><span style="color:#98C379;">          echo &quot;Health check failed&quot;</span></span>
<span class="line"><span style="color:#98C379;">          exit 1</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-github-actions-secrets-配置" tabindex="-1"><a class="header-anchor" href="#_2-2-github-actions-secrets-配置"><span>2.2 GitHub Actions Secrets 配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 通过 GitHub CLI 配置 Secrets</span></span>
<span class="line"><span style="color:#61AFEF;">gh</span><span style="color:#98C379;"> secret</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> HARBOR_USERNAME</span><span style="color:#D19A66;"> --body</span><span style="color:#98C379;"> &quot;robot</span><span style="color:#E06C75;">$erp</span><span style="color:#98C379;">-system+ci-pusher&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">gh</span><span style="color:#98C379;"> secret</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> HARBOR_PASSWORD</span><span style="color:#D19A66;"> --body</span><span style="color:#98C379;"> &quot;eyJhbGciOi...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">gh</span><span style="color:#98C379;"> secret</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> DEPLOY_KEY</span><span style="color:#D19A66;"> --body</span><span style="color:#98C379;"> &quot;$(</span><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> ~/.ssh/deploy_key)&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看已配置的 Secrets</span></span>
<span class="line"><span style="color:#61AFEF;">gh</span><span style="color:#98C379;"> secret</span><span style="color:#98C379;"> list</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="三、gitlab-ci-docker" tabindex="-1"><a class="header-anchor" href="#三、gitlab-ci-docker"><span>三、GitLab CI + Docker</span></a></h2><h3 id="_3-1-完整-gitlab-ci-yml" tabindex="-1"><a class="header-anchor" href="#_3-1-完整-gitlab-ci-yml"><span>3.1 完整 .gitlab-ci.yml</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># .gitlab-ci.yml</span></span>
<span class="line"><span style="color:#E06C75;">stages</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">test</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">build</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">scan</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">push</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">deploy</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">variables</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  REGISTRY</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">harbor.example.com</span></span>
<span class="line"><span style="color:#E06C75;">  PROJECT</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">erp-system</span></span>
<span class="line"><span style="color:#E06C75;">  IMAGE_NAME</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">erp-api</span></span>
<span class="line"><span style="color:#E06C75;">  DOCKER_BUILDKIT</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  TRIVY_SEVERITY</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;HIGH,CRITICAL&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 使用 GitLab 内置 Docker-in-Docker</span></span>
<span class="line"><span style="color:#E06C75;">  DOCKER_HOST</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">tcp://docker:2376</span></span>
<span class="line"><span style="color:#E06C75;">  DOCKER_TLS_CERTDIR</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;/certs&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  DOCKER_TLS_VERIFY</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">1</span></span>
<span class="line"><span style="color:#E06C75;">  DOCKER_CERT_PATH</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;$DOCKER_TLS_CERTDIR/client&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 默认配置</span></span>
<span class="line"><span style="color:#E06C75;">default</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker:24</span></span>
<span class="line"><span style="color:#E06C75;">  services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">docker:24-dind</span></span>
<span class="line"><span style="color:#E06C75;">  before_script</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">echo &quot;$HARBOR_PASSWORD&quot; | docker login &quot;$REGISTRY&quot; -u &quot;$HARBOR_USERNAME&quot; --password-stdin</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 测试阶段 =====</span></span>
<span class="line"><span style="color:#E06C75;">dotnet-test</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  stage</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">test</span></span>
<span class="line"><span style="color:#E06C75;">  image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">mcr.microsoft.com/dotnet/sdk:8.0</span></span>
<span class="line"><span style="color:#E06C75;">  services</span><span style="color:#ABB2BF;">: []</span></span>
<span class="line"><span style="color:#E06C75;">  before_script</span><span style="color:#ABB2BF;">: []</span></span>
<span class="line"><span style="color:#E06C75;">  script</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">dotnet restore</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">dotnet build --configuration Release --no-restore</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">dotnet test --configuration Release --no-build</span></span>
<span class="line"><span style="color:#98C379;">        --logger &quot;junit;LogFilePath=test-results.xml&quot;</span></span>
<span class="line"><span style="color:#98C379;">        --collect:&quot;XPlat Code Coverage&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">dotnet list package --vulnerable --include-transitive || true</span></span>
<span class="line"><span style="color:#E06C75;">  artifacts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    when</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">always</span></span>
<span class="line"><span style="color:#E06C75;">    reports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      junit</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;**/test-results.xml&quot;</span></span>
<span class="line"><span style="color:#E06C75;">      coverage_report</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        coverage_format</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">cobertura</span></span>
<span class="line"><span style="color:#E06C75;">        path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;**/coverage.cobertura.xml&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  coverage</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;/\\s*Line coverage:\\s*(\\d+\\.\\d+)%/&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 构建阶段 =====</span></span>
<span class="line"><span style="color:#E06C75;">build-image</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  stage</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">build</span></span>
<span class="line"><span style="color:#E06C75;">  script</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">docker buildx create --use --name builder</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">docker buildx inspect --bootstrap builder</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">      docker buildx build \\</span></span>
<span class="line"><span style="color:#98C379;">        --platform linux/amd64,linux/arm64 \\</span></span>
<span class="line"><span style="color:#98C379;">        --tag &quot;$REGISTRY/$PROJECT/$IMAGE_NAME:$CI_COMMIT_SHORT_SHA&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">        --tag &quot;$REGISTRY/$PROJECT/$IMAGE_NAME:buildcache&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">        --cache-from type=registry,ref=&quot;$REGISTRY/$PROJECT/$IMAGE_NAME:buildcache&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">        --cache-to type=registry,ref=&quot;$REGISTRY/$PROJECT/$IMAGE_NAME:buildcache&quot;,mode=max \\</span></span>
<span class="line"><span style="color:#98C379;">        --build-arg BUILD_VERSION=$CI_COMMIT_TAG \\</span></span>
<span class="line"><span style="color:#98C379;">        --build-arg GIT_SHA=$CI_COMMIT_SHA \\</span></span>
<span class="line"><span style="color:#98C379;">        --push \\</span></span>
<span class="line"><span style="color:#98C379;">        -f src/ERP.Api/Dockerfile \\</span></span>
<span class="line"><span style="color:#98C379;">        .</span></span>
<span class="line"><span style="color:#E06C75;">  rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">if</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">$CI_COMMIT_BRANCH == &quot;main&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">if</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">$CI_COMMIT_TAG</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 扫描阶段 =====</span></span>
<span class="line"><span style="color:#E06C75;">trivy-scan</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  stage</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">scan</span></span>
<span class="line"><span style="color:#E06C75;">  image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">aquasec/trivy:latest</span></span>
<span class="line"><span style="color:#E06C75;">  services</span><span style="color:#ABB2BF;">: []</span></span>
<span class="line"><span style="color:#E06C75;">  before_script</span><span style="color:#ABB2BF;">: []</span></span>
<span class="line"><span style="color:#E06C75;">  script</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">trivy image --severity $TRIVY_SEVERITY --exit-code 1 --format json</span></span>
<span class="line"><span style="color:#98C379;">        --output trivy-report.json</span></span>
<span class="line"><span style="color:#98C379;">        &quot;$REGISTRY/$PROJECT/$IMAGE_NAME:$CI_COMMIT_SHORT_SHA&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  artifacts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    when</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">always</span></span>
<span class="line"><span style="color:#E06C75;">    paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">trivy-report.json</span></span>
<span class="line"><span style="color:#E06C75;">  allow_failure</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">trivy-config-scan</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  stage</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">scan</span></span>
<span class="line"><span style="color:#E06C75;">  image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">aquasec/trivy:latest</span></span>
<span class="line"><span style="color:#E06C75;">  services</span><span style="color:#ABB2BF;">: []</span></span>
<span class="line"><span style="color:#E06C75;">  before_script</span><span style="color:#ABB2BF;">: []</span></span>
<span class="line"><span style="color:#E06C75;">  script</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">trivy config --severity $TRIVY_SEVERITY --exit-code 1 .</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 签名阶段 =====</span></span>
<span class="line"><span style="color:#E06C75;">cosign-sign</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  stage</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">push</span></span>
<span class="line"><span style="color:#E06C75;">  image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">alpine:latest</span></span>
<span class="line"><span style="color:#E06C75;">  services</span><span style="color:#ABB2BF;">: []</span></span>
<span class="line"><span style="color:#E06C75;">  before_script</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">apk add --no-cache cosign docker</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">echo &quot;$HARBOR_PASSWORD&quot; | docker login &quot;$REGISTRY&quot; -u &quot;$HARBOR_USERNAME&quot; --password-stdin</span></span>
<span class="line"><span style="color:#E06C75;">  script</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">cosign sign --yes &quot;$REGISTRY/$PROJECT/$IMAGE_NAME:$CI_COMMIT_SHORT_SHA&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">if</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">$CI_COMMIT_BRANCH == &quot;main&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">if</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">$CI_COMMIT_TAG</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 部署阶段 =====</span></span>
<span class="line"><span style="color:#E06C75;">deploy-staging</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  stage</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">deploy</span></span>
<span class="line"><span style="color:#E06C75;">  image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">alpine:latest</span></span>
<span class="line"><span style="color:#E06C75;">  services</span><span style="color:#ABB2BF;">: []</span></span>
<span class="line"><span style="color:#E06C75;">  before_script</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">apk add --no-cache openssh-client</span></span>
<span class="line"><span style="color:#E06C75;">  script</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">      ssh -o StrictHostKeyChecking=no deploy@staging.example.com &lt;&lt; EOF</span></span>
<span class="line"><span style="color:#98C379;">        docker pull $REGISTRY/$PROJECT/$IMAGE_NAME:$CI_COMMIT_SHORT_SHA</span></span>
<span class="line"><span style="color:#98C379;">        cd /opt/apps/erp</span></span>
<span class="line"><span style="color:#98C379;">        export IMAGE_TAG=$CI_COMMIT_SHORT_SHA</span></span>
<span class="line"><span style="color:#98C379;">        docker compose up -d --no-deps erp-api</span></span>
<span class="line"><span style="color:#98C379;">      EOF</span></span>
<span class="line"><span style="color:#E06C75;">  environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">staging</span></span>
<span class="line"><span style="color:#E06C75;">    url</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://staging.example.com</span></span>
<span class="line"><span style="color:#E06C75;">  rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">if</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">$CI_COMMIT_BRANCH == &quot;main&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">deploy-production</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  stage</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">deploy</span></span>
<span class="line"><span style="color:#E06C75;">  image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">alpine:latest</span></span>
<span class="line"><span style="color:#E06C75;">  services</span><span style="color:#ABB2BF;">: []</span></span>
<span class="line"><span style="color:#E06C75;">  before_script</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">apk add --no-cache openssh-client</span></span>
<span class="line"><span style="color:#E06C75;">  script</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">      ssh -o StrictHostKeyChecking=no deploy@prod.example.com &lt;&lt; EOF</span></span>
<span class="line"><span style="color:#98C379;">        docker pull $REGISTRY/$PROJECT/$IMAGE_NAME:$CI_COMMIT_SHORT_SHA</span></span>
<span class="line"><span style="color:#98C379;">        cd /opt/apps/erp</span></span>
<span class="line"><span style="color:#98C379;">        export IMAGE_TAG=$CI_COMMIT_SHORT_SHA</span></span>
<span class="line"><span style="color:#98C379;">        docker compose -f docker-compose.prod.yml up -d --no-deps erp-api</span></span>
<span class="line"><span style="color:#98C379;">      EOF</span></span>
<span class="line"><span style="color:#E06C75;">  environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">    url</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://erp.example.com</span></span>
<span class="line"><span style="color:#E06C75;">  when</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">manual</span></span>
<span class="line"><span style="color:#E06C75;">  rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">if</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">$CI_COMMIT_TAG</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">rollback</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  stage</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">deploy</span></span>
<span class="line"><span style="color:#E06C75;">  image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">alpine:latest</span></span>
<span class="line"><span style="color:#E06C75;">  services</span><span style="color:#ABB2BF;">: []</span></span>
<span class="line"><span style="color:#E06C75;">  before_script</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">apk add --no-cache openssh-client</span></span>
<span class="line"><span style="color:#E06C75;">  script</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">      ssh -o StrictHostKeyChecking=no deploy@prod.example.com &lt;&lt; EOF</span></span>
<span class="line"><span style="color:#98C379;">        cd /opt/apps/erp</span></span>
<span class="line"><span style="color:#98C379;">        export IMAGE_TAG=$PREVIOUS_TAG</span></span>
<span class="line"><span style="color:#98C379;">        docker compose -f docker-compose.prod.yml up -d --no-deps erp-api</span></span>
<span class="line"><span style="color:#98C379;">      EOF</span></span>
<span class="line"><span style="color:#E06C75;">  when</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">manual</span></span>
<span class="line"><span style="color:#E06C75;">  variables</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    PREVIOUS_TAG</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-gitlab-ci-变量配置" tabindex="-1"><a class="header-anchor" href="#_3-2-gitlab-ci-变量配置"><span>3.2 GitLab CI 变量配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 在 GitLab 项目 → Settings → CI/CD → Variables 中配置</span></span>
<span class="line"><span style="color:#E06C75;">HARBOR_USERNAME</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">robot</span><span style="color:#E06C75;">$erp</span><span style="color:#98C379;">-system+ci-pusher</span></span>
<span class="line"><span style="color:#E06C75;">HARBOR_PASSWORD</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">eyJhbGciOi...</span></span>
<span class="line"><span style="color:#E06C75;">DEPLOY_SSH_KEY</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#98C379;">private-key-content</span><span style="color:#ABB2BF;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 变量保护</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># - 勾选 &quot;Protect variable&quot;：仅在受保护分支/标签上可用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># - 勾选 &quot;Mask variable&quot;：在日志中隐藏变量值</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># - 勾选 &quot;Expand variable reference&quot;：允许引用其他变量</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、镜像标签策略" tabindex="-1"><a class="header-anchor" href="#四、镜像标签策略"><span>四、镜像标签策略</span></a></h2><h3 id="_4-1-标签策略对比" tabindex="-1"><a class="header-anchor" href="#_4-1-标签策略对比"><span>4.1 标签策略对比</span></a></h3><table><thead><tr><th>策略</th><th>标签格式</th><th>优点</th><th>缺点</th><th>适用场景</th></tr></thead><tbody><tr><td>Git SHA</td><td><code>abc1234</code></td><td>精确追踪</td><td>不直观</td><td>所有环境</td></tr><tr><td>语义版本</td><td><code>v1.2.3</code></td><td>人类可读</td><td>需手动打标签</td><td>生产发布</td></tr><tr><td>分支名</td><td><code>main</code>, <code>develop</code></td><td>简单</td><td>可变</td><td>开发/测试</td></tr><tr><td>构建号</td><td><code>build-123</code></td><td>递增</td><td>环境相关</td><td>CI 内部</td></tr><tr><td>Latest</td><td><code>latest</code></td><td>方便</td><td>不可控</td><td>不推荐生产</td></tr></tbody></table><h3 id="_4-2-推荐标签策略" tabindex="-1"><a class="header-anchor" href="#_4-2-推荐标签策略"><span>4.2 推荐标签策略</span></a></h3>`,20),i(d,{code:`eJxLL0osyFAIceFSAALH6Ce7Fz9f0Pisf8KTXUtiFXR17RScqp92tD2bst6+lgusxgkkWpOSWpaak19Qo+Ac/WxB+/O1+6wUgj0cFbQVoBKxSGrTUhNLSotS9bVqFFyQVSOrKUlMVygDKnCFKygz1DPSMwaaCGKAKSCRk1iSWlwSC3GJM9h9btHP+la8bGjE6gAXsBJ3FCX5eTmVEFlXsKwHXPZp64qX7f0QB0DtcAMr8Yx+2bzi+d5NTzs2KAQDnZqZlw4xwQMs7YUkHVCUn1KaXJKZnxfLBQAQoX6X`}),o[2]||=n(`<div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># GitHub Actions — 镜像标签生成</span></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Docker Meta</span></span>
<span class="line"><span style="color:#E06C75;">  id</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">meta</span></span>
<span class="line"><span style="color:#E06C75;">  uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/metadata-action@v5</span></span>
<span class="line"><span style="color:#E06C75;">  with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    images</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ env.REGISTRY }}/\${{ env.PROJECT }}/\${{ env.IMAGE_NAME }}</span></span>
<span class="line"><span style="color:#E06C75;">    flavor</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">      latest=auto</span></span>
<span class="line"><span style="color:#E06C75;">    tags</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">      # Git SHA（始终生成）</span></span>
<span class="line"><span style="color:#98C379;">      type=sha,prefix=</span></span>
<span class="line"><span style="color:#98C379;">      # 语义版本（仅 tag 触发）</span></span>
<span class="line"><span style="color:#98C379;">      type=semver,pattern={{version}}</span></span>
<span class="line"><span style="color:#98C379;">      type=semver,pattern={{major}}.{{minor}}</span></span>
<span class="line"><span style="color:#98C379;">      type=semver,pattern={{major}}</span></span>
<span class="line"><span style="color:#98C379;">      # 分支名</span></span>
<span class="line"><span style="color:#98C379;">      type=ref,event=branch</span></span>
<span class="line"><span style="color:#98C379;">      # PR 编号</span></span>
<span class="line"><span style="color:#98C379;">      type=ref,event=pr</span></span>
<span class="line"><span style="color:#98C379;">      # 自定义标签</span></span>
<span class="line"><span style="color:#98C379;">      type=raw,value=stable,enable=\${{ github.ref == &#39;refs/heads/main&#39; }}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">永远不要在生产使用 latest 标签</p><p><code>latest</code> 是可变标签 —— 今天指向 v1.2.0，明天可能指向 v2.0.0。生产环境必须使用不可变标签（Git SHA 或语义版本），确保每次部署的镜像内容完全一致。</p></div><h3 id="_4-3-不可变标签实践" tabindex="-1"><a class="header-anchor" href="#_4-3-不可变标签实践"><span>4.3 不可变标签实践</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 digest 而非 tag（最精确）</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> pull</span><span style="color:#98C379;"> harbor.example.com/erp-system/erp-api@sha256:abc123...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在部署配置中锁定 digest</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># docker-compose.prod.yml</span></span>
<span class="line"><span style="color:#61AFEF;">services:</span></span>
<span class="line"><span style="color:#61AFEF;">  erp-api:</span></span>
<span class="line"><span style="color:#61AFEF;">    image:</span><span style="color:#98C379;"> harbor.example.com/erp-system/erp-api@sha256:abc123...</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 而非</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # image: harbor.example.com/erp-system/erp-api:v1.2.0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、多架构构建" tabindex="-1"><a class="header-anchor" href="#五、多架构构建"><span>五、多架构构建</span></a></h2><h3 id="_5-1-buildx-qemu-方案" tabindex="-1"><a class="header-anchor" href="#_5-1-buildx-qemu-方案"><span>5.1 Buildx + QEMU 方案</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 QEMU 模拟器</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> run</span><span style="color:#D19A66;"> --privileged</span><span style="color:#D19A66;"> --rm</span><span style="color:#98C379;"> tonistiigi/binfmt</span><span style="color:#D19A66;"> --install</span><span style="color:#98C379;"> all</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建 buildx 构建器</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> buildx</span><span style="color:#98C379;"> create</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --name</span><span style="color:#98C379;"> multiarch-builder</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --driver</span><span style="color:#98C379;"> docker-container</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --driver-opt</span><span style="color:#98C379;"> image=moby/buildkit:latest</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --platform</span><span style="color:#98C379;"> linux/amd64,linux/arm64</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --use</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> buildx</span><span style="color:#98C379;"> inspect</span><span style="color:#D19A66;"> --bootstrap</span><span style="color:#98C379;"> multiarch-builder</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-ci-中构建多架构镜像" tabindex="-1"><a class="header-anchor" href="#_5-2-ci-中构建多架构镜像"><span>5.2 CI 中构建多架构镜像</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># GitHub Actions — 多架构构建</span></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Set up QEMU</span></span>
<span class="line"><span style="color:#E06C75;">  uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/setup-qemu-action@v3</span></span>
<span class="line"><span style="color:#E06C75;">  with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    platforms</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">linux/amd64,linux/arm64</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Set up Docker Buildx</span></span>
<span class="line"><span style="color:#E06C75;">  uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/setup-buildx-action@v3</span></span>
<span class="line"><span style="color:#E06C75;">  with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    platforms</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">linux/amd64,linux/arm64</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Build and Push Multi-arch</span></span>
<span class="line"><span style="color:#E06C75;">  uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/build-push-action@v5</span></span>
<span class="line"><span style="color:#E06C75;">  with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    context</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">.</span></span>
<span class="line"><span style="color:#E06C75;">    platforms</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">linux/amd64,linux/arm64</span></span>
<span class="line"><span style="color:#E06C75;">    push</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    tags</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ steps.meta.outputs.tags }}</span></span>
<span class="line"><span style="color:#E06C75;">    cache-from</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">type=gha</span></span>
<span class="line"><span style="color:#E06C75;">    cache-to</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">type=gha,mode=max</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-net-多架构-dockerfile" tabindex="-1"><a class="header-anchor" href="#_5-3-net-多架构-dockerfile"><span>5.3 .NET 多架构 Dockerfile</span></a></h3><div class="language-dockerfile line-numbers-mode" data-highlighter="shiki" data-ext="dockerfile" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-dockerfile"><span class="line"><span style="color:#7F848E;font-style:italic;"># Dockerfile — .NET 多架构</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ---- Build Stage ----</span></span>
<span class="line"><span style="color:#61AFEF;">FROM</span><span style="color:#ABB2BF;"> --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:8.0 </span><span style="color:#61AFEF;">AS</span><span style="color:#ABB2BF;"> build</span></span>
<span class="line"><span style="color:#61AFEF;">ARG</span><span style="color:#ABB2BF;"> TARGETARCH</span></span>
<span class="line"><span style="color:#61AFEF;">WORKDIR</span><span style="color:#ABB2BF;"> /src</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 先复制项目文件，利用 Docker 缓存</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> [</span><span style="color:#98C379;">&quot;Directory.Build.props&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;.&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> [</span><span style="color:#98C379;">&quot;src/ERP.Api/ERP.Api.csproj&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;src/ERP.Api/&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> [</span><span style="color:#98C379;">&quot;src/ERP.Core/ERP.Core.csproj&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;src/ERP.Core/&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> [</span><span style="color:#98C379;">&quot;src/ERP.Infrastructure/ERP.Infrastructure.csproj&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;src/ERP.Infrastructure/&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> dotnet restore </span><span style="color:#98C379;">&quot;src/ERP.Api/ERP.Api.csproj&quot;</span><span style="color:#ABB2BF;"> -a $TARGETARCH</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 复制源码并构建</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> . .</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> dotnet publish </span><span style="color:#98C379;">&quot;src/ERP.Api/ERP.Api.csproj&quot;</span><span style="color:#ABB2BF;"> \\</span></span>
<span class="line"><span style="color:#ABB2BF;">  -a $TARGETARCH \\</span></span>
<span class="line"><span style="color:#ABB2BF;">  -c Release \\</span></span>
<span class="line"><span style="color:#ABB2BF;">  -o /app/publish \\</span></span>
<span class="line"><span style="color:#ABB2BF;">  --no-restore \\</span></span>
<span class="line"><span style="color:#ABB2BF;">  -p:Version=\${BUILD_VERSION:-1.0.0}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ---- Runtime Stage ----</span></span>
<span class="line"><span style="color:#61AFEF;">FROM</span><span style="color:#ABB2BF;"> mcr.microsoft.com/dotnet/aspnet:8.0-jammy-chiseled </span><span style="color:#61AFEF;">AS</span><span style="color:#ABB2BF;"> runtime</span></span>
<span class="line"><span style="color:#61AFEF;">WORKDIR</span><span style="color:#ABB2BF;"> /app</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安全：非 root 用户</span></span>
<span class="line"><span style="color:#61AFEF;">USER</span><span style="color:#ABB2BF;"> $APP_UID</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> --from=build /app/publish .</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">ENV</span><span style="color:#ABB2BF;"> ASPNETCORE_URLS=http://+:8080</span></span>
<span class="line"><span style="color:#61AFEF;">EXPOSE</span><span style="color:#ABB2BF;"> 8080</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">HEALTHCHECK</span><span style="color:#ABB2BF;"> --interval=30s --timeout=5s --retries=3 \\</span></span>
<span class="line"><span style="color:#61AFEF;">  CMD</span><span style="color:#ABB2BF;"> curl -f http://localhost:8080/health || exit 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">ENTRYPOINT</span><span style="color:#ABB2BF;"> [</span><span style="color:#98C379;">&quot;dotnet&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;ERP.Api.dll&quot;</span><span style="color:#ABB2BF;">]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">多架构构建优化</p><ol><li>Build Stage 使用 <code>--platform=$BUILDPLATFORM</code>（原生架构运行 SDK，避免 QEMU 模拟，构建速度快 3~5 倍）</li><li>通过 <code>-a $TARGETARCH</code> 让 .NET 编译目标架构的二进制</li><li>Runtime Stage 不指定 <code>--platform</code>，自动选择对应架构的基础镜像</li><li>测试在单一架构上执行，多架构只做最终构建和推送</li></ol></div><hr><h2 id="六、镜像构建缓存" tabindex="-1"><a class="header-anchor" href="#六、镜像构建缓存"><span>六、镜像构建缓存</span></a></h2><h3 id="_6-1-缓存策略对比" tabindex="-1"><a class="header-anchor" href="#_6-1-缓存策略对比"><span>6.1 缓存策略对比</span></a></h3><table><thead><tr><th>缓存方式</th><th>存储位置</th><th>速度</th><th>适用场景</th></tr></thead><tbody><tr><td>Docker 内联缓存</td><td>镜像层</td><td>中</td><td>简单项目</td></tr><tr><td>Registry 缓存</td><td>镜像仓库</td><td>中</td><td>多节点构建</td></tr><tr><td>GitHub Actions Cache</td><td>GHA 缓存</td><td>快</td><td>GitHub CI</td></tr><tr><td>BuildKit Cache Mount</td><td>本地</td><td>最快</td><td>本地开发</td></tr><tr><td>S3 缓存</td><td>S3 存储</td><td>中</td><td>自建 CI</td></tr></tbody></table><h3 id="_6-2-buildkit-cache-mount" tabindex="-1"><a class="header-anchor" href="#_6-2-buildkit-cache-mount"><span>6.2 BuildKit Cache Mount</span></a></h3><div class="language-dockerfile line-numbers-mode" data-highlighter="shiki" data-ext="dockerfile" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-dockerfile"><span class="line"><span style="color:#7F848E;font-style:italic;"># Dockerfile — BuildKit Cache Mount</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># syntax=docker/dockerfile:1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">FROM</span><span style="color:#ABB2BF;"> mcr.microsoft.com/dotnet/sdk:8.0 </span><span style="color:#61AFEF;">AS</span><span style="color:#ABB2BF;"> build</span></span>
<span class="line"><span style="color:#61AFEF;">WORKDIR</span><span style="color:#ABB2BF;"> /src</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># NuGet 包缓存挂载</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> [</span><span style="color:#98C379;">&quot;src/ERP.Api/ERP.Api.csproj&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;src/ERP.Api/&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> --mount=type=cache,target=/root/.nuget/packages \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    dotnet restore </span><span style="color:#98C379;">&quot;src/ERP.Api/ERP.Api.csproj&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> . .</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 构建时也挂载 NuGet 缓存</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> --mount=type=cache,target=/root/.nuget/packages \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    dotnet publish </span><span style="color:#98C379;">&quot;src/ERP.Api/ERP.Api.csproj&quot;</span><span style="color:#ABB2BF;"> \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    -c Release -o /app/publish --no-restore</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># npm 缓存挂载示例</span></span>
<span class="line"><span style="color:#61AFEF;">FROM</span><span style="color:#ABB2BF;"> node:20 </span><span style="color:#61AFEF;">AS</span><span style="color:#ABB2BF;"> frontend-build</span></span>
<span class="line"><span style="color:#61AFEF;">WORKDIR</span><span style="color:#ABB2BF;"> /app</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> package*.json ./</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> --mount=type=cache,target=/root/.npm \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    npm ci</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> . .</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> --mount=type=cache,target=/root/.npm \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    npm run build</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 启用 BuildKit 构建</span></span>
<span class="line"><span style="color:#E06C75;">DOCKER_BUILDKIT</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">1</span><span style="color:#61AFEF;"> docker</span><span style="color:#98C379;"> build</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> myapp:v1.0</span><span style="color:#98C379;"> .</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 或在 daemon.json 中永久启用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/docker/daemon.json</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#61AFEF;">  &quot;features&quot;</span><span style="color:#56B6C2;">:</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">    &quot;buildkit&quot;</span><span style="color:#56B6C2;">:</span><span style="color:#D19A66;"> true</span></span>
<span class="line"><span style="color:#ABB2BF;">  }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-3-registry-缓存" tabindex="-1"><a class="header-anchor" href="#_6-3-registry-缓存"><span>6.3 Registry 缓存</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># GitHub Actions — Registry 缓存</span></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Build and Push</span></span>
<span class="line"><span style="color:#E06C75;">  uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/build-push-action@v5</span></span>
<span class="line"><span style="color:#E06C75;">  with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    context</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">.</span></span>
<span class="line"><span style="color:#E06C75;">    push</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    tags</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ steps.meta.outputs.tags }}</span></span>
<span class="line"><span style="color:#E06C75;">    cache-from</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">type=registry,ref=\${{ env.REGISTRY }}/\${{ env.PROJECT }}/\${{ env.IMAGE_NAME }}:buildcache</span></span>
<span class="line"><span style="color:#E06C75;">    cache-to</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">type=registry,ref=\${{ env.REGISTRY }}/\${{ env.PROJECT }}/\${{ env.IMAGE_NAME }}:buildcache,mode=max</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-4-github-actions-cache" tabindex="-1"><a class="header-anchor" href="#_6-4-github-actions-cache"><span>6.4 GitHub Actions Cache</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># GitHub Actions — GHA 缓存（推荐）</span></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Build and Push</span></span>
<span class="line"><span style="color:#E06C75;">  uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/build-push-action@v5</span></span>
<span class="line"><span style="color:#E06C75;">  with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    context</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">.</span></span>
<span class="line"><span style="color:#E06C75;">    push</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    tags</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ steps.meta.outputs.tags }}</span></span>
<span class="line"><span style="color:#E06C75;">    cache-from</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">type=gha</span></span>
<span class="line"><span style="color:#E06C75;">    cache-to</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">type=gha,mode=max</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-5-缓存效果对比" tabindex="-1"><a class="header-anchor" href="#_6-5-缓存效果对比"><span>6.5 缓存效果对比</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span># 无缓存 — 全量构建</span></span>
<span class="line"><span># [+] Building 245.3s (18/18) FINISHED</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 有缓存 — 增量构建（仅重新构建变化的层）</span></span>
<span class="line"><span># [+] Building 32.7s (12/18) FINISHED</span></span>
<span class="line"><span># CACHED [1/5] FROM mcr.microsoft.com/dotnet/sdk:8.0</span></span>
<span class="line"><span># CACHED [2/5] WORKDIR /src</span></span>
<span class="line"><span># CACHED [3/5] COPY *.csproj ./</span></span>
<span class="line"><span># CACHED [4/5] RUN dotnet restore</span></span>
<span class="line"><span>#        [5/5] COPY . .                      ← 仅此层重新构建</span></span>
<span class="line"><span>#        [6/5] RUN dotnet publish</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">缓存最佳实践</p><ol><li>将不常变化的指令放在前面（基础镜像、restore），常变化的放在后面（COPY 源码）</li><li>使用 <code>.dockerignore</code> 排除不需要的文件，避免缓存失效</li><li><code>mode=max</code> 缓存所有中间层，不仅缓存最终层</li><li>定期清理 Registry 缓存标签，避免占用过多存储</li></ol></div><hr><h2 id="七、蓝绿部署与金丝雀发布" tabindex="-1"><a class="header-anchor" href="#七、蓝绿部署与金丝雀发布"><span>七、蓝绿部署与金丝雀发布</span></a></h2><h3 id="_7-1-蓝绿部署" tabindex="-1"><a class="header-anchor" href="#_7-1-蓝绿部署"><span>7.1 蓝绿部署</span></a></h3>`,30),i(d,{code:`eJxLL0osyFAIceJSAILi0iQIX+nF5LnPd+9/2bzi+d5NSmA5TPm+9U8XNb/f0/F07+Snnb3POzuezVmjUGb4fk8nQgcI+DgZRiulFhXoJhZk6ibllKbaJBXp25UZ6hnoGSjFoih1ASrVeDZ1w7PedU93TdZESKbmpXBhcQbQjXBnPJu2AeYGI0w3uCO5Ib0oNTUP4ggjrI4wIsIRPk7RSi+2zH+xd+/Tue0vFi58OnMF2Ei/9My8Cn0Px4Ci/IpKoMlIGhR0de1qIKH1bGvjy/b+GlDYoCjQA6nY1/q0o/1Z7yKgtDtEGmQzAC8amgE=`}),o[3]||=n(`<div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># docker-compose.blue-green.yml</span></span>
<span class="line"><span style="color:#E06C75;">version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;3.8&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 蓝环境 — 当前运行版本</span></span>
<span class="line"><span style="color:#E06C75;">  erp-api-blue</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">harbor.example.com/erp-system/erp-api:v1.0.0</span></span>
<span class="line"><span style="color:#E06C75;">    container_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">erp-api-blue</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">ASPNETCORE_ENVIRONMENT=Production</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">ASPNETCORE_URLS=http://+:8080</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;8081:8080&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;curl&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;-f&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://localhost:8080/health&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 绿环境 — 新版本</span></span>
<span class="line"><span style="color:#E06C75;">  erp-api-green</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">harbor.example.com/erp-system/erp-api:v2.0.0</span></span>
<span class="line"><span style="color:#E06C75;">    container_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">erp-api-green</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">ASPNETCORE_ENVIRONMENT=Production</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">ASPNETCORE_URLS=http://+:8080</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;8082:8080&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;curl&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;-f&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://localhost:8080/health&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # Nginx 负载均衡</span></span>
<span class="line"><span style="color:#E06C75;">  nginx</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx:alpine</span></span>
<span class="line"><span style="color:#E06C75;">    container_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx-blue-green</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;80:80&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx-blue-green.conf:/etc/nginx/conf.d/default.conf:ro</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">always</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># nginx-blue-green.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 切换 upstream 即可实现蓝绿切换</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 当前指向蓝环境</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> erp_api {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> erp-api-blue:8080;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # server erp-api-green:8080;  # 切换到绿环境时取消注释</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">erp.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://erp_api;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Proto $</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># blue-green-deploy.sh — 蓝绿部署切换脚本</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -e</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">CURRENT</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;blue&quot;</span><span style="color:#7F848E;font-style:italic;">   # 当前活跃环境</span></span>
<span class="line"><span style="color:#E06C75;">TARGET</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;green&quot;</span><span style="color:#7F848E;font-style:italic;">   # 目标环境</span></span>
<span class="line"><span style="color:#E06C75;">NEW_VERSION</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;v2.0.0&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== 蓝绿部署: \${</span><span style="color:#E06C75;">TARGET</span><span style="color:#98C379;">} 环境部署 \${</span><span style="color:#E06C75;">NEW_VERSION</span><span style="color:#98C379;">} ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 拉取新版本镜像</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 拉取新版本镜像...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> pull</span><span style="color:#98C379;"> harbor.example.com/erp-system/erp-api:</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">NEW_VERSION</span><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 启动目标环境</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 启动 \${</span><span style="color:#E06C75;">TARGET</span><span style="color:#98C379;">} 环境...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;"> erp-api-</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">TARGET</span><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 等待健康检查通过</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 等待健康检查...&quot;</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> i</span><span style="color:#C678DD;"> in</span><span style="color:#ABB2BF;"> $(</span><span style="color:#61AFEF;">seq</span><span style="color:#D19A66;"> 1</span><span style="color:#D19A66;"> 30</span><span style="color:#ABB2BF;">); </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#E06C75;">  health</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> inspect</span><span style="color:#D19A66;"> --format=</span><span style="color:#98C379;">&#39;{{.State.Health.Status}}&#39;</span><span style="color:#98C379;"> erp-api-</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">TARGET</span><span style="color:#ABB2BF;">} 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;starting&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">  if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$health</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;healthy&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✅ \${</span><span style="color:#E06C75;">TARGET</span><span style="color:#98C379;">} 环境健康&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    break</span></span>
<span class="line"><span style="color:#C678DD;">  fi</span></span>
<span class="line"><span style="color:#C678DD;">  if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$i</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;30&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;❌ \${</span><span style="color:#E06C75;">TARGET</span><span style="color:#98C379;">} 环境健康检查超时&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> stop</span><span style="color:#98C379;"> erp-api-</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">TARGET</span><span style="color:#ABB2BF;">}</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">  fi</span></span>
<span class="line"><span style="color:#61AFEF;">  sleep</span><span style="color:#D19A66;"> 5</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 切换流量</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 切换流量到 \${</span><span style="color:#E06C75;">TARGET</span><span style="color:#98C379;">} 环境...&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 更新 Nginx 配置</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$TARGET</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;green&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">  sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &#39;s/server erp-api-blue:8080;/# server erp-api-blue:8080;/&#39;</span><span style="color:#98C379;"> nginx-blue-green.conf</span></span>
<span class="line"><span style="color:#61AFEF;">  sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &#39;s/# server erp-api-green:8080;/server erp-api-green:8080;/&#39;</span><span style="color:#98C379;"> nginx-blue-green.conf</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#61AFEF;">  sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &#39;s/# server erp-api-blue:8080;/server erp-api-blue:8080;/&#39;</span><span style="color:#98C379;"> nginx-blue-green.conf</span></span>
<span class="line"><span style="color:#61AFEF;">  sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &#39;s/server erp-api-green:8080;/# server erp-api-green:8080;/&#39;</span><span style="color:#98C379;"> nginx-blue-green.conf</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重载 Nginx</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> exec</span><span style="color:#98C379;"> nginx</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;✅ 流量已切换到 \${</span><span style="color:#E06C75;">TARGET</span><span style="color:#98C379;">} 环境&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. 验证</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 验证部署...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">sleep</span><span style="color:#D19A66;"> 5</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#61AFEF;"> curl</span><span style="color:#D19A66;"> -sf</span><span style="color:#98C379;"> http://localhost/health</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -q</span><span style="color:#98C379;"> &quot;Healthy&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">  echo</span><span style="color:#98C379;"> &quot;✅ 部署成功！&quot;</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">  echo</span><span style="color:#98C379;"> &quot;❌ 部署验证失败，回滚...&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 回滚</span></span>
<span class="line"><span style="color:#C678DD;">  if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$TARGET</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;green&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">    sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &#39;s/server erp-api-green:8080;/# server erp-api-green:8080;/&#39;</span><span style="color:#98C379;"> nginx-blue-green.conf</span></span>
<span class="line"><span style="color:#61AFEF;">    sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &#39;s/# server erp-api-blue:8080;/server erp-api-blue:8080;/&#39;</span><span style="color:#98C379;"> nginx-blue-green.conf</span></span>
<span class="line"><span style="color:#C678DD;">  fi</span></span>
<span class="line"><span style="color:#61AFEF;">  docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> exec</span><span style="color:#98C379;"> nginx</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#56B6C2;">  echo</span><span style="color:#98C379;"> &quot;✅ 已回滚到 \${</span><span style="color:#E06C75;">CURRENT</span><span style="color:#98C379;">} 环境&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">  exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 6. 停止旧环境（观察期后执行）</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 旧环境 \${</span><span style="color:#E06C75;">CURRENT</span><span style="color:#98C379;">} 保留运行，稍后手动停止&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;运行以下命令停止旧环境：&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;  docker compose stop erp-api-\${</span><span style="color:#E06C75;">CURRENT</span><span style="color:#98C379;">}&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-金丝雀发布" tabindex="-1"><a class="header-anchor" href="#_7-2-金丝雀发布"><span>7.2 金丝雀发布</span></a></h3>`,4),i(d,{code:`eJxLL0osyFAIceJSAILi0iQIX+ll+8QnO+a+nN3wtH/i0x3NSmBpVCXPV2x+um7W886OZ3PWKJQZIpSAQLBhtFJqUYFuYkGmbpmhTVKRvp2lgarCs62NL9v7lWJR1RphqH3auR5oqhGSwtS8FC4sjoC7E+YOI1R3OCO7wwhstiE2d6AY7+MU7ZeemVeh8GLL/Bd79z6d2/5i4cJYZHkFXV27mvLUzPSMElvLGqBv8cgZ4ZAzqgG6DiwHshwAFld9/Q==`}),o[4]||=n(`<div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># nginx-canary.conf</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> erp_api {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 稳定版本 — 90% 流量（9+9=18 份）</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> erp-api-v1:8080 </span><span style="color:#E06C75;font-style:italic;">weight</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">9</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    server erp-api-v1-replica:8080 </span><span style="color:#E06C75;font-style:italic;">weight</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">9</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 金丝雀版本 — 10% 流量（2 份）</span></span>
<span class="line"><span style="color:#ABB2BF;">    server erp-api-v2:8080 </span><span style="color:#E06C75;font-style:italic;">weight</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">2</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">server {</span></span>
<span class="line"><span style="color:#ABB2BF;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">erp.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://erp_api;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># canary-deploy.sh — 金丝雀发布脚本</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -e</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">CANARY_WEIGHT</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">10</span><span style="color:#7F848E;font-style:italic;">  # 初始金丝雀流量百分比</span></span>
<span class="line"><span style="color:#E06C75;">MAX_WEIGHT</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">100</span><span style="color:#7F848E;font-style:italic;">    # 最终目标</span></span>
<span class="line"><span style="color:#E06C75;">STEP</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">20</span><span style="color:#7F848E;font-style:italic;">           # 每步增加的流量百分比</span></span>
<span class="line"><span style="color:#E06C75;">STABLE_VERSION</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;v1.0.0&quot;</span></span>
<span class="line"><span style="color:#E06C75;">CANARY_VERSION</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;v2.0.0&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== 金丝雀发布: \${</span><span style="color:#E06C75;">CANARY_VERSION</span><span style="color:#98C379;">} ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 拉取金丝雀镜像</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> pull</span><span style="color:#98C379;"> harbor.example.com/erp-system/erp-api:</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">CANARY_VERSION</span><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 启动金丝雀容器</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> run</span><span style="color:#D19A66;"> -d</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --name</span><span style="color:#98C379;"> erp-api-canary</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --network</span><span style="color:#98C379;"> erp-network</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">  harbor.example.com/erp-system/erp-api:</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">CANARY_VERSION</span><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 逐步增加金丝雀流量</span></span>
<span class="line"><span style="color:#E06C75;">current_weight</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">CANARY_WEIGHT</span><span style="color:#ABB2BF;">}</span></span>
<span class="line"><span style="color:#C678DD;">while</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$current_weight</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> -le</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$MAX_WEIGHT</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#E06C75;">  stable_weight</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$((</span><span style="color:#61AFEF;">100</span><span style="color:#98C379;"> -</span><span style="color:#98C379;"> current_weight</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">  echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 金丝雀流量: \${</span><span style="color:#E06C75;">current_weight</span><span style="color:#98C379;">}% / 稳定流量: \${</span><span style="color:#E06C75;">stable_weight</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 更新 Nginx weight 配置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ... (动态更新 upstream 配置)</span></span>
<span class="line"><span style="color:#61AFEF;">  docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> exec</span><span style="color:#98C379;"> nginx</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 观察期</span></span>
<span class="line"><span style="color:#56B6C2;">  echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 观察期 5 分钟...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">  sleep</span><span style="color:#D19A66;"> 300</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 检查金丝雀版本错误率</span></span>
<span class="line"><span style="color:#E06C75;">  error_rate</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> http://localhost:8080/metrics</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">    grep</span><span style="color:#98C379;"> &#39;http_requests_failed_total{version=&quot;v2&quot;}&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">    awk</span><span style="color:#98C379;"> &#39;{print $2}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">  if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$error_rate</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> -gt</span><span style="color:#D19A66;"> 5</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;❌ 金丝雀错误率过高 (\${</span><span style="color:#E06C75;">error_rate</span><span style="color:#98C379;">}%)，回滚！&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 回滚：移除金丝雀容器，恢复 100% 稳定流量</span></span>
<span class="line"><span style="color:#61AFEF;">    docker</span><span style="color:#98C379;"> stop</span><span style="color:#98C379;"> erp-api-canary</span></span>
<span class="line"><span style="color:#61AFEF;">    docker</span><span style="color:#98C379;"> rm</span><span style="color:#98C379;"> erp-api-canary</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 恢复 Nginx 配置</span></span>
<span class="line"><span style="color:#61AFEF;">    docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> exec</span><span style="color:#98C379;"> nginx</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">  fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">  if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$current_weight</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> -eq</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$MAX_WEIGHT</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✅ 金丝雀发布完成！&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    break</span></span>
<span class="line"><span style="color:#C678DD;">  fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 增加流量</span></span>
<span class="line"><span style="color:#E06C75;">  current_weight</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$((</span><span style="color:#61AFEF;">current_weight</span><span style="color:#98C379;"> +</span><span style="color:#98C379;"> STEP</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">  if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$current_weight</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> -gt</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$MAX_WEIGHT</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#E06C75;">    current_weight</span><span style="color:#56B6C2;">=</span><span style="color:#E06C75;">$MAX_WEIGHT</span></span>
<span class="line"><span style="color:#C678DD;">  fi</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 清理旧版本</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> stop</span><span style="color:#98C379;"> erp-api-stable</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> rm</span><span style="color:#98C379;"> erp-api-stable</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="八、滚动更新策略" tabindex="-1"><a class="header-anchor" href="#八、滚动更新策略"><span>八、滚动更新策略</span></a></h2><h3 id="_8-1-docker-compose-滚动更新" tabindex="-1"><a class="header-anchor" href="#_8-1-docker-compose-滚动更新"><span>8.1 Docker Compose 滚动更新</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># docker-compose.yml — 滚动更新配置</span></span>
<span class="line"><span style="color:#E06C75;">version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;3.8&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  erp-api</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">harbor.example.com/erp-system/erp-api:\${IMAGE_TAG:-latest}</span></span>
<span class="line"><span style="color:#E06C75;">    deploy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      replicas</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">4</span></span>
<span class="line"><span style="color:#E06C75;">      update_config</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        parallelism</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">1</span><span style="color:#7F848E;font-style:italic;">         # 每次更新1个副本</span></span>
<span class="line"><span style="color:#E06C75;">        delay</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">30s</span><span style="color:#7F848E;font-style:italic;">             # 每次更新间隔30秒</span></span>
<span class="line"><span style="color:#E06C75;">        failure_action</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">rollback</span><span style="color:#7F848E;font-style:italic;">  # 失败时回滚</span></span>
<span class="line"><span style="color:#E06C75;">        monitor</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">60s</span><span style="color:#7F848E;font-style:italic;">           # 更新后观察60秒</span></span>
<span class="line"><span style="color:#E06C75;">        order</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">start-first</span><span style="color:#7F848E;font-style:italic;">     # 先启动新容器再停旧容器</span></span>
<span class="line"><span style="color:#E06C75;">      rollback_config</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        parallelism</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">0</span><span style="color:#7F848E;font-style:italic;">         # 回滚时同时更新所有副本</span></span>
<span class="line"><span style="color:#E06C75;">        order</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">stop-first</span><span style="color:#7F848E;font-style:italic;">      # 先停旧容器再启动新容器</span></span>
<span class="line"><span style="color:#E06C75;">      restart_policy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">on-failure</span></span>
<span class="line"><span style="color:#E06C75;">        delay</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5s</span></span>
<span class="line"><span style="color:#E06C75;">        max_attempts</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;curl&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;-f&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://localhost:8080/health&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">      start_period</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">15s</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 滚动更新</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span><span style="color:#D19A66;"> --no-deps</span><span style="color:#D19A66;"> --build</span><span style="color:#98C379;"> erp-api</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 指定并行度</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span><span style="color:#D19A66;"> --no-deps</span><span style="color:#98C379;"> erp-api</span><span style="color:#D19A66;"> --scale</span><span style="color:#98C379;"> erp-api=</span><span style="color:#D19A66;">4</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Docker Swarm 滚动更新</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> service</span><span style="color:#98C379;"> update</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --image</span><span style="color:#98C379;"> harbor.example.com/erp-system/erp-api:v2.0.0</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --update-parallelism</span><span style="color:#D19A66;"> 1</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --update-delay</span><span style="color:#98C379;"> 30s</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --update-failure-action</span><span style="color:#98C379;"> rollback</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --update-monitor</span><span style="color:#98C379;"> 60s</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">  erp_api</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-2-滚动更新流程" tabindex="-1"><a class="header-anchor" href="#_8-2-滚动更新流程"><span>8.2 滚动更新流程</span></a></h3>`,8),i(d,{code:`eJy1kDFPg0AYhnd+xY06QMKNDF3owKST7Be4FKIFBGriJlOpSWMnB200wZI41LSamiYy+Ge8a/0XHncaaDDWpUwk7/O93/NdhE972LNw20WdEHUlwL4AhbFruQHyYnAYRABFYP0+WhWLRtr2rWMcloD4awCmWoZnKiCDGR1PP4ppE4EcgX8ghl4iJMnJ25I+XND7XOIMk5NbLbFaA7aQsfxu4EcY9AIg22CPXs9Xg5QV7/MRAbMpE2qAjGbk8rHarXLEhCw2dBbXFiqKwkNDl2srDYxOYudc2FTVajk7pk9ZdbmoPvBjDEK348QaoK/JZ/+KLF9I2qfDjKTzush2Wbg7WVH9X1koGln5hgSZPK8XOY+2ijZljzznW/cn33yM2zta3FQOv1DsLppkZDKs7uIU9mzpC82EKvA=`}),o[5]||=n(`<hr><h2 id="九、回滚机制" tabindex="-1"><a class="header-anchor" href="#九、回滚机制"><span>九、回滚机制</span></a></h2><h3 id="_9-1-镜像标签回滚" tabindex="-1"><a class="header-anchor" href="#_9-1-镜像标签回滚"><span>9.1 镜像标签回滚</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 方式1：切换镜像标签</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 当前运行 v2.0.0，回滚到 v1.0.0</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> stop</span><span style="color:#98C379;"> erp-api</span></span>
<span class="line"><span style="color:#E06C75;">IMAGE_TAG</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">v1.0.0</span><span style="color:#61AFEF;"> docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;"> erp-api</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方式2：使用 digest 精确回滚</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> run</span><span style="color:#D19A66;"> -d</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --name</span><span style="color:#98C379;"> erp-api</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">  harbor.example.com/erp-system/erp-api@sha256:abc123...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方式3：Docker Swarm 回滚</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> service</span><span style="color:#98C379;"> rollback</span><span style="color:#98C379;"> erp_api</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看回滚历史</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> service</span><span style="color:#98C379;"> inspect</span><span style="color:#98C379;"> erp_api</span><span style="color:#D19A66;"> --format=</span><span style="color:#98C379;">&#39;{{.PreviousSpec}}&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-2-自动回滚脚本" tabindex="-1"><a class="header-anchor" href="#_9-2-自动回滚脚本"><span>9.2 自动回滚脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># auto-rollback.sh — 基于健康检查的自动回滚</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -e</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">NEW_VERSION</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">\${1}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#E06C75;">OLD_VERSION</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> inspect</span><span style="color:#D19A66;"> --format=</span><span style="color:#98C379;">&#39;{{.Config.Image}}&#39;</span><span style="color:#98C379;"> erp-api</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F:</span><span style="color:#98C379;"> &#39;{print $NF}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">MAX_RETRIES</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">10</span></span>
<span class="line"><span style="color:#E06C75;">HEALTH_CHECK_URL</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;http://localhost:8080/health&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== 部署新版本: \${</span><span style="color:#E06C75;">NEW_VERSION</span><span style="color:#98C379;">} ===&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== 当前版本: \${</span><span style="color:#E06C75;">OLD_VERSION</span><span style="color:#98C379;">} ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 更新镜像</span></span>
<span class="line"><span style="color:#E06C75;">IMAGE_TAG</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">NEW_VERSION</span><span style="color:#ABB2BF;">} </span><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span><span style="color:#D19A66;"> --no-deps</span><span style="color:#98C379;"> erp-api</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 等待启动</span></span>
<span class="line"><span style="color:#61AFEF;">sleep</span><span style="color:#D19A66;"> 10</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 健康检查循环</span></span>
<span class="line"><span style="color:#E06C75;">fail_count</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">0</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> i</span><span style="color:#C678DD;"> in</span><span style="color:#ABB2BF;"> $(</span><span style="color:#61AFEF;">seq</span><span style="color:#D19A66;"> 1</span><span style="color:#E06C75;"> $MAX_RETRIES</span><span style="color:#ABB2BF;">); </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#E06C75;">  health_status</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -sf</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">HEALTH_CHECK_URL</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">jq</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> &#39;.status&#39;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Unhealthy&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">  if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$health_status</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;Healthy&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✅ 新版本 \${</span><span style="color:#E06C75;">NEW_VERSION</span><span style="color:#98C379;">} 健康检查通过&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">  fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  fail_count</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$((</span><span style="color:#61AFEF;">fail_count</span><span style="color:#98C379;"> +</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#56B6C2;">  echo</span><span style="color:#98C379;"> &quot;⚠️ 健康检查失败 (\${</span><span style="color:#E06C75;">fail_count</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">MAX_RETRIES</span><span style="color:#98C379;">}): \${</span><span style="color:#E06C75;">health_status</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">  sleep</span><span style="color:#D19A66;"> 10</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 回滚</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;❌ 健康检查持续失败，自动回滚到 \${</span><span style="color:#E06C75;">OLD_VERSION</span><span style="color:#98C379;">}...&quot;</span></span>
<span class="line"><span style="color:#E06C75;">IMAGE_TAG</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">OLD_VERSION</span><span style="color:#ABB2BF;">} </span><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span><span style="color:#D19A66;"> --no-deps</span><span style="color:#98C379;"> erp-api</span></span>
<span class="line"><span style="color:#61AFEF;">sleep</span><span style="color:#D19A66;"> 10</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证回滚</span></span>
<span class="line"><span style="color:#E06C75;">rollback_health</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -sf</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">HEALTH_CHECK_URL</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">jq</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> &#39;.status&#39;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Unknown&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$rollback_health</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;Healthy&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">  echo</span><span style="color:#98C379;"> &quot;✅ 回滚成功，旧版本 \${</span><span style="color:#E06C75;">OLD_VERSION</span><span style="color:#98C379;">} 恢复正常&quot;</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">  echo</span><span style="color:#98C379;"> &quot;❌ 回滚后健康检查也失败！需要人工介入！&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">  exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十、-net-应用-ci-cd-完整流水线" tabindex="-1"><a class="header-anchor" href="#十、-net-应用-ci-cd-完整流水线"><span>十、.NET 应用 CI/CD 完整流水线</span></a></h2><h3 id="_10-1-完整流水线架构" tabindex="-1"><a class="header-anchor" href="#_10-1-完整流水线架构"><span>10.1 完整流水线架构</span></a></h3>`,9),i(d,{code:`eJx1Ustu00AU3ecrRt4HfgBFapLm1SaNoLsRCztxXavBrsZ2RaUuEoVAQkmdLiIQQYGqjYiKcAGlRSQt/ExnbP8FzrWFLdPO4syd+zpzz4xE+N1ttJlOIG9phuCfudvFqf2p5b67YtYlB7HlWsH0uknNY6fZYebgdn7mpz39l5DG1ceIdkd0MfedolJPxFpniijeN4MDQnbaZB8njwTyMFVXdUXU0ZZKnvE6Sib3RCJv7ScVNVnb5hVJ1LiQNos52h/STptdHjoXw2i9Lmp6JHMVcxUj7/mpdeJYJ9HMhqzpaJev7fCSuOQzGopIeKEhRspzmGPjF9507vADbZtBeW1HJEgw5Eb9ub8FFXcMT60e7Uzj8+fxJpH39hG7NtlszHpfmGmGpIUg6nb69o0VjxZxRtVkSUH219900L9f9ux/spcwO5q6zZY/DO1+QwWeCCoJm69htz21b36gJzovyYoURtaxO3rJugNf8dBfxlxQUiVq3ajpsqqATKx3SF9PPdlZ79f9+jh/BvZiFr9oBdPWhM5/+t8jJNvA9uiYHX12z984F5FvWMWc8+p8STcas8V74Kdn353ZhL29ipOveI+dQmnADGAWcBUwBzk5sPOABcAiYAmiJbDXANcBy+Avg10B3ACPZz9Ipg78uxygauIvl5pNdQ==`}),o[6]||=n(`<h3 id="_10-2-完整-github-actions-workflow" tabindex="-1"><a class="header-anchor" href="#_10-2-完整-github-actions-workflow"><span>10.2 完整 GitHub Actions Workflow</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># .github/workflows/dotnet-docker-cicd.yml</span></span>
<span class="line"><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">.NET Docker CI/CD</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  push</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    branches</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">main</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">develop</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">    tags</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;v*&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">  pull_request</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    branches</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">main</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">env</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  REGISTRY</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">harbor.example.com</span></span>
<span class="line"><span style="color:#E06C75;">  PROJECT</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">erp-system</span></span>
<span class="line"><span style="color:#E06C75;">  IMAGE_NAME</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">erp-api</span></span>
<span class="line"><span style="color:#E06C75;">  DOTNET_VERSION</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;8.0.x&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">jobs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ===== 代码质量 =====</span></span>
<span class="line"><span style="color:#E06C75;">  lint</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    runs-on</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ubuntu-latest</span></span>
<span class="line"><span style="color:#E06C75;">    steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">actions/checkout@v4</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">actions/setup-dotnet@v4</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          dotnet-version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ env.DOTNET_VERSION }}</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">run</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">dotnet format --verify-no-changes --severity warn</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ===== 测试 =====</span></span>
<span class="line"><span style="color:#E06C75;">  test</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    runs-on</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ubuntu-latest</span></span>
<span class="line"><span style="color:#E06C75;">    steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">actions/checkout@v4</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">actions/setup-dotnet@v4</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          dotnet-version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ env.DOTNET_VERSION }}</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">run</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">dotnet restore</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">run</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">dotnet build --configuration Release --no-restore</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">run</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          dotnet test \\</span></span>
<span class="line"><span style="color:#98C379;">            --configuration Release \\</span></span>
<span class="line"><span style="color:#98C379;">            --no-build \\</span></span>
<span class="line"><span style="color:#98C379;">            --logger &quot;trx;LogFileName=test-results.trx&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">            --collect:&quot;XPlat Code Coverage&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">            --results-directory ./test-results</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">actions/upload-artifact@v4</span></span>
<span class="line"><span style="color:#E06C75;">        if</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">always()</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">test-results</span></span>
<span class="line"><span style="color:#E06C75;">          path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">./test-results</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ===== 安全审计 =====</span></span>
<span class="line"><span style="color:#E06C75;">  audit</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    runs-on</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ubuntu-latest</span></span>
<span class="line"><span style="color:#E06C75;">    steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">actions/checkout@v4</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">actions/setup-dotnet@v4</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          dotnet-version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ env.DOTNET_VERSION }}</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">run</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          dotnet restore</span></span>
<span class="line"><span style="color:#98C379;">          dotnet list package --vulnerable --include-transitive</span></span>
<span class="line"><span style="color:#98C379;">          dotnet list package --deprecated</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ===== 构建与推送 =====</span></span>
<span class="line"><span style="color:#E06C75;">  build</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    needs</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">lint</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">test</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">audit</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">    runs-on</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ubuntu-latest</span></span>
<span class="line"><span style="color:#E06C75;">    permissions</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      contents</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">read</span></span>
<span class="line"><span style="color:#E06C75;">      packages</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">write</span></span>
<span class="line"><span style="color:#E06C75;">      id-token</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">write</span></span>
<span class="line"><span style="color:#E06C75;">    outputs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      image_digest</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ steps.build.outputs.digest }}</span></span>
<span class="line"><span style="color:#E06C75;">      image_tags</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ steps.meta.outputs.tags }}</span></span>
<span class="line"><span style="color:#E06C75;">    steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">actions/checkout@v4</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Docker Meta</span></span>
<span class="line"><span style="color:#E06C75;">        id</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">meta</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/metadata-action@v5</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          images</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ env.REGISTRY }}/\${{ env.PROJECT }}/\${{ env.IMAGE_NAME }}</span></span>
<span class="line"><span style="color:#E06C75;">          tags</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">            type=sha,prefix=</span></span>
<span class="line"><span style="color:#98C379;">            type=semver,pattern={{version}}</span></span>
<span class="line"><span style="color:#98C379;">            type=semver,pattern={{major}}.{{minor}}</span></span>
<span class="line"><span style="color:#98C379;">            type=ref,event=branch</span></span>
<span class="line"><span style="color:#98C379;">            type=raw,value=latest,enable=\${{ github.ref == &#39;refs/heads/main&#39; }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Set up QEMU</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/setup-qemu-action@v3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Set up Docker Buildx</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/setup-buildx-action@v3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Login to Harbor</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/login-action@v3</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          registry</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ env.REGISTRY }}</span></span>
<span class="line"><span style="color:#E06C75;">          username</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ secrets.HARBOR_USERNAME }}</span></span>
<span class="line"><span style="color:#E06C75;">          password</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ secrets.HARBOR_PASSWORD }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Build and Push</span></span>
<span class="line"><span style="color:#E06C75;">        id</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">build</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/build-push-action@v5</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          context</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">.</span></span>
<span class="line"><span style="color:#E06C75;">          file</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">src/ERP.Api/Dockerfile</span></span>
<span class="line"><span style="color:#E06C75;">          push</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">          tags</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ steps.meta.outputs.tags }}</span></span>
<span class="line"><span style="color:#E06C75;">          labels</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ steps.meta.outputs.labels }}</span></span>
<span class="line"><span style="color:#E06C75;">          platforms</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">linux/amd64,linux/arm64</span></span>
<span class="line"><span style="color:#E06C75;">          cache-from</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">type=gha</span></span>
<span class="line"><span style="color:#E06C75;">          cache-to</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">type=gha,mode=max</span></span>
<span class="line"><span style="color:#E06C75;">          build-args</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">            BUILD_VERSION=\${{ github.ref_name }}</span></span>
<span class="line"><span style="color:#98C379;">            GIT_SHA=\${{ github.sha }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ===== 安全扫描 =====</span></span>
<span class="line"><span style="color:#E06C75;">  scan</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    needs</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">build</span></span>
<span class="line"><span style="color:#E06C75;">    runs-on</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ubuntu-latest</span></span>
<span class="line"><span style="color:#E06C75;">    steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Trivy Image Scan</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">aquasecurity/trivy-action@master</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          image-ref</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ env.REGISTRY }}/\${{ env.PROJECT }}/\${{ env.IMAGE_NAME }}@\${{ needs.build.outputs.image_digest }}</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;HIGH,CRITICAL&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          exit-code</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          format</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;table&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Trivy Config Scan</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">aquasecurity/trivy-action@master</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          scan-type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;config&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          scan-ref</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;.&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;HIGH,CRITICAL&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          exit-code</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ===== 镜像签名 =====</span></span>
<span class="line"><span style="color:#E06C75;">  sign</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    needs</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">build</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">scan</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">    runs-on</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ubuntu-latest</span></span>
<span class="line"><span style="color:#E06C75;">    steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">sigstore/cosign-installer@v3</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/login-action@v3</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          registry</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ env.REGISTRY }}</span></span>
<span class="line"><span style="color:#E06C75;">          username</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ secrets.HARBOR_USERNAME }}</span></span>
<span class="line"><span style="color:#E06C75;">          password</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ secrets.HARBOR_PASSWORD }}</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">run</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          cosign sign --yes \\</span></span>
<span class="line"><span style="color:#98C379;">            \${{ env.REGISTRY }}/\${{ env.PROJECT }}/\${{ env.IMAGE_NAME }}@\${{ needs.build.outputs.image_digest }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ===== 部署 Staging =====</span></span>
<span class="line"><span style="color:#E06C75;">  deploy-staging</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    needs</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">sign</span></span>
<span class="line"><span style="color:#E06C75;">    runs-on</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ubuntu-latest</span></span>
<span class="line"><span style="color:#E06C75;">    if</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">github.ref == &#39;refs/heads/main&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">staging</span></span>
<span class="line"><span style="color:#E06C75;">      url</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://staging.erp.example.com</span></span>
<span class="line"><span style="color:#E06C75;">    steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Deploy</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          ssh deploy@staging.example.com &lt;&lt; &#39;DEPLOY_EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">            cd /opt/apps/erp</span></span>
<span class="line"><span style="color:#98C379;">            export IMAGE_TAG=\${{ needs.build.outputs.image_digest }}</span></span>
<span class="line"><span style="color:#98C379;">            docker compose pull erp-api</span></span>
<span class="line"><span style="color:#98C379;">            docker compose up -d --no-deps --remove-orphans erp-api</span></span>
<span class="line"><span style="color:#98C379;">          DEPLOY_EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Smoke Test</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          for i in $(seq 1 20); do</span></span>
<span class="line"><span style="color:#98C379;">            status=$(curl -sf https://staging.erp.example.com/health | jq -r &#39;.status&#39; 2&gt;/dev/null || echo &quot;unknown&quot;)</span></span>
<span class="line"><span style="color:#98C379;">            if [ &quot;$status&quot; = &quot;Healthy&quot; ]; then</span></span>
<span class="line"><span style="color:#98C379;">              echo &quot;Staging deployment healthy&quot;</span></span>
<span class="line"><span style="color:#98C379;">              exit 0</span></span>
<span class="line"><span style="color:#98C379;">            fi</span></span>
<span class="line"><span style="color:#98C379;">            sleep 10</span></span>
<span class="line"><span style="color:#98C379;">          done</span></span>
<span class="line"><span style="color:#98C379;">          echo &quot;Staging health check failed&quot;</span></span>
<span class="line"><span style="color:#98C379;">          exit 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ===== 部署 Production =====</span></span>
<span class="line"><span style="color:#E06C75;">  deploy-production</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    needs</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">sign</span></span>
<span class="line"><span style="color:#E06C75;">    runs-on</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ubuntu-latest</span></span>
<span class="line"><span style="color:#E06C75;">    if</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">startsWith(github.ref, &#39;refs/tags/v&#39;)</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">      url</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://erp.example.com</span></span>
<span class="line"><span style="color:#E06C75;">    steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Deploy</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          ssh deploy@prod.example.com &lt;&lt; &#39;DEPLOY_EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">            cd /opt/apps/erp</span></span>
<span class="line"><span style="color:#98C379;">            export IMAGE_TAG=\${{ needs.build.outputs.image_digest }}</span></span>
<span class="line"><span style="color:#98C379;">            docker compose -f docker-compose.prod.yml pull erp-api</span></span>
<span class="line"><span style="color:#98C379;">            docker compose -f docker-compose.prod.yml up -d --no-deps --remove-orphans erp-api</span></span>
<span class="line"><span style="color:#98C379;">          DEPLOY_EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Health Check</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          for i in $(seq 1 30); do</span></span>
<span class="line"><span style="color:#98C379;">            status=$(curl -sf https://erp.example.com/health | jq -r &#39;.status&#39; 2&gt;/dev/null || echo &quot;unknown&quot;)</span></span>
<span class="line"><span style="color:#98C379;">            if [ &quot;$status&quot; = &quot;Healthy&quot; ]; then</span></span>
<span class="line"><span style="color:#98C379;">              echo &quot;Production deployment healthy&quot;</span></span>
<span class="line"><span style="color:#98C379;">              exit 0</span></span>
<span class="line"><span style="color:#98C379;">            fi</span></span>
<span class="line"><span style="color:#98C379;">            sleep 10</span></span>
<span class="line"><span style="color:#98C379;">          done</span></span>
<span class="line"><span style="color:#98C379;">          echo &quot;Production health check failed - triggering rollback&quot;</span></span>
<span class="line"><span style="color:#98C379;">          exit 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Rollback on Failure</span></span>
<span class="line"><span style="color:#E06C75;">        if</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">failure()</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          ssh deploy@prod.example.com &lt;&lt; &#39;ROLLBACK_EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">            cd /opt/apps/erp</span></span>
<span class="line"><span style="color:#98C379;">            export IMAGE_TAG=$(cat /opt/apps/erp/.previous-version)</span></span>
<span class="line"><span style="color:#98C379;">            docker compose -f docker-compose.prod.yml up -d --no-deps erp-api</span></span>
<span class="line"><span style="color:#98C379;">          ROLLBACK_EOF</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十一、安全扫描集成" tabindex="-1"><a class="header-anchor" href="#十一、安全扫描集成"><span>十一、安全扫描集成</span></a></h2><h3 id="_11-1-trivy-in-ci" tabindex="-1"><a class="header-anchor" href="#_11-1-trivy-in-ci"><span>11.1 Trivy in CI</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># GitHub Actions — Trivy 扫描</span></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Trivy Image Scan</span></span>
<span class="line"><span style="color:#E06C75;">  uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">aquasecurity/trivy-action@master</span></span>
<span class="line"><span style="color:#E06C75;">  with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image-ref</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;\${{ env.REGISTRY }}/\${{ env.PROJECT }}/\${{ env.IMAGE_NAME }}:\${{ github.sha }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;HIGH,CRITICAL&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    exit-code</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1&quot;</span><span style="color:#7F848E;font-style:italic;">    # 发现高危漏洞时 CI 失败</span></span>
<span class="line"><span style="color:#E06C75;">    format</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;table&quot;</span><span style="color:#7F848E;font-style:italic;">   # 控制台输出</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 同时生成 SARIF 上传到 GitHub Security</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # format: &quot;sarif&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # output: &quot;trivy-results.sarif&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Upload SARIF</span></span>
<span class="line"><span style="color:#E06C75;">  if</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">always()</span></span>
<span class="line"><span style="color:#E06C75;">  uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">github/codeql-action/upload-sarif@v3</span></span>
<span class="line"><span style="color:#E06C75;">  with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    sarif_file</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">trivy-results.sarif</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-2-trivy-忽略策略" tabindex="-1"><a class="header-anchor" href="#_11-2-trivy-忽略策略"><span>11.2 Trivy 忽略策略</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># .trivyignore.yaml — 已知豁免</span></span>
<span class="line"><span style="color:#E06C75;">vulnerabilities</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">id</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">CVE-2023-44487</span></span>
<span class="line"><span style="color:#E06C75;">    reason</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;HTTP/2 Rapid Reset — 已通过 Nginx 限流缓解&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    until</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">2026-12-31</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">id</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">CVE-2024-XXXXX</span></span>
<span class="line"><span style="color:#E06C75;">    reason</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;Alpine 基础镜像漏洞，等待上游更新&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    until</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">2026-09-01</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">misconfigurations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">id</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">AVD-DV-0001</span></span>
<span class="line"><span style="color:#E06C75;">    reason</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;开发环境使用，生产已加固&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-3-docker-scout" tabindex="-1"><a class="header-anchor" href="#_11-3-docker-scout"><span>11.3 Docker Scout</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># GitHub Actions — Docker Scout</span></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Docker Scout</span></span>
<span class="line"><span style="color:#E06C75;">  uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/scout-action@v1</span></span>
<span class="line"><span style="color:#E06C75;">  with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    command</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">cves</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;\${{ env.REGISTRY }}/\${{ env.PROJECT }}/\${{ env.IMAGE_NAME }}:\${{ github.sha }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    sarif-file</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">scout-results.sarif</span></span>
<span class="line"><span style="color:#E06C75;">    summary</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-4-安全扫描门禁策略" tabindex="-1"><a class="header-anchor" href="#_11-4-安全扫描门禁策略"><span>11.4 安全扫描门禁策略</span></a></h3><table><thead><tr><th>严重级别</th><th>CI 行为</th><th>说明</th></tr></thead><tbody><tr><td>Critical</td><td><code>exit-code: 1</code>（阻断）</td><td>必须修复</td></tr><tr><td>High</td><td><code>exit-code: 1</code>（阻断）</td><td>必须修复或豁免</td></tr><tr><td>Medium</td><td>仅报告</td><td>记录跟踪</td></tr><tr><td>Low</td><td>仅报告</td><td>记录跟踪</td></tr></tbody></table><div class="hint-container tip"><p class="hint-container-title">安全扫描实践</p><ol><li>CI 中仅阻断 Critical 和 High，避免中等漏洞阻断发布节奏</li><li>使用 <code>.trivyignore.yaml</code> 记录每个豁免的原因和有效期</li><li>定期（每周）审查豁免列表，清理过期的豁免</li><li>在 Staging 环境运行完整扫描（含 Medium），Production 门控只检查 Critical/High</li><li>镜像推送前扫描，推送后 Harbor 再次自动扫描</li></ol></div><hr><h2 id="十二、实战清单" tabindex="-1"><a class="header-anchor" href="#十二、实战清单"><span>十二、实战清单</span></a></h2><h3 id="_12-1-ci-cd-流水线检查清单" tabindex="-1"><a class="header-anchor" href="#_12-1-ci-cd-流水线检查清单"><span>12.1 CI/CD 流水线检查清单</span></a></h3><div class="hint-container tip"><p class="hint-container-title">流水线建设检查</p><ul class="task-list-container"><li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-0" disabled="disabled"><label class="task-list-item-label" for="task-item-0"> 代码质量检查已集成（lint/format）</label></li><li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-1" disabled="disabled"><label class="task-list-item-label" for="task-item-1"> 单元测试在 Docker 容器中运行</label></li><li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-2" disabled="disabled"><label class="task-list-item-label" for="task-item-2"> 镜像标签策略已制定（SHA + 语义版本）</label></li><li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-3" disabled="disabled"><label class="task-list-item-label" for="task-item-3"> 多架构构建已配置（amd64 + arm64）</label></li><li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-4" disabled="disabled"><label class="task-list-item-label" for="task-item-4"> 构建缓存已启用（GHA/Registry/BuildKit）</label></li><li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-5" disabled="disabled"><label class="task-list-item-label" for="task-item-5"> 安全扫描已集成（Trivy image + config）</label></li><li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-6" disabled="disabled"><label class="task-list-item-label" for="task-item-6"> 镜像签名已配置（Cosign/DCT）</label></li><li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-7" disabled="disabled"><label class="task-list-item-label" for="task-item-7"> 镜像推送到私有仓库（Harbor/ACR）</label></li><li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-8" disabled="disabled"><label class="task-list-item-label" for="task-item-8"> 部署策略已选择（蓝绿/金丝雀/滚动更新）</label></li><li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-9" disabled="disabled"><label class="task-list-item-label" for="task-item-9"> 回滚机制已实现（自动/手动）</label></li><li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-10" disabled="disabled"><label class="task-list-item-label" for="task-item-10"> 健康检查端点已实现</label></li><li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-11" disabled="disabled"><label class="task-list-item-label" for="task-item-11"> 部署后验证已自动化（Smoke Test）</label></li><li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-12" disabled="disabled"><label class="task-list-item-label" for="task-item-12"> 通知已配置（部署成功/失败）</label></li><li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-13" disabled="disabled"><label class="task-list-item-label" for="task-item-13"> Secrets 管理已实施（不硬编码）</label></li><li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-14" disabled="disabled"><label class="task-list-item-label" for="task-item-14"> 流水线超时已设置（避免无限运行）</label></li></ul></div><h3 id="_12-2-常见问题排查" tabindex="-1"><a class="header-anchor" href="#_12-2-常见问题排查"><span>12.2 常见问题排查</span></a></h3><table><thead><tr><th>问题</th><th>原因</th><th>解决方案</th></tr></thead><tbody><tr><td>构建缓慢</td><td>无缓存/层重建</td><td>启用 BuildKit 缓存、优化 Dockerfile 层顺序</td></tr><tr><td>镜像过大</td><td>基础镜像选择不当</td><td>使用 chiseled/alpine 基础镜像</td></tr><tr><td>多架构构建失败</td><td>QEMU 模拟器问题</td><td>检查 binfmt 安装，测试 Dockerfile 在目标架构</td></tr><tr><td>扫描误报</td><td>忽略策略缺失</td><td>配置 <code>.trivyignore.yaml</code></td></tr><tr><td>部署后不健康</td><td>健康检查超时</td><td>增大 <code>start_period</code></td></tr><tr><td>回滚失败</td><td>旧版本镜像已被 GC</td><td>保留最近 N 个版本不清理</td></tr><tr><td>推送失败</td><td>认证/权限问题</td><td>检查机器人账号权限和令牌有效期</td></tr></tbody></table><hr><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2><ul><li><a href="https://docs.github.com/en/actions" target="_blank" rel="noopener noreferrer">GitHub Actions 文档</a></li><li><a href="https://docs.gitlab.com/ee/ci/" target="_blank" rel="noopener noreferrer">GitLab CI/CD 文档</a></li><li><a href="https://docs.docker.com/build/buildx/" target="_blank" rel="noopener noreferrer">Docker Buildx 文档</a></li><li><a href="https://docs.docker.com/build/cache/" target="_blank" rel="noopener noreferrer">BuildKit 缓存文档</a></li><li><a href="https://aquasecurity.github.io/trivy/latest/tutorials/integrations/" target="_blank" rel="noopener noreferrer">Trivy CI 集成</a></li><li><a href="https://docs.sigstore.dev/cosign/signing/signing_with_containers/" target="_blank" rel="noopener noreferrer">Cosign 签名文档</a></li><li><a href="https://github.com/docker/metadata-action" target="_blank" rel="noopener noreferrer">Docker metadata-action</a></li><li><a href="https://github.com/docker/build-push-action" target="_blank" rel="noopener noreferrer">Docker build-push-action</a></li></ul>`,22)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};