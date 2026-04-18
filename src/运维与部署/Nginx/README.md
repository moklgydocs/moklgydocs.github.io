---
title: Nginx
index: false
icon: globe
category:
  - 运维与部署
---

# Nginx

.NET 应用跑在 Kestrel 上，但不会直接暴露给用户。前面挡一层 Nginx 做反向代理、HTTPS、负载均衡。

## 目录

- [01. Nginx 安装与基础配置](01.Nginx安装与基础配置.md) —— Docker/系统安装、目录结构、配置语法、常用命令
- [02. 反向代理 .NET 应用](02.反向代理dotNET应用.md) —— 转发到 Kestrel、WebSocket/gRPC 代理、负载均衡、前后端分离
- [03. HTTPS 与证书配置](03.HTTPS与证书配置.md) —— Let's Encrypt 免费证书、自动续期、SSL 最佳配置、Docker+Certbot
- [04. 性能优化与安全加固](04.性能优化与安全加固.md) —— Gzip、缓存、限流、安全头、IP黑白名单、生产模板
