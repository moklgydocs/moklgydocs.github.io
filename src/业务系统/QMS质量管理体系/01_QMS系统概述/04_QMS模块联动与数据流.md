---
title: "QMS模块联动与数据流"
icon: fa6-solid:arrows-spin
order: 4
category:
  - 业务系统
  - QMS质量管理体系
tag:
  - 模块联动
  - 数据流
  - 系统集成
  - 质量闭环
---

# QMS模块联动与数据流

## 质量闭环全景

QMS系统的核心价值在于构建从"标准定义"到"验证关闭"的完整质量闭环。数据在各模块间流转，每一步都为下一步提供输入，最终形成PDCA循环。以下是质量闭环的完整数据流：

```mermaid
sequenceDiagram
    participant QS as 质量标准
    participant IP as 检验计划
    participant IE as 检验执行
    participant NC as 不合格品评审
    participant CA as CAPA纠正
    participant VE as 验证关闭

    QS->>IP: 标准驱动计划生成
    Note over QS,IP: 检验规范/抽样方案/判定准则
    IP->>IE: 下发检验任务
    Note over IP,IE: 检验项/频次/样本量
    IE->>IE: 执行检验并记录结果
    alt 检验合格
        IE->>VE: 合格放行
    else 检验不合格
        IE->>NC: 触发不合格品评审
        Note over IE,NC: 不合格记录/缺陷描述
        NC->>NC: MRB评审处置
        NC->>CA: 触发CAPA
        Note over NC,CA: 根因分析/纠正措施
        CA->>VE: 措施执行完毕
        VE->>VE: 验证有效性
        VE->>QS: 反馈标准修订建议
    end
```

## 模块接口定义

各模块之间的接口是数据流转的关键节点。下表定义了QMS内部模块间的完整接口关系：

| 源模块 | 目标模块 | 接口名称 | 传输数据 | 触发条件 |
|--------|----------|----------|----------|----------|
| 质量标准 | 检验计划 | 标准下发 | 检验规范ID、检验项列表、判定准则 | 标准发布/修订版本生效 |
| 检验计划 | 检验执行 | 任务派发 | 计划ID、检验项、样本量、频次 | 计划激活/定时触发 |
| 检验执行 | 不合格品 | 缺陷上报 | 检验记录ID、缺陷描述、不合格数量 | 判定结果=不合格 |
| 不合格品 | CAPA | 纠正发起 | NCR编号、缺陷分类、评审结论 | MRB决定需纠正 |
| CAPA | 质量标准 | 标准修订 | 措施描述、根因分析、修订建议 | CAPA验证关闭 |
| 检验执行 | SPC | 数据推送 | 测量值、样本组、时间戳 | 检验结果实时录入 |
| SPC | 不合格品 | 判异告警 | 控制图异常点、判异规则编号 | 触发Western Electric规则 |

## 质量标准驱动检验计划

质量标准是整个质量闭环的起点。标准定义了"检什么、怎么检、判定标准是什么"，检验计划根据标准自动生成：

```mermaid
graph LR
    subgraph 质量标准层
        QS1["检验规范<br/>INS_SPEC_001"]
        QS2["抽样方案<br/>AQL=1.0 Level II"]
        QS3["判定准则<br/>Ac=1 Re=2"]
    end

    subgraph 检验计划层
        IP1["来料检验计划<br/>IQC-PLAN-2024-001"]
        IP2["过程检验计划<br/>IPQC-PLAN-2024-001"]
        IP3["出货检验计划<br/>OQC-PLAN-2024-001"]
    end

    QS1 -->|规范映射| IP1
    QS1 -->|规范映射| IP2
    QS1 -->|规范映射| IP3
    QS2 -->|抽样规则| IP1
    QS2 -->|抽样规则| IP2
    QS3 -->|判定逻辑| IP1
    QS3 -->|判定逻辑| IP3
```

**驱动逻辑伪代码：**

```python
def generate_inspection_plan(spec_id: str, material_group: str) -> InspectionPlan:
    """根据质量标准自动生成检验计划"""
    spec = QualitySpec.get(spec_id)

    plan = InspectionPlan(
        plan_id=generate_id("IP"),
        spec_id=spec_id,
        inspection_type=spec.inspection_type,  # IQC/IPQC/OQC
        items=[
            InspectionItem(
                characteristic=char.characteristic,
                method=char.method,
                sample_size=calculate_sample(
                    lot_size=spec.lot_size,
                    aql=spec.aql,
                    level=spec.inspection_level
                ),
                acceptance=char.acceptance_criteria.accept,
                rejection=char.acceptance_criteria.reject,
            )
            for char in spec.characteristics
        ],
        frequency=spec.frequency,
        status="ACTIVE"
    )
    plan.save()
    return plan
```

## 检验结果触发不合格品评审

当检验执行产生不合格结果时，系统自动触发不合格品评审流程。触发机制包含自动触发和人工触发两种模式：

```python
class InspectionResultHandler:
    """检验结果处理器 - 负责不合格品评审的自动触发"""

    def on_result_submitted(self, record: InspectionRecord):
        if record.judgment == "REJECT":
            # 自动创建NCR
            ncr = NCR.create(
                source_record_id=record.id,
                defect_description=record.defect_description,
                defect_quantity=record.defect_quantity,
                severity=self._classify_severity(record),
                auto_triggered=True
            )
            # 通知MRB评审委员会
            self._notify_mrb(ncr)
            # 隔离不合格品
            self._isolate_material(record.material_id, record.lot_id)

    def _classify_severity(self, record: InspectionRecord) -> str:
        """根据缺陷严重度分类"""
        critical_chars = ["尺寸超差", "功能失效", "安全项"]
        if any(c in record.defect_description for c in critical_chars):
            return "CRITICAL"
        elif record.defect_rate > 0.1:
            return "MAJOR"
        return "MINOR"
```

## 不合格品触发CAPA

不合格品评审完成后，若MRB决定需要采取纠正措施，系统自动生成CAPA任务：

```mermaid
graph TB
    NCR["NCR创建"] --> MRB["MRB评审"]
    MRB -->|需纠正| CAPA_INIT["CAPA发起"]
    MRB -->|让步接收| CONC["让步记录"]
    MRB -->|退货/报废| SCRAP["处置记录"]
    CAPA_INIT --> RCA["根因分析<br/>5Why / 鱼骨图"]
    RCA --> ACTION["纠正措施制定"]
    ACTION --> EXEC["措施执行"]
    EXEC --> VERIFY["有效性验证"]
    VERIFY -->|验证通过| CLOSE["CAPA关闭"]
    VERIFY -->|验证失败| RCA
    CLOSE --> FEEDBACK["反馈至质量标准修订"]
```

**CAPA触发接口：**

```json
{
  "trigger_type": "NCR_MRB_DECISION",
  "source_ncr_id": "NCR-2024-0089",
  "capa_category": "CORRECTIVE",
  "root_cause_required": true,
  "due_date": "2024-04-15",
  "owner": "quality_engineer_01",
  "mrb_decision": {
    "disposition": "REWORK_WITH_CAPA",
    "severity": "MAJOR",
    "affected_quantity": 150,
    "defect_type": "尺寸超差"
  }
}
```

## CAPA验证关闭循环

CAPA验证关闭是质量闭环的最后一步，也是最重要的一步。验证不仅要确认措施已执行，还要确认措施确实有效：

```python
class CAPAVerificationService:
    """CAPA验证服务"""

    def verify_capa(self, capa_id: str, verification: VerificationData) -> VerificationResult:
        capa = CAPA.get(capa_id)

        # 1. 检查措施是否全部执行
        if not capa.all_actions_completed():
            return VerificationResult(status="FAILED", reason="纠正措施未全部执行")

        # 2. 检查有效性证据
        if not verification.effectiveness_evidence:
            return VerificationResult(status="FAILED", reason="缺少有效性证据")

        # 3. 统计验证 - 对比改善前后的数据
        before_data = self._get_inspection_data_before(capa.source_ncr_id)
        after_data = self._get_inspection_data_after(capa.effective_date)

        improvement = self._calculate_improvement(before_data, after_data)
        if improvement < capa.target_improvement:
            return VerificationResult(
                status="FAILED",
                reason=f"改善率{improvement:.1%}未达目标{capa.target_improvement:.1%}"
            )

        # 4. 验证通过 - 关闭CAPA
        capa.status = "CLOSED"
        capa.verification_result = "EFFECTIVE"
        capa.verified_by = verification.verifier
        capa.verified_date = datetime.now()
        capa.save()

        # 5. 反馈至质量标准
        if capa.standard_revision_suggested:
            self._suggest_standard_revision(capa)

        return VerificationResult(status="PASSED", improvement=improvement)
```

## 与MES联动：在线质检实时同步

QMS与MES的联动是制造企业质量管控的核心集成点，实现检验任务从派发到结果回传的实时同步：

```mermaid
sequenceDiagram
    participant MES as MES制造执行
    participant MQ as 消息队列
    participant QMS as QMS质量管理

    MES->>MQ: 工序完成事件
    Note over MES,MQ: topic: mes.process.complete<br/>payload: {order_id, operation, material_lot}
    MQ->>QMS: 消费工序完成事件
    QMS->>QMS: 匹配检验计划
    QMS->>MES: 下发在线检验任务
    Note over QMS,MES: 包含检验项/抽样量/标准值

    loop 检验执行
        MES->>QMS: 实时上报测量值
        QMS->>QMS: SPC判异计算
    end

    MES->>QMS: 提交检验结果
    alt 合格
        QMS->>MES: 放行信号
        MES->>MES: 工序流转
    else 不合格
        QMS->>MES: 隔离信号
        MES->>MES: 工序挂起
        QMS->>QMS: 触发NCR流程
    end
```

**MES联动接口定义：**

| 接口 | 方向 | 协议 | 说明 |
|------|------|------|------|
| 工序完成通知 | MES→QMS | Kafka | 工序完工时自动推送，触发检验任务生成 |
| 检验任务下发 | QMS→MES | REST API | 向MES推送检验任务，MES工位展示检验项 |
| 测量值上报 | MES→QMS | WebSocket | 实时上报测量数据，QMS侧SPC实时计算 |
| 质量判定结果 | QMS→MES | REST API | 合格放行/不合格隔离，MES据此控制工序流转 |

## 与ERP联动：QM通知

QMS与ERP的质量管理模块(QM)联动，实现质量通知的创建与追踪：

```python
class ERPQMIntegration:
    """QMS与ERP QM模块集成"""

    def create_qm_notification(self, ncr: NCR) -> str:
        """将NCR同步为ERP QM通知"""
        payload = {
            "notification_type": "Q3",  # Q3=内部质量问题
            "priority": self._map_priority(ncr.severity),
            "material": ncr.material_code,
            "batch": ncr.lot_number,
            "defect_text": ncr.defect_description,
            "catalog_profile": "QM-001",
            "defect_items": [
                {
                    "defect_code": defect.code,
                    "defect_text": defect.description,
                    "quantity": defect.quantity,
                    "unit": defect.unit
                }
                for defect in ncr.defects
            ]
        }
        response = erp_client.post("/api/qm/notification", json=payload)
        return response.json()["notification_number"]

    def sync_capa_status(self, capa: CAPA):
        """CAPA状态变更同步至ERP"""
        erp_client.patch(
            f"/api/qm/notification/{capa.erp_notification_id}",
            json={
                "status": self._map_capa_status(capa.status),
                "tasks": [
                    {"task_id": t.id, "status": t.status, "completed_date": t.completed_date}
                    for t in capa.actions
                ]
            }
        )
```

## 与SRM联动：供应商质量评价

QMS与SRM的联动将来料质量数据纳入供应商评价体系，实现质量驱动的供应商管理：

```mermaid
graph LR
    subgraph QMS
        IQC["来料检验记录"]
        NCR_S["供应商NCR"]
        CAPA_S["供应商CAPA"]
    end

    subgraph SRM
        SE["供应商评价"]
        SL["供应商等级"]
        AB["合格供方名录"]
    end

    IQC -->|批次合格率| SE
    NCR_S -->|缺陷频次/严重度| SE
    CAPA_S -->|整改响应速度| SE
    SE -->|评分结果| SL
    SL -->|等级变更| AB
    AB -->|准入控制| IQC
```

**供应商质量评价指标计算：**

```python
def calculate_supplier_quality_score(supplier_id: str, period: DateRange) -> QualityScore:
    """计算供应商质量评分"""
    # 来料批次合格率 (权重40%)
    iqc_records = IQCRecord.filter(
        supplier_id=supplier_id,
        inspection_date__range=period
    )
    batch_pass_rate = iqc_records.filter(judgment="PASS").count() / iqc_records.count()

    # NCR频次与严重度 (权重30%)
    ncrs = NCR.filter(supplier_id=supplier_id, created_date__range=period)
    ncr_score = max(0, 100 - ncrs.count() * 10 - sum(n.severity_weight for n in ncrs))

    # CAPA响应速度 (权重20%)
    capas = CAPA.filter(supplier_id=supplier_id, created_date__range=period)
    avg_response_days = capas.aggregate(avg=Avg("response_days"))["avg"] or 0
    capa_score = max(0, 100 - avg_response_days * 5)

    # 质量改进趋势 (权重10%)
    improvement_trend = calculate_improvement_trend(supplier_id, period)

    total_score = (
        batch_pass_rate * 40 +
        ncr_score * 0.3 +
        capa_score * 0.2 +
        improvement_trend * 10
    )

    return QualityScore(
        supplier_id=supplier_id,
        period=period,
        total_score=total_score,
        grade="A" if total_score >= 90 else "B" if total_score >= 75 else "C" if total_score >= 60 else "D"
    )
```

## 开发者视角：模块依赖图

从开发者视角看QMS各模块的代码依赖关系和数据依赖关系：

```mermaid
graph TB
    subgraph 基础层
        STD["质量标准模块<br/>quality_standards"]
        CODE["代码管理模块<br/>defect_codes / failure_codes"]
    end

    subgraph 执行层
        PLAN["检验计划模块<br/>inspection_plans"]
        EXEC["检验执行模块<br/>inspection_records"]
        SPC_MOD["SPC模块<br/>spc_charts / rules"]
    end

    subgraph 管理层
        NCR_MOD["不合格品模块<br/>ncr_records"]
        CAPA_MOD["CAPA模块<br/>capa_records"]
        CHANGE["变更管理模块<br/>change_records"]
    end

    subgraph 集成层
        MES_INT["MES集成适配器"]
        ERP_INT["ERP集成适配器"]
        SRM_INT["SRM集成适配器"]
    end

    STD --> PLAN
    STD --> CODE
    PLAN --> EXEC
    EXEC --> SPC_MOD
    EXEC --> NCR_MOD
    NCR_MOD --> CAPA_MOD
    CAPA_MOD --> CHANGE
    CAPA_MOD -.->|标准修订建议| STD

    EXEC --> MES_INT
    NCR_MOD --> ERP_INT
    CAPA_MOD --> SRM_INT

    style STD fill:#e3f2fd
    style CODE fill:#e3f2fd
    style PLAN fill:#fff3e0
    style EXEC fill:#fff3e0
    style SPC_MOD fill:#fff3e0
    style NCR_MOD fill:#fce4ec
    style CAPA_MOD fill:#fce4ec
    style CHANGE fill:#fce4ec
    style MES_INT fill:#e8f5e9
    style ERP_INT fill:#e8f5e9
    style SRM_INT fill:#e8f5e9
```

## 开发者实战Tips

1. **事件驱动解耦**：QMS模块间采用事件驱动架构，通过消息队列(Kafka/RabbitMQ)实现异步通信。建议为每个状态变更事件定义明确的事件Schema，使用Schema Registry保证兼容性。

2. **幂等性设计**：检验结果推送、NCR触发等接口必须设计为幂等，避免网络重试导致重复创建。使用`source_id + event_type`作为幂等键。

3. **数据一致性**：QMS与MES/ERP存在跨系统数据同步，建议采用Outbox Pattern——先写本地事务表，再由CDC线程异步推送，确保数据不丢失。

4. **质量闭环超时告警**：为CAPA各阶段设置SLA，超时自动升级通知。建议使用定时任务扫描即将超时的CAPA，提前预警。

5. **版本化标准管理**：质量标准变更时，正在执行的检验计划应继续使用旧版本标准，新计划使用新版本。标准与计划之间通过版本号关联，避免中途变更导致判定不一致。
