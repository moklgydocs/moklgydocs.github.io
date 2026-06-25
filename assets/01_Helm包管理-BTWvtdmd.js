import{A as e,E as t,d as n,l as r,p as i,s as a}from"./runtime-core.esm-bundler-BVtXrkU4.js";import{t as o}from"./app-BlItlXL1.js";var s=JSON.parse(`{"path":"/%E8%BF%90%E7%BB%B4%E4%B8%8E%E9%83%A8%E7%BD%B2/Docker_K8s/07_Kubernetes%E7%94%9F%E4%BA%A7%E5%AE%9E%E6%88%98/01_Helm%E5%8C%85%E7%AE%A1%E7%90%86.html","title":"Helm 包管理","lang":"zh-CN","frontmatter":{"title":"Helm 包管理","icon":"package","order":1,"category":["Kubernetes生产实战"],"tag":["Helm","包管理","Chart","GitOps","Kustomize"]},"git":{"createdTime":1780623253000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":2}]},"readingTime":{"minutes":23.04,"words":6911},"filePathRelative":"运维与部署/Docker_K8s/07_Kubernetes生产实战/01_Helm包管理.md"}`),c={name:`01_Helm包管理.md`};function l(o,s,c,l,u,d){let f=e(`Mermaid`);return t(),r(`div`,null,[s[0]||=n(`<h1 id="helm-包管理" tabindex="-1"><a class="header-anchor" href="#helm-包管理"><span>Helm 包管理</span></a></h1><h2 id="helm-概述" tabindex="-1"><a class="header-anchor" href="#helm-概述"><span>Helm 概述</span></a></h2><p>Helm 是 Kubernetes 的官方包管理器，被誉为 &quot;Kubernetes 的 apt/yum&quot;。它将 Kubernetes 资源定义模板化，通过 Chart 的形式实现应用的一键部署、升级和回滚，极大地简化了复杂应用在 Kubernetes 上的生命周期管理。</p><div class="hint-container tip"><p class="hint-container-title">为什么需要 Helm？</p><p>一个典型的微服务应用可能包含 Deployment、Service、ConfigMap、Secret、Ingress 等数十个 YAML 文件。手动管理这些文件不仅繁琐，而且容易出错。Helm 通过模板化和参数化，让你用一套 Chart + 不同的 values 就能管理多个环境的部署。</p></div><h3 id="helm-版本演进" tabindex="-1"><a class="header-anchor" href="#helm-版本演进"><span>Helm 版本演进</span></a></h3>`,5),i(f,{code:`eJwrycxNzcnMS+VSAIKSzJKcVAWP1JxcheedHc/mrHm2Z8qL/bPBckYGhmYKVhDJMkMg6+Wyac/WLHzaP/HpjmaYCgu4CiMg6+meqU9blyqEZObkpBYpPJvT+7Rr4fPV65/vbnmyextMiyVcizGQ9Xz57pczl8C0AI1Y1/m0dcWzhuVPlyx/urP1Wf+Ep73tUK1GBgiteobaQI6/s6fCs80rnrb1vFi44tmU9c96GmFqQe6BqzUAKfYK9vdTCE7OSM1NVHi5qufFerhaE2S1JiC1QIOe7177ZM+Mpz3Tnuzog7jq6aJ5T/fs4gIAQvmFFg==`}),s[1]||=a(`h3`,{id:`helm-v2-vs-v3-架构对比`,tabindex:`-1`},[a(`a`,{class:`header-anchor`,href:`#helm-v2-vs-v3-架构对比`},[a(`span`,null,`Helm v2 vs v3 架构对比`)])],-1),i(f,{code:`eJxLL0osyFAIceJSAILi0iQIX8kjNSdXocxI4dm8bc/mtSiBZUEgJbMoNbkkMz8PpgUEPIyco8EanHMyU/NKYhV0de1q0oMCnGsUQjJzclKLopUgtE1Skb7dy9ltz/ctedrW+mxO79Ouhc9Xr1eKhRsFUQc2wDHAUyE4tagstahGwdui2CjauzQptSgvtSS1WAEoh1VPaklySo2Cq1E0iBHLBVdSXFKZkwpTmAakrJTT0sySzJJ0kvNz8otAvDQ0xUBPQVWapCanJJugq0zNS4GYjx5oxkQGmjGWQAN50Tk/Ly0zHexnY5x+Bkki+9gY6mOYfJBxtFJQak5qYnGqwtO1M542rQCHfXBqclFqSbES0DY9kHUWxcAgBglBrEMPMKAb8YYBQmWQMVShpWmqYYoxtsACAOT3v+c=`}),s[2]||=n(`<div class="hint-container important"><p class="hint-container-title">Helm v3 的核心改进</p><ol><li><strong>移除 Tiller</strong>：v3 不再需要集群内的 Tiller 组件，直接通过 KubeConfig 与 API Server 交互，权限模型与 kubectl 一致</li><li><strong>Release 存储变更</strong>：从 ConfigMap 迁移到 Secret，默认加密存储更安全</li><li><strong>三方合并策略</strong>：升级时采用三方合并（旧 values + 旧 chart + 新 values），替代 v2 的双方合并</li><li><strong>OCI 注册表支持</strong>：可以将 Chart 推送到 OCI 兼容的镜像仓库</li></ol></div><hr><h2 id="helm-架构详解" tabindex="-1"><a class="header-anchor" href="#helm-架构详解"><span>Helm 架构详解</span></a></h2><h3 id="helm-v3-核心组件" tabindex="-1"><a class="header-anchor" href="#helm-v3-核心组件"><span>Helm v3 核心组件</span></a></h3>`,4),i(f,{code:`eJxlkMFKw0AQhu8+xZCTIm2vHqRQatHSFEriRZYe0jq2gTQJuxtB6FF7U4tpTyKl4KEnD4pSGtGXaTb6Fia7pRUd2IXhn//nm+lQy++CbmxBWixoqV47QqcHZcdGl2tSyqqsV0lXCnq1CblcESpux3aRaGI2FQ+f8ftYhDf7LVooHnrAsec7FkfYBdOndkdr/g6S9oYTpH4ibu+W0VvyEiXR5P+Qgb5HllEYL8LkaZoMB2oE3dOtP9C1oIXURY4Mvu8HycfjBr3UqJL0gYn0HKmCN7lHkWwb6KDFMJXaFDnb2RBkBkXAvIC2kRGttsfg6/VSLIZyzQP0He+il16pkCXbbSzk8/nVpmvC1SZ9o2IeZ6H97JOKup8UxfxZTMI+1C3XPkPGGTkp1XUQ86v4eqwC15I0xItRMpqprB8WBJyL`}),s[3]||=a(`h3`,{id:`helm-渲染流程`,tabindex:`-1`},[a(`a`,{class:`header-anchor`,href:`#helm-渲染流程`},[a(`span`,null,`Helm 渲染流程`)])],-1),i(f,{code:`eJxNkF9r01AYxu/3KV6ySw2rOIcOGXTt1nWtINYbOfQiTU/W4qkpSeYQK0S30jiqFNbK1I36Z4UyWO2GztkY912G5yT5FqYnqfRcvfD83uec81OIuiWXJM2Ah8kZCE4clTCpQPmJbkiEzG1WNzSpiPMgikuwjOjuJ89xIDHeyHN+mScJJNCWRX+dw1OJbGL9bkGbW/LtfW9wBNfAbfeZ9TMYRAXYu8Zf+3w8izo2hLAkwUuSSGD9z+zwkv7usL237OKMdfd4U0oFA1eqRDJwsJmrauUNoA2HdYZRQZIXrDzPySVckcA/bnrfXr7g0co4qvnmB++yUYNV5La7zGqxA9O1LXgUv5cFdlGnbzphUUjTo1Pve68GKXR12AS22/Pb733TpI1RSK3y69aQ4H/ZYV9N1u1BSVUfh9+ualic6BvPkcLopWt8NY284XagBTK3dYjfTwO1PlJ75P3YYaNWCKY5uI4E9+Q1/VOnw1PXPuYXiOKWVJ6oW+dYJvB/sk9f9eEBJljSMXiDIXU6nM9hWfuvOsP5LLo6qIO/3XedMzpoBkLyMzzWjWcEQxyUMiGLs/NYLsrz12WVqNrirKIoU0w2Yu7cwjeKNydMLBabYlIRoygLhYXCdM8/6Hb30g==`}),s[4]||=a(`h3`,{id:`release-生命周期`,tabindex:`-1`},[a(`a`,{class:`header-anchor`,href:`#release-生命周期`},[a(`span`,null,`Release 生命周期`)])],-1),i(f,{code:`eJwrLkksSXXJTEwvSszVLTPiUgCCaK1YBV1dO4WU1IKc/MrUFCuFjNScXIXMPKDinBywEpgUNnWlBUDDUlIx1RWXFqQWFaemoKu0SSrSt3u/p+PZ9OXPOzuezVnzYtHqZ7P3P9m9+P2eTkxjSvOgLkGYAxPBVJyWmAlW93Rd54vFrfpPe9uf71r+dMnGF1uWghVD5PF4AyhVlFpSVImumpArEJ4FKweGKVgYSRtcHCyRl1+SqlCUmZ5RopCfhuSWp3snP+3sfbZl94vtzZDQwaIcOWSf9rU97d8EUQoM1Kf965/Onvds9yxQWAIAMLfANA==`}),s[5]||=n(`<hr><h2 id="chart-目录结构" tabindex="-1"><a class="header-anchor" href="#chart-目录结构"><span>Chart 目录结构</span></a></h2><p>Chart 是 Helm 的核心打包格式，一个标准的 Chart 目录结构如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>myapp/</span></span>
<span class="line"><span>├── Chart.yaml              # Chart 元数据（名称、版本、依赖等）</span></span>
<span class="line"><span>├── Chart.lock              # 依赖锁定文件（类似 package-lock.json）</span></span>
<span class="line"><span>├── values.yaml             # 默认配置值</span></span>
<span class="line"><span>├── values.schema.json      # values JSON Schema 验证</span></span>
<span class="line"><span>├── .helmignore             # 打包时忽略的文件</span></span>
<span class="line"><span>├── templates/              # 模板目录</span></span>
<span class="line"><span>│   ├── _helpers.tpl        # 模板辅助函数（命名模板）</span></span>
<span class="line"><span>│   ├── deployment.yaml     # Deployment 模板</span></span>
<span class="line"><span>│   ├── service.yaml        # Service 模板</span></span>
<span class="line"><span>│   ├── ingress.yaml        # Ingress 模板</span></span>
<span class="line"><span>│   ├── configmap.yaml      # ConfigMap 模板</span></span>
<span class="line"><span>│   ├── secret.yaml         # Secret 模板</span></span>
<span class="line"><span>│   ├── hpa.yaml            # HorizontalPodAutoscaler 模板</span></span>
<span class="line"><span>│   ├── servicemonitor.yaml # ServiceMonitor 模板</span></span>
<span class="line"><span>│   ├── NOTES.txt           # 安装后提示信息</span></span>
<span class="line"><span>│   └── tests/              # Chart 测试</span></span>
<span class="line"><span>│       └── test-connection.yaml</span></span>
<span class="line"><span>├── templates/partials/     # 局部模板（可选）</span></span>
<span class="line"><span>├── charts/                 # 依赖的子 Chart</span></span>
<span class="line"><span>│   ├── redis/</span></span>
<span class="line"><span>│   └── postgresql/</span></span>
<span class="line"><span>├── crds/                   # 自定义资源定义（CRD）</span></span>
<span class="line"><span>│   └── mycrd.yaml</span></span>
<span class="line"><span>└── files/                  # 静态文件（可选）</span></span>
<span class="line"><span>    └── config.ini</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="chart-yaml-详解" tabindex="-1"><a class="header-anchor" href="#chart-yaml-详解"><span>Chart.yaml 详解</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v2</span><span style="color:#7F848E;font-style:italic;">  # Helm v3 使用 v2</span></span>
<span class="line"><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span><span style="color:#7F848E;font-style:italic;">     # Chart 名称（必需）</span></span>
<span class="line"><span style="color:#E06C75;">description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">A .NET application Helm chart</span><span style="color:#7F848E;font-style:italic;">  # 描述</span></span>
<span class="line"><span style="color:#E06C75;">type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">application</span><span style="color:#7F848E;font-style:italic;">  # application 或 library</span></span>
<span class="line"><span style="color:#E06C75;">version</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">1.0.0</span><span style="color:#7F848E;font-style:italic;">     # Chart 版本（SemVer 2，必需）</span></span>
<span class="line"><span style="color:#E06C75;">appVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;8.0&quot;</span><span style="color:#7F848E;font-style:italic;">  # 应用版本（非 Chart 版本）</span></span>
<span class="line"><span style="color:#E06C75;">kubeVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;&gt;=1.24.0-0&quot;</span><span style="color:#7F848E;font-style:italic;">  # 兼容的 K8s 版本范围</span></span>
<span class="line"><span style="color:#E06C75;">icon</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://example.com/logo.png</span><span style="color:#7F848E;font-style:italic;">  # 图标 URL</span></span>
<span class="line"><span style="color:#E06C75;">deprecated</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span><span style="color:#7F848E;font-style:italic;">   # 是否已弃用</span></span>
<span class="line"><span style="color:#E06C75;">home</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://example.com</span><span style="color:#7F848E;font-style:italic;">  # 项目主页</span></span>
<span class="line"><span style="color:#E06C75;">keywords</span><span style="color:#ABB2BF;">:            </span><span style="color:#7F848E;font-style:italic;"># 关键词</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">dotnet</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">web</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">microservice</span></span>
<span class="line"><span style="color:#E06C75;">maintainers</span><span style="color:#ABB2BF;">:         </span><span style="color:#7F848E;font-style:italic;"># 维护者</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">team-dev</span></span>
<span class="line"><span style="color:#E06C75;">    email</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">dev@example.com</span></span>
<span class="line"><span style="color:#E06C75;">    url</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://example.com</span></span>
<span class="line"><span style="color:#E06C75;">sources</span><span style="color:#ABB2BF;">:             </span><span style="color:#7F848E;font-style:italic;"># 源码地址</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">https://github.com/example/myapp</span></span>
<span class="line"><span style="color:#E06C75;">dependencies</span><span style="color:#ABB2BF;">:        </span><span style="color:#7F848E;font-style:italic;"># 依赖</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis</span></span>
<span class="line"><span style="color:#E06C75;">    version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;18.0.0&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    repository</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;https://charts.bitnami.com/bitnami&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis.enabled</span><span style="color:#7F848E;font-style:italic;">  # 条件启用</span></span>
<span class="line"><span style="color:#E06C75;">    alias</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis</span><span style="color:#7F848E;font-style:italic;">              # 别名</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">postgresql</span></span>
<span class="line"><span style="color:#E06C75;">    version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;13.0.0&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    repository</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;https://charts.bitnami.com/bitnami&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">postgresql.enabled</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">version vs appVersion</p><ul><li><code>version</code>：Chart 自身的版本，每次修改 Chart 必须递增，遵循 SemVer 2 规范</li><li><code>appVersion</code>：包含的应用版本，仅作信息展示，Helm 不用它做版本计算</li><li><code>type: library</code>：库 Chart 不能独立部署，只能被其他 Chart 作为依赖引用</li></ul></div><hr><h2 id="values-yaml-与模板引擎" tabindex="-1"><a class="header-anchor" href="#values-yaml-与模板引擎"><span>values.yaml 与模板引擎</span></a></h2><h3 id="values-yaml-配置体系" tabindex="-1"><a class="header-anchor" href="#values-yaml-配置体系"><span>values.yaml 配置体系</span></a></h3><p>values.yaml 是 Helm Chart 的配置核心，所有可变参数集中在此定义：</p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># values.yaml - .NET 应用示例</span></span>
<span class="line"><span style="color:#E06C75;">replicaCount</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">image</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  repository</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myregistry.azurecr.io/myapp</span></span>
<span class="line"><span style="color:#E06C75;">  pullPolicy</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">IfNotPresent</span></span>
<span class="line"><span style="color:#E06C75;">  tag</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;8.0.1&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">imagePullSecrets</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">acr-secret</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">nameOverride</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;&quot;</span></span>
<span class="line"><span style="color:#E06C75;">fullnameOverride</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">serviceAccount</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  create</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    azure.workload.identity/client-id</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;xxx&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">podAnnotations</span><span style="color:#ABB2BF;">: {}</span></span>
<span class="line"><span style="color:#E06C75;">podLabels</span><span style="color:#ABB2BF;">: {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">podSecurityContext</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  runAsNonRoot</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">  runAsUser</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">1000</span></span>
<span class="line"><span style="color:#E06C75;">  fsGroup</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">2000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">securityContext</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  allowPrivilegeEscalation</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span></span>
<span class="line"><span style="color:#E06C75;">  readOnlyRootFilesystem</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">  capabilities</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    drop</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">ALL</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ClusterIP</span></span>
<span class="line"><span style="color:#E06C75;">  port</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">80</span></span>
<span class="line"><span style="color:#E06C75;">  targetPort</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">ingress</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  enabled</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">  className</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    cert-manager.io/cluster-issuer</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">letsencrypt-prod</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/rate-limit</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;100&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp.example.com</span></span>
<span class="line"><span style="color:#E06C75;">      paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/</span></span>
<span class="line"><span style="color:#E06C75;">          pathType</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Prefix</span></span>
<span class="line"><span style="color:#E06C75;">  tls</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">secretName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-tls</span></span>
<span class="line"><span style="color:#E06C75;">      hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">myapp.example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  requests</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    cpu</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">250m</span></span>
<span class="line"><span style="color:#E06C75;">    memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">256Mi</span></span>
<span class="line"><span style="color:#E06C75;">  limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    cpu</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">512Mi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">autoscaling</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  enabled</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">  minReplicas</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">  maxReplicas</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#E06C75;">  targetCPUUtilizationPercentage</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">80</span></span>
<span class="line"><span style="color:#E06C75;">  targetMemoryUtilizationPercentage</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">80</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">env</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  ASPNETCORE_ENVIRONMENT</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Production</span></span>
<span class="line"><span style="color:#E06C75;">  ASPNETCORE_URLS</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;http://+:8080&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  Logging__Console__Formatter</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">envFrom</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">configMapRef</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-config</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">secretRef</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-secrets</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">configMap</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    appsettings.json</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">      {</span></span>
<span class="line"><span style="color:#98C379;">        &quot;Logging&quot;: {</span></span>
<span class="line"><span style="color:#98C379;">          &quot;LogLevel&quot;: {</span></span>
<span class="line"><span style="color:#98C379;">            &quot;Default&quot;: &quot;Information&quot;</span></span>
<span class="line"><span style="color:#98C379;">          }</span></span>
<span class="line"><span style="color:#98C379;">        },</span></span>
<span class="line"><span style="color:#98C379;">        &quot;ConnectionStrings&quot;: {</span></span>
<span class="line"><span style="color:#98C379;">          &quot;Redis&quot;: &quot;redis-master:6379&quot;</span></span>
<span class="line"><span style="color:#98C379;">        }</span></span>
<span class="line"><span style="color:#98C379;">      }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">tmp</span></span>
<span class="line"><span style="color:#E06C75;">    emptyDir</span><span style="color:#ABB2BF;">: {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">volumeMounts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">tmp</span></span>
<span class="line"><span style="color:#E06C75;">    mountPath</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/tmp</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">nodeSelector</span><span style="color:#ABB2BF;">: {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">tolerations</span><span style="color:#ABB2BF;">: []</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">affinity</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  podAntiAffinity</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    preferredDuringSchedulingIgnoredDuringExecution</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">weight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">100</span></span>
<span class="line"><span style="color:#E06C75;">        podAffinityTerm</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          labelSelector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            matchExpressions</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">              - </span><span style="color:#E06C75;">key</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app.kubernetes.io/name</span></span>
<span class="line"><span style="color:#E06C75;">                operator</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">In</span></span>
<span class="line"><span style="color:#E06C75;">                values</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">                  - </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">          topologyKey</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">kubernetes.io/hostname</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 子 Chart 配置</span></span>
<span class="line"><span style="color:#E06C75;">redis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  enabled</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">  auth</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    enabled</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    password</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  master</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    persistence</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      enabled</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">      size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">8Gi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">postgresql</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  enabled</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="values-优先级" tabindex="-1"><a class="header-anchor" href="#values-优先级"><span>Values 优先级</span></a></h3>`,13),i(f,{code:`eJxLL0osyFBwCuFSAALHaKWnaycoOGckFpUoPJ/VolCWmFOaWqxXmZibY5NUpG/3ZM+Mp60dz3ctfzan4cnePqVYBV1dOwWn6Ocd27DrigWb6wRW5hytm6bwrKf96bpZCFUKz6a1P9m9DaLOGazOJVpJV7c4tUThaX/Ts6kbMCx+uXqGUiwXWENxSWVOqoKLQlpmTo6VclqaWZJZkk5yfk5+EYiXhqTGGa4m0dTACLsaJ6gak9TklGQT7GocoWosTVMNU4xhagwMDLgAwlJ5GQ==`}),s[6]||=n(`<div class="hint-container important"><p class="hint-container-title">Values 合并规则</p><ol><li>父 Chart 的 values 会覆盖子 Chart 的默认 values</li><li><code>-f</code> 文件可叠加多个，后加载的覆盖先加载的</li><li><code>--set</code> 优先级最高，会覆盖所有文件中的值</li><li>数组类型是替换而非合并；对象类型是深度合并</li><li><code>--set</code> 语法：<code>--set image.tag=v2.0</code>、<code>--set env[0].name=KEY</code></li></ol></div><hr><h2 id="内置函数与管道" tabindex="-1"><a class="header-anchor" href="#内置函数与管道"><span>内置函数与管道</span></a></h2><p>Helm 模板引擎基于 Go template 并扩展了 Sprig 函数库，提供了丰富的内置函数。</p><h3 id="常用内置函数" tabindex="-1"><a class="header-anchor" href="#常用内置函数"><span>常用内置函数</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># templates/deployment.yaml</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">apps/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Deployment</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ include &quot;myapp.fullname&quot; . }}</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Release.Namespace | default &quot;default&quot; }}</span></span>
<span class="line"><span style="color:#E06C75;">  labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">    {{- include &quot;myapp.labels&quot; . | nindent 4 }}</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 时间戳函数</span></span>
<span class="line"><span style="color:#E06C75;">    deploy-time</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ now | date &quot;2006-01-02 15:04:05&quot; }}</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # SHA256 校验（ConfigMap 变更时触发滚动更新）</span></span>
<span class="line"><span style="color:#E06C75;">    checksum/config</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ include (print $.Template.BasePath &quot;/configmap.yaml&quot;) . | sha256sum }}</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  replicas</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.replicaCount }}</span></span>
<span class="line"><span style="color:#E06C75;">  selector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    matchLabels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">      {{- include &quot;myapp.selectorLabels&quot; . | nindent 6 }}</span></span>
<span class="line"><span style="color:#E06C75;">  template</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">        {{- include &quot;myapp.selectorLabels&quot; . | nindent 8 }}</span></span>
<span class="line"><span style="color:#98C379;">        {{- with .Values.podLabels }}</span></span>
<span class="line"><span style="color:#98C379;">        {{- toYaml . | nindent 8 }}</span></span>
<span class="line"><span style="color:#98C379;">        {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">      annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">        {{- with .Values.podAnnotations }}</span></span>
<span class="line"><span style="color:#98C379;">        {{- toYaml . | nindent 8 }}</span></span>
<span class="line"><span style="color:#98C379;">        {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">    spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 默认值函数</span></span>
<span class="line"><span style="color:#98C379;">      {{- with .Values.imagePullSecrets }}</span></span>
<span class="line"><span style="color:#E06C75;">      imagePullSecrets</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">        {{- toYaml . | nindent 8 }}</span></span>
<span class="line"><span style="color:#98C379;">      {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">      serviceAccountName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.serviceAccount.name | default (include &quot;myapp.fullname&quot; .) }}</span></span>
<span class="line"><span style="color:#E06C75;">      securityContext</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">        {{- toYaml .Values.podSecurityContext | nindent 8 }}</span></span>
<span class="line"><span style="color:#E06C75;">      containers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Chart.Name }}</span></span>
<span class="line"><span style="color:#E06C75;">          securityContext</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">            {{- toYaml .Values.securityContext | nindent 12 }}</span></span>
<span class="line"><span style="color:#E06C75;">          image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          imagePullPolicy</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.image.pullPolicy }}</span></span>
<span class="line"><span style="color:#E06C75;">          ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">http</span></span>
<span class="line"><span style="color:#E06C75;">              containerPort</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.service.targetPort }}</span></span>
<span class="line"><span style="color:#E06C75;">              protocol</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">TCP</span></span>
<span class="line"><span style="color:#E06C75;">          env</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 列表渲染</span></span>
<span class="line"><span style="color:#98C379;">            {{- range $key, $value := .Values.env }}</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ $key }}</span></span>
<span class="line"><span style="color:#E06C75;">              value</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ $value | quote }}</span></span>
<span class="line"><span style="color:#98C379;">            {{- end }}</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 从 ConfigMap 和 Secret 引用</span></span>
<span class="line"><span style="color:#98C379;">            {{- range .Values.envFrom }}</span></span>
<span class="line"><span style="color:#E06C75;">            envFrom</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">              {{- toYaml . | nindent 12 }}</span></span>
<span class="line"><span style="color:#98C379;">            {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">          livenessProbe</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            httpGet</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/healthz</span></span>
<span class="line"><span style="color:#E06C75;">              port</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">http</span></span>
<span class="line"><span style="color:#E06C75;">            initialDelaySeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.livenessProbe.initialDelaySeconds | default 30 }}</span></span>
<span class="line"><span style="color:#E06C75;">            periodSeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.livenessProbe.periodSeconds | default 10 }}</span></span>
<span class="line"><span style="color:#E06C75;">          readinessProbe</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            httpGet</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/ready</span></span>
<span class="line"><span style="color:#E06C75;">              port</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">http</span></span>
<span class="line"><span style="color:#E06C75;">            initialDelaySeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.readinessProbe.initialDelaySeconds | default 5 }}</span></span>
<span class="line"><span style="color:#E06C75;">            periodSeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.readinessProbe.periodSeconds | default 5 }}</span></span>
<span class="line"><span style="color:#E06C75;">          resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">            {{- toYaml .Values.resources | nindent 12 }}</span></span>
<span class="line"><span style="color:#E06C75;">          volumeMounts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">            {{- range .Values.volumeMounts }}</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .name }}</span></span>
<span class="line"><span style="color:#E06C75;">              mountPath</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .mountPath }}</span></span>
<span class="line"><span style="color:#98C379;">            {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">      volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">        {{- range .Values.volumes }}</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .name }}</span></span>
<span class="line"><span style="color:#98C379;">          {{- if .emptyDir }}</span></span>
<span class="line"><span style="color:#E06C75;">          emptyDir</span><span style="color:#ABB2BF;">: {}</span></span>
<span class="line"><span style="color:#98C379;">          {{- else if .persistentVolumeClaim }}</span></span>
<span class="line"><span style="color:#E06C75;">          persistentVolumeClaim</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            claimName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .persistentVolumeClaim.claimName }}</span></span>
<span class="line"><span style="color:#98C379;">          {{- end }}</span></span>
<span class="line"><span style="color:#98C379;">        {{- end }}</span></span>
<span class="line"><span style="color:#98C379;">      {{- with .Values.nodeSelector }}</span></span>
<span class="line"><span style="color:#E06C75;">      nodeSelector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">        {{- toYaml . | nindent 8 }}</span></span>
<span class="line"><span style="color:#98C379;">      {{- end }}</span></span>
<span class="line"><span style="color:#98C379;">      {{- with .Values.affinity }}</span></span>
<span class="line"><span style="color:#E06C75;">      affinity</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">        {{- toYaml . | nindent 8 }}</span></span>
<span class="line"><span style="color:#98C379;">      {{- end }}</span></span>
<span class="line"><span style="color:#98C379;">      {{- with .Values.tolerations }}</span></span>
<span class="line"><span style="color:#E06C75;">      tolerations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">        {{- toYaml . | nindent 8 }}</span></span>
<span class="line"><span style="color:#98C379;">      {{- end }}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="辅助模板-helpers-tpl" tabindex="-1"><a class="header-anchor" href="#辅助模板-helpers-tpl"><span>辅助模板（_helpers.tpl）</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#98C379;">{{/*
应用全名：release名-chart名
*/}}</span></span>
<span class="line"><span style="color:#98C379;">{{- define &quot;myapp.fullname&quot; -}}</span></span>
<span class="line"><span style="color:#98C379;">{{- if .Values.fullnameOverride }}</span></span>
<span class="line"><span style="color:#98C379;">{{- .Values.fullnameOverride | trunc 63 | trimSuffix &quot;-&quot; }}</span></span>
<span class="line"><span style="color:#98C379;">{{- else if .Values.nameOverride }}</span></span>
<span class="line"><span style="color:#98C379;">{{- .Values.nameOverride | trunc 63 | trimSuffix &quot;-&quot; }}</span></span>
<span class="line"><span style="color:#98C379;">{{- else }}</span></span>
<span class="line"><span style="color:#98C379;">{{- .Release.Name | trunc 63 | trimSuffix &quot;-&quot; }}</span></span>
<span class="line"><span style="color:#98C379;">{{- end }}</span></span>
<span class="line"><span style="color:#98C379;">{{- end }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">{{/*
通用标签
*/}}</span></span>
<span class="line"><span style="color:#98C379;">{{- define &quot;myapp.labels&quot; -}}</span></span>
<span class="line"><span style="color:#E06C75;">helm.sh/chart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ printf &quot;%s-%s&quot; .Chart.Name .Chart.Version | replace &quot;+&quot; &quot;_&quot; | trunc 63 | trimSuffix &quot;-&quot; }}</span></span>
<span class="line"><span style="color:#98C379;">{{ include &quot;myapp.selectorLabels&quot; . }}</span></span>
<span class="line"><span style="color:#98C379;">{{- if .Chart.AppVersion }}</span></span>
<span class="line"><span style="color:#E06C75;">app.kubernetes.io/version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Chart.AppVersion | quote }}</span></span>
<span class="line"><span style="color:#98C379;">{{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">app.kubernetes.io/managed-by</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Release.Service }}</span></span>
<span class="line"><span style="color:#98C379;">{{- end }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">{{/*
选择器标签（用于 matchLabels，不可变更）
*/}}</span></span>
<span class="line"><span style="color:#98C379;">{{- define &quot;myapp.selectorLabels&quot; -}}</span></span>
<span class="line"><span style="color:#E06C75;">app.kubernetes.io/name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Chart.Name }}</span></span>
<span class="line"><span style="color:#E06C75;">app.kubernetes.io/instance</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Release.Name }}</span></span>
<span class="line"><span style="color:#98C379;">{{- end }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">{{/*
ServiceAccount 名称
*/}}</span></span>
<span class="line"><span style="color:#98C379;">{{- define &quot;myapp.serviceAccountName&quot; -}}</span></span>
<span class="line"><span style="color:#98C379;">{{- if .Values.serviceAccount.create }}</span></span>
<span class="line"><span style="color:#98C379;">{{- .Values.serviceAccount.name | default (include &quot;myapp.fullname&quot; .) }}</span></span>
<span class="line"><span style="color:#98C379;">{{- else }}</span></span>
<span class="line"><span style="color:#98C379;">{{- .Values.serviceAccount.name | default &quot;default&quot; }}</span></span>
<span class="line"><span style="color:#98C379;">{{- end }}</span></span>
<span class="line"><span style="color:#98C379;">{{- end }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">{{/*
资源名称辅助（用于同一 Chart 多实例场景）
*/}}</span></span>
<span class="line"><span style="color:#98C379;">{{- define &quot;myapp.resourceName&quot; -}}</span></span>
<span class="line"><span style="color:#98C379;">{{- include &quot;myapp.fullname&quot; . -}}-{{ .Component | default &quot;main&quot; }}</span></span>
<span class="line"><span style="color:#98C379;">{{- end }}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="sprig-函数速查" tabindex="-1"><a class="header-anchor" href="#sprig-函数速查"><span>Sprig 函数速查</span></a></h3><table><thead><tr><th>分类</th><th>函数</th><th>示例</th></tr></thead><tbody><tr><td><strong>字符串</strong></td><td><code>upper</code>, <code>lower</code>, <code>trim</code>, <code>replace</code>, <code>trunc</code></td><td><code>{{ .Values.name | upper }}</code></td></tr><tr><td><strong>日期</strong></td><td><code>now</code>, <code>date</code>, <code>dateInZone</code></td><td><code>{{ now | date &quot;2006-01-02&quot; }}</code></td></tr><tr><td><strong>编码</strong></td><td><code>b64enc</code>, <code>b64dec</code>, <code>quote</code>, <code>squote</code></td><td><code>{{ .Values.password | b64enc }}</code></td></tr><tr><td><strong>默认值</strong></td><td><code>default</code>, <code>coalesce</code>, <code>empty</code></td><td><code>{{ .Values.port | default 8080 }}</code></td></tr><tr><td><strong>列表</strong></td><td><code>list</code>, <code>first</code>, <code>last</code>, <code>uniq</code>, <code>append</code></td><td><code>{{ list 1 2 3 | first }}</code></td></tr><tr><td><strong>字典</strong></td><td><code>dict</code>, <code>get</code>, <code>set</code>, <code>keys</code>, <code>values</code></td><td><code>{{ get (dict &quot;a&quot; 1) &quot;a&quot; }}</code></td></tr><tr><td><strong>类型</strong></td><td><code>kindOf</code>, <code>typeOf</code>, <code>toString</code></td><td><code>{{ kindOf .Values.port }}</code></td></tr><tr><td><strong>加密</strong></td><td><code>sha256sum</code>, <code>htpasswd</code>, <code>derivePassword</code></td><td><code>{{ .Values.data | sha256sum }}</code></td></tr><tr><td><strong>正则</strong></td><td><code>regexMatch</code>, <code>regexReplaceAll</code></td><td><code>{{ regexMatch &quot;^[a-z]+$&quot; .Values.name }}</code></td></tr><tr><td><strong>路径</strong></td><td><code>base</code>, <code>dir</code>, <code>ext</code>, <code>clean</code></td><td><code>{{ &quot;/a/b/c.txt&quot; | base }}</code> → c.txt</td></tr></tbody></table><hr><h2 id="条件与循环" tabindex="-1"><a class="header-anchor" href="#条件与循环"><span>条件与循环</span></a></h2><h3 id="条件渲染" tabindex="-1"><a class="header-anchor" href="#条件渲染"><span>条件渲染</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># Ingress 条件渲染</span></span>
<span class="line"><span style="color:#98C379;">{{- if .Values.ingress.enabled -}}</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networking.k8s.io/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Ingress</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ include &quot;myapp.fullname&quot; . }}</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Release.Namespace }}</span></span>
<span class="line"><span style="color:#98C379;">  {{- with .Values.ingress.annotations }}</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">    {{- toYaml . | nindent 4 }}</span></span>
<span class="line"><span style="color:#98C379;">  {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">  {{- if .Values.ingress.className }}</span></span>
<span class="line"><span style="color:#E06C75;">  ingressClassName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.ingress.className | quote }}</span></span>
<span class="line"><span style="color:#98C379;">  {{- end }}</span></span>
<span class="line"><span style="color:#98C379;">  {{- if .Values.ingress.tls }}</span></span>
<span class="line"><span style="color:#E06C75;">  tls</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">    {{- range .Values.ingress.tls }}</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">        {{- range .hosts }}</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">{{ . | quote }}</span></span>
<span class="line"><span style="color:#98C379;">        {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">      secretName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .secretName }}</span></span>
<span class="line"><span style="color:#98C379;">    {{- end }}</span></span>
<span class="line"><span style="color:#98C379;">  {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">  rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">    {{- range .Values.ingress.hosts }}</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .host | quote }}</span></span>
<span class="line"><span style="color:#E06C75;">      http</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">          {{- range .paths }}</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .path }}</span></span>
<span class="line"><span style="color:#E06C75;">            pathType</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .pathType }}</span></span>
<span class="line"><span style="color:#E06C75;">            backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ include &quot;myapp.fullname&quot; $ }}</span></span>
<span class="line"><span style="color:#E06C75;">                port</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                  number</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ $.Values.service.port }}</span></span>
<span class="line"><span style="color:#98C379;">          {{- end }}</span></span>
<span class="line"><span style="color:#98C379;">    {{- end }}</span></span>
<span class="line"><span style="color:#98C379;">{{- end }}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="循环渲染" tabindex="-1"><a class="header-anchor" href="#循环渲染"><span>循环渲染</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 多端口 Service</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Service</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ include &quot;myapp.fullname&quot; . }}</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Release.Namespace }}</span></span>
<span class="line"><span style="color:#E06C75;">  labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">    {{- include &quot;myapp.labels&quot; . | nindent 4 }}</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.service.type }}</span></span>
<span class="line"><span style="color:#98C379;">  {{- if and (eq .Values.service.type &quot;LoadBalancer&quot;) .Values.service.loadBalancerIP }}</span></span>
<span class="line"><span style="color:#E06C75;">  loadBalancerIP</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.service.loadBalancerIP }}</span></span>
<span class="line"><span style="color:#98C379;">  {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">  ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">    {{- range .Values.service.ports }}</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">port</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .port }}</span></span>
<span class="line"><span style="color:#E06C75;">      targetPort</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .targetPort }}</span></span>
<span class="line"><span style="color:#E06C75;">      protocol</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .protocol | default &quot;TCP&quot; }}</span></span>
<span class="line"><span style="color:#E06C75;">      name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .name }}</span></span>
<span class="line"><span style="color:#98C379;">    {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">  selector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">    {{- include &quot;myapp.selectorLabels&quot; . | nindent 4 }}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对应的 values：</p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ClusterIP</span></span>
<span class="line"><span style="color:#E06C75;">  ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">http</span></span>
<span class="line"><span style="color:#E06C75;">      port</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">80</span></span>
<span class="line"><span style="color:#E06C75;">      targetPort</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">grpc</span></span>
<span class="line"><span style="color:#E06C75;">      port</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">50051</span></span>
<span class="line"><span style="color:#E06C75;">      targetPort</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">50051</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">metrics</span></span>
<span class="line"><span style="color:#E06C75;">      port</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">9090</span></span>
<span class="line"><span style="color:#E06C75;">      targetPort</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">9090</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="高级条件逻辑" tabindex="-1"><a class="header-anchor" href="#高级条件逻辑"><span>高级条件逻辑</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 eq/ne/and/or/not 进行复杂条件判断</span></span>
<span class="line"><span style="color:#98C379;">{{- if and .Values.autoscaling.enabled (or (gt .Values.autoscaling.maxReplicas 1) (gt .Values.autoscaling.minReplicas 1)) }}</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">autoscaling/v2</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">HorizontalPodAutoscaler</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ include &quot;myapp.fullname&quot; . }}</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  scaleTargetRef</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">apps/v1</span></span>
<span class="line"><span style="color:#E06C75;">    kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Deployment</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ include &quot;myapp.fullname&quot; . }}</span></span>
<span class="line"><span style="color:#E06C75;">  minReplicas</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.autoscaling.minReplicas }}</span></span>
<span class="line"><span style="color:#E06C75;">  maxReplicas</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.autoscaling.maxReplicas }}</span></span>
<span class="line"><span style="color:#E06C75;">  metrics</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">    {{- if .Values.autoscaling.targetCPUUtilizationPercentage }}</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Resource</span></span>
<span class="line"><span style="color:#E06C75;">      resource</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">cpu</span></span>
<span class="line"><span style="color:#E06C75;">        target</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Utilization</span></span>
<span class="line"><span style="color:#E06C75;">          averageUtilization</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.autoscaling.targetCPUUtilizationPercentage }}</span></span>
<span class="line"><span style="color:#98C379;">    {{- end }}</span></span>
<span class="line"><span style="color:#98C379;">    {{- if .Values.autoscaling.targetMemoryUtilizationPercentage }}</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Resource</span></span>
<span class="line"><span style="color:#E06C75;">      resource</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">memory</span></span>
<span class="line"><span style="color:#E06C75;">        target</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Utilization</span></span>
<span class="line"><span style="color:#E06C75;">          averageUtilization</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.autoscaling.targetMemoryUtilizationPercentage }}</span></span>
<span class="line"><span style="color:#98C379;">    {{- end }}</span></span>
<span class="line"><span style="color:#98C379;">{{- end }}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="子-chart-与依赖" tabindex="-1"><a class="header-anchor" href="#子-chart-与依赖"><span>子 Chart 与依赖</span></a></h2><h3 id="依赖管理" tabindex="-1"><a class="header-anchor" href="#依赖管理"><span>依赖管理</span></a></h3>`,23),i(f,{code:`eJx1jz8KwjAUxndPEXQT/yHq0MElHkBEXIJDmr5oIbUxiULBA3gBJ+/g6OZxpNcwabAtRd+W7/ve78vbKSr3aL1oITv6FPp3O78+Ed5TZQKUZFTKduG7WWJSGIOMJmJbyRtypuIEuqmviYFECmpAD70Mh6jVqGOOqIcovz/er1tVtsJEQRRr/5caFY+JTLXZKdBHUXdL+BKjfn9+iUBaCQ4sBn2xvP+eZXpzU5hF76Bb7Xi5anWe2/GnmEyA4/JYiKAzARaxSY+lIlVBh3NeC62+Ic5n4Sz8HbLgMkWno3E99QFTcIF0`}),s[7]||=n(`<h3 id="依赖声明-chart-yaml" tabindex="-1"><a class="header-anchor" href="#依赖声明-chart-yaml"><span>依赖声明（Chart.yaml）</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># Chart.yaml</span></span>
<span class="line"><span style="color:#E06C75;">dependencies</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 条件依赖：仅在启用时部署</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis</span></span>
<span class="line"><span style="color:#E06C75;">    version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;18.0.0&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    repository</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;https://charts.bitnami.com/bitnami&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis.enabled</span></span>
<span class="line"><span style="color:#E06C75;">    alias</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 多个同类型依赖使用 alias 区分</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis</span></span>
<span class="line"><span style="color:#E06C75;">    version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;18.0.0&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    repository</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;https://charts.bitnami.com/bitnami&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis-session.enabled</span></span>
<span class="line"><span style="color:#E06C75;">    alias</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis-session</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 标签分组依赖</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">postgresql</span></span>
<span class="line"><span style="color:#E06C75;">    version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;13.0.0&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    repository</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;https://charts.bitnami.com/bitnami&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">postgresql.enabled</span></span>
<span class="line"><span style="color:#E06C75;">    tags</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">database</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">elasticsearch</span></span>
<span class="line"><span style="color:#E06C75;">    version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;19.0.0&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    repository</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;https://charts.bitnami.com/bitnami&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">elasticsearch.enabled</span></span>
<span class="line"><span style="color:#E06C75;">    tags</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">database</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">search</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 仅在特定环境下部署</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">oauth2-proxy</span></span>
<span class="line"><span style="color:#E06C75;">    version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;6.0.0&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    repository</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;https://oauth2-proxy.github.io/manifests&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">oauth2Proxy.enabled</span></span>
<span class="line"><span style="color:#E06C75;">    tags</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">auth</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="依赖管理命令" tabindex="-1"><a class="header-anchor" href="#依赖管理命令"><span>依赖管理命令</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 更新依赖（下载到 charts/ 目录）</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> dependency</span><span style="color:#98C379;"> update</span><span style="color:#98C379;"> myapp/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 构建依赖（从 Chart.lock 重建）</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> dependency</span><span style="color:#98C379;"> build</span><span style="color:#98C379;"> myapp/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 列出依赖</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> dependency</span><span style="color:#98C379;"> list</span><span style="color:#98C379;"> myapp/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用标签控制依赖</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> ./myapp</span><span style="color:#D19A66;"> --set</span><span style="color:#98C379;"> database.enabled=</span><span style="color:#D19A66;">false</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> ./myapp</span><span style="color:#D19A66;"> --set</span><span style="color:#98C379;"> tags.database=</span><span style="color:#D19A66;">false</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="子-chart-作用域" tabindex="-1"><a class="header-anchor" href="#子-chart-作用域"><span>子 Chart 作用域</span></a></h3>`,5),i(f,{code:`eJxLL0osyFDwCeJSAILi0iQIX+l5xzYF54zEohKFJ3vnPJ+y4un8+UpgJSAQEBZdlphTmlqsV5mYmxOLEA+JLknNLchJLEkt1ocIp+alcKEZ/XTtBNxGO4dFI+SxWuIcgqQCp3UBYQq6unY1RakpmcV62amVNUCTIRIhCrp6QJln0xc82zz1+ewtz/qWvli3/+X0dQhTn61Y+GzufqCWELAWZ6gWvTCIe9Jz8pMSc2qAdkC9VlKZkwqyMS0zJ8dK2SQ1OSXZRCc5Pye/yEo5LS0NSZEzTFFamlmSWRKyIgCNaYh6`}),s[8]||=n(`<div class="hint-container important"><p class="hint-container-title">子 Chart 作用域规则</p><ol><li><strong>父 → 子</strong>：父 Chart 的 values 中以子 Chart 名为前缀的值会传递给子 Chart</li><li><strong>子 ≠ 父</strong>：子 Chart 无法直接访问父 Chart 的模板</li><li><strong>global 命名空间</strong>：<code>.Values.global</code> 在父子 Chart 中都可访问</li><li><strong>子 Chart 独立</strong>：子 Chart 有自己独立的 <code>.Release</code>、<code>.Chart</code> 等内置对象</li></ol></div><h3 id="global-values" tabindex="-1"><a class="header-anchor" href="#global-values"><span>Global Values</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 父 Chart values.yaml</span></span>
<span class="line"><span style="color:#E06C75;">global</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  imageRegistry</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myregistry.azurecr.io</span></span>
<span class="line"><span style="color:#E06C75;">  imagePullSecrets</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">acr-secret</span></span>
<span class="line"><span style="color:#E06C75;">  storageClass</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">premium-ssd</span></span>
<span class="line"><span style="color:#E06C75;">  environment</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 子 Chart 可通过 .Values.global.imageRegistry 访问</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在子 Chart 模板中使用：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># image: &quot;{{ .Values.global.imageRegistry }}/{{ .Values.image.repository }}:{{ .Values.image.tag }}&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="chart-开发最佳实践" tabindex="-1"><a class="header-anchor" href="#chart-开发最佳实践"><span>Chart 开发最佳实践</span></a></h2><h3 id="命名规范" tabindex="-1"><a class="header-anchor" href="#命名规范"><span>命名规范</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># ✅ 好的命名</span></span>
<span class="line"><span style="color:#98C379;">{{ include &quot;myapp.fullname&quot; . }}</span><span style="color:#7F848E;font-style:italic;">          # 资源名称</span></span>
<span class="line"><span style="color:#E06C75;">app.kubernetes.io/name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Chart.Name }}</span><span style="color:#7F848E;font-style:italic;"> # 标签</span></span>
<span class="line"><span style="color:#E06C75;">helm.sh/chart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Chart.Name }}-{{ .Chart.Version }}</span><span style="color:#7F848E;font-style:italic;"> # Chart 标签</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ❌ 避免硬编码</span></span>
<span class="line"><span style="color:#98C379;">myapp-deployment</span><span style="color:#7F848E;font-style:italic;">  # 不要硬编码 release 名</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="标签规范" tabindex="-1"><a class="header-anchor" href="#标签规范"><span>标签规范</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 遵循 Kubernetes 推荐标签</span></span>
<span class="line"><span style="color:#E06C75;">labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app.kubernetes.io/name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Chart.Name }}</span></span>
<span class="line"><span style="color:#E06C75;">  app.kubernetes.io/instance</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Release.Name }}</span></span>
<span class="line"><span style="color:#E06C75;">  app.kubernetes.io/version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Chart.AppVersion | quote }}</span></span>
<span class="line"><span style="color:#E06C75;">  app.kubernetes.io/managed-by</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Release.Service }}</span></span>
<span class="line"><span style="color:#E06C75;">  helm.sh/chart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ printf &quot;%s-%s&quot; .Chart.Name .Chart.Version | replace &quot;+&quot; &quot;_&quot; }}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="模板组织" tabindex="-1"><a class="header-anchor" href="#模板组织"><span>模板组织</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>templates/</span></span>
<span class="line"><span>├── _helpers.tpl           # 所有命名模板</span></span>
<span class="line"><span>├── deployment.yaml        # 主 Deployment</span></span>
<span class="line"><span>├── service.yaml           # Service</span></span>
<span class="line"><span>├── ingress.yaml           # Ingress（条件渲染）</span></span>
<span class="line"><span>├── configmap.yaml         # ConfigMap</span></span>
<span class="line"><span>├── secret.yaml            # Secret</span></span>
<span class="line"><span>├── hpa.yaml               # HPA（条件渲染）</span></span>
<span class="line"><span>├── serviceaccount.yaml    # ServiceAccount（条件渲染）</span></span>
<span class="line"><span>├── networkpolicy.yaml     # NetworkPolicy（条件渲染）</span></span>
<span class="line"><span>├── poddisruptionbudget.yaml # PDB（条件渲染）</span></span>
<span class="line"><span>├── servicemonitor.yaml    # ServiceMonitor（条件渲染）</span></span>
<span class="line"><span>├── prometheusrule.yaml    # PrometheusRule（条件渲染）</span></span>
<span class="line"><span>└── tests/</span></span>
<span class="line"><span>    └── test-connection.yaml</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="values-yaml-设计原则" tabindex="-1"><a class="header-anchor" href="#values-yaml-设计原则"><span>values.yaml 设计原则</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># ✅ 结构化、语义化的 values</span></span>
<span class="line"><span style="color:#E06C75;">service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ClusterIP</span></span>
<span class="line"><span style="color:#E06C75;">  port</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">80</span></span>
<span class="line"><span style="color:#E06C75;">  targetPort</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ❌ 扁平、容易冲突的 values</span></span>
<span class="line"><span style="color:#E06C75;">serviceType</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ClusterIP</span></span>
<span class="line"><span style="color:#E06C75;">servicePort</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">80</span></span>
<span class="line"><span style="color:#E06C75;">serviceTargetPort</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ✅ 提供合理的默认值</span></span>
<span class="line"><span style="color:#E06C75;">resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  requests</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    cpu</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">250m</span></span>
<span class="line"><span style="color:#E06C75;">    memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">256Mi</span></span>
<span class="line"><span style="color:#E06C75;">  limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    cpu</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">512Mi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ✅ 使用 enabled 开关控制可选功能</span></span>
<span class="line"><span style="color:#E06C75;">ingress</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  enabled</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span><span style="color:#7F848E;font-style:italic;">   # 默认关闭</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">autoscaling</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  enabled</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span><span style="color:#7F848E;font-style:italic;">   # 默认关闭</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ✅ 敏感信息不要写在 values.yaml</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 --set 或外部 Secret 管理</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># database:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   password: &quot;&quot;  # 留空，通过 --set 传入</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="json-schema-验证" tabindex="-1"><a class="header-anchor" href="#json-schema-验证"><span>JSON Schema 验证</span></a></h3><div class="language-json line-numbers-mode" data-highlighter="shiki" data-ext="json" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-json"><span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E06C75;">  &quot;$schema&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;https://json-schema.org/draft-07/schema#&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">  &quot;title&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;MyApp Chart Values Schema&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">  &quot;type&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;object&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">  &quot;properties&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#E06C75;">    &quot;replicaCount&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#E06C75;">      &quot;type&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;integer&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">      &quot;minimum&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">      &quot;maximum&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">100</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">      &quot;description&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;Number of replicas&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    },</span></span>
<span class="line"><span style="color:#E06C75;">    &quot;image&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#E06C75;">      &quot;type&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;object&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">      &quot;required&quot;</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;repository&quot;</span><span style="color:#ABB2BF;">],</span></span>
<span class="line"><span style="color:#E06C75;">      &quot;properties&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#E06C75;">        &quot;repository&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#E06C75;">          &quot;type&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;string&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">          &quot;pattern&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;^[a-z0-9][a-z0-9./-]*$&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        },</span></span>
<span class="line"><span style="color:#E06C75;">        &quot;pullPolicy&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#E06C75;">          &quot;type&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;string&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">          &quot;enum&quot;</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;Always&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;IfNotPresent&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;Never&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#ABB2BF;">        },</span></span>
<span class="line"><span style="color:#E06C75;">        &quot;tag&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#E06C75;">          &quot;type&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;string&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">      }</span></span>
<span class="line"><span style="color:#ABB2BF;">    },</span></span>
<span class="line"><span style="color:#E06C75;">    &quot;service&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#E06C75;">      &quot;type&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;object&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">      &quot;properties&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#E06C75;">        &quot;type&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#E06C75;">          &quot;type&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;string&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">          &quot;enum&quot;</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;ClusterIP&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;NodePort&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;LoadBalancer&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;ExternalName&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#ABB2BF;">        },</span></span>
<span class="line"><span style="color:#E06C75;">        &quot;port&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#E06C75;">          &quot;type&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;integer&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">          &quot;minimum&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">          &quot;maximum&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">65535</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">      }</span></span>
<span class="line"><span style="color:#ABB2BF;">    },</span></span>
<span class="line"><span style="color:#E06C75;">    &quot;resources&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#E06C75;">      &quot;type&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;object&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">      &quot;properties&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#E06C75;">        &quot;requests&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#E06C75;">          &quot;type&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;object&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">          &quot;properties&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#E06C75;">            &quot;cpu&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#E06C75;">              &quot;type&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;string&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">              &quot;pattern&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;^[0-9]+m?$&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">            },</span></span>
<span class="line"><span style="color:#E06C75;">            &quot;memory&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#E06C75;">              &quot;type&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;string&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">              &quot;pattern&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;^[0-9]+(Ki|Mi|Gi|Ti)$&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">          }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">      }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">  }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">Schema 验证的好处</p><ol><li><strong>安装前校验</strong>：<code>helm install</code> 前自动检查 values 类型与范围</li><li><strong>文档化</strong>：Schema 本身就是 values 的类型文档</li><li><strong>IDE 支持</strong>：编辑 values.yaml 时可自动补全和校验</li><li><strong>CI/CD 集成</strong>：在流水线中自动验证 Chart 配置</li></ol></div><hr><h2 id="chart-测试" tabindex="-1"><a class="header-anchor" href="#chart-测试"><span>Chart 测试</span></a></h2><h3 id="helm-test-概述" tabindex="-1"><a class="header-anchor" href="#helm-test-概述"><span>Helm Test 概述</span></a></h3><p>Helm Test 是 Chart 内置的测试框架，通过定义 Pod 来验证部署是否正确。</p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># templates/tests/test-connection.yaml</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Pod</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ include &quot;myapp.fullname&quot; . }}-test-connection&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">    {{- include &quot;myapp.labels&quot; . | nindent 4 }}</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">    &quot;helm.sh/hook&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">test</span></span>
<span class="line"><span style="color:#98C379;">    &quot;helm.sh/hook-delete-policy&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">before-hook-creation,hook-succeeded</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  containers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">wget</span></span>
<span class="line"><span style="color:#E06C75;">      image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">busybox:1.36</span></span>
<span class="line"><span style="color:#E06C75;">      command</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&#39;wget&#39;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      args</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&#39;--spider&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&#39;-q&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&#39;{{ include &quot;myapp.fullname&quot; . }}:{{ .Values.service.port }}/healthz&#39;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">  restartPolicy</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Never</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># templates/tests/test-api.yaml</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Pod</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ include &quot;myapp.fullname&quot; . }}-test-api&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">    {{- include &quot;myapp.labels&quot; . | nindent 4 }}</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">    &quot;helm.sh/hook&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">test</span></span>
<span class="line"><span style="color:#98C379;">    &quot;helm.sh/hook-delete-policy&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">before-hook-creation,hook-succeeded</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  containers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">curl</span></span>
<span class="line"><span style="color:#E06C75;">      image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">curlimages/curl:8.4.0</span></span>
<span class="line"><span style="color:#E06C75;">      command</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">/bin/sh</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">-c</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          echo &quot;Testing API endpoints...&quot;</span></span>
<span class="line"><span style="color:#98C379;">          HTTP_CODE=$(curl -s -o /dev/null -w &quot;%{http_code}&quot; http://{{ include &quot;myapp.fullname&quot; . }}:{{ .Values.service.port }}/api/health)</span></span>
<span class="line"><span style="color:#98C379;">          if [ &quot;$HTTP_CODE&quot; -ne 200 ]; then</span></span>
<span class="line"><span style="color:#98C379;">            echo &quot;❌ Health check failed with HTTP $HTTP_CODE&quot;</span></span>
<span class="line"><span style="color:#98C379;">            exit 1</span></span>
<span class="line"><span style="color:#98C379;">          fi</span></span>
<span class="line"><span style="color:#98C379;">          echo &quot;✅ Health check passed&quot;</span></span>
<span class="line"><span style="color:#98C379;">          VERSION=$(curl -s http://{{ include &quot;myapp.fullname&quot; . }}:{{ .Values.service.port }}/api/version)</span></span>
<span class="line"><span style="color:#98C379;">          echo &quot;App version: $VERSION&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  restartPolicy</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Never</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="运行测试" tabindex="-1"><a class="header-anchor" href="#运行测试"><span>运行测试</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 运行所有测试</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> test</span><span style="color:#98C379;"> myapp-release</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 详细输出</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> test</span><span style="color:#98C379;"> myapp-release</span><span style="color:#D19A66;"> --logs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 指定超时</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> test</span><span style="color:#98C379;"> myapp-release</span><span style="color:#D19A66;"> --timeout</span><span style="color:#98C379;"> 5m</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="测试最佳实践" tabindex="-1"><a class="header-anchor" href="#测试最佳实践"><span>测试最佳实践</span></a></h3><ol><li><strong>测试 Pod 必须标注</strong> <code>helm.sh/hook: test</code></li><li><strong>设置删除策略</strong>：<code>before-hook-creation,hook-succeeded</code> 避免残留</li><li><strong>测试覆盖</strong>：健康检查、API 可达性、数据库连接、配置正确性</li><li><strong>幂等性</strong>：测试可重复执行，不产生副作用</li><li><strong>超时设置</strong>：给测试 Pod 足够时间完成</li></ol><hr><h2 id="私有仓库" tabindex="-1"><a class="header-anchor" href="#私有仓库"><span>私有仓库</span></a></h2><h3 id="chartmuseum" tabindex="-1"><a class="header-anchor" href="#chartmuseum"><span>ChartMuseum</span></a></h3><p>ChartMuseum 是一个开源的 Helm Chart 仓库服务器：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 ChartMuseum</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> repo</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> chartmuseum</span><span style="color:#98C379;"> https://chartmuseum.github.io/charts</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> chartmuseum</span><span style="color:#98C379;"> chartmuseum/chartmuseum</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --namespace</span><span style="color:#98C379;"> chartmuseum</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --create-namespace</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --set</span><span style="color:#98C379;"> env.open.STORAGE=amazon</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --set</span><span style="color:#98C379;"> env.open.STORAGE_AMAZON_BUCKET=my-charts-bucket</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --set</span><span style="color:#98C379;"> env.open.STORAGE_AMAZON_PREFIX=charts</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --set</span><span style="color:#98C379;"> env.open.STORAGE_AMAZON_REGION=us-east-1</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 推送 Chart 到 ChartMuseum</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 helm-push 插件</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> plugin</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> https://github.com/chartmuseum/helm-push</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 推送</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> push</span><span style="color:#98C379;"> myapp-1.0.0.tgz</span><span style="color:#98C379;"> chartmuseum</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 从 ChartMuseum 安装</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> repo</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> my-repo</span><span style="color:#98C379;"> https://chartmuseum.example.com</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> repo</span><span style="color:#98C379;"> update</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> my-repo/myapp</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="harbor" tabindex="-1"><a class="header-anchor" href="#harbor"><span>Harbor</span></a></h3><p>Harbor 是企业级容器镜像仓库，同时支持 Helm Chart 托管：</p>`,34),i(f,{code:`eJxLL0osyFDwCeJSAAKX1LLop3sanvZPfNHQGqugq2tXk5Gak6tQUFqcUaPgkViUlF8UrQShbZKK9O1eTp3ztLlf2zkjsahE4cnuyU93TVaKBRsFUYRsRE5OjYKzZ7yzS7Szp76zi8KzrY3PNmx5vms/RANYCqE+M6+4JBGkxduiONq7NCm1KC+1JLVY4eXstuf7lsRygfUUl1TmpMKsSsvMybFSNklNTkk20UnOz8kvslJOS0vjAgClUVUT`}),s[9]||=n(`<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># Harbor 作为 Helm 仓库</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> repo</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> harbor</span><span style="color:#98C379;"> https://harbor.example.com/chartrepo/myproject</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --username</span><span style="color:#98C379;"> admin</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --password</span><span style="color:#98C379;"> Harbor12345</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 OCI 协议推送（推荐）</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> push</span><span style="color:#98C379;"> myapp-1.0.0.tgz</span><span style="color:#98C379;"> oci://harbor.example.com/myproject/charts</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 从 OCI 仓库安装</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> oci://harbor.example.com/myproject/charts/myapp</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --version</span><span style="color:#D19A66;"> 1.0.0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="oci-注册表" tabindex="-1"><a class="header-anchor" href="#oci-注册表"><span>OCI 注册表</span></a></h3><p>Helm v3.8+ 正式支持 OCI（Open Container Initiative）注册表：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 登录 OCI 注册表</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> registry</span><span style="color:#98C379;"> login</span><span style="color:#98C379;"> myregistry.azurecr.io</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --username</span><span style="color:#E06C75;"> $ACR_USERNAME</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --password</span><span style="color:#E06C75;"> $ACR_PASSWORD</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 打包并推送</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> package</span><span style="color:#98C379;"> myapp/</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> push</span><span style="color:#98C379;"> myapp-1.0.0.tgz</span><span style="color:#98C379;"> oci://myregistry.azurecr.io/charts</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 从 OCI 安装</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> oci://myregistry.azurecr.io/charts/myapp</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --version</span><span style="color:#D19A66;"> 1.0.0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 拉取 Chart</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> pull</span><span style="color:#98C379;"> oci://myregistry.azurecr.io/charts/myapp</span><span style="color:#D19A66;"> --version</span><span style="color:#D19A66;"> 1.0.0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 列出标签</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> all</span><span style="color:#98C379;"> oci://myregistry.azurecr.io/charts/myapp</span><span style="color:#D19A66;"> --version</span><span style="color:#D19A66;"> 1.0.0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">OCI vs 传统 Chart 仓库</p><table><thead><tr><th>特性</th><th>传统仓库（ChartMuseum）</th><th>OCI 注册表</th></tr></thead><tbody><tr><td>协议</td><td>自定义 HTTP API</td><td>OCI Distribution Spec</td></tr><tr><td>认证</td><td>Basic Auth / Token</td><td>Docker 登录兼容</td></tr><tr><td>镜像仓库</td><td>不支持</td><td>共用镜像仓库</td></tr><tr><td>签名</td><td>Cosign（手动）</td><td>Cosign（原生）</td></tr><tr><td>缓存</td><td>需要额外配置</td><td>镜像仓库缓存</td></tr><tr><td>成熟度</td><td>成熟</td><td>Helm 3.8+ 稳定支持</td></tr></tbody></table></div><hr><h2 id="helm-release-管理" tabindex="-1"><a class="header-anchor" href="#helm-release-管理"><span>Helm Release 管理</span></a></h2><h3 id="基础操作" tabindex="-1"><a class="header-anchor" href="#基础操作"><span>基础操作</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> ./myapp</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --namespace</span><span style="color:#98C379;"> production</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --create-namespace</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  -f</span><span style="color:#98C379;"> values-prod.yaml</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --set</span><span style="color:#98C379;"> image.tag=v2.0.1</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --wait</span><span style="color:#D19A66;"> --timeout</span><span style="color:#98C379;"> 5m</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 升级（如果已存在则升级，不存在则安装）</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> upgrade</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> ./myapp</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --namespace</span><span style="color:#98C379;"> production</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  -f</span><span style="color:#98C379;"> values-prod.yaml</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --set</span><span style="color:#98C379;"> image.tag=v2.0.2</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --wait</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装或升级（推荐）</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> upgrade</span><span style="color:#D19A66;"> --install</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> ./myapp</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --namespace</span><span style="color:#98C379;"> production</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  -f</span><span style="color:#98C379;"> values-prod.yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 回滚</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> rollback</span><span style="color:#98C379;"> myapp</span><span style="color:#D19A66;"> 1</span><span style="color:#7F848E;font-style:italic;">  # 回滚到版本 1</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> rollback</span><span style="color:#98C379;"> myapp</span><span style="color:#7F848E;font-style:italic;">     # 回滚到上一版本</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 卸载</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> uninstall</span><span style="color:#98C379;"> myapp</span><span style="color:#D19A66;"> --namespace</span><span style="color:#98C379;"> production</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看 Release 列表</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> list</span><span style="color:#D19A66;"> --all-namespaces</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看 Release 状态</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> status</span><span style="color:#98C379;"> myapp</span><span style="color:#D19A66;"> --namespace</span><span style="color:#98C379;"> production</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看 Release 历史</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> history</span><span style="color:#98C379;"> myapp</span><span style="color:#D19A66;"> --namespace</span><span style="color:#98C379;"> production</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看 Release 的 values</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> get</span><span style="color:#98C379;"> values</span><span style="color:#98C379;"> myapp</span><span style="color:#D19A66;"> --namespace</span><span style="color:#98C379;"> production</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> get</span><span style="color:#98C379;"> values</span><span style="color:#98C379;"> myapp</span><span style="color:#D19A66;"> --namespace</span><span style="color:#98C379;"> production</span><span style="color:#D19A66;"> --all</span><span style="color:#7F848E;font-style:italic;">  # 包含默认值</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看 Release 的 manifest</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> get</span><span style="color:#98C379;"> manifest</span><span style="color:#98C379;"> myapp</span><span style="color:#D19A66;"> --namespace</span><span style="color:#98C379;"> production</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看 Release 的 notes</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> get</span><span style="color:#98C379;"> notes</span><span style="color:#98C379;"> myapp</span><span style="color:#D19A66;"> --namespace</span><span style="color:#98C379;"> production</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="release-管理工作流" tabindex="-1"><a class="header-anchor" href="#release-管理工作流"><span>Release 管理工作流</span></a></h3>`,10),i(f,{code:`eJxlUctKw0AU3fcrhu6DPyCVvt87NzZ0kbbRFqcP0hSRVAiIKIraKmKRQNCquNBUAqKC0n8RZ5r8hem9AaOd1XDOPY+5s07bW9W6pKhkNREi3omK7ENnp0MSn6NlIggREhPrMm0S2mipZRiKARzXXP3Kme7zsc7Nu5UdoOJzqs9Hkz5JiGHQqXKzQyVVXq4oSxFuPDLjmb/Z3DwPoxtK2OC+T0ri99Rit8fupeXejJAuYQe4J+Ce1NaixQLhT+PZteXnJgMmAQCKpPwivc6GItVkj2i0uqpEKTQShJqyLSi9ll8nBRlpjb3bzusQn+iHpP+HIAAhGVzSQgaaZsA0izOq3PUXmQU4p/GXI2dy8Scr95uVR5nSprQiVTdRijxEF8QvY4+4uw+zT5sfDNihiSN5cC+K/OTM+6DgTovAlEI/xWe9CQ==`}),s[10]||=n(`<h3 id="多环境管理" tabindex="-1"><a class="header-anchor" href="#多环境管理"><span>多环境管理</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 目录结构</span></span>
<span class="line"><span style="color:#61AFEF;">myapp/</span></span>
<span class="line"><span style="color:#61AFEF;">├──</span><span style="color:#98C379;"> values.yaml</span><span style="color:#7F848E;font-style:italic;">            # 基础配置</span></span>
<span class="line"><span style="color:#61AFEF;">├──</span><span style="color:#98C379;"> values-dev.yaml</span><span style="color:#7F848E;font-style:italic;">        # 开发环境覆盖</span></span>
<span class="line"><span style="color:#61AFEF;">├──</span><span style="color:#98C379;"> values-staging.yaml</span><span style="color:#7F848E;font-style:italic;">    # 预发布环境覆盖</span></span>
<span class="line"><span style="color:#61AFEF;">└──</span><span style="color:#98C379;"> values-prod.yaml</span><span style="color:#7F848E;font-style:italic;">       # 生产环境覆盖</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># values-dev.yaml</span></span>
<span class="line"><span style="color:#E06C75;">replicaCount</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">1</span></span>
<span class="line"><span style="color:#E06C75;">image</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  tag</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">latest</span></span>
<span class="line"><span style="color:#E06C75;">resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  requests</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    cpu</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">100m</span></span>
<span class="line"><span style="color:#E06C75;">    memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">128Mi</span></span>
<span class="line"><span style="color:#E06C75;">  limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    cpu</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">500m</span></span>
<span class="line"><span style="color:#E06C75;">    memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">256Mi</span></span>
<span class="line"><span style="color:#E06C75;">ingress</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  enabled</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">  hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-dev.example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># values-staging.yaml</span></span>
<span class="line"><span style="color:#E06C75;">replicaCount</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">2</span></span>
<span class="line"><span style="color:#E06C75;">image</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  tag</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v2.0.0-rc.1</span></span>
<span class="line"><span style="color:#E06C75;">resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  requests</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    cpu</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">250m</span></span>
<span class="line"><span style="color:#E06C75;">    memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">256Mi</span></span>
<span class="line"><span style="color:#E06C75;">ingress</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  enabled</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">  hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-staging.example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># values-prod.yaml</span></span>
<span class="line"><span style="color:#E06C75;">replicaCount</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">image</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  tag</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v2.0.0</span></span>
<span class="line"><span style="color:#E06C75;">  pullPolicy</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Always</span></span>
<span class="line"><span style="color:#E06C75;">resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  requests</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    cpu</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">250m</span></span>
<span class="line"><span style="color:#E06C75;">    memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">256Mi</span></span>
<span class="line"><span style="color:#E06C75;">  limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    cpu</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">512Mi</span></span>
<span class="line"><span style="color:#E06C75;">autoscaling</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  enabled</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">  minReplicas</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">  maxReplicas</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#E06C75;">ingress</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  enabled</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    cert-manager.io/cluster-issuer</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">letsencrypt-prod</span></span>
<span class="line"><span style="color:#E06C75;">  hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp.example.com</span></span>
<span class="line"><span style="color:#E06C75;">  tls</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">secretName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-tls</span></span>
<span class="line"><span style="color:#E06C75;">      hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">myapp.example.com</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 部署到不同环境</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> upgrade</span><span style="color:#D19A66;"> --install</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> ./myapp</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> values-dev.yaml</span><span style="color:#D19A66;"> --namespace</span><span style="color:#98C379;"> dev</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> upgrade</span><span style="color:#D19A66;"> --install</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> ./myapp</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> values-staging.yaml</span><span style="color:#D19A66;"> --namespace</span><span style="color:#98C379;"> staging</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> upgrade</span><span style="color:#D19A66;"> --install</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> ./myapp</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> values-prod.yaml</span><span style="color:#D19A66;"> --namespace</span><span style="color:#98C379;"> production</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="helm-插件" tabindex="-1"><a class="header-anchor" href="#helm-插件"><span>Helm 插件</span></a></h2><h3 id="常用插件" tabindex="-1"><a class="header-anchor" href="#常用插件"><span>常用插件</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># Helm Diff - 查看升级差异（强烈推荐）</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> plugin</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> https://github.com/databus23/helm-diff</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> diff</span><span style="color:#98C379;"> upgrade</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> ./myapp</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> values-prod.yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Helm Secrets - 加密 values 管理</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> plugin</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> https://github.com/jkroepke/helm-secrets</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> secrets</span><span style="color:#98C379;"> enc</span><span style="color:#98C379;"> values-prod.yaml</span><span style="color:#7F848E;font-style:italic;">    # 加密</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> secrets</span><span style="color:#98C379;"> view</span><span style="color:#98C379;"> values-prod.yaml</span><span style="color:#7F848E;font-style:italic;">   # 查看</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> secrets</span><span style="color:#98C379;"> upgrade</span><span style="color:#D19A66;"> --install</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> ./myapp</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> values-prod.yaml</span><span style="color:#7F848E;font-style:italic;">  # 自动解密</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Helm Push - 推送 Chart 到 ChartMuseum</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> plugin</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> https://github.com/chartmuseum/helm-push</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Helm Git - 从 Git 仓库安装 Chart</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> plugin</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> https://github.com/aslafy-z/helm-git</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> git+https://github.com/example/charts@myapp?ref=v1.0.0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Helm Mapkubeapis - 升级已弃用的 API 版本</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> plugin</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> https://github.com/helm/helm-mapkubeapis</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> mapkubeapis</span><span style="color:#98C379;"> myapp</span><span style="color:#D19A66;"> --namespace</span><span style="color:#98C379;"> production</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="helm-diff-实战" tabindex="-1"><a class="header-anchor" href="#helm-diff-实战"><span>Helm Diff 实战</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看升级差异</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> diff</span><span style="color:#98C379;"> upgrade</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> ./myapp</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> values-prod.yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出示例：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># default, myapp Deployment (apps) has changed:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   spec:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     template:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#       spec:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#         containers:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#           - image: myapp:v2.0.0  # 旧值</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#           + image: myapp:v2.0.1  # 新值</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 仅显示变更</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> diff</span><span style="color:#98C379;"> upgrade</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> ./myapp</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> values-prod.yaml</span><span style="color:#D19A66;"> --show-secrets</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 逐项对比</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> diff</span><span style="color:#98C379;"> upgrade</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> ./myapp</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> values-prod.yaml</span><span style="color:#D19A66;"> --detailed-exitcode</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="helm-vs-kustomize-对比" tabindex="-1"><a class="header-anchor" href="#helm-vs-kustomize-对比"><span>Helm vs Kustomize 对比</span></a></h2><h3 id="核心差异" tabindex="-1"><a class="header-anchor" href="#核心差异"><span>核心差异</span></a></h3>`,13),i(f,{code:`eJxLL0osyFAIceJSAILi0iQIX8kjNSdX4dm0nU/39CuBpUDAwzDaOSOxqETh2YqFz+buj1XQ1bVT8HCNhnCf7pn6bHLfsx2bns2fHIvQExZdlphTmlqsV5mYmwPTgpB2hYhERj+b0/B8d4dCpKOvD0R3al4KF5qrvEuLS/JzM6tSMZzmbRj9dP6u5wsbIAaADfX2j0Zo8C9LLcpJrEQ4zNsoOhsqm1iSmZ+H5D5vf4Qqf4gIXveVVOakgnySlpmTY6Vskpqckmyik5yfk19kpZyWloakCGgcRFFamlmSWRKyIgBZv4Lq`}),s[11]||=n(`<table><thead><tr><th>维度</th><th>Helm</th><th>Kustomize</th></tr></thead><tbody><tr><td><strong>核心理念</strong></td><td>模板 + 变量 = 清单</td><td>基础 + 覆盖 = 清单</td></tr><tr><td><strong>学习曲线</strong></td><td>较高（模板语法、函数）</td><td>较低（声明式 YAML）</td></tr><tr><td><strong>语言</strong></td><td>Go template + Sprig</td><td>纯 YAML</td></tr><tr><td><strong>包管理</strong></td><td>完整（仓库、版本、依赖）</td><td>无（需外部工具）</td></tr><tr><td><strong>发布管理</strong></td><td>Release 概念（安装/升级/回滚）</td><td>无</td></tr><tr><td><strong>多环境</strong></td><td>不同 values 文件</td><td>overlay 目录</td></tr><tr><td><strong>Secret 管理</strong></td><td>需要 helm-secrets 插件</td><td>需要 SOPS 等外部工具</td></tr><tr><td><strong>GitOps 兼容</strong></td><td>ArgoCD/Flux 支持</td><td>原生支持（纯 YAML）</td></tr><tr><td><strong>调试</strong></td><td><code>helm template</code>/<code>helm diff</code></td><td><code>kustomize build</code></td></tr><tr><td><strong>复用性</strong></td><td>Chart 仓库共享</td><td>Base/Overlay 模式</td></tr><tr><td><strong>适用场景</strong></td><td>通用应用分发、第三方 Chart</td><td>内部应用配置管理</td></tr></tbody></table><h3 id="kustomize-示例" tabindex="-1"><a class="header-anchor" href="#kustomize-示例"><span>Kustomize 示例</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># base/kustomization.yaml</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">kustomize.config.k8s.io/v1beta1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Kustomization</span></span>
<span class="line"><span style="color:#E06C75;">resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">deployment.yaml</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">service.yaml</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">configmap.yaml</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># overlays/production/kustomization.yaml</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">kustomize.config.k8s.io/v1beta1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Kustomization</span></span>
<span class="line"><span style="color:#E06C75;">bases</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">../../base</span></span>
<span class="line"><span style="color:#E06C75;">namePrefix</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">prod-</span></span>
<span class="line"><span style="color:#E06C75;">namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">commonLabels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  environment</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">patches</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">target</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Deployment</span></span>
<span class="line"><span style="color:#E06C75;">    patch</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">      - op: replace</span></span>
<span class="line"><span style="color:#98C379;">        path: /spec/replicas</span></span>
<span class="line"><span style="color:#98C379;">        value: 5</span></span>
<span class="line"><span style="color:#98C379;">      - op: replace</span></span>
<span class="line"><span style="color:#98C379;">        path: /spec/template/spec/containers/0/resources/requests/cpu</span></span>
<span class="line"><span style="color:#98C379;">        value: 500m</span></span>
<span class="line"><span style="color:#E06C75;">configMapGenerator</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-config</span></span>
<span class="line"><span style="color:#E06C75;">    literals</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">ASPNETCORE_ENVIRONMENT=Production</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="选择建议" tabindex="-1"><a class="header-anchor" href="#选择建议"><span>选择建议</span></a></h3><div class="hint-container tip"><p class="hint-container-title">何时选择 Helm？</p><ul><li>需要分发应用给第三方使用</li><li>依赖大量社区 Chart（Redis、PostgreSQL 等）</li><li>需要 Release 管理和回滚能力</li><li>应用结构复杂，需要模板化</li></ul><p>何时选择 Kustomize？</p><ul><li>纯内部应用，不需要分发</li><li>已经有基础 YAML，只需环境差异配置</li><li>团队偏好声明式、无模板语法</li><li>与 ArgoCD 深度集成的 GitOps 场景</li></ul><p>可以混合使用！ArgoCD 原生支持 Helm + Kustomize 组合。</p></div><hr><h2 id="argocd-helm-集成" tabindex="-1"><a class="header-anchor" href="#argocd-helm-集成"><span>ArgoCD + Helm 集成</span></a></h2><h3 id="集成架构" tabindex="-1"><a class="header-anchor" href="#集成架构"><span>集成架构</span></a></h3>`,9),i(f,{code:`eJxLy8kvT85ILCpR8AniUgAC98ySaCUgofBk9+SnuybbJBXp23mk5uQqOINVaSuEJeaUphYrxSro6trVpAMVFpTm5NQoOBal5zu7REOoWLBREDZYXQbIhJLU3IKcxJLUGoWg1LyU1KLUlOhnOzY9mz/56YS+57NaFCIdfX0gOmHyYL0pmWlpCmoKxZV5yTUK3hbF0d6lSalFeaklqcUKL2e3Pd+3JJYLrKu4NCm9KLEgQwHJ/c93T342r0UJLA8CYF9Eg0m9ysTcHIh9IBACdFw0zInF+ggJoIejy8CeRtPhmleGkNMtKMpPQVIA9AHUVSWVOamwsEjLzMmxUk5NMzE3S9NJzs/JL7JSTktLQ1IIcjpElYFZilmiAbIqAHWnki4=`}),s[12]||=n(`<h3 id="argocd-application-配置" tabindex="-1"><a class="header-anchor" href="#argocd-application-配置"><span>ArgoCD Application 配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># Helm + ArgoCD Application</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argoproj.io/v1alpha1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Application</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argocd</span></span>
<span class="line"><span style="color:#E06C75;">  labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    notifications.argoproj.io/subscribe.on-deployed.slack</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">releases</span></span>
<span class="line"><span style="color:#E06C75;">  finalizers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">resources-finalizer.argocd.argoproj.io</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  project</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"><span style="color:#E06C75;">  source</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 方式1：从 Git 仓库使用 Helm Chart</span></span>
<span class="line"><span style="color:#E06C75;">    repoURL</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://github.com/example/myapp-chart.git</span></span>
<span class="line"><span style="color:#E06C75;">    targetRevision</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">main</span></span>
<span class="line"><span style="color:#E06C75;">    path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">charts/myapp</span></span>
<span class="line"><span style="color:#E06C75;">    helm</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      valueFiles</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">values.yaml</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">values-prod.yaml</span></span>
<span class="line"><span style="color:#E06C75;">      parameters</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">image.tag</span></span>
<span class="line"><span style="color:#E06C75;">          value</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v2.0.1</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 跳过 CRD 安装</span></span>
<span class="line"><span style="color:#E06C75;">      skipCrds</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 传递 Release 名称</span></span>
<span class="line"><span style="color:#E06C75;">      releaseName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 方式2：从 Helm 仓库使用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # source:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  #   repoURL: https://charts.bitnami.com/bitnami</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  #   chart: redis</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  #   targetRevision: 18.0.0</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  #   helm:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  #     parameters:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  #       - name: auth.password</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  #         value: my-password</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  destination</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    server</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://kubernetes.default.svc</span></span>
<span class="line"><span style="color:#E06C75;">    namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">  syncPolicy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    automated</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      prune</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">      selfHeal</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    syncOptions</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">CreateNamespace=true</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">ServerSideApply=true</span></span>
<span class="line"><span style="color:#E06C75;">    retry</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      limit</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">      backoff</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        duration</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5s</span></span>
<span class="line"><span style="color:#E06C75;">        factor</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">2</span></span>
<span class="line"><span style="color:#E06C75;">        maxDuration</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3m</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="app-of-apps-模式" tabindex="-1"><a class="header-anchor" href="#app-of-apps-模式"><span>App of Apps 模式</span></a></h3>`,3),i(f,{code:`eJxtjkEKwjAQRfeeIuhWEW1RERFEQUQQEXfBRdSkBtJMmESwew/gZdx4IPEYNm3TVbMIM/PfzP8JMnMjx1WL5O8A4Gjb/2RhzOyM/fkCE1iufKvkhTkJun0ivd7cTwY0zZgxvjzV+0EcUuRXaZvFiKagpQOUOmkmYppLyG11oNC9ZaFvJzZ45yX5vZ/fz6u84Z0DEyI0MFFgIrpHSLm78bvtr5EJpllNxYGK6S6R+kE2ZaYqj3WZ4mVqIZWadriIxyPRvYACnHaEEK0//L5tsQ==`}),s[13]||=n(`<div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># App of Apps - Root Application</span></span>
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
<span class="line"><span style="color:#E06C75;">      selfHeal</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="net-应用-helm-chart-模板" tabindex="-1"><a class="header-anchor" href="#net-应用-helm-chart-模板"><span>.NET 应用 Helm Chart 模板</span></a></h2><h3 id="完整-net-应用-chart" tabindex="-1"><a class="header-anchor" href="#完整-net-应用-chart"><span>完整 .NET 应用 Chart</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>dotnet-app/</span></span>
<span class="line"><span>├── Chart.yaml</span></span>
<span class="line"><span>├── values.yaml</span></span>
<span class="line"><span>├── values.schema.json</span></span>
<span class="line"><span>├── .helmignore</span></span>
<span class="line"><span>├── templates/</span></span>
<span class="line"><span>│   ├── _helpers.tpl</span></span>
<span class="line"><span>│   ├── deployment.yaml</span></span>
<span class="line"><span>│   ├── service.yaml</span></span>
<span class="line"><span>│   ├── ingress.yaml</span></span>
<span class="line"><span>│   ├── configmap.yaml</span></span>
<span class="line"><span>│   ├── secret.yaml</span></span>
<span class="line"><span>│   ├── hpa.yaml</span></span>
<span class="line"><span>│   ├── serviceaccount.yaml</span></span>
<span class="line"><span>│   ├── pdb.yaml</span></span>
<span class="line"><span>│   ├── networkpolicy.yaml</span></span>
<span class="line"><span>│   ├── servicemonitor.yaml</span></span>
<span class="line"><span>│   ├── NOTES.txt</span></span>
<span class="line"><span>│   └── tests/</span></span>
<span class="line"><span>│       └── test-connection.yaml</span></span>
<span class="line"><span>└── crds/</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="chart-yaml" tabindex="-1"><a class="header-anchor" href="#chart-yaml"><span>Chart.yaml</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v2</span></span>
<span class="line"><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">dotnet-app</span></span>
<span class="line"><span style="color:#E06C75;">description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">A Helm chart for .NET applications on Kubernetes</span></span>
<span class="line"><span style="color:#E06C75;">type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">application</span></span>
<span class="line"><span style="color:#E06C75;">version</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">1.0.0</span></span>
<span class="line"><span style="color:#E06C75;">appVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;8.0&quot;</span></span>
<span class="line"><span style="color:#E06C75;">kubeVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;&gt;=1.24.0-0&quot;</span></span>
<span class="line"><span style="color:#E06C75;">icon</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://dotnet.microsoft.com/favicon.ico</span></span>
<span class="line"><span style="color:#E06C75;">keywords</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">dotnet</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">aspnet</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">microservice</span></span>
<span class="line"><span style="color:#E06C75;">maintainers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">devops-team</span></span>
<span class="line"><span style="color:#E06C75;">    email</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">devops@example.com</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="deployment-模板" tabindex="-1"><a class="header-anchor" href="#deployment-模板"><span>Deployment 模板</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># templates/deployment.yaml</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">apps/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Deployment</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ include &quot;dotnet-app.fullname&quot; . }}</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Release.Namespace }}</span></span>
<span class="line"><span style="color:#E06C75;">  labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">    {{- include &quot;dotnet-app.labels&quot; . | nindent 4 }}</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    checksum/config</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ include (print $.Template.BasePath &quot;/configmap.yaml&quot;) . | sha256sum }}</span></span>
<span class="line"><span style="color:#E06C75;">    checksum/secret</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ include (print $.Template.BasePath &quot;/secret.yaml&quot;) . | sha256sum }}</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">  {{- if not .Values.autoscaling.enabled }}</span></span>
<span class="line"><span style="color:#E06C75;">  replicas</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.replicaCount }}</span></span>
<span class="line"><span style="color:#98C379;">  {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">  selector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    matchLabels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">      {{- include &quot;dotnet-app.selectorLabels&quot; . | nindent 6 }}</span></span>
<span class="line"><span style="color:#E06C75;">  strategy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.strategy.type }}</span></span>
<span class="line"><span style="color:#98C379;">    {{- if eq .Values.strategy.type &quot;RollingUpdate&quot; }}</span></span>
<span class="line"><span style="color:#E06C75;">    rollingUpdate</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      maxSurge</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.strategy.rollingUpdate.maxSurge }}</span></span>
<span class="line"><span style="color:#E06C75;">      maxUnavailable</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.strategy.rollingUpdate.maxUnavailable }}</span></span>
<span class="line"><span style="color:#98C379;">    {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">  template</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">        {{- include &quot;dotnet-app.selectorLabels&quot; . | nindent 8 }}</span></span>
<span class="line"><span style="color:#98C379;">        {{- with .Values.podLabels }}</span></span>
<span class="line"><span style="color:#98C379;">        {{- toYaml . | nindent 8 }}</span></span>
<span class="line"><span style="color:#98C379;">        {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">      annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">        {{- with .Values.podAnnotations }}</span></span>
<span class="line"><span style="color:#98C379;">        {{- toYaml . | nindent 8 }}</span></span>
<span class="line"><span style="color:#98C379;">        {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">    spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">      {{- with .Values.imagePullSecrets }}</span></span>
<span class="line"><span style="color:#E06C75;">      imagePullSecrets</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">        {{- toYaml . | nindent 8 }}</span></span>
<span class="line"><span style="color:#98C379;">      {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">      serviceAccountName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ include &quot;dotnet-app.serviceAccountName&quot; . }}</span></span>
<span class="line"><span style="color:#E06C75;">      terminationGracePeriodSeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.terminationGracePeriodSeconds | default 30 }}</span></span>
<span class="line"><span style="color:#E06C75;">      securityContext</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">        {{- toYaml .Values.podSecurityContext | nindent 8 }}</span></span>
<span class="line"><span style="color:#E06C75;">      initContainers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">        {{- if .Values.initContainers.waitForDB }}</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">wait-for-db</span></span>
<span class="line"><span style="color:#E06C75;">          image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">busybox:1.36</span></span>
<span class="line"><span style="color:#E06C75;">          command</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&#39;sh&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&#39;-c&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&#39;until nc -z {{ .Values.database.host }} {{ .Values.database.port }}; do echo waiting for database; sleep 2; done&#39;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#98C379;">        {{- end }}</span></span>
<span class="line"><span style="color:#98C379;">        {{- if .Values.initContainers.migrate }}</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">migrate</span></span>
<span class="line"><span style="color:#E06C75;">          image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          command</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&#39;dotnet&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&#39;EfMigrate.dll&#39;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">          envFrom</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">secretRef</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ include &quot;dotnet-app.fullname&quot; . }}-secret</span></span>
<span class="line"><span style="color:#98C379;">        {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">      containers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Chart.Name }}</span></span>
<span class="line"><span style="color:#E06C75;">          securityContext</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">            {{- toYaml .Values.securityContext | nindent 12 }}</span></span>
<span class="line"><span style="color:#E06C75;">          image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          imagePullPolicy</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.image.pullPolicy }}</span></span>
<span class="line"><span style="color:#E06C75;">          ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">http</span></span>
<span class="line"><span style="color:#E06C75;">              containerPort</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.service.targetPort | default 8080 }}</span></span>
<span class="line"><span style="color:#E06C75;">              protocol</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">TCP</span></span>
<span class="line"><span style="color:#98C379;">            {{- if .Values.service.httpsPort }}</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https</span></span>
<span class="line"><span style="color:#E06C75;">              containerPort</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.service.httpsPort }}</span></span>
<span class="line"><span style="color:#E06C75;">              protocol</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">TCP</span></span>
<span class="line"><span style="color:#98C379;">            {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">          env</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # .NET 运行时环境变量</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ASPNETCORE_ENVIRONMENT</span></span>
<span class="line"><span style="color:#E06C75;">              value</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.dotnet.environment | default &quot;Production&quot; }}</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ASPNETCORE_URLS</span></span>
<span class="line"><span style="color:#E06C75;">              value</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.dotnet.urls | default &quot;http://+:8080&quot; }}</span></span>
<span class="line"><span style="color:#98C379;">            {{- if .Values.dotnet.urls }}</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">DOTNET_EnableDiagnostics</span></span>
<span class="line"><span style="color:#E06C75;">              value</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;0&quot;</span></span>
<span class="line"><span style="color:#98C379;">            {{- end }}</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 应用配置</span></span>
<span class="line"><span style="color:#98C379;">            {{- range $key, $value := .Values.env }}</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ $key }}</span></span>
<span class="line"><span style="color:#E06C75;">              value</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ $value | quote }}</span></span>
<span class="line"><span style="color:#98C379;">            {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">          envFrom</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">configMapRef</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ include &quot;dotnet-app.fullname&quot; . }}-config</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">secretRef</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ include &quot;dotnet-app.fullname&quot; . }}-secret</span></span>
<span class="line"><span style="color:#98C379;">            {{- range .Values.extraEnvFrom }}</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#98C379;">{{ toYaml . | nindent 14 }}</span></span>
<span class="line"><span style="color:#98C379;">            {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">          lifecycle</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">            {{- with .Values.lifecycle }}</span></span>
<span class="line"><span style="color:#98C379;">            {{- toYaml . | nindent 12 }}</span></span>
<span class="line"><span style="color:#98C379;">            {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">          livenessProbe</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">            {{- if .Values.livenessProbe.httpGet }}</span></span>
<span class="line"><span style="color:#E06C75;">            httpGet</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.livenessProbe.httpGet.path }}</span></span>
<span class="line"><span style="color:#E06C75;">              port</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">http</span></span>
<span class="line"><span style="color:#98C379;">            {{- else }}</span></span>
<span class="line"><span style="color:#E06C75;">            exec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              command</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">                - </span><span style="color:#98C379;">/bin/sh</span></span>
<span class="line"><span style="color:#ABB2BF;">                - </span><span style="color:#98C379;">-c</span></span>
<span class="line"><span style="color:#ABB2BF;">                - </span><span style="color:#98C379;">curl -sf http://localhost:{{ .Values.service.targetPort | default 8080 }}/healthz || exit 1</span></span>
<span class="line"><span style="color:#98C379;">            {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">            initialDelaySeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.livenessProbe.initialDelaySeconds | default 30 }}</span></span>
<span class="line"><span style="color:#E06C75;">            periodSeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.livenessProbe.periodSeconds | default 10 }}</span></span>
<span class="line"><span style="color:#E06C75;">            timeoutSeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.livenessProbe.timeoutSeconds | default 5 }}</span></span>
<span class="line"><span style="color:#E06C75;">            failureThreshold</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.livenessProbe.failureThreshold | default 3 }}</span></span>
<span class="line"><span style="color:#E06C75;">          readinessProbe</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            httpGet</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.readinessProbe.httpGet.path | default &quot;/ready&quot; }}</span></span>
<span class="line"><span style="color:#E06C75;">              port</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">http</span></span>
<span class="line"><span style="color:#E06C75;">            initialDelaySeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.readinessProbe.initialDelaySeconds | default 5 }}</span></span>
<span class="line"><span style="color:#E06C75;">            periodSeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.readinessProbe.periodSeconds | default 5 }}</span></span>
<span class="line"><span style="color:#E06C75;">            timeoutSeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.readinessProbe.timeoutSeconds | default 3 }}</span></span>
<span class="line"><span style="color:#E06C75;">            failureThreshold</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.readinessProbe.failureThreshold | default 3 }}</span></span>
<span class="line"><span style="color:#E06C75;">          startupProbe</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            httpGet</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.startupProbe.httpGet.path | default &quot;/healthz&quot; }}</span></span>
<span class="line"><span style="color:#E06C75;">              port</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">http</span></span>
<span class="line"><span style="color:#E06C75;">            initialDelaySeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.startupProbe.initialDelaySeconds | default 0 }}</span></span>
<span class="line"><span style="color:#E06C75;">            periodSeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.startupProbe.periodSeconds | default 5 }}</span></span>
<span class="line"><span style="color:#E06C75;">            failureThreshold</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.startupProbe.failureThreshold | default 30 }}</span></span>
<span class="line"><span style="color:#E06C75;">          resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">            {{- toYaml .Values.resources | nindent 12 }}</span></span>
<span class="line"><span style="color:#E06C75;">          volumeMounts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">tmp</span></span>
<span class="line"><span style="color:#E06C75;">              mountPath</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/tmp</span></span>
<span class="line"><span style="color:#98C379;">            {{- if .Values.persistence.enabled }}</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">data</span></span>
<span class="line"><span style="color:#E06C75;">              mountPath</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.persistence.mountPath }}</span></span>
<span class="line"><span style="color:#98C379;">            {{- end }}</span></span>
<span class="line"><span style="color:#98C379;">            {{- range .Values.extraVolumeMounts }}</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .name }}</span></span>
<span class="line"><span style="color:#E06C75;">              mountPath</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .mountPath }}</span></span>
<span class="line"><span style="color:#98C379;">              {{- if .subPath }}</span></span>
<span class="line"><span style="color:#E06C75;">              subPath</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .subPath }}</span></span>
<span class="line"><span style="color:#98C379;">              {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">              readOnly</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .readOnly | default false }}</span></span>
<span class="line"><span style="color:#98C379;">            {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">      volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">tmp</span></span>
<span class="line"><span style="color:#E06C75;">          emptyDir</span><span style="color:#ABB2BF;">: {}</span></span>
<span class="line"><span style="color:#98C379;">        {{- if .Values.persistence.enabled }}</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">data</span></span>
<span class="line"><span style="color:#E06C75;">          persistentVolumeClaim</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            claimName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ include &quot;dotnet-app.fullname&quot; . }}-data</span></span>
<span class="line"><span style="color:#98C379;">        {{- end }}</span></span>
<span class="line"><span style="color:#98C379;">        {{- range .Values.extraVolumes }}</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .name }}</span></span>
<span class="line"><span style="color:#98C379;">          {{- if .configMap }}</span></span>
<span class="line"><span style="color:#E06C75;">          configMap</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .configMap.name }}</span></span>
<span class="line"><span style="color:#98C379;">            {{- if .configMap.items }}</span></span>
<span class="line"><span style="color:#E06C75;">            items</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">              {{- range .configMap.items }}</span></span>
<span class="line"><span style="color:#ABB2BF;">              - </span><span style="color:#E06C75;">key</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .key }}</span></span>
<span class="line"><span style="color:#E06C75;">                path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .path }}</span></span>
<span class="line"><span style="color:#98C379;">              {{- end }}</span></span>
<span class="line"><span style="color:#98C379;">            {{- end }}</span></span>
<span class="line"><span style="color:#98C379;">          {{- else if .secret }}</span></span>
<span class="line"><span style="color:#E06C75;">          secret</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            secretName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .secret.secretName }}</span></span>
<span class="line"><span style="color:#98C379;">          {{- else if .emptyDir }}</span></span>
<span class="line"><span style="color:#E06C75;">          emptyDir</span><span style="color:#ABB2BF;">: {}</span></span>
<span class="line"><span style="color:#98C379;">          {{- end }}</span></span>
<span class="line"><span style="color:#98C379;">        {{- end }}</span></span>
<span class="line"><span style="color:#98C379;">      {{- with .Values.nodeSelector }}</span></span>
<span class="line"><span style="color:#E06C75;">      nodeSelector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">        {{- toYaml . | nindent 8 }}</span></span>
<span class="line"><span style="color:#98C379;">      {{- end }}</span></span>
<span class="line"><span style="color:#98C379;">      {{- with .Values.affinity }}</span></span>
<span class="line"><span style="color:#E06C75;">      affinity</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">        {{- toYaml . | nindent 8 }}</span></span>
<span class="line"><span style="color:#98C379;">      {{- end }}</span></span>
<span class="line"><span style="color:#98C379;">      {{- with .Values.tolerations }}</span></span>
<span class="line"><span style="color:#E06C75;">      tolerations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">        {{- toYaml . | nindent 8 }}</span></span>
<span class="line"><span style="color:#98C379;">      {{- end }}</span></span>
<span class="line"><span style="color:#E06C75;">      topologySpreadConstraints</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">        {{- range .Values.topologySpreadConstraints }}</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">maxSkew</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .maxSkew }}</span></span>
<span class="line"><span style="color:#E06C75;">          topologyKey</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .topologyKey }}</span></span>
<span class="line"><span style="color:#E06C75;">          whenUnsatisfiable</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .whenUnsatisfiable }}</span></span>
<span class="line"><span style="color:#E06C75;">          labelSelector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            matchLabels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">              {{- include &quot;dotnet-app.selectorLabels&quot; $ | nindent 14 }}</span></span>
<span class="line"><span style="color:#98C379;">        {{- end }}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="net-特有配置" tabindex="-1"><a class="header-anchor" href="#net-特有配置"><span>.NET 特有配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># .NET 专用的 values 配置</span></span>
<span class="line"><span style="color:#E06C75;">dotnet</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  environment</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Production</span></span>
<span class="line"><span style="color:#E06C75;">  urls</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;http://+:8080&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  gcServer</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span><span style="color:#7F848E;font-style:italic;">        # Server GC</span></span>
<span class="line"><span style="color:#E06C75;">  gcConcurrent</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span><span style="color:#7F848E;font-style:italic;">    # 并发 GC</span></span>
<span class="line"><span style="color:#E06C75;">  threadPoolMinThreads</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#E06C75;">  threadPoolMinIOThreads</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 健康检查（.NET 健康端点）</span></span>
<span class="line"><span style="color:#E06C75;">livenessProbe</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  httpGet</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/healthz</span></span>
<span class="line"><span style="color:#E06C75;">  initialDelaySeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">30</span></span>
<span class="line"><span style="color:#E06C75;">  periodSeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#E06C75;">  timeoutSeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">5</span></span>
<span class="line"><span style="color:#E06C75;">  failureThreshold</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">readinessProbe</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  httpGet</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/ready</span></span>
<span class="line"><span style="color:#E06C75;">  initialDelaySeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">5</span></span>
<span class="line"><span style="color:#E06C75;">  periodSeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">5</span></span>
<span class="line"><span style="color:#E06C75;">  timeoutSeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">  failureThreshold</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">startupProbe</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  httpGet</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/healthz</span></span>
<span class="line"><span style="color:#E06C75;">  initialDelaySeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#E06C75;">  periodSeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">5</span></span>
<span class="line"><span style="color:#E06C75;">  failureThreshold</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">30</span><span style="color:#7F848E;font-style:italic;">  # 最多等待 150 秒启动</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 数据库迁移 InitContainer</span></span>
<span class="line"><span style="color:#E06C75;">initContainers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  waitForDB</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">  migrate</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 部署策略</span></span>
<span class="line"><span style="color:#E06C75;">strategy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">RollingUpdate</span></span>
<span class="line"><span style="color:#E06C75;">  rollingUpdate</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    maxSurge</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">1</span></span>
<span class="line"><span style="color:#E06C75;">    maxUnavailable</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 持久化（如需文件存储）</span></span>
<span class="line"><span style="color:#E06C75;">persistence</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  enabled</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span></span>
<span class="line"><span style="color:#E06C75;">  storageClass</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  accessMode</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ReadWriteOnce</span></span>
<span class="line"><span style="color:#E06C75;">  size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10Gi</span></span>
<span class="line"><span style="color:#E06C75;">  mountPath</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/app/data</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生命周期钩子</span></span>
<span class="line"><span style="color:#E06C75;">lifecycle</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  preStop</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    exec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      command</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;/bin/sh&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;-c&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;sleep 10&quot;</span><span style="color:#ABB2BF;">]  </span><span style="color:#7F848E;font-style:italic;"># 等待 Service 端点更新</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="configmap-与-secret-模板" tabindex="-1"><a class="header-anchor" href="#configmap-与-secret-模板"><span>ConfigMap 与 Secret 模板</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># templates/configmap.yaml</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ConfigMap</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ include &quot;dotnet-app.fullname&quot; . }}-config</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Release.Namespace }}</span></span>
<span class="line"><span style="color:#E06C75;">  labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">    {{- include &quot;dotnet-app.labels&quot; . | nindent 4 }}</span></span>
<span class="line"><span style="color:#E06C75;">data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">  {{- range $key, $value := .Values.env }}</span></span>
<span class="line"><span style="color:#E06C75;">  {{ $key }}</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ $value | quote }}</span></span>
<span class="line"><span style="color:#98C379;">  {{- end }}</span></span>
<span class="line"><span style="color:#98C379;">  {{- with .Values.configMap.data }}</span></span>
<span class="line"><span style="color:#98C379;">  {{- toYaml . | nindent 2 }}</span></span>
<span class="line"><span style="color:#98C379;">  {{- end }}</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># templates/secret.yaml</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Secret</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ include &quot;dotnet-app.fullname&quot; . }}-secret</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Release.Namespace }}</span></span>
<span class="line"><span style="color:#E06C75;">  labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">    {{- include &quot;dotnet-app.labels&quot; . | nindent 4 }}</span></span>
<span class="line"><span style="color:#E06C75;">type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Opaque</span></span>
<span class="line"><span style="color:#E06C75;">data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">  {{- range $key, $value := .Values.secrets }}</span></span>
<span class="line"><span style="color:#E06C75;">  {{ $key }}</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ $value | b64enc | quote }}</span></span>
<span class="line"><span style="color:#98C379;">  {{- end }}</span></span>
<span class="line"><span style="color:#98C379;">{{- range .Values.extraSecrets }}</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Secret</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ include &quot;dotnet-app.fullname&quot; $ }}-{{ .name }}</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ $.Release.Namespace }}</span></span>
<span class="line"><span style="color:#E06C75;">type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .type | default &quot;Opaque&quot; }}</span></span>
<span class="line"><span style="color:#E06C75;">data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">  {{- range $key, $value := .data }}</span></span>
<span class="line"><span style="color:#E06C75;">  {{ $key }}</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ $value | b64enc | quote }}</span></span>
<span class="line"><span style="color:#98C379;">  {{- end }}</span></span>
<span class="line"><span style="color:#98C379;">{{- end }}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="notes-txt" tabindex="-1"><a class="header-anchor" href="#notes-txt"><span>NOTES.txt</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#98C379;">{{- define &quot;dotnet-app.notes&quot; -}}</span></span>
<span class="line"><span style="color:#98C379;">🚀 {{ .Chart.Name }} has been deployed!</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">Release</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Release.Name }}</span></span>
<span class="line"><span style="color:#E06C75;">Namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Release.Namespace }}</span></span>
<span class="line"><span style="color:#E06C75;">Version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Chart.AppVersion }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">{{- if .Values.ingress.enabled }}</span></span>
<span class="line"><span style="color:#E06C75;">Access</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://{{ (index .Values.ingress.hosts 0).host }}</span></span>
<span class="line"><span style="color:#98C379;">{{- else if eq .Values.service.type &quot;NodePort&quot; }}</span></span>
<span class="line"><span style="color:#E06C75;">Access</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">http://&lt;NodeIP&gt;:{{ .Values.service.nodePort }}</span></span>
<span class="line"><span style="color:#98C379;">{{- else if eq .Values.service.type &quot;LoadBalancer&quot; }}</span></span>
<span class="line"><span style="color:#E06C75;">Access</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">http://{{ .Values.service.loadBalancerIP }}</span></span>
<span class="line"><span style="color:#98C379;">{{- end }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">Health Check</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">  kubectl get pods -n {{ .Release.Namespace }} -l app.kubernetes.io/instance={{ .Release.Name }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">View Logs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">  kubectl logs -f deployment/{{ include &quot;dotnet-app.fullname&quot; . }} -n {{ .Release.Namespace }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">{{- if .Values.autoscaling.enabled }}</span></span>
<span class="line"><span style="color:#E06C75;">Autoscaling</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.autoscaling.minReplicas }}-{{ .Values.autoscaling.maxReplicas }} replicas</span></span>
<span class="line"><span style="color:#98C379;">{{- end }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">{{- if .Values.redis.enabled }}</span></span>
<span class="line"><span style="color:#E06C75;">Redis</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Release.Name }}-redis-master:6379</span></span>
<span class="line"><span style="color:#98C379;">{{- end }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">{{- end }}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="高级主题" tabindex="-1"><a class="header-anchor" href="#高级主题"><span>高级主题</span></a></h2><h3 id="helm-hooks" tabindex="-1"><a class="header-anchor" href="#helm-hooks"><span>Helm Hooks</span></a></h3><p>Hooks 允许在 Release 生命周期的特定点执行操作：</p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装前执行数据库迁移</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">batch/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Job</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ include &quot;dotnet-app.fullname&quot; . }}-migrate&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">    &quot;helm.sh/hook&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">pre-install,pre-upgrade</span></span>
<span class="line"><span style="color:#98C379;">    &quot;helm.sh/hook-weight&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;-5&quot;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;helm.sh/hook-delete-policy&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">before-hook-creation,hook-succeeded</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  ttlSecondsAfterFinished</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">86400</span></span>
<span class="line"><span style="color:#E06C75;">  template</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      restartPolicy</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Never</span></span>
<span class="line"><span style="color:#E06C75;">      containers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">migrate</span></span>
<span class="line"><span style="color:#E06C75;">          image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          command</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;dotnet&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;EfMigrate.dll&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">          envFrom</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">secretRef</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ include &quot;dotnet-app.fullname&quot; . }}-secret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container info"><p class="hint-container-title">Hook 类型与生命周期</p><table><thead><tr><th>Hook</th><th>触发时机</th></tr></thead><tbody><tr><td><code>pre-install</code></td><td>安装前，模板渲染后</td></tr><tr><td><code>post-install</code></td><td>安装完成后</td></tr><tr><td><code>pre-upgrade</code></td><td>升级前</td></tr><tr><td><code>post-upgrade</code></td><td>升级完成后</td></tr><tr><td><code>pre-delete</code></td><td>删除前</td></tr><tr><td><code>post-delete</code></td><td>删除完成后</td></tr><tr><td><code>pre-rollback</code></td><td>回滚前</td></tr><tr><td><code>post-rollback</code></td><td>回滚完成后</td></tr><tr><td><code>test</code></td><td><code>helm test</code> 时执行</td></tr></tbody></table><p><code>hook-weight</code>：数值越小越先执行（负数也有效）。<br><code>hook-delete-policy</code>：<code>before-hook-creation</code>、<code>hook-succeeded</code>、<code>hook-failed</code></p></div><h3 id="library-chart" tabindex="-1"><a class="header-anchor" href="#library-chart"><span>Library Chart</span></a></h3><p>Library Chart 提供可复用的命名模板，不能独立部署：</p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># Chart.yaml</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v2</span></span>
<span class="line"><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">common-library</span></span>
<span class="line"><span style="color:#E06C75;">type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">library</span></span>
<span class="line"><span style="color:#E06C75;">version</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">1.0.0</span></span>
<span class="line"><span style="color:#E06C75;">description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Shared templates for all microservices</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># templates/_container.tpl</span></span>
<span class="line"><span style="color:#98C379;">{{- define &quot;common-library.container&quot; -}}</span></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Chart.Name }}</span></span>
<span class="line"><span style="color:#E06C75;">  image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  imagePullPolicy</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.image.pullPolicy }}</span></span>
<span class="line"><span style="color:#E06C75;">  ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">http</span></span>
<span class="line"><span style="color:#E06C75;">      containerPort</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.service.targetPort | default 8080 }}</span></span>
<span class="line"><span style="color:#E06C75;">  resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">    {{- toYaml .Values.resources | nindent 4 }}</span></span>
<span class="line"><span style="color:#E06C75;">  livenessProbe</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    httpGet</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/healthz</span></span>
<span class="line"><span style="color:#E06C75;">      port</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">http</span></span>
<span class="line"><span style="color:#E06C75;">    initialDelaySeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.livenessProbe.initialDelaySeconds | default 30 }}</span></span>
<span class="line"><span style="color:#E06C75;">  readinessProbe</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    httpGet</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/ready</span></span>
<span class="line"><span style="color:#E06C75;">      port</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">http</span></span>
<span class="line"><span style="color:#E06C75;">    initialDelaySeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">{{ .Values.readinessProbe.initialDelaySeconds | default 5 }}</span></span>
<span class="line"><span style="color:#98C379;">{{- end }}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在应用 Chart 中引用：</p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 应用 Chart 的 templates/deployment.yaml</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  containers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">    {{- include &quot;common-library.container&quot; . | nindent 4 }}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>需要在 <code>Chart.yaml</code> 中声明依赖：</p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#E06C75;">dependencies</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">common-library</span></span>
<span class="line"><span style="color:#E06C75;">    version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1.0.0&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    repository</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;file://../common-library&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="post-renderers" tabindex="-1"><a class="header-anchor" href="#post-renderers"><span>Post Renderers</span></a></h3><p>Post Renderer 允许在 Helm 渲染后、应用前修改 YAML：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 kustomize 作为 post-renderer</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> ./myapp</span><span style="color:#D19A66;"> --post-renderer</span><span style="color:#98C379;"> ./kustomize-wrapper.sh</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># kustomize-wrapper.sh</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &lt;&amp;</span><span style="color:#61AFEF;">0</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/tmp/stdin.yaml</span></span>
<span class="line"><span style="color:#61AFEF;">kustomize</span><span style="color:#98C379;"> build</span><span style="color:#98C379;"> /path/to/overlay</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/tmp/stdout.yaml</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /tmp/stdout.yaml</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="helm-命令速查" tabindex="-1"><a class="header-anchor" href="#helm-命令速查"><span>Helm 命令速查</span></a></h2><h3 id="常用命令" tabindex="-1"><a class="header-anchor" href="#常用命令"><span>常用命令</span></a></h3><table><thead><tr><th>命令</th><th>说明</th></tr></thead><tbody><tr><td><code>helm create NAME</code></td><td>创建新 Chart</td></tr><tr><td><code>helm package PATH</code></td><td>打包 Chart 为 tgz</td></tr><tr><td><code>helm lint PATH</code></td><td>检查 Chart 问题</td></tr><tr><td><code>helm template PATH</code></td><td>本地渲染模板</td></tr><tr><td><code>helm install NAME CHART</code></td><td>安装 Release</td></tr><tr><td><code>helm upgrade NAME CHART</code></td><td>升级 Release</td></tr><tr><td><code>helm rollback NAME [REVISION]</code></td><td>回滚 Release</td></tr><tr><td><code>helm uninstall NAME</code></td><td>卸载 Release</td></tr><tr><td><code>helm list</code></td><td>列出 Release</td></tr><tr><td><code>helm status NAME</code></td><td>查看 Release 状态</td></tr><tr><td><code>helm history NAME</code></td><td>查看 Release 历史</td></tr><tr><td><code>helm show VALUES CHART</code></td><td>查看 Chart 默认 values</td></tr><tr><td><code>helm get values NAME</code></td><td>查看 Release 当前 values</td></tr><tr><td><code>helm get manifest NAME</code></td><td>查看 Release 的 manifest</td></tr><tr><td><code>helm diff upgrade NAME CHART</code></td><td>查看升级差异</td></tr><tr><td><code>helm test NAME</code></td><td>运行 Chart 测试</td></tr><tr><td><code>helm repo add NAME URL</code></td><td>添加仓库</td></tr><tr><td><code>helm repo update</code></td><td>更新仓库索引</td></tr><tr><td><code>helm search repo KEYWORD</code></td><td>搜索仓库中的 Chart</td></tr><tr><td><code>helm dependency update</code></td><td>更新依赖</td></tr><tr><td><code>helm registry login URL</code></td><td>登录 OCI 注册表</td></tr><tr><td><code>helm push CHART OCI_URL</code></td><td>推送到 OCI 注册表</td></tr></tbody></table><h3 id="调试技巧" tabindex="-1"><a class="header-anchor" href="#调试技巧"><span>调试技巧</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 本地渲染（不安装）</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> template</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> ./myapp</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> values-prod.yaml</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">rendered.yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 调试特定模板</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> template</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> ./myapp</span><span style="color:#D19A66;"> --show-only</span><span style="color:#98C379;"> templates/deployment.yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 干跑模式（验证但不安装）</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> ./myapp</span><span style="color:#D19A66;"> --dry-run</span><span style="color:#D19A66;"> --debug</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 查看合并后的 values</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> get</span><span style="color:#98C379;"> values</span><span style="color:#98C379;"> myapp</span><span style="color:#D19A66;"> --all</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> production</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. 查看将要应用的完整 YAML</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> get</span><span style="color:#98C379;"> manifest</span><span style="color:#98C379;"> myapp</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> production</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 6. 检查 Chart 问题</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> lint</span><span style="color:#98C379;"> ./myapp</span><span style="color:#D19A66;"> --strict</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 7. 查看升级差异</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> diff</span><span style="color:#98C379;"> upgrade</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> ./myapp</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> values-prod.yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 8. 查看 Chart 信息</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> all</span><span style="color:#98C379;"> ./myapp</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> values</span><span style="color:#98C379;"> ./myapp</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2>`,41),i(f,{code:`eJxVkc1O20AUhfd9iruEDXmGKq2A/hCpdF9NyEAsxtga25XaVVKU9C9ggpMK9S+kLW2o1LgSopTYIS+TO+O8BSN7jMJyzrlz55xvTGOnYhL7DgC3LHdhYYUyE7DVkMO+PGguLioDQBz/x8mu+PkKJ+epAFCsEu6CeBuoWXEcY+xr4zlhHnVg1tiT4+F0HMizSDtPKKPEoSA7PWyPsT0Qn3vaEoO++DLBuCuC/VTCuIZ+G4dfk4v8xeSqge9Os0l4VqXMptxZcm2m/QfrpTVY36hSk8DsdysJ67ejnr9Pwq6WVixrW2U8PMU/B1p6ZJQ54S+y6VSbRgGOggzE/KrHnkM9M99EeNni+lAqroI4G2CzlfQHqXbTeX6LseO4hLGCZ29xUqEFbjFWJhvb2sYfH+V+iN92NUstq8YmVIzNzZyZfziN/im8MsowKq6iVp99aoo3eam7fMsq3oNlwy3Z+Z6HnuNapvGSAoaXIuzk1VYLanLu9tLa/aeAo47sZFVUsPoJji7E95ronWT/m0fp/hV7QwUrmdTlryjFq63lIkzjI2x90OesGfpHs9e+hnIN2OkNPw==`}),s[14]||=n(`<div class="hint-container tip"><p class="hint-container-title">Helm 最佳实践清单</p><ol><li><strong>始终使用 <code>helm upgrade --install</code></strong> 替代单独的 install/upgrade</li><li><strong>为 Chart 编写 JSON Schema</strong> 确保 values 类型安全</li><li><strong>使用 <code>helm diff</code></strong> 在升级前查看变更</li><li><strong>遵循 Kubernetes 推荐标签</strong> 规范</li><li><strong>敏感信息通过 <code>--set</code> 或 Secret 管理</strong> 不写入 values.yaml</li><li><strong>编写 Chart 测试</strong> 确保部署质量</li><li><strong>使用 OCI 注册表</strong> 统一镜像和 Chart 仓库</li><li><strong>合理使用 Library Chart</strong> 减少模板重复</li><li><strong>为 .NET 应用设置 startupProbe</strong> 避免慢启动被误杀</li><li><strong>在 CI/CD 中加入 <code>helm lint --strict</code></strong> 门禁</li></ol></div>`,1)])}var u=o(c,[[`render`,l]]);export{s as _pageData,u as default};