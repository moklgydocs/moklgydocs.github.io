import{E as e,d as t,l as n,s as r}from"./runtime-core.esm-bundler-DxPX4OGg.js";import{t as i}from"./plugin-vue_export-helper-h3BpcrCd.js";var a=JSON.parse(`{"path":"/%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F/ERP%E4%B8%9A%E5%8A%A1/05-%E5%BA%93%E5%AD%98%E6%A8%A1%E5%9D%97/06-%E6%89%B9%E6%AC%A1%E4%B8%8E%E5%BA%8F%E5%88%97%E5%8F%B7%E8%BF%BD%E6%BA%AF.html","title":"批次与序列号追溯","lang":"zh-CN","frontmatter":{"title":"批次与序列号追溯","date":"2025-04-18T00:00:00.000Z","author":"Moklgy","category":["ERP业务"],"tag":["ERP","库存"],"order":6},"git":{"createdTime":1776517348000,"updatedTime":1776517348000,"contributors":[{"name":"moklgy","username":"moklgy","email":"moklgy@foxmail.com","commits":1,"url":"https://github.com/moklgy"}]},"readingTime":{"minutes":7.99,"words":2396},"filePathRelative":"业务系统/ERP业务/05-库存模块/06-批次与序列号追溯.md","excerpt":"\\n<h2>概述</h2>\\n<p>批次与序列号追溯是库存管理的核心功能之一，为企业提供物料的全链路可追溯性。系统支持批次管理（一批多件）和序列号管理（一件一号），实现从原材料供应商到最终客户的正向追溯和反向追溯，满足质量管理、法规合规和召回管理需求。</p>\\n<h2>一、批次管理</h2>\\n<h3>1.1 批次实体</h3>\\n<div class=\\"language- line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"\\" style=\\"background-color:#282c34;color:#abb2bf\\"><pre class=\\"shiki one-dark-pro vp-code\\"><code class=\\"language-\\"><span class=\\"line\\"><span>Batch (批次)</span></span>\\n<span class=\\"line\\"><span>├── Id: Guid</span></span>\\n<span class=\\"line\\"><span>├── TenantId: Guid</span></span>\\n<span class=\\"line\\"><span>├── ItemId: Guid</span></span>\\n<span class=\\"line\\"><span>├── ItemCode: string(50)</span></span>\\n<span class=\\"line\\"><span>├── ItemName: string(200)</span></span>\\n<span class=\\"line\\"><span>├── BatchNo: string(50)                # 批次号</span></span>\\n<span class=\\"line\\"><span>│</span></span>\\n<span class=\\"line\\"><span>├── ManufactureDate: DateTime?         # 生产日期</span></span>\\n<span class=\\"line\\"><span>├── ExpiryDate: DateTime?              # 有效期</span></span>\\n<span class=\\"line\\"><span>├── ShelfLifeDays: int?                # 保质期天数</span></span>\\n<span class=\\"line\\"><span>├── RemainingShelfLifePercent: decimal(5,2)? # 剩余保质期%</span></span>\\n<span class=\\"line\\"><span>│</span></span>\\n<span class=\\"line\\"><span>├── SupplierBatchNo: string(50)?       # 供应商批次号</span></span>\\n<span class=\\"line\\"><span>├── SupplierId: Guid?                  # 供应商</span></span>\\n<span class=\\"line\\"><span>├── PurchaseOrderId: Guid?             # 采购订单</span></span>\\n<span class=\\"line\\"><span>├── WorkOrderId: Guid?                 # 生产工单 (自制件)</span></span>\\n<span class=\\"line\\"><span>│</span></span>\\n<span class=\\"line\\"><span>├── InitialQuantity: decimal(18,4)    # 初始数量</span></span>\\n<span class=\\"line\\"><span>├── RemainingQuantity: decimal(18,4)  # 剩余数量</span></span>\\n<span class=\\"line\\"><span>├── ConsumedQuantity: decimal(18,4)   # 已消耗数量</span></span>\\n<span class=\\"line\\"><span>│</span></span>\\n<span class=\\"line\\"><span>├── Status: BatchStatus</span></span>\\n<span class=\\"line\\"><span>├── QualityStatus: BatchQualityStatus  # 质量状态</span></span>\\n<span class=\\"line\\"><span>├── HoldReason: string(200)?           # 冻结原因</span></span>\\n<span class=\\"line\\"><span>├── HoldDate: DateTime?                # 冻结日期</span></span>\\n<span class=\\"line\\"><span>├── HoldBy: Guid?</span></span>\\n<span class=\\"line\\"><span>├── ReleasedBy: Guid?</span></span>\\n<span class=\\"line\\"><span>├── ReleasedDate: DateTime?</span></span>\\n<span class=\\"line\\"><span>│</span></span>\\n<span class=\\"line\\"><span>├── CountryOfOrigin: string(50)?       # 原产国</span></span>\\n<span class=\\"line\\"><span>├── CertificateNo: string(100)?        # 质量证书号</span></span>\\n<span class=\\"line\\"><span>├── WarehouseId: Guid</span></span>\\n<span class=\\"line\\"><span>├── LocationId: Guid?</span></span>\\n<span class=\\"line\\"><span>└── Remark: string(500)</span></span>\\n<span class=\\"line\\"><span></span></span>\\n<span class=\\"line\\"><span>枚举:</span></span>\\n<span class=\\"line\\"><span>  BatchStatus:</span></span>\\n<span class=\\"line\\"><span>    Active=1(活跃), Consumed=2(已耗尽), Expired=3(已过期),</span></span>\\n<span class=\\"line\\"><span>    Blocked=4(已冻结), Scrapped=5(已报废)</span></span>\\n<span class=\\"line\\"><span>  BatchQualityStatus:</span></span>\\n<span class=\\"line\\"><span>    PendingInspection=0(待检), Released=1(已放行),</span></span>\\n<span class=\\"line\\"><span>    OnHold=2(冻结中), Quarantined=3(隔离中), Rejected=4(已拒绝)</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>"}`),o={name:`06-批次与序列号追溯.md`};function s(i,a,o,s,c,l){return e(),n(`div`,null,[...a[0]||=[t(`<h1 id="批次与序列号追溯" tabindex="-1"><a class="header-anchor" href="#批次与序列号追溯"><span>批次与序列号追溯</span></a></h1><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p>批次与序列号追溯是库存管理的核心功能之一，为企业提供物料的全链路可追溯性。系统支持批次管理（一批多件）和序列号管理（一件一号），实现从原材料供应商到最终客户的正向追溯和反向追溯，满足质量管理、法规合规和召回管理需求。</p><h2 id="一、批次管理" tabindex="-1"><a class="header-anchor" href="#一、批次管理"><span>一、批次管理</span></a></h2><h3 id="_1-1-批次实体" tabindex="-1"><a class="header-anchor" href="#_1-1-批次实体"><span>1.1 批次实体</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Batch (批次)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── ItemId: Guid</span></span>
<span class="line"><span>├── ItemCode: string(50)</span></span>
<span class="line"><span>├── ItemName: string(200)</span></span>
<span class="line"><span>├── BatchNo: string(50)                # 批次号</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── ManufactureDate: DateTime?         # 生产日期</span></span>
<span class="line"><span>├── ExpiryDate: DateTime?              # 有效期</span></span>
<span class="line"><span>├── ShelfLifeDays: int?                # 保质期天数</span></span>
<span class="line"><span>├── RemainingShelfLifePercent: decimal(5,2)? # 剩余保质期%</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── SupplierBatchNo: string(50)?       # 供应商批次号</span></span>
<span class="line"><span>├── SupplierId: Guid?                  # 供应商</span></span>
<span class="line"><span>├── PurchaseOrderId: Guid?             # 采购订单</span></span>
<span class="line"><span>├── WorkOrderId: Guid?                 # 生产工单 (自制件)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── InitialQuantity: decimal(18,4)    # 初始数量</span></span>
<span class="line"><span>├── RemainingQuantity: decimal(18,4)  # 剩余数量</span></span>
<span class="line"><span>├── ConsumedQuantity: decimal(18,4)   # 已消耗数量</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── Status: BatchStatus</span></span>
<span class="line"><span>├── QualityStatus: BatchQualityStatus  # 质量状态</span></span>
<span class="line"><span>├── HoldReason: string(200)?           # 冻结原因</span></span>
<span class="line"><span>├── HoldDate: DateTime?                # 冻结日期</span></span>
<span class="line"><span>├── HoldBy: Guid?</span></span>
<span class="line"><span>├── ReleasedBy: Guid?</span></span>
<span class="line"><span>├── ReleasedDate: DateTime?</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── CountryOfOrigin: string(50)?       # 原产国</span></span>
<span class="line"><span>├── CertificateNo: string(100)?        # 质量证书号</span></span>
<span class="line"><span>├── WarehouseId: Guid</span></span>
<span class="line"><span>├── LocationId: Guid?</span></span>
<span class="line"><span>└── Remark: string(500)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  BatchStatus:</span></span>
<span class="line"><span>    Active=1(活跃), Consumed=2(已耗尽), Expired=3(已过期),</span></span>
<span class="line"><span>    Blocked=4(已冻结), Scrapped=5(已报废)</span></span>
<span class="line"><span>  BatchQualityStatus:</span></span>
<span class="line"><span>    PendingInspection=0(待检), Released=1(已放行),</span></span>
<span class="line"><span>    OnHold=2(冻结中), Quarantined=3(隔离中), Rejected=4(已拒绝)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-批次生命周期" tabindex="-1"><a class="header-anchor" href="#_1-2-批次生命周期"><span>1.2 批次生命周期</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>                    ┌─────────────────┐</span></span>
<span class="line"><span>                    │ Created (创建)   │</span></span>
<span class="line"><span>                    │ 入库时自动/手工   │</span></span>
<span class="line"><span>                    └────────┬────────┘</span></span>
<span class="line"><span>                             │</span></span>
<span class="line"><span>                             ▼</span></span>
<span class="line"><span>                    ┌─────────────────┐</span></span>
<span class="line"><span>            ┌──────│ PendingInspect   │──────┐</span></span>
<span class="line"><span>            │      │ (待检)            │      │</span></span>
<span class="line"><span>            │      └─────────────────┘      │</span></span>
<span class="line"><span>            ▼                                ▼</span></span>
<span class="line"><span>   ┌─────────────────┐            ┌─────────────────┐</span></span>
<span class="line"><span>   │ Released (放行)   │            │ Rejected (拒绝)  │</span></span>
<span class="line"><span>   │ 可用于出库        │            │ 退货/报废        │</span></span>
<span class="line"><span>   └────────┬────────┘            └─────────────────┘</span></span>
<span class="line"><span>            │</span></span>
<span class="line"><span>    ┌───────┼───────┐</span></span>
<span class="line"><span>    ▼       ▼       ▼</span></span>
<span class="line"><span> 正常出库  冻结    过期</span></span>
<span class="line"><span>    │       │       │</span></span>
<span class="line"><span>    ▼       ▼       ▼</span></span>
<span class="line"><span> Consumed  OnHold  Expired</span></span>
<span class="line"><span> (耗尽)   (冻结)   (过期)</span></span>
<span class="line"><span>            │</span></span>
<span class="line"><span>            ├──▶ Released (解冻放行)</span></span>
<span class="line"><span>            └──▶ Scrapped (报废)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-3-批次编号规则" tabindex="-1"><a class="header-anchor" href="#_1-3-批次编号规则"><span>1.3 批次编号规则</span></a></h3>`,9),r(`table`,null,[r(`thead`,null,[r(`tr`,null,[r(`th`,null,`生成方式`),r(`th`,null,`格式`),r(`th`,null,`示例`),r(`th`,null,`适用场景`)])]),r(`tbody`,null,[r(`tr`,null,[r(`td`,null,`日期+序号`),r(`td`,{SEQ:``},`{YYYYMMDD}-`),r(`td`,null,`20240115-001`),r(`td`,null,`通用`)]),r(`tr`,null,[r(`td`,null,`供应商+日期`),r(`td`,{YYYYMMDD:``},`{SUP}-`),r(`td`,null,`S001-20240115`),r(`td`,null,`采购件`)]),r(`tr`,null,[r(`td`,null,`工单+序号`),r(`td`,{SEQ:``},`{WO}-`),r(`td`,null,`WO001-01`),r(`td`,null,`自制件`)]),r(`tr`,null,[r(`td`,null,`自定义`),r(`td`,null,`用户输入`),r(`td`,null,`任意`),r(`td`,null,`特殊需求`)])])],-1),t(`<h2 id="二、序列号管理" tabindex="-1"><a class="header-anchor" href="#二、序列号管理"><span>二、序列号管理</span></a></h2><h3 id="_2-1-序列号实体" tabindex="-1"><a class="header-anchor" href="#_2-1-序列号实体"><span>2.1 序列号实体</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>SerialNumber (序列号)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── ItemId: Guid</span></span>
<span class="line"><span>├── ItemCode: string(50)</span></span>
<span class="line"><span>├── ItemName: string(200)</span></span>
<span class="line"><span>├── SerialNo: string(50)              # 序列号 (全局唯一)</span></span>
<span class="line"><span>├── BatchId: Guid?                     # 关联批次</span></span>
<span class="line"><span>├── BatchNo: string(50)?</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── Status: SerialStatus</span></span>
<span class="line"><span>├── CurrentWarehouseId: Guid?</span></span>
<span class="line"><span>├── CurrentLocationId: Guid?</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── ManufactureDate: DateTime?</span></span>
<span class="line"><span>├── WarrantyStartDate: DateTime?       # 质保开始</span></span>
<span class="line"><span>├── WarrantyEndDate: DateTime?         # 质保结束</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── SupplierId: Guid?</span></span>
<span class="line"><span>├── CustomerId: Guid?                  # 最终客户 (出库后)</span></span>
<span class="line"><span>├── SalesOrderId: Guid?               # 销售订单</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── LastTransactionId: Guid?</span></span>
<span class="line"><span>├── LastTransactionDate: DateTime?</span></span>
<span class="line"><span>├── ReceiptOrderId: Guid?             # 入库单</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  SerialStatus:</span></span>
<span class="line"><span>    InStock=1(在库), Issued=2(已出库), InTransit=3(在途),</span></span>
<span class="line"><span>    AtCustomer=4(客户处), Returned=5(已退回),</span></span>
<span class="line"><span>    InRepair=6(维修中), Scrapped=7(已报废)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-序列号生命周期" tabindex="-1"><a class="header-anchor" href="#_2-2-序列号生命周期"><span>2.2 序列号生命周期</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Created → InStock → Issued → AtCustomer</span></span>
<span class="line"><span>                      │           │</span></span>
<span class="line"><span>                      │           ├──▶ Returned → InStock (退货入库)</span></span>
<span class="line"><span>                      │           └──▶ InRepair → AtCustomer (维修后)</span></span>
<span class="line"><span>                      │</span></span>
<span class="line"><span>                      └──▶ InTransit → InStock (调拨接收)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>InStock ──▶ Scrapped (报废)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、保质期管理" tabindex="-1"><a class="header-anchor" href="#三、保质期管理"><span>三、保质期管理</span></a></h2><h3 id="_3-1-保质期规则" tabindex="-1"><a class="header-anchor" href="#_3-1-保质期规则"><span>3.1 保质期规则</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>ShelfLifeRule (保质期规则)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── ItemId: Guid?                      # 物料 (空=按类别)</span></span>
<span class="line"><span>├── ItemCategoryId: Guid?              # 物料类别</span></span>
<span class="line"><span>├── TotalShelfLifeDays: int            # 总保质期 (天)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── InboundMinRemainingPercent: decimal(5,2)  # 入库最低剩余保质期%</span></span>
<span class="line"><span>├── OutboundMinRemainingPercent: decimal(5,2) # 出库最低剩余保质期%</span></span>
<span class="line"><span>├── CustomerMinRemainingPercent: decimal(5,2)? # 客户要求最低剩余%</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── AlertDaysBefore: int               # 过期前N天预警</span></span>
<span class="line"><span>├── AutoQuarantineDaysBefore: int?     # 过期前N天自动隔离</span></span>
<span class="line"><span>├── IsActive: bool</span></span>
<span class="line"><span>└── Remark: string(200)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-保质期校验" tabindex="-1"><a class="header-anchor" href="#_3-2-保质期校验"><span>3.2 保质期校验</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>保质期验证示例:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>物料: 食品原料A</span></span>
<span class="line"><span>  总保质期: 180天</span></span>
<span class="line"><span>  入库最低剩余: 70% (126天)</span></span>
<span class="line"><span>  出库最低剩余: 50% (90天)</span></span>
<span class="line"><span>  预警: 过期前30天</span></span>
<span class="line"><span>  自动隔离: 过期前7天</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  生产日期: 2024-01-01</span></span>
<span class="line"><span>  有效期:   2024-06-29</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  入库校验 (2024-02-15):</span></span>
<span class="line"><span>    剩余保质期 = 135天 / 180天 = 75% ≥ 70% ✅ 允许入库</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  出库校验 (2024-04-01):</span></span>
<span class="line"><span>    剩余保质期 = 89天 / 180天 = 49% &lt; 50% ❌ 禁止出库</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  预警触发 (2024-05-30):</span></span>
<span class="line"><span>    距过期 30天 → 发送预警通知</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  自动隔离 (2024-06-22):</span></span>
<span class="line"><span>    距过期 7天 → 批次自动冻结，移入隔离区</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-fefo-策略" tabindex="-1"><a class="header-anchor" href="#_3-3-fefo-策略"><span>3.3 FEFO 策略</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>FEFO (First Expired First Out) 出库逻辑:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  可用批次:</span></span>
<span class="line"><span>    BAT-A: 过期日 2024-03-15, 库存 50件</span></span>
<span class="line"><span>    BAT-B: 过期日 2024-04-01, 库存 80件</span></span>
<span class="line"><span>    BAT-C: 过期日 2024-05-20, 库存 60件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  出库需求: 100件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  FEFO 分配:</span></span>
<span class="line"><span>    ① BAT-A: 50件 (最先过期)</span></span>
<span class="line"><span>    ② BAT-B: 50件 (次先过期)</span></span>
<span class="line"><span>    合计: 100件 ✅</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  校验: 每个批次出库时检查剩余保质期 ≥ 出库最低要求</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="四、全链路追溯" tabindex="-1"><a class="header-anchor" href="#四、全链路追溯"><span>四、全链路追溯</span></a></h2><h3 id="_4-1-追溯链接" tabindex="-1"><a class="header-anchor" href="#_4-1-追溯链接"><span>4.1 追溯链接</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>TraceabilityLink (追溯链接)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── SourceType: TraceSourceType        # 源类型 (Batch/Serial)</span></span>
<span class="line"><span>├── SourceBatchId: Guid?</span></span>
<span class="line"><span>├── SourceSerialId: Guid?</span></span>
<span class="line"><span>├── SourceBatchNo: string(50)?</span></span>
<span class="line"><span>├── SourceItemId: Guid</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── TargetType: TraceSourceType        # 目标类型</span></span>
<span class="line"><span>├── TargetBatchId: Guid?</span></span>
<span class="line"><span>├── TargetSerialId: Guid?</span></span>
<span class="line"><span>├── TargetBatchNo: string(50)?</span></span>
<span class="line"><span>├── TargetItemId: Guid</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── LinkType: TraceLinkType            # 链接类型</span></span>
<span class="line"><span>├── TransactionId: Guid                # 关联事务</span></span>
<span class="line"><span>├── Quantity: decimal(18,4)           # 关联数量</span></span>
<span class="line"><span>├── LinkDate: DateTime</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  TraceSourceType: Batch=1, Serial=2</span></span>
<span class="line"><span>  TraceLinkType:</span></span>
<span class="line"><span>    MaterialConsumption=1(物料消耗),    # 原材料→生产</span></span>
<span class="line"><span>    ProductionOutput=2(生产产出),       # 生产→产成品</span></span>
<span class="line"><span>    Transfer=3(调拨转移),</span></span>
<span class="line"><span>    Split=4(批次拆分),</span></span>
<span class="line"><span>    Merge=5(批次合并),</span></span>
<span class="line"><span>    Repackage=6(重新包装)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-正向追溯" tabindex="-1"><a class="header-anchor" href="#_4-2-正向追溯"><span>4.2 正向追溯</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>正向追溯: 原材料 → 最终客户</span></span>
<span class="line"><span></span></span>
<span class="line"><span>原材料批次 BAT-RM-001 (供应商S001)</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ├──▶ WO-001 领料 50件 (MaterialConsumption)</span></span>
<span class="line"><span>    │       │</span></span>
<span class="line"><span>    │       └──▶ 产品批次 BAT-FG-001 (ProductionOutput)</span></span>
<span class="line"><span>    │               │</span></span>
<span class="line"><span>    │               ├──▶ SO-001 发货 30件 → 客户 C001</span></span>
<span class="line"><span>    │               └──▶ SO-002 发货 20件 → 客户 C002</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    └──▶ WO-002 领料 30件 (MaterialConsumption)</span></span>
<span class="line"><span>            │</span></span>
<span class="line"><span>            └──▶ 产品批次 BAT-FG-002 (ProductionOutput)</span></span>
<span class="line"><span>                    │</span></span>
<span class="line"><span>                    └──▶ SO-003 发货 30件 → 客户 C003</span></span>
<span class="line"><span></span></span>
<span class="line"><span>追溯结果:</span></span>
<span class="line"><span>  原材料 BAT-RM-001 最终到达:</span></span>
<span class="line"><span>    客户 C001: 产品批次 BAT-FG-001, 30件</span></span>
<span class="line"><span>    客户 C002: 产品批次 BAT-FG-001, 20件</span></span>
<span class="line"><span>    客户 C003: 产品批次 BAT-FG-002, 30件</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-反向追溯" tabindex="-1"><a class="header-anchor" href="#_4-3-反向追溯"><span>4.3 反向追溯</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>反向追溯: 客户投诉 → 原材料来源</span></span>
<span class="line"><span></span></span>
<span class="line"><span>客户 C001 投诉产品质量问题</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ├── 追溯: 发货单 → SO-001</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ├── 追溯: 产品批次 → BAT-FG-001</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ├── 追溯: 生产工单 → WO-001</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ├── 追溯: 领料记录</span></span>
<span class="line"><span>    │   ├── 原材料A: BAT-RM-001 (供应商 S001)</span></span>
<span class="line"><span>    │   ├── 原材料B: BAT-RM-005 (供应商 S002)</span></span>
<span class="line"><span>    │   └── 原材料C: BAT-RM-010 (供应商 S003)</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    └── 追溯结果:</span></span>
<span class="line"><span>        该产品使用了3种原材料的4个批次</span></span>
<span class="line"><span>        需要检查供应商 S001/S002/S003 的对应批次</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="五、召回管理" tabindex="-1"><a class="header-anchor" href="#五、召回管理"><span>五、召回管理</span></a></h2><h3 id="_5-1-召回实体" tabindex="-1"><a class="header-anchor" href="#_5-1-召回实体"><span>5.1 召回实体</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>RecallOrder (召回单)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── RecallNo: string(30)               # 编号 RC-{YYYYMMDD}-{SEQ}</span></span>
<span class="line"><span>├── RecallType: RecallType             # 召回类型</span></span>
<span class="line"><span>├── RiskLevel: RiskLevel               # 风险等级</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── Reason: string(500)                # 召回原因</span></span>
<span class="line"><span>├── AffectedItemId: Guid               # 涉及物料</span></span>
<span class="line"><span>├── AffectedItemCode: string(50)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── RecallScope: RecallScope           # 召回范围</span></span>
<span class="line"><span>├── InitiatedDate: DateTime</span></span>
<span class="line"><span>├── Deadline: DateTime?                # 召回截止日</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── AffectedBatchCount: int            # 涉及批次数</span></span>
<span class="line"><span>├── AffectedQuantity: decimal(18,4)   # 涉及总数量</span></span>
<span class="line"><span>├── RecoveredQuantity: decimal(18,4)  # 已回收数量</span></span>
<span class="line"><span>├── AffectedCustomerCount: int         # 涉及客户数</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── DispositionMethod: DispositionMethod # 处置方式</span></span>
<span class="line"><span>├── Status: RecallStatus</span></span>
<span class="line"><span>├── InitiatedBy: Guid</span></span>
<span class="line"><span>├── ClosedBy: Guid?</span></span>
<span class="line"><span>├── ClosedAt: DateTime?</span></span>
<span class="line"><span>├── Remark: string(500)</span></span>
<span class="line"><span>└── Batches: List&lt;RecallBatch&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RecallBatch (召回批次)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── RecallOrderId: Guid</span></span>
<span class="line"><span>├── BatchId: Guid</span></span>
<span class="line"><span>├── BatchNo: string(50)</span></span>
<span class="line"><span>├── AffectedQuantity: decimal(18,4)</span></span>
<span class="line"><span>├── RecoveredQuantity: decimal(18,4)</span></span>
<span class="line"><span>├── InStockQuantity: decimal(18,4)    # 库内库存</span></span>
<span class="line"><span>├── AtCustomerQuantity: decimal(18,4) # 客户处库存</span></span>
<span class="line"><span>├── Status: RecallBatchStatus</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  RecallType: Voluntary=1(自愿召回), Mandatory=2(强制召回)</span></span>
<span class="line"><span>  RiskLevel: Low=1(低), Medium=2(中), High=3(高), Critical=4(紧急)</span></span>
<span class="line"><span>  RecallScope: AllBatches=1(所有批次), SpecificBatches=2(特定批次),</span></span>
<span class="line"><span>               DateRange=3(日期范围内)</span></span>
<span class="line"><span>  DispositionMethod: ReturnToSupplier=1(退供应商), Rework=2(返工),</span></span>
<span class="line"><span>                     Scrap=3(报废), Destroy=4(销毁)</span></span>
<span class="line"><span>  RecallStatus: Draft=0(草稿), Active=1(执行中), Monitoring=2(监控中),</span></span>
<span class="line"><span>                Completed=3(已完成), Cancelled=4(已取消)</span></span>
<span class="line"><span>  RecallBatchStatus: Identified=1(已识别), Notified=2(已通知),</span></span>
<span class="line"><span>                     Recovering=3(回收中), Recovered=4(已回收),</span></span>
<span class="line"><span>                     Disposed=5(已处置)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-召回流程" tabindex="-1"><a class="header-anchor" href="#_5-2-召回流程"><span>5.2 召回流程</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>① 识别问题</span></span>
<span class="line"><span>   质量异常/客户投诉/监管通知</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>② 反向追溯</span></span>
<span class="line"><span>   确定涉及的批次、数量、客户</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>③ 创建召回单</span></span>
<span class="line"><span>   设定风险等级、召回范围</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>④ 冻结库内库存</span></span>
<span class="line"><span>   涉及批次立即冻结，禁止出库</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>⑤ 通知相关方</span></span>
<span class="line"><span>   通知已发货客户、分销商</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>⑥ 回收跟踪</span></span>
<span class="line"><span>   跟踪客户退回数量</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>⑦ 处置</span></span>
<span class="line"><span>   退供应商/返工/报废/销毁</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>⑧ 关闭召回</span></span>
<span class="line"><span>   确认回收率满足要求</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="六、api-接口设计" tabindex="-1"><a class="header-anchor" href="#六、api-接口设计"><span>六、API 接口设计</span></a></h2><h3 id="_6-1-批次管理" tabindex="-1"><a class="header-anchor" href="#_6-1-批次管理"><span>6.1 批次管理</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/inventory/batches</code></td><td>批次列表</td></tr><tr><td>POST</td><td><code>/api/inventory/batches</code></td><td>创建批次</td></tr><tr><td>GET</td><td><code>/api/inventory/batches/{id}</code></td><td>批次详情</td></tr><tr><td>PUT</td><td><code>/api/inventory/batches/{id}</code></td><td>修改批次</td></tr><tr><td>POST</td><td><code>/api/inventory/batches/{id}/hold</code></td><td>冻结批次</td></tr><tr><td>POST</td><td><code>/api/inventory/batches/{id}/release</code></td><td>解冻批次</td></tr><tr><td>GET</td><td><code>/api/inventory/batches/expiring</code></td><td>即将过期批次</td></tr><tr><td>GET</td><td><code>/api/inventory/batches/expired</code></td><td>已过期批次</td></tr></tbody></table><h3 id="_6-2-序列号管理" tabindex="-1"><a class="header-anchor" href="#_6-2-序列号管理"><span>6.2 序列号管理</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/inventory/serial-numbers</code></td><td>序列号列表</td></tr><tr><td>POST</td><td><code>/api/inventory/serial-numbers</code></td><td>注册序列号</td></tr><tr><td>GET</td><td><code>/api/inventory/serial-numbers/{id}</code></td><td>序列号详情</td></tr><tr><td>GET</td><td><code>/api/inventory/serial-numbers/{serialNo}/history</code></td><td>序列号流转历史</td></tr></tbody></table><h3 id="_6-3-追溯查询" tabindex="-1"><a class="header-anchor" href="#_6-3-追溯查询"><span>6.3 追溯查询</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/inventory/traceability/forward/{batchId}</code></td><td>正向追溯</td></tr><tr><td>GET</td><td><code>/api/inventory/traceability/backward/{batchId}</code></td><td>反向追溯</td></tr><tr><td>GET</td><td><code>/api/inventory/traceability/full-chain/{batchId}</code></td><td>全链路追溯</td></tr><tr><td>GET</td><td><code>/api/inventory/traceability/affected-customers/{batchId}</code></td><td>受影响客户</td></tr></tbody></table><h3 id="_6-4-保质期管理" tabindex="-1"><a class="header-anchor" href="#_6-4-保质期管理"><span>6.4 保质期管理</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/inventory/shelf-life-rules</code></td><td>保质期规则列表</td></tr><tr><td>POST</td><td><code>/api/inventory/shelf-life-rules</code></td><td>创建规则</td></tr><tr><td>PUT</td><td><code>/api/inventory/shelf-life-rules/{id}</code></td><td>修改规则</td></tr><tr><td>GET</td><td><code>/api/inventory/shelf-life-rules/alerts</code></td><td>保质期预警列表</td></tr></tbody></table><h3 id="_6-5-召回管理" tabindex="-1"><a class="header-anchor" href="#_6-5-召回管理"><span>6.5 召回管理</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/inventory/recall-orders</code></td><td>召回单列表</td></tr><tr><td>POST</td><td><code>/api/inventory/recall-orders</code></td><td>创建召回单</td></tr><tr><td>GET</td><td><code>/api/inventory/recall-orders/{id}</code></td><td>召回单详情</td></tr><tr><td>POST</td><td><code>/api/inventory/recall-orders/{id}/activate</code></td><td>启动召回</td></tr><tr><td>POST</td><td><code>/api/inventory/recall-orders/{id}/recover</code></td><td>登记回收</td></tr><tr><td>POST</td><td><code>/api/inventory/recall-orders/{id}/dispose</code></td><td>处置</td></tr><tr><td>POST</td><td><code>/api/inventory/recall-orders/{id}/close</code></td><td>关闭召回</td></tr></tbody></table><h2 id="七、实体关系图" tabindex="-1"><a class="header-anchor" href="#七、实体关系图"><span>七、实体关系图</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────────┐     ┌──────────────┐</span></span>
<span class="line"><span>│    Batch     │◀────│ SerialNumber │</span></span>
<span class="line"><span>│    批次       │ 1:N │ 序列号        │</span></span>
<span class="line"><span>└──────┬───────┘     └──────────────┘</span></span>
<span class="line"><span>       │</span></span>
<span class="line"><span>       │ 源/目标</span></span>
<span class="line"><span>       ▼</span></span>
<span class="line"><span>┌──────────────────┐</span></span>
<span class="line"><span>│TraceabilityLink  │</span></span>
<span class="line"><span>│ 追溯链接          │</span></span>
<span class="line"><span>│ Source ←→ Target │</span></span>
<span class="line"><span>└──────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────────────┐     ┌──────────────┐</span></span>
<span class="line"><span>│ RecallOrder  │────▶│ RecallBatch  │</span></span>
<span class="line"><span>│ 召回单        │ 1:N │ 召回批次      │</span></span>
<span class="line"><span>└──────────────┘     └──────┬───────┘</span></span>
<span class="line"><span>                            │ N:1</span></span>
<span class="line"><span>                            ▼</span></span>
<span class="line"><span>                     ┌──────────────┐</span></span>
<span class="line"><span>                     │    Batch     │</span></span>
<span class="line"><span>                     └──────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────────────┐</span></span>
<span class="line"><span>│ShelfLifeRule │──────▶ 校验 Batch.ExpiryDate</span></span>
<span class="line"><span>│ 保质期规则    │</span></span>
<span class="line"><span>└──────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="八、业务规则" tabindex="-1"><a class="header-anchor" href="#八、业务规则"><span>八、业务规则</span></a></h2><table><thead><tr><th>规则</th><th>描述</th></tr></thead><tbody><tr><td>批次号唯一</td><td>同一物料的批次号在租户内唯一</td></tr><tr><td>序列号全局唯一</td><td>序列号在同一物料下全局唯一</td></tr><tr><td>批次强制</td><td>启用批次管理的物料所有事务必须记录批次</td></tr><tr><td>序列号强制</td><td>启用序列号管理的物料每件必须有唯一序列号</td></tr><tr><td>过期自动冻结</td><td>过期批次自动设为 Blocked 状态</td></tr><tr><td>FEFO 优先</td><td>配置FEFO的物料出库时优先使用最早过期批次</td></tr><tr><td>冻结批次禁出</td><td>冻结状态的批次不可出库</td></tr><tr><td>保质期入库校验</td><td>入库时剩余保质期低于阈值则拒绝入库</td></tr><tr><td>追溯完整性</td><td>每笔物料消耗/产出必须创建追溯链接</td></tr><tr><td>召回即冻结</td><td>创建召回单后涉及批次立即冻结</td></tr><tr><td>回收率跟踪</td><td>召回完成前持续跟踪回收率</td></tr><tr><td>质量状态联动</td><td>质检结果自动更新批次质量状态</td></tr></tbody></table>`,39)]])}var c=i(o,[[`render`,s]]);export{a as _pageData,c as default};