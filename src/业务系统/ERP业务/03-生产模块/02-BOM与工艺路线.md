---
title: BOM与工艺路线
date: 2025-04-18
author: Moklgy
category:
  - ERP业务
tag:
  - ERP
  - 生产
order: 2
---

# BOM 与工艺路线

## 概述

BOM（Bill of Materials，物料清单）定义了产品由哪些原材料和零部件组成，工艺路线（Routing）定义了产品的生产工序、所用设备和标准工时。它们是 MRP 运算、生产排程和成本核算的基础数据。

## 一、BOM 管理

### 1.1 BOM 结构

```
产品 A (成品)
├── 组件 B × 2                    (二级)
│   ├── 原材料 D × 3              (三级)
│   └── 原材料 E × 1              (三级)
├── 组件 C × 1                    (二级)
│   ├── 原材料 F × 2              (三级)
│   └── 外购件 G × 1              (三级)
└── 原材料 H × 5                  (二级)
```

### 1.2 BOM 实体

```
BOM (物料清单)
├── Id: Guid
├── TenantId: Guid
├── ProductId: Guid                    # 成品/半成品ID
├── ProductCode: string(50)
├── ProductName: string(200)
├── Version: int                       # BOM 版本号
├── BOMType: BOMType                   # BOM 类型
├── EffectiveDate: DateTime            # 生效日期
├── ExpiryDate: DateTime?              # 失效日期
├── Status: BOMStatus
├── BatchSize: decimal(18,4)          # 基准批量（标准产出量）
├── UnitOfMeasure: string(20)          # 产出单位
├── Remark: string(500)
└── Items: List<BOMItem>

BOMItem (BOM 行)
├── Id: Guid
├── BOMId: Guid
├── LineNo: int
├── ComponentId: Guid                  # 组件物料ID
├── ComponentCode: string(50)
├── ComponentName: string(200)
├── Level: int                         # 层级 (1=直接子件)
├── Quantity: decimal(18,4)           # 用量 (相对于基准批量)
├── UnitOfMeasure: string(20)
├── ScrapRate: decimal(5,2)           # 损耗率 (%)
├── NetQuantity: decimal(18,4)        # 净用量
├── OperationNo: int?                  # 所属工序号（工序在哪步投料）
├── SupplyType: SupplyType             # 供应方式
├── SubBOMId: Guid?                    # 子BOM (如组件B本身也有BOM)
├── IsPhantom: bool                    # 是否虚拟件（不入库，直接展开）
├── Alternatives: List<BOMAlternative> # 替代料
└── Remark: string(200)

BOMAlternative (替代料)
├── Id: Guid
├── BOMItemId: Guid
├── AlternativeItemId: Guid            # 替代物料ID
├── AlternativeItemCode: string(50)
├── Priority: int                      # 优先级 (1=首选)
├── ConversionRate: decimal(18,4)     # 换算比例
└── Remark: string(200)

枚举:
  BOMType: Production=1(生产BOM), Engineering=2(工程BOM), Costing=3(成本BOM)
  BOMStatus: Draft=0, Active=1, Expired=2, Obsolete=3
  SupplyType: Make=1(自制), Buy=2(外购), Phantom=3(虚拟件), Outsource=4(外协)
```

## 二、工艺路线

### 2.1 工艺路线实体

```
Routing (工艺路线)
├── Id: Guid
├── TenantId: Guid
├── ProductId: Guid
├── ProductCode: string(50)
├── Version: int
├── EffectiveDate: DateTime
├── ExpiryDate: DateTime?
├── Status: RoutingStatus
├── Remark: string(500)
└── Operations: List<RoutingOperation>

RoutingOperation (工序)
├── Id: Guid
├── RoutingId: Guid
├── OperationNo: int                   # 工序号 (10, 20, 30...)
├── OperationName: string(100)         # 工序名称
├── WorkCenterId: Guid                 # 工作中心
├── WorkCenterName: string(100)
├── SetupTime: decimal(18,2)          # 准备时间 (分钟)
├── RunTime: decimal(18,2)            # 单件加工时间 (分钟)
├── WaitTime: decimal(18,2)           # 等待时间 (分钟)
├── MoveTime: decimal(18,2)           # 移动时间 (分钟)
├── OverlapPercentage: decimal(5,2)?  # 重叠百分比（并行工序）
├── LaborCount: int                    # 需要人数
├── MachineCount: int                  # 需要机台数
├── ScrapRate: decimal(5,2)           # 工序损耗率
├── IsOutsourced: bool                 # 是否外协工序
├── OutsourceSupplierId: Guid?         # 外协供应商
├── Description: string(500)           # 工序说明
└── SortOrder: int

WorkCenter (工作中心)
├── Id: Guid
├── TenantId: Guid
├── Code: string(20)                   # 编码
├── Name: string(100)                  # 名称
├── Type: WorkCenterType               # 类型
├── DepartmentId: Guid                 # 所属车间/部门
├── CostCenterId: Guid?                # 成本中心
├── Capacity: decimal(18,2)           # 日产能（标准小时）
├── Efficiency: decimal(5,2)          # 效率 (%)
├── MachineCount: int                  # 机台数
├── LaborCostRate: decimal(18,2)      # 人工费率 (元/小时)
├── MachineCostRate: decimal(18,2)    # 机器费率 (元/小时)
├── OverheadRate: decimal(18,2)       # 间接费率 (元/小时)
├── IsActive: bool
├── CalendarId: Guid?                  # 工作日历
└── Remark: string(200)

枚举:
  RoutingStatus: Draft=0, Active=1, Expired=2
  WorkCenterType: Machine=1(机器), Assembly=2(装配线), Manual=3(手工), Mixed=4(混合)
```

### 2.2 工时计算

```
工单工时 = Σ(各工序工时)

单工序工时:
  总工时 = 准备时间 + (单件加工时间 × 计划数量) + 等待时间 + 移动时间

示例: 加工 100 件产品
  工序10(下料): 准备30min + 100×2min + 等待10min + 移动5min = 245min
  工序20(加工): 准备60min + 100×5min + 等待15min + 移动10min = 585min
  工序30(组装): 准备20min + 100×3min + 等待5min  + 移动5min  = 330min
  总工时 = 245 + 585 + 330 = 1,160 min ≈ 19.3 小时
```

## 三、API 接口设计

### 3.1 BOM 管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/production/boms` | BOM 列表 |
| GET | `/api/production/boms/{id}` | BOM 详情 |
| GET | `/api/production/boms/product/{productId}` | 按产品查 BOM |
| POST | `/api/production/boms` | 创建 BOM |
| PUT | `/api/production/boms/{id}` | 修改 BOM |
| POST | `/api/production/boms/{id}/activate` | 激活 BOM |
| POST | `/api/production/boms/{id}/copy` | 复制为新版本 |
| GET | `/api/production/boms/{id}/explosion` | BOM 展开（多层级） |
| GET | `/api/production/boms/{id}/where-used` | 反查（物料用在哪些BOM） |

### 3.2 工艺路线

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/production/routings` | 路线列表 |
| GET | `/api/production/routings/{id}` | 路线详情 |
| POST | `/api/production/routings` | 创建路线 |
| PUT | `/api/production/routings/{id}` | 修改路线 |
| POST | `/api/production/routings/{id}/activate` | 激活路线 |

### 3.3 工作中心

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/production/work-centers` | 工作中心列表 |
| POST | `/api/production/work-centers` | 新增工作中心 |
| PUT | `/api/production/work-centers/{id}` | 修改工作中心 |
| GET | `/api/production/work-centers/{id}/capacity` | 产能查询 |

## 四、实体关系图

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│ Product      │────▶│ BOM          │────▶│ BOMItem          │
│ 产品/物料     │     │ 物料清单      │ 1:N │ BOM行            │
└──────────────┘     └──────────────┘     └──────┬───────────┘
       │                                          │
       │                                          ▼
       │                                  ┌──────────────────┐
       │                                  │ BOMAlternative   │
       │                                  │ 替代料            │
       │                                  └──────────────────┘
       │
       ├────▶ Routing ────▶ RoutingOperation
       │      工艺路线       工序
       │                      │
       │                      ▼
       │               WorkCenter
       │               工作中心
       │
       └────▶ WorkOrder (引用 BOM + Routing)
```

## 五、业务规则

| 规则 | 描述 |
|------|------|
| 同一产品单一有效 BOM | 同一时间只能有一个 Active BOM |
| BOM 循环检测 | 创建/修改 BOM 时检测循环引用 |
| 版本控制 | 修改 BOM 需新建版本，旧版自动失效 |
| 虚拟件展开 | MRP 运算时虚拟件自动展开到下一层 |
| 替代料优先级 | 首选替代料库存不足时启用次选 |
| 工序连续 | 工序号必须递增，不可跳号但可预留间隔 |
| 工作中心产能 | 排产不得超过工作中心日产能 |
| BOM 展开完整 | 所有自制件必须有对应的 BOM |
