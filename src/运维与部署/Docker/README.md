---
title: Docker
index: false
icon: docker
category:
  - 运维与部署
---

# Docker

容器化是现代部署的标配。这个系列从原理到实操，以 .NET 项目为例，把 Docker 用明白。

## 目录

- [01. Docker 核心原理](01.Docker核心原理.md) —— Namespace、Cgroup、UnionFS，容器到底是什么
- [02. 安装与配置](02.安装与配置.md) —— CentOS/Ubuntu 安装、镜像加速、daemon.json 配置
- [03. Dockerfile 最佳实践](03.Dockerfile最佳实践.md) —— 多阶段构建 .NET 项目、镜像瘦身
- [04. 镜像与容器管理](04.镜像与容器管理.md) —— 日常操作命令、生命周期、资源限制
- [05. 网络模式](05.网络模式.md) —— bridge/host/自定义网络，容器间通信
- [06. 数据卷与持久化](06.数据卷与持久化.md) —— 挂载方案、备份策略
- [07. 安全与优化](07.安全与优化.md) —— 非 root 运行、镜像扫描、资源限制、生产检查清单
