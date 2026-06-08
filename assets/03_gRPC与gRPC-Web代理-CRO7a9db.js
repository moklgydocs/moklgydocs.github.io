import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as a}from"./app-DBI3PDr1.js";var o=JSON.parse(`{"path":"/Linux/07_Nginx/08_%E9%AB%98%E7%BA%A7%E7%89%B9%E6%80%A7%E4%B8%8E%E6%89%A9%E5%B1%95/03_gRPC%E4%B8%8EgRPC-Web%E4%BB%A3%E7%90%86.html","title":"gRPC 与 gRPC-Web 代理","lang":"zh-CN","frontmatter":{"title":"gRPC 与 gRPC-Web 代理","icon":"fa6-solid:code-branch","order":3,"category":["Linux","Nginx"],"tag":["Nginx","gRPC","gRPC-Web","HTTP/2","Protobuf","负载均衡","微服务"]},"git":{"createdTime":1780631738000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":3}]},"readingTime":{"minutes":9.67,"words":2900},"filePathRelative":"Linux/07_Nginx/08_高级特性与扩展/03_gRPC与gRPC-Web代理.md"}`),s={name:`03_gRPC与gRPC-Web代理.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="grpc-与-grpc-web-代理" tabindex="-1"><a class="header-anchor" href="#grpc-与-grpc-web-代理"><span>gRPC 与 gRPC-Web 代理</span></a></h1><p>gRPC 是 Google 开源的高性能 RPC 框架，基于 HTTP/2 和 Protocol Buffers，已成为微服务间通信的事实标准。Nginx 从 1.13.10 开始原生支持 gRPC 代理，可以在七层对 gRPC 流量做路由、负载均衡、超时控制等。本文系统讲解 Nginx 的 gRPC 代理配置、方法级路由、gRPC-Web 转码以及微服务网关实战。</p><h2 id="_1-grpc-协议原理" tabindex="-1"><a class="header-anchor" href="#_1-grpc-协议原理"><span>1. gRPC 协议原理</span></a></h2><h3 id="_1-1-grpc-协议栈" tabindex="-1"><a class="header-anchor" href="#_1-1-grpc-协议栈"><span>1.1 gRPC 协议栈</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌─────────────────────────────────────────┐</span></span>
<span class="line"><span>│         gRPC Stub / Client              │</span></span>
<span class="line"><span>├─────────────────────────────────────────┤</span></span>
<span class="line"><span>│     gRPC Frame (Length-Prefixed)        │</span></span>
<span class="line"><span>│  ┌───────┬────────┬──────────────────┐  │</span></span>
<span class="line"><span>│  │ Compr │ Length  │  Data (Proto)    │  │</span></span>
<span class="line"><span>│  │ Flag  │ (4B)   │                  │  │</span></span>
<span class="line"><span>│  └───────┴────────┴──────────────────┘  │</span></span>
<span class="line"><span>├─────────────────────────────────────────┤</span></span>
<span class="line"><span>│       HTTP/2 (Stream, HPACK, Flow Ctrl) │</span></span>
<span class="line"><span>├─────────────────────────────────────────┤</span></span>
<span class="line"><span>│            TLS (可选)                    │</span></span>
<span class="line"><span>├─────────────────────────────────────────┤</span></span>
<span class="line"><span>│            TCP                          │</span></span>
<span class="line"><span>└─────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>gRPC 的核心特征：</p><ul><li><strong>HTTP/2 传输</strong>：多路复用、头部压缩、服务端推送</li><li><strong>Protocol Buffers</strong>：高效的二进制序列化</li><li><strong>四种通信模式</strong>：Unary、Server Streaming、Client Streaming、Bidirectional Streaming</li><li><strong>强类型接口</strong>：通过 <code>.proto</code> 文件定义服务契约</li></ul><h3 id="_1-2-grpc-四种通信模式" tabindex="-1"><a class="header-anchor" href="#_1-2-grpc-四种通信模式"><span>1.2 gRPC 四种通信模式</span></a></h3><div class="language-protobuf line-numbers-mode" data-highlighter="shiki" data-ext="protobuf" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-protobuf"><span class="line"><span style="color:#7F848E;font-style:italic;">// Unary: 单请求 → 单响应</span></span>
<span class="line"><span style="color:#ABB2BF;">rpc GetUser(GetUserRequest) returns (User);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// Server Streaming: 单请求 → 流式响应</span></span>
<span class="line"><span style="color:#ABB2BF;">rpc ListUsers(ListUsersRequest) returns (stream User);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// Client Streaming: 流式请求 → 单响应</span></span>
<span class="line"><span style="color:#ABB2BF;">rpc UploadFile(stream FileChunk) returns (UploadResponse);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// Bidirectional Streaming: 流式请求 ↔ 流式响应</span></span>
<span class="line"><span style="color:#ABB2BF;">rpc Chat(stream ChatMessage) returns (stream ChatMessage);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-3-grpc-over-http-2-映射" tabindex="-1"><a class="header-anchor" href="#_1-3-grpc-over-http-2-映射"><span>1.3 gRPC over HTTP/2 映射</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>gRPC 方法: package.Service/Method</span></span>
<span class="line"><span>↓</span></span>
<span class="line"><span>HTTP/2 请求:</span></span>
<span class="line"><span>  :method = POST</span></span>
<span class="line"><span>  :path = /package.Service/Method</span></span>
<span class="line"><span>  :scheme = http 或 https</span></span>
<span class="line"><span>  content-type = application/grpc</span></span>
<span class="line"><span>  te = trailers</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table><thead><tr><th>gRPC 概念</th><th>HTTP/2 映射</th></tr></thead><tbody><tr><td>Service</td><td>URL Path 前缀 <code>/package.Service/</code></td></tr><tr><td>Method</td><td>URL Path 后缀 <code>/Method</code></td></tr><tr><td>Request</td><td>HTTP/2 请求体（Length-Prefixed Message）</td></tr><tr><td>Response</td><td>HTTP/2 响应体（Length-Prefixed Message）</td></tr><tr><td>Status</td><td>grpc-status trailer</td></tr><tr><td>Metadata</td><td>HTTP/2 Headers</td></tr><tr><td>Error</td><td>grpc-status + grpc-message trailers</td></tr></tbody></table><h2 id="_2-grpc-pass-配置与路由" tabindex="-1"><a class="header-anchor" href="#_2-grpc-pass-配置与路由"><span>2. grpc_pass 配置与路由</span></a></h2><h3 id="_2-1-grpc-代理架构" tabindex="-1"><a class="header-anchor" href="#_2-1-grpc-代理架构"><span>2.1 gRPC 代理架构</span></a></h3>`,14),i(d,{code:`eJxLy8kvT85ILCpR8AniUgAC55zM1LyS6PSgAGeFp+sWPevY/nz1+lgFXV27Go+QkAB9oxoFv/TMvIpoJTBlk1Skb5deVJAcX5BYXKwUCzYDLIOiJdgQYmJwalFZapGCIU51RijqjHCqM0ZRZxzLBVZYXJqUXpRYkAHV8WL7+udTNr5o3vu0azZYHgSCDKOVnk3b+Wzz1Oe7lkNUgD2hX5CYnJ2YnqoHMjMzOVXfN7UkIz8F6iWwTiOgzjm9T7sWEtCJrMc4Wulp64qnGxuQNSArMIl+sWX+i717n85tf7FwIZKEafSLba3Ppm97sqPvZXvvi/VTkeTMooODfRSe7+4ARQ5YODUvBRoGJZU5qdAASMvMybFSTjVMM01LRZIMNoTKJFukmiVbIssY4ZQxRpUBAKRgyV4=`}),o[1]||=n(`<h3 id="_2-2-基础-grpc-pass-配置" tabindex="-1"><a class="header-anchor" href="#_2-2-基础-grpc-pass-配置"><span>2.2 基础 grpc_pass 配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # gRPC 上游</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> grpc_backend {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.10:50051;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.11:50051;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">50051</span><span style="color:#ABB2BF;"> http2;  </span><span style="color:#7F848E;font-style:italic;"># 必须启用 http2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 所有 gRPC 请求代理到上游</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">            grpc_pass </span><span style="color:#ABB2BF;">grpc://grpc_backend;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # grpc:// 明文连接</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # grpcs:// SSL 连接</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-grpc-pass-语法" tabindex="-1"><a class="header-anchor" href="#_2-3-grpc-pass-语法"><span>2.3 grpc_pass 语法</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># grpc_pass 语法</span></span>
<span class="line"><span style="color:#C678DD;">grpc_pass </span><span style="color:#ABB2BF;">uri;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># uri 格式：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># grpc://upstream_name    → 明文 HTTP/2 到上游</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># grpcs://upstream_name   → TLS HTTP/2 到上游</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># unix:/path/to/socket    → Unix 域套接字</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 示例</span></span>
<span class="line"><span style="color:#C678DD;">grpc_pass </span><span style="color:#ABB2BF;">grpc://backend;          </span><span style="color:#7F848E;font-style:italic;"># 明文</span></span>
<span class="line"><span style="color:#C678DD;">grpc_pass </span><span style="color:#ABB2BF;">grpcs://backend;         </span><span style="color:#7F848E;font-style:italic;"># TLS</span></span>
<span class="line"><span style="color:#C678DD;">grpc_pass </span><span style="color:#ABB2BF;">grpc://10.0.0.10:50051;  </span><span style="color:#7F848E;font-style:italic;"># 直接地址</span></span>
<span class="line"><span style="color:#C678DD;">grpc_pass </span><span style="color:#ABB2BF;">grpc://unix:/tmp/grpc.sock;  </span><span style="color:#7F848E;font-style:italic;"># Unix socket</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-4-ssl-配置" tabindex="-1"><a class="header-anchor" href="#_2-4-ssl-配置"><span>2.4 SSL 配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">50051</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 客户端 → Nginx SSL</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/ssl/certs/grpc-server.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/ssl/private/grpc-server.key;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_protocols </span><span style="color:#ABB2BF;">TLSv1.2 TLSv1.3;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Nginx → 上游 SSL</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_pass </span><span style="color:#ABB2BF;">grpcs://grpc_backend;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 上游 SSL 验证</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_ssl_trusted_certificate </span><span style="color:#ABB2BF;">/etc/ssl/certs/ca.crt;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_ssl_verify </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_ssl_name </span><span style="color:#ABB2BF;">grpc.internal;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-grpc-服务方法路由" tabindex="-1"><a class="header-anchor" href="#_3-grpc-服务方法路由"><span>3. gRPC 服务方法路由</span></a></h2><h3 id="_3-1-方法级路由" tabindex="-1"><a class="header-anchor" href="#_3-1-方法级路由"><span>3.1 方法级路由</span></a></h3><p>gRPC 方法映射为 URL 路径 <code>/package.Service/Method</code>，Nginx 可以用 <code>location</code> 做精确路由：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">50051</span><span style="color:#ABB2BF;"> http2;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 假设 protobuf 包名: com.example</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 服务: UserService, OrderService, PaymentService</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # UserService → 用户服务集群</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /com.example.UserService/ {</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_pass </span><span style="color:#ABB2BF;">grpc://user_service;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # OrderService → 订单服务集群</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /com.example.OrderService/ {</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_pass </span><span style="color:#ABB2BF;">grpc://order_service;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # PaymentService → 支付服务集群</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /com.example.PaymentService/ {</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_pass </span><span style="color:#ABB2BF;">grpc://payment_service;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 特定方法路由</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /com.example.UserService/GetUser {</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_pass </span><span style="color:#ABB2BF;">grpc://user_service;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 其他 gRPC 方法 → 默认后端</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_pass </span><span style="color:#ABB2BF;">grpc://default_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> user_service {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.10:50051;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.11:50051;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> order_service {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.20:50052;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.21:50052;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> payment_service {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.30:50053;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> default_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.1:50051;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-路由匹配规则" tabindex="-1"><a class="header-anchor" href="#_3-2-路由匹配规则"><span>3.2 路由匹配规则</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># gRPC 路径格式: /package.Service/Method</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 精确匹配某个方法</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/com.example.UserService/GetUser </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    grpc_pass </span><span style="color:#ABB2BF;">grpc://user_service;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 前缀匹配某个服务的所有方法</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /com.example.UserService/ {</span></span>
<span class="line"><span style="color:#C678DD;">    grpc_pass </span><span style="color:#ABB2BF;">grpc://user_service;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 前缀匹配某个包的所有服务</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /com.example. {</span></span>
<span class="line"><span style="color:#C678DD;">    grpc_pass </span><span style="color:#ABB2BF;">grpc://example_services;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 正则匹配</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~ </span><span style="color:#E06C75;">^/com\\.example\\.\\w+Service/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    grpc_pass </span><span style="color:#ABB2BF;">grpc://all_services;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 所有 gRPC 请求</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">    grpc_pass </span><span style="color:#ABB2BF;">grpc://default_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">gRPC 路由优先级</p><p>Nginx 的 location 匹配规则同样适用于 gRPC 路由：</p><ol><li>精确匹配 <code>= /path</code> 最高优先级</li><li>前缀匹配 <code>location /path/</code> 按最长匹配</li><li>正则匹配 <code>~ ^/pattern</code> 按配置顺序</li></ol><p>注意：gRPC 客户端发送的路径必须与 <code>.proto</code> 文件中定义的包名和服务名完全一致。</p></div><h2 id="_4-http-2-配置" tabindex="-1"><a class="header-anchor" href="#_4-http-2-配置"><span>4. HTTP/2 配置</span></a></h2><h3 id="_4-1-启用-http-2" tabindex="-1"><a class="header-anchor" href="#_4-1-启用-http-2"><span>4.1 启用 HTTP/2</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># HTTP/2 是 gRPC 的前提</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 方式1：直接监听 HTTP/2</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">50051</span><span style="color:#ABB2BF;"> http2;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 方式2：HTTP/2 + SSL</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/ssl/certs/server.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/ssl/private/server.key;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-http-2-参数调优" tabindex="-1"><a class="header-anchor" href="#_4-2-http-2-参数调优"><span>4.2 HTTP/2 参数调优</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # HTTP/2 并发流数</span></span>
<span class="line"><span style="color:#C678DD;">    http2_max_concurrent_streams </span><span style="color:#D19A66;">128</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # HTTP/2 接收缓冲区</span></span>
<span class="line"><span style="color:#C678DD;">    http2_recv_buffer_size </span><span style="color:#D19A66;">256k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 注意：http2_max_field_size 和 http2_max_header_size</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 自 Nginx 1.19.7 起已废弃，改用 large_client_header_buffers 替代</span></span>
<span class="line"><span style="color:#C678DD;">    large_client_header_buffers </span><span style="color:#D19A66;">4</span><span style="color:#D19A66;"> 32k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        ssl_protocols </span><span style="color:#ABB2BF;">TLSv1.2 TLSv1.3;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_ciphers </span><span style="color:#ABB2BF;">HIGH:!aNULL:!MD5;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_prefer_server_ciphers </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # ALPN 协议协商</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # Nginx 自动在 TLS 握手时协商 h2</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 无需手动配置</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-http-2-与-grpc-的关系" tabindex="-1"><a class="header-anchor" href="#_4-3-http-2-与-grpc-的关系"><span>4.3 HTTP/2 与 gRPC 的关系</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># gRPC 要求 HTTP/2，但 HTTP/2 不限于 gRPC</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 同一端口可以同时服务 HTTP/2 和 gRPC</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # gRPC 请求</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /com.example. {</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_pass </span><span style="color:#ABB2BF;">grpc://grpc_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 普通 HTTP 请求</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://http_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 静态资源</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /static/ {</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-grpc-web-转码" tabindex="-1"><a class="header-anchor" href="#_5-grpc-web-转码"><span>5. gRPC-Web 转码</span></a></h2><h3 id="_5-1-grpc-web-概述" tabindex="-1"><a class="header-anchor" href="#_5-1-grpc-web-概述"><span>5.1 gRPC-Web 概述</span></a></h3><p>浏览器无法直接使用 HTTP/2 的 gRPC，gRPC-Web 是 gRPC 的浏览器兼容版本：</p>`,23),i(d,{code:`eJxLy8kvT85ILCpR8AniUgACp6L88uLUouhnW/tfLO94OnNFrIKurl1NelCAs254apJNUpG+nUdISIC+oZ5hjYJfemZeRbQSmAJLpRcVJOuWpyYpPFux8Onc6UqxYEPB8nBzEGYY1Sg4JSZnp+alRIMkFIJTi8pSi2K5wJqKS5PSixILMhRgdiu82Lvm+YJGsCQIhBhGw1yi8KhtkgLESIiNYHmj6MSCgpzM5MSSzPw8fbjTQGrRJZB0GUc75+eVpOaV6IZUFqSCLH3WuwhJ3iQ6pCgxMye1qFjh6ZKW5xPaIHJAT0DdXVKZkwoLR4W0zJwcK+W0tDTLZBMkaUiIQCRTDdNM01KR9ULCBCqdbJFqlmzJBQDbHY51`}),o[2]||=n(`<h3 id="_5-2-grpc-web-模块配置" tabindex="-1"><a class="header-anchor" href="#_5-2-grpc-web-模块配置"><span>5.2 gRPC-Web 模块配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 需要 nginx-plus 或第三方 grpc-web 模块</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 开源方案：grpc-gateway 或 Envoy</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方案1：使用 Nginx Plus 的 grpc-web 模块</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 启用 gRPC-Web</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /com.example.UserService/ {</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_pass </span><span style="color:#ABB2BF;">grpc://user_service;</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_set_header </span><span style="color:#ABB2BF;">Content-Type </span><span style="color:#98C379;">&quot;application/grpc&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # gRPC-Web 需要特殊处理</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 因为浏览器发送的 Content-Type 不同</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # application/grpc-web+proto → application/grpc</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方案2：使用 grpc-gateway（HTTP/JSON → gRPC）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在 gRPC 服务端运行 grpc-gateway</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 浏览器通过 HTTP/JSON API 访问</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-grpc-web-与-envoy-方案" tabindex="-1"><a class="header-anchor" href="#_5-3-grpc-web-与-envoy-方案"><span>5.3 gRPC-Web 与 Envoy 方案</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># Envoy 配置（更成熟的 gRPC-Web 方案）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># envoy.yaml</span></span>
<span class="line"><span style="color:#E06C75;">static_resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  listeners</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">grpc_web_listener</span></span>
<span class="line"><span style="color:#E06C75;">    address</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      socket_address</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        address</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">0.0.0.0</span></span>
<span class="line"><span style="color:#E06C75;">        port_value</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span></span>
<span class="line"><span style="color:#E06C75;">    filter_chains</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">filters</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">envoy.http_connection_manager</span></span>
<span class="line"><span style="color:#E06C75;">        typed_config</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">          &quot;@type&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager</span></span>
<span class="line"><span style="color:#E06C75;">          codec_type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">auto</span></span>
<span class="line"><span style="color:#E06C75;">          route_config</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">local_route</span></span>
<span class="line"><span style="color:#E06C75;">            virtual_hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">local_service</span></span>
<span class="line"><span style="color:#E06C75;">              domains</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;*&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">              routes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">              - </span><span style="color:#E06C75;">match</span><span style="color:#ABB2BF;">: { </span><span style="color:#E06C75;">prefix</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;/&quot;</span><span style="color:#ABB2BF;"> }</span></span>
<span class="line"><span style="color:#E06C75;">                route</span><span style="color:#ABB2BF;">: { </span><span style="color:#E06C75;">cluster</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">grpc_service</span><span style="color:#ABB2BF;"> }</span></span>
<span class="line"><span style="color:#E06C75;">          http_filters</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">envoy.grpc_web</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">envoy.router</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  clusters</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">grpc_service</span></span>
<span class="line"><span style="color:#E06C75;">    connect_timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5s</span></span>
<span class="line"><span style="color:#E06C75;">    type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">logical_dns</span></span>
<span class="line"><span style="color:#E06C75;">    lb_policy</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">round_robin</span></span>
<span class="line"><span style="color:#E06C75;">    hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">socket_address</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        address</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">grpc-server</span></span>
<span class="line"><span style="color:#E06C75;">        port_value</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">50051</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">gRPC-Web 方案选择</p><ul><li><strong>小规模/快速集成</strong>：Nginx + grpc-gateway（HTTP/JSON → gRPC 转码）</li><li><strong>中等规模</strong>：Nginx + Envoy sidecar（gRPC-Web 转码）</li><li><strong>大规模/全栈 gRPC</strong>：Envoy 作为 gRPC-Web 网关，Nginx 做 TLS 终端和静态文件</li></ul></div><h2 id="_6-grpc-负载均衡与一致性哈希" tabindex="-1"><a class="header-anchor" href="#_6-grpc-负载均衡与一致性哈希"><span>6. gRPC 负载均衡与一致性哈希</span></a></h2><h3 id="_6-1-grpc-负载均衡" tabindex="-1"><a class="header-anchor" href="#_6-1-grpc-负载均衡"><span>6.1 gRPC 负载均衡</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 轮询（默认）</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> grpc_round_robin {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.10:50051;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.11:50051;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.12:50051;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 最少连接数（推荐 gRPC 使用）</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> grpc_least_conn {</span></span>
<span class="line"><span style="color:#C678DD;">        least_conn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.10:50051;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.11:50051;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.12:50051;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 一致性哈希（会话保持）</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> grpc_hash {</span></span>
<span class="line"><span style="color:#C678DD;">        hash </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;"> consistent;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.10:50051;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.11:50051;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.12:50051;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 基于 gRPC 方法的哈希</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # $uri = /package.Service/Method</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> grpc_method_hash {</span></span>
<span class="line"><span style="color:#C678DD;">        hash </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> consistent;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.10:50051;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.11:50051;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.12:50051;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-grpc-长连接与负载均衡" tabindex="-1"><a class="header-anchor" href="#_6-2-grpc-长连接与负载均衡"><span>6.2 gRPC 长连接与负载均衡</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># gRPC 使用 HTTP/2 长连接</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 同一连接上的多个请求会到同一个上游</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 需要配置 Keep-Alive 确保连接不中断</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> grpc_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.10:50051;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.11:50051;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 长连接池</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive </span><span style="color:#D19A66;">32</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_timeout </span><span style="color:#D19A66;">60s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_requests </span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">50051</span><span style="color:#ABB2BF;"> http2;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_pass </span><span style="color:#ABB2BF;">grpc://grpc_backend;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # gRPC 模块原生使用 HTTP/2，无需设置 HTTP 版本</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 不存在 grpc_http_version 和 grpc_set_header Connection 指令</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # grpc_pass 与 proxy_pass 不同，始终以 HTTP/2 与上游通信</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">gRPC 负载均衡的挑战</p><p>由于 gRPC 使用 HTTP/2 长连接，一个连接上的所有请求都会被路由到同一个上游。这可能导致负载不均衡。</p><p>解决方案：</p><ol><li><strong>客户端侧负载均衡</strong>：gRPC 客户端内置负载均衡（如 xDS）</li><li><strong>连接级负载均衡</strong>：Nginx 的 <code>least_conn</code> 算法</li><li><strong>请求级负载均衡</strong>：使用 HTTP/2 的多路复用 + 短连接</li><li><strong>Service Mesh</strong>：Envoy/Istio 的请求级负载均衡</li></ol></div><h2 id="_7-grpc-超时与重试" tabindex="-1"><a class="header-anchor" href="#_7-grpc-超时与重试"><span>7. gRPC 超时与重试</span></a></h2><h3 id="_7-1-超时配置" tabindex="-1"><a class="header-anchor" href="#_7-1-超时配置"><span>7.1 超时配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">50051</span><span style="color:#ABB2BF;"> http2;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 全局 gRPC 超时</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_pass </span><span style="color:#ABB2BF;">grpc://backend;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 连接超时</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_connect_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 读取超时</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_read_timeout </span><span style="color:#D19A66;">60s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 发送超时</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_send_timeout </span><span style="color:#D19A66;">60s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # gRPC 超时（覆盖客户端的 grpc-timeout 头）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # grpc_next_upstream_timeout 10s;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 不同服务不同超时</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /com.example.UserService/ {</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_pass </span><span style="color:#ABB2BF;">grpc://user_service;</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_read_timeout </span><span style="color:#D19A66;">10s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /com.example.ReportService/ {</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_pass </span><span style="color:#ABB2BF;">grpc://report_service;</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_read_timeout </span><span style="color:#D19A66;">300s</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 报表生成较慢</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 流式方法需要更长超时</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /com.example.ChatService/ {</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_pass </span><span style="color:#ABB2BF;">grpc://chat_service;</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_read_timeout </span><span style="color:#D19A66;">3600s</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 1小时</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_send_timeout </span><span style="color:#D19A66;">3600s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-重试配置" tabindex="-1"><a class="header-anchor" href="#_7-2-重试配置"><span>7.2 重试配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">50051</span><span style="color:#ABB2BF;"> http2;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_pass </span><span style="color:#ABB2BF;">grpc://backend;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 在以下情况下尝试下一个上游</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_next_upstream </span><span style="color:#D19A66;">error</span><span style="color:#ABB2BF;"> timeout http_502 http_503;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 重试次数</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_next_upstream_tries </span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 重试超时</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_next_upstream_timeout </span><span style="color:#D19A66;">10s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-grpc-错误码映射" tabindex="-1"><a class="header-anchor" href="#_7-3-grpc-错误码映射"><span>7.3 gRPC 错误码映射</span></a></h3><table><thead><tr><th>gRPC Status</th><th>HTTP Status</th><th>说明</th></tr></thead><tbody><tr><td>OK (0)</td><td>200</td><td>成功</td></tr><tr><td>CANCELLED (1)</td><td>499</td><td>请求被取消</td></tr><tr><td>UNKNOWN (2)</td><td>500</td><td>未知错误</td></tr><tr><td>INVALID_ARGUMENT (3)</td><td>400</td><td>无效参数</td></tr><tr><td>DEADLINE_EXCEEDED (4)</td><td>504</td><td>超时</td></tr><tr><td>NOT_FOUND (5)</td><td>404</td><td>未找到</td></tr><tr><td>ALREADY_EXISTS (6)</td><td>409</td><td>已存在</td></tr><tr><td>PERMISSION_DENIED (7)</td><td>403</td><td>权限不足</td></tr><tr><td>RESOURCE_EXHAUSTED (8)</td><td>429</td><td>资源耗尽</td></tr><tr><td>UNAVAILABLE (14)</td><td>503</td><td>服务不可用</td></tr><tr><td>UNAUTHENTICATED (16)</td><td>401</td><td>未认证</td></tr></tbody></table><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># gRPC 超时转发</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 客户端设置 grpc-timeout 头，Nginx 透传到上游</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_pass </span><span style="color:#ABB2BF;">grpc://backend;</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_set_header </span><span style="color:#ABB2BF;">grpc-timeout $</span><span style="color:#E06C75;">http_grpc_timeout</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_8-grpc-健康检查协议" tabindex="-1"><a class="header-anchor" href="#_8-grpc-健康检查协议"><span>8. gRPC 健康检查协议</span></a></h2><h3 id="_8-0-健康检查架构" tabindex="-1"><a class="header-anchor" href="#_8-0-健康检查架构"><span>8.0 健康检查架构</span></a></h3>`,21),i(d,{code:`eJxLy8kvT85ILCpRCHHhUgACH6foF1vmv9i79+nc9hcLFz6duULfLz0zryJWQVfXruZp49Knu7Y/W9zwbP7SF+u3P9vYVKMQbBitlB4U4KwQnFpUllqkYGiTVKRvF+waFObp564UCzUVt3YjVO1GYO1+/iHxxBthjGqEMZoLwPqDDcH6oaI1QPMgwkZgYST7EFLGGDqQXfJi+/rnUzY+29r4sr0fFApwOT3diprny3e/nLkE5Ds8Wowh5hWXJqUXJRZkKHikJuaUZCg4Z6QmZysA/QOWBQEP5+j0ooJkvQywAr0yQz2IUn2wUkj4gEB4CA514YklyRkQdal5KVBrSypzUkEuS8vMybFSTjVMM01LRZIBBhhEJtki1SzZElnGCCqTlpackgLxIVTGGFUPAK0b0vw=`}),o[3]||=n(`<h3 id="_8-1-grpc-health-checking-protocol" tabindex="-1"><a class="header-anchor" href="#_8-1-grpc-health-checking-protocol"><span>8.1 gRPC Health Checking Protocol</span></a></h3><p>gRPC 定义了标准的健康检查协议 <code>grpc.health.v1.Health</code>：</p><div class="language-protobuf line-numbers-mode" data-highlighter="shiki" data-ext="protobuf" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-protobuf"><span class="line"><span style="color:#7F848E;font-style:italic;">// grpc.health.v1.Health</span></span>
<span class="line"><span style="color:#C678DD;">service</span><span style="color:#E5C07B;"> Health</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    rpc</span><span style="color:#61AFEF;"> Check</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">HealthCheckRequest</span><span style="color:#ABB2BF;">) </span><span style="color:#C678DD;">returns</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">HealthCheckResponse</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">    rpc</span><span style="color:#61AFEF;"> Watch</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">HealthCheckRequest</span><span style="color:#ABB2BF;">) </span><span style="color:#C678DD;">returns</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">stream</span><span style="color:#E5C07B;"> HealthCheckResponse</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">message</span><span style="color:#E5C07B;"> HealthCheckRequest</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    string</span><span style="color:#E06C75;"> service</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">message</span><span style="color:#E5C07B;"> HealthCheckResponse</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    enum</span><span style="color:#E5C07B;"> ServingStatus</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#E06C75;">        UNKNOWN</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E06C75;">        SERVING</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E06C75;">        NOT_SERVING</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 2</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E06C75;">        SERVICE_UNKNOWN</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 3</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#C678DD;">    ServingStatus</span><span style="color:#E06C75;"> status</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-2-nginx-主动健康检查" tabindex="-1"><a class="header-anchor" href="#_8-2-nginx-主动健康检查"><span>8.2 Nginx 主动健康检查</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx Plus 支持主动健康检查</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> grpc_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.10:50051;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.11:50051;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 主动健康检查（Nginx Plus）</span></span>
<span class="line"><span style="color:#C678DD;">    health_check </span><span style="color:#ABB2BF;">interval=10s passes=2 fails=3;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # grpc_status 渐进式检查</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 开源版本使用被动健康检查</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> grpc_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.10:50051 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=30s;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.11:50051 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=30s;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.12:50051 backup;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-3-外部健康检查脚本" tabindex="-1"><a class="header-anchor" href="#_8-3-外部健康检查脚本"><span>8.3 外部健康检查脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># grpc_healthcheck.sh - 使用 grpcurl 检查 gRPC 服务健康</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">SERVERS</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;10.0.0.10:50051&quot;</span><span style="color:#98C379;"> &quot;10.0.0.11:50051&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> server</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">SERVERS</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 使用 grpcurl 调用健康检查</span></span>
<span class="line"><span style="color:#E06C75;">    result</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">grpcurl</span><span style="color:#D19A66;"> -plaintext</span><span style="color:#D19A66;"> -max-time</span><span style="color:#D19A66;"> 3</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        -d</span><span style="color:#98C379;"> &#39;{&quot;service&quot;: &quot;&quot;}&#39;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">        &quot;</span><span style="color:#E06C75;">$server</span><span style="color:#98C379;">&quot;</span><span style="color:#98C379;"> grpc.health.v1.Health/Check</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#56B6C2;"> echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$result</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -q</span><span style="color:#98C379;"> &quot;SERVING&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;OK: </span><span style="color:#E06C75;">$server</span><span style="color:#98C379;"> - SERVING&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;FAIL: </span><span style="color:#E06C75;">$server</span><span style="color:#98C379;"> - </span><span style="color:#E06C75;">$result</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_9-实战-grpc-微服务网关配置" tabindex="-1"><a class="header-anchor" href="#_9-实战-grpc-微服务网关配置"><span>9. 实战：gRPC 微服务网关配置</span></a></h2><h3 id="_9-1-完整的-grpc-网关配置" tabindex="-1"><a class="header-anchor" href="#_9-1-完整的-grpc-网关配置"><span>9.1 完整的 gRPC 网关配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 上游定义 =====</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> user_service {</span></span>
<span class="line"><span style="color:#C678DD;">        least_conn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.10:50051 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=30s;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.11:50051 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=30s;</span></span>
<span class="line"><span style="color:#C678DD;">        keepalive </span><span style="color:#D19A66;">16</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> order_service {</span></span>
<span class="line"><span style="color:#C678DD;">        least_conn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.20:50052 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=30s;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.21:50052 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=30s;</span></span>
<span class="line"><span style="color:#C678DD;">        keepalive </span><span style="color:#D19A66;">16</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> payment_service {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.30:50053 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=30s;</span></span>
<span class="line"><span style="color:#C678DD;">        keepalive </span><span style="color:#D19A66;">8</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== gRPC 网关 =====</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">grpc.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # SSL</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate </span><span style="color:#ABB2BF;">/etc/ssl/certs/grpc.crt;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/ssl/private/grpc.key;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_protocols </span><span style="color:#ABB2BF;">TLSv1.2 TLSv1.3;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_session_cache </span><span style="color:#ABB2BF;">shared:GRPC_SSL:10m;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 通用 gRPC 配置</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_connect_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        grpc_send_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # ===== 服务级路由 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 用户服务</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /com.example.UserService/ {</span></span>
<span class="line"><span style="color:#C678DD;">            grpc_pass </span><span style="color:#ABB2BF;">grpc://user_service;</span></span>
<span class="line"><span style="color:#C678DD;">            grpc_read_timeout </span><span style="color:#D19A66;">10s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            grpc_next_upstream </span><span style="color:#D19A66;">error</span><span style="color:#ABB2BF;"> timeout;</span></span>
<span class="line"><span style="color:#C678DD;">            grpc_next_upstream_tries </span><span style="color:#D19A66;">2</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 订单服务</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /com.example.OrderService/ {</span></span>
<span class="line"><span style="color:#C678DD;">            grpc_pass </span><span style="color:#ABB2BF;">grpc://order_service;</span></span>
<span class="line"><span style="color:#C678DD;">            grpc_read_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            grpc_next_upstream </span><span style="color:#D19A66;">error</span><span style="color:#ABB2BF;"> timeout;</span></span>
<span class="line"><span style="color:#C678DD;">            grpc_next_upstream_tries </span><span style="color:#D19A66;">2</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 支付服务</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /com.example.PaymentService/ {</span></span>
<span class="line"><span style="color:#C678DD;">            grpc_pass </span><span style="color:#ABB2BF;">grpc://payment_service;</span></span>
<span class="line"><span style="color:#C678DD;">            grpc_read_timeout </span><span style="color:#D19A66;">60s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 支付服务不重试（幂等性问题）</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 健康检查（直接返回，不代理）</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /grpc.health.v1.Health/ {</span></span>
<span class="line"><span style="color:#C678DD;">            grpc_pass </span><span style="color:#ABB2BF;">grpc://user_service;</span></span>
<span class="line"><span style="color:#C678DD;">            grpc_read_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 默认路由</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">            grpc_pass </span><span style="color:#ABB2BF;">grpc://user_service;</span></span>
<span class="line"><span style="color:#C678DD;">            grpc_read_timeout </span><span style="color:#D19A66;">60s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== gRPC 反射服务（调试用）=====</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">50051</span><span style="color:#ABB2BF;"> http2;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">localhost;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        allow </span><span style="color:#ABB2BF;">10.0.0.0/8;</span></span>
<span class="line"><span style="color:#C678DD;">        allow </span><span style="color:#D19A66;">127.0.0.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">            grpc_pass </span><span style="color:#ABB2BF;">grpc://user_service;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-2-grpc-网关监控" tabindex="-1"><a class="header-anchor" href="#_9-2-grpc-网关监控"><span>9.2 gRPC 网关监控</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # gRPC 日志格式</span></span>
<span class="line"><span style="color:#C678DD;">    log_format </span><span style="color:#ABB2BF;">grpc_log </span><span style="color:#98C379;">&#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> [$</span><span style="color:#E06C75;">time_iso8601</span><span style="color:#98C379;">] &#39;</span></span>
<span class="line"><span style="color:#98C379;">                        &#39;&quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot; $</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">body_bytes_sent</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                        &#39;rt=$</span><span style="color:#E06C75;">request_time</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                        &#39;grpc_method=&quot;$</span><span style="color:#E06C75;">uri</span><span style="color:#98C379;">&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">                        &#39;grpc_status=$</span><span style="color:#E06C75;">sent_http_grpc_status</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                        &#39;upstream=$</span><span style="color:#E06C75;">upstream_addr</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                        &#39;rid=$</span><span style="color:#E06C75;">request_id</span><span style="color:#98C379;">&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#ABB2BF;">/var/log/nginx/grpc_access.log grpc_log buffer=32k flush=5s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 暴露 stub_status</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /nginx_status {</span></span>
<span class="line"><span style="color:#C678DD;">            stub_status</span><span style="color:#ABB2BF;"> on;</span></span>
<span class="line"><span style="color:#C678DD;">            access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            allow </span><span style="color:#D19A66;">127.0.0.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-3-grpc-网关调试" tabindex="-1"><a class="header-anchor" href="#_9-3-grpc-网关调试"><span>9.3 gRPC 网关调试</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 grpcurl（gRPC 的 curl）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 列出服务（需要 gRPC 反射）</span></span>
<span class="line"><span style="color:#61AFEF;">grpcurl</span><span style="color:#D19A66;"> -plaintext</span><span style="color:#98C379;"> grpc-server:50051</span><span style="color:#98C379;"> list</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 列出方法</span></span>
<span class="line"><span style="color:#61AFEF;">grpcurl</span><span style="color:#D19A66;"> -plaintext</span><span style="color:#98C379;"> grpc-server:50051</span><span style="color:#98C379;"> list</span><span style="color:#98C379;"> com.example.UserService</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 描述方法</span></span>
<span class="line"><span style="color:#61AFEF;">grpcurl</span><span style="color:#D19A66;"> -plaintext</span><span style="color:#98C379;"> grpc-server:50051</span><span style="color:#98C379;"> describe</span><span style="color:#98C379;"> com.example.UserService.GetUser</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 调用方法</span></span>
<span class="line"><span style="color:#61AFEF;">grpcurl</span><span style="color:#D19A66;"> -plaintext</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -d</span><span style="color:#98C379;"> &#39;{&quot;user_id&quot;: &quot;12345&quot;}&#39;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    grpc-server:50051</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    com.example.UserService/GetUser</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 通过 Nginx 代理调用</span></span>
<span class="line"><span style="color:#61AFEF;">grpcurl</span><span style="color:#D19A66;"> -plaintext</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -d</span><span style="color:#98C379;"> &#39;{&quot;user_id&quot;: &quot;12345&quot;}&#39;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    grpc.example.com:443</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    com.example.UserService/GetUser</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 TLS</span></span>
<span class="line"><span style="color:#61AFEF;">grpcurl</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -d</span><span style="color:#98C379;"> &#39;{&quot;user_id&quot;: &quot;12345&quot;}&#39;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    grpc.example.com:443</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    com.example.UserService/GetUser</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 健康检查</span></span>
<span class="line"><span style="color:#61AFEF;">grpcurl</span><span style="color:#D19A66;"> -plaintext</span><span style="color:#98C379;"> grpc-server:50051</span><span style="color:#98C379;"> grpc.health.v1.Health/Check</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-4-grpc-性能测试" tabindex="-1"><a class="header-anchor" href="#_9-4-grpc-性能测试"><span>9.4 gRPC 性能测试</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 ghz（gRPC 压测工具）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># go install github.com/bojand/ghz/cmd/ghz@latest</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 基准测试</span></span>
<span class="line"><span style="color:#61AFEF;">ghz</span><span style="color:#D19A66;"> --insecure</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --proto</span><span style="color:#98C379;"> api.proto</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --call</span><span style="color:#98C379;"> com.example.UserService.GetUser</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -d</span><span style="color:#98C379;"> &#39;{&quot;user_id&quot;: &quot;12345&quot;}&#39;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -c</span><span style="color:#D19A66;"> 50</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -n</span><span style="color:#D19A66;"> 10000</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    grpc.example.com:443</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 参数说明：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># --call: gRPC 方法</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -d: 请求数据</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -c: 并发数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -n: 总请求数</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出关键指标：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Count: 10000</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Average: 12.34 ms</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Fastest: 2.10 ms</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Slowest: 89.12 ms</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Requests/sec: 8186.23</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_10-参考文档" tabindex="-1"><a class="header-anchor" href="#_10-参考文档"><span>10. 参考文档</span></a></h2><ul><li><a href="https://nginx.org/en/docs/http/ngx_http_grpc_module.html" target="_blank" rel="noopener noreferrer">Nginx ngx_http_grpc_module</a></li><li><a href="https://www.nginx.com/blog/nginx-1-13-10-grpc/" target="_blank" rel="noopener noreferrer">Nginx gRPC 代理指南</a></li><li><a href="https://grpc.io/docs/" target="_blank" rel="noopener noreferrer">gRPC 官方文档</a></li><li><a href="https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md" target="_blank" rel="noopener noreferrer">gRPC Over HTTP/2</a></li><li><a href="https://github.com/grpc/grpc/blob/master/doc/health-checking.md" target="_blank" rel="noopener noreferrer">gRPC Health Checking Protocol</a></li><li><a href="https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-WEB.md" target="_blank" rel="noopener noreferrer">gRPC-Web 规范</a></li><li><a href="https://github.com/fullstorydev/grpcurl" target="_blank" rel="noopener noreferrer">grpcurl 工具</a></li><li><a href="https://ghz.sh/" target="_blank" rel="noopener noreferrer">ghz 压测工具</a></li></ul>`,18)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};