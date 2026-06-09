# shadcn/ui 初始化

> **这一步解决什么问题？**
>
> 用 shadcn CLI 初始化并安装常用 UI 组件，理解 shadcn/ui "拥有你的代码"的核心理念。这一步完成后，项目将拥有一套可复用、可定制、带无障碍性的 UI 组件库。

---

## 前置知识

### shadcn/ui 的核心理念——"拥有你的代码"

shadcn/ui 和传统 UI 组件库有根本性的区别：**它不是一个 npm 包**。

```
传统 UI 库（Ant Design / Element Plus / MUI）：
  pnpm add antd → 安装编译好的 npm 包 → 通过 import 使用
  → 你的代码依赖上游包的版本和 API
  → 自定义需要覆盖样式或 fork 仓库

shadcn/ui：
  pnpm dlx shadcn add button → 源码复制到 src/components/ui/button.tsx
  → 你拥有完整的组件源码
  → 自定义直接改源码，没有任何限制
```

| 特性 | npm 包方式 | shadcn/ui 方式 |
|------|-----------|---------------|
| 代码位置 | node_modules/ | src/components/ui/ |
| 自由度 | 受限（覆盖样式、wrapper） | 完全自由（直接改源码） |
| 更新方式 | `pnpm update` | `shadcn add` 覆盖 |
| 包体积 | 整个库（tree-shaking 缓解） | 只安装用到的组件 |
| 类型安全 | 依赖上游类型声明 | 你可以看到和修改类型 |

> **后端类比**：npm 包方式类似运行时反射——你依赖外部程序集，行为受上游控制，遇到 Bug 只能等作者修复。shadcn/ui 方式类似 .NET Source Generator——代码在编译时生成到你的项目中，你拥有完全的控制权，可以直接调试和修改。

### Radix UI 的角色

shadcn/ui 的组件底层基于 Radix UI——一个"无样式的可访问性原语"库：

- **无样式**：Radix 只提供行为和可访问性，不提供任何视觉样式
- **可访问性**：完整的键盘导航、屏幕阅读器支持、焦点管理
- **原语**：提供最基础的交互原语（Dialog、Dropdown、Select 等），不带设计观点

```
shadcn/ui = Radix UI（行为 + 可访问性） + Tailwind CSS（样式） + CVA（变体管理）
```

> **后端类比**：Radix UI 类比 ASP.NET Core 的抽象基类——它定义了组件的"契约"（行为接口、可访问性规范），但不提供具体实现。shadcn/ui 在这个抽象基类上添加了 Tailwind 样式，就像你的业务代码继承抽象基类并实现具体逻辑。

> **🤔 导师提问**：传统 UI 库（Ant Design）开箱即用但定制困难，shadcn/ui 定制自由但需要自己组合。这和后端的"约定优于配置"（Convention over Configuration）vs"配置优于约定"的取舍一样。AdminWeb 作为企业级 SaaS 项目，为什么选了 shadcn/ui 而不是 Ant Design？提示：想想品牌定制需求和多项目共享组件的场景。

---

## 代码实现

### 第一步：创建 cn() 工具函数

> ⚠️ **顺序很重要**：shadcn/ui 生成的组件会引用 `@/lib/utils` 中的 `cn()` 函数。如果 `cn()` 不存在，组件会报错。所以必须先创建 `cn()`，再初始化 shadcn/ui。

```bash
# 创建 lib 目录
mkdir -p src/lib
```

创建 `src/lib/utils.ts`：

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并 CSS 类名工具函数。
 * 先用 clsx 处理条件类名，再用 twMerge 去除 Tailwind CSS 冲突类名。
 *
 * @param inputs 类名列表，支持字符串、对象、数组等 ClassValue 格式
 * @returns 合并后的类名字符串
 *
 * @example
 * cn("px-2", "px-4") // "px-4"（twMerge 保留后者）
 * cn("text-red-500", false && "hidden") // "text-red-500"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

> **🤔 导师提问**：`cn()` 中 `twMerge(clsx(inputs))` 的顺序能不能反过来？提示：`clsx` 接受的条件值（如 `false`、`undefined`）如果先经过 `twMerge`，后者能正确处理吗？

### 第二步：初始化 shadcn/ui

```bash
pnpm dlx shadcn@latest init
```

执行后会进入交互式配置：

```
✔ Which style would you like to use? › New York
✔ Which color would you like to use as base color? › Neutral
✔ Do you want to use CSS variables for colors? › yes
✔ Are you using a custom tailwind prefix? (Leave blank if not) ›
✔ Where is your global CSS file? › src/styles/index.css
✔ Would you like to use CSS variables for the dark mode? › yes
✔ Where is your tailwind.config.js? › (留空，Tailwind v4 不需要此文件)
✔ Do you want to use a custom tailwind prefix? › (留空)
✔ Where are your components located? › src/components
✔ Where are your UI components located? › src/components/ui
✔ Do you want to configure the import alias for components? › yes
✔ What is the import alias for components? › @/components
✔ Do you want to configure the import alias for utils? › yes
✔ What is the import alias for utils? › @/lib/utils
✔ Do you want to enable react-compiler? › yes
```

⚠️ 【易错点】交互式配置的选项必须在首次就选对，改起来很麻烦（需要删除 `components.json` 重新初始化）。如果选错了，直接删除 `components.json` 重新 `pnpm dlx shadcn@latest init` 即可。

⚠️ 【易错点】`Where is your global CSS file?` 必须填 `src/styles/index.css`，不是默认的 `src/index.css`。因为我们后续会把 CSS 文件放在 `src/styles/` 目录下。如果你先用了默认路径，可以在 `components.json` 中手动修改。

> **🤔 导师提问**：为什么选 `New York` 风格而不是 `Default`？提示：`New York` 更紧凑专业，间距更小，适合管理后台这种信息密度高的场景。`Default` 更宽松圆润，适合内容型网站。类比后端：这就像选项目模板——空项目 vs Web API 模板 vs MVC 模板，不同场景选不同起点。

### 生成 components.json 配置文件

初始化完成后，项目根目录会生成 `components.json`：

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

| 配置项 | 作用 |
|-------|------|
| `style` | 组件样式风格（New York 更紧凑，Default 更圆润） |
| `rsc` | 是否使用 React Server Components。⚠️ 【易错点】AdminWeb 是纯 SPA，必须设为 `false`。如果设为 `true`，组件代码会包含 Server Component 语法，在 SPA 中报错 |
| `tsx` | 使用 TypeScript |
| `tailwind.css` | 全局样式文件路径。⚠️ 【易错点】此路径必须指向实际存在的 CSS 文件，否则组件样式不生效 |
| `tailwind.cssVariables` | 使用 CSS 变量定义颜色主题 |
| `aliases.ui` | UI 组件的导入路径别名 |

> **🤔 导师提问**：`rsc: false` 中的 RSC 是什么？React Server Components 是 React 18 引入的服务端渲染方案——组件在服务器上执行，只把 HTML 发送给客户端。AdminWeb 是纯客户端 SPA，所有组件都在浏览器中执行，所以 `rsc` 必须为 `false`。类比后端：RSC 类似 Blazor Server 模式（逻辑在服务端），SPA 类似 Blazor WebAssembly 模式（逻辑在客户端）。

### 第三步：批量安装组件

```bash
pnpm dlx shadcn@latest add button card dialog input label select table tabs sidebar tooltip dropdown-menu sheet form badge separator scroll-area skeleton switch command sonner
```

⚠️ 【易错点】`form` 组件会自动安装 `react-hook-form`、`@hookform/resolvers`、`zod` 等额外依赖。如果安装失败，手动执行 `pnpm add react-hook-form @hookform/resolvers zod`。

⚠️ 【性能陷阱】批量安装 20 个组件会引入大量 Radix UI 子包（每个组件一个），`node_modules` 体积会显著增加。但不用担心生产包体积——每个页面组件的 `import` 是明确的，Vite 会按需打包。

### 查看生成的组件目录

```
src/components/ui/
├── badge.tsx
├── button.tsx
├── card.tsx
├── command.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── form.tsx
├── input.tsx
├── label.tsx
├── scroll-area.tsx
├── select.tsx
├── separator.tsx
├── sheet.tsx
├── sidebar.tsx
├── skeleton.tsx
├── switch.tsx
├── table.tsx
├── tabs.tsx
└── tooltip.tsx
```

> **🤔 导师提问**：为什么用 `pnpm dlx shadcn add` 而不是 `pnpm add shadcn`？提示：`shadcn` 是 CLI 工具，只在命令行执行一次，不是运行时依赖。`pnpm dlx` 是"执行远程包但不安装到项目"的命令，类比 `npx`。把它装到 `dependencies` 会导致生产包多出无用的 CLI 代码。

### 简单示例：验证 shadcn 工作正常

创建一个使用 Button + Card 的测试页面：

```tsx
// src/App.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>SaaS Web</CardTitle>
          <CardDescription>shadcn/ui 组件验证页面</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button variant="default">默认按钮</Button>
          <Button variant="secondary">次要按钮</Button>
          <Button variant="outline">描边按钮</Button>
          <Button variant="destructive">危险按钮</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
```

---

## 代码讲解

### shadcn/ui 的复制机制

```
1. 执行 pnpm dlx shadcn add button
2. CLI 读取 components.json 获取配置（路径、别名等）
3. CLI 从 shadcn registry 下载 button 组件源码
4. CLI 根据配置的模板引擎处理源码（替换 import 路径等）
5. CLI 将处理后的源码写入 src/components/ui/button.tsx
6. 如果组件依赖其他包，自动安装（如 @radix-ui/react-slot）
```

这不是 `npm install`——没有包被安装到 `node_modules`，源码直接进入你的项目。你可以打开 `button.tsx` 看到完整的实现代码，每一行都在你的掌控之下。

### 为什么这样设计？

1. **完全控制**：你可以修改任何组件的任何行为，不受上游限制
2. **学习价值**：阅读组件源码是学习 React 高级模式的最佳方式
3. **无版本锁定**：不会因为上游 Breaking Change 导致项目崩溃
4. **按需使用**：只安装用到的组件，零冗余

### Radix 的无障碍性

以 Dialog 组件为例，Radix UI 自动处理了：

- **键盘导航**：按 Esc 关闭对话框，Tab 在对话框内循环焦点
- **焦点陷阱**：对话框打开时，Tab 不会跳出对话框
- **屏幕阅读器**：自动添加 `role="dialog"` 和 `aria-modal="true"`
- **滚动锁定**：对话框打开时禁止背景页面滚动

> **后端类比**：这就像 ASP.NET Core 的 `[Authorize]` 特性——你不需要手动检查每个请求的认证状态，框架自动处理。Radix 自动处理了组件的无障碍性，你不需要手动管理焦点和 ARIA 属性。

### cn() 函数的作用

shadcn/ui 生成的每个组件都使用 `cn()` 函数合并类名：

```tsx
import { cn } from "@/lib/utils"

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium",
          variantStyles[variant],
          sizeStyles[size],
          className  // 用户传入的类名可以覆盖默认样式
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
```

`cn()` = `twMerge(clsx(inputs))`，它确保用户传入的 `className` 能正确覆盖默认样式，而不是两者叠加产生冲突。

⚠️ 【易错点】`className` 放在 `cn()` 参数的最后——这是约定，确保外部传入的类覆盖默认样式。如果放在前面，`variantStyles[variant]` 会覆盖用户的 `className`，导致自定义失效。类比后端：这和"用户配置覆盖默认配置"的原则一致——`appsettings.Production.json` 覆盖 `appsettings.json`。

---

## 踩坑提醒

1. **shadcn init 的样式选择影响全局**：`New York` 风格更紧凑专业，`Default` 风格更圆润休闲。企业级项目推荐 `New York`。选择后所有组件都会遵循这个风格，切换成本很高。
2. **组件更新需要手动 re-add**：shadcn/ui 的组件在你的项目中，不受 `pnpm update` 影响。如果上游修复了 Bug，你需要重新执行 `pnpm dlx shadcn add button` 覆盖。**注意：这会覆盖你的自定义修改！** 建议用 Git 管理，更新前先 `git stash`。
3. **不要随意修改 ui/ 下的组件**：虽然你可以修改，但建议只在外层 wrapper 中自定义。直接改 `button.tsx` 意味着你失去了上游更新的能力（覆盖会丢失你的修改）。
4. **全局 CSS 路径必须正确**：`components.json` 中的 `tailwind.css` 路径必须指向实际的 CSS 文件，否则组件样式不生效。如果初始化时填错了，手动修改 `components.json` 即可。
5. **如果初始化失败怎么重来**：删除 `components.json`、`src/components/ui/` 目录，然后重新 `pnpm dlx shadcn@latest init`。

---

## 🤔 自测题

### 概念级

1. shadcn/ui 和 Ant Design 的根本区别是什么？为什么 shadcn/ui 不是一个 npm 包？
2. `pnpm dlx shadcn add button` 执行后，代码被放到了哪里？

### 推理级

3. Radix UI 在 shadcn/ui 中扮演什么角色？为什么说它是"无样式的可访问性原语"？
4. `cn()` 函数在 shadcn/ui 组件中起什么作用？如果不用 `cn()` 直接拼接字符串会怎样？
5. `components.json` 中 `rsc: false` 是什么意思？如果误设为 `true` 会怎样？

### 动手级

6. 打开 `src/components/ui/button.tsx`，阅读完整源码。找到 `variantStyles` 和 `cn()` 的使用位置。尝试理解每一行代码的作用——这是学习 React 高级模式的最佳方式。
7. 修改 `button.tsx` 中的某个颜色值（如把 `bg-primary` 改为 `bg-blue-500`），刷新页面观察变化。然后 `git checkout src/components/ui/button.tsx` 恢复原始代码。

---

## 验证步骤

> **🔍 验证步骤**
>
> 1. 确认 `src/lib/utils.ts` 已创建，包含 `cn()` 函数
> 2. 确认 `components.json` 已生成在项目根目录，`rsc` 为 `false`，`tailwind.css` 路径为 `src/styles/index.css`
> 3. 确认 `src/components/ui/` 目录下有 ≥ 15 个组件文件（button.tsx、card.tsx、dialog.tsx 等）
> 4. 在 `App.tsx` 中使用 `<Button>` 和 `<Card>` 组件，确认页面正常显示（暂不关心样式，因为 CSS 还没配置，下一步处理）

---

## 输出检查清单

完成本节后，确认以下内容：

- [ ] 创建了 `src/lib/utils.ts`，包含 `cn()` 函数
- [ ] 成功执行 `pnpm dlx shadcn@latest init`，生成了 `components.json`
- [ ] 成功批量安装组件，`src/components/ui/` 下有 ≥ 15 个组件文件
- [ ] 理解 shadcn/ui "拥有你的代码"的核心理念
- [ ] 理解 Radix UI 在 shadcn/ui 中的角色（行为 + 可访问性，无样式）
- [ ] 理解 `cn()` 在组件中的作用（条件拼接 + 冲突解决）
- [ ] 理解 `rsc: false` 的含义（SPA 不使用 Server Components）
- [ ] 知道 `className` 放在 `cn()` 参数最后确保用户类名覆盖默认样式

---

[← 上一篇](./04-配置Vite与TypeScript.md) | [下一篇 →](./06-全局样式与字体.md)
