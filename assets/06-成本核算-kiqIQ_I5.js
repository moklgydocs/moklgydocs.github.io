import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as r}from"./app-D5IRkmio.js";var i=JSON.parse(`{"path":"/%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F/ERP%E4%B8%9A%E5%8A%A1/08-%E8%B4%A2%E5%8A%A1%E6%A8%A1%E5%9D%97/06-%E6%88%90%E6%9C%AC%E6%A0%B8%E7%AE%97.html","title":"成本核算","lang":"zh-CN","frontmatter":{"title":"成本核算","date":"2025-04-18T00:00:00.000Z","author":"Moklgy","category":["ERP业务"],"tag":["ERP","财务"],"order":6},"git":{"createdTime":1776517348000,"updatedTime":1776517348000,"contributors":[{"name":"moklgy","username":"moklgy","email":"moklgy@foxmail.com","commits":1,"url":"https://github.com/moklgy"}]},"readingTime":{"minutes":8.17,"words":2452},"filePathRelative":"业务系统/ERP业务/08-财务模块/06-成本核算.md"}`),a={name:`06-成本核算.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="成本核算" tabindex="-1"><a class="header-anchor" href="#成本核算"><span>成本核算</span></a></h1><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p>成本核算子系统负责企业产品成本的计算与控制，涵盖标准成本的制定、实际成本的归集与分配、成本差异的分析。它与生产模块紧密集成，将料、工、费三大要素归集到产品，为定价决策和经营分析提供数据支撑。</p><h2 id="一、成本核算体系" tabindex="-1"><a class="header-anchor" href="#一、成本核算体系"><span>一、成本核算体系</span></a></h2><h3 id="_1-1-成本构成" tabindex="-1"><a class="header-anchor" href="#_1-1-成本构成"><span>1.1 成本构成</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>产品成本</span></span>
<span class="line"><span>├── 直接材料 (Direct Material)</span></span>
<span class="line"><span>│   ├── 主要材料</span></span>
<span class="line"><span>│   └── 辅助材料</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── 直接人工 (Direct Labor)</span></span>
<span class="line"><span>│   ├── 生产工资</span></span>
<span class="line"><span>│   └── 加班工资</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>└── 制造费用 (Manufacturing Overhead)</span></span>
<span class="line"><span>    ├── 间接材料</span></span>
<span class="line"><span>    ├── 间接人工 (车间管理人员工资)</span></span>
<span class="line"><span>    ├── 折旧费</span></span>
<span class="line"><span>    ├── 水电费</span></span>
<span class="line"><span>    ├── 维修费</span></span>
<span class="line"><span>    └── 其他制造费用</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-成本核算方法" tabindex="-1"><a class="header-anchor" href="#_1-2-成本核算方法"><span>1.2 成本核算方法</span></a></h3><table><thead><tr><th>方法</th><th>说明</th><th>适用场景</th></tr></thead><tbody><tr><td><strong>标准成本法</strong></td><td>预设标准成本，实际与标准的差异单独核算</td><td>大批量标准化生产</td></tr><tr><td><strong>实际成本法</strong></td><td>按实际发生的料工费归集</td><td>小批量、定制化生产</td></tr><tr><td><strong>品种法</strong></td><td>按产品品种归集成本</td><td>大量大批单步骤生产</td></tr><tr><td><strong>分批法</strong></td><td>按生产批次（工单）归集成本</td><td>小批量多品种</td></tr><tr><td><strong>分步法</strong></td><td>按生产步骤逐步结转</td><td>多步骤连续生产</td></tr></tbody></table><h3 id="_1-3-成本核算流程" tabindex="-1"><a class="header-anchor" href="#_1-3-成本核算流程"><span>1.3 成本核算流程</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>① 期初: 建立/更新标准成本</span></span>
<span class="line"><span>              │</span></span>
<span class="line"><span>              ▼</span></span>
<span class="line"><span>② 日常: 归集实际成本</span></span>
<span class="line"><span>   ├── 领料出库 → 直接材料</span></span>
<span class="line"><span>   ├── 报工工时 → 直接人工</span></span>
<span class="line"><span>   └── 费用分摊 → 制造费用</span></span>
<span class="line"><span>              │</span></span>
<span class="line"><span>              ▼</span></span>
<span class="line"><span>③ 月末: 制造费用分配</span></span>
<span class="line"><span>   制造费用 → 按分配标准 → 分配至各工单/产品</span></span>
<span class="line"><span>              │</span></span>
<span class="line"><span>              ▼</span></span>
<span class="line"><span>④ 月末: 完工产品成本结转</span></span>
<span class="line"><span>   在制品 → 产成品（按约当产量法或其他方法）</span></span>
<span class="line"><span>              │</span></span>
<span class="line"><span>              ▼</span></span>
<span class="line"><span>⑤ 月末: 销售成本结转</span></span>
<span class="line"><span>   产成品 → 主营业务成本（按加权平均/先进先出）</span></span>
<span class="line"><span>              │</span></span>
<span class="line"><span>              ▼</span></span>
<span class="line"><span>⑥ 差异分析: 标准成本 vs 实际成本</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、核心实体" tabindex="-1"><a class="header-anchor" href="#二、核心实体"><span>二、核心实体</span></a></h2><h3 id="_2-1-成本中心" tabindex="-1"><a class="header-anchor" href="#_2-1-成本中心"><span>2.1 成本中心</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>CostCenter (成本中心)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── Code: string(20)                   # 编码</span></span>
<span class="line"><span>├── Name: string(100)                  # 名称</span></span>
<span class="line"><span>├── Type: CostCenterType               # 类型</span></span>
<span class="line"><span>├── ParentId: Guid?                    # 上级成本中心</span></span>
<span class="line"><span>├── DepartmentId: Guid?                # 关联部门</span></span>
<span class="line"><span>├── ManagerId: Guid?                   # 负责人</span></span>
<span class="line"><span>├── IsActive: bool</span></span>
<span class="line"><span>├── BudgetAmount: decimal(18,2)        # 预算金额</span></span>
<span class="line"><span>└── Remark: string(500)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  CostCenterType: Production=1(生产), Management=2(管理),</span></span>
<span class="line"><span>                  Sales=3(销售), RD=4(研发), Shared=5(共享)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-标准成本" tabindex="-1"><a class="header-anchor" href="#_2-2-标准成本"><span>2.2 标准成本</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>StandardCost (标准成本)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── ProductId: Guid                    # 产品ID</span></span>
<span class="line"><span>├── ProductCode: string(50)</span></span>
<span class="line"><span>├── ProductName: string(200)</span></span>
<span class="line"><span>├── EffectiveDate: DateTime            # 生效日期</span></span>
<span class="line"><span>├── ExpiryDate: DateTime?              # 失效日期</span></span>
<span class="line"><span>├── Version: int                       # 版本号</span></span>
<span class="line"><span>├── DirectMaterialCost: decimal(18,2) # 直接材料标准成本</span></span>
<span class="line"><span>├── DirectLaborCost: decimal(18,2)    # 直接人工标准成本</span></span>
<span class="line"><span>├── OverheadCost: decimal(18,2)       # 制造费用标准成本</span></span>
<span class="line"><span>├── TotalStandardCost: decimal(18,2)  # 标准总成本</span></span>
<span class="line"><span>├── Status: StandardCostStatus</span></span>
<span class="line"><span>└── Details: List&lt;StandardCostDetail&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>StandardCostDetail (标准成本明细)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── StandardCostId: Guid</span></span>
<span class="line"><span>├── CostElement: CostElement           # 成本要素</span></span>
<span class="line"><span>├── ItemId: Guid?                      # 物料/资源ID</span></span>
<span class="line"><span>├── ItemName: string(200)</span></span>
<span class="line"><span>├── StandardQuantity: decimal(18,4)   # 标准用量</span></span>
<span class="line"><span>├── StandardPrice: decimal(18,6)      # 标准单价</span></span>
<span class="line"><span>├── StandardAmount: decimal(18,2)     # 标准金额</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  StandardCostStatus: Draft=0, Active=1, Expired=2</span></span>
<span class="line"><span>  CostElement: Material=1, Labor=2, Overhead=3</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-实际成本归集" tabindex="-1"><a class="header-anchor" href="#_2-3-实际成本归集"><span>2.3 实际成本归集</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>ActualCost (实际成本归集)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── WorkOrderId: Guid                  # 生产工单ID</span></span>
<span class="line"><span>├── WorkOrderNo: string(50)</span></span>
<span class="line"><span>├── ProductId: Guid</span></span>
<span class="line"><span>├── FiscalPeriodId: Guid               # 会计期间</span></span>
<span class="line"><span>├── DirectMaterialCost: decimal(18,2) # 实际直接材料</span></span>
<span class="line"><span>├── DirectLaborCost: decimal(18,2)    # 实际直接人工</span></span>
<span class="line"><span>├── OverheadCost: decimal(18,2)       # 实际制造费用（分配后）</span></span>
<span class="line"><span>├── TotalActualCost: decimal(18,2)    # 实际总成本</span></span>
<span class="line"><span>├── CompletedQuantity: decimal(18,4)  # 完工数量</span></span>
<span class="line"><span>├── UnitCost: decimal(18,6)           # 单位成本</span></span>
<span class="line"><span>├── WIPValue: decimal(18,2)           # 在制品价值</span></span>
<span class="line"><span>└── Status: CostCalcStatus</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CostAllocation (成本分配记录)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── FiscalPeriodId: Guid</span></span>
<span class="line"><span>├── AllocationDate: DateTime</span></span>
<span class="line"><span>├── CostCenterId: Guid                 # 成本中心</span></span>
<span class="line"><span>├── CostElement: CostElement           # 费用类型</span></span>
<span class="line"><span>├── TotalAmount: decimal(18,2)        # 分配总额</span></span>
<span class="line"><span>├── AllocationBasis: AllocationBasis   # 分配标准</span></span>
<span class="line"><span>├── VoucherId: Guid?</span></span>
<span class="line"><span>└── Details: List&lt;CostAllocationDetail&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CostAllocationDetail (分配明细)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── AllocationId: Guid</span></span>
<span class="line"><span>├── WorkOrderId: Guid                  # 分配到工单</span></span>
<span class="line"><span>├── BasisValue: decimal(18,4)         # 分配基数值</span></span>
<span class="line"><span>├── AllocationRate: decimal(18,6)     # 分配率</span></span>
<span class="line"><span>├── AllocatedAmount: decimal(18,2)    # 分配金额</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  CostCalcStatus: Collecting=0(归集中), Calculated=1(已计算), Posted=2(已过账)</span></span>
<span class="line"><span>  AllocationBasis: DirectLabor=1(直接人工), MachineHours=2(机器工时),</span></span>
<span class="line"><span>                   MaterialCost=3(材料成本), ProductionVolume=4(产量)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-4-成本差异" tabindex="-1"><a class="header-anchor" href="#_2-4-成本差异"><span>2.4 成本差异</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>CostVariance (成本差异)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── FiscalPeriodId: Guid</span></span>
<span class="line"><span>├── ProductId: Guid</span></span>
<span class="line"><span>├── WorkOrderId: Guid?</span></span>
<span class="line"><span>├── VarianceType: VarianceType         # 差异类型</span></span>
<span class="line"><span>├── StandardAmount: decimal(18,2)     # 标准成本</span></span>
<span class="line"><span>├── ActualAmount: decimal(18,2)       # 实际成本</span></span>
<span class="line"><span>├── VarianceAmount: decimal(18,2)     # 差异金额 (实际-标准)</span></span>
<span class="line"><span>├── VarianceRate: decimal(5,2)        # 差异率 (%)</span></span>
<span class="line"><span>├── Direction: VarianceDirection       # 有利/不利</span></span>
<span class="line"><span>├── AnalysisNote: string(500)          # 差异分析说明</span></span>
<span class="line"><span>└── VoucherId: Guid?</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  VarianceType:</span></span>
<span class="line"><span>    MaterialPrice=1(材料价格差异),</span></span>
<span class="line"><span>    MaterialQuantity=2(材料用量差异),</span></span>
<span class="line"><span>    LaborRate=3(人工费率差异),</span></span>
<span class="line"><span>    LaborEfficiency=4(人工效率差异),</span></span>
<span class="line"><span>    OverheadSpending=5(制造费用开支差异),</span></span>
<span class="line"><span>    OverheadEfficiency=6(制造费用效率差异),</span></span>
<span class="line"><span>    OverheadVolume=7(制造费用产量差异)</span></span>
<span class="line"><span>  VarianceDirection: Favorable=1(有利), Unfavorable=2(不利)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、成本差异分析" tabindex="-1"><a class="header-anchor" href="#三、成本差异分析"><span>三、成本差异分析</span></a></h2><h3 id="_3-1-材料差异" tabindex="-1"><a class="header-anchor" href="#_3-1-材料差异"><span>3.1 材料差异</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>材料价格差异 = (实际单价 - 标准单价) × 实际用量</span></span>
<span class="line"><span>材料用量差异 = (实际用量 - 标准用量) × 标准单价</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例:</span></span>
<span class="line"><span>  标准: 10kg × 50元/kg = 500元</span></span>
<span class="line"><span>  实际: 11kg × 48元/kg = 528元</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  价格差异 = (48 - 50) × 11 = -22元 (有利 ✅)</span></span>
<span class="line"><span>  用量差异 = (11 - 10) × 50 = +50元 (不利 ❌)</span></span>
<span class="line"><span>  总差异 = -22 + 50 = +28元 (不利)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-人工差异" tabindex="-1"><a class="header-anchor" href="#_3-2-人工差异"><span>3.2 人工差异</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>人工费率差异 = (实际费率 - 标准费率) × 实际工时</span></span>
<span class="line"><span>人工效率差异 = (实际工时 - 标准工时) × 标准费率</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例:</span></span>
<span class="line"><span>  标准: 5小时 × 30元/时 = 150元</span></span>
<span class="line"><span>  实际: 6小时 × 28元/时 = 168元</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  费率差异 = (28 - 30) × 6 = -12元 (有利 ✅)</span></span>
<span class="line"><span>  效率差异 = (6 - 5) × 30 = +30元 (不利 ❌)</span></span>
<span class="line"><span>  总差异 = -12 + 30 = +18元 (不利)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-制造费用差异" tabindex="-1"><a class="header-anchor" href="#_3-3-制造费用差异"><span>3.3 制造费用差异</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>三因素分析法:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>开支差异 = 实际制造费用 - 预算制造费用</span></span>
<span class="line"><span>效率差异 = (实际工时 - 标准工时) × 标准分配率</span></span>
<span class="line"><span>产量差异 = (预算产量 - 实际产量) × 标准单位制造费用</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-4-差异处理会计分录" tabindex="-1"><a class="header-anchor" href="#_3-4-差异处理会计分录"><span>3.4 差异处理会计分录</span></a></h3><p><strong>材料价格差异（不利）:</strong></p><table><thead><tr><th>摘要</th><th>科目</th><th>借方</th><th>贷方</th></tr></thead><tbody><tr><td>材料价格差异</td><td>5401.01 材料价差</td><td>50.00</td><td></td></tr><tr><td>转出差异</td><td>4001 生产成本</td><td></td><td>50.00</td></tr></tbody></table><p><strong>月末差异结转（差异较小，直接计入当期损益）:</strong></p><table><thead><tr><th>摘要</th><th>科目</th><th>借方</th><th>贷方</th></tr></thead><tbody><tr><td>结转成本差异</td><td>5401 主营业务成本</td><td>28.00</td><td></td></tr><tr><td>结转成本差异</td><td>成本差异科目</td><td></td><td>28.00</td></tr></tbody></table><h2 id="四、完工产品成本结转" tabindex="-1"><a class="header-anchor" href="#四、完工产品成本结转"><span>四、完工产品成本结转</span></a></h2><h3 id="_4-1-约当产量法" tabindex="-1"><a class="header-anchor" href="#_4-1-约当产量法"><span>4.1 约当产量法</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>约当产量 = 完工数量 + 在制品数量 × 完工百分比</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例:</span></span>
<span class="line"><span>  完工产品: 100件</span></span>
<span class="line"><span>  在制品: 20件，完工度 50%</span></span>
<span class="line"><span>  约当产量 = 100 + 20 × 50% = 110件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  本期总成本: 55,000元</span></span>
<span class="line"><span>  单位成本 = 55,000 / 110 = 500元/件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  完工产品成本 = 100 × 500 = 50,000元</span></span>
<span class="line"><span>  在制品成本 = 10 × 500 = 5,000元</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-完工入库会计分录" tabindex="-1"><a class="header-anchor" href="#_4-2-完工入库会计分录"><span>4.2 完工入库会计分录</span></a></h3><table><thead><tr><th>摘要</th><th>科目</th><th>借方</th><th>贷方</th></tr></thead><tbody><tr><td>完工入库-产品A</td><td>1405 库存商品</td><td>50,000.00</td><td></td></tr><tr><td>完工入库-产品A</td><td>4001 生产成本</td><td></td><td>50,000.00</td></tr></tbody></table><h3 id="_4-3-销售成本结转" tabindex="-1"><a class="header-anchor" href="#_4-3-销售成本结转"><span>4.3 销售成本结转</span></a></h3><table><thead><tr><th>摘要</th><th>科目</th><th>借方</th><th>贷方</th></tr></thead><tbody><tr><td>结转销售成本-产品A</td><td>5401 主营业务成本</td><td>40,000.00</td><td></td></tr><tr><td>结转销售成本-产品A</td><td>1405 库存商品</td><td></td><td>40,000.00</td></tr></tbody></table><h2 id="五、制造费用分配" tabindex="-1"><a class="header-anchor" href="#五、制造费用分配"><span>五、制造费用分配</span></a></h2><h3 id="_5-1-分配标准" tabindex="-1"><a class="header-anchor" href="#_5-1-分配标准"><span>5.1 分配标准</span></a></h3><table><thead><tr><th>分配标准</th><th>计算方式</th><th>适用场景</th></tr></thead><tbody><tr><td>直接人工工时</td><td>制造费用 × (工单工时/总工时)</td><td>人工密集型</td></tr><tr><td>机器工时</td><td>制造费用 × (工单机器工时/总机器工时)</td><td>设备密集型</td></tr><tr><td>直接材料成本</td><td>制造费用 × (工单材料成本/总材料成本)</td><td>材料密集型</td></tr><tr><td>产量比例</td><td>制造费用 × (工单产量/总产量)</td><td>单一产品</td></tr></tbody></table><h3 id="_5-2-分配示例" tabindex="-1"><a class="header-anchor" href="#_5-2-分配示例"><span>5.2 分配示例</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>本月制造费用总计: 100,000元</span></span>
<span class="line"><span>分配标准: 直接人工工时</span></span>
<span class="line"><span></span></span>
<span class="line"><span>工单A: 500小时 (50%)  → 分配 50,000元</span></span>
<span class="line"><span>工单B: 300小时 (30%)  → 分配 30,000元</span></span>
<span class="line"><span>工单C: 200小时 (20%)  → 分配 20,000元</span></span>
<span class="line"><span>合计:  1,000小时       合计 100,000元</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>分配凭证:</strong></p><table><thead><tr><th>摘要</th><th>科目</th><th>借方</th><th>贷方</th></tr></thead><tbody><tr><td>分配制造费用-工单A</td><td>4001 生产成本-工单A</td><td>50,000.00</td><td></td></tr><tr><td>分配制造费用-工单B</td><td>4001 生产成本-工单B</td><td>30,000.00</td><td></td></tr><tr><td>分配制造费用-工单C</td><td>4001 生产成本-工单C</td><td>20,000.00</td><td></td></tr><tr><td>结转制造费用</td><td>4101 制造费用</td><td></td><td>100,000.00</td></tr></tbody></table><h2 id="六、api-接口设计" tabindex="-1"><a class="header-anchor" href="#六、api-接口设计"><span>六、API 接口设计</span></a></h2><h3 id="_6-1-成本中心" tabindex="-1"><a class="header-anchor" href="#_6-1-成本中心"><span>6.1 成本中心</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/finance/cost/centers</code></td><td>成本中心列表</td></tr><tr><td>POST</td><td><code>/api/finance/cost/centers</code></td><td>新增成本中心</td></tr><tr><td>PUT</td><td><code>/api/finance/cost/centers/{id}</code></td><td>修改成本中心</td></tr></tbody></table><h3 id="_6-2-标准成本" tabindex="-1"><a class="header-anchor" href="#_6-2-标准成本"><span>6.2 标准成本</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/finance/cost/standards</code></td><td>标准成本列表</td></tr><tr><td>GET</td><td><code>/api/finance/cost/standards/{productId}</code></td><td>产品标准成本详情</td></tr><tr><td>POST</td><td><code>/api/finance/cost/standards</code></td><td>创建标准成本</td></tr><tr><td>PUT</td><td><code>/api/finance/cost/standards/{id}</code></td><td>更新标准成本</td></tr><tr><td>POST</td><td><code>/api/finance/cost/standards/{id}/activate</code></td><td>激活标准成本</td></tr></tbody></table><h3 id="_6-3-成本计算" tabindex="-1"><a class="header-anchor" href="#_6-3-成本计算"><span>6.3 成本计算</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/finance/cost/actuals</code></td><td>实际成本列表</td></tr><tr><td>GET</td><td><code>/api/finance/cost/actuals/{workOrderId}</code></td><td>工单成本详情</td></tr><tr><td>POST</td><td><code>/api/finance/cost/allocation/execute</code></td><td>执行制造费用分配</td></tr><tr><td>POST</td><td><code>/api/finance/cost/completion/calculate</code></td><td>计算完工成本</td></tr><tr><td>POST</td><td><code>/api/finance/cost/completion/post</code></td><td>过账完工成本</td></tr></tbody></table><h3 id="_6-4-差异分析" tabindex="-1"><a class="header-anchor" href="#_6-4-差异分析"><span>6.4 差异分析</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/finance/cost/variances</code></td><td>成本差异列表</td></tr><tr><td>POST</td><td><code>/api/finance/cost/variances/calculate</code></td><td>计算成本差异</td></tr><tr><td>GET</td><td><code>/api/finance/cost/variances/summary</code></td><td>差异汇总报表</td></tr><tr><td>POST</td><td><code>/api/finance/cost/variances/post</code></td><td>过账差异金额</td></tr></tbody></table><h3 id="_6-5-报表" tabindex="-1"><a class="header-anchor" href="#_6-5-报表"><span>6.5 报表</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/finance/cost/reports/product-cost</code></td><td>产品成本报表</td></tr><tr><td>GET</td><td><code>/api/finance/cost/reports/cost-center</code></td><td>成本中心报表</td></tr><tr><td>GET</td><td><code>/api/finance/cost/reports/variance-analysis</code></td><td>差异分析报表</td></tr><tr><td>GET</td><td><code>/api/finance/cost/reports/wip</code></td><td>在制品报表</td></tr></tbody></table><h2 id="七、实体关系图" tabindex="-1"><a class="header-anchor" href="#七、实体关系图"><span>七、实体关系图</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────────┐     ┌──────────────┐     ┌────────────────┐</span></span>
<span class="line"><span>│ CostCenter   │     │ StandardCost │     │ ActualCost     │</span></span>
<span class="line"><span>│ 成本中心      │     │ 标准成本      │     │ 实际成本        │</span></span>
<span class="line"><span>└──────┬───────┘     └──────┬───────┘     └───────┬────────┘</span></span>
<span class="line"><span>       │                    │                      │</span></span>
<span class="line"><span>       │                    ▼                      │</span></span>
<span class="line"><span>       │             ┌──────────────┐              │</span></span>
<span class="line"><span>       │             │StdCostDetail │              │</span></span>
<span class="line"><span>       │             │ 标准成本明细   │              │</span></span>
<span class="line"><span>       │             └──────────────┘              │</span></span>
<span class="line"><span>       │                                           │</span></span>
<span class="line"><span>       ▼                                           ▼</span></span>
<span class="line"><span>┌──────────────┐                          ┌────────────────┐</span></span>
<span class="line"><span>│CostAllocation│                          │ CostVariance   │</span></span>
<span class="line"><span>│ 成本分配      │                          │ 成本差异        │</span></span>
<span class="line"><span>└──────┬───────┘                          └────────────────┘</span></span>
<span class="line"><span>       │</span></span>
<span class="line"><span>       ▼</span></span>
<span class="line"><span>┌──────────────────┐</span></span>
<span class="line"><span>│CostAllocDetail   │</span></span>
<span class="line"><span>│ 分配明细          │</span></span>
<span class="line"><span>└──────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="八、业务规则与约束" tabindex="-1"><a class="header-anchor" href="#八、业务规则与约束"><span>八、业务规则与约束</span></a></h2><table><thead><tr><th>规则</th><th>描述</th></tr></thead><tbody><tr><td>标准成本版本控制</td><td>同一产品同一时间只有一个有效标准成本</td></tr><tr><td>成本归集完整性</td><td>工单成本必须包含料、工、费三要素</td></tr><tr><td>制造费用必须分配</td><td>月末制造费用必须全部分配完毕</td></tr><tr><td>分配基数非零</td><td>分配标准的基数合计不能为零</td></tr><tr><td>差异及时分析</td><td>差异率超过阈值（如10%）需说明原因</td></tr><tr><td>完工前不可结转</td><td>未完工的工单不能结转产成品成本</td></tr><tr><td>成本不可为负</td><td>产品单位成本不可为负数</td></tr><tr><td>期间一致性</td><td>成本归集必须在正确的会计期间</td></tr><tr><td>在制品月末盘点</td><td>月末须确认在制品的完工程度</td></tr><tr><td>成本冻结</td><td>期间关闭后成本数据不可修改</td></tr></tbody></table>`,60)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};