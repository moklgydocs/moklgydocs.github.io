# 终局项目 06 —— Kubernetes DevOps 排障智能体

> AWS 的 DevOps Agent 已经 GA,Resolve AI 公开了它的 K8s 排障手册,NeuBird 演示了语义化监控,Metoro 把 AI SRE 绑到了服务级 SLO 上。生产形态已经定型:告警 webhook 触发,智能体读遥测,沿 K8s 对象图走查,给根因假设排序,把带审批按钮的简报发到 Slack。默认只读,每项修复都过人工闸门。本终局项目就是造这个智能体,在 20 个合成故障上评测,并在三个共享案例上与 AWS 的 Agent 对比。

**类型:** 终局项目
**编程语言:** Python(智能体),TypeScript(Slack 集成)
**前置要求:** 第 11 阶段(LLM 工程)、第 13 阶段(工具与 MCP)、第 14 阶段(智能体)、第 15 阶段(自治系统)、第 17 阶段(基础设施)、第 18 阶段(安全)
**涉及阶段:** P11 · P13 · P14 · P15 · P17 · P18
**预计耗时:** 30 小时

## 问题

2025–2026 年的 SRE 叙事变成了一句话:"AI 智能体分诊故障,人类审批修复。"AWS DevOps Agent、Resolve AI、NeuBird、Metoro、PagerDuty AIOps 都在生产里跑这个形态。智能体读 Prometheus 指标、Loki 日志、Tempo 链路、kube-state-metrics,以及一张 K8s 对象知识图谱,五分钟内产出带遥测引用的排序根因假设。未经 Slack 上明确的人工批准,它绝不执行任何破坏性命令。

真正的硬功夫在边界与安全,不在推理。智能体需要默认只读的 RBAC 表面、加固的 MCP 工具服务器,以及"考虑过 vs 执行过"每条命令的审计日志。它要知道什么时候自己搞不定、该升级给人,还得跑得足够便宜——别让一次 OOM 连锁杀掉雪崩出一张 5000 美元的智能体账单。

## 概念

智能体在知识图谱上作业。节点是 K8s 对象(Pod、Deployment、Service、Node、HPA、PVC)加遥测源(Prometheus 序列、Loki 流、Tempo 链路)。边编码所有权(Pod -> ReplicaSet -> Deployment)、调度(Pod -> Node)与观测关系(Pod -> Prometheus 序列)。图由 kube-state-metrics 同步保鲜,每次告警再重采样一次。

告警触发时,智能体从受影响对象开始做根因分析。它沿边走查,拉取相关遥测切片(最近 15 分钟),起草假设。假设按证据排序:有多少遥测引用支持、多新、多具体。排名前三的假设连同图路径可视化和修复操作的审批按钮一起发到 Slack。

修复是带闸门的。默认允许的动作全是只读。破坏性动作(缩容、回滚、删 Pod)必须经 Slack 审批;ArgoCD 回滚钩子需要智能体永远不持有的授权 token。审计日志记录智能体*考虑过*的每条命令——不只是执行过的——这样评审流程能抓住"未遂事件"。

## 架构

```
PagerDuty / Alertmanager webhook
           |
           v
     FastAPI receiver
           |
           v
   LangGraph root-cause agent
           |
           +---- read-only MCP tools ----+
           |                             |
           v                             v
   K8s knowledge graph              telemetry slices
     (Neo4j / kuzu)              Prometheus, Loki, Tempo
   ownership + scheduling          last 15m, scoped
           |
           v
   hypothesis ranking (evidence weight)
           |
           v
   Slack brief + approval buttons
           |
           v (approved)
   ArgoCD rollback hook / PagerDuty escalate
           |
           v
   audit log: considered vs executed, every command
```

## 技术栈

- 可观测来源:Prometheus、Loki、Tempo、kube-state-metrics
- 知识图谱:Neo4j(托管)或 kuzu(嵌入式),存 K8s 对象 + 遥测边
- 智能体:LangGraph,逐工具白名单,默认只读
- 工具传输:FastMCP over StreamableHTTP;破坏性工具单独放一台服务器,藏在审批门后
- 模型:Claude Sonnet 4.7 做根因推理,Gemini 2.5 Flash 做日志摘要
- 修复:ArgoCD 回滚 webhook、PagerDuty 升级、Slack 审批卡片
- 审计:仅追加的结构化日志(考虑过、执行过、谁批的、结果如何)
- 部署:K8s Deployment,独立命名空间,配收窄的专属 RBAC 角色

```figure
ce-rootcause-walk
```

## 动手构建

1. **图摄入。** 每 30 秒把 kube-state-metrics 同步进 Neo4j/kuzu。节点:Pod、Deployment、Node、Service、PVC、HPA。边:OWNED_BY、SCHEDULED_ON、EXPOSES、MOUNTS、SCALES。遥测叠加边:OBSERVED_BY(Pod 被某条 Prometheus 序列观测)。

2. **告警接收器。** FastAPI 端点,接收 PagerDuty 或 Alertmanager webhook。提取受影响对象与 SLO 违规情况。

3. **只读工具表面。** 用 FastMCP 封装 kubectl、Prometheus 查询、Loki logql、Tempo traceql。每个工具只有收窄的 RBAC 动词("get"、"list"、"describe")。默认服务器里没有 "delete"、"exec"、"scale"。

4. **根因智能体。** LangGraph 三个节点:`sample` 拉最近 15 分钟遥测切片,`walk` 在图上查相邻对象,`hypothesize` 起草带遥测引用的排序根因候选。

5. **证据打分。** 每个假设的得分 = 新近度 × 具体度 × 图路径长度倒数 × 引用数。返回前三。

6. **Slack 简报。** 发一条附件:假设、图路径可视化(服务端渲染的子图图片),以及至多一个修复动作的审批按钮。

7. **修复闸门。** 破坏性工具(缩容、回滚、删除)放在第二台 MCP 服务器上,由审批 token 把守。只有 Slack 卡片被人点击批准后,智能体才能调它们。

8. **审计日志。** 仅追加的 JSONL:每条候选命令记录是否被考虑过、是否被执行、谁批准的。每日归档到 S3。

9. **合成故障套件。** 造 20 个场景:OOMKill 连锁、DNS 抖动、HPA 震荡、PVC 写满、吵闹邻居、故障 sidecar、错误的 ConfigMap 发布、证书轮换、镜像拉取回退等。按根因准确率与出假设耗时给智能体打分。

## 投入使用

```
webhook: alert.pagerduty.com -> checkout-api SLO breach, error rate 14%
[graph]   affected: Deployment checkout-api (3 Pods, Node ip-10-2-3-4)
[walk]    neighbors: ReplicaSet checkout-api-abc, Service checkout-api,
           recent rollout 14m ago
[sample]  prometheus error_rate 14%, up-trend; loki 500s on /api/v2/pay
[hypo]    #1 bad rollout: latest image checkout-api:v2.41 fails /healthz
          citations: deploy.yaml (rev 42), prometheus errorRate, loki 500 stack
[slack]   [ROLL BACK to v2.40]  [ESCALATE]  [IGNORE]
          (approval required; agent does not roll back unilaterally)
```

## 交付

`outputs/skill-devops-agent.md` 是交付物。给定一个 K8s 集群与告警源,智能体产出排序根因假设与一套 Slack 门控的修复流程。

| 权重 | 评分项 | 衡量方式 |
|:-:|---|---|
| 25 | 场景套件上的 RCA 准确率 | 20 个合成故障中根因正确率 ≥80% |
| 20 | 安全 | 审计日志中,破坏性动作守卫从未在未经 Slack 批准时触发 |
| 20 | 出假设耗时 | 告警到 Slack 简报 p50 低于 5 分钟 |
| 20 | 可解释性 | 每个假设都有图路径与遥测引用 |
| 15 | 集成完备性 | PagerDuty、Slack、ArgoCD、Prometheus 端到端可用 |
| **100** | | |

## 练习

1. 拿 AWS DevOps Agent 演示过的同三个故障跑你的智能体,发布并排对比,报告分歧点。

2. 加"未遂"审计:标记智能体*考虑过*的任何一条未经批准就会造成破坏的命令。度量一周内的未遂率。

3. 把假设模型从 Claude Sonnet 4.7 换成自托管 Llama 3.3 70B。度量 RCA 准确率差值与单次故障成本。

4. 造一个因果过滤器:区分相关的遥测尖峰与真正的根因。用 20 个场景的标签训练一个小分类器。

5. 加回滚演练:用同一 manifest 在预发集群上执行 ArgoCD 回滚。在 Slack 审批按钮出现之前,先在真实集群里验证回滚计划。

## 关键术语

| 术语 | 人们常说的是 | 实际含义 |
|------|-----------------|------------------------|
| K8s 知识图谱 | "集群图" | 节点=K8s 对象+遥测序列;边=所有权、调度、观测 |
| 默认只读 | "收窄 RBAC" | 智能体服务账号只有 get/list/describe 动词;破坏性动词在审批门后的独立服务器上 |
| 审计日志 | "考虑过 vs 执行过" | 每条候选命令的仅追加记录:跑没跑、谁批的 |
| 假设排序 | "证据分" | 新近度 × 具体度 × 图路径长度倒数 × 引用数 |
| Slack 审批卡 | "人在环闸门" | 带修复按钮的交互式 Slack 消息;人不点,智能体不能动 |
| 遥测引用 | "证据指针" | 支撑某条论断的 Prometheus 查询、Loki 选择器或 Tempo 链路 URL |
| MTTR | "恢复时间" | 从告警触发到 SLO 恢复的墙钟时间 |

## 延伸阅读

- [AWS DevOps Agent GA](https://aws.amazon.com/blogs/aws/aws-devops-agent-helps-you-accelerate-incident-response-and-improve-system-reliability-preview/) —— 2026 年权威参考
- [Resolve AI K8s troubleshooting](https://resolve.ai/blog/kubernetes-troubleshooting-in-resolve-ai) —— 竞品参考
- [NeuBird semantic monitoring](https://www.neubird.ai) —— 语义图路线
- [Metoro AI SRE](https://metoro.io) —— SLO 优先的生产框架
- [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics) —— 集群状态来源
- [LangGraph](https://langchain-ai.github.io/langgraph/) —— 参考智能体编排器
- [FastMCP](https://github.com/jlowin/fastmcp) —— Python MCP 服务器框架
- [ArgoCD rollback](https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_rollback/) —— 被门控的修复目标
