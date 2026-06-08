# YARP 网关基础

[← 篇章3：权限中心](../04-权限中心/09-成员管理.md) | [下一篇：网关HTTP客户端 →](02-网关HTTP客户端.md)

---

> **这一步解决什么问题？** 到现在为止，我们的前端已经能跟 SSO、权限等后端服务通信了。但请求是怎么从前端到达后端的？本篇要搞清楚 YARP 网关的三层结构（Route → Cluster → Destination），为后续的网关管理界面打基础。

---

## 核心概念

### 反向代理 vs 正向代理

| 概念 | 类比 | 方向 |
|------|------|------|
| 正向代理 | VPN/翻墙代理 | 客户端 → 代理 → 互联网 |
| 反向代理 | Nginx/YARP | 客户端 → 反向代理 → 后端服务集群 |

YARP 是反向代理：客户端不知道后端有几个服务实例，只跟网关通信。

> **后端类比**：YARP 的定位 ≈ Nginx 的 `location` + `proxy_pass`，只不过它是 .NET 原生的，配置用 C# 对象而非 nginx.conf。

### YARP 三大核心对象

```
请求流入
  │
  ▼
┌─────────────────────────────────┐
│  Route（路由规则）               │
│  匹配路径 /api/auth/{**catch}   │
│  → 转发到哪个 Cluster？          │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│  Cluster（集群）                 │
│  负载均衡策略: RoundRobin        │
│  包含哪些 Destination？          │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│  Destination（目标地址）          │
│  http://moklgy.me:5000          │
│  http://moklgy.me:5001          │
└─────────────────────────────────┘
```

**后端类比**：

- **Route** ≈ ASP.NET Core 的 `[Route("/api/auth")]`，定义请求匹配规则
- **Cluster** ≈ `IServiceCollection.AddHttpClient()` 的负载均衡策略
- **Destination** ≈ 后端服务实例地址，类似 Docker Compose 里的多副本

> **🤔 导师提问**：YARP 为什么要拆分 Route 和 Cluster 两层？为什么不让 Route 直接指向 Destination？

### YARP 路由匹配流程

当一个 HTTP 请求到达 YARP 网关时，匹配流程如下：

```
HTTP 请求 GET /api/auth/login
  │
  ▼
┌──────────────────────────────────────┐
│ 1. 遍历所有 Route，按 order 排序      │
│    order 越小越优先                    │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ 2. 检查 matchPath 是否匹配            │
│    /api/auth/{**catch-all}  ✓ 匹配   │
│    /api/gateway/{**catch}   ✗ 不匹配  │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ 3. 检查 matchMethods（如限 GET/POST） │
│    null = 允许所有方法               │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ 4. 检查 matchHosts（可选）            │
│    null = 不限 Host                   │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ 5. 匹配成功 → 找到 clusterId         │
│    在 Cluster 列表中定位目标集群       │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ 6. 负载均衡选择一个 Destination       │
│    根据策略（RoundRobin 等）          │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ 7. 执行 transforms（路径改写等）      │
│    转发到目标地址                      │
└──────────────────────────────────────┘
```

【易错点】YARP 的匹配是**先到先得**：第一个匹配的 Route 生效。如果两条路由都能匹配同一个请求，`order` 小的优先。忘记设置 `order` 会导致不可预期的匹配结果。

### Cluster 与 Destination 的关系

一个 Cluster 包含 0~N 个 Destination，Destination 代表后端服务的一个可访问地址：

```
Cluster: authserver
┌───────────────────────────────────────────────┐
│  loadBalancingPolicy: RoundRobin              │
│                                               │
│  Destination: auth-1                          │
│  ┌──────────────────────────────────────┐     │
│  │ address: http://moklgy.me:5000      │     │
│  │ health: healthy                      │     │
│  │ isEnabled: true                      │     │
│  └──────────────────────────────────────┘     │
│                                               │
│  Destination: auth-2                          │
│  ┌──────────────────────────────────────┐     │
│  │ address: http://moklgy.me:5001      │     │
│  │ health: unhealthy                    │     │
│  │ isEnabled: false                     │     │
│  └──────────────────────────────────────┘     │
└───────────────────────────────────────────────┘
```

- `isEnabled: false` 的 Destination 不会被负载均衡选中（手动摘流）。
- `health: unhealthy` 表示健康检查失败，YARP 会自动剔除。
- **后端类比**：Destination ≈ Kubernetes Pod，Cluster ≈ Service，`isEnabled` ≈ `cordon` 节点，`health` ≈ `readinessProbe`。

> **🤔 导师提问**：如果你来设计，`isEnabled` 应该放在 Cluster 上还是 Destination 上？各有什么取舍？

### 限流策略

YARP 集成了 ASP.NET Core 的限流中间件，支持四种策略：

| 类型 | 类比 | 适用场景 | 关键参数 | 突发处理 |
|------|------|----------|----------|----------|
| FixedWindow（固定窗口） | 计数器，每 N 秒归零 | 简单限流 | permitLimit + windowSeconds | 边界可能 2 倍突发 |
| SlidingWindow（滑动窗口） | 滑动平均，平滑限流 | 需要精确控制的 API | permitLimit + windowSeconds | 无边界突发 |
| TokenBucket（令牌桶） | 漏桶+令牌，允许短时突发 | 上传/下载接口 | permitLimit + windowSeconds(补充速率) | 允许短时突发 |
| Concurrency（并发限制） | 信号量，限制同时处理数 | 耗时接口（导出、AI推理） | permitLimit(=最大并发) | 不看时间，看并发 |

> **🤔 导师提问**：对于一个以读请求为主的管理后台，你会选哪种限流算法？如果是文件上传接口呢？

> **后端类比**：FixedWindow ≈ `RateLimiter.AddFixedWindowLimiter()`，Concurrency ≈ `SemaphoreSlim`。

---

## 前端代理架构

```
浏览器
  │
  │ /gw-api/api/gateway/clusters
  ▼
Vite Dev Server (proxy)
  │ rewrite: /gw-api → ""
  ▼
YARP Gateway (moklgy.me:10000)
  │
  │ /api/gateway/clusters
  ▼
Gateway Admin API (ASP.NET Core)
```

对应 Vite 配置（`vite.config.ts`）：

```typescript
"/gw-api": {
  target: "http://moklgy.me:10000",
  changeOrigin: true,
  rewrite: (p) => p.replace(/^\/gw-api/, ""),
},
```

> **🤔 导师提问**：Vite proxy 会把 `/gw-api` 前缀去掉再转发给 YARP。如果 YARP 也期望收到带 `/gw-api` 前缀的路径，会发生什么？

【易错点】`changeOrigin: true` 不能省略。如果不设置，Vite 转发请求时会保留浏览器的 `Host` 头（如 `localhost:5173`），后端可能因为 Host 校验而拒绝请求。同理，Nginx 的 `proxy_set_header Host $proxy_host` 也是这个道理。

> **后端类比**：这和 ASP.NET Core 的 `app.MapProxy()` / `app.UseProxy()` 一个道理——前端发 `/gw-api/xxx`，Vite 开发服务器帮你去掉前缀，转发到真正的网关后端。

---

## 前端模块结构

```
src/api/gateway/           → API 层
  http.ts                  → 创建 gwHttp 实例（basePrefix = '/gw-api'）
  gateway.ts               → 网关运行时管理（reload、status）
  clusters.ts              → 集群 CRUD
  routes.ts                → 路由 CRUD
  rate-limit-policies.ts   → 限流策略 CRUD

src/pages/gateway/         → 页面层
  dashboard/index.tsx      → 网关仪表盘（状态概览 + 发布配置）
  clusters/index.tsx       → 集群列表页
  clusters/cluster-form-dialog.tsx → 集群表单对话框
  routes/index.tsx         → 路由列表页
  routes/route-form-dialog.tsx     → 路由表单对话框
  rate-limit-policies/index.tsx    → 限流策略列表页
  rate-limit-policies/rate-limit-policy-form-dialog.tsx → 限流策略表单对话框
```

路由配置（`App.tsx`）：

```typescript
<Route path="gateway">
  <Route index element={<Lazy><GatewayDashboardPage /></Lazy>} />
  <Route path="clusters" element={<Lazy><GatewayClustersPage /></Lazy>} />
  <Route path="routes" element={<Lazy><GatewayRoutesPage /></Lazy>} />
  <Route path="rate-limit-policies" element={<Lazy><GatewayRateLimitPage /></Lazy>} />
</Route>
```

---

## 核心类型定义

以下是网关模块的 TypeScript 类型，直接来自 `src/types/index.ts`：

```typescript
/** 网关集群 DTO */
export interface ClusterDto {
  id: string
  clusterId: string
  loadBalancingPolicy: string | null
  description: string | null
  healthCheckEnabled: boolean
  healthCheckPath: string | null
  healthCheckIntervalSeconds: number
  healthCheckTimeoutSeconds: number
  destinations: DestinationDto[]
}

/** 集群目标地址 DTO */
export interface DestinationDto {
  destinationId: string
  address: string
  health: string | null
  isEnabled: boolean
}

/** 限流策略 DTO */
export interface RateLimitPolicyDto {
  id: string
  name: string
  type: string
  permitLimit: number
  windowSeconds: number
  queueLimit: number
  description: string | null
  isEnabled: boolean
}

/** 网关路由 DTO */
export interface RouteDto {
  id: string
  routeId: string
  clusterId: string
  clusterName: string | null
  matchPath: string
  matchHosts: string | null
  matchMethods: string | null
  rateLimiterPolicy: string | null
  authorizationPolicy: string | null
  order: number
  isEnabled: boolean
  description: string | null
  transforms: RouteTransformDto[]
}

/** 路由转换规则 DTO */
export interface RouteTransformDto {
  type: string
  value: string
  order: number
}

/** 网关状态概览 */
export interface GatewayStatus {
  routeCount: number
  clusterCount: number
  routes: { routeId: string; clusterId: string; path: string }[]
  clusters: { clusterId: string; destinationCount: number }[]
}
```

### 逐行理解类型设计

**`ClusterDto`**：

- **`clusterId` vs `id`**：`id` 是数据库主键，`clusterId` 是 YARP 配置中的逻辑标识（如 `"authserver"`）。【设计取舍】保留两个 ID 是因为 YARP 内部用 `clusterId` 做路由关联，而 CRUD 操作用数据库 `id`。如果只用 `clusterId`，就无法用数据库自增主键做高效索引。
- **`loadBalancingPolicy: string | null`**：为 `null` 时 YARP 使用默认策略（PowerOfTwoChoices）。【易错点】不要把 `null` 当成 `"RoundRobin"`，YARP 的默认行为是不同的。
- **`healthCheckEnabled: boolean`**：YARP 支持主动健康检查（Active Health Check），开启后会定期向目标地址发 GET 请求探活。

**`RouteDto`**：

- **`matchPath`**：YARP 的路径匹配语法，如 `/api/auth/{**catch-all}`。【易错点】`{**catch-all}` 是 YARP 特有的通配语法，不是 ASP.NET Core 的 `{*catch}`。YARP 用双星号 `**` 表示 catch-all。
- **`order`**：路由优先级，数值越小越优先匹配。类比 ASP.NET Core 中间件顺序——先匹配先生效。
- **`transforms`**：路径转换规则，类比 ASP.NET Core 的 `app.UsePathBase()` / `app.UseRewriter()`。常见类型：
  - `PathRemovePrefix`：去掉路径前缀再转发
  - `PathPrefix`：添加前缀
  - `RequestHeaderOriginalHost`：保留原始 Host 头
- **`rateLimiterPolicy`**：引用限流策略的**名称**（不是 ID）。【易错点】这里用的是 `name` 而非 `id`，因为 YARP 运行时按名称查找策略，这与 ASP.NET Core 的 `AddRateLimiter(opt => opt.AddPolicy("policy-name"))` 一致。

**`RateLimitPolicyDto`**：

- **`type`**：限流算法类型，4 种可选值（FixedWindow / SlidingWindow / TokenBucket / Concurrency）。
- **`queueLimit`**：排队上限，0 表示超限直接拒绝（返回 HTTP 429）。类比 ASP.NET Core 的 `QueueLimit = 0`。
- **`windowSeconds`**：仅非 Concurrency 类型有效。Concurrency 类型只看 `permitLimit`（最大并发数）。

---

## 集中式网关 vs 服务间直调

【设计取舍】为什么用集中式 API 网关，而不是前端直接调用各个微服务？

| 维度 | 集中式网关（YARP） | 服务间直调 |
|------|-------------------|-----------|
| 前端复杂度 | 低——只需知道网关地址 | 高——需要知道每个服务的地址 |
| 跨域问题 | 统一处理 | 每个服务单独配置 CORS |
| 限流/认证 | 统一在网关层 | 每个服务各自实现 |
| 服务发现 | 网关内部解决 | 前端需要服务发现机制 |
| 灵活性 | 中——必须经过网关 | 高——可以绕过网关直连 |
| 运维复杂度 | 中——网关是单点 | 高——每个服务暴露端口 |

我们的系统选择了集中式网关，因为：
1. 前端只需要一个 `/gw-api` 前缀，所有后端服务对前端透明
2. 限流、认证、CORS 在网关层统一处理，后端服务不需要重复实现
3. 运维人员通过管理界面就能修改路由和限流，不需要改代码

> **🤔 导师提问**：如果我们有 20 个微服务而不是 7 个，集中式网关还是正确的选择吗？什么情况下网关会成为瓶颈？

---

> **🔍 验证步骤**
>
> 1. 登录后访问 `http://localhost:3000/gateway`，确认网关仪表盘正常加载
> 2. 打开 DevTools → Network，刷新页面，找到 `/gw-api/api/gateway/clusters` 请求
> 3. 追踪请求路径：浏览器 → Vite proxy（去掉 `/gw-api` 前缀）→ YARP（`http://moklgy.me:10000`）→ 后端服务
> 4. 检查 Response 的 `ApiResult` 结构：应包含 `code: 0`、`success: true`、`data: [...]`

## 🤔 思考题

**Level 1（概念级）**：YARP 的 Route、Cluster、Destination 三者是什么关系？请求从进入到转发经历哪些步骤？

**Level 2（推理级）**：为什么 `ClusterDto` 同时有 `id` 和 `clusterId` 两个字段？如果只用一个会怎样？为什么 `RouteDto.rateLimiterPolicy` 引用的是策略名称而不是 ID？

**Level 3（动手级）**：如果要在路由上新增 `matchHeaders` 字段（按请求头匹配），需要改哪些类型定义？前端表单需要做哪些对应修改？

---

## ✅ 输出检查清单

完成本篇学习后，确认我们能够：

- [ ] 画出 YARP 的三层结构（Route → Cluster → Destination）并解释每层职责
- [ ] 说明 YARP 路由匹配的流程（order 排序 → matchPath → matchMethods → matchHosts）
- [ ] 区分四种限流算法的适用场景和关键参数差异
- [ ] 理解 `ClusterDto` 中 `id` 和 `clusterId` 的不同用途
- [ ] 解释 `changeOrigin: true` 在 Vite 代理配置中的作用
- [ ] 理解集中式网关 vs 服务间直调的设计取舍

---

## 📋 本步产出清单

| 文件 | 说明 |
|------|------|
| `05-API网关管理/01-YARP网关基础.md` | 本文件：YARP 概念、三大核心对象、路由匹配流程、Cluster/Destination 关系、限流策略对比、前端代理架构、模块结构、类型定义 |

---

[← 篇章3：权限中心](../04-权限中心/09-成员管理.md) | [下一篇：网关HTTP客户端 →](02-网关HTTP客户端.md)
