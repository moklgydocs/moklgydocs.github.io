# 红队测试:PAIR 与自动化攻击

> Chao、Robey、Dobriban、Hassani、Pappas、Wong(NeurIPS 2023,arXiv:2310.08419)。PAIR——提示自动迭代精炼(Prompt Automatic Iterative Refinement)——是自动化黑盒越狱的范式。一个带红队系统提示的攻击者 LLM,迭代地为目标 LLM 提出越狱提示,并把历次尝试与响应累积在自己的聊天历史中作为上下文内反馈。PAIR 通常在 20 次查询内成功,比 GCG(Zou 等人的 token 级梯度搜索)高效几个数量级,且不需要白盒访问。PAIR 如今是 JailbreakBench(arXiv:2404.01318)和 HarmBench 中的标准基线,与 GCG、AutoDAN、TAP、说服性对抗提示(PAP)并列。

**类型:** 动手构建
**编程语言:** Python(标准库,对玩具目标的模拟 PAIR 循环)
**前置要求:** 第 18 阶段 · 01(指令遵循)、第 14 阶段(智能体工程)
**预计耗时:** 约 75 分钟

## 学习目标

- 描述 PAIR 算法:攻击者系统提示、迭代精炼、上下文内反馈。
- 解释为什么目标为黑盒时,PAIR 严格优于 GCG。
- 说出另外四种自动化攻击基线(GCG、AutoDAN、TAP、PAP)及各自的一个区别性特征。
- 描述 JailbreakBench 与 HarmBench 的评估协议,以及各自语境下"攻击成功率"的含义。

## 问题

红队测试过去是手工活:少数专家测试员构造对抗提示,记录哪些有效。这不可扩展——攻击成功率需要统计样本,而目标模型每发一版都在变。PAIR 把红队测试操作化为一个以黑盒模型为目标的优化问题。

## 概念

### PAIR 算法

输入:
- 目标 LLM T(被攻击的模型)。
- 裁判 LLM J(给响应是否构成越狱打分)。
- 攻击者 LLM A(红队优化器)。
- 目标字符串 G:"用 [有害指令] 回应"。
- 预算 K(通常 20 次查询)。

循环,k 从 1 到 K:
1. 用目标 G 和迄今的 (提示, 响应) 历史提示 A。
2. A 产出新提示 p_k。
3. 把 p_k 提交给 T;收到响应 r_k。
4. J 按目标给 (p_k, r_k) 打分。
5. 分数 ≥ 阈值,停止——找到越狱。
6. 否则,把 (p_k, r_k) 追加进 A 的历史;继续。

实证结果(NeurIPS 2023):对 GPT-3.5-turbo、Llama-2-7B-chat 的攻击成功率超过 50%;平均成功查询数在 10–20 区间。

### 为什么 PAIR 高效

GCG(Zou 等,2023)用梯度搜索对抗 token 后缀;需要白盒访问,产出的后缀不可读。PAIR 是黑盒的,产出可跨模型迁移的自然语言攻击。PAIR 的上下文内反馈让攻击者能从每次拒绝中学习;GCG 没有等价物(每次新的 token 更新都得重新发现此前的进展)。

### 相关自动化攻击

- **GCG(Zou 等,2023,arXiv:2307.15043)。** 对对抗后缀做 token 级梯度搜索。白盒、可迁移、产出不可读字符串。
- **AutoDAN(Liu 等,2023)。** 在层级化目标引导下对提示做进化搜索。
- **TAP(Mehrotra 等,2024)。** 带剪枝的攻击树——分叉多条 PAIR 式滚动。
- **PAP(Zeng 等,2024)。** 说服性对抗提示——把人类说服技巧编码为提示模板。

### JailbreakBench 与 HarmBench

两者(2024)把评估标准化:

- JailbreakBench(arXiv:2404.01318)。横跨 10 个 OpenAI 政策类别的 100 种有害行为。攻击成功率(ASR)为主要指标。需要裁判(GPT-4-turbo、Llama Guard 或 StrongREJECT)。
- HarmBench(Mazeika 等,2024)。横跨 7 个类别的 510 种行为,带语义与功能性伤害测试。比较 18 种攻击对 33 个模型。

ASR 通常在固定查询预算下报告。比较攻击必须匹配预算;200 次查询下 90% 的 ASR 与 20 次查询下 85% 的 ASR 不可比。

### 对 2026 年部署的意义

如今每一家前沿实验室在发布前都会对生产模型跑 PAIR 和 TAP。ASR 轨迹出现在模型卡(第 26 课)和安全论证附录(第 18 课)里。这种攻击并不稀奇——它已是标准基础设施。

### 本课在第 18 阶段中的位置

第 12 课是自动化攻击的基础。第 13 课(多样本越狱)是互补的长度利用;第 14 课(ASCII 艺术 / 视觉)是编码攻击;第 15 课(间接提示注入)是 2026 年的生产攻击面;第 16 课讲对应的防御工具(Llama Guard、Garak、PyRIT)。

```figure
al-pair-loop
```

## 投入使用

`code/main.py` 搭一个玩具 PAIR 循环。目标是一个模拟分类器,拒绝"明显的"有害提示(关键词过滤);攻击者是基于规则的精炼器,尝试改写、角色扮演框定和编码;裁判给响应打分。你能看到攻击者约 5–15 次迭代内攻破关键词过滤器,并败给语义过滤器。

## 交付

本课产出 `outputs/skill-attack-audit.md`。给定一份红队评估报告,它审计:跑了哪些攻击(PAIR、GCG、TAP、AutoDAN、PAP),各用什么预算,用哪个裁判,在哪套有害行为集上(JailbreakBench、HarmBench、内部)。

## 练习

1. 运行 `code/main.py`。测量三种内置攻击策略的平均成功查询数。解释每种策略利用的是目标防御的哪个假设。

2. 实现第四种攻击策略(例如翻译成另一种语言、base64 编码)。报告它对关键词过滤目标和语义过滤目标的新平均成功查询数。

3. 读 Chao 等人 2023 图 5(PAIR vs GCG 对比)。描述两个尽管 PAIR 更高效、却仍更适合 GCG 的场景。

4. JailbreakBench 在固定目标集上报告 ASR。设计一个测量攻击多样性(成功提示的方差)的补充指标。解释多样性对防御评估为什么重要。

5. TAP(Mehrotra 2024)用分叉 + 剪枝扩展 PAIR。为 `code/main.py` 草拟一个 TAP 式扩展,并描述计算成本与成功率之间的权衡。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|-----------------|------------------------|
| PAIR | "自动化越狱" | 提示自动迭代精炼;攻击者 LLM + 裁判 LLM 循环 |
| GCG | "梯度越狱" | 白盒 token 级梯度搜索对抗后缀 |
| 攻击成功率(ASR) | "k 次查询的越狱率" | 主要指标;报告时必须带查询预算与裁判身份 |
| 裁判 LLM | "打分器" | 判定响应是否满足有害目标的 LLM |
| JailbreakBench | "那个评估" | 带类别标签的标准化有害行为集 |
| HarmBench | "更大的基准" | 510 种行为,功能性 + 语义伤害测试 |
| TAP | "攻击树" | 带分叉 + 剪枝的 PAIR;算力更高,ASR 更好 |

## 延伸阅读

- [Chao et al. — Jailbreaking Black Box LLMs in Twenty Queries (arXiv:2310.08419)](https://arxiv.org/abs/2310.08419) —— PAIR 论文,NeurIPS 2023
- [Zou et al. — Universal and Transferable Adversarial Attacks on Aligned LLMs (arXiv:2307.15043)](https://arxiv.org/abs/2307.15043) —— GCG 论文
- [Chao et al. — JailbreakBench (arXiv:2404.01318)](https://arxiv.org/abs/2404.01318) —— 标准化评估
- [Mazeika et al. — HarmBench (ICML 2024)](https://arxiv.org/abs/2402.04249) —— 更宽的评估
