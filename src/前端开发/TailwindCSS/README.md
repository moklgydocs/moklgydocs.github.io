---
title: TailwindCSS 完整知识库
icon: paintbrush
index: false
category:
  - 前端开发
tag:
  - Tailwind CSS
  - CSS
  - 原子化
---

# TailwindCSS 完整知识库

> 从原理到生产实战，覆盖 6 个学习阶段的系统化 Tailwind CSS 知识体系。包含原理剖析、配置详解、10 大核心类速查、6 类实战组件、踩坑大全、团队规范、性能优化与面试题集。

## 学习路线

| 阶段 | 内容 | 建议时间 | 对应章节 |
|------|------|---------|---------|
| 阶段1 | 核心原理 | 1-2 天 | [原理篇](01.原理篇.md) |
| 阶段2 | 配置系统 | 1 天 | [配置篇](02.配置篇.md) |
| 阶段3 | 核心类速查 | 3-5 天 | [速查手册](02.速查手册/) |
| 阶段4 | 响应式 & 暗色模式 | 1 天 | [响应式](02.速查手册/10.响应式.md) |
| 阶段5 | 高级技巧 | 2-3 天 | [踩坑大全](04.踩坑大全.md) / [团队规范](05.团队规范.md) |
| 阶段6 | 生产级实战 | 持续 | [实战组件](03.实战组件/) / [性能优化](06.性能优化.md) |

## 文档索引

### 基础篇

- [01.原理篇](01.原理篇.md) — Utility-First / JIT / PostCSS 链路 / 三大范式对比
- [02.配置篇](02.配置篇.md) — tailwind.config.js / Design Token / 插件系统

### 速查手册

- [布局](02.速查手册/01.布局.md) — Flex / Grid / Position / Display / Overflow
- [间距](02.速查手册/02.间距.md) — Padding / Margin / Gap / Space
- [尺寸](02.速查手册/03.尺寸.md) — Width / Height / Min / Max / Size
- [排版](02.速查手册/04.排版.md) — Font / Text / Leading / Tracking / Truncate
- [颜色](02.速查手册/05.颜色.md) — bg / text / border / ring / 渐变 / 透明度
- [边框](02.速查手册/06.边框.md) — Border / Rounded / Ring / Outline / Divide
- [效果](02.速查手册/07.效果.md) — Shadow / Opacity / Blur / Backdrop Filter
- [动画](02.速查手册/08.动画.md) — Transition / Animate / Transform / Keyframes
- [交互状态](02.速查手册/09.交互状态.md) — hover / focus / group / peer / 伪元素
- [响应式](02.速查手册/10.响应式.md) — Breakpoints / Dark Mode / Container Queries

### 实战组件

- [导航栏](03.实战组件/01.导航栏.md) — Header + Sidebar + Mobile Drawer
- [卡片](03.实战组件/02.卡片.md) — 统计卡 / 内容卡 / 设置卡 / 空状态
- [表格](03.实战组件/03.表格.md) — 数据表格 / 筛选 / 排序 / 分页 / Sticky
- [表单](03.实战组件/04.表单.md) — 输入框 / 选择器 / 校验 / 多列布局 / 上传
- [模态框](03.实战组件/05.模态框.md) — Dialog / Drawer / Alert Dialog
- [仪表盘布局](03.实战组件/06.仪表盘布局.md) — 完整 Dashboard 页面

### 进阶篇

- [04.踩坑大全](04.踩坑大全.md) — 20+ 常见问题与解决方案
- [05.团队规范](05.团队规范.md) — 类名排序 / cn() / 组件抽象 / Code Review
- [06.性能优化](06.性能优化.md) — 产物分析 / 构建调优 / 运行时性能
- [07.面试题集](07.面试题集.md) — 30+ 高频题（原理/实战/架构/对比/手写）

## 技术栈版本

| 依赖 | 版本 |
|------|------|
| Tailwind CSS | 3.4+ / 4.x |
| PostCSS | 8.x |
| Autoprefixer | 10.x |
| clsx + tailwind-merge | latest |
