# shadcn/ui 初始化

## 本步目标

用 shadcn CLI 初始化并安装常用 UI 组件，理解 shadcn/ui "拥有你的代码"的核心理念。

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

---

## 代码实现

### 初始化 shadcn/ui

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
| `rsc` | 是否使用 React Server Components（我们用 SPA，设为 false） |
| `tsx` | 使用 TypeScript |
| `tailwind.css` | 全局样式文件路径 |
| `tailwind.cssVariables` | 使用 CSS 变量定义颜色主题 |
| `aliases.ui` | UI 组件的导入路径别名 |

### 批量安装组件

```bash
pnpm dlx shadcn@latest add button card dialog input label select table tabs sidebar tooltip dropdown-menu sheet form badge separator scroll-area skeleton switch command sonner
```

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

如果页面正常显示一个卡片和四个不同风格的按钮，说明 shadcn/ui 初始化成功。

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

---

## 踩坑提醒

1. **shadcn init 的样式选择影响全局**：`New York` 风格更紧凑专业，`Default` 风格更圆润休闲。企业级项目推荐 `New York`。选择后所有组件都会遵循这个风格，切换成本很高。
2. **组件更新需要手动 re-add**：shadcn/ui 的组件在你的项目中，不受 `pnpm update` 影响。如果上游修复了 Bug，你需要重新执行 `pnpm dlx shadcn add button` 覆盖。**注意：这会覆盖你的自定义修改！** 建议用 Git 管理，更新前先 `git stash`。
3. **不要随意修改 ui/ 下的组件**：虽然你可以修改，但建议只在外层 wrapper 中自定义。直接改 `button.tsx` 意味着你失去了上游更新的能力（覆盖会丢失你的修改）。
4. **全局 CSS 路径必须正确**：`components.json` 中的 `tailwind.css` 路径必须指向实际的 CSS 文件，否则组件样式不生效。

---

## 自测题

### 入门（2 题）

1. shadcn/ui 和 Ant Design 的根本区别是什么？为什么 shadcn/ui 不是一个 npm 包？
2. `pnpm dlx shadcn add button` 执行后，代码被放到了哪里？

### 进阶（2 题）

3. Radix UI 在 shadcn/ui 中扮演什么角色？为什么说它是"无样式的可访问性原语"？
4. `cn()` 函数在 shadcn/ui 组件中起什么作用？如果不用 `cn()` 直接拼接字符串会怎样？

### 架构（2 题）

5. 如果你的团队需要在 5 个项目中共享一套基于 shadcn/ui 的定制组件（改了颜色和交互），你会如何设计组件分发方案？
6. shadcn/ui 的"源码复制"模式在安全审计方面有什么优势？企业项目中如何利用这个优势做组件合规检查？

---

[← 上一篇](./04-配置Vite与TypeScript.md) | [下一篇 →](./06-全局样式与字体.md)
