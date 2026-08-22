# 终局项目 16 —— GitHub Issue 到 PR 的自治智能体

> 给 issue 打个标签,收获一个 PR——这就是 2026 年自治编程智能体的产品形态:智能体跑在云沙箱里,验证测试通过,交出一个带理由说明、可直接评审的 PR。AWS Remote SWE Agents、Cursor Background Agents、OpenAI Codex 云版、Google Jules 都交付了这个形态。难点在于:自动复现仓库的构建环境、防止凭据泄漏、按仓库强制预算,以及确保智能体不能强推。本终局项目要搭出自托管版本,并在成本与通过率上对标托管方案。

**类型:** 终局项目
**编程语言:** Python(智能体),TypeScript(GitHub App),YAML(Actions)
**前置要求:** 第 11 阶段(LLM 工程)、第 13 阶段(工具)、第 14 阶段(智能体)、第 15 阶段(自治系统)、第 17 阶段(基础设施)
**涉及阶段:** P11 · P13 · P14 · P15 · P17
**预计耗时:** 30 小时

## 问题

异步云端编程智能体是与交互式编程智能体(终局项目 01)并列的独立品类。它的 UX 就是一个 GitHub 标签。你给 issue 打上 `@agent fix this`,一个 worker 在云沙箱里拉起:克隆仓库、跑测试、改文件、验证、开 PR,正文里写清智能体的理由。没有交互循环,没有终端。AWS Remote SWE Agents、Cursor Background Agents、OpenAI Codex 云版、Google Jules、Factory Droids 全部收敛于此。

工程挑战都很具体:环境复现(智能体要在没有缓存开发镜像的情况下从零构建仓库)、测试抖动(必须重跑或隔离)、凭据收敛(最小细粒度权限的 GitHub App)、按仓库按天的预算强制,以及禁止强推策略。本终局项目度量通过率、成本与安全,对标托管方案。

## 概念

触发器是一个 GitHub webhook(issue 标签或 PR 评论)。分发器把工作入队到 ECS Fargate 或 Lambda。worker 把仓库拉进 Daytona 或 E2B 沙箱,配上从仓库推断出的通用 Dockerfile(语言、框架)。智能体跑 mini-swe-agent 或 SWE-agent v2 循环,底层是 Claude Opus 4.7 或 GPT-5.4-Codex。它迭代:读代码、提修复、打补丁、跑测试。

验证是闸门步骤。开 PR 之前,完整 CI 必须在沙箱内全绿。还要算覆盖率增量;若负向超阈值,PR 照开,但打上 `needs-review` 标签。智能体把理由写成 PR 描述,外加一个 `@agent` 讨论串,评审可以 @ 它追问。

安全通过两个不同的 GitHub 表面来收敛:App 提供短时效 installation token,带 `workflows: read` 和收窄的仓库内容/PR 作用域;分支保护(而非 App 权限)强制"禁止直写 `main`"与"禁止强推"——App 永远不进绕过名单。GitHub App 权限并不支持路径级收敛(比如只读 `.github/workflows`),所以智能体对文件编辑的白名单必须在 worker 侧强制。按仓库按天的预算上限在分发器处执行(如每仓库每天最多 5 个 PR、每 PR 20 美元)。

## 架构

```
GitHub issue labeled `@agent fix` or PR comment
            |
            v
    GitHub App webhook -> AWS Lambda dispatcher
            |
            v
    ECS Fargate task (or GitHub Actions self-hosted runner)
       - pull repo
       - infer Dockerfile (language, package manager)
       - Daytona / E2B sandbox with target runtime
       - clone -> git worktree -> agent branch
            |
            v
    mini-swe-agent / SWE-agent v2 loop
       Claude Opus 4.7 or GPT-5.4-Codex
       tools: ripgrep, tree-sitter, read/edit, run_tests, git
            |
            v
    verify CI passes in-sandbox + coverage delta check
            |
            v (verified)
    git push + open PR via GitHub App
       PR body = rationale + diff summary + trace URL
       label: needs-review
            |
            v
    operator reviews; can @-mention agent for follow-ups
```

## 技术栈

- 触发:细粒度 token 的 GitHub App;webhook 接收走 Lambda 或 Fly.io
- Worker:ECS Fargate 任务(或 GitHub Actions 自托管 runner)
- 沙箱:每任务一个 Daytona devcontainer 或 E2B 沙箱
- 智能体循环:mini-swe-agent 基线或 SWE-agent v2,底层 Claude Opus 4.7 / GPT-5.4-Codex
- 检索:tree-sitter repo-map + ripgrep
- 验证:沙箱内跑完整 CI + 覆盖率增量闸门
- 可观测:Langfuse,每 PR 的 trace 归档,链接放在 PR 正文
- 预算:每仓库每日美元上限;每仓库每日 PR 数上限

```figure
cf-issue-to-pr
```

## 动手构建

1. **GitHub App。** 细粒度 installation token:issues 读写、pull_requests 写、contents 读写、workflows 读。分支保护(唯一能做这件事的表面)强制"禁止直推 `main`"与"禁止强推";App 不在绕过名单里。worker 侧以白名单检查待提交 diff,强制"不写 `.github/workflows` 下的文件",因为 GitHub App 权限做不到路径级。

2. **Webhook 接收器。** Lambda 函数接收 issue 标签 / PR 评论 webhook,按标签 `@agent fix this` 过滤,入队 SQS。

3. **分发器。** 从 SQS 弹任务,强制每仓库每日预算,拉起 ECS Fargate 任务:仓库 URL、issue 正文、一个全新的 Daytona 沙箱。

4. **环境推断。** 识别语言(Python、Node、Go、Rust)与包管理器(uv、pnpm、go mod、cargo)。没有 Dockerfile 就现场生成一个。

5. **智能体循环。** mini-swe-agent 或 SWE-agent v2 配 Claude Opus 4.7。工具:ripgrep、tree-sitter repo-map、read_file、edit_file、run_tests、git。硬上限:20 美元、30 分钟墙钟、30 轮。

6. **验证。** 循环结束后,沙箱内跑完整测试套件。用 jacoco / coverage.py 算覆盖率增量。CI 红:停,不开 PR。覆盖率掉超 2%:开 PR 但打 `needs-review` 标签。

7. **发 PR。** 推送智能体分支,经 GitHub API 开 PR:标题、理由、diff 摘要、trace 链接、成本、轮数。

8. **凭据卫生。** worker 用短时效 GitHub App installation token 运行;日志归档前洗 secret。

9. **评测。** 30 个不同难度的内部预置 issue。度量通过率、PR 质量(diff 大小、风格、覆盖率)、成本、延迟。与 Cursor Background Agents、AWS Remote SWE Agents 在同一批 issue 上对比。

## 投入使用

```
# on github.com
  - user labels issue #842 with `@agent fix this`
  - PR #1903 appears 14 minutes later
  - body:
    > Fixed NPE in widget.dedupe() caused by null comparator entry.
    > Added regression test widget_test.go::TestDedupeNullComparator.
    > Coverage delta: +0.12%
    > Turns: 7  Cost: $1.80  Trace: langfuse:...
    > Label: needs-review
```

## 交付

`outputs/skill-issue-to-pr.md` 是交付物:一个 GitHub App + 异步云 worker,把打了标签的 issue 变成可直接评审的 PR,成本有界、凭据收敛。

| 权重 | 评分项 | 衡量方式 |
|:-:|---|---|
| 25 | 30 个 issue 上的通过率 | 端到端成功(CI 绿 + 覆盖率达标) |
| 20 | PR 质量 | diff 大小、覆盖率增量、风格一致性 |
| 20 | 每解决 issue 的成本与延迟 | 每 PR 的美元与墙钟 |
| 20 | 安全 | 收敛 token、每仓库预算、无强推、凭据卫生 |
| 15 | 操作者体验 | 理由评论、重试入口、@ 追问 |
| **100** | | |

## 练习

1. 加"修抖动测试"模式:标签 `@agent stabilize-flake TestX` 在沙箱内把该测试跑 50 遍,提出一个让它稳定的最小改动。

2. 在三个共享 issue 上对比成本与 Cursor Background Agents。报告各自在哪些环节占优。

3. 实现预算看板:每仓库每日成本、每用户成本,异常告警。

4. 造"演练"模式:不跑 CI 直接开草稿 PR,让评审低成本查看计划。

5. 加保留策略:超过 7 天未合并的 PR 分支自动删除。

## 关键术语

| 术语 | 人们常说的是 | 实际含义 |
|------|-----------------|------------------------|
| GitHub App | "收敛权限的机器人身份" | 细粒度权限 + 短时效 installation token 的 App |
| 异步云智能体 | "后台智能体" | 在云沙箱里跑的非交互 worker,不在终端里 |
| 环境推断 | "Dockerfile 合成" | 识别语言 + 包管理器,缺 Dockerfile 时生成一个 |
| 验证 | "沙箱内 CI" | 开 PR 前在 worker 里跑完整测试套件 |
| 覆盖率增量 | "覆盖率保持" | 基分支到智能体分支的测试覆盖率 % 变化 |
| 每仓库预算 | "每日上限" | 在分发器强制的美元与 PR 数上限 |
| 理由说明 | "PR 正文解释" | 智能体对改了什么、为什么的总结;PR 正文必填 |

## 延伸阅读

- [AWS Remote SWE Agents](https://github.com/aws-samples/remote-swe-agents) —— 异步云智能体权威参考
- [SWE-agent](https://github.com/SWE-agent/SWE-agent) —— CLI 参考
- [Cursor Background Agents](https://docs.cursor.com/background-agent) —— 商业替代
- [OpenAI Codex (cloud)](https://openai.com/codex) —— 托管竞品
- [Google Jules](https://jules.google) —— Google 托管版
- [Factory Droids](https://www.factory.ai) —— 另一个商业参考
- [GitHub App documentation](https://docs.github.com/en/apps) —— 收敛权限的机器人身份
- [Daytona cloud sandboxes](https://daytona.io) —— 参考沙箱
