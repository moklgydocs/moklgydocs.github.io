---
title: 主生产计划MPS
date: 2025-04-18
author: Moklgy
category:
  - ERP业务
tag:
  - ERP
  - MRP
order: 2
---

# 主生产计划 MPS (Master Production Schedule)

## 概述

MPS 是连接销售需求和生产执行的桥梁。它以成品/关键半成品为对象，确定在未来各时间段需要生产多少数量，是 MRP 运算的核心输入。MPS 编制需综合考虑销售预测、实际订单、安全库存和产能约束。

## 一、MPS 编制流程

```
① 收集需求
   ├── 销售预测（按产品、按月/周）
   ├── 实际销售订单
   └── 安全库存需求
              │
              ▼
② 计算毛需求
   毛需求 = Max(预测, 实际订单) + 安全库存补充
              │
              ▼
③ 计算净需求
   净需求 = 毛需求 - 现有库存 - 在途订单 - 计划接收
              │
              ▼
④ 确定 MPS 数量
   按批量规则(固定批量/经济批量/按需)确定每期生产量
              │
              ▼
⑤ 粗产能检查 (RCCP)
   验证关键工作中心是否有足够产能
              │
              ▼
⑥ 调整确认
   产能不足时调整MPS → 提前生产/分批/外协
```

## 二、核心实体

### 2.1 需求预测

```
DemandForecast (需求预测)
├── Id: Guid
├── TenantId: Guid
├── ProductId: Guid                    # 产品ID
├── ProductCode: string(50)
├── ProductName: string(200)
├── ForecastPeriod: string(10)         # 预测期间 (2024-01, 2024-W03)
├── PeriodType: PeriodType             # 期间类型 (月/周)
├── ForecastQuantity: decimal(18,4)   # 预测数量
├── ActualQuantity: decimal(18,4)?    # 实际数量（期后回填）
├── Accuracy: decimal(5,2)?           # 预测准确率
├── Method: ForecastMethod             # 预测方法
├── SeasonalFactor: decimal(5,2)?     # 季节系数
├── Status: ForecastStatus
└── Remark: string(200)

枚举:
  PeriodType: Monthly=1, Weekly=2
  ForecastMethod: Historical=1(历史趋势), Manual=2(人工), 
                  MovingAverage=3(移动平均), Exponential=4(指数平滑)
  ForecastStatus: Draft=0, Confirmed=1, Actual=2
```

### 2.2 MPS 计划

```
MasterPlan (主生产计划)
├── Id: Guid
├── TenantId: Guid
├── PlanNo: string(30)                 # 计划编号
├── PlanName: string(100)
├── PlanHorizon: int                   # 计划周期（周数）
├── StartDate: DateTime                # 计划起始日
├── EndDate: DateTime
├── Status: PlanStatus
├── CreatedBy: Guid
├── ApprovedBy: Guid?
├── ApprovedAt: DateTime?
└── Items: List<MPSItem>

MPSItem (MPS 行)
├── Id: Guid
├── PlanId: Guid
├── ProductId: Guid
├── ProductCode: string(50)
├── ProductName: string(200)
├── UnitOfMeasure: string(20)
├── SafetyStock: decimal(18,4)        # 安全库存
├── LotSizeRule: LotSizeRule           # 批量规则
├── FixedLotSize: decimal(18,4)?      # 固定批量
├── LeadTimeDays: int                  # 提前期（天）
└── Periods: List<MPSPeriod>

MPSPeriod (MPS 期间明细)
├── Id: Guid
├── MPSItemId: Guid
├── PeriodStart: DateTime              # 期间起始
├── PeriodEnd: DateTime                # 期间结束
├── ForecastDemand: decimal(18,4)     # 预测需求
├── ActualOrders: decimal(18,4)       # 实际订单
├── GrossDemand: decimal(18,4)        # 毛需求
├── ProjectedAvailable: decimal(18,4) # 预计可用库存
├── NetRequirement: decimal(18,4)     # 净需求
├── PlannedProduction: decimal(18,4)  # 计划生产量
├── AvailableToPromise: decimal(18,4) # 可供承诺量(ATP)
└── IsConfirmed: bool                  # 是否确认

枚举:
  PlanStatus: Draft=0, Confirmed=1, Released=2, Closed=3
  LotSizeRule: LotForLot=1(按需), FixedLot=2(固定批量), EOQ=3(经济批量),
               MinMax=4(最小最大)
```

## 三、MPS 计算示例

```
产品A, 安全库存: 50, 期初库存: 100, 固定批量: 100

┌──────────┬────────┬────────┬────────┬────────┬────────┐
│          │ 第1周   │ 第2周   │ 第3周   │ 第4周   │ 第5周   │
├──────────┼────────┼────────┼────────┼────────┼────────┤
│ 预测需求  │   80   │   60   │   90   │   70   │   80   │
│ 实际订单  │   85   │   40   │   30   │   10   │    0   │
│ 毛需求    │   85   │   60   │   90   │   70   │   80   │
│ 计划接收  │    0   │  100   │    0   │  100   │    0   │
│ 预计库存  │   15   │   55   │  -35   │   -5   │  -85   │
│ 净需求    │    0   │    0   │   85   │   70   │   80   │
│ MPS      │    0   │  100   │  100   │  100   │  100   │
│ ATP      │   15   │   60   │   70   │   90   │  100   │
└──────────┴────────┴────────┴────────┴────────┴────────┘

计算逻辑:
  第1周: 预计库存 = 100 - 85 = 15 (≥安全库存50? 否→但已来不及生产)
  第2周: 净需求 = 60 - 15 = 45 → 需要MPS, 批量100 → MPS=100
         预计库存 = 15 + 100 - 60 = 55
  第3周: 预计库存 = 55 - 90 = -35 → 需要MPS=100
         预计库存调整 = 55 + 100 - 90 = 65
  ...
```

## 四、时间围栏

```
                    ← 冻结区 →← 协商区 →← 自由区 →
  ──────────────────┼─────────┼─────────┼────────────▶
  今天                                              计划终点

  冻结区 (0-2周):  MPS 不可变更，按订单执行
  协商区 (2-8周):  可调整，但需审批
  自由区 (8周+):   可自由调整
```

## 五、API 接口设计

### 5.1 需求预测

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/mrp/forecasts` | 预测列表 |
| POST | `/api/mrp/forecasts` | 创建预测 |
| PUT | `/api/mrp/forecasts/{id}` | 修改预测 |
| POST | `/api/mrp/forecasts/generate` | 自动生成预测（基于历史数据） |

### 5.2 MPS 管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/mrp/mps` | MPS 列表 |
| GET | `/api/mrp/mps/{id}` | MPS 详情 |
| POST | `/api/mrp/mps` | 创建 MPS |
| PUT | `/api/mrp/mps/{id}` | 修改 MPS |
| POST | `/api/mrp/mps/{id}/calculate` | 计算 MPS |
| POST | `/api/mrp/mps/{id}/confirm` | 确认 MPS |
| POST | `/api/mrp/mps/{id}/release` | 发布 MPS → 驱动 MRP |
| GET | `/api/mrp/mps/{id}/atp` | 可供承诺量查询 |

## 六、业务规则

| 规则 | 描述 |
|------|------|
| 需求取大 | 毛需求取预测和实际订单的较大值 |
| 安全库存 | 预计库存不得低于安全库存 |
| 冻结区限制 | 冻结区内的 MPS 不可修改 |
| 批量规则 | MPS 数量必须符合批量规则 |
| 提前期 | MPS 考虑产品生产提前期 |
| ATP 不可为负 | 可供承诺量不可为负 |
| 预测回顾 | 定期回顾预测准确率 |
