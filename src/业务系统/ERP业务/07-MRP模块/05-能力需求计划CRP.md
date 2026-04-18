---
title: 能力需求计划CRP
date: 2025-04-18
author: Moklgy
category:
  - ERP业务
tag:
  - ERP
  - MRP
order: 5
---

# 能力需求计划 CRP (Capacity Requirements Planning)

## 概述

CRP（Capacity Requirements Planning）在 MRP 运算后执行，将计划生产订单转化为对各工作中心的产能需求，与工作中心的可用产能进行对比，识别产能瓶颈并提供调整建议。它确保生产计划在产能约束下可行。

## 一、CRP 运算流程

```
MRP 计划生产订单
      │
      ▼
┌─────────────────┐
│ 工艺路线展开      │  每个计划订单 × 工艺路线 = 各工序产能需求
│ (Routing)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ 产能需求汇总     │     │ 可用产能计算     │
│ (按工作中心/期间)│     │ (工作日历×效率)  │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     ▼
              ┌─────────────────┐
              │ 负荷对比分析     │
              │ 需求 vs 可用     │
              └────────┬────────┘
                       │
              ┌────────┼────────┐
              ▼        ▼        ▼
         产能充足    轻微超载    严重超载
              │        │        │
              ▼        ▼        ▼
         确认计划   调整措施    调整MPS
                   (加班/外协)
```

## 二、核心概念

### 2.1 产能计算

```
工作中心日可用产能:
  = 每日工作小时 × 机台数 × 效率系数 × 利用率

示例: 工作中心 WC-01
  每日工作: 8小时 × 2班 = 16小时
  机台数: 3台
  效率系数: 85%
  利用率: 90%
  日可用产能 = 16 × 3 × 0.85 × 0.90 = 36.72 标准小时

周可用产能 = 日可用产能 × 工作日数
  = 36.72 × 5 = 183.6 标准小时
```

### 2.2 产能需求计算

```
单个工单的产能需求:
  = 准备时间 + (单件加工时间 × 计划数量)

示例: WO-001, 产品A 100件
  工序20(在WC-01): 准备60min + 100×5min = 560min = 9.33小时

汇总该期间 WC-01 的所有工单需求:
  WO-001: 9.33小时
  WO-002: 6.50小时
  WO-003: 12.17小时
  总需求: 28.00小时
  可用产能: 36.72小时
  负荷率: 28/36.72 = 76.3% ✅
```

## 三、核心实体

### 3.1 产能计划

```
CapacityPlan (产能计划)
├── Id: Guid
├── TenantId: Guid
├── PlanNo: string(30)
├── PlanName: string(100)
├── MRPRunId: Guid                     # 关联 MRP 运算
├── PlanHorizon: int                   # 计划周期（周数）
├── StartDate: DateTime
├── EndDate: DateTime
├── Status: CRPStatus
├── CreatedBy: Guid
└── WorkCenterLoads: List<WorkCenterLoad>

WorkCenterLoad (工作中心负荷)
├── Id: Guid
├── CapacityPlanId: Guid
├── WorkCenterId: Guid
├── WorkCenterCode: string(20)
├── WorkCenterName: string(100)
├── PeriodStart: DateTime              # 期间起始
├── PeriodEnd: DateTime
├── AvailableCapacity: decimal(18,2)  # 可用产能（小时）
├── RequiredCapacity: decimal(18,2)   # 需求产能（小时）
├── LoadPercentage: decimal(5,2)      # 负荷率 (%)
├── OverloadHours: decimal(18,2)      # 超载小时数
├── Status: LoadStatus
└── Details: List<LoadDetail>

LoadDetail (负荷明细)
├── Id: Guid
├── WorkCenterLoadId: Guid
├── WorkOrderId: Guid?                 # 工单ID（已有的）
├── PlannedOrderId: Guid?              # 计划订单ID（MRP生成的）
├── ProductCode: string(50)
├── Quantity: decimal(18,4)
├── OperationNo: int
├── SetupHours: decimal(18,2)
├── RunHours: decimal(18,2)
├── TotalHours: decimal(18,2)
└── StartDate: DateTime

枚举:
  CRPStatus: Draft=0, Calculated=1, Confirmed=2
  LoadStatus: Normal=1(正常,<85%), Warning=2(预警,85-100%), 
              Overloaded=3(超载,>100%)
```

### 3.2 工作日历

```
WorkCalendar (工作日历)
├── Id: Guid
├── TenantId: Guid
├── Code: string(20)
├── Name: string(100)
├── WorkDays: string(7)                # 工作日 (1111100 = 周一至周五)
├── ShiftsPerDay: int                  # 每日班次
├── HoursPerShift: decimal(5,2)       # 每班小时
├── Efficiency: decimal(5,2)          # 效率系数
├── Utilization: decimal(5,2)         # 利用率
└── Exceptions: List<CalendarException>

CalendarException (日历例外)
├── Id: Guid
├── CalendarId: Guid
├── Date: DateTime
├── Type: ExceptionType                # 类型
├── AvailableHours: decimal(5,2)?     # 可用小时（加班时）
└── Reason: string(200)

枚举:
  ExceptionType: Holiday=1(节假日,0产能), Overtime=2(加班,额外产能),
                 Maintenance=3(维护,0产能)
```

## 四、产能负荷图

```
工作中心 WC-01 未来5周负荷:

100%│                    ████
    │          ████      ████      ████
 85%│-------████████------████------████------  预警线
    │  ████  ████████    ████████  ████
 70%│  ████  ████████    ████████  ████
    │  ████  ████████    ████████  ████████
 50%│  ████  ████████    ████████  ████████
    │  ████  ████████    ████████  ████████
    └──────┬──────┬──────┬──────┬──────┬──
          W1    W2    W3    W4    W5

    W1: 76% ✅  W2: 95% ⚠️  W3: 108% ❌  W4: 88% ⚠️  W5: 72% ✅
```

## 五、产能调整策略

| 策略 | 说明 | 适用场景 |
|------|------|---------|
| **加班** | 增加工作时间 | 短期轻微超载 |
| **增加班次** | 开第二/三班 | 持续性超载 |
| **外协加工** | 部分工序外协 | 特定工序瓶颈 |
| **提前生产** | 将后期订单提前 | 前期有空闲 |
| **推迟订单** | 调整交期 | 非紧急订单 |
| **调整MPS** | 减少/推迟成品计划 | 严重超载 |
| **增加设备** | 购买/租赁设备 | 长期产能不足 |
| **优化工艺** | 缩短工序时间 | 长期改善 |

## 六、API 接口设计

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/mrp/crp/calculate` | 执行 CRP 计算 |
| GET | `/api/mrp/crp/plans` | 产能计划列表 |
| GET | `/api/mrp/crp/plans/{id}` | 计划详情 |
| GET | `/api/mrp/crp/plans/{id}/work-center-loads` | 工作中心负荷 |
| GET | `/api/mrp/crp/plans/{id}/overloaded` | 超载工作中心列表 |
| GET | `/api/mrp/crp/load-chart/{workCenterId}` | 负荷图数据 |
| POST | `/api/mrp/crp/plans/{id}/confirm` | 确认产能计划 |
| GET | `/api/mrp/crp/calendars` | 工作日历列表 |
| POST | `/api/mrp/crp/calendars` | 创建工作日历 |
| PUT | `/api/mrp/crp/calendars/{id}` | 修改工作日历 |
| POST | `/api/mrp/crp/calendars/{id}/exceptions` | 添加日历例外 |

## 七、实体关系图

```
┌──────────────┐     ┌──────────────────┐
│CapacityPlan  │────▶│WorkCenterLoad    │
│ 产能计划      │ 1:N │ 工作中心负荷      │
└──────────────┘     └──────┬───────────┘
                            │ 1:N
                            ▼
                     ┌──────────────────┐
                     │ LoadDetail       │
                     │ 负荷明细          │
                     └──────────────────┘

┌──────────────┐     ┌──────────────────┐
│ WorkCenter   │◀────│WorkCenterLoad    │
│ 工作中心      │     │                  │
└──────┬───────┘     └──────────────────┘
       │
       ▼
┌──────────────┐     ┌──────────────────┐
│WorkCalendar  │────▶│CalendarException │
│ 工作日历      │ 1:N │ 日历例外          │
└──────────────┘     └──────────────────┘
```

## 八、业务规则

| 规则 | 描述 |
|------|------|
| MRP 后执行 | CRP 必须在 MRP 运算完成后执行 |
| 预警阈值 | 负荷率 > 85% 标黄预警，> 100% 标红超载 |
| 日历优先 | 产能计算优先使用工作中心指定的日历 |
| 效率折算 | 可用产能必须考虑效率系数和利用率 |
| 瓶颈优先 | 产能分析重点关注瓶颈工作中心 |
| 调整闭环 | 调整 MPS/排产后需重新运行 CRP 验证 |
| 历史参考 | 产能数据支持与历史实际对比 |
| 外协协同 | 外协工序不计入内部产能需求 |
