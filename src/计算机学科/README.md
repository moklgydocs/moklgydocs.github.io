---
title: 计算机学科
icon: fa6-solid:graduation-cap
index: false
category:
  - 计算机学科
---

# 计算机学科

> 计算机科学的三大基石：网络、系统、底层语言。

```mermaid
graph TB
    CS[计算机学科] --> NET[计算机网络]
    CS --> OS[操作系统]
    CS --> ASM[汇编语言]

    NET --> N1[基础篇<br/>TCP/IP 模型]
    NET --> N2[应用层<br/>HTTP/HTTPS/RPC]
    NET --> N3[传输层<br/>TCP/UDP 深度解析]
    NET --> N4[网络层<br/>IP/ICMP]
    NET --> N5[网络编程实战<br/>Socket/epoll]

    OS --> O1[概述<br/>体系结构]
    OS --> O2[进程管理<br/>调度/同步/死锁]
    OS --> O3[内存管理<br/>虚拟内存/页面置换]
    OS --> O4[文件系统<br/>磁盘调度/VFS]
    OS --> O5[IO管理]
    OS --> O6[经典问题<br/>PV 操作]

    ASM --> A1[基础概念<br/>数据表示/处理器架构]
    ASM --> A2[汇编语言基础<br/>指令格式/传送/算术]
    ASM --> A3[过程与栈<br/>栈帧/参数传递]
    ASM --> A4[位操作与高级运算]
    ASM --> A5[系统调用与IO]
    ASM --> A6[实战项目<br/>链接加载/安全]

    style CS fill:#00ffcc,stroke:#333,color:#333
    style NET fill:#2196f3,stroke:#333,color:#fff
    style OS fill:#f26d6d,stroke:#333,color:#fff
    style ASM fill:#fb9b5f,stroke:#333,color:#333
```

## 专栏导航

| 专栏 | 说明 | 原著参考 |
|------|------|----------|
| [计算机网络](计算机网络/) | 从协议原理到编程实战，覆盖应用层/传输层/网络层 + Socket 编程 | 小林coding《图解网络》· 尹圣雨《TCP/IP网络编程》 |
| [汇编语言](汇编语言/) | 基于 Linux 环境的 x86 汇编，从指令到系统调用 | 《汇编语言：基于Linux环境（第3版）》 |
| [操作系统](操作系统/) | 进程/内存/文件系统/IO 全覆盖，含经典 PV 问题 | 小林coding《图解操作系统》· 王道《操作系统》· CSAPP |
