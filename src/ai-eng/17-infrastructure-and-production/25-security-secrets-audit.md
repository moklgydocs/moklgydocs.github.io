# 安全 —— 密钥、API 密钥轮换、审计日志、护栏

> 用集中式保险库(HashiCorp Vault、AWS Secrets Manager、Azure Key Vault)消灭密钥蔓延。永远不要把凭证存进配置文件、进版本控制的 env 文件、电子表格。用 IAM 角色代替静态密钥;CI/CD 用 OIDC。AI 网关模式是 2026 年的答案:应用 → 网关 → 模型厂商,网关在运行时从保险库拉取凭证。在保险库里轮换,所有应用几分钟内自动生效——不用重新部署,不用在 Slack 里问"谁有新密钥"。轮换策略 ≤90 天;每次提交用 TruffleHog / GitGuardian / Gitleaks 扫描。零信任:MFA、SSO、RBAC/ABAC、短期 token、设备姿态。PII 清洗用实体识别,在转发前遮盖 PHI/PII;一致性令牌化(Mesh 方法)把敏感值映射为稳定占位符,让 LLM 保住代码/关系语义。网络出口:LLM 服务放在专用 VPC/VNet 子网,只白名单 `api.openai.com`、`api.anthropic.com` 等,其余出站全部拦截。2026 年的事故驱动因素:Vercel 供应链攻击,被攻陷的 CI/CD 凭证从数千个客户部署中窃取了环境变量。

**类型:** 学习
**编程语言:** Python(标准库,玩具 PII 清洗器 + 审计日志写入器)
**前置要求:** 第 17 阶段 · 19(AI 网关)、第 17 阶段 · 13(可观测性)
**预计耗时:** 约 60 分钟

## 学习目标

- 列举四种密钥管理反模式(VCS 里的配置文件、硬编码 env、电子表格、静态密钥)并说出各自的替代方案。
- 解释"AI 网关从保险库拉取"模式为何是 2026 年的生产标准。
- 实现带一致性令牌化的 PII 清洗器(同值 → 同占位符),让语义存活。
- 说出 2026 年 Vercel 供应链事件,以及它给 CI/CD 凭证卫生上的教训。

## 问题

一个实习生把带 API 密钥的 `.env` 提交了。他很快删掉了,但密钥已经进了 git 历史——GitGuardian 扫描抓到了它,而你们的轮换流程是"在 Slack 上通知团队、更新 40 个配置文件、重新部署所有服务"。8 小时后,一半服务上线了,另一半还在等部署窗口。

另一头,用户提示词里写着"My SSN is 123-45-6789"。提示词直接去了 OpenAI。你们有 BAA,但内部政策要求转发前先遮盖 PII。你们没做。

再一头,你们 EKS 集群里的 LLM Pod 能访问互联网上任何主机。有人通过到攻击者控制域名的 DNS 查询外泄数据。什么都没拦住。

LLM 服务的安全必须同时应对这三个向量:保险库支撑的凭证、PII 清洗、网络出口过滤、审计日志。

## 概念

### 集中式保险库 + IAM 角色拉取

**保险库**:HashiCorp Vault、AWS Secrets Manager、Azure Key Vault、GCP Secret Manager。单一事实源。

**IAM 角色**:应用/网关用自己的 IAM 身份认证,不用静态密钥。保险库在 token 有效期内返回密钥。

**AI 网关模式**:网关在请求时从保险库拉取 `OPENAI_API_KEY`。在保险库里轮换,下一个请求就用上新密钥。不用重新部署。

### 轮换策略 ≤ 90 天

所有 API 密钥、保险库 root token、CI/CD 凭证。能自动轮换就自动。手动轮换要记录和跟踪。

### 密钥扫描

- **TruffleHog** —— 对提交做正则 + 熵检测。
- **GitGuardian** —— 商业,准确率高。
- **Gitleaks** —— 开源,跑在 CI 里。

每次提交都跑。检测到新密钥就拦下 PR。

### 零信任姿态

- 所有账户强制 MFA。
- 经 SAML/OIDC 的 SSO。
- RBAC(基于角色)或 ABAC(基于属性)做细粒度访问控制。
- 短期 token(按小时,不按天)。
- 设备姿态——只限带磁盘加密的办公设备。

### PII / PHI 清洗

提示词离开你的基础设施之前:

1. 实体识别(spaCy NER、Presidio、商业方案)。
2. 遮盖命中的实体:`"My SSN is 123-45-6789"` → `"My SSN is [SSN_TOKEN_A3F]"`。
3. 一致性令牌化(Mesh 方法):同一个值映射到同一个占位符,让 LLM 保住关系。
4. 可选:对 LLM 响应做反向映射。

静态正则过滤抓基本模式;NER 抓得更多。两个都用。

### 输入 + 输出护栏

输入:拦截已知越狱、违禁话题;按用户限速。

输出:正则 scrub 泄漏的密钥(API 密钥模式、拒绝场景中的邮箱模式),加策略违规分类器。

### 网络出口白名单

LLM 服务放在专用子网:
- 白名单:`api.openai.com`、`api.anthropic.com`、向量库端点、保险库端点。
- 其余:全部丢弃。
- DNS 走仅白名单的解析器(防 DNS 隧道外泄)。

### 审计日志

每次 LLM 调用的不可变日志,含:
- 时间戳。
- 用户 / 租户。
- 提示词哈希(为隐私不存原文)。
- 模型 + 版本。
- token 计数。
- 成本。
- 响应哈希。
- 触发的护栏。

按监管要求留存(SOC 2 为 1 年,HIPAA 为 6 年)。

### 2026 年 Vercel 事件

供应链攻击:被攻陷的 CI/CD 凭证,从数千个客户部署中窃取了环境变量。教训:CI/CD 凭证与生产凭证同级。存进保险库,收窄范围,激进轮换。

### 你该记住的数字

- 轮换策略:≤ 90 天。
- 每次提交扫描:TruffleHog / GitGuardian / Gitleaks。
- Vercel 2026:CI/CD 凭证被攻陷 → 数千客户的环境变量泄漏。
- 审计日志留存:SOC 2 = 1 年,HIPAA = 6 年。

```figure
i4-vault-rotation
```

## 投入使用

`code/main.py` 实现了一个带一致性令牌化的玩具 PII 清洗器和一个只追加的审计日志。

## 交付

本课产出 `outputs/skill-llm-security-plan.md`。给定监管范围和现状,规划保险库迁移、清洗器、出口控制和审计日志。

## 练习

1. 运行 `code/main.py`。发送两条引用同一个 SSN 的提示词。确认它们得到同一个占位符。
2. 为一个调用 OpenAI + Anthropic + Weaviate 的 vLLM-on-EKS 部署,设计网络出口策略。
3. 你在 git 历史里发现一把密钥(2 年前的)。正确应对是什么——轮换密钥、清洗历史,还是都做?说明理由。
4. 你的审计日志每天涨 10 GB。设计留存分层(热 30 天、温 12 个月、冷 6 年)。
5. 辩论:反向令牌化(把真实值替换回 LLM 响应)相对保留可见占位符,值不值得那份复杂度。

## 关键术语

| 术语 | 大家口头的说法 | 实际含义 |
|------|----------------|------------------------|
| 保险库(Vault) | "密钥库" | 集中式凭证管理服务 |
| IAM 角色 | "基于身份的认证" | 应用扮演的角色;返回短期凭证 |
| CI/CD 的 OIDC | "云端签发的 token" | CI 里不放静态密钥——经 OIDC 认证身份 |
| TruffleHog / GitGuardian / Gitleaks | "密钥扫描器" | 提交时的密钥检测 |
| RBAC / ABAC | "访问控制" | 基于角色 vs 基于属性 |
| PII 清洗 | "数据遮盖" | 移除或令牌化敏感实体 |
| 一致性令牌化 | "稳定占位符" | 同一个值每次 → 同一个 token |
| Mesh 方法 | "Mesh 令牌化" | 保语义一致的令牌化模式 |
| 出口白名单 | "出站允许列表" | 只有许可的域名可达 |
| 审计日志 | "不可变历史" | 合规用的只追加记录 |

## 延伸阅读

- [Doppler — Advanced LLM Security](https://www.doppler.com/blog/advanced-llm-security)
- [Portkey — Manage LLM API keys with secret references](https://portkey.ai/blog/secret-references-ai-api-key-management/)
- [Datadog — LLM Guardrails Best Practices](https://www.datadoghq.com/blog/llm-guardrails-best-practices/)
- [JumpServer — Secrets Management Best Practices 2026](https://www.jumpserver.com/blog/secret-management-best-practices-2026)
- [Microsoft Presidio](https://github.com/microsoft/presidio) — PII 检测与匿名化。
- [HashiCorp Vault docs](https://developer.hashicorp.com/vault/docs)
