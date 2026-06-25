import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-BVtXrkU4.js";import{t as a}from"./app-CzHWYZaW.js";var o=JSON.parse(`{"path":"/Linux/06_%E5%86%85%E6%A0%B8%E7%BA%A7/04_%E7%BD%91%E7%BB%9C%E5%8D%8F%E8%AE%AE%E6%A0%88.html","title":"网络协议栈","lang":"zh-CN","frontmatter":{"title":"网络协议栈","icon":"network_check","order":4,"category":["Linux内核"],"tag":["网络协议栈","sk_buff","TCP","Netfilter","conntrack","零拷贝","内核调优"]},"git":{"createdTime":1780586585000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":2}]},"readingTime":{"minutes":35.03,"words":10508},"filePathRelative":"Linux/06_内核级/04_网络协议栈.md"}`),s={name:`04_网络协议栈.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="网络协议栈" tabindex="-1"><a class="header-anchor" href="#网络协议栈"><span>网络协议栈</span></a></h1><div class="hint-container important"><p class="hint-container-title">核心问题</p><p>当你在浏览器输入一个URL并按下回车，数据包是如何从应用程序穿越内核协议栈、经过网卡到达远端服务器的？Linux网络协议栈是内核中最庞大、最复杂的子系统之一，它承载着互联网的每一比特流量。理解它的分层架构、核心数据结构和关键路径，是解决网络性能瓶颈和排查疑难问题的基石。</p></div><h2 id="从一次网页请求说起" tabindex="-1"><a class="header-anchor" href="#从一次网页请求说起"><span>从一次网页请求说起</span></a></h2><p>想象你在浏览器访问 <code>https://example.com</code>，看似简单的操作背后，数据包经历了如下旅程：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>应用层：浏览器构造HTTP请求</span></span>
<span class="line"><span>    ↓</span></span>
<span class="line"><span>Socket层：通过write()系统调用写入数据</span></span>
<span class="line"><span>    ↓</span></span>
<span class="line"><span>TCP层：封装TCP首部、管理连接状态、拥塞控制</span></span>
<span class="line"><span>    ↓</span></span>
<span class="line"><span>IP层：封装IP首部、路由查找、分片</span></span>
<span class="line"><span>    ↓</span></span>
<span class="line"><span>网卡驱动：封装以太网帧头、DMA传输</span></span>
<span class="line"><span>    ↓</span></span>
<span class="line"><span>物理链路：电信号/光信号传输</span></span>
<span class="line"><span>    ↓</span></span>
<span class="line"><span>...经过无数路由器转发...</span></span>
<span class="line"><span>    ↓</span></span>
<span class="line"><span>服务器网卡接收 → 驱动 → IP → TCP → Socket → 应用读取</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这条路径上的每一层都有其精妙的设计。本文将从上到下，深入每一层的内核实现。</p><hr><h2 id="协议栈分层架构" tabindex="-1"><a class="header-anchor" href="#协议栈分层架构"><span>协议栈分层架构</span></a></h2><p>Linux网络协议栈遵循经典的分层模型，但内核实现并非严格的ISO七层模型，而是采用更实用的四层架构：</p>`,9),i(d,{code:`eJyFU09PGkEUv/MpNnvozcyl8WRMEKhuKrhZqZdNY2AZdCMBu6x4bWnkn1EwUm1SixC1QKMIaQsUCv0yzM7ut+jsLN3AxsQ5zMx7v/m9+b03b6KxxKG0G1JUJrjiYshIHoR3lND+LoPLDS3Xw82BcfmTIuZw87yIBmWC4cYxGhTfUgTGI655MsocadW+g2yjmwlpD6qok7Yhc2xueF6LrIVpp3eoeENOLIUVsJykPhCW4xEQk5MqjIOQJMF9laIKDEXAoSKrECSJEqBAKcVawubEzUmY/Knq43OnhKCHF1kyoZOi3mrR6PrfChGDWzVcygDt+A7ViF1HuS7Qfn0wskXLmLnPHG+8JA6ZZuJol1UrFEDtESp8mQxuJ8PPDh7n8fPb6yJrrpSFR2d4eKU/FrSLh2dzsg47c+L41EsSkcyzWfUecbkDUC6D81mgj+5R8cyphU8tUt7ibBb5Jup8Mr5dGB8bwEgPUeeIMPFp20F2CzQPslAaumqjr+/1+o1WKTlOBnzBV9x60CeIbACqUTmmQkWrZbRKlzLXEok9nP4NrNrpvWu9//3ZQhjnY5KgsxABH7e6JrJT1Q8l/GOIh9f0Fr/bMysRBLwOlV7flshOH6M1RrfZ/60Zh+p2BKZkCYJ3ETkpOXmCxUMnNaPZQYUGJQXcPAe8fjdYFTYcyTz9nXDtfjLs2gcDnIdEzTdJS1qxrbcpd8lboH4dCHJ8h1k5iEahMg1vhyQfmFlYWKafjTrMDfWQtmdemJ1L3bZFMbN7iGk2A0VnbIrbj0hR25pipOxTP9lRHykn9ZDVsoWpLWwxS5TEeVz/AG2JtSM=`}),o[1]||=n(`<div class="hint-container tip"><p class="hint-container-title">分层的设计哲学</p><p>协议栈的分层不是简单的代码隔离，而是通过函数指针和回调机制实现的灵活协作。每一层只关心本层的协议逻辑，通过 <code>sk_buff</code> 的协议字段串联上下层。这种设计使得新增协议（如SCTP）或替换实现（如从iptables到nftables）变得可能。</p></div><hr><h2 id="sk-buff-网络子系统的灵魂" tabindex="-1"><a class="header-anchor" href="#sk-buff-网络子系统的灵魂"><span>sk_buff：网络子系统的灵魂</span></a></h2><p><code>sk_buff</code>（简称skb）是Linux网络子系统中最重要的数据结构。每一个网络数据包在内核中的存在形式就是一个skb。理解skb，就理解了网络子系统的半壁江山。</p><h3 id="为什么需要sk-buff" tabindex="-1"><a class="header-anchor" href="#为什么需要sk-buff"><span>为什么需要sk_buff？</span></a></h3><p>在最朴素的设计中，数据包只是一个内存缓冲区。但协议栈需要为数据包附加大量元信息：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>朴素方案：每个包携带一个独立的元数据结构 + 一个数据缓冲区</span></span>
<span class="line"><span>    问题：</span></span>
<span class="line"><span>    ✗ 协议头逐层添加/移除时需要频繁拷贝数据</span></span>
<span class="line"><span>    ✗ 元数据与数据分离，缓存不友好</span></span>
<span class="line"><span>    ✗ 分片/合并操作复杂</span></span>
<span class="line"><span></span></span>
<span class="line"><span>sk_buff方案：元数据与数据指针封装在同一个结构中</span></span>
<span class="line"><span>    优势：</span></span>
<span class="line"><span>    ✓ 通过指针操作实现零拷贝的头部/尾部添加</span></span>
<span class="line"><span>    ✓ 元数据与数据紧密关联</span></span>
<span class="line"><span>    ✓ 统一的分片管理机制</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="sk-buff-核心结构" tabindex="-1"><a class="header-anchor" href="#sk-buff-核心结构"><span>sk_buff 核心结构</span></a></h3><div class="language-c line-numbers-mode" data-highlighter="shiki" data-ext="c" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-c"><span class="line"><span style="color:#7F848E;font-style:italic;">// include/linux/skbuff.h - 简化版</span></span>
<span class="line"><span style="color:#C678DD;">struct</span><span style="color:#ABB2BF;"> sk_buff {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // ===== 四个关键指针 =====</span></span>
<span class="line"><span style="color:#C678DD;">    unsigned</span><span style="color:#C678DD;"> char</span><span style="color:#C678DD;"> *</span><span style="color:#ABB2BF;">head;</span><span style="color:#7F848E;font-style:italic;">     // 缓冲区起始地址（已分配内存的起点）</span></span>
<span class="line"><span style="color:#C678DD;">    unsigned</span><span style="color:#C678DD;"> char</span><span style="color:#C678DD;"> *</span><span style="color:#ABB2BF;">data;</span><span style="color:#7F848E;font-style:italic;">     // 数据起始地址（有效数据的起点）</span></span>
<span class="line"><span style="color:#C678DD;">    unsigned</span><span style="color:#C678DD;"> char</span><span style="color:#C678DD;"> *</span><span style="color:#ABB2BF;">tail;</span><span style="color:#7F848E;font-style:italic;">     // 数据结束地址（有效数据的终点）</span></span>
<span class="line"><span style="color:#C678DD;">    unsigned</span><span style="color:#C678DD;"> char</span><span style="color:#C678DD;"> *</span><span style="color:#ABB2BF;">end;</span><span style="color:#7F848E;font-style:italic;">      // 缓冲区结束地址（已分配内存的终点）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // ===== 缓冲区长度信息 =====</span></span>
<span class="line"><span style="color:#C678DD;">    unsigned</span><span style="color:#C678DD;"> int</span><span style="color:#ABB2BF;"> len;</span><span style="color:#7F848E;font-style:italic;">        // 数据总长度（含所有分片）</span></span>
<span class="line"><span style="color:#C678DD;">    unsigned</span><span style="color:#C678DD;"> int</span><span style="color:#ABB2BF;"> data_len;</span><span style="color:#7F848E;font-style:italic;">   // 分片数据长度（非线性部分）</span></span>
<span class="line"><span style="color:#C678DD;">    unsigned</span><span style="color:#C678DD;"> int</span><span style="color:#ABB2BF;"> mac_len;</span><span style="color:#7F848E;font-style:italic;">    // MAC首部长度</span></span>
<span class="line"><span style="color:#C678DD;">    unsigned</span><span style="color:#C678DD;"> int</span><span style="color:#ABB2BF;"> hdr_len;</span><span style="color:#7F848E;font-style:italic;">    // 可克隆部分的首部长度</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // ===== 协议信息 =====</span></span>
<span class="line"><span style="color:#ABB2BF;">    __be16 protocol;</span><span style="color:#7F848E;font-style:italic;">         // 链路层协议类型</span></span>
<span class="line"><span style="color:#ABB2BF;">    __u8 pkt_type;</span><span style="color:#7F848E;font-style:italic;">           // 包类型（单播/广播/组播）</span></span>
<span class="line"><span style="color:#ABB2BF;">    __u8 ip_summed;</span><span style="color:#7F848E;font-style:italic;">          // 校验和策略</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // ===== 各层首部指针 =====</span></span>
<span class="line"><span style="color:#ABB2BF;">    __be16 inner_protocol;</span><span style="color:#7F848E;font-style:italic;">   // 隧道内层协议</span></span>
<span class="line"><span style="color:#C678DD;">    unsigned</span><span style="color:#C678DD;"> int</span><span style="color:#ABB2BF;"> headers_start;</span><span style="color:#7F848E;font-style:italic;">  // 首部区域起点</span></span>
<span class="line"><span style="color:#C678DD;">    unsigned</span><span style="color:#C678DD;"> int</span><span style="color:#ABB2BF;"> headers_end;</span><span style="color:#7F848E;font-style:italic;">    // 首部区域终点</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 快速访问各层首部</span></span>
<span class="line"><span style="color:#C678DD;">    union</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        struct</span><span style="color:#ABB2BF;"> tcphdr </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">th;</span><span style="color:#7F848E;font-style:italic;">   // TCP首部</span></span>
<span class="line"><span style="color:#C678DD;">        struct</span><span style="color:#ABB2BF;"> udphdr </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">uh;</span><span style="color:#7F848E;font-style:italic;">   // UDP首部</span></span>
<span class="line"><span style="color:#C678DD;">        struct</span><span style="color:#ABB2BF;"> icmphdr </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">icmph;</span><span style="color:#7F848E;font-style:italic;"> // ICMP首部</span></span>
<span class="line"><span style="color:#C678DD;">        struct</span><span style="color:#ABB2BF;"> iphdr </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">ipiph;</span><span style="color:#7F848E;font-style:italic;"> // IP首部</span></span>
<span class="line"><span style="color:#C678DD;">        unsigned</span><span style="color:#C678DD;"> char</span><span style="color:#C678DD;"> *</span><span style="color:#ABB2BF;">raw;</span><span style="color:#7F848E;font-style:italic;">  // 原始首部</span></span>
<span class="line"><span style="color:#ABB2BF;">    } h;</span><span style="color:#7F848E;font-style:italic;">  // 传输层首部</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    union</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        struct</span><span style="color:#ABB2BF;"> iphdr </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">iph;</span><span style="color:#7F848E;font-style:italic;">   // IPv4首部</span></span>
<span class="line"><span style="color:#C678DD;">        struct</span><span style="color:#ABB2BF;"> ipv6hdr </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">ipv6h;</span><span style="color:#7F848E;font-style:italic;"> // IPv6首部</span></span>
<span class="line"><span style="color:#C678DD;">        struct</span><span style="color:#ABB2BF;"> arphdr </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">arph;</span><span style="color:#7F848E;font-style:italic;">  // ARP首部</span></span>
<span class="line"><span style="color:#C678DD;">        unsigned</span><span style="color:#C678DD;"> char</span><span style="color:#C678DD;"> *</span><span style="color:#ABB2BF;">raw;</span><span style="color:#7F848E;font-style:italic;">  // 原始首部</span></span>
<span class="line"><span style="color:#ABB2BF;">    } nh;</span><span style="color:#7F848E;font-style:italic;">  // 网络层首部</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    union</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        unsigned</span><span style="color:#C678DD;"> char</span><span style="color:#C678DD;"> *</span><span style="color:#ABB2BF;">raw;</span><span style="color:#7F848E;font-style:italic;">  // 链路层首部</span></span>
<span class="line"><span style="color:#ABB2BF;">    } mac;</span><span style="color:#7F848E;font-style:italic;">  // 链路层首部</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // ===== 路由与设备 =====</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> net_device </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">dev;</span><span style="color:#7F848E;font-style:italic;">         // 接收/发送设备</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> net_device </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">input_dev;</span><span style="color:#7F848E;font-style:italic;">   // 输入设备</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> dst_entry </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">dst;</span><span style="color:#7F848E;font-style:italic;">          // 路由目的地</span></span>
<span class="line"><span style="color:#C678DD;">    char</span><span style="color:#E06C75;"> cb</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">48</span><span style="color:#ABB2BF;">];</span><span style="color:#7F848E;font-style:italic;">                    // 控制块（各层私有数据）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // ===== 分片管理 =====</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> skb_shared_info </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">shinfo;</span><span style="color:#7F848E;font-style:italic;"> // 共享信息（分片/引用计数）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // ===== 链表管理 =====</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> sk_buff </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">next;</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> sk_buff </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">prev;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // ===== 其他 =====</span></span>
<span class="line"><span style="color:#ABB2BF;">    __u32 priority;</span><span style="color:#7F848E;font-style:italic;">         // 包优先级/QoS类别</span></span>
<span class="line"><span style="color:#ABB2BF;">    __u32 mark;</span><span style="color:#7F848E;font-style:italic;">             // 包标记（用于策略路由等）</span></span>
<span class="line"><span style="color:#ABB2BF;">    __u16 queue_mapping;</span><span style="color:#7F848E;font-style:italic;">    // 队列映射（多队列网卡）</span></span>
<span class="line"><span style="color:#ABB2BF;">    __u8 cloned;</span><span style="color:#7F848E;font-style:italic;">            // 是否为克隆skb</span></span>
<span class="line"><span style="color:#56B6C2;">    refcount_t</span><span style="color:#ABB2BF;"> users;</span><span style="color:#7F848E;font-style:italic;">       // 用户引用计数</span></span>
<span class="line"><span style="color:#ABB2BF;">};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="四指针模型-零拷贝的秘密" tabindex="-1"><a class="header-anchor" href="#四指针模型-零拷贝的秘密"><span>四指针模型：零拷贝的秘密</span></a></h3><p><code>sk_buff</code> 的四个指针（head/data/tail/end）是其最精妙的设计，它使得协议头的添加和移除只需移动指针，而无需拷贝数据：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>skb内存布局：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    head                              end</span></span>
<span class="line"><span>    ↓                                 ↓</span></span>
<span class="line"><span>    ┌──────┬──────────────┬───────────┐</span></span>
<span class="line"><span>    │ head │   payload    │   tail    │</span></span>
<span class="line"><span>    │ room │   (数据)     │   room   │</span></span>
<span class="line"><span>    └──────┴──────────────┴───────────┘</span></span>
<span class="line"><span>           ↑              ↑</span></span>
<span class="line"><span>          data           tail</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    headroom: head到data之间的空间，用于添加协议头</span></span>
<span class="line"><span>    tailroom: tail到end之间的空间，用于添加协议尾</span></span>
<span class="line"><span>    payload:  data到tail之间的空间，有效数据</span></span>
<span class="line"><span></span></span>
<span class="line"><span>关键操作：</span></span>
<span class="line"><span>1. 添加TCP首部：skb_push(skb, tcp_hdr_len)</span></span>
<span class="line"><span>   → data指针前移，在headroom中&quot;腾出&quot;空间</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 移除以太网帧头：skb_pull(skb, eth_hdr_len)</span></span>
<span class="line"><span>   → data指针后移，&quot;跳过&quot;以太网头</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 添加以太网帧头：skb_push(skb, eth_hdr_len)</span></span>
<span class="line"><span>   → data指针前移</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4. 追加数据：skb_put(skb, data_len)</span></span>
<span class="line"><span>   → tail指针后移，在tailroom中扩展数据</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,12),i(d,{code:`eJyFkstOwkAYhfc+xSw1wbgnhoSgiV1oXLAzhgxQaSNCbQdXLKoIooIC4jUsWIAQE40kRoiFt+lM05Wv4LS1F0KVbqbpOf85X/tXYg9zbCbBrvEwJcKDBUAvAYqIT/ACzCAQFgQAJYC/mlqzjwcnM4ZoZNsw0MNPZUyR8dXWoxuGqCpd3HnRJnXDY5q2sogF2SNWNNoD1BYE5PadVN9wpYiv67p8TO4/tadTUjnTG2VyU1UnLWuS+pdDIcoSBBSXlIe/c6VHXOxK+3E3XuRTHALZPQM8CKgUE3JokZ4BkGYzS6txcSWEIJ/GtSutp3yPK1aGN9WqpPN2JRkq+KJNb/XnO73Q/79M4qw2lBBiXFKMOa1JiCA+r3pb3UhPJUOjcK2uji7VcVuXG6bE2IrFwvyNYpimSfj5IE6eW2auZ4aDPrU1i8Td8qiHOx8+QKZ5mohF3FykzXDEy+T377RkTSnjUhG/PuBRAQ9kM2vHmczbr5V3PnTeu+jdhR+HTGOQ`}),o[2]||=n(`<div class="hint-container warning"><p class="hint-container-title">headroom的预留</p><p>skb在分配时，内核会预留足够的headroom（通常是 <code>MAX_HEADER</code> 大小，约256字节），以避免在添加协议头时重新分配内存。如果headroom不足，<code>skb_realloc_headroom()</code> 会被调用，这会触发一次数据拷贝，是性能损耗点。在高性能场景中，应确保skb分配时有足够的headroom。</p></div><h3 id="skb-shared-info-分片与共享" tabindex="-1"><a class="header-anchor" href="#skb-shared-info-分片与共享"><span>skb_shared_info：分片与共享</span></a></h3><p>当数据量较大需要分片，或skb需要被多个接收者共享时，<code>skb_shared_info</code> 结构登场：</p><div class="language-c line-numbers-mode" data-highlighter="shiki" data-ext="c" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-c"><span class="line"><span style="color:#7F848E;font-style:italic;">// include/linux/skbuff.h - 简化版</span></span>
<span class="line"><span style="color:#C678DD;">struct</span><span style="color:#ABB2BF;"> skb_shared_info {</span></span>
<span class="line"><span style="color:#ABB2BF;">    __u8 flags;</span><span style="color:#7F848E;font-style:italic;">                   // 标志位</span></span>
<span class="line"><span style="color:#ABB2BF;">    __u8 meta_len;</span><span style="color:#7F848E;font-style:italic;">                // 元数据长度</span></span>
<span class="line"><span style="color:#ABB2BF;">    __u8 nr_frags;</span><span style="color:#7F848E;font-style:italic;">                // 分片数量（非线性部分）</span></span>
<span class="line"><span style="color:#ABB2BF;">    __u8 tx_flags;</span><span style="color:#7F848E;font-style:italic;">                // 发送标志</span></span>
<span class="line"><span style="color:#C678DD;">    unsigned</span><span style="color:#C678DD;"> short</span><span style="color:#ABB2BF;"> gso_size;</span><span style="color:#7F848E;font-style:italic;">      // GSO分片大小</span></span>
<span class="line"><span style="color:#C678DD;">    unsigned</span><span style="color:#C678DD;"> short</span><span style="color:#ABB2BF;"> gso_segs;</span><span style="color:#7F848E;font-style:italic;">      // GSO段数</span></span>
<span class="line"><span style="color:#C678DD;">    unsigned</span><span style="color:#C678DD;"> short</span><span style="color:#ABB2BF;"> gso_type;</span><span style="color:#7F848E;font-style:italic;">      // GSO类型</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> sk_buff </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">frag_list;</span><span style="color:#7F848E;font-style:italic;">    // 分片链表（skb链）</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> bio_vec </span><span style="color:#E06C75;">frags</span><span style="color:#ABB2BF;">[MAX_SKB_FRAGS];</span><span style="color:#7F848E;font-style:italic;"> // 分片数组（页面引用）</span></span>
<span class="line"><span style="color:#56B6C2;">    refcount_t</span><span style="color:#ABB2BF;"> dataref;</span><span style="color:#7F848E;font-style:italic;">           // 数据引用计数</span></span>
<span class="line"><span style="color:#C678DD;">    void</span><span style="color:#C678DD;"> *</span><span style="color:#ABB2BF;">destructor_arg;</span><span style="color:#7F848E;font-style:italic;">         // 析构函数参数</span></span>
<span class="line"><span style="color:#ABB2BF;">};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>分片的两种形式：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>形式1：页面分片（frags数组）</span></span>
<span class="line"><span>┌──────────────────────────────────┐</span></span>
<span class="line"><span>│ sk_buff                          │</span></span>
<span class="line"><span>│  head ──→ [线性数据区]           │</span></span>
<span class="line"><span>│  end ──→ [线性数据区结束]        │</span></span>
<span class="line"><span>│  shinfo.nr_frags = 3             │</span></span>
<span class="line"><span>│  shinfo.frags[0] → page1+offset+len │</span></span>
<span class="line"><span>│  shinfo.frags[1] → page2+offset+len │</span></span>
<span class="line"><span>│  shinfo.frags[2] → page3+offset+len │</span></span>
<span class="line"><span>└──────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>形式2：skb链表分片（frag_list）</span></span>
<span class="line"><span>┌────────────┐     ┌────────────┐     ┌────────────┐</span></span>
<span class="line"><span>│ sk_buff 1  │────→│ sk_buff 2  │────→│ sk_buff 3  │</span></span>
<span class="line"><span>│ (主skb)    │     │ (分片1)    │     │ (分片2)    │</span></span>
<span class="line"><span>└────────────┘     └────────────┘     └────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>len = 线性数据 + frags数据 + frag_list数据</span></span>
<span class="line"><span>data_len = frags数据 + frag_list数据（非线性部分）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">skb_clone与skb_copy的区别</p><ul><li><code>skb_clone()</code>：只克隆skb结构体本身，数据区共享。适用于需要独立修改元数据但共享数据的场景（如组播复制）。</li><li><code>skb_copy()</code>：完全拷贝，包括数据区。适用于需要修改数据内容的场景。</li></ul><p>克隆时 <code>users</code> 计数加1，数据区共享时 <code>dataref</code> 计数加1。只有当两个计数都归零时，内存才会被释放。</p></div><hr><h2 id="tcp连接管理" tabindex="-1"><a class="header-anchor" href="#tcp连接管理"><span>TCP连接管理</span></a></h2><p>TCP是互联网最核心的传输协议，Linux内核中的TCP实现超过10万行代码。本节聚焦连接管理和拥塞控制的内核实现。</p><h3 id="三次握手的内核实现" tabindex="-1"><a class="header-anchor" href="#三次握手的内核实现"><span>三次握手的内核实现</span></a></h3><p>TCP三次握手看似简单——SYN、SYN-ACK、ACK，但内核实现中涉及两个关键队列和复杂的状态管理。</p>`,12),i(d,{code:`eJx1UU9LAkEcvfcp5piohFdJQdYOYQi2EXSSbVlCJLXdNfSmkLX+j1CTFGsjQyjMQ1mo4JdxZt2TX6GZXTNHa66/9968P5JwFhcivOANcScid7oB8ItxohziQzEuIgMGcBKA3UekfGovb2tn1kfuqFmEORXf2SgfFuR1VICgpGQkiD+LC9vH4pZ7ExZz03ELldp6/R4qt5Y1lsdgcTwvxGSKmOnQRIPpj8oCiJ4LImBsnoATTL6y6FVFZRVl87BbQNV39JHWOnkTzdjdbtbnBOyRfzZScAmuxGyUXREiAC3XR6k02NtlD3b8xp31ES7+ASoNOByIpEBJDko4+mxUgLkHmGkvoq4qEhqdW6+O4eDZ6vjRxuKM4cvuYXxzb0kbriHsSlgdf5tEtR52QhzM7WJ6cJ859NJhTUGilPxXqdKHSm+5O9RMweuSdneB2XT+ybC0yAnLNXhFdfGLJWuYXZk7UE0tz7vix+DRW1Nl0c5h5Um/vDHlNi16fQjVFnY9HTfI6N/Xk0Co`}),o[3]||=n(`<h4 id="两个关键队列" tabindex="-1"><a class="header-anchor" href="#两个关键队列"><span>两个关键队列</span></a></h4><div class="language-c line-numbers-mode" data-highlighter="shiki" data-ext="c" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-c"><span class="line"><span style="color:#7F848E;font-style:italic;">// include/net/inet_connection_sock.h</span></span>
<span class="line"><span style="color:#C678DD;">struct</span><span style="color:#ABB2BF;"> inet_connection_sock {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // ...</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> request_sock_queue icsk_accept_queue;</span><span style="color:#7F848E;font-style:italic;"> // 全连接队列</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // ...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 半连接队列相关</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> listen_sock </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">icsk_listen_opt;</span></span>
<span class="line"><span style="color:#ABB2BF;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">struct</span><span style="color:#ABB2BF;"> listen_sock {</span></span>
<span class="line"><span style="color:#ABB2BF;">    u8 max_qlen_log;</span><span style="color:#7F848E;font-style:italic;">           // 队列长度对数</span></span>
<span class="line"><span style="color:#C678DD;">    int</span><span style="color:#ABB2BF;"> qlen;</span><span style="color:#7F848E;font-style:italic;">                  // 当前半连接队列长度</span></span>
<span class="line"><span style="color:#C678DD;">    int</span><span style="color:#ABB2BF;"> qlen_young;</span><span style="color:#7F848E;font-style:italic;">            // 未重传SYN-ACK的连接数</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> request_sock </span><span style="color:#C678DD;">*</span><span style="color:#E06C75;">syn_table</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;">];</span><span style="color:#7F848E;font-style:italic;"> // 哈希表（半连接队列）</span></span>
<span class="line"><span style="color:#ABB2BF;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">struct</span><span style="color:#ABB2BF;"> request_sock_queue {</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> request_sock </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">rskq_accept_head;</span><span style="color:#7F848E;font-style:italic;">  // 全连接队列头</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> request_sock </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">rskq_accept_tail;</span><span style="color:#7F848E;font-style:italic;">  // 全连接队列尾</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // ...</span></span>
<span class="line"><span style="color:#ABB2BF;">};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">两个队列的区别与调优</p><ul><li><strong>syn_queue（半连接队列）</strong>：存储收到SYN但尚未完成三次握手的连接。大小由 <code>tcp_max_syn_backlog</code> 控制（默认1024）。当队列满时，新的SYN会被丢弃（不发送RST），客户端会超时重传。</li><li><strong>accept_queue（全连接队列）</strong>：存储已完成三次握手但尚未被应用accept()的连接。大小为 <code>min(backlog, somaxconn)</code>，其中backlog是listen()调用参数，somaxconn是系统限制（默认4096）。</li></ul><p>当全连接队列满时，内核行为由 <code>tcp_abort_on_overflow</code> 控制：</p><ul><li>0（默认）：丢弃ACK，等待客户端重传</li><li>1：发送RST，立即断开</li></ul></div><h4 id="三次握手的内核代码路径" tabindex="-1"><a class="header-anchor" href="#三次握手的内核代码路径"><span>三次握手的内核代码路径</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>客户端主动连接：</span></span>
<span class="line"><span>  connect()</span></span>
<span class="line"><span>    → __inet_stream_connect()</span></span>
<span class="line"><span>      → tcp_v4_connect()           // 构造SYN，发送</span></span>
<span class="line"><span>        → tcp_connect()            // 初始化seq，设置TCP_SYN_SENT</span></span>
<span class="line"><span>          → tcp_transmit_skb()     // 发送SYN包</span></span>
<span class="line"><span></span></span>
<span class="line"><span>服务端被动打开：</span></span>
<span class="line"><span>  listen()</span></span>
<span class="line"><span>    → inet_listen()</span></span>
<span class="line"><span>      → inet_csk_listen_start()</span></span>
<span class="line"><span>        → 初始化icsk_accept_queue和icsk_listen_opt</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  收到SYN（中断上下文）：</span></span>
<span class="line"><span>    → tcp_v4_rcv()</span></span>
<span class="line"><span>      → tcp_v4_do_rcv()</span></span>
<span class="line"><span>        → tcp_rcv_state_process()</span></span>
<span class="line"><span>          → tcp_v4_conn_request()  // 创建request_sock</span></span>
<span class="line"><span>            → inet_csk_reqsk_queue_hash_add()  // 加入syn_queue</span></span>
<span class="line"><span>            → tcp_v4_send_synack() // 发送SYN-ACK</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  收到ACK（完成握手）：</span></span>
<span class="line"><span>    → tcp_v4_rcv()</span></span>
<span class="line"><span>      → tcp_check_req()           // 查找syn_queue中的request_sock</span></span>
<span class="line"><span>        → tcp_v4_syn_recv_sock()  // 创建完整sock</span></span>
<span class="line"><span>          → inet_csk_reqsk_queue_add()  // 移入accept_queue</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  应用accept()：</span></span>
<span class="line"><span>    → inet_accept()</span></span>
<span class="line"><span>      → inet_csk_accept()</span></span>
<span class="line"><span>        → 从accept_queue取出sock返回</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="syn-flood防御-syn-cookie" tabindex="-1"><a class="header-anchor" href="#syn-flood防御-syn-cookie"><span>SYN Flood防御：SYN Cookie</span></a></h3><p>SYN Flood攻击的原理是发送大量伪造源IP的SYN包，填满syn_queue，使正常连接无法建立。SYN Cookie是一种不占用队列的防御机制：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>正常模式：</span></span>
<span class="line"><span>  收到SYN → 分配request_sock → 加入syn_queue → 发送SYN-ACK</span></span>
<span class="line"><span>  问题：攻击时syn_queue被填满，内存耗尽</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SYN Cookie模式（tcp_syncookies=1）：</span></span>
<span class="line"><span>  收到SYN → 不分配request_sock → 计算cookie值</span></span>
<span class="line"><span>         → cookie编码在SYN-ACK的seq中</span></span>
<span class="line"><span>         → 收到ACK时，从ack-1反算出cookie</span></span>
<span class="line"><span>         → 验证通过才创建sock</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  cookie = M + H(src_ip, dst_ip, src_port, dst_port, M, secret)</span></span>
<span class="line"><span>  其中M是时间戳（每64秒递增），H是哈希函数</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">SYN Cookie的代价</p><p>SYN Cookie模式下无法使用TCP扩展选项（如Window Scale、SACK、Timestamp），因为这些信息在半连接队列中保存，而Cookie模式不保存任何状态。这可能导致已建立连接的性能下降。因此SYN Cookie应作为最后的防线，而非默认方案。更好的做法是增大 <code>tcp_max_syn_backlog</code>、开启 <code>tcp_syncookies=2</code>（仅在队列满时启用）。</p></div><h3 id="四次挥手与time-wait" tabindex="-1"><a class="header-anchor" href="#四次挥手与time-wait"><span>四次挥手与TIME_WAIT</span></a></h3>`,10),i(d,{code:`eJwrTi0sTc1LTnXJTEwvSszlUgCCgsSikszkzILEvBIFR4XEYoUnO3Y/7VrxtHXzy+lrn03biaEoAKToxaLVKIrAqvzyS1IV8stSixQcdQKsFJ7Onv1szcJnPUufdXY/29r4fEU3RJmjrp0dUNrN0+/9ng6gk2xz3+/pRDcALB8f7ugZEm8IlgvQBWoDCjs6ewO1JSZn2+ZqG+LXaIQmB7TU2cc/2BUsi+5kkIN3TXk+ZcWLDc1AMjknvzhVQxNqNdhmhIPzMO0FavdxDA6JBzoP6kmILxHOzcPmXJiTXDC9EeLpC3EpUL+Rb7APSDOmqudrO5/uawXJP53Qp/CobRLMPAA1Y7Le`}),o[4]||=n(`<h4 id="time-wait的作用" tabindex="-1"><a class="header-anchor" href="#time-wait的作用"><span>TIME_WAIT的作用</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>TIME_WAIT持续2MSL（Maximum Segment Lifetime）的原因：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 确保最后的ACK能到达被动方</span></span>
<span class="line"><span>   如果ACK丢失，被动方会重传FIN，主动方可以重传ACK</span></span>
<span class="line"><span>   如果直接CLOSED，收到重传FIN时会发RST，导致被动方出错</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 等待网络中残留的延迟报文消亡</span></span>
<span class="line"><span>   避免新连接收到旧连接的延迟数据</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   场景举例：</span></span>
<span class="line"><span>   连接1: A:5000 → B:80  (seq=1000)</span></span>
<span class="line"><span>   连接1关闭后立即复用相同四元组：</span></span>
<span class="line"><span>   连接2: A:5000 → B:80  (seq=100)</span></span>
<span class="line"><span>   如果连接1的延迟包到达，seq=1000可能被连接2误接受</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="time-wait的内核实现" tabindex="-1"><a class="header-anchor" href="#time-wait的内核实现"><span>TIME_WAIT的内核实现</span></a></h4><div class="language-c line-numbers-mode" data-highlighter="shiki" data-ext="c" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-c"><span class="line"><span style="color:#7F848E;font-style:italic;">// TIME_WAIT状态的sock不使用完整的struct sock</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 而是使用更轻量的struct inet_timewait_sock</span></span>
<span class="line"><span style="color:#C678DD;">struct</span><span style="color:#ABB2BF;"> inet_timewait_sock {</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> sock_common __tw_common;</span><span style="color:#7F848E;font-style:italic;">  // 公共部分</span></span>
<span class="line"><span style="color:#C678DD;">    int</span><span style="color:#ABB2BF;"> tw_timeout;</span><span style="color:#7F848E;font-style:italic;">                  // 超时时间（以jiffies为单位）</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> inet_bind_bucket </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">tw_tb;</span><span style="color:#7F848E;font-style:italic;">  // 绑定桶（端口占用信息）</span></span>
<span class="line"><span style="color:#ABB2BF;">};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">TIME_WAIT优化参数</p><ul><li><code>tcp_tw_reuse=1</code>：允许将TIME_WAIT状态的连接用于新的出站连接（仅对客户端有效）。通过Timestamp选项验证延迟报文。</li><li><code>tcp_tw_recycle=1</code>（已废弃，Linux 4.12移除）：快速回收TIME_WAIT连接。因在NAT环境下会导致连接失败而被移除。</li><li><code>tcp_max_tw_buckets</code>：TIME_WAIT桶的最大数量（默认32768），超出后直接关闭连接。</li><li><code>tcp_fin_timeout</code>：FIN_WAIT_2状态超时时间（默认60秒）。</li></ul><div class="hint-container warning"><p class="hint-container-title">生产环境建议</p><p><strong>绝不推荐</strong>通过调低 <code>tcp_fin_timeout</code> 或设置 <code>tcp_tw_recycle</code> 来&quot;解决&quot;TIME_WAIT过多的问题。正确做法：</p><ol><li>使用长连接（连接池），减少短连接</li><li>客户端开启 <code>tcp_tw_reuse=1</code></li><li>服务端通过 <code>SO_REUSEADDR</code> 允许地址复用</li><li>增大客户端可用端口范围 <code>ip_local_port_range</code></li></ol></div></div><h3 id="tcp拥塞控制" tabindex="-1"><a class="header-anchor" href="#tcp拥塞控制"><span>TCP拥塞控制</span></a></h3><p>拥塞控制是TCP最核心的算法之一，它决定了数据发送的速率，直接影响网络吞吐量和公平性。</p>`,7),i(d,{code:`eJyFkk9LAkEYxu9+isGOIaYmlKhhppcKY3eJQCTSZlEQAxUk2kAPoqSSh8xOVvaXOuglkQg8+E3CmfJb9M7srq4S5UV9n9nn9zzvrJw8ysXiB+ksktZNCD6i5BOksJkW26TeIWfP7mja6o3lUofIgxKpRHaf/ebDTCYbT+NMHITPcsscQRaLF4niCT/sRrq8dmpSjUV2QKFXHQUF9nYAUS3RRpe0W+PGgBvSzvmo/+Lzb7oQ91j0oG1R1CVBkrT5sIns5gg3BSMNOwMh9UcF+XY3AFJ5ILetcWFAijXu9PU+oPmnf6kMAl/WSduZBOoZyMChAOIhtkLQnt7l6VuFlLujfptUi1p5JvFkDmCNSzVyXwMiNyaDVxiMPm4UFBTCZvY3f61O5tfM2Fa78UYm4iJyDJuGTEGBRxICft2SFtpANVSexPhl3Rc9aEAvu1N1ytJWD9YcAe3nOn73irTZ40aCFFKQFJp/n/7sZNN2yzylkHq97KVUKZnscRKrAyQnkknXArbJThkbRHYfmrQiO/GqQYK1qIosyw68ZFBYHU2K4WUcM0gQQn8IRzE2/QDMVC9+`}),o[5]||=n(`<h4 id="慢启动-slow-start" tabindex="-1"><a class="header-anchor" href="#慢启动-slow-start"><span>慢启动（Slow Start）</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>慢启动不是&quot;慢&quot;，而是&quot;从慢开始，指数增长&quot;：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RTT 0: cwnd = 10 (init_cwnd)</span></span>
<span class="line"><span>RTT 1: cwnd = 20  (收到10个ACK，每个+MSS)</span></span>
<span class="line"><span>RTT 2: cwnd = 40</span></span>
<span class="line"><span>RTT 3: cwnd = 80</span></span>
<span class="line"><span>RTT 4: cwnd = 160</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>增长速度极快！在带宽1Gbps、RTT=10ms的链路上：</span></span>
<span class="line"><span>  4个RTT（40ms）即可填满管道（假设无丢包）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Linux初始拥塞窗口（init_cwnd）的演进：</span></span>
<span class="line"><span>  2.6.39之前：3 MSS（RFC 3390）</span></span>
<span class="line"><span>  2.6.39之后：10 MSS（Google建议，RFC 6928）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="拥塞避免-congestion-avoidance" tabindex="-1"><a class="header-anchor" href="#拥塞避免-congestion-avoidance"><span>拥塞避免（Congestion Avoidance）</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>当cwnd &gt;= ssthresh时，从指数增长切换到线性增长：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>每个ACK: cwnd += MSS × MSS / cwnd</span></span>
<span class="line"><span>每RTT:   cwnd += MSS</span></span>
<span class="line"><span></span></span>
<span class="line"><span>这是一种AIMD（Additive Increase Multiplicative Decrease）策略：</span></span>
<span class="line"><span>- 加性增：线性探测可用带宽</span></span>
<span class="line"><span>- 乘性减：丢包时窗口减半</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AIMD保证了：</span></span>
<span class="line"><span>1. 收敛性：多个TCP流最终会公平共享带宽</span></span>
<span class="line"><span>2. 稳定性：不会持续震荡</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="快速重传与快速恢复-fast-retransmit-fast-recovery" tabindex="-1"><a class="header-anchor" href="#快速重传与快速恢复-fast-retransmit-fast-recovery"><span>快速重传与快速恢复（Fast Retransmit &amp; Fast Recovery）</span></a></h4><div class="language-c line-numbers-mode" data-highlighter="shiki" data-ext="c" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-c"><span class="line"><span style="color:#7F848E;font-style:italic;">// net/ipv4/tcp_input.c - 简化逻辑</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 收到3个重复ACK时触发快速重传</span></span>
<span class="line"><span style="color:#C678DD;">static</span><span style="color:#C678DD;"> void</span><span style="color:#61AFEF;"> tcp_fastretrans_alert</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">struct</span><span style="color:#E06C75;"> sock </span><span style="color:#C678DD;">*</span><span style="color:#E06C75;font-style:italic;">sk</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> tcp_sock </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">tp </span><span style="color:#C678DD;">=</span><span style="color:#61AFEF;"> tcp_sk</span><span style="color:#ABB2BF;">(sk);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 快速重传</span></span>
<span class="line"><span style="color:#E5C07B;">    tp</span><span style="color:#ABB2BF;">-&gt;</span><span style="color:#E06C75;">ssthresh</span><span style="color:#C678DD;"> =</span><span style="color:#61AFEF;"> tcp_current_ssthresh</span><span style="color:#ABB2BF;">(sk);</span><span style="color:#7F848E;font-style:italic;">  // 保存当前阈值</span></span>
<span class="line"><span style="color:#E5C07B;">    tp</span><span style="color:#ABB2BF;">-&gt;</span><span style="color:#E06C75;">ssthresh</span><span style="color:#C678DD;"> =</span><span style="color:#61AFEF;"> max</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">tp</span><span style="color:#ABB2BF;">-&gt;</span><span style="color:#E06C75;">snd_cwnd</span><span style="color:#C678DD;"> &gt;&gt;</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">2</span><span style="color:#ABB2BF;">);</span><span style="color:#7F848E;font-style:italic;"> // ssthresh = cwnd/2</span></span>
<span class="line"><span style="color:#E5C07B;">    tp</span><span style="color:#ABB2BF;">-&gt;</span><span style="color:#E06C75;">snd_cwnd</span><span style="color:#C678DD;"> =</span><span style="color:#E5C07B;"> tp</span><span style="color:#ABB2BF;">-&gt;</span><span style="color:#E06C75;">ssthresh</span><span style="color:#C678DD;"> +</span><span style="color:#D19A66;"> 3</span><span style="color:#ABB2BF;">;</span><span style="color:#7F848E;font-style:italic;">          // cwnd = ssthresh + 3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 重传丢失的段</span></span>
<span class="line"><span style="color:#61AFEF;">    tcp_retransmit_skb</span><span style="color:#ABB2BF;">(sk, </span><span style="color:#61AFEF;">tcp_write_queue_head</span><span style="color:#ABB2BF;">(sk));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 进入快速恢复</span></span>
<span class="line"><span style="color:#E5C07B;">    tp</span><span style="color:#ABB2BF;">-&gt;</span><span style="color:#E06C75;">snd_cwnd_cnt</span><span style="color:#C678DD;"> =</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#61AFEF;">    tcp_enter_recovery</span><span style="color:#ABB2BF;">(sk);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 快速恢复中收到重复ACK</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 每个重复ACK说明有一个包离开了网络</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// cwnd += MSS（允许发送新数据）</span></span>
<span class="line"><span style="color:#C678DD;">static</span><span style="color:#C678DD;"> void</span><span style="color:#61AFEF;"> tcp_process_tse_ack</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">struct</span><span style="color:#E06C75;"> sock </span><span style="color:#C678DD;">*</span><span style="color:#E06C75;font-style:italic;">sk</span><span style="color:#ABB2BF;">,</span><span style="color:#E06C75;"> u32 </span><span style="color:#E06C75;font-style:italic;">prior_snd_una</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> tcp_sock </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">tp </span><span style="color:#C678DD;">=</span><span style="color:#61AFEF;"> tcp_sk</span><span style="color:#ABB2BF;">(sk);</span></span>
<span class="line"><span style="color:#E5C07B;">    tp</span><span style="color:#ABB2BF;">-&gt;</span><span style="color:#E06C75;">snd_cwnd</span><span style="color:#C678DD;">++</span><span style="color:#ABB2BF;">;</span><span style="color:#7F848E;font-style:italic;">  // 每个重复ACK加1</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 收到新ACK，退出快速恢复</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// cwnd = ssthresh（恢复到拥塞避免状态）</span></span>
<span class="line"><span style="color:#C678DD;">static</span><span style="color:#C678DD;"> void</span><span style="color:#61AFEF;"> tcp_complete_cwr</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">struct</span><span style="color:#E06C75;"> sock </span><span style="color:#C678DD;">*</span><span style="color:#E06C75;font-style:italic;">sk</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> tcp_sock </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">tp </span><span style="color:#C678DD;">=</span><span style="color:#61AFEF;"> tcp_sk</span><span style="color:#ABB2BF;">(sk);</span></span>
<span class="line"><span style="color:#E5C07B;">    tp</span><span style="color:#ABB2BF;">-&gt;</span><span style="color:#E06C75;">snd_cwnd</span><span style="color:#C678DD;"> =</span><span style="color:#E5C07B;"> tp</span><span style="color:#ABB2BF;">-&gt;</span><span style="color:#E06C75;">ssthresh</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="内核支持的拥塞控制算法" tabindex="-1"><a class="header-anchor" href="#内核支持的拥塞控制算法"><span>内核支持的拥塞控制算法</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看可用算法</span></span>
<span class="line"><span style="color:#61AFEF;">sysctl</span><span style="color:#98C379;"> net.ipv4.tcp_available_congestion_control</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出: cubic reno bbr</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看当前算法</span></span>
<span class="line"><span style="color:#61AFEF;">sysctl</span><span style="color:#98C379;"> net.ipv4.tcp_congestion_control</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出: cubic</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 切换算法</span></span>
<span class="line"><span style="color:#61AFEF;">sysctl</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> net.ipv4.tcp_congestion_control=bbr</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table><thead><tr><th>算法</th><th>特点</th><th>适用场景</th></tr></thead><tbody><tr><td>Reno</td><td>经典AIMD，丢包即减窗</td><td>短距离、低延迟</td></tr><tr><td>Cubic</td><td>默认算法，W(t)=0.4×(t-0.4)³+wmax</td><td>长肥网络（高BDP）</td></tr><tr><td>BBR</td><td>基于带宽和RTT模型，不以丢包为信号</td><td>高丢包率、深队列</td></tr><tr><td>DCTCP</td><td>基于ECN的拥塞控制</td><td>数据中心内部</td></tr></tbody></table><div class="hint-container tip"><p class="hint-container-title">BBR vs Cubic</p><p>Cubic以丢包为拥塞信号，在无线网络（随机丢包）或深队列网络中性能不佳。BBR通过测量实际带宽和RTT来控制发送速率，不再依赖丢包判断拥塞。在YouTube的部署中，BBR将吞吐量提升了4-100倍。但BBR在Bufferbloat环境下可能过于激进，需要根据场景选择。</p></div><hr><h2 id="netfilter框架" tabindex="-1"><a class="header-anchor" href="#netfilter框架"><span>Netfilter框架</span></a></h2><p>Netfilter是Linux内核的网络包过滤框架，是防火墙、NAT、负载均衡等功能的基石。iptables和nftables都是基于Netfilter构建的用户态工具。</p><h3 id="五个hook点" tabindex="-1"><a class="header-anchor" href="#五个hook点"><span>五个Hook点</span></a></h3>`,14),i(d,{code:`eJxLy8kvT85ILCpR8AniUgCC4tKk9KLEggyFZ1M3POtd97Sn9dnWxqetS19sX/90XwtYCQj4eTrHB0VEP9878Wnvwmd9S59N2RaroKtrpxAQ5BoUreTnFu/p5xoSD+TFB/mHhnj6udskFenbeeTnZz9v2mmoFAs3CaQBrBOkzrUaaM/zKRufdix5Nm1tLVwRWA6kquZp/8Sn+xqezVnzbM6uGgVPvwCEZT7+zo4+QCayTUZINiEMebF3DdCcGgW3cBeEdjf/oHDHIBdk3cZIuoFWgZ0JtiUa6ICncza82D/7+YpuhBqgeZBA8A8OQQoEIA9bKJgihwJQDVgrKGBDYAELdOTLhkaIqtS8FC4cMQQKk/ZdaDEEdqcRqkPBNgAdgh5mQCFkh5kgOQwohYgdI3zRYwT3uhHpfodohnjeCK/vSypzUiGJJi0zJ8dKOdU4zSgtBUkOFFFQKYs001RLJClQ/ECk0tLSjFMNkKRA/oRKJaeapCYjWwaKG6iccappmikXAM4NIQM=`}),o[6]||=n(`<p>五个Hook点详解：</p><table><thead><tr><th>Hook点</th><th>位置</th><th>触发时机</th><th>典型用途</th></tr></thead><tbody><tr><td><code>NF_INET_PRE_ROUTING</code></td><td>路由之前</td><td>所有进入的数据包（包括转发包）</td><td>DNAT、早期过滤、连接跟踪</td></tr><tr><td><code>NF_INET_LOCAL_IN</code></td><td>路由之后</td><td>发往本机的包</td><td>入站过滤、安全策略</td></tr><tr><td><code>NF_INET_FORWARD</code></td><td>转发路径</td><td>经本机转发的包</td><td>转发过滤、NAT</td></tr><tr><td><code>NF_INET_LOCAL_OUT</code></td><td>路由之前</td><td>本机发出的包</td><td>出站过滤、SNAT</td></tr><tr><td><code>NF_INET_POST_ROUTING</code></td><td>路由之后</td><td>所有发出的数据包（包括转发包）</td><td>SNAT（源地址转换）、MASQUERADE</td></tr></tbody></table><h3 id="hook注册与回调" tabindex="-1"><a class="header-anchor" href="#hook注册与回调"><span>Hook注册与回调</span></a></h3><div class="language-c line-numbers-mode" data-highlighter="shiki" data-ext="c" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-c"><span class="line"><span style="color:#7F848E;font-style:italic;">// net/netfilter/core.c</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 注册Hook回调函数</span></span>
<span class="line"><span style="color:#C678DD;">int</span><span style="color:#61AFEF;"> nf_register_net_hook</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">struct</span><span style="color:#E06C75;"> net </span><span style="color:#C678DD;">*</span><span style="color:#E06C75;font-style:italic;">net</span><span style="color:#ABB2BF;">,</span><span style="color:#C678DD;"> const</span><span style="color:#C678DD;"> struct</span><span style="color:#E06C75;"> nf_hook_ops </span><span style="color:#C678DD;">*</span><span style="color:#E06C75;font-style:italic;">reg</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">struct</span><span style="color:#ABB2BF;"> nf_hook_ops {</span></span>
<span class="line"><span style="color:#ABB2BF;">    nf_hookfn </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">hook;</span><span style="color:#7F848E;font-style:italic;">          // 回调函数</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> net_device </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">dev;</span><span style="color:#7F848E;font-style:italic;">   // 关联的网卡（NULL表示所有）</span></span>
<span class="line"><span style="color:#C678DD;">    void</span><span style="color:#C678DD;"> *</span><span style="color:#ABB2BF;">priv;</span><span style="color:#7F848E;font-style:italic;">               // 私有数据</span></span>
<span class="line"><span style="color:#56B6C2;">    u_int8_t</span><span style="color:#ABB2BF;"> pf;</span><span style="color:#7F848E;font-style:italic;">              // 协议族（NFPROTO_IPV4等）</span></span>
<span class="line"><span style="color:#C678DD;">    unsigned</span><span style="color:#C678DD;"> int</span><span style="color:#ABB2BF;"> hooknum;</span><span style="color:#7F848E;font-style:italic;">     // Hook点编号</span></span>
<span class="line"><span style="color:#C678DD;">    int</span><span style="color:#ABB2BF;"> priority;</span><span style="color:#7F848E;font-style:italic;">             // 优先级（越小越先执行）</span></span>
<span class="line"><span style="color:#ABB2BF;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 回调函数的返回值决定包的命运</span></span>
<span class="line"><span style="color:#C678DD;">#define</span><span style="color:#61AFEF;"> NF_DROP</span><span style="color:#D19A66;">   0</span><span style="color:#7F848E;font-style:italic;">  // 丢弃数据包</span></span>
<span class="line"><span style="color:#C678DD;">#define</span><span style="color:#61AFEF;"> NF_ACCEPT</span><span style="color:#D19A66;"> 1</span><span style="color:#7F848E;font-style:italic;">  // 继续正常处理</span></span>
<span class="line"><span style="color:#C678DD;">#define</span><span style="color:#61AFEF;"> NF_STOLEN</span><span style="color:#D19A66;"> 2</span><span style="color:#7F848E;font-style:italic;">  // 包被接管（不再继续处理）</span></span>
<span class="line"><span style="color:#C678DD;">#define</span><span style="color:#61AFEF;"> NF_QUEUE</span><span style="color:#D19A66;">  3</span><span style="color:#7F848E;font-style:italic;">  // 将包送入用户空间处理</span></span>
<span class="line"><span style="color:#C678DD;">#define</span><span style="color:#61AFEF;"> NF_REPEAT</span><span style="color:#D19A66;"> 4</span><span style="color:#7F848E;font-style:italic;">  // 重新调用当前Hook</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="iptables规则匹配流程" tabindex="-1"><a class="header-anchor" href="#iptables规则匹配流程"><span>iptables规则匹配流程</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>iptables规则组织结构：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  Table（表）</span></span>
<span class="line"><span>    ├── Chain（链）—— 对应Netfilter Hook点</span></span>
<span class="line"><span>    │     ├── Rule 1（规则）</span></span>
<span class="line"><span>    │     │     ├── Match条件（-s/-d/-p/--dport等）</span></span>
<span class="line"><span>    │     │     └── Target动作（ACCEPT/DROP/REJECT/DNAT/SNAT等）</span></span>
<span class="line"><span>    │     ├── Rule 2</span></span>
<span class="line"><span>    │     └── Rule 3</span></span>
<span class="line"><span>    └── Chain</span></span>
<span class="line"><span>          └── ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>五个内置表：</span></span>
<span class="line"><span>  filter  — 过滤（INPUT/FORWARD/OUTPUT）</span></span>
<span class="line"><span>  nat     — 地址转换（PREROUTING/OUTPUT/POSTROUTING/INPUT）</span></span>
<span class="line"><span>  mangle  — 修改包头（所有5个链）</span></span>
<span class="line"><span>  raw     — 连接跟踪豁免（PREROUTING/OUTPUT）</span></span>
<span class="line"><span>  security — SELinux安全标记</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,6),i(d,{code:`eJx9kstKw0AUhvc+RdC1aBMLKqIEG6WoaUhHXAxFYk1UjBViQCQVdCEK3vGCYFEEFREvFRcVwfZpkk7fwrkkbdqSZjFhzv9zzjczv2Gub2aXNcvmQKKLw58yBaB3VfSOP9yjvQzX2zvKKaqkQrKkZkFSnqxdlDPMikvUoIpzMcfSNtHDy9g2lUiFSHnv5jPPjYP59FRSgaj0jSr72fVczra07CrrUre6Z8/EClHlzjt5QqV79PPa4h0HdN6MKE9OSzFnTcstmXpjql+nHlkEMac7p9lYHlmw+kYTuDLWzYxEZOT4SJKDSp/Vyy/34NG7ft/uYlREYFin5255xyu8eYXfPJeUlVkA6Vq/B7oLgfERYDz1TCSngaTGHGPFtHWr4fHr1CMqCsQT3UIRVW6rL4eZVij094a58txESp0T1QT0/3Ukfx+CEiKghBAUHwHFwJVUGjAOjEcrGIfcBvvVZ7NtEAy+LRisG5s+EEE1ELwh3+kNwxcqRLCz8xF2SJZwhlmIcTEEFI8AigdAQhNQuhmIDUtLcgLi56nt7PpDNuwtUyfpxYzmcI8uGLyxGFJoHplmGIag9zdrQpQWZMZvO2jE9aE2me8sB819+R9+ClR8`}),o[7]||=n(`<h3 id="nftables-iptables的继任者" tabindex="-1"><a class="header-anchor" href="#nftables-iptables的继任者"><span>nftables：iptables的继任者</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>iptables的问题：</span></span>
<span class="line"><span>  ✗ 规则线性匹配，O(n)复杂度</span></span>
<span class="line"><span>  ✗ 每条规则独立，无法批量操作</span></span>
<span class="line"><span>  ✗ 多表多链，配置复杂</span></span>
<span class="line"><span>  ✗ 扩展需要内核模块</span></span>
<span class="line"><span></span></span>
<span class="line"><span>nftables的改进：</span></span>
<span class="line"><span>  ✓ 支持集合和字典，O(1)查找</span></span>
<span class="line"><span>  ✓ 统一的语法，不再区分表/链</span></span>
<span class="line"><span>  ✓ 字节码虚拟机，灵活的表达式</span></span>
<span class="line"><span>  ✓ 原子操作，无中间状态</span></span>
<span class="line"><span></span></span>
<span class="line"><span>nftables示例：</span></span>
<span class="line"><span>  # 定义集合</span></span>
<span class="line"><span>  nft add set inet filter blackhole { type ipv4_addr\\; flags interval\\; }</span></span>
<span class="line"><span>  nft add element inet filter blackhole { 192.168.1.0/24 }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # 使用集合匹配（O(1)查找）</span></span>
<span class="line"><span>  nft add rule inet filter input ip saddr @blackhole drop</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # 等效的iptables命令（O(n)匹配）</span></span>
<span class="line"><span>  iptables -A INPUT -s 192.168.1.0/24 -j DROP</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="连接跟踪conntrack" tabindex="-1"><a class="header-anchor" href="#连接跟踪conntrack"><span>连接跟踪conntrack</span></a></h2><p>conntrack是Netfilter框架的核心子系统，它跟踪所有网络连接的状态，为NAT和状态防火墙提供基础。</p><h3 id="conntrack核心概念" tabindex="-1"><a class="header-anchor" href="#conntrack核心概念"><span>conntrack核心概念</span></a></h3><div class="language-c line-numbers-mode" data-highlighter="shiki" data-ext="c" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-c"><span class="line"><span style="color:#7F848E;font-style:italic;">// include/uapi/linux/netfilter/nf_conntrack_common.h</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 连接状态枚举</span></span>
<span class="line"><span style="color:#C678DD;">enum</span><span style="color:#ABB2BF;"> ip_conntrack_status {</span></span>
<span class="line"><span style="color:#ABB2BF;">    IPS_EXPECTED     </span><span style="color:#C678DD;">=</span><span style="color:#ABB2BF;"> (</span><span style="color:#D19A66;">1</span><span style="color:#C678DD;"> &lt;&lt;</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">),</span><span style="color:#7F848E;font-style:italic;">  // 预期连接</span></span>
<span class="line"><span style="color:#ABB2BF;">    IPS_SEEN_REPLY   </span><span style="color:#C678DD;">=</span><span style="color:#ABB2BF;"> (</span><span style="color:#D19A66;">1</span><span style="color:#C678DD;"> &lt;&lt;</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">),</span><span style="color:#7F848E;font-style:italic;">  // 已看到双向流量</span></span>
<span class="line"><span style="color:#ABB2BF;">    IPS_ASSURED      </span><span style="color:#C678DD;">=</span><span style="color:#ABB2BF;"> (</span><span style="color:#D19A66;">1</span><span style="color:#C678DD;"> &lt;&lt;</span><span style="color:#D19A66;"> 2</span><span style="color:#ABB2BF;">),</span><span style="color:#7F848E;font-style:italic;">  // 连接已确认（不会被提前回收）</span></span>
<span class="line"><span style="color:#ABB2BF;">    IPS_SRC_NAT      </span><span style="color:#C678DD;">=</span><span style="color:#ABB2BF;"> (</span><span style="color:#D19A66;">1</span><span style="color:#C678DD;"> &lt;&lt;</span><span style="color:#D19A66;"> 3</span><span style="color:#ABB2BF;">),</span><span style="color:#7F848E;font-style:italic;">  // 源NAT</span></span>
<span class="line"><span style="color:#ABB2BF;">    IPS_DST_NAT      </span><span style="color:#C678DD;">=</span><span style="color:#ABB2BF;"> (</span><span style="color:#D19A66;">1</span><span style="color:#C678DD;"> &lt;&lt;</span><span style="color:#D19A66;"> 4</span><span style="color:#ABB2BF;">),</span><span style="color:#7F848E;font-style:italic;">  // 目的NAT</span></span>
<span class="line"><span style="color:#ABB2BF;">    IPS_SEQ_ADJUST   </span><span style="color:#C678DD;">=</span><span style="color:#ABB2BF;"> (</span><span style="color:#D19A66;">1</span><span style="color:#C678DD;"> &lt;&lt;</span><span style="color:#D19A66;"> 5</span><span style="color:#ABB2BF;">),</span><span style="color:#7F848E;font-style:italic;">  // 序列号调整</span></span>
<span class="line"><span style="color:#ABB2BF;">    IPS_SRC_NAT_DONE </span><span style="color:#C678DD;">=</span><span style="color:#ABB2BF;"> (</span><span style="color:#D19A66;">1</span><span style="color:#C678DD;"> &lt;&lt;</span><span style="color:#D19A66;"> 6</span><span style="color:#ABB2BF;">),</span><span style="color:#7F848E;font-style:italic;">  // 源NAT完成</span></span>
<span class="line"><span style="color:#ABB2BF;">    IPS_DST_NAT_DONE </span><span style="color:#C678DD;">=</span><span style="color:#ABB2BF;"> (</span><span style="color:#D19A66;">1</span><span style="color:#C678DD;"> &lt;&lt;</span><span style="color:#D19A66;"> 7</span><span style="color:#ABB2BF;">),</span><span style="color:#7F848E;font-style:italic;">  // 目的NAT完成</span></span>
<span class="line"><span style="color:#ABB2BF;">    IPS_DYING        </span><span style="color:#C678DD;">=</span><span style="color:#ABB2BF;"> (</span><span style="color:#D19A66;">1</span><span style="color:#C678DD;"> &lt;&lt;</span><span style="color:#D19A66;"> 8</span><span style="color:#ABB2BF;">),</span><span style="color:#7F848E;font-style:italic;">  // 正在销毁</span></span>
<span class="line"><span style="color:#ABB2BF;">    IPS_FIXED_TIMEOUT</span><span style="color:#C678DD;">=</span><span style="color:#ABB2BF;"> (</span><span style="color:#D19A66;">1</span><span style="color:#C678DD;"> &lt;&lt;</span><span style="color:#D19A66;"> 9</span><span style="color:#ABB2BF;">),</span><span style="color:#7F848E;font-style:italic;">  // 固定超时</span></span>
<span class="line"><span style="color:#ABB2BF;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 连接跟踪条目</span></span>
<span class="line"><span style="color:#C678DD;">struct</span><span style="color:#ABB2BF;"> nf_conn {</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> nf_conntrack ct_general;</span><span style="color:#7F848E;font-style:italic;">  // 引用计数</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> nf_conntrack_zone zone;</span><span style="color:#7F848E;font-style:italic;">   // 命名空间/区域</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> hlist_node </span><span style="color:#E06C75;">tuplehash</span><span style="color:#ABB2BF;">[IP_CT_DIR_MAX];</span><span style="color:#7F848E;font-style:italic;"> // 哈希表节点</span></span>
<span class="line"><span style="color:#C678DD;">    unsigned</span><span style="color:#C678DD;"> long</span><span style="color:#ABB2BF;"> status;</span><span style="color:#7F848E;font-style:italic;">            // 连接状态位图</span></span>
<span class="line"><span style="color:#C678DD;">    unsigned</span><span style="color:#C678DD;"> long</span><span style="color:#ABB2BF;"> timeout;</span><span style="color:#7F848E;font-style:italic;">           // 超时时间</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> nf_conntrack_tuple_hash </span><span style="color:#E06C75;">tuplehash</span><span style="color:#ABB2BF;">[IP_CT_DIR_MAX];</span><span style="color:#7F848E;font-style:italic;"> // 正反向元组</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 协议私有数据</span></span>
<span class="line"><span style="color:#C678DD;">    union</span><span style="color:#ABB2BF;"> nf_conntrack_proto proto;</span></span>
<span class="line"><span style="color:#ABB2BF;">};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="tuple-连接的唯一标识" tabindex="-1"><a class="header-anchor" href="#tuple-连接的唯一标识"><span>Tuple：连接的唯一标识</span></a></h3><div class="language-c line-numbers-mode" data-highlighter="shiki" data-ext="c" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-c"><span class="line"><span style="color:#7F848E;font-style:italic;">// 连接元组——唯一标识一个连接方向</span></span>
<span class="line"><span style="color:#C678DD;">struct</span><span style="color:#ABB2BF;"> nf_conntrack_tuple {</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> nf_conntrack_man src;</span><span style="color:#7F848E;font-style:italic;">   // 源地址信息</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        union</span><span style="color:#ABB2BF;"> nf_inet_addr u3;</span><span style="color:#7F848E;font-style:italic;">     // 目的IP地址</span></span>
<span class="line"><span style="color:#ABB2BF;">        __be16 all;</span><span style="color:#7F848E;font-style:italic;">                // 目的端口/ICMP ID等</span></span>
<span class="line"><span style="color:#ABB2BF;">    } dst;</span></span>
<span class="line"><span style="color:#56B6C2;">    u_int16_t</span><span style="color:#ABB2BF;"> protonum;</span><span style="color:#7F848E;font-style:italic;">            // 协议号（IPPROTO_TCP等）</span></span>
<span class="line"><span style="color:#ABB2BF;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">struct</span><span style="color:#ABB2BF;"> nf_conntrack_man {</span></span>
<span class="line"><span style="color:#C678DD;">    union</span><span style="color:#ABB2BF;"> nf_inet_addr u3;</span><span style="color:#7F848E;font-style:italic;">         // 源IP地址</span></span>
<span class="line"><span style="color:#C678DD;">    union</span><span style="color:#ABB2BF;"> nf_conntrack_man_proto u;</span><span style="color:#7F848E;font-style:italic;"> // 源端口</span></span>
<span class="line"><span style="color:#56B6C2;">    u_int16_t</span><span style="color:#ABB2BF;"> l3num;</span><span style="color:#7F848E;font-style:italic;">               // 网络层协议号</span></span>
<span class="line"><span style="color:#ABB2BF;">};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>一个TCP连接的Tuple示例：</span></span>
<span class="line"><span>  源: 192.168.1.100:54321</span></span>
<span class="line"><span>  目: 10.0.0.1:80</span></span>
<span class="line"><span>  协议: TCP</span></span>
<span class="line"><span></span></span>
<span class="line"><span>每个连接有正向和反向两个Tuple：</span></span>
<span class="line"><span>  正向: {src=192.168.1.100:54321, dst=10.0.0.1:80, proto=TCP}</span></span>
<span class="line"><span>  反向: {src=10.0.0.1:80, dst=192.168.1.100:54321, proto=TCP}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>哈希查找：</span></span>
<span class="line"><span>  hash = hashfn(tuple)</span></span>
<span class="line"><span>  → 在htable[hash]链表中查找匹配的tuple</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="conntrack状态机" tabindex="-1"><a class="header-anchor" href="#conntrack状态机"><span>conntrack状态机</span></a></h3>`,11),i(d,{code:`eJwrLkksSXXJTEwvSszVLTPiUgCCaK1YBV1dO4XgSL/4YFe/ECuFp+sWPevY/nz1+qf9E182NAIlwAphCsCqXYNDHJ18PIM9XF2sFJ5N2fa0YwNQXtfR2dsmqUjfDqITyMOwIsjVOQyoY07v066FQCvgWpG0QQ2CWwrSgstSkDqwQiQ5sFpnH/9g1/hwR0+ghyBK3Twh/kDIgBX6OAaHxAONAfobbDtMGUwcYRphS4F6oVaimgUTBysK8fTFcJg2zL9wSRRrjXyDfV5sa302fRsez1opBAWHQOTz8ktSFYoy0zNKFPLTkFWDZUHAMyAYGJmuoMAN8Il8vnfdk729cEmIVVYKpk+XrHy/p+Pl7hkv1i15v6cTrCA1LwVsPjabYEkEwyRDI4PnyycRpR8U2xj6zYjSDg88DP2gAAT6BOIMDJ8AAMeFCNo=`}),o[8]||=n(`<h3 id="conntrack性能调优" tabindex="-1"><a class="header-anchor" href="#conntrack性能调优"><span>conntrack性能调优</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看当前连接跟踪数</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /proc/sys/net/netfilter/nf_conntrack_count</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 最大跟踪条目数（默认65536，高流量服务器需要调大）</span></span>
<span class="line"><span style="color:#61AFEF;">sysctl</span><span style="color:#98C379;"> net.netfilter.nf_conntrack_max</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 建议: 内存充裕时设置为 262144 或更大</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 各状态超时时间</span></span>
<span class="line"><span style="color:#61AFEF;">sysctl</span><span style="color:#98C379;"> net.netfilter.nf_conntrack_tcp_timeout_established</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 默认432000秒（5天），建议缩短到3600秒（1小时）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">sysctl</span><span style="color:#98C379;"> net.netfilter.nf_conntrack_tcp_timeout_time_wait</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 默认120秒</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">sysctl</span><span style="color:#98C379;"> net.netfilter.nf_conntrack_tcp_timeout_close_wait</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 默认60秒</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 哈希表大小（应为conntrack_max的1/4到1/8）</span></span>
<span class="line"><span style="color:#61AFEF;">sysctl</span><span style="color:#98C379;"> net.netfilter.nf_conntrack_buckets</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：此参数需要模块加载时设置，运行时不可修改</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">conntrack表满的后果</p><p>当 <code>nf_conntrack_count</code> 达到 <code>nf_conntrack_max</code> 时，新连接会被拒绝，内核日志中出现：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>nf_conntrack: table full, dropping packet</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>此时所有新连接都无法建立，表现为网络中断。解决方案：</p><ol><li>增大 <code>nf_conntrack_max</code></li><li>缩短 <code>tcp_timeout_established</code></li><li>使用raw表的NOTRACK跳过不需要跟踪的流量</li><li>考虑完全禁用conntrack（如果不需要NAT/状态防火墙）</li></ol></div><hr><h2 id="路由查找" tabindex="-1"><a class="header-anchor" href="#路由查找"><span>路由查找</span></a></h2><p>路由查找是网络层最频繁的操作，每个数据包的转发都需要查路由表。Linux内核实现了高效的路由查找机制。</p><h3 id="fib-forwarding-information-base" tabindex="-1"><a class="header-anchor" href="#fib-forwarding-information-base"><span>FIB（Forwarding Information Base）</span></a></h3><div class="language-c line-numbers-mode" data-highlighter="shiki" data-ext="c" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-c"><span class="line"><span style="color:#7F848E;font-style:italic;">// include/net/ip_fib.h</span></span>
<span class="line"><span style="color:#C678DD;">struct</span><span style="color:#ABB2BF;"> fib_table {</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> hlist_node hlist;</span><span style="color:#7F848E;font-style:italic;">      // 哈希链表节点</span></span>
<span class="line"><span style="color:#C678DD;">    unsigned</span><span style="color:#C678DD;"> int</span><span style="color:#ABB2BF;"> tb_id;</span><span style="color:#7F848E;font-style:italic;">           // 路由表ID</span></span>
<span class="line"><span style="color:#ABB2BF;">    u32 tb_num_default;</span><span style="color:#7F848E;font-style:italic;">           // 默认路由数</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> rcu_head rcu;</span></span>
<span class="line"><span style="color:#C678DD;">    unsigned</span><span style="color:#C678DD;"> long</span><span style="color:#C678DD;"> *</span><span style="color:#ABB2BF;">tb_data;</span><span style="color:#7F848E;font-style:italic;">       // 路由数据（trie结构）</span></span>
<span class="line"><span style="color:#C678DD;">    unsigned</span><span style="color:#C678DD;"> int</span><span style="color:#ABB2BF;"> tb_seq;</span><span style="color:#7F848E;font-style:italic;">          // 序列号</span></span>
<span class="line"><span style="color:#ABB2BF;">};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="路由查找算法-lc-trie" tabindex="-1"><a class="header-anchor" href="#路由查找算法-lc-trie"><span>路由查找算法：LC-Trie</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Linux使用LC-Trie（Level Compressed Trie）进行路由查找：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>传统Trie（每个bit一级）：</span></span>
<span class="line"><span>  查找192.168.1.0/24需要24次比较</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LC-Trie（路径压缩）：</span></span>
<span class="line"><span>  合并单分支路径，减少比较次数</span></span>
<span class="line"><span>  查找192.168.1.0/24可能只需3-4次比较</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  示例（简化）：</span></span>
<span class="line"><span>                ┌──────────┐</span></span>
<span class="line"><span>                │ prefix=0 │</span></span>
<span class="line"><span>                │ bits=0   │</span></span>
<span class="line"><span>                └─────┬────┘</span></span>
<span class="line"><span>           ┌──────────┴──────────┐</span></span>
<span class="line"><span>      ┌────┴────┐          ┌─────┴────┐</span></span>
<span class="line"><span>      │10.0.0.0 │          │192.168   │</span></span>
<span class="line"><span>      │/8       │          │/16       │</span></span>
<span class="line"><span>      └────┬────┘          └─────┬────┘</span></span>
<span class="line"><span>           │               ┌─────┼──────┐</span></span>
<span class="line"><span>      ┌────┴────┐    ┌─────┴──┐  ┌──────┴──┐</span></span>
<span class="line"><span>      │10.0.1.0 │    │.1.0/24 │  │.2.0/24  │</span></span>
<span class="line"><span>      │/24      │    └────────┘  └─────────┘</span></span>
<span class="line"><span>      └─────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  查找192.168.1.100：</span></span>
<span class="line"><span>    第1跳: 匹配192.168/16 → 跳到子trie</span></span>
<span class="line"><span>    第2跳: 匹配192.168.1/24 → 找到路由</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="路由缓存" tabindex="-1"><a class="header-anchor" href="#路由缓存"><span>路由缓存</span></a></h3><div class="language-c line-numbers-mode" data-highlighter="shiki" data-ext="c" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-c"><span class="line"><span style="color:#7F848E;font-style:italic;">// 内核使用dst_entry作为路由缓存</span></span>
<span class="line"><span style="color:#C678DD;">struct</span><span style="color:#ABB2BF;"> dst_entry {</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> net_device </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">dev;</span><span style="color:#7F848E;font-style:italic;">       // 出口设备</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> dst_ops </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">ops;</span><span style="color:#7F848E;font-style:italic;">          // 操作函数表</span></span>
<span class="line"><span style="color:#ABB2BF;">    u32 </span><span style="color:#E06C75;">metrics</span><span style="color:#ABB2BF;">[RTAX_MAX];</span><span style="color:#7F848E;font-style:italic;">       // 路径MTU等度量值</span></span>
<span class="line"><span style="color:#C678DD;">    int</span><span style="color:#ABB2BF;"> error;</span><span style="color:#7F848E;font-style:italic;">                    // 错误码</span></span>
<span class="line"><span style="color:#C678DD;">    unsigned</span><span style="color:#C678DD;"> int</span><span style="color:#ABB2BF;"> flags;</span><span style="color:#7F848E;font-style:italic;">           // 标志</span></span>
<span class="line"><span style="color:#C678DD;">    unsigned</span><span style="color:#C678DD;"> long</span><span style="color:#ABB2BF;"> expires;</span><span style="color:#7F848E;font-style:italic;">        // 过期时间</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> dst_entry </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">path;</span><span style="color:#7F848E;font-style:italic;">       // 路径</span></span>
<span class="line"><span style="color:#ABB2BF;">    __u32 tclassid;</span><span style="color:#7F848E;font-style:italic;">              // 流量类别</span></span>
<span class="line"><span style="color:#C678DD;">    int</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">input)(</span><span style="color:#C678DD;">struct</span><span style="color:#ABB2BF;"> sk_buff </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">);</span><span style="color:#7F848E;font-style:italic;">   // 输入函数</span></span>
<span class="line"><span style="color:#C678DD;">    int</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">output)(</span><span style="color:#C678DD;">struct</span><span style="color:#ABB2BF;"> sk_buff </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">);</span><span style="color:#7F848E;font-style:italic;">  // 输出函数</span></span>
<span class="line"><span style="color:#ABB2BF;">};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>路由缓存查找流程：</span></span>
<span class="line"><span>1. 计算hash = hash(src_ip, dst_ip, iif, mark)</span></span>
<span class="line"><span>2. 在路由缓存哈希表中查找</span></span>
<span class="line"><span>3. 命中 → 直接使用dst_entry</span></span>
<span class="line"><span>4. 未命中 → 进行FIB查找，结果缓存</span></span>
<span class="line"><span></span></span>
<span class="line"><span>注意：Linux 3.6移除了IPv4路由缓存（因为hash碰撞导致DDoS）</span></span>
<span class="line"><span>     现在每次都查FIB，但LC-Trie查找本身很快（O(W)，W=地址长度）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="策略路由" tabindex="-1"><a class="header-anchor" href="#策略路由"><span>策略路由</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>普通路由：仅根据目的地址查找</span></span>
<span class="line"><span>策略路由：根据源地址、入接口、TOS、fwmark等多维度查找</span></span>
<span class="line"><span></span></span>
<span class="line"><span>路由策略数据库（RPDB）：</span></span>
<span class="line"><span>  规则优先级: 0 ~ 32767（越小越优先）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  默认规则：</span></span>
<span class="line"><span>  32766: from all lookup main        → 查主路由表</span></span>
<span class="line"><span>  32767: from all lookup default     → 查默认路由表</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  自定义规则示例：</span></span>
<span class="line"><span>  # 来自192.168.1.0/24的流量查路由表100</span></span>
<span class="line"><span>  ip rule add from 192.168.1.0/24 table 100</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # fwmark为0x1的流量查路由表200</span></span>
<span class="line"><span>  ip rule add fwmark 0x1 table 200</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # 来自eth0的流量查路由表300</span></span>
<span class="line"><span>  ip rule add iif eth0 table 300</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # 路由表100中的路由</span></span>
<span class="line"><span>  ip route add default via 10.0.1.1 table 100</span></span>
<span class="line"><span>  ip route add 10.0.0.0/8 via 10.0.1.2 table 100</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RPDB查找流程：</span></span>
<span class="line"><span>  for each rule in rules (按优先级排序):</span></span>
<span class="line"><span>      if rule.match(packet):</span></span>
<span class="line"><span>          lookup route in rule.table</span></span>
<span class="line"><span>          if found: return route</span></span>
<span class="line"><span>  return: network unreachable</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">策略路由的典型应用</p><ul><li><strong>多ISP负载均衡</strong>：根据源地址选择不同出口</li><li><strong>VPN分流</strong>：特定流量走VPN隧道，其余走默认路由</li><li><strong>容器网络</strong>：不同容器的流量走不同路由表</li><li><strong>QoS</strong>：根据TOS字段选择不同质量的路由</li></ul></div><hr><h2 id="网卡收发包流程" tabindex="-1"><a class="header-anchor" href="#网卡收发包流程"><span>网卡收发包流程</span></a></h2><p>网卡收发包是数据进出内核的物理通道，其效率直接影响整体网络性能。</p><h3 id="完整收发流程" tabindex="-1"><a class="header-anchor" href="#完整收发流程"><span>完整收发流程</span></a></h3>`,20),i(d,{code:`eJx9lF1PE0EUhu/5FZt4TWpAEu2FSWn52AhtmVbRNKSB7SxsaKhuF4gJF4AFi3xro2gIUKEiBgrViKS1/BpnP/6FZ2aW7W6LNukmu+d558yZ856R05lZaWJU1YR4d5sAv+z02Lg6+nxCIJvb1vyC+eucXOdYhP4C0WgyliDVglH46heyeCrlm1UVDY8I7e0PhdizWDAwMACE8aNm1PbNi1fAjThqJ87pSPARoLGMNIk1Uln0C/pezpo/yE6OuSQMYnw8SHPDk7OrJVLc0zeOSf7SR/LLevlnQ8VQJhKpRuQSqMUoVPT9kr5y7SMXC+bhUkNCQaYI9yYjj+OJMNZkJa1hVRiIwKbpN6E/k5lsKDjINT1iXz8kshZrpLJEzrZ4/X4hgKLm8aG+t+WScZbpQj1PQDWFtWQKzygS9gvW/Iq+emLt7JP8h4aGcUwxFBJjQdC8SClZCU5h4y2wcM6k+qWB2xBPgWgK66RC3kDHQoMBfeeAXORca1OAVyHSlY36Nlkv+u3+k6tjjkKr27wG0TdKeuGyySB0DeSswRG6Bt/LYACC8CTLH8lSCSlT40L3tCxj1bUdyvDWoaGEUTz9c3Wmvz/z01dXt9AQ33IgKibow6yXzfPP0OP6ORe4DhzCDO5DkQT8AVr4RLbyZM3VfvjuHBdyjusWQzLAbno8iZ7S7ilyUsUSVmZw0sNy4sZVUdTjchW8JRH4Rwz3tfoKgkxFAcAS3Lkkf+QpzI5Sck7fPdV3q3NULIZbzCuGW3PAN3tA0M2AWK/XjVrOpx8UrW9rntHgFdOxQs4EGsWyWT7ygQVJddM7exxns4vcA877zl1h/H5Hlr+TtWrTsHMtvWiQc9HA6c74VDyaur14s34KbmXF9w6HXNX3RtBwAIVaiwfMaUsk5p52+vqfxkC0MbkdCfcl2Twn2ss0ZkaFldP+O2DzMYxdIeZLHsP35S78wB3jHrCjnXKHnPJGoXv/ltJryU4q4XtY8kZp7Tdbkjvx3aa0tEI73Im75K62v4NELzM=`}),o[9]||=n(`<h3 id="中断与napi" tabindex="-1"><a class="header-anchor" href="#中断与napi"><span>中断与NAPI</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>传统中断模式的问题：</span></span>
<span class="line"><span>  每个包一次中断 → 高速流量下中断风暴 → CPU被中断占满 → 系统卡死</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  1Gbps, 平均包长500字节:</span></span>
<span class="line"><span>  每秒包数 = 1,000,000,000 / (500 × 8) = 250,000 pps</span></span>
<span class="line"><span>  每秒中断 250,000 次 → CPU根本处理不过来</span></span>
<span class="line"><span></span></span>
<span class="line"><span>NAPI（New API）的解决方案：</span></span>
<span class="line"><span>  混合模式：中断 + 轮询</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  1. 初始状态：网卡中断开启</span></span>
<span class="line"><span>  2. 收到第一个包 → 触发硬中断</span></span>
<span class="line"><span>  3. 在硬中断处理函数中：</span></span>
<span class="line"><span>     → 禁用网卡中断</span></span>
<span class="line"><span>     → 将设备加入NAPI轮询列表</span></span>
<span class="line"><span>     → 触发软中断（NET_RX_SOFTIRQ）</span></span>
<span class="line"><span>  4. 软中断处理函数中：</span></span>
<span class="line"><span>     → 轮询网卡，批量收取数据包</span></span>
<span class="line"><span>     → 每次轮询有budget限制（默认300包）</span></span>
<span class="line"><span>     → 收完或达到budget → 重新开启网卡中断</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-c line-numbers-mode" data-highlighter="shiki" data-ext="c" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-c"><span class="line"><span style="color:#7F848E;font-style:italic;">// NAPI轮询的核心结构</span></span>
<span class="line"><span style="color:#C678DD;">struct</span><span style="color:#ABB2BF;"> napi_struct {</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> list_head poll_list;</span><span style="color:#7F848E;font-style:italic;">   // 轮询链表节点</span></span>
<span class="line"><span style="color:#C678DD;">    unsigned</span><span style="color:#C678DD;"> int</span><span style="color:#ABB2BF;"> state;</span><span style="color:#7F848E;font-style:italic;">           // 状态标志</span></span>
<span class="line"><span style="color:#C678DD;">    int</span><span style="color:#ABB2BF;"> weight;</span><span style="color:#7F848E;font-style:italic;">                   // 每次轮询的预算</span></span>
<span class="line"><span style="color:#C678DD;">    int</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">poll)(</span><span style="color:#C678DD;">struct</span><span style="color:#ABB2BF;"> napi_struct </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">int</span><span style="color:#ABB2BF;">);</span><span style="color:#7F848E;font-style:italic;"> // 轮询函数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // ...</span></span>
<span class="line"><span style="color:#ABB2BF;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 驱动注册NAPI</span></span>
<span class="line"><span style="color:#61AFEF;">netif_napi_add</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">dev</span><span style="color:#ABB2BF;">,</span><span style="color:#C678DD;"> &amp;</span><span style="color:#E06C75;">priv</span><span style="color:#C678DD;">-&gt;</span><span style="color:#E06C75;font-style:italic;">napi</span><span style="color:#ABB2BF;">,</span><span style="color:#E06C75;"> my_poll</span><span style="color:#ABB2BF;">,</span><span style="color:#D19A66;"> 64</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// weight=64表示每次poll最多处理64个包</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 硬中断处理（简化）</span></span>
<span class="line"><span style="color:#C678DD;">static</span><span style="color:#56B6C2;"> irqreturn_t</span><span style="color:#61AFEF;"> my_interrupt</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">int</span><span style="color:#E06C75;font-style:italic;"> irq</span><span style="color:#ABB2BF;">,</span><span style="color:#C678DD;"> void</span><span style="color:#C678DD;"> *</span><span style="color:#E06C75;font-style:italic;">dev_id</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    struct</span><span style="color:#ABB2BF;"> my_priv </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">priv </span><span style="color:#C678DD;">=</span><span style="color:#ABB2BF;"> dev_id;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 禁用中断，调度NAPI</span></span>
<span class="line"><span style="color:#61AFEF;">    napi_schedule</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">&amp;</span><span style="color:#E5C07B;">priv</span><span style="color:#ABB2BF;">-&gt;</span><span style="color:#E06C75;">napi</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#ABB2BF;"> IRQ_HANDLED;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// NAPI轮询函数（简化）</span></span>
<span class="line"><span style="color:#C678DD;">static</span><span style="color:#C678DD;"> int</span><span style="color:#61AFEF;"> my_poll</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">struct</span><span style="color:#E06C75;"> napi_struct </span><span style="color:#C678DD;">*</span><span style="color:#E06C75;font-style:italic;">napi</span><span style="color:#ABB2BF;">,</span><span style="color:#C678DD;"> int</span><span style="color:#E06C75;font-style:italic;"> budget</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    int</span><span style="color:#ABB2BF;"> work_done </span><span style="color:#C678DD;">=</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    while</span><span style="color:#ABB2BF;"> (work_done </span><span style="color:#C678DD;">&lt;</span><span style="color:#ABB2BF;"> budget) {</span></span>
<span class="line"><span style="color:#C678DD;">        struct</span><span style="color:#ABB2BF;"> sk_buff </span><span style="color:#C678DD;">*</span><span style="color:#ABB2BF;">skb </span><span style="color:#C678DD;">=</span><span style="color:#61AFEF;"> receive_packet</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#56B6C2;">!</span><span style="color:#ABB2BF;">skb) </span><span style="color:#C678DD;">break</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#61AFEF;">        netif_receive_skb</span><span style="color:#ABB2BF;">(skb);</span></span>
<span class="line"><span style="color:#ABB2BF;">        work_done</span><span style="color:#C678DD;">++</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (work_done </span><span style="color:#C678DD;">&lt;</span><span style="color:#ABB2BF;"> budget)</span></span>
<span class="line"><span style="color:#61AFEF;">        napi_complete_done</span><span style="color:#ABB2BF;">(napi, work_done);</span><span style="color:#7F848E;font-style:italic;"> // 重新启用中断</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#ABB2BF;"> work_done;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="ring-buffer" tabindex="-1"><a class="header-anchor" href="#ring-buffer"><span>Ring Buffer</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>网卡和驱动之间通过Ring Buffer交换数据：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>接收Ring Buffer：</span></span>
<span class="line"><span>  ┌───────────────────────────────────────┐</span></span>
<span class="line"><span>  │ rx_ring[0]: skb → DMA映射的缓冲区     │</span></span>
<span class="line"><span>  │ rx_ring[1]: skb → DMA映射的缓冲区     │</span></span>
<span class="line"><span>  │ rx_ring[2]: skb → DMA映射的缓冲区     │</span></span>
<span class="line"><span>  │ ...                                    │</span></span>
<span class="line"><span>  │ rx_ring[N]: skb → DMA映射的缓冲区     │</span></span>
<span class="line"><span>  └───────────────────────────────────────┘</span></span>
<span class="line"><span>  驱动维护: next_to_use (驱动填充位置)</span></span>
<span class="line"><span>  网卡维护: next_to_clean (网卡处理位置)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  流程：</span></span>
<span class="line"><span>  1. 驱动分配skb，DMA映射，填入rx_ring[next_to_use]</span></span>
<span class="line"><span>  2. 网卡收到帧，DMA写入skb缓冲区</span></span>
<span class="line"><span>  3. 网卡更新next_to_clean，触发中断</span></span>
<span class="line"><span>  4. 驱动取出skb，处理数据，重新分配skb填入</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  查看Ring Buffer大小：</span></span>
<span class="line"><span>  ethtool -g eth0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  调整Ring Buffer大小：</span></span>
<span class="line"><span>  ethtool -G eth0 rx 4096 tx 4096</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="gro-generic-receive-offload" tabindex="-1"><a class="header-anchor" href="#gro-generic-receive-offload"><span>GRO（Generic Receive Offload）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>GRO原理：在软件层面将多个小包聚合成大包，减少协议栈处理次数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  没有GRO：</span></span>
<span class="line"><span>  网卡收到1000个小包（每个1460字节）</span></span>
<span class="line"><span>  → 1000次协议栈处理</span></span>
<span class="line"><span>  → 1000次skb分配</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  有GRO：</span></span>
<span class="line"><span>  网卡收到1000个小包</span></span>
<span class="line"><span>  → GRO聚合为几个大skb（每个约64KB）</span></span>
<span class="line"><span>  → 几次协议栈处理</span></span>
<span class="line"><span>  → 大幅减少CPU开销</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  GRO匹配条件（必须完全相同才合并）：</span></span>
<span class="line"><span>  - 相同的源/目的IP</span></span>
<span class="line"><span>  - 相同的源/目的端口</span></span>
<span class="line"><span>  - 相同的TCP序列号连续</span></span>
<span class="line"><span>  - 相同的TCP时间戳选项</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  控制GRO：</span></span>
<span class="line"><span>  ethtool -K eth0 gro on     # 开启GRO</span></span>
<span class="line"><span>  ethtool -k eth0             # 查看GRO状态</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="rps-rfs-xps" tabindex="-1"><a class="header-anchor" href="#rps-rfs-xps"><span>RPS/RFS/XPS</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>RPS (Receive Packet Steering)：</span></span>
<span class="line"><span>  软件层面将收包分发到多个CPU</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  问题：NAPI在单个CPU上轮询，单核成为瓶颈</span></span>
<span class="line"><span>  解决：根据包的hash值选择目标CPU，放入其backlog队列</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  配置：</span></span>
<span class="line"><span>  echo f &gt; /sys/class/net/eth0/queues/rx-0/rps_cpus</span></span>
<span class="line"><span>  # f = 0xf = CPU 0-3</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RFS (Receive Flow Steering)：</span></span>
<span class="line"><span>  RPS的改进版，将包送到应用所在CPU</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  问题：RPS随机分配，可能导致缓存失效</span></span>
<span class="line"><span>  解决：跟踪每个流的应用CPU，将包送到同一CPU</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  配置：</span></span>
<span class="line"><span>  echo 32768 &gt; /proc/sys/net/core/rps_sock_flow_entries</span></span>
<span class="line"><span>  echo 4096 &gt; /sys/class/net/eth0/queues/rx-0/rps_flow_cnt</span></span>
<span class="line"><span></span></span>
<span class="line"><span>XPS (Transmit Packet Steering)：</span></span>
<span class="line"><span>  发送端的多队列CPU亲和性</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  问题：发送时选队列可能不均匀</span></span>
<span class="line"><span>  解决：指定CPU使用特定发送队列</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  配置：</span></span>
<span class="line"><span>  echo 1 &gt; /sys/class/net/eth0/queues/tx-0/xps_cpus   # CPU0用队列0</span></span>
<span class="line"><span>  echo 2 &gt; /sys/class/net/eth0/queues/tx-1/xps_cpus   # CPU1用队列1</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="零拷贝技术" tabindex="-1"><a class="header-anchor" href="#零拷贝技术"><span>零拷贝技术</span></a></h2><p>传统的数据发送需要多次拷贝：磁盘→内核缓冲区→用户缓冲区→Socket缓冲区→网卡。零拷贝技术通过减少或消除这些拷贝来提升性能。</p><h3 id="传统数据发送的4次拷贝" tabindex="-1"><a class="header-anchor" href="#传统数据发送的4次拷贝"><span>传统数据发送的4次拷贝</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>传统send()流程（读取文件并发送）：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  用户空间                  内核空间                    硬件</span></span>
<span class="line"><span>  ┌───────┐              ┌───────────┐             ┌──────┐</span></span>
<span class="line"><span>  │       │  ①read()     │ Page Cache│             │      │</span></span>
<span class="line"><span>  │ user  │◄─────────────│           │◄────────────│ 磁盘  │</span></span>
<span class="line"><span>  │ buffer│  CPU拷贝     │           │  DMA拷贝    │      │</span></span>
<span class="line"><span>  │       │──────────────►│           │             │      │</span></span>
<span class="line"><span>  └───────┘  ②send()     │ Socket    │             │      │</span></span>
<span class="line"><span>             CPU拷贝      │ Buffer    │             │      │</span></span>
<span class="line"><span>                          │           │────────────►│ 网卡  │</span></span>
<span class="line"><span>                          │           │  ③DMA拷贝   │      │</span></span>
<span class="line"><span>                          └───────────┘             └──────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  拷贝次数：4次（2次DMA + 2次CPU）</span></span>
<span class="line"><span>  上下文切换：4次（read() 2次 + send() 2次）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="sendfile-零拷贝的起点" tabindex="-1"><a class="header-anchor" href="#sendfile-零拷贝的起点"><span>sendfile：零拷贝的起点</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>sendfile()流程：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  用户空间                  内核空间                    硬件</span></span>
<span class="line"><span>  ┌───────┐              ┌───────────┐             ┌──────┐</span></span>
<span class="line"><span>  │       │  sendfile()  │ Page Cache│             │      │</span></span>
<span class="line"><span>  │ (无)  │──────────────►│           │◄────────────│ 磁盘  │</span></span>
<span class="line"><span>  │       │  无CPU拷贝   │           │  DMA拷贝    │      │</span></span>
<span class="line"><span>  └───────┘              │ Socket    │             │      │</span></span>
<span class="line"><span>                         │ Buffer    │             │      │</span></span>
<span class="line"><span>                         │           │────────────►│ 网卡  │</span></span>
<span class="line"><span>                         │           │  DMA拷贝    │      │</span></span>
<span class="line"><span>                         └───────────┘             └──────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  sendfile() + DMA Scatter-Gather：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  ┌───────┐              ┌───────────┐             ┌──────┐</span></span>
<span class="line"><span>  │       │              │ Page Cache│             │      │</span></span>
<span class="line"><span>  │ (无)  │  sendfile()  │           │◄────────────│ 磁盘  │</span></span>
<span class="line"><span>  │       │──────────────►│           │  DMA拷贝    │      │</span></span>
<span class="line"><span>  └───────┘              │ Socket    │             │      │</span></span>
<span class="line"><span>                         │ Buffer    │             │      │</span></span>
<span class="line"><span>                         │ (仅描述符) │             │      │</span></span>
<span class="line"><span>                         └─────┬─────┘             └──────┘</span></span>
<span class="line"><span>                               │ DMA Scatter-Gather   ↑</span></span>
<span class="line"><span>                               └─────── 直接DMA ──────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  拷贝次数：2次（DMA拷贝到Page Cache + DMA Scatter-Gather到网卡）</span></span>
<span class="line"><span>  CPU拷贝：0次！</span></span>
<span class="line"><span>  上下文切换：2次</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-c line-numbers-mode" data-highlighter="shiki" data-ext="c" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-c"><span class="line"><span style="color:#7F848E;font-style:italic;">// sendfile系统调用</span></span>
<span class="line"><span style="color:#C678DD;">ssize_t</span><span style="color:#61AFEF;"> sendfile</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">int</span><span style="color:#E06C75;font-style:italic;"> out_fd</span><span style="color:#ABB2BF;">,</span><span style="color:#C678DD;"> int</span><span style="color:#E06C75;font-style:italic;"> in_fd</span><span style="color:#ABB2BF;">,</span><span style="color:#C678DD;"> off_t</span><span style="color:#C678DD;"> *</span><span style="color:#E06C75;font-style:italic;">offset</span><span style="color:#ABB2BF;">,</span><span style="color:#C678DD;"> size_t</span><span style="color:#E06C75;font-style:italic;"> count</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 内核实现（简化）</span></span>
<span class="line"><span style="color:#C678DD;">static</span><span style="color:#C678DD;"> ssize_t</span><span style="color:#61AFEF;"> do_sendfile</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">int</span><span style="color:#E06C75;font-style:italic;"> out_fd</span><span style="color:#ABB2BF;">,</span><span style="color:#C678DD;"> int</span><span style="color:#E06C75;font-style:italic;"> in_fd</span><span style="color:#ABB2BF;">,</span><span style="color:#56B6C2;"> loff_t</span><span style="color:#C678DD;"> *</span><span style="color:#E06C75;font-style:italic;">ppos</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#C678DD;">                           size_t</span><span style="color:#E06C75;font-style:italic;"> count</span><span style="color:#ABB2BF;">,</span><span style="color:#56B6C2;"> loff_t</span><span style="color:#E06C75;font-style:italic;"> max</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 1. 从输入文件获取page cache页面</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 2. 将页面引用（非拷贝）添加到socket的skb</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 3. 通过DMA Scatter-Gather直接发送</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 整个过程数据不经过用户空间，CPU不参与数据搬运</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="splice-管道零拷贝" tabindex="-1"><a class="header-anchor" href="#splice-管道零拷贝"><span>splice：管道零拷贝</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>splice()：在两个文件描述符之间移动数据，无需经过用户空间</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  特点：</span></span>
<span class="line"><span>  - 必须至少一方是管道（pipe）</span></span>
<span class="line"><span>  - 数据通过内核管道缓冲区传递，不经过用户空间</span></span>
<span class="line"><span>  - 可用于文件到Socket、管道到管道等场景</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  典型应用：代理服务器</span></span>
<span class="line"><span>  客户端 → [Socket A] → splice → [Pipe] → splice → [Socket B] → 服务器</span></span>
<span class="line"><span>  数据全程不经过用户空间</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 代理转发示例</span></span>
<span class="line"><span>  while (1) {</span></span>
<span class="line"><span>      // Socket A → Pipe</span></span>
<span class="line"><span>      splice(sock_a, NULL, pipefd[1], NULL, 65536, 0);</span></span>
<span class="line"><span>      // Pipe → Socket B</span></span>
<span class="line"><span>      splice(pipefd[0], NULL, sock_b, NULL, 65536, 0);</span></span>
<span class="line"><span>  }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="msg-zerocopy-真正的零拷贝发送" tabindex="-1"><a class="header-anchor" href="#msg-zerocopy-真正的零拷贝发送"><span>MSG_ZEROCOPY：真正的零拷贝发送</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>send() with MSG_ZEROCOPY：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  传统send()：用户数据拷贝到内核skb → 用户缓冲区可立即复用</span></span>
<span class="line"><span>  MSG_ZEROCOPY：用户数据页直接映射到skb → 等待内核通知才能复用</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  使用方式：</span></span>
<span class="line"><span>  send(sock, buf, len, MSG_ZEROCOPY);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  完成通知：</span></span>
<span class="line"><span>  // 内核通过socket错误队列通知用户缓冲区可以释放</span></span>
<span class="line"><span>  struct msghdr msg = { .msg_iov = NULL };</span></span>
<span class="line"><span>  recvmsg(sock, &amp;msg, MSG_ERRQUEUE);</span></span>
<span class="line"><span>  // 检查消息类型为SO_EE_ORIGIN_ZEROCOPY</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  注意事项：</span></span>
<span class="line"><span>  - 需要内核4.14+</span></span>
<span class="line"><span>  - 数据量小于约2KB时不划算（页面对齐开销）</span></span>
<span class="line"><span>  - 需要处理完成通知，编程模型更复杂</span></span>
<span class="line"><span>  - 适用于大块数据传输（如存储系统、消息队列）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">零拷贝技术对比</p><table><thead><tr><th>技术</th><th>CPU拷贝次数</th><th>上下文切换</th><th>适用场景</th><th>限制</th></tr></thead><tbody><tr><td>传统read+send</td><td>2</td><td>4</td><td>通用</td><td>性能瓶颈</td></tr><tr><td>sendfile</td><td>0</td><td>2</td><td>文件→Socket</td><td>仅限文件到Socket</td></tr><tr><td>splice</td><td>0</td><td>2</td><td>任意FD间</td><td>需要管道</td></tr><tr><td>MSG_ZEROCOPY</td><td>0</td><td>2</td><td>用户数据→Socket</td><td>需处理通知</td></tr></tbody></table></div><hr><h2 id="内核参数调优" tabindex="-1"><a class="header-anchor" href="#内核参数调优"><span>内核参数调优</span></a></h2><p>网络性能调优是系统管理员和后端开发者的必备技能。以下是关键参数的详细说明。</p><h3 id="tcp连接相关参数" tabindex="-1"><a class="header-anchor" href="#tcp连接相关参数"><span>TCP连接相关参数</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ===== TIME_WAIT相关 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 允许将TIME_WAIT连接用于新的出站连接</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 仅对客户端角色有效，依赖Timestamp选项</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_tw_reuse</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># TIME_WAIT桶的最大数量</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 超出后直接关闭连接，不再进入TIME_WAIT</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_max_tw_buckets</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 65536</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># FIN_WAIT_2状态超时时间（秒）</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_fin_timeout</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 60</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== SYN相关 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># SYN队列（半连接队列）最大长度</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 高并发服务器建议调大到8192或更大</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_max_syn_backlog</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 8192</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># SYN Cookie开关</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 0: 始终关闭</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1: 始终开启</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2: 仅在syn_queue满时启用（推荐）</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_syncookies</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># SYN-ACK重传次数，降低可减轻SYN Flood影响</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 默认5次，每次超时翻倍：1s→2s→4s→8s→16s</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 设为2则最多3s</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_synack_retries</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 外发SYN重试次数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 默认6次，总共约127秒</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 客户端建议设为3（约7秒）</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_syn_retries</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== accept队列相关 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 全连接队列最大长度上限</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># listen()的backlog参数不能超过此值</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 高并发服务器建议65535</span></span>
<span class="line"><span style="color:#61AFEF;">net.core.somaxconn</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 65535</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="缓冲区相关参数" tabindex="-1"><a class="header-anchor" href="#缓冲区相关参数"><span>缓冲区相关参数</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ===== Socket缓冲区 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 接收缓冲区最大值（字节）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 影响TCP窗口大小的上限</span></span>
<span class="line"><span style="color:#61AFEF;">net.core.rmem_max</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 16777216</span><span style="color:#7F848E;font-style:italic;">    # 16MB</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 发送缓冲区最大值（字节）</span></span>
<span class="line"><span style="color:#61AFEF;">net.core.wmem_max</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 16777216</span><span style="color:#7F848E;font-style:italic;">    # 16MB</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># TCP接收缓冲区（min/default/max）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># default: 初始缓冲区大小</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># max: 不超过rmem_max</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_rmem</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 4096</span><span style="color:#D19A66;"> 87380</span><span style="color:#D19A66;"> 16777216</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># TCP发送缓冲区（min/default/max）</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_wmem</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 4096</span><span style="color:#D19A66;"> 65536</span><span style="color:#D19A66;"> 16777216</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 网卡队列 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 每个CPU的backlog队列最大长度</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># RPS使用此队列</span></span>
<span class="line"><span style="color:#61AFEF;">net.core.netdev_max_backlog</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 5000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== Ring Buffer =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 通过ethtool调整，不通过sysctl</span></span>
<span class="line"><span style="color:#61AFEF;">ethtool</span><span style="color:#D19A66;"> -G</span><span style="color:#98C379;"> eth0</span><span style="color:#98C379;"> rx</span><span style="color:#D19A66;"> 4096</span><span style="color:#98C379;"> tx</span><span style="color:#D19A66;"> 4096</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="tcp-fast-open" tabindex="-1"><a class="header-anchor" href="#tcp-fast-open"><span>TCP Fast Open</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>TCP Fast Open (TFO) 允许在SYN包中携带数据，减少一次RTT：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  正常TCP：</span></span>
<span class="line"><span>  客户端 → SYN → 服务器</span></span>
<span class="line"><span>  客户端 ← SYN-ACK ← 服务器</span></span>
<span class="line"><span>  客户端 → ACK + 数据 → 服务器</span></span>
<span class="line"><span>  → 需要1个RTT才能发送数据</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  TFO：</span></span>
<span class="line"><span>  客户端 → SYN + Cookie请求 → 服务器</span></span>
<span class="line"><span>  客户端 ← SYN-ACK + Cookie ← 服务器</span></span>
<span class="line"><span>  （后续连接）</span></span>
<span class="line"><span>  客户端 → SYN + Cookie + 数据 → 服务器</span></span>
<span class="line"><span>  客户端 ← SYN-ACK + 响应 ← 服务器</span></span>
<span class="line"><span>  → 首个SYN即携带数据，节省1个RTT</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># TCP Fast Open开关</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1: 客户端启用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2: 服务端启用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3: 客户端和服务端都启用</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_fastopen</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 服务端TFO队列长度</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_fastopen_q</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 4096</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="其他关键参数" tabindex="-1"><a class="header-anchor" href="#其他关键参数"><span>其他关键参数</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 连接保活 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># TCP keepalive开关</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_keepalive_time</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 7200</span><span style="color:#7F848E;font-style:italic;">    # 空闲多久开始探测（秒）</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_keepalive_intvl</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 75</span><span style="color:#7F848E;font-style:italic;">     # 探测间隔（秒）</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_keepalive_probes</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 9</span><span style="color:#7F848E;font-style:italic;">     # 探测次数</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 本地端口范围 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 客户端可用临时端口范围</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 高并发客户端需要调大</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.ip_local_port_range</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1024</span><span style="color:#D19A66;"> 65535</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== MTU探测 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1: 禁用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2: 启用（默认）</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_mtu_probing</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 窗口缩放 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 必须开启，否则TCP窗口最大64KB</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_window_scaling</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== SACK =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 选择性确认，建议开启</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_sack</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== Timestamps =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 时间戳选项，用于RTT测量和PAWS</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># tcp_tw_reuse依赖此选项</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_timestamps</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 转发 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># IP转发开关（路由器/网关需要开启）</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.ip_forward</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="调优配置模板" tabindex="-1"><a class="header-anchor" href="#调优配置模板"><span>调优配置模板</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/sysctl.d/99-network-tuning.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 高并发服务器网络参数调优模板</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># === 连接队列 ===</span></span>
<span class="line"><span style="color:#61AFEF;">net.core.somaxconn</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 65535</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_max_syn_backlog</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 8192</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_syncookies</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># === 缓冲区 ===</span></span>
<span class="line"><span style="color:#61AFEF;">net.core.rmem_max</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 16777216</span></span>
<span class="line"><span style="color:#61AFEF;">net.core.wmem_max</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 16777216</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_rmem</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 4096</span><span style="color:#D19A66;"> 87380</span><span style="color:#D19A66;"> 16777216</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_wmem</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 4096</span><span style="color:#D19A66;"> 65536</span><span style="color:#D19A66;"> 16777216</span></span>
<span class="line"><span style="color:#61AFEF;">net.core.netdev_max_backlog</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 10000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># === TIME_WAIT ===</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_tw_reuse</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_max_tw_buckets</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 65536</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_fin_timeout</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 30</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># === 端口与Fast Open ===</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.ip_local_port_range</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1024</span><span style="color:#D19A66;"> 65535</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_fastopen</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># === 保活 ===</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_keepalive_time</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 600</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_keepalive_intvl</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 30</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_keepalive_probes</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># === 其他 ===</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_window_scaling</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_sack</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_timestamps</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_synack_retries</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_syn_retries</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 3</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_max_orphans</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 65535</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">调优的黄金法则</p><ol><li><strong>先监控后调优</strong>：使用 <code>ss -s</code>、<code>netstat -s</code>、<code>cat /proc/net/snmp</code> 了解当前状态</li><li><strong>一次调一个参数</strong>：同时调多个参数无法判断哪个有效</li><li><strong>在测试环境验证</strong>：内核参数可能影响系统稳定性</li><li><strong>记录基线</strong>：调优前记录性能基线，以便对比</li><li><strong>并非越大越好</strong>：过大的缓冲区浪费内存，可能导致延迟增加</li></ol></div><hr><h2 id="网络数据包收发完整流程" tabindex="-1"><a class="header-anchor" href="#网络数据包收发完整流程"><span>网络数据包收发完整流程</span></a></h2><p>将前面所有知识点串联，以下是数据包从网卡到应用程序的完整收发流程：</p>`,40),i(d,{code:`eJydlFtPGkEUx9/9FBP60iYYRUXRNCaIl5Io0AHTJsQYxV0lUrWANU18ACveAS/UWGtVqlRrFKWNl0KxX8aZ3f0WPbsDOqD2ofu2e/b/mzO7vzmib3TCM9TnDyJXSwWCKzDeP+jvGxtCJL6ihML0PCwdLmoV9XIa3CSbkBKHTSggjAy8CQxWTfi9QaEHVVY2I2eNW+cc9QwLQZKZet7vr2omczNKJBoY7tcjMvOJRFL04xmNpnU9d8QaFq1161wWx23uLCzvReCB8m1d+XCoR3QxRZLbNHZA5i7g7jyszMbZHc+qZaw6t856i5IvT6VEhu6k6Pw1dKGBrbdcaFCan+UZdYxhdOtsQlD0+oKCH3XaLebOXnu3C70YHR3WsE+9Y8G+fp8QQPDY0e1S1q6f8Rgjw9S7dcpUjmQi5GRZ+pmTcjta2owd8sEe3V7WIzl2SeLrXWYL2TojX0I8o54xGvhWHHanqxfDmlZbx0PdqPVCGVrSI6fN7CpprIFBTW6dlF8h0aTyPUMWDrmvfpNLkf0jtXh1oEetXWa6sUvOpnmGiTEa3bq3A96Ah8ZWlQ22MZflsX/TyDKG6uLCQGaOsbU1PbB3ZBC1jIsi7NT1uhAH0SpK3aSxFE1clLmJDUUyK0P7Glld5x4cA1xrCIOzUvL45uqErp9Y8UstooQ2pZ2UxdHNbQAzUTGIajM7rHL+lGXkfFo+/arF6Pwv2Dr8TbIU0aMObJfDm2R5jocwQzEYeu/r0+1pJbSrnZWbqwW6kCLRuJxO090SANMTl+jpwG3/VAK38Ua0lhmBmaoYVGVnhcztw740SLu1hZ0c/n1Ny0n4d+Q6RLeO6VZ2EuESSdl5sdoe6sZqu39aCkg5fwxUgIGcd7B2O35lxq0PsQqlchpTHIOed2NAmY1KuWkYHbtJ5WiJf5uJiVUxuQkkJdNyeh/ej62SbPzRkQOxQhzsK5t9bOBpLkq/18jMD7KULYkaClFQkCT2lRlYSZ2tWtoveN6p49Uv9A3IfxLk8zYfZQcQG1QZ/3M0lHwxQ2FymsoOXPC9T1BnGazga3oieoQ6wcNXGoqVWsEoGrkKSMUqQq1YIw7wlWJGMIlGoZGvmIo0EXjVfAX6K1noL7fnjwc=`}),o[10]||=n(`<hr><h2 id="实战-网络性能诊断" tabindex="-1"><a class="header-anchor" href="#实战-网络性能诊断"><span>实战：网络性能诊断</span></a></h2><h3 id="常用诊断工具" tabindex="-1"><a class="header-anchor" href="#常用诊断工具"><span>常用诊断工具</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 连接状态统计 =====</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -s</span><span style="color:#7F848E;font-style:italic;">                    # 连接数汇总</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tlnp</span><span style="color:#7F848E;font-style:italic;">                 # TCP监听端口</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tn</span><span style="color:#98C379;"> state</span><span style="color:#98C379;"> established</span><span style="color:#7F848E;font-style:italic;"> # 已建立连接</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tn</span><span style="color:#98C379;"> state</span><span style="color:#98C379;"> time-wait</span><span style="color:#7F848E;font-style:italic;">   # TIME_WAIT连接</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 网卡统计 =====</span></span>
<span class="line"><span style="color:#61AFEF;">ethtool</span><span style="color:#D19A66;"> -S</span><span style="color:#98C379;"> eth0</span><span style="color:#7F848E;font-style:italic;">          # 网卡详细统计（丢包/错误等）</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /proc/net/dev</span><span style="color:#7F848E;font-style:italic;">        # 各网卡收发统计</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 协议栈统计 =====</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /proc/net/snmp</span><span style="color:#7F848E;font-style:italic;">       # SNMP统计（TCP/UDP/IP层）</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /proc/net/netstat</span><span style="color:#7F848E;font-style:italic;">    # 扩展统计</span></span>
<span class="line"><span style="color:#61AFEF;">nstat</span><span style="color:#D19A66;"> -az</span><span style="color:#7F848E;font-style:italic;">               # 所有内核统计</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 中断统计 =====</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /proc/interrupts</span><span style="color:#7F848E;font-style:italic;">     # 中断分布</span></span>
<span class="line"><span style="color:#61AFEF;">watch</span><span style="color:#D19A66;"> -n1</span><span style="color:#98C379;"> cat</span><span style="color:#98C379;"> /proc/softirqs</span><span style="color:#7F848E;font-style:italic;">  # 软中断统计</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== conntrack =====</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /proc/sys/net/netfilter/nf_conntrack_count</span><span style="color:#7F848E;font-style:italic;">  # 当前连接数</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /proc/sys/net/netfilter/nf_conntrack_max</span><span style="color:#7F848E;font-style:italic;">    # 最大连接数</span></span>
<span class="line"><span style="color:#61AFEF;">conntrack</span><span style="color:#D19A66;"> -L</span><span style="color:#7F848E;font-style:italic;">             # 列出所有连接</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 路由 =====</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> show</span><span style="color:#7F848E;font-style:italic;">            # 路由表</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> get</span><span style="color:#D19A66;"> 8.8.8.8</span><span style="color:#7F848E;font-style:italic;">    # 查看到某地址的路由</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> rule</span><span style="color:#98C379;"> show</span><span style="color:#7F848E;font-style:italic;">             # 策略路由规则</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 高级诊断 =====</span></span>
<span class="line"><span style="color:#61AFEF;">perf</span><span style="color:#98C379;"> top</span><span style="color:#D19A66;"> -g</span><span style="color:#7F848E;font-style:italic;">              # 性能热点（看内核函数）</span></span>
<span class="line"><span style="color:#61AFEF;">dropwatch</span><span style="color:#7F848E;font-style:italic;">                # 内核丢包监控</span></span>
<span class="line"><span style="color:#61AFEF;">tcpdump</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> eth0</span><span style="color:#D19A66;"> -nn</span><span style="color:#7F848E;font-style:italic;">      # 抓包分析</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="典型问题排查" tabindex="-1"><a class="header-anchor" href="#典型问题排查"><span>典型问题排查</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>问题1: 连接建立慢</span></span>
<span class="line"><span>  检查: syn_queue和accept_queue是否溢出</span></span>
<span class="line"><span>  → netstat -s | grep &quot;SYNs to LISTEN&quot;</span></span>
<span class="line"><span>  → netstat -s | grep &quot;overflow&quot;</span></span>
<span class="line"><span>  解决: 增大tcp_max_syn_backlog和somaxconn</span></span>
<span class="line"><span></span></span>
<span class="line"><span>问题2: TIME_WAIT过多</span></span>
<span class="line"><span>  检查: ss -s</span></span>
<span class="line"><span>  解决: 客户端开启tcp_tw_reuse，使用长连接</span></span>
<span class="line"><span></span></span>
<span class="line"><span>问题3: 网卡丢包</span></span>
<span class="line"><span>  检查: ethtool -S eth0 | grep drop</span></span>
<span class="line"><span>  → rx_dropped: Ring Buffer满，增大Ring Buffer</span></span>
<span class="line"><span>  → rx_missed_errors: 网卡硬件丢包，检查中断亲和性</span></span>
<span class="line"><span></span></span>
<span class="line"><span>问题4: 软中断CPU不均</span></span>
<span class="line"><span>  检查: cat /proc/softirqs | grep NET_RX</span></span>
<span class="line"><span>  解决: 配置RPS将收包分散到多核</span></span>
<span class="line"><span>  → 设置/proc/irq/&lt;irq&gt;/smp_affinity绑定硬中断</span></span>
<span class="line"><span>  → 配置RPS/RFS</span></span>
<span class="line"><span></span></span>
<span class="line"><span>问题5: conntrack表满</span></span>
<span class="line"><span>  检查: dmesg | grep &quot;table full&quot;</span></span>
<span class="line"><span>  解决: 增大nf_conntrack_max或缩小超时时间</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2>`,8),i(d,{code:`eJxtk99S2kAUxu99ilzqRYerPoAwaplRYYCZ1t5kIC5tRgxpSKbtnahA5E/R+rdqgTh1YGwBazuAgvIynN3NW3QNScSZXub3fdmz5+x31kVpdT0qT3Gckkyq09OLoqR9Ivd7pH8OpTJttXBNn5lhMsfhWg+GW/jwGpdapL+PK9sW5rjUGh/T4nE4O8PFnPlVxw0DKgVXjPGp91EFrfKiFE+CniU7OVszzzq40KV/v0OmYJ5m8fkd6B1Li/iCdFjBXy5JyyC7Wds/6u3gXwYuG3jHOZ4V+CzxHzSkISjlx/+YJ1XQj11DVBCQrNqeTOO/nvDKMudLJtdEZJ7cwINhC48tsYLFy8mCEf/SHP961h9xiSrIvPqRV5CWQjbEhUswWKG605EFMxew24Z844lYNjM9hEzJhTD8aW5UzVxpNKh5cPoCfjxpXm/I49NiokBax/jPocWXkRoXEypSsJHFFafcy1Hv6hVriWze2kSU1WgsgVK0vg36Nyjemm5RKT6WSL8+6vctKCQlSVWiwtp4YLRbpb0r2x7R5ATCtRxtO08D+zr0itRo4Cob1oNNSb6DN9LsXSeekXbb5OD3M9u83+tZ9L2IKKIzvrGJDPaheeKc1Twih+waj4KFWEqhZOCDDpT3oJhxM9LER03P8mzQT+9btH1h85AoveO8LKZIsclCKEDTp7CrO45g2BOaD3veBMMWcdOJ8xv4vO3kGUmrbNrORVNyQhScj6XwAv92LhTwBYIrFoJshm0Nvd4aDZw2JuMH5U22Tk5/rNnsDRTvnlG2CNx8NKVyARlJU/8AJyCa6g==`}),o[11]||=n(`<p>Linux网络协议栈是一个庞大而精密的系统，从最底层的网卡驱动到最顶层的Socket接口，每一层都经过了数十年的演进和优化。理解其核心原理——sk_buff的指针模型、TCP的连接管理、Netfilter的Hook机制、NAPI的轮询策略——是诊断网络问题和进行性能调优的基础。</p><div class="hint-container info"><p class="hint-container-title">延伸阅读</p><ul><li>《深入理解Linux内核》（Understanding the Linux Kernel）—— Daniel P. Bovet, Marco Cesati</li><li>《Linux内核设计与实现》（Linux Kernel Development）—— Robert Love</li><li>Linux内核源码：<code>net/ipv4/</code>、<code>net/core/</code>、<code>net/netfilter/</code></li><li>RFC 793（TCP）、RFC 6298（RTO）、RFC 5681（拥塞控制）</li><li>Google BBR论文：BBR: Congestion-Based Congestion Control</li></ul></div>`,2)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};