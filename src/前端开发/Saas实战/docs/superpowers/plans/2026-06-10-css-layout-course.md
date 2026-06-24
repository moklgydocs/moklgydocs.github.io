# CSS 布局实战课程 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建模块 11「CSS布局实战」的 8 篇教程文档，覆盖 SaaS 管理后台 7 种典型页面布局

**Architecture:** 每篇文档遵循现有 73 篇的模板结构（前置知识→代码实现→代码讲解→踩坑提醒→自测题→验证步骤→输出检查清单），新增"原理图解"和"对照实验"两个特色环节。所有代码示例取自 AdminWeb 真实项目，简化为布局骨架。

**Tech Stack:** React + TSX + Tailwind CSS v4 + Vite

---

## 文件结构

```
11-CSS布局实战/
├── README.md                        # 模块导航页
├── 00-布局速查手册.md                # 纯知识文档，无代码
├── 01-登录页居中布局.md              # LoginPage 布局骨架
├── 02-管理后台框架布局.md            # AppLayout 布局骨架
├── 03-数据列表页布局.md              # 列表页布局骨架
├── 04-详情页Tab布局.md               # Tab 详情页布局骨架
├── 05-表单页布局.md                  # 表单布局骨架
├── 06-文件管理器布局.md              # 分栏布局骨架
└── 07-仪表盘网格布局.md              # 仪表盘网格骨架
```

---

### Task 1: 创建模块目录和 README 导航页

**Files:**
- Create: `11-CSS布局实战/README.md`

- [ ] **Step 1: 创建目录**

```bash
mkdir -p "e:/博客/moklgydocs.github.io/src/前端开发/Saas实战/11-CSS布局实战"
```

- [ ] **Step 2: 编写 README.md**

```markdown
# CSS 布局实战

> 面向后端开发者的 Tailwind CSS 布局专项训练。用 SaaS 管理后台的真实页面当靶子，每篇讲透一个布局场景，原理+实战结合，最终形成"看到设计稿就能直接写布局代码"的肌肉记忆。
> 参考项目：[AdminWeb](../..) — 已上线可用的真实项目。

## 前置要求

完成 [01-React入门与环境搭建](../01-React入门与环境搭建/) 全部步骤。

## 步骤导航

| 步骤 | 文件 | 场景 | 核心布局技术 |
|------|------|------|------------|
| 0 | [00-布局速查手册](./00-布局速查手册.md) | CSS 布局核心概念一页纸 | 盒模型、display 家族、position、单位 |
| 1 | [01-登录页居中布局](./01-登录页居中布局.md) | 居中卡片 + 背景装饰 | flex 居中、min-h-screen、position absolute |
| 2 | [02-管理后台框架布局](./02-管理后台框架布局.md) | 侧边栏 + 顶栏 + 内容区 | grid areas、SidebarProvider、sticky |
| 3 | [03-数据列表页布局](./03-数据列表页布局.md) | 搜索栏 + 表格 + 分页 | flex 嵌套、sticky header、overflow |
| 4 | [04-详情页Tab布局](./04-详情页Tab布局.md) | 标签页切换 + 滚动内容 | grid 嵌套、scrollbar-gutter、Tabs |
| 5 | [05-表单页布局](./05-表单页布局.md) | 标签+输入对齐 + 校验提示 | grid label/field 对齐、gap、错误状态 |
| 6 | [06-文件管理器布局](./06-文件管理器布局.md) | 左树+右列表分栏 | grid 分栏、resize、拖拽排序 |
| 7 | [07-仪表盘网格布局](./07-仪表盘网格布局.md) | 多尺寸卡片网格 | grid auto-fit/minmax、响应式断点 |

[返回上级](../)
```

- [ ] **Step 3: Commit**

```bash
git add "11-CSS布局实战/README.md"
git commit -m "feat: add module 11 CSS布局实战 navigation page"
```

---

### Task 2: 编写 00-布局速查手册

**Files:**
- Create: `11-CSS布局实战/00-布局速查手册.md`

这是纯知识文档，无代码实现。内容涵盖：盒模型、display 家族决策树、position 家族、单位速查、Tailwind 对应快查表。每项配后端类比。遵循现有文档模板但省略"代码实现"和"验证步骤"环节。

- [ ] **Step 1: 编写完整文档**

文档结构：
- 开头引言（> 这一节解决什么问题？）
- 前置知识（无，这是最基础的知识点）
- 盒模型：content-box vs border-box，配后端类比（值类型 vs 引用类型的内存布局），Tailwind 默认 border-box 的原因
- display 家族决策树：block / inline / inline-block / flex / grid / none，配决策流程 ASCII 图
- position 家族：static / relative / absolute / fixed / sticky，配层叠示意图
- 单位速查：px / rem / em / % / vw / vh / dvh，配适用场景表
- Tailwind 对应快查表：CSS 属性 → Tailwind class 对照表
- 踩坑提醒（2 条以上）
- 自测题（概念级/推理级/动手级）
- 输出检查清单

- [ ] **Step 2: Commit**

```bash
git add "11-CSS布局实战/00-布局速查手册.md"
git commit -m "feat: add 00-布局速查手册"
```

---

### Task 3: 编写 01-登录页居中布局

**Files:**
- Create: `11-CSS布局实战/01-登录页居中布局.md`

场景：还原 LoginPage——左侧品牌区 + 右侧登录表单卡片。

- [ ] **Step 1: 编写完整文档**

文档结构：
- 开头引言
- 前置知识：min-h-screen vs 100vh、flex 主轴/交叉轴可视化
- 原理图解：flex 主轴交叉轴 ASCII 图、position absolute 脱离文档流示意
- 对照实验：margin auto 居中 vs flex 居中、忘了 min-h-screen、100vh vs 100dvh
- 代码实现：LoginPage 布局骨架（去掉了 framer-motion，保留布局核心）
- 代码讲解：min-h-screen 原因、flex 居中原理、absolute 装饰元素
- 踩坑提醒
- 自测题（概念级/推理级/动手级）
- 验证步骤
- 输出检查清单
- 上下导航链接

- [ ] **Step 2: Commit**

```bash
git add "11-CSS布局实战/01-登录页居中布局.md"
git commit -m "feat: add 01-登录页居中布局"
```

---

### Task 4: 编写 02-管理后台框架布局

**Files:**
- Create: `11-CSS布局实战/02-管理后台框架布局.md`

场景：还原 AppLayout——侧边栏 + 顶栏 + 内容区。

- [ ] **Step 1: 编写完整文档**

文档结构：
- 开头引言（配 .NET 类比：_Layout.cshtml / _NavMenu.cshtml / @RenderBody()）
- 前置知识：CSS Grid grid-template-areas、SidebarProvider CSS 变量机制
- 原理图解：grid-template-areas 命名区域示意图、sticky 定位阈值示意图
- 对照实验：flex vs grid 实现侧边栏、overflow hidden vs auto
- 代码实现：简化版 AppLayout + AppSidebar + AppHeader（保留布局核心，去掉动态菜单和租户切换业务逻辑）
- 代码讲解：grid-template-areas 优势、SidebarProvider CSS 变量控制宽度、sticky 原理
- 踩坑提醒
- 自测题
- 验证步骤
- 输出检查清单
- 上下导航链接

- [ ] **Step 2: Commit**

```bash
git add "11-CSS布局实战/02-管理后台框架布局.md"
git commit -m "feat: add 02-管理后台框架布局"
```

---

### Task 5: 编写 03-数据列表页布局

**Files:**
- Create: `11-CSS布局实战/03-数据列表页布局.md`

场景：还原权限中心的角色管理页——搜索 + 筛选 + 表格 + 分页。

- [ ] **Step 1: 编写完整文档**

文档结构：
- 开头引言
- 前置知识：flex 嵌套、flex-1 / shrink-0 / overflow-auto
- 原理图解：flex 嵌套垂直三段式结构 ASCII 图、flex-1 计算原理
- 对照实验：不加 flex-1、不加 overflow-auto、不加 shrink-0
- 代码实现：标准列表页骨架（搜索区 + 表格区 + 分页区）
- 代码讲解：flex-1 等价展开、shrink-0 的必要性、overflow-auto vs overflow-scroll
- 踩坑提醒
- 自测题
- 验证步骤
- 输出检查清单
- 上下导航链接

- [ ] **Step 2: Commit**

```bash
git add "11-CSS布局实战/03-数据列表页布局.md"
git commit -m "feat: add 03-数据列表页布局"
```

---

### Task 6: 编写 04-详情页Tab布局

**Files:**
- Create: `11-CSS布局实战/04-详情页Tab布局.md`

场景：还原租户详情页——Tab 切换 + 每个 Tab 独立滚动。

- [ ] **Step 1: 编写完整文档**

文档结构：
- 开头引言
- 前置知识：嵌套 flex 布局、scrollbar-gutter、overflow 配合
- 原理图解：Tab 布局的嵌套 flex 结构图、scrollbar-gutter 稳定滚动条原理
- 对照实验：不用 scrollbar-gutter 宽度抖动、Tab 内容区不加 flex-1 overflow-auto、父容器不加 overflow hidden
- 代码实现：Tab 详情页骨架
- 代码讲解：flex-col 嵌套、scrollbar-gutter: stable 原理、overflow hidden+auto 配合
- 踩坑提醒
- 自测题
- 验证步骤
- 输出检查清单
- 上下导航链接

- [ ] **Step 2: Commit**

```bash
git add "11-CSS布局实战/04-详情页Tab布局.md"
git commit -m "feat: add 04-详情页Tab布局"
```

---

### Task 7: 编写 05-表单页布局

**Files:**
- Create: `11-CSS布局实战/05-表单页布局.md`

场景：还原应用管理的新增/编辑表单。

- [ ] **Step 1: 编写完整文档**

文档结构：
- 开头引言
- 前置知识：CSS Grid 的 grid-template-columns: auto 1fr、gap
- 原理图解：grid auto 1fr 对齐原理图、gap vs margin 差异图
- 对照实验：flex 固定宽度 vs grid auto 1fr、absolute 错误提示 vs 文档流、gap vs margin
- 代码实现：标准表单骨架
- 代码讲解：auto 列自适应最宽标签、1fr 填满剩余、gap 只影响网格项之间、错误信息占据新 grid row
- 踩坑提醒
- 自测题
- 验证步骤
- 输出检查清单
- 上下导航链接

- [ ] **Step 2: Commit**

```bash
git add "11-CSS布局实战/05-表单页布局.md"
git commit -m "feat: add 05-表单页布局"
```

---

### Task 8: 编写 06-文件管理器布局

**Files:**
- Create: `11-CSS布局实战/06-文件管理器布局.md`

场景：还原文件服务的树+列表分栏布局。

- [ ] **Step 1: 编写完整文档**

文档结构：
- 开头引言
- 前置知识：CSS Grid 分栏、拖拽调整宽度、树形缩进
- 原理图解：grid 分栏 280px 1fr 示意图、拖拽分隔条交互原理
- 对照实验：固定宽度 vs 可拖拽分栏、margin-left vs padding-left 缩进、左栏不加 overflow auto
- 代码实现：分栏管理器骨架（左树 + 右列表 + 可拖拽分隔条）
- 代码讲解：grid-template-columns 固定+弹性、拖拽分隔条实现思路、padding-left 递增缩进
- 踩坑提醒
- 自测题
- 验证步骤
- 输出检查清单
- 上下导航链接

- [ ] **Step 2: Commit**

```bash
git add "11-CSS布局实战/06-文件管理器布局.md"
git commit -m "feat: add 06-文件管理器布局"
```

---

### Task 9: 编写 07-仪表盘网格布局

**Files:**
- Create: `11-CSS布局实战/07-仪表盘网格布局.md`

场景：还原租户运营中心的仪表盘——多尺寸卡片网格。

- [ ] **Step 1: 编写完整文档**

文档结构：
- 开头引言
- 前置知识：repeat(auto-fit, minmax()) 逐词拆解、grid-column span、Tailwind 响应式断点
- 原理图解：auto-fit/minmax 卡片自动折行示意图、span 2 大卡片网格图
- 对照实验：auto-fit vs auto-fill、minmax 值太大/太小、flex wrap vs grid auto-fit
- 代码实现：仪表盘网格骨架（多尺寸卡片 + 响应式断点）
- 代码讲解：repeat/auto-fit/minmax 每个关键词的含义、span 2 跨列、移动优先断点策略
- 踩坑提醒
- 自测题
- 验证步骤
- 输出检查清单
- 上下导航链接

- [ ] **Step 2: Commit**

```bash
git add "11-CSS布局实战/07-仪表盘网格布局.md"
git commit -m "feat: add 07-仪表盘网格布局"
```

---

### Task 10: 更新主 README 添加模块 11 导航

**Files:**
- Modify: `README.md`（在模块导航的"业务篇"之后或"基础篇"末尾添加模块 11 的链接）

- [ ] **Step 1: 在 README.md 中添加模块 11 条目**

在现有模块导航区域（基础篇或业务篇之后）添加：

```markdown
#### [11-CSS布局实战](./11-CSS布局实战/)（8 步）

| 步骤 | 文件 | 核心内容 |
|------|------|----------|
| 0 | [00-布局速查手册](./11-CSS布局实战/00-布局速查手册.md) | 盒模型、display 家族、position、单位 |
| 1 | [01-登录页居中布局](./11-CSS布局实战/01-登录页居中布局.md) | flex 居中、min-h-screen、position absolute |
| 2 | [02-管理后台框架布局](./11-CSS布局实战/02-管理后台框架布局.md) | grid areas、SidebarProvider、sticky |
| 3 | [03-数据列表页布局](./11-CSS布局实战/03-数据列表页布局.md) | flex 嵌套、sticky header、overflow |
| 4 | [04-详情页Tab布局](./11-CSS布局实战/04-详情页Tab布局.md) | grid 嵌套、scrollbar-gutter、Tabs |
| 5 | [05-表单页布局](./11-CSS布局实战/05-表单页布局.md) | grid label/field 对齐、gap、错误状态 |
| 6 | [06-文件管理器布局](./11-CSS布局实战/06-文件管理器布局.md) | grid 分栏、resize、拖拽排序 |
| 7 | [07-仪表盘网格布局](./11-CSS布局实战/07-仪表盘网格布局.md) | grid auto-fit/minmax、响应式断点 |
```

同时更新统计部分：
- 总章节：11 章（3 基础篇 + 7 业务篇 + 1 布局篇）
- 总步骤：81 篇

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "feat: add module 11 CSS布局实战 to main navigation"
```

---

## 自检

**1. Spec 覆盖**：8 篇文档（速查 + 7 场景）均有对应 Task，每篇的原理讲解、对照实验、代码实现均在 Task 描述中明确。

**2. Placeholder 扫描**：无 TBD/TODO/待定内容。所有 Task 都指定了具体文件名和内容范围。

**3. 类型一致性**：文档模板统一，文件命名遵循现有模块的 `XX-标题.md` 格式，导航链接结构一致。
