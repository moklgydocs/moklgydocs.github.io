# 终局项目 10 —— 多智能体软件工程团队

> 2026 年多智能体工程团队的形态已经收敛:一个架构师做规划,N 个编码员在并行 worktree 里干活,一个评审把关,一个测试验证。SWE-AF 的工厂架构、MetaGPT 的角色化提示、AutoGen 0.4 的带类型 actor 图、Cognition 的 Devin、Factory 的 Droids,各自独立地落到了同一个形态上。并行 worktree 把墙钟时间换成吞吐。共享状态与交接协议成了故障面。本终局项目是组建这个团队,在 SWE-bench Pro 上评测,报告哪些交接会断、断多频繁。

**类型:** 终局项目
**编程语言:** Python / TypeScript(智能体),Shell(worktree 脚本)
**前置要求:** 第 11 阶段(LLM 工程)、第 13 阶段(工具)、第 14 阶段(智能体)、第 15 阶段(自治系统)、第 16 阶段(多智能体)、第 17 阶段(基础设施)
**涉及阶段:** P11 · P13 · P14 · P15 · P16 · P17
**预计耗时:** 40 小时

## 问题

单智能体编程外壳在大任务上会撞天花板。不是哪个智能体不行,而是 200k token 的上下文装不下"一份架构计划 + 四片并行代码库 + 评审意见 + 测试输出"。多智能体工厂把问题拆开:架构师管计划,编码员在并行 worktree 里各管实现,评审把关,测试验证。SWE-AF 的"工厂"架构、MetaGPT 的角色、AutoGen 的带类型 actor 图——三种表述说的是同一个东西。

故障面在交接。架构师规划了编码员实现不了的东西;编码员产出互相冲突的 diff;评审批准了一个幻觉修复;测试跟还在写代码的编码员抢跑。你要组建这样一支团队,跑 50 个 SWE-bench Pro issue,追踪每一次交接,发布事故复盘。

## 概念

角色是带类型的智能体。**架构师**(Claude Opus 4.7)读 issue、写计划、拆成带明确接口的子任务。**编码员**(Claude Sonnet 4.7,N 个并行实例,各自在一个 `git worktree` + Daytona 沙箱里)独立实现子任务。**评审**(GPT-5.4)读合并后的 diff,要么批准,要么要求具体修改。**测试**(Gemini 2.5 Pro)在隔离环境跑测试套件,带产物报告通过/失败。

通信走共享任务板(文件存储或 Redis)。每个角色消费自己被允许处理的任务。交接是 A2A 协议的带类型消息。协调问题包括:合并冲突解决(协调员角色或自动三方合并)、共享状态同步(编码员开工后计划冻结;重新规划是独立事件)、评审看门(评审不能批准自己写的或自己提议的改动)。

token 放大是隐性成本。每道角色边界都要加摘要提示与交接上下文。单智能体 40 轮的一次运行,摊到四个角色头上就是 160 轮。评分细则专门拿 token 效率对比单智能体基线,因为问题不是"多智能体行不行",而是"折算到每美元上赢不赢"。

## 架构

```
GitHub issue URL
      |
      v
Architect (Opus 4.7)
   reads issue, produces plan with subtasks + interfaces
      |
      v
Task board (file / Redis)
      |
   +-- subtask 1 ---+-- subtask 2 ---+-- subtask 3 ---+-- subtask 4 ---+
   v                v                v                v                v
Coder A          Coder B          Coder C          Coder D          (4 parallel)
 (Sonnet)         (Sonnet)         (Sonnet)         (Sonnet)
 worktree A       worktree B       worktree C       worktree D
 Daytona          Daytona          Daytona          Daytona
      |                |                |                |
      +--------+-------+-------+--------+
               v
           merge coordinator  (three-way merge + conflict resolution)
               |
               v
           Reviewer (GPT-5.4)
               |
               v
           Tester  (Gemini 2.5 Pro)  -> passes? -> open PR
                                     -> fails?  -> route back to coder
```

## 技术栈

- 编排:LangGraph,共享状态 + 每智能体子图
- 消息:A2A 协议(Google 2025),带类型的智能体间消息
- 模型:Opus 4.7(架构师)、Sonnet 4.7(编码员)、GPT-5.4(评审)、Gemini 2.5 Pro(测试)
- worktree 隔离:每编码员 `git worktree add` + Daytona 沙箱
- 合并协调员:自定义三方合并 + LLM 调解冲突
- 评测:SWE-bench Pro(50 issue)、SWE-AF 场景、HumanEval++ 单元测试
- 可观测:Langfuse,span 带角色标签,按智能体记 token 账
- 部署:K8s,每角色独立 Deployment,按积压量做 HPA

```figure
ce-team-handoff
```

## 动手构建

1. **任务板。** 文件存储的 JSONL,带类型消息:`plan_request`、`subtask`、`diff_ready`、`review_needed`、`test_needed`、`approved`、`rejected`、`replan_needed`。智能体按标签订阅。

2. **架构师。** 读 GitHub issue,用带计划模板的 Opus 4.7,模板要求子任务接口明确(动哪些文件、公开哪些函数、影响哪些测试)。产出一条带子任务 DAG 的 `plan_request`。

3. **编码员。** N 个并行 worker,各自从板上认领一个子任务。各自 `git worktree add` 新分支 + 起 Daytona 沙箱,实现子任务,产出 `diff_ready`(补丁 + 测试增量)。

4. **合并协调员。** 全部编码员完成后,把 N 个分支三方合并到 staging 分支。只有文件级重叠时才走 LLM 调解冲突。

5. **评审。** GPT-5.4 读合并 diff。不能批准自己写过的 diff。产出 `approved`(无事发生)或 `review_feedback`(带具体修改要求,路由回相关编码员)。

6. **测试。** Gemini 2.5 Pro 在干净沙箱跑测试套件,捕获产物,产出 `test_passed` 或带堆栈的 `test_failed`。失败测试回环给拥有该失败子任务的编码员。

7. **交接记账。** 每条跨越角色边界的消息在 Langfuse 记 span,带 payload 大小与所用模型。计算每子任务的 token 放大率((coder_tokens + reviewer_tokens + tester_tokens + architect_share)/ coder_tokens)。

8. **评测。** 跑 50 个 SWE-bench Pro issue。对比单智能体基线(单个 worktree 里的一个 Sonnet 4.7)的 pass@1 与每解决 issue 成本。

9. **复盘。** 对每个失败 issue,定位断掉的交接(计划太模糊、合并冲突、评审误批、测试抖动)。产出交接失败直方图。

## 投入使用

```
$ team run --issue https://github.com/acme/widget/issues/842
[architect] plan: 4 subtasks (parser, cache, api, migration)
[board]     dispatched to 4 coders in parallel worktrees
[coder-A]   subtask parser  -> 42 lines, tests pass locally
[coder-B]   subtask cache   -> 88 lines, tests pass locally
[coder-C]   subtask api     -> 31 lines, tests pass locally
[coder-D]   subtask migration -> 19 lines, tests pass locally
[merge]     3-way merge: 0 conflicts
[reviewer]  comments on cache (thread pool sizing); routed to coder-B
[coder-B]   revision: 92 lines; submits
[reviewer]  approved
[tester]    all 412 tests pass
[pr]        opened #3382   4 coders, 1 revision, $4.90, 18m
```

## 交付

`outputs/skill-multi-agent-team.md` 是交付物。给定 issue URL 与并行度,团队产出一个可合并的 PR,附分角色 token 账单。

| 权重 | 评分项 | 衡量方式 |
|:-:|---|---|
| 25 | SWE-bench Pro pass@1 | 匹配的 50 issue 子集 pass@1 |
| 20 | 并行加速比 | 对比单智能体基线的墙钟时间 |
| 20 | 评审质量 | 注 bug 探针上的误批率 |
| 20 | token 效率 | 每解决 issue 的总 token 对比单智能体 |
| 15 | 协调工程 | 合并冲突解决、交接失败直方图 |
| **100** | | |

## 练习

1. 运行中途往 diff 里注入一个明显的 bug(主体前多一行 `return None`)。度量评审误批率。调评审提示词,把误批率压到 5% 以下。

2. 缩到两个编码员(架构师 + 编码员 + 评审 + 测试,编码员顺序跑两个子任务)。对比墙钟与通过率。

3. 用单写入约束替换合并协调员(子任务触碰互不相交的文件集)。度量加在架构师头上的规划负担。

4. 把评审从 GPT-5.4 换成 Claude Opus 4.7。度量误批率与 token 成本差值。

5. 加第五个角色:文档员(Haiku 4.5),评审通过后产出 changelog 条目。度量文档质量是否对得起多花的 token。

## 关键术语

| 术语 | 人们常说的是 | 实际含义 |
|------|-----------------|------------------------|
| 并行 worktree | "隔离分支" | `git worktree add` 为每个编码员产出全新工作树 |
| 任务板 | "共享消息总线" | 智能体订阅的带类型消息存储(文件或 Redis) |
| 交接 | "角色边界" | 任何一条从一个角色上下文跨入另一个角色上下文的消息 |
| token 放大 | "多智能体开销" | 同一任务上各角色总 token / 单智能体 token |
| A2A 协议 | "智能体对智能体" | Google 2025 年的带类型智能体间消息规范 |
| 合并协调员 | "集成者" | 跑三方合并并调解冲突的组件 |
| 误批 | "评审幻觉" | 评审批准了带已知 bug 的 diff |

## 延伸阅读

- [SWE-AF factory architecture](https://github.com/Agent-Field/SWE-AF) —— 2026 年多智能体工厂参考
- [MetaGPT](https://github.com/FoundationAgents/MetaGPT) —— 角色化多智能体框架
- [AutoGen v0.4](https://github.com/microsoft/autogen) —— 微软带类型 actor 框架
- [Cognition AI (Devin)](https://cognition.ai) —— 参考产品
- [Factory Droids](https://www.factory.ai) —— 另一个参考产品
- [Google A2A protocol](https://a2a-protocol.org/latest/) —— 智能体间消息规范
- [git worktree documentation](https://git-scm.com/docs/git-worktree) —— 隔离底座
- [SWE-bench Pro](https://www.swebench.com) —— 评测目标
