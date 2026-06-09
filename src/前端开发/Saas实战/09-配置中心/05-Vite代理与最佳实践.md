# 05 - Vite 代理与最佳实践：跨服务配置的工程化

> **这一步解决什么问题？**
> 配置中心管理 5 个后端微服务的运行时配置，前端如何让一个组件"穿越"到不同的后端？答案藏在 Vite proxy 配置和 `createHttp` 工厂函数中。这节我们从工程化角度总结配置中心的完整请求链路和开发最佳实践。
>
> **ASP.NET Core 开发者的直觉**：Vite proxy ≈ YARP 反向代理，`createHttp` ≈ `IHttpClientFactory`，多后端配置 ≈ `appsettings.json` 中多个命名 HttpClient 注册。

---

## 前置知识

- 理解 Vite 的开发服务器代理（`vite.config.ts` 中 `server.proxy` 配置）
- 熟悉 `createHttp` 工厂函数与 axios 实例创建（见 03-配置页面组件）
- 了解 Nginx 反向代理的基本配置语法
- 已完成前四节的学习，掌握配置中心完整请求链路

---

## 一、Vite 代理配置精读

配置中心涉及 5 个后端微服务，每个都需要在 `vite.config.ts` 中配置代理：

```typescript
// vite.config.ts（配置中心相关的代理配置）
server: {
  port: 3000,
  proxy: {
    "/perm-api": {
      target: "http://moklgy.me:10002",
      changeOrigin: true,
      rewrite: (p) => p.replace(/^\/perm-api/, ""),
    },
    "/file-api": {
      target: "http://moklgy.me:10011",
      changeOrigin: true,
      rewrite: (p) => p.replace(/^\/file-api/, ""),
    },
    "/print-api": {
      target: "http://moklgy.me:11010",
      changeOrigin: true,
      rewrite: (p) => p.replace(/^\/print-api/, ""),
    },
    "/miniapp-api": {
      target: "http://moklgy.me:5020",
      changeOrigin: true,
      rewrite: (p) => p.replace(/^\/miniapp-api/, ""),
    },
    "/notify-api": {
      target: "http://moklgy.me:10012",
      changeOrigin: true,
      rewrite: (p) => p.replace(/^\/notify-api/, ""),
    },
  },
}
```

逐行精讲：

| 标记 | 代码 | 解读 |
|------|------|------|
| **【设计取舍】** | `/perm-api` 前缀策略 | 每个微服务一个前缀！避免后端路径冲突（5 个服务都有 `/api/runtime-config`） |
| **【易错点】** | `changeOrigin: true` | 必须！修改请求头中的 `Host` 为 target 的主机名。不加的话后端可能拒绝请求（CORS / Host 校验） |
| **【易错点】** | `rewrite: (p) => p.replace(/^\/perm-api/, "")` | 去掉前缀！后端不知道 `/perm-api` 的存在。请求 `GET /perm-api/api/runtime-config` 被重写为 `GET /api/runtime-config` |

> 🤔 **导师提问**：如果 `rewrite` 不去掉前缀，后端会收到 `GET /perm-api/api/runtime-config`——但 ASP.NET Core 的路由只注册了 `/api/runtime-config`，所以会返回 404。你能想到什么场景下**不去掉前缀**是正确的吗？提示：如果后端也注册了带前缀的路由（如 `app.MapControllers().AddRoutePrefix("/perm-api")`），那么不去掉前缀反而正确——但这意味着后端代码也知道了前端的前缀策略，耦合度更高。

### 1.1 请求流全链路

以"查询权限中心的所有配置"为例，完整请求流：

```
① 浏览器发起请求：
   fetch("/perm-api/api/runtime-config", {
     headers: { Authorization: "Bearer xxx", "X-Tenant-Id": "123" }
   })

② Vite Dev Server 代理：
   匹配 /perm-api 规则
   → 去掉前缀：/api/runtime-config
   → 转发到：http://moklgy.me:10002/api/runtime-config

③ ASP.NET Core 后端处理：
   ConfigController.GetAll()
   → 从 RuntimeConfigProvider 读取配置
   → 返回 ConfigItemDto[] JSON

④ 响应回流：
   后端 200 OK + JSON
   → Vite 代理回传
   → 前端 res.data = ConfigItemDto[]

⑤ 前端渲染：
   groupConfigs(items) → ConfigGroup[]
   → 渲染分组卡片
```

### 1.2 生产环境怎么办？

Vite proxy 只在开发环境生效！生产环境需要 Nginx/YARP 做同样的转发：

```nginx
# Nginx 等价配置
location /perm-api/ {
    proxy_pass http://perm-center:10002/;
    proxy_set_header Host $host;
}

location /file-api/ {
    proxy_pass http://file-service:10011/;
    proxy_set_header Host $host;
}
```

💡 **【设计取舍】** `/perm-api` 前缀在开发和生产环境中都存在——前端代码硬编码了这个前缀。生产环境由 Nginx/YARP 做同样的重写，前端代码无需修改。

⚠️ **【易错点】** 开发环境中的 CORS 陷阱：Vite proxy 在本地开发时绕过了浏览器的同源策略（浏览器请求发给 `localhost:3000`，代理转发到远程后端），所以开发时永远不会遇到 CORS 问题。但部署到生产环境后，如果 Nginx/YARP 配置不当（如缺少 CORS 响应头），浏览器会拦截跨域请求。**永远不要因为"本地没问题"就忽略生产环境的 CORS 配置。**

⚠️ **【性能陷阱】** Vite proxy 在开发环境增加了请求延迟！每个请求经过：浏览器 → Vite Dev Server (Node.js) → 后端服务，比生产环境多了一跳（生产环境：浏览器 → Nginx → 后端，或者浏览器 → CDN → 后端）。在本地开发时，如果后端响应慢，你会发现配置列表加载很慢——这不一定是后端的问题，也可能是代理转发的额外开销。

> 🤔 **导师提问**：Vite proxy 只在开发环境生效（`vite dev` 启动时），生产环境用的是 Nginx/YARP。那生产环境的代理配置应该放在哪里？如果你把代理规则写在代码仓库的 `nginx.conf` 里，和写在运维团队的配置管理平台里，各有什么优劣？

---

## 二、createHttp 工厂函数在配置中心的应用

配置中心**没有**自己的 `api/config/` 目录！这是和其他模块最大的不同：

```
其他模块的 API 结构：
  src/api/notify/
    ├── http.ts          ← 模块专用 HTTP 客户端
    ├── notifications.ts ← 通知 API
    └── templates.ts     ← 模板 API

配置中心的 API 结构：
  src/pages/config/index.tsx  ← 直接在组件内调用 createHttp！
    const http = useMemo(() => createHttp(serviceBaseUrl), [serviceBaseUrl])
    await http.get<ConfigItemDto[]>("/api/runtime-config")
```

⚠️ **【设计取舍】** 为什么不抽 API 层？

| 方案 | 优点 | 缺点 |
|------|------|------|
| 抽 API 层 | 职责分离、可测试 | 5 个后端 × 4 个 API = 20 个函数，且逻辑完全相同 |
| 组件内直接调用 | 代码集中、少一层抽象 | 组件行数多（610 行），测试不便 |

配置中心选择了组件内直接调用，因为：
1. **5 个后端的 API 路径完全相同**，只是 base URL 不同
2. **API 函数非常少**（4 个：GET/POST/DELETE/Reload），不值得单独建文件
3. **`serviceBaseUrl` 是 Props 传入的**，组件外无法确定 base URL

### 2.1 createHttp 的关键能力

回顾 `createHttp` 为配置中心提供的能力：

```
createHttp(serviceBaseUrl) 返回：

┌─────────────────────────────────────────────────────┐
│  自动注入（请求拦截器）：                             │
│    Authorization: Bearer {accessToken}               │
│    X-Tenant-Id: {currentTenantId}                   │
│                                                     │
│  自动处理（响应拦截器）：                             │
│    401 → Token 刷新 → 重发请求                       │
│    非 ApiResult → 自动包裹为 ApiResult                │
│                                                     │
│  方法：                                              │
│    get<T>(url) → Promise<ApiResult<T>>              │
│    post<T>(url, data) → Promise<ApiResult<T>>       │
│    put<T>(url, data) → Promise<ApiResult<T>>       │
│    del<T>(url) → Promise<ApiResult<T>>              │
└─────────────────────────────────────────────────────┘
```

💡 **【易错点】** 配置中心的 `http.get<ConfigItemDto[]>("/api/runtime-config")` 实际返回类型是 `ApiResult<ConfigItemDto[]>`，不是 `ConfigItemDto[]`！所以要用 `res.data` 取实际数据。

> 🤔 **导师提问**：配置中心为什么不抽 API 层？如果未来配置项从 4 个 API 增长到 15 个（加上历史版本、批量操作、导入导出……），你还坚持"组件内直接调用"吗？关键判断标准是：**API 函数之间有没有共享逻辑**。如果每个 API 调用都是独立的，组件内调用没问题；如果多个 API 共享了数据处理逻辑（如统一的错误处理、缓存策略），就应该抽到独立模块。

---

## 三、分组工具函数精读

### 3.1 groupConfigs：扁平数组 → 分组结构

```typescript
function groupConfigs(items: ConfigItemDto[]): ConfigGroup[] {
  const map = new Map<string, ConfigGroup>()

  for (const item of items) {
    const name = item.groupName || "未分组"
    const gSort = item.groupName ? item.groupSort : 99999

    if (!map.has(name)) {
      map.set(name, { groupName: name, groupSort: gSort, items: [] })
    }
    map.get(name)!.items.push(item)
  }

  const groups = Array.from(map.values())
  groups.sort((a, b) => a.groupSort - b.groupSort)
  for (const g of groups) {
    g.items.sort((a, b) => a.sort - b.sort || a.key.localeCompare(b.key))
  }
  return groups
}
```

逐行精讲：

| 标记 | 代码 | 解读 |
|------|------|------|
| **【设计取舍】** | `Map<string, ConfigGroup>` | 用 Map 而非 Object！Map 的 key 保持插入顺序（Object 在旧版 JS 不保证），且 `has/get/set` 语义更清晰 |
| **【易错点】** | `item.groupName \|\| "未分组"` | 空字符串也归入"未分组"！`||` 会把 `null`、`undefined`、`""` 都当作 falsy。如果 `groupName` 合法值为空字符串，应改用 `??` |
| **【易错点】** | `gSort = item.groupName ? item.groupSort : 99999` | 未分组排最后！99999 是一个"足够大的数"，确保未分组始终在列表底部 |
| **【设计取舍】** | `a.sort - b.sort \|\| a.key.localeCompare(b.key)` | 双重排序！先按 `sort` 排序，`sort` 相同时按 `key` 字母序。`localeCompare` 支持中文排序 |
| **【易错点】** | `map.get(name)!.items.push(item)` | 非空断言 `!`！上面刚 `map.set` 过，一定有值。不加 `!` TypeScript 会报"可能是 undefined" |

### 3.2 isDangerous：风险关键词匹配

```typescript
function isDangerous(text: string): boolean {
  return /危险|失败|所有.*失败|无需认证|全部失败|切勿/.test(text)
}
```

这个正则的设计意图：

```
关键词匹配示例：

  "修改后所有请求失败"      → 匹配 "所有.*失败" → 红色（dangerous）
  "修改后可能导致登录失败"   → 匹配 "失败"      → 红色（dangerous）
  "仅影响导出功能"          → 不匹配           → 橙色（warning）
  "切勿在高峰期修改"        → 匹配 "切勿"      → 红色（dangerous）
  "修改后无需认证即可访问"   → 匹配 "无需认证"  → 红色（dangerous）
```

⚠️ **已知局限**：
1. 否定句误匹配：`"此配置修改不会导致服务失败"` → 匹配"失败" → 错误标红
2. 新关键词不覆盖：后端写了 `"极其危险"` 但正则只有 `"危险"`（还好，这个能匹配）
3. 无国际化支持：只支持中文关键词

> 🤔 **导师提问**：如果后端新增了一个配置项，`impactScope` 写的是"极其严重的影响"，`isDangerous` 正则能匹配到吗？答案是能——"危险"匹配不到，但"严重"也匹配不到。只有"极其危险"才能匹配。这里的核心问题是：**正则匹配是"白名单"策略**——只有显式列出的关键词才能命中。你能否想出一个"黑名单"策略的反例？提示：标绿所有不包含危险关键词的项。

---

## 四、多代理目标 vs 单网关：架构选择

⚠️ **【设计取舍】** 当前配置中心为每个微服务配置了独立的代理规则（5 个前缀 × 5 个 target）。另一种方案是使用**API 网关**（如 YARP、Kong、Ocelot），所有请求统一发给网关，由网关根据路径前缀路由到不同后端：

```
方案 A（当前）：多个代理目标
  浏览器 → Vite Proxy → 5 个后端（每个有自己的代理规则）

方案 B：API 网关
  浏览器 → Vite Proxy → API Gateway → 5 个后端（网关内部路由）

方案 C：BFF（Backend for Frontend）
  浏览器 → Vite Proxy → BFF 服务 → 5 个后端（BFF 聚合/裁剪数据）
```

```
┌────────────────┬──────────────────────┬───────────────────────────────┐
│ 方案            │ 优点                   │ 缺点                            │
├────────────────┼──────────────────────┼───────────────────────────────┤
│ 多代理目标       │ 简单、无额外服务         │ 前端需要知道所有后端地址          │
│（当前方案）      │ 开发体验好（直连后端）    │ 代理规则随微服务数量线性增长      │
├────────────────┼──────────────────────┼───────────────────────────────┤
│ API 网关        │ 统一入口、集中认证       │ 多一个服务要部署和维护            │
│                │ 前端只需知道网关地址      │ 开发环境也要部署网关              │
├────────────────┼──────────────────────┼───────────────────────────────┤
│ BFF            │ 前端定制数据格式         │ 复杂度最高                       │
│                │ 聚合多个后端请求          │ BFF 本身可能成为瓶颈             │
└────────────────┴──────────────────────┴───────────────────────────────┘
```

当前选择多代理目标的原因：1）微服务数量少（5 个），代理规则可管理；2）所有服务的 API 结构完全一致，不需要网关做数据转换；3）开发环境不想额外部署网关服务。

> 🤔 **导师提问**：当微服务数量从 5 个增长到 20 个，你还会坚持多代理目标方案吗？想一想 `vite.config.ts` 中 20 条代理规则的维护成本。这时候 API 网关的"统一入口"优势会变得非常明显。

---

## 五、配置中心最佳实践总结

### 5.1 组件设计

| 实践 | 说明 | ASP.NET Core 类比 |
|------|------|-------------------|
| Props 驱动多后端 | 同一组件不同 Props 复用 | 泛型基类 `Controller<TService>` |
| 组件内直接调 API | 不抽 API 层（4 个接口太简单） | 简单 CRUD 不写 Service 层 |
| `useMemo` 创建 HTTP | 避免每次渲染重建实例 | `IHttpClientFactory` 单例 |
| `EMPTY_FORM` 常量 | 统一表单初始值 | `new UpsertRequest()` 默认值 |

### 5.2 安全设计

| 实践 | 说明 | 风险 |
|------|------|------|
| 加密值显示 `******` | 默认隐藏敏感值 | 用户误以为值为空 |
| `showValues` 全局开关 | 一键显示/隐藏 | 忘记关就离开页面 |
| 编辑时 Key 禁用 | 防止误改业务主键 | 无法原地修改 Key |
| 删除二次确认 | 防误删 | 多一步操作 |
| `impactScope` 风险着色 | 高风险操作醒目提示 | 正则可能误匹配 |

### 5.3 用户体验

| 实践 | 说明 |
|------|------|
| 分组可折叠 | 配置项多时减少信息过载 |
| 搜索过滤 | Key/Description/Value 三字段模糊搜索 |
| 分组名下拉建议 | `<datalist>` 避免拼写不一致 |
| 5 秒热重载提示 | 明确告知用户生效时间 |
| 强制重载按钮 | 紧急场景立即可用 |
| 底部统计 | "共 N 条配置，M 个分组，K 条加密存储" |

### 5.4 性能考量

| 场景 | 当前方案 | 潜在问题 |
|------|---------|---------|
| 配置项 500+ | 前端 `useMemo` 过滤 | 大数组过滤可能卡顿 |
| 搜索实时过滤 | 每次输入都触发 `useMemo` | 快速打字可能频繁计算 |
| 分组排序 | 每次渲染都排序 | 已排好序的数组重复排序 |

💡 **优化方向**：500+ 配置项时可考虑 1）后端搜索（`?q=keyword`）代替前端过滤；2）虚拟滚动（`@tanstack/virtual`）避免渲染过多 DOM；3）防抖搜索（`useDeferredValue`）。

---

## 六、整体架构回顾

把配置中心的 5 节内容串起来，完整架构如下：

```
┌───────────────────────────────────────────────────────────────────┐
│                        浏览器端                                    │
│                                                                   │
│  路由层（App.tsx）：                                               │
│    /config/perm-center  → <ConfigPage serviceBaseUrl="/perm-api"/> │
│    /config/file-service → <ConfigPage serviceBaseUrl="/file-api"/> │
│    /config/print-service→ <ConfigPage serviceBaseUrl="/print-api"/>│
│    /config/miniapp-platform→ <ConfigPage serviceBaseUrl="/miniapp-api"/>│
│    /config/notification-center→ <ConfigPage serviceBaseUrl="/notify-api"/>│
│                          │                                        │
│                          ▼                                        │
│  组件层（ConfigPage）：                                            │
│    ┌──────────────────────────────────────────────┐               │
│    │  Props: serviceBaseUrl, serviceLabel          │               │
│    │  State: 14 个（数据3 + UI11）                 │               │
│    │  HTTP:   useMemo(() => createHttp(baseUrl))   │               │
│    │                                               │               │
│    │  数据流：                                      │               │
│    │    fetchItems() → items[] → groupConfigs()    │               │
│    │                  → filteredGroups[] → 渲染    │               │
│    │                                               │               │
│    │  交互：                                        │               │
│    │    新增/编辑 → Upsert Dialog → handleSubmit()  │               │
│    │    删除    → Delete Dialog  → handleDelete()   │               │
│    │    重载    → 无 Dialog      → handleReload()   │               │
│    │    搜索    → searchQuery → filteredGroups     │               │
│    │    折叠    → collapsedGroups → Collapsible    │               │
│    └──────────────────────────────────────────────┘               │
│                          │                                        │
│                          ▼ HTTP 请求                               │
│  Vite Proxy：                                                     │
│    /perm-api/*  → :10002/*                                       │
│    /file-api/*  → :10011/*                                       │
│    /print-api/* → :11010/*                                       │
│    /miniapp-api/*→ :5020/*                                       │
│    /notify-api/*→ :10012/*                                       │
└───────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────────────────┐
│  ASP.NET Core 后端（5 个微服务，API 结构相同）                      │
│                                                                   │
│  GET  /api/runtime-config        → ConfigItemDto[]                │
│  POST /api/runtime-config        → Upsert（新增/更新）             │
│  DELETE /api/runtime-config/{key} → 删除                          │
│  POST /api/runtime-config/reload  → 强制重载 IConfiguration        │
│                                                                   │
│  存储：PostgreSQL + AES-256 加密字段                              │
│  热重载：5 秒轮询 / IOptionsMonitor<T>                            │
└───────────────────────────────────────────────────────────────────┘
```

---

## 七、与 ASP.NET Core 的完整映射

| 前端概念 | ASP.NET Core 等价物 |
|---------|-------------------|
| `ConfigPage` 组件 | `ConfigController` 控制器 |
| `serviceBaseUrl` Props | `IHttpClientFactory.CreateClient(name)` |
| `createHttp(base)` | `services.AddHttpClient(name, config)` |
| Vite proxy rewrite | YARP `Transforms.AddPathRemovePrefix` |
| `ConfigItemDto` | C# `ConfigItemDto` class |
| `UpsertRequest` | C# `UpsertRequest` class |
| `groupConfigs()` | LINQ `GroupBy(g => g.GroupName).OrderBy(g => g.GroupSort)` |
| `isDangerous()` | 自定义 `IConfigurationValidator` |
| `showValues` 开关 | 日志中的 `[REDACTED]` 脱敏 |
| `handleReload()` | `IConfiguration.Reload()` |
| 5 秒热重载 | `IOptionsMonitor<T>.OnChange()` + 轮询 |
| `<Collapsible>` 分组 | `appsettings.json` 层级结构 |
| `<datalist>` 分组建议 | IntelliSense 配置 Schema |
| `encodeURIComponent(key)` | `WebUtility.UrlEncode(key)` |
| `toast.success()` | `TempData["Message"]` |
| `useState<Set<string>>` | `HashSet<string>` |
| `useMemo` 计算分组 | 缓存 LINQ 查询结果 |

---

## 🔧 验证步骤

在继续思考题之前，我们用实际操作验证本节的核心知识点：

### 验证 1：Vite Proxy 的 rewrite 行为

```
1. 打开 AdminWeb 项目，启动 vite dev（npm run dev）
2. 打开浏览器 DevTools → Network 面板
3. 访问 /config/perm-center，观察请求路径：浏览器发出 /perm-api/api/runtime-config
4. 查看后端收到的请求路径：确认被重写为 /api/runtime-config（可查看后端日志）
5. 临时注释掉 rewrite 规则，重启 dev server，再次请求——后端应返回 404
```

### 验证 2：changeOrigin 的作用

```
1. 确认代理配置中 changeOrigin: true
2. 在后端添加一个中间件，打印 Request.Headers["Host"]
3. 确认收到的 Host 是后端的地址（如 moklgy.me:10002），而不是 localhost:3000
4. 临时将 changeOrigin 改为 false，重新请求——某些后端框架会因 Host 不匹配而拒绝请求
```

### 验证 3：生产环境 Nginx 配置

```
1. 找到项目中的 nginx.conf 或部署配置
2. 确认 /perm-api/、/file-api/ 等前缀都有对应的 location 规则
3. 确认 proxy_pass 指向正确的后端地址，且尾部斜杠 / 的处理正确
4. 注意：proxy_pass http://backend/;（有斜杠）会重写路径，没有斜杠则保留原始路径
```

### 验证 4：分组与排序逻辑

```
1. 在配置中心页面，观察分组排列顺序
2. 确认 "未分组" 始终排在最后（groupSort = 99999）
3. 确认同一分组内的配置项按 sort 字段排序
4. 修改某个配置项的 groupSort 值，刷新页面验证排序变化
```

---

## ⚠️ 踩坑提醒

1. **Vite proxy 只在开发环境生效**：生产环境需要 Nginx/YARP 做同样的转发。不要因为"本地没问题"就忽略生产环境的 CORS 配置——Vite proxy 绕过了浏览器同源策略，生产环境不会自动绕过。
2. **`rewrite` 必须去掉前缀**：后端只注册了 `/api/runtime-config` 路由，不去掉 `/perm-api` 前缀会导致 404。但也有例外：如果后端也注册了带前缀的路由，不去掉反而正确——这增加了前后端耦合度。
3. **`changeOrigin: true` 不可省略**：不加的话请求头 `Host` 为 `localhost:3000`，某些后端框架（如 ASP.NET Core 的 Host Filtering 中间件）会因 Host 不匹配而拒绝请求。
4. **多代理目标方案的扩展性上限**：当微服务数量从 5 个增长到 20 个，`vite.config.ts` 中 20 条代理规则的维护成本会变得很高。此时应考虑迁移到 API 网关方案。

---

## 🤔 思考题

### 概念级（理解 Why）
1. 配置中心为什么没有 `api/config/` 目录？和其他模块（如 `api/notify/`）的设计思路有什么不同？
2. Vite proxy 的 `rewrite` 为什么必须去掉前缀？如果不去掉，后端会收到什么路径？

### 推理级（推导 What-if）
3. 如果新增了第 6 个微服务"报表中心"（`/report-api` → `:10020`），需要修改哪些文件？列出完整清单。
4. 如果 5 个后端微服务的配置 API 路径不同（比如权限中心用 `/api/runtime-config`，文件服务用 `/api/settings`），当前的 Props 驱动架构还能复用吗？需要怎么改？

### 动手级（代码实践）
5. 给 `ConfigPage` 增加一个 `apiPrefix` Props（默认值 `/api/runtime-config`），让 API 路径也可配置。修改路由配置和组件代码。
6. 实现配置项的"历史记录"功能：每次保存时记录修改前的值，页面上增加"查看历史"按钮展示变更时间线。

---

## ✅ 输出检查清单

完成本节后，你应该能回答：

- [ ] 理解 5 个 Vite proxy 规则的作用和 `rewrite` 的必要性
- [ ] 能画出从浏览器到后端的完整请求链路
- [ ] 理解配置中心为什么不抽 API 层的原因
- [ ] 掌握 `groupConfigs` 分组函数的实现逻辑
- [ ] 知道 `isDangerous` 正则匹配的已知局限
- [ ] 理解生产环境用 Nginx/YARP 替代 Vite proxy
- [ ] 能说出配置中心的关键最佳实践（安全、性能、用户体验）
- [ ] 理解多代理目标 vs API 网关 vs BFF 三种架构方案的权衡
- [ ] 知道开发环境 CORS 陷阱：Vite proxy 绕过了同源策略，生产环境需要额外配置
- [ ] 理解 Vite proxy 在开发环境增加了请求延迟的额外一跳

---

[← 上一篇：04-加密值交互逻辑](04-加密值交互逻辑.md) | [目录](../README.md)
