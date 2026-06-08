# Node 与包管理器

> **这一步解决什么问题？**
>
> 我们要搭建 React 开发环境，但面前有太多选择：Vite 还是 CRA？npm 还是 pnpm？TypeScript 值得学吗？这一步我们做出所有技术选型决策，并理解每个选择背后的"为什么"。

---

## React 是什么

React 是一个用于构建用户界面的 JavaScript 库，由 Meta（Facebook）开源维护。它的核心思想有三点：

- **组件化**：一切皆组件，UI 由嵌套的组件树构成。如果我们写过 ASP.NET Core 的 Razor 组件（Blazor），或者用过局部视图（Partial View），组件化并不陌生——把 UI 拆成独立、可复用的小块。
- **声明式**：我们描述"UI 应该长什么样"，React 负责高效更新 DOM。类比 C# 的 LINQ：我们告诉它"要什么"，而不是"怎么做"。
- **单向数据流**：数据从父组件流向子组件，状态管理清晰可预测。这和后端的依赖注入思路类似——依赖向下传递，不反向依赖。

### React 组件的心智模型

用代码来感受 React 组件的本质——一个返回 UI 的函数：

```tsx
// 一个最简单的计数器组件：状态 → UI 的映射
import { useState } from "react"

function Counter() {
  const [count, setCount] = useState(0)  // 状态

  // UI 是状态的函数：f(state) = UI
  return (
    <div>
      <p>当前计数：{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
```

💡 关键理解：`count` 变化时，React 自动重新执行这个函数，生成新的 UI。我们不需要手动操作 DOM，只需要描述"状态和 UI 的关系"。

> **🤔 导师提问**：如果 `count` 不是简单数字而是一个对象，比如 `{ name: "张三", age: 25 }`，直接修改 `count.age = 26` 会触发 UI 更新吗？为什么？

⚠️ **易错认知**：React 组件 ≈ ASP.NET Core 的 Controller + View 合体。每个组件有自己的"状态"（类似 ViewModel）和"渲染逻辑"（类似 Razor 模板），但它们是同一个文件里的。

---

## 前端开发的新心智模型

💡 **从后端转前端，最大的思维转变**是：**UI 是状态的函数**。

```
后端思维：请求 → 处理 → 返回响应（一次性的）
前端思维：状态变化 → UI 自动更新（持续响应的）
```

React 让我们把 UI 写成 `f(state) = UI`，当 `state` 变化时，React 自动重新计算 UI。

### jQuery vs React：命令式 vs 声明式

如果我们之前用 jQuery 写过前端，体会会更深。同样是"点击按钮，数字+1"：

```javascript
// jQuery（命令式）：告诉浏览器"怎么做"
<div>
  <p id="count">当前计数：0</p>
  <button id="btn">+1</button>
</div>

<script>
  let count = 0
  $("#btn").on("click", function() {
    count++
    $("#count").text("当前计数：" + count)  // 手动找到 DOM 节点，手动更新
  })
</script>
```

```tsx
// React（声明式）：告诉 React"UI 应该长什么样"
function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>当前计数：{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
```

核心区别：

| | jQuery（命令式） | React（声明式） |
|---|---|---|
| 思维方式 | "我要操作哪个 DOM 节点" | "UI 应该根据状态长什么样" |
| 更新方式 | 手动查找 DOM，手动修改 | 状态变化后，React 自动更新 |
| 代码量（简单场景） | 差不多 | 差不多 |
| 代码量（复杂场景） | 指数级增长 | 线性增长 |
| Bug 风险 | DOM 操作顺序容易出 Bug | 只需关注状态，不容易出错 |

💡 类比后端：jQuery 像手写 ADO.NET 逐行操作数据库，React 像 ORM——我们只描述"数据模型"，框架帮我们处理底层的 SQL 执行。

> **🤔 导师提问**：在 jQuery 中，10 个按钮分别控制 10 个 DOM 节点，代码量是线性的。但如果这 10 个节点之间有依赖关系（如选中一个，其他要取消），jQuery 的代码量会怎么增长？React 的呢？

---

## Vite vs Create React App

| 特性 | Vite | CRA (已废弃) |
|------|------|------|
| 启动速度 | 毫秒级 (ESM) | 秒级 (Webpack 打包) |
| HMR 速度 | 极快 | 较慢 |
| 构建工具 | Rolldown/Rollup | Webpack |
| 配置复杂度 | 低 | 高 |
| 生态趋势 | 主流推荐 | 已停止维护 |

**结论**：新项目一律用 Vite。

### Vite 为什么快？ESM 原理

Vite 之所以快，是因为它利用了浏览器原生 ESM（ES Modules）：

```
传统 Webpack：
  启动 → 打包所有模块 → 生成 bundle → 浏览器加载 bundle

Vite：
  启动 → 不打包 → 浏览器按需 import 模块 → 服务端按需编译
```

💡 类比后端：Webpack 像是"预编译所有代码再启动"（AOT），Vite 像是"按需 JIT 编译"。ASP.NET Core 的分层编译也有类似的思想——先快速启动，再按需优化。

> **🤔 导师提问**：如果 Vite 开发时按需编译这么快，为什么生产构建还需要用 Rolldown 全量打包？直接用浏览器的 ESM 加载不行吗？

---

## TypeScript 的必要性

企业级项目必须有类型安全。作为 C# 开发者，我们应该很自然地接受 TypeScript——它就是 JavaScript 加上了类型系统，和 C# 对 C 的关系一样。

```typescript
// 没有 TypeScript：运行时才知道报错
function getUser(id) {
  return fetch(`/api/users/${id}`) // 返回值是什么？不知道
}

// 有 TypeScript：编译时就能发现错误
interface User {
  id: string
  userName: string
  email: string
}

async function getUser(id: string): Promise<ApiResult<User>> {
  return http.get<User>(`/api/users/${id}`)
}
```

TypeScript 的类型系统和我们熟悉的 C# 非常相似：

| C# | TypeScript | 说明 |
|----|-----------|------|
| `interface` | `interface` | 接口定义 |
| `class` | `class` | 类定义 |
| `enum` | `enum` / `const as const` | 枚举 |
| `泛型<T>` | `泛型<T>` | 泛型 |
| `?` 可空 | `?` 可选 | 可空/可选 |
| `async/await` | `async/await` | 异步 |

### 【设计取舍】`as const` vs `enum`

⚠️ **设计取舍**：TypeScript 的 `enum` 在编译后会生成一段运行时代码，而 `as const` 只在类型层存在。AdminWeb 中大量使用 `as const` 来定义枚举常量，这是更轻量的做法。

来看 AdminWeb `src/types/index.ts` 中的实际用法：

```typescript
// AdminWeb 实际代码：用 as const 定义枚举常量

// 访问级别 - 运行时常量
export const ACCESS_LEVEL = {
  Private: 0,
  TenantPublic: 1,
  Public: 2,
} as const

// 从常量对象推导类型
export type AccessLevel = (typeof ACCESS_LEVEL)[keyof typeof ACCESS_LEVEL]

// 还可以定义中文标签映射
export const FILE_PERMISSION = {
  Read: "Read",
  Write: "Write",
  Delete: "Delete",
} as const

export type FilePermission = (typeof FILE_PERMISSION)[keyof typeof FILE_PERMISSION]

export const FILE_PERMISSION_LABELS: Record<FilePermission, string> = {
  [FILE_PERMISSION.Read]: "读取",
  [FILE_PERMISSION.Write]: "写入",
  [FILE_PERMISSION.Delete]: "删除",
}
```

> **🤔 导师提问**：`enum` 可以用 `Object.values()` 遍历所有值来生成下拉框选项，`as const` 也能做到吗？提示：看看 `FILE_PERMISSION_LABELS` 是怎么实现的。

对比 `enum` 写法：

```typescript
// TypeScript enum 写法（编译后会生成运行时代码）
enum AccessLevel {
  Private = 0,
  TenantPublic = 1,
  Public = 2,
}
// 编译结果：会生成一个 IIFE 函数和双向映射对象
```

💡 **为什么 AdminWeb 选择 `as const`？** 三个原因：
1. **零运行时开销**：`as const` 编译后就是普通对象，enum 会生成额外代码
2. **tree-shaking 友好**：没有 IIFE，打包工具可以更好地移除未使用代码
3. **标签映射更方便**：`as const` + `Record<Type, string>` 可以直接生成中文标签映射，enum 做不到这么优雅

---

## pnpm 与 corepack

AdminWeb 使用 pnpm 作为包管理器，我们来看为什么：

- **速度快**：硬链接机制，不重复下载。类比 NuGet 的全局包缓存。
- **严格依赖隔离**：避免幽灵依赖（phantom dependencies）。npm/yarn 的 `node_modules` 是扁平的，我们可以引用未在 `package.json` 中声明的包；pnpm 用符号链接严格隔离，杜绝这个问题。
- **磁盘占用小**：同一台机器上的多个项目共享同一份依赖。

```bash
# 启用 corepack 管理 pnpm 版本
corepack enable
corepack prepare pnpm@latest --activate
```

💡 **corepack 是什么？** Node.js 内置的包管理器版本管理工具，类似 `nvm` 管理 Node 版本，但 corepack 管理的是 pnpm/yarn 的版本。在 `package.json` 中声明 `"packageManager": "pnpm@9.x.x"` 后，corepack 会自动使用对应版本。

| npm | pnpm | 类比 |
|-----|------|------|
| `npm install` | `pnpm install` | 安装依赖 |
| `npm add xxx` | `pnpm add xxx` | 添加依赖 |
| `npm run dev` | `pnpm dev` | 运行脚本 |
| `npx xxx` | `pnpm dlx xxx` | 执行远程包 |

### pnpm 的符号链接结构

npm/yarn 和 pnpm 的 `node_modules` 结构有本质区别：

```
npm/yarn 的 node_modules（扁平结构）：
node_modules/
├── react/              ← 我们安装的
├── react-dom/          ← 我们安装的
├── scheduler/          ← react-dom 的依赖，但被扁平化了
├── loose-envify/       ← react 的依赖，但被扁平化了
└── ...                 ← 所有依赖都平铺，包括间接依赖
                        ⚠️ 代码中可以 import scheduler，但它不在 package.json 中！
                        这就是"幽灵依赖"

pnpm 的 node_modules（符号链接结构）：
node_modules/
├── .pnpm/                          ← 硬链接到全局存储
│   ├── react@19.2.4/
│   │   └── node_modules/
│   │       └── react/              ← 真实文件（硬链接）
│   ├── react-dom@19.2.4/
│   │   └── node_modules/
│   │       ├── react-dom/          ← 真实文件（硬链接）
│   │       └── react -> ../../react@19.2.4/node_modules/react
│   │                               ← 依赖通过符号链接解析
│   └── scheduler@0.x.x/
│       └── node_modules/
│           └── scheduler/          ← 真实文件（硬链接）
├── react -> .pnpm/react@19.2.4/node_modules/react
└── react-dom -> .pnpm/react-dom@19.2.4/node_modules/react-dom
    ↑ 我们的代码只能看到直接依赖
    ✅ scheduler 对我们不可见，杜绝幽灵依赖
```

> **🤔 导师提问**：如果项目 A 和项目 B 都依赖 `react@19.2.4`，pnpm 在磁盘上存了几份？npm 又存了几份？

💡 类比后端：npm 像是把所有 NuGet 包都放到 GAC（全局程序集缓存），任何代码都能引用；pnpm 像是每个项目有独立的 `bin` 目录，只有显式声明的包才可引用。

---

## 关键行解读

以下是从 AdminWeb 的 `package.json` 中摘取的关键行：

```json
"react": "^19.2.4",
"react-dom": "^19.2.4",
"vite": "^8.0.4",
"typescript": "~6.0.2",
"babel-plugin-react-compiler": "^1.0.0"
```

| 行 | 解读 |
|----|------|
| `"react": "^19.2.4"` | React 19，支持 `use()` Hook、React Compiler。⚠️ 【易错点】React 19 不再需要 `import React from "react"`，新 JSX Transform 自动处理 |
| `"vite": "^8.0.4"` | Vite 8，使用 Rolldown 作为生产构建器（Rollup 的 Rust 重写版），速度极快 |
| `"typescript": "~6.0.2"` | `~` 表示只升级补丁版本，避免小版本不兼容。⚠️ 【易错点】TS 6.0 较新，部分 `@types/*` 可能未兼容 |
| `"babel-plugin-react-compiler": "^1.0.0"` | React Compiler 自动优化重渲染，减少手动 `useMemo`/`useCallback`。💡 类似 .NET 的 Tiered Compilation |

---

> **🔍 验证步骤**
>
> 1. 打开终端，执行 `node -v`，确认输出 v18+ （如 `v20.11.0`）
> 2. 执行 `corepack --version`，确认 corepack 可用
> 3. 执行 `pnpm -v`，确认 pnpm 已安装（如 `9.x.x`）
> 4. 如果 pnpm 未找到，执行 `corepack enable && corepack prepare pnpm@latest --activate` 后重试

## 🤔 思考题

### Level 1（概念级）

1. pnpm 相比 npm 的核心优势是什么？为什么它能避免"幽灵依赖"？
2. React 的声明式编程和 jQuery 的命令式编程，核心区别是什么？

### Level 2（推理级）

1. 如果 AdminWeb 使用 Webpack 而不是 Vite，开发体验会有哪些具体差异？考虑启动速度、HMR、配置复杂度。
2. AdminWeb 使用 `as const` 而不是 `enum` 定义常量，如果项目需要运行时遍历所有枚举值（如下拉框选项），这两种方案各有什么优劣？

### Level 3（动手级）

1. 尝试在本地用 `pnpm create vite` 创建一个 React + TypeScript 项目，对比 CRA 的创建过程，记录差异。
2. 在创建的项目中，把一个 `as const` 常量改成 `enum`，观察编译后的产物差异（检查 `dist/` 或用 TypeScript Playground）。

---

## ✅ 输出检查清单

完成本节后，确认以下内容：

- [ ] 理解 React 三大核心思想（组件化、声明式、单向数据流）
- [ ] 能用代码对比 jQuery 命令式和 React 声明式的区别
- [ ] 理解 Vite 为什么比 Webpack 快（ESM 原理）
- [ ] 理解 TypeScript 对企业级项目的必要性
- [ ] 理解 `as const` 和 `enum` 的设计取舍
- [ ] 理解 pnpm 的符号链接结构如何避免幽灵依赖
- [ ] 知道 React 19 不再需要 `import React from "react"`
- [ ] 本步骤无需创建文件，仅做技术选型决策

---

[← 上一篇](../00-学习路线总览.md) | [下一篇 →](./02-创建Vite项目.md)
