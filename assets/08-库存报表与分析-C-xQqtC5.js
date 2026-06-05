import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as r}from"./app-CyjyvRPH.js";var i=JSON.parse(`{"path":"/%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F/ERP%E4%B8%9A%E5%8A%A1/05-%E5%BA%93%E5%AD%98%E6%A8%A1%E5%9D%97/08-%E5%BA%93%E5%AD%98%E6%8A%A5%E8%A1%A8%E4%B8%8E%E5%88%86%E6%9E%90.html","title":"库存报表与分析","lang":"zh-CN","frontmatter":{"title":"库存报表与分析","date":"2025-04-18T00:00:00.000Z","author":"Moklgy","category":["ERP业务"],"tag":["ERP","库存"],"order":8},"git":{"createdTime":1776517348000,"updatedTime":1776517348000,"contributors":[{"name":"moklgy","username":"moklgy","email":"moklgy@foxmail.com","commits":1,"url":"https://github.com/moklgy"}]},"readingTime":{"minutes":8.91,"words":2672},"filePathRelative":"业务系统/ERP业务/05-库存模块/08-库存报表与分析.md"}`),a={name:`08-库存报表与分析.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="库存报表与分析" tabindex="-1"><a class="header-anchor" href="#库存报表与分析"><span>库存报表与分析</span></a></h1><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p>库存报表与分析为库存管理决策提供数据支撑。系统提供操作级、分析级和管理级三类报表，覆盖库存余额、收发存、库龄分析、周转分析、呆滞物料、仓库利用率等维度，配合 KPI 仪表板实现库存绩效的实时监控。</p><h2 id="一、报表体系" tabindex="-1"><a class="header-anchor" href="#一、报表体系"><span>一、报表体系</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>库存报表</span></span>
<span class="line"><span>├── 操作报表 (日常)</span></span>
<span class="line"><span>│   ├── 库存余额表          # 当前库存快照</span></span>
<span class="line"><span>│   ├── 库存收发存报表       # 期间出入库汇总</span></span>
<span class="line"><span>│   ├── 待入库明细           # 已到货未完成入库</span></span>
<span class="line"><span>│   ├── 待出库明细           # 已下单未完成出库</span></span>
<span class="line"><span>│   └── 在途库存             # 调拨在途物料</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── 分析报表 (定期)</span></span>
<span class="line"><span>│   ├── 库龄分析报表         # 库存停留时间分布</span></span>
<span class="line"><span>│   ├── 库存周转分析         # 周转率、周转天数</span></span>
<span class="line"><span>│   ├── 呆滞物料报表         # 慢动/死库存</span></span>
<span class="line"><span>│   ├── ABC分类报表          # 帕累托分析</span></span>
<span class="line"><span>│   └── 安全库存预警         # 低于安全库存的物料</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>└── 管理报表 (战略)</span></span>
<span class="line"><span>    ├── 仓库利用率报表       # 空间/容量使用情况</span></span>
<span class="line"><span>    ├── 供需差距分析         # 库存 vs 需求</span></span>
<span class="line"><span>    ├── 库存成本分析         # 持有成本、资金占用</span></span>
<span class="line"><span>    └── KPI 仪表板          # 关键绩效指标汇总</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、库存余额报表" tabindex="-1"><a class="header-anchor" href="#二、库存余额报表"><span>二、库存余额报表</span></a></h2><h3 id="_2-1-报表结构" tabindex="-1"><a class="header-anchor" href="#_2-1-报表结构"><span>2.1 报表结构</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>库存余额报表 (截止日期: 2024-01-31)</span></span>
<span class="line"><span>筛选: 仓库=原材料仓, 状态=可用</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────┬───────┬──────┬──────┬──────┬──────┬───────┬───────┐</span></span>
<span class="line"><span>│物料  │物料名称│单位  │在库量│预留量│可用量│单位成本│库存金额│</span></span>
<span class="line"><span>├──────┼───────┼──────┼──────┼──────┼──────┼───────┼───────┤</span></span>
<span class="line"><span>│M001  │钢板   │张    │ 500  │ 100  │ 400  │ 85.00 │42,500 │</span></span>
<span class="line"><span>│M002  │铝棒   │根    │ 200  │  50  │ 150  │120.00 │24,000 │</span></span>
<span class="line"><span>│M003  │铜线   │卷    │  80  │  20  │  60  │350.00 │28,000 │</span></span>
<span class="line"><span>│M004  │螺栓   │包    │1,000 │ 200  │ 800  │ 15.00 │15,000 │</span></span>
<span class="line"><span>│...   │       │      │      │      │      │       │       │</span></span>
<span class="line"><span>├──────┴───────┴──────┼──────┼──────┼──────┼───────┼───────┤</span></span>
<span class="line"><span>│              合计    │1,780 │ 370  │1,410 │       │109,500│</span></span>
<span class="line"><span>└──────────────────────┴──────┴──────┴──────┴───────┴───────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-钻取维度" tabindex="-1"><a class="header-anchor" href="#_2-2-钻取维度"><span>2.2 钻取维度</span></a></h3><table><thead><tr><th>维度</th><th>说明</th><th>层级</th></tr></thead><tbody><tr><td>仓库</td><td>按仓库汇总</td><td>仓库→库区→库位</td></tr><tr><td>物料分类</td><td>按物料大类汇总</td><td>大类→中类→小类→物料</td></tr><tr><td>批次</td><td>按批次明细</td><td>物料→批次</td></tr><tr><td>库位</td><td>按库位明细</td><td>仓库→库区→库位→物料</td></tr><tr><td>供应商</td><td>按供应来源汇总</td><td>供应商→物料</td></tr></tbody></table><h2 id="三、库存收发存报表" tabindex="-1"><a class="header-anchor" href="#三、库存收发存报表"><span>三、库存收发存报表</span></a></h2><h3 id="_3-1-报表结构" tabindex="-1"><a class="header-anchor" href="#_3-1-报表结构"><span>3.1 报表结构</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>库存收发存报表 (期间: 2024年1月)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────┬───────┬─────────┬─────────────────────┬─────────────────────┬─────────┐</span></span>
<span class="line"><span>│物料  │物料名称│期初余额  │       入库            │       出库            │期末余额  │</span></span>
<span class="line"><span>│      │       ├────┬────┼────┬────┬────┬───────┼────┬────┬────┬───────┼────┬────┤</span></span>
<span class="line"><span>│      │       │数量│金额│采购│完工│退货│小计   │销售│领料│退货│小计   │数量│金额│</span></span>
<span class="line"><span>├──────┼───────┼────┼────┼────┼────┼────┼───────┼────┼────┼────┼───────┼────┼────┤</span></span>
<span class="line"><span>│M001  │钢板   │ 400│34k │ 200│  0 │ 10 │  210  │ 80 │ 30 │  0 │  110  │ 500│42.5k│</span></span>
<span class="line"><span>│M002  │铝棒   │ 150│18k │ 100│  0 │  0 │  100  │ 30 │ 20 │  0 │   50  │ 200│24k │</span></span>
<span class="line"><span>│...   │       │    │    │    │    │    │       │    │    │    │       │    │    │</span></span>
<span class="line"><span>└──────┴───────┴────┴────┴────┴────┴────┴───────┴────┴────┴────┴───────┴────┴────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>校验: 期末数量 = 期初数量 + 入库合计 - 出库合计</span></span>
<span class="line"><span>      期末金额 = 期初金额 + 入库金额 - 出库金额</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="四、库龄分析" tabindex="-1"><a class="header-anchor" href="#四、库龄分析"><span>四、库龄分析</span></a></h2><h3 id="_4-1-库龄分桶" tabindex="-1"><a class="header-anchor" href="#_4-1-库龄分桶"><span>4.1 库龄分桶</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>库龄分析报表</span></span>
<span class="line"><span></span></span>
<span class="line"><span>库龄时段:</span></span>
<span class="line"><span>  0-30天: 新入库，流动性好</span></span>
<span class="line"><span>  31-60天: 正常</span></span>
<span class="line"><span>  61-90天: 关注</span></span>
<span class="line"><span>  91-180天: 预警</span></span>
<span class="line"><span>  181-365天: 呆滞</span></span>
<span class="line"><span>  &gt;365天: 死库存</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬────────┐</span></span>
<span class="line"><span>│物料  │物料名称│0-30天 │31-60天│61-90天│91-180 │181-365│&gt;365天 │ 合计    │</span></span>
<span class="line"><span>├──────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼────────┤</span></span>
<span class="line"><span>│M001  │钢板   │ 200   │ 150   │ 100   │  30   │  20   │   0   │  500   │</span></span>
<span class="line"><span>│M002  │铝棒   │  50   │  50   │  60   │  30   │  10   │   0   │  200   │</span></span>
<span class="line"><span>│M003  │铜线   │  20   │  15   │  10   │  15   │  10   │  10   │   80   │</span></span>
<span class="line"><span>├──────┴───────┼───────┼───────┼───────┼───────┼───────┼───────┼────────┤</span></span>
<span class="line"><span>│    合计      │ 270   │ 215   │ 170   │  75   │  40   │  10   │  780   │</span></span>
<span class="line"><span>│    占比      │ 34.6% │ 27.6% │ 21.8% │ 9.6% │ 5.1% │ 1.3% │ 100%   │</span></span>
<span class="line"><span>│    金额      │ 28k   │ 22k   │ 17k   │  8k  │  4k  │  1k  │  80k   │</span></span>
<span class="line"><span>└──────────────┴───────┴───────┴───────┴───────┴───────┴───────┴────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>库龄 = 当前日期 - 入库日期 (按批次/成本层的入库时间计算)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-库龄健康度" tabindex="-1"><a class="header-anchor" href="#_4-2-库龄健康度"><span>4.2 库龄健康度</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>库龄健康度指标:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  健康: 90天内库存占比 &gt; 80%  → ✅ 良好</span></span>
<span class="line"><span>  一般: 90天内库存占比 60-80% → ⚠️ 关注</span></span>
<span class="line"><span>  差:   90天内库存占比 &lt; 60%  → ❌ 需要行动</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  当前: 84.0% → ✅ 良好</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="五、库存周转分析" tabindex="-1"><a class="header-anchor" href="#五、库存周转分析"><span>五、库存周转分析</span></a></h2><h3 id="_5-1-周转指标" tabindex="-1"><a class="header-anchor" href="#_5-1-周转指标"><span>5.1 周转指标</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>库存周转率 = 销售成本 (COGS) / 平均库存金额</span></span>
<span class="line"><span></span></span>
<span class="line"><span>库存周转天数 = 365 / 库存周转率</span></span>
<span class="line"><span>             = 平均库存金额 × 365 / 销售成本</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例:</span></span>
<span class="line"><span>  年销售成本: ¥5,000,000</span></span>
<span class="line"><span>  期初库存:   ¥800,000</span></span>
<span class="line"><span>  期末库存:   ¥1,200,000</span></span>
<span class="line"><span>  平均库存 = (800,000 + 1,200,000) / 2 = ¥1,000,000</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  周转率 = 5,000,000 / 1,000,000 = 5.0 次/年</span></span>
<span class="line"><span>  周转天数 = 365 / 5.0 = 73 天</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-周转分析报表" tabindex="-1"><a class="header-anchor" href="#_5-2-周转分析报表"><span>5.2 周转分析报表</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>库存周转分析 (2024年)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────────┬───────┬───────┬───────┬───────┐</span></span>
<span class="line"><span>│ 物料分类  │ COGS  │平均库存│周转率 │周转天数│</span></span>
<span class="line"><span>├──────────┼───────┼───────┼───────┼───────┤</span></span>
<span class="line"><span>│ 原材料   │ 3,000k│  600k │  5.0  │  73天 │</span></span>
<span class="line"><span>│ 半成品   │ 1,500k│  250k │  6.0  │  61天 │</span></span>
<span class="line"><span>│ 成品     │ 2,000k│  500k │  4.0  │  91天 │</span></span>
<span class="line"><span>├──────────┼───────┼───────┼───────┼───────┤</span></span>
<span class="line"><span>│ 合计     │ 6,500k│1,350k │  4.8  │  76天 │</span></span>
<span class="line"><span>└──────────┴───────┴───────┴───────┴───────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>月度周转率趋势:</span></span>
<span class="line"><span>  100%│</span></span>
<span class="line"><span>     │  ████</span></span>
<span class="line"><span>  80%│  ████  ████</span></span>
<span class="line"><span>     │  ████  ████  ████</span></span>
<span class="line"><span>  60%│  ████  ████  ████  ████</span></span>
<span class="line"><span>     │  ████  ████  ████  ████  ████</span></span>
<span class="line"><span>  40%│  ████  ████  ████  ████  ████  ████</span></span>
<span class="line"><span>     └──────┬──────┬──────┬──────┬──────┬──</span></span>
<span class="line"><span>           1月    2月    3月    4月    5月</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="六、呆滞物料分析" tabindex="-1"><a class="header-anchor" href="#六、呆滞物料分析"><span>六、呆滞物料分析</span></a></h2><h3 id="_6-1-呆滞定义" tabindex="-1"><a class="header-anchor" href="#_6-1-呆滞定义"><span>6.1 呆滞定义</span></a></h3><table><thead><tr><th>分类</th><th>条件</th><th>风险等级</th><th>建议处置</th></tr></thead><tbody><tr><td>慢动物料</td><td>90-180天无出库</td><td>中</td><td>促销/降价销售</td></tr><tr><td>呆滞物料</td><td>181-365天无出库</td><td>高</td><td>退货/调配/折价</td></tr><tr><td>死库存</td><td>&gt;365天无出库</td><td>极高</td><td>报废/残值回收</td></tr></tbody></table><h3 id="_6-2-呆滞物料报表" tabindex="-1"><a class="header-anchor" href="#_6-2-呆滞物料报表"><span>6.2 呆滞物料报表</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>呆滞物料报表 (截止: 2024-01-31)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────┬───────┬────┬────────┬──────────┬───────┬──────────┐</span></span>
<span class="line"><span>│物料  │物料名称│库存│库存金额 │最后出库日 │呆滞天数│风险金额   │</span></span>
<span class="line"><span>├──────┼───────┼────┼────────┼──────────┼───────┼──────────┤</span></span>
<span class="line"><span>│M010  │特殊件A│ 50 │ 25,000 │2023-03-15│ 322天 │ 25,000   │</span></span>
<span class="line"><span>│M015  │旧型号B│ 30 │ 18,000 │2023-05-01│ 275天 │ 18,000   │</span></span>
<span class="line"><span>│M022  │备件C  │100 │  8,000 │2023-08-20│ 164天 │  8,000   │</span></span>
<span class="line"><span>├──────┴───────┴────┼────────┼──────────┼───────┼──────────┤</span></span>
<span class="line"><span>│          合计     │ 51,000 │          │       │ 51,000   │</span></span>
<span class="line"><span>│ 占总库存比例      │  6.2%  │          │       │          │</span></span>
<span class="line"><span>└───────────────────┴────────┴──────────┴───────┴──────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>处置建议:</span></span>
<span class="line"><span>  M010: 建议报废 (已无使用需求)</span></span>
<span class="line"><span>  M015: 建议折价销售 (仍有市场价值)</span></span>
<span class="line"><span>  M022: 暂保留 (偶发性需求备件)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="七、仓库利用率报表" tabindex="-1"><a class="header-anchor" href="#七、仓库利用率报表"><span>七、仓库利用率报表</span></a></h2><h3 id="_7-1-空间利用率" tabindex="-1"><a class="header-anchor" href="#_7-1-空间利用率"><span>7.1 空间利用率</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>仓库利用率报表</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌────────────┬──────┬──────┬──────┬──────────┐</span></span>
<span class="line"><span>│ 仓库/库区   │总库位│已用  │空闲  │利用率    │</span></span>
<span class="line"><span>├────────────┼──────┼──────┼──────┼──────────┤</span></span>
<span class="line"><span>│ 原材料仓    │ 500  │ 380  │ 120  │ 76.0%   │</span></span>
<span class="line"><span>│  ├ 收货区   │  20  │  12  │   8  │ 60.0%   │</span></span>
<span class="line"><span>│  ├ 合格品区 │ 400  │ 320  │  80  │ 80.0%   │</span></span>
<span class="line"><span>│  ├ 不合格区 │  30  │   8  │  22  │ 26.7%   │</span></span>
<span class="line"><span>│  └ 危化品区 │  50  │  40  │  10  │ 80.0%   │</span></span>
<span class="line"><span>│ 成品仓      │ 300  │ 255  │  45  │ 85.0% ⚠️│</span></span>
<span class="line"><span>│  ├ 存储区   │ 200  │ 180  │  20  │ 90.0% ⚠️│</span></span>
<span class="line"><span>│  └ 待发区   │ 100  │  75  │  25  │ 75.0%   │</span></span>
<span class="line"><span>│ 半成品仓    │ 150  │  90  │  60  │ 60.0%   │</span></span>
<span class="line"><span>├────────────┼──────┼──────┼──────┼──────────┤</span></span>
<span class="line"><span>│ 合计        │ 950  │ 725  │ 225  │ 76.3%   │</span></span>
<span class="line"><span>└────────────┴──────┴──────┴──────┴──────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>⚠️ 利用率 &gt; 85% 表示空间紧张</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-容量利用率" tabindex="-1"><a class="header-anchor" href="#_7-2-容量利用率"><span>7.2 容量利用率</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>容量利用率 (成品仓-存储区):</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  重量利用率: 已用 45,000kg / 最大 60,000kg = 75.0%</span></span>
<span class="line"><span>  体积利用率: 已用 1,200m³ / 最大 1,500m³  = 80.0%</span></span>
<span class="line"><span>  托盘利用率: 已用 180个  / 最大 200个     = 90.0% ⚠️</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="八、供需差距分析" tabindex="-1"><a class="header-anchor" href="#八、供需差距分析"><span>八、供需差距分析</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>供需差距分析 (未来4周)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────┬───────┬──────┬──────┬──────┬──────┬──────┬──────┐</span></span>
<span class="line"><span>│物料  │物料名称│当前  │W1需求│W2需求│W3需求│W4需求│缺口  │</span></span>
<span class="line"><span>│      │       │库存  │      │      │      │      │      │</span></span>
<span class="line"><span>├──────┼───────┼──────┼──────┼──────┼──────┼──────┼──────┤</span></span>
<span class="line"><span>│M001  │钢板   │ 400  │ 100  │ 120  │  80  │  90  │  -10 │</span></span>
<span class="line"><span>│M002  │铝棒   │ 150  │  50  │  60  │  40  │  50  │  +50 │</span></span>
<span class="line"><span>│M003  │铜线   │  60  │  30  │  25  │  30  │  20  │  -45 │</span></span>
<span class="line"><span>└──────┴───────┴──────┴──────┴──────┴──────┴──────┴──────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>在途补充:</span></span>
<span class="line"><span>  M001: PO-0128, 50件, 预计W2到货 → 调整后缺口: -10+50=+40 ✅</span></span>
<span class="line"><span>  M003: PO-0130, 60件, 预计W1到货 → 调整后缺口: -45+60=+15 ✅</span></span>
<span class="line"><span></span></span>
<span class="line"><span>库存天数 (Days of Supply):</span></span>
<span class="line"><span>  M001: 400 / (390/4) = 4.1周 ≈ 29天</span></span>
<span class="line"><span>  M002: 150 / (200/4) = 3.0周 ≈ 21天</span></span>
<span class="line"><span>  M003:  60 / (105/4) = 2.3周 ≈ 16天 ⚠️ (低于安全库存天数)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="九、kpi-仪表板" tabindex="-1"><a class="header-anchor" href="#九、kpi-仪表板"><span>九、KPI 仪表板</span></a></h2><h3 id="_9-1-核心指标" tabindex="-1"><a class="header-anchor" href="#_9-1-核心指标"><span>9.1 核心指标</span></a></h3><table><thead><tr><th>KPI</th><th>公式</th><th>目标</th><th>数据来源</th></tr></thead><tbody><tr><td>库存准确率</td><td>无差异项 / 总盘点项 × 100%</td><td>≥ 97%</td><td>盘点结果</td></tr><tr><td>订单满足率</td><td>按时足量发货订单 / 总订单 × 100%</td><td>≥ 95%</td><td>出库记录</td></tr><tr><td>库存天数</td><td>平均库存 × 365 / 年消耗</td><td>30-60天</td><td>估值/消耗</td></tr><tr><td>库存周转率</td><td>COGS / 平均库存</td><td>≥ 6次/年</td><td>财务/估值</td></tr><tr><td>缺货率</td><td>缺货次数 / 总需求次数 × 100%</td><td>≤ 2%</td><td>出库/需求</td></tr><tr><td>持有成本率</td><td>年持有成本 / 平均库存 × 100%</td><td>≤ 25%</td><td>财务/估值</td></tr><tr><td>上架周期</td><td>平均上架完成时间</td><td>≤ 4小时</td><td>上架任务</td></tr><tr><td>拣货准确率</td><td>正确拣货次数 / 总拣货次数 × 100%</td><td>≥ 99.5%</td><td>拣货任务</td></tr><tr><td>收货准时率</td><td>按时完成收货 / 总收货 × 100%</td><td>≥ 95%</td><td>入库记录</td></tr><tr><td>呆滞库存比</td><td>呆滞库存金额 / 总库存金额 × 100%</td><td>≤ 5%</td><td>库龄分析</td></tr></tbody></table><h3 id="_9-2-仪表板布局" tabindex="-1"><a class="header-anchor" href="#_9-2-仪表板布局"><span>9.2 仪表板布局</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌─────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  库存管理仪表板                           日期: 2024-01-31  │</span></span>
<span class="line"><span>├────────────────┬────────────────┬────────────────────────┤</span></span>
<span class="line"><span>│ 总库存金额      │ 库存准确率      │ 订单满足率              │</span></span>
<span class="line"><span>│ ¥ 8,250,000    │   97.5%  ✅   │   96.2%  ✅            │</span></span>
<span class="line"><span>│ 较上月 +3.2%   │   目标: 97%   │   目标: 95%            │</span></span>
<span class="line"><span>├────────────────┼────────────────┼────────────────────────┤</span></span>
<span class="line"><span>│ 库存周转率      │ 库存天数        │ 缺货率                  │</span></span>
<span class="line"><span>│   5.2 次/年    │   70天  ⚠️    │   1.8%  ✅             │</span></span>
<span class="line"><span>│ 较上月 +0.3    │  目标: &lt;60天   │  目标: &lt;2%             │</span></span>
<span class="line"><span>├────────────────┴────────────────┴────────────────────────┤</span></span>
<span class="line"><span>│                                                         │</span></span>
<span class="line"><span>│  库龄分布           周转率趋势          仓库利用率         │</span></span>
<span class="line"><span>│  ┌──────────┐     ┌──────────┐      ┌──────────┐       │</span></span>
<span class="line"><span>│  │ ████ 35% │     │    /\\    │      │ ████ 76% │       │</span></span>
<span class="line"><span>│  │ ████ 28% │     │   /  \\  │      │ ████ 85% │       │</span></span>
<span class="line"><span>│  │ ████ 22% │     │  /    \\ │      │ ████ 60% │       │</span></span>
<span class="line"><span>│  │ ██   10% │     │ /      \\│      │          │       │</span></span>
<span class="line"><span>│  │ █     5% │     │/        │      │          │       │</span></span>
<span class="line"><span>│  └──────────┘     └──────────┘      └──────────┘       │</span></span>
<span class="line"><span>│  0-30 31-60 61+   1月 2月 3月 4月    原料 成品 半成品     │</span></span>
<span class="line"><span>│                                                         │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│ 预警                                                    │</span></span>
<span class="line"><span>│ ⚠️ 5个物料低于安全库存  ❌ 3个物料呆滞超180天            │</span></span>
<span class="line"><span>│ ⚠️ 成品仓利用率85%     ⚠️ 8个批次30天内过期             │</span></span>
<span class="line"><span>└─────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="十、报表实体" tabindex="-1"><a class="header-anchor" href="#十、报表实体"><span>十、报表实体</span></a></h2><h3 id="_10-1-报表模板" tabindex="-1"><a class="header-anchor" href="#_10-1-报表模板"><span>10.1 报表模板</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>InventoryReportTemplate (库存报表模板)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── Code: string(20)                   # 模板编码</span></span>
<span class="line"><span>├── Name: string(100)                  # 模板名称</span></span>
<span class="line"><span>├── ReportType: InventoryReportType    # 报表类型</span></span>
<span class="line"><span>├── IsSystem: bool                     # 是否系统预设</span></span>
<span class="line"><span>├── Description: string(500)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── Columns: string                    # 列定义 (JSON)</span></span>
<span class="line"><span>├── Filters: string                    # 默认筛选 (JSON)</span></span>
<span class="line"><span>├── GroupBy: string                    # 分组维度 (JSON)</span></span>
<span class="line"><span>├── SortBy: string                     # 排序规则 (JSON)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── IsActive: bool</span></span>
<span class="line"><span>└── CreatedBy: Guid</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  InventoryReportType:</span></span>
<span class="line"><span>    StockBalance=1(库存余额), StockMovement=2(收发存),</span></span>
<span class="line"><span>    Aging=3(库龄分析), Turnover=4(周转分析),</span></span>
<span class="line"><span>    SlowMoving=5(呆滞物料), WarehouseUtilization=6(仓库利用率),</span></span>
<span class="line"><span>    ABCClassification=7(ABC分类), DemandSupply=8(供需分析),</span></span>
<span class="line"><span>    KPIDashboard=9(KPI仪表板), SafetyStockAlert=10(安全库存预警)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-2-报表实例" tabindex="-1"><a class="header-anchor" href="#_10-2-报表实例"><span>10.2 报表实例</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>InventoryReportInstance (库存报表实例)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── TemplateId: Guid</span></span>
<span class="line"><span>├── ReportName: string(100)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── Parameters: string                 # 生成参数 (JSON)</span></span>
<span class="line"><span>├── GeneratedDate: DateTime</span></span>
<span class="line"><span>├── GeneratedBy: Guid</span></span>
<span class="line"><span>├── PeriodStart: DateTime?             # 报表期间起</span></span>
<span class="line"><span>├── PeriodEnd: DateTime?               # 报表期间止</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── Data: string                       # 报表数据 (JSON)</span></span>
<span class="line"><span>├── Summary: string?                   # 汇总数据 (JSON)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── Status: ReportStatus</span></span>
<span class="line"><span>├── ExportFormat: string(10)?          # 导出格式 (PDF/Excel)</span></span>
<span class="line"><span>└── FileUrl: string(500)?             # 导出文件URL</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  ReportStatus:</span></span>
<span class="line"><span>    Generating=1(生成中), Ready=2(已就绪),</span></span>
<span class="line"><span>    Exported=3(已导出), Failed=4(生成失败)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="十一、api-接口设计" tabindex="-1"><a class="header-anchor" href="#十一、api-接口设计"><span>十一、API 接口设计</span></a></h2><h3 id="_11-1-报表查询" tabindex="-1"><a class="header-anchor" href="#_11-1-报表查询"><span>11.1 报表查询</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/inventory/reports/stock-balance</code></td><td>库存余额报表</td></tr><tr><td>GET</td><td><code>/api/inventory/reports/stock-movement</code></td><td>收发存报表</td></tr><tr><td>GET</td><td><code>/api/inventory/reports/aging</code></td><td>库龄分析</td></tr><tr><td>GET</td><td><code>/api/inventory/reports/turnover</code></td><td>周转分析</td></tr><tr><td>GET</td><td><code>/api/inventory/reports/slow-moving</code></td><td>呆滞物料</td></tr><tr><td>GET</td><td><code>/api/inventory/reports/warehouse-utilization</code></td><td>仓库利用率</td></tr><tr><td>GET</td><td><code>/api/inventory/reports/abc-classification</code></td><td>ABC分类</td></tr><tr><td>GET</td><td><code>/api/inventory/reports/demand-supply</code></td><td>供需分析</td></tr><tr><td>GET</td><td><code>/api/inventory/reports/safety-stock-alerts</code></td><td>安全库存预警</td></tr></tbody></table><h3 id="_11-2-kpi-仪表板" tabindex="-1"><a class="header-anchor" href="#_11-2-kpi-仪表板"><span>11.2 KPI 仪表板</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/inventory/reports/kpi-dashboard</code></td><td>KPI 仪表板数据</td></tr><tr><td>GET</td><td><code>/api/inventory/reports/kpi-trend</code></td><td>KPI 趋势数据</td></tr><tr><td>GET</td><td><code>/api/inventory/reports/alerts</code></td><td>库存预警汇总</td></tr></tbody></table><h3 id="_11-3-报表管理" tabindex="-1"><a class="header-anchor" href="#_11-3-报表管理"><span>11.3 报表管理</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/inventory/report-templates</code></td><td>报表模板列表</td></tr><tr><td>POST</td><td><code>/api/inventory/report-templates</code></td><td>创建自定义模板</td></tr><tr><td>PUT</td><td><code>/api/inventory/report-templates/{id}</code></td><td>修改模板</td></tr><tr><td>POST</td><td><code>/api/inventory/reports/generate</code></td><td>生成报表实例</td></tr><tr><td>GET</td><td><code>/api/inventory/report-instances</code></td><td>报表实例列表</td></tr><tr><td>GET</td><td><code>/api/inventory/report-instances/{id}</code></td><td>报表实例详情</td></tr><tr><td>POST</td><td><code>/api/inventory/report-instances/{id}/export</code></td><td>导出报表</td></tr></tbody></table><h2 id="十二、业务规则" tabindex="-1"><a class="header-anchor" href="#十二、业务规则"><span>十二、业务规则</span></a></h2><table><thead><tr><th>规则</th><th>描述</th></tr></thead><tbody><tr><td>期间数据完整</td><td>报表生成前对应期间的数据必须完整（无未确认事务）</td></tr><tr><td>库龄按入库日</td><td>库龄从原始入库日期计算，调拨不重置库龄</td></tr><tr><td>周转排除寄售</td><td>周转率计算排除寄售库存</td></tr><tr><td>ABC 季度重算</td><td>ABC 分类至少每季度重新计算</td></tr><tr><td>KPI 实时刷新</td><td>KPI 仪表板数据支持实时刷新</td></tr><tr><td>预警阈值可配</td><td>安全库存预警、库龄预警等阈值可按租户配置</td></tr><tr><td>报表权限</td><td>不同角色可查看不同级别的报表</td></tr><tr><td>导出格式</td><td>支持 PDF 和 Excel 两种导出格式</td></tr><tr><td>历史保留</td><td>报表实例保留至少12个月供查阅</td></tr><tr><td>数据一致性</td><td>收发存报表的期初+入库-出库必须等于期末</td></tr></tbody></table>`,54)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};