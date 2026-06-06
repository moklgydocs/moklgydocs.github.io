---
title: 数字逻辑基础
icon: fa6-solid:signal
order: 1
index: false
category:
  - 计算机学科
  - 数字电路
---

> 如果把数字电路比作一门语言，那么数字逻辑基础就是它的字母表和发音规则——不了解这些，你将无法读懂任何一句"电路之语"。

## 本章概览

本章介绍数字电路的基本概念，包括模拟信号与数字信号的区别、各种数制及其转换方法、二进制运算规则等。这些内容是后续学习逻辑代数和电路分析的基石。

```mermaid
graph TD
    A[数字逻辑基础] --> B[数字信号与模拟信号]
    A --> C[数制转换]
    A --> D[二进制运算]

    B --> B1[信号分类与特点]
    B --> B2[数字电路分类]
    B --> B3[码制]

    C --> C1[任意进制转十进制]
    C --> C2[十进制转任意进制]
    C --> C3[二八十六进制互转]

    D --> D1[补码运算]
    D --> D2[溢出判断]

    style A fill:#e1f5fe,stroke:#0288d1,color:#01579b
    style B fill:#f3e5f5,stroke:#7b1fa2,color:#4a148c
    style C fill:#e8f5e9,stroke:#388e3c,color:#1b5e20
    style D fill:#fff3e0,stroke:#f57c00,color:#e65100
```

## 本章文章

- [数字信号与模拟信号](01_数字信号与模拟信号.md)
- [数制转换](02_数制转换.md)
- [二进制运算](03_二进制运算.md)
