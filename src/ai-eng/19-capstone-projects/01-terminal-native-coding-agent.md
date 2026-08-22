# 终局项目 01 —— 终端原生编程智能体

> 到了 2026 年,编程智能体的形态已经尘埃落定:一个 TUI 外壳、一份有状态的计划、一面沙箱化的工具墙、一个"规划—行动—观察—恢复"的循环。Claude Code、Cursor 3、OpenCode 站在五十英尺外看都长一个样。本终局项目要求你端到端地造一个出来——命令行进、Pull Request 出——并在 SWE-bench Pro 上对标 mini-swe-agent 与 Live-SWE-agent。你会亲身体会到:难点不在模型调用,而在工具循环、沙箱,以及一次 50 轮运行上的成本天花板。

**类型:** 终局项目
**编程语言:** TypeScript / Bun(外壳),Python(评测脚本)
**前置要求:** 第 11 阶段(LLM 工程)、第 13 阶段(工具与协议)、第 14 阶段(智能体)、第 15 阶段(自治系统)、第 17 阶段(基础设施)
**涉及阶段:** P0 · P5 · P7 · P10 · P11 · P13 · P14 · P15 · P17 · P18
**预计耗时:** 35 小时

## 问题

编程智能体在 2026 年成为 AI 应用的主流品类。Claude Code(Anthropic)、搭载 Composer 2 与 Agent Tabs 的 Cursor 3(Cursor)、Amp(Sourcegraph)、OpenCode(112k star)、Factory Droids、Google Jules,交付的都是同一架构的各种变体:一个终端外壳、一面带权限的工具墙、一个沙箱,以及围绕前沿模型搭建的"规划—行动—观察"循环。前沿阵地很窄——Live-SWE-agent 用 Opus 4.5 在 SWE-bench Verified 上达到 79.2%——但工程手艺的天地很宽。大多数失败模式并非模型出错,而是工具循环失稳、上下文污染、token 成本失控,以及破坏性的文件系统操作。

从外面是无法推理这些智能体的。你必须亲手造一个,眼睁睁看着循环在第 47 轮因为 ripgrep 返回 8MB 匹配结果而崩溃,然后重建截断层。这正是本项目的意义所在。

## 概念

外壳(harness)有四个表面。**规划(Plan)** 维护一个 TodoWrite 风格的状态对象,模型每轮重写它。**行动(Act)** 派发工具调用(读、改、跑、搜、git)。**观察(Observe)** 捕获 stdout / stderr / 退出码,截断后把摘要喂回模型。**恢复(Recover)** 处理工具错误,既不撑爆上下文窗口,也不陷入死循环。2026 年的形态还加了一样东西:**钩子(hooks)**。`PreToolUse`、`PostToolUse`、`SessionStart`、`SessionEnd`、`UserPromptSubmit`、`Notification`、`Stop`、`PreCompact`——这些可配置的扩展点,让运维者注入策略、遥测与护栏。

沙箱用 E2B 或 Daytona。每个任务跑在全新的 devcontainer 里,挂载一个可读写的 git worktree。外壳永远不碰宿主机文件系统。无论成功失败,worktree 用完即拆。成本控制分三层强制执行:每轮 token 上限、每会话美元预算、硬性轮数上限(通常 50)。可观测层是带 GenAI 语义约定的 OpenTelemetry span,发送到自托管的 Langfuse。

## 架构

```
  user CLI  ->  harness (Bun + Ink TUI)
                  |
                  v
           plan / act / observe loop  <--->  Claude Sonnet 4.7 / GPT-5.4-Codex / Gemini 3 Pro
                  |                          (via OpenRouter, model-agnostic)
                  v
           tool dispatcher (MCP StreamableHTTP client)
                  |
     +------------+------------+----------+
     v            v            v          v
  read/edit    ripgrep     tree-sitter   git/run
     |            |            |          |
     +------------+------------+----------+
                  |
                  v
           E2B / Daytona sandbox  (worktree isolated)
                  |
                  v
           hooks: Pre/Post, Session, Prompt, Compact
                  |
                  v
           OpenTelemetry -> Langfuse (spans, tokens, $)
                  |
                  v
           PR via GitHub app
```

## 技术栈

- 外壳运行时:Bun 1.2 + Ink 5(终端里的 React)
- 模型接入:OpenRouter 统一 API,可选 Claude Sonnet 4.7、GPT-5.4-Codex、Gemini 3 Pro、Opus 4.5(用于最难任务)
- 工具传输:Model Context Protocol StreamableHTTP(MCP 2026 修订版)
- 沙箱:E2B sandboxes(JS SDK)或 Daytona devcontainers
- 代码搜索:ripgrep 子进程,tree-sitter 解析器覆盖 17 种语言(预编译)
- 隔离:每个任务 `git worktree add`,成功或失败后清理
- 评测外壳:SWE-bench Pro(verified 子集)+ Terminal-Bench 2.0 + 你自己的 30 题保留集
- 可观测:OpenTelemetry SDK,`gen_ai.*` 语义约定 → 自托管 Langfuse
- PR 发布:GitHub App,细粒度 token,权限范围只限目标仓库

```figure
ce-agent-loop
```

## 动手构建

1. **TUI 与命令循环。** 用 Ink 搭一个 Bun 项目脚手架。支持 `agent run <repo> "<task>"`。打印分栏视图:计划面板(上)、工具调用流(中)、token 预算(下)。加上 Ctrl-C 取消,退出前先触发 `SessionEnd` 钩子。

2. **计划状态。** 定义带类型的 TodoWrite schema(pending / in_progress / done 条目,可附注记)。模型每轮以工具调用形式整体重写状态——不允许增量修改。把计划持久化到 `.agent/state.json`,崩溃后可恢复。

3. **工具表面。** 定义六个工具:`read_file`、`edit_file`(带 diff 预览)、`ripgrep`、`tree_sitter_symbols`、`run_shell`(带超时)、`git`(status / diff / commit / push)。通过 MCP StreamableHTTP 暴露,让外壳与传输层解耦。每个工具返回截断后的输出(每次调用上限 4k token)。

4. **沙箱封装。** 每个任务拉起一个 E2B 沙箱。`git worktree add -b agent/$TASK_ID` 建一个全新分支。所有工具调用都在沙箱内执行,宿主机文件系统不可达。

5. **钩子。** 实现全部八种 2026 钩子类型。至少接入四个用户自定义钩子:(a) `PreToolUse` 破坏性命令守卫,拦截 worktree 之外的 `rm -rf`;(b) `PostToolUse` token 记账;(c) `SessionStart` 预算初始化;(d) `Stop` 写出最终的 trace 包。

6. **评测循环。** 克隆 SWE-bench Pro Python 的 30 题子集。用你的外壳逐题运行。与 mini-swe-agent(最小基线)对比 pass@1、每任务轮数、每任务美元成本。结果写入 `eval/results.jsonl`。

7. **成本控制。** 硬性截断:50 轮、200k 上下文、每任务 5 美元。`PreCompact` 钩子在 150k 处把较早轮次摘要成一段 prior-state 块,腾出空间接纳新观察,同时不丢计划。

8. **PR 发布。** 成功时,最后一步是 `git push` 加一次 GitHub API 调用,开一个 PR,正文里附上计划与 diff 摘要。

## 投入使用

```
$ agent run ./my-repo "Fix the race condition in worker.rs"
[plan]  1 locate worker.rs and enumerate mutex uses
        2 identify shared state under contention
        3 propose fix, verify tests
[tool]  ripgrep mutex.*lock -t rust           (44 matches, truncated)
[tool]  read_file src/worker.rs 120..180
[tool]  edit_file src/worker.rs (+8 -3)
[tool]  run_shell cargo test worker::          (passed)
[plan]  1 done · 2 done · 3 done
[done]  PR opened: #482   turns=9   tokens=38k   cost=$0.41
```

## 交付

交付技能放在 `outputs/skill-terminal-coding-agent.md`。给定仓库路径与任务描述,它在沙箱里跑完整的"规划—行动—观察"循环,返回 PR 链接和一份 trace 包。本终局项目的评分细则:

| 权重 | 评分项 | 衡量方式 |
|:-:|---|---|
| 25 | SWE-bench Pro pass@1 对比基线 | 你的外壳 vs mini-swe-agent,30 道匹配的 Python 题 |
| 20 | 架构清晰度 | 规划/行动/观察分离、钩子表面、工具 schema——对照 Live-SWE-agent 的布局评审 |
| 20 | 安全性 | 沙箱逃逸测试、权限提示、破坏性命令守卫通过红队演练 |
| 20 | 可观测性 | trace 完整度(100% 工具调用有 span)、逐轮 token 记账 |
| 15 | 开发者体验 | 冷启动 < 2s、崩溃恢复可续上计划、Ctrl-C 能在工具执行中途干净取消 |
| **100** | | |

## 练习

1. 把底层模型从 Claude Sonnet 4.7 换成 vLLM 上服务的 Qwen3-Coder-30B。对比 pass@1 与每任务成本,报告开源模型在哪些地方掉队。

2. 增加一个 `reviewer` 子智能体,在 PR 发布前读 diff,可要求打回重做。度量误报式评审是否会把 SWE-bench 通过率拖到单智能体基线之下(提示:通常会)。

3. 对沙箱做压力测试:写一个试图 `curl` 外部 URL 的任务,再写一个试图在 worktree 之外写文件的任务。确认两者都被 PreToolUse 钩子拦截,并记录这些尝试。

4. 用更小的模型(Haiku 4.5)实现 `PreCompact` 摘要。度量 3 倍压缩率下计划保真度损失了多少。

5. 把 MCP StreamableHTTP 传输换成 stdio。基准测试冷启动与单次调用延迟,为纯本地场景选一个胜者。

## 关键术语

| 术语 | 人们常说的是 | 实际含义 |
|------|-----------------|------------------------|
| Harness(外壳) | "智能体循环" | 包裹模型的那层代码:派发工具、维护计划状态、执行预算约束 |
| Hook(钩子) | "智能体事件监听器" | 由外壳在八个生命周期事件之一上运行的用户自定义脚本 |
| Worktree | "Git 沙箱" | 一个指向独立路径的关联 git 检出;用完即弃,不碰主克隆 |
| TodoWrite | "计划状态" | 一份带类型的 pending/in-progress/done 条目列表,模型每轮重写 |
| StreamableHTTP | "MCP 传输" | 2026 年 MCP 修订版:长连接 HTTP、双向流式;取代 SSE |
| Token ceiling(token 上限) | "上下文预算" | 按轮或按会话限制输入+输出 token;触发压缩或终止 |
| pass@1 | "单次通过率" | 不重试、不偷看测试集的前提下,首次运行即解决的 SWE-bench 任务比例 |

## 延伸阅读

- [Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code) —— Anthropic 的参考外壳
- [Cursor 3 changelog](https://cursor.com/changelog) —— Agent Tabs 与 Composer 2 产品说明
- [mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent) —— SWE-bench 外壳对比的最小基线
- [Live-SWE-agent](https://github.com/OpenAutoCoder/live-swe-agent) —— 用 Opus 4.5 在 SWE-bench Verified 上达 79.2%
- [OpenCode](https://opencode.ai) —— 开源外壳,112k star
- [SWE-bench Pro leaderboard](https://www.swebench.com) —— 本项目对标的评测
- [Model Context Protocol 2026 roadmap](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/) —— StreamableHTTP、能力元数据
- [OpenTelemetry GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/) —— 工具调用与 token 用量的 span schema
