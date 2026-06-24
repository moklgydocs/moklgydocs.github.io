import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as r}from"./app-SUir7cUu.js";var i=JSON.parse(`{"path":"/%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F/ERP%E4%B8%9A%E5%8A%A1/05-%E5%BA%93%E5%AD%98%E6%A8%A1%E5%9D%97/05-%E5%BA%93%E5%AD%98%E6%A0%B8%E7%AE%97%E4%B8%8E%E8%AE%A1%E9%87%8F.html","title":"库存核算与计量","lang":"zh-CN","frontmatter":{"title":"库存核算与计量","date":"2025-04-18T00:00:00.000Z","author":"Moklgy","category":["ERP业务"],"tag":["ERP","库存"],"order":5},"git":{"createdTime":1776517348000,"updatedTime":1776517348000,"contributors":[{"name":"moklgy","username":"moklgy","email":"moklgy@foxmail.com","commits":1,"url":"https://github.com/moklgy"}]},"readingTime":{"minutes":9.28,"words":2785},"filePathRelative":"业务系统/ERP业务/05-库存模块/05-库存核算与计量.md"}`),a={name:`05-库存核算与计量.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="库存核算与计量" tabindex="-1"><a class="header-anchor" href="#库存核算与计量"><span>库存核算与计量</span></a></h1><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p>库存核算与计量是库存管理与财务管理的桥梁，负责存货的计价、成本计算、到岸成本分摊、计量单位换算以及物料分类等。系统支持五种主流存货计价方法，提供成本层管理、到岸成本分摊和库存重估功能，确保库存价值的准确核算。</p><h2 id="一、存货计价方法" tabindex="-1"><a class="header-anchor" href="#一、存货计价方法"><span>一、存货计价方法</span></a></h2><h3 id="_1-1-方法对比" tabindex="-1"><a class="header-anchor" href="#_1-1-方法对比"><span>1.1 方法对比</span></a></h3><table><thead><tr><th>计价方法</th><th>英文</th><th>计算原理</th><th>适用场景</th><th>优缺点</th></tr></thead><tbody><tr><td>加权平均</td><td>Weighted Average</td><td>期末统一计算平均成本</td><td>品种少、波动小</td><td>简单但月中无法准确计成本</td></tr><tr><td>移动加权平均</td><td>Moving Average</td><td>每次入库重新计算</td><td>实时性要求高</td><td>精确但计算频繁</td></tr><tr><td>先进先出</td><td>FIFO</td><td>按入库顺序消耗成本</td><td>有保质期、标准选择</td><td>符合实物流，计算复杂</td></tr><tr><td>个别计价</td><td>Specific Identification</td><td>按具体批次/序列号计价</td><td>高价值、可识别物料</td><td>最精确但管理成本高</td></tr><tr><td>标准成本</td><td>Standard Cost</td><td>按预设标准成本出入库</td><td>制造业、成本控制</td><td>利于分析但需维护标准</td></tr></tbody></table><h3 id="_1-2-加权平均法" tabindex="-1"><a class="header-anchor" href="#_1-2-加权平均法"><span>1.2 加权平均法</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>月末加权平均单位成本 = (期初库存金额 + 本期入库总金额) / (期初库存数量 + 本期入库总数量)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例:</span></span>
<span class="line"><span>  期初: 100件 × ¥10.00 = ¥1,000.00</span></span>
<span class="line"><span>  1/5  入库: 200件 × ¥11.00 = ¥2,200.00</span></span>
<span class="line"><span>  1/15 入库: 150件 × ¥10.50 = ¥1,575.00</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  加权平均单价 = (1,000 + 2,200 + 1,575) / (100 + 200 + 150) = ¥10.61</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  本月出库 300件:</span></span>
<span class="line"><span>  出库成本 = 300 × ¥10.61 = ¥3,183.33</span></span>
<span class="line"><span>  期末库存 = 150件 × ¥10.61 = ¥1,591.67</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-3-移动加权平均法" tabindex="-1"><a class="header-anchor" href="#_1-3-移动加权平均法"><span>1.3 移动加权平均法</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>每次入库后重新计算单价:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>期初: 100件 × ¥10.00 = ¥1,000.00                单价 = ¥10.00</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1/5 入库 200件 × ¥11.00:</span></span>
<span class="line"><span>  新单价 = (1,000 + 2,200) / (100 + 200) = ¥10.67</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1/10 出库 150件:</span></span>
<span class="line"><span>  出库成本 = 150 × ¥10.67 = ¥1,600.00</span></span>
<span class="line"><span>  剩余: 150件 × ¥10.67 = ¥1,600.00</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1/15 入库 150件 × ¥10.50:</span></span>
<span class="line"><span>  新单价 = (1,600 + 1,575) / (150 + 150) = ¥10.58</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>期末: 300件 × ¥10.58 = ¥3,175.00</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-4-先进先出法-fifo" tabindex="-1"><a class="header-anchor" href="#_1-4-先进先出法-fifo"><span>1.4 先进先出法 (FIFO)</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>成本层按入库顺序排列，出库时从最早的成本层开始消耗:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>成本层:</span></span>
<span class="line"><span>  层1: 1/1  入库 100件 × ¥10.00 = ¥1,000</span></span>
<span class="line"><span>  层2: 1/5  入库 200件 × ¥11.00 = ¥2,200</span></span>
<span class="line"><span>  层3: 1/15 入库 150件 × ¥10.50 = ¥1,575</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1/10 出库 250件:</span></span>
<span class="line"><span>  消耗层1: 100件 × ¥10.00 = ¥1,000 (层1耗尽)</span></span>
<span class="line"><span>  消耗层2: 150件 × ¥11.00 = ¥1,650 (层2剩余50件)</span></span>
<span class="line"><span>  出库成本合计 = ¥2,650</span></span>
<span class="line"><span></span></span>
<span class="line"><span>剩余成本层:</span></span>
<span class="line"><span>  层2: 50件 × ¥11.00 = ¥550</span></span>
<span class="line"><span>  层3: 150件 × ¥10.50 = ¥1,575</span></span>
<span class="line"><span>  期末库存 = ¥2,125</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-5-标准成本法" tabindex="-1"><a class="header-anchor" href="#_1-5-标准成本法"><span>1.5 标准成本法</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>标准成本入库/出库:</span></span>
<span class="line"><span>  入库: 按标准成本入账，差异计入采购价格差异</span></span>
<span class="line"><span>  出库: 按标准成本出账</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例: 物料A 标准成本 ¥10.00</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  采购入库 100件 × 实际 ¥10.50:</span></span>
<span class="line"><span>    借: 原材料           1,000  (100 × ¥10.00 标准)</span></span>
<span class="line"><span>    借: 采购价格差异        50  (100 × ¥0.50 差异)</span></span>
<span class="line"><span>      贷: 应付账款         1,050</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  生产领料 80件:</span></span>
<span class="line"><span>    借: 生产成本           800  (80 × ¥10.00 标准)</span></span>
<span class="line"><span>      贷: 原材料            800</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、核心实体" tabindex="-1"><a class="header-anchor" href="#二、核心实体"><span>二、核心实体</span></a></h2><h3 id="_2-1-库存估值" tabindex="-1"><a class="header-anchor" href="#_2-1-库存估值"><span>2.1 库存估值</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>InventoryValuation (库存估值)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── ItemId: Guid</span></span>
<span class="line"><span>├── ItemCode: string(50)</span></span>
<span class="line"><span>├── ItemName: string(200)</span></span>
<span class="line"><span>├── WarehouseId: Guid</span></span>
<span class="line"><span>├── FiscalPeriodId: Guid               # 会计期间</span></span>
<span class="line"><span>├── FiscalYear: int</span></span>
<span class="line"><span>├── FiscalMonth: int</span></span>
<span class="line"><span>├── ValuationMethod: ValuationMethod</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── OpeningQuantity: decimal(18,4)    # 期初数量</span></span>
<span class="line"><span>├── OpeningAmount: decimal(18,2)      # 期初金额</span></span>
<span class="line"><span>├── ReceiptQuantity: decimal(18,4)    # 入库数量</span></span>
<span class="line"><span>├── ReceiptAmount: decimal(18,2)      # 入库金额</span></span>
<span class="line"><span>├── IssueQuantity: decimal(18,4)      # 出库数量</span></span>
<span class="line"><span>├── IssueAmount: decimal(18,2)        # 出库金额</span></span>
<span class="line"><span>├── AdjustmentQuantity: decimal(18,4) # 调整数量</span></span>
<span class="line"><span>├── AdjustmentAmount: decimal(18,2)   # 调整金额</span></span>
<span class="line"><span>├── ClosingQuantity: decimal(18,4)    # 期末数量</span></span>
<span class="line"><span>├── ClosingAmount: decimal(18,2)      # 期末金额</span></span>
<span class="line"><span>├── UnitCost: decimal(18,6)           # 期末单位成本</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── Status: ValuationStatus</span></span>
<span class="line"><span>├── ClosedBy: Guid?</span></span>
<span class="line"><span>├── ClosedAt: DateTime?</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  ValuationMethod:</span></span>
<span class="line"><span>    WeightedAverage=1(加权平均), MovingAverage=2(移动加权平均),</span></span>
<span class="line"><span>    FIFO=3(先进先出), SpecificIdentification=4(个别计价),</span></span>
<span class="line"><span>    StandardCost=5(标准成本)</span></span>
<span class="line"><span>  ValuationStatus:</span></span>
<span class="line"><span>    Open=1(未结), Calculating=2(计算中), Closed=3(已结)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-成本层" tabindex="-1"><a class="header-anchor" href="#_2-2-成本层"><span>2.2 成本层</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>CostLayer (成本层)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── ItemId: Guid</span></span>
<span class="line"><span>├── ItemCode: string(50)</span></span>
<span class="line"><span>├── WarehouseId: Guid</span></span>
<span class="line"><span>├── BatchNo: string(50)?              # 批次 (FIFO/个别计价)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── ReceiptDate: DateTime              # 入库日期</span></span>
<span class="line"><span>├── SourceTransactionId: Guid          # 来源事务ID</span></span>
<span class="line"><span>├── SourceDocumentNo: string(50)?</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── InitialQuantity: decimal(18,4)    # 初始数量</span></span>
<span class="line"><span>├── RemainingQuantity: decimal(18,4)  # 剩余数量</span></span>
<span class="line"><span>├── UnitCost: decimal(18,6)           # 单位成本</span></span>
<span class="line"><span>├── TotalCost: decimal(18,2)          # 总成本</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── IsConsumed: bool                   # 是否已耗尽</span></span>
<span class="line"><span>├── ConsumedDate: DateTime?</span></span>
<span class="line"><span>└── CreatedAt: DateTime</span></span>
<span class="line"><span></span></span>
<span class="line"><span>验证: RemainingQuantity &gt;= 0</span></span>
<span class="line"><span>索引: ItemId + WarehouseId + ReceiptDate (FIFO 消耗顺序)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-到岸成本" tabindex="-1"><a class="header-anchor" href="#_2-3-到岸成本"><span>2.3 到岸成本</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>LandedCost (到岸成本)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── LandedCostNo: string(30)           # 编号 LC-{YYYYMMDD}-{SEQ}</span></span>
<span class="line"><span>├── ReceiptOrderId: Guid               # 关联入库单</span></span>
<span class="line"><span>├── ReceiptOrderNo: string(30)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── TotalAdditionalCost: decimal(18,2) # 附加成本总额</span></span>
<span class="line"><span>├── Status: LandedCostStatus</span></span>
<span class="line"><span>├── CreatedBy: Guid</span></span>
<span class="line"><span>├── ApprovedBy: Guid?</span></span>
<span class="line"><span>├── VoucherId: Guid?</span></span>
<span class="line"><span>├── Remark: string(500)</span></span>
<span class="line"><span>└── Lines: List&lt;LandedCostLine&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LandedCostLine (到岸成本行)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── LandedCostId: Guid</span></span>
<span class="line"><span>├── CostType: LandedCostType           # 成本类型</span></span>
<span class="line"><span>├── Description: string(200)</span></span>
<span class="line"><span>├── Amount: decimal(18,2)             # 金额</span></span>
<span class="line"><span>├── AllocationMethod: CostAllocationMethod  # 分摊方式</span></span>
<span class="line"><span>├── SupplierId: Guid?                  # 费用供应商</span></span>
<span class="line"><span>├── InvoiceNo: string(50)?            # 费用发票号</span></span>
<span class="line"><span>└── Allocations: List&lt;LandedCostAllocation&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LandedCostAllocation (到岸成本分摊明细)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── LandedCostLineId: Guid</span></span>
<span class="line"><span>├── ReceiptLineId: Guid                # 入库单行</span></span>
<span class="line"><span>├── ItemId: Guid</span></span>
<span class="line"><span>├── Quantity: decimal(18,4)</span></span>
<span class="line"><span>├── AllocationBase: decimal(18,4)     # 分摊基数 (数量/重量/体积/金额)</span></span>
<span class="line"><span>├── AllocationRatio: decimal(10,6)    # 分摊比例</span></span>
<span class="line"><span>├── AllocatedAmount: decimal(18,2)    # 分摊金额</span></span>
<span class="line"><span>└── NewUnitCost: decimal(18,6)        # 分摊后新单价</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  LandedCostType:</span></span>
<span class="line"><span>    Freight=1(运费), CustomsDuty=2(关税), Insurance=3(保险),</span></span>
<span class="line"><span>    Handling=4(装卸费), Inspection=5(检验费), Other=9(其他)</span></span>
<span class="line"><span>  CostAllocationMethod:</span></span>
<span class="line"><span>    ByQuantity=1(按数量), ByWeight=2(按重量),</span></span>
<span class="line"><span>    ByVolume=3(按体积), ByValue=4(按金额)</span></span>
<span class="line"><span>  LandedCostStatus:</span></span>
<span class="line"><span>    Draft=0(草稿), Calculated=1(已计算), Approved=2(已审批),</span></span>
<span class="line"><span>    Posted=3(已过账), Cancelled=4(已取消)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-4-库存重估" tabindex="-1"><a class="header-anchor" href="#_2-4-库存重估"><span>2.4 库存重估</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>InventoryRevaluation (库存重估)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── RevaluationNo: string(30)          # 编号 RV-{YYYYMMDD}-{SEQ}</span></span>
<span class="line"><span>├── RevaluationDate: DateTime</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── ItemId: Guid</span></span>
<span class="line"><span>├── ItemCode: string(50)</span></span>
<span class="line"><span>├── ItemName: string(200)</span></span>
<span class="line"><span>├── WarehouseId: Guid</span></span>
<span class="line"><span>├── BatchNo: string(50)?</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── Quantity: decimal(18,4)           # 重估数量</span></span>
<span class="line"><span>├── OldUnitCost: decimal(18,6)       # 原单位成本</span></span>
<span class="line"><span>├── NewUnitCost: decimal(18,6)       # 新单位成本</span></span>
<span class="line"><span>├── DifferenceAmount: decimal(18,2)  # 差异金额</span></span>
<span class="line"><span>├── Reason: RevaluationReason          # 重估原因</span></span>
<span class="line"><span>├── ReasonDescription: string(500)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── Status: RevaluationStatus</span></span>
<span class="line"><span>├── CreatedBy: Guid</span></span>
<span class="line"><span>├── ApprovedBy: Guid?</span></span>
<span class="line"><span>├── ApprovedAt: DateTime?</span></span>
<span class="line"><span>├── VoucherId: Guid?</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  RevaluationReason:</span></span>
<span class="line"><span>    MarketPriceChange=1(市价变动), CostCorrection=2(成本纠正),</span></span>
<span class="line"><span>    StandardCostUpdate=3(标准成本更新), Impairment=4(减值),</span></span>
<span class="line"><span>    Other=9(其他)</span></span>
<span class="line"><span>  RevaluationStatus:</span></span>
<span class="line"><span>    Draft=0(草稿), PendingApproval=1(待审批),</span></span>
<span class="line"><span>    Approved=2(已审批), Posted=3(已过账), Rejected=4(已驳回)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、多计量单位" tabindex="-1"><a class="header-anchor" href="#三、多计量单位"><span>三、多计量单位</span></a></h2><h3 id="_3-1-uom-换算" tabindex="-1"><a class="header-anchor" href="#_3-1-uom-换算"><span>3.1 UOM 换算</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>UnitOfMeasureConversion (计量单位换算)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── ItemId: Guid?                      # 物料 (空=全局换算)</span></span>
<span class="line"><span>├── UOMGroupId: Guid?                  # UOM组</span></span>
<span class="line"><span>├── FromUOM: string(20)               # 源单位</span></span>
<span class="line"><span>├── ToUOM: string(20)                 # 目标单位</span></span>
<span class="line"><span>├── ConversionFactor: decimal(18,8)   # 换算系数</span></span>
<span class="line"><span>├── IsBaseConversion: bool             # 是否基准换算</span></span>
<span class="line"><span>└── IsActive: bool</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-多-uom-场景" tabindex="-1"><a class="header-anchor" href="#_3-2-多-uom-场景"><span>3.2 多 UOM 场景</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>物料: 钢管 (基本单位: 根)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>采购单位: 吨    1吨 = 200根</span></span>
<span class="line"><span>库存单位: 根    (基本单位)</span></span>
<span class="line"><span>销售单位: 米    1根 = 6米</span></span>
<span class="line"><span></span></span>
<span class="line"><span>采购入库:</span></span>
<span class="line"><span>  PO: 2吨 → 库存: 400根 (× 换算系数 200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>销售出库:</span></span>
<span class="line"><span>  SO: 1200米 → 库存: 200根 (÷ 换算系数 6)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>UOM 组配置:</span></span>
<span class="line"><span>  ┌────────┬────────┬───────────┐</span></span>
<span class="line"><span>  │ FromUOM│ ToUOM  │ Factor    │</span></span>
<span class="line"><span>  ├────────┼────────┼───────────┤</span></span>
<span class="line"><span>  │ 吨     │ 根     │ 200.000   │</span></span>
<span class="line"><span>  │ 根     │ 米     │ 6.000     │</span></span>
<span class="line"><span>  │ 吨     │ 米     │ 1200.000  │</span></span>
<span class="line"><span>  └────────┴────────┴───────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="四、abc-xyz-分类" tabindex="-1"><a class="header-anchor" href="#四、abc-xyz-分类"><span>四、ABC/XYZ 分类</span></a></h2><h3 id="_4-1-分类实体" tabindex="-1"><a class="header-anchor" href="#_4-1-分类实体"><span>4.1 分类实体</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>ItemClassification (物料分类)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── ItemId: Guid</span></span>
<span class="line"><span>├── ItemCode: string(50)</span></span>
<span class="line"><span>├── ItemName: string(200)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── ABCClass: string(1)               # A/B/C</span></span>
<span class="line"><span>├── XYZClass: string(1)               # X/Y/Z</span></span>
<span class="line"><span>├── CombinedClass: string(2)          # AX/AY/AZ/BX/...</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── AnnualConsumptionValue: decimal(18,2)   # 年消耗金额</span></span>
<span class="line"><span>├── AnnualConsumptionQuantity: decimal(18,4)</span></span>
<span class="line"><span>├── AverageDemand: decimal(18,4)      # 平均需求</span></span>
<span class="line"><span>├── DemandStandardDeviation: decimal(18,4)  # 需求标准差</span></span>
<span class="line"><span>├── CoefficientOfVariation: decimal(8,4)    # 变异系数</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── ClassificationDate: DateTime</span></span>
<span class="line"><span>├── ValidUntil: DateTime               # 有效至</span></span>
<span class="line"><span>└── ClassifiedBy: string(20)           # 分类方法 (Auto/Manual)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-abc-分类标准" tabindex="-1"><a class="header-anchor" href="#_4-2-abc-分类标准"><span>4.2 ABC 分类标准</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>ABC 分类 (按年消耗金额，帕累托原则):</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  类别   物料占比   金额占比   管理策略</span></span>
<span class="line"><span>  ───────────────────────────────────────</span></span>
<span class="line"><span>  A       ~20%      ~80%     精细管理、低安全库存、频繁盘点</span></span>
<span class="line"><span>  B       ~30%      ~15%     常规管理、适中安全库存</span></span>
<span class="line"><span>  C       ~50%      ~5%      简化管理、较高安全库存、年度盘点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>XYZ 分类 (按需求变异系数 CV):</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  类别   CV范围     需求特征        预测难度</span></span>
<span class="line"><span>  ───────────────────────────────────────</span></span>
<span class="line"><span>  X      CV &lt; 0.5   稳定需求         易预测</span></span>
<span class="line"><span>  Y      0.5≤CV&lt;1   波动需求         中等</span></span>
<span class="line"><span>  Z      CV ≥ 1     不规则/偶发需求   难预测</span></span>
<span class="line"><span></span></span>
<span class="line"><span>组合矩阵:</span></span>
<span class="line"><span>         │   X (稳定)   │   Y (波动)    │   Z (偶发)</span></span>
<span class="line"><span>  ───────┼──────────────┼───────────────┼───────────</span></span>
<span class="line"><span>  A (高) │ AX: JIT供应  │ AY: 安全库存  │ AZ: 按订单采购</span></span>
<span class="line"><span>  B (中) │ BX: 定期补货 │ BY: 弹性采购  │ BZ: 控制库存</span></span>
<span class="line"><span>  C (低) │ CX: 批量采购 │ CY: 简化管理  │ CZ: 考虑淘汰</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="五、到岸成本分摊" tabindex="-1"><a class="header-anchor" href="#五、到岸成本分摊"><span>五、到岸成本分摊</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>到岸成本分摊流程:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>① 入库单 RO-001 包含3种物料:</span></span>
<span class="line"><span>   物料A: 100件, 单价¥10, 金额¥1,000, 重量500kg</span></span>
<span class="line"><span>   物料B: 200件, 单价¥5,  金额¥1,000, 重量200kg</span></span>
<span class="line"><span>   物料C: 50件,  单价¥20, 金额¥1,000, 重量300kg</span></span>
<span class="line"><span></span></span>
<span class="line"><span>② 发生附加费用:</span></span>
<span class="line"><span>   运费: ¥600 (按重量分摊)</span></span>
<span class="line"><span>   关税: ¥300 (按金额分摊)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>③ 运费分摊 (按重量):</span></span>
<span class="line"><span>   物料A: 600 × 500/1000 = ¥300</span></span>
<span class="line"><span>   物料B: 600 × 200/1000 = ¥120</span></span>
<span class="line"><span>   物料C: 600 × 300/1000 = ¥180</span></span>
<span class="line"><span></span></span>
<span class="line"><span>④ 关税分摊 (按金额):</span></span>
<span class="line"><span>   物料A: 300 × 1000/3000 = ¥100</span></span>
<span class="line"><span>   物料B: 300 × 1000/3000 = ¥100</span></span>
<span class="line"><span>   物料C: 300 × 1000/3000 = ¥100</span></span>
<span class="line"><span></span></span>
<span class="line"><span>⑤ 最终到岸成本:</span></span>
<span class="line"><span>   物料A: ¥1,000 + ¥300 + ¥100 = ¥1,400  单价: ¥14.00/件</span></span>
<span class="line"><span>   物料B: ¥1,000 + ¥120 + ¥100 = ¥1,220  单价: ¥6.10/件</span></span>
<span class="line"><span>   物料C: ¥1,000 + ¥180 + ¥100 = ¥1,280  单价: ¥25.60/件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>⑥ 会计分录:</span></span>
<span class="line"><span>   借: 原材料-物料A    400  (到岸成本调增)</span></span>
<span class="line"><span>   借: 原材料-物料B    220</span></span>
<span class="line"><span>   借: 原材料-物料C    280</span></span>
<span class="line"><span>     贷: 应付账款-运费   600</span></span>
<span class="line"><span>     贷: 应交税费-关税   300</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="六、api-接口设计" tabindex="-1"><a class="header-anchor" href="#六、api-接口设计"><span>六、API 接口设计</span></a></h2><h3 id="_6-1-库存估值" tabindex="-1"><a class="header-anchor" href="#_6-1-库存估值"><span>6.1 库存估值</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/inventory/valuation</code></td><td>估值列表 (按期间/物料)</td></tr><tr><td>GET</td><td><code>/api/inventory/valuation/{itemId}</code></td><td>物料估值历史</td></tr><tr><td>POST</td><td><code>/api/inventory/valuation/calculate</code></td><td>计算期末估值</td></tr><tr><td>POST</td><td><code>/api/inventory/valuation/close-period</code></td><td>关闭估值期间</td></tr></tbody></table><h3 id="_6-2-成本层" tabindex="-1"><a class="header-anchor" href="#_6-2-成本层"><span>6.2 成本层</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/inventory/cost-layers</code></td><td>成本层列表</td></tr><tr><td>GET</td><td><code>/api/inventory/cost-layers/{itemId}</code></td><td>物料成本层</td></tr><tr><td>GET</td><td><code>/api/inventory/cost-layers/{itemId}/active</code></td><td>活跃成本层</td></tr></tbody></table><h3 id="_6-3-到岸成本" tabindex="-1"><a class="header-anchor" href="#_6-3-到岸成本"><span>6.3 到岸成本</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/inventory/landed-costs</code></td><td>到岸成本列表</td></tr><tr><td>POST</td><td><code>/api/inventory/landed-costs</code></td><td>创建到岸成本</td></tr><tr><td>GET</td><td><code>/api/inventory/landed-costs/{id}</code></td><td>到岸成本详情</td></tr><tr><td>POST</td><td><code>/api/inventory/landed-costs/{id}/calculate</code></td><td>计算分摊</td></tr><tr><td>POST</td><td><code>/api/inventory/landed-costs/{id}/approve</code></td><td>审批</td></tr><tr><td>POST</td><td><code>/api/inventory/landed-costs/{id}/post</code></td><td>过账</td></tr></tbody></table><h3 id="_6-4-计量单位" tabindex="-1"><a class="header-anchor" href="#_6-4-计量单位"><span>6.4 计量单位</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/inventory/uom-conversions</code></td><td>换算规则列表</td></tr><tr><td>POST</td><td><code>/api/inventory/uom-conversions</code></td><td>创建换算规则</td></tr><tr><td>PUT</td><td><code>/api/inventory/uom-conversions/{id}</code></td><td>修改换算规则</td></tr><tr><td>GET</td><td><code>/api/inventory/uom-conversions/convert</code></td><td>执行单位换算</td></tr></tbody></table><h3 id="_6-5-库存重估" tabindex="-1"><a class="header-anchor" href="#_6-5-库存重估"><span>6.5 库存重估</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/inventory/revaluations</code></td><td>重估列表</td></tr><tr><td>POST</td><td><code>/api/inventory/revaluations</code></td><td>创建重估</td></tr><tr><td>POST</td><td><code>/api/inventory/revaluations/{id}/approve</code></td><td>审批重估</td></tr><tr><td>POST</td><td><code>/api/inventory/revaluations/{id}/post</code></td><td>过账重估</td></tr></tbody></table><h3 id="_6-6-abc-xyz-分类" tabindex="-1"><a class="header-anchor" href="#_6-6-abc-xyz-分类"><span>6.6 ABC/XYZ 分类</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/inventory/classifications</code></td><td>分类结果列表</td></tr><tr><td>POST</td><td><code>/api/inventory/classifications/calculate</code></td><td>执行分类计算</td></tr><tr><td>PUT</td><td><code>/api/inventory/classifications/{id}</code></td><td>手工调整分类</td></tr><tr><td>GET</td><td><code>/api/inventory/classifications/matrix</code></td><td>分类矩阵统计</td></tr></tbody></table><h2 id="七、实体关系图" tabindex="-1"><a class="header-anchor" href="#七、实体关系图"><span>七、实体关系图</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────────────┐     ┌──────────────────┐</span></span>
<span class="line"><span>│InventoryValuation│     │   CostLayer      │</span></span>
<span class="line"><span>│ 库存估值          │     │   成本层          │</span></span>
<span class="line"><span>└──────┬───────────┘     └──────┬───────────┘</span></span>
<span class="line"><span>       │                        │</span></span>
<span class="line"><span>       │ 1:N (按物料/期间)       │ 1:N (按物料)</span></span>
<span class="line"><span>       ▼                        ▼</span></span>
<span class="line"><span>┌──────────────────┐     ┌──────────────────┐</span></span>
<span class="line"><span>│  InventoryItem   │     │InventoryTransact │</span></span>
<span class="line"><span>│  库存物料         │     │ 库存事务          │</span></span>
<span class="line"><span>└──────────────────┘     └──────────────────┘</span></span>
<span class="line"><span>       │</span></span>
<span class="line"><span>       │ N:1</span></span>
<span class="line"><span>       ▼</span></span>
<span class="line"><span>┌──────────────────┐</span></span>
<span class="line"><span>│ItemClassification│</span></span>
<span class="line"><span>│ ABC/XYZ分类       │</span></span>
<span class="line"><span>└──────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────────────────┐     ┌──────────────────┐</span></span>
<span class="line"><span>│  LandedCost      │────▶│ LandedCostLine   │</span></span>
<span class="line"><span>│  到岸成本         │ 1:N │ 到岸成本行        │</span></span>
<span class="line"><span>└──────────────────┘     └──────┬───────────┘</span></span>
<span class="line"><span>                                │ 1:N</span></span>
<span class="line"><span>                                ▼</span></span>
<span class="line"><span>                         ┌──────────────────┐</span></span>
<span class="line"><span>                         │LandedCostAllocat │</span></span>
<span class="line"><span>                         │ 分摊明细          │</span></span>
<span class="line"><span>                         └──────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────────────────┐     ┌──────────────────┐</span></span>
<span class="line"><span>│InventoryRevalu   │     │UOMConversion     │</span></span>
<span class="line"><span>│ 库存重估          │     │ 计量单位换算      │</span></span>
<span class="line"><span>└──────────────────┘     └──────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="八、业务规则" tabindex="-1"><a class="header-anchor" href="#八、业务规则"><span>八、业务规则</span></a></h2><table><thead><tr><th>规则</th><th>描述</th></tr></thead><tbody><tr><td>计价方法不可中途变更</td><td>会计期间内同一物料不可变更计价方法</td></tr><tr><td>成本层 FIFO 消耗</td><td>FIFO 方法下成本层必须按入库日期顺序消耗</td></tr><tr><td>成本层不可为负</td><td>成本层剩余数量不可为负</td></tr><tr><td>到岸成本时效</td><td>到岸成本只能分摊到未出库的入库批次</td></tr><tr><td>到岸成本审批</td><td>分摊金额超过阈值需要审批</td></tr><tr><td>重估审批</td><td>库存重估必须经过审批才能过账</td></tr><tr><td>重估生成凭证</td><td>重估过账自动生成差异调整凭证</td></tr><tr><td>UOM 换算一致性</td><td>A→B 和 B→A 的换算系数必须互为倒数</td></tr><tr><td>基准单位唯一</td><td>每个物料只能有一个基准计量单位</td></tr><tr><td>ABC 定期重算</td><td>ABC 分类至少每季度重新计算一次</td></tr><tr><td>期末估值完整</td><td>月末结账前所有物料必须完成估值计算</td></tr><tr><td>标准成本维护</td><td>标准成本更新需记录变更历史和原因</td></tr></tbody></table>`,52)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};