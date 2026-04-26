---
title: L7 · LangGraph 有状态 Agent
icon: fa6-solid:diagram-project
order: 7
category:
  - AI工程实战
tag:
  - LangGraph
  - StateGraph
  - Checkpoint
  - interrupt
  - PostgreSQL
---

# L7：LangGraph 有状态 Agent

> **关卡目标**：用 LangGraph 重写 Agent，从 while 循环升级为显式状态机，引入意图分类、Human-in-the-loop 澄清问答、PostgreSQL 持久化 Checkpoint。

---

## 为什么需要 LangGraph

L6 的 Agent 是一个简单的 for 循环：

```python
for _ in range(max_iterations):
    response = llm.complete_with_tools(messages)
    if response.finish_reason == "stop":
        break
    # 执行工具，把结果追加到 messages
```

这个方案的问题在于：
- **流程不透明**：不知道 LLM 当前在"做什么"，只能看最终结果
- **无法处理缺失信息**：用户说"我的订单到了吗"（没给订单号），LLM 会乱猜
- **状态不持久**：Redis 只存消息列表，服务重启对话丢失，无法恢复到中间状态
- **无法扩展**：想加"转人工"逻辑要修改循环内部，越来越难维护

LangGraph 用**状态机**来组织这些逻辑：每个处理步骤是一个节点，节点之间的跳转有明确的条件规则，整个流程一目了然。

---

## 核心概念

### State（状态）

所有节点共享的数据容器，用 TypedDict 严格定义：

```python
class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]  # 追加语义
    intent: Literal["faq", "order_query", "complaint", "escalate", "chat"] | None
    needs_clarification: bool
    tool_results: list[dict]
    should_escalate: bool
    session_id: str
    iteration_count: int
    # ... 更多字段
```

`add_messages` 是 LangGraph 内置的 reducer，让 `messages` 字段具有"追加"语义，不会被覆盖。其他字段默认是 last-write-wins。

### Node（节点）

每个节点是一个 `async def` 函数，接收当前 State，返回要更新的字段：

```python
async def classify_intent(state: AgentState, config: dict) -> dict:
    # 调用 LLM 分析意图
    return {
        "intent": "order_query",
        "needs_clarification": True,
        "clarification_question": "请提供您的订单号",
    }
```

### Conditional Edge（条件边）

根据 State 决定下一步去哪个节点：

```python
def _route_after_classify(state: AgentState) -> str:
    if state.get("needs_clarification"):
        return "clarify"
    if state.get("intent") == "faq":
        return "retrieve_knowledge"
    if state.get("intent") in ("order_query", "complaint"):
        return "call_tools"
    return "generate_response"
```

---

## interrupt()：Human-in-the-loop

`interrupt()` 是 LangGraph 最强大的功能之一。在节点里调用它，图会立即暂停，把数据传给调用方，等待外部输入后再继续。

```python
# clarify.py
async def run(state: AgentState, config: dict) -> dict:
    question = state["clarification_question"]

    # 暂停！LangGraph 把图的当前状态存入 PostgreSQL
    # 并抛出 GraphInterrupt 异常
    user_response = interrupt({"type": "interrupt", "question": question})

    # 当外部用 Command(resume=user_response) 调用图时，这里继续执行
    return {
        "messages": [AIMessage(content=question), HumanMessage(content=user_response)],
        "needs_clarification": False,
    }
```

API 层的处理：

```python
try:
    async for chunk in graph.astream(input_data, config=thread_config):
        ...
except GraphInterrupt as gi:
    interrupt_payload = gi.args[0][0].value
    # 发给前端: {type:"interrupt", question:"..."}

# 用户输入后，前端带 resume_value 再次 POST
# API 层:
input_data = Command(resume=body.resume_value)
async for chunk in graph.astream(input_data, config=thread_config):
    ...
```

---

## 完整对话流程示意

**场景：模糊查询订单**

```
用户: "我的订单到了吗"
                    ↓
[classify_intent] → intent="order_query", needs_clarification=true
                    ↓
[clarify] → interrupt() 抛出
                    ↓ (前端显示蓝色输入框)
用户: "2024-0312"
                    ↓ Command(resume="2024-0312")
[clarify] → interrupt() 返回 "2024-0312"，追加到 messages
                    ↓
[classify_intent] → intent="order_query", needs_clarification=false
                    ↓
[call_tools] → query_order("2024-0312") → result
                    ↓
[generate_response] → "您的订单目前在运输中，预计3月15日送达..."
```

---

## PostgreSQL Checkpoint

LangGraph 的 checkpoint 不只是存消息，而是存**整个 AgentState**，包括意图、工具结果、转人工标志等。

```python
# main.py
async with AsyncPostgresSaver.from_conn_string(settings.pg_dsn) as checkpointer:
    await checkpointer.setup()   # 自动建表
    graph = build_graph(checkpointer=checkpointer)
    # 用同一 thread_id（session_id）发消息，自动加载上次状态
```

关键注意事项：
- 包名是 `langgraph-checkpoint-postgres`，依赖 **psycopg v3**（非 asyncpg）
- DSN 格式：`postgresql://user:pass@host:port/db`（无 `+asyncpg` 后缀）
- 用 port 5433 避免与本机已有 PostgreSQL 冲突

---

## Token 流式输出的实现细节

LangGraph 的 `astream()` 在节点完成时才 yield，不能逐 token 输出。解决方案是在节点内用 `asyncio.Queue` 传递 token：

```python
# generate_response.py（节点内）
async for token in llm.stream(messages):
    await event_queue.put({"type": "token", "content": token})

# api/v1/graph.py（API 层）
graph_task = asyncio.create_task(run_graph())
while True:
    item = await event_queue.get()   # 不阻塞，实时拿到 token
    if item is None: break
    yield f"data: {json.dumps(item)}\n\n"
```

`graph_task` 在后台运行图，`event_queue` 充当跨协程的实时管道。

---

## 前端可视化

前端 `GraphChat.tsx` 在 L6 的基础上新增：

**节点进度条**：收到 `{type:"node", node:"call_tools"}` 事件后显示 chip：
```
[意图分类] [工具调用] [生成回复]
```

**interrupt 输入框**：收到 `{type:"interrupt", question:"..."}` 后替换普通输入区，显示蓝色提示框，用户输入后触发 resume。

---

## L6 vs L7 对比

| 维度 | L6 | L7 |
|------|----|----|
| 流程结构 | while 循环 | StateGraph 节点 + 条件边 |
| 状态存储 | Redis（消息列表，TTL 2h） | PostgreSQL（完整 State，无 TTL） |
| 意图处理 | LLM 直接选工具 | classify_intent 先路由 |
| 缺失信息 | 不处理 | interrupt() 暂停求证 |
| 重启续话 | 不支持 | 支持（PG checkpoint） |
| 转人工 | 无 | escalate 节点 |

---

## 验收清单

```
[x] 有 order_id 的查询：classify → call_tools → generate（不经过 clarify）
[x] 无 order_id 的查询：classify → clarify(interrupt) → classify → call_tools
[x] FAQ 问题：classify → retrieve_knowledge → generate
[x] 重启服务继续同一会话：PG 持久化验证
[x] 前端节点进度条更新
[x] 前端 interrupt 蓝色输入框出现/消失
```
