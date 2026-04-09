---
title: 单点登录
index: false
icon: lock
category:
  - ASP.NET_Core
---

# 基于 OpenIddict 的生产级单点登录鉴权中心

本专栏完整记录了基于 ASP.NET Core + OpenIddict 的 SSO 鉴权中心设计与实现过程。从整体架构到各层代码实现，覆盖了 OAuth2/OIDC 协议、Token 生命周期管理、客户端管理、用户管理、安全登出以及第三方登录扩展等内容。

## 目录

- [第一章（原理篇）](01.原理.md) —— OpenIddict 实现 SSO 的原理与协议介绍
- [第二章（架构篇）](02.整体架构与项目搭建.md) —— 分层架构设计、解决方案创建、项目引用关系
- [第三章（Shared层）](03.Shared层.md) —— 统一 API 返回、分页、选项绑定特性
- [第四章（Domain层）](04.Domain层.md) —— 用户/角色实体定义
- [第五章（Infrastructure层）](05.Infrastructure层.md) —— EF Core DbContext、Identity 配置、基础设施注册
- [第六章（OpenIddict配置）](06.OpenIddict核心配置.md) —— OpenIddict Server/Validation 注册、端点、授权流程、证书
- [第七章（Application层）](07.Application层.md) —— 客户端/Scope/用户管理服务与 DTO
- [第八章（核心控制器）](08.AuthServer核心控制器.md) —— OAuth2 授权/Token/Userinfo/Logout 端点、管理 API
- [第九章（程序入口）](09.程序入口与配置.md) —— Program.cs、appsettings.json、种子数据、EF 迁移
- [第十章（验证测试）](10.验证测试与API清单.md) —— curl 测试命令、完整 API 接口清单
- [第十一章（问题处理）](11.客户端授权问题处理.md) —— password 授权类型问题修复、权限模型速查
- [第十二章（登出安全）](12.Token失效与登出安全.md) —— 引用 Token、Token 撤销、缓存优化
- [第十三章（扩展篇）](13.完成度评估与第三方登录.md) —— 完成度评估、GitHub/微信第三方登录扩展
- [第十四章（角色管理）](14.角色管理.md) —— 角色 CRUD、角色-用户关联、RoleAppService 与 RoleManageController

## 技术栈

- ASP.NET Core 9.0
- OpenIddict 6.0
- ASP.NET Core Identity
- Entity Framework Core + SQL Server / PostgreSQL
- Quartz.NET（Token 自动清理）
