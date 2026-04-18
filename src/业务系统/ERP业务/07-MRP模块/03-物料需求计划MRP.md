---
title: 物料需求计划MRP
date: 2025-04-18
author: Moklgy
category:
  - ERP业务
tag:
  - ERP
  - MRP
order: 3
---

# 物料需求计划 MRP (Material Requirements Planning)

## 概述

MRP 运算是 ERP 系统的核心计划引擎。它以 MPS 为输入，通过 BOM 展开计算出所有层级物料的需求数量和时间，扣除现有库存和在途订单后得出净需求，最终生成计划采购订单（外购件）和计划生产工单（自制件）。

## 一、MRP 运算流程

```
        ┌─────────────┐
        │ MPS 主生产计划│
        │ (成品需求)    │
        └──────┬──────┘
               │
               ▼
        ┌─────────────┐     ┌─────────────┐
        │ BOM 展开      │────▶│ 毛需求计算   │
        │ (多层级展开)  │     │ (各层物料)   │
        └─────────────┘     └──────┬──────┘
                                   │
               ┌───────────────────┤
               ▼                   ▼
        ┌─────────────┐     ┌─────────────┐
        │ 现有库存      │     │ 在途订单     │
        │ 安全库存      │     │ (PO/WO)     │
        └──────┬──────┘     └──────┬──────┘
               │                   │
               └────────┬──────────┘
                        ▼
                 ┌─────────────┐
                 │ 净需求计算   │
                 │ = 毛需求     │
                 │ - 现有库存   │
                 │ - 在途       │
                 │ + 安全库存   │
                 └──────┬──────┘
                        │
                        ▼
                 ┌─────────────┐
                 │ 批量计算     │
                 │ (按批量规则) │
                 └──────┬──────┘
                        │
                        ▼
                 ┌─────────────┐
                 │ 提前期偏置   │
                 │ (确定开始日) │
                 └──────┬──────┘
                        │
               ┌────────┴────────┐
               ▼                 ▼
        ┌─────────────┐   ┌─────────────┐
        │ 计划采购订单  │   │ 计划生产订单  │
        │ (外购件)     │   │ (自制件)     │
        └─────────────┘   └─────────────┘
```

## 二、MRP 运算逻辑

### 2.1 净需求计算

```
净需求 = 毛需求 - 预计可用库存 - 计划接收量 + 安全库存

其中:
  毛需求 = 独立需求(MPS) + 相关需求(上级BOM展开)
  预计可用库存 = 期初库存 + 在途订单
  计划接收量 = 已确认但未到的PO/WO
  安全库存 = 需要保持的最低库存水平
```

### 2.2 BOM 展开（多层级）

```
MRP 从顶层（成品）开始，逐层展开 BOM:

Level 0: 成品 A (MPS需求: 100件)
  │
  ├── BOM展开
  │
Level 1: 组件 B × 2 = 200件 (毛需求)
          组件 C × 1 = 100件 (毛需求)
          材料 H × 5 = 500件 (毛需求)
  │
  ├── BOM展开 (组件B自身有BOM)
  │
Level 2: 材料 D × 3 × 200 = 600件
          材料 E × 1 × 200 = 200件
          材料 F × 2 × 100 = 200件
          外购件 G × 1 × 100 = 100件

低层码 (Low Level Code):
  材料D出现在多个BOM中时，取最低层级编码
  确保MRP从低向高逐层处理，避免重复计算
```

### 2.3 提前期偏置

```
计划完成日 = 需求日期
计划开始日 = 需求日期 - 提前期

示例: 成品A需求日 1月20日
  成品A 提前期5天 → 开始1月15日
    组件B 提前期3天 → 需求日1月15日 → 开始1月12日
      材料D 提前期7天(采购) → 需求日1月12日 → 采购日1月5日
```

## 三、核心实体

### 3.1 MRP 运算

```
MRPRun (MRP运算批次)
├── Id: Guid
├── TenantId: Guid
├── RunNo: string(30)                  # 运算批次号
├── RunDate: DateTime                  # 运算日期
├── PlanHorizon: int                   # 计划周期（天）
├── StartDate: DateTime                # 计划起始日
├── EndDate: DateTime                  # 计划终止日
├── MPSId: Guid?                       # 关联 MPS
├── Scope: MRPScope                    # 运算范围
├── Status: MRPRunStatus
├── ItemCount: int                     # 涉及物料数
├── PlannedOrderCount: int             # 生成计划订单数
├── RunDurationMs: long                # 运算耗时(ms)
├── RunBy: Guid
└── Results: List<MRPResult>

MRPResult (MRP运算结果/计划订单)
├── Id: Guid
├── RunId: Guid
├── ItemId: Guid                       # 物料ID
├── ItemCode: string(50)
├── ItemName: string(200)
├── SupplyType: SupplyType             # 供应方式 (Make/Buy)
├── OrderType: PlannedOrderType        # 订单类型
├── RequiredDate: DateTime             # 需求日期
├── StartDate: DateTime                # 计划开始日
├── GrossRequirement: decimal(18,4)   # 毛需求
├── OnHand: decimal(18,4)            # 现有库存
├── InTransit: decimal(18,4)         # 在途数量
├── NetRequirement: decimal(18,4)    # 净需求
├── PlannedQuantity: decimal(18,4)   # 计划订单数量
├── UnitOfMeasure: string(20)
├── SupplierId: Guid?                  # 建议供应商 (外购件)
├── WarehouseId: Guid?                 # 仓库
├── ParentItemId: Guid?                # 上级物料 (需求来源)
├── ParentOrderNo: string(50)?
├── BOMLevel: int                      # BOM 层级
├── IsConfirmed: bool                  # 是否已确认
├── ConvertedDocumentId: Guid?         # 转换后的PR/WO ID
├── ConvertedDocumentNo: string(50)?
└── Remark: string(200)

枚举:
  MRPScope: All=1(全部), ByProduct=2(按产品), BySupplier=3(按供应商)
  MRPRunStatus: Running=0, Completed=1, Failed=-1
  PlannedOrderType: PlannedPurchase=1(计划采购), PlannedProduction=2(计划生产)
```

### 3.2 物料计划参数

```
ItemPlanningParameter (物料计划参数)
├── Id: Guid
├── TenantId: Guid
├── ItemId: Guid
├── SupplyType: SupplyType             # Make/Buy
├── LeadTimeDays: int                  # 提前期（天）
├── SafetyStock: decimal(18,4)        # 安全库存
├── ReorderPoint: decimal(18,4)       # 再订货点
├── LotSizeRule: LotSizeRule
├── FixedLotSize: decimal(18,4)?
├── MinOrderQuantity: decimal(18,4)?  # 最小订购量
├── MaxOrderQuantity: decimal(18,4)?  # 最大订购量
├── OrderMultiple: decimal(18,4)?     # 订购倍数
├── PreferredSupplierId: Guid?         # 首选供应商
├── DefaultWarehouseId: Guid?          # 默认仓库
├── PlanningMethod: PlanningMethod     # 计划方法
└── ScrapRate: decimal(5,2)?          # 计划损耗率

枚举:
  PlanningMethod: MRP=1, ReorderPoint=2(再订货点), Manual=3(手工)
```

## 四、MRP 运算示例

```
物料B, 外购件, 提前期7天, 安全库存20, 固定批量50

日期        1/5    1/12   1/19   1/26   2/2
──────────────────────────────────────────────
毛需求       -      30     45     35     40
计划接收     -       -      -      -      -
期初库存    60
预计库存    60      30    -15    -50    -90
净需求       -       -     35     35     40
计划订单量   -       -     50     50     50
                     ▲     ▲      ▲
计划下达日  1/5    1/12   1/12   1/19

计算过程:
  1/5:  库存60, 无需求
  1/12: 60-30=30, >安全库存20 → 无需订购
  1/19: 30-45=-15, <安全库存 → 净需求=15+20=35 → 批量50
  1/26: (30+50)-45-35=0, <安全库存 → 净需求=20+35=55 → 批量50
  ...
```

## 五、API 接口设计

### 5.1 MRP 运算

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/mrp/runs` | 执行 MRP 运算 |
| GET | `/api/mrp/runs` | 运算历史 |
| GET | `/api/mrp/runs/{id}` | 运算结果详情 |
| GET | `/api/mrp/runs/{id}/results` | 计划订单列表 |

### 5.2 计划订单

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/mrp/planned-orders` | 计划订单列表 |
| PUT | `/api/mrp/planned-orders/{id}` | 修改计划订单 |
| POST | `/api/mrp/planned-orders/{id}/confirm` | 确认计划订单 |
| POST | `/api/mrp/planned-orders/batch-confirm` | 批量确认 |
| POST | `/api/mrp/planned-orders/{id}/convert` | 转为 PR/WO |
| POST | `/api/mrp/planned-orders/batch-convert` | 批量转换 |
| DELETE | `/api/mrp/planned-orders/{id}` | 删除计划订单 |

### 5.3 计划参数

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/mrp/planning-parameters` | 参数列表 |
| GET | `/api/mrp/planning-parameters/{itemId}` | 物料参数 |
| PUT | `/api/mrp/planning-parameters/{itemId}` | 更新参数 |

## 六、业务规则

| 规则 | 描述 |
|------|------|
| BOM 完整 | MRP 运算前所有自制件必须有有效 BOM |
| 参数完整 | 所有物料的提前期、批量规则等参数必须配置 |
| 低层码优先 | 从最低层级开始向上计算，避免重复 |
| 净需求≥0 | 净需求不可为负 |
| 提前期验证 | 计划开始日不可早于当天 |
| 批量约束 | 计划数量必须满足最小量/倍数约束 |
| 安全库存保障 | 预计库存不得低于安全库存 |
| 确认后不可删 | 已确认的计划订单不可删除，只能取消 |
