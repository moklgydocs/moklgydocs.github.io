# CSS 布局实战课程设计

> 模块编号：11 | 场景驱动的 Tailwind CSS 布局专项训练
> 面向后端开发者，原理+实战结合，最终形成布局肌肉记忆

## 背景

用户是后端开发者（ASP.NET Core），正在编写 React + TSX + Tailwind CSS 的 SaaS 教程项目（已有 10 个模块 73 篇文档）。flex 能用但不扎实，复杂布局靠试，希望"彻底学会网页布局"——原理要懂、实用要能干活、最终形成肌肉记忆。

## 目标

完成本模块后，读者能够：
1. 看到 SaaS 管理后台的设计稿，直接写出布局代码，不需要反复调试
2. 理解 flex / grid / position 的核心原理，遇到没见过的布局也能推理出来
3. 掌握 Tailwind CSS 布局相关 class 的直觉映射，不再频繁查文档

## 设计决策

### 为什么选场景驱动而非知识递进

- 用户已有 73 篇文档都是场景驱动（SSO、权限、文件……），风格一致
- 场景驱动每篇产出可用页面，成就感强，不枯燥
- 速查篇（00）弥补了知识体系化需求
- 从最简登录页到最复杂仪表盘，难度梯度自然递增

### 为什么对照实验是核心环节

后端开发者学 CSS 布局最大的障碍不是"不知道怎么做"，而是"不知道为什么这样做"。对照实验展示"错误写法 vs 正确写法"的视觉差异，让抽象的 CSS 属性变成可感知的因果链。

## 模块结构

共 8 篇文档，放在 `11-CSS布局实战/` 目录下：

| 序号 | 文件名 | 场景 | 核心布局技术 | 参考页面 |
|------|--------|------|------------|---------|
| 0 | `00-布局速查手册.md` | CSS 布局核心概念一页纸 | 盒模型、display 家族、position、单位 | — |
| 1 | `01-登录页居中布局.md` | 居中卡片 + 背景装饰 | flex 居中、min-h-screen、position absolute | LoginPage |
| 2 | `02-管理后台框架布局.md` | 侧边栏 + 顶栏 + 内容区 | grid areas、SidebarProvider、sticky | AppLayout |
| 3 | `03-数据列表页布局.md` | 搜索栏 + 表格 + 分页 | flex 嵌套、sticky header、overflow | AppsPage |
| 4 | `04-详情页Tab布局.md` | 标签页切换 + 滚动内容 | grid 嵌套、scrollbar-gutter、Tabs | TenantDetail |
| 5 | `05-表单页布局.md` | 标签+输入对齐 + 校验提示 | grid label/field 对齐、gap、错误状态 | AppsPage Dialog |
| 6 | `06-文件管理器布局.md` | 左树+右列表分栏 | grid 分栏、resize、拖拽排序 | FileManager |
| 7 | `07-仪表盘网格布局.md` | 多尺寸卡片网格 | grid auto-fit/minmax、响应式断点 | PlatformOverview |

## 各篇详细设计

### 00-布局速查手册

**定位**：纯知识文档，无代码实现，作为后续 7 篇的"字典"随时回查。

**内容清单**：

1. **盒模型**
   - `content-box` vs `border-box`（后端类比：值类型 vs 引用类型的内存布局）
   - 为什么 Tailwind 默认 `border-box`——`*, *::before, *::after { box-sizing: border-box }`

2. **display 家族决策树**
   - `block`：独占一行（div、p、h1）
   - `inline`：行内排布（span、a、strong）
   - `inline-block`：行内但可设宽高（后端类比：inline 是 string 不可变，inline-block 是 StringBuilder 可追加）
   - `flex`：一维弹性布局
   - `grid`：二维网格布局
   - `none`：不渲染（vs `visibility: hidden` vs `opacity: 0`）

3. **position 家族**
   - `static`：默认，文档流
   - `relative`：相对自身偏移，不脱离文档流
   - `absolute`：相对最近定位祖先，脱离文档流
   - `fixed`：相对视口，脱离文档流
   - `sticky`：relative + fixed 混合体

4. **单位速查**
   - `px`：绝对像素
   - `rem`：相对根字号（Tailwind 的默认单位）
   - `em`：相对父元素字号
   - `%`：相对父元素
   - `vw` / `vh`：视口百分比
   - `dvh`：动态视口高度（移动端地址栏收缩时变化）

5. **Tailwind 对应快查表**
   - 每个 CSS 属性 → 对应的 Tailwind class

---

### 01-登录页居中布局

**场景**：还原 LoginPage——左侧品牌区 + 右侧登录表单卡片。

**原理讲解**：
- `min-h-screen`：为什么不用 `height: 100vh`（移动端地址栏问题，`100vh` 是最大视口高度）
- `flex items-center justify-center`：主轴 vs 交叉轴的可视化图解
  - 主轴（main axis）：`flex-direction: row` 时为水平
  - 交叉轴（cross axis）：与主轴垂直
  - `justify-*` 控制主轴，`items-*` 控制交叉轴
- `position: absolute` 装饰元素：脱离文档流，不参与 flex 布局计算

**对照实验**：
1. 用 `margin: auto` 居中 vs `flex` 居中——flex 不需要知道元素尺寸
2. 忘了 `min-h-screen`——卡片挤在页面顶部
3. `100vh` vs `100dvh` 在手机上的差异

**代码实现**：完整还原 LoginPage 的布局骨架（去掉 framer-motion 等非布局逻辑）

---

### 02-管理后台框架布局

**场景**：还原 AppLayout——侧边栏 + 顶栏 + 内容区。

**原理讲解**：
- CSS Grid `grid-template-areas`：
  ```css
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  grid-template-columns: var(--sidebar-width) 1fr;
  grid-template-rows: 56px 1fr;
  ```
  给布局区域起名字，比写行列号更直观
- `SidebarProvider` 如何用 CSS 变量 `--sidebar-width` 控制侧边栏宽度
- `sticky top-0`：`sticky` 是 `relative` + `fixed` 的混合体——在滚动阈值前表现为 relative，超过后表现为 fixed
- `SidebarInset`：监听侧边栏宽度变化，自动添加左内边距

**对照实验**：
1. 用 flex 实现侧边栏 vs 用 grid——grid 天然支持区域命名和行列独立控制
2. `overflow: hidden` vs `overflow: auto` 在内容区——滚动条消失 vs 内容可滚动

**代码实现**：简化版 AppLayout + AppSidebar + AppHeader（保留布局核心，去掉业务逻辑如动态菜单、租户切换）

---

### 03-数据列表页布局

**场景**：还原权限中心的角色管理页——搜索 + 筛选 + 表格 + 分页。

**原理讲解**：
- flex 嵌套结构：
  ```
  外层 flex-col（垂直）
  ├── 搜索区（shrink-0，固定高度）
  ├── 表格区（flex-1 overflow-auto，占满剩余空间）
  └── 分页区（shrink-0，固定高度）
  ```
- `flex-1`：`flex: 1 1 0%` 的简写，等价于 `flex-grow: 1; flex-shrink: 1; flex-basis: 0%`
- `shrink-0`：`flex-shrink: 0`，不允许被压缩——分页区必须完整显示
- `overflow-auto`：只在内容溢出时显示滚动条（vs `overflow-scroll` 总是显示）

**对照实验**：
1. 不加 `flex-1` 的表格区——表格只占内容高度，底部大片空白
2. 不加 `overflow-auto`——表格撑破容器，页面整体滚动
3. 不加 `shrink-0` 的分页区——空间不足时分页被压缩变形

**代码实现**：标准列表页骨架（搜索区 + 表格区 + 分页区）

---

### 04-详情页Tab布局

**场景**：还原租户详情页——Tab 切换 + 每个 Tab 独立滚动。

**原理讲解**：
- 嵌套布局：
  ```
  外层 h-full flex flex-col
  ├── Tab 头（shrink-0）
  └── Tab 内容（flex-1 overflow-auto）
  ```
- `scrollbar-gutter: stable`：为滚动条预留空间，避免内容出现/消失滚动条时宽度跳动
- `overflow: hidden` 父容器 + `overflow: auto` 子容器的配合：父容器裁剪溢出，子容器提供滚动

**对照实验**：
1. 不用 `scrollbar-gutter`——切换 Tab 时内容区宽度抖动
2. Tab 内容区不加 `flex-1 overflow-auto`——内容溢出整个页面，Tab 头被推走
3. 父容器不加 `overflow: hidden`——子容器的滚动条可能溢出到父容器外

**代码实现**：Tab 详情页骨架

---

### 05-表单页布局

**场景**：还原应用管理的新增/编辑表单。

**原理讲解**：
- CSS Grid 的 `grid-template-columns: auto 1fr`：
  - `auto` 列：标签列，宽度由最宽标签决定
  - `1fr` 列：输入列，填满剩余空间
  - 对比 flex + 固定宽度标签：grid 的标签列能自适应最宽标签
- `gap`：替代 margin 的现代间距方案——只影响网格项之间，不影响边缘
- 表单校验提示的布局：错误信息占据新的 grid row，不破坏标签-输入的对齐

**对照实验**：
1. flex + 固定宽度标签 vs grid auto 1fr——grid 的标签列自适应
2. 错误提示用 `absolute` 定位 vs 占据文档流——absolute 会导致内容跳动
3. 用 `gap` vs 用 `margin`——gap 不会在边缘产生多余间距

**代码实现**：标准表单骨架

---

### 06-文件管理器布局

**场景**：还原文件服务的树+列表分栏布局。

**原理讲解**：
- CSS Grid 分栏：`grid-template-columns: 280px 1fr`
  - 固定左栏 280px + 弹性右栏 1fr
- 拖拽调整分栏宽度：鼠标事件 + CSS 变量动态更新
- 树形结构的缩进布局：`padding-left` 递增（每层 +20px）

**对照实验**：
1. 固定宽度分栏 vs 可拖拽分栏——用户可自定义工作区
2. 树形缩进用 `margin-left` vs `padding-left`——margin 影响兄弟元素间距计算
3. 左栏不加 `overflow: auto`——树节点很多时左栏撑破容器

**代码实现**：分栏管理器骨架（左树 + 右列表 + 可拖拽分隔条）

---

### 07-仪表盘网格布局

**场景**：还原租户运营中心的仪表盘——多尺寸卡片网格。

**原理讲解**：
- `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` 逐词拆解：
  - `repeat()`：重复模式
  - `auto-fit`：自动填充可用空间（vs `auto-fill` 保留空列）
  - `minmax(280px, 1fr)`：每列最小 280px，最大等分剩余空间
- `grid-column: span 2`：大卡片跨两列
- 响应式断点策略：
  - Tailwind 断点：`sm:640px` / `md:768px` / `lg:1024px` / `xl:1280px` / `2xl:1536px`
  - 移动优先：默认手机布局，`md:` 加宽，`lg:` 再加宽

**对照实验**：
1. `auto-fit` vs `auto-fill`——空列是否保留
2. `minmax(280px, 1fr)` 中 280px 太大/太小的后果——卡片折行异常
3. 用 flex wrap 实现卡片流 vs 用 grid auto-fit——grid 自动计算列数

**代码实现**：仪表盘网格骨架（多尺寸卡片 + 响应式断点）

---

## 文档模板

每篇遵循现有 73 篇的结构模板，但增加两个特色环节：

```
> **这一步解决什么问题？**
  — 1-3 句话说明本篇要完成什么布局

## 前置知识
  — 布局原理图解（ASCII/图表）
  — 与后端类比

## 原理图解
  — NEW: 用可视化方式解释核心布局概念
  — flex 主轴/交叉轴、grid 线编号、position 层叠等

## 对照实验
  — NEW: 错误写法 vs 正确写法的对比
  — 每个实验配截图说明或 ASCII 模拟

## 代码实现
  — 完整可运行的布局代码

## 代码讲解
  — 关键布局决策的 Why
  — 【易错点】【性能陷阱】【设计取舍】标记

## 踩坑提醒
  — 编号列表

## 自测题
  — 概念级 / 推理级 / 动手级 三级递进

## 验证步骤
  — 独立可操作的验证清单

## 输出检查清单
  — checkbox 格式
```

## 与现有模块的关系

- **依赖**模块 01（React 入门与环境搭建）
- **重叠**模块 02 的 05-布局组件：模块 02 讲的是"布局组件的代码实现"（AppLayout 的业务逻辑），本模块讲的是"布局本身的 CSS 原理"——互补关系
- **参考**：所有场景均取自 AdminWeb 真实项目

## 统计

- **总章节**：8 篇
- **覆盖场景**：7 种 SaaS 管理后台典型页面布局
- **对照实验**：16 组（每篇 2-3 组）
- **技术栈**：React + TSX + Tailwind CSS v4 + Vite
