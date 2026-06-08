# 配置 Vite 与 TypeScript

> **这一步解决什么问题？**
>
> 我们需要让 Vite 能正确编译 React + TypeScript 代码，同时配置路径别名让我们用 `@/` 代替 `../../../` 这种脆弱的相对路径。这就像 ASP.NET Core 项目中配置命名空间和项目引用——基础设施配好了，后续开发才能顺畅。

---

## 为什么需要两个配置文件？

Vite 和 TypeScript 是独立的工具：Vite 负责运行时模块解析，TypeScript 负责编译时类型检查。它们各自需要知道路径映射关系。

⚠️ **易错点**：如果只配了 Vite 而没配 TypeScript，IDE 会报红色波浪线但代码能跑；反过来则 IDE 不报错但 Vite 构建时找不到模块。**两处必须同步配置。**

---

## Vite 配置（来自 AdminWeb 源码）

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
        ws: true,
      },
    },
  },
})
```

---

## TypeScript 配置（来自 AdminWeb 源码）

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

## 关键行解读

| 行号 | 代码 | 解读 |
|------|------|------|
| vite:3 | `import react, { reactCompilerPreset } from "@vitejs/plugin-react"` | 【设计取舍】同时导入 React 插件和 Compiler Preset。React Compiler 通过 Babel 插件注入，不是 Vite 原生支持 |
| vite:6 | `babel({ presets: [reactCompilerPreset()] })` | 【性能陷阱】React Compiler 自动优化重渲染，减少手动 `useMemo`/`useCallback`。但首次构建会稍慢，因为 Compiler 需要分析组件 |
| vite:17 | `"@": path.resolve(__dirname, "./src")` | 【易错点】`@` 别名不是 JS 特性，而是构建工具的编译时替换。源码写 `@/components/ui/button`，Vite 编译时替换为 `./src/components/ui/button` |
| vite:25 | `manualChunks(id: string) {` | 【性能陷阱】手动 chunk 分割控制加载性能。AG Grid 单独拆出是因为它体积最大（~1MB），如果不拆分会导致首屏加载缓慢 |
| vite:60-121 | proxy 配置 | 💡 类似 ASP.NET Core 的 YARP 反向代理。开发环境用 Vite 代理避免 CORS 问题，生产环境用 Nginx 实现 |
| ts:5 | `"@/*": ["./src/*"]` | ⚠️ 必须与 vite.config.ts 的 alias 同步，否则 IDE 不报错但构建失败 |
| ts:19 | `"jsx": "react-jsx"` | 【易错点】React 19 使用新的 JSX Transform，不需要每个文件 `import React`。如果写 `"jsx": "react"` 则必须手动导入 |
| ts:24 | `"erasableSyntaxOnly": true` | TS 6.0 新选项，只允许"可擦除"的类型语法，禁止 `enum` 等有运行时代码的语法。💡 这解释了为什么 AdminWeb 用 `as const` 代替 `enum` |

---

## 路径别名的本质

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

## 🤔 思考题

**Level 1（概念）**：为什么 `vite.config.ts` 和 `tsconfig.app.json` 都需要配置路径别名？

**Level 2（推理）**：`manualChunks` 的策略中，为什么 AG Grid 要单独拆分，而不是和其他 UI 库放在一起？如果所有 `node_modules` 都放进一个 `vendor` chunk 会有什么问题？

**Level 3（动手）**：尝试注释掉 `vite.config.ts` 中的 `resolve.alias` 配置，然后运行 `pnpm dev`，观察错误信息。思考：TypeScript 的 `paths` 配置能否独立解决模块解析？

---

## 输出清单

本步骤创建/修改的文件：

- `vite.config.ts` — Vite 构建配置
- `tsconfig.app.json` — TypeScript 应用配置

---

[← 上一篇](./03-安装核心依赖.md) | [下一篇 →](./05-shadcn-ui初始化.md)
