---
title: .NET IL 中间语言
index: false
icon: fa6-solid:microchip
order: 3
category:
  - CSharp
tag:
  - IL
  - MSIL
  - CIL
  - 中间语言
  - CLR
---

# .NET IL 中间语言

> 深入 .NET 运行的基石 —— 中间语言（IL/MSIL/CIL）。从栈式虚拟机模型到指令集全解，从反编译工具到动态发射，掌握 IL 让你看透 C# 编译器的每一个选择。

## 参考资料

| 资料 | 说明 |
|------|------|
| [ECMA-335 Partition III](https://ecma-international.org/publications-and-standards/standards/ecma-335/) | CIL 指令集官方规范 |
| [System.Reflection.Emit.OpCodes](https://learn.microsoft.com/en-us/dotnet/api/system.reflection.emit.opcodes) | 微软官方 OpCodes API 文档 |
| [System.Reflection.Emit.ILGenerator](https://learn.microsoft.com/en-us/dotnet/api/system.reflection.emit.ilgenerator) | 微软官方 ILGenerator 文档 |
| [OpCode 结构体](https://learn.microsoft.com/en-us/dotnet/api/system.reflection.emit.opcode) | OpCode 元数据属性文档 |
| [dotnet/runtime OpCodes.cs](https://github.com/dotnet/runtime/blob/main/src/libraries/System.Private.CoreLib/src/System/Reflection/Emit/OpCodes.cs) | .NET 运行时源码 |

## 学习路线

```mermaid
graph LR
    A[01 概述篇] --> B[02 工具链篇]
    B --> C[03 加载与存储]
    C --> D[04 算术与位运算]
    D --> E[05 比较与控制流]
    E --> F[06 类型转换]
    F --> G[07 方法调用]
    G --> H[08 对象与类型]
    H --> I[09 异常处理]
    I --> J[10 泛型与IL]
    J --> K[11 委托与函数指针]
    K --> L[12 动态发射]
    L --> M[13 实战篇]

    style A fill:#4CAF50,color:#fff
    style M fill:#FF5722,color:#fff
```

## 章节导航

| 篇章 | 内容 | 文章数 |
|------|------|--------|
| [01 · 概述篇](01_概述篇/) | IL 定义、学习动机、执行模型 | 3 |
| [02 · 工具链篇](02_工具链篇/) | ildasm/ilasm、SharpLab/dnSpy、手写 IL | 3 |
| [03 · 加载与存储](03_加载与存储/) | ldc/ldloc/stloc/ldarg/starg/ldind/stind | 4 |
| [04 · 算术与位运算](04_算术与位运算/) | add/sub/mul/div/and/or/xor/shl/shr | 2 |
| [05 · 比较与控制流](05_比较与控制流/) | ceq/cgt/clt/br/brtrue/beq/switch | 3 |
| [06 · 类型转换](06_类型转换/) | conv.*/box/unbox/unbox.any | 2 |
| [07 · 方法调用](07_方法调用/) | call/callvirt/calli/tail/ret/jmp | 3 |
| [08 · 对象与类型](08_对象与类型/) | newobj/castclass/isinst/ldfld/newarr | 4 |
| [09 · 异常处理](09_异常处理/) | try/catch/finally/filter/fault/throw | 2 |
| [10 · 泛型与IL](10_泛型与IL/) | 泛型 IL 编码、constrained 前缀 | 2 |
| [11 · 委托与函数指针](11_委托与函数指针/) | ldftn/ldvirtftn/委托实例化 | 1 |
| [12 · 动态发射](12_动态发射/) | DynamicMethod/ILGenerator/DynamicAssembly | 3 |
| [13 · 实战篇](13_实战篇/) | 性能优化、AOP 注入、调试案例 | 3 |
