# 创建 Vite 项目

> **这一步解决什么问题？**
>
> 用 `pnpm create vite` 从零创建一个 React + TypeScript 项目，理解 Vite 生成的项目结构中每个文件的职责。

---

## 前置知识

### Vite vs Webpack

| 特性 | Vite | Webpack |
|------|------|---------|
| 开发启动 | 毫秒级（不打包，按需编译） | 秒级（先打包所有模块） |
| HMR 速度 | 极快（只替换变更模块） | 较慢（需要重新打包受影响模块） |
| 构建工具 | Rolldown（Rollup 的 Rust 实现） | Webpack 自身 |
| 配置复杂度 | 低（开箱即用） | 高（需要大量 loader/plugin） |

> **后端类比**：Webpack 像 `dotnet publish`——先把所有代码编译成程序集再运行；Vite 像 `dotnet watch`——按需 JIT 编译，改了哪个文件只重新编译那一个。ASP.NET Core 的分层编译也有类似思想：先快速启动，再按需优化热点代码。

### 【设计取舍】为什么选 Vite 而不是 CRA？

Create React App（CRA）曾经是 React 官方推荐的项目脚手架，但它在 2022 年后基本停止维护。选择 Vite 的理由：

| 维度 | CRA | Vite |
|------|-----|------|
| 维护状态 | 已停止维护 | 活跃维护 |
| 启动速度 | 30s+（Webpack 全量打包） | <1s（ESM 按需加载） |
| 构建工具 | Webpack（JavaScript） | Rolldown（Rust，10x+ 更快） |
| 配置灵活性 | 需要 eject 才能自定义 | `vite.config.ts` 直接配置 |
| React Compiler 支持 | 无 | 原生支持（通过 Babel 插件） |

⚠️ **易错点**：不要搜索"CRA 最新版"或"Create React App 2024"——它已经死了。React 官方文档也推荐 Vite 作为新项目的起点。

### ESM 原理

ESM（ES Modules）是 JavaScript 的原生模块系统，浏览器直接支持 `import/export` 语法：

```typescript
// 命名导出
export function formatDate(date: Date): string { ... }

// 命名导入
import { formatDate } from "./utils"
```

Vite 利用浏览器的原生 ESM 能力实现"按需加载"：开发时不需要打包，浏览器请求哪个模块，Vite 就编译哪个模块并返回。

> **后端类比**：ESM 的按需加载类似 .NET 的 `AssemblyLoadContext`——不是一次性加载所有程序集，而是用到哪个加载哪个。Webpack 则像预编译（AOT），启动前把所有代码打包成一个 bundle。

> **🤔 导师提问**：如果 ESM 这么好，为什么 CommonJS 存在了这么多年？Node.js 生态中还有大量 CommonJS 包，Vite 怎么处理它们的？

### SPA 入口 index.html

传统 Web 应用中，每个页面都有一个对应的 HTML 文件。SPA（Single Page Application）只有一个 `index.html`，所有页面都在这个文件内的 `<div id="root">` 中渲染：

```
浏览器请求 → index.html（几乎空白） → 加载 main.tsx
  → React 在 <div id="root"> 中渲染整个应用
  → 后续页面切换全在客户端完成，不再请求服务器
```

> **后端类比**：`index.html` 类比 ASP.NET Core 的 `Program.cs`——它是整个应用的入口点。`<div id="root">` 就像 `WebApplication.CreateBuilder()` 创建的那个宿主容器，React 把所有组件"注入"到这个容器里。

AdminWeb 的 `index.html` 实际内容：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CommonSaas 管理平台</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

注意两个关键点：
- `<div id="root">`：React 挂载点，类比 Razor 的 `@RenderBody()`——所有页面内容都在这里渲染
- `<script type="module">`：告诉浏览器用 ESM 方式加载，是 Vite 的核心机制

💡 对比 ASP.NET Core 的 `_Layout.cshtml`：`_Layout.cshtml` 是服务端布局模板，每次页面导航都会重新请求服务端。而 SPA 的 `index.html` 只加载一次，后续所有"页面"都在客户端 JavaScript 中渲染——这就像 `_Layout.cshtml` 只加载一次，`@RenderBody()` 的内容由前端 JavaScript 动态替换。

> **🤔 导师提问**：SPA 的所有页面都在客户端渲染，这对 SEO 有什么影响？我们的管理后台需要 SEO 吗？

---

## 代码实现

### 创建项目

按步骤执行以下命令，观察终端输出：

```bash
# 步骤 1：创建 Vite + React + TypeScript 项目
pnpm create vite saas-web --template react-ts

# 预期输出：
# │
# ◇  Scaffolding project in ./saas-web ...
# │
# └── Project created successfully
#
# Suggested next steps:
#   cd saas-web
#   pnpm install
#   pnpm dev

# 步骤 2：进入项目目录
cd saas-web

# 步骤 3：安装依赖
pnpm install

# 预期输出：
# LOCKFILE INFO  Lockfile is up to date, resolution step is skipped
# PROGRESS ...   Already up-to-date
# Done in 1.2s
#
# packages:
# + react 19.x.x
# + react-dom 19.x.x
# + typescript 6.x.x
# + vite 8.x.x
# 30 packages installed
```

⚠️ **易错点**：`pnpm dev` 必须在项目根目录（包含 `package.json` 的目录）执行。如果在项目外层目录执行，会报 `ERR_PNPM_NO_SCRIPTS_MISSING_COMMAND`。这就像 `dotnet run` 必须在 `.csproj` 所在目录执行一样。

> **`--template react-ts` 是什么？** Vite 提供多种项目模板，`react-ts` 模板预配置了 React + TypeScript + ESLint。其他常用模板：`react-swc-ts`（使用 SWC 编译器替代 Babel，更快）。⚠️ **易错点**：必须是 `react-ts` 不是 `react`，后者不含 TypeScript。

### 生成的文件树

```
saas-web/
├── index.html              # SPA 入口
├── package.json            # 项目依赖配置
├── tsconfig.json           # TypeScript 根配置
├── tsconfig.app.json       # TypeScript 应用配置
├── tsconfig.node.json      # TypeScript Node 配置
├── vite.config.ts          # Vite 配置
├── eslint.config.js        # ESLint 配置
├── public/                 # 静态资源（不经过编译）
│   └── vite.svg
└── src/
    ├── main.tsx            # React 入口
    ├── App.tsx             # 根组件
    ├── App.css             # 根组件样式
    ├── index.css           # 全局样式
    └── vite-env.d.ts       # Vite 类型声明
```

对比 AdminWeb 的实际项目结构（我们已经学成后的样子）：

```
AdminWeb/src/
├── App.tsx                 # 根组件（含路由配置）
├── main.tsx                # 入口（含 Provider 包裹）
├── api/                    # API 层（按微服务拆分）
│   ├── auth/               # SSO 认证服务
│   ├── perm/               # 权限中心服务
│   ├── gateway/            # 网关管理服务
│   ├── file/               # 文件服务
│   ├── print/              # 打印服务
│   ├── notify/             # 通知服务
│   └── ops/                # 运维中心服务
├── components/             # 可复用组件
├── hooks/                  # 自定义 Hooks
├── lib/                    # 工具函数（如 cn()）
├── pages/                  # 页面组件
├── stores/                 # 状态管理（Zustand）
├── styles/                 # 全局样式
└── types/                  # TypeScript 类型定义
```

我们现在的 `saas-web` 只是一个起点，后续章节会逐步演进到 AdminWeb 的结构。

### 逐文件讲解

| 文件 | 作用 | 后端类比 |
|------|------|---------|
| `index.html` | SPA 唯一的 HTML，包含 `<div id="root">` 和 `<script>` 引用 | `Program.cs`——应用入口 |
| `package.json` | 声明依赖、脚本命令、包管理器版本 | `.csproj` + `launchSettings.json` |
| `tsconfig.json` | TypeScript 配置的根文件，引用子配置 | `Directory.Build.props`——统一管理 |
| `tsconfig.app.json` | 应用代码的 TS 配置（目标 ES 版本、JSX 等） | `.csproj` 中的 `<PropertyGroup>` |
| `tsconfig.node.json` | Vite 配置文件的 TS 配置 | 开发工具的配置，不影响应用代码 |
| `vite.config.ts` | Vite 开发服务器和构建配置 | `appsettings.json` + `Program.cs` 的中间件配置 |
| `src/main.tsx` | React 应用的入口点，挂载根组件 | `Program.Main()` |
| `src/App.tsx` | 根组件，所有页面从这里嵌套 | 根布局 `_Layout.cshtml` |
| `src/vite-env.d.ts` | Vite 的类型声明（让 TS 认识 `import.meta.env` 等） | 类似 `AssemblyInfo.cs` 中的属性声明 |

> **🤔 导师提问**：TypeScript 配置为什么要拆成 3 个文件（`tsconfig.json` + `tsconfig.app.json` + `tsconfig.node.json`）？如果合并成一个会有什么问题？提示：`vite.config.ts` 运行在 Node 环境，而 `App.tsx` 运行在浏览器环境。

### 关键源码解读

**index.html**——SPA 的起点：

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>saasweb</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

注意 `<script type="module">`——这个 `type="module"` 就是告诉浏览器用 ESM 方式加载，是 Vite 的核心机制。

**src/main.tsx**——React 的启动代码：

```typescript
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- `createRoot`：React 18+ 的新 API，创建渲染根节点
- `StrictMode`：开发模式下的严格检查，帮你发现不安全的生命周期和副作用
- `!`：TypeScript 非空断言，告诉 TS 这个元素一定存在

对比 AdminWeb 的 `src/main.tsx`（已经有 Provider 层）：

```typescript
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"
import App from "./App"
import "@/styles/index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <TooltipProvider delayDuration={300}>
        <App />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
)
```

💡 类比后端：`main.tsx` 就是 `Program.cs`，`StrictMode` 类似开发环境的详细错误页，`ThemeProvider` 类似中间件管道中的服务注册。每个 Provider 就像 `builder.Services.AddXxx()`——为整个应用提供某种全局能力。

> **🤔 导师提问**：`ThemeProvider` 包裹了 `TooltipProvider`，如果反过来包裹会出问题吗？Provider 的嵌套顺序有什么讲究？类比后端的中间件注册顺序：`app.UseAuthentication()` 必须在 `app.UseAuthorization()` 之前。

---

## 代码讲解

### 为什么 Vite 不需要 Webpack 的复杂配置？

Webpack 需要大量配置才能工作——`babel-loader`、`ts-loader`、`css-loader`、`style-loader`、`HtmlWebpackPlugin` 等。Vite 为什么不用？

```
Webpack 工作流：
  启动 → 配置所有 loader → 打包所有模块 → 生成 bundle → 浏览器加载

Vite 工作流：
  启动 → 零配置 → 浏览器请求模块 → esbuild 即时编译 → 返回 ESM
```

核心原因：Vite 把编译交给了 esbuild（Go 编写，比 Babel 快 10-100 倍），把模块系统交给了浏览器原生 ESM。不需要预先打包，自然不需要复杂的 loader 链。

### ESM 按需加载 vs Bundle-all 原理

```
┌─────────────────────────────────────────────┐
│ Webpack (Bundle-all)                         │
│                                              │
│  App.tsx ─┐                                  │
│  utils.ts ─┤ → 打包成一个巨大的 bundle.js     │
│  api.ts ──┘   浏览器加载整个 bundle           │
│                                              │
│  启动时间：随项目规模线性增长                  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Vite (ESM On-demand)                        │
│                                              │
│  浏览器请求 App.tsx                           │
│    → Vite 编译 App.tsx → 发现 import utils   │
│    → 浏览器请求 utils.ts                      │
│    → Vite 编译 utils.ts → 返回               │
│                                              │
│  启动时间：与项目规模无关                      │
└─────────────────────────────────────────────┘
```

### HMR 原理

```
1. 你修改了 Button.tsx
2. Vite 检测到文件变化
3. Vite 只重新编译 Button.tsx 这个模块
4. 通过 WebSocket 通知浏览器
5. 浏览器只替换 Button 模块，不刷新整个页面
6. 组件状态（如表单输入值）得以保留
```

> **后端类比**：HMR 像 `dotnet watch` 的热重载，但更精细——`dotnet watch` 会重启整个应用，HMR 只替换变更的模块，甚至保留组件的状态。

> **🤔 导师提问**：HMR 保留了组件状态，但如果修改的是 Store（如 Zustand）的代码，HMR 还能保留状态吗？为什么？

---

## 踩坑提醒

1. ⚠️ **【易错点】目录名不要用中文或空格**：`pnpm create vite 我的 项目` 会导致路径解析问题。用英文短横线命名：`saas-web`、`admin-panel`。
2. ⚠️ **【易错点】template 必须是 `react-ts`**：写成 `react` 不会报错但生成的是 JavaScript 项目，没有类型检查。
3. ⚠️ **【易错点】目录已存在时会报错**：如果当前目录下已有 `saas-web` 文件夹，Vite 会拒绝创建。需要先删除或换一个名字。
4. ⚠️ **【易错点】Node 版本要求**：Vite 8 要求 Node.js 18+，执行 `node -v` 确认版本。
5. ⚠️ **【易错点】运行 `pnpm dev` 的目录**：必须在项目根目录（包含 `package.json` 的目录）执行。在项目外层执行会报错，就像 `dotnet run` 必须在 `.csproj` 所在目录一样。

---

> **🔍 验证步骤**
>
> 1. 确认 `saas-web/` 目录已创建，包含 `package.json`、`index.html`、`vite.config.ts`
> 2. 在 `saas-web/` 目录下执行 `pnpm dev`，终端应显示 `Local: http://localhost:5173/`
> 3. 浏览器打开该地址，应看到 Vite + React 默认页面（蓝色 logo + 计数器按钮）
> 4. 点击计数器按钮，数字应从 0 变为 1——这证明 React 状态驱动 UI 的机制正常工作

## 🤔 思考题

### Level 1（概念级）

1. Vite 为什么比 Webpack 启动快？它的核心原理是什么？
2. `index.html` 中 `<script type="module">` 的 `type="module"` 有什么作用？

### Level 2（推理级）

1. ESM 的 tree-shaking 原理是什么？为什么 ESM 可以静态分析而 CommonJS 不行？
2. SPA 的 `index.html` 和 ASP.NET Core 的 `_Layout.cshtml` 有什么本质区别？为什么 SPA 只需要一个 HTML 文件？

### Level 3（动手级）

1. 在本地用 `pnpm create vite` 创建项目后，尝试修改 `vite.config.ts` 添加一个路径别名 `@`，观察 TypeScript 和 Vite 分别需要在哪里配置。
2. 如果不用 Vite 用 Webpack，从零配置一个 React + TypeScript 项目需要哪些步骤？尝试列出最少需要安装的 loader 和 plugin。

---

## ✅ 输出检查清单

完成本节后，确认以下内容：

- [ ] 成功用 `pnpm create vite saas-web --template react-ts` 创建项目
- [ ] 理解 SPA 的 `index.html` 和传统多页面 HTML 的区别
- [ ] 理解 `index.html` 与 `_Layout.cshtml` 的类比关系
- [ ] 能说出每个生成文件的职责和后端类比
- [ ] 理解 Vite 的 ESM 按需加载和 Webpack 的 Bundle-all 区别
- [ ] 知道 `pnpm dev` 必须在项目根目录执行
- [ ] 知道为什么选 Vite 而不是 CRA

---

[← 上一篇](./01-Node与包管理器.md) | [下一篇 →](./03-安装核心依赖.md)
