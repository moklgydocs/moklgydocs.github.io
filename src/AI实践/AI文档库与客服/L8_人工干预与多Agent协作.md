---
title: L8 · 人工干预与多 Agent 协作
icon: fa6-solid:people-arrows
order: 8
category:
  - AI工程实战
tag:
  - Human-in-the-loop
  - 多Agent
  - Supervisor模式
  - asyncio
  - framer-motion
---

# L8：人工干预 + 多 Agent 协作

> **关卡目标**：让 AI 知道"我处理不了"。引入 Human-in-the-Loop 转人工机制（5 分钟倒计时），并实现 Supervisor + 多 SubAgent 并发执行架构。前端同步完成生产级 UI 工程化改造。

---

## 本关新增能力

| 能力 | 实现方式 | 端口 |
|------|---------|------|
| 人工升级对话 | LangGraph `interrupt()` + 5 分钟超时 | 8006 |
| 多 Agent 并发 | `asyncio.gather` + Supervisor Graph | 8006 |
| 数据分析 Agent | 独立工具集（销售/退货/客服统计）| ↑ |
| 前端进度面板 | `AgentProgressPanel` + 倒计时卡片 | 5173 |

---

## 架构：Supervisor + SubAgent

L7 是单 Agent 处理所有事。L8 开始引入**角色分工**：

```
用户请求
    ↓
[Supervisor Node]          ← LLM 决策：路由给谁
    ├── customer_service   ← 查订单/库存/工单/知识库/发通知
    ├── data_analyst       ← 销售报告/退货率/客服统计
    ├── parallel (两者同时)
    └── human_escalation   ← AI 处理不了，挂起等待人工
```

Supervisor 不执行任务，只做**任务分解与路由**。这是生产级多 Agent 系统的标准模式。

---

## MultiAgentState

```python
class MultiAgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    session_id: str
    iteration_count: int

    # Supervisor 决策
    task_type: Literal["customer_service","data_analysis","parallel","human_escalation"] | None
    supervisor_reasoning: str | None
    sub_tasks: list[dict]   # [{"agent_type": "...", "task_description": "..."}]

    # 子 Agent 结果
    sub_agent_results: list[dict]

    # 人工升级
    escalation_requested: bool
    escalation_reason: str | None
    human_response: str | None      # "__timeout__" 表示超时

    final_response: str | None
    error: str | None
```

与 L7 的 `AgentState` 相比，新增了 `sub_tasks`、`sub_agent_results`、`escalation_*` 三组字段，其余沿用。

---

## 并发执行：asyncio.gather

```python
async def parallel_agents_node(state: MultiAgentState, config: RunnableConfig) -> dict:
    sub_tasks = state.get("sub_tasks", [])

    async def run_one(task: dict) -> dict:
        t0 = time.perf_counter()
        try:
            if task["agent_type"] == "customer_service":
                result = await customer_service_subagent(task, config)
            else:
                result = await data_analyst_subagent(task, config)
            result["duration_ms"] = int((time.perf_counter() - t0) * 1000)
            return result
        except Exception as exc:
            return {"agent_type": task["agent_type"], "success": False,
                    "error": str(exc), "duration_ms": int((time.perf_counter()-t0)*1000)}

    results = list(await asyncio.gather(*[run_one(t) for t in sub_tasks]))
    escalation_requested = any(r.get("needs_escalation") for r in results)
    return {"sub_agent_results": results, "escalation_requested": escalation_requested}
```

关键点：各子 Agent 的工具注册表完全隔离，LLM 只能看到自己权限范围内的工具：

```python
cs_registry = ToolRegistry()        # 5个客服工具
analytics_registry = ToolRegistry() # 3个分析工具

# 分别注入各自的 subagent
```

---

## 人工升级：interrupt() + 5 分钟超时

```python
# graph/nodes/human_escalation.py
async def run(state: MultiAgentState) -> dict:
    reason = state.get("escalation_reason") or "问题超出 AI 处理范围"
    human_input: str = interrupt({
        "type": "human_escalation",
        "reason": reason,
        "timeout_seconds": 300,
        "question": f"【需要人工处理】{reason}",
        "started_at": time.time(),
    })
    is_timeout = human_input == "__timeout__"
    content = "人工处理超时（5分钟无响应），已自动关闭。" if is_timeout \
              else f"人工处理结果：{human_input}"
    return {
        "human_response": human_input,
        "sub_agent_results": [{"agent_type": "human", "success": not is_timeout,
                               "content": content}],
    }
```

超时**由前端实现**，而不是后端 timer：
- 收到 `{type:"human_escalation", started_at:..., timeout_seconds:300}` 事件
- 前端启动 `setInterval` 倒计时，每 500ms 重算剩余时间
- 归零时自动 POST `resume_value="__timeout__"` 继续图执行

这样即使后端重启，只要 PG checkpoint 还在，超时逻辑依然正确（因为 `started_at` 是绝对时间戳）。

---

## 三个分析工具（mock 数据）

| 工具名 | 参数 | 返回关键字段 |
|----------|------|-------------|
| `query_sales_report` | period, product_line? | total_revenue, product_breakdown, growth_rate |
| `query_return_rate` | period, product_line? | overall_return_rate, by_product, return_reasons |
| `query_customer_stats` | period, metric? | avg_satisfaction_score, ticket_volume, escalation_rate |

全部返回 mock 固定数据，`requires_confirm=False`，按 `period` 参数有轻微差异（用于演示）。

---

## SSE 事件扩展

L8 在 L7 现有事件（`node`、`token`、`done`、`error`）基础上新增：

| 事件类型 | 关键字段 | 用途 |
|----------|---------|------|
| `agents_start` | agents, count | 即将并发执行的 Agent 列表 |
| `agent_start` | agent, description | 某个子 Agent 开始 |
| `agent_done` | agent, success, duration_ms | 某个子 Agent 完成 |
| `agents_complete` | total_duration_ms | 所有并发结束 |
| `human_escalation` | reason, timeout_seconds, question, started_at | 触发人工升级 |
| `supervisor_decision` | task_type, reasoning | 调试用（可关闭）|

---

## 前端：MultiAgentChat.tsx

基于 GraphChat.tsx 扩展，新增两个核心组件：

### AgentProgressPanel

以卡片网格展示各 Agent 实时状态：

```
┌─────────────────┐  ┌─────────────────┐
│ ⟳ 客服专员       │  │ ✓ 数据分析师     │
│ 查询订单...      │  │  142ms          │
│ [查订单] [知识库] │  │ [销售报告]      │
└─────────────────┘  └─────────────────┘
```

状态映射：`idle` → 灰色 clock，`running` → indigo 转圈，`done` → 绿色对号，`failed` → 红色叹号。

### HumanEscalationCard

替代 L7 的 `InterruptDialog`：

```
┌─────────────────────────────────────────┐
│ ⚠ 需要人工处理                  4:23   │
│ ████████████████████░░░░░░░░░░         │ ← 进度条（蓝→橙→红）
│ 问题超出 AI 处理范围，请输入处理意见... │
│ [输入框________________] [提交]         │
└─────────────────────────────────────────┘
```

倒计时颜色：≥120s 蓝色，60～120s 橙色，<60s 红色。倒计时归零自动提交 `"__timeout__"`。

---

## 前端工程化改造（与 L8 同期完成）

本关同期完成了前端生产级改造，涉及所有 6 个聊天组件：

### 动效系统（framer-motion）

```tsx
// 侧边栏 tab 切换：layoutId spring 滑动指示器
{tab === id && (
  <motion.span
    layoutId="nav-active"
    className="absolute inset-0 rounded-xl bg-indigo-600"
    transition={{ type: "spring", stiffness: 380, damping: 32 }}
  />
)}

// 消息气泡入场
<motion.div
  initial={{ opacity: 0, y: 12, x: role === "user" ? 16 : -16 }}
  animate={{ opacity: 1, y: 0, x: 0 }}
  transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
/>

// 发送/停止按钮切换
<AnimatePresence mode="wait" initial={false}>
  {loading ? (
    <motion.button key="stop" ...whileTap={{ scale: 0.85 }} />
  ) : (
    <motion.button key="send" ...whileTap={{ scale: 0.85 }} />
  )}
</AnimatePresence>
```

### 对比度修复（WCAG AA）

全面审查 6 个组件，修复所有低对比度文字：

| 问题模式 | 修复方案 |
|--------|---------|
| `text-[10px]` / `text-[11px]` | → `text-xs`（最低 12px） |
| `text-slate-300` on white | → `text-slate-500`（通过 AA） |
| `text-slate-400` on white | → `text-slate-500`～`text-slate-600` |
| AI 气泡 `bg-white text-slate-700` | → `bg-slate-100 text-slate-900` |
| 状态文字 `text-slate-400` | → `text-slate-600 font-medium` |

### 组件重构：DocPipeline

原版使用 shadcn Card/Badge/Button，与整体设计语言脱节。重写为：
- `Section` 包装组件：`bg-white rounded-2xl border-slate-200 shadow-sm`（与 AdminPanel 一致）
- `ErrorBanner` 替代 `alert()`：AnimatePresence 淡入，显示在上传区下方
- `StatusChip`：使用 `Partial<Record<TaskRecord["status"], ...>>` + `??` fallback，覆盖所有 7 种状态
- 上传/搜索区域：AnimatePresence 图标切换，任务列表逐条滑入动画

### LocalStorage 持久化

所有对话组件使用自定义 `useLocalStorage` hook，刷新页面后消息不丢失：

```ts
const [messages, setMessages] = useLocalStorage<Message[]>(
  "zuruai_agent_messages",
  () => [],
  // 恢复时修复悬空的 isStreaming 状态
  msgs => msgs.map(m => m.isStreaming ? { ...m, isStreaming: false } : m),
);
```

`useLocalStorage` 第三个参数是恢复时的 transform 函数，用于修复页面刷新时中途停止的流式消息。

---

## 验收清单

```
[x] 纯客服任务 → customer_service 子 Agent 调用工具，SSE 推送进度
[x] 纯数据任务 → data_analyst 子 Agent 生成报告
[x] 混合任务   → 两个子 Agent 并发执行，AgentProgressPanel 显示双卡片
[x] 人工升级   → 前端倒计时，5 分钟超时自动提交 "__timeout__"
[x] 前端动效   → 侧边栏 spring 滑动 + 消息入场 + 按钮切换
[x] 对比度     → 所有文字通过 WCAG AA（最低 4.5:1）
[x] PG checkpoint → 重启服务，同一 session_id 可继续会话
[x] GET /api/v1/multi/health → 返回 agents + tools 列表
```

---

## 常见问题

**Q：子 Agent 之一超时，另一个还在跑，怎么处理？**  
A：`asyncio.gather` 默认 return_exceptions=False，一个任务异常会取消所有。用 `return_exceptions=True` 让所有任务都跑完，在 `aggregate_results` 节点统一处理失败结果。

**Q：Supervisor 怎么决定路由到 `parallel`？**  
A：LLM System Prompt 里明确说明：当任务**同时包含**客服操作（查订单/库存）和数据分析时，路由到 `parallel`。实测单次分类准确率 > 90%。

**Q：`interrupt()` 和 Redis 的 Session TTL 有什么关系？**  
A：L7/L8 用的是 PG checkpoint，与 Redis 无关。PG 里存的是完整 State，没有 TTL，重启服务照样能 resume。
