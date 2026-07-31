import{M as e,O as t,d as n,h as r,p as i}from"./runtime-core.esm-bundler-jC72uHyJ.js";import{t as a}from"./app-sCRHfVEK.js";var o=JSON.parse(`{"path":"/%E8%BF%90%E7%BB%B4%E4%B8%8E%E9%83%A8%E7%BD%B2/Docker_K8s/07_Kubernetes%E7%94%9F%E4%BA%A7%E5%AE%9E%E6%88%98/02_GitOps%E4%B8%8E%E6%8C%81%E7%BB%AD%E4%BA%A4%E4%BB%98.html","title":"GitOps 与持续交付","lang":"zh-CN","frontmatter":{"title":"GitOps 与持续交付","icon":"rocket","order":2,"category":["Kubernetes生产实战"],"tag":["GitOps","ArgoCD","Flux2","持续交付","渐进式发布"]},"git":{"createdTime":1780623253000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":2}]},"readingTime":{"minutes":19.65,"words":5895},"filePathRelative":"运维与部署/Docker_K8s/07_Kubernetes生产实战/02_GitOps与持续交付.md"}`),s={name:`02_GitOps与持续交付.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),n(`div`,null,[o[0]||=i(`<h1 id="gitops-与持续交付" tabindex="-1"><a class="header-anchor" href="#gitops-与持续交付"><span>GitOps 与持续交付</span></a></h1><h2 id="gitops-概述" tabindex="-1"><a class="header-anchor" href="#gitops-概述"><span>GitOps 概述</span></a></h2><p>GitOps 是一种现代化的持续交付方法，由 Weaveworks 于 2017 年提出，其核心理念是<strong>将 Git 作为基础设施和应用配置的唯一真实来源（Single Source of Truth）</strong>，通过自动化同步机制确保集群状态与 Git 仓库中的声明式配置保持一致。</p><h3 id="gitops-四大原则" tabindex="-1"><a class="header-anchor" href="#gitops-四大原则"><span>GitOps 四大原则</span></a></h3>`,4),r(d,{code:`eJxt0MtOwkAUBuA9TzGpW4m0XhKNMaFt4sKtcTNx0ZapNjZASjVhZ4y3eqEuvBDFC1EjEkGihAQReJozLW9h7QBhwWzPl/P/ZzYsJb2JVsUICl4cc/Bco/kc/LqLqjW1JBPNVCzFNnYIt46i0SUkYs5zjmnhg+be4LgRqjViZYxUkiS49XCNGEoJc/5RGU5KcHFGK6+hjG/bqWgmm9SGVgqtHAS7n1At+tViHyYMW1HNIDbCqvHY+255rcfewbnXrg5rUtf1uzXWLc6kgFe2VWIliU0yCF7evf3GkI9CkcfLho2gkoe9EnV2acFhy/uXMiRgqJ7Rqzq4eXpXh9whuF+jQOIxO5OeOuBeQ7MBP5feZYkZiRkB05unXmGXOqeBRFtBP802kZJOm9lRKPOY5QRd/G7z/086ZQZkBgTst1v0vgN3D7R1OxiFs4ydNQmKI90wzYWJGaIltJlJLWWmrIUJXddHjNg3uj6nzqnjjTQ0ymxMGG/kvpmfJXxiemBisVjkD3Te8XU=`}),o[1]||=i(`<div class="hint-container tip"><p class="hint-container-title">GitOps 的核心价值</p><ol><li><strong>一致性</strong>：所有环境配置存储在 Git 中，环境间差异明确可控</li><li><strong>安全性</strong>：不需要给 CI 系统集群管理员权限，Git 控制变更流程</li><li><strong>可追溯</strong>：每次变更都有 Git commit 记录，支持审计和回滚</li><li><strong>可靠性</strong>：Git 作为唯一真实来源，避免了配置漂移</li><li><strong>协作性</strong>：通过 Pull Request 流程进行变更审批</li></ol></div><h3 id="gitops-vs-传统-ci-cd" tabindex="-1"><a class="header-anchor" href="#gitops-vs-传统-ci-cd"><span>GitOps vs 传统 CI/CD</span></a></h3>`,2),r(d,{code:`eJxLy8kvT85ILCpR8AniUgCC4tKk9KLEggwFpSd7FjzfPV/B2VPf2eX9no6A0uIMhWcrFj7d0/9+T6cSWDEIpGQWpSaXZObnwUwAAWfD6Ce7Fz9f0Pisf8KTXUtiFXR17RScjaKdPRWezWt5untXLEKpEUTSOFopuzQJaFSOQmJBQU6lTVKRvt3LOQ0vljW+nN32fN+Sp+1rX6xvVELSaQzRaRLtbVGsAFEEkU3NS+FC8417Zol/QTHYHzk5RPvDHZs/3JH88XLqnKfN/Qg3uUN8424c/Wz2lmfTNigA7VV42dr7fO86JEUQh7ubREOdpfCsb/nTjm1PZ66A+Bri37bWF+2rnnateDqh59napUgedzeB6DfF4/GSypxUUAilZebkWCmnpZklmSXpJOfn5BeBeGlIioCmQRSZpCanJJsgKwIAhmTK4Q==`}),o[2]||=i(`<table><thead><tr><th>维度</th><th>传统 CI/CD</th><th>GitOps</th></tr></thead><tbody><tr><td><strong>同步模式</strong></td><td>Push（CI 推送到集群）</td><td>Pull（集群内控制器拉取）</td></tr><tr><td><strong>凭证管理</strong></td><td>CI 系统需要集群凭证</td><td>集群内运行，无需外部凭证</td></tr><tr><td><strong>配置来源</strong></td><td>CI 脚本 + 参数</td><td>Git 仓库声明式配置</td></tr><tr><td><strong>变更审计</strong></td><td>CI 日志</td><td>Git 提交历史</td></tr><tr><td><strong>回滚方式</strong></td><td>重新运行 CI 流水线</td><td><code>git revert</code> 即可回滚</td></tr><tr><td><strong>配置漂移</strong></td><td>难以检测</td><td>自动检测并修复</td></tr><tr><td><strong>多集群</strong></td><td>每个集群需要凭证</td><td>集群内控制器自治</td></tr></tbody></table><hr><h2 id="argocd-部署与配置" tabindex="-1"><a class="header-anchor" href="#argocd-部署与配置"><span>ArgoCD 部署与配置</span></a></h2><h3 id="argocd-架构" tabindex="-1"><a class="header-anchor" href="#argocd-架构"><span>ArgoCD 架构</span></a></h3>`,4),r(d,{code:`eJx9Ut9r01AYfd9fccleFC1dh9QxZFAzUOkKYn2RsIc0+dIF7nJDfhQqeXB0UxFWK+3L7HQyBPugqxScszL9Z7xJ81+Ye29qY3XLw71JvnPuPed8X91R7S308PYCSh7Xr4lv6Y7poV/fu3TclXiFPcm/giLRcS/qDeK9/ej85FbNya/dBbydL/uuR7bNx5B/VKpsSJtZ0rIiRe0hPW5lSA0V++DmSAMcrDZTPFj6wpyOklMn8joK2x/o89P4zfFMTen+PSWtJq+oCk5y1ibK5dbQA9BNV7nCNySr2hZcnQliYAGyiSKxNeVyXcy3jIkF6BoKz0bhUTfjZUot2basSMmKTU31TGIhmVieQzBOTwnfndGfLbr/cvK5RQ8GmSPkiiIlYMOsV1Q7XwXNAY9TRNj02afJcEea2rDJRbmU/Ro4Fnjgorj/NPrxPhNMoo7xg6j/inY+Bqi84rKwki2b1L/4cNijw28Ba1nVUz1QWBjh4VF42I9enIZPdi7hbJgNECQhh568jQ/25mlCCTe3DjYmTdAV+nUUtwbR+Sh6vStma/JlNxx35kaCDR+/sZ6Isn2Mg1k+bMYuqvEGc6W8m7TTTu5BbEgD7oKD/tjRTcPImPm76DYtbZpm2g+viUEADBPj1UUwbtwsGtc1gomzumgYRgbGlQjYUlEvqkv/h7GABKpQWFFry1nUb+jlUR8=`}),o[3]||=i(`<h3 id="安装-argocd" tabindex="-1"><a class="header-anchor" href="#安装-argocd"><span>安装 ArgoCD</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 创建命名空间</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> create</span><span style="color:#98C379;"> namespace</span><span style="color:#98C379;"> argocd</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 ArgoCD</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> apply</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> argocd</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  -f</span><span style="color:#98C379;"> https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 HA 模式（生产环境推荐）</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> apply</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> argocd</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  -f</span><span style="color:#98C379;"> https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/ha/install.yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看 Pod 状态</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> get</span><span style="color:#98C379;"> pods</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> argocd</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 获取初始管理员密码</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> argocd</span><span style="color:#98C379;"> get</span><span style="color:#98C379;"> secret</span><span style="color:#98C379;"> argocd-initial-admin-secret</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  -o</span><span style="color:#98C379;"> jsonpath=&quot;{.data.password}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">base64</span><span style="color:#D19A66;"> -d</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 端口转发访问 UI</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> port-forward</span><span style="color:#98C379;"> svc/argocd-server</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> argocd</span><span style="color:#98C379;"> 8080:443</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 ArgoCD CLI</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -sLO</span><span style="color:#98C379;"> https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64</span></span>
<span class="line"><span style="color:#61AFEF;">chmod</span><span style="color:#98C379;"> +x</span><span style="color:#98C379;"> argocd-linux-amd64</span></span>
<span class="line"><span style="color:#61AFEF;">mv</span><span style="color:#98C379;"> argocd-linux-amd64</span><span style="color:#98C379;"> /usr/local/bin/argocd</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 登录</span></span>
<span class="line"><span style="color:#61AFEF;">argocd</span><span style="color:#98C379;"> login</span><span style="color:#98C379;"> localhost:8080</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修改管理员密码</span></span>
<span class="line"><span style="color:#61AFEF;">argocd</span><span style="color:#98C379;"> account</span><span style="color:#98C379;"> update-password</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="argocd-配置" tabindex="-1"><a class="header-anchor" href="#argocd-配置"><span>ArgoCD 配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># argocd-cm ConfigMap - 核心配置</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ConfigMap</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd-cm</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd</span></span>
<span class="line"><span style="color:#E06C75;">data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 仓库配置</span></span>
<span class="line"><span style="color:#E06C75;">  repositories</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">    - url: https://github.com/example/myapp-chart</span></span>
<span class="line"><span style="color:#98C379;">      type: helm</span></span>
<span class="line"><span style="color:#98C379;">      name: myapp-chart</span></span>
<span class="line"><span style="color:#98C379;">    - url: https://charts.bitnami.com/bitnami</span></span>
<span class="line"><span style="color:#98C379;">      type: helm</span></span>
<span class="line"><span style="color:#98C379;">      name: bitnami</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # Helm 仓库配置</span></span>
<span class="line"><span style="color:#E06C75;">  helm.repositories</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">    - url: https://charts.bitnami.com/bitnami</span></span>
<span class="line"><span style="color:#98C379;">      name: bitnami</span></span>
<span class="line"><span style="color:#98C379;">    - url: https://chartmuseum.example.com</span></span>
<span class="line"><span style="color:#98C379;">      name: private</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 资源过滤</span></span>
<span class="line"><span style="color:#E06C75;">  resource.exclusions</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">    - apiGroups:</span></span>
<span class="line"><span style="color:#98C379;">        - tekton.dev</span></span>
<span class="line"><span style="color:#98C379;">      kinds:</span></span>
<span class="line"><span style="color:#98C379;">        - TaskRun</span></span>
<span class="line"><span style="color:#98C379;">        - PipelineRun</span></span>
<span class="line"><span style="color:#98C379;">      clusters:</span></span>
<span class="line"><span style="color:#98C379;">        - &quot;*&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 资源行为自定义</span></span>
<span class="line"><span style="color:#E06C75;">  resource.customizations</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">    networking.k8s.io/Ingress:</span></span>
<span class="line"><span style="color:#98C379;">      ignoreDifferences: |</span></span>
<span class="line"><span style="color:#98C379;">        jsonPointers:</span></span>
<span class="line"><span style="color:#98C379;">          - /metadata/annotations/nginx.ingress.kubernetes.io~1last-reload</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 全局项目设置</span></span>
<span class="line"><span style="color:#E06C75;">  accounts.viewer</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">apiKey</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # SSO/Dex 配置</span></span>
<span class="line"><span style="color:#E06C75;">  url</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://argocd.example.com</span></span>
<span class="line"><span style="color:#E06C75;">  dex.config</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">    connectors:</span></span>
<span class="line"><span style="color:#98C379;">      - type: microsoft</span></span>
<span class="line"><span style="color:#98C379;">        id: microsoft</span></span>
<span class="line"><span style="color:#98C379;">        name: Microsoft</span></span>
<span class="line"><span style="color:#98C379;">        config:</span></span>
<span class="line"><span style="color:#98C379;">          clientId: $MICROSOFT_CLIENT_ID</span></span>
<span class="line"><span style="color:#98C379;">          clientSecret: $MICROSOFT_CLIENT_SECRET</span></span>
<span class="line"><span style="color:#98C379;">          tenant: common</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># argocd-rbac-cm - RBAC 配置</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ConfigMap</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd-rbac-cm</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd</span></span>
<span class="line"><span style="color:#E06C75;">data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  policy.csv</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">    # 项目级权限</span></span>
<span class="line"><span style="color:#98C379;">    p, role:dev-team, applications, get, dev/*, allow</span></span>
<span class="line"><span style="color:#98C379;">    p, role:dev-team, applications, sync, dev/*, allow</span></span>
<span class="line"><span style="color:#98C379;">    p, role:ops-team, applications, *, prod/*, allow</span></span>
<span class="line"><span style="color:#98C379;">    p, role:readonly, applications, get, */*, allow</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">    # 管理员权限</span></span>
<span class="line"><span style="color:#98C379;">    g, admin-team, role:admin</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">    # 开发团队映射</span></span>
<span class="line"><span style="color:#98C379;">    g, dev-team, role:dev-team</span></span>
<span class="line"><span style="color:#98C379;">    g, ops-team, role:ops-team</span></span>
<span class="line"><span style="color:#E06C75;">  policy.default</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">role:readonly</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="仓库凭证" tabindex="-1"><a class="header-anchor" href="#仓库凭证"><span>仓库凭证</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 私有 Git 仓库凭证</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Secret</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">private-repo</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd</span></span>
<span class="line"><span style="color:#E06C75;">  labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    argocd.argoproj.io/secret-type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">repository</span></span>
<span class="line"><span style="color:#E06C75;">stringData</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">git</span></span>
<span class="line"><span style="color:#E06C75;">  url</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://github.com/example/private-repo</span></span>
<span class="line"><span style="color:#E06C75;">  username</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">git-user</span></span>
<span class="line"><span style="color:#E06C75;">  password</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ghp_xxxxxxxxxxxx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Helm OCI 仓库凭证</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Secret</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">helm-oci-repo</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd</span></span>
<span class="line"><span style="color:#E06C75;">  labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    argocd.argoproj.io/secret-type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">repository</span></span>
<span class="line"><span style="color:#E06C75;">stringData</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">helm</span></span>
<span class="line"><span style="color:#E06C75;">  url</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">oci://myregistry.azurecr.io</span></span>
<span class="line"><span style="color:#E06C75;">  username</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">$ACR_USERNAME</span></span>
<span class="line"><span style="color:#E06C75;">  password</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">$ACR_PASSWORD</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="application-与-sync-策略" tabindex="-1"><a class="header-anchor" href="#application-与-sync-策略"><span>Application 与 Sync 策略</span></a></h2><h3 id="application-资源" tabindex="-1"><a class="header-anchor" href="#application-资源"><span>Application 资源</span></a></h3><p>Application 是 ArgoCD 的核心资源，定义了应用的来源、目标集群和同步策略：</p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argoproj.io/v1alpha1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Application</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd</span></span>
<span class="line"><span style="color:#E06C75;">  labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">    team</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">backend</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 通知配置</span></span>
<span class="line"><span style="color:#E06C75;">    notifications.argoproj.io/subscribe.on-deployed.slack</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">releases</span></span>
<span class="line"><span style="color:#E06C75;">    notifications.argoproj.io/subscribe.on-health-degraded.pagerduty</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">alerts</span></span>
<span class="line"><span style="color:#E06C75;">  finalizers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 删除 Application 时同时删除 K8s 资源</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">resources-finalizer.argocd.argoproj.io</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  project</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  source</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    repoURL</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://github.com/example/myapp-gitops.git</span></span>
<span class="line"><span style="color:#E06C75;">    targetRevision</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">main</span></span>
<span class="line"><span style="color:#E06C75;">    path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">charts/myapp</span></span>
<span class="line"><span style="color:#E06C75;">    helm</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      valueFiles</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">values.yaml</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">values-prod.yaml</span></span>
<span class="line"><span style="color:#E06C75;">      parameters</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">image.tag</span></span>
<span class="line"><span style="color:#E06C75;">          value</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v2.0.1</span></span>
<span class="line"><span style="color:#E06C75;">      releaseName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">      skipCrds</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  destination</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    server</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://kubernetes.default.svc</span></span>
<span class="line"><span style="color:#E06C75;">    namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 同步策略</span></span>
<span class="line"><span style="color:#E06C75;">  syncPolicy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    automated</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      prune</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span><span style="color:#7F848E;font-style:italic;">     # 自动删除 Git 中不存在的资源</span></span>
<span class="line"><span style="color:#E06C75;">      selfHeal</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span><span style="color:#7F848E;font-style:italic;">   # 自动修复配置漂移</span></span>
<span class="line"><span style="color:#E06C75;">      allowEmpty</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span><span style="color:#7F848E;font-style:italic;"> # 不允许空应用</span></span>
<span class="line"><span style="color:#E06C75;">    syncOptions</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">CreateNamespace=true</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">ServerSideApply=true</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">PrunePropagationPolicy=foreground</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">PruneLast=true</span></span>
<span class="line"><span style="color:#E06C75;">    retry</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      limit</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">      backoff</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        duration</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5s</span></span>
<span class="line"><span style="color:#E06C75;">        factor</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">2</span></span>
<span class="line"><span style="color:#E06C75;">        maxDuration</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3m</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 忽略差异</span></span>
<span class="line"><span style="color:#E06C75;">  ignoreDifferences</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">group</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">apps</span></span>
<span class="line"><span style="color:#E06C75;">      kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Deployment</span></span>
<span class="line"><span style="color:#E06C75;">      jsonPointers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">/spec/replicas</span><span style="color:#7F848E;font-style:italic;">  # HPA 管理副本数，忽略差异</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 资源健康检查自定义</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # info:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  #   - name: Description</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  #     value: Production .NET application</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="sync-策略详解" tabindex="-1"><a class="header-anchor" href="#sync-策略详解"><span>Sync 策略详解</span></a></h3>`,13),r(d,{code:`eJxtkE1LAkEYx+9+igGvCRLmwUOR769d6jZ4WNYdEhYNNULcICTxHfVgaBEo+RLBbpeEyswvszO7fotsZqAVmtMz8//N75lnkJy9Es+FXAGc+W1gu45hKF0Am0rbWGm4MyAPb0ngcBwCbwl3W0SdGuqd0Z9eU9b7myhm9QU3nlmqAB9ke/J0QxZNbrDQpN600H5oqHX8XWGn5nyGO72kjeI+2jZQyksyCkuCfMR6Bphl8KqAIG+lrzU8aZOvsjFfslYMwt2ZAkJQX1Zwr2Gqsx1xuHSRu8xI3Br+s0Ygro02wwme3Ourobm4JZ9dZmUQtUahvn40+sNdiFJ+qo9BPqg2JqN3dj9Gkzg0yh+4ugSnxYzIgjgNEtsrc3PcYn/DbUEanUB2iLUWqfHXRFhC66ilTvCabvKFoixtJ0ZpWfbYXZKYEl17YlbO5jx2hJCFCXLG6U65Bef/jJ8zCAkHzn0r8wPhVuw6`}),o[4]||=i(`<h3 id="sync-选项" tabindex="-1"><a class="header-anchor" href="#sync-选项"><span>Sync 选项</span></a></h3><table><thead><tr><th>选项</th><th>说明</th></tr></thead><tbody><tr><td><code>CreateNamespace=true</code></td><td>自动创建目标命名空间</td></tr><tr><td><code>ServerSideApply=true</code></td><td>使用 Server-Side Apply，避免大资源冲突</td></tr><tr><td><code>PrunePropagationPolicy=foreground</code></td><td>删除资源时等待子资源先删除</td></tr><tr><td><code>PruneLast=true</code></td><td>先创建新资源再删除旧资源</td></tr><tr><td><code>Replace=true</code></td><td>用 replace 替代 apply（谨慎使用）</td></tr><tr><td><code>Validate=false</code></td><td>跳过 K8s schema 验证</td></tr><tr><td><code>ApplyOutOfSyncOnly=true</code></td><td>仅同步有差异的资源</td></tr></tbody></table><h3 id="手动同步与审批" tabindex="-1"><a class="header-anchor" href="#手动同步与审批"><span>手动同步与审批</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 需要审批的同步策略</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argoproj.io/v1alpha1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Application</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-prod</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  project</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">  source</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    repoURL</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://github.com/example/myapp-gitops.git</span></span>
<span class="line"><span style="color:#E06C75;">    targetRevision</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">main</span></span>
<span class="line"><span style="color:#E06C75;">    path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">overlays/production</span></span>
<span class="line"><span style="color:#E06C75;">  destination</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    server</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://kubernetes.default.svc</span></span>
<span class="line"><span style="color:#E06C75;">    namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">  syncPolicy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    automated</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      prune</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">      selfHeal</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span><span style="color:#7F848E;font-style:italic;">  # 生产环境不自动修复，需审批</span></span>
<span class="line"><span style="color:#E06C75;">    syncOptions</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">CreateNamespace=true</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 手动同步</span></span>
<span class="line"><span style="color:#61AFEF;">argocd</span><span style="color:#98C379;"> app</span><span style="color:#98C379;"> sync</span><span style="color:#98C379;"> myapp-prod</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 仅同步特定资源</span></span>
<span class="line"><span style="color:#61AFEF;">argocd</span><span style="color:#98C379;"> app</span><span style="color:#98C379;"> sync</span><span style="color:#98C379;"> myapp-prod</span><span style="color:#D19A66;"> --resource</span><span style="color:#98C379;"> Deployment:myapp</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 干跑模式</span></span>
<span class="line"><span style="color:#61AFEF;">argocd</span><span style="color:#98C379;"> app</span><span style="color:#98C379;"> sync</span><span style="color:#98C379;"> myapp-prod</span><span style="color:#D19A66;"> --dry-run</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看同步状态</span></span>
<span class="line"><span style="color:#61AFEF;">argocd</span><span style="color:#98C379;"> app</span><span style="color:#98C379;"> get</span><span style="color:#98C379;"> myapp-prod</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看差异</span></span>
<span class="line"><span style="color:#61AFEF;">argocd</span><span style="color:#98C379;"> app</span><span style="color:#98C379;"> diff</span><span style="color:#98C379;"> myapp-prod</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="多环境管理" tabindex="-1"><a class="header-anchor" href="#多环境管理"><span>多环境管理</span></a></h2><h3 id="app-of-apps-模式" tabindex="-1"><a class="header-anchor" href="#app-of-apps-模式"><span>App of Apps 模式</span></a></h3><p>App of Apps 是 ArgoCD 管理多应用和多环境的推荐模式：</p>`,9),r(d,{code:`eJyNkM9qAyEQh+99CjHXSrdpayGUQCEPUNreJAc362wFsyOuLOTt6591a9sE4kGF+fz5zfRO2i/yubshYb0jekHjTl6tNfogvcbhpXV3W2ntyBBYPOmeMLYlOzUJ2qmJqWFKTPWG7pfAxH542euhF3TMl2vevDnsBLVhv0AnPFgUm1C9F8dTUGRBK6f9Lq+FU50ecznVZ7FZsq8iZtMc8x8rUQuWuOi8yFdhsYuc9JcoOZeJB3HEQXt0P9+M/mRUnhRoYzYrBY/PHG4PaNBtVgBQYXEEmWp4x2VzniodZhJAPjXr82TyKxhveVtj3wgku0c=`}),o[5]||=i(`<div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># Root Application</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argoproj.io/v1alpha1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Application</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">apps</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  project</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"><span style="color:#E06C75;">  source</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    repoURL</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://github.com/example/argocd-apps.git</span></span>
<span class="line"><span style="color:#E06C75;">    targetRevision</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">main</span></span>
<span class="line"><span style="color:#E06C75;">    path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">apps</span></span>
<span class="line"><span style="color:#E06C75;">    directory</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      recurse</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">  destination</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    server</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://kubernetes.default.svc</span></span>
<span class="line"><span style="color:#E06C75;">    namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd</span></span>
<span class="line"><span style="color:#E06C75;">  syncPolicy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    automated</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      prune</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">      selfHeal</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span># Git 仓库结构</span></span>
<span class="line"><span>argocd-apps/</span></span>
<span class="line"><span>├── apps/</span></span>
<span class="line"><span>│   └── kustomization.yaml    # 自动发现子目录</span></span>
<span class="line"><span>├── dev/</span></span>
<span class="line"><span>│   ├── myapp.yaml</span></span>
<span class="line"><span>│   └── redis.yaml</span></span>
<span class="line"><span>├── staging/</span></span>
<span class="line"><span>│   ├── myapp.yaml</span></span>
<span class="line"><span>│   └── redis.yaml</span></span>
<span class="line"><span>└── prod/</span></span>
<span class="line"><span>    ├── myapp.yaml</span></span>
<span class="line"><span>    ├── redis.yaml</span></span>
<span class="line"><span>    └── monitoring.yaml</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="applicationset" tabindex="-1"><a class="header-anchor" href="#applicationset"><span>ApplicationSet</span></a></h3><p>ApplicationSet 是 App of Apps 的进化版，支持动态生成 Application：</p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基于 Git 目录自动生成 Application</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argoproj.io/v1alpha1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ApplicationSet</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-environments</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  generators</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">git</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        repoURL</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://github.com/example/myapp-gitops.git</span></span>
<span class="line"><span style="color:#E06C75;">        revision</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">main</span></span>
<span class="line"><span style="color:#E06C75;">        directories</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">overlays/*</span></span>
<span class="line"><span style="color:#E06C75;">  template</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;myapp-{{ path.basename }}&#39;</span></span>
<span class="line"><span style="color:#E06C75;">      labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">        environment</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;{{ path.basename }}&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      project</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"><span style="color:#E06C75;">      source</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        repoURL</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://github.com/example/myapp-gitops.git</span></span>
<span class="line"><span style="color:#E06C75;">        targetRevision</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">main</span></span>
<span class="line"><span style="color:#E06C75;">        path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;{{ path }}&#39;</span></span>
<span class="line"><span style="color:#E06C75;">      destination</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        server</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://kubernetes.default.svc</span></span>
<span class="line"><span style="color:#E06C75;">        namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;myapp-{{ path.basename }}&#39;</span></span>
<span class="line"><span style="color:#E06C75;">      syncPolicy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        automated</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          prune</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">          selfHeal</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">        syncOptions</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#98C379;">CreateNamespace=true</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基于集群列表生成（多集群场景）</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argoproj.io/v1alpha1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ApplicationSet</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-clusters</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  generators</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">list</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        elements</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">cluster</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://kubernetes.default.svc</span></span>
<span class="line"><span style="color:#E06C75;">            name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">local</span></span>
<span class="line"><span style="color:#E06C75;">            namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-dev</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">cluster</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://prod-cluster.example.com</span></span>
<span class="line"><span style="color:#E06C75;">            name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">            namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-prod</span></span>
<span class="line"><span style="color:#E06C75;">  template</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;myapp-{{ name }}&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      project</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"><span style="color:#E06C75;">      source</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        repoURL</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://github.com/example/myapp-gitops.git</span></span>
<span class="line"><span style="color:#E06C75;">        targetRevision</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">main</span></span>
<span class="line"><span style="color:#E06C75;">        path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">overlays/{{ name }}</span></span>
<span class="line"><span style="color:#E06C75;">      destination</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        server</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;{{ cluster }}&#39;</span></span>
<span class="line"><span style="color:#E06C75;">        namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;{{ namespace }}&#39;</span></span>
<span class="line"><span style="color:#E06C75;">      syncPolicy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        automated</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          prune</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">          selfHeal</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基于 Git 分支生成（分支环境）</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argoproj.io/v1alpha1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ApplicationSet</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">preview-environments</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  generators</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">scmProvider</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        github</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          organization</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">example</span></span>
<span class="line"><span style="color:#E06C75;">          repository</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">        filters</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">branchMatch</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">^preview-</span></span>
<span class="line"><span style="color:#E06C75;">  template</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;preview-{{ branch }}&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      project</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">preview</span></span>
<span class="line"><span style="color:#E06C75;">      source</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        repoURL</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://github.com/example/myapp-gitops.git</span></span>
<span class="line"><span style="color:#E06C75;">        targetRevision</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;{{ branch }}&#39;</span></span>
<span class="line"><span style="color:#E06C75;">        path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">overlays/preview</span></span>
<span class="line"><span style="color:#E06C75;">      destination</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        server</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://kubernetes.default.svc</span></span>
<span class="line"><span style="color:#E06C75;">        namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;preview-{{ branch }}&#39;</span></span>
<span class="line"><span style="color:#E06C75;">      syncPolicy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        automated</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          prune</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">          selfHeal</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">        syncOptions</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#98C379;">CreateNamespace=true</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="自动同步与手动审批" tabindex="-1"><a class="header-anchor" href="#自动同步与手动审批"><span>自动同步与手动审批</span></a></h2><h3 id="多级审批工作流" tabindex="-1"><a class="header-anchor" href="#多级审批工作流"><span>多级审批工作流</span></a></h3>`,10),r(d,{code:`eJyFkl1r2lAcxu/7KQ72ciuT4RyU0WG1L7b2zXp38EKjcUJmRkw3hhlYnKROmdmgQ+r6Mp2dDDLLcENNN79L6TlJvkWTc2K1IDSX/+f3f86T5xyW498wL2KCCCKBGWB9Pogu86j6ycgXcVW5HnwH2+EomJtbAIvQ5Q8C/GcfX3T1wfBZXHi0gE/eI20AHljjstE5dEWJxyLh/Tk6NPNHxlB+/o5IfluSkHIugQC8Oq4As6ZhtYGUA9T/S7cpgmsdCSzBa62pn+2jX9/waYvKS8R8OUdnd8yXx+a+iQGxWoH0DHRwAV7G0pnoDCFWiNsq9Akp3h8AuJm3QqNqDde79LhVAgRz+scOahR09Yt+2KKnBYl5IvlaAmvQkH+iD22kVLDaMgtt/d9vuk6hrBhLpTMpCazfA74S+MQeI6b5jARCUFdL6H/R/tFS38kbInE2oDFUdK2L6g2zdjoCbH2D6JuknVL/Tjub4zK2IC6VrRjGj3PrqmkYuk8hUuE2xOXPunY8Skn0LeK/A124pxjDOrqs2ga9AnkNdokgzHMcvydmnbewQxbCOVyR8ZmM1Sbq9ZxA4XGgXXj1tQhQsW3KjiHdpgiJExlVVz/B2pETJyu+5ZJgDbBpjpufdXsT3pj7IcNzvDA/y7LsBLPuMCwbe+J+PJ0J3TLeuDc+ndl1GE+SSTCe6UzEYZKs56mXnWRuAJirb0c=`}),o[6]||=i(`<h3 id="argocd-notifications" tabindex="-1"><a class="header-anchor" href="#argocd-notifications"><span>ArgoCD Notifications</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 通知配置</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ConfigMap</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd-notifications-cm</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd</span></span>
<span class="line"><span style="color:#E06C75;">data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # Slack 通知</span></span>
<span class="line"><span style="color:#E06C75;">  service.slack</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">    token: $slack-token</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # Microsoft Teams 通知</span></span>
<span class="line"><span style="color:#E06C75;">  service.teams</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">    webhookUrl: $teams-webhook-url</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 邮件通知</span></span>
<span class="line"><span style="color:#E06C75;">  service.email</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">    host: smtp.example.com</span></span>
<span class="line"><span style="color:#98C379;">    port: 587</span></span>
<span class="line"><span style="color:#98C379;">    from: argocd@example.com</span></span>
<span class="line"><span style="color:#98C379;">    username: $email-username</span></span>
<span class="line"><span style="color:#98C379;">    password: $email-password</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 触发器定义</span></span>
<span class="line"><span style="color:#E06C75;">  trigger.on-deployed</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">    - description: Application is synced and healthy</span></span>
<span class="line"><span style="color:#98C379;">      oncePer: app.status.sync.revision</span></span>
<span class="line"><span style="color:#98C379;">      send:</span></span>
<span class="line"><span style="color:#98C379;">        - app-deployed</span></span>
<span class="line"><span style="color:#98C379;">      when: app.status.operationState.phase in [&#39;Succeeded&#39;] and app.status.health.status == &#39;Healthy&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  trigger.on-health-degraded</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">    - description: Application has degraded</span></span>
<span class="line"><span style="color:#98C379;">      send:</span></span>
<span class="line"><span style="color:#98C379;">        - app-degraded</span></span>
<span class="line"><span style="color:#98C379;">      when: app.status.health.status == &#39;Degraded&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  trigger.on-sync-failed</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">    - description: Application sync failed</span></span>
<span class="line"><span style="color:#98C379;">      send:</span></span>
<span class="line"><span style="color:#98C379;">        - app-sync-failed</span></span>
<span class="line"><span style="color:#98C379;">      when: app.status.operationState.phase in [&#39;Error&#39;, &#39;Failed&#39;]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 模板定义</span></span>
<span class="line"><span style="color:#E06C75;">  template.app-deployed</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">    message: |</span></span>
<span class="line"><span style="color:#98C379;">      ✅ {{.app.metadata.name}} deployed successfully</span></span>
<span class="line"><span style="color:#98C379;">      Revision: {{.app.status.sync.revision}}</span></span>
<span class="line"><span style="color:#98C379;">      Health: {{.app.status.health.status}}</span></span>
<span class="line"><span style="color:#98C379;">    slack:</span></span>
<span class="line"><span style="color:#98C379;">      attachments: |</span></span>
<span class="line"><span style="color:#98C379;">        [{</span></span>
<span class="line"><span style="color:#98C379;">          &quot;title&quot;: &quot;{{.app.metadata.name}} - Deployed&quot;,</span></span>
<span class="line"><span style="color:#98C379;">          &quot;color&quot;: &quot;#18be52&quot;,</span></span>
<span class="line"><span style="color:#98C379;">          &quot;fields&quot;: [</span></span>
<span class="line"><span style="color:#98C379;">            { &quot;title&quot;: &quot;Revision&quot;, &quot;value&quot;: &quot;{{.app.status.sync.revision}}&quot; },</span></span>
<span class="line"><span style="color:#98C379;">            { &quot;title&quot;: &quot;Health&quot;, &quot;value&quot;: &quot;{{.app.status.health.status}}&quot; }</span></span>
<span class="line"><span style="color:#98C379;">          ]</span></span>
<span class="line"><span style="color:#98C379;">        }]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  template.app-degraded</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">    message: |</span></span>
<span class="line"><span style="color:#98C379;">      ⚠️ {{.app.metadata.name}} has degraded!</span></span>
<span class="line"><span style="color:#98C379;">      Health: {{.app.status.health.status}}</span></span>
<span class="line"><span style="color:#98C379;">      Reason: {{.app.status.health.message}}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  template.app-sync-failed</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">    message: |</span></span>
<span class="line"><span style="color:#98C379;">      ❌ {{.app.metadata.name}} sync failed!</span></span>
<span class="line"><span style="color:#98C379;">      Error: {{.app.status.operationState.message}}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="flux2-对比-argocd" tabindex="-1"><a class="header-anchor" href="#flux2-对比-argocd"><span>Flux2 对比 ArgoCD</span></a></h2><h3 id="架构对比" tabindex="-1"><a class="header-anchor" href="#架构对比"><span>架构对比</span></a></h3>`,5),r(d,{code:`eJyFkcFKw0AQhu99itBeFAwUkSo9CDFSLAWR1ttSSkxm28VNJmw2otIn8CY+gDdvXjz5QhYfw9lNqkmMuLCT3cn3z2T+LFWQrpzLk45DK8uvinvXU0v0T7s2a1YkFIRaYLJFzfIW3sWY0XZmoG5AzR3XPaasH4QrYDtTiES2O6/jJTKFFJkJW2kr5WslmZemUoSBbe5johVKWRfYOqRYb97fNs9P61JZIczVEjQFJqGQYKDJUcZoO9SwKAdJ1GkYMZL57f4/PowWM8xVCCyzD5dabL/SDjJaTPJMs2sKGIv7GvCrSKk4AxmzFYU/4HPUgrPExNKclrYenTX7eHz4fH2pisdxsAQmTHQVcEkj4Y8o11i+C+gY2+JVtRmmaSZlm2YWsJmjFW4Yru8klP+eCymHPeAHhwO+F6JENexxzivct1cF2h9Eg6BfRb8A9Pje3w==`}),o[7]||=i(`<h3 id="详细对比" tabindex="-1"><a class="header-anchor" href="#详细对比"><span>详细对比</span></a></h3><table><thead><tr><th>维度</th><th>ArgoCD</th><th>Flux2</th></tr></thead><tbody><tr><td><strong>设计哲学</strong></td><td>应用为中心</td><td>GitOps 工具链</td></tr><tr><td><strong>UI</strong></td><td>丰富的 Web UI</td><td>无内置 UI（可配 Grafana）</td></tr><tr><td><strong>CLI</strong></td><td>功能完善的 CLI</td><td>flux CLI</td></tr><tr><td><strong>多集群</strong></td><td>原生支持</td><td>通过 flux 实例</td></tr><tr><td><strong>通知</strong></td><td>内置通知系统</td><td>notification-controller</td></tr><tr><td><strong>镜像更新</strong></td><td>需要外部工具</td><td>内置 image automation</td></tr><tr><td><strong>Helm 支持</strong></td><td>原生支持</td><td>helm-controller</td></tr><tr><td><strong>Kustomize</strong></td><td>原生支持</td><td>kustomize-controller</td></tr><tr><td><strong>多租户</strong></td><td>Project + RBAC</td><td>命名空间隔离</td></tr><tr><td><strong>Sync 策略</strong></td><td>自动/手动灵活</td><td>以自动为主</td></tr><tr><td><strong>社区</strong></td><td>更大更活跃</td><td>CNCF 孵化项目</td></tr><tr><td><strong>学习曲线</strong></td><td>较平缓</td><td>需理解 CRD 链</td></tr><tr><td><strong>资源占用</strong></td><td>较高</td><td>较轻量</td></tr></tbody></table><h3 id="flux2-配置示例" tabindex="-1"><a class="header-anchor" href="#flux2-配置示例"><span>Flux2 配置示例</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># GitRepository - 源配置</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">source.toolkit.fluxcd.io/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">GitRepository</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">flux-system</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">1m</span></span>
<span class="line"><span style="color:#E06C75;">  url</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://github.com/example/myapp-gitops</span></span>
<span class="line"><span style="color:#E06C75;">  ref</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    branch</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">main</span></span>
<span class="line"><span style="color:#E06C75;">  secretRef</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">git-credentials</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Kustomization - 同步配置</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">kustomize.toolkit.fluxcd.io/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Kustomization</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">flux-system</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span></span>
<span class="line"><span style="color:#E06C75;">  path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">./overlays/production</span></span>
<span class="line"><span style="color:#E06C75;">  prune</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">  sourceRef</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">GitRepository</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  targetNamespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">  healthChecks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">apps/v1</span></span>
<span class="line"><span style="color:#E06C75;">      kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Deployment</span></span>
<span class="line"><span style="color:#E06C75;">      name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">      namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HelmRelease - Helm 发布</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">helm.toolkit.fluxcd.io/v2beta1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">HelmRelease</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">flux-system</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span></span>
<span class="line"><span style="color:#E06C75;">  chart</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      chart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">      version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1.0.0&quot;</span></span>
<span class="line"><span style="color:#E06C75;">      sourceRef</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">HelmRepository</span></span>
<span class="line"><span style="color:#E06C75;">        name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-chart</span></span>
<span class="line"><span style="color:#E06C75;">  values</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    replicaCount</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      tag</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v2.0.1</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 自动镜像更新</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">image.toolkit.fluxcd.io/v1beta1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ImageRepository</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">flux-system</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myregistry.azurecr.io/myapp</span></span>
<span class="line"><span style="color:#E06C75;">  interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">1m</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">image.toolkit.fluxcd.io/v1beta1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ImagePolicy</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">flux-system</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  imageRepositoryRef</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  policy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    semver</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      range</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;&gt;=2.0.0&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">image.toolkit.fluxcd.io/v1beta1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ImageUpdateAutomation</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">flux-system</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">1m</span></span>
<span class="line"><span style="color:#E06C75;">  sourceRef</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">GitRepository</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  git</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    checkout</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      ref</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        branch</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">main</span></span>
<span class="line"><span style="color:#E06C75;">    commit</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      author</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        email</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">flux@example.com</span></span>
<span class="line"><span style="color:#E06C75;">        name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Flux</span></span>
<span class="line"><span style="color:#E06C75;">      messageTemplate</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{range .Updated.Images}}{{.}}{{end}}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    push</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      branch</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">main</span></span>
<span class="line"><span style="color:#E06C75;">  update</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">./clusters/production</span></span>
<span class="line"><span style="color:#E06C75;">    strategy</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Setters</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="选择建议" tabindex="-1"><a class="header-anchor" href="#选择建议"><span>选择建议</span></a></h3><div class="hint-container tip"><p class="hint-container-title">如何选择 ArgoCD vs Flux2？</p><p><strong>选择 ArgoCD 如果你需要：</strong></p><ul><li>可视化 Web UI 管理应用</li><li>灵活的手动同步与审批流程</li><li>多租户项目管理</li><li>团队中 Kubernetes 新手较多</li></ul><p><strong>选择 Flux2 如果你需要：</strong></p><ul><li>轻量级 GitOps 方案</li><li>自动镜像更新能力</li><li>更细粒度的 GitOps 工具链组合</li><li>与 CNCF 生态紧密集成</li></ul><p><strong>两者都支持 Helm、Kustomize、多集群</strong>，核心功能差异不大，更多是用户体验和运维习惯的区别。</p></div><hr><h2 id="progressive-delivery" tabindex="-1"><a class="header-anchor" href="#progressive-delivery"><span>Progressive Delivery</span></a></h2><h3 id="渐进式发布概述" tabindex="-1"><a class="header-anchor" href="#渐进式发布概述"><span>渐进式发布概述</span></a></h3><p>渐进式发布是 GitOps 的增强模式，通过可观测性指标逐步扩大发布范围，在发现问题时自动回滚：</p>`,10),r(d,{code:`eJxLy8kvT85ILCpR8AniUgACx+hn0zY87+x4NmfN0/6JT3c0xyro6topOEU7J+YlFlUqmKrGgtU5gYWdq5/1tD9b0P5sccOz+UtrwTLOIJmaZ2sXP92xo0bBBabRCKYTIv90TxNY3jX6Rfuqp10rns6e92z3LIgKF7DZbljMdkMx2x3uKAOo2RB5uNlgMXewaR5YTPNAMc0z+mnripft/RBvKxgawAyFKEMYChYsLqnMSVVwVEjLzMmxUjZJTU5JNtFJzs/JL7JSTktLQ1LjCVVjYJZilmiAXY0rVE1amlmSWRKyGgBsa55n`}),o[8]||=i(`<h3 id="argo-rollouts" tabindex="-1"><a class="header-anchor" href="#argo-rollouts"><span>Argo Rollouts</span></a></h3><p>Argo Rollouts 是 ArgoCD 生态的渐进式发布控制器：</p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># Rollout 替代 Deployment</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argoproj.io/v1alpha1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Rollout</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  replicas</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#E06C75;">  strategy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    canary</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # Canary 设置</span></span>
<span class="line"><span style="color:#E06C75;">      canaryService</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-canary</span></span>
<span class="line"><span style="color:#E06C75;">      stableService</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-stable</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 流量管理</span></span>
<span class="line"><span style="color:#E06C75;">      trafficRouting</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        istio</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          virtualServices</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-vsvc</span></span>
<span class="line"><span style="color:#E06C75;">              routes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">                - </span><span style="color:#98C379;">primary</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 渐进式发布步骤</span></span>
<span class="line"><span style="color:#E06C75;">      steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">setWeight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">5</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">pause</span><span style="color:#ABB2BF;">: { </span><span style="color:#E06C75;">duration</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span><span style="color:#ABB2BF;"> }</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">setWeight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">25</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">pause</span><span style="color:#ABB2BF;">: { </span><span style="color:#E06C75;">duration</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span><span style="color:#ABB2BF;"> }</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">setWeight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">50</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">pause</span><span style="color:#ABB2BF;">: { </span><span style="color:#E06C75;">duration</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10m</span><span style="color:#ABB2BF;"> }</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 手动审批</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">pause</span><span style="color:#ABB2BF;">: {}</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">setWeight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">80</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">pause</span><span style="color:#ABB2BF;">: { </span><span style="color:#E06C75;">duration</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span><span style="color:#ABB2BF;"> }</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">setWeight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">100</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 回滚条件</span></span>
<span class="line"><span style="color:#E06C75;">      analysis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        templates</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">templateName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">success-rate</span></span>
<span class="line"><span style="color:#E06C75;">        startingStep</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">2</span></span>
<span class="line"><span style="color:#E06C75;">        args</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service-name</span></span>
<span class="line"><span style="color:#E06C75;">            value</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-canary.production.svc.cluster.local</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 反亲和性</span></span>
<span class="line"><span style="color:#E06C75;">      antiAffinity</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        preferredDuringSchedulingIgnoredDuringExecution</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">weight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">100</span></span>
<span class="line"><span style="color:#E06C75;">            podAffinityTerm</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              labelSelector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                matchLabels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                  app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">              topologyKey</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">kubernetes.io/hostname</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  selector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    matchLabels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  template</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">    spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      containers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">          image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myregistry.azurecr.io/myapp:v2.0.1</span></span>
<span class="line"><span style="color:#E06C75;">          ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">containerPort</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span></span>
<span class="line"><span style="color:#E06C75;">          resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            requests</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              cpu</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">250m</span></span>
<span class="line"><span style="color:#E06C75;">              memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">256Mi</span></span>
<span class="line"><span style="color:#E06C75;">            limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              cpu</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1&quot;</span></span>
<span class="line"><span style="color:#E06C75;">              memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">512Mi</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="analysistemplate" tabindex="-1"><a class="header-anchor" href="#analysistemplate"><span>AnalysisTemplate</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 分析模板 - 基于 Prometheus 指标</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argoproj.io/v1alpha1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">AnalysisTemplate</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">success-rate</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  args</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service-name</span></span>
<span class="line"><span style="color:#E06C75;">  metrics</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">success-rate</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">30s</span></span>
<span class="line"><span style="color:#E06C75;">      count</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#E06C75;">      successCondition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">result[0] &gt;= 0.99</span></span>
<span class="line"><span style="color:#E06C75;">      failureLimit</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">      provider</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        prometheus</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          address</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">http://prometheus.monitoring:9090</span></span>
<span class="line"><span style="color:#E06C75;">          query</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">            sum(rate(http_requests_total{service=&quot;{{args.service-name}}&quot;,status!~&quot;5..&quot;}[1m]))</span></span>
<span class="line"><span style="color:#98C379;">            /</span></span>
<span class="line"><span style="color:#98C379;">            sum(rate(http_requests_total{service=&quot;{{args.service-name}}&quot;}[1m]))</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">latency-p99</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">30s</span></span>
<span class="line"><span style="color:#E06C75;">      count</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#E06C75;">      successCondition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">result[0] &lt;= 500</span></span>
<span class="line"><span style="color:#E06C75;">      failureLimit</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">      provider</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        prometheus</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          address</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">http://prometheus.monitoring:9090</span></span>
<span class="line"><span style="color:#E06C75;">          query</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">            histogram_quantile(0.99,</span></span>
<span class="line"><span style="color:#98C379;">              sum(rate(http_request_duration_seconds_bucket{service=&quot;{{args.service-name}}&quot;}[1m]))</span></span>
<span class="line"><span style="color:#98C379;">              by (le)</span></span>
<span class="line"><span style="color:#98C379;">            ) * 1000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">error-rate</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">30s</span></span>
<span class="line"><span style="color:#E06C75;">      count</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">5</span></span>
<span class="line"><span style="color:#E06C75;">      successCondition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">result[0] &lt;= 0.01</span></span>
<span class="line"><span style="color:#E06C75;">      failureLimit</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">2</span></span>
<span class="line"><span style="color:#E06C75;">      provider</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        prometheus</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          address</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">http://prometheus.monitoring:9090</span></span>
<span class="line"><span style="color:#E06C75;">          query</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">            sum(rate(http_requests_total{service=&quot;{{args.service-name}}&quot;,status=~&quot;5..&quot;}[1m]))</span></span>
<span class="line"><span style="color:#98C379;">            /</span></span>
<span class="line"><span style="color:#98C379;">            sum(rate(http_requests_total{service=&quot;{{args.service-name}}&quot;}[1m]))</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="flagger" tabindex="-1"><a class="header-anchor" href="#flagger"><span>Flagger</span></a></h3><p>Flagger 是 Flux 生态的渐进式发布工具：</p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># Flagger Canary</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">flagger.app/v1beta1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Canary</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  targetRef</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">apps/v1</span></span>
<span class="line"><span style="color:#E06C75;">    kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Deployment</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    port</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span></span>
<span class="line"><span style="color:#E06C75;">    targetPort</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span></span>
<span class="line"><span style="color:#E06C75;">    gateways</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">myapp-gateway</span></span>
<span class="line"><span style="color:#E06C75;">    hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">myapp.example.com</span></span>
<span class="line"><span style="color:#E06C75;">  analysis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">1m</span></span>
<span class="line"><span style="color:#E06C75;">    threshold</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">5</span></span>
<span class="line"><span style="color:#E06C75;">    maxWeight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">50</span></span>
<span class="line"><span style="color:#E06C75;">    stepWeight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#E06C75;">    metrics</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">request-success-rate</span></span>
<span class="line"><span style="color:#E06C75;">        thresholdRange</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          min</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">99</span></span>
<span class="line"><span style="color:#E06C75;">        interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">1m</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">request-duration</span></span>
<span class="line"><span style="color:#E06C75;">        thresholdRange</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          max</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">500</span></span>
<span class="line"><span style="color:#E06C75;">        interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">1m</span></span>
<span class="line"><span style="color:#E06C75;">    webhooks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">load-test</span></span>
<span class="line"><span style="color:#E06C75;">        type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">rollout</span></span>
<span class="line"><span style="color:#E06C75;">        url</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">http://flagger-loadtester.test/</span></span>
<span class="line"><span style="color:#E06C75;">        timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5s</span></span>
<span class="line"><span style="color:#E06C75;">        metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">cmd</span></span>
<span class="line"><span style="color:#E06C75;">          cmd</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;hey -z 1m -q 10 -c 2 http://myapp.production:8080/&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">acceptance-test</span></span>
<span class="line"><span style="color:#E06C75;">        type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">pre-rollout</span></span>
<span class="line"><span style="color:#E06C75;">        url</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">http://flagger-loadtester.test/</span></span>
<span class="line"><span style="color:#E06C75;">        timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">30s</span></span>
<span class="line"><span style="color:#E06C75;">        metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">bash</span></span>
<span class="line"><span style="color:#E06C75;">          cmd</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;curl -sf http://myapp-canary.production:8080/healthz&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="secret-管理" tabindex="-1"><a class="header-anchor" href="#secret-管理"><span>Secret 管理</span></a></h2><h3 id="gitops-中-secret-的挑战" tabindex="-1"><a class="header-anchor" href="#gitops-中-secret-的挑战"><span>GitOps 中 Secret 的挑战</span></a></h3><p>在 GitOps 模型中，所有配置应存储在 Git 中，但 Secret 不能以明文存储。以下方案解决这一矛盾：</p><h3 id="sealed-secrets" tabindex="-1"><a class="header-anchor" href="#sealed-secrets"><span>Sealed Secrets</span></a></h3>`,13),r(d,{code:`eJxLy8kvT85ILCpR8AniUgACl9Sy6Kd7Gp72T3zR0BqroKtrV5NdmpRanJqYo/C0a8HT9W01CsFATmpKtBKEDk5NLkotsUkq0rd72r/+6brOp60rnq6d8bR1qYJ7ZolSLNhYiFKwcUBBhWf9E57sWlIDUhAN4j/ZPfnprskQpSA+SJ1jUXq+s4vC0wk9z9YurVHwtiiO9ga6pCgvtSS1WOHl7Lbn+5ZAdAClwDqe9S1/2rHt6cwVL5YvhjoU5LTop33zn0+ZD+XFcoH1FJdU5qTCnJWWmZNjpWySmpySbKKTnJ+TX2SlnJaWhqIQpBeqMC3NLMksCVkhAJtfg78=`}),o[9]||=i(`<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 Sealed Secrets 控制器</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> apply</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> https://github.com/bitnami-labs/sealed-secrets/releases/latest/download/controller.yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 kubeseal CLI</span></span>
<span class="line"><span style="color:#E06C75;">KUBESEAL_VERSION</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> https://api.github.com/repos/bitnami-labs/sealed-secrets/tags</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">jq</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> &#39;.[0].name&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">wget</span><span style="color:#98C379;"> &quot;https://github.com/bitnami-labs/sealed-secrets/releases/download/\${</span><span style="color:#E06C75;">KUBESEAL_VERSION</span><span style="color:#98C379;">}/kubeseal-linux-amd64&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 从 Secret 创建 SealedSecret</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> create</span><span style="color:#98C379;"> secret</span><span style="color:#98C379;"> generic</span><span style="color:#98C379;"> myapp-secret</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --from-literal=ConnectionStrings__DefaultConnection=</span><span style="color:#98C379;">&quot;Server=db;Database=myapp&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --from-literal=JwtSettings__SecretKey=</span><span style="color:#98C379;">&quot;super-secret-key&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --dry-run=client</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> yaml</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">kubeseal</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --format</span><span style="color:#98C379;"> yaml</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">sealed-secret.yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 提交 sealed-secret.yaml 到 Git 即可</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># SealedSecret 示例（可安全存入 Git）</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">bitnami.com/v1alpha1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">SealedSecret</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-secret</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  encryptedData</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    ConnectionStrings__DefaultConnection</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">AgCF/3X...加密数据...</span></span>
<span class="line"><span style="color:#E06C75;">    JwtSettings__SecretKey</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">AgBf/2Y...加密数据...</span></span>
<span class="line"><span style="color:#E06C75;">  template</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-secret</span></span>
<span class="line"><span style="color:#E06C75;">      namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">    type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Opaque</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="external-secrets-operator" tabindex="-1"><a class="header-anchor" href="#external-secrets-operator"><span>External Secrets Operator</span></a></h3>`,3),r(d,{code:`eJxLy8kvT85ILCpR8AniUgAC14qS4JL8otRopadLpr1sXqEQnJpclFqi8HTtjKdNK2ySivTtHKtKi1IVvFMrFcISS3NK9B3DgxWCffXBHKVYBV1duxrXYH+FZ33Ln3ZsezpzRY2Ct0VxtHdpUmpRXmpJanEs2CKgGFjp047ZT3fv0n86oefZ2qU1UOuin/bNfz5lPpQH0eCeWRINxApPdk9+umsywh7nIBewDVxgVcUllTmpcF8opGXm5Fgpm6QmpySb6CTn5+QXWSmnpaUhKYX6D6IwLc0sySwJWSEA79tsaQ==`}),o[10]||=i(`<div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># ClusterSecretStore - Azure Key Vault</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">external-secrets.io/v1beta1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ClusterSecretStore</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">azure-keyvault</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  provider</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    azurekv</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      tenantId</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx&quot;</span></span>
<span class="line"><span style="color:#E06C75;">      vaultUrl</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;https://my-keyvault.vault.azure.net/&quot;</span></span>
<span class="line"><span style="color:#E06C75;">      authSecretRef</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        clientId</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">azure-auth</span></span>
<span class="line"><span style="color:#E06C75;">          key</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">clientId</span></span>
<span class="line"><span style="color:#E06C75;">        clientSecret</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">azure-auth</span></span>
<span class="line"><span style="color:#E06C75;">          key</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">clientSecret</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ExternalSecret</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">external-secrets.io/v1beta1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ExternalSecret</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-secrets</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  refreshInterval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">1h</span></span>
<span class="line"><span style="color:#E06C75;">  secretStoreRef</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">azure-keyvault</span></span>
<span class="line"><span style="color:#E06C75;">    kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ClusterSecretStore</span></span>
<span class="line"><span style="color:#E06C75;">  target</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-secrets</span></span>
<span class="line"><span style="color:#E06C75;">    creationPolicy</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Owner</span></span>
<span class="line"><span style="color:#E06C75;">  data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">secretKey</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ConnectionStrings__DefaultConnection</span></span>
<span class="line"><span style="color:#E06C75;">      remoteRef</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        key</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-db-connection</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">secretKey</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">JwtSettings__SecretKey</span></span>
<span class="line"><span style="color:#E06C75;">      remoteRef</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        key</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-jwt-secret</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">secretKey</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Redis__Password</span></span>
<span class="line"><span style="color:#E06C75;">      remoteRef</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        key</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-redis-password</span></span>
<span class="line"><span style="color:#E06C75;">  dataFrom</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">extract</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        key</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-all-secrets</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="sops-age" tabindex="-1"><a class="header-anchor" href="#sops-age"><span>SOPS + Age</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 age 和 sops</span></span>
<span class="line"><span style="color:#61AFEF;">apt-get</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> age</span><span style="color:#98C379;"> sops</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生成 age 密钥对</span></span>
<span class="line"><span style="color:#61AFEF;">age-keygen</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> key.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 加密 values 文件</span></span>
<span class="line"><span style="color:#61AFEF;">sops</span><span style="color:#D19A66;"> --age</span><span style="color:#98C379;"> age1xxxxxxxxxxxxxxxxxxx</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --encrypt</span><span style="color:#D19A66;"> --encrypted-regex</span><span style="color:#98C379;"> &#39;^(secrets|data|stringData)$&#39;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --in-place</span><span style="color:#98C379;"> values-prod.yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 解密</span></span>
<span class="line"><span style="color:#61AFEF;">sops</span><span style="color:#D19A66;"> --decrypt</span><span style="color:#98C379;"> values-prod.yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 与 ArgoCD 集成（使用 helm-secrets）</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> secrets</span><span style="color:#98C379;"> upgrade</span><span style="color:#D19A66;"> --install</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> ./myapp</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  -f</span><span style="color:#98C379;"> values-prod.yaml</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --namespace</span><span style="color:#98C379;"> production</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="gitops-安全最佳实践" tabindex="-1"><a class="header-anchor" href="#gitops-安全最佳实践"><span>GitOps 安全最佳实践</span></a></h2><h3 id="安全框架" tabindex="-1"><a class="header-anchor" href="#安全框架"><span>安全框架</span></a></h3>`,6),r(d,{code:`eJxdkc1OwkAUhfc+xSzlMQCNK1NCn4BIY0iAktKFSwkChQgtAWwQEJqAv6GwABOK0Jdh7nTewqHtxOBqMufeufd8Z3KZfDqXKpwhpMiyen5+lVGFQhFhu44r75EI0xE6bDvY6QSSLyCEtSp0Fwd3BI1pKJH5HhtN0I2Dw6VEkg2yoL4J78Egz3apaUPrDWvffgHX5t6iRGyLGNWwU5RSWSnNjhtFUouheHmnSko+lf0ni0JCRLgxwQv+Gob3eKnDqEz7Bm6Nsdb3C3RQJfvpCUcyFo2joJGTtXcMg3w41FzR5y553XK+XZtsh2T+RHozzienw6RgUsO1YD2sS7BcEcc9WUR7Q1zWg4zo5yPj5e5jwjUi3TFo3AH86LB6gfoX6Do3ZVseC9KcYdf0pahyK8cvwuV8kigcEf8G+XC00iQ7m7uwNmRgn2B56wdwjGNQ7Dd+AZ6u7hs=`}),o[11]||=i(`<h3 id="仓库安全配置" tabindex="-1"><a class="header-anchor" href="#仓库安全配置"><span>仓库安全配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># .github/CODEOWNERS - 代码所有者</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生产环境变更需要 ops 团队审批</span></span>
<span class="line"><span style="color:#98C379;">/overlays/production/ @ops-team</span></span>
<span class="line"><span style="color:#98C379;">/overlays/staging/ @dev-team @ops-team</span></span>
<span class="line"><span style="color:#98C379;">/charts/ @dev-team</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># GitHub 分支保护规则（通过 API 设置）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># - 要求 PR 审批</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># - 要求状态检查通过</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># - 要求签名提交</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># - 禁止强制推送</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="argocd-项目隔离" tabindex="-1"><a class="header-anchor" href="#argocd-项目隔离"><span>ArgoCD 项目隔离</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 开发环境项目</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argoproj.io/v1alpha1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">AppProject</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">development</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Development environment</span></span>
<span class="line"><span style="color:#E06C75;">  sourceRepos</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">&quot;https://github.com/example/dev-configs.git&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  destinations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;dev-*&quot;</span></span>
<span class="line"><span style="color:#E06C75;">      server</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://kubernetes.default.svc</span></span>
<span class="line"><span style="color:#E06C75;">  clusterResourceWhitelist</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">group</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;&quot;</span></span>
<span class="line"><span style="color:#E06C75;">      kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Namespace</span></span>
<span class="line"><span style="color:#E06C75;">  namespaceResourceBlacklist</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">group</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;&quot;</span></span>
<span class="line"><span style="color:#E06C75;">      kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ResourceQuota</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">group</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;&quot;</span></span>
<span class="line"><span style="color:#E06C75;">      kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">LimitRange</span></span>
<span class="line"><span style="color:#E06C75;">  roles</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">dev-team</span></span>
<span class="line"><span style="color:#E06C75;">      description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Development team access</span></span>
<span class="line"><span style="color:#E06C75;">      policies</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">p, proj:development:dev-team, applications, get, development/*, allow</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">p, proj:development:dev-team, applications, sync, development/*, allow</span></span>
<span class="line"><span style="color:#E06C75;">      groups</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">dev-team</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生产环境项目（严格限制）</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argoproj.io/v1alpha1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">AppProject</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Production environment</span></span>
<span class="line"><span style="color:#E06C75;">  sourceRepos</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">&quot;https://github.com/example/prod-configs.git&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  destinations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;production&quot;</span></span>
<span class="line"><span style="color:#E06C75;">      server</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://kubernetes.default.svc</span></span>
<span class="line"><span style="color:#E06C75;">  clusterResourceWhitelist</span><span style="color:#ABB2BF;">: []  </span><span style="color:#7F848E;font-style:italic;"># 禁止集群级资源</span></span>
<span class="line"><span style="color:#E06C75;">  namespaceResourceBlacklist</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">group</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;&quot;</span></span>
<span class="line"><span style="color:#E06C75;">      kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ResourceQuota</span></span>
<span class="line"><span style="color:#E06C75;">  roles</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ops-team</span></span>
<span class="line"><span style="color:#E06C75;">      description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Operations team access</span></span>
<span class="line"><span style="color:#E06C75;">      policies</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">p, proj:production:ops-team, applications, *, production/*, allow</span></span>
<span class="line"><span style="color:#E06C75;">      groups</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">ops-team</span></span>
<span class="line"><span style="color:#E06C75;">  syncWindows</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">allow</span></span>
<span class="line"><span style="color:#E06C75;">      schedule</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;0 9 * * 1-5&quot;</span></span>
<span class="line"><span style="color:#E06C75;">      duration</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">8h</span></span>
<span class="line"><span style="color:#E06C75;">      applications</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">&quot;*&quot;</span></span>
<span class="line"><span style="color:#E06C75;">      manualSync</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="net-应用-gitops-流水线" tabindex="-1"><a class="header-anchor" href="#net-应用-gitops-流水线"><span>.NET 应用 GitOps 流水线</span></a></h2><h3 id="完整流水线架构" tabindex="-1"><a class="header-anchor" href="#完整流水线架构"><span>完整流水线架构</span></a></h3>`,7),r(d,{code:`eJx1kl1v0lAYx+/3KZ6w7M4pLqDJYmYYMF6mgGR3J1ywQrGx0qUtGrOaQBDZFNfqhlnELFPUEA1jF84gLO67GJ5D+RYr53TJLrbeNOnv939eeo4oK8+Fx1lVh7XQDDhPgOBpGc33drlGTWs0+DYatseHlQzMzy/BMolIerS0DgFBl5SiBsFYhqWWGQ4SevAKhwO4mQivAQ72xnsdzoOMh4h9ZtlfGviuibUqPXlr95qchxgPX+RDivAkr8Kk+RmrJjfCzFghdKczKVc4wa1jCATTXFhhQoS46Ggbax26/YuaboEI41Hioa3f9OMxOJskNzQYDXdxsHtvXb21xJP0sD7u/vPwUJSFYiSVBrS28O+facunWamYmWE8xnicBNSCEgwBbZedrdDcd3rwAnEmrG6OW0fTwjs9/Fp9ycjqlBi5/DMDHhC7/hPfdNBq0O53HuRY07MFqVgw4OG1yoaq5ErsOAxIEM90EkgrsqyUdI2tRfuWfdbCU9M5VexXnc1YOsEmSxL/HNCTyqTu/qYk+5zapI26MzDttrHfv88nTrF+dL9nwCOy4OT+v/4Afi9/3/Z653gFrqH1w4D0xdStAzr85DbW9Bdy3rkxoiTLi7O+vJATfDcERVbUxVlRFC85cdfJi767d8SrnYTriGLW71247JwDSWsjxA==`}),o[12]||=i(`<h3 id="ci-流水线-github-actions" tabindex="-1"><a class="header-anchor" href="#ci-流水线-github-actions"><span>CI 流水线（GitHub Actions）</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># .github/workflows/ci.yml</span></span>
<span class="line"><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">CI Pipeline</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  push</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    branches</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">main</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">develop</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">  pull_request</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    branches</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">main</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">env</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  REGISTRY</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myregistry.azurecr.io</span></span>
<span class="line"><span style="color:#E06C75;">  IMAGE_NAME</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  DOTNET_VERSION</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;8.0.x&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">jobs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  build-and-test</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    runs-on</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ubuntu-latest</span></span>
<span class="line"><span style="color:#E06C75;">    steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">actions/checkout@v4</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Setup .NET</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">actions/setup-dotnet@v4</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          dotnet-version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ env.DOTNET_VERSION }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Restore dependencies</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">dotnet restore</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Build</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">dotnet build --no-restore --configuration Release</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Test</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">dotnet test --no-build --configuration Release --logger trx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Publish</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">dotnet publish -c Release -o ./publish</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  build-and-push-image</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    needs</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">build-and-test</span></span>
<span class="line"><span style="color:#E06C75;">    runs-on</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ubuntu-latest</span></span>
<span class="line"><span style="color:#E06C75;">    if</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">github.event_name == &#39;push&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    outputs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      image-tag</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ steps.meta.outputs.tags }}</span></span>
<span class="line"><span style="color:#E06C75;">    steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">actions/checkout@v4</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Login to ACR</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">azure/docker-login@v1</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          login-server</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ env.REGISTRY }}</span></span>
<span class="line"><span style="color:#E06C75;">          username</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ secrets.ACR_USERNAME }}</span></span>
<span class="line"><span style="color:#E06C75;">          password</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ secrets.ACR_PASSWORD }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Extract metadata</span></span>
<span class="line"><span style="color:#E06C75;">        id</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">meta</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/metadata-action@v5</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          images</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}</span></span>
<span class="line"><span style="color:#E06C75;">          tags</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">            type=ref,event=branch</span></span>
<span class="line"><span style="color:#98C379;">            type=ref,event=pr</span></span>
<span class="line"><span style="color:#98C379;">            type=semver,pattern={{version}}</span></span>
<span class="line"><span style="color:#98C379;">            type=sha,prefix=</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Build and push</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/build-push-action@v5</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          context</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">.</span></span>
<span class="line"><span style="color:#E06C75;">          push</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">          tags</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ steps.meta.outputs.tags }}</span></span>
<span class="line"><span style="color:#E06C75;">          labels</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ steps.meta.outputs.labels }}</span></span>
<span class="line"><span style="color:#E06C75;">          cache-from</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">type=gha</span></span>
<span class="line"><span style="color:#E06C75;">          cache-to</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">type=gha,mode=max</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Security scan</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">aquasecurity/trivy-action@master</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          image-ref</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:\${{ github.sha }}</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;CRITICAL,HIGH&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          exit-code</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  update-gitops</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    needs</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">build-and-push-image</span></span>
<span class="line"><span style="color:#E06C75;">    runs-on</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ubuntu-latest</span></span>
<span class="line"><span style="color:#E06C75;">    if</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">github.ref == &#39;refs/heads/main&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Checkout GitOps repo</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">actions/checkout@v4</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          repository</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">example/myapp-gitops</span></span>
<span class="line"><span style="color:#E06C75;">          token</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ secrets.GITOPS_PAT }}</span></span>
<span class="line"><span style="color:#E06C75;">          path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">gitops</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Update image tag</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          cd gitops</span></span>
<span class="line"><span style="color:#98C379;">          # 更新 Helm values 中的镜像标签</span></span>
<span class="line"><span style="color:#98C379;">          yq -i &quot;.image.tag = \\&quot;\${{ github.sha }}\\&quot;&quot; overlays/production/values.yaml</span></span>
<span class="line"><span style="color:#98C379;">          git config user.name &quot;GitHub Actions&quot;</span></span>
<span class="line"><span style="color:#98C379;">          git config user.email &quot;actions@github.com&quot;</span></span>
<span class="line"><span style="color:#98C379;">          git add overlays/production/values.yaml</span></span>
<span class="line"><span style="color:#98C379;">          git commit -m &quot;chore: update myapp image to \${{ github.sha }}&quot;</span></span>
<span class="line"><span style="color:#98C379;">          git push</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="gitops-仓库结构" tabindex="-1"><a class="header-anchor" href="#gitops-仓库结构"><span>GitOps 仓库结构</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>myapp-gitops/</span></span>
<span class="line"><span>├── charts/</span></span>
<span class="line"><span>│   └── myapp/                    # Helm Chart</span></span>
<span class="line"><span>│       ├── Chart.yaml</span></span>
<span class="line"><span>│       ├── templates/</span></span>
<span class="line"><span>│       └── values.yaml</span></span>
<span class="line"><span>├── overlays/</span></span>
<span class="line"><span>│   ├── dev/</span></span>
<span class="line"><span>│   │   ├── kustomization.yaml</span></span>
<span class="line"><span>│   │   └── values.yaml</span></span>
<span class="line"><span>│   ├── staging/</span></span>
<span class="line"><span>│   │   ├── kustomization.yaml</span></span>
<span class="line"><span>│   │   └── values.yaml</span></span>
<span class="line"><span>│   └── production/</span></span>
<span class="line"><span>│       ├── kustomization.yaml</span></span>
<span class="line"><span>│       ├── values.yaml</span></span>
<span class="line"><span>│       └── rollout.yaml          # Argo Rollouts 配置</span></span>
<span class="line"><span>├── argocd/</span></span>
<span class="line"><span>│   ├── applications/</span></span>
<span class="line"><span>│   │   ├── dev.yaml</span></span>
<span class="line"><span>│   │   ├── staging.yaml</span></span>
<span class="line"><span>│   │   └── production.yaml</span></span>
<span class="line"><span>│   ├── appsets/</span></span>
<span class="line"><span>│   │   └── environments.yaml</span></span>
<span class="line"><span>│   └── projects/</span></span>
<span class="line"><span>│       ├── dev-project.yaml</span></span>
<span class="line"><span>│       └── prod-project.yaml</span></span>
<span class="line"><span>├── infrastructure/</span></span>
<span class="line"><span>│   ├── cert-manager.yaml</span></span>
<span class="line"><span>│   ├── ingress-nginx.yaml</span></span>
<span class="line"><span>│   └── monitoring.yaml</span></span>
<span class="line"><span>└── README.md</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="argocd-application-定义" tabindex="-1"><a class="header-anchor" href="#argocd-application-定义"><span>ArgoCD Application 定义</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># argocd/applications/production.yaml</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argoproj.io/v1alpha1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Application</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-production</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd</span></span>
<span class="line"><span style="color:#E06C75;">  labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    notifications.argoproj.io/subscribe.on-deployed.slack</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">prod-releases</span></span>
<span class="line"><span style="color:#E06C75;">    notifications.argoproj.io/subscribe.on-health-degraded.pagerduty</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">alerts</span></span>
<span class="line"><span style="color:#E06C75;">  finalizers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">resources-finalizer.argocd.argoproj.io</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  project</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">  source</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    repoURL</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://github.com/example/myapp-gitops.git</span></span>
<span class="line"><span style="color:#E06C75;">    targetRevision</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">main</span></span>
<span class="line"><span style="color:#E06C75;">    path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">overlays/production</span></span>
<span class="line"><span style="color:#E06C75;">  destination</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    server</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://kubernetes.default.svc</span></span>
<span class="line"><span style="color:#E06C75;">    namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">  syncPolicy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    automated</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      prune</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">      selfHeal</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span></span>
<span class="line"><span style="color:#E06C75;">    syncOptions</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">CreateNamespace=true</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">ServerSideApply=true</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="argo-rollouts-配置" tabindex="-1"><a class="header-anchor" href="#argo-rollouts-配置"><span>Argo Rollouts 配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># overlays/production/rollout.yaml</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argoproj.io/v1alpha1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Rollout</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  replicas</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#E06C75;">  strategy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    canary</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      canaryService</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-canary</span></span>
<span class="line"><span style="color:#E06C75;">      stableService</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-stable</span></span>
<span class="line"><span style="color:#E06C75;">      trafficRouting</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        istio</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          virtualServices</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-vsvc</span></span>
<span class="line"><span style="color:#E06C75;">              routes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">                - </span><span style="color:#98C379;">primary</span></span>
<span class="line"><span style="color:#E06C75;">      steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">setWeight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">5</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">pause</span><span style="color:#ABB2BF;">: { </span><span style="color:#E06C75;">duration</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span><span style="color:#ABB2BF;"> }</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">setWeight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">25</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">pause</span><span style="color:#ABB2BF;">: { </span><span style="color:#E06C75;">duration</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span><span style="color:#ABB2BF;"> }</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">analysis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            templates</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">              - </span><span style="color:#E06C75;">templateName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production-check</span></span>
<span class="line"><span style="color:#E06C75;">            args</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">              - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service-name</span></span>
<span class="line"><span style="color:#E06C75;">                value</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-canary.production.svc.cluster.local</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">setWeight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">50</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">pause</span><span style="color:#ABB2BF;">: { </span><span style="color:#E06C75;">duration</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10m</span><span style="color:#ABB2BF;"> }</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">pause</span><span style="color:#ABB2BF;">: {}  </span><span style="color:#7F848E;font-style:italic;"># 手动审批</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">setWeight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">100</span></span>
<span class="line"><span style="color:#E06C75;">      analysis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        templates</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">templateName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">success-rate</span></span>
<span class="line"><span style="color:#E06C75;">        startingStep</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">2</span></span>
<span class="line"><span style="color:#E06C75;">  selector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    matchLabels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  template</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">    spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      containers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">          image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myregistry.azurecr.io/myapp:latest</span></span>
<span class="line"><span style="color:#E06C75;">          ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">containerPort</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span></span>
<span class="line"><span style="color:#E06C75;">          env</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ASPNETCORE_ENVIRONMENT</span></span>
<span class="line"><span style="color:#E06C75;">              value</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Production</span></span>
<span class="line"><span style="color:#E06C75;">          livenessProbe</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            httpGet</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/healthz</span></span>
<span class="line"><span style="color:#E06C75;">              port</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span></span>
<span class="line"><span style="color:#E06C75;">          readinessProbe</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            httpGet</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/ready</span></span>
<span class="line"><span style="color:#E06C75;">              port</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span></span>
<span class="line"><span style="color:#E06C75;">          resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            requests</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              cpu</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">250m</span></span>
<span class="line"><span style="color:#E06C75;">              memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">256Mi</span></span>
<span class="line"><span style="color:#E06C75;">            limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              cpu</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1&quot;</span></span>
<span class="line"><span style="color:#E06C75;">              memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">512Mi</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="gitops-工作流设计" tabindex="-1"><a class="header-anchor" href="#gitops-工作流设计"><span>GitOps 工作流设计</span></a></h2><h3 id="推荐工作流" tabindex="-1"><a class="header-anchor" href="#推荐工作流"><span>推荐工作流</span></a></h3>`,11),r(d,{code:`eJyVk01vElEUhvf9FSdtWCkJzDCz6MKE+YhxZVPd3XTB11CSkSEw1BhrQkULrbWgTY0R0lbRSNRSYmyD0P4Zw70w/8KBM3FuSmzTu5nF+845z3vuuYZpPU6sxvI2PNTmwD2FYjydj+VWYZ6el2jtjfP+jHVO56fa5ETDhG4fjssXKK9AMHgHogJhzR+02WWnr8Yn+yu+W0BdJKxWH/Y/w9IyJ4ooRoh6D9jBCzrowy2YKRFBl0SGg9boaIN2PrLDL6inssm5S9RYZ4ZamhZRXPh6lf4+o9UuPIplsn4bJYwOwYdx9pu0XOMsGEYRCe1s0ZdttvWd1Xgd8ygRwnbbTmlj5n9MokiENX6xd124m7Hv5wowHOzR/t5/Eznl9ujiJyaCIGipNT+XgrnUMInm05aqwbjyjW63aX2HHXszmhwVw6kCSabWYLR7Qj+VsSznwXSqSJzGJqvW+Xu4nuqBHUtnsmmfTMVhaOHJzdPXlcnEC2jye2rIpQlX42uIpolEF/SZBdG8Tu7YS1/dxbwZ+FLeShYTdsbK+uwaXpTOs+f++fzOOuLriA/LlmlaRbvAGRBcF4kUgD+bb0HwvlIowLkwgB55ynYq7KjCWiV3w5/5+hRnnR23aK+3DrpEwqFQANwNdCo19w3SXpkrhmZ6/hzNMvFm2jhggw+Xp2I/MVNuQTAyprm4EJKTcix0O2GZVn5xwTAM3iR7JsOQ43KcN/0FYDOLfg==`}),o[13]||=i(`<h3 id="环境提升策略" tabindex="-1"><a class="header-anchor" href="#环境提升策略"><span>环境提升策略</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 通过 Promotion 机制管理环境提升</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ArgoCD Promotion（手动）</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argoproj.io/v1alpha1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Application</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-staging</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  source</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    repoURL</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://github.com/example/myapp-gitops.git</span></span>
<span class="line"><span style="color:#E06C75;">    targetRevision</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">main</span></span>
<span class="line"><span style="color:#E06C75;">    path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">overlays/staging</span></span>
<span class="line"><span style="color:#E06C75;">    helm</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      parameters</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">image.tag</span></span>
<span class="line"><span style="color:#E06C75;">          value</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v2.0.1</span><span style="color:#7F848E;font-style:italic;">  # 由 CI 更新</span></span>
<span class="line"><span style="color:#E06C75;">  destination</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    server</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://kubernetes.default.svc</span></span>
<span class="line"><span style="color:#E06C75;">    namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">staging</span></span>
<span class="line"><span style="color:#E06C75;">  syncPolicy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    automated</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      prune</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">      selfHeal</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">  info</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Promote To</span></span>
<span class="line"><span style="color:#E06C75;">      value</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Run \`argocd app set myapp-prod -p image.tag=v2.0.1\`</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="argocd-运维" tabindex="-1"><a class="header-anchor" href="#argocd-运维"><span>ArgoCD 运维</span></a></h2><h3 id="备份与恢复" tabindex="-1"><a class="header-anchor" href="#备份与恢复"><span>备份与恢复</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 备份 ArgoCD 配置</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> get</span><span style="color:#98C379;"> applications</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> argocd</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> yaml</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">argocd-apps-backup.yaml</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> get</span><span style="color:#98C379;"> appprojects</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> argocd</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> yaml</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">argocd-projects-backup.yaml</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> get</span><span style="color:#98C379;"> secrets</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> argocd</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> yaml</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">argocd-secrets-backup.yaml</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> get</span><span style="color:#98C379;"> configmaps</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> argocd</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> yaml</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">argocd-cm-backup.yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 ArgoCD CLI 导出</span></span>
<span class="line"><span style="color:#61AFEF;">argocd</span><span style="color:#98C379;"> admin</span><span style="color:#98C379;"> export</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">argocd-backup.yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 恢复</span></span>
<span class="line"><span style="color:#61AFEF;">argocd</span><span style="color:#98C379;"> admin</span><span style="color:#98C379;"> import</span><span style="color:#ABB2BF;"> &lt; </span><span style="color:#98C379;">argocd-backup.yaml</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="性能调优" tabindex="-1"><a class="header-anchor" href="#性能调优"><span>性能调优</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># argocd-cmd-params-cm - 性能参数</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ConfigMap</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd-cmd-params-cm</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd</span></span>
<span class="line"><span style="color:#E06C75;">data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # Controller 配置</span></span>
<span class="line"><span style="color:#E06C75;">  controller.status.processors</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;20&quot;</span><span style="color:#7F848E;font-style:italic;">        # 状态处理并发数</span></span>
<span class="line"><span style="color:#E06C75;">  controller.operation.processors</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;10&quot;</span><span style="color:#7F848E;font-style:italic;">     # 操作处理并发数</span></span>
<span class="line"><span style="color:#E06C75;">  controller.repo.server.timeout.seconds</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;120&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # Repo Server 配置</span></span>
<span class="line"><span style="color:#E06C75;">  reposerver.parallelism.limit</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;8&quot;</span><span style="color:#7F848E;font-style:italic;">         # Git 操作并发数</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # API Server 配置</span></span>
<span class="line"><span style="color:#E06C75;">  server.repo.timeout.seconds</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;120&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 资源限制</span></span>
<span class="line"><span style="color:#E06C75;">  controller.resources.requests.cpu</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;500m&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  controller.resources.requests.memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;512Mi&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  controller.resources.limits.cpu</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;2&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  controller.resources.limits.memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;2Gi&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="监控-argocd-自身" tabindex="-1"><a class="header-anchor" href="#监控-argocd-自身"><span>监控 ArgoCD 自身</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># ArgoCD 自身指标 ServiceMonitor</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">monitoring.coreos.com/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ServiceMonitor</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd-metrics</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  selector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    matchLabels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      app.kubernetes.io/name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd-metrics</span></span>
<span class="line"><span style="color:#E06C75;">  endpoints</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">port</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">metrics</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">30s</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">monitoring.coreos.com/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ServiceMonitor</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd-repo-server-metrics</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  selector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    matchLabels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      app.kubernetes.io/name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd-repo-server</span></span>
<span class="line"><span style="color:#E06C75;">  endpoints</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">port</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">metrics</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">30s</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="常用运维命令" tabindex="-1"><a class="header-anchor" href="#常用运维命令"><span>常用运维命令</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看所有应用状态</span></span>
<span class="line"><span style="color:#61AFEF;">argocd</span><span style="color:#98C379;"> app</span><span style="color:#98C379;"> list</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看应用详情</span></span>
<span class="line"><span style="color:#61AFEF;">argocd</span><span style="color:#98C379;"> app</span><span style="color:#98C379;"> get</span><span style="color:#98C379;"> myapp</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 强制刷新应用状态</span></span>
<span class="line"><span style="color:#61AFEF;">argocd</span><span style="color:#98C379;"> app</span><span style="color:#98C379;"> get</span><span style="color:#98C379;"> myapp</span><span style="color:#D19A66;"> --refresh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 同步应用</span></span>
<span class="line"><span style="color:#61AFEF;">argocd</span><span style="color:#98C379;"> app</span><span style="color:#98C379;"> sync</span><span style="color:#98C379;"> myapp</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 仅同步 OutOfSync 资源</span></span>
<span class="line"><span style="color:#61AFEF;">argocd</span><span style="color:#98C379;"> app</span><span style="color:#98C379;"> sync</span><span style="color:#98C379;"> myapp</span><span style="color:#D19A66;"> --prune</span><span style="color:#D19A66;"> --async</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看 Diff</span></span>
<span class="line"><span style="color:#61AFEF;">argocd</span><span style="color:#98C379;"> app</span><span style="color:#98C379;"> diff</span><span style="color:#98C379;"> myapp</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 删除应用（保留资源）</span></span>
<span class="line"><span style="color:#61AFEF;">argocd</span><span style="color:#98C379;"> app</span><span style="color:#98C379;"> delete</span><span style="color:#98C379;"> myapp</span><span style="color:#D19A66;"> --cascade=false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看 ArgoCD 版本</span></span>
<span class="line"><span style="color:#61AFEF;">argocd</span><span style="color:#98C379;"> version</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 管理 Repo</span></span>
<span class="line"><span style="color:#61AFEF;">argocd</span><span style="color:#98C379;"> repo</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> https://github.com/example/repo</span><span style="color:#D19A66;"> --username</span><span style="color:#98C379;"> git</span><span style="color:#D19A66;"> --password</span><span style="color:#98C379;"> token</span></span>
<span class="line"><span style="color:#61AFEF;">argocd</span><span style="color:#98C379;"> repo</span><span style="color:#98C379;"> list</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2>`,14),r(d,{code:`eJxVkktOwlAUhueu4g41Jg7cAeIjTsSILqDRhpAUS0pNdCapSFFoa1CjoCiKYoxUBiBIVTbTc267C0u55TE83/nvf143Ed/fS3DJGUIkUZRnZ9ficiSZInZXw3yaWg27V7Otm7k5T0AIPnahr4D2AOqtDwiB5ybeaPCju5kC/TUZpTkV7z5Qq4P6xZCTfYezNzDy2HgJ3uqfYFYds+rH0HmBTMc9zkHlnAlCUkwML7PA1zv1U8hfk531EaTpNrYszwdz32NlrUTrD6h2GFkVDg4XR1nn13KzOu3Vx8Rvzr26A0XHcguvm2OrYVvFP2qdgKEO99A1nH7ZGxr0C+gqE92SLVEQxAM5NSrMxWK8FCj2OeEoFU9t84mkwMk8w9hOD/oxq9Q49VGU35V4mUyQAeMEfo+lAvuVQ5mXPNMAk0iSlzhZDApGI5tRMk9CsWEpMHOQeQOz4nTaTGFbRegV7f49ntUYcqvftGy6pUv6ajG0tRQKE7xX3FsjEPm7oo0/MAo+WthY2fYKTFiH1weTYbNFe/3g4t5dtE94UqZGGyLUDShkp39LuYJWaeYfP9UiTQ==`}),o[14]||=i(`<div class="hint-container tip"><p class="hint-container-title">GitOps 实施清单</p><ol><li><strong>从单一应用开始</strong>：先选一个非关键应用试点</li><li><strong>统一仓库结构</strong>：建立标准化的 GitOps 仓库模板</li><li><strong>分层管理配置</strong>：基础配置 → 环境覆盖 → 集群覆盖</li><li><strong>自动化 CI 到 CD</strong>：CI 只负责构建镜像和更新标签</li><li><strong>渐进式发布</strong>：生产环境始终使用 Canary 或 Blue-Green</li><li><strong>Secret 外置</strong>：使用 ESO 或 Sealed Secrets，不存明文</li><li><strong>监控与告警</strong>：监控 ArgoCD 自身和应用的 Sync 状态</li><li><strong>文档化流程</strong>：记录环境提升和回滚的标准操作</li><li><strong>定期演练回滚</strong>：验证回滚流程的可靠性</li><li><strong>建立 RBAC 模型</strong>：不同环境不同权限，生产环境需审批</li></ol></div>`,1)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};