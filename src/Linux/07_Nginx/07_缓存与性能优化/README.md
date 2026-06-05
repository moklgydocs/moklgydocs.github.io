---
title: 07 · 缓存与性能优化
icon: fa6-solid:gauge-high
order: 7
category:
  - Linux
  - Nginx
tag:
  - 缓存
  - 性能优化
  - Gzip
  - 内核参数
---

# 07 · 缓存与性能优化

## 本章内容

- [01 · 静态文件服务与 Gzip 压缩](01_静态文件服务与Gzip压缩.md) — sendfile/tcp_nopush、gzip/brotli配置
- [02 · 浏览器缓存策略](02_浏览器缓存策略.md) — Cache-Control/ETag/Last-Modified、expires指令
- [03 · 代理缓存与快速缓存](03_代理缓存与快速缓存.md) — proxy_cache/fastcgi_cache、缓存层级、stale策略
- [04 · 性能调优核心参数](04_性能调优核心参数.md) — worker_processes/connections、buffer大小、超时参数
- [05 · 内核参数与系统级优化](05_内核参数与系统级优化.md) — TCP参数、文件描述符、somaxconn、TIME_WAIT
