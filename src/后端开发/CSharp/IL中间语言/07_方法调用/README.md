---
title: 方法调用
index: false
icon: fa6-solid:phone
order: 7
category:
  - CSharp
tag:
  - IL
  - 方法调用
  - call
  - callvirt
---

# 方法调用

> 方法调用是 .NET 运行时最频繁的操作之一。call vs callvirt 的差异、尾调用优化、函数指针调用，直接影响程序行为与性能。

| 文章 | 内容 |
|------|------|
| [01 · call 与 callvirt](01_call与callvirt.md) | 直接调用 vs 虚方法调用，null 检查差异 |
| [02 · calli 与尾调用](02_calli与尾调用.md) | 函数指针调用 calli，tail. 前缀优化 |
| [03 · ret 与 jmp](03_ret与jmp.md) | 返回指令、方法级跳转 |
