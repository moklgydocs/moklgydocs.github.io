---
title: 提问式学习ASP.NET Core
index: false
icon: circle-question
category:
  - ASP.NET_Core
---

# 提问式学习 ASP.NET Core

通过系统性的提问策略，从"会用"到"深刻理解"ASP.NET Core 框架。以源码级深入的方式，逐层递进掌握框架核心机制。

## 目录

- [第零章（提问大纲）](00.提问大纲.md) —— 如何系统性地向AI提问来彻底掌握ASP.NET Core框架
- [第一章（整体架构）](01.理解整体架构(起手式).md) —— 宏观全景：彻底理解ASP.NET Core整体架构
- [第二章（启动流程）](02.启动流程.md) —— 源码级深入：WebApplication.CreateBuilder → Build → Run
- [第三章（请求管道）](03.请求管道.md) —— 中间件管道的本质：函数套函数，RequestDelegate 链式调用
- [第四章（依赖注入）](04.依赖注入(DI)系统.md) —— DI 容器的本质：类型字典 + 生命周期管理
- [第五章（配置系统）](05.配置系统(Configuration).md) —— 配置系统的本质：扁平化键值对字典
- [第六章（认证系统）](06.认证系统(Authentication).md) —— 认证的本质：从请求中提取身份信息，变成 ClaimsPrincipal
- [第七章（授权系统）](07.授权系统(Authorization).md) —— 授权的本质：判断"这个人能不能做这件事"
- [第八章（路由系统）](08.路由系统(Routing).md) —— 路由的本质：URL 模式匹配器 + Endpoint 元数据载体
- [第九章（Kestrel）](09.Kestrel HTTP 服务器.md) —— Kestrel 的本质：TCP 连接管理器 + HTTP 协议解析器
- [第十章（设计哲学）](10.设计哲学与模式.md) —— 一切皆服务，一切皆可替换，一切皆可组合
- [第十章（设计哲学）](11.源码阅读与调试指南.md) —— ASP.NET Core 源码阅读与调试指南

## 技术栈

- ASP.NET Core
- .NET Runtime
- Kestrel / HTTP.sys
