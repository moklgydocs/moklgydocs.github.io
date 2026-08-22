# 终局项目 13 —— 带注册中心与治理的 MCP 服务器

> 2026 年,模型上下文协议(MCP)不再是"未来",而是工具调用的默认规范。Anthropic、OpenAI、Google 和每个主流 IDE 都自带 MCP 客户端。Pinterest 公开了其内部 MCP 服务器生态。AAIF 注册中心把 `.well-known` 能力元数据正式化。AWS ECS 发布了参考无状态部署。Block 的 goose-agent 把同一协议装进了托管助手。2026 年的生产形态是:StreamableHTTP 传输、OAuth 2.1 作用域、OPA 策略门控,以及一个让平台团队发现、校验、启用服务器的注册中心。把它端到端造出来。

**类型:** 终局项目
**编程语言:** Python(服务器,用 FastMCP)或 TypeScript(@modelcontextprotocol/sdk),Go(注册中心服务)
**前置要求:** 第 11 阶段(LLM 工程)、第 13 阶段(工具与 MCP)、第 14 阶段(智能体)、第 17 阶段(基础设施)、第 18 阶段(安全)
**涉及阶段:** P11 · P13 · P14 · P17 · P18
**预计耗时:** 25 小时

## 问题

MCP 成了工具调用的通用语。Claude Code、Cursor 3、Amp、OpenCode、Gemini CLI 和每个托管智能体都在消费 MCP 服务器。生产挑战不在写服务器(FastMCP 让这很容易),而在按企业级要求规模化部署:按租户的 OAuth 作用域、对破坏性工具的 OPA 策略、StreamableHTTP 无状态扩容、用于发现的注册中心、逐工具调用的审计日志。Pinterest 的内部 MCP 生态和 AAIF 注册中心规范定下了 2026 年的标杆。

你要造一个暴露 10 个内部工具(Postgres 只读、S3 列表、Jira、Linear、Datadog 等)的 MCP 服务器、一个给平台团队做发现的注册中心 UI,以及破坏性工具的人工审批门。压测要演示 StreamableHTTP 的水平扩容。审计轨迹要经得起企业安全评审。

## 概念

MCP 2026 修订版把 StreamableHTTP 定为默认传输。与早期 stdio 加 SSE 的形态不同,StreamableHTTP 默认无状态:单个 HTTP 端点接收 JSON-RPC 请求、流式回响应、支持长连接推通知。无状态意味着可以放在负载均衡器后面水平扩容。

授权是 OAuth 2.1 按工具划作用域。token 携带 `jira:read`、`s3:list`、`postgres:query:readonly` 这类作用域。MCP 服务器在工具调用时检查作用域,而不只是会话开始时。对高风险工具,凡作用域在过去 N 分钟内未被提升为 `approved:by:human` 的调用一律拒绝——这个提升来自一张 Slack 审批卡片。

注册中心是独立服务。每个 MCP 服务器暴露一份 `.well-known/mcp-capabilities` 文档,写明工具清单、传输 URL、认证要求。注册中心轮询、校验、建索引。平台团队用注册中心 UI 查看有哪些工具可用、需要哪些作用域、归哪个团队所有。

## 架构

```
MCP client (Claude Code, Cursor 3, ...)
          |
          v
StreamableHTTP over HTTPS (JSON-RPC + streaming)
          |
          v
MCP server (FastMCP) behind load balancer
          |
   +------+------+---------+----------+------------+
   v             v         v          v            v
Postgres    S3 listing  Jira       Linear     Datadog
(read-only) (paged)     (read)     (read)     (query)
          |
   +------+-------------+
   v                    v
 OPA policy gate   destructive tool MCP (separate server)
                        |
                        v
                   human approval via Slack
                        |
                        v
                   audit log (append-only, per-tenant)

  registry service
     |
     v  GET /.well-known/mcp-capabilities from each server
     v
     UI: search / validate / enable-disable / ownership
```

## 技术栈

- 服务器框架:FastMCP(Python)或 `@modelcontextprotocol/sdk`(TypeScript)
- 传输:HTTPS 上的 StreamableHTTP(无状态)
- 认证:OAuth 2.1,工作负载身份走 SPIFFE / SPIRE
- 策略:OPA / Rego 逐工具规则;每请求过策略决策服务
- 注册中心:自托管,消费 `.well-known/mcp-capabilities` 清单
- 人工审批:破坏性工具走 Slack 交互消息
- 部署:AWS ECS Fargate 或 Fly.io,每租户一台服务器或共享加租户隔离
- 审计:按租户的结构化 JSONL,逐调用留血缘

```figure
cf-mcp-gate
```

## 动手构建

1. **工具表面。** 暴露 10 个内部工具:Postgres 只读查询、S3 列对象、Jira 搜索/读取、Linear 搜索/读取、Datadog 指标查询、PagerDuty 值班查询、GitHub 只读、Notion 搜索、Slack 搜索、Salesforce 读。每个工具带类型 schema 与作用域标签。

2. **FastMCP 服务器。** 挂载工具,配置 StreamableHTTP 传输,加中间件做 OAuth token 内省与作用域强制。

3. **OPA 策略。** 逐工具 Rego 策略:什么作用域允许调用、做什么 PII 脱敏、payload 大小上限。每次工具调用都过决策服务。

4. **注册中心服务。** 独立的 Go 或 TS 服务,轮询各注册服务器的 `.well-known/mcp-capabilities`,用 JSON Schema 校验,提供列表/搜索/校验/启停的 UI。

5. **能力清单。** 每台服务器暴露 `.well-known/mcp-capabilities`:工具列表、认证要求、传输 URL、归属团队、SLO。

6. **破坏性工具隔离。** 会改状态的工具(Jira 建单、Linear 建单、Postgres 写)放第二台 MCP 服务器,认证流程更严:token 必须持有 15 分钟内经 Slack 卡片提升的 `approved:by:human` 作用域。

7. **审计日志。** 按租户仅追加 JSONL:`{timestamp, user, tool, args_redacted, response_redacted, outcome}`。写入前用 Presidio 脱敏 PII。

8. **压测。** StreamableHTTP 上 100 并发客户端。加第二个副本演示水平扩容;展示负载均衡器在无会话粘滞下的流量再分配。

9. **一致性测试。** 对两台服务器跑官方 MCP 一致性套件,必测章节全过。

## 投入使用

```
$ curl -H "Authorization: Bearer eyJhbGc..." \
       -X POST https://mcp.internal.example.com/ \
       -d '{"jsonrpc":"2.0","method":"tools/call",
            "params":{"name":"postgres.readonly","arguments":{"sql":"SELECT 1"}}}'
[registry]   capability validated: postgres.readonly v1.2
[policy]    scope postgres:query:readonly present; allowed
[audit]     logged: user=u42 tool=postgres.readonly outcome=ok
response:    { "result": { "rows": [[1]] } }
```

## 交付

`outputs/skill-mcp-server.md` 描述交付物:一套生产级 MCP 服务器 + 注册中心 + 审计层,面向内部工具,带 OAuth 2.1 作用域与 OPA 门控。

| 权重 | 评分项 | 衡量方式 |
|:-:|---|---|
| 25 | 规范一致性 | StreamableHTTP + 能力清单通过 MCP 一致性测试 |
| 20 | 安全 | 作用域强制、OPA 覆盖每个工具、密钥卫生 |
| 20 | 可观测 | 逐工具调用审计日志,带 PII 脱敏 |
| 20 | 规模 | 100 客户端压测水平扩容演示 |
| 15 | 注册中心体验 | 发现 / 校验 / 启停工作流 |
| **100** | | |

## 练习

1. 加一个新工具(Confluence 搜索)。不动核心服务器,经注册中心校验流程上线。

2. 写一条 OPA 策略:凡 Postgres 查询结果含 `email`、`ssn`、`phone` 列的一律脱敏。用探针查询验证。

3. 基准对比 StreamableHTTP 与 stdio 的本地延迟。报告单次调用 p50/p95。

4. 实现按租户配额:每租户每工具每分钟最多 N 次调用。用第二条 OPA 规则强制。

5. 跑 [mcp-conformance-tests](https://github.com/modelcontextprotocol/conformance) 的 MCP 一致性套件,修掉每一个失败项。

## 关键术语

| 术语 | 人们常说的是 | 实际含义 |
|------|-----------------|------------------------|
| StreamableHTTP | "2026 MCP 传输" | 无状态 HTTP + 流式;网络服务器场景取代 SSE + stdio |
| 能力清单 | "well-known 文档" | `.well-known/mcp-capabilities`:工具列表、认证、传输 URL |
| OPA / Rego | "策略引擎" | Open Policy Agent,按外部规则给工具调用做授权 |
| 作用域提升 | "经人批准" | 经 Slack 审批授予的短时效作用域,破坏性工具必需 |
| 注册中心 | "工具发现" | 从能力清单索引 MCP 服务器的服务 |
| 工作负载身份 | "SPIFFE / SPIRE" | 用于签发 OAuth token 的密码学服务身份 |
| 一致性套件 | "规范测试" | 官方 MCP 测试集,验 StreamableHTTP + 工具清单正确性 |

## 延伸阅读

- [Model Context Protocol 2026 Roadmap](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/) —— StreamableHTTP、能力元数据、注册中心
- [AAIF MCP Registry spec](https://github.com/modelcontextprotocol/registry) —— 2026 注册中心规范
- [AWS ECS reference deployment](https://aws.amazon.com/blogs/containers/deploying-model-context-protocol-mcp-servers-on-amazon-ecs/) —— 生产部署参考
- [Pinterest internal MCP ecosystem](https://www.infoq.com/news/2026/04/pinterest-mcp-ecosystem/) —— 内部部署参考
- [Block `goose` MCP usage](https://block.github.io/goose/) —— 智能体消费模式参考
- [FastMCP](https://github.com/jlowin/fastmcp) —— Python 服务器框架
- [Open Policy Agent](https://www.openpolicyagent.org/) —— 策略引擎参考
- [SPIFFE / SPIRE](https://spiffe.io) —— 工作负载身份参考
