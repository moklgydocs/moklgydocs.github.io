import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as r}from"./app-CyjyvRPH.js";var i=JSON.parse(`{"path":"/%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F/ERP%E4%B8%9A%E5%8A%A1/07-MRP%E6%A8%A1%E5%9D%97/03-%E7%89%A9%E6%96%99%E9%9C%80%E6%B1%82%E8%AE%A1%E5%88%92MRP.html","title":"物料需求计划MRP","lang":"zh-CN","frontmatter":{"title":"物料需求计划MRP","date":"2025-04-18T00:00:00.000Z","author":"Moklgy","category":["ERP业务"],"tag":["ERP","MRP"],"order":3},"git":{"createdTime":1776517348000,"updatedTime":1776517348000,"contributors":[{"name":"moklgy","username":"moklgy","email":"moklgy@foxmail.com","commits":1,"url":"https://github.com/moklgy"}]},"readingTime":{"minutes":4.74,"words":1423},"filePathRelative":"业务系统/ERP业务/07-MRP模块/03-物料需求计划MRP.md"}`),a={name:`03-物料需求计划MRP.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="物料需求计划-mrp-material-requirements-planning" tabindex="-1"><a class="header-anchor" href="#物料需求计划-mrp-material-requirements-planning"><span>物料需求计划 MRP (Material Requirements Planning)</span></a></h1><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p>MRP 运算是 ERP 系统的核心计划引擎。它以 MPS 为输入，通过 BOM 展开计算出所有层级物料的需求数量和时间，扣除现有库存和在途订单后得出净需求，最终生成计划采购订单（外购件）和计划生产工单（自制件）。</p><h2 id="一、mrp-运算流程" tabindex="-1"><a class="header-anchor" href="#一、mrp-运算流程"><span>一、MRP 运算流程</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>        ┌─────────────┐</span></span>
<span class="line"><span>        │ MPS 主生产计划│</span></span>
<span class="line"><span>        │ (成品需求)    │</span></span>
<span class="line"><span>        └──────┬──────┘</span></span>
<span class="line"><span>               │</span></span>
<span class="line"><span>               ▼</span></span>
<span class="line"><span>        ┌─────────────┐     ┌─────────────┐</span></span>
<span class="line"><span>        │ BOM 展开      │────▶│ 毛需求计算   │</span></span>
<span class="line"><span>        │ (多层级展开)  │     │ (各层物料)   │</span></span>
<span class="line"><span>        └─────────────┘     └──────┬──────┘</span></span>
<span class="line"><span>                                   │</span></span>
<span class="line"><span>               ┌───────────────────┤</span></span>
<span class="line"><span>               ▼                   ▼</span></span>
<span class="line"><span>        ┌─────────────┐     ┌─────────────┐</span></span>
<span class="line"><span>        │ 现有库存      │     │ 在途订单     │</span></span>
<span class="line"><span>        │ 安全库存      │     │ (PO/WO)     │</span></span>
<span class="line"><span>        └──────┬──────┘     └──────┬──────┘</span></span>
<span class="line"><span>               │                   │</span></span>
<span class="line"><span>               └────────┬──────────┘</span></span>
<span class="line"><span>                        ▼</span></span>
<span class="line"><span>                 ┌─────────────┐</span></span>
<span class="line"><span>                 │ 净需求计算   │</span></span>
<span class="line"><span>                 │ = 毛需求     │</span></span>
<span class="line"><span>                 │ - 现有库存   │</span></span>
<span class="line"><span>                 │ - 在途       │</span></span>
<span class="line"><span>                 │ + 安全库存   │</span></span>
<span class="line"><span>                 └──────┬──────┘</span></span>
<span class="line"><span>                        │</span></span>
<span class="line"><span>                        ▼</span></span>
<span class="line"><span>                 ┌─────────────┐</span></span>
<span class="line"><span>                 │ 批量计算     │</span></span>
<span class="line"><span>                 │ (按批量规则) │</span></span>
<span class="line"><span>                 └──────┬──────┘</span></span>
<span class="line"><span>                        │</span></span>
<span class="line"><span>                        ▼</span></span>
<span class="line"><span>                 ┌─────────────┐</span></span>
<span class="line"><span>                 │ 提前期偏置   │</span></span>
<span class="line"><span>                 │ (确定开始日) │</span></span>
<span class="line"><span>                 └──────┬──────┘</span></span>
<span class="line"><span>                        │</span></span>
<span class="line"><span>               ┌────────┴────────┐</span></span>
<span class="line"><span>               ▼                 ▼</span></span>
<span class="line"><span>        ┌─────────────┐   ┌─────────────┐</span></span>
<span class="line"><span>        │ 计划采购订单  │   │ 计划生产订单  │</span></span>
<span class="line"><span>        │ (外购件)     │   │ (自制件)     │</span></span>
<span class="line"><span>        └─────────────┘   └─────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、mrp-运算逻辑" tabindex="-1"><a class="header-anchor" href="#二、mrp-运算逻辑"><span>二、MRP 运算逻辑</span></a></h2><h3 id="_2-1-净需求计算" tabindex="-1"><a class="header-anchor" href="#_2-1-净需求计算"><span>2.1 净需求计算</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>净需求 = 毛需求 - 预计可用库存 - 计划接收量 + 安全库存</span></span>
<span class="line"><span></span></span>
<span class="line"><span>其中:</span></span>
<span class="line"><span>  毛需求 = 独立需求(MPS) + 相关需求(上级BOM展开)</span></span>
<span class="line"><span>  预计可用库存 = 期初库存 + 在途订单</span></span>
<span class="line"><span>  计划接收量 = 已确认但未到的PO/WO</span></span>
<span class="line"><span>  安全库存 = 需要保持的最低库存水平</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-bom-展开-多层级" tabindex="-1"><a class="header-anchor" href="#_2-2-bom-展开-多层级"><span>2.2 BOM 展开（多层级）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>MRP 从顶层（成品）开始，逐层展开 BOM:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Level 0: 成品 A (MPS需求: 100件)</span></span>
<span class="line"><span>  │</span></span>
<span class="line"><span>  ├── BOM展开</span></span>
<span class="line"><span>  │</span></span>
<span class="line"><span>Level 1: 组件 B × 2 = 200件 (毛需求)</span></span>
<span class="line"><span>          组件 C × 1 = 100件 (毛需求)</span></span>
<span class="line"><span>          材料 H × 5 = 500件 (毛需求)</span></span>
<span class="line"><span>  │</span></span>
<span class="line"><span>  ├── BOM展开 (组件B自身有BOM)</span></span>
<span class="line"><span>  │</span></span>
<span class="line"><span>Level 2: 材料 D × 3 × 200 = 600件</span></span>
<span class="line"><span>          材料 E × 1 × 200 = 200件</span></span>
<span class="line"><span>          材料 F × 2 × 100 = 200件</span></span>
<span class="line"><span>          外购件 G × 1 × 100 = 100件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>低层码 (Low Level Code):</span></span>
<span class="line"><span>  材料D出现在多个BOM中时，取最低层级编码</span></span>
<span class="line"><span>  确保MRP从低向高逐层处理，避免重复计算</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-提前期偏置" tabindex="-1"><a class="header-anchor" href="#_2-3-提前期偏置"><span>2.3 提前期偏置</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>计划完成日 = 需求日期</span></span>
<span class="line"><span>计划开始日 = 需求日期 - 提前期</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例: 成品A需求日 1月20日</span></span>
<span class="line"><span>  成品A 提前期5天 → 开始1月15日</span></span>
<span class="line"><span>    组件B 提前期3天 → 需求日1月15日 → 开始1月12日</span></span>
<span class="line"><span>      材料D 提前期7天(采购) → 需求日1月12日 → 采购日1月5日</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、核心实体" tabindex="-1"><a class="header-anchor" href="#三、核心实体"><span>三、核心实体</span></a></h2><h3 id="_3-1-mrp-运算" tabindex="-1"><a class="header-anchor" href="#_3-1-mrp-运算"><span>3.1 MRP 运算</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>MRPRun (MRP运算批次)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── RunNo: string(30)                  # 运算批次号</span></span>
<span class="line"><span>├── RunDate: DateTime                  # 运算日期</span></span>
<span class="line"><span>├── PlanHorizon: int                   # 计划周期（天）</span></span>
<span class="line"><span>├── StartDate: DateTime                # 计划起始日</span></span>
<span class="line"><span>├── EndDate: DateTime                  # 计划终止日</span></span>
<span class="line"><span>├── MPSId: Guid?                       # 关联 MPS</span></span>
<span class="line"><span>├── Scope: MRPScope                    # 运算范围</span></span>
<span class="line"><span>├── Status: MRPRunStatus</span></span>
<span class="line"><span>├── ItemCount: int                     # 涉及物料数</span></span>
<span class="line"><span>├── PlannedOrderCount: int             # 生成计划订单数</span></span>
<span class="line"><span>├── RunDurationMs: long                # 运算耗时(ms)</span></span>
<span class="line"><span>├── RunBy: Guid</span></span>
<span class="line"><span>└── Results: List&lt;MRPResult&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>MRPResult (MRP运算结果/计划订单)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── RunId: Guid</span></span>
<span class="line"><span>├── ItemId: Guid                       # 物料ID</span></span>
<span class="line"><span>├── ItemCode: string(50)</span></span>
<span class="line"><span>├── ItemName: string(200)</span></span>
<span class="line"><span>├── SupplyType: SupplyType             # 供应方式 (Make/Buy)</span></span>
<span class="line"><span>├── OrderType: PlannedOrderType        # 订单类型</span></span>
<span class="line"><span>├── RequiredDate: DateTime             # 需求日期</span></span>
<span class="line"><span>├── StartDate: DateTime                # 计划开始日</span></span>
<span class="line"><span>├── GrossRequirement: decimal(18,4)   # 毛需求</span></span>
<span class="line"><span>├── OnHand: decimal(18,4)            # 现有库存</span></span>
<span class="line"><span>├── InTransit: decimal(18,4)         # 在途数量</span></span>
<span class="line"><span>├── NetRequirement: decimal(18,4)    # 净需求</span></span>
<span class="line"><span>├── PlannedQuantity: decimal(18,4)   # 计划订单数量</span></span>
<span class="line"><span>├── UnitOfMeasure: string(20)</span></span>
<span class="line"><span>├── SupplierId: Guid?                  # 建议供应商 (外购件)</span></span>
<span class="line"><span>├── WarehouseId: Guid?                 # 仓库</span></span>
<span class="line"><span>├── ParentItemId: Guid?                # 上级物料 (需求来源)</span></span>
<span class="line"><span>├── ParentOrderNo: string(50)?</span></span>
<span class="line"><span>├── BOMLevel: int                      # BOM 层级</span></span>
<span class="line"><span>├── IsConfirmed: bool                  # 是否已确认</span></span>
<span class="line"><span>├── ConvertedDocumentId: Guid?         # 转换后的PR/WO ID</span></span>
<span class="line"><span>├── ConvertedDocumentNo: string(50)?</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  MRPScope: All=1(全部), ByProduct=2(按产品), BySupplier=3(按供应商)</span></span>
<span class="line"><span>  MRPRunStatus: Running=0, Completed=1, Failed=-1</span></span>
<span class="line"><span>  PlannedOrderType: PlannedPurchase=1(计划采购), PlannedProduction=2(计划生产)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-物料计划参数" tabindex="-1"><a class="header-anchor" href="#_3-2-物料计划参数"><span>3.2 物料计划参数</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>ItemPlanningParameter (物料计划参数)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── ItemId: Guid</span></span>
<span class="line"><span>├── SupplyType: SupplyType             # Make/Buy</span></span>
<span class="line"><span>├── LeadTimeDays: int                  # 提前期（天）</span></span>
<span class="line"><span>├── SafetyStock: decimal(18,4)        # 安全库存</span></span>
<span class="line"><span>├── ReorderPoint: decimal(18,4)       # 再订货点</span></span>
<span class="line"><span>├── LotSizeRule: LotSizeRule</span></span>
<span class="line"><span>├── FixedLotSize: decimal(18,4)?</span></span>
<span class="line"><span>├── MinOrderQuantity: decimal(18,4)?  # 最小订购量</span></span>
<span class="line"><span>├── MaxOrderQuantity: decimal(18,4)?  # 最大订购量</span></span>
<span class="line"><span>├── OrderMultiple: decimal(18,4)?     # 订购倍数</span></span>
<span class="line"><span>├── PreferredSupplierId: Guid?         # 首选供应商</span></span>
<span class="line"><span>├── DefaultWarehouseId: Guid?          # 默认仓库</span></span>
<span class="line"><span>├── PlanningMethod: PlanningMethod     # 计划方法</span></span>
<span class="line"><span>└── ScrapRate: decimal(5,2)?          # 计划损耗率</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  PlanningMethod: MRP=1, ReorderPoint=2(再订货点), Manual=3(手工)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="四、mrp-运算示例" tabindex="-1"><a class="header-anchor" href="#四、mrp-运算示例"><span>四、MRP 运算示例</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>物料B, 外购件, 提前期7天, 安全库存20, 固定批量50</span></span>
<span class="line"><span></span></span>
<span class="line"><span>日期        1/5    1/12   1/19   1/26   2/2</span></span>
<span class="line"><span>──────────────────────────────────────────────</span></span>
<span class="line"><span>毛需求       -      30     45     35     40</span></span>
<span class="line"><span>计划接收     -       -      -      -      -</span></span>
<span class="line"><span>期初库存    60</span></span>
<span class="line"><span>预计库存    60      30    -15    -50    -90</span></span>
<span class="line"><span>净需求       -       -     35     35     40</span></span>
<span class="line"><span>计划订单量   -       -     50     50     50</span></span>
<span class="line"><span>                     ▲     ▲      ▲</span></span>
<span class="line"><span>计划下达日  1/5    1/12   1/12   1/19</span></span>
<span class="line"><span></span></span>
<span class="line"><span>计算过程:</span></span>
<span class="line"><span>  1/5:  库存60, 无需求</span></span>
<span class="line"><span>  1/12: 60-30=30, &gt;安全库存20 → 无需订购</span></span>
<span class="line"><span>  1/19: 30-45=-15, &lt;安全库存 → 净需求=15+20=35 → 批量50</span></span>
<span class="line"><span>  1/26: (30+50)-45-35=0, &lt;安全库存 → 净需求=20+35=55 → 批量50</span></span>
<span class="line"><span>  ...</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="五、api-接口设计" tabindex="-1"><a class="header-anchor" href="#五、api-接口设计"><span>五、API 接口设计</span></a></h2><h3 id="_5-1-mrp-运算" tabindex="-1"><a class="header-anchor" href="#_5-1-mrp-运算"><span>5.1 MRP 运算</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>POST</td><td><code>/api/mrp/runs</code></td><td>执行 MRP 运算</td></tr><tr><td>GET</td><td><code>/api/mrp/runs</code></td><td>运算历史</td></tr><tr><td>GET</td><td><code>/api/mrp/runs/{id}</code></td><td>运算结果详情</td></tr><tr><td>GET</td><td><code>/api/mrp/runs/{id}/results</code></td><td>计划订单列表</td></tr></tbody></table><h3 id="_5-2-计划订单" tabindex="-1"><a class="header-anchor" href="#_5-2-计划订单"><span>5.2 计划订单</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/mrp/planned-orders</code></td><td>计划订单列表</td></tr><tr><td>PUT</td><td><code>/api/mrp/planned-orders/{id}</code></td><td>修改计划订单</td></tr><tr><td>POST</td><td><code>/api/mrp/planned-orders/{id}/confirm</code></td><td>确认计划订单</td></tr><tr><td>POST</td><td><code>/api/mrp/planned-orders/batch-confirm</code></td><td>批量确认</td></tr><tr><td>POST</td><td><code>/api/mrp/planned-orders/{id}/convert</code></td><td>转为 PR/WO</td></tr><tr><td>POST</td><td><code>/api/mrp/planned-orders/batch-convert</code></td><td>批量转换</td></tr><tr><td>DELETE</td><td><code>/api/mrp/planned-orders/{id}</code></td><td>删除计划订单</td></tr></tbody></table><h3 id="_5-3-计划参数" tabindex="-1"><a class="header-anchor" href="#_5-3-计划参数"><span>5.3 计划参数</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/mrp/planning-parameters</code></td><td>参数列表</td></tr><tr><td>GET</td><td><code>/api/mrp/planning-parameters/{itemId}</code></td><td>物料参数</td></tr><tr><td>PUT</td><td><code>/api/mrp/planning-parameters/{itemId}</code></td><td>更新参数</td></tr></tbody></table><h2 id="六、业务规则" tabindex="-1"><a class="header-anchor" href="#六、业务规则"><span>六、业务规则</span></a></h2><table><thead><tr><th>规则</th><th>描述</th></tr></thead><tbody><tr><td>BOM 完整</td><td>MRP 运算前所有自制件必须有有效 BOM</td></tr><tr><td>参数完整</td><td>所有物料的提前期、批量规则等参数必须配置</td></tr><tr><td>低层码优先</td><td>从最低层级开始向上计算，避免重复</td></tr><tr><td>净需求≥0</td><td>净需求不可为负</td></tr><tr><td>提前期验证</td><td>计划开始日不可早于当天</td></tr><tr><td>批量约束</td><td>计划数量必须满足最小量/倍数约束</td></tr><tr><td>安全库存保障</td><td>预计库存不得低于安全库存</td></tr><tr><td>确认后不可删</td><td>已确认的计划订单不可删除，只能取消</td></tr></tbody></table>`,28)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};