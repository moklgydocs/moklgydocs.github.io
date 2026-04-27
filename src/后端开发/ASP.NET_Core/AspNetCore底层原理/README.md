---
title: ASP.NET Core 底层原理
index: false
icon: fa6-brands:microsoft
order: 1
category:
  - ASP.NET Core
---

# ASP.NET Core 底层原理

> 从一个网络请求出发，跟踪每一个字节从网卡到 Controller、再从 Controller 回到网卡的完整旅程。源码级、逐层拆解，不跳过任何细节。

## 文档目录

| 文档 | 内容 |
|------|------|
| [00 · 全链路总览](00_全链路总览.md) | 全局流程图、模块地图、快速索引 |
| [01 · 网络层：TCP 到 Socket](01_网络层_TCP到Socket.md) | 三次握手、epoll/IOCP、Accept 循环 |
| [02 · Pipelines：零拷贝内存模型](02_Pipelines零拷贝内存模型.md) | PipeReader/PipeWriter、MemoryPool、AdvanceTo 精解 |
| [03 · HTTP 协议解析：状态机](03_HTTP协议解析状态机.md) | HttpParser、SWAR 算法、HTTP/2 HPACK、HTTP/3 QUIC |
| [04 · IFeatureCollection：接口壁垒](04_IFeatureCollection接口壁垒.md) | 特性集合设计、高性能数组索引、Kestrel 与 ASP.NET Core 解耦 |
| [05 · HostingApplication：交接点](05_HostingApplication交接点.md) | CreateContext、对象池、DefaultHttpContext 生命周期 |
| [06 · 中间件管道：洋葱圈](06_中间件管道洋葱圈.md) | IApplicationBuilder、RequestDelegate 构建、短路机制 |
| [07 · 路由系统：DFA 匹配](07_路由系统DFA匹配.md) | EndpointDataSource、DFA 图编译、路由约束 |
| [08 · 认证授权](08_认证授权.md) | IAuthenticationHandler、JWT Bearer、Policy-Based 授权 |
| [09 · 模型绑定](09_模型绑定.md) | 绑定源优先级、Utf8JsonReader、DataAnnotations 验证 |
| [10 · Action 执行与过滤器](10_Action执行与过滤器.md) | 过滤器管道、IActionResult、DI 解析 |
| [11 · 输出格式化与响应写回](11_输出格式化与响应写回.md) | 内容协商、SystemTextJson、直接写 PipeWriter |
| [12 · 响应返回网卡](12_响应返回网卡.md) | SocketSender、Scatter IO、keep-alive 复用 |
