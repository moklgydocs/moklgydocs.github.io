import{O as e,d as t,p as n}from"./runtime-core.esm-bundler-jC72uHyJ.js";import{t as r}from"./app-CyWxe2cq.js";var i=JSON.parse(`{"path":"/%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F/ERP%E4%B8%9A%E5%8A%A1/07-MRP%E6%A8%A1%E5%9D%97/02-%E4%B8%BB%E7%94%9F%E4%BA%A7%E8%AE%A1%E5%88%92MPS.html","title":"主生产计划MPS","lang":"zh-CN","frontmatter":{"title":"主生产计划MPS","date":"2025-04-18T00:00:00.000Z","author":"Moklgy","category":["ERP业务"],"tag":["ERP","MRP"],"order":2},"git":{"createdTime":1776517348000,"updatedTime":1776517348000,"contributors":[{"name":"moklgy","username":"moklgy","email":"moklgy@foxmail.com","commits":1,"url":"https://github.com/moklgy"}]},"readingTime":{"minutes":3.63,"words":1089},"filePathRelative":"业务系统/ERP业务/07-MRP模块/02-主生产计划MPS.md"}`),a={name:`02-主生产计划MPS.md`};function o(r,i,a,o,s,c){return e(),t(`div`,null,[...i[0]||=[n(`<h1 id="主生产计划-mps-master-production-schedule" tabindex="-1"><a class="header-anchor" href="#主生产计划-mps-master-production-schedule"><span>主生产计划 MPS (Master Production Schedule)</span></a></h1><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p>MPS 是连接销售需求和生产执行的桥梁。它以成品/关键半成品为对象，确定在未来各时间段需要生产多少数量，是 MRP 运算的核心输入。MPS 编制需综合考虑销售预测、实际订单、安全库存和产能约束。</p><h2 id="一、mps-编制流程" tabindex="-1"><a class="header-anchor" href="#一、mps-编制流程"><span>一、MPS 编制流程</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>① 收集需求</span></span>
<span class="line"><span>   ├── 销售预测（按产品、按月/周）</span></span>
<span class="line"><span>   ├── 实际销售订单</span></span>
<span class="line"><span>   └── 安全库存需求</span></span>
<span class="line"><span>              │</span></span>
<span class="line"><span>              ▼</span></span>
<span class="line"><span>② 计算毛需求</span></span>
<span class="line"><span>   毛需求 = Max(预测, 实际订单) + 安全库存补充</span></span>
<span class="line"><span>              │</span></span>
<span class="line"><span>              ▼</span></span>
<span class="line"><span>③ 计算净需求</span></span>
<span class="line"><span>   净需求 = 毛需求 - 现有库存 - 在途订单 - 计划接收</span></span>
<span class="line"><span>              │</span></span>
<span class="line"><span>              ▼</span></span>
<span class="line"><span>④ 确定 MPS 数量</span></span>
<span class="line"><span>   按批量规则(固定批量/经济批量/按需)确定每期生产量</span></span>
<span class="line"><span>              │</span></span>
<span class="line"><span>              ▼</span></span>
<span class="line"><span>⑤ 粗产能检查 (RCCP)</span></span>
<span class="line"><span>   验证关键工作中心是否有足够产能</span></span>
<span class="line"><span>              │</span></span>
<span class="line"><span>              ▼</span></span>
<span class="line"><span>⑥ 调整确认</span></span>
<span class="line"><span>   产能不足时调整MPS → 提前生产/分批/外协</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、核心实体" tabindex="-1"><a class="header-anchor" href="#二、核心实体"><span>二、核心实体</span></a></h2><h3 id="_2-1-需求预测" tabindex="-1"><a class="header-anchor" href="#_2-1-需求预测"><span>2.1 需求预测</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>DemandForecast (需求预测)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── ProductId: Guid                    # 产品ID</span></span>
<span class="line"><span>├── ProductCode: string(50)</span></span>
<span class="line"><span>├── ProductName: string(200)</span></span>
<span class="line"><span>├── ForecastPeriod: string(10)         # 预测期间 (2024-01, 2024-W03)</span></span>
<span class="line"><span>├── PeriodType: PeriodType             # 期间类型 (月/周)</span></span>
<span class="line"><span>├── ForecastQuantity: decimal(18,4)   # 预测数量</span></span>
<span class="line"><span>├── ActualQuantity: decimal(18,4)?    # 实际数量（期后回填）</span></span>
<span class="line"><span>├── Accuracy: decimal(5,2)?           # 预测准确率</span></span>
<span class="line"><span>├── Method: ForecastMethod             # 预测方法</span></span>
<span class="line"><span>├── SeasonalFactor: decimal(5,2)?     # 季节系数</span></span>
<span class="line"><span>├── Status: ForecastStatus</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  PeriodType: Monthly=1, Weekly=2</span></span>
<span class="line"><span>  ForecastMethod: Historical=1(历史趋势), Manual=2(人工), </span></span>
<span class="line"><span>                  MovingAverage=3(移动平均), Exponential=4(指数平滑)</span></span>
<span class="line"><span>  ForecastStatus: Draft=0, Confirmed=1, Actual=2</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-mps-计划" tabindex="-1"><a class="header-anchor" href="#_2-2-mps-计划"><span>2.2 MPS 计划</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>MasterPlan (主生产计划)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── PlanNo: string(30)                 # 计划编号</span></span>
<span class="line"><span>├── PlanName: string(100)</span></span>
<span class="line"><span>├── PlanHorizon: int                   # 计划周期（周数）</span></span>
<span class="line"><span>├── StartDate: DateTime                # 计划起始日</span></span>
<span class="line"><span>├── EndDate: DateTime</span></span>
<span class="line"><span>├── Status: PlanStatus</span></span>
<span class="line"><span>├── CreatedBy: Guid</span></span>
<span class="line"><span>├── ApprovedBy: Guid?</span></span>
<span class="line"><span>├── ApprovedAt: DateTime?</span></span>
<span class="line"><span>└── Items: List&lt;MPSItem&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>MPSItem (MPS 行)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── PlanId: Guid</span></span>
<span class="line"><span>├── ProductId: Guid</span></span>
<span class="line"><span>├── ProductCode: string(50)</span></span>
<span class="line"><span>├── ProductName: string(200)</span></span>
<span class="line"><span>├── UnitOfMeasure: string(20)</span></span>
<span class="line"><span>├── SafetyStock: decimal(18,4)        # 安全库存</span></span>
<span class="line"><span>├── LotSizeRule: LotSizeRule           # 批量规则</span></span>
<span class="line"><span>├── FixedLotSize: decimal(18,4)?      # 固定批量</span></span>
<span class="line"><span>├── LeadTimeDays: int                  # 提前期（天）</span></span>
<span class="line"><span>└── Periods: List&lt;MPSPeriod&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>MPSPeriod (MPS 期间明细)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── MPSItemId: Guid</span></span>
<span class="line"><span>├── PeriodStart: DateTime              # 期间起始</span></span>
<span class="line"><span>├── PeriodEnd: DateTime                # 期间结束</span></span>
<span class="line"><span>├── ForecastDemand: decimal(18,4)     # 预测需求</span></span>
<span class="line"><span>├── ActualOrders: decimal(18,4)       # 实际订单</span></span>
<span class="line"><span>├── GrossDemand: decimal(18,4)        # 毛需求</span></span>
<span class="line"><span>├── ProjectedAvailable: decimal(18,4) # 预计可用库存</span></span>
<span class="line"><span>├── NetRequirement: decimal(18,4)     # 净需求</span></span>
<span class="line"><span>├── PlannedProduction: decimal(18,4)  # 计划生产量</span></span>
<span class="line"><span>├── AvailableToPromise: decimal(18,4) # 可供承诺量(ATP)</span></span>
<span class="line"><span>└── IsConfirmed: bool                  # 是否确认</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  PlanStatus: Draft=0, Confirmed=1, Released=2, Closed=3</span></span>
<span class="line"><span>  LotSizeRule: LotForLot=1(按需), FixedLot=2(固定批量), EOQ=3(经济批量),</span></span>
<span class="line"><span>               MinMax=4(最小最大)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、mps-计算示例" tabindex="-1"><a class="header-anchor" href="#三、mps-计算示例"><span>三、MPS 计算示例</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>产品A, 安全库存: 50, 期初库存: 100, 固定批量: 100</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────────┬────────┬────────┬────────┬────────┬────────┐</span></span>
<span class="line"><span>│          │ 第1周   │ 第2周   │ 第3周   │ 第4周   │ 第5周   │</span></span>
<span class="line"><span>├──────────┼────────┼────────┼────────┼────────┼────────┤</span></span>
<span class="line"><span>│ 预测需求  │   80   │   60   │   90   │   70   │   80   │</span></span>
<span class="line"><span>│ 实际订单  │   85   │   40   │   30   │   10   │    0   │</span></span>
<span class="line"><span>│ 毛需求    │   85   │   60   │   90   │   70   │   80   │</span></span>
<span class="line"><span>│ 计划接收  │    0   │  100   │    0   │  100   │    0   │</span></span>
<span class="line"><span>│ 预计库存  │   15   │   55   │  -35   │   -5   │  -85   │</span></span>
<span class="line"><span>│ 净需求    │    0   │    0   │   85   │   70   │   80   │</span></span>
<span class="line"><span>│ MPS      │    0   │  100   │  100   │  100   │  100   │</span></span>
<span class="line"><span>│ ATP      │   15   │   60   │   70   │   90   │  100   │</span></span>
<span class="line"><span>└──────────┴────────┴────────┴────────┴────────┴────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>计算逻辑:</span></span>
<span class="line"><span>  第1周: 预计库存 = 100 - 85 = 15 (≥安全库存50? 否→但已来不及生产)</span></span>
<span class="line"><span>  第2周: 净需求 = 60 - 15 = 45 → 需要MPS, 批量100 → MPS=100</span></span>
<span class="line"><span>         预计库存 = 15 + 100 - 60 = 55</span></span>
<span class="line"><span>  第3周: 预计库存 = 55 - 90 = -35 → 需要MPS=100</span></span>
<span class="line"><span>         预计库存调整 = 55 + 100 - 90 = 65</span></span>
<span class="line"><span>  ...</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="四、时间围栏" tabindex="-1"><a class="header-anchor" href="#四、时间围栏"><span>四、时间围栏</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>                    ← 冻结区 →← 协商区 →← 自由区 →</span></span>
<span class="line"><span>  ──────────────────┼─────────┼─────────┼────────────▶</span></span>
<span class="line"><span>  今天                                              计划终点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  冻结区 (0-2周):  MPS 不可变更，按订单执行</span></span>
<span class="line"><span>  协商区 (2-8周):  可调整，但需审批</span></span>
<span class="line"><span>  自由区 (8周+):   可自由调整</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="五、api-接口设计" tabindex="-1"><a class="header-anchor" href="#五、api-接口设计"><span>五、API 接口设计</span></a></h2><h3 id="_5-1-需求预测" tabindex="-1"><a class="header-anchor" href="#_5-1-需求预测"><span>5.1 需求预测</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/mrp/forecasts</code></td><td>预测列表</td></tr><tr><td>POST</td><td><code>/api/mrp/forecasts</code></td><td>创建预测</td></tr><tr><td>PUT</td><td><code>/api/mrp/forecasts/{id}</code></td><td>修改预测</td></tr><tr><td>POST</td><td><code>/api/mrp/forecasts/generate</code></td><td>自动生成预测（基于历史数据）</td></tr></tbody></table><h3 id="_5-2-mps-管理" tabindex="-1"><a class="header-anchor" href="#_5-2-mps-管理"><span>5.2 MPS 管理</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/mrp/mps</code></td><td>MPS 列表</td></tr><tr><td>GET</td><td><code>/api/mrp/mps/{id}</code></td><td>MPS 详情</td></tr><tr><td>POST</td><td><code>/api/mrp/mps</code></td><td>创建 MPS</td></tr><tr><td>PUT</td><td><code>/api/mrp/mps/{id}</code></td><td>修改 MPS</td></tr><tr><td>POST</td><td><code>/api/mrp/mps/{id}/calculate</code></td><td>计算 MPS</td></tr><tr><td>POST</td><td><code>/api/mrp/mps/{id}/confirm</code></td><td>确认 MPS</td></tr><tr><td>POST</td><td><code>/api/mrp/mps/{id}/release</code></td><td>发布 MPS → 驱动 MRP</td></tr><tr><td>GET</td><td><code>/api/mrp/mps/{id}/atp</code></td><td>可供承诺量查询</td></tr></tbody></table><h2 id="六、业务规则" tabindex="-1"><a class="header-anchor" href="#六、业务规则"><span>六、业务规则</span></a></h2><table><thead><tr><th>规则</th><th>描述</th></tr></thead><tbody><tr><td>需求取大</td><td>毛需求取预测和实际订单的较大值</td></tr><tr><td>安全库存</td><td>预计库存不得低于安全库存</td></tr><tr><td>冻结区限制</td><td>冻结区内的 MPS 不可修改</td></tr><tr><td>批量规则</td><td>MPS 数量必须符合批量规则</td></tr><tr><td>提前期</td><td>MPS 考虑产品生产提前期</td></tr><tr><td>ATP 不可为负</td><td>可供承诺量不可为负</td></tr><tr><td>预测回顾</td><td>定期回顾预测准确率</td></tr></tbody></table>`,21)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};