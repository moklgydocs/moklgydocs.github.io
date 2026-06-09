# 01 - RBAC 模型与权限树

> **这一步解决什么问题？** 我们要理解 SaaS 平台权限中心的"灵魂"——RBAC 模型。就像 ASP.NET Core 里的 `[Authorize(Roles = "Admin")]` 一样，前端需要知道"用户能做什么"才能控制页面的显示和操作。但 SaaS 场景比单体应用复杂得多：多租户、多应用、权限树、公开/私有角色……这些概念如果不清，后面写代码就是在盲人摸象。

---

## 前置知识

阅读本文档前，你需要了解：

- **ASP.NET Core 基础**：`[Authorize]` 特性、`ClaimsPrincipal`、`IdentityRole` 的用法
- **TypeScript 基础**：`interface`、泛型、联合类型
- **React 基础**：`useState`、`useEffect`、`useCallback` 的基本用法
- **RESTful API**：GET/POST/PUT/DELETE 的语义差异，特别是 PUT 的幂等性

---

## 一、ASP.NET Core 类比：为什么我们需要自己的 RBAC？

在 ASP.NET Core 里，我们习惯了这样的模式：

```
[Authorize(Roles = "Admin")]    // 角色名硬编码在 Controller 上
public IActionResult Delete() { ... }
```

这在小系统里够用，但 SaaS 平台面临几个挑战：

| 挑战 | ASP.NET Core 默认方案 | 我们的 SaaS 方案 |
|------|----------------------|-------------------|
| 多应用 | 每个应用各写一套 `[Authorize]` | 权限中心统一管理所有应用 |
| 多租户 | 需要自己实现 Tenant 隔离 | 租户天然隔离，角色/权限按租户独立 |
| 权限层级 | 平铺的 Role 名称 | 权限分组 + 权限定义，形成树形结构 |
| 动态菜单 | 硬编码路由 | 后端按权限返回菜单树，前端动态渲染 |
| 权限粒度 | 粗粒度（角色级别） | 细粒度（操作权限 + 数据权限） |

### 1.1 ASP.NET Core Identity 对比速查表

如果我们把 SaaS 权限中心的 RBAC 概念映射到 ASP.NET Core Identity，对应关系是这样的：

| SaaS 权限中心概念 | ASP.NET Core Identity 对应 | 说明 |
|-------------------|---------------------------|------|
| 应用 (App) | — | Identity 没有多应用概念，每个项目独立 |
| 权限组 (PermissionGroup) | — | Identity 没有分组，角色直接平铺 |
| 权限定义 (PermissionDefinition) | `Claim` / `Policy` | 如 `Claim("Permission", "Purchase.Approve")` |
| 角色 (Role) | `IdentityRole` | 都支持 N:M 用户-角色关系 |
| 公开/私有角色 | — | Identity 不区分角色可见性 |
| 全量替换 | — | Identity 使用 `UserManager.AddToRoleAsync` 增量操作 |
| 权限树 | — | Identity 没有树形权限结构 |

> **🤔 导师提问**：ASP.NET Core 的 `ClaimsPrincipal` 已经可以在每个请求里携带用户的 Claim 信息。为什么我们的 SaaS 平台不直接用 Claim 作为权限标识，而要另建一套权限定义体系？提示：想想多应用场景下 Claim 的数量膨胀问题。

---

## 二、RBAC N:M 模型核心图解

RBAC（Role-Based Access Control）的核心是 **用户-角色-权限** 三者的 N:M 关系：

```
┌────────┐     N:M     ┌────────┐     N:M     ┌────────────┐
│  用户   │ ◄────────► │  角色   │ ◄────────► │   权限      │
│ (User)  │             │ (Role)  │             │ (Permission)│
└────────┘             └────────┘             └────────────┘
     │                       │                       │
     │                       │                       │
     ▼                       ▼                       ▼
  SSO 系统              PermCenter             权限定义表
  (用户池)            (角色管理)            (分组+定义)
```

**关键理解**：
- 一个用户可以拥有多个角色（张三同时是"采购员"和"审批人"）
- 一个角色可以包含多个权限（"采购经理"包含所有采购相关权限）
- 权限不是平铺的列表，而是**树形结构**（分组 → 定义 → 子定义）

### 2.1 权限树结构

```
应用 (App): mok-erp-service
│
├── 权限组 (Group): Purchase — 采购管理
│   ├── 权限定义: Purchase.View       [操作权限] ✓
│   ├── 权限定义: Purchase.Create      [操作权限] ✓
│   ├── 权限定义: Purchase.Approve      [操作权限] ✓
│   └── 权限定义: Purchase.DataScope   [数据权限] ✓
│
├── 权限组 (Group): Inventory — 库存管理
│   ├── 权限定义: Inventory.View       [操作权限] ✓
│   └── 权限定义: Inventory.Adjust     [操作权限] ✗ (禁用)
│
└── 权限组 (Group): Report — 报表管理
    ├── 权限定义: Report.View           [操作权限] ✓
    └── 权限定义: Report.Export         [操作权限] ✓
```

⚠️ **注意**：权限组（Group）和权限定义（Definition）是**两层**结构。组用来分类，定义才是真正的权限点。一个组下可以有多个权限定义，权限定义还可以嵌套子定义（形成更深的树）。

> **🤔 导师提问**：权限定义支持无限嵌套（`children: PermissionDefinitionDto[]`），但在实际业务中，嵌套超过 3 层的权限树几乎没出现过。为什么？想想权限检查时的匹配逻辑——嵌套越深，`name` 命名越难保持一致性。

### 2.2 两种权限类型

| 类型 | 值 | 含义 | 示例 |
|------|---|------|------|
| 操作权限 | `type = 0` | 用户能否执行某个操作 | `Purchase.Approve` — 能否审批采购单 |
| 数据权限 | `type = 1` | 用户能看到什么范围的数据 | `Purchase.DataScope` — 能看哪些供应商的采购单 |

💡 **ASP.NET Core 类比**：操作权限 ≈ `[Authorize(Policy = "Purchase.Approve")]`，数据权限 ≈ `IAuthorizationRequirement` 里对数据范围的过滤条件。

---

## 三、代码实现：权限树的渲染算法

在 AdminWeb 的权限管理页面，我们面对的是后端返回的**嵌套树结构**，但 UI 表格（AgTable）需要的是**扁平行数据**。这就需要一个"树扁平化"的过程。

### 3.1 核心算法：递归扁平化

```typescript
// src/pages/perm/permissions/index.tsx

/** 递归将权限定义树扁平化为行数据 */
function flattenPermissions(
  perms: PermissionDefinitionDto[],
  depth: number,
  groupCode: string,
  expandedIds: Set<string>,
  rows: FlatPermRow[],
) {
  for (const perm of perms) {
    rows.push({
      id: perm.id,
      rowType: "permission",
      depth,
      displayName: perm.displayName,
      code: perm.name,
      groupCode,
      type: perm.type,
      isEnabled: perm.isEnabled,
      sort: perm.sort,
      hasChildren: perm.children.length > 0,
      _permDto: perm,
    })
    // 仅展开的节点才递归处理子级
    if (perm.children.length > 0 && expandedIds.has(perm.id)) {
      flattenPermissions(perm.children, depth + 1, groupCode, expandedIds, rows)
    }
  }
}
```

这个递归算法的三个关键点：

1. **`depth` 参数控制缩进**：每进入一层子节点，`depth + 1`，UI 根据 `depth * 20px` 计算左侧缩进
2. **`expandedIds` 控制展开/折叠**：只有展开的节点才会递归其子节点，避免一次性渲染整棵树
3. **`_permDto` 保留原始引用**：扁平化后的行数据仍持有原始 DTO 的引用，方便操作时直接取值

> **🤔 导师提问**：这段递归代码的终止条件是什么？如果把 `expandedIds` 换成一个永远包含所有 ID 的 Set，会发生什么？

⚠️ **【易错点】递归渲染缺少终止条件**：在递归渲染权限树时，如果后端数据出现循环引用（比如 A 的 `children` 包含 B，B 的 `children` 又包含 A），递归将无限进行下去，导致浏览器栈溢出崩溃。AdminWeb 的做法是：**信任后端数据无环**，只通过 `expandedIds` 控制渲染深度。如果需要防御性编程，可以在递归时维护一个 `visitedIds: Set<string>`，遇到已访问的 ID 就跳过。

### 3.2 扁平行类型设计

```typescript
// src/pages/perm/permissions/index.tsx

interface FlatPermRow {
  id: string
  rowType: "group" | "permission"  // 区分权限组行和权限定义行
  depth: number                     // 缩进层级
  displayName: string
  code: string
  groupCode: string
  type?: number                     // 0=操作权限，1=数据权限
  isEnabled?: boolean
  sort: number
  hasChildren: boolean
  childCount?: number               // 子权限总数（仅权限组）
  enabledCount?: number             // 已启用子权限数（仅权限组）
  _groupDto?: PermissionGroupDto    // 原始权限组引用
  _permDto?: PermissionDefinitionDto // 原始权限定义引用
}
```

> **🤔 导师提问**：为什么 `FlatPermRow` 要同时保留 `rowType` 字段和 `_groupDto` / `_permDto` 引用？只保留引用不就能通过 `null` 判断类型了吗？提示：想想 `AgTable` 列渲染函数的性能——每次判断类型都要做 `null` 检查 vs 读一个枚举字段，哪个更快？

⚠️ **【性能陷阱】深层权限树的渲染**：当权限定义嵌套层级很深（如超过 5 层）或单层子节点数量很大（如超过 200 个权限定义）时，一次性扁平化整棵树可能导致大量 DOM 节点被创建。AdminWeb 当前使用 `expandedIds` 只渲染展开的部分来控制渲染量。如果未来权限量极大，可以考虑引入**虚拟滚动**（如 `@tanstack/virtual`），只渲染视口可见的行。

---

## 四、角色：公开 vs 私有

```
┌──────────────────────────────────────────────┐
│                   角色                         │
│                                              │
│  ┌─────────────────┐  ┌─────────────────┐   │
│  │   公开角色        │  │   私有角色        │   │
│  │  (isPublic=true)│  │ (isPublic=false) │   │
│  ├─────────────────┤  ├─────────────────┤   │
│  │ 可分配给         │  │ 仅管理员可分配     │   │
│  │ 任意用户         │  │ 给指定用户        │   │
│  ├─────────────────┤  ├─────────────────┤   │
│  │ 如：采购员、      │  │ 如：系统管理员、   │   │
│  │ 普通用户         │  │ 超级管理员        │   │
│  └─────────────────┘  └─────────────────┘   │
└──────────────────────────────────────────────┘
```

**为什么需要区分公开和私有？**

- **公开角色**：业务部门主管可以自行给下属分配"采购员"角色，不需要 IT 介入
- **私有角色**："超级管理员"这类高风险角色，只有 IT 管理员才能分配，防止权限提升攻击

⚠️ 在前端 UI 中，公开/私有角色用不同的 Badge 显示，让管理员一目了然。

---

## 五、全量替换语义（Full-Replace）

这是一个**极易踩坑**的设计决策。当给角色分配权限时，前端发送的不是"增删哪些权限"，而是**该角色应该拥有的所有权限的完整列表**：

```
┌──────────────────────────────────────────┐
│         全量替换 vs 增量更新               │
│                                          │
│  增量更新（我们没用）：                    │
│    { add: ["Perm.A", "Perm.B"],          │
│      remove: ["Perm.C"] }                │
│                                          │
│  全量替换（我们的方案）：                   │
│    { permissions: ["Perm.A", "Perm.B",    │
│                    "Perm.D"] }            │
│                                          │
│  服务端收到后：                            │
│    1. 清空该角色所有旧权限                  │
│    2. 写入新列表中的所有权限                │
└──────────────────────────────────────────┘
```

**为什么选全量替换？**

1. **幂等性**：同样的请求发多次，结果一致（增量更新不是幂等的）
2. **避免竞态**：两人同时修改不同权限，增量可能导致互相覆盖；全量替换则是"后写入者赢"，语义清晰
3. **前端简单**：不需要追踪"改了什么"，只需提交当前勾选状态

💡 这和 ASP.NET Core 的 `PUT` 语义一样——用完整资源替换，而非部分修改。

⚠️ **【易错点】权限检查的时机**：在全量替换语义下，前端提交权限后，**必须重新获取角色权限**才能反映最新状态。如果在提交后直接读取本地缓存的旧权限列表做 UI 更新，会导致显示与实际不一致。AdminWeb 的做法是：提交成功后调用 `fetchGroups()` 重新从后端拉取。

---

## 六、应用代码与 OAuth2 Client ID 的关系

```
┌─────────────────────────────────────────────┐
│                  AuthServer                   │
│                                              │
│   OAuth2 Client                              │
│   ┌──────────────────┐                      │
│   │ client_id:        │                      │
│   │ "mok-erp-service" │◄─── 同一个值 ───┐     │
│   └──────────────────┘                  │     │
│                                         │     │
│   ┌──────────────────┐                  │     │
│   │ client_id:        │                  │     │
│   │ "mok-web-app"     │◄─── 同一个值 ─┐ │     │
│   └──────────────────┘               │ │     │
└─────────────────────────────────────│─│─────┘
                                      │ │
┌─────────────────────────────────────│─│─────┐
│                 PermCenter          │ │     │
│                                    │ │     │
│   应用表 (App)                     │ │     │
│   ┌──────────────────┐            │ │     │
│   │ code:             │            │ │     │
│   │ "mok-erp-service" │◄──────────┘ │     │
│   └──────────────────┘              │     │
│   ┌──────────────────┐            │     │
│   │ code:             │            │     │
│   │ "mok-web-app"     │◄──────────┘     │
│   └──────────────────┘                  │
└────────────────────────────────────────┘
```

**核心规则**：PermCenter 中每个应用的 `code` 字段，**必须**与 AuthServer 中的 OAuth2 `client_id` 完全一致。

**为什么？**

- 用户登录后，JWT Token 中的 `client_id` 标识了用户是从哪个应用发起的登录
- 权限中心根据 `appCode` 查询该应用下的角色和权限
- 如果 `code` 和 `client_id` 不一致，权限查询就会失败

⚠️ **【易错点】** 创建应用时，`code` 字段一旦创建就不可修改（因为已经被角色、权限、菜单等大量引用）。所以必须确保第一次就填对！

---

## 七、权限存储的设计取舍

> **🤔 导师提问**：我们目前用**嵌套树结构**存储权限（`PermissionDefinitionDto.children`），但很多系统用的是**扁平列表 + parentId**的方式。两种方案各有什么优劣？

### 【设计取舍】嵌套树 vs 扁平列表

| 维度 | 嵌套树（我们的方案） | 扁平列表 + parentId |
|------|---------------------|---------------------|
| 前端渲染 | 后端已组装好树，前端直接递归渲染 | 前端需要自己组装树（`parentId` → `children`） |
| API 传输 | 树形 JSON，层级关系一目了然 | 扁平数组，传输体积略小 |
| 数据库存储 | 后端负责 `parentId` → 树的组装 | 直接存储 `parentId`，无需组装 |
| 移动节点 | 后端处理子树移动，前端只需刷新 | 前端只改一个 `parentId` 字段 |
| 缓存 | 整棵树作为整体缓存 | 单个节点可以独立缓存/失效 |

**为什么选嵌套树？** 权限树的数据量通常不大（一个应用几十到几百个权限点），树形 JSON 的传输开销可以忽略。而后端预组装树，可以让前端免去手动构建树形结构的麻烦，保持前端代码简洁。

---

## 八、动态菜单系统

RBAC 模型中的权限最终会驱动**菜单的动态显示**：

```
用户登录 → 获取 Token → 请求 /api/menus/current?appCode=admin-web
                                          │
                                          ▼
                               PermCenter 按用户权限过滤
                                          │
                                          ▼
                               返回菜单树（仅包含有权限的菜单项）
                                          │
                                          ▼
                               前端动态渲染侧边栏
```

菜单类型定义：

```typescript
// 来源：types/index.ts
export const MENU_TYPE = {
  Directory: 0,    // 目录 — 可折叠的分组
  Menu: 1,         // 菜单 — 对应一个页面路由
  Button: 2,       // 按钮 — 页面内的操作权限（不在侧边栏显示）
  ExternalLink: 3, // 外链 — 点击跳转外部 URL
} as const
```

💡 **ASP.NET Core 类比**：这就像 `[Authorize]` 特性控制了哪些 Controller/Action 可以被访问，但前端更进一步——没权限的菜单直接不渲染，用户甚至不知道那些功能的存在。

---

## 九、核心类型定义速览

在写代码前，我们先过一遍核心的 TypeScript 类型。这些类型定义在 `src/types/index.ts` 中：

```typescript
// ── 应用 ──
export interface AppDto {
  id: string
  code: string          // 必须与 OAuth2 Client ID 一致
  name: string
  description: string | null
  logoUrl: string | null
  isEnabled: boolean
  sort: number
}

// ── 权限分组 ──
export interface PermissionGroupDto {
  id: string
  code: string           // 如 "Purchase"
  displayName: string    // 如 "采购管理"
  sort: number
  permissions: PermissionDefinitionDto[]  // 组下的权限定义列表
}

// ── 权限定义（支持嵌套） ──
export interface PermissionDefinitionDto {
  id: string
  name: string           // 如 "Purchase.Approve"
  displayName: string    // 如 "审批采购单"
  parentId: string | null
  type: number           // 0=操作权限, 1=数据权限
  isEnabled: boolean
  sort: number
  children: PermissionDefinitionDto[]   // 子权限定义（形成更深的树）
}

// ── 角色 ──
export interface RoleDto {
  id: string
  appId: string
  code: string            // 如 "manager"
  name: string            // 如 "采购经理"
  description: string | null
  isDefault: boolean
  isStatic: boolean       // 系统内置角色，不可删除
  isPublic: boolean       // 公开/私有
  isEnabled: boolean
  sort: number
}

// ── 菜单 ──
export interface MenuDto {
  id: string
  name: string
  code: string
  path: string | null     // 前端路由路径
  icon: string | null      // lucide 图标名
  type: MenuType           // Directory/Menu/Button/ExternalLink
  permissionName: string | null  // 关联的权限名称
  parentId: string | null
  isVisible: boolean
  isEnabled: boolean
  sort: number
  children: MenuDto[]
}

// ── 用户角色关联 ──
export interface UserWithRolesDto {
  userId: string
  userName: string | null
  displayName: string | null
  appCode: string
  appName: string
  roles: RoleDto[]
}

// ── 租户成员 ──
export interface TenantMemberDto {
  id: string
  tenantId: string
  userId: string
  userName: string
  displayName: string | null
  email: string | null
  phoneNumber: string | null
  employeeNo: string | null
  isActive: boolean
  joinedAt: string
}
```

---

## 十、权限 API：管理员视图 vs 普通视图

权限 API 有两个获取端点，适用于不同场景：

```typescript
// src/api/perm/permissions.ts
export const permissionsApi = {
  /** 管理员视图：获取指定应用的所有权限定义（包含全部分组） */
  getAllDefinitions(appCode: string) {
    return get<PermissionGroupDto[]>("/api/permissions/admin/definitions", { appCode })
  },

  /** 普通视图：获取指定应用的权限定义（仅可见分组） */
  getDefinitions(appCode: string) {
    return get<PermissionGroupDto[]>("/api/permissions/definitions", { appCode })
  },

  /** 创建权限分组 */
  createGroup(data: CreatePermissionGroupRequest) {
    return post<PermissionGroupDto>("/api/permissions/groups", data)
  },

  /** 更新权限分组 */
  updateGroup(id: string, data: UpdatePermissionGroupRequest) {
    return put<void>(`/api/permissions/groups/${id}`, data)
  },

  /** 删除权限分组 */
  deleteGroup(id: string) {
    return del<void>(`/api/permissions/groups/${id}`)
  },

  /** 创建权限定义 */
  createDefinition(data: CreatePermissionDefinitionRequest) {
    return post<{ id: string }>("/api/permissions/definitions", data)
  },

  /** 更新权限定义 */
  updateDefinition(id: string, data: UpdatePermissionDefinitionRequest) {
    return put<void>(`/api/permissions/definitions/${id}`, data)
  },

  /** 删除权限定义 */
  deleteDefinition(id: string) {
    return del<void>(`/api/permissions/definitions/${id}`)
  },
}
```

> **🤔 导师提问**：`getAllDefinitions` 和 `getDefinitions` 返回的都是 `PermissionGroupDto[]`，但后者的某些分组可能被隐藏了。什么场景下权限组需要"对普通用户不可见"？想想数据权限分组——某些数据权限的分组名可能暴露了系统内部的数据划分策略。

---

## 十一、整体数据流

把上面所有概念串联起来，完整的数据流是这样的：

```
1. 管理员创建应用 → code = OAuth2 Client ID
2. 管理员在应用下创建权限组 + 权限定义 → 形成权限树
3. 管理员创建角色 → 将权限分配给角色
4. 管理员将角色分配给用户 → 用户获得权限
5. 用户登录 → 后端根据角色过滤菜单 → 前端渲染侧边栏
6. 用户操作 → 前端检查权限 → 允许/拒绝
```

> **🤔 导师提问**：在第 6 步"前端检查权限"中，前端只是**隐藏**了没有权限的按钮，但没有**阻止**用户手动输入 URL 访问。这意味着真正的权限校验必须在后端完成。前端权限检查的价值到底是什么？

---

## 踩坑提醒

1. **权限树递归无终止条件**：如果后端数据出现循环引用（A 的 `children` 包含 B，B 的 `children` 又包含 A），递归将无限进行导致浏览器栈溢出。AdminWeb 信任后端数据无环，仅通过 `expandedIds` 控制渲染深度。如果需要防御性编程，可以在递归时维护 `visitedIds: Set<string>`。
2. **全量替换后必须重新获取**：在全量替换语义下，前端提交权限后必须重新调用 `fetchGroups()` 从后端拉取最新数据，不能直接读取本地缓存的旧权限列表做 UI 更新，否则显示与实际不一致。
3. **应用 code 创建后不可修改**：`code` 字段一旦创建就被角色、权限、菜单大量引用，且必须与 AuthServer 的 OAuth2 `client_id` 一致。创建时务必确保填写正确。
4. **前端权限检查不能替代后端校验**：前端只是隐藏没有权限的按钮，用户仍可通过手动输入 URL 绕过。真正的权限校验必须在后端完成，前端权限检查的价值是提升用户体验（避免展示用户无法使用的功能）。

---

## 🔍 验证步骤

在继续下一章之前，请确认你已经理解了以下内容：

1. **RBAC N:M 关系**：能画出"用户 → 角色 → 权限"的三方关系图，解释为什么是 N:M 而不是 1:N
2. **权限树结构**：能区分权限组（Group）和权限定义（Definition），理解 `children` 字段的递归嵌套
3. **全量替换语义**：能解释为什么选择全量替换而非增量更新，以及这对前端提交逻辑的影响
4. **应用代码与 OAuth2 关联**：能说明 `appCode` 和 `client_id` 为什么必须一致，以及创建后不可修改的原因
5. **权限 API 两个视图**：能区分 `getAllDefinitions` 和 `getDefinitions` 的使用场景

---

## 🤔 思考题

### 概念级（理解）
1. 为什么权限定义用 `name`（如 `Purchase.Approve`）而不是 `id` 作为唯一标识？这对权限检查有什么好处？
2. 如果一个用户同时拥有"采购员"和"库存管理员"两个角色，权限是取交集还是并集？为什么？

### 推理级（分析）
3. 全量替换语义下，如果两个管理员同时给同一个角色分配不同的权限集，最终结果是什么？这和 Git 的合并冲突有什么异同？
4. 为什么 `PermissionDefinitionDto` 的 `children` 字段可以形成递归嵌套，但 `PermissionGroupDto` 下只有一层 `permissions`？这种设计取舍的考量是什么？

### 动手级（动手）
5. 假设你需要给"报表查看"权限加上"只能看本部门数据"的限制，应该用操作权限还是数据权限？请设计权限定义的 `name` 和 `type`。
6. 如果要求"禁用权限组后，组内所有权限定义也自动禁用"，你会在前端还是后端实现这个逻辑？为什么？
7. **打开 AdminWeb 的权限管理页面**（`src/pages/perm/permissions/index.tsx`），找到 `flattenPermissions` 函数。现在请你修改这个函数，增加一个 `maxDepth` 参数，当递归深度超过 `maxDepth` 时停止展开子节点。修改后，在 `flattenTree` 中将 `maxDepth` 设为 3，验证超过 3 层嵌套的权限定义不会被渲染。思考：这种限制在实际业务中是否合理？什么时候需要解除限制？

---

## 输出检查清单

| 文件 | 说明 |
|------|------|
| `01-RBAC模型与权限树.md` | RBAC N:M 模型、权限树、权限类型、公开/私有角色、全量替换、应用代码与 OAuth2 关系 |

---

[上一节：00-权限中心概览](00-权限中心概览.md) | [下一节：02-应用管理](02-应用管理.md)
