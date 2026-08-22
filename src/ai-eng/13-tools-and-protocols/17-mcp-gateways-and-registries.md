# MCP 网关与注册表 —— 企业级控制平面

> 企业不可能放任每个开发者随便装 MCP 服务器。网关把认证、RBAC、审计、限流、缓存和工具投毒检测集中起来，再把合并后的工具面作为单个 MCP 端点暴露出去。官方 MCP 注册表（Anthropic + GitHub + PulseMCP + Microsoft，带命名空间验证）是权威上游。本课讲清网关的位置，走一遍最小实现，并盘点 2026 年的厂商格局。

**类型：** Learn
**编程语言：** Python（标准库，最小网关）
**前置要求：** 第 13 阶段 · 15（工具投毒）、第 13 阶段 · 16(OAuth 2.1)
**预计耗时：** 约 45 分钟

## 学习目标

- 解释 MCP 网关的位置（在 MCP 客户端和多个后端 MCP 服务器之间）
- 实现网关的五大职责：认证、RBAC、审计、限流、政策
- 在网关层强制执行钉住的工具哈希清单
- 区分官方 MCP 注册表和元注册表（Glama、MCPMarket、MCP.so、Smithery、LobeHub)

## 问题

一家财富 500 强有 30 个批准的 MCP 服务器、5000 名开发者、合规和审计要求，还有一个想要集中政策的安全团队。让每个开发者在自己的 IDE 里随便装服务器？想都别想。

网关模式：

1. 网关作为单个 Streamable HTTP 端点运行，开发者连它。
2. 网关持有每个后端 MCP 服务器的凭据。
3. 每个开发者请求都通过网关自己的 OAuth 认证和定权。
4. 网关把调用路由给后端服务器，应用政策。
5. 所有调用记入审计日志。

Cloudflare MCP Portals、Kong AI Gateway、IBM ContextForge、MintMCP、TrueFoundry、Envoy AI Gateway——都在 2025-2026 年发布了网关或网关特性。

与此同时，官方 MCP 注册表作为权威上游上线：经过策展、带命名空间验证、按反向 DNS 命名的服务器，网关可以从这里拉取。元注册表（Glama、MCPMarket、MCP.so、Smithery、LobeHub）则聚合多个来源的服务器。

## 概念

### 网关的五大职责

1. **认证（Auth)。** 用 OAuth 2.1 识别开发者，映射到用户角色。
2. **RBAC。** 按用户的政策：哪些服务器、哪些工具、哪些 scope。
3. **审计（Audit)。** 每次调用记录谁、什么、何时、结果。
4. **限流（Rate limit)。** 按用户 / 按工具 / 按服务器的上限，防滥用。
5. **政策（Policy)。** 拒绝投毒的描述、执行二规则、擦除 PII。

### 网关作为单一端点

对开发者来说，网关看起来像一台 MCP 服务器；内部它路由到 N 个后端。会话 id(第 13 阶段 · 09）在边界处被改写。

### 凭据入vault

开发者永远看不到后端令牌。网关持有它们（或代理给持有它们的身份提供商）。在网关上只有 `notes:read` 的开发者，可以经由网关自己的后端凭据传递地访问笔记 MCP 服务器——但只在约束这种传递访问的政策之下。

### 网关层的工具哈希钉住

网关持有一份批准工具描述的清单（SHA256 哈希）。发现时刻，它拉取每个后端的 `tools/list`，把哈希和清单比对，移除任何描述已突变的工具。这就是 第 13 阶段 · 15 的 rug-pull 防御的集中化应用。

### 政策即代码

高级网关用 OPA/Rego、Kyverno 或 Styra 表达政策。像"用户 `alice` 只能在 org `acme` 的仓库上调 `github.open_pr`"这样的规则以声明式编码。简单网关用手写 Python。两种形状都成立。

### 会话感知路由

当用户会话里混着多个服务器时，网关做复用：开发者的一个 MCP 会话里装着 N 个后端会话，每个服务器一个。任何后端的通知都经网关路由到开发者的会话。

### 命名空间合并

网关合并所有后端的工具命名空间，典型做法是冲突时加前缀：`github.open_pr`、`notes.search`。这让路由没有歧义。

### 注册表

- **官方 MCP 注册表（`registry.modelcontextprotocol.io`)。** 由 Anthropic、GitHub、PulseMCP、Microsoft 共同托管上线。命名空间验证（反向 DNS:`io.github.user/server`)。基础质量预过滤。
- **Glama。** 以搜索为中心的元注册表，聚合多个来源。
- **MCPMarket。** 偏商业的目录，带厂商 listing。
- **MCP.so。** 社区目录，开放提交。
- **Smithery。** 包管理器风格的安装流程。
- **LobeHub。** 集成在 LobeChat 应用里的 UI 注册表。

企业网关默认从官方注册表拉取，允许管理员从元注册表策展补充，拒绝一切未钉住的东西。

### 反向 DNS 命名

官方注册表强制公共服务器使用反向 DNS 名：`io.github.alice/notes`。命名空间防止抢注，让信任委派更清晰。

### 厂商盘点，2026 年 4 月

| 厂商 | 强项 |
|--------|----------|
| Cloudflare MCP Portals | 边缘托管；OAuth 集成；有免费档 |
| Kong AI Gateway | K8s 原生；细粒度政策；日志接 OpenTelemetry |
| IBM ContextForge | 企业 IAM；合规；审计导出 |
| TrueFoundry | 偏 DevOps；指标优先 |
| MintMCP | 面向开发者平台 |
| Envoy AI Gateway | 开源；可定制过滤器 |

第 17 阶段（生产基础设施）会深入网关运维。

```figure
t3-gateway-funnel
```

## 投入使用

`code/main.py` 交付一个约 150 行的最小网关：用假 Bearer 令牌认证用户、持有按用户的 RBAC 政策、把请求路由到两个后端 MCP 服务器、把每次调用写进审计日志、执行限流，并拒绝任何描述哈希与钉住清单不匹配的后端工具。

要看的地方：

- `RBAC` 字典按 `user_id` 做键，含允许的 `server_tool` 条目。
- `AUDIT_LOG` 是只追加的事件列表。
- 限流用按用户的令牌桶。
- 钉住清单是 `server::tool -> hash` 的字典。

## 交付

本课产出 `outputs/skill-gateway-bootstrap.md`。给它一个企业 MCP 规划（用户、后端、合规），这个 skill 产出一份网关配置规范。

## 练习

1. 跑 `code/main.py`。以被允许的用户调一次；再以不被允许的用户调一次；再来一波超限的突发。验证三条流程。

2. 加一个在返回客户端前从结果里擦除 PII 的政策。用简单的正则过一遍 SSN 形状的字符串，并记下缺口（邮箱、电话）。

3. 扩展审计日志，发出 OpenTelemetry GenAI span。具体属性见 第 13 阶段 · 20。

4. 为一个 50 人开发团队、五个后端（notes、github、postgres、jira、slack）设计 RBAC 政策。谁在每个上只读？谁能写？

5. 把 Cloudflare 的企业 MCP 文章从头读到尾。找出 Cloudflare 交付而这个标准库网关没有的一个特性。

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|------------------------|
| 网关（Gateway) | "MCP 代理" | 位于客户端和后端之间的集中化服务器 |
| 凭据入 vault | "后端令牌留在服务端" | 开发者永远看不到上游令牌 |
| 会话感知路由 | "多后端会话" | 网关把每个开发者会话复用为 N 个后端会话 |
| 工具哈希钉住 | "批准清单" | 每个批准工具描述的 SHA256；集中拦截 rug pull |
| RBAC | "按用户政策" | 对工具和服务器的角色访问控制 |
| 政策即代码 | "声明式规则" | 在网关强制执行的 OPA/Rego、Kyverno、Styra 政策 |
| 审计日志 | "谁、什么、何时" | 合规用的只追加事件日志 |
| 限流 | "按用户令牌桶" | 防滥用的每分钟上限 |
| 官方 MCP 注册表 | "权威上游" | `registry.modelcontextprotocol.io`，带命名空间验证 |
| 反向 DNS 命名 | "注册表命名空间" | `io.github.user/server` 约定 |

## 延伸阅读

- [官方 MCP 注册表](https://registry.modelcontextprotocol.io/) —— 权威上游，命名空间验证
- [Cloudflare —— 企业 MCP](https://blog.cloudflare.com/enterprise-mcp/) —— 带 OAuth 和政策的网关模式
- [agentic-community —— MCP gateway registry](https://github.com/agentic-community/mcp-gateway-registry) —— 开源参考网关
- [TrueFoundry —— 什么是 MCP 网关？](https://www.truefoundry.com/blog/what-is-mcp-gateway) —— 特性对比文章
- [IBM —— MCP context forge](https://github.com/IBM/mcp-context-forge) —— IBM 的企业网关
