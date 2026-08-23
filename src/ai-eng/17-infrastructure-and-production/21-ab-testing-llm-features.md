# LLM 功能的 A/B 测试 —— GrowthBook、Statsig 与"凭感觉"问题

> 传统 A/B 测试不是为不确定性 LLM 设计的。关键区分:评测(evals)回答"模型能不能干活",A/B 测试回答"用户买不买单"。两者都不可少;凭感觉发布功能的时代结束了。2026 年该测什么:提示词工程(措辞)、模型选择(GPT-4 vs GPT-3.5 vs 开源;准确率 vs 成本 vs 延迟)、生成参数(temperature、top-p)。真实案例:某聊天机器人奖励模型变体带来 +70% 会话长度、+30% 留存;Nextdoor 的 AI 主题行实验在奖励函数改进后带来 +1% CTR;Khan Academy 的 Khanmigo 在延迟与数学准确率的轴上迭代。平台格局:**Statsig**(2025 年 9 月被 OpenAI 以 11 亿美元收购)——序贯检验、CUPED、全家桶。**GrowthBook** —— 开源、数仓原生,贝叶斯 + 频率派 + 序贯三套引擎,CUPED、SRM 检查、Benjamini-Hochberg + Bonferroni 校正。选型看你偏好数仓 SQL,以及你的组织在不在意"被 OpenAI 收购"这件事。

**类型:** 学习
**编程语言:** Python(标准库,玩具级序贯检验模拟器)
**前置要求:** 第 17 阶段 · 13(可观测性)、第 17 阶段 · 20(渐进式部署)
**预计耗时:** 约 60 分钟

## 学习目标

- 区分评测("模型能不能干活")与 A/B 测试("用户买不买单")。
- 列举三个可测轴(提示词、模型、参数),为每个选对指标。
- 解释 CUPED、序贯检验、Benjamini-Hochberg 多重比较校正。
- 按数仓 SQL 偏好和公司收购立场,在 Statsig 与 GrowthBook 之间做选择。

## 问题

你手工调了一版系统提示词,感觉更好了,于是上线。转化率变化全是噪声,你怪指标。或者你上了新模型,转化率纹丝不动——是模型退化了,还是变化小到测不出来?你不知道,因为你没做 A/B 就发了。

评测回答的是模型在标注集上能不能完成任务,不回答用户是否更喜欢这个输出。只有受控的线上实验能回答后者——而且前提是实验功效足够、控制了不确定性、校正了多重比较。

## 概念

### 评测 vs A/B 测试

**评测** —— 离线、标注集、评审(评分细则、LLM 评审或人工)。回答:"在这个固定分布上,输出是否正确/有用/安全?"

**A/B 测试** —— 线上、真实用户、随机分组。回答:"新变体能不能撬动那个要紧的用户级指标?"

两者都要有。评测在曝光前抓回退;A/B 在曝光后确认产品影响。

### 测什么

1. **提示词工程** —— 措辞、系统提示词结构、示例。指标:任务成功率、用户留存、单请求成本。
2. **模型选择** —— GPT-4 vs GPT-3.5-Turbo vs 开源 Llama。指标:准确率(任务)+ 单请求成本 + 延迟 P99。多目标。
3. **生成参数** —— temperature、top-p、max_tokens。指标:按任务定(输出多样性 vs 确定性)。

### CUPED —— 方差缩减

Controlled-experiments Using Pre-Experiment Data(用实验前数据做受控实验)。先回归掉实验前期的方差,再对比实验期。典型方差缩减:30-70%。等效样本量白拿。

Statsig 和 GrowthBook 都实现了。

### 序贯检验

经典 A/B 假设样本量固定。序贯检验("边看边判")在反复偷看下控制假阳性率。恒有效序贯程序(mSPRT、Howard 置信序列)让你在赢家明确时提前收工。

### 多重比较校正

同时跑 20 个 95% 置信度的 A/B 测试,平均白捡一个假阳性。Bonferroni 校正把每个检验的 α 收紧;Benjamini-Hochberg 控制错误发现率(FDR)。GrowthBook 两个都实现了。

### SRM —— 样本比例失配

分组哈希把用户随机分到各变体。50/50 的切分实际来了 47/53,一定有东西坏了——SRM 检查会标出来。两个平台都实现了。

### Statsig vs GrowthBook

**Statsig**:
- 2025 年 9 月被 OpenAI 以 11 亿美元收购。托管 SaaS。
- 序贯检验、CUPED、留出人群。
- 全家桶:功能开关 + 实验 + 可观测性。
- 适合:本来就想要打包产品、不在意 OpenAI 控股的团队。

**GrowthBook**:
- 开源(MIT);数仓原生(直接读 Snowflake/BigQuery/Redshift)。
- 多引擎:贝叶斯、频率派、序贯。
- CUPED、SRM、Bonferroni、BH 校正。
- 自托管或托管云。
- 适合:数仓 SQL 团队,数据团队掌控指标层,想要开源。

### 不确定性让功效计算更复杂

同一提示词产出有波动。传统功效计算假设独立同分布。有 LLM 不确定性,有效样本量低于名义值。所需样本量乘 1.3-1.5 倍做安全边际。

### 真实案例结果

- 聊天机器人奖励模型变体:+70% 会话长度,+30% 留存。
- Nextdoor 主题行:奖励函数改进后 +1% CTR。
- Khan Academy Khanmigo:在延迟与数学准确率之间迭代权衡。

### 反模式:凭感觉发布

每个资深工程师都能说出一个"感觉更好"就上、没做 A/B 的功能。其中多数悄悄回退了产品指标,团队几个月都没察觉。A/B 就是那个强制纪律。

### 该记住的数字

- Statsig 被 OpenAI 收购:11 亿美元,2025 年 9 月。
- GrowthBook:MIT 开源;贝叶斯 + 频率派 + 序贯。
- CUPED 方差缩减:30-70%。
- LLM 不确定性 → 样本量加 30-50% 缓冲。

```figure
mx-sequential-test
```

## 投入使用

`code/main.py` 模拟固定边界与序贯边界的 A/B 测试。展示序贯如何让你提前收工。

## 交付

本课产出 `outputs/skill-ab-plan.md`。给定功能变更、负载和基线,选出平台、门禁和样本量。

## 练习

1. 运行 `code/main.py`。基线转化 3%、预期提升 5%,达到 80% 功效需要多大样本量?
2. 为一家医疗合规、要求本地部署的客户选 Statsig 或 GrowthBook。
3. 设计一个对比 GPT-4 vs GPT-3.5 的 A/B,目标是单工单解决成本。主指标、护栏指标、次要指标各是什么?
4. 金丝雀全过,但 A/B 显示转化 -1.2%。发不发?写出升级决策标准。
5. 对一个"实验前方差占实验后 60%"的场景应用 CUPED。算等效样本量提升。

## 关键术语

| 术语 | 别人嘴里的说法 | 实际含义 |
|------|----------------|----------|
| 评测 | "离线测试" | 标注集上的模型能力评估 |
| A/B 测试 | "实验" | 真实用户上的在线随机对比 |
| CUPED | "方差缩减" | 用实验前期回归降方差 |
| 序贯检验 | "可偷看的检验" | 允许提前停止的恒有效程序 |
| 多重比较 | "族错误" | 同时跑多个测试推高假阳性 |
| Bonferroni | "严校正" | α 除以测试个数 |
| Benjamini-Hochberg | "BH FDR" | 错误发现率控制,较不保守 |
| SRM | "切分坏了" | 样本比例失配;分组 bug |
| Statsig | "OpenAI 家的" | 商业全家桶,2025 年被收购 |
| GrowthBook | "开源那个" | MIT 数仓原生平台 |
| mSPRT | "序贯概率比检验" | 经典序贯程序 |

## 延伸阅读

- [GrowthBook — How to A/B Test AI](https://blog.growthbook.io/how-to-a-b-test-ai-a-practical-guide/)
- [Statsig — Beyond Prompts: Data-Driven LLM Optimization](https://www.statsig.com/blog/llm-optimization-online-experimentation)
- [Statsig vs GrowthBook comparison](https://www.statsig.com/perspectives/ab-testing-feature-flags-comparison-tools)
- [Deng et al. — CUPED](https://www.exp-platform.com/Documents/2013-02-CUPED-ImprovingSensitivityOfControlledExperiments.pdf)
- [Howard — Confidence Sequences](https://arxiv.org/abs/1810.08240)
