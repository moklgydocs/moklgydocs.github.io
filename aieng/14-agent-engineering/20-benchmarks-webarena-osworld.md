# 基准:WebArena 与 OSWorld

> WebArena 在四个自托管应用上测网页智能体能力;OSWorld 在 Ubuntu、Windows、macOS 上测桌面智能体能力。发布时(2023–2024),两者都显示一流智能体与人类之间的巨大差距。差距在缩小,失败模式没变。

**类型:** 学习
**编程语言:** Python(标准库)
**前置要求:** 第 14 阶段 · 19(SWE-bench、GAIA)
**预计耗时:** 约 60 分钟

## 学习目标

- 描述 WebArena 的四个自托管应用,以及为什么基于执行的评估重要。
- 解释为什么 OSWorld 用真实 OS 截图而非无障碍 API。
- 说出 OSWorld 的两个主要失败模式:GUI grounding 与操作知识。
- 总结 OSWorld-G 和 OSWorld-Human 在基础基准之上加了什么。

## 问题

通用智能体会调工具。但它能驱动浏览器连点 20 下完成购物结算吗?能只用键盘鼠标配置一台 Linux 机器吗?这就是 WebArena 和 OSWorld 回答的问题。

## 概念

### WebArena(Zhou 等,ICLR 2024)

- 812 个长程任务,横跨四个自托管网页应用:购物网站、论坛、类 GitLab 开发工具、企业 CMS。
- 外加工具:地图、计算器、草稿板。
- 评估是基于执行的,走 gym API——订单下了吗?issue 关了吗?CMS 页面更新了吗?
- 发布时:最好的 GPT-4 智能体成功率 14.41%,人类 78.24%。

自托管这个框架很要紧——基准不 flaky,因为目标应用是钉死版本、可复现的。

### 扩展

- **VisualWebArena** —— 视觉落地的任务,成功取决于对图像的解读(截图是一等观测)。
- **TheAgentCompany**(2024 年 12 月)—— 加入终端 + 编程;更像真实的远程工作环境。

### OSWorld(Xie 等,NeurIPS 2024)

- 369 个真实计算机任务,横跨 Ubuntu、Windows、macOS。
- 对真实应用的自由键鼠控制。
- 1920×1080 截图作为观测。
- 发布时:最好模型 12.24%,人类 72.36%。

### 主要失败模式

1. **GUI grounding。** 像素 → 元素的映射。模型难以在 1920×1080 下可靠定位 UI 元素。
2. **操作知识。** 哪个菜单有那个设置、哪个快捷键、哪个偏好面板。人类多年积累的知识长尾。

### 后续工作

- **OSWorld-G** —— 564 样本的 grounding 套件 + Jedi 训练集。把 grounding 与规划拆开,分开测量。
- **OSWorld-Human** —— 人工策展的黄金动作轨迹。显示顶级智能体多用 1.4–2.7 倍的步数(轨迹效率差距)。

### 为什么这要紧

Claude computer use、OpenAI CUA、Gemini 2.5 Computer Use(第 21 课)全都在 WebArena 和 OSWorld 形状的负载上训练。基准是靶子,生产模型是交付的答案。

### 基准测试在哪里出错

- **只看截图的评估。** OSWorld 是截图驱动的;拿用 DOM 或无障碍 API 的智能体在 OSWorld 上评,就漏掉了 grounding 这个挑战。
- **忽视轨迹长度。** 只看成功率,漏掉了 OSWorld-Human 揭示的 1.4–2.7 倍步数低效。
- **自托管应用过时。** WebArena 的应用钉死特定版本;不做重新策展就升级,可比性就没了。

```figure
ae-agent-human-gap
```

## 动手构建

`code/main.py` 实现一个玩具网页智能体框架:

- 一个极简"购物应用"状态机:list_items、add_to_cart、checkout。
- 3 个任务的黄金轨迹。
- 一个尝试每个任务的脚本化智能体。
- 基于执行的评估器(状态检查)和轨迹效率指标(步数 vs 黄金轨迹)。

运行:

```
python3 code/main.py
```

输出:逐任务成功率和轨迹效率,与 OSWorld-Human 的方法一致。

## 投入使用

- **WebArena Verified** 自托管在内部集群,做持续评估。
- **OSWorld** 在 VM 集群上,给桌面智能体。
- **计算机操作智能体**(第 21 课)—— Claude、OpenAI CUA、Gemini——都在这类负载上训练。
- **你自己产品的流程** —— 为 top 20 任务录黄金轨迹,每周让智能体跑一遍。

## 交付

`outputs/skill-web-desktop-harness.md`:构建网页/桌面智能体框架,带基于执行的评估和轨迹效率指标。

## 练习

1. 给玩具框架扩展第二个应用(论坛)。写 3 个任务和黄金轨迹。
2. 加逐任务轨迹效率报告。在你的玩具上,智能体是黄金轨迹的 1 倍、2 倍还是 3 倍?
3. 实现一个"干扰"工具——黄金轨迹永远不用的那种。脚本化智能体会被诱惑吗?
4. 读 OSWorld-G。在你自己的评估里,怎么把 grounding 失败和规划失败分开?
5. 读 WebArena 的应用 README。升级某个钉死版本的应用会坏掉什么?

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| WebArena | "网页智能体基准" | 4 个自托管应用上 812 个任务;gym 式评估 |
| VisualWebArena | "视觉 WebArena" | 视觉落地的 WebArena;截图即观测 |
| OSWorld | "桌面智能体基准" | 真实 Ubuntu/Windows/macOS 上 369 个任务 |
| GUI grounding | "像素到元素映射" | 模型在 1920x1080 里定位 UI 元素 |
| 操作知识 | "OS know-how" | 哪个菜单、哪个快捷键、哪个偏好面板 |
| OSWorld-G | "grounding 套件" | 564 个纯 grounding 样本 + 训练集 |
| OSWorld-Human | "黄金轨迹" | 人工专家动作序列,用于测量效率 |
| 轨迹效率 | "超黄金几倍" | 智能体步数除以人类最少步数 |

## 延伸阅读

- [Zhou 等,《WebArena》(arXiv:2307.13854)](https://arxiv.org/abs/2307.13854) —— 四应用网页基准
- [Xie 等,《OSWorld》(arXiv:2404.07972)](https://arxiv.org/abs/2404.07972) —— 跨 OS 桌面基准
- [Anthropic,《介绍 computer use》](https://www.anthropic.com/news/3-5-models-and-computer-use) —— Claude 的基准塑形能力
- [OpenAI,《Computer-Using Agent》](https://openai.com/index/computer-using-agent/) —— OSWorld 与 WebArena 数字
