# AI 时代的 SRE —— 多智能体事故响应、Runbook 与预测性检测

> AI SRE 让 LLM 通过 RAG 扎根在基础设施数据(日志、runbook、服务拓扑)上,自动化事故的调查、记录和协调环节。2026 年的架构模式是多智能体编排——专职智能体(日志、指标、runbook)由一个监督者协调;AI 提假设、发查询,人负责审批判断。Datadog Bits AI 和 Azure SRE Agent 已把这个做成托管产品。Runbook 也在进化:NeuBird Hawkeye 用对抗式评估(两个模型分析同一事故;一致 = 可信,分歧 = 存疑);运维记忆跨人员流动持久存在。自动修复保持克制:AI 建议,人审批。完全自治的动作很窄(重启 Pod、回滚特定部署),护栏很紧——凡是卖"设好就不管"的都是过度承诺。新兴前沿:事故前预测。MIT 研究报告,一个用历史日志 + GPU 温度 + API 错误模式训练的 LLM,提前 10-15 分钟预测了 89% 的故障。行业预测:到 2026 年底,95% 的企业 LLM 会有自动故障切换。

**类型:** 学习
**编程语言:** Python(标准库,玩具级多智能体事故分诊模拟器)
**前置要求:** 第 17 阶段 · 13(可观测性)、第 17 阶段 · 24(混沌工程)
**预计耗时:** 约 60 分钟

## 学习目标

- 画出多智能体 AI SRE 架构:监督者 + 专职智能体(日志、指标、runbook)+ 人工审批门禁。
- 解释为什么自动修复范围窄(重启 Pod、回滚部署)而非宽(重构服务)。
- 说出对抗式评估模式(NeuBird Hawkeye):两模型一致 = 可信;分歧 = 升级人工。
- 引用 MIT 89% 提前检测结果,以及运维约束:没有执行手段的预测只是看板。

## 问题

值班工程师凌晨 3 点被叫起来:"checkout 错误率高。"他查 Datadog、Loki、三份 runbook、部署日志。30 分钟后发现根因是 KV 缓存尖峰导致的 vLLM OOM。重启 Pod,错误消失。

2026 年,这类调查的前 20 分钟是可以自动化的。按服务分组日志、关联最近部署、匹配 runbook——全是 RAG + 工具调用的活。一个有人监督的智能体可以在人打开 Datadog 之前完成初步分诊并给出假设。

完全自治的修复是另一个问题。重启 Pod:安全。扩 GPU 池:策略允许就安全。重构服务:绝对不行。这门纪律就在于把那条窄线画清楚。

## 概念

### 多智能体架构

```
          Incident
             │
             ▼
        Supervisor
        /    |    \
       ▼     ▼     ▼
  Log agent  Metric agent  Runbook agent
       │     │     │
       └─────┴─────┘
             │
             ▼
        Hypothesis + evidence
             │
             ▼
        Human approval
             │
             ▼
        Action (narrow set)
```

监督者把事故拆成子查询。专职智能体有工具访问权(日志检索、PromQL、文档检索)。监督者综合,把假设 + 证据呈给人。人批准或纠偏。

### 自动修复的边界

**安全(窄)**:重启 Pod、回滚特定部署、在预批范围内扩缩池、开启预批的功能开关。

**不安全(宽)**:改服务拓扑、改资源限额、部署新代码、改 IAM、动数据库。

凡是卖"设好就不管"的都是过度承诺。安全集合会随 AI SRE 成熟而扩大,但边界真实存在。

### 对抗式评估(NeuBird Hawkeye)

两个模型独立分析同一事故。根因结论一致,置信度高;不一致,带着两份假设升级人工。模式简单,却是防幻觉根因的有效滤网。

### 运维记忆

人员流动是传统 SRE 的隐形杀手——部落知识随人走。AI SRE 把 runbook + 复盘文档存进向量数据库;每个新事故智能体都去检索。新人入职时,AI 掌握全部历史。

### 事故前预测

MIT 2025 年研究:用历史日志、GPU 温度、API 错误模式训练的 LLM,在测试集上提前 10-15 分钟预测了 89% 的故障。

现实检验:没有执行手段的预测只是看板。运维问题是"预测到了,然后呢?"提前排空?呼 pager?自动扩容?答案因策略而异。

### 2026 年的产品

- **Datadog Bits AI** —— Datadog 内的托管 SRE 副驾。
- **Azure SRE Agent** —— Azure 原生。
- **NeuBird Hawkeye** —— 对抗式评估 + 运维记忆。
- **PagerDuty AIOps** —— 分诊 + 去重。
- **Incident.io Autopilot** —— 事故指挥官 + 协调。

### Runbook 即代码

Runbook 正从 Confluence 页面进化为带结构化小节(症状、假设、验证、处置)的版本化 markdown。结构化 runbook 让 RAG 检索质量更好。任何 AI SRE 落地的第一步:把非结构化 runbook 结构化。

### 该记住的数字

- MIT 提前检测:89% 故障,提前 10-15 分钟。
- 多智能体分诊:监督者 +(日志、指标、runbook)+ 人工。
- 安全自动修复集:重启 Pod、回滚部署、范围内扩缩。
- 对抗式评估:两模型独立;一致 = 可信。

```figure
i4-incident-agents
```

## 投入使用

`code/main.py` 模拟多智能体分诊:日志智能体发现错误,指标智能体发现 CPU 尖峰,runbook 智能体匹配到已知问题。监督者对假设排序。

## 交付

本课产出 `outputs/skill-ai-sre-plan.md`。给定当前值班状况、事故量和团队成熟度,设计 AI SRE 落地方案。

## 练习

1. 运行 `code/main.py`。日志智能体和指标智能体结论不一致时,监督者如何裁决?
2. 为你的服务定义三个"安全"的自动修复动作,逐个论证。
3. 写一个结构化 runbook 模板:小节、必填字段、验证命令。
4. 预测性检测提前 12 分钟报警。你的策略是什么——呼 pager、提前排空,还是都做?
5. 论证 3 人团队在 2026 年该不该上 AI SRE。考虑成熟度、事故量、风险。

## 关键术语

| 术语 | 别人嘴里的说法 | 实际含义 |
|------|----------------|----------|
| AI SRE | "值班智能体" | LLM 驱动的事故调查 + 协调 |
| 监督者智能体 | "编排者" | 把事故拆成子查询的顶层智能体 |
| 专职智能体 | "领域智能体" | 带工具访问的子智能体(日志、指标、runbook) |
| 自动修复 | "AI 自己修" | 窄范围预批动作;不是大改架构 |
| 运维记忆 | "向量 runbook" | 向量库里的复盘 + runbook,供 RAG |
| 对抗式评估 | "双模型核对" | 独立分析;一致 = 可信 |
| NeuBird Hawkeye | "对抗那个" | 对抗式评估 + 记忆模式的产品 |
| Bits AI | "Datadog 的 SRE 智能体" | Datadog 托管的 AI SRE |
| 事故前预测 | "提前检测" | 故障预测提前 10-15 分钟 |

## 延伸阅读

- [incident.io — AI SRE Complete Guide 2026](https://incident.io/blog/what-is-ai-sre-complete-guide-2026)
- [InfoQ — Human-Centred AI for SRE](https://www.infoq.com/news/2026/01/opsworker-ai-sre/)
- [DZone — AI in SRE 2026](https://dzone.com/articles/ai-in-sre-whats-actually-coming-in-2026)
- [Datadog Bits AI](https://www.datadoghq.com/product/bits-ai/)
- [NeuBird Hawkeye](https://www.neubird.ai/)
- [awesome-ai-sre](https://github.com/agamm/awesome-ai-sre)
