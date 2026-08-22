# 生产环境的 MCP 认证 —— 注册、JWKS 刷新、受众钉住的令牌

> 第 16 课在内存里搭起了 OAuth 2.1 状态机。到 2026 年，你交付给任何真实组织的每一个 MCP 服务器，都架在生产级认证后面：能扩展到无上限客户端数量的注册机制（首选 Client ID Metadata Documents，动态客户端注册作为向后兼容的退路）、授权服务器元数据发现（RFC 8414 *或* OpenID Connect Discovery)、不会搞垮凌晨三点令牌校验的 JWKS 缓存刷新，以及拒绝跨资源重放的受众钉住令牌。本课用三个角色——授权服务器、资源服务器（即 MCP 服务器）和客户端——建模整个表面，让你能从发现一路追踪到一次通过校验的工具调用。
>
> **规范说明（2025-11-25):** 2025 年 11 月的 MCP 授权规范把动态客户端注册（DCR）从 `SHOULD` 降级为 `MAY`，并把 **Client ID Metadata Documents(CIMD)** 定为推荐的默认注册机制。本课按规范的优先级顺序两者都教；代码走 DCR 做演示，因为它能完全自包含在一个进程里。

**类型：** Build
**编程语言：** Python（标准库）
**前置要求：** 第 13 阶段 · 16(OAuth 2.1 状态机）、第 13 阶段 · 17（网关）
**预计耗时：** 约 90 分钟

## 学习目标

- 通过 RFC 8414 元数据发现授权服务器，并验证契约
- 实现 RFC 7591 动态客户端注册，让 MCP 客户端无需管理员介入即可注册
- 按计划缓存和刷新 JWKS 密钥，让签名校验在密钥轮换中存活
- 用 RFC 8707 资源指示器把令牌钉在单个 MCP 资源上，拒绝混淆代理人式的复用
- 干净地分离三个角色——授权服务器、资源服务器、客户端——让每个只强制属于自己的检查
- 读懂 IdP 能力矩阵，在 IdP 无法满足 MCP 认证配置时拒绝部署

## 问题

第 16 课的模拟器在内存里跑 OAuth 2.1。生产环境有三个只在内存里看不见的运营缺口。

第一个缺口是**注册**。一个真实组织跑着几百个 MCP 服务器和几千个 MCP 客户端。运维不会手工把每个 Cursor 用户注册为 OAuth 客户端。2025-11-25 版规范给客户端定了一个优先级顺序：有预注册的 `client_id` 就用它；否则用 **Client ID Metadata Document**（客户端用它控制的一个 HTTPS URL 标识自己，授权服务器*拉取*元数据）；否则退回 **RFC 7591 动态客户端注册**（客户端*推送*一个 `POST /register`，当场拿到 `client_id`)；再否则提示用户。CIMD 是推荐的默认，因为它完全免掉了按服务器注册，同时保住以 DNS 为根的信任模型；DCR 保留用于向后兼容。两者都从授权服务器的元数据里发现入口：CIMD 看 `client_id_metadata_document_supported`,DCR 看 `registration_endpoint`。

第二个缺口是**密钥轮换**。JWT 校验依赖授权服务器的签名密钥，以 JSON Web Key Set(JWKS）形式发布。授权服务器按计划轮换这些密钥（常常每小时一次，事件响应时更快）。启动时拉一次 JWKS 的 MCP 服务器，在轮换窗口之前一切正常——然后所有请求全部失败，直到重启。生产环境把 JWKS 接成一个缓存值，配一个在旧密钥过期前覆盖缓存的刷新任务，外加一个缓存未命中时的兜底拉取，处理"令牌由比缓存更新的密钥签发"的情形。

第三个缺口是**受众绑定**。第 16 课引入了 RFC 8707 资源指示器。在生产中，这个指示器变成每个请求上的硬性声明检查：MCP 服务器把 `token.aud` 与自己的规范资源 URL 比对，不匹配就以 HTTP 401 拒绝。这是对抗上游 MCP 服务器（或持有了本应属于某台服务器令牌的恶意客户端）在同一个信任网里向另一台服务器重放该令牌的唯一防线。

本课把每个缺口映射到表面的一个具体部件上：元数据文档是一个 HTTP 端点；JWKS 缓存刷新是一个定时任务加一个键值缓存；JWT 校验是资源服务器在分发任何工具之前跑的例程。三个角色保持分离，各自只强制自己拥有的检查：授权服务器签发并轮换密钥，资源服务器缓存并校验，客户端发现并注册。

## 概念

### RFC 8414 —— OAuth 授权服务器元数据

`/.well-known/oauth-authorization-server` 上的文档，描述客户端需要的一切：

```json
{
  "issuer": "https://auth.example.com",
  "authorization_endpoint": "https://auth.example.com/authorize",
  "token_endpoint": "https://auth.example.com/token",
  "jwks_uri": "https://auth.example.com/.well-known/jwks.json",
  "registration_endpoint": "https://auth.example.com/register",
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code", "refresh_token"],
  "code_challenge_methods_supported": ["S256"],
  "scopes_supported": ["mcp:tools.read", "mcp:tools.invoke"],
  "token_endpoint_auth_methods_supported": ["none", "private_key_jwt"]
}
```

拿到 MCP 资源 URL 的客户端链式发现：RFC 9728 的 `oauth-protected-resource`（资源服务器的文档）给出 issuer，然后 RFC 8414 的 `oauth-authorization-server` 给出每个端点。客户端永远不硬编码授权 URL。

在信任一个 IdP 跑 MCP 之前，你要验证的契约：

- `code_challenge_methods_supported` 含 `S256`(RFC 7636 的 PKCE)。规范说得很明白：这个字段**缺席**，说明授权服务器不支持 PKCE，客户端**必须**拒绝继续。
- `grant_types_supported` 含 `authorization_code`，拒绝 `password` 和 `implicit`。
- 至少宣告一条注册路径：`client_id_metadata_document_supported: true`(CIMD，首选）**或** `registration_endpoint`(RFC 7591 DCR，退路）。任一即满足契约；不再硬性要求 DCR。
- `response_types_supported` 恰好是 `["code"]`(OAuth 2.1)。

如果 `S256` 缺席，MCP 服务器拒绝对着这个 IdP 部署——PKCE 没有降级模式。如果*两条*注册路径都没宣告、你也没有预注册的 `client_id`，同样无法注册——那是部署清单错了，不是代码错了。

### RFC 9728（回顾）—— 受保护资源元数据

第 16 课讲过 RFC 9728。生产中的增量：这份文档是客户端寻找*这台* MCP 服务器信任的授权服务器的唯一去处。一台 MCP 服务器可能接受来自多个 IdP 的令牌（一个给员工、一个给合作伙伴）。RFC 9728 声明这个集合；RFC 8414 记录每个 IdP 支持什么。

```json
{
  "resource": "https://notes.example.com",
  "authorization_servers": ["https://auth.example.com", "https://partners.example.com"],
  "scopes_supported": ["mcp:tools.invoke"],
  "bearer_methods_supported": ["header"],
  "resource_documentation": "https://notes.example.com/docs"
}
```

### Client ID Metadata Documents（推荐的默认）

CIMD 把注册从*推送*反转为*拉取*。客户端不再请授权服务器铸造 `client_id`，而是用它控制的一个 HTTPS URL **当作**自己的 `client_id`。这个 URL 解析到一份 JSON 元数据文档；授权服务器在 OAuth 流程中按需拉取它。信任以 DNS 为根：如果服务器运营者信任 `app.example.com`，它就信任从 `https://app.example.com/client.json` 服务的客户端。没有注册往返，没有会耗尽的 `client_id` 命名空间，没有要按服务器同步的状态。

客户端托管的元数据文档：

```json
{
  "client_id": "https://app.example.com/oauth/client.json",
  "client_name": "Example MCP Client",
  "client_uri": "https://app.example.com",
  "redirect_uris": ["http://127.0.0.1:7333/callback", "http://localhost:7333/callback"],
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"],
  "token_endpoint_auth_method": "none"
}
```

文档里的 `client_id` 值**必须**等于它被服务的 URL（授权服务器会验证；不匹配就拒绝）。授权服务器在 RFC 8414 元数据里用 `client_id_metadata_document_supported: true` 宣告支持。

规范直言不讳的两个安全事实：

- **SSRF。** 授权服务器要拉取攻击者提供的 URL，必须防御服务器端请求伪造（不拉取内部/管理端点）。
- **localhost 冒充。** 仅靠 CIMD 无法阻止本地攻击者冒用一个合法客户端的元数据 URL，并绑定任意 `localhost` 重定向。授权服务器**必须**在同意界面清晰展示重定向 URI 的主机名，且**应当**对纯 `localhost` 重定向发出警告。

因为 CIMD 不需要服务器端状态，所以没有像 DCR 那样要搭的注册处。客户端侧是只读的：把你的元数据文档挂在一个静态 HTTPS 端点上，让授权服务器来拉。

### RFC 7591 —— 动态客户端注册（退路 / 向后兼容）

DCR 现在是 `MAY`，为 2025-11-25 之前的部署和尚未支持 CIMD 的 IdP 保留，作向后兼容。没有它（也没有 CIMD 或预注册），每个 MCP 客户端（Cursor、Claude Desktop、自定义智能体）都得和 IdP 管理员做带外交换。有了 DCR，客户端提交：

```json
POST /register
Content-Type: application/json

{
  "redirect_uris": ["http://127.0.0.1:7333/callback"],
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"],
  "token_endpoint_auth_method": "none",
  "scope": "mcp:tools.invoke",
  "client_name": "Cursor",
  "software_id": "com.cursor.cursor",
  "software_version": "0.42.0"
}
```

服务器响应 `client_id` 和用于后续更新的 `registration_access_token`:

```json
{
  "client_id": "c_3e7f1a",
  "client_id_issued_at": 1769472000,
  "redirect_uris": ["http://127.0.0.1:7333/callback"],
  "grant_types": ["authorization_code", "refresh_token"],
  "registration_access_token": "regt_b2...",
  "registration_client_uri": "https://auth.example.com/register/c_3e7f1a"
}
```

`token_endpoint_auth_method: none` 是跑在用户设备上的 MCP 客户端的正确默认：它们只拿 `client_id`——没有可被外泄的 `client_secret`。PKCE 提供了公共客户端所需的持有证明。

三个生产陷阱：

- 注册端点必须按来源 IP 限流。否则，恶意行为者脚本化地制造百万假注册，耗尽 `client_id` 命名空间。在注册器处理请求之前先跑限流检查。
- `software_statement`（一份为客户端担保的签名 JWT）是某些企业 IdP 的硬性要求。本课的模拟跳过它；生产要接一个校验步骤：除了 localhost 重定向 URI 之外，拒绝一切未签名的注册。
- `registration_access_token` 必须存哈希，不能存明文。这个令牌被偷，攻击者就能改写客户端的重定向 URI。

### RFC 8707（回顾）—— 资源指示器

第 16 课确立了形状。生产规则：每个令牌请求都带 `resource=<canonical-mcp-url>`,MCP 服务器在每次调用时校验 `token.aud` 与自己的资源 URL 匹配。规范 URI 是服务器*最具体*的标识符：scheme 和 host 小写、无 fragment、惯例上无尾斜杠。路径部分**不**按规则剥除——规范在需要用它来标识单个 MCP 服务器时保留它。`https://mcp.example.com`、`https://mcp.example.com/mcp`、`https://mcp.example.com:8443`、`https://mcp.example.com/server/mcp` 都是合法的规范 URI。每台服务器选一个，把 `aud` 精确钉在它上面。（本课的模拟为简洁用裸主机受众，如 `https://notes.example.com`；同一 origin 下共托管多个 MCP 服务器的部署，用路径区分。)

### RFC 7636（回顾）—— PKCE

PKCE 在 OAuth 2.1 中是强制的。本课的授权码流程永远携带 `code_challenge` 和 `code_verifier`。服务器拒绝任何没有 verifier、或 verifier 哈希与存储的 challenge 不符的令牌请求。

### MCP 规范 2025-11-25 认证配置

MCP 规范（2025-11-25）对 MCP 服务器的授权层必须做什么写得很明确：

- 实现 RFC 9728 受保护资源元数据，并通过两种方式之一提供其位置：401 上的 `WWW-Authenticate: Bearer resource_metadata="..."` 头，**或** well-known URI `/.well-known/oauth-protected-resource`(SEP-985 使该头成为可选，well-known 兜底）。元数据的 `authorization_servers` 字段**必须**至少列出一台服务器。
- 在**每个**请求上只经 `Authorization: Bearer ...` 接受令牌——绝不用查询字符串，绝不只在会话开始时校验一次。
- 按请求校验 `aud`、`iss`、`exp` 和所需 scope。服务器**必须**验证令牌是专门为它签发的（受众）;`aud` 缺失或不匹配即拒绝，绝不当作通配处理。
- 401/403 时，返回携带 `error=...` 的 `WWW-Authenticate: Bearer`，以及 `resource_metadata="<PRM-URL>"` 参数（元数据文档的 URL,*不是*裸资源）;`insufficient_scope`(403）时带 `scope="..."`。注意：参数是 `resource_metadata`，一个发现指针——challenge 里没有 `resource` 参数。
- 授权服务器发现接受 **RFC 8414 OAuth 元数据或 OpenID Connect Discovery 1.0 之一**；客户端必须按优先级顺序尝试两种 well-known 后缀。
- 由客户端（而非服务器）防御 **mix-up 攻击**：重定向前记下期望的 `issuer`，在兑换授权码之前校验授权响应里的 `iss` 参数（RFC 9207)。仅靠 PKCE 挡不住 mix-up，因为客户端会把它的 `code_verifier` 交给它被引到的任何令牌端点。

OAuth 2.1 草案是地基；RFC 8414/7591/8707/9728/9207 + RFC 7636 + CIMD 是表面；MCP 规范是配置。

### IdP 能力矩阵

不是每个 IdP 都支持完整的 MCP 配置。下表记录截至 2025-11-25 版规范的事实性能力声明。它是*部署闸门*，不是推荐。

CIMD 随 2025-11-25 版规范发布，底层 OAuth 草案 2025 年 10 月才被采纳，所以厂商支持还在路上——把下面的 "CIMD" 读作"今天的状态，在你的租户里验证"，不是永久结论。

| IdP 类别 | AS 元数据（8414/OIDC) | CIMD | RFC 7591 DCR | RFC 8707 资源 | RFC 7636 S256 PKCE | 备注 |
|---|---|---|---|---|---|---|
| 自托管（Keycloak) | 是 | 出现中 | 是 | 是（24.x 起） | 是 | 本课 MCP 配置的参考 IdP;DCR 全路径端到端，CIMD 在跟进新规范 |
| 企业 SSO(Microsoft Entra ID) | 是 | 出现中 | 是（高级档） | 是 | 是 | DCR 可用性随租户档位不同；部署前在目标租户验证 |
| 企业 SSO(Okta) | 是 | 出现中 | 是（Okta CIC / Auth0) | 是 | 是 | DCR 在 Auth0（现 Okta CIC）可用；经典 Okta 组织需要管理员预注册 |
| 社交登录 IdP（泛指） | 不一定 | 否 | 很少 | 很少 | 是 | 大多数社交 IdP 把客户端当静态合作伙伴；没有自助注册。只当身份源用，在上面叠你自己的 MCP 感知授权服务器 |
| 自研 | 看情况 | 看情况 | 看情况 | 看情况 | 看情况 | 自己造就把完整配置造全，优先 CIMD。跳过 PKCE 或受众绑定就破坏了 MCP 认证契约 |

部署清单的拒绝规则：所选 IdP 的 `code_challenge_methods_supported` 里没有 `S256`,MCP 服务器拒绝启动——PKCE 没有降级模式。注册是较软的闸门：你需要*一条*能用的路径（预注册的 `client_id`、`client_id_metadata_document_supported: true`、或一个 `registration_endpoint`)。仅有 DCR 缺席不再是拒绝触发条件，因为 CIMD 或预注册可以覆盖。

### JWKS 刷新模式（在 AS 轮换，在资源服务器刷新）

把两个动词分开，因为混淆它们是一个真实存在的生产 bug:

- **轮换（Rotate)** 是*授权服务器*做的事：铸造新签名密钥、发布进 JWKS、稍后退役旧的。资源服务器与此无关，也做不到——它不持有 IdP 的私钥。
- **刷新（Refresh)** 是*资源服务器*做的事：把发布的 JWKS 重新 `GET` 进自己的缓存。这是资源服务器对 JWKS 执行的唯一动作。

生产故障模式是缓存变陈。解法：定时刷新任务加键值缓存。资源服务器跑一个任务（cron、定时器，随你的运行时），按固定间隔拉取 `<issuer>/.well-known/jwks.json` 并覆盖 `cache[issuer] = {keys, fetched_at}`。校验器从缓存读。令牌的 `kid` 不在缓存里，触发**一次**同步刷新作为兜底，然后重新检查。这同时处理两种情形：定时刷新，以及"由全新密钥签发的令牌在下一次定时刷新之前到达"的密钥重叠窗口。

兜底**必须是重新拉取，绝不能是轮换**。如果你把缓存未命中路径接成 rotate-and-mint，两件事会坏：(1) 新铸的密钥产生的 `kid` *仍然*对不上令牌，查找照样失败；(2) 攻击者拿随机 `kid` 值狂喷令牌，会逼出无休无止的密钥创建——自找的 DoS。重新拉取是幂等的，一个假 `kid` 最多浪费一次拉取。

缓存形状：

```json
{
  "https://auth.example.com": {
    "keys": [
      {"kid": "k_2026_03", "kty": "RSA", "n": "...", "e": "AQAB", "alg": "RS256", "use": "sig"},
      {"kid": "k_2026_04", "kty": "RSA", "n": "...", "e": "AQAB", "alg": "RS256", "use": "sig"}
    ],
    "fetched_at": 1772668800
  }
}
```

同时存在两把密钥是常态。授权服务器轮换时，先引入下一把（`k_2026_04`）再退役前一把（`k_2026_03`)，所以旧密钥签发的令牌在过期前仍然有效。缓存持有并集；校验器按 `kid` 选。

### 校验例程

MCP 服务器在分发任何工具之前跑校验。`code/main.py` 用的形状：

```python
result = server.validate(bearer_token, required_scope="mcp:tools.invoke")
if not result["valid"]:
    return {"status": result["status"], "WWW-Authenticate": result["www_authenticate"]}
```

`validate` 解码 JWT，从 JWKS 缓存解析签名密钥（未命中时兜底刷新一次），验证签名，然后按序检查：按白名单查 `iss`、按本服务器的规范资源查 `aud`、查 `exp`、查所需 scope——在第一个失败处返回 `WWW-Authenticate` challenge。把它做成资源服务器上的单一例程，意味着每个入口（每次工具调用、每种传输）都过同一套检查；不存在不校验就能到达工具的路径。

### 受众重放走查（访问令牌特权限制）

服务器 A(`notes.example.com`）和服务器 B(`tasks.example.com`）注册在同一个授权服务器下。A 被攻陷。攻击者拿着一个用户的笔记令牌，向服务器 B 重放。

服务器 B 的校验器：

1. 解码 JWT，按 `kid` 取 JWKS，验证签名。
2. 按它受保护资源元数据里的 `authorization_servers` 查 `iss`。（通过——同一个 IdP。)
3. 查 `aud == "https://tasks.example.com"`。（失败——令牌的 `aud` 是 `https://notes.example.com`。)
4. 返回 401，带 `WWW-Authenticate: Bearer error="invalid_token", error_description="audience mismatch", resource_metadata="https://tasks.example.com/.well-known/oauth-protected-resource"`。

受众声明是协议层防这种攻击的唯一防线。为性能跳过它是最常见的生产错误；校验器必须在每个请求上跑，而不是只在会话开始时。规范把这称为**访问令牌特权限制**:MCP 服务器**必须**拒绝任何受众里没有点名它的令牌。

> **命名说明。** 规范把 *confused deputy*（混淆代理人）一词留给一个相关但不同的问题：一个 MCP 服务器作为 OAuth **代理**转发到第三方 API，使用静态客户端 ID，在没有获得按客户端用户同意的情况下转发令牌。受众绑定治的是上面的重放；混淆代理人的治法是按客户端同意，**外加**永远不把入站令牌透传给上游 API(MCP 服务器**必须**获取自己独立的上游令牌）。

### Mix-up 攻击（服务器给不了的客户端侧防御）

客户端一生要和许多授权服务器打交道。恶意的 AS 可以试图让客户端把诚实 AS 的授权码拿到攻击者的令牌端点去兑换。受众绑定在这里帮不上忙——攻击发生在任何令牌存在之前。防御在客户端（RFC 9207):

1. 重定向之前，客户端从验证过的 AS 元数据里记下期望的 `issuer`。
2. 收到授权响应时，客户端在把授权码发往任何地方之前，把返回的 `iss` 参数与记下的 issuer 比对（简单字符串比较，不做归一化）。
3. 不匹配（或 AS 宣告了 `authorization_response_iss_parameter_supported` 而 `iss` 缺席）→ 拒绝，连 `error` 字段都不要展示。

仅靠 PKCE 挡不住 mix-up，因为客户端会把它的 `code_verifier` 交给它被引到的任何令牌端点。这就是为什么规范要求把 issuer 和 PKCE verifier、`state` 一起按请求记录。

### 故障模式

- **JWKS 变陈。** AS 轮换密钥后，校验器拒绝合法令牌。修法是上面的"定时刷新 + 未命中兜底拉取"模式。没有刷新任务，绝不缓存 JWKS。
- **兜底接成轮换。** 把缓存未命中路径接成 rotate-and-mint 而非重新拉取，是真实存在的 bug：它永远造不出缺失的 `kid`，还把攻击者控制的 `kid` 值变成密钥创建 DoS。兜底必须是幂等的 `refresh-jwks`。
- **`aud` 声明缺失。** 有些 IdP 默认省略 `aud`，除非令牌请求里带 `resource`。校验器必须拒绝 `aud` 缺失的令牌，不能把缺席当通配。
- **缺 `iss` 检查的 mix-up。** 不校验 RFC 9207 `iss` 授权响应参数的客户端，可能被引去在攻击者的令牌端点兑换诚实 AS 的授权码。这是客户端侧的失败，资源服务器无法补偿。
- **Scope 升级竞态。** 同一用户的两个并发提升流程可能都成功，产出两个 scope 不同的访问令牌。校验器必须用请求上呈的那个令牌，而不是去查"用户当前的 scope"——后者会开出 TOCTOU 窗口。
- **注册令牌被盗。** 泄漏的 `registration_access_token` 让攻击者改写重定向 URI。静态存哈希；要求客户端每次更新时出示明文；有嫌疑就轮换。
- **`iss` 没钉住。** 接受任意 `iss` 的校验器，会让攻击者自己搭一台授权服务器、注册一个面向目标受众的客户端、签发令牌。受保护资源元数据里的 `authorization_servers` 列表就是白名单；强制执行。

```figure
t3-jwks-rotate
```

## 投入使用

`code/main.py` 用标准库 Python 和三个角色——`AuthorizationServer`、`ResourceServer`、`Client`——走完整个生产流程：

1. 授权服务器在 `/.well-known/oauth-authorization-server` 发布 RFC 8414 元数据。
2. MCP 客户端调元数据端点，检查它的注册选项（CIMD 的 `client_id_metadata_document_supported`、DCR 的 `registration_endpoint`）和 `S256` PKCE 支持。
3. 演示走 DCR 退路：客户端 POST 到 `/register`(RFC 7591)，拿到 `client_id`。(CIMD 客户端则会出示自己的 HTTPS `client_id` URL，跳过这一步。)
4. MCP 客户端跑 PKCE 保护的授权码流程（RFC 7636)，带 `resource` 指示器（RFC 8707)。
5. MCP 客户端带 `Authorization: Bearer ...` 调 MCP 服务器上的工具。
6. MCP 服务器跑 `validate`，从 JWKS 缓存解析签名密钥。
7. IdP 轮换一把密钥；定时刷新把 JWKS 重新拉进缓存。
8. 下一次调用对着刷新后的密钥通过校验，不用重启；旧令牌在重叠窗口内也仍然有效。
9. 一次针对不同 MCP 资源的受众重放尝试，拿到 401 `audience mismatch` 和一个 `resource_metadata` 指针。

这里的 JWT 用 HS256 加共享密钥（这样本课只靠标准库就能跑）。生产用 RS256 或 EdDSA 加上面的 JWKS 模式；其余校验逻辑完全相同。因为 IdP 和资源服务器住在一个进程里，`refresh_jwks` 直接读授权服务器的密钥列表；在线上，它是对 `jwks_uri` 的一次 HTTP `GET`。

## 交付

本课产出 `outputs/skill-mcp-auth.md`。给它一个 MCP 服务器配置和一套 IdP 能力，这个 skill 输出要搭起的认证面：受保护资源元数据、该用的注册路径（CIMD、预注册或 DCR 退路）、JWKS 刷新计划、scope 映射，以及 IdP 不支持完整 RFC 配置时要应用的拒绝规则。

## 练习

1. 跑 `code/main.py`。追踪流程。记下 IdP 在第 6 步轮换密钥后，定时的 `refresh_jwks` 如何重新拉取发布的密钥集，以及旧令牌（重叠窗口内）和新令牌如何都不重启就能通过校验。

2. 往受保护资源元数据的 `authorization_servers` 列表里加一个新 IdP。签发新 IdP 的令牌，确认校验器接受；再签发一个未列出 IdP 的令牌，确认校验器以 `WWW-Authenticate: Bearer error="invalid_token", error_description="iss not allowed"` 拒绝。

3. 给 `register_client` 加一个限流检查，在注册器接受请求之前运行。用按来源 IP 的令牌桶，放在一个以 IP 为键的小字典里。

4. 读 RFC 7591，找出本课 `/register` 处理器没校验的两个字段，补上校验。（提示：`software_statement` 和 `redirect_uris` 的 URI scheme。)

5. 加一条 Client ID Metadata Document 路径：服务一个 `client_id` 等于自己 URL 的 `client.json`，让授权服务器拉取并验证它（`client_id` ≠ URL 就拒绝）。确认 CIMD 客户端不调 `register_client` 就完成了注册。

6. 证明 DoS 修复：发给校验器一个带随机 `kid` 的令牌，确认 `refresh_jwks` 最多跑一次，且授权服务器的密钥数不增长。然后故意把兜底改接成 rotate-and-mint，看密钥数随每个假令牌攀升——之后恢复重新拉取。

7. 实现 mix-up 一节里的客户端侧 RFC 9207 `iss` 检查：授权请求前记下期望的 issuer，然后拒绝 `iss` 不匹配的授权响应。

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|------------------------|
| ASM | "OAuth 元数据文档" | RFC 8414 的 `/.well-known/oauth-authorization-server` JSON |
| CIMD | "客户端元数据 URL" | Client ID Metadata Document——当作 `client_id` 用的 HTTPS URL，由 AS 拉取 JSON。2025-11-25 起的推荐默认 |
| DCR | "自助客户端注册" | RFC 7591 的 `POST /register` 流程；2025-11-25 被降级为 `MAY` 退路 |
| JWKS | "JWT 校验用的公钥" | JSON Web Key Set，从 `jwks_uri` 拉取，按 `kid` 索引 |
| 轮换 vs 刷新 | "更新密钥" | *轮换* = AS 铸造/退役签名密钥；*刷新* = 资源服务器重新拉取已发布的集合。资源服务器永远只刷新 |
| 资源指示器 | "受众参数" | RFC 8707 的 `resource` 参数，把令牌钉在一台服务器上 |
| `aud` 声明 | "受众" | 校验器与规范资源 URL 比对的 JWT 声明 |
| 受众重放 | "令牌重放" | 为服务器 A 签发的令牌被呈给服务器 B；靠受众校验防御（规范称：访问令牌特权限制） |
| 混淆代理人 | "代理令牌滥用" | 用静态客户端 ID 的 MCP 代理，未经按客户端同意就转发令牌；与受众重放不同 |
| Mix-up 攻击 | "错误的令牌端点" | 客户端被引去在攻击者端点兑换诚实 AS 的授权码；客户端侧用 RFC 9207 的 `iss` 防御 |
| `iss` 白名单 | "可信授权服务器" | 受保护资源元数据 `authorization_servers` 里点名的集合 |
| `resource_metadata` | "PRM 文档在哪" | 401/403 上 `WWW-Authenticate` 里指明 RFC 9728 元数据 URL 的参数 |
| 公共客户端 | "原生或浏览器客户端" | 没有 `client_secret` 的 OAuth 客户端；由 PKCE 补偿 |
| `WWW-Authenticate` | "401/403 响应头" | 携带驱动客户端恢复的 `Bearer error=...` 指令 |

## 延伸阅读

- [MCP —— 授权规范（2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization) —— 本课实现的 MCP 认证配置
- [MCP 博客 —— MCP 一周年：2025 年 11 月规范发布](https://blog.modelcontextprotocol.io/posts/2025-11-25-first-mcp-anniversary/) —— 2025-11-25 的变更（CIMD、XAA、DCR 降级）
- [Aaron Parecki —— 2025 年 11 月 MCP 授权规范中的客户端注册](https://aaronparecki.com/2025/11/25/1/mcp-authorization-spec-update) —— CIMD 优先于 DCR 的理由
- [OAuth Client ID Metadata Document(draft-ietf-oauth-client-id-metadata-document-00)](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-client-id-metadata-document-00) —— CIMD
- [RFC 8414 —— OAuth 2.0 授权服务器元数据](https://datatracker.ietf.org/doc/html/rfc8414) —— 发现契约
- [RFC 7591 —— OAuth 2.0 动态客户端注册协议](https://datatracker.ietf.org/doc/html/rfc7591) —— DCR（退路）
- [RFC 7636 —— Proof Key for Code Exchange(PKCE)](https://datatracker.ietf.org/doc/html/rfc7636) —— 公共客户端的持有证明
- [RFC 8707 —— OAuth 2.0 资源指示器](https://datatracker.ietf.org/doc/html/rfc8707) —— 受众钉住
- [RFC 9728 —— OAuth 2.0 受保护资源元数据](https://datatracker.ietf.org/doc/html/rfc9728) —— 资源服务器发现
- [RFC 9207 —— OAuth 2.0 授权服务器签发者标识](https://datatracker.ietf.org/doc/html/rfc9207) —— 防御 mix-up 攻击的 `iss` 参数
- [OAuth 2.1 草案](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1) —— 整合的 OAuth 地基
