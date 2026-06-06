---
title: "GreaterWMS深度解析"
icon: fa6-solid:box-archive
order: 2
category:
  - 业务系统
  - WMS仓储管理
tag:
  - 开源WMS
  - Django
  - GreaterWMS
---

# GreaterWMS 深度解析

> GreaterWMS 的基因来自福特汽车亚太区售后物流仓储供应链——这意味着它的设计从一开始就经受了企业级场景的考验。作为 GitHub 上 Star 数最多的开源 WMS 项目之一（4.3k+ Stars），它用 Django + Vue 3 构建了一套支持多仓多货主、实时推送的企业级仓储管理系统。

## 一、项目介绍

### 与福特物流的渊源

GreaterWMS 的起源可以追溯到福特亚太区售后零部件物流项目：

```mermaid
timeline
    title GreaterWMS 发展历程
    2018 : 福特亚太区售后物流项目启动
          : 团队基于 Django 开发内部 WMS
    2019 : 系统在福特亚太区多个仓库上线
          : 覆盖中国/日本/韩国/澳大利亚
    2020 : 核心团队将系统重构并开源
          : 命名 GreaterWMS
    2021 : 社区快速发展，Star 突破 2000
          : 新增多语言/多仓/看板等功能
    2022 : 发布 2.0 版本，Vue 3 重写前端
          : Docker/K8s 部署支持
    2023-2024 : 持续迭代，社区贡献活跃
          : Star 突破 4000+
```

**福特售后物流场景的苛刻要求，塑造了 GreaterWMS 的核心能力：**

| 福特场景要求 | 对系统能力的塑造 |
|------------|----------------|
| 亚太多国多仓 | 多仓库、多语言、多时区架构 |
| 数万种售后零件 | 高 SKU 密度下的库存管理 |
| 严格的先进先出 | 完善的批次与效期管理 |
| 经销商紧急订单 | 灵活的波次与优先级调度 |
| 第三方物流运营 | 多货主、多租户数据隔离 |

### 项目数据

| 指标 | 数据 |
|------|------|
| GitHub 地址 | https://github.com/GreaterWMS/GreaterWMS |
| Stars | 4.3k+ |
| 开源协议 | Apache 2.0 + 附加条款（商用需授权） |
| 首次发布 | 2020 年 |
| 主要语言 | Python / TypeScript |
| 维护状态 | 活跃 |

## 二、技术栈详解

### 技术架构全景

```mermaid
graph TB
    subgraph 前端
        VUE3[Vue 3]
        VITE2[Vite]
        TS2[TypeScript]
        QUASAR[Quasar Framework]
        PINIA2[Pinia]
        ECHARTS[ECharts]
    end

    subgraph 后端
        DJANGO[Django 4.x]
        DRF[Django REST Framework]
        CHANNELS[Django Channels]
        CELERY[Celery]
        REDIS2[Redis]
    end

    subgraph 数据库
        PG2[PostgreSQL]
    end

    subgraph 部署
        DOCKER2[Docker]
        K8S[Kubernetes]
        NGINX2[Nginx]
    end

    VUE3 --> VITE2
    VUE3 --> TS2
    VUE3 --> QUASAR
    VUE3 --> PINIA2
    VUE3 --> ECHARTS

    DJANGO --> DRF
    DJANGO --> CHANNELS
    DJANGO --> CELERY
    CELERY --> REDIS2
    CHANNELS --> REDIS2

    DRF --> PG2

    DOCKER2 --> DJANGO
    DOCKER2 --> VUE3
    K8S --> DOCKER2
    NGINX2 --> VUE3

    style DJANGO fill:#e8f5e9,stroke:#2e7d32,color:#000
    style VUE3 fill:#e3f2fd,stroke:#1565c0,color:#000
    style DOCKER2 fill:#fff3e0,stroke:#e65100,color:#000
```

### 技术选型理由

| 技术 | 选型理由 |
|------|---------|
| Django | Python 生态最成熟的 Web 框架，快速开发 |
| DRF | Django 生态最成熟的 REST API 框架 |
| Django Channels | 基于 WebSocket 的实时推送能力 |
| Celery | 异步任务处理（报表生成、批量操作） |
| PostgreSQL | 企业级关系数据库，JSON/Array 类型丰富 |
| Vue 3 + Quasar | 跨平台 UI 框架，同时支持 Web/桌面/移动端 |
| ECharts | 专业的数据可视化图表库 |

## 三、项目架构分析

### 后端架构

```
GreaterWMS/
├── greaterwms/                 # 项目根配置
│   ├── settings.py             # Django 配置
│   ├── urls.py                 # 根路由
│   ├── asgi.py                 # ASGI 配置（WebSocket）
│   └── wsgi.py                 # WSGI 配置
│
├── asrf/                       # 核心模块
│   ├── views/                  # 视图层
│   ├── serializers/            # 序列化器
│   ├── models/                 # 数据模型
│   ├── filters/                # 查询过滤器
│   └── migrations/             # 数据库迁移
│
├── inbound/                    # 入库模块
├── outbound/                   # 出库模块
├── stock/                      # 库存模块
├── transportation/             # 运输模块
├── dashboard/                  # 看板模块
├── staff/                      # 人员模块
│
├── templates/                  # 模板文件
├── static/                     # 静态资源
└── docker-compose.yml          # Docker 编排
```

### 前端架构

```
greaterwms-frontend/
├── src/
│   ├── api/                    # API 请求
│   ├── pages/                  # 页面
│   │   ├── inbound/            # 入库页面
│   │   ├── outbound/           # 出库页面
│   │   ├── stock/              # 库存页面
│   │   ├── transport/          # 运输页面
│   │   ├── dashboard/          # 看板页面
│   │   └── settings/           # 系统设置
│   ├── components/             # 通用组件
│   ├── router/                 # 路由
│   ├── stores/                 # 状态管理
│   ├── i18n/                   # 国际化（30+语言）
│   └── boot/                   # Quasar 启动插件
├── public/
└── quasar.conf.js
```

### 数据流架构

```mermaid
graph LR
    A[前端 Vue 3] -->|HTTP REST| B[DRF API]
    A -->|WebSocket| C[Django Channels]
    B --> D[Django ORM]
    D --> E[PostgreSQL]
    C --> F[Redis Pub/Sub]
    F --> D

    B --> G[Celery Worker]
    G --> D

    style A fill:#e3f2fd,stroke:#1565c0,color:#000
    style B fill:#e8f5e9,stroke:#2e7d32,color:#000
    style C fill:#fff3e0,stroke:#e65100,color:#000
```

## 四、核心功能模块

### 功能矩阵

| 模块 | 子功能 | 亮点 |
|------|-------|------|
| **入库管理** | ASN 收货、质检、上架 | 支持多供应商并行收货 |
| **出库管理** | 订单接收、波次、拣货、复核、发货 | 灵活的波次策略配置 |
| **库存管理** | 实时库存、批次、效期、冻结 | WebSocket 实时库存推送 |
| **运输管理** | 运单管理、承运商、路线规划 | TMS 集成能力 |
| **看板管理** | 作业看板、库存看板、效率看板 | ECharts 实时可视化 |
| **人员管理** | 员工管理、排班、绩效 | 作业效率统计 |
| **系统管理** | 多仓配置、多货主、权限、日志 | 多租户数据隔离 |

### 与 ModernWMS 功能对比

| 功能 | GreaterWMS | ModernWMS |
|------|-----------|-----------|
| 多仓管理 | 原生支持 | 单仓为主 |
| 多货主 | 原生支持 | 不支持 |
| 实时推送 | WebSocket | 无 |
| 运输管理 | 有 | 无 |
| 看板 | ECharts 实时看板 | 基础报表 |
| 移动端 | Quasar 跨平台 | 仅 Web |
| 国际化 | 30+ 语言 | 中英双语 |
| 批次管理 | 完善 | 基础 |
| 权限模型 | RBAC + 数据隔离 | RBAC |
| 部署方式 | Docker / K8s | Docker |

## 五、API 设计

### RESTful + WebSocket 实时推送

GreaterWMS 的 API 设计采用 REST + WebSocket 双通道模式：

| 通道 | 用途 | 特点 |
|------|------|------|
| REST API | 增删改查操作 | 请求-响应模式，无状态 |
| WebSocket | 实时状态推送 | 双向通信，事件驱动 |

### REST API 示例

**查询库存列表：**

```
GET /api/v1/stock/?page=1&max_page=20&warehouse=WH001
Authorization: Token abc123def456
```

**响应：**

```json
{
  "count": 1580,
  "results": [
    {
      "id": 1,
      "goods_code": "SKU-A001",
      "goods_qty": 500,
      "warehouse": "WH001",
      "bin_name": "A-01-03",
      "batch": "B20240315",
      "expiry_date": "2025-03-15",
      "create_time": "2024-03-15T10:30:00+08:00"
    }
  ]
}
```

### WebSocket 实时推送

**连接：**

```
ws://host:port/ws/inbound/?token=abc123def456
```

**推送事件示例：**

```json
{
  "event": "stock_change",
  "data": {
    "goods_code": "SKU-A001",
    "warehouse": "WH001",
    "bin_name": "A-01-03",
    "change_qty": +100,
    "current_qty": 600,
    "timestamp": "2024-03-15T14:30:00+08:00"
  }
}
```

### WebSocket 事件类型

| 事件 | 触发条件 | 推送内容 |
|------|---------|---------|
| stock_change | 库存变动 | SKU+库位+变动数量+当前数量 |
| inbound_complete | 入库完成 | ASN 号+实收数量 |
| outbound_complete | 出库完成 | 订单号+实发数量 |
| wave_progress | 波次进度 | 波次号+完成百分比 |
| alert | 异常告警 | 告警类型+详情 |

## 六、多仓多货主架构

### 数据隔离模型

```mermaid
graph TB
    A[租户 Tenant] --> B[仓库 Warehouse]
    B --> C[库区 Zone]
    C --> D[库位 Bin]

    A --> E[货主 Owner]
    E --> F[库存 Stock]

    F --> D

    A --- A1[租户A - 3PL物流公司]
    A --- A2[租户B - 制造企业]

    A1 --> B1[仓库1: 华东仓]
    A1 --> B2[仓库2: 华南仓]
    A2 --> B3[仓库3: 工厂仓]

    B1 --> E1[货主: 品牌甲]
    B1 --> E2[货主: 品牌乙]

    style A fill:#e3f2fd,stroke:#1565c0,color:#000
    style F fill:#e8f5e9,stroke:#2e7d32,color:#000
```

### 数据隔离实现

| 隔离层级 | 实现方式 | 说明 |
|---------|---------|------|
| 租户隔离 | Django middleware 自动注入过滤条件 | 每个请求自动带租户 ID |
| 仓库隔离 | 查询参数 warehouse 字段 | 同租户内区分仓库 |
| 货主隔离 | 库存记录关联 owner 字段 | 同仓库内区分货主 |

```python
# Django middleware 数据隔离示例
class TenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 从 token 中获取租户 ID
        request.tenant_id = request.user.tenant_id
        response = self.get_response(request)
        return response

#ViewSet 自动过滤
class StockViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Stock.objects.filter(
            tenant_id=self.request.tenant_id,
            warehouse=self.request.query_params.get('warehouse')
        )
```

## 七、国际化与多语言支持

### 支持的语言

GreaterWMS 是开源 WMS 中国际化程度最高的项目，原生支持 30+ 种语言：

| 语言类别 | 包含语言 |
|---------|---------|
| 东亚 | 简体中文、繁体中文、日语、韩语 |
| 东南亚 | 越南语、泰语、印尼语、马来语 |
| 欧洲 | 英语、德语、法语、西班牙语、葡萄牙语、意大利语、荷兰语 |
| 中东 | 阿拉伯语、希伯来语、土耳其语 |
| 其他 | 俄语、波兰语、乌克兰语等 |

### 国际化实现

```
src/i18n/
├── index.ts           # i18n 配置
├── zh-CN/             # 简体中文
│   ├── inbound.js     # 入库模块词汇
│   ├── outbound.js    # 出库模块词汇
│   └── common.js      # 通用词汇
├── en-US/             # 英语
├── ja-JP/             # 日语
└── ...                # 其他语言
```

## 八、Docker/K8s 部署实践

### Docker 部署

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    image: greaterwms/backend:latest
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://wms:wms123@postgres:5432/greaterwms
      - REDIS_URL=redis://redis:6379/0
      - SECRET_KEY=your-secret-key
    depends_on:
      - postgres
      - redis
    restart: always

  frontend:
    image: greaterwms/frontend:latest
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always

  celery:
    image: greaterwms/backend:latest
    command: celery -A greaterwms worker -l info
    depends_on:
      - postgres
      - redis
    restart: always

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=greaterwms
      - POSTGRES_USER=wms
      - POSTGRES_PASSWORD=wms123
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
```

### Kubernetes 部署要点

| 资源 | 配置要点 |
|------|---------|
| Deployment-backend | 2 副本 + HPA（CPU > 70% 扩容） |
| Deployment-celery | 1 副本（根据队列深度调整） |
| Service-backend | ClusterIP + Ingress 暴露 |
| StatefulSet-postgres | PVC 持久化 + 主从复制 |
| StatefulSet-redis | Sentinel 模式高可用 |
| ConfigMap | 环境变量集中管理 |
| Secret | 数据库密码、密钥等敏感信息 |

## 九、与其他 WMS 项目对比分析

### 综合对比

| 维度 | GreaterWMS | ModernWMS | kopSoftWMS |
|------|-----------|-----------|------------|
| Stars | 4.3k+ | 1.5k+ | 800+ |
| 后端技术 | Django (Python) | .NET 7 (C#) | .NET 6 (C#) |
| 前端技术 | Vue 3 + Quasar | Vue 3 + Element Plus | Vue 2 + Element UI |
| 数据库 | PostgreSQL | SQLite / PostgreSQL | MySQL |
| 多仓支持 | 原生 | 单仓 | 单仓 |
| 多货主 | 原生 | 不支持 | 不支持 |
| 实时推送 | WebSocket | 无 | 无 |
| 移动端 | Quasar 跨平台 | 无 | 无 |
| 国际化 | 30+ 语言 | 中英双语 | 中文 |
| 开源协议 | Apache 2.0（商用需授权） | MIT | MIT |
| 学习曲线 | 中等（需 Python/Django） | 中等（需 .NET） | 低 |
| 社区活跃度 | 高 | 中 | 低 |
| 适用规模 | 中大型仓库 | 中小型仓库 | 小型仓库 |

### 选型建议

| 你的场景 | 推荐项目 | 原因 |
|---------|---------|------|
| 学习 WMS 概念 | ModernWMS | 代码简洁，入门门槛低 |
| 中小制造/电商 | ModernWMS | 轻量、MIT 协议无商用限制 |
| 3PL 物流/多仓 | GreaterWMS | 原生多仓多货主 |
| 需要实时看板 | GreaterWMS | WebSocket + ECharts |
| Python 技术栈 | GreaterWMS | Django 生态 |
| .NET 技术栈 | ModernWMS | .NET 生态 |
| 快速原型验证 | kopSoftWMS | 最轻量 |

> **总结**：GreaterWMS 的独特价值在于其"企业级基因"——源自福特亚太售后物流的实战经验，让它从设计之初就具备了多仓、多货主、实时推送等大型仓库所需的核心能力。选择 GreaterWMS，不仅获得了一套功能完整的 WMS，更获得了一个经受过汽车行业严苛验证的架构方案。
