# 终局项目 09 —— 代码迁移智能体(仓库级语言/运行时升级)

> Amazon 的 MigrationBench(Java 8 → 17)和 Google 的 App Engine Py2→Py3 迁移器定下了 2026 年的标杆。Moderne 的 OpenRewrite 做规模化确定性 AST 重写,Grit 用 codemod 风格 DSL 瞄准同一问题。生产模式是两者结合:确定性底座负责安全重写,智能体层处理模糊情形,按分支起沙箱构建,测试转绿才开 PR。本终局项目是迁移 50 个真实仓库,发布通过率,并给出一份失败分类学。

**类型:** 终局项目
**编程语言:** Python(智能体),Java / Python(迁移目标),TypeScript(看板)
**前置要求:** 第 5 阶段(NLP)、第 7 阶段(Transformer)、第 11 阶段(LLM 工程)、第 13 阶段(工具)、第 14 阶段(智能体)、第 15 阶段(自治系统)、第 17 阶段(基础设施)
**涉及阶段:** P5 · P7 · P11 · P13 · P14 · P15 · P17
**预计耗时:** 30 小时

## 问题

大规模代码迁移是 2026 年编程智能体最干净利落的生产应用之一。ground truth 明明白白(迁移后测试套件过不过?),收益实实在在(一支 Java 8 舰队的迁移是人力规模的项目),基准也是公开的(MigrationBench 50 仓库子集)。Moderne 的 OpenRewrite 搞定确定性那一侧;智能体层搞定 OpenRewrite 配方搞不定的一切:模糊重写、构建系统漂移、长尾语法、传递依赖断裂。

你要造一个智能体:吃进一个 Java 8 仓库(或 Python 2 仓库),产出一个 CI 全绿的迁移分支。度量通过率、测试覆盖率保持度、每仓库成本,并建一份失败分类学。与纯确定性基线的并排对比,会告诉你智能体的价值到底在哪。

## 概念

流水线分两层。**确定性底座**(Java 用 OpenRewrite,Python 用 libcst)安全地跑掉大部分机械重写:import、方法签名、空安全编辑、try-with-resources、废弃 API 替换。它快,且产出可审计的 diff。**智能体层**(OpenAI Agents SDK 或 LangGraph,底层是 Claude Opus 4.7 与 GPT-5.4-Codex)处理配方覆盖不了的情形:构建文件升级(Maven/Gradle/pyproject)、传递依赖冲突、测试抖动、自定义注解。

每个仓库得到一个预装目标运行时的 Daytona 沙箱。智能体迭代:跑构建、给失败分类、打补丁、重跑。硬上限:每仓库 30 分钟、8 美元、20 轮。测试全过且覆盖率增量非负,分支开 PR;否则归入某个失败类别并附证据。

失败分类学是交付物。50 个仓库,到底哪里断了?传递依赖?自定义注解?构建工具版本?与迁移无关的测试抖动?每类给出计数和一份示例 diff,未来的配方作者可以瞄准前三名。

## 架构

```
target repo
      |
      v
OpenRewrite / libcst deterministic recipes
   (safe, fast, auditable, ~70-80% of fixes)
      |
      v
Daytona sandbox per branch
      |
      v
agent loop (Claude Opus 4.7 / GPT-5.4-Codex):
   - run build -> capture failures
   - classify failures (build, test, lint)
   - apply fix (patch or retry recipe)
   - rerun
   - budget: 30 min, $8, 20 turns
      |
      v
test + coverage delta gate
      |
      v (passed)
open PR
      |
      v (failed)
file under failure class + attach repro
```

## 技术栈

- 确定性底座:OpenRewrite(Java)或 libcst(Python)
- 智能体:OpenAI Agents SDK 或 LangGraph,底层 Claude Opus 4.7 + GPT-5.4-Codex
- 沙箱:每分支一个 Daytona devcontainer,预装目标运行时(Java 17 / Python 3.12)
- 构建系统:Maven、Gradle、uv(Python)
- 基准:Amazon MigrationBench 50 仓库子集(Java 8 → 17)、Google App Engine Py2→Py3 仓库
- 测试装置:并行运行器,覆盖率用 Jacoco(Java)或 coverage.py(Python)
- 可观测:Langfuse,每仓库一份含全部 diff 块的 trace 包
- 看板:失败分类学看板,按类计数并附示例 diff

```figure
ce-migration-funnel
```

## 动手构建

1. **配方先行。** 先跑 OpenRewrite(Java)或 libcst(Python)配方。收掉 70–80% 的机械迁移。提交为 "recipe" 提交。

2. **构建试探。** Daytona 沙箱:装目标运行时,跑构建。绿则跳到测试;红则移交智能体。

3. **智能体循环。** LangGraph 配工具:`run_build`、`read_file`、`edit_file`、`run_test`、`git_diff`。智能体给失败分类(依赖、语法、测试、构建工具),打定点补丁,重跑。

4. **预算上限。** 每仓库 30 分钟墙钟、8 美元、20 轮。任何一项触顶即停止,归入 "budget_exhausted",附当前 diff。

5. **测试 + 覆盖率闸门。** 构建转绿后跑测试套件,与基仓库对比覆盖率。覆盖率掉超 2% 归入 "coverage_regression"。

6. **开 PR。** 成功则推送分支开 PR,附 diff 及摘要:哪些修复来自配方,哪些提交是智能体写的。

7. **失败分类学。** 每个失败仓库打类别标签:`dep_upgrade_required`、`build_tool_drift`、`custom_annotation`、`test_flake`、`syntax_edge_case`、`budget_exhausted`。建看板。

8. **50 仓库运行。** 在 MigrationBench 子集上执行。报告各类通过率、每仓库成本、覆盖率保持度,并与纯确定性基线对比。

## 投入使用

```
$ migrate legacy-java-service --target java17
[recipe]   27 rewrites applied (JUnit 4->5, HashMap initializer, try-with-resources)
[build]    FAIL: cannot find symbol sun.misc.BASE64Encoder
[agent]    turn 1 classify: removed_jdk_api
[agent]    turn 2 apply: sun.misc.BASE64Encoder -> java.util.Base64
[build]    OK
[tests]    412/412 passing; coverage 84.1% -> 84.3%
[pr]       opened #1841  cost=$3.20  turns=4
```

## 交付

`outputs/skill-migration-agent.md` 是交付物。给定一个仓库,它先跑确定性配方,再进智能体循环,产出全绿的迁移分支;或把仓库归入某个分类学类别。

| 权重 | 评分项 | 衡量方式 |
|:-:|---|---|
| 25 | MigrationBench 通过率 | 50 仓库子集 pass@1 |
| 20 | 测试覆盖率保持 | 相对基仓库的平均覆盖率增量 |
| 20 | 每仓库迁移成本 | 通过运行的 $/repo |
| 20 | 智能体/确定性工具协作 | OpenRewrite 处理 vs 智能体撰写的修复占比 |
| 15 | 失败分析报告 | 分类学完整度,附示例 |
| **100** | | |

## 练习

1. 只用 OpenRewrite(不带智能体)跑迁移流水线,对比完整流水线的通过率。找出智能体单独扭转乾坤的那些案例。

2. 实现"lint 干净"检查:迁移后跑风格检查器(Java 用 spotless,Python 用 ruff)。出现新 lint 错误则 PR 判失败。度量"覆盖率保住了但风格退步"的比例。

3. 加"最小 diff"优化器:智能体分支过测试后,再过一遍裁掉不必要的改动。报告 diff 体积缩减。

4. 扩展到第三种迁移:Node 18 → Node 22。复用沙箱封装,配方层换成自定义 codemod。

5. 把"首次构建转绿时间"(TTFGB)作为体验指标来度量。目标:p50 低于 10 分钟。

## 关键术语

| 术语 | 人们常说的是 | 实际含义 |
|------|-----------------|------------------------|
| 确定性底座 | "配方引擎" | OpenRewrite / libcst:带安全保证的声明式 AST 重写 |
| Codemod | "改代码的程序" | 机械修改源码的重写规则 |
| 构建漂移 | "工具版本偏移" | Maven / Gradle / uv 大版本之间细微的行为变化 |
| 失败类别 | "分类桶" | 仓库迁移失败的标注原因:依赖、语法、测试、构建工具、预算 |
| 覆盖率增量 | "覆盖率保持" | 基仓库到迁移分支的测试覆盖率 % 变化 |
| 智能体轮次 | "工具调用回合" | 智能体循环中的一轮"规划→行动→观察" |
| 预算耗尽 | "触顶" | 仓库用完 30 分钟 / 8 美元 / 20 轮限额仍未通过 |

## 延伸阅读

- [Amazon MigrationBench](https://aws.amazon.com/blogs/devops/amazon-introduces-two-benchmark-datasets-for-evaluating-ai-agents-ability-on-code-migration/) —— 2026 年权威基准
- [Moderne.io OpenRewrite platform](https://www.moderne.io) —— 确定性底座参考
- [OpenRewrite documentation](https://docs.openrewrite.org) —— 配方编写
- [Grit.io](https://www.grit.io) —— 另一个 codemod DSL
- [OpenAI sandboxed migration cookbook](https://developers.openai.com/cookbook/examples/agents_sdk/sandboxed-code-migration/sandboxed_code_migration_agent) —— Agents SDK 参考
- [Google App Engine Py2 to Py3 migrator](https://cloud.google.com/appengine) —— 另一个迁移基准
- [libcst](https://github.com/Instagram/LibCST) —— Python 确定性底座
- [Daytona sandboxes](https://daytona.io) —— 按分支沙箱参考
