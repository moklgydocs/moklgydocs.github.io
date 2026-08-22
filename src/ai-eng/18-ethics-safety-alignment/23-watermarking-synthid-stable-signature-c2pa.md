# 水印:SynthID、Stable Signature、C2PA

> 三项技术构成了 2026 年 AI 生成内容的溯源格局。SynthID(Google DeepMind)——2023 年 8 月推出图像水印,2024 年 5 月扩展到文本 + 视频(Gemini + Veo),2024 年 10 月通过 Responsible GenAI Toolkit 开源文本水印,2025 年 11 月随 Gemini 3 Pro 推出统一多媒体检测器。文本水印以难以察觉的方式调整下一 token 采样概率;图像/视频水印能挺过压缩、裁剪、滤镜和帧率变化。Stable Signature(Fernandez 等,ICCV 2023,arXiv:2303.15435)——微调潜扩散解码器,让每个输出都携带一条固定消息;裁剪到 10% 内容的生成图像,在 FPR<1e-6 下检出率仍超 90%。后续工作《Stable Signature is Unstable》(arXiv:2405.07145,2024 年 5 月)——微调即可移除水印且不影响画质。C2PA——加密签名、防篡改的元数据标准(C2PA 2.2 Explainer 2025)。水印与 C2PA 互补:元数据可被剥离但溯源信息丰富;水印挺过转码但携带信息少。

**类型:** 动手构建
**编程语言:** Python(标准库,token 水印嵌入 + 检测)
**前置要求:** 第 10 阶段 · 04(采样)、第 01 阶段 · 09(信息论)
**预计耗时:** 约 75 分钟

## 学习目标

- 描述 token 级水印(SynthID-text 风格)及其可检测的机制。
- 描述 Stable Signature 和 2024 年攻破它的移除攻击。
- 陈述 C2PA 的角色,以及它为什么与水印互补。
- 描述关键局限:模型特定信号、改写下不鲁棒、保义攻击(arXiv:2508.20228)。

## 问题

2023–2024 年,深伪和 AI 生成内容大规模进入政治与消费场景。水印是被提出的技术溯源信号:生成时打标,事后检测。2025 年的证据是:没有任何水印无条件鲁棒,但与 C2PA 元数据分层组合,能给出可用的溯源故事。

## 概念

### 文本水印(SynthID-text 风格)

Kirchenbauer 等人 2023 的机制,由 Google 产品化:

1. 每个解码步,对前 K 个 token 做哈希,产生词表的一个伪随机划分:"绿"集与"红"集。
2. 采样时给绿集 logits 加 δ,偏向绿集。
3. 生成文本中的绿 token 多于随机水平。

检测:对每个前缀重新哈希,数生成文本中的绿 token,算 z 分数。带水印文本 z > 0,人类文本 z ≈ 0。

性质:
- 读者不可察觉(δ 足够小,质量损失轻微)。
- 有词表划分函数即可检测。
- 对改写不鲁棒——重写文本即摧毁信号。

SynthID-text 于 2024 年 10 月通过 Google Responsible GenAI Toolkit 开源。

### Stable Signature(图像)

Fernandez 等人 ICCV 2023。微调潜扩散解码器,使每张生成图像在潜表征中嵌入一条固定二值消息。检测由神经解码器从潜表征解出。裁剪到 10% 内容的图像,在 FPR<1e-6 下检出率超 90%。

2024 年 5 月《Stable Signature is Unstable》(arXiv:2405.07145):微调解码器即可在保住画质的同时移除水印。生成后对抗微调很便宜;水印的对抗鲁棒性有限。

### SynthID 统一检测器(2025 年 11 月)

随 Gemini 3 Pro 发布:一个多媒体检测器,在同一 API 中读取文本、图像、音频、视频中的 SynthID 信号。统一了 Google 的溯源技术栈。

### C2PA

内容溯源与真实性联盟(Coalition for Content Provenance and Authenticity)。加密签名、防篡改的元数据标准,C2PA 2.2 Explainer(2025)。一份 C2PA 清单记录由创建者密钥签名的溯源声明(谁创建、何时、经过什么变换)。

与水印互补:
- 元数据可被剥离;水印(不那么容易)。
- 元数据信息丰富(完整溯源链);水印只带几个比特。
- C2PA 依赖平台采纳;水印自动嵌入。

Google 在搜索、广告和"关于此图片"中同时集成了两者。

### 局限

- **模型特定。** SynthID 标记的是启用了 SynthID 的模型的生成。未启用模型的生成没有水印,所以"无 SynthID 信号"不是真实性的证明。
- **改写。** 文本水印挺不过保义改写。
- **变换攻击。** arXiv:2508.20228(2025)展示了同时摧毁文本水印和许多图像水印的保义攻击。
- **微调移除。** 如《Stable Signature is Unstable》所示,生成后微调可移除嵌入水印。

### 欧盟 AI 法案第 50 条

AI 生成内容标注的透明度准则(2025 年 12 月一稿、2026 年 3 月二稿,据[欧盟委员会状态页](https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content)预计 2026 年 6 月定稿)。截至 2026 年 4 月该准则仍是草案,时间线可能变动。它是要求技术层的监管层:深伪必须标注。

### 本课在第 18 阶段中的位置

第 22–23 课讲模型向外发出什么(隐私数据、溯源信号);第 27 课讲训练数据治理;第 24 课是要求这些技术措施的监管框架。

```figure
an-watermark-greenlist
```

## 投入使用

`code/main.py` 搭一个玩具文本水印。token 是整数 0..N-1;带水印采样偏向哈希定义的绿集。检测器计算绿 token 的 z 分数。你可以观察 1000 token 生成的检测、看改写摧毁信号、测量人类文本上的误报率。

## 交付

本课产出 `outputs/skill-provenance-audit.md`。给定带溯源宣称的内容部署,它审计:水印机制(若有)、C2PA 签名链(若有)、各自的对抗鲁棒性,以及按模态的覆盖。

## 练习

1. 运行 `code/main.py`。报告 1000 token 带水印生成与人类文本的 z 分数。指出 95% 置信阈值下的误报率。

2. 实现一个把 30% token 换成同义词的改写攻击。重测 z 分数。

3. 读 Kirchenbauer 等人 2023 第 6 节(鲁棒性)。为什么文本水印败给改写,而图像水印挺过裁剪?

4. 设计一个使用 SynthID-text + C2PA 元数据的部署。描述消费者看到的溯源链,指出每个组件的一种失效模式。

5. 2024 年《Stable Signature is Unstable》表明微调可移除图像水印。设计一个限制该攻击的部署控制——例如要求微调检查点带签名发布。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|-----------------|------------------------|
| SynthID | "Google 的水印" | 跨模态溯源信号;文本、图像、音频、视频 |
| token 水印 | "Kirchenbauer 式" | 偏置采样文本水印,经绿 token z 分数检测 |
| Stable Signature | "图像水印" | 微调解码器的水印;ICCV 2023 |
| C2PA | "元数据标准" | 加密签名、防篡改的溯源元数据 |
| 改写鲁棒性 | "换说法会不会破" | 文本水印性质;目前有限 |
| 微调移除 | "对抗去水印" | 经解码器微调移除图像水印的攻击 |
| 跨模态检测器 | "统一 SynthID" | 2025 年 11 月跨模态统一 API |

## 延伸阅读

- [Kirchenbauer et al. — A Watermark for Large Language Models (ICML 2023, arXiv:2301.10226)](https://arxiv.org/abs/2301.10226) —— token 水印机制
- [Fernandez et al. — Stable Signature (ICCV 2023, arXiv:2303.15435)](https://arxiv.org/abs/2303.15435) —— 图像水印论文
- ["Stable Signature is Unstable" (arXiv:2405.07145)](https://arxiv.org/abs/2405.07145) —— 移除攻击
- [Google DeepMind — SynthID](https://deepmind.google/models/synthid/) —— 跨模态水印
- [C2PA 2.2 Explainer (2025)](https://c2pa.org/specifications/specifications/2.2/explainer/Explainer.html) —— 元数据标准
