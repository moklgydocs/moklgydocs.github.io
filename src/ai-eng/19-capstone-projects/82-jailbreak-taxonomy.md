# 结课项目 82 —— 越狱分类法

> 没有分类法的安全防护框架就是抛硬币。先给攻击命名,再谈防御。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 18 阶段安全课程,第 19 阶段 Track A 第 25-29 课
**预计耗时:** 约 90 分钟

## 问题

部署时没有攻击模型的模型,等于没有在防任何具体的东西。运营读了一条 Twitter 帖子,认出一个把戏,写一条正则,上线,翻篇。下一个提示词是换述。正则没接住。一周后有人把同一个把戏包进 base64,运营再写第二条正则。到第三个月,系统攒了 40 条补丁规则,没有共享词汇,没有办法讨论攻击到底是什么,积压的增长速度超过打补丁的速度。

在这条 track 的任何检测器、分类器或规则引擎发挥作用之前,团队需要一种给攻击打标签的共享方式。不是因为标签能挡住攻击,而是因为标签把攻击流变成直方图。直方图变成覆盖图。覆盖图驱动下一个 sprint。第 83-87 课的框架把时间花在判断一个提示词到底是哪种攻击上——比如,是针对拒绝策略的 role-play 攻击,还是针对工具的 context-smuggling 攻击。没有分类法,这个判断无从做起。

本结课项目定义一个六类分类法:宽到足以覆盖野外见到的大多数攻击,窄到两个评审通常能对类别达成一致,具体到每个类别都有至少七个手工构建的 fixture。分类法是下游一切的载波。

## 概念

六个类别沿单一轴线切分:攻击滥用的是哪条信任边界?每个名字对应一条边界。

| 类别 | 被滥用的信任边界 |
|---|---|
| role-play | 助手的人设 |
| instruction-override | 系统提示词的权威 |
| context-smuggling | 用户内容与指令内容之间的缝隙 |
| multi-turn-ramp | 作为契约的对话历史 |
| encoding-trick | 违禁 token 的表面形式 |
| prefix-injection | 助手的下一 token 决策 |

role-play 攻击把助手重塑成另一个智能体("你是一个叫 QX 的无限制研究模型"),让挂在原人设上的拒绝规则不再触发。instruction-override 提示词说"忽略之前的指令",试图直接覆写系统提示词。context-smuggling 把指令藏在看起来像数据的东西里:粘贴的文档、工具结果、代码块。multi-turn-ramp 先用无害的回合把模型焐热,再一步一步把底线往下走,利用模型倾向于与对话保持一致的习性。编码把戏(base64、rot13、leet-speak、零宽字符插入)把违禁 token 藏起来,骗过朴素的关键词过滤器。prefix-injection 把提示词停在"Sure, here's how",让模型从既定答案继续,而不是拒绝。

```mermaid
flowchart TB
  P[prompt] --> C{which boundary}
  C -->|persona| RP[role-play]
  C -->|system prompt| IO[instruction-override]
  C -->|data vs instruction| CS[context-smuggling]
  C -->|history| MT[multi-turn-ramp]
  C -->|surface form| ET[encoding-trick]
  C -->|continuation| PI[prefix-injection]
  RP --> H[(histogram)]
  IO --> H
  CS --> H
  MT --> H
  ET --> H
  PI --> H
  H --> D[coverage chart]
```

每个 fixture 是一条记录,含 `id`、`category`、`subtype`、`prompt`、`target_behavior` 和 `severity`。分类法对象载入 fixture、按类别分组,并暴露 `match` API:给定候选提示词,返回最接近的 fixture 及其类别。匹配用字符 trigram 余弦:粗、快、零依赖。它不是检测器——检测器在第 83 课。这是标签生产者。

严重度按 1-5 级。1 级是针对无害目标的笨拙攻击("请假装成一个海盗")。5 级是一旦成功就会让已部署系统产出绝不可产出内容的攻击(危险活动的操作性细节)。大多数 fixture 落在 2-3 级,因为部署规模下的真实攻击偏向容易和偷懒的那种。严重度由 fixture 作者定。两个评审分歧超过一级,说明评分细则需要打磨。

```figure
cd-attack-taxonomy
```

## 动手构建

语料在 `code/fixtures.py` 里,是一个 Python 列表。`code/main.py` 里的分类法类载入它,校验每个类别至少有七个 fixture,暴露 `by_category`、`match` 和 `stats` 方法,并附一个可运行的演示,打印直方图。trigram 余弦用 `numpy` 从零实现。

校验环节检查四个不变量:每个 fixture 的 prompt 非空;schema 里每个类别都有覆盖;每个 severity 在 `1..5` 内;每个 fixture id 唯一。这里出问题就是硬退出,不是警告,因为 track 其余部分都依赖语料的内部一致性。

## 投入使用

在本课 `code/` 目录下运行 `python3 main.py`。演示打印逐类别 fixture 计数,用三个样本探测 `match`,并把 `taxonomy.json` 写到本课 outputs 目录。下游课程读 `taxonomy.json` 而不是 import 这个 Python 模块,所以语料是一个稳定工件。

## 交付

`outputs/skill-jailbreak-taxonomy.md` 记录了六个类别和评分细则。把它当作团队的共享词汇。第 87 课框架记录的每条发现都引用一个分类法 id。

## 练习

1. 为间接提示词注入加第七个类别(指令嵌在检索到的文档里,而不是用户回合里)。撰写十个 fixture,重跑校验器。
2. 用 token 编辑距离打分器替换 trigram 余弦,测量现有语料上 match 分配的变化。
3. 从你自己产品的日志(脱敏后)抽三十条 fixture,确认类别分布与团队直觉预期一致。

## 关键术语

| 术语 | 常见用法 | 精确含义 |
|---|---|---|
| 越狱 | 任何不安全的模型输出 | 产出违反既定策略之输出的提示词 |
| 分类法 | 一张类别清单 | 按滥用哪条信任边界对攻击做的划分 |
| fixture | 一个测试样例 | 带类别、严重度和目标行为的标注提示词 |
| 严重度 | 输出有多糟 | 攻击一旦成功的影响的 1-5 级排名 |
| match | 一次检测决定 | 按 trigram 余弦找最近 fixture,用于给新提示词归类别 |

## 延伸阅读

本课是入口。第 83-87 课直接建立在语料之上。
