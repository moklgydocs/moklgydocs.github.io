---
title: SRM整体架构
icon: fa6-solid:sitemap
order: 3
category:
  - 业务系统
  - SRM供应商关系
tag:
  - SRM
  - 系统架构
  - 微服务
  - SaaS
---

# SRM整体架构

SRM系统作为连接企业与供应商的数字化平台，其架构设计需要兼顾内部管理效率和外部协同体验。本文从功能架构、技术架构、集成架构和部署模式四个维度全面解析SRM系统架构。

## 1. 功能架构

SRM的功能架构可以划分为六大核心模块：

```mermaid
graph TB
    subgraph SRM功能架构
        SM[供应商管理<br/>准入/评估/分级/淘汰]
        SRC[寻源管理<br/>招标/竞价/谈判]
        CT[合同管理<br/>框架协议/年度合同]
        OM[订单管理<br/>下单/确认/跟踪]
        COL[协同管理<br/>交付/质量/对账]
        EV[评价管理<br/>绩效/改善/分级]
    end

    SM --> CORE[核心平台<br/>权限/工作流/消息/报表]
    SRC --> CORE
    CT --> CORE
    OM --> CORE
    COL --> CORE
    EV --> CORE

    PORT[供应商门户<br/>自助协同入口] --> SM
    PORT --> OM
    PORT --> COL

    style CORE fill:#fff9c4,stroke:#f9a825,stroke-width:3px
    style PORT fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
```

### 功能模块详解

| 功能模块 | 核心能力 | 关键特性 |
|---------|----------|---------|
| **供应商管理** | 准入/评估/分级/淘汰 | 全生命周期管理、资质到期预警 |
| **寻源管理** | 招标/竞价/谈判/单一来源 | 电子招投标、反向拍卖、智能匹配 |
| **合同管理** | 框架协议/年度合同/一揽子订单 | 合同全生命周期、审批流程、到期预警 |
| **订单管理** | 下单/确认/跟踪/变更 | 供应商自助确认、实时跟踪 |
| **协同管理** | 交付协同/质量协同/财务协同 | ASN通知、质检反馈、三单匹配 |
| **评价管理** | 绩效评估/改善计划/分级管理 | QDCST多维度、自动采集、改善闭环 |

## 2. 技术架构

现代SRM系统普遍采用微服务架构，支持SaaS多租户部署：

```mermaid
graph TB
    subgraph 接入层
        WEB[Web门户<br/>采购方]
        SUP_WEB[供应商门户<br/>供应商]
        MOBILE2[移动端<br/>审批/查询]
        OPEN_API[开放API<br/>ERP集成]
    end

    subgraph 网关层
        GW[API网关<br/>认证/限流/路由]
    end

    subgraph 服务层
        SM_S[供应商服务<br/>微服务]
        SRC_S[寻源服务<br/>微服务]
        CT_S[合同服务<br/>微服务]
        OM_S[订单服务<br/>微服务]
        COL_S[协同服务<br/>微服务]
        EV_S[评价服务<br/>微服务]
        MSG[消息服务<br/>通知/待办]
        WF_S[工作流服务<br/>流程引擎]
    end

    subgraph 数据层
        MYSQL[(MySQL<br/>业务数据)]
        MONGO[(MongoDB<br/>文档数据)]
        REDIS2[(Redis<br/>缓存/会话)]
        ES[(Elasticsearch<br/>全文检索)]
        OSS[(OSS/S3<br/>文件存储)]
    end

    WEB --> GW
    SUP_WEB --> GW
    MOBILE2 --> GW
    OPEN_API --> GW
    GW --> SM_S
    GW --> SRC_S
    GW --> CT_S
    GW --> OM_S
    GW --> COL_S
    GW --> EV_S
    SM_S --> MYSQL
    SRC_S --> MYSQL
    OM_S --> MYSQL
    COL_S --> MONGO
    EV_S --> MYSQL
    SM_S --> REDIS2
    OM_S --> REDIS2
    SRC_S --> ES
    CT_S --> OSS

    style GW fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    style 服务层 fill:#e8f5e9,stroke:#2e7d32
    style 数据层 fill:#e3f2fd,stroke:#1565c0
```

### SaaS多租户架构

| 多租户策略 | 说明 | 优势 | 劣势 |
|-----------|------|------|------|
| **独立数据库** | 每个租户独立数据库 | 数据隔离性最好 | 成本最高 |
| **共享数据库独立Schema** | 同一数据库不同Schema | 隔离性较好 | 管理复杂 |
| **共享数据库共享Schema** | 同一数据库同一Schema，tenant_id区分 | 成本最低 | 隔离性最弱 |

主流SRM产品通常采用"共享数据库+租户ID"的策略，通过行级安全（Row-Level Security）保证数据隔离。

## 3. 与ERP集成

SRM与ERP的集成是采购数字化最关键的集成链路：

```mermaid
graph LR
    subgraph SRM域
        SUP_M[供应商管理]
        SRC_M[寻源定价]
        CT_M[合同管理]
        OM_M[订单协同]
        COL_M[交付协同]
    end

    subgraph ERP域
        MM[物料管理<br/>MM模块]
        PP[生产计划<br/>PP模块]
        FI[财务会计<br/>FI模块]
    end

    SUP_M -->|供应商主数据同步| MM
    SRC_M -->|价格信息同步| MM
    CT_M -->|框架协议同步| MM
    PP -->|采购申请| OM_M
    OM_M -->|采购订单创建| MM
    MM -->|收货信息| COL_M
    MM -->|发票信息| FI
    COL_M -->|对账确认| FI

    style SRM域 fill:#e8f5e9,stroke:#2e7d32
    style ERP域 fill:#e3f2fd,stroke:#1565c0
```

### 关键集成接口

| 接口 | 方向 | 数据 | 方式 | 频率 |
|------|------|------|------|------|
| 供应商同步 | SRM→ERP | 供应商主数据 | API | 实时 |
| 采购申请 | ERP→SRM | 需求数据 | API | 实时 |
| 采购订单 | SRM→ERP | 订单数据 | API | 实时 |
| 收货反馈 | ERP→SRM | 收货数量/质检 | API/MQ | 实时/定时 |
| 发票同步 | ERP→SRM | 发票信息 | API/MQ | 定时 |
| 价格同步 | SRM→ERP | 合同价格 | API | 合同签署时 |
| 对账数据 | SRM→ERP | 对账结果 | API | 月结 |

## 4. 与WMS集成

SRM与WMS的集成主要围绕入库协同和质检反馈：

```mermaid
sequenceDiagram
    participant SRM
    participant WMS
    participant 供应商

    供应商->>SRM: 发送ASN发货通知
    SRM->>WMS: 推送预期到货信息
    WMS->>WMS: 货物到达，创建收货任务
    WMS->>WMS: 执行质检
    WMS->>SRM: 反馈收货数量+质检结果
    SRM->>供应商: 通知收货结果
    SRM->>SRM: 更新交付记录
    SRM->>SRM: 更新供应商绩效数据
```

### SRM-WMS集成数据

| 数据 | 方向 | 说明 |
|------|------|------|
| ASN到货通知 | SRM→WMS | 预告到货物料/数量/时间 |
| 收货确认 | WMS→SRM | 实际收货数量和状态 |
| 质检结果 | WMS→SRM | 合格/不合格/让步接收 |
| 退货通知 | SRM→WMS | 不合格品退货 |
| 库存查询 | SRM→WMS | 供应商委外库存查询 |

## 5. 部署模式

| 部署模式 | 说明 | 优势 | 劣势 | 适用场景 |
|---------|------|------|------|---------|
| **SaaS** | 供应商托管的多租户云服务 | 零运维、快速上线、自动升级 | 定制性有限、数据在云端 | 中小企业、快速上线需求 |
| **私有化** | 企业自建机房部署 | 数据完全可控、深度定制 | 运维成本高、升级复杂 | 大型企业、数据敏感行业 |
| **混合** | 核心模块私有化+协同模块SaaS | 兼顾安全与便捷 | 架构复杂 | 大型企业 |

### 部署架构选择

```mermaid
graph LR
    A[企业规模评估] --> B{规模与需求?}
    B -->|中小型+快速上线| C[SaaS部署]
    B -->|大型+深度定制| D[私有化部署]
    B -->|大型+供应商协同需求| E[混合部署]

    C --> C1[2-4周上线<br/>按年付费<br/>标准功能]
    D --> D1[3-6月上线<br/>一次性+运维费<br/>深度定制]
    E --> E1[核心模块私有化<br/>协同模块SaaS<br/>兼顾安全与便捷]

    style C fill:#e8f5e9,stroke:#2e7d32
    style D fill:#e3f2fd,stroke:#1565c0
    style E fill:#fff3e0,stroke:#ef6c00
```

## 小结

- SRM功能架构涵盖供应商管理、寻源、合同、订单、协同、评价六大核心模块
- 技术架构采用微服务+API网关，支持SaaS多租户部署
- 与ERP的集成是SRM最关键的集成链路，涉及供应商、订单、收货、发票等核心数据同步
- 与WMS的集成围绕入库协同和质检反馈，实现从发货到入库的闭环
- SaaS/私有化/混合三种部署模式各有适用场景
