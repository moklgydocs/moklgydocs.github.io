# MCP 安全 II —— OAuth 2.1、资源指示器、增量授权

> 远程 MCP 服务器要的是授权（authorization)，不只是认证（authentication)。2025-11-25 版规范对齐了 OAuth 2.1 + PKCE + 资源指示器（RFC 8707)+ 受保护资源元数据（RFC 9728)。SEP-835 加入了增量 scope 同意：在 403 WWW-Authenticate 上做权限提升授权。本课把提升流程实现为一台状态机，让你看清每一跳。

**类型：** Build
**编程语言：** Python（标准库，OAuth 状态机模拟器）
**前置要求：** 第 13 阶段 · 09（传输）、第 13 阶段 · 15（安全 I)
**预计耗时：** 约 75 分钟

## 学习目标

- 区分资源服务器和授权服务器的职责
- 走完 PKCE 保护的 OAuth 2.1 授权码流程
- 用 `resource`(RFC 8707）和受保护资源元数据（RFC 9728）防止混淆代理人攻击
- 实现权限提升授权：服务器以 403 带 WWW-Authenticate 要求更大 scope；客户端重新请求用户同意并重试

## 问题

早期的 MCP(2025 年之前）用临时的 API key，甚至裸奔。2025-11-25 版规范用一套完整的 OAuth 2.1 配置补上了这个缺口。

三个真实世界的需求：

- **普通的远程服务器。** 用户安装一个要访问他们 Notion / GitHub / Gmail 的远程 MCP 服务器。带 PKCE 的 OAuth 2.1 是正确的形状。
- **权限提升。** 已被授予 `notes:read` 的笔记服务器，后来为某个动作需要 `notes:write`。不用重走整个流程，提升授权（SEP-835）只请求追加的那个 scope。
- **防混淆代理人。** 客户端持有一个受众限定为服务器 A 的令牌。A 是恶意的，想把令牌拿给服务器 B 用。资源指示器（RFC 8707）把令牌钉在它预定的受众上。

OAuth 2.1 不是新东西。新的是 MCP 的配置：指定必须的流程（只用授权码 + PKCE；默认不用 implicit、不用 client credentials)、每次令牌请求强制带资源指示器、发布受保护资源元数据让客户端知道该去哪。

## 概念

### 角色

- **客户端（Client)。** MCP 客户端（Claude Desktop、Cursor 等）。
- **资源服务器（Resource server)。** MCP 服务器（笔记、GitHub、Postgres，什么都行）。
- **授权服务器（Authorization server)。** 发令牌的。可以和资源服务器是同一个服务，也可以是独立的 IdP(Auth0、Keycloak、Cognito)。

在 MCP 的配置里，资源服务器和授权服务器可以是同一个主机，但应该用不同 URL 区分。

### 授权码 + PKCE

流程：

1. 客户端生成 `code_verifier`（随机）和 `code_challenge`(SHA256)。
2. 客户端把用户重定向到 `/authorize?response_type=code&client_id=...&redirect_uri=...&scope=notes:read&code_challenge=...&resource=https://notes.example.com`。
3. 用户同意。授权服务器重定向到 `redirect_uri?code=...`。
4. 客户端 POST 到 `/token?grant_type=authorization_code&code=...&code_verifier=...&resource=...`。
5. 授权服务器把 verifier 的哈希与存储的 challenge 比对，签发访问令牌。
6. 客户端使用令牌：对资源服务器的每个请求都带 `Authorization: Bearer ...`。

PKCE 防授权码拦截攻击；资源指示器防令牌在别处有效。

### 受保护资源元数据（RFC 9728)

资源服务器发布一份 `.well-known/oauth-protected-resource` 文档：

```json
{
  "resource": "https://notes.example.com",
  "authorization_servers": ["https://auth.example.com"],
  "scopes_supported": ["notes:read", "notes:write", "notes:delete"]
}
```

客户端从资源服务器发现授权服务器。减少了配置——客户端只需要资源 URL。

### 资源指示器（RFC 8707)

令牌请求里的 `resource` 参数，把令牌的预定受众钉死。签发的令牌含 `aud: "https://notes.example.com"`。另一个收到这个令牌的 MCP 服务器检查 `aud`，拒绝它。

### Scope 模型

Scope 是空格分隔的字符串。MCP 常见约定：

- `notes:read`、`notes:write`、`notes:delete`
- `admin:*` 给管理能力（慎用）
- `profile:read` 给身份信息

Scope 选择应该最小特权：现在要多少要多少，不够时再提升。

### 权限提升授权（SEP-835)

用户授予了 `notes:read`。后来他们让智能体删一条笔记。服务器响应：

```
HTTP/1.1 403 Forbidden
WWW-Authenticate: Bearer error="insufficient_scope",
    scope="notes:delete", resource="https://notes.example.com"
```

客户端看到 insufficient_scope 错误，向用户弹出追加 scope 的同意对话框，为它执行一个小型 OAuth 流程，然后带新令牌重试请求。

### 令牌受众校验

每个请求：服务器检查 `token.aud == self.resource_url`。不匹配 = 401。这挡住了跨服务器令牌复用。

### 短寿命令牌与轮换

访问令牌应该短寿命（默认 1 小时）。刷新令牌每次刷新都轮换。客户端在后台静默刷新。

### 禁止令牌透传

sampling 服务器（第 13 阶段 · 11）绝不允许把客户端的令牌透传给其他服务。sampling 请求就是边界。

### 防混淆代理人

令牌绑定 `aud`，客户端绑定 `client_id`。每个请求对两者都校验。规范明确禁止了 MCP 之前的远程工具生态里常见的"令牌传递"模式。

### 客户端 ID 发现

每个 MCP 客户端在固定 URL 发布自己的元数据。授权服务器可以拉取客户端的元数据文档，发现重定向 URI 和联系信息。这免掉了手工的客户端注册。

### 网关与 OAuth

第 13 阶段 · 17 展示企业网关怎么处理 OAuth：网关持有上游服务器的凭据，发给客户端的令牌由网关签发，上游令牌永远不离开网关。这把信任模型翻转了——用户只对网关认证一次；网关去处理 N 个服务器的授权。

```figure
t3-scope-stepup
```

## 投入使用

`code/main.py` 把完整的 OAuth 2.1 提升流程模拟为一台状态机。它实现：

- PKCE code-verifier / challenge 生成。
- 带资源指示器的授权码流程。
- 受保护资源元数据端点。
- 带受众检查的令牌校验。
- `insufficient_scope` 上的提升。

本课没有 HTTP 服务器；状态机在内存里跑，方便你追踪每一跳。第 13 阶段 · 17 的网关课会把它接到真实传输上。

## 交付

本课产出 `outputs/skill-oauth-scope-planner.md`。给它一个带工具的远程 MCP 服务器，这个 skill 设计 scope 集合、钉住规则和提升策略。

## 练习

1. 跑 `code/main.py`。追踪两 scope 的提升流程。记下提升时哪些跳会重复。

2. 加刷新令牌轮换：每次刷新签发新刷新令牌并作废旧的。模拟一个被偷的刷新令牌在轮换之后被使用，确认它失败。

3. 用标准库 http.server 把受保护资源元数据端点实现为真实的 HTTP 响应。对照第 09 课的 /mcp 端点。

4. 为一个 GitHub MCP 服务器设计 scope 层级：read repo、write PR、approve PR、merge PR、admin。每级之间用提升授权。

5. 读 RFC 8707 和 RFC 9728。找出 MCP 在 9728 中与 RFC 示例用法不同的一个字段。（提示：和 `scopes_supported` 有关。)

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|------------------------|
| OAuth 2.1 | "现代 OAuth" | 强制 PKCE、禁用 implicit 流的整合 RFC |
| PKCE | "持有证明" | code verifier + challenge，挫败授权码拦截 |
| 资源指示器 | "令牌受众" | RFC 8707 的 `resource` 参数，把令牌钉在一台服务器上 |
| 受保护资源元数据 | "发现文档" | RFC 9728 的 `.well-known/oauth-protected-resource` |
| 权限提升授权 | "增量同意" | 按需追加 scope 的 SEP-835 流程 |
| `insufficient_scope` | "403 带 WWW-Authenticate" | 服务器要求用户为更大 scope 重新同意的信号 |
| 混淆代理人 | "跨服务令牌复用" | 可信持有方不当转发令牌的攻击 |
| 短寿命令牌 | "访问令牌 TTL" | 很快过期的 Bearer；由刷新令牌续期 |
| Scope 层级 | "最小特权栈" | 逐级递增的 scope 集合，级间用提升授权 |
| 客户端 ID 元数据 | "客户端发现文档" | 客户端发布自己 OAuth 元数据的 URL |

## 延伸阅读

- [MCP —— 授权规范](https://modelcontextprotocol.io/specification/draft/basic/authorization) —— MCP OAuth 配置的权威定义
- [den.dev —— MCP 11 月授权规范](https://den.dev/blog/mcp-november-authorization-spec/) —— 2025-11-25 变更走读
- [RFC 8707 —— OAuth 2.0 资源指示器](https://datatracker.ietf.org/doc/html/rfc8707) —— 钉住受众的 RFC
- [RFC 9728 —— OAuth 2.0 受保护资源元数据](https://datatracker.ietf.org/doc/html/rfc9728) —— 发现文档的 RFC
- [Aembit —— MCP OAuth 2.1、PKCE 与 AI 授权的未来](https://aembit.io/blog/mcp-oauth-2-1-pkce-and-the-future-of-ai-authorization/) —— 提升流程实战走读
