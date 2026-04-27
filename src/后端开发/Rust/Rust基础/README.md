---
title: 入门实战概览
icon: fa6-solid:graduation-cap
index: false
order: 1
category:
  - Rust基础
---

# Rust 入门实战

> 整合三大官方资源，从 C# 开发者视角系统学习 Rust 基础。

## 资源对照表

| 章节 | The Rust Book | Rustlings | Rust by Example |
|------|-------------|-----------|----------------|
| [01 开发环境搭建](./01_开发环境搭建.md) | Ch.1 | - | Ch.1 |
| [02 Hello World 与 Cargo](./02_Hello_World与Cargo基础.md) | Ch.1-2 | intro1/2 | Ch.1 Cargo |
| [03 所有权与 Move 语义](./03_所有权与Move语义.md) | Ch.4 | move_semantics | Ch.4 |
| [04 借用与引用规则](./04_借用与引用规则.md) | Ch.4.2-4.3 | references | Ch.4 |
| [05 生命周期标注](./05_生命周期标注.md) | Ch.10.3 | lifetimes | Ch.16 |
| [06 结构体与枚举](./06_结构体与枚举.md) | Ch.5-6 | structs, enums | Ch.3, Ch.9 |
| [07 Trait 与泛型](./07_Trait与泛型.md) | Ch.10.1-10.2 | traits, generics | Ch.14 |
| [08 错误处理 Result 与 ?](./08_错误处理Result与?.md) | Ch.9 | error_handling | Ch.18 |
| [09 迭代器与闭包](./09_迭代器与闭包.md) | Ch.13 | iterators, closures | Ch.11 |
| [10 智能指针与内部可变性](./10_智能指针与内部可变性.md) | Ch.15 | smart_pointers | Ch.19 |
| [11 并发安全与异步基础](./11_并发安全与异步基础.md) | Ch.16 + Async Book | threads | Ch.20 |

## 学习建议

1. 顺序阅读，不要跳章
2. 每章的 Rustlings 练习跑通后再看下一章
3. 遇到借用检查器报错，先看「常见编译错误」表，再问 Claude
4. 所有权 / 借用 / 生命周期（第3-5章）是最难关，建议花 50% 的时间
