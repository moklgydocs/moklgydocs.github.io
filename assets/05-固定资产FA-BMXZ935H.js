import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as r}from"./app-D7E9GCrC.js";var i=JSON.parse(`{"path":"/%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F/ERP%E4%B8%9A%E5%8A%A1/08-%E8%B4%A2%E5%8A%A1%E6%A8%A1%E5%9D%97/05-%E5%9B%BA%E5%AE%9A%E8%B5%84%E4%BA%A7FA.html","title":"固定资产FA","lang":"zh-CN","frontmatter":{"title":"固定资产FA","date":"2025-04-18T00:00:00.000Z","author":"Moklgy","category":["ERP业务"],"tag":["ERP","财务"],"order":5},"git":{"createdTime":1776517348000,"updatedTime":1776517348000,"contributors":[{"name":"moklgy","username":"moklgy","email":"moklgy@foxmail.com","commits":1,"url":"https://github.com/moklgy"}]},"readingTime":{"minutes":8.1,"words":2431},"filePathRelative":"业务系统/ERP业务/08-财务模块/05-固定资产FA.md"}`),a={name:`05-固定资产FA.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="固定资产-fa-fixed-assets" tabindex="-1"><a class="header-anchor" href="#固定资产-fa-fixed-assets"><span>固定资产 FA (Fixed Assets)</span></a></h1><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p>固定资产（FA）子系统管理企业的长期有形资产（设备、房屋、车辆等），覆盖资产的完整生命周期：从购入登记、折旧计提、资产变动到最终处置报废。它自动生成折旧凭证并更新总账，确保资产价值的准确反映。</p><h2 id="一、核心业务流程" tabindex="-1"><a class="header-anchor" href="#一、核心业务流程"><span>一、核心业务流程</span></a></h2><h3 id="_1-1-资产生命周期" tabindex="-1"><a class="header-anchor" href="#_1-1-资产生命周期"><span>1.1 资产生命周期</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>资产采购/在建转固</span></span>
<span class="line"><span>      │</span></span>
<span class="line"><span>      ▼</span></span>
<span class="line"><span>┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐</span></span>
<span class="line"><span>│ 资产登记   │───▶│ 正常使用   │───▶│ 资产变动   │───▶│ 资产处置   │</span></span>
<span class="line"><span>│ (建卡)    │    │ (计提折旧) │    │ (调拨/改良)│    │ (报废/出售)│</span></span>
<span class="line"><span>└──────────┘    └──────────┘    └──────────┘    └──────────┘</span></span>
<span class="line"><span>                     │</span></span>
<span class="line"><span>                     ▼</span></span>
<span class="line"><span>               月末自动计提折旧</span></span>
<span class="line"><span>               生成折旧凭证</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-资产状态机" tabindex="-1"><a class="header-anchor" href="#_1-2-资产状态机"><span>1.2 资产状态机</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────┐    ┌──────────┐    ┌──────────┐</span></span>
<span class="line"><span>│ InUse    │───▶│ Idle     │───▶│ InUse    │  (闲置后重新启用)</span></span>
<span class="line"><span>│ 使用中    │    │ 闲置      │    │ 使用中    │</span></span>
<span class="line"><span>└──────────┘    └──────────┘    └──────────┘</span></span>
<span class="line"><span>    │                │</span></span>
<span class="line"><span>    │                ▼</span></span>
<span class="line"><span>    │          ┌──────────┐</span></span>
<span class="line"><span>    │          │ UnderRepair│  (维修中)</span></span>
<span class="line"><span>    │          │ 维修中     │</span></span>
<span class="line"><span>    │          └──────────┘</span></span>
<span class="line"><span>    │                │</span></span>
<span class="line"><span>    ▼                ▼</span></span>
<span class="line"><span>┌──────────┐    ┌──────────┐</span></span>
<span class="line"><span>│ Disposing│───▶│ Disposed │</span></span>
<span class="line"><span>│ 处置中    │    │ 已处置    │</span></span>
<span class="line"><span>└──────────┘    └──────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、核心实体" tabindex="-1"><a class="header-anchor" href="#二、核心实体"><span>二、核心实体</span></a></h2><h3 id="_2-1-固定资产卡片" tabindex="-1"><a class="header-anchor" href="#_2-1-固定资产卡片"><span>2.1 固定资产卡片</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>FixedAsset (固定资产)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── AssetCode: string(30)              # 资产编码 FA-{CAT}-{SEQ} (如 FA-EQ-0001)</span></span>
<span class="line"><span>├── AssetName: string(200)             # 资产名称</span></span>
<span class="line"><span>├── CategoryId: Guid                   # 资产类别ID</span></span>
<span class="line"><span>├── CategoryName: string(100)          # 类别名称（冗余）</span></span>
<span class="line"><span>├── Specification: string(200)         # 规格型号</span></span>
<span class="line"><span>├── DepartmentId: Guid                 # 使用部门</span></span>
<span class="line"><span>├── UserId: Guid?                      # 使用人/保管人</span></span>
<span class="line"><span>├── Location: string(200)              # 存放地点</span></span>
<span class="line"><span>├── SupplierName: string(200)?         # 供应商</span></span>
<span class="line"><span>├── PurchaseDate: DateTime             # 购入日期</span></span>
<span class="line"><span>├── StartDepreciationDate: DateTime    # 开始折旧日期</span></span>
<span class="line"><span>├── OriginalValue: decimal(18,2)       # 原值</span></span>
<span class="line"><span>├── AccumulatedDepreciation: decimal(18,2) # 累计折旧</span></span>
<span class="line"><span>├── NetBookValue: decimal(18,2)        # 净值 (原值-累计折旧)</span></span>
<span class="line"><span>├── ResidualRate: decimal(5,2)         # 残值率 (%)</span></span>
<span class="line"><span>├── ResidualValue: decimal(18,2)       # 预计残值</span></span>
<span class="line"><span>├── UsefulLifeMonths: int              # 预计使用月数</span></span>
<span class="line"><span>├── DepreciationMethod: DepreciationMethod # 折旧方法</span></span>
<span class="line"><span>├── MonthlyDepreciation: decimal(18,2) # 月折旧额</span></span>
<span class="line"><span>├── DepreciatedMonths: int             # 已折旧月数</span></span>
<span class="line"><span>├── AccountId: Guid                    # 对应固定资产科目</span></span>
<span class="line"><span>├── DepreciationAccountId: Guid        # 累计折旧科目</span></span>
<span class="line"><span>├── ExpenseAccountId: Guid             # 折旧费用科目</span></span>
<span class="line"><span>├── Status: AssetStatus                # 资产状态</span></span>
<span class="line"><span>├── SourceType: AssetSourceType        # 来源方式</span></span>
<span class="line"><span>├── SourceDocumentId: Guid?            # 来源单据</span></span>
<span class="line"><span>├── Remark: string(500)</span></span>
<span class="line"><span>├── ChangeRecords: List&lt;AssetChange&gt;   # 变动记录</span></span>
<span class="line"><span>└── DepreciationRecords: List&lt;DepreciationRecord&gt; # 折旧记录</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  AssetStatus: InUse=1, Idle=2, UnderRepair=3, Disposing=4, Disposed=5</span></span>
<span class="line"><span>  AssetSourceType: Purchase=1, Construction=2, Donation=3, Investment=4, Transfer=5</span></span>
<span class="line"><span>  DepreciationMethod: StraightLine=1(直线法), DecliningBalance=2(余额递减法),</span></span>
<span class="line"><span>                      SumOfYears=3(年数总和法), UnitsOfProduction=4(工作量法)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-资产类别" tabindex="-1"><a class="header-anchor" href="#_2-2-资产类别"><span>2.2 资产类别</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>AssetCategory (资产类别)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── Code: string(10)                   # 类别编码</span></span>
<span class="line"><span>├── Name: string(100)                  # 类别名称</span></span>
<span class="line"><span>├── ParentId: Guid?                    # 上级类别</span></span>
<span class="line"><span>├── DefaultUsefulLifeMonths: int       # 默认使用年限(月)</span></span>
<span class="line"><span>├── DefaultResidualRate: decimal(5,2)  # 默认残值率</span></span>
<span class="line"><span>├── DefaultDepreciationMethod: DepreciationMethod</span></span>
<span class="line"><span>├── FixedAssetAccountId: Guid          # 默认固定资产科目</span></span>
<span class="line"><span>├── DepreciationAccountId: Guid        # 默认累计折旧科目</span></span>
<span class="line"><span>└── ExpenseAccountId: Guid             # 默认折旧费用科目</span></span>
<span class="line"><span></span></span>
<span class="line"><span>标准类别:</span></span>
<span class="line"><span>  01 - 房屋及建筑物    (20年, 5%)</span></span>
<span class="line"><span>  02 - 机器设备        (10年, 5%)</span></span>
<span class="line"><span>  03 - 运输工具        (4年, 5%)</span></span>
<span class="line"><span>  04 - 电子设备        (3年, 5%)</span></span>
<span class="line"><span>  05 - 办公家具        (5年, 5%)</span></span>
<span class="line"><span>  06 - 其他           (可配置)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-折旧记录" tabindex="-1"><a class="header-anchor" href="#_2-3-折旧记录"><span>2.3 折旧记录</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>DepreciationRecord (折旧记录)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── AssetId: Guid                      # 资产ID</span></span>
<span class="line"><span>├── FiscalPeriodId: Guid               # 会计期间</span></span>
<span class="line"><span>├── DepreciationDate: DateTime         # 折旧日期</span></span>
<span class="line"><span>├── OriginalValue: decimal(18,2)       # 原值</span></span>
<span class="line"><span>├── BeginAccumulated: decimal(18,2)    # 期初累计折旧</span></span>
<span class="line"><span>├── DepreciationAmount: decimal(18,2)  # 本期折旧额</span></span>
<span class="line"><span>├── EndAccumulated: decimal(18,2)      # 期末累计折旧</span></span>
<span class="line"><span>├── NetBookValue: decimal(18,2)        # 期末净值</span></span>
<span class="line"><span>├── VoucherId: Guid?                   # 关联凭证ID</span></span>
<span class="line"><span>└── Remark: string(200)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-4-资产变动" tabindex="-1"><a class="header-anchor" href="#_2-4-资产变动"><span>2.4 资产变动</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>AssetChange (资产变动)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── AssetId: Guid</span></span>
<span class="line"><span>├── ChangeType: AssetChangeType        # 变动类型</span></span>
<span class="line"><span>├── ChangeDate: DateTime               # 变动日期</span></span>
<span class="line"><span>├── ChangeNo: string(30)               # 变动单号</span></span>
<span class="line"><span>├── BeforeValue: decimal(18,2)         # 变动前原值</span></span>
<span class="line"><span>├── AfterValue: decimal(18,2)          # 变动后原值</span></span>
<span class="line"><span>├── BeforeDepartmentId: Guid?          # 变动前部门</span></span>
<span class="line"><span>├── AfterDepartmentId: Guid?           # 变动后部门</span></span>
<span class="line"><span>├── BeforeUsefulLife: int?             # 变动前使用年限</span></span>
<span class="line"><span>├── AfterUsefulLife: int?              # 变动后使用年限</span></span>
<span class="line"><span>├── Reason: string(500)                # 变动原因</span></span>
<span class="line"><span>├── ApprovalStatus: ApprovalStatus</span></span>
<span class="line"><span>├── VoucherId: Guid?</span></span>
<span class="line"><span>└── Remark: string(500)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  AssetChangeType: Transfer=1(部门调拨), Revaluation=2(价值调整),</span></span>
<span class="line"><span>                   LifeChange=3(年限调整), Improvement=4(资本化改良),</span></span>
<span class="line"><span>                   StatusChange=5(状态变更)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-5-资产处置" tabindex="-1"><a class="header-anchor" href="#_2-5-资产处置"><span>2.5 资产处置</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>AssetDisposal (资产处置)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── DisposalNo: string(30)             # 处置单号 DSP-{YYYYMMDD}-{SEQ}</span></span>
<span class="line"><span>├── AssetId: Guid</span></span>
<span class="line"><span>├── AssetCode: string(30)</span></span>
<span class="line"><span>├── AssetName: string(200)</span></span>
<span class="line"><span>├── DisposalType: DisposalType         # 处置方式</span></span>
<span class="line"><span>├── DisposalDate: DateTime             # 处置日期</span></span>
<span class="line"><span>├── OriginalValue: decimal(18,2)       # 原值</span></span>
<span class="line"><span>├── AccumulatedDepreciation: decimal(18,2) # 累计折旧</span></span>
<span class="line"><span>├── NetBookValue: decimal(18,2)        # 账面净值</span></span>
<span class="line"><span>├── DisposalIncome: decimal(18,2)      # 处置收入</span></span>
<span class="line"><span>├── DisposalExpense: decimal(18,2)     # 处置费用 (清理费等)</span></span>
<span class="line"><span>├── DisposalProfit: decimal(18,2)      # 处置损益</span></span>
<span class="line"><span>├── ApprovalStatus: ApprovalStatus</span></span>
<span class="line"><span>├── ApprovedBy: Guid?</span></span>
<span class="line"><span>├── VoucherId: Guid?</span></span>
<span class="line"><span>├── Reason: string(500)                # 处置原因</span></span>
<span class="line"><span>└── Remark: string(500)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  DisposalType: Sale=1(出售), Scrap=2(报废), Donation=3(捐赠), Loss=4(盘亏)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、折旧计算" tabindex="-1"><a class="header-anchor" href="#三、折旧计算"><span>三、折旧计算</span></a></h2><h3 id="_3-1-折旧方法" tabindex="-1"><a class="header-anchor" href="#_3-1-折旧方法"><span>3.1 折旧方法</span></a></h3><p><strong>1. 直线法（年限平均法）— 最常用</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>年折旧额 = (原值 - 残值) / 使用年限</span></span>
<span class="line"><span>月折旧额 = 年折旧额 / 12</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例: 设备原值 120,000，残值率 5%，使用年限 10年</span></span>
<span class="line"><span>  残值 = 120,000 × 5% = 6,000</span></span>
<span class="line"><span>  年折旧额 = (120,000 - 6,000) / 10 = 11,400</span></span>
<span class="line"><span>  月折旧额 = 11,400 / 12 = 950</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>2. 双倍余额递减法</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>年折旧率 = 2 / 使用年限 × 100%</span></span>
<span class="line"><span>年折旧额 = 期初净值 × 年折旧率</span></span>
<span class="line"><span>最后两年改为直线法: (期初净值 - 残值) / 2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例: 设备原值 120,000，残值率 5%，使用年限 5年</span></span>
<span class="line"><span>  年折旧率 = 2/5 = 40%</span></span>
<span class="line"><span>  第1年: 120,000 × 40% = 48,000</span></span>
<span class="line"><span>  第2年: 72,000 × 40% = 28,800</span></span>
<span class="line"><span>  第3年: 43,200 × 40% = 17,280</span></span>
<span class="line"><span>  第4年: (25,920 - 6,000) / 2 = 9,960</span></span>
<span class="line"><span>  第5年: (25,920 - 6,000) / 2 = 9,960</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>3. 年数总和法</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>年折旧率 = 剩余使用年数 / 年数总和</span></span>
<span class="line"><span>年折旧额 = (原值 - 残值) × 年折旧率</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例: 使用年限 5年</span></span>
<span class="line"><span>  年数总和 = 5+4+3+2+1 = 15</span></span>
<span class="line"><span>  第1年: (120,000-6,000) × 5/15 = 38,000</span></span>
<span class="line"><span>  第2年: (120,000-6,000) × 4/15 = 30,400</span></span>
<span class="line"><span>  第3年: (120,000-6,000) × 3/15 = 22,800</span></span>
<span class="line"><span>  第4年: (120,000-6,000) × 2/15 = 15,200</span></span>
<span class="line"><span>  第5年: (120,000-6,000) × 1/15 = 7,600</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>4. 工作量法</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>单位工作量折旧额 = (原值 - 残值) / 预计总工作量</span></span>
<span class="line"><span>月折旧额 = 单位折旧额 × 本月实际工作量</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例: 运输车辆，预计总里程 500,000公里</span></span>
<span class="line"><span>  单位折旧额 = (120,000 - 6,000) / 500,000 = 0.228/公里</span></span>
<span class="line"><span>  本月行驶 3,000公里: 月折旧 = 0.228 × 3,000 = 684</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-折旧凭证-月末批量生成" tabindex="-1"><a class="header-anchor" href="#_3-2-折旧凭证-月末批量生成"><span>3.2 折旧凭证（月末批量生成）</span></a></h3><p><strong>按部门归集折旧费用:</strong></p><table><thead><tr><th>摘要</th><th>科目</th><th>借方</th><th>贷方</th><th>辅助</th></tr></thead><tbody><tr><td>计提折旧-生产设备</td><td>4101 制造费用</td><td>15,000.00</td><td></td><td>部门:生产部</td></tr><tr><td>计提折旧-办公设备</td><td>5602 管理费用</td><td>5,000.00</td><td></td><td>部门:管理部</td></tr><tr><td>计提折旧-销售用车</td><td>5601 销售费用</td><td>2,000.00</td><td></td><td>部门:销售部</td></tr><tr><td>计提折旧</td><td>1602 累计折旧</td><td></td><td>22,000.00</td><td></td></tr></tbody></table><h2 id="四、资产处置会计处理" tabindex="-1"><a class="header-anchor" href="#四、资产处置会计处理"><span>四、资产处置会计处理</span></a></h2><h3 id="_4-1-出售设备" tabindex="-1"><a class="header-anchor" href="#_4-1-出售设备"><span>4.1 出售设备</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>假设: 设备原值 100,000，累计折旧 60,000，出售价 50,000（含税 44,248 + 增值税 5,752）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>步骤1: 转入清理</span></span>
<span class="line"><span>  借: 固定资产清理    40,000    (净值)</span></span>
<span class="line"><span>  借: 累计折旧        60,000</span></span>
<span class="line"><span>  贷: 固定资产        100,000</span></span>
<span class="line"><span></span></span>
<span class="line"><span>步骤2: 确认收入</span></span>
<span class="line"><span>  借: 银行存款        50,000</span></span>
<span class="line"><span>  贷: 固定资产清理    44,248</span></span>
<span class="line"><span>  贷: 应交税费-销项税  5,752</span></span>
<span class="line"><span></span></span>
<span class="line"><span>步骤3: 结转损益</span></span>
<span class="line"><span>  借: 固定资产清理    4,248     (清理收益 = 44,248 - 40,000)</span></span>
<span class="line"><span>  贷: 营业外收入      4,248</span></span>
<span class="line"><span></span></span>
<span class="line"><span>(如果是亏损: 借 营业外支出, 贷 固定资产清理)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-报废设备" tabindex="-1"><a class="header-anchor" href="#_4-2-报废设备"><span>4.2 报废设备</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>假设: 设备原值 80,000，累计折旧 76,000，残料收入 1,000，清理费 500</span></span>
<span class="line"><span></span></span>
<span class="line"><span>步骤1: 转入清理</span></span>
<span class="line"><span>  借: 固定资产清理    4,000</span></span>
<span class="line"><span>  借: 累计折旧        76,000</span></span>
<span class="line"><span>  贷: 固定资产        80,000</span></span>
<span class="line"><span></span></span>
<span class="line"><span>步骤2: 残料收入</span></span>
<span class="line"><span>  借: 原材料/银行存款  1,000</span></span>
<span class="line"><span>  贷: 固定资产清理    1,000</span></span>
<span class="line"><span></span></span>
<span class="line"><span>步骤3: 清理费用</span></span>
<span class="line"><span>  借: 固定资产清理    500</span></span>
<span class="line"><span>  贷: 银行存款        500</span></span>
<span class="line"><span></span></span>
<span class="line"><span>步骤4: 结转净损失</span></span>
<span class="line"><span>  借: 营业外支出      3,500    (4,000 - 1,000 + 500)</span></span>
<span class="line"><span>  贷: 固定资产清理    3,500</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="五、资产盘点" tabindex="-1"><a class="header-anchor" href="#五、资产盘点"><span>五、资产盘点</span></a></h2><h3 id="_5-1-盘点流程" tabindex="-1"><a class="header-anchor" href="#_5-1-盘点流程"><span>5.1 盘点流程</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>① 生成盘点计划（按部门/类别/地点）</span></span>
<span class="line"><span>          │</span></span>
<span class="line"><span>          ▼</span></span>
<span class="line"><span>② 打印盘点表 / 移动端扫码盘点</span></span>
<span class="line"><span>          │</span></span>
<span class="line"><span>          ▼</span></span>
<span class="line"><span>③ 录入实盘结果</span></span>
<span class="line"><span>          │</span></span>
<span class="line"><span>          ▼</span></span>
<span class="line"><span>④ 系统自动对比，生成差异报告</span></span>
<span class="line"><span>   ├── 账实一致  → ✅</span></span>
<span class="line"><span>   ├── 盘盈      → 增加资产登记</span></span>
<span class="line"><span>   └── 盘亏      → 资产处置（盘亏）</span></span>
<span class="line"><span>          │</span></span>
<span class="line"><span>          ▼</span></span>
<span class="line"><span>⑤ 审批差异处理</span></span>
<span class="line"><span>          │</span></span>
<span class="line"><span>          ▼</span></span>
<span class="line"><span>⑥ 生成调整凭证</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="六、api-接口设计" tabindex="-1"><a class="header-anchor" href="#六、api-接口设计"><span>六、API 接口设计</span></a></h2><h3 id="_6-1-资产管理" tabindex="-1"><a class="header-anchor" href="#_6-1-资产管理"><span>6.1 资产管理</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/finance/fa/assets</code></td><td>资产列表（支持类别/部门/状态筛选）</td></tr><tr><td>GET</td><td><code>/api/finance/fa/assets/{id}</code></td><td>资产卡片详情</td></tr><tr><td>POST</td><td><code>/api/finance/fa/assets</code></td><td>新增资产</td></tr><tr><td>PUT</td><td><code>/api/finance/fa/assets/{id}</code></td><td>修改资产信息</td></tr><tr><td>GET</td><td><code>/api/finance/fa/assets/{id}/depreciation-history</code></td><td>折旧历史</td></tr><tr><td>GET</td><td><code>/api/finance/fa/assets/{id}/change-history</code></td><td>变动历史</td></tr></tbody></table><h3 id="_6-2-资产类别" tabindex="-1"><a class="header-anchor" href="#_6-2-资产类别"><span>6.2 资产类别</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/finance/fa/categories</code></td><td>类别列表</td></tr><tr><td>POST</td><td><code>/api/finance/fa/categories</code></td><td>新增类别</td></tr><tr><td>PUT</td><td><code>/api/finance/fa/categories/{id}</code></td><td>修改类别</td></tr></tbody></table><h3 id="_6-3-折旧管理" tabindex="-1"><a class="header-anchor" href="#_6-3-折旧管理"><span>6.3 折旧管理</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>POST</td><td><code>/api/finance/fa/depreciation/preview</code></td><td>折旧预览（不生成凭证）</td></tr><tr><td>POST</td><td><code>/api/finance/fa/depreciation/execute</code></td><td>执行月度折旧（生成凭证）</td></tr><tr><td>GET</td><td><code>/api/finance/fa/depreciation/records</code></td><td>折旧记录查询</td></tr></tbody></table><h3 id="_6-4-资产变动" tabindex="-1"><a class="header-anchor" href="#_6-4-资产变动"><span>6.4 资产变动</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>POST</td><td><code>/api/finance/fa/changes/transfer</code></td><td>部门调拨</td></tr><tr><td>POST</td><td><code>/api/finance/fa/changes/revalue</code></td><td>价值调整</td></tr><tr><td>POST</td><td><code>/api/finance/fa/changes/improve</code></td><td>资本化改良</td></tr></tbody></table><h3 id="_6-5-资产处置" tabindex="-1"><a class="header-anchor" href="#_6-5-资产处置"><span>6.5 资产处置</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>POST</td><td><code>/api/finance/fa/disposals</code></td><td>创建处置单</td></tr><tr><td>POST</td><td><code>/api/finance/fa/disposals/{id}/approve</code></td><td>审批处置</td></tr><tr><td>POST</td><td><code>/api/finance/fa/disposals/{id}/execute</code></td><td>执行处置（生成凭证）</td></tr><tr><td>GET</td><td><code>/api/finance/fa/disposals</code></td><td>处置记录列表</td></tr></tbody></table><h3 id="_6-6-资产盘点" tabindex="-1"><a class="header-anchor" href="#_6-6-资产盘点"><span>6.6 资产盘点</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>POST</td><td><code>/api/finance/fa/inventory/plan</code></td><td>创建盘点计划</td></tr><tr><td>POST</td><td><code>/api/finance/fa/inventory/result</code></td><td>录入盘点结果</td></tr><tr><td>GET</td><td><code>/api/finance/fa/inventory/variance</code></td><td>盘点差异报告</td></tr></tbody></table><h3 id="_6-7-报表" tabindex="-1"><a class="header-anchor" href="#_6-7-报表"><span>6.7 报表</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/finance/fa/reports/summary</code></td><td>资产汇总表</td></tr><tr><td>GET</td><td><code>/api/finance/fa/reports/depreciation</code></td><td>折旧明细表</td></tr><tr><td>GET</td><td><code>/api/finance/fa/reports/disposal</code></td><td>处置汇总表</td></tr></tbody></table><h2 id="七、实体关系图" tabindex="-1"><a class="header-anchor" href="#七、实体关系图"><span>七、实体关系图</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────────┐     ┌──────────────┐</span></span>
<span class="line"><span>│AssetCategory │◀────│ FixedAsset   │</span></span>
<span class="line"><span>│ 资产类别      │     │ 固定资产卡片  │</span></span>
<span class="line"><span>└──────────────┘     └──────┬───────┘</span></span>
<span class="line"><span>                            │</span></span>
<span class="line"><span>              ┌─────────────┼─────────────┐</span></span>
<span class="line"><span>              ▼             ▼             ▼</span></span>
<span class="line"><span>       ┌────────────┐ ┌──────────────┐ ┌─────────────┐</span></span>
<span class="line"><span>       │Depreciation│ │ AssetChange  │ │AssetDisposal│</span></span>
<span class="line"><span>       │Record      │ │ 资产变动      │ │ 资产处置     │</span></span>
<span class="line"><span>       │ 折旧记录    │ │              │ │             │</span></span>
<span class="line"><span>       └────────────┘ └──────────────┘ └─────────────┘</span></span>
<span class="line"><span>              │                               │</span></span>
<span class="line"><span>              ▼                               ▼</span></span>
<span class="line"><span>       ┌────────────┐                  ┌─────────────┐</span></span>
<span class="line"><span>       │ Voucher    │                  │ Voucher     │</span></span>
<span class="line"><span>       │ 折旧凭证    │                  │ 处置凭证     │</span></span>
<span class="line"><span>       └────────────┘                  └─────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="八、业务规则与约束" tabindex="-1"><a class="header-anchor" href="#八、业务规则与约束"><span>八、业务规则与约束</span></a></h2><table><thead><tr><th>规则</th><th>描述</th></tr></thead><tbody><tr><td>资产编码唯一</td><td>同一租户内资产编码不可重复</td></tr><tr><td>残值率范围</td><td>0-100%，一般不超过 5%</td></tr><tr><td>使用年限下限</td><td>不同类别有最低使用年限（税法规定）</td></tr><tr><td>已折旧完不再折旧</td><td>累计折旧 = 原值 - 残值后停止</td></tr><tr><td>折旧按月</td><td>当月增加次月开始折旧，当月减少当月仍计提</td></tr><tr><td>处置需审批</td><td>资产处置必须经过审批流程</td></tr><tr><td>处置前停止折旧</td><td>资产进入处置状态后不再计提折旧</td></tr><tr><td>净值不可为负</td><td>累计折旧不可超过（原值-残值）</td></tr><tr><td>改良增加原值</td><td>资本化改良支出增加资产原值，重新计算折旧</td></tr><tr><td>调拨不影响价值</td><td>部门调拨只变更管理归属，不影响资产价值</td></tr></tbody></table>`,59)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};