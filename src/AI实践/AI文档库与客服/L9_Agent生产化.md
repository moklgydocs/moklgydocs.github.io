---
title: L9 · Agent 生产化（成本控制 + 可靠性）
icon: fa6-solid:shield-halved
order: 9
category:
  - AI工程实战
tag:
  - Circuit Breaker
  - 成本控制
  - Locust
  - 模型路由
  - 压测
---

# L9：Agent 生产化（成本控制 + 可靠性）

> **关卡目标**：系统上线前的最后一关。加入模型路由（简单问题用便宜模型）、Circuit Breaker（主模型宕机自动切换备用）、每用户 Token 配额、Event Sourcing 审计日志，以及 Locust 压测验证 100 并发成功率 > 95%。

---

## 为什么需要生产化

L8 的系统功能完整，但直面上线有三个缺陷：

| 问题 | 表现 | 后果 |
|------|------|------|
| 无成本控制 | 每次对话都调用最贵的模型 | 月费用失控，老板叫停 |
| 无可靠性保障 | 主模型 API 抖动 → 整体报错 | 用户体验差，SLA 无法保证 |
| 无可观测性 | 出问题不知道哪里慢、哪个用户消耗最多 | 运维盲飞 |

L9 用一个 `ProductionLLMClient` 包装器解决这三个问题，**后端 graph 节点和 subagent 代码零改动**。

---

## 核心设计：ProductionLLMClient

```
请求进入
    ↓
user_id quota check（配额检查）
    ↓
ModelRouter.route(messages)        ← 关键词路由，选择 cheap/expensive
    ↓
CircuitBreaker.call(primary_llm)   ← 失败 5 次后切换 OPEN 状态
    ↓ (OPEN 状态)
fallback_llm.call()                ← 直接调用备用模型，绕过 CB
    ↓
CostTracker.record(user_id, ...)   ← 记录用量，检测大 session
    ↓
EventLog.agent_step(...)           ← 结构化审计日志
```

接口与 `OpenAICompatibleClient` 完全相同（`complete`、`complete_with_tools`、`stream`），所有节点只需把 `llm` 替换成 `ProductionLLMClient` 实例。

---

## 模型路由：ModelRouter

```python
SIMPLE_KW = {"查订单", "订单号", "查库存", "查物流", "发通知", "工单状态"}
COMPLEX_KW = {"分析", "报告", "统计", "趋势", "对比", "同比", "环比"}

class ModelRouter:
    def route(self, messages: list[dict]) -> str:
        text = " ".join(
            m.get("content", "") for m in messages
            if m.get("role") in ("user", "system")
        )
        if any(kw in text for kw in COMPLEX_KW):
            return settings.l9_expensive_model
        if any(kw in text for kw in SIMPLE_KW):
            return settings.l9_cheap_model
        return settings.l9_cheap_model   # 默认用便宜模型
```

在本套环境中，`cheap_model` 和 `expensive_model` 可以是同一个模型（DeepSeek-V3），`fallback_model` 用 `Qwen2.5-7B-Instruct`（SiliconFlow）。生产时可把 `expensive_model` 指向更强的模型（如 Claude Opus）。

---

## 熔断器：CircuitBreaker

三态状态机，防止一直向不可用的模型发请求：

```
       调用失败 ≥ threshold
CLOSED ──────────────────→ OPEN
  ↑                          │
  │ 成功                      │ recovery_timeout 到期
  │                          ↓
  └──────────── HALF_OPEN ←──┘
                  │   失败 → 重回 OPEN
                  └─── 成功 → 回到 CLOSED
```

```python
class CircuitBreaker:
    def __init__(self, name: str, failure_threshold=5, recovery_timeout=30.0):
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.last_failure_time: float | None = None

    async def call(self, coro_factory: Callable[[], Coroutine]) -> Any:
        if self.state == CircuitState.OPEN:
            elapsed = time.monotonic() - self.last_failure_time
            if elapsed < self.recovery_timeout:
                raise CircuitOpenError(f"{self.name} 熔断中，请等待 {self.recovery_timeout - elapsed:.0f}s")
            self.state = CircuitState.HALF_OPEN

        try:
            result = await coro_factory()
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise
```

ProductionLLMClient 在捕获到 `CircuitOpenError` 时，直接调用 fallback 模型（fallback 不经过 CB，避免级联熔断）。

---

## 配额追踪：CostTracker

```python
class CostTracker:
    # 内存中的每日统计，按日期自动重置
    _daily: dict[str, DailyStats] = {}

    PRICING = {
        "deepseek-v3": {"input": 0.001, "output": 0.003},   # ¥/千token
        "qwen2.5-7b":  {"input": 0.0005, "output": 0.0015},
    }

    async def check_quota(self, user_id: str) -> tuple[bool, int]:
        stats = self._get_today(user_id)
        return stats.total_tokens < settings.l9_daily_token_quota, stats.total_tokens

    async def record(self, user_id: str, model: str,
                     prompt_t: int, completion_t: int) -> float:
        cost = self._calc_cost(model, prompt_t, completion_t)
        stats = self._get_today(user_id)
        stats.total_tokens += prompt_t + completion_t
        stats.total_cost_rmb += cost
        if stats.total_tokens > settings.l9_large_session_tokens:
            await event_log.alert("large_session", {...})
        return cost
```

配额超限 → API 返回 HTTP 429，body 包含已用量和重置时间（明天 00:00）。

---

## 审计日志：EventLog

使用 structlog 输出 **append-only JSON**，每行一条事件，可以直接被 ELK/Loki 消费：

```json
{"event": "session_start",  "session_id": "ma-xxx", "user_id": "u001", "message_preview": "帮我查..."，"ts": "2026-04-26T10:00:00"}
{"event": "agent_step",     "session_id": "ma-xxx", "node": "parallel_agents", "agent": "data_analyst", "tokens": 1240, "cost_rmb": 0.0037, "duration_ms": 842}
{"event": "session_end",    "session_id": "ma-xxx", "success": true, "total_tokens": 3200, "total_cost_rmb": 0.0091, "duration_ms": 3420}
{"event": "alert",          "alert_type": "daily_cost_exceeded", "detail": {"threshold": 10.0, "actual": 11.3}}
```

`check_alerts()` 在每次 `session_end` 后触发：
- 日成本 > `l9_daily_cost_alert_rmb`（默认 ¥10）→ `alert: daily_cost_exceeded`
- 当日成功率 < 90% → `alert: success_rate_low`

---

## config.py 新增字段

```python
# L9 参数，全部可通过 .env 覆盖
l9_cheap_model: str = "deepseek-ai/DeepSeek-V3"
l9_expensive_model: str = "deepseek-ai/DeepSeek-V3"
l9_fallback_model: str = "Qwen/Qwen2.5-7B-Instruct"
l9_fallback_base_url: str = "https://api.siliconflow.cn/v1"
l9_cb_failure_threshold: int = 5
l9_cb_recovery_timeout: float = 30.0
l9_daily_token_quota: int = 50_000
l9_daily_cost_alert_rmb: float = 10.0
l9_large_session_tokens: int = 8_000
```

---

## 压测：Locust

```python
# locustfile.py
class MultiAgentUser(HttpUser):
    wait_time = between(0.5, 2)

    @task(3)
    def query_order(self):
        with self.client.post(
            "/api/v1/prod/chat",
            json={"session_id": f"test-{self.user_count}", "message": "帮我查订单 2024-0312", "user_id": "u001"},
            stream=True, catch_response=True
        ) as resp:
            if resp.status_code == 200:
                # 读完 SSE 流
                for line in resp.iter_lines():
                    pass
                resp.success()
            else:
                resp.failure(f"HTTP {resp.status_code}")

    @task(2)
    def analytics_report(self):
        ...  # 调用数据分析类问题

    @task(1)
    def parallel_both(self):
        ...  # 触发并发两个子 Agent
```

运行命令：

```bash
locust -f locustfile.py --headless -u 100 -r 10 --run-time 60s \
       --host http://localhost:8007
```

目标：`Failure rate < 5%`，`P95 response time < 15s`（含 SSE 流读完）。

---

## 前端：新增生产客服 Tab

`App.tsx` 新增「生产客服」tab，**复用 `MultiAgentChat` 组件**，仅传入不同的 `apiPath`：

```tsx
<MultiAgentChat apiPath="/api/v1/prod/chat" userId={currentUserId} />
```

`MultiAgentChat` 用 `apiPath.includes("/prod/")` 区分是否为生产模式，切换存储 key 和空状态文案。

`vite.config.ts` 新增代理（必须排在通配 `/api` 之前）：

```typescript
"/api/v1/prod": { target: "http://localhost:8007", changeOrigin: true },
```

---

## 前端：代码高亮 + 代码分割

本关同期完成了 Markdown 渲染的代码高亮功能：

```bash
pnpm add rehype-highlight highlight.js
```

```tsx
// components/ui/markdown.tsx
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

<ReactMarkdown
  rehypePlugins={[[rehypeHighlight, { detect: false, ignoreMissing: true }]]}
  ...
>
```

- `detect: false`：不对无语言标签的代码块做自动识别（防止把普通文本识别成代码）
- `ignoreMissing: true`：遇到未知语言不报错
- hljs 主题背景设为 transparent，保留我们自己的 `bg-slate-900` 容器

代码块右上角自动显示语言标签（`Python`、`TypeScript`、`JSON` 等）：

```css
.md-code-lang {
  @apply absolute top-2 right-3 text-[10px] font-mono text-slate-400
         bg-slate-800 px-1.5 py-0.5 rounded select-none;
}
```

同时对 `vite.config.ts` 做代码分割：

```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        "highlight": ["highlight.js"],
        "markdown": ["react-markdown", "remark-gfm", "rehype-highlight"],
        "motion": ["framer-motion"],
      },
    },
  },
},
```

主 bundle 从 782KB 降至 310KB，highlight.js 按需加载。

---

## 健康检查接口

```
GET /health

{
  "status": "ok",
  "circuit_breakers": {
    "primary":  {"state": "CLOSED", "failure_count": 0},
    "fallback": {"state": "CLOSED", "failure_count": 0}
  },
  "daily_summary": {
    "total_cost_rmb": 0.37,
    "total_tokens": 124000,
    "success_rate": 0.97,
    "active_users": 12
  }
}
```

---

## 验收清单

```
[x] GET /health → 返回 circuit_breaker 状态 + 日成本摘要
[x] 简单查询 → ModelRouter 路由到 cheap_model（日志可见 model 字段）
[x] 带 user_id 请求 → event log 输出 session_start/session_end
[x] 手动让主模型失败 5 次 → CB 进入 OPEN 状态，自动切换 fallback
[x] 超过 daily_token_quota → HTTP 429，body 含剩余配额信息
[x] locust 100 并发 60s → success_rate > 95%
[x] 单次 Token > 8000 → alert 日志出现 large_session
[x] 日成本超阈值 → alert 日志出现 daily_cost_exceeded
[x] 前端代码块语法高亮（Python/TS/JSON/bash 均生效）
```

---

## 成本估算参考

| 场景 | 平均 Token | DeepSeek-V3 费用 | 日 100 对话合计 |
|------|-----------|---------|--------------|
| 纯客服查询 | ~800 | ¥0.003 | ¥0.30 |
| 数据分析报告 | ~2500 | ¥0.010 | ¥1.00 |
| 混合并发 | ~3500 | ¥0.014 | ¥1.40 |

ModelRouter 把简单查询引流到便宜模型后，理论可降低 30%～50% 成本。
