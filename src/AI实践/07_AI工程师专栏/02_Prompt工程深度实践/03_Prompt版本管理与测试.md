---
title: Prompt 版本管理与 A/B 测试
icon: fa6-solid:flask
order: 3
category:
  - AI工程师
  - Prompt工程
  - A/B测试
---

# Prompt 版本管理与 A/B 测试

## 为什么需要版本管理

在生产环境中，Prompt 是代码的一部分。和代码一样，它需要：

1. **版本追踪**：知道每次改了什么，为什么改
2. **回滚能力**：新版本效果差时能快速回退
3. **A/B 测试**：对比不同版本的效果
4. **协作管理**：多人修改同一 Prompt 时不冲突

## Prompt 版本管理方案

### 方案 1：文件 + Git（最简单）

```
prompts/
  code_review/
    v1_initial.txt
    v2_add_severity.txt
    v3_add_fix.txt
    current.txt -> v3_add_fix.txt  # 软链接指向当前版本
```

### 方案 2：数据库存储（推荐生产使用）

```python
from datetime import datetime
from pydantic import BaseModel

class PromptVersion(BaseModel):
    id: str
    prompt_name: str
    version: int
    content: str
    description: str  # 这次改了什么
    created_at: datetime
    created_by: str
    is_active: bool = False
    metrics: dict | None = None  # 效果指标

class PromptManager:
    def __init__(self, db):
        self.db = db

    def create_version(self, name: str, content: str, description: str, author: str) -> PromptVersion:
        current = self.get_active(name)
        version_num = (current.version + 1) if current else 1
        pv = PromptVersion(
            id=f"{name}_v{version_num}",
            prompt_name=name,
            version=version_num,
            content=content,
            description=description,
            created_at=datetime.now(),
            created_by=author,
        )
        self.db.insert(pv)
        return pv

    def get_active(self, name: str) -> PromptVersion | None:
        return self.db.query_one("SELECT * FROM prompts WHERE prompt_name = ? AND is_active = TRUE", name)

    def activate(self, prompt_id: str):
        # 先取消同名的所有活跃版本
        self.db.execute("UPDATE prompts SET is_active = FALSE WHERE prompt_name = (SELECT prompt_name FROM prompts WHERE id = ?)", prompt_id)
        self.db.execute("UPDATE prompts SET is_active = TRUE WHERE id = ?", prompt_id)

    def rollback(self, name: str, target_version: int):
        self.activate(f"{name}_v{target_version}")
```

### 生产 Prompt 管理工具

上文的 `PromptManager` 是教学示例。生产环境推荐使用专业工具：

| 工具 | 特点 | 适用场景 |
|------|------|---------|
| **LangFuse** | 开源、全链路追踪、Prompt 版本管理、A/B 测试 | 中小团队、需要可观测性 |
| **PromptLayer** | Prompt 版本管理、A/B 测试、成本追踪 | 纯 Prompt 管理需求 |
| **Promptflow** (Azure) | 可视化 Prompt 编排、评估流水线 | Azure 生态团队 |
| **Helicone** | 开源、缓存、监控、Prompt 管理 | 成本敏感团队 |

#### LangFuse 集成示例

```python
from langfuse import Langfuse

langfuse = Langfuse()

# 创建 Prompt 版本
prompt = langfuse.create_prompt(
    name="rag_system_prompt",
    prompt="你是一个专业的知识库助手...",
    config={"temperature": 0.1, "max_tokens": 2000},
)

# A/B 测试：指定版本
prompt_v1 = langfuse.get_prompt("rag_system_prompt", version=1)
prompt_v2 = langfuse.get_prompt("rag_system_prompt", version=2)

# 在 LLM 调用中追踪
generation = langfuse.generate(
    name="rag_query",
    prompt=prompt_v2,
    input={"query": user_query},
    output=response,
)
```

## A/B 测试框架

```python
import hashlib
import random

class PromptABTest:
    def __init__(self, prompt_manager: PromptManager):
        self.pm = prompt_manager

    def get_prompt(self, name: str, user_id: str) -> str:
        """根据用户 ID 决定使用哪个版本"""
        # 基于用户 ID 的确定性分配（同一用户始终看到同一版本）
        bucket = int(hashlib.md5(user_id.encode()).hexdigest(), 16) % 100

        experiment = self._get_experiment(name)
        if experiment and experiment.get("enabled"):
            variants = experiment["variants"]
            # 按 50/50 分配
            variant_key = "A" if bucket < 50 else "B"
            version_id = variants[variant_key]
            return self.pm.get_version(version_id).content

        return self.pm.get_active(name).content

    def record_result(self, name: str, user_id: str, variant: str, score: float):
        """记录评估结果"""
        self._save_metric(name, user_id, variant, score)

    def get_results(self, name: str) -> dict:
        """获取 A/B 测试结果"""
        metrics = self._load_metrics(name)
        variant_a = [m for m in metrics if m["variant"] == "A"]
        variant_b = [m for m in metrics if m["variant"] == "B"]
        return {
            "A": {"count": len(variant_a), "avg_score": sum(m["score"] for m in variant_a) / max(len(variant_a), 1)},
            "B": {"count": len(variant_b), "avg_score": sum(m["score"] for m in variant_b) / max(len(variant_b), 1)},
        }
```

### 统计显著性检验

A/B 测试只比较均值是不够的 — 差异可能来自随机波动而非真实效果。
必须进行统计检验才能确认结果可信。

```python
import scipy.stats as stats
import numpy as np

class ABTestAnalyzer:
    """A/B 测试统计分析器

    核心问题：观察到的差异是真实效果还是随机波动？
    统计检验回答这个问题。
    """

    @staticmethod
    def proportion_test(successes_a: int, total_a: int,
                         successes_b: int, total_b: int,
                         alpha: float = 0.05) -> dict:
        """比例检验：适用于准确率、点击率等二值指标

        例：Prompt A 准确率 85/100 vs Prompt B 92/100
        """
        p_a = successes_a / total_a
        p_b = successes_b / total_b
        p_pool = (successes_a + successes_b) / (total_a + total_b)

        se = np.sqrt(p_pool * (1 - p_pool) * (1/total_a + 1/total_b))
        z_score = (p_b - p_a) / se
        p_value = 1 - stats.norm.cdf(abs(z_score))

        # 置信区间
        se_diff = np.sqrt(p_a*(1-p_a)/total_a + p_b*(1-p_b)/total_b)
        ci_lower = (p_b - p_a) - 1.96 * se_diff
        ci_upper = (p_b - p_a) + 1.96 * se_diff

        return {
            "metric_a": f"{p_a:.3f}",
            "metric_b": f"{p_b:.3f}",
            "lift": f"{(p_b - p_a) / p_a * 100:.1f}%",
            "z_score": round(z_score, 3),
            "p_value": round(p_value, 4),
            "significant": p_value < alpha,
            "confidence_interval": [round(ci_lower, 4), round(ci_upper, 4)],
            "recommendation": "B 显著优于 A" if p_value < alpha and p_b > p_a
                             else "无显著差异，继续收集数据" if p_value >= alpha
                             else "A 显著优于 B",
        }

    @staticmethod
    def continuous_test(scores_a: list[float], scores_b: list[float],
                        alpha: float = 0.05) -> dict:
        """连续值检验：适用于评分、延迟等连续指标

        使用 Welch's t-test（不假设等方差）
        """
        t_stat, p_value = stats.ttest_ind(scores_b, scores_a, equal_var=False)

        mean_a, mean_b = np.mean(scores_a), np.mean(scores_b)
        std_a, std_b = np.std(scores_a, ddof=1), np.std(scores_b, ddof=1)

        # 效应量（Cohen's d）
        pooled_std = np.sqrt((std_a**2 + std_b**2) / 2)
        cohens_d = (mean_b - mean_a) / pooled_std

        return {
            "mean_a": round(mean_a, 3),
            "mean_b": round(mean_b, 3),
            "lift": f"{(mean_b - mean_a) / mean_a * 100:.1f}%",
            "t_statistic": round(t_stat, 3),
            "p_value": round(p_value, 4),
            "significant": p_value < alpha,
            "effect_size": round(abs(cohens_d), 3),
            "effect_interpretation": "小" if abs(cohens_d) < 0.2
                                     else "中" if abs(cohens_d) < 0.8
                                     else "大",
            "recommendation": "B 显著优于 A" if p_value < alpha and mean_b > mean_a
                             else "无显著差异" if p_value >= alpha
                             else "A 显著优于 B",
        }

    @staticmethod
    def required_sample_size(baseline_rate: float, mde: float,
                              alpha: float = 0.05, power: float = 0.8) -> int:
        """计算所需样本量

        Args:
            baseline_rate: 基线指标（如当前准确率 0.85）
            mde: 最小可检测效应（如期望提升 5% → mde=0.05）
            alpha: 显著性水平（通常 0.05）
            power: 统计功效（通常 0.8，即 80% 概率检测到真实效果）
        """
        z_alpha = stats.norm.ppf(1 - alpha / 2)
        z_beta = stats.norm.ppf(power)

        p1 = baseline_rate
        p2 = baseline_rate + mde
        p_avg = (p1 + p2) / 2

        n = ((z_alpha * np.sqrt(2 * p_avg * (1 - p_avg)) +
              z_beta * np.sqrt(p1 * (1 - p1) + p2 * (1 - p2))) ** 2) / mde ** 2

        return int(np.ceil(n))
```

### 示例：判断测试结果是否可信

```python
# ❌ 错误做法：只看均值差异
# "Prompt B 准确率 92%，Prompt A 85%，B 更好！"
# → 可能只是 100 个样本中的随机波动

# ✅ 正确做法：统计检验
analyzer = ABTestAnalyzer()

# 比例检验示例
result = analyzer.proportion_test(
    successes_a=85, total_a=100,   # Prompt A: 85/100
    successes_b=92, total_b=100,    # Prompt B: 92/100
)
print(result)
# {"p_value": 0.073, "significant": False,
#  "recommendation": "无显著差异，继续收集数据"}

# 样本量计算：需要多少样本才能检测 5% 提升？
n = analyzer.required_sample_size(baseline_rate=0.85, mde=0.05)
print(f"每组需要 {n} 个样本")  # 每组约 363 个样本
```

### 常见陷阱

| 陷阱 | 描述 | 解决方案 |
|------|------|---------|
| 样本量不足 | 50 个样本就下结论 | 先计算所需样本量 |
| 多次比较 | 测试 10 个变体，1 个"显著" | Bonferroni 校正：α/k |
| 选择性停机 | 看到显著就停 | 预设样本量，到达后统一分析 |
| 新奇效应 | 新 Prompt 短期效果好 | 运行至少 1 周 |
| SRM | 两组样本量比例与预期不符 | 检查分桶逻辑 |

## 评估指标

| 指标 | 说明 | 采集方式 |
|------|------|----------|
| 准确率 | 输出符合预期的比例 | 人工标注 / LLM-as-Judge |
| 格式遵从率 | 输出格式符合要求的比例 | 自动校验 |
| 平均 Token 数 | 输出消耗的 Token 数 | API 响应 |
| 延迟 | 首 Token 延迟 + 总延迟 | 计时 |
| 用户满意度 | 用户反馈评分 | 前端埋点 |
| 幻觉率 | 输出中包含错误信息的比例 | 人工抽检 |

---

::: tip 实践建议
初期用文件 + Git 就够了，等 Prompt 版本超过 10 个或需要 A/B 测试时再迁移到数据库方案。
:::
