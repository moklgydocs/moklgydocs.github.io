---
title: 运维与部署
index: false
icon: server
---

# 运维与部署知识库

从 Linux 基础到 CI/CD 全自动化，一个 .NET 后端工程师需要掌握的全部运维技能。

```
  ① Linux基础 ──→ ② Docker ──→ ③ Docker-Compose
       │              │               │
       ▼              ▼               ▼
  ④ Jenkins ──→ ⑤ GitLab ──→ ⑥ CI/CD Pipeline
                                     │
                                     ▼
  ⑦ .NET部署 ──→ ⑧ Nginx ──→ ⑨ 综合实战项目
```

## 模块导航

| 模块 | 内容 | 状态 |
|------|------|:---:|
| [Linux 基础](Linux基础/) | 文件系统、权限、systemd、防火墙、Shell脚本、性能监控 | 🟢 |
| [Docker](Docker/) | 核心原理、Dockerfile、镜像优化、网络、数据卷 | 🔜 |
| [Docker-Compose](Docker-Compose/) | 多服务编排、环境变量、健康检查 | 🔜 |
| [Jenkins](Jenkins/) | Pipeline、Jenkinsfile、插件、权限 | 🔜 |
| [GitLab](GitLab/) | 安装配置、Git工作流、Webhook | 🔜 |
| [Nginx](Nginx/) | 反向代理、HTTPS、负载均衡 | 🔜 |
| [.NET部署](dotNET部署/) | 发布模式、Kestrel、配置管理、日志收集 | 🔜 |
| [CI/CD实战](CICD实战/) | 完整Pipeline、蓝绿部署、回滚策略 | 🔜 |

## 技术栈

- CentOS 7.9 / Ubuntu 22.04
- Docker + Docker-Compose
- Jenkins + GitLab
- Nginx
- .NET 8
- PostgreSQL / SQL Server
