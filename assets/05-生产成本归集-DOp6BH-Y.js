import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as r}from"./app-DgnfxEif.js";var i=JSON.parse(`{"path":"/%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F/ERP%E4%B8%9A%E5%8A%A1/03-%E7%94%9F%E4%BA%A7%E6%A8%A1%E5%9D%97/05-%E7%94%9F%E4%BA%A7%E6%88%90%E6%9C%AC%E5%BD%92%E9%9B%86.html","title":"生产成本归集","lang":"zh-CN","frontmatter":{"title":"生产成本归集","date":"2025-04-18T00:00:00.000Z","author":"Moklgy","category":["ERP业务"],"tag":["ERP","生产"],"order":5},"git":{"createdTime":1776517348000,"updatedTime":1776517348000,"contributors":[{"name":"moklgy","username":"moklgy","email":"moklgy@foxmail.com","commits":1,"url":"https://github.com/moklgy"}]},"readingTime":{"minutes":3.96,"words":1187},"filePathRelative":"业务系统/ERP业务/03-生产模块/05-生产成本归集.md"}`),a={name:`05-生产成本归集.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="生产成本归集" tabindex="-1"><a class="header-anchor" href="#生产成本归集"><span>生产成本归集</span></a></h1><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p>生产成本归集将料（直接材料）、工（直接人工）、费（制造费用）三大要素归集到具体的生产工单/产品，最终形成产品的实际成本。完工入库时将在制品成本转为产成品成本。</p><h2 id="一、成本归集流程" tabindex="-1"><a class="header-anchor" href="#一、成本归集流程"><span>一、成本归集流程</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                    生产成本归集流程                             │</span></span>
<span class="line"><span>│                                                              │</span></span>
<span class="line"><span>│  领料出库 ──────▶ 直接材料成本 ────┐                          │</span></span>
<span class="line"><span>│  (MaterialIssue)   按领料单实际金额  │                          │</span></span>
<span class="line"><span>│                                    │                          │</span></span>
<span class="line"><span>│  报工工时 ──────▶ 直接人工成本 ────┼──▶ 工单成本 ──完工──▶ 产成品│</span></span>
<span class="line"><span>│  (WorkReport)     工时×人工费率     │      (WIP)         (FG)  │</span></span>
<span class="line"><span>│                                    │                          │</span></span>
<span class="line"><span>│  制造费用 ──────▶ 月末分配    ──────┘                          │</span></span>
<span class="line"><span>│  (折旧/水电/间接)  按分配标准                                  │</span></span>
<span class="line"><span>│                                                              │</span></span>
<span class="line"><span>└──────────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、三大成本要素" tabindex="-1"><a class="header-anchor" href="#二、三大成本要素"><span>二、三大成本要素</span></a></h2><h3 id="_2-1-直接材料" tabindex="-1"><a class="header-anchor" href="#_2-1-直接材料"><span>2.1 直接材料</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>来源: 领料单 (MaterialIssue)</span></span>
<span class="line"><span>归集方式: 实时归集，领料确认时即计入工单</span></span>
<span class="line"><span></span></span>
<span class="line"><span>工单直接材料成本 = Σ(各领料行出库金额) - Σ(退料金额)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>出库成本取决于存货计价方法:</span></span>
<span class="line"><span>  加权平均法: 出库单价 = 库存总金额 / 库存总数量</span></span>
<span class="line"><span>  先进先出: 按入库批次的先后顺序</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-直接人工" tabindex="-1"><a class="header-anchor" href="#_2-2-直接人工"><span>2.2 直接人工</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>来源: 报工记录 (WorkReport)</span></span>
<span class="line"><span>归集方式: 实时归集，报工确认时即计入工单</span></span>
<span class="line"><span></span></span>
<span class="line"><span>工单直接人工成本 = Σ(各报工记录工时 × 人工费率)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>人工费率来源:</span></span>
<span class="line"><span>  ① 工作中心费率 (LaborCostRate)</span></span>
<span class="line"><span>  ② 工人个人费率 (如有)</span></span>
<span class="line"><span>  ③ 标准费率 (配置)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-制造费用" tabindex="-1"><a class="header-anchor" href="#_2-3-制造费用"><span>2.3 制造费用</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>来源: 制造费用科目 (4101)</span></span>
<span class="line"><span>归集方式: 月末批量分配</span></span>
<span class="line"><span></span></span>
<span class="line"><span>本月制造费用包括:</span></span>
<span class="line"><span>  ├── 间接材料 (车间耗材)</span></span>
<span class="line"><span>  ├── 间接人工 (车间管理人员工资)</span></span>
<span class="line"><span>  ├── 折旧费 (生产设备折旧)</span></span>
<span class="line"><span>  ├── 水电费 (车间水电)</span></span>
<span class="line"><span>  ├── 维修费 (设备维修)</span></span>
<span class="line"><span>  └── 其他</span></span>
<span class="line"><span></span></span>
<span class="line"><span>分配方式: 详见财务模块 06-成本核算</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、完工入库成本计算" tabindex="-1"><a class="header-anchor" href="#三、完工入库成本计算"><span>三、完工入库成本计算</span></a></h2><h3 id="_3-1-全部完工" tabindex="-1"><a class="header-anchor" href="#_3-1-全部完工"><span>3.1 全部完工</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>当工单全部完工时:</span></span>
<span class="line"><span>  产成品单位成本 = (材料成本 + 人工成本 + 制造费用) / 完工数量</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例:</span></span>
<span class="line"><span>  直接材料: 30,000</span></span>
<span class="line"><span>  直接人工: 15,000</span></span>
<span class="line"><span>  制造费用: 10,000 (分配)</span></span>
<span class="line"><span>  完工数量: 100件</span></span>
<span class="line"><span>  单位成本: 55,000 / 100 = 550 元/件</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-部分完工-约当产量法" tabindex="-1"><a class="header-anchor" href="#_3-2-部分完工-约当产量法"><span>3.2 部分完工（约当产量法）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>当工单部分完工时:</span></span>
<span class="line"><span>  约当产量 = 完工数量 + 在制数量 × 完工百分比</span></span>
<span class="line"><span>  单位成本 = 总成本 / 约当产量</span></span>
<span class="line"><span>  完工成本 = 单位成本 × 完工数量</span></span>
<span class="line"><span>  在制成本 = 单位成本 × (在制数量 × 完工百分比)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例:</span></span>
<span class="line"><span>  完工: 80件, 在制: 20件(完工度50%)</span></span>
<span class="line"><span>  约当产量 = 80 + 20×50% = 90</span></span>
<span class="line"><span>  总成本 = 45,000</span></span>
<span class="line"><span>  单位成本 = 45,000 / 90 = 500</span></span>
<span class="line"><span>  完工成本 = 500 × 80 = 40,000</span></span>
<span class="line"><span>  在制品 = 500 × 10 = 5,000</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="四、会计分录" tabindex="-1"><a class="header-anchor" href="#四、会计分录"><span>四、会计分录</span></a></h2><p><strong>领料出库:</strong></p><table><thead><tr><th>摘要</th><th>科目</th><th>借方</th><th>贷方</th></tr></thead><tbody><tr><td>生产领料 WO-001</td><td>4001 生产成本-直接材料</td><td>30,000.00</td><td></td></tr><tr><td>出库原材料</td><td>1403 原材料</td><td></td><td>30,000.00</td></tr></tbody></table><p><strong>报工人工:</strong></p><table><thead><tr><th>摘要</th><th>科目</th><th>借方</th><th>贷方</th></tr></thead><tbody><tr><td>生产人工 WO-001</td><td>4001 生产成本-直接人工</td><td>15,000.00</td><td></td></tr><tr><td>应付工资</td><td>2211 应付职工薪酬</td><td></td><td>15,000.00</td></tr></tbody></table><p><strong>制造费用分配:</strong></p><table><thead><tr><th>摘要</th><th>科目</th><th>借方</th><th>贷方</th></tr></thead><tbody><tr><td>分配制造费用 WO-001</td><td>4001 生产成本-制造费用</td><td>10,000.00</td><td></td></tr><tr><td>转出制造费用</td><td>4101 制造费用</td><td></td><td>10,000.00</td></tr></tbody></table><p><strong>完工入库:</strong></p><table><thead><tr><th>摘要</th><th>科目</th><th>借方</th><th>贷方</th></tr></thead><tbody><tr><td>完工入库-产品A</td><td>1405 库存商品</td><td>40,000.00</td><td></td></tr><tr><td>结转生产成本</td><td>4001 生产成本</td><td></td><td>40,000.00</td></tr></tbody></table><h2 id="五、成本差异" tabindex="-1"><a class="header-anchor" href="#五、成本差异"><span>五、成本差异</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>标准成本 vs 实际成本:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  标准材料成本: 100件 × 280元 = 28,000</span></span>
<span class="line"><span>  实际材料成本: 30,000</span></span>
<span class="line"><span>  材料差异: +2,000 (不利)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  标准人工成本: 100件 × 130元 = 13,000</span></span>
<span class="line"><span>  实际人工成本: 15,000</span></span>
<span class="line"><span>  人工差异: +2,000 (不利)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  标准制造费用: 100件 × 90元 = 9,000</span></span>
<span class="line"><span>  实际制造费用: 10,000</span></span>
<span class="line"><span>  制造费用差异: +1,000 (不利)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>详细差异分析见: 财务模块/06-成本核算</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="六、api-接口" tabindex="-1"><a class="header-anchor" href="#六、api-接口"><span>六、API 接口</span></a></h2><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/production/work-orders/{id}/cost-summary</code></td><td>工单成本汇总</td></tr><tr><td>GET</td><td><code>/api/production/work-orders/{id}/cost-detail</code></td><td>工单成本明细</td></tr><tr><td>GET</td><td><code>/api/production/cost/wip-report</code></td><td>在制品报表</td></tr><tr><td>POST</td><td><code>/api/production/completions/{id}/calculate-cost</code></td><td>计算完工成本</td></tr></tbody></table><h2 id="七、业务规则" tabindex="-1"><a class="header-anchor" href="#七、业务规则"><span>七、业务规则</span></a></h2><table><thead><tr><th>规则</th><th>描述</th></tr></thead><tbody><tr><td>成本实时归集</td><td>材料和人工在领料/报工时实时计入工单</td></tr><tr><td>制造费用月末</td><td>制造费用在月末统一分配</td></tr><tr><td>完工前必须归集</td><td>完工入库前所有成本要素必须归集完毕</td></tr><tr><td>工单关闭条件</td><td>成本归集、差异分析完成后才能关闭</td></tr><tr><td>成本不可为负</td><td>产品单位成本不可为负</td></tr><tr><td>退料冲减</td><td>退料自动减少工单材料成本</td></tr><tr><td>报废损失</td><td>报废品的成本计入工单总成本（非正常损失除外）</td></tr><tr><td>跨月工单</td><td>跨月工单按月归集，月末计算在制品</td></tr></tbody></table>`,32)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};