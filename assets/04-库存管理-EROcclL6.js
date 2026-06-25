import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-BVtXrkU4.js";import{t as r}from"./app-C34p0aR5.js";var i=JSON.parse(`{"path":"/%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F/ERP%E4%B8%9A%E5%8A%A1/07-MRP%E6%A8%A1%E5%9D%97/04-%E5%BA%93%E5%AD%98%E7%AE%A1%E7%90%86.html","title":"库存管理","lang":"zh-CN","frontmatter":{"title":"库存管理","date":"2025-04-18T00:00:00.000Z","author":"Moklgy","category":["ERP业务"],"tag":["ERP","MRP"],"order":4},"git":{"createdTime":1776517348000,"updatedTime":1776517348000,"contributors":[{"name":"moklgy","username":"moklgy","email":"moklgy@foxmail.com","commits":1,"url":"https://github.com/moklgy"}]},"readingTime":{"minutes":5.76,"words":1727},"filePathRelative":"业务系统/ERP业务/07-MRP模块/04-库存管理.md"}`),a={name:`04-库存管理.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="库存管理" tabindex="-1"><a class="header-anchor" href="#库存管理"><span>库存管理</span></a></h1><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p>库存管理子系统负责企业物料的存储、流转和追溯，涵盖仓库/库位管理、入库/出库事务处理、批次和序列号追踪、库存盘点以及库存报表。它为 MRP 运算提供实时库存数据，为财务模块提供存货变动依据。</p><h2 id="一、仓库体系" tabindex="-1"><a class="header-anchor" href="#一、仓库体系"><span>一、仓库体系</span></a></h2><h3 id="_1-1-仓库结构" tabindex="-1"><a class="header-anchor" href="#_1-1-仓库结构"><span>1.1 仓库结构</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>企业</span></span>
<span class="line"><span>├── 原材料仓库 (RM-WH)</span></span>
<span class="line"><span>│   ├── 库区A (收货待检区)</span></span>
<span class="line"><span>│   ├── 库区B (合格品区)</span></span>
<span class="line"><span>│   │   ├── 库位 B-01-01</span></span>
<span class="line"><span>│   │   ├── 库位 B-01-02</span></span>
<span class="line"><span>│   │   └── ...</span></span>
<span class="line"><span>│   └── 库区C (不合格品区)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── 半成品仓库 (WIP-WH)</span></span>
<span class="line"><span>│   ├── 车间线边仓</span></span>
<span class="line"><span>│   └── 半成品暂存区</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── 成品仓库 (FG-WH)</span></span>
<span class="line"><span>│   ├── 库区A (常规存储)</span></span>
<span class="line"><span>│   └── 库区B (待发区)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>└── 其他仓库</span></span>
<span class="line"><span>    ├── 备品备件仓</span></span>
<span class="line"><span>    └── 退货仓</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-仓库实体" tabindex="-1"><a class="header-anchor" href="#_1-2-仓库实体"><span>1.2 仓库实体</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Warehouse (仓库)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── Code: string(20)                   # 仓库编码</span></span>
<span class="line"><span>├── Name: string(100)                  # 仓库名称</span></span>
<span class="line"><span>├── Type: WarehouseType                # 类型</span></span>
<span class="line"><span>├── Address: string(300)               # 地址</span></span>
<span class="line"><span>├── ManagerId: Guid?                   # 仓管员</span></span>
<span class="line"><span>├── IsActive: bool</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Location (库位)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── WarehouseId: Guid</span></span>
<span class="line"><span>├── Code: string(20)                   # 库位编码 (如 A-01-01)</span></span>
<span class="line"><span>├── Name: string(100)</span></span>
<span class="line"><span>├── Zone: string(20)                   # 库区</span></span>
<span class="line"><span>├── Row: string(10)                    # 排</span></span>
<span class="line"><span>├── Column: string(10)                 # 列</span></span>
<span class="line"><span>├── Level: string(10)                  # 层</span></span>
<span class="line"><span>├── MaxCapacity: decimal(18,4)?       # 最大容量</span></span>
<span class="line"><span>├── CurrentOccupancy: decimal(18,4)?  # 当前占用</span></span>
<span class="line"><span>├── IsActive: bool</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  WarehouseType: RawMaterial=1, WIP=2, FinishedGoods=3, Spare=4, Return=5, Other=9</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、库存核心实体" tabindex="-1"><a class="header-anchor" href="#二、库存核心实体"><span>二、库存核心实体</span></a></h2><h3 id="_2-1-库存记录" tabindex="-1"><a class="header-anchor" href="#_2-1-库存记录"><span>2.1 库存记录</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>InventoryItem (库存物料)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── ItemId: Guid                       # 物料主数据ID</span></span>
<span class="line"><span>├── ItemCode: string(50)</span></span>
<span class="line"><span>├── ItemName: string(200)</span></span>
<span class="line"><span>├── WarehouseId: Guid</span></span>
<span class="line"><span>├── LocationId: Guid?</span></span>
<span class="line"><span>├── BatchNo: string(50)?              # 批次号</span></span>
<span class="line"><span>├── SerialNo: string(50)?             # 序列号</span></span>
<span class="line"><span>├── UnitOfMeasure: string(20)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── OnHandQuantity: decimal(18,4)     # 在库数量</span></span>
<span class="line"><span>├── ReservedQuantity: decimal(18,4)   # 预留数量（已分配给SO/WO）</span></span>
<span class="line"><span>├── AvailableQuantity: decimal(18,4)  # 可用数量 = OnHand - Reserved</span></span>
<span class="line"><span>├── InTransitQuantity: decimal(18,4)  # 在途数量</span></span>
<span class="line"><span>├── InspectionQuantity: decimal(18,4) # 待检数量</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── UnitCost: decimal(18,6)           # 单位成本</span></span>
<span class="line"><span>├── TotalCost: decimal(18,2)          # 库存总成本</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── LastReceiptDate: DateTime?         # 最后入库日期</span></span>
<span class="line"><span>├── LastIssueDate: DateTime?           # 最后出库日期</span></span>
<span class="line"><span>├── ExpiryDate: DateTime?              # 有效期</span></span>
<span class="line"><span>└── Status: InventoryStatus</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  InventoryStatus: Available=1(可用), Reserved=2(已预留),</span></span>
<span class="line"><span>                   Inspection=3(待检), Blocked=4(冻结), Expired=5(过期)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-库存事务" tabindex="-1"><a class="header-anchor" href="#_2-2-库存事务"><span>2.2 库存事务</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>InventoryTransaction (库存事务)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── TransactionNo: string(30)          # 事务编号</span></span>
<span class="line"><span>├── TransactionDate: DateTime</span></span>
<span class="line"><span>├── TransactionType: InvTransType      # 事务类型</span></span>
<span class="line"><span>├── Direction: Direction               # 入/出</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── ItemId: Guid</span></span>
<span class="line"><span>├── ItemCode: string(50)</span></span>
<span class="line"><span>├── ItemName: string(200)</span></span>
<span class="line"><span>├── WarehouseId: Guid</span></span>
<span class="line"><span>├── LocationId: Guid?</span></span>
<span class="line"><span>├── BatchNo: string(50)?</span></span>
<span class="line"><span>├── SerialNo: string(50)?</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── Quantity: decimal(18,4)           # 数量 (正数)</span></span>
<span class="line"><span>├── UnitCost: decimal(18,6)           # 单位成本</span></span>
<span class="line"><span>├── TotalCost: decimal(18,2)          # 总成本</span></span>
<span class="line"><span>├── UnitOfMeasure: string(20)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── SourceDocumentType: string(20)     # 来源单据类型 (PO/SO/WO/...)</span></span>
<span class="line"><span>├── SourceDocumentId: Guid?</span></span>
<span class="line"><span>├── SourceDocumentNo: string(50)?</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── CounterpartWarehouseId: Guid?      # 对方仓库 (调拨用)</span></span>
<span class="line"><span>├── VoucherId: Guid?                   # 关联财务凭证</span></span>
<span class="line"><span>├── OperatorId: Guid                   # 操作人</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  InvTransType:</span></span>
<span class="line"><span>    PurchaseReceipt=1(采购入库), SalesIssue=2(销售出库),</span></span>
<span class="line"><span>    ProductionIssue=3(生产领料), ProductionReceipt=4(完工入库),</span></span>
<span class="line"><span>    Transfer=5(调拨), Adjustment=6(盘点调整),</span></span>
<span class="line"><span>    Return=7(退货), Scrap=8(报废), Other=9</span></span>
<span class="line"><span>  Direction: In=1(入库), Out=2(出库)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、库存操作类型" tabindex="-1"><a class="header-anchor" href="#三、库存操作类型"><span>三、库存操作类型</span></a></h2><table><thead><tr><th>操作类型</th><th>方向</th><th>触发场景</th><th>财务影响</th></tr></thead><tbody><tr><td>采购入库</td><td>入</td><td>PO 收货确认</td><td>原材料增加，暂估入账</td></tr><tr><td>销售出库</td><td>出</td><td>SO 发货确认</td><td>库存商品减少，成本结转</td></tr><tr><td>生产领料</td><td>出</td><td>WO 领料确认</td><td>原材料→生产成本</td></tr><tr><td>完工入库</td><td>入</td><td>WO 完工确认</td><td>生产成本→库存商品</td></tr><tr><td>仓库调拨</td><td>入/出</td><td>手工调拨</td><td>仓库间转移</td></tr><tr><td>盘盈调整</td><td>入</td><td>盘点结果</td><td>库存增加</td></tr><tr><td>盘亏调整</td><td>出</td><td>盘点结果</td><td>库存减少</td></tr><tr><td>采购退货</td><td>出</td><td>退货确认</td><td>原材料减少</td></tr><tr><td>销售退货</td><td>入</td><td>退货收货</td><td>库存商品增加</td></tr><tr><td>报废</td><td>出</td><td>报废审批</td><td>库存减少，损失</td></tr></tbody></table><h2 id="四、批次与序列号" tabindex="-1"><a class="header-anchor" href="#四、批次与序列号"><span>四、批次与序列号</span></a></h2><h3 id="_4-1-批次管理" tabindex="-1"><a class="header-anchor" href="#_4-1-批次管理"><span>4.1 批次管理</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Batch (批次)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── ItemId: Guid</span></span>
<span class="line"><span>├── BatchNo: string(50)                # 批次号</span></span>
<span class="line"><span>├── ManufactureDate: DateTime?         # 生产日期</span></span>
<span class="line"><span>├── ExpiryDate: DateTime?              # 有效期</span></span>
<span class="line"><span>├── SupplierBatchNo: string(50)?       # 供应商批次号</span></span>
<span class="line"><span>├── SupplierId: Guid?</span></span>
<span class="line"><span>├── Quantity: decimal(18,4)            # 批次数量</span></span>
<span class="line"><span>├── Status: BatchStatus</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  BatchStatus: Active=1, Expired=2, Blocked=3</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-追溯方向" tabindex="-1"><a class="header-anchor" href="#_4-2-追溯方向"><span>4.2 追溯方向</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>正向追溯: 原材料批次 → 使用该批次的工单 → 产出的产品批次 → 销售给哪些客户</span></span>
<span class="line"><span>反向追溯: 客户投诉 → 产品批次 → 生产工单 → 使用的原材料批次 → 供应商</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="五、库存盘点" tabindex="-1"><a class="header-anchor" href="#五、库存盘点"><span>五、库存盘点</span></a></h2><h3 id="_5-1-盘点流程" tabindex="-1"><a class="header-anchor" href="#_5-1-盘点流程"><span>5.1 盘点流程</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>① 创建盘点计划</span></span>
<span class="line"><span>   选择仓库/库区/物料范围</span></span>
<span class="line"><span>              │</span></span>
<span class="line"><span>              ▼</span></span>
<span class="line"><span>② 生成盘点单</span></span>
<span class="line"><span>   系统自动生成待盘物料清单（可选是否显示账面数量）</span></span>
<span class="line"><span>              │</span></span>
<span class="line"><span>              ▼</span></span>
<span class="line"><span>③ 执行盘点</span></span>
<span class="line"><span>   仓管员清点实物，录入实盘数量</span></span>
<span class="line"><span>              │</span></span>
<span class="line"><span>              ▼</span></span>
<span class="line"><span>④ 差异处理</span></span>
<span class="line"><span>   系统自动计算差异 = 实盘数量 - 账面数量</span></span>
<span class="line"><span>   ├── 差异为0 → 无需处理</span></span>
<span class="line"><span>   ├── 差异&gt;0 (盘盈) → 生成入库调整</span></span>
<span class="line"><span>   └── 差异&lt;0 (盘亏) → 生成出库调整（需审批）</span></span>
<span class="line"><span>              │</span></span>
<span class="line"><span>              ▼</span></span>
<span class="line"><span>⑤ 审批调整</span></span>
<span class="line"><span>              │</span></span>
<span class="line"><span>              ▼</span></span>
<span class="line"><span>⑥ 生成调整事务和财务凭证</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-盘点实体" tabindex="-1"><a class="header-anchor" href="#_5-2-盘点实体"><span>5.2 盘点实体</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>StockCount (盘点单)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── CountNo: string(30)</span></span>
<span class="line"><span>├── WarehouseId: Guid</span></span>
<span class="line"><span>├── CountDate: DateTime</span></span>
<span class="line"><span>├── CountType: CountType               # 盘点类型</span></span>
<span class="line"><span>├── Status: CountStatus</span></span>
<span class="line"><span>├── CountedBy: Guid</span></span>
<span class="line"><span>├── ApprovedBy: Guid?</span></span>
<span class="line"><span>└── Lines: List&lt;StockCountLine&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>StockCountLine (盘点行)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── CountId: Guid</span></span>
<span class="line"><span>├── ItemId: Guid</span></span>
<span class="line"><span>├── ItemCode: string(50)</span></span>
<span class="line"><span>├── ItemName: string(200)</span></span>
<span class="line"><span>├── LocationId: Guid?</span></span>
<span class="line"><span>├── BatchNo: string(50)?</span></span>
<span class="line"><span>├── BookQuantity: decimal(18,4)       # 账面数量</span></span>
<span class="line"><span>├── ActualQuantity: decimal(18,4)     # 实盘数量</span></span>
<span class="line"><span>├── Variance: decimal(18,4)           # 差异 = 实盘 - 账面</span></span>
<span class="line"><span>├── UnitCost: decimal(18,6)           # 单价</span></span>
<span class="line"><span>├── VarianceAmount: decimal(18,2)     # 差异金额</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  CountType: Full=1(全面盘点), Cycle=2(循环盘点), Spot=3(抽盘)</span></span>
<span class="line"><span>  CountStatus: Draft=0, Counting=1, Completed=2, Approved=3</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="六、api-接口设计" tabindex="-1"><a class="header-anchor" href="#六、api-接口设计"><span>六、API 接口设计</span></a></h2><h3 id="_6-1-仓库管理" tabindex="-1"><a class="header-anchor" href="#_6-1-仓库管理"><span>6.1 仓库管理</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/mrp/inventory/warehouses</code></td><td>仓库列表</td></tr><tr><td>POST</td><td><code>/api/mrp/inventory/warehouses</code></td><td>新增仓库</td></tr><tr><td>GET</td><td><code>/api/mrp/inventory/warehouses/{id}/locations</code></td><td>库位列表</td></tr><tr><td>POST</td><td><code>/api/mrp/inventory/warehouses/{id}/locations</code></td><td>新增库位</td></tr></tbody></table><h3 id="_6-2-库存查询" tabindex="-1"><a class="header-anchor" href="#_6-2-库存查询"><span>6.2 库存查询</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/mrp/inventory/items</code></td><td>库存列表（多维筛选）</td></tr><tr><td>GET</td><td><code>/api/mrp/inventory/items/{itemId}</code></td><td>物料库存详情</td></tr><tr><td>GET</td><td><code>/api/mrp/inventory/items/{itemId}/transactions</code></td><td>物料事务明细</td></tr><tr><td>GET</td><td><code>/api/mrp/inventory/items/{itemId}/batches</code></td><td>物料批次列表</td></tr><tr><td>GET</td><td><code>/api/mrp/inventory/availability/{itemId}</code></td><td>可用量查询</td></tr></tbody></table><h3 id="_6-3-库存操作" tabindex="-1"><a class="header-anchor" href="#_6-3-库存操作"><span>6.3 库存操作</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>POST</td><td><code>/api/mrp/inventory/transfer</code></td><td>仓库调拨</td></tr><tr><td>POST</td><td><code>/api/mrp/inventory/adjust</code></td><td>库存调整</td></tr><tr><td>POST</td><td><code>/api/mrp/inventory/scrap</code></td><td>报废处理</td></tr><tr><td>POST</td><td><code>/api/mrp/inventory/reserve</code></td><td>预留库存</td></tr><tr><td>POST</td><td><code>/api/mrp/inventory/unreserve</code></td><td>取消预留</td></tr></tbody></table><h3 id="_6-4-盘点管理" tabindex="-1"><a class="header-anchor" href="#_6-4-盘点管理"><span>6.4 盘点管理</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>POST</td><td><code>/api/mrp/inventory/stock-counts</code></td><td>创建盘点单</td></tr><tr><td>GET</td><td><code>/api/mrp/inventory/stock-counts</code></td><td>盘点单列表</td></tr><tr><td>PUT</td><td><code>/api/mrp/inventory/stock-counts/{id}</code></td><td>录入实盘数量</td></tr><tr><td>POST</td><td><code>/api/mrp/inventory/stock-counts/{id}/complete</code></td><td>完成盘点</td></tr><tr><td>POST</td><td><code>/api/mrp/inventory/stock-counts/{id}/approve</code></td><td>审批差异</td></tr></tbody></table><h3 id="_6-5-库存报表" tabindex="-1"><a class="header-anchor" href="#_6-5-库存报表"><span>6.5 库存报表</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/mrp/inventory/reports/summary</code></td><td>库存汇总表</td></tr><tr><td>GET</td><td><code>/api/mrp/inventory/reports/aging</code></td><td>库龄分析</td></tr><tr><td>GET</td><td><code>/api/mrp/inventory/reports/turnover</code></td><td>库存周转率</td></tr><tr><td>GET</td><td><code>/api/mrp/inventory/reports/slow-moving</code></td><td>呆滞物料报表</td></tr><tr><td>GET</td><td><code>/api/mrp/inventory/reports/traceability</code></td><td>批次追溯</td></tr></tbody></table><h2 id="七、实体关系图" tabindex="-1"><a class="header-anchor" href="#七、实体关系图"><span>七、实体关系图</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────────┐     ┌──────────────┐</span></span>
<span class="line"><span>│ Warehouse    │────▶│ Location     │</span></span>
<span class="line"><span>│ 仓库          │ 1:N │ 库位          │</span></span>
<span class="line"><span>└──────┬───────┘     └──────────────┘</span></span>
<span class="line"><span>       │</span></span>
<span class="line"><span>       ▼</span></span>
<span class="line"><span>┌──────────────┐     ┌──────────────────┐</span></span>
<span class="line"><span>│InventoryItem │────▶│InventoryTransact │</span></span>
<span class="line"><span>│ 库存记录      │ 1:N │ 库存事务          │</span></span>
<span class="line"><span>└──────────────┘     └──────────────────┘</span></span>
<span class="line"><span>       │</span></span>
<span class="line"><span>       ▼</span></span>
<span class="line"><span>┌──────────────┐     ┌──────────────────┐</span></span>
<span class="line"><span>│ Batch        │     │ StockCount       │</span></span>
<span class="line"><span>│ 批次          │     │ 盘点单            │</span></span>
<span class="line"><span>└──────────────┘     └──────┬───────────┘</span></span>
<span class="line"><span>                            │ 1:N</span></span>
<span class="line"><span>                            ▼</span></span>
<span class="line"><span>                     ┌──────────────────┐</span></span>
<span class="line"><span>                     │ StockCountLine   │</span></span>
<span class="line"><span>                     │ 盘点行            │</span></span>
<span class="line"><span>                     └──────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="八、业务规则" tabindex="-1"><a class="header-anchor" href="#八、业务规则"><span>八、业务规则</span></a></h2><table><thead><tr><th>规则</th><th>描述</th></tr></thead><tbody><tr><td>库存不可为负</td><td>出库数量不得超过可用库存</td></tr><tr><td>预留优先</td><td>已预留库存不可被其他订单使用</td></tr><tr><td>批次强制</td><td>启用批次管理的物料所有事务必须记录批次</td></tr><tr><td>FIFO 出库</td><td>先进先出策略下优先出库早期批次</td></tr><tr><td>有效期管理</td><td>过期批次自动冻结，不可出库</td></tr><tr><td>盘点冻结</td><td>盘点进行中冻结该仓库的出入库操作</td></tr><tr><td>差异审批</td><td>盘亏超过金额阈值需要管理层审批</td></tr><tr><td>调拨同步</td><td>调拨出库和入库必须同步完成</td></tr><tr><td>事务不可删除</td><td>库存事务只能冲销，不可删除</td></tr><tr><td>成本同步</td><td>出入库事务自动更新库存成本</td></tr></tbody></table>`,40)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};