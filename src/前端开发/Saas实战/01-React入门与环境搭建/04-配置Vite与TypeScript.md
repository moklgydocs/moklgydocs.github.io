# 配置 Vite 与 TypeScript

> **这一步解决什么问题？**
>
> 我们需要让 Vite 能正确编译 React + TypeScript 代码，同时配置路径别名让我们用 `@/` 代替 `../../../` 这种脆弱的相对路径，以及配置开发环境代理让前端能请求后端 API。这就像 ASP.NET Core 项目中配置命名空间、项目引用和 Kestrel 端口——基础设施配好了，后续开发才能顺畅。

---

## 前置知识

### 为什么需要两个配置文件？

Vite 和 TypeScript 是独立的工具：Vite 负责运行时模块解析，TypeScript 负责编译时类型检查。它们各自需要知道路径映射关系。

⚠️ 【易错点】如果只配了 Vite 而没配 TypeScript，IDE 会报红色波浪线但代码能跑；反过来则 IDE 不报错但 Vite 构建时找不到模块。**两处必须同步配置。**

> **🤔 导师提问**：Vite 负责运行时解析，TypeScript 负责编译时检查——为什么不像 C# 那样"一个编译器搞定一切"？提示：Vite 用 esbuild/Rolldown 编译 JS，TypeScript 用 tsc 做类型检查，两者是完全独立的工具链。类比后端：Roslyn 既做编译又做语法分析，但前端选择了"编译"和"类型检查"分家。

### 什么是 CORS？为什么开发时需要代理？

浏览器的同源策略（Same-Origin Policy）阻止网页向不同域名/端口发送请求。开发时前端跑在 `localhost:3000`，后端跑在 `moklgy.me:10001`——不同端口就是"不同源"，浏览器会拦截请求。

```
❌ 不用代理：
  浏览器(localhost:3000) → 直接请求 http://moklgy.me:10001/api/...
  → 浏览器拦截：CORS 错误！

✅ 用 Vite 代理：
  浏览器(localhost:3000) → 请求 /sso-api/api/...
  → Vite Dev Server 转发到 http://moklgy.me:10001/api/...
  → 服务器之间没有 CORS 限制，请求成功
```

> **后端类比**：Vite 代理就是开发环境的 YARP 反向代理——前端只请求同源地址，由代理服务器转发到后端。生产环境中用 Nginx 做同样的事。

⚠️ 【易错点】`server.proxy` 只在开发模式（`pnpm dev`）生效。生产构建（`pnpm build`）后生成的是纯静态文件，没有代理功能。生产环境必须用 Nginx 等反向代理实现同样的路径转发。

> **🤔 导师提问**：既然浏览器有 CORS 限制，为什么 Postman 或 `curl` 能直接请求后端 API？提示：CORS 是浏览器安全策略，不是服务器限制。类比后端：浏览器的 CORS 像防火墙——只限制"出站"请求，不限制"入站"请求。Postman 不在浏览器里运行，所以不受此限制。

---

## 代码实现

### vite.config.ts（来自 AdminWeb 源码）

> ⚠️ 以下代理配置中的 `http://moklgy.me:xxxx` 是 AdminWeb 的后端地址。如果你的后端部署在不同的地址，请替换为你的实际地址。

```typescript
// vite.config.ts
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import babel from "@rolldown/plugin-babel"

// 统一管理平台：一个 Vite 项目，多个后端服务

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rolldownOptions: {
      output: {
        // 将大型第三方库拆分为独立 chunk（函数形式，兼容 Rolldown）
        manualChunks(id: string) {
          if (id.includes("node_modules")) {
            // AG Grid（最大的单一依赖，单独拆出）
            if (id.includes("ag-grid-community") || id.includes("ag-grid-react")) {
              return "vendor-ag-grid"
            }
            // React 核心
            if (
              id.includes("/react/") || id.includes("/react-dom/") ||
              id.includes("/react-router") || id.includes("/@react-router/")
            ) {
              return "vendor-react"
            }
            // UI 组件库
            if (
              id.includes("/radix-ui/") || id.includes("/@radix-ui/") ||
              id.includes("/cmdk/") || id.includes("/framer-motion/") ||
              id.includes("/lucide-react/") || id.includes("/sonner/")
            ) {
              return "vendor-ui"
            }
            // SignalR
            if (id.includes("/@microsoft/signalr")) {
              return "vendor-signalr"
            }
            // 其他 node_modules 统一放入 vendor
            return "vendor"
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/sso-api": {
        target: "http://moklgy.me:10001",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/sso-api/, ""),
      },
      "/perm-api": {
        target: "http://moklgy.me:10002",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/perm-api/, ""),
      },
      "/gw-api": {
        target: "http://moklgy.me:10000",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/gw-api/, ""),
      },
      "/connect": {
        target: "http://moklgy.me:10001",
        changeOrigin: true,
      },
      "/.well-known": {
        target: "http://moklgy.me:10001",
        changeOrigin: true,
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
      "/prt": {
        target: "http://moklgy.me:11010",
        changeOrigin: true,
      },
      "/_fr": {
        target: "http://moklgy.me:11010",
        changeOrigin: true,
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
      "/ops-api": {
        target: "http://moklgy.me:10013",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/ops-api/, ""),
      },
      "/hubs": {
        target: "http://moklgy.me:10012",
        changeOrigin: true,
        ws: true,  // WebSocket 代理（SignalR 需要）
      },
    },
  },
})
```

### tsconfig.app.json（来自 AdminWeb 源码）

```json
{
  "compilerOptions": {
    "ignoreDeprecations": "6.0",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

---

## 代码讲解

### 插件配置

| 行号 | 代码 | 解读 |
|------|------|------|
| vite:4 | `import react, { reactCompilerPreset } from "@vitejs/plugin-react"` | 【设计取舍】同时导入 React 插件和 Compiler Preset。React Compiler 通过 Babel 插件注入，不是 Vite 原生支持 |
| vite:6 | `babel({ presets: [reactCompilerPreset()] })` | 【性能陷阱】React Compiler 自动优化重渲染，减少手动 `useMemo`/`useCallback`。但首次构建会稍慢，因为 Compiler 需要分析组件 |

### 路径别名

| 行号 | 代码 | 解读 |
|------|------|------|
| vite:17 | `"@": path.resolve(__dirname, "./src")` | 【易错点】`@` 别名不是 JS 特性，而是构建工具的编译时替换。源码写 `@/components/ui/button`，Vite 编译时替换为 `./src/components/ui/button` |
| ts:5 | `"@/*": ["./src/*"]` | ⚠️ 必须与 vite.config.ts 的 alias 同步，否则 IDE 不报错但构建失败 |

> **🤔 导师提问**：路径别名为什么用 `@` 而不是 `~` 或 `#`？提示：`@` 是社区约定（Vue/Nuxt 也用 `@`），`~` 是旧版 Node 约定，`#` 是 Deno 的新规范。AdminWeb 选择 `@` 是因为 shadcn/ui 默认生成 `@/lib/utils` 的导入路径——如果你改了别名符号，需要同时修改所有组件的 import。

### Chunk 分割策略

| 行号 | 代码 | 解读 |
|------|------|------|
| vite:25 | `manualChunks(id: string) {` | 【性能陷阱】手动 chunk 分割控制加载性能。AG Grid 单独拆出是因为它体积最大（~1MB），如果不拆分会导致首屏加载缓慢 |

chunk 分割的核心原则：**变化频率不同的代码分到不同 chunk**。

```
vendor-react   → React 核心，几乎不变，浏览器缓存命中率高
vendor-ag-grid → AG Grid，独立大包，只在特定页面加载
vendor-ui      → UI 组件库，随组件增减变化
vendor-signalr → SignalR，只在通知中心页面加载
vendor         → 其他依赖
```

> **🤔 导师提问**：chunk 拆得越细越好吗？如果拆成 100 个小 chunk，每个只有几 KB——浏览器需要发 100 个 HTTP 请求来加载页面，这比一个大 chunk 还慢。所以 chunk 策略是"按变化频率分组"，类比后端：微服务拆分粒度——太粗则部署耦合，太细则通信开销大。

### Vite 代理配置

代理的规则是：**有 `rewrite` 的去掉前缀转发，没有 `rewrite` 的保留前缀转发**。

| 代理路径 | rewrite | 实际转发目标 | 用途 |
|---------|---------|-------------|------|
| `/sso-api` | 去掉前缀 | `moklgy.me:10001/api/...` | SSO 认证 API |
| `/connect` | 无 | `moklgy.me:10001/connect/...` | OAuth2 Token 端点 |
| `/hubs` | 无 | `moklgy.me:10012/hubs/...` | SignalR WebSocket |

> **后端类比**：Vite 代理 ≈ 开发环境的 YARP 反向代理。`rewrite` 规则对应 YARP 的 `TransformPath`。`/connect` 和 `/.well-known` 不加 rewrite，因为 OIDC 协议要求路径精确匹配。

### TypeScript 关键配置

| 行号 | 代码 | 解读 |
|------|------|------|
| ts:19 | `"jsx": "react-jsx"` | 【易错点】React 19 使用新的 JSX Transform，不需要每个文件 `import React`。如果写 `"jsx": "react"` 则必须手动导入 |
| ts:24 | `"erasableSyntaxOnly": true` | 【设计取舍】TS 6.0 新选项，只允许"可擦除"的类型语法，禁止 `enum` 等有运行时代码的语法。💡 这解释了为什么 AdminWeb 用 `as const` 代替 `enum` |
| ts:22 | `"verbatimModuleSyntax": true` | ⚠️ 【易错点】必须使用 `import type` 导入纯类型，否则编译报错。如 `import type { AppDto } from "@/types"` 而非 `import { AppDto }` |
| ts:3 | `"ignoreDeprecations": "6.0"` | ⚠️ 【易错点】这是 TS 6.0 的临时兼容选项，抑制版本升级的弃用警告。未来版本应移除 |

### 路径别名的本质

`@/` 别名不是 JavaScript 的特性，而是构建工具的编译时替换：

```
源码：import { Button } from "@/components/ui/button"
  ↓ Vite 编译时替换
实际：import { Button } from "../../components/ui/button"
```

没有路径别名时的问题：

```typescript
// 没有 @ 别名：相对路径地狱
import { Button } from "../../../components/ui/button"
import { useAuth } from "../../../../stores/auth-store"

// 有了 @ 别名：简洁明了
import { Button } from "@/components/ui/button"
import { useAuth } from "@/stores/auth-store"
```

💡 类比后端：`@/` 就像一个项目根命名空间的缩写，类似 C# 的 `using MyProject.Core;`。

---

## 踩坑提醒

1. **路径别名必须同步配置**：`vite.config.ts` 的 `resolve.alias` 和 `tsconfig.app.json` 的 `paths` 必须一致。只配一处会导致"IDE 不报错但构建失败"或"构建通过但 IDE 全是红线"。
2. **proxy 只在开发模式生效**：`pnpm dev` 时 Vite 代理工作，`pnpm build` 后生成的静态文件没有代理能力。生产环境需要 Nginx 配置同样的路径转发规则。
3. **`verbatimModuleSyntax: true` 强制 `import type`**：如果你写了 `import { UserDto } from "@/types"` 而 `UserDto` 只是类型，TS 会报错。必须改为 `import type { UserDto } from "@/types"`。
4. **代理中的 `ws: true`**：`/hubs` 代理必须加 `ws: true` 才能代理 WebSocket 连接（SignalR 使用 WebSocket）。如果漏了，通知中心的实时推送会失败。
5. **修改 `vite.config.ts` 后需要重启 `pnpm dev`**：Vite 不会热重载配置文件的变更。修改后按 `Ctrl+C` 停止，再重新 `pnpm dev`。

---

## 🤔 自测题

### 概念级

1. 为什么 `vite.config.ts` 和 `tsconfig.app.json` 都需要配置路径别名？
2. Vite 代理为什么只在开发模式生效？生产环境怎么解决 CORS？

### 推理级

3. `manualChunks` 的策略中，为什么 AG Grid 要单独拆分，而不是和其他 UI 库放在一起？如果所有 `node_modules` 都放进一个 `vendor` chunk 会有什么问题？
4. `erasableSyntaxOnly: true` 和 `as const` 有什么关系？为什么这个选项"禁止"了 `enum`？

### 动手级

5. 尝试注释掉 `vite.config.ts` 中的 `resolve.alias` 配置，然后运行 `pnpm dev`，观察错误信息。思考：TypeScript 的 `paths` 配置能否独立解决模块解析？
6. 在浏览器中访问 `http://localhost:3000/sso-api/.well-known/openid-configuration`，确认代理正常工作（应返回 JSON 格式的 OIDC 配置文档）。

---

## 验证步骤

> **🔍 验证步骤**
>
> 1. 确认 `vite.config.ts` 和 `tsconfig.app.json` 中的路径别名配置一致（都是 `@` → `./src`）
> 2. 在任意 `.tsx` 文件中写 `import { cn } from "@/lib/utils"`，确认 IDE 不报错
> 3. 执行 `pnpm tsc --noEmit`，确认 TypeScript 编译无错误
> 4. 执行 `pnpm dev`，确认启动成功且端口为 3000

---

## 输出检查清单

完成本节后，确认以下内容：

- [ ] 修改了 `vite.config.ts`，包含插件、路径别名、chunk 分割、代理配置
- [ ] 修改了 `tsconfig.app.json`，包含路径别名和编译选项
- [ ] 理解 Vite 和 TypeScript 需要同步配置路径别名
- [ ] 理解 `server.proxy` 的作用和局限性（仅开发模式）
- [ ] 理解 `manualChunks` 的 chunk 分割策略
- [ ] 理解 `erasableSyntaxOnly: true` 与 `as const` 的关系
- [ ] 理解 `verbatimModuleSyntax: true` 强制使用 `import type`
- [ ] 知道修改 `vite.config.ts` 后需要重启开发服务器

---

[← 上一篇](./03-安装核心依赖.md) | [下一篇 →](./05-shadcn-ui初始化.md)
