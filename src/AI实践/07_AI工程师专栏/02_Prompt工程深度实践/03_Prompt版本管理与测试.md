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
