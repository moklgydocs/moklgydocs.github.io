import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as r}from"./app-D5IRkmio.js";var i=JSON.parse(`{"path":"/%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F/ERP%E4%B8%9A%E5%8A%A1/05-%E5%BA%93%E5%AD%98%E6%A8%A1%E5%9D%97/04-%E5%87%BA%E5%BA%93%E7%AE%A1%E7%90%86.html","title":"出库管理","lang":"zh-CN","frontmatter":{"title":"出库管理","date":"2025-04-18T00:00:00.000Z","author":"Moklgy","category":["ERP业务"],"tag":["ERP","库存"],"order":4},"git":{"createdTime":1776517348000,"updatedTime":1776517348000,"contributors":[{"name":"moklgy","username":"moklgy","email":"moklgy@foxmail.com","commits":1,"url":"https://github.com/moklgy"}]},"readingTime":{"minutes":8.96,"words":2688},"filePathRelative":"业务系统/ERP业务/05-库存模块/04-出库管理.md"}`),a={name:`04-出库管理.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="出库管理" tabindex="-1"><a class="header-anchor" href="#出库管理"><span>出库管理</span></a></h1><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p>出库管理处理所有减少库存的业务操作，包括销售出库、生产领料、采购退货、仓库调拨、报废处理等。系统通过出库单统一管理各类出库事务，支持多种拣货策略、装箱管理和发运确认，确保物料准确、高效地从库存发出。</p><h2 id="一、出库类型总览" tabindex="-1"><a class="header-anchor" href="#一、出库类型总览"><span>一、出库类型总览</span></a></h2><table><thead><tr><th>出库类型</th><th>触发来源</th><th>来源单据</th><th>需预留</th><th>财务影响</th></tr></thead><tbody><tr><td>销售出库</td><td>SO 发货确认</td><td>销售订单/发货单</td><td>是</td><td>库存商品减少，成本结转</td></tr><tr><td>生产领料</td><td>WO 领料申请</td><td>生产工单</td><td>可选</td><td>原材料→生产成本</td></tr><tr><td>采购退货</td><td>退货审批</td><td>采购退货单</td><td>否</td><td>原材料减少，应付冲回</td></tr><tr><td>调拨出库</td><td>调拨单审批</td><td>调拨单</td><td>是</td><td>仓库间转移</td></tr><tr><td>报废出库</td><td>报废审批</td><td>报废单</td><td>否</td><td>库存减少，损失计入费用</td></tr><tr><td>其他出库</td><td>手工创建</td><td>-</td><td>否</td><td>库存减少</td></tr></tbody></table><h2 id="二、出库全流程" tabindex="-1"><a class="header-anchor" href="#二、出库全流程"><span>二、出库全流程</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>来源单据 (SO/WO/退货单/调拨单/报废单)</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>┌─────────────────┐</span></span>
<span class="line"><span>│ ① 创建出库单     │  自动/手工创建，关联来源单据</span></span>
<span class="line"><span>│   (IssueOrder)   │</span></span>
<span class="line"><span>└────────┬────────┘</span></span>
<span class="line"><span>         │</span></span>
<span class="line"><span>         ▼</span></span>
<span class="line"><span>┌─────────────────┐</span></span>
<span class="line"><span>│ ② 库存分配       │  按策略分配库存 (FIFO/FEFO/指定批次)</span></span>
<span class="line"><span>│   预留可用库存    │  锁定 ReservedQuantity</span></span>
<span class="line"><span>└────────┬────────┘</span></span>
<span class="line"><span>         │</span></span>
<span class="line"><span>         ▼</span></span>
<span class="line"><span>┌─────────────────┐</span></span>
<span class="line"><span>│ ③ 生成拣货任务   │  按拣货策略生成任务清单</span></span>
<span class="line"><span>│   (PickingTask)  │  分配拣货路径</span></span>
<span class="line"><span>└────────┬────────┘</span></span>
<span class="line"><span>         │</span></span>
<span class="line"><span>         ▼</span></span>
<span class="line"><span>┌─────────────────┐</span></span>
<span class="line"><span>│ ④ 执行拣货       │  仓管员按路径拣货，扫码确认</span></span>
<span class="line"><span>│   扫码确认        │</span></span>
<span class="line"><span>└────────┬────────┘</span></span>
<span class="line"><span>         │</span></span>
<span class="line"><span>         ▼                    (仅销售出库)</span></span>
<span class="line"><span>┌─────────────────┐     ┌─────────────────┐</span></span>
<span class="line"><span>│ ⑤ 拣货完成       │────▶│ ⑥ 装箱           │</span></span>
<span class="line"><span>│   核对数量        │     │   (PackingList)  │</span></span>
<span class="line"><span>└────────┬────────┘     └────────┬────────┘</span></span>
<span class="line"><span>         │                       │</span></span>
<span class="line"><span>         ├───────────────────────┘</span></span>
<span class="line"><span>         │</span></span>
<span class="line"><span>         ▼</span></span>
<span class="line"><span>┌─────────────────┐</span></span>
<span class="line"><span>│ ⑦ 发运/出库确认  │  确认出库，更新库存</span></span>
<span class="line"><span>│   更新库存        │</span></span>
<span class="line"><span>└────────┬────────┘</span></span>
<span class="line"><span>         │</span></span>
<span class="line"><span>    ┌────┴────┐</span></span>
<span class="line"><span>    ▼         ▼</span></span>
<span class="line"><span> 库存事务   财务凭证</span></span>
<span class="line"><span> (Txn)     (Voucher)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、核心实体" tabindex="-1"><a class="header-anchor" href="#三、核心实体"><span>三、核心实体</span></a></h2><h3 id="_3-1-出库单" tabindex="-1"><a class="header-anchor" href="#_3-1-出库单"><span>3.1 出库单</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>IssueOrder (出库单)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── IssueNo: string(30)               # 编号 IO-{YYYYMMDD}-{SEQ}</span></span>
<span class="line"><span>├── IssueType: IssueType              # 出库类型</span></span>
<span class="line"><span>├── IssueDate: DateTime</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── SourceDocumentType: string(20)     # 来源类型 (SO/WO/PurchaseReturn/TO)</span></span>
<span class="line"><span>├── SourceDocumentId: Guid?</span></span>
<span class="line"><span>├── SourceDocumentNo: string(50)?</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── WarehouseId: Guid                  # 出库仓库</span></span>
<span class="line"><span>├── CustomerId: Guid?                  # 客户 (销售出库)</span></span>
<span class="line"><span>├── WorkOrderId: Guid?                 # 工单 (生产领料)</span></span>
<span class="line"><span>├── TransferOrderId: Guid?             # 调拨单</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── RequestedDate: DateTime?           # 需求日期</span></span>
<span class="line"><span>├── ActualDate: DateTime?              # 实际出库日</span></span>
<span class="line"><span>├── PickingStrategy: PickingStrategyType # 拣货策略</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── Status: IssueStatus</span></span>
<span class="line"><span>├── OperatorId: Guid</span></span>
<span class="line"><span>├── ConfirmedBy: Guid?</span></span>
<span class="line"><span>├── ConfirmedAt: DateTime?</span></span>
<span class="line"><span>├── VoucherId: Guid?</span></span>
<span class="line"><span>├── Remark: string(500)</span></span>
<span class="line"><span>└── Lines: List&lt;IssueOrderLine&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  IssueType:</span></span>
<span class="line"><span>    SalesIssue=1(销售出库), ProductionIssue=2(生产领料),</span></span>
<span class="line"><span>    PurchaseReturn=3(采购退货), TransferIssue=4(调拨出库),</span></span>
<span class="line"><span>    ScrapIssue=5(报废出库), OtherIssue=6(其他出库)</span></span>
<span class="line"><span>  IssueStatus:</span></span>
<span class="line"><span>    Draft=0(草稿), Allocated=1(已分配), PickingInProgress=2(拣货中),</span></span>
<span class="line"><span>    Picked=3(已拣货), Packing=4(装箱中), Packed=5(已装箱),</span></span>
<span class="line"><span>    Dispatched=6(已发运), Completed=7(已完成),</span></span>
<span class="line"><span>    PartialCompleted=8(部分完成), Cancelled=9(已取消)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-出库单行" tabindex="-1"><a class="header-anchor" href="#_3-2-出库单行"><span>3.2 出库单行</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>IssueOrderLine (出库单行)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── IssueOrderId: Guid</span></span>
<span class="line"><span>├── LineNo: int</span></span>
<span class="line"><span>├── ItemId: Guid</span></span>
<span class="line"><span>├── ItemCode: string(50)</span></span>
<span class="line"><span>├── ItemName: string(200)</span></span>
<span class="line"><span>├── UnitOfMeasure: string(20)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── RequestedQuantity: decimal(18,4)  # 需求数量</span></span>
<span class="line"><span>├── AllocatedQuantity: decimal(18,4)  # 已分配数量</span></span>
<span class="line"><span>├── PickedQuantity: decimal(18,4)     # 已拣数量</span></span>
<span class="line"><span>├── ShippedQuantity: decimal(18,4)    # 已发数量</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── LocationId: Guid?                  # 指定库位</span></span>
<span class="line"><span>├── BatchNo: string(50)?              # 指定批次</span></span>
<span class="line"><span>├── SerialNumbers: string?             # 序列号列表 (JSON)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── UnitCost: decimal(18,6)           # 出库单位成本</span></span>
<span class="line"><span>├── Amount: decimal(18,2)             # 出库金额</span></span>
<span class="line"><span>├── CostMethod: string(20)?           # 计价方法 (继承物料设置)</span></span>
<span class="line"><span>└── Remark: string(200)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-拣货任务" tabindex="-1"><a class="header-anchor" href="#_3-3-拣货任务"><span>3.3 拣货任务</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>PickingTask (拣货任务)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── TaskNo: string(30)</span></span>
<span class="line"><span>├── IssueOrderId: Guid</span></span>
<span class="line"><span>├── IssueLineId: Guid</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── ItemId: Guid</span></span>
<span class="line"><span>├── ItemCode: string(50)</span></span>
<span class="line"><span>├── ItemName: string(200)</span></span>
<span class="line"><span>├── Quantity: decimal(18,4)           # 需拣数量</span></span>
<span class="line"><span>├── PickedQuantity: decimal(18,4)     # 已拣数量</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── SourceLocationId: Guid             # 拣货库位</span></span>
<span class="line"><span>├── BatchNo: string(50)?</span></span>
<span class="line"><span>├── SerialNo: string(50)?</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── PickingMethod: PickingMethod       # 拣货方式</span></span>
<span class="line"><span>├── WaveId: Guid?                      # 波次ID (波次拣货)</span></span>
<span class="line"><span>├── PickSequence: int                  # 拣货顺序</span></span>
<span class="line"><span>├── PickPath: string(500)?            # 拣货路径</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── Status: PickingTaskStatus</span></span>
<span class="line"><span>├── AssignedTo: Guid?</span></span>
<span class="line"><span>├── Priority: int</span></span>
<span class="line"><span>├── StartTime: DateTime?</span></span>
<span class="line"><span>├── CompletedTime: DateTime?</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  PickingMethod:</span></span>
<span class="line"><span>    Single=1(单件拣货), Batch=2(批量拣货),</span></span>
<span class="line"><span>    Wave=3(波次拣货), Zone=4(分区拣货)</span></span>
<span class="line"><span>  PickingTaskStatus:</span></span>
<span class="line"><span>    Pending=0(待执行), Assigned=1(已指派), InProgress=2(执行中),</span></span>
<span class="line"><span>    Completed=3(已完成), ShortPick=4(短拣), Cancelled=5(已取消)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-4-装箱单" tabindex="-1"><a class="header-anchor" href="#_3-4-装箱单"><span>3.4 装箱单</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>PackingList (装箱单)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── PackingNo: string(30)              # 编号 PK-{YYYYMMDD}-{SEQ}</span></span>
<span class="line"><span>├── IssueOrderId: Guid</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── CartonCount: int                   # 箱数</span></span>
<span class="line"><span>├── TotalGrossWeight: decimal(18,3)   # 毛重 (kg)</span></span>
<span class="line"><span>├── TotalNetWeight: decimal(18,3)     # 净重 (kg)</span></span>
<span class="line"><span>├── TotalVolume: decimal(18,4)        # 总体积 (m³)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── ShippingMethod: string(50)?        # 运输方式</span></span>
<span class="line"><span>├── TrackingNo: string(100)?           # 物流单号</span></span>
<span class="line"><span>├── CarrierName: string(100)?          # 承运商</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── Status: PackingStatus</span></span>
<span class="line"><span>├── PackedBy: Guid</span></span>
<span class="line"><span>├── PackedAt: DateTime?</span></span>
<span class="line"><span>├── ShippedAt: DateTime?</span></span>
<span class="line"><span>├── Remark: string(500)</span></span>
<span class="line"><span>└── Lines: List&lt;PackingListLine&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PackingListLine (装箱单行)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── PackingListId: Guid</span></span>
<span class="line"><span>├── CartonNo: string(20)              # 箱号</span></span>
<span class="line"><span>├── ItemId: Guid</span></span>
<span class="line"><span>├── ItemCode: string(50)</span></span>
<span class="line"><span>├── ItemName: string(200)</span></span>
<span class="line"><span>├── Quantity: decimal(18,4)</span></span>
<span class="line"><span>├── BatchNo: string(50)?</span></span>
<span class="line"><span>├── SerialNo: string(50)?</span></span>
<span class="line"><span>├── Weight: decimal(18,3)?            # 重量</span></span>
<span class="line"><span>└── Volume: decimal(18,4)?            # 体积</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  PackingStatus:</span></span>
<span class="line"><span>    Packing=1(装箱中), Packed=2(已装箱), Shipped=3(已发运)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-5-调拨单" tabindex="-1"><a class="header-anchor" href="#_3-5-调拨单"><span>3.5 调拨单</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>TransferOrder (调拨单)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── TransferNo: string(30)             # 编号 TO-{YYYYMMDD}-{SEQ}</span></span>
<span class="line"><span>├── TransferType: TransferType         # 调拨类型</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── SourceWarehouseId: Guid            # 源仓库</span></span>
<span class="line"><span>├── TargetWarehouseId: Guid            # 目标仓库</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── RequestedDate: DateTime            # 需求日期</span></span>
<span class="line"><span>├── ShippedDate: DateTime?             # 发出日期</span></span>
<span class="line"><span>├── ReceivedDate: DateTime?            # 接收日期</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── Status: TransferStatus</span></span>
<span class="line"><span>├── RequestedBy: Guid                  # 申请人</span></span>
<span class="line"><span>├── ApprovedBy: Guid?                  # 审批人</span></span>
<span class="line"><span>├── ApprovedAt: DateTime?</span></span>
<span class="line"><span>├── Remark: string(500)</span></span>
<span class="line"><span>└── Lines: List&lt;TransferOrderLine&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>TransferOrderLine (调拨单行)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TransferOrderId: Guid</span></span>
<span class="line"><span>├── LineNo: int</span></span>
<span class="line"><span>├── ItemId: Guid</span></span>
<span class="line"><span>├── ItemCode: string(50)</span></span>
<span class="line"><span>├── ItemName: string(200)</span></span>
<span class="line"><span>├── UnitOfMeasure: string(20)</span></span>
<span class="line"><span>├── RequestedQuantity: decimal(18,4)</span></span>
<span class="line"><span>├── ShippedQuantity: decimal(18,4)    # 已发数量</span></span>
<span class="line"><span>├── ReceivedQuantity: decimal(18,4)   # 已收数量</span></span>
<span class="line"><span>├── BatchNo: string(50)?</span></span>
<span class="line"><span>├── SourceLocationId: Guid?</span></span>
<span class="line"><span>├── TargetLocationId: Guid?</span></span>
<span class="line"><span>├── UnitCost: decimal(18,6)</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  TransferType:</span></span>
<span class="line"><span>    InterWarehouse=1(仓库间调拨), InterZone=2(库区间调拨),</span></span>
<span class="line"><span>    InterLocation=3(库位间调拨), Replenishment=4(拣选位补货)</span></span>
<span class="line"><span>  TransferStatus:</span></span>
<span class="line"><span>    Draft=0(草稿), PendingApproval=1(待审批), Approved=2(已审批),</span></span>
<span class="line"><span>    Shipped=3(已发出), InTransit=4(在途), Received=5(已接收),</span></span>
<span class="line"><span>    Completed=6(已完成), Rejected=7(已驳回), Cancelled=8(已取消)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="四、出库状态机" tabindex="-1"><a class="header-anchor" href="#四、出库状态机"><span>四、出库状态机</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>                                    (销售出库路径)</span></span>
<span class="line"><span>Draft → Allocated → PickingInProgress → Picked → Packing → Packed → Dispatched → Completed</span></span>
<span class="line"><span>                                          │</span></span>
<span class="line"><span>                                          │ (领料等无装箱)</span></span>
<span class="line"><span>                                          └──────────────────────────────────────▶ Completed</span></span>
<span class="line"><span></span></span>
<span class="line"><span>任意状态 ──▶ Cancelled (草稿/已分配状态可取消)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PartialCompleted: 部分行完成时的中间状态</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="调拨状态机" tabindex="-1"><a class="header-anchor" href="#调拨状态机"><span>调拨状态机</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Draft → PendingApproval → Approved → Shipped → InTransit → Received → Completed</span></span>
<span class="line"><span>                │                                              │</span></span>
<span class="line"><span>                ▼                                              │ (自动)</span></span>
<span class="line"><span>            Rejected → Draft (可修改重提)                       │</span></span>
<span class="line"><span>                                                               │</span></span>
<span class="line"><span>            源仓库出库 ─────────────────────────────▶ 目标仓库入库</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="五、拣货策略" tabindex="-1"><a class="header-anchor" href="#五、拣货策略"><span>五、拣货策略</span></a></h2><h3 id="_5-1-策略对比" tabindex="-1"><a class="header-anchor" href="#_5-1-策略对比"><span>5.1 策略对比</span></a></h3><table><thead><tr><th>策略</th><th>英文</th><th>原理</th><th>适用场景</th></tr></thead><tbody><tr><td>FIFO拣货</td><td>First In First Out</td><td>优先拣取最早入库批次</td><td>通用，防止积压</td></tr><tr><td>FEFO拣货</td><td>First Expired First Out</td><td>优先拣取最早过期批次</td><td>食品、药品、化学品</td></tr><tr><td>波次拣货</td><td>Wave Picking</td><td>合并多个出库单生成波次</td><td>订单量大，提高效率</td></tr><tr><td>分区拣货</td><td>Zone Picking</td><td>拣货员负责固定区域</td><td>大型仓库，减少行走</td></tr><tr><td>批量拣货</td><td>Batch Picking</td><td>同物料跨订单合并拣取</td><td>相同SKU多订单</td></tr></tbody></table><h3 id="_5-2-fifo-fefo-拣货逻辑" tabindex="-1"><a class="header-anchor" href="#_5-2-fifo-fefo-拣货逻辑"><span>5.2 FIFO/FEFO 拣货逻辑</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>FIFO 拣货示例:</span></span>
<span class="line"><span>  物料A 需拣 80件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  可用批次 (按入库日期排序):</span></span>
<span class="line"><span>    批次 BAT-001: 入库 1/5,  库存 30件  → 拣 30件</span></span>
<span class="line"><span>    批次 BAT-002: 入库 1/12, 库存 50件  → 拣 50件</span></span>
<span class="line"><span>    合计: 80件 ✅</span></span>
<span class="line"><span></span></span>
<span class="line"><span>FEFO 拣货示例:</span></span>
<span class="line"><span>  物料A 需拣 80件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  可用批次 (按到期日期排序):</span></span>
<span class="line"><span>    批次 BAT-003: 到期 3/15, 库存 20件  → 拣 20件</span></span>
<span class="line"><span>    批次 BAT-001: 到期 4/01, 库存 30件  → 拣 30件</span></span>
<span class="line"><span>    批次 BAT-002: 到期 5/20, 库存 50件  → 拣 30件</span></span>
<span class="line"><span>    合计: 80件 ✅</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-波次拣货流程" tabindex="-1"><a class="header-anchor" href="#_5-3-波次拣货流程"><span>5.3 波次拣货流程</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────────────────────────────────────────┐</span></span>
<span class="line"><span>│ 出库单池                                      │</span></span>
<span class="line"><span>│  IO-001: 物料A×10, 物料B×5                    │</span></span>
<span class="line"><span>│  IO-002: 物料A×20, 物料C×8                    │</span></span>
<span class="line"><span>│  IO-003: 物料B×15, 物料C×3                    │</span></span>
<span class="line"><span>└──────────────────┬───────────────────────────┘</span></span>
<span class="line"><span>                   │ 波次合并</span></span>
<span class="line"><span>                   ▼</span></span>
<span class="line"><span>┌──────────────────────────────────────────────┐</span></span>
<span class="line"><span>│ 波次 WAVE-001                                 │</span></span>
<span class="line"><span>│  物料A: 30件 (IO-001:10 + IO-002:20)          │</span></span>
<span class="line"><span>│  物料B: 20件 (IO-001:5 + IO-003:15)           │</span></span>
<span class="line"><span>│  物料C: 11件 (IO-002:8 + IO-003:3)            │</span></span>
<span class="line"><span>└──────────────────┬───────────────────────────┘</span></span>
<span class="line"><span>                   │ 合并拣货</span></span>
<span class="line"><span>                   ▼</span></span>
<span class="line"><span>┌──────────────────────────────────────────────┐</span></span>
<span class="line"><span>│ 拣货任务 (按库位路径排序)                       │</span></span>
<span class="line"><span>│  ① 库位 C-01-01: 物料A 30件                   │</span></span>
<span class="line"><span>│  ② 库位 C-02-03: 物料B 20件                   │</span></span>
<span class="line"><span>│  ③ 库位 C-03-01: 物料C 11件                   │</span></span>
<span class="line"><span>└──────────────────┬───────────────────────────┘</span></span>
<span class="line"><span>                   │ 拣货完成后分单</span></span>
<span class="line"><span>                   ▼</span></span>
<span class="line"><span>┌──────────────────────────────────────────────┐</span></span>
<span class="line"><span>│ 播种式分单                                    │</span></span>
<span class="line"><span>│  IO-001: 物料A×10, 物料B×5                    │</span></span>
<span class="line"><span>│  IO-002: 物料A×20, 物料C×8                    │</span></span>
<span class="line"><span>│  IO-003: 物料B×15, 物料C×3                    │</span></span>
<span class="line"><span>└──────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="六、出库成本计算" tabindex="-1"><a class="header-anchor" href="#六、出库成本计算"><span>六、出库成本计算</span></a></h2><h3 id="_6-1-各计价方法出库成本" tabindex="-1"><a class="header-anchor" href="#_6-1-各计价方法出库成本"><span>6.1 各计价方法出库成本</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>移动加权平均法:</span></span>
<span class="line"><span>  出库成本 = 出库数量 × 当前加权平均单位成本</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  示例:</span></span>
<span class="line"><span>    期初: 100件 × ¥10 = ¥1,000</span></span>
<span class="line"><span>    入库: 50件 × ¥12 = ¥600</span></span>
<span class="line"><span>    加权平均单价 = (1,000 + 600) / (100 + 50) = ¥10.67</span></span>
<span class="line"><span>    出库 80件: 成本 = 80 × ¥10.67 = ¥853.33</span></span>
<span class="line"><span></span></span>
<span class="line"><span>先进先出法:</span></span>
<span class="line"><span>  出库成本 = 按入库时间顺序逐笔消耗成本层</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  示例:</span></span>
<span class="line"><span>    成本层1: 100件 × ¥10</span></span>
<span class="line"><span>    成本层2: 50件 × ¥12</span></span>
<span class="line"><span>    出库 120件: = 100×¥10 + 20×¥12 = ¥1,240</span></span>
<span class="line"><span></span></span>
<span class="line"><span>标准成本法:</span></span>
<span class="line"><span>  出库成本 = 出库数量 × 标准单位成本</span></span>
<span class="line"><span>  差异 = (标准成本 - 实际成本) × 数量 → 计入差异科目</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="七、api-接口设计" tabindex="-1"><a class="header-anchor" href="#七、api-接口设计"><span>七、API 接口设计</span></a></h2><h3 id="_7-1-出库单" tabindex="-1"><a class="header-anchor" href="#_7-1-出库单"><span>7.1 出库单</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/inventory/issue-orders</code></td><td>出库单列表</td></tr><tr><td>POST</td><td><code>/api/inventory/issue-orders</code></td><td>创建出库单</td></tr><tr><td>GET</td><td><code>/api/inventory/issue-orders/{id}</code></td><td>出库单详情</td></tr><tr><td>PUT</td><td><code>/api/inventory/issue-orders/{id}</code></td><td>修改出库单</td></tr><tr><td>POST</td><td><code>/api/inventory/issue-orders/{id}/allocate</code></td><td>分配库存</td></tr><tr><td>POST</td><td><code>/api/inventory/issue-orders/{id}/pick</code></td><td>开始拣货</td></tr><tr><td>POST</td><td><code>/api/inventory/issue-orders/{id}/confirm</code></td><td>确认出库</td></tr><tr><td>POST</td><td><code>/api/inventory/issue-orders/{id}/dispatch</code></td><td>发运确认</td></tr><tr><td>POST</td><td><code>/api/inventory/issue-orders/{id}/cancel</code></td><td>取消出库</td></tr></tbody></table><h3 id="_7-2-拣货任务" tabindex="-1"><a class="header-anchor" href="#_7-2-拣货任务"><span>7.2 拣货任务</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/inventory/picking-tasks</code></td><td>拣货任务列表</td></tr><tr><td>GET</td><td><code>/api/inventory/picking-tasks/{id}</code></td><td>任务详情</td></tr><tr><td>POST</td><td><code>/api/inventory/picking-tasks/{id}/assign</code></td><td>指派任务</td></tr><tr><td>POST</td><td><code>/api/inventory/picking-tasks/{id}/start</code></td><td>开始拣货</td></tr><tr><td>POST</td><td><code>/api/inventory/picking-tasks/{id}/complete</code></td><td>完成拣货</td></tr><tr><td>POST</td><td><code>/api/inventory/picking-tasks/{id}/short-pick</code></td><td>短拣报告</td></tr><tr><td>POST</td><td><code>/api/inventory/picking-tasks/create-wave</code></td><td>创建波次</td></tr><tr><td>GET</td><td><code>/api/inventory/picking-tasks/pending</code></td><td>待执行任务</td></tr></tbody></table><h3 id="_7-3-装箱管理" tabindex="-1"><a class="header-anchor" href="#_7-3-装箱管理"><span>7.3 装箱管理</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/inventory/packing-lists</code></td><td>装箱单列表</td></tr><tr><td>POST</td><td><code>/api/inventory/packing-lists</code></td><td>创建装箱单</td></tr><tr><td>GET</td><td><code>/api/inventory/packing-lists/{id}</code></td><td>装箱单详情</td></tr><tr><td>POST</td><td><code>/api/inventory/packing-lists/{id}/add-item</code></td><td>添加物料到箱</td></tr><tr><td>POST</td><td><code>/api/inventory/packing-lists/{id}/complete</code></td><td>完成装箱</td></tr><tr><td>POST</td><td><code>/api/inventory/packing-lists/{id}/ship</code></td><td>发运确认</td></tr><tr><td>GET</td><td><code>/api/inventory/packing-lists/{id}/labels</code></td><td>打印装箱标签</td></tr></tbody></table><h3 id="_7-4-调拨管理" tabindex="-1"><a class="header-anchor" href="#_7-4-调拨管理"><span>7.4 调拨管理</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/inventory/transfer-orders</code></td><td>调拨单列表</td></tr><tr><td>POST</td><td><code>/api/inventory/transfer-orders</code></td><td>创建调拨单</td></tr><tr><td>GET</td><td><code>/api/inventory/transfer-orders/{id}</code></td><td>调拨单详情</td></tr><tr><td>PUT</td><td><code>/api/inventory/transfer-orders/{id}</code></td><td>修改调拨单</td></tr><tr><td>POST</td><td><code>/api/inventory/transfer-orders/{id}/approve</code></td><td>审批调拨</td></tr><tr><td>POST</td><td><code>/api/inventory/transfer-orders/{id}/reject</code></td><td>驳回调拨</td></tr><tr><td>POST</td><td><code>/api/inventory/transfer-orders/{id}/ship</code></td><td>调拨发出</td></tr><tr><td>POST</td><td><code>/api/inventory/transfer-orders/{id}/receive</code></td><td>调拨接收</td></tr><tr><td>POST</td><td><code>/api/inventory/transfer-orders/{id}/cancel</code></td><td>取消调拨</td></tr></tbody></table><h3 id="_7-5-库存预留" tabindex="-1"><a class="header-anchor" href="#_7-5-库存预留"><span>7.5 库存预留</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>POST</td><td><code>/api/inventory/reserve</code></td><td>预留库存</td></tr><tr><td>POST</td><td><code>/api/inventory/unreserve</code></td><td>取消预留</td></tr><tr><td>GET</td><td><code>/api/inventory/reservations</code></td><td>预留列表</td></tr><tr><td>GET</td><td><code>/api/inventory/availability/{itemId}</code></td><td>可用量查询</td></tr></tbody></table><h2 id="八、实体关系图" tabindex="-1"><a class="header-anchor" href="#八、实体关系图"><span>八、实体关系图</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────────┐     ┌──────────────────┐</span></span>
<span class="line"><span>│ IssueOrder   │────▶│ IssueOrderLine   │</span></span>
<span class="line"><span>│ 出库单        │ 1:N │ 出库单行          │</span></span>
<span class="line"><span>└──────┬───────┘     └──────┬───────────┘</span></span>
<span class="line"><span>       │                     │ 1:N</span></span>
<span class="line"><span>       │                     ▼</span></span>
<span class="line"><span>       │              ┌──────────────────┐</span></span>
<span class="line"><span>       │              │  PickingTask     │</span></span>
<span class="line"><span>       │              │  拣货任务         │</span></span>
<span class="line"><span>       │              └──────────────────┘</span></span>
<span class="line"><span>       │</span></span>
<span class="line"><span>       │ 1:N</span></span>
<span class="line"><span>       ▼</span></span>
<span class="line"><span>┌──────────────┐     ┌──────────────────┐</span></span>
<span class="line"><span>│ PackingList  │────▶│PackingListLine   │</span></span>
<span class="line"><span>│ 装箱单        │ 1:N │ 装箱单行          │</span></span>
<span class="line"><span>└──────────────┘     └──────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────────────┐     ┌──────────────────┐</span></span>
<span class="line"><span>│TransferOrder │────▶│TransferOrderLine │</span></span>
<span class="line"><span>│ 调拨单        │ 1:N │ 调拨单行          │</span></span>
<span class="line"><span>└──────────────┘     └──────────────────┘</span></span>
<span class="line"><span>       │</span></span>
<span class="line"><span>       ├──────▶ IssueOrder (源仓库出库)</span></span>
<span class="line"><span>       └──────▶ ReceiptOrder (目标仓库入库)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="九、业务规则" tabindex="-1"><a class="header-anchor" href="#九、业务规则"><span>九、业务规则</span></a></h2><table><thead><tr><th>规则</th><th>描述</th></tr></thead><tbody><tr><td>库存不可为负</td><td>出库数量不得超过可用库存 (除非仓库允许负库存)</td></tr><tr><td>预留优先</td><td>已预留库存只能被预留订单使用</td></tr><tr><td>FIFO/FEFO强制</td><td>配置FIFO/FEFO的物料必须按策略出库</td></tr><tr><td>批次一致</td><td>同一出库行的拣货批次必须一致 (或按批次拆行)</td></tr><tr><td>拣货确认</td><td>拣货数量与任务数量不一致时触发短拣流程</td></tr><tr><td>装箱校验</td><td>装箱总数量必须等于出库单数量</td></tr><tr><td>箱重限制</td><td>单箱重量不得超过配置的最大重量</td></tr><tr><td>调拨两端同步</td><td>调拨发出和接收必须有对应的出入库记录</td></tr><tr><td>在途跟踪</td><td>调拨发出后物料进入在途状态，接收后解除</td></tr><tr><td>领料不超</td><td>生产领料不得超过工单 BOM 用量 (可配置超领比例)</td></tr><tr><td>确认不可逆</td><td>已确认的出库单不可修改，只能通过入库冲销</td></tr><tr><td>事务原子性</td><td>出库确认、库存更新、成本计算、财务凭证在同一事务内完成</td></tr><tr><td>序列号追踪</td><td>序列号管理物料出库时必须记录每件序列号</td></tr><tr><td>取消回退</td><td>取消出库单自动释放已分配/预留的库存</td></tr></tbody></table>`,47)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};