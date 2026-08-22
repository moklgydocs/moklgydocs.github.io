# MCP 传输 —— stdio vs Streamable HTTP vs SSE 迁移

> stdio 只在本地好使，出了本机哪儿都去不了。Streamable HTTP(2025-03-26）是远程标准。旧的 HTTP+SSE 传输已废弃，2026 年中开始移除。选错传输，代价是一次迁移；选对传输，你得到的是一个可远程托管、带会话连续性和 DNS 重绑定防护的 MCP 服务器。

**类型：** Learn
**编程语言：** Python（标准库，Streamable HTTP 端点骨架）
**前置要求：** 第 13 阶段 · 07、08(MCP 服务器与客户端）
**预计耗时：** 约 45 分钟

## 学习目标

- 按部署形态在 stdio 和 Streamable HTTP 之间做选择（本地 vs 远程、单进程 vs 集群）
- 实现 Streamable HTTP 单端点模式：POST 处理请求，GET 建立会话流
- 强制 `Origin` 校验和会话 id 语义，抵御 DNS 重绑定
- 在 2026 年中的移除死线前，把旧的 HTTP+SSE 服务器迁移到 Streamable HTTP

## 问题

MCP 的第一个远程传输（2024-11）是 HTTP+SSE：两个端点，一个接客户端的 POST，另一个是服务器到客户端的 Server-Sent-Events 通道。能用，但笨拙：每个会话两个端点、某些 CDN 前面的缓存会坏掉、而且对长命 SSE 连接有硬依赖——有些 WAF 会 aggressively 掐断这种连接。

2025-03-26 版规范用 Streamable HTTP 取代了它：一个端点，POST 处理客户端请求，GET 建立会话流，两者共享 `Mcp-Session-Id` 头。那之后新建或迁移的服务器都用 Streamable HTTP。旧的 SSE 模式正在退场——Atlassian Rovo 在 2026 年 6 月 30 日移除，Keboola 在 2026 年 4 月 1 日，其余大多数企业服务器在 2026 年底前。

而 stdio 对本地服务器依然重要。Claude Desktop、VS Code 和一切 IDE 形态的客户端都通过 stdio 拉起服务器。正确的心智模型：stdio 管"这台机器",Streamable HTTP 管"跨网络"。互不跨界。

## 概念

### stdio

- 子进程传输。客户端拉起服务器，经 stdin/stdout 通信。
- 一行一个 JSON 对象，换行分隔。
- 没有会话 id；进程身份就是会话。
- 不需要认证（子进程继承父进程的信任边界）。
- 永远不要用于远程服务器——那得用 SSH 或 socat 打隧道，到那一步不如直接用 Streamable HTTP。

### Streamable HTTP

单端点 `/mcp`（或任意路径），支持三种 HTTP 方法：

- **POST /mcp。** 客户端发送一条 JSON-RPC 消息。服务器回复单个 JSON 响应，或一条 SSE 流（一个或多个响应——适合该请求相关的批量响应和通知）。
- **GET /mcp。** 客户端打开一条长命 SSE 通道。服务器用它发服务器到客户端的请求（sampling、通知、elicitation)。
- **DELETE /mcp。** 客户端显式终止会话。

会话由 `Mcp-Session-Id` 头标识：服务器在第一个响应上设置它，客户端在之后每个请求上回显。会话 id 必须是密码学随机的（128+ 位）；出于安全，客户端自选的 id 会被拒绝。

### 单端点 vs 双端点

旧规范的双端点模式在 2026 年仍可调用——规范宣布它"兼容旧版"。但所有新服务器都应该是单端点。官方 SDK 发出的就是单端点；只有和未迁移的远程服务器对话时才用旧模式。

### `Origin` 校验与 DNS 重绑定

浏览器（目前）不是 MCP 客户端，但攻击者可以构造一个网页，诱使浏览器向 `localhost:1234/mcp` 发 POST——那里正监听着你本地的 MCP 服务器。如果服务器不检查 `Origin`，浏览器的同源策略救不了它，因为 `Origin: http://evil.com` 在跨域规则下是合法的。

2025-11-25 版规范要求服务器拒绝 `Origin` 不在白名单上的请求。白名单通常包含 MCP 客户端宿主（`https://claude.ai`、`vscode-webview://*`）以及本地 UI 的 localhost 变体。

### 会话 id 生命周期

1. 客户端发第一个请求，不带 `Mcp-Session-Id`。
2. 服务器分配一个随机 id，在响应头上设置 `Mcp-Session-Id`。
3. 客户端在之后所有请求以及 `GET /mcp` 建立流时回显该头。
4. 服务器可以撤销会话；客户端在后续请求上收到 404，必须重新 initialize。
5. 客户端可以显式 DELETE 会话，干净关闭。

### 保活与重连

SSE 连接会掉。客户端用同一个 `Mcp-Session-Id` 重新 GET 来重建。服务器必须把中断期间错过的事件排队（在合理窗口内），并通过客户端回显的 `last-event-id` 头重放。

第 13 阶段 · 13 讲 Tasks，它让长时间运行的工作即使在会话完全重连后也能存活。

### 向后兼容探测

想同时支持新旧服务器的客户端：

1. POST 到 `/mcp`。
2. 响应是 `200 OK` 带 JSON 或 SSE——这是 Streamable HTTP。
3. 响应是 `200 OK` 带 `Content-Type: text/event-stream`，且有指向次级端点的 `Location` 头——这是旧的 HTTP+SSE；跟随 `Location`。

### Cloudflare、ngrok 与托管

2026 年的生产远程 MCP 服务器跑在 Cloudflare Workers（用他们的 MCP Agents SDK)、Vercel Functions，或容器化的 Node/Python 上。关键：你的托管必须支持长命 HTTP 连接给 SSE 的 GET。Vercel 免费档上限 10 秒，不可用；Cloudflare Workers 支持无限时长的流。

### 网关组合

当你用网关挡在多个 MCP 服务器前面时（第 13 阶段 · 17)，网关就是一个单独的 Streamable HTTP 端点，它改写会话 id 并向上游复用。工具在网关层合并；客户端看到的是一个逻辑上的单一服务器。

### 传输故障模式

- **stdio SIGPIPE。** 子进程在写入中途死亡触发 SIGPIPE；服务器应干净退出，客户端应检测 EOF 并标记会话死亡。
- **HTTP 502 / 504。** Cloudflare、nginx 等代理在上游故障时发出这些。Streamable HTTP 客户端应短暂退避后重试一次。
- **SSE 连接掉线。** TCP RST、代理超时或客户端网络切换会关闭流。客户端带 `Mcp-Session-Id` 和可选的 `last-event-id` 重连恢复。
- **会话撤销。** 服务器使会话 id 失效；客户端下次请求看到 404，必须重新握手。
- **时钟偏移。** 客户端的资源 TTL 计算与服务器分歧。客户端应以服务器时间戳为准。

### 什么时候绕过 Streamable HTTP

有些企业把 MCP 服务器部署在自家网络内的 gRPC 或消息队列传输后面。这是非标准的——MCP 规范没有正式定义这些。网关可以对外暴露 Streamable HTTP 表面给 MCP 客户端，内部走 gRPC。对外表面保持规范合规，翻译归网关管。

```figure
tp-transport-handshake
```

## 投入使用

`code/main.py` 用 `http.server`（标准库）实现了一个最小的 Streamable HTTP 端点：处理 `/mcp` 上的 POST、GET、DELETE，在首个响应上设置 `Mcp-Session-Id`，校验 `Origin`，拒绝非白名单来源的请求。处理器复用第 07 课笔记服务器的分发逻辑。

要看的地方：

- POST 处理器读取 JSON-RPC 请求体、分发、写 JSON 响应（单响应变体；SSE 变体结构类似）。
- `Origin` 检查拒绝默认的 `http://evil.example` 探测，接受 `http://localhost`。
- 会话 id 是随机 128 位十六进制串；服务器在内存里按会话存状态。

## 交付

本课产出 `outputs/skill-mcp-transport-migrator.md`。给它一个 HTTP+SSE（旧版）MCP 服务器，这个 skill 产出到 Streamable HTTP 的迁移方案：会话 id 连续性、Origin 检查和向后兼容探测支持。

## 练习

1. 跑 `code/main.py`。用 `curl` POST 一个 `initialize`，观察响应头里的 `Mcp-Session-Id`。再 POST 一个回显该头的请求，验证会话连续性。

2. 加一个 GET 处理器，打开 SSE 流，每 5 秒发一条 `notifications/progress` 事件。用同一会话 id 重新 GET 重连，确认服务器接受。

3. 实现 `last-event-id` 重放逻辑：重连时，重放该 id 之后生成的所有事件。

4. 扩展 `Origin` 校验以支持通配模式（`https://*.example.com`)，确认它接受 `https://app.example.com` 但拒绝 `https://evil.example.com.attacker.net`。

5. 从官方注册表挑一个旧的 HTTP+SSE 服务器（有好几个），勾画迁移方案：端点处理、会话 id 生成和头语义各要改什么。

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|------------------------|
| stdio 传输 | "本地子进程" | stdin/stdout 上的 JSON-RPC，换行分隔 |
| Streamable HTTP | "远程传输" | 单端点 POST + GET + 可选 SSE,2025-03-26 版规范 |
| HTTP+SSE | "老黄历" | 双端点模式，2026 年中开始移除 |
| `Mcp-Session-Id` | "会话头" | 服务器分配的随机 id，之后每个请求都回显 |
| `Origin` 白名单 | "DNS 重绑定防御" | 拒绝 Origin 未获批准的请求 |
| 单端点 | "一个 URL" | `/mcp` 一个端点处理所有会话操作：POST / GET / DELETE |
| `last-event-id` | "SSE 重放" | 用于恢复掉线的流而不丢事件的头 |
| 向后兼容探测 | "新旧检测" | 客户端按响应形状检查，自动选择传输 |
| 长命 HTTP | "SSE 流" | 服务器在一条 TCP 连接上推送数分钟到数小时的事件 |
| 会话撤销 | "强制重新初始化" | 服务器使会话 id 失效；客户端必须重新握手 |

## 延伸阅读

- [MCP —— 基础传输规范 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports) —— stdio 与 Streamable HTTP 的权威参考
- [MCP —— 基础传输规范 2025-03-26](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports) —— 引入 Streamable HTTP 的那一版
- [Cloudflare —— MCP 传输](https://developers.cloudflare.com/agents/model-context-protocol/transport/) —— Workers 托管的 Streamable HTTP 模式
- [AWS —— MCP 传输机制](https://builder.aws.com/content/35A0IphCeLvYzly9Sw40G1dVNzc/mcp-transport-mechanisms-stdio-vs-streamable-http) —— 各部署形态对比
- [Atlassian —— HTTP+SSE 弃用公告](https://community.atlassian.com/forums/Atlassian-Remote-MCP-Server/HTTP-SSE-Deprecation-Notice/ba-p/3205484) —— 具体迁移死线的例子
