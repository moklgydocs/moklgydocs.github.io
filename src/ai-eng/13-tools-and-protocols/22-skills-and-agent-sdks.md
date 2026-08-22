# Skills 与智能体 SDK —— Anthropic Skills、AGENTS.md、OpenAI Apps SDK

> MCP 说的是"有哪些工具",Skill 说的是"这件事怎么做"。2026 年的技术栈把两者叠在一起。Anthropic 的 Agent Skills(2025 年 12 月成为开放标准)以 SKILL.md 形式交付,带渐进披露。OpenAI 的 Apps SDK 是 MCP 加 widget 元数据。AGENTS.md(已进入 6 万多个仓库)放在仓库根目录,作为项目级的智能体上下文。本课点明各自覆盖什么,并构建一个能跨智能体携带的最小 SKILL.md + AGENTS.md 包。

**类型:** 学习
**编程语言:** Python(标准库,SKILL.md 解析器与加载器)
**前置要求:** 第 13 阶段 · 07(MCP 服务器)
**预计耗时:** 约 45 分钟

## 学习目标

- 区分三层:AGENTS.md(项目上下文)、SKILL.md(可复用的 know-how)、MCP(工具)。
- 写一份带 YAML frontmatter 和渐进披露的 SKILL.md。
- 以文件系统方式把 skill 加载进智能体运行时。
- 把一个 skill 与一个 MCP 服务器和一份 AGENTS.md 组合成一个包,让它在 Claude Code、Cursor 和 Codex 里都能用。

## 问题

一位工程师把写发布说明的工作流提炼成一个多步提示:"读取最近合并的 PR。按领域分组。逐个总结。按团队风格写 changelog 条目。发到 Slack 草稿。"他把它放进 Notion 文档给团队用。

现在他想在 Claude Code、Cursor 和 Codex CLI 里都用这个工作流。每个智能体加载指令的方式不同:Claude Code 用 slash 命令,Cursor 用 rules,Codex 用 `.codex.md`。工程师把工作流复制三份,维护三份。

AGENTS.md 和 SKILL.md 合起来解决这个问题:

- **AGENTS.md** 放在仓库根目录。每个兼容智能体在会话开始时读它。"这个项目怎么运作?有什么约定?哪条命令跑测试?"
- **SKILL.md** 是可移植的包:YAML frontmatter(name、description)+ markdown 正文 + 可选资源。支持 skill 的智能体按名字按需加载。
- **MCP**(第 13 阶段 · 06-14)负责 skill 需要调用的工具。

三层,一个可移植工件。

## 概念

### AGENTS.md(agents.md)

2025 年末推出,到 2026 年 4 月已被 6 万多个仓库采用。仓库根目录一个文件。格式:

```markdown
# Project: my-service

## Conventions
- TypeScript with strict mode.
- Use Pydantic for models on the Python side.
- Tests run with `pnpm test`.

## Build and run
- `pnpm dev` for local dev server.
- `pnpm build` for production bundle.
```

智能体在会话开始时读它,据此校准自己在该项目中的行为。2026 年每个编程智能体都支持 AGENTS.md:Claude Code、Cursor、Codex、Copilot Workspace、opencode、Windsurf、Zed。

### SKILL.md 格式

Anthropic 的 Agent Skills(2025 年 12 月作为开放标准发布):

```markdown
---
name: release-notes-writer
description: Write a changelog entry for the latest merged PRs following this project's style.
---

# Release notes writer

When invoked, run these steps:

1. List PRs merged since the last tag. Use `gh pr list --base main --state merged`.
2. Group by label: feature, fix, chore, docs.
3. For each PR in each group, write one line: `- <title> (#<num>)`.
4. Draft the release notes and stage them in CHANGELOG.md.

If the user says "ship", run `git tag vX.Y.Z` and `gh release create`.

## Notes

- Never include commits without a PR.
- Skip "chore" entries from the public changelog.
```

frontmatter 声明 skill 的身份。正文是 skill 加载时展示给模型的提示词。

### 渐进披露

skill 可以引用子资源,智能体只在需要时才拉取。例:

```
skills/
  release-notes-writer/
    SKILL.md
    style-guide.md
    template.md
    scripts/
      generate.sh
```

SKILL.md 里写"风格规则见 style-guide.md"。智能体只在 skill 实际运行时才拉 style-guide.md。这样避免用模型未必需要的细节把提示词塞爆。

### 文件系统发现

智能体运行时扫描已知目录寻找 SKILL.md 文件:

- `~/.anthropic/skills/*/SKILL.md`
- 项目 `./skills/*/SKILL.md`
- `~/.claude/skills/*/SKILL.md`

按文件夹名和 frontmatter 的 `name` 加载。Claude Code、Anthropic Claude Agent SDK 和 SkillKit(跨智能体)都遵循这个模式。

### Anthropic Claude Agent SDK

`@anthropic-ai/claude-agent-sdk`(TypeScript)和 `claude-agent-sdk`(Python)在会话开始时加载 skill,把它们作为可调用的"agent"暴露在运行时里。用户调用某个 skill 时,智能体循环分发到它。

### OpenAI Apps SDK

2025 年 10 月发布;直接构建在 MCP 之上。把 OpenAI 此前的 Connectors 和 Custom GPT Actions 统一到同一个开发者表面。一个 Apps SDK 应用是:

- 一个 MCP 服务器(工具、资源、提示)。
- 加上给 ChatGPT UI 的 widget 元数据。
- 加上可选的 MCP Apps `ui://` 资源,用于交互界面。

同一个协议,更丰富的体验。

### 经 SkillKit 的跨智能体可移植性

SkillKit 这类跨智能体分发层工具,把一份 SKILL.md 翻译成 32+ 个 AI 智能体(Claude Code、Cursor、Codex、Gemini CLI、OpenCode 等)各自的原生格式。一个事实源,多个消费者。

### 三层栈

| 层 | 文件 | 何时加载 | 用途 |
|-------|------|-------------|---------|
| AGENTS.md | 仓库根目录 | 会话开始 | 项目级约定 |
| SKILL.md | skills 目录 | skill 被调用时 | 可复用工作流 |
| MCP 服务器 | 外部进程 | 需要工具时 | 可调用的动作 |

三层组合:智能体在会话开始时读 AGENTS.md,用户调用一个 skill,skill 的指令里包含 MCP 工具调用,智能体经 MCP 客户端分发。

```figure
t3-skill-layers
```

## 投入使用

`code/main.py` 附带一个标准库 SKILL.md 解析器和加载器。它在 `./skills/` 下发现 skill,解析 YAML frontmatter 和 markdown 正文,产出以 skill 名为键的字典。然后模拟一个按名字调用 `release-notes-writer` 的智能体循环。

重点看:

- 用最小标准库解析器解析 YAML frontmatter(不依赖 `pyyaml`)。
- skill 正文原样存储;调用时由智能体把它前置到系统提示词。
- 渐进披露通过一个按需拉取引用文件的 `read_subresource` 函数演示。

## 交付

本课产出 `outputs/skill-agent-bundle.md`。给定一个工作流,该技能产出组合的 SKILL.md + AGENTS.md + MCP 服务器蓝图包,可跨智能体携带。

## 练习

1. 运行 `code/main.py`。在 `skills/` 下加第二个 skill,确认加载器能发现它。

2. 为本课程仓库写一份 AGENTS.md。包含测试命令、风格约定和第 13 阶段的心智模型。

3. 把你团队内部文档里的一个多步工作流移植成 SKILL.md。验证它能在 Claude Code 中加载。

4. 手工把这个 skill 翻译成 Cursor 和 Codex 的原生规则格式。数一数格式之间的差异——这就是 SkillKit 自动化的翻译面。

5. 读 Anthropic Agent Skills 博文。找出 Claude Agent SDK 中本课加载器未覆盖的一个特性。(提示:智能体子调用。)

## 关键术语

| 术语 | 大家口头的说法 | 实际含义 |
|------|----------------|------------------------|
| SKILL.md | "skill 文件" | YAML frontmatter 加 markdown 正文,由智能体运行时加载 |
| AGENTS.md | "仓库根的智能体上下文" | 会话开始时读取的项目级约定文件 |
| 渐进披露 | "子资源懒加载" | skill 正文引用的文件只在需要时拉取 |
| frontmatter | "顶部的 YAML 块" | `---` 分隔符内的元数据(name、description) |
| Claude Agent SDK | "Anthropic 的 skill 运行时" | `@anthropic-ai/claude-agent-sdk`,加载 skill 并路由 |
| OpenAI Apps SDK | "MCP + widget 元数据" | OpenAI 构建在 MCP 之上、带 ChatGPT UI 钩子的开发表面 |
| Skill 发现 | "文件系统扫描" | 遍历已知目录找 SKILL.md,按名字作键 |
| 跨智能体可移植 | "一份 skill 多处用" | 经 SkillKit 类工具把一份 SKILL.md 翻译给 32+ 个智能体 |
| Agent Skill | "可携带的 know-how" | MCP 工具概念之外的可复用任务模板 |
| Apps SDK | "MCP 加 ChatGPT UI" | Connectors 与 Custom GPT 在 MCP 上的统一 |

## 延伸阅读

- [Anthropic — Agent Skills announcement](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) — 2025 年 12 月发布
- [Anthropic — Agent Skills docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) — SKILL.md 格式参考
- [OpenAI — Apps SDK](https://developers.openai.com/apps-sdk) — ChatGPT 的 MCP 开发者平台
- [agents.md](https://agents.md/) — AGENTS.md 格式与采用名单
- [Anthropic — anthropics/skills GitHub](https://github.com/anthropics/skills) — 官方 skill 示例
