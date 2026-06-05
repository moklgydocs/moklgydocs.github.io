---
title: 04 · 反向代理与负载均衡
icon: fa6-solid:arrows-split-up-and-left
order: 4
category:
  - Linux
  - Nginx
tag:
  - 反向代理
  - 负载均衡
  - upstream
  - proxy_pass
---

# 04 · 反向代理与负载均衡

## 本章内容

- [01 · 反向代理原理与配置](01_反向代理原理与配置.md) — 正向vs反向代理、proxy_set_header、X-Forwarded-For
- [02 · proxy_pass 详解与路径映射](02_proxy_pass详解与路径映射.md) — URI转发规则、尾部斜杠影响、WebSocket代理
- [03 · 负载均衡策略详解](03_负载均衡策略详解.md) — round-robin/ip-hash/least-conn/generic-hash
- [04 · 健康检查与故障转移](04_健康检查与故障转移.md) — max_fails/fail_timeout、主动健康检查
- [05 · 上游服务长连接与连接池](05_上游服务长连接与连接池.md) — keepalive、upstream块、连接复用
