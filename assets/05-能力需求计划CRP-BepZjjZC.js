import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as r}from"./app-DApykHxA.js";var i=JSON.parse(`{"path":"/%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F/ERP%E4%B8%9A%E5%8A%A1/07-MRP%E6%A8%A1%E5%9D%97/05-%E8%83%BD%E5%8A%9B%E9%9C%80%E6%B1%82%E8%AE%A1%E5%88%92CRP.html","title":"能力需求计划CRP","lang":"zh-CN","frontmatter":{"title":"能力需求计划CRP","date":"2025-04-18T00:00:00.000Z","author":"Moklgy","category":["ERP业务"],"tag":["ERP","MRP"],"order":5},"git":{"createdTime":1776517348000,"updatedTime":1776517348000,"contributors":[{"name":"moklgy","username":"moklgy","email":"moklgy@foxmail.com","commits":1,"url":"https://github.com/moklgy"}]},"readingTime":{"minutes":4.09,"words":1228},"filePathRelative":"业务系统/ERP业务/07-MRP模块/05-能力需求计划CRP.md"}`),a={name:`05-能力需求计划CRP.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="能力需求计划-crp-capacity-requirements-planning" tabindex="-1"><a class="header-anchor" href="#能力需求计划-crp-capacity-requirements-planning"><span>能力需求计划 CRP (Capacity Requirements Planning)</span></a></h1><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p>CRP（Capacity Requirements Planning）在 MRP 运算后执行，将计划生产订单转化为对各工作中心的产能需求，与工作中心的可用产能进行对比，识别产能瓶颈并提供调整建议。它确保生产计划在产能约束下可行。</p><h2 id="一、crp-运算流程" tabindex="-1"><a class="header-anchor" href="#一、crp-运算流程"><span>一、CRP 运算流程</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>MRP 计划生产订单</span></span>
<span class="line"><span>      │</span></span>
<span class="line"><span>      ▼</span></span>
<span class="line"><span>┌─────────────────┐</span></span>
<span class="line"><span>│ 工艺路线展开      │  每个计划订单 × 工艺路线 = 各工序产能需求</span></span>
<span class="line"><span>│ (Routing)       │</span></span>
<span class="line"><span>└────────┬────────┘</span></span>
<span class="line"><span>         │</span></span>
<span class="line"><span>         ▼</span></span>
<span class="line"><span>┌─────────────────┐     ┌─────────────────┐</span></span>
<span class="line"><span>│ 产能需求汇总     │     │ 可用产能计算     │</span></span>
<span class="line"><span>│ (按工作中心/期间)│     │ (工作日历×效率)  │</span></span>
<span class="line"><span>└────────┬────────┘     └────────┬────────┘</span></span>
<span class="line"><span>         │                       │</span></span>
<span class="line"><span>         └───────────┬───────────┘</span></span>
<span class="line"><span>                     ▼</span></span>
<span class="line"><span>              ┌─────────────────┐</span></span>
<span class="line"><span>              │ 负荷对比分析     │</span></span>
<span class="line"><span>              │ 需求 vs 可用     │</span></span>
<span class="line"><span>              └────────┬────────┘</span></span>
<span class="line"><span>                       │</span></span>
<span class="line"><span>              ┌────────┼────────┐</span></span>
<span class="line"><span>              ▼        ▼        ▼</span></span>
<span class="line"><span>         产能充足    轻微超载    严重超载</span></span>
<span class="line"><span>              │        │        │</span></span>
<span class="line"><span>              ▼        ▼        ▼</span></span>
<span class="line"><span>         确认计划   调整措施    调整MPS</span></span>
<span class="line"><span>                   (加班/外协)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、核心概念" tabindex="-1"><a class="header-anchor" href="#二、核心概念"><span>二、核心概念</span></a></h2><h3 id="_2-1-产能计算" tabindex="-1"><a class="header-anchor" href="#_2-1-产能计算"><span>2.1 产能计算</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>工作中心日可用产能:</span></span>
<span class="line"><span>  = 每日工作小时 × 机台数 × 效率系数 × 利用率</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例: 工作中心 WC-01</span></span>
<span class="line"><span>  每日工作: 8小时 × 2班 = 16小时</span></span>
<span class="line"><span>  机台数: 3台</span></span>
<span class="line"><span>  效率系数: 85%</span></span>
<span class="line"><span>  利用率: 90%</span></span>
<span class="line"><span>  日可用产能 = 16 × 3 × 0.85 × 0.90 = 36.72 标准小时</span></span>
<span class="line"><span></span></span>
<span class="line"><span>周可用产能 = 日可用产能 × 工作日数</span></span>
<span class="line"><span>  = 36.72 × 5 = 183.6 标准小时</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-产能需求计算" tabindex="-1"><a class="header-anchor" href="#_2-2-产能需求计算"><span>2.2 产能需求计算</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>单个工单的产能需求:</span></span>
<span class="line"><span>  = 准备时间 + (单件加工时间 × 计划数量)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例: WO-001, 产品A 100件</span></span>
<span class="line"><span>  工序20(在WC-01): 准备60min + 100×5min = 560min = 9.33小时</span></span>
<span class="line"><span></span></span>
<span class="line"><span>汇总该期间 WC-01 的所有工单需求:</span></span>
<span class="line"><span>  WO-001: 9.33小时</span></span>
<span class="line"><span>  WO-002: 6.50小时</span></span>
<span class="line"><span>  WO-003: 12.17小时</span></span>
<span class="line"><span>  总需求: 28.00小时</span></span>
<span class="line"><span>  可用产能: 36.72小时</span></span>
<span class="line"><span>  负荷率: 28/36.72 = 76.3% ✅</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、核心实体" tabindex="-1"><a class="header-anchor" href="#三、核心实体"><span>三、核心实体</span></a></h2><h3 id="_3-1-产能计划" tabindex="-1"><a class="header-anchor" href="#_3-1-产能计划"><span>3.1 产能计划</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>CapacityPlan (产能计划)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── PlanNo: string(30)</span></span>
<span class="line"><span>├── PlanName: string(100)</span></span>
<span class="line"><span>├── MRPRunId: Guid                     # 关联 MRP 运算</span></span>
<span class="line"><span>├── PlanHorizon: int                   # 计划周期（周数）</span></span>
<span class="line"><span>├── StartDate: DateTime</span></span>
<span class="line"><span>├── EndDate: DateTime</span></span>
<span class="line"><span>├── Status: CRPStatus</span></span>
<span class="line"><span>├── CreatedBy: Guid</span></span>
<span class="line"><span>└── WorkCenterLoads: List&lt;WorkCenterLoad&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>WorkCenterLoad (工作中心负荷)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── CapacityPlanId: Guid</span></span>
<span class="line"><span>├── WorkCenterId: Guid</span></span>
<span class="line"><span>├── WorkCenterCode: string(20)</span></span>
<span class="line"><span>├── WorkCenterName: string(100)</span></span>
<span class="line"><span>├── PeriodStart: DateTime              # 期间起始</span></span>
<span class="line"><span>├── PeriodEnd: DateTime</span></span>
<span class="line"><span>├── AvailableCapacity: decimal(18,2)  # 可用产能（小时）</span></span>
<span class="line"><span>├── RequiredCapacity: decimal(18,2)   # 需求产能（小时）</span></span>
<span class="line"><span>├── LoadPercentage: decimal(5,2)      # 负荷率 (%)</span></span>
<span class="line"><span>├── OverloadHours: decimal(18,2)      # 超载小时数</span></span>
<span class="line"><span>├── Status: LoadStatus</span></span>
<span class="line"><span>└── Details: List&lt;LoadDetail&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LoadDetail (负荷明细)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── WorkCenterLoadId: Guid</span></span>
<span class="line"><span>├── WorkOrderId: Guid?                 # 工单ID（已有的）</span></span>
<span class="line"><span>├── PlannedOrderId: Guid?              # 计划订单ID（MRP生成的）</span></span>
<span class="line"><span>├── ProductCode: string(50)</span></span>
<span class="line"><span>├── Quantity: decimal(18,4)</span></span>
<span class="line"><span>├── OperationNo: int</span></span>
<span class="line"><span>├── SetupHours: decimal(18,2)</span></span>
<span class="line"><span>├── RunHours: decimal(18,2)</span></span>
<span class="line"><span>├── TotalHours: decimal(18,2)</span></span>
<span class="line"><span>└── StartDate: DateTime</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  CRPStatus: Draft=0, Calculated=1, Confirmed=2</span></span>
<span class="line"><span>  LoadStatus: Normal=1(正常,&lt;85%), Warning=2(预警,85-100%), </span></span>
<span class="line"><span>              Overloaded=3(超载,&gt;100%)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-工作日历" tabindex="-1"><a class="header-anchor" href="#_3-2-工作日历"><span>3.2 工作日历</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>WorkCalendar (工作日历)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── Code: string(20)</span></span>
<span class="line"><span>├── Name: string(100)</span></span>
<span class="line"><span>├── WorkDays: string(7)                # 工作日 (1111100 = 周一至周五)</span></span>
<span class="line"><span>├── ShiftsPerDay: int                  # 每日班次</span></span>
<span class="line"><span>├── HoursPerShift: decimal(5,2)       # 每班小时</span></span>
<span class="line"><span>├── Efficiency: decimal(5,2)          # 效率系数</span></span>
<span class="line"><span>├── Utilization: decimal(5,2)         # 利用率</span></span>
<span class="line"><span>└── Exceptions: List&lt;CalendarException&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CalendarException (日历例外)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── CalendarId: Guid</span></span>
<span class="line"><span>├── Date: DateTime</span></span>
<span class="line"><span>├── Type: ExceptionType                # 类型</span></span>
<span class="line"><span>├── AvailableHours: decimal(5,2)?     # 可用小时（加班时）</span></span>
<span class="line"><span>└── Reason: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  ExceptionType: Holiday=1(节假日,0产能), Overtime=2(加班,额外产能),</span></span>
<span class="line"><span>                 Maintenance=3(维护,0产能)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="四、产能负荷图" tabindex="-1"><a class="header-anchor" href="#四、产能负荷图"><span>四、产能负荷图</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>工作中心 WC-01 未来5周负荷:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>100%│                    ████</span></span>
<span class="line"><span>    │          ████      ████      ████</span></span>
<span class="line"><span> 85%│-------████████------████------████------  预警线</span></span>
<span class="line"><span>    │  ████  ████████    ████████  ████</span></span>
<span class="line"><span> 70%│  ████  ████████    ████████  ████</span></span>
<span class="line"><span>    │  ████  ████████    ████████  ████████</span></span>
<span class="line"><span> 50%│  ████  ████████    ████████  ████████</span></span>
<span class="line"><span>    │  ████  ████████    ████████  ████████</span></span>
<span class="line"><span>    └──────┬──────┬──────┬──────┬──────┬──</span></span>
<span class="line"><span>          W1    W2    W3    W4    W5</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    W1: 76% ✅  W2: 95% ⚠️  W3: 108% ❌  W4: 88% ⚠️  W5: 72% ✅</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="五、产能调整策略" tabindex="-1"><a class="header-anchor" href="#五、产能调整策略"><span>五、产能调整策略</span></a></h2><table><thead><tr><th>策略</th><th>说明</th><th>适用场景</th></tr></thead><tbody><tr><td><strong>加班</strong></td><td>增加工作时间</td><td>短期轻微超载</td></tr><tr><td><strong>增加班次</strong></td><td>开第二/三班</td><td>持续性超载</td></tr><tr><td><strong>外协加工</strong></td><td>部分工序外协</td><td>特定工序瓶颈</td></tr><tr><td><strong>提前生产</strong></td><td>将后期订单提前</td><td>前期有空闲</td></tr><tr><td><strong>推迟订单</strong></td><td>调整交期</td><td>非紧急订单</td></tr><tr><td><strong>调整MPS</strong></td><td>减少/推迟成品计划</td><td>严重超载</td></tr><tr><td><strong>增加设备</strong></td><td>购买/租赁设备</td><td>长期产能不足</td></tr><tr><td><strong>优化工艺</strong></td><td>缩短工序时间</td><td>长期改善</td></tr></tbody></table><h2 id="六、api-接口设计" tabindex="-1"><a class="header-anchor" href="#六、api-接口设计"><span>六、API 接口设计</span></a></h2><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>POST</td><td><code>/api/mrp/crp/calculate</code></td><td>执行 CRP 计算</td></tr><tr><td>GET</td><td><code>/api/mrp/crp/plans</code></td><td>产能计划列表</td></tr><tr><td>GET</td><td><code>/api/mrp/crp/plans/{id}</code></td><td>计划详情</td></tr><tr><td>GET</td><td><code>/api/mrp/crp/plans/{id}/work-center-loads</code></td><td>工作中心负荷</td></tr><tr><td>GET</td><td><code>/api/mrp/crp/plans/{id}/overloaded</code></td><td>超载工作中心列表</td></tr><tr><td>GET</td><td><code>/api/mrp/crp/load-chart/{workCenterId}</code></td><td>负荷图数据</td></tr><tr><td>POST</td><td><code>/api/mrp/crp/plans/{id}/confirm</code></td><td>确认产能计划</td></tr><tr><td>GET</td><td><code>/api/mrp/crp/calendars</code></td><td>工作日历列表</td></tr><tr><td>POST</td><td><code>/api/mrp/crp/calendars</code></td><td>创建工作日历</td></tr><tr><td>PUT</td><td><code>/api/mrp/crp/calendars/{id}</code></td><td>修改工作日历</td></tr><tr><td>POST</td><td><code>/api/mrp/crp/calendars/{id}/exceptions</code></td><td>添加日历例外</td></tr></tbody></table><h2 id="七、实体关系图" tabindex="-1"><a class="header-anchor" href="#七、实体关系图"><span>七、实体关系图</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────────┐     ┌──────────────────┐</span></span>
<span class="line"><span>│CapacityPlan  │────▶│WorkCenterLoad    │</span></span>
<span class="line"><span>│ 产能计划      │ 1:N │ 工作中心负荷      │</span></span>
<span class="line"><span>└──────────────┘     └──────┬───────────┘</span></span>
<span class="line"><span>                            │ 1:N</span></span>
<span class="line"><span>                            ▼</span></span>
<span class="line"><span>                     ┌──────────────────┐</span></span>
<span class="line"><span>                     │ LoadDetail       │</span></span>
<span class="line"><span>                     │ 负荷明细          │</span></span>
<span class="line"><span>                     └──────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────────────┐     ┌──────────────────┐</span></span>
<span class="line"><span>│ WorkCenter   │◀────│WorkCenterLoad    │</span></span>
<span class="line"><span>│ 工作中心      │     │                  │</span></span>
<span class="line"><span>└──────┬───────┘     └──────────────────┘</span></span>
<span class="line"><span>       │</span></span>
<span class="line"><span>       ▼</span></span>
<span class="line"><span>┌──────────────┐     ┌──────────────────┐</span></span>
<span class="line"><span>│WorkCalendar  │────▶│CalendarException │</span></span>
<span class="line"><span>│ 工作日历      │ 1:N │ 日历例外          │</span></span>
<span class="line"><span>└──────────────┘     └──────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="八、业务规则" tabindex="-1"><a class="header-anchor" href="#八、业务规则"><span>八、业务规则</span></a></h2><table><thead><tr><th>规则</th><th>描述</th></tr></thead><tbody><tr><td>MRP 后执行</td><td>CRP 必须在 MRP 运算完成后执行</td></tr><tr><td>预警阈值</td><td>负荷率 &gt; 85% 标黄预警，&gt; 100% 标红超载</td></tr><tr><td>日历优先</td><td>产能计算优先使用工作中心指定的日历</td></tr><tr><td>效率折算</td><td>可用产能必须考虑效率系数和利用率</td></tr><tr><td>瓶颈优先</td><td>产能分析重点关注瓶颈工作中心</td></tr><tr><td>调整闭环</td><td>调整 MPS/排产后需重新运行 CRP 验证</td></tr><tr><td>历史参考</td><td>产能数据支持与历史实际对比</td></tr><tr><td>外协协同</td><td>外协工序不计入内部产能需求</td></tr></tbody></table>`,25)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};