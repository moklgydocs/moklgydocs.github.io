---
title: 加载与存储
index: false
icon: fa6-solid:arrow-right-arrow-left
order: 3
category:
  - CSharp
tag:
  - IL
  - 加载
  - 存储
---

# 加载与存储

> IL 是栈式语言，一切操作都围绕"压栈-计算-出栈"展开。加载与存储指令是使用频率最高的指令族。

| 文章 | 内容 |
|------|------|
| [01 · 常量加载](01_常量加载.md) | ldc.i4/ldc.i8/ldc.r4/ldc.r8/ldstr/ldnull/ldtoken |
| [02 · 局部变量](02_局部变量.md) | ldloc/stloc/ldloca，短格式 _0~_3/_S |
| [03 · 参数访问](03_参数访问.md) | ldarg/starg/ldarga，实例方法 this = arg0 |
| [04 · 间接寻址](04_间接寻址.md) | ldind.*/stind.*，通过指针读写内存 |
