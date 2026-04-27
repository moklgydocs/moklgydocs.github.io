---
title: Rust 学习路线
icon: fa6-brands:rust
order: 1
category:
  - Rust实战
---

# Rust 学习路线

> 以「Mo 企业工具链」为主线项目贯穿全程，从 C# 开发者视角平滑迁移到 Rust。每个阶段在理论学习后，立即落地一个真实可运行的项目。

---

## 学习路线总览

```
Phase 0（1天）   → 环境破土 + Hello World
Phase 1（1周）   → 核心语言（所有权/Trait/Error Handling）
Phase 2（3天）   → CLI 过渡项目（MoCLI 日志分析工具）
Phase 3（2周）   → 异步 Web 服务（Restrel）
Phase 4（2周）   → 嵌入式开发（MoNode - Embassy on RP2040）
```

---

## 板块说明

### 📚 [Rust实战](./Rust实战/)

整合 **The Rust Book**、**Rustlings**、**Rust by Example** 三大官方资源，每章对应一个知识点，包含：

- C# ↔ Rust 概念并排对比
- Mermaid 内存/数据流示意图
- 对应 Rustlings 练习名
- Rust by Example 速查链接
- 常见编译错误 + 修复方案
- 自测选择题（含答案解析）

### 🛠️ [MoCLI · CLI 日志分析工具](./MoCLI/)

Phase 2 项目。分析 GB 级 JSON 日志，clap + serde + rayon，流式处理内存 < 50MB。

### 🌐 [Restrel · 异步 Web 服务](./Restrel/)

Phase 3 项目。从 TCP 字节流手写 HTTP/1.1（httparse + tokio），对标 Kestrel 架构，P99 < 7ms。

### 🔌 [MoNode · 嵌入式传感器节点](./MoNode/)

Phase 4 项目。Embassy on RP2040，no_std，温湿度采集 + UART 上报，Flash < 80KB。

---

## C# → Rust 核心概念速查

| C# | Rust | 关键区别 |
|----|------|---------|
| `string` / `String` | `&str` / `String` | `&str` 是借用，`String` 拥有所有权 |
| `T?` | `Option<T>` | 必须显式处理 None |
| `try/catch` | `Result<T,E>` + `?` | 错误是值，不是异常 |
| `interface` | `trait` | 支持为外部类型实现 |
| `async Task<T>` | `async fn → Future` | 无 GC，无隐式线程池 |
| `lock (obj)` | `Mutex<T>::lock()` | 锁保护**数据**，不保护代码块 |
| `IDisposable` | `Drop` trait | 离开作用域自动析构，无需 using |
