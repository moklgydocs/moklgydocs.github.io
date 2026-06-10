import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as a}from"./app-DgnfxEif.js";var o=JSON.parse(`{"path":"/Linux/07_Nginx/08_%E9%AB%98%E7%BA%A7%E7%89%B9%E6%80%A7%E4%B8%8E%E6%89%A9%E5%B1%95/05_Nginx%E4%B8%8EService%20Mesh%E9%9B%86%E6%88%90.html","title":"Nginx 与 Service Mesh 集成","lang":"zh-CN","frontmatter":{"title":"Nginx 与 Service Mesh 集成","icon":"fa6-solid:network-wired","order":5,"category":["Linux","Nginx"],"tag":["Service Mesh","Istio","Sidecar","Envoy","微服务","流量管理"]},"git":{"createdTime":1780631738000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":3}]},"readingTime":{"minutes":18.13,"words":5440},"filePathRelative":"Linux/07_Nginx/08_高级特性与扩展/05_Nginx与Service Mesh集成.md"}`),s={name:`05_Nginx与Service Mesh集成.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="nginx-与-service-mesh-集成" tabindex="-1"><a class="header-anchor" href="#nginx-与-service-mesh-集成"><span>Nginx 与 Service Mesh 集成</span></a></h1><p>Service Mesh 是微服务架构中处理服务间通信的基础设施层。Nginx 作为成熟的流量代理，在 Service Mesh 生态中扮演着重要角色——既可作为 Sidecar 代理，也可作为入口网关与 Mesh 协同工作。本文系统讲解 Nginx 在 Service Mesh 中的定位、与 Istio 的对比和集成方案，以及生产环境中的最佳实践。</p><hr><h2 id="_1-service-mesh-概述" tabindex="-1"><a class="header-anchor" href="#_1-service-mesh-概述"><span>1. Service Mesh 概述</span></a></h2><h3 id="_1-1-微服务通信的演进" tabindex="-1"><a class="header-anchor" href="#_1-1-微服务通信的演进"><span>1.1 微服务通信的演进</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>微服务通信演进历程：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 硬编码直连</span></span>
<span class="line"><span>┌─────────┐    ┌─────────┐</span></span>
<span class="line"><span>│ 服务 A  │───→│ 服务 B  │</span></span>
<span class="line"><span>│(含通信  │    │(含通信  │</span></span>
<span class="line"><span>│ 逻辑)  │    │ 逻辑)  │</span></span>
<span class="line"><span>└─────────┘    └─────────┘</span></span>
<span class="line"><span>问题：服务发现、负载均衡、熔断等逻辑与业务代码耦合</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 客户端库（如 Spring Cloud / Finagle）</span></span>
<span class="line"><span>┌───────────────┐    ┌───────────────┐</span></span>
<span class="line"><span>│    服务 A     │    │    服务 B     │</span></span>
<span class="line"><span>│  ┌─────────┐  │    │  ┌─────────┐  │</span></span>
<span class="line"><span>│  │ 业务   │  │    │  │ 业务   │  │</span></span>
<span class="line"><span>│  │ 代码   │  │    │  │ 代码   │  │</span></span>
<span class="line"><span>│  └────┬────┘  │    │  └────┬────┘  │</span></span>
<span class="line"><span>│  ┌────┴────┐  │    │  ┌────┴────┐  │</span></span>
<span class="line"><span>│  │SDK/库  │  │    │  │SDK/库  │  │</span></span>
<span class="line"><span>│  │发现/熔断│  │    │  │发现/熔断│  │</span></span>
<span class="line"><span>│  └─────────┘  │    │  └─────────┘  │</span></span>
<span class="line"><span>└───────────────┘    └───────────────┘</span></span>
<span class="line"><span>问题：多语言重复实现、版本升级困难</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. Service Mesh（Sidecar 模式）</span></span>
<span class="line"><span>┌──────────────────────┐    ┌──────────────────────┐</span></span>
<span class="line"><span>│       服务 A         │    │       服务 B         │</span></span>
<span class="line"><span>│  ┌──────────────┐   │    │  ┌──────────────┐   │</span></span>
<span class="line"><span>│  │  业务代码    │   │    │  │  业务代码    │   │</span></span>
<span class="line"><span>│  └──────┬───────┘   │    │  └──────┬───────┘   │</span></span>
<span class="line"><span>│         │           │    │         │           │</span></span>
<span class="line"><span>│  ┌──────┴───────┐   │    │  ┌──────┴───────┐   │</span></span>
<span class="line"><span>│  │  Sidecar     │   │    │  │  Sidecar     │   │</span></span>
<span class="line"><span>│  │  代理(Envoy) │───┼────┼→│  代理(Envoy) │   │</span></span>
<span class="line"><span>│  └──────────────┘   │    │  └──────────────┘   │</span></span>
<span class="line"><span>└──────────────────────┘    └──────────────────────┘</span></span>
<span class="line"><span>优势：业务代码零侵入、统一控制面、多语言支持</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-service-mesh-架构" tabindex="-1"><a class="header-anchor" href="#_1-2-service-mesh-架构"><span>1.2 Service Mesh 架构</span></a></h3>`,7),i(d,{code:`eJyVVEtLw0AQvvsrlngWSaKiIoIvRBApPvCweFiTTQ2sSUnjo+DFQ7WCtgp68OBBxQcKVRBfffybpmlP/Qsm2XSbNqnoHrK7M/PNN9/sEIXoO9IGMkywPNkDnJXcWo8bKLEBppGJYgRpGHLVi9fqSb5+ddMoZVwz8OyN0hG35mHcJasGlkxV18D8IjOyZDFd5iHnfAEfwLhrIpHgoVU4t88frfy3dfm4Bvr6xsGSKmMJGTz0D6BSvLVPD1pYrMmRNAKlEcI0Qnca4d80IqURwzRidxrxVxp2aWoHYy52b3N5fmmPVdoZJURFiX/KRaMYNZM3pWumoZPm42cfrMwHfXzfE/X+MZXoptMUdxtbN/rH6+kTu5y3cmd29rXyla2+79cPc3b+2tEdgE2pJpIxgZx/8KC1l/3K970DqhWeK8VyCDSLCMEpyNE9wFZ/OnawfiQT5tXUNlXRZtrbkJm2ya8vnCbCQRNFOMSOTs9pcQMnk5Cz0ndW7tYun1npt4BQ3z+7Cjn/6Gg38Q6iohfiqrYL+sGMtq2nOlWvJLEBnTmsZj7pELJknpvd2hXR+swUwa0fAFBUQkZ7Ma8MKjgQEJwTP0ZRlBFpIBDTLJu6pWE8JI30/ACE3IdG`}),o[1]||=n(`<h3 id="_1-3-主流-service-mesh-方案对比" tabindex="-1"><a class="header-anchor" href="#_1-3-主流-service-mesh-方案对比"><span>1.3 主流 Service Mesh 方案对比</span></a></h3><table><thead><tr><th>特性</th><th>Istio</th><th>Linkerd</th><th>Consul Connect</th><th>Nginx Service Mesh</th></tr></thead><tbody><tr><td>Sidecar 代理</td><td>Envoy</td><td>Linkerd2-proxy</td><td>Envoy/内置</td><td>Nginx</td></tr><tr><td>控制面语言</td><td>Go</td><td>Rust/Go</td><td>Go</td><td>Go</td></tr><tr><td>mTLS</td><td>是</td><td>是</td><td>是</td><td>是</td></tr><tr><td>流量管理</td><td>强大（VirtualService）</td><td>基础</td><td>中等</td><td>中等</td></tr><tr><td>可观测性</td><td>强（Kiali 集成）</td><td>内置</td><td>中等</td><td>内置</td></tr><tr><td>性能开销</td><td>较高</td><td>较低</td><td>中等</td><td>中等</td></tr><tr><td>学习曲线</td><td>陡峭</td><td>平缓</td><td>中等</td><td>平缓</td></tr><tr><td>社区规模</td><td>最大</td><td>中等</td><td>中等</td><td>较小</td></tr><tr><td>商业支持</td><td>Google/IBM</td><td>Buoyant</td><td>HashiCorp</td><td>F5/Nginx</td></tr></tbody></table><hr><h2 id="_2-nginx-在-service-mesh-中的角色" tabindex="-1"><a class="header-anchor" href="#_2-nginx-在-service-mesh-中的角色"><span>2. Nginx 在 Service Mesh 中的角色</span></a></h2><h3 id="_2-1-三种集成模式" tabindex="-1"><a class="header-anchor" href="#_2-1-三种集成模式"><span>2.1 三种集成模式</span></a></h3>`,5),i(d,{code:`eJxLy8kvT85ILCpRCHHiUgCC4tKk9KLEggwF3/yUVMNopWcrFj7d0/9kR8P7PbOeti592r/4+d6JT1s3K8WClYNAaHFqkWH00yXTXjaveLa18WV7f6yCrq6dgl96Zl6Fe3i0Epih4JmXXpRaXGyTVKRvh8MkqA6wbt/U4gyg/Z7FJZn5YA5Yo2teWX6lQnBmSmpyYhGSTrBqsL7gMGfD6Gdzep92LXw5u+35viUQRal5KVyYHjSCe3BXD9CDUHMVnuxe/HxCG5oXjbB4Eeon93CgJJKXEBoRCsDqHQsKjIBBtWvK8ykrFBwRysDiiECDugMacmCPY3oZWSXccKCHoKY7gbVpQ5ShhRj2wDBGxHYnMDCgGlOLyjKTU8EBjBYgxrjj3DgaJc4xYtgYojjYF5Y4kK0BO/xZ3/KnHdtezl2E7ONgX5hHjYFJAxaMeDyKrovU4CmpzAG6CZQTFNIyc3KslFMN00zTUtEkjaCSyRapZsmWaJLGUMm0tDTLZBMuAM9pPO4=`}),o[2]||=n(`<h3 id="_2-2-模式一-nginx-作为入口网关" tabindex="-1"><a class="header-anchor" href="#_2-2-模式一-nginx-作为入口网关"><span>2.2 模式一：Nginx 作为入口网关</span></a></h3><p>最常见、最成熟的集成方式。Nginx 作为 Kubernetes Ingress Controller 处理外部流量，内部流量由 Istio/Envoy 管理。</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx Ingress 配置：与 Istio Mesh 协同</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 关键：确保 Nginx 传递正确的 Header 给下游 Envoy Sidecar</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> frontend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> frontend.default.svc.cluster.local:80;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> api {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> api.default.svc.cluster.local:80;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 传递客户端真实 IP（Istio 需要用于策略判断）</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Proto $</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 传递 Host（Istio VirtualService 基于 Host 路由）</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 传递外部来源标记</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Istio 使用 x-envoy-* 头部，但 Nginx 入口不使用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 可以通过自定义头标记来源</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">X-Source </span><span style="color:#98C379;">&quot;nginx-ingress&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://frontend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># Kubernetes Nginx Ingress + Istio 集成配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx Ingress Controller 部署</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">apps/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Deployment</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx-ingress-controller</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ingress-nginx</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  replicas</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">2</span></span>
<span class="line"><span style="color:#E06C75;">  selector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    matchLabels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx-ingress</span></span>
<span class="line"><span style="color:#E06C75;">  template</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 重要：排除 Istio Sidecar 自动注入</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 入口网关不应有 Sidecar，否则形成代理链</span></span>
<span class="line"><span style="color:#E06C75;">        sidecar.istio.io/inject</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;false&quot;</span></span>
<span class="line"><span style="color:#E06C75;">      labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx-ingress</span></span>
<span class="line"><span style="color:#E06C75;">    spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      containers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx-ingress</span></span>
<span class="line"><span style="color:#E06C75;">          image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx/nginx-ingress:3.4.0</span></span>
<span class="line"><span style="color:#E06C75;">          ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">containerPort</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">80</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">containerPort</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">443</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Istio Gateway 配置（如果同时使用 Istio Gateway）</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networking.istio.io/v1alpha3</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Gateway</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">mesh-gateway</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">istio-system</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  selector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    istio</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ingressgateway</span></span>
<span class="line"><span style="color:#E06C75;">  servers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">port</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        number</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">80</span></span>
<span class="line"><span style="color:#E06C75;">        name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">http</span></span>
<span class="line"><span style="color:#E06C75;">        protocol</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">HTTP</span></span>
<span class="line"><span style="color:#E06C75;">      hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">&quot;*.example.com&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-模式二-nginx-作为-sidecar-代理" tabindex="-1"><a class="header-anchor" href="#_2-3-模式二-nginx-作为-sidecar-代理"><span>2.3 模式二：Nginx 作为 Sidecar 代理</span></a></h3><p>Nginx 替代 Envoy 作为 Pod 内的 Sidecar 代理。这种方式需要自行实现 xDS 协议对接控制面。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Nginx Sidecar 架构：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌────────────────────────────────────┐</span></span>
<span class="line"><span>│               Pod                  │</span></span>
<span class="line"><span>│                                    │</span></span>
<span class="line"><span>│  ┌──────────┐    ┌──────────────┐ │</span></span>
<span class="line"><span>│  │  应用容器 │    │ Nginx Sidecar│ │</span></span>
<span class="line"><span>│  │  :8080   │←──→│  :80         │ │</span></span>
<span class="line"><span>│  │          │    │  :15001 出站  │ │</span></span>
<span class="line"><span>│  │          │    │  :15006 入站  │ │</span></span>
<span class="line"><span>│  └──────────┘    └──────────────┘ │</span></span>
<span class="line"><span>│                       ↕           │</span></span>
<span class="line"><span>│                  xDS 配置          │</span></span>
<span class="line"><span>│                  控制面连接         │</span></span>
<span class="line"><span>└────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>流量路径：</span></span>
<span class="line"><span>入站：外部 → Nginx:15006 → 应用:8080</span></span>
<span class="line"><span>出站：应用:8080 → Nginx:15001 → 目标服务</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Nginx Sidecar 需要实现：</span></span>
<span class="line"><span>1. iptables 规则劫持 Pod 内流量</span></span>
<span class="line"><span>2. xDS 协议从控制面获取配置</span></span>
<span class="line"><span>3. mTLS 证书管理</span></span>
<span class="line"><span>4. 健康检查</span></span>
<span class="line"><span>5. 指标暴露（Prometheus 格式）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx Sidecar 代理配置示例</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 通过 xDS 动态配置实现</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：此配置为概念性展示</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 实际需要使用 nginx-plus 或 OpenResty + xDS 客户端</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 入站流量处理</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">15006</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # mTLS 终止</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">    /etc/nginx/certs/server.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/certs/server.key;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_client_certificate </span><span style="color:#ABB2BF;">/etc/nginx/certs/ca.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_verify_client </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://127.0.0.1:8080;  </span><span style="color:#7F848E;font-style:italic;"># 本地应用</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Proto $</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 出站流量处理</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">15001</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 基于目标服务的路由</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 实际通过 xDS 动态更新</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /service-a/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">https://service-a:8443/;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_ssl_certificate </span><span style="color:#ABB2BF;">    /etc/nginx/certs/client.crt;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/certs/client.key;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_ssl_trusted_certificate </span><span style="color:#ABB2BF;">/etc/nginx/certs/ca.crt;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_ssl_verify </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /service-b/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">https://service-b:8443/;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_ssl_certificate </span><span style="color:#ABB2BF;">    /etc/nginx/certs/client.crt;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/certs/client.key;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_ssl_trusted_certificate </span><span style="color:#ABB2BF;">/etc/nginx/certs/ca.crt;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_ssl_verify </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_3-nginx-与-istio-集成" tabindex="-1"><a class="header-anchor" href="#_3-nginx-与-istio-集成"><span>3. Nginx 与 Istio 集成</span></a></h2><h3 id="_3-1-架构-nginx-ingress-istio-mesh" tabindex="-1"><a class="header-anchor" href="#_3-1-架构-nginx-ingress-istio-mesh"><span>3.1 架构：Nginx Ingress + Istio Mesh</span></a></h3>`,11),i(d,{code:`eJydks1Kw0AQx+99iqUeaxRb/CpSkOJHoGqw9RSKpMmkCcakbLZf0EsvUoUKanvTg70oCHpTEHwb09a3cLtJw7ZCC+aSnZmd38x/dnTLqaqGggnKHEcQ/USbALaByN+ft8NmZ/B1k0eCkEKHRdOuiXYRg+vKUWbRu8zcKuDlVNqxCXYsC3A0H2EkPoMhGvu5nNRAu5heBVs7lRxNjnqX7cHLG6JnhomhHbvi1FHW1EBVRqxZqG1J9Cn0MAPBGHxZn3Gey2Qb6MQF7EMGned+66N/3/auHuc0FBTmOUdYG4OGrz2v3f0vSMKOVlZJMJ7uhXfXnItiLLdcKGKlZKADcA05KrrEdFAWcMVUgfmCmtPTCJ1BM6E9Hk3oCDWGHq5Z5qPIqWaCxRj3079+8lrvPw89rhkWoWL9P5MomZZDYmmTKBpYsT2FLlY9yAhL+NeRsERn90cPH+R18f4JfXxgUicf4fX6OkndgskF1U3LSi6oG7Cmbi66VPwZJBfisK4l4oEpVE2NGMlEqcYxRi8U5MKKvqpD5BccdDHT`}),o[3]||=n(`<h3 id="_3-2-nginx-ingress-配置优化" tabindex="-1"><a class="header-anchor" href="#_3-2-nginx-ingress-配置优化"><span>3.2 Nginx Ingress 配置优化</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx Ingress 与 Istio 集成的关键配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/nginx.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Worker 配置</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"><span style="color:#C678DD;">worker_rlimit_nofile </span><span style="color:#D19A66;">65535</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">4096</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    use </span><span style="color:#D19A66;">epoll</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    multi_accept </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 基础优化</span></span>
<span class="line"><span style="color:#C678DD;">    sendfile </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nopush </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nodelay </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_timeout </span><span style="color:#D19A66;">65s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_requests </span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 与 Istio Envoy 的连接优化</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Envoy Sidecar 默认 keepalive 75s</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Nginx 需要匹配或略低于此值</span></span>
<span class="line"><span style="color:#C678DD;">    upstream_keepalive_timeout</span><span style="color:#D19A66;"> 60s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 连接池配置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 与 Envoy 的长连接池</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 日志格式（增加 Istio 追踪信息）</span></span>
<span class="line"><span style="color:#C678DD;">    log_format </span><span style="color:#ABB2BF;">mesh_log </span><span style="color:#98C379;">&#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> - [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &#39;</span></span>
<span class="line"><span style="color:#98C379;">                        &#39;&quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot; $</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">body_bytes_sent</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                        &#39;&quot;$</span><span style="color:#E06C75;">http_referer</span><span style="color:#98C379;">&quot; &quot;$</span><span style="color:#E06C75;">http_user_agent</span><span style="color:#98C379;">&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">                        &#39;rt=$</span><span style="color:#E06C75;">request_time</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                        &#39;upstream=$</span><span style="color:#E06C75;">upstream_addr</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                        &#39;trace_id=$</span><span style="color:#E06C75;">http_x_b3_traceid</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                        &#39;span_id=$</span><span style="color:#E06C75;">http_x_b3_spanid</span><span style="color:#98C379;">&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;">/var/log/nginx/access.log mesh_log;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 传递 Istio 追踪头</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # B3 追踪格式（Zipkin 兼容）</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">X-B3-TraceId $</span><span style="color:#E06C75;">http_x_b3_traceid</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">X-B3-SpanId $</span><span style="color:#E06C75;">http_x_b3_spanid</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">X-B3-ParentSpanId $</span><span style="color:#E06C75;">http_x_b3_parentspanid</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">X-B3-Sampled $</span><span style="color:#E06C75;">http_x_b3_sampled</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # W3C Trace Context 格式（Istio 1.12+ 默认）</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">Traceparent $</span><span style="color:#E06C75;">http_traceparent</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">Tracestate $</span><span style="color:#E06C75;">http_tracestate</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 传递请求 ID（用于端到端追踪）</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">X-Request-ID $</span><span style="color:#E06C75;">http_x_request_id</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 客户端相关</span></span>
<span class="line"><span style="color:#C678DD;">        client_max_body_size </span><span style="color:#D19A66;">10m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        client_header_timeout </span><span style="color:#D19A66;">10s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        client_body_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 传递原始 Host（Istio VirtualService 依赖 Host 路由）</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 传递真实 IP</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Proto $</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 代理超时（与 Istio 默认超时对齐）</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_connect_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_read_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_send_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-istio-virtualservice-与-nginx-协同" tabindex="-1"><a class="header-anchor" href="#_3-3-istio-virtualservice-与-nginx-协同"><span>3.3 Istio VirtualService 与 Nginx 协同</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># Istio VirtualService 配置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx Ingress 将流量转发到 Kubernetes Service</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Istio VirtualService 在 Mesh 内部做精细流量管理</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networking.istio.io/v1beta1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">VirtualService</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api-vs</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">api.default.svc.cluster.local</span></span>
<span class="line"><span style="color:#E06C75;">  http</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 金丝雀发布：10% 流量到 v2</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">match</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">headers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            x-canary</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              exact</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;true&quot;</span></span>
<span class="line"><span style="color:#E06C75;">      route</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">destination</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api.default.svc.cluster.local</span></span>
<span class="line"><span style="color:#E06C75;">            port</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              number</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">80</span></span>
<span class="line"><span style="color:#E06C75;">            subset</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v2</span></span>
<span class="line"><span style="color:#E06C75;">          weight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">100</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 默认路由：90% v1 / 10% v2</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">route</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">destination</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api.default.svc.cluster.local</span></span>
<span class="line"><span style="color:#E06C75;">            port</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              number</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">80</span></span>
<span class="line"><span style="color:#E06C75;">            subset</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">          weight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">90</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">destination</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api.default.svc.cluster.local</span></span>
<span class="line"><span style="color:#E06C75;">            port</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              number</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">80</span></span>
<span class="line"><span style="color:#E06C75;">            subset</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v2</span></span>
<span class="line"><span style="color:#E06C75;">          weight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        attempts</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">        perTryTimeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">2s</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># DestinationRule 定义服务版本</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networking.istio.io/v1beta1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">DestinationRule</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api-dr</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api.default.svc.cluster.local</span></span>
<span class="line"><span style="color:#E06C75;">  trafficPolicy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    connectionPool</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      tcp</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        maxConnections</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">100</span></span>
<span class="line"><span style="color:#E06C75;">      http</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        h2UpgradePolicy</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">DEFAULT</span></span>
<span class="line"><span style="color:#E06C75;">        http1MaxPendingRequests</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">100</span></span>
<span class="line"><span style="color:#E06C75;">        http2MaxRequests</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">100</span></span>
<span class="line"><span style="color:#E06C75;">    outlierDetection</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      consecutive5xxErrors</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">30s</span></span>
<span class="line"><span style="color:#E06C75;">      baseEjectionTime</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">30s</span></span>
<span class="line"><span style="color:#E06C75;">      maxEjectionPercent</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">50</span></span>
<span class="line"><span style="color:#E06C75;">  subsets</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">      labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v2</span></span>
<span class="line"><span style="color:#E06C75;">      labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v2</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-4-nginx-传递灰度标记给-istio" tabindex="-1"><a class="header-anchor" href="#_3-4-nginx-传递灰度标记给-istio"><span>3.4 Nginx 传递灰度标记给 Istio</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx 层面灰度判断 → 传递给 Istio</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 灰度规则</span></span>
<span class="line"><span style="color:#C678DD;">split_clients </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">canary_flag</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    10%    </span><span style="color:#98C379;">&quot;true&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    *      &quot;false&quot;;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Cookie 覆盖</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#98C379;"> &quot;$</span><span style="color:#E06C75;">cookie_canary</span><span style="color:#98C379;">|$</span><span style="color:#E06C75;">canary_flag</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">final_canary</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    default</span><span style="color:#98C379;">   &quot;false&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;true|*&quot;  &quot;true&quot;;</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;|true&quot;   &quot;true&quot;;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 将灰度标记传递给 Istio</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # Istio VirtualService 会根据此 Header 路由</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Canary $</span><span style="color:#E06C75;">final_canary</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api.default.svc.cluster.local;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_4-nginx-service-mesh" tabindex="-1"><a class="header-anchor" href="#_4-nginx-service-mesh"><span>4. Nginx Service Mesh</span></a></h2><h3 id="_4-1-nginx-service-mesh-架构" tabindex="-1"><a class="header-anchor" href="#_4-1-nginx-service-mesh-架构"><span>4.1 Nginx Service Mesh 架构</span></a></h3><div class="hint-container warning"><p class="hint-container-title">NSM 已停止维护</p><p>Nginx Service Mesh (NSM) 已于 2023 年停止开发和维护，以下内容仅供学习参考。生产环境建议使用 Istio 或 Linkerd。</p></div><p>Nginx Service Mesh（NSM）是 F5/NGINX 推出的轻量级 Service Mesh 方案，使用 Nginx 作为 Sidecar 代理。</p>`,11),i(d,{code:`eJxLy8kvT85ILCpRCHHiUgCC4tKk9KLEggwFv2DfaCW/9My8CoXg1KKyzORUBd/U4gylWLAyFKUuiSWJATmJealG0UrPpm541rvu5dxFSApBICA/xTBaCUgqGNokFenbORYUKGgrQM3PTElNTizC1AE0D6TDiHgdxhAdxkToSM1L4cL0i3N+XklRfg7cO33Ln3Zsw/QOMHSgKnNSi4DhFOwL0wnkgy1/2dr7fO+65+sWPp/Q9mRH39OOtqf9E7GYklpUEq30Yn3jk53LIIrBuoMDPINcFV7ObnvWMQFTk29qSVFmcjHQeT3tzxa0v2xvB6oE6wsoys9NLclILS0m6FP3xJLU8sRKoCef7534tHUzpjXu4bAU4JmXXpRaXAy2AqoPzXwUe0KLgYHyfMqKZx3bYxV0de0ghoGlwCywGChFgIVADAUbkFBNbohPcA045mEyRugyxhArUOJJQVcPqAaRDGE2IaIEogLiDEg6L6nMSUXSopCWmZNjpZxqmGaaloqkAtUeiKK0tDTLZBMuAI2lBiI=`}),o[4]||=n(`<h3 id="_4-2-安装-nginx-service-mesh" tabindex="-1"><a class="header-anchor" href="#_4-2-安装-nginx-service-mesh"><span>4.2 安装 Nginx Service Mesh</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 安装 Nginx Service Mesh =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 前置条件：Kubernetes 1.19+，Helm 3+</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 添加 Helm 仓库</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> repo</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> nginx-mesh</span><span style="color:#98C379;"> https://helm.nginx.com/nginx-mesh</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> repo</span><span style="color:#98C379;"> update</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 创建命名空间</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> create</span><span style="color:#98C379;"> namespace</span><span style="color:#98C379;"> nginx-mesh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 安装 NSM</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> nsm</span><span style="color:#98C379;"> nginx-mesh/nginx-mesh</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --namespace</span><span style="color:#98C379;"> nginx-mesh</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> controller.image.tag=</span><span style="color:#D19A66;">2.1.0</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> prometheus.deploy=</span><span style="color:#D19A66;">true</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> grafana.deploy=</span><span style="color:#D19A66;">true</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> mtls.mode=permissive</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> tracing.enable=</span><span style="color:#D19A66;">true</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> tracing.backend=zipkin</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> tracing.address=zipkin.istio-system:9411</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 验证安装</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> get</span><span style="color:#98C379;"> pods</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> nginx-mesh</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> get</span><span style="color:#98C379;"> meshes</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. 查看注入的 Sidecar</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> get</span><span style="color:#98C379;"> pods</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> default</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> jsonpath=&#39;{.items[*].spec.containers[*].name}&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 6. 启用自动注入</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> label</span><span style="color:#98C379;"> namespace</span><span style="color:#98C379;"> default</span><span style="color:#98C379;"> nsm.nginx.com/monitor=enabled</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-nsm-流量管理配置" tabindex="-1"><a class="header-anchor" href="#_4-3-nsm-流量管理配置"><span>4.3 NSM 流量管理配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx Service Mesh 流量管理策略</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 基础流量策略</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">specs.smi-spec.io/v1alpha4</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">HTTPRouteGroup</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api-routes</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"><span style="color:#E06C75;">matches</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api-all</span></span>
<span class="line"><span style="color:#E06C75;">    pathRegex</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/api/.*</span></span>
<span class="line"><span style="color:#E06C75;">    methods</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;*&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 流量分流（Traffic Split）— 金丝雀发布</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">split.smi-spec.io/v1alpha4</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">TrafficSplit</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api-canary</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  service</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api</span></span>
<span class="line"><span style="color:#E06C75;">  backends</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">service</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api-v1</span></span>
<span class="line"><span style="color:#E06C75;">      weight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">90</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">service</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api-v2</span></span>
<span class="line"><span style="color:#E06C75;">      weight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 访问控制</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">access.smi-spec.io/v1alpha3</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">TrafficTarget</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api-access</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  destination</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ServiceAccount</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api</span></span>
<span class="line"><span style="color:#E06C75;">    namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"><span style="color:#E06C75;">  rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">HTTPRouteGroup</span></span>
<span class="line"><span style="color:#E06C75;">      name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api-routes</span></span>
<span class="line"><span style="color:#E06C75;">      matches</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">api-all</span></span>
<span class="line"><span style="color:#E06C75;">  sources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ServiceAccount</span></span>
<span class="line"><span style="color:#E06C75;">      name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">frontend</span></span>
<span class="line"><span style="color:#E06C75;">      namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-4-nsm-与-nginx-ingress-联动" tabindex="-1"><a class="header-anchor" href="#_4-4-nsm-与-nginx-ingress-联动"><span>4.4 NSM 与 Nginx Ingress 联动</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx Ingress Controller + Nginx Service Mesh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Ingress 资源</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networking.k8s.io/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Ingress</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api-ingress</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Nginx Ingress 特定注解</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/rewrite-target</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/ssl-redirect</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;true&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 传递追踪头</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/configuration-snippet</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">      proxy_set_header X-B3-TraceId $http_x_b3_traceid;</span></span>
<span class="line"><span style="color:#98C379;">      proxy_set_header X-B3-SpanId $http_x_b3_spanid;</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  ingressClassName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">  tls</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">api.example.com</span></span>
<span class="line"><span style="color:#E06C75;">      secretName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api-tls</span></span>
<span class="line"><span style="color:#E06C75;">  rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api.example.com</span></span>
<span class="line"><span style="color:#E06C75;">      http</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/</span></span>
<span class="line"><span style="color:#E06C75;">            pathType</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Prefix</span></span>
<span class="line"><span style="color:#E06C75;">            backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api</span></span>
<span class="line"><span style="color:#E06C75;">                port</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                  number</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">80</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_5-nginx-与-envoy-对比" tabindex="-1"><a class="header-anchor" href="#_5-nginx-与-envoy-对比"><span>5. Nginx 与 Envoy 对比</span></a></h2><h3 id="_5-1-作为-service-mesh-sidecar-的对比" tabindex="-1"><a class="header-anchor" href="#_5-1-作为-service-mesh-sidecar-的对比"><span>5.1 作为 Service Mesh Sidecar 的对比</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Nginx vs Envoy 作为 Sidecar 对比：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌────────────────┬───────────────────┬───────────────────┐</span></span>
<span class="line"><span>│     特性       │     Nginx         │     Envoy         │</span></span>
<span class="line"><span>├────────────────┼───────────────────┼───────────────────┤</span></span>
<span class="line"><span>│ xDS 协议      │ Nginx Plus 支持   │ 原生支持          │</span></span>
<span class="line"><span>│ 动态配置      │ nginx -s reload   │ xDS 热更新        │</span></span>
<span class="line"><span>│ mTLS          │ 需手动配置证书     │ 自动证书轮转      │</span></span>
<span class="line"><span>│ L7 路由       │ 强（rewrite/map） │ 强（RDS）         │</span></span>
<span class="line"><span>│ 负载均衡      │ 轮询/最少连接/IP哈希│ 轮询/环哈希等    │</span></span>
<span class="line"><span>│ 熔断          │ 需 Lua 或 Plus    │ 内置 outlier检测  │</span></span>
<span class="line"><span>│ 限流          │ limit_req/limit_conn│ 内置 rate limit │</span></span>
<span class="line"><span>│ 重试          │ proxy_next_upstream│ 内置 retry策略   │</span></span>
<span class="line"><span>│ 追踪          │ 需模块/Lua        │ 内置 OpenTelemetry│</span></span>
<span class="line"><span>│ 指标          │ stub_status       │ 内置 Prometheus   │</span></span>
<span class="line"><span>│ gRPC          │ 支持              │ 一等公民支持      │</span></span>
<span class="line"><span>│ HTTP/2        │ 支持              │ 一等公民支持      │</span></span>
<span class="line"><span>│ 内存占用      │ 较低（~5MB）      │ 较高（~50MB）     │</span></span>
<span class="line"><span>│ 启动速度      │ 快（&lt;1s）         │ 中等（~2s）       │</span></span>
<span class="line"><span>│ 配置语言      │ Nginx DSL         │ YAML/xDS         │</span></span>
<span class="line"><span>│ 管理接口      │ 有限              │ 丰富的 admin API  │</span></span>
<span class="line"><span>│ 社区生态      │ Web 服务生态      │ Mesh 生态         │</span></span>
<span class="line"><span>└────────────────┴───────────────────┴───────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-选型建议" tabindex="-1"><a class="header-anchor" href="#_5-2-选型建议"><span>5.2 选型建议</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>选择 Nginx 作为入口网关的场景：</span></span>
<span class="line"><span>├── 已有成熟的 Nginx 运维体系</span></span>
<span class="line"><span>├── 需要复杂的 URL 重写和路由规则</span></span>
<span class="line"><span>├── 需要丰富的第三方模块生态</span></span>
<span class="line"><span>├── 团队对 Nginx 配置更熟悉</span></span>
<span class="line"><span>└── 性能要求高、内存受限的环境</span></span>
<span class="line"><span></span></span>
<span class="line"><span>选择 Envoy 作为 Sidecar 的场景：</span></span>
<span class="line"><span>├── 需要与 Istio 深度集成</span></span>
<span class="line"><span>├── 需要 xDS 动态配置</span></span>
<span class="line"><span>├── 需要自动 mTLS 证书管理</span></span>
<span class="line"><span>├── 需要内置的熔断和限流</span></span>
<span class="line"><span>├── 需要 OpenTelemetry 原生追踪</span></span>
<span class="line"><span>└── 需要丰富的可观测性</span></span>
<span class="line"><span></span></span>
<span class="line"><span>混合方案（推荐）：</span></span>
<span class="line"><span>├── Nginx 作为入口网关（Ingress Controller）</span></span>
<span class="line"><span>├── Envoy 作为 Sidecar 代理</span></span>
<span class="line"><span>├── Nginx 负责外部流量接入、TLS 终止、路由</span></span>
<span class="line"><span>├── Envoy 负责服务间通信、mTLS、流量管理</span></span>
<span class="line"><span>└── 两者通过标准 HTTP 头部协作</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_6-分布式追踪集成" tabindex="-1"><a class="header-anchor" href="#_6-分布式追踪集成"><span>6. 分布式追踪集成</span></a></h2><h3 id="_6-1-追踪系统架构" tabindex="-1"><a class="header-anchor" href="#_6-1-追踪系统架构"><span>6.1 追踪系统架构</span></a></h3>`,15),i(d,{code:`eJxLy8kvT85ILCpR8AniUgAC55zM1LyS6KfrFj3r2P589fpYBV1dOwW/9My8imglMGWTVKRv55mXXpRaXKwUC9YEFgcrrCkpSkxOjc9MeT5l/rOOCTUKrnll+ZWG0UpgGqw1ODMlNTmxSMERqhmiAlX3kz0LXjZMguo2wqbbCVm3ER7dxth0OwN1o7u8uCAx78mOrmddS2sUnPNzclKTS/KLov1DUnMQXEwXY9WF4TICqozxqYJEC4wLVumUmJydmpcSreSVmJqeWqSgrxCSmluQD/bii/17X+xY9XRCHzDyoGEEVQ7WGuoZDVHxbP7SF+sXAfmxXAAYBsEQ`}),o[5]||=n(`<h3 id="_6-2-nginx-生成追踪-id" tabindex="-1"><a class="header-anchor" href="#_6-2-nginx-生成追踪-id"><span>6.2 Nginx 生成追踪 ID</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx 作为入口网关生成分布式追踪 ID</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 OpenTelemetry 模块或 Lua 脚本</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 方式一：OpenTelemetry 模块 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 需要编译 nginx-opentelemetry 模块</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">load_module </span><span style="color:#ABB2BF;">modules/ngx_http_opentelemetry_module.so;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # OpenTelemetry 配置</span></span>
<span class="line"><span style="color:#C678DD;">    opentelemetry</span><span style="color:#D19A66;"> on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    opentelemetry_trust_incoming_spans</span><span style="color:#D19A66;"> on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    opentelemetry_operation_name</span><span style="color:#98C379;"> &quot;$</span><span style="color:#E06C75;">uri</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 注意：endpoint、service_name 等配置通过环境变量设置，而非 nginx 指令</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 在 Docker 或 systemd 中配置环境变量：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector.observability:4317</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # OTEL_SERVICE_NAME=nginx-ingress</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # OTEL_RESOURCE_ATTRIBUTES=service.version=1.0.0,deployment.environment=production</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">            opentelemetry_operation_name</span><span style="color:#98C379;"> &quot;HTTP $</span><span style="color:#E06C75;">request_method</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">uri</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 方式二：Lua 脚本生成 Trace ID =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 OpenResty</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 生成 128 位 Trace ID</span></span>
<span class="line"><span style="color:#C678DD;">    init_by_lua_block</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#56B6C2;">        math.randomseed</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">now</span><span style="color:#ABB2BF;">() * </span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        set_by_lua_block</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">trace_id</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#ABB2BF;"> rand = math.random</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#ABB2BF;"> string.format(</span><span style="color:#98C379;">&quot;%016x%016x&quot;</span><span style="color:#ABB2BF;">, rand(2^32)*2^32+rand(2^32), rand(2^32)*2^32+rand(2^32))</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">        set_by_lua_block $</span><span style="color:#E06C75;">span_id</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">            return string.format(</span><span style="color:#98C379;">&quot;%016x&quot;</span><span style="color:#ABB2BF;">, math.random(2^32)*2^32+math.random(2^32))</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">        location / {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 传递 B3 追踪头</span></span>
<span class="line"><span style="color:#ABB2BF;">            proxy_set_header X-B3-TraceId $</span><span style="color:#E06C75;">trace_id</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-B3-SpanId $</span><span style="color:#E06C75;">span_id</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-B3-Sampled </span><span style="color:#98C379;">&quot;1&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 传递 W3C Trace Context</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">Traceparent </span><span style="color:#98C379;">&quot;00-$</span><span style="color:#E06C75;">trace_id</span><span style="color:#98C379;">-$</span><span style="color:#E06C75;">span_id</span><span style="color:#98C379;">-01&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-3-追踪头传递与关联" tabindex="-1"><a class="header-anchor" href="#_6-3-追踪头传递与关联"><span>6.3 追踪头传递与关联</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 确保追踪头在 Nginx → Envoy → 服务 之间正确传递</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # ===== B3 追踪头（Zipkin 兼容）=====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 如果客户端已发送，透传；否则使用 Nginx 生成的</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-B3-TraceId $</span><span style="color:#E06C75;">http_x_b3_traceid</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-B3-SpanId $</span><span style="color:#E06C75;">http_x_b3_spanid</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-B3-ParentSpanId $</span><span style="color:#E06C75;">http_x_b3_parentspanid</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-B3-Sampled $</span><span style="color:#E06C75;">http_x_b3_sampled</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-B3-Flags $</span><span style="color:#E06C75;">http_x_b3_flags</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # ===== W3C Trace Context（Istio 1.12+ 默认）=====</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Traceparent $</span><span style="color:#E06C75;">http_traceparent</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Tracestate $</span><span style="color:#E06C75;">http_tracestate</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # ===== 通用追踪头 =====</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Request-ID $</span><span style="color:#E06C75;">http_x_request_id</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 基础头部</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Proto $</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_7-可观测性集成" tabindex="-1"><a class="header-anchor" href="#_7-可观测性集成"><span>7. 可观测性集成</span></a></h2><h3 id="_7-1-指标暴露与采集" tabindex="-1"><a class="header-anchor" href="#_7-1-指标暴露与采集"><span>7.1 指标暴露与采集</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx 指标暴露（与 Istio Prometheus 协同）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 基础 stub_status</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">8080</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">localhost;</span></span>
<span class="line"><span style="color:#C678DD;">    allow </span><span style="color:#ABB2BF;">10.0.0.0/8;</span></span>
<span class="line"><span style="color:#C678DD;">    deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /stub_status {</span></span>
<span class="line"><span style="color:#C678DD;">        stub_status</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 增强指标（使用 nginx-prometheus-exporter）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># nginx-prometheus-exporter 将 stub_status 转为 Prometheus 格式</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 自定义指标（通过 Lua）</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">8080</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /metrics {</span></span>
<span class="line"><span style="color:#C678DD;">        default_type </span><span style="color:#ABB2BF;">text/plain;</span></span>
<span class="line"><span style="color:#C678DD;">        content_by_lua_block</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> shm</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.shared.metrics</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- 请求计数</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> requests_total</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">shm</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">get</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;requests_total&quot;</span><span style="color:#ABB2BF;">) </span><span style="color:#56B6C2;">or</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#E06C75;">            ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#56B6C2;">string.format</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;# HELP nginx_requests_total Total requests&quot;</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#E06C75;">            ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#56B6C2;">string.format</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;# TYPE nginx_requests_total counter&quot;</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#E06C75;">            ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#56B6C2;">string.format</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;nginx_requests_total %d&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">requests_total</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- 按状态码分类</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> status_2xx</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">shm</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">get</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;status_2xx&quot;</span><span style="color:#ABB2BF;">) </span><span style="color:#56B6C2;">or</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> status_4xx</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">shm</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">get</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;status_4xx&quot;</span><span style="color:#ABB2BF;">) </span><span style="color:#56B6C2;">or</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> status_5xx</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">shm</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">get</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;status_5xx&quot;</span><span style="color:#ABB2BF;">) </span><span style="color:#56B6C2;">or</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">            ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#56B6C2;">string.format</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;nginx_status_2xx %d&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">status_2xx</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#E06C75;">            ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#56B6C2;">string.format</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;nginx_status_4xx %d&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">status_4xx</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#E06C75;">            ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#56B6C2;">string.format</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;nginx_status_5xx %d&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">status_5xx</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- 延迟直方图</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> latency_sum</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">shm</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">get</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;latency_sum&quot;</span><span style="color:#ABB2BF;">) </span><span style="color:#56B6C2;">or</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> latency_count</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">shm</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">get</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;latency_count&quot;</span><span style="color:#ABB2BF;">) </span><span style="color:#56B6C2;">or</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#E06C75;">            ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#56B6C2;">string.format</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;# HELP nginx_request_duration_seconds Request duration&quot;</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#E06C75;">            ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#56B6C2;">string.format</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;# TYPE nginx_request_duration_seconds summary&quot;</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#E06C75;">            ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#56B6C2;">string.format</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;nginx_request_duration_seconds_sum %f&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">latency_sum</span><span style="color:#ABB2BF;"> / </span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#E06C75;">            ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#56B6C2;">string.format</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;nginx_request_duration_seconds_count %d&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">latency_count</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在请求处理中记录指标</span></span>
<span class="line"><span style="color:#C678DD;">log_by_lua_block</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> shm</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.shared.metrics</span></span>
<span class="line"><span style="color:#E5C07B;">    shm</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">incr</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;requests_total&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> status</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.status</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#E06C75;"> status</span><span style="color:#ABB2BF;"> &gt;= </span><span style="color:#D19A66;">200</span><span style="color:#56B6C2;"> and</span><span style="color:#E06C75;"> status</span><span style="color:#ABB2BF;"> &lt; </span><span style="color:#D19A66;">300</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#E5C07B;">        shm</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">incr</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;status_2xx&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">    elseif</span><span style="color:#E06C75;"> status</span><span style="color:#ABB2BF;"> &gt;= </span><span style="color:#D19A66;">400</span><span style="color:#56B6C2;"> and</span><span style="color:#E06C75;"> status</span><span style="color:#ABB2BF;"> &lt; </span><span style="color:#D19A66;">500</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#E5C07B;">        shm</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">incr</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;status_4xx&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">    elseif</span><span style="color:#E06C75;"> status</span><span style="color:#ABB2BF;"> &gt;= </span><span style="color:#D19A66;">500</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#E5C07B;">        shm</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">incr</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;status_5xx&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> latency</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">now</span><span style="color:#ABB2BF;">() * </span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;"> - </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.req.</span><span style="color:#61AFEF;">start_time</span><span style="color:#ABB2BF;">() * </span><span style="color:#D19A66;">1000</span></span>
<span class="line"><span style="color:#E5C07B;">    shm</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">incr</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;latency_sum&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">latency</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E5C07B;">    shm</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">incr</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;latency_count&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-prometheus-采集配置" tabindex="-1"><a class="header-anchor" href="#_7-2-prometheus-采集配置"><span>7.2 Prometheus 采集配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># Prometheus 采集 Nginx + Istio 指标</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">scrape_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # Nginx 指标</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">job_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx-ingress</span></span>
<span class="line"><span style="color:#E06C75;">    kubernetes_sd_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">role</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">pod</span></span>
<span class="line"><span style="color:#E06C75;">        namespaces</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          names</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#98C379;">ingress-nginx</span></span>
<span class="line"><span style="color:#E06C75;">    relabel_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">source_labels</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">__meta_kubernetes_pod_name</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">        regex</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx-ingress-.*</span></span>
<span class="line"><span style="color:#E06C75;">        action</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">keep</span></span>
<span class="line"><span style="color:#E06C75;">    metrics_path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/metrics</span></span>
<span class="line"><span style="color:#E06C75;">    scrape_interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">15s</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # Istio Sidecar 指标（自动发现）</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">job_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">istio-sidecar</span></span>
<span class="line"><span style="color:#E06C75;">    kubernetes_sd_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">role</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">pod</span></span>
<span class="line"><span style="color:#E06C75;">    relabel_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">source_labels</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">__meta_kubernetes_pod_container_name</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">        regex</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">istio-proxy</span></span>
<span class="line"><span style="color:#E06C75;">        action</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">keep</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">source_labels</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">__meta_kubernetes_pod_annotationpresent_prometheus_io_scrape</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">        action</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">keep</span></span>
<span class="line"><span style="color:#E06C75;">    metrics_path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/stats/prometheus</span></span>
<span class="line"><span style="color:#E06C75;">    scrape_interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">15s</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-grafana-仪表盘配置" tabindex="-1"><a class="header-anchor" href="#_7-3-grafana-仪表盘配置"><span>7.3 Grafana 仪表盘配置</span></a></h3><div class="language-json line-numbers-mode" data-highlighter="shiki" data-ext="json" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-json"><span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E06C75;">  &quot;dashboard&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#E06C75;">    &quot;title&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;Nginx + Istio Mesh Dashboard&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">    &quot;panels&quot;</span><span style="color:#ABB2BF;">: [</span></span>
<span class="line"><span style="color:#ABB2BF;">      {</span></span>
<span class="line"><span style="color:#E06C75;">        &quot;title&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;Nginx Request Rate&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">        &quot;targets&quot;</span><span style="color:#ABB2BF;">: [</span></span>
<span class="line"><span style="color:#ABB2BF;">          {</span></span>
<span class="line"><span style="color:#E06C75;">            &quot;expr&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;sum(rate(nginx_requests_total[5m])) by (ingress)&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">          }</span></span>
<span class="line"><span style="color:#ABB2BF;">        ]</span></span>
<span class="line"><span style="color:#ABB2BF;">      },</span></span>
<span class="line"><span style="color:#ABB2BF;">      {</span></span>
<span class="line"><span style="color:#E06C75;">        &quot;title&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;Istio Request Rate&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">        &quot;targets&quot;</span><span style="color:#ABB2BF;">: [</span></span>
<span class="line"><span style="color:#ABB2BF;">          {</span></span>
<span class="line"><span style="color:#E06C75;">            &quot;expr&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;sum(rate(istio_requests_total[5m])) by (destination_service)&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">          }</span></span>
<span class="line"><span style="color:#ABB2BF;">        ]</span></span>
<span class="line"><span style="color:#ABB2BF;">      },</span></span>
<span class="line"><span style="color:#ABB2BF;">      {</span></span>
<span class="line"><span style="color:#E06C75;">        &quot;title&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;Nginx P99 Latency&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">        &quot;targets&quot;</span><span style="color:#ABB2BF;">: [</span></span>
<span class="line"><span style="color:#ABB2BF;">          {</span></span>
<span class="line"><span style="color:#E06C75;">            &quot;expr&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;histogram_quantile(0.99, sum(rate(nginx_request_duration_seconds_bucket[5m])) by (le, ingress))&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">          }</span></span>
<span class="line"><span style="color:#ABB2BF;">        ]</span></span>
<span class="line"><span style="color:#ABB2BF;">      },</span></span>
<span class="line"><span style="color:#ABB2BF;">      {</span></span>
<span class="line"><span style="color:#E06C75;">        &quot;title&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;Istio P99 Latency&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">        &quot;targets&quot;</span><span style="color:#ABB2BF;">: [</span></span>
<span class="line"><span style="color:#ABB2BF;">          {</span></span>
<span class="line"><span style="color:#E06C75;">            &quot;expr&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;histogram_quantile(0.99, sum(rate(istio_request_duration_milliseconds_bucket[5m])) by (le, destination_service))&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">          }</span></span>
<span class="line"><span style="color:#ABB2BF;">        ]</span></span>
<span class="line"><span style="color:#ABB2BF;">      },</span></span>
<span class="line"><span style="color:#ABB2BF;">      {</span></span>
<span class="line"><span style="color:#E06C75;">        &quot;title&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;Error Rate (Nginx + Istio)&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">        &quot;targets&quot;</span><span style="color:#ABB2BF;">: [</span></span>
<span class="line"><span style="color:#ABB2BF;">          {</span></span>
<span class="line"><span style="color:#E06C75;">            &quot;expr&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;sum(rate(nginx_status_5xx[5m])) / sum(rate(nginx_requests_total[5m]))&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">          },</span></span>
<span class="line"><span style="color:#ABB2BF;">          {</span></span>
<span class="line"><span style="color:#E06C75;">            &quot;expr&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;sum(rate(istio_requests_total{response_code=~</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">5..</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">}[5m])) / sum(rate(istio_requests_total[5m]))&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">          }</span></span>
<span class="line"><span style="color:#ABB2BF;">        ]</span></span>
<span class="line"><span style="color:#ABB2BF;">      }</span></span>
<span class="line"><span style="color:#ABB2BF;">    ]</span></span>
<span class="line"><span style="color:#ABB2BF;">  }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_8-mtls-与安全集成" tabindex="-1"><a class="header-anchor" href="#_8-mtls-与安全集成"><span>8. mTLS 与安全集成</span></a></h2><h3 id="_8-1-nginx-与-istio-mtls" tabindex="-1"><a class="header-anchor" href="#_8-1-nginx-与-istio-mtls"><span>8.1 Nginx 与 Istio mTLS</span></a></h3>`,15),i(d,{code:`eJxLy8kvT85ILCpR8AniUgAC55zM1LyS6KfrFj3r2P589fpYBV1dO4WaEJ/gGgW/9My8imglMKXgmZdelFpcbJNUpG8HlFV4vrvj2dpFSrFcYGOKS5PSixILMhR8U4szjKKVPItLMvPBnPd7OnKB6t/v6QSqBSkFAYiRYJs8QkICahRc88ryK+M986KVwCyFp61Ln6+eCbYsODMlNTmxCEk3TDHEAJDpMAP8S0vgJrTvImQCUDXYCMeCguinu6Y8n7Li2Zzep10LIepS81LQ/OacWlTim54LtOLF+sYnO5c9X7fw+YQ2JGOdM0sSU1JzYN6HcsFueNG+6mnXiudr9z3tn6j/Yu+6F3vXYGpU0NUDOgfmPXyyQKejObKkMicVGq5pmTk5VsrJFqlmyZZIkuCogUqmGqaZpqVyAQDVxrtG`}),o[6]||=n(`<h3 id="_8-2-nginx-ingress-mtls-配置" tabindex="-1"><a class="header-anchor" href="#_8-2-nginx-ingress-mtls-配置"><span>8.2 Nginx Ingress mTLS 配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx Ingress 处理外部 TLS + 内部连接 Istio mTLS</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 外部 TLS 终止</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 外部证书</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">    /etc/nginx/ssl/api.example.com.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/api.example.com.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # TLS 安全配置</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_protocols </span><span style="color:#ABB2BF;">TLSv1.2 TLSv1.3;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_ciphers </span><span style="color:#ABB2BF;">ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_prefer_server_ciphers </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_session_cache </span><span style="color:#ABB2BF;">shared:SSL:10m;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_session_timeout </span><span style="color:#D19A66;">1d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_session_tickets </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # HSTS</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Strict-Transport-Security </span><span style="color:#98C379;">&quot;max-age=63072000&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 内部连接到 Istio Sidecar</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # Istio 默认使用 PERMISSIVE 模式（同时支持 HTTP 和 mTLS）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # Nginx → Envoy Sidecar 使用 HTTP</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api.default.svc.cluster.local:80;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 如果 Istio 使用 STRICT mTLS 模式</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 需要配置 Nginx 客户端证书</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # proxy_pass https://api.default.svc.cluster.local:443;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # proxy_ssl_certificate /etc/nginx/ssl/client.crt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # proxy_ssl_certificate_key /etc/nginx/ssl/client.key;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # proxy_ssl_trusted_certificate /etc/nginx/ssl/ca.crt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # proxy_ssl_verify on;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Proto https;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-3-istio-mtls-模式与-nginx-适配" tabindex="-1"><a class="header-anchor" href="#_8-3-istio-mtls-模式与-nginx-适配"><span>8.3 Istio mTLS 模式与 Nginx 适配</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># Istio mTLS 策略配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方式一：PERMISSIVE 模式（推荐 Nginx Ingress 使用）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 同时接受 HTTP 和 mTLS 连接</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">security.istio.io/v1beta1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">PeerAuthentication</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  mtls</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    mode</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">PERMISSIVE</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方式二：STRICT 模式（需要 Nginx 配置客户端证书）</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">security.istio.io/v1beta1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">PeerAuthentication</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api-strict</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  selector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    matchLabels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api</span></span>
<span class="line"><span style="color:#E06C75;">  mtls</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    mode</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">STRICT</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方式三：仅对特定端口使用 STRICT</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">security.istio.io/v1beta1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">PeerAuthentication</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api-port-mtls</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  selector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    matchLabels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api</span></span>
<span class="line"><span style="color:#E06C75;">  portLevelMtls</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#D19A66;">    8080</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      mode</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">PERMISSIVE</span><span style="color:#7F848E;font-style:italic;">    # Nginx Ingress 使用</span></span>
<span class="line"><span style="color:#D19A66;">    8443</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      mode</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">STRICT</span><span style="color:#7F848E;font-style:italic;">        # 服务间使用</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_9-流量管理实战" tabindex="-1"><a class="header-anchor" href="#_9-流量管理实战"><span>9. 流量管理实战</span></a></h2><h3 id="_9-1-nginx-istio-灰度发布完整方案" tabindex="-1"><a class="header-anchor" href="#_9-1-nginx-istio-灰度发布完整方案"><span>9.1 Nginx + Istio 灰度发布完整方案</span></a></h3>`,7),i(d,{code:`eJxLy8kvT85ILCpRCHHiUgCC4tKk9KLEggwFn8TK1CLDaCW/9My8CgXPvPSi1OJihacbm5RiwQpBACxnhKbGJqlI3+5544anu5Y97Wh7trURqiE1L4ULixVA7Z7FJZn5Cr6pxRlo5ocFRyuFZRaVlCbmBKcWlWUmp4INh6hsawWa/bK9//m6hc8ntCHpcgmKVnJJBZqZlwg0Ny+oNAei7Xlnx7M5a56um/VkZyd+NxlHKz2b0/u0ayGac4DBUWaoEJCfAjFvxWagYRBTkVUBfVRmBFf1sn3ikx1zX85uQFEItxgShAq6unYKNRG6zol5iUWVVgolRaWpNUDvYyh5Nn0BNGiXbIErCAtG1f+0Z+fL1l6gtBGK9MvdM16sW/Ji+/rnUzYCJQ1RJJ/NbX7Z3guJMLBOSLCUVOakQpOCQlpmTo6VcrJFqlmyJbqsEVQ21TDNNC0VXdYYKpuWlmaZbMIFAK1q5DA=`}),o[7]||=n(`<div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx Ingress 灰度配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 灰度分流</span></span>
<span class="line"><span style="color:#C678DD;">split_clients </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">canary_header</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    10%    </span><span style="color:#98C379;">&quot;true&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    *      &quot;false&quot;;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Cookie 覆盖</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#98C379;"> &quot;$</span><span style="color:#E06C75;">cookie_canary</span><span style="color:#98C379;">|$</span><span style="color:#E06C75;">canary_header</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">final_canary</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    default</span><span style="color:#98C379;">     &quot;false&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;true|*&quot;   &quot;true&quot;;</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;|true&quot;    &quot;true&quot;;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 传递灰度标记给 Istio</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Canary $</span><span style="color:#E06C75;">final_canary</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 传递追踪信息</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-B3-TraceId $</span><span style="color:#E06C75;">http_x_b3_traceid</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-B3-SpanId $</span><span style="color:#E06C75;">http_x_b3_spanid</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api.default.svc.cluster.local;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># Istio VirtualService 灰度路由</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networking.istio.io/v1beta1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">VirtualService</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api-canary</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">api.default.svc.cluster.local</span></span>
<span class="line"><span style="color:#E06C75;">  http</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Nginx 传递的灰度标记匹配</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">match</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">headers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            x-canary</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              exact</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;true&quot;</span></span>
<span class="line"><span style="color:#E06C75;">      route</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">destination</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api.default.svc.cluster.local</span></span>
<span class="line"><span style="color:#E06C75;">            subset</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v2</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        attempts</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">2</span></span>
<span class="line"><span style="color:#E06C75;">        perTryTimeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10s</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 默认路由（稳定版为主，少量灰度）</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">route</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">destination</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api.default.svc.cluster.local</span></span>
<span class="line"><span style="color:#E06C75;">            subset</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">          weight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">100</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10s</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-2-故障注入测试" tabindex="-1"><a class="header-anchor" href="#_9-2-故障注入测试"><span>9.2 故障注入测试</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx 层面故障模拟（配合 Istio 故障注入）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 延迟注入</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api/slow/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 模拟 3 秒延迟</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 用于测试下游服务的超时和重试逻辑</span></span>
<span class="line"><span style="color:#C678DD;">    echo_sleep</span><span style="color:#D19A66;"> 3s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://api.default.svc.cluster.local;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 错误注入</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api/error/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 模拟 500 错误</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 500</span><span style="color:#98C379;"> &#39;{&quot;error&quot;:&quot;internal server error&quot;}&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Istio 层面故障注入（更精细）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># Istio 故障注入配置</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networking.istio.io/v1beta1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">VirtualService</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api-fault-injection</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">api.default.svc.cluster.local</span></span>
<span class="line"><span style="color:#E06C75;">  http</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 10% 的请求返回 500</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">fault</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        abort</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          percentage</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            value</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#E06C75;">          httpStatus</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">500</span></span>
<span class="line"><span style="color:#E06C75;">      route</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">destination</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api.default.svc.cluster.local</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 20% 的请求延迟 5 秒</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">fault</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        delay</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          percentage</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            value</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">20</span></span>
<span class="line"><span style="color:#E06C75;">          fixedDelay</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5s</span></span>
<span class="line"><span style="color:#E06C75;">      route</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">destination</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api.default.svc.cluster.local</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-3-流量镜像" tabindex="-1"><a class="header-anchor" href="#_9-3-流量镜像"><span>9.3 流量镜像</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx 流量镜像（Shadow Traffic）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 将生产流量复制到测试环境</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> production {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.1.10:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> shadow {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.2.10:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 主请求发往生产</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://production;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 镜像流量发往影子环境</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 使用 post_action 实现（不阻塞主请求）</span></span>
<span class="line"><span style="color:#C678DD;">        post_action</span><span style="color:#ABB2BF;"> /shadow;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 影子请求处理</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /shadow {</span></span>
<span class="line"><span style="color:#C678DD;">        internal</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://shadow$</span><span style="color:#E06C75;">request_uri</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Shadow-Traffic </span><span style="color:#98C379;">&quot;true&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 忽略影子请求的响应</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_ignore_errors</span><span style="color:#D19A66;"> on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># Istio 流量镜像（更优雅的方式）</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networking.istio.io/v1beta1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">VirtualService</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api-mirror</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">api.default.svc.cluster.local</span></span>
<span class="line"><span style="color:#E06C75;">  http</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">route</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">destination</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api.default.svc.cluster.local</span></span>
<span class="line"><span style="color:#E06C75;">            subset</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">          weight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">100</span></span>
<span class="line"><span style="color:#E06C75;">      mirror</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api-shadow.default.svc.cluster.local</span></span>
<span class="line"><span style="color:#E06C75;">      mirrorPercentage</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        value</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">100</span><span style="color:#7F848E;font-style:italic;">    # 镜像 100% 流量</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_10-生产环境最佳实践" tabindex="-1"><a class="header-anchor" href="#_10-生产环境最佳实践"><span>10. 生产环境最佳实践</span></a></h2><h3 id="_10-1-nginx-istio-部署架构" tabindex="-1"><a class="header-anchor" href="#_10-1-nginx-istio-部署架构"><span>10.1 Nginx + Istio 部署架构</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>生产环境推荐架构：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                   ┌─────────────┐</span></span>
<span class="line"><span>                   │   CDN/WAF   │  ← DDoS 清洗 + 静态缓存</span></span>
<span class="line"><span>                   └──────┬──────┘</span></span>
<span class="line"><span>                          │</span></span>
<span class="line"><span>                   ┌──────┴──────┐</span></span>
<span class="line"><span>                   │   Nginx     │  ← Ingress Controller</span></span>
<span class="line"><span>                   │   Ingress   │  · TLS 终止</span></span>
<span class="line"><span>                   │   (2+ 副本) │  · 路由分发</span></span>
<span class="line"><span>                   └──────┬──────┘  · 限流</span></span>
<span class="line"><span>                          │        · 安全头</span></span>
<span class="line"><span>                   ┌──────┴──────┐</span></span>
<span class="line"><span>                   │   Istio     │  ← Service Mesh</span></span>
<span class="line"><span>                   │   Mesh      │  · mTLS</span></span>
<span class="line"><span>                   │             │  · 流量管理</span></span>
<span class="line"><span>                   └──────┬──────┘  · 熔断/重试</span></span>
<span class="line"><span>                          │        · 追踪</span></span>
<span class="line"><span>              ┌───────────┼───────────┐</span></span>
<span class="line"><span>              │           │           │</span></span>
<span class="line"><span>         ┌────┴────┐ ┌────┴────┐ ┌────┴────┐</span></span>
<span class="line"><span>         │ 前端服务 │ │ API 服务 │ │ 后台服务 │</span></span>
<span class="line"><span>         │+ Envoy  │ │+ Envoy  │ │+ Envoy  │</span></span>
<span class="line"><span>         └─────────┘ └─────────┘ └─────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>配置建议：</span></span>
<span class="line"><span>1. Nginx Ingress 不注入 Envoy Sidecar</span></span>
<span class="line"><span>2. Nginx Ingress 使用 Deployment + HPA</span></span>
<span class="line"><span>3. Istio 控制面独立部署（3 副本）</span></span>
<span class="line"><span>4. 监控使用 Prometheus + Grafana</span></span>
<span class="line"><span>5. 追踪使用 OpenTelemetry + Jaeger/Tempo</span></span>
<span class="line"><span>6. 日志使用 Filebeat/Fluentd → ELK</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-2-nginx-ingress-生产配置" tabindex="-1"><a class="header-anchor" href="#_10-2-nginx-ingress-生产配置"><span>10.2 Nginx Ingress 生产配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 生产级 Nginx Ingress 配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"><span style="color:#C678DD;">worker_rlimit_nofile </span><span style="color:#D19A66;">65535</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">8192</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    use </span><span style="color:#D19A66;">epoll</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    multi_accept </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 基础设置</span></span>
<span class="line"><span style="color:#C678DD;">    sendfile </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nopush </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nodelay </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_timeout </span><span style="color:#D19A66;">65s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_requests </span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 隐藏版本号</span></span>
<span class="line"><span style="color:#C678DD;">    server_tokens </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 系统级优化</span></span>
<span class="line"><span style="color:#C678DD;">    reset_timedout_connection </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 日志格式（包含追踪信息）</span></span>
<span class="line"><span style="color:#C678DD;">    log_format </span><span style="color:#ABB2BF;">production </span><span style="color:#98C379;">&#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> - [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &#39;</span></span>
<span class="line"><span style="color:#98C379;">                          &#39;&quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot; $</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">body_bytes_sent</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                          &#39;&quot;$</span><span style="color:#E06C75;">http_referer</span><span style="color:#98C379;">&quot; &quot;$</span><span style="color:#E06C75;">http_user_agent</span><span style="color:#98C379;">&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">                          &#39;rt=$</span><span style="color:#E06C75;">request_time</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                          &#39;upstream=$</span><span style="color:#E06C75;">upstream_addr</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                          &#39;upstream_status=$</span><span style="color:#E06C75;">upstream_status</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                          &#39;upstream_rt=$</span><span style="color:#E06C75;">upstream_response_time</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                          &#39;trace_id=$</span><span style="color:#E06C75;">http_x_b3_traceid</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                          &#39;canary=$</span><span style="color:#E06C75;">http_x_canary</span><span style="color:#98C379;">&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;">/var/log/nginx/access.log production buffer=32k flush=5s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Gzip 压缩</span></span>
<span class="line"><span style="color:#C678DD;">    gzip </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_min_length </span><span style="color:#D19A66;">1024</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_types </span><span style="color:#ABB2BF;">text/plain text/css application/json application/javascript text/xml;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_vary </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 限流配置</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=global:100m rate=100r/s;</span></span>
<span class="line"><span style="color:#C678DD;">    limit_conn_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=per_ip:100m;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 代理配置</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 上游长连接池</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> api_backend {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> api.default.svc.cluster.local:80;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        keepalive </span><span style="color:#D19A66;">64</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        keepalive_requests </span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        keepalive_timeout </span><span style="color:#D19A66;">60s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">_;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 全局限流</span></span>
<span class="line"><span style="color:#C678DD;">        limit_req </span><span style="color:#ABB2BF;">zone=global burst=200 nodelay;</span></span>
<span class="line"><span style="color:#C678DD;">        limit_conn </span><span style="color:#ABB2BF;">per_ip </span><span style="color:#D19A66;">200</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 安全头</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">X-Frame-Options </span><span style="color:#98C379;">&quot;SAMEORIGIN&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">X-Content-Type-Options </span><span style="color:#98C379;">&quot;nosniff&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">X-XSS-Protection </span><span style="color:#98C379;">&quot;1; mode=block&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Referrer-Policy </span><span style="color:#98C379;">&quot;strict-origin-when-cross-origin&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 超时设置</span></span>
<span class="line"><span style="color:#C678DD;">        client_header_timeout </span><span style="color:#D19A66;">10s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        client_body_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        send_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 请求大小限制</span></span>
<span class="line"><span style="color:#C678DD;">        client_max_body_size </span><span style="color:#D19A66;">10m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        client_header_buffer_size </span><span style="color:#D19A66;">1k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        large_client_header_buffers </span><span style="color:#D19A66;">4</span><span style="color:#D19A66;"> 8k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Proto $</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 追踪头传递</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-B3-TraceId $</span><span style="color:#E06C75;">http_x_b3_traceid</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-B3-SpanId $</span><span style="color:#E06C75;">http_x_b3_spanid</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-B3-ParentSpanId $</span><span style="color:#E06C75;">http_x_b3_parentspanid</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-B3-Sampled $</span><span style="color:#E06C75;">http_x_b3_sampled</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 代理超时</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_connect_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_read_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_send_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 失败重试</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_next_upstream </span><span style="color:#D19A66;">error</span><span style="color:#ABB2BF;"> timeout http_503;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_next_upstream_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_next_upstream_tries </span><span style="color:#D19A66;">2</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 健康检查</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/health </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">            access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 200</span><span style="color:#98C379;"> &quot;OK&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 指标暴露</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/stub_status </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">            stub_status</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            allow </span><span style="color:#ABB2BF;">10.0.0.0/8;</span></span>
<span class="line"><span style="color:#C678DD;">            deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-3-常见问题排查" tabindex="-1"><a class="header-anchor" href="#_10-3-常见问题排查"><span>10.3 常见问题排查</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Nginx + Istio 常见问题排查：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Q1: Nginx Ingress 到 Pod 的请求 503</span></span>
<span class="line"><span>排查：</span></span>
<span class="line"><span>  1. 检查 Nginx 是否注入了 Envoy Sidecar（应该不注入）</span></span>
<span class="line"><span>     kubectl get pod &lt;nginx-pod&gt; -o jsonpath=&#39;{.spec.containers[*].name}&#39;</span></span>
<span class="line"><span>  2. 检查 Istio mTLS 模式</span></span>
<span class="line"><span>     kubectl get peerauthentication -o yaml</span></span>
<span class="line"><span>  3. 如果 STRICT 模式，Nginx 需要 mTLS 客户端证书</span></span>
<span class="line"><span>  4. 检查 DestinationRule 是否限制了流量</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Q2: 追踪链断裂</span></span>
<span class="line"><span>排查：</span></span>
<span class="line"><span>  1. 检查 Nginx 是否传递 X-B3-* 头部</span></span>
<span class="line"><span>  2. 检查 proxy_set_header 配置</span></span>
<span class="line"><span>  3. 检查 Istio tracing 采样率</span></span>
<span class="line"><span>  4. 使用 curl 手动发送追踪头测试</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Q3: Nginx Ingress 性能下降</span></span>
<span class="line"><span>排查：</span></span>
<span class="line"><span>  1. 检查是否意外注入了 Envoy Sidecar</span></span>
<span class="line"><span>  2. 检查 keepalive 配置是否匹配</span></span>
<span class="line"><span>  3. 检查 upstream 长连接池</span></span>
<span class="line"><span>  4. 检查 Istio 的连接池限制</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Q4: 灰度流量不按预期路由</span></span>
<span class="line"><span>排查：</span></span>
<span class="line"><span>  1. 检查 Nginx 灰度头是否正确传递</span></span>
<span class="line"><span>  2. 检查 Istio VirtualService 的匹配规则</span></span>
<span class="line"><span>  3. 检查是否有多条 VirtualService 冲突</span></span>
<span class="line"><span>  4. 使用 istioctl analyze 检查配置</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Q5: mTLS 握手失败</span></span>
<span class="line"><span>排查：</span></span>
<span class="line"><span>  1. 检查证书是否过期</span></span>
<span class="line"><span>  2. 检查 CA 证书是否匹配</span></span>
<span class="line"><span>  3. 检查 SNI 是否正确</span></span>
<span class="line"><span>  4. 使用 openssl s_client 测试</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="参考资源" tabindex="-1"><a class="header-anchor" href="#参考资源"><span>参考资源</span></a></h2><ul><li><a href="https://docs.nginx.com/nginx-service-mesh/" target="_blank" rel="noopener noreferrer">Nginx Service Mesh 官方文档</a></li><li><a href="https://istio.io/latest/docs/" target="_blank" rel="noopener noreferrer">Istio 官方文档</a></li><li><a href="https://www.envoyproxy.io/docs/envoy/latest/" target="_blank" rel="noopener noreferrer">Envoy 官方文档</a></li><li><a href="https://smi-spec.io/" target="_blank" rel="noopener noreferrer">SMI 规范</a></li><li><a href="https://kubernetes.github.io/ingress-nginx/" target="_blank" rel="noopener noreferrer">Nginx Ingress Controller 文档</a></li><li><a href="https://github.com/open-telemetry/opentelemetry-cpp-contrib/tree/main/instrumentation/nginx" target="_blank" rel="noopener noreferrer">OpenTelemetry Nginx 模块</a></li><li><a href="https://docs.nginx.com/nginx-ingress-controller/configuration/integration-with-istio/" target="_blank" rel="noopener noreferrer">Nginx 与 Istio 集成指南</a></li><li><a href="https://spiffe.io/spire/" target="_blank" rel="noopener noreferrer">SPIRE 身份框架</a></li></ul>`,19)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};