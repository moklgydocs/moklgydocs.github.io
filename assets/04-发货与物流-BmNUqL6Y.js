import{D as e,f as t,u as n}from"./runtime-core.esm-bundler-D3eD_xTR.js";import{t as r}from"./app-C_mnsEHS.js";var i=JSON.parse(`{"path":"/%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F/ERP%E4%B8%9A%E5%8A%A1/06-%E9%94%80%E5%94%AE%E6%A8%A1%E5%9D%97/04-%E5%8F%91%E8%B4%A7%E4%B8%8E%E7%89%A9%E6%B5%81.html","title":"发货与物流","lang":"zh-CN","frontmatter":{"title":"发货与物流","date":"2025-04-18T00:00:00.000Z","author":"Moklgy","category":["ERP业务"],"tag":["ERP","销售"],"order":5},"git":{"createdTime":1776517348000,"updatedTime":1776517348000,"contributors":[{"name":"moklgy","username":"moklgy","email":"moklgy@foxmail.com","commits":1,"url":"https://github.com/moklgy"}]},"readingTime":{"minutes":3.18,"words":955},"filePathRelative":"业务系统/ERP业务/06-销售模块/04-发货与物流.md"}`),a={name:`04-发货与物流.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="发货与物流" tabindex="-1"><a class="header-anchor" href="#发货与物流"><span>发货与物流</span></a></h1><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p>发货管理是销售订单执行的核心环节，覆盖从拣货、包装到发运的完整出库流程。发货确认后扣减库存并触发销售成本结转，物流跟踪则帮助销售和客户实时了解货物状态。</p><h2 id="一、发货流程" tabindex="-1"><a class="header-anchor" href="#一、发货流程"><span>一、发货流程</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>SO 已审批 → 检查库存 → 创建发货单(DN) → 拣货/包装 → 发运确认 → 物流跟踪</span></span>
<span class="line"><span>                │                                          │</span></span>
<span class="line"><span>                ▼                                          ▼</span></span>
<span class="line"><span>          库存不足 → 通知生产/采购              更新 SO 已发数量</span></span>
<span class="line"><span>                                               扣减库存</span></span>
<span class="line"><span>                                               结转销售成本</span></span>
<span class="line"><span>                                               通知客户</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-1-发货单状态机" tabindex="-1"><a class="header-anchor" href="#_1-1-发货单状态机"><span>1.1 发货单状态机</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐</span></span>
<span class="line"><span>│ Draft   │───▶│ Picking  │───▶│ Packed   │───▶│ Shipped  │───▶│ Delivered│</span></span>
<span class="line"><span>│ 草稿    │    │ 拣货中    │    │ 已包装   │    │ 已发运    │    │ 已签收    │</span></span>
<span class="line"><span>└────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘</span></span>
<span class="line"><span>                                                                    │</span></span>
<span class="line"><span>                                                               ┌────┘</span></span>
<span class="line"><span>                                                               ▼</span></span>
<span class="line"><span>                                                          ┌──────────┐</span></span>
<span class="line"><span>                                                          │ Closed   │</span></span>
<span class="line"><span>                                                          │ 已关闭    │</span></span>
<span class="line"><span>                                                          └──────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、核心实体" tabindex="-1"><a class="header-anchor" href="#二、核心实体"><span>二、核心实体</span></a></h2><h3 id="_2-1-发货单" tabindex="-1"><a class="header-anchor" href="#_2-1-发货单"><span>2.1 发货单</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>DeliveryNote (发货单)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── DeliveryNo: string(30)             # 发货单号 DN-{YYYYMMDD}-{SEQ}</span></span>
<span class="line"><span>├── SalesOrderId: Guid                 # 关联 SO</span></span>
<span class="line"><span>├── SalesOrderNo: string(30)</span></span>
<span class="line"><span>├── CustomerId: Guid</span></span>
<span class="line"><span>├── CustomerName: string(200)</span></span>
<span class="line"><span>├── ShippingAddressId: Guid            # 收货地址</span></span>
<span class="line"><span>├── ShippingAddress: string(300)       # 收货地址（冗余）</span></span>
<span class="line"><span>├── ContactName: string(50)            # 收货联系人</span></span>
<span class="line"><span>├── ContactPhone: string(20)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── WarehouseId: Guid                  # 发货仓库</span></span>
<span class="line"><span>├── DeliveryDate: DateTime             # 发货日期</span></span>
<span class="line"><span>├── ExpectedArrivalDate: DateTime?     # 预计到货日期</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── Carrier: string(100)?              # 承运商</span></span>
<span class="line"><span>├── CarrierCode: string(50)?           # 承运商编码</span></span>
<span class="line"><span>├── TrackingNo: string(50)?            # 运单号</span></span>
<span class="line"><span>├── ShippingMethod: ShippingMethod     # 运输方式</span></span>
<span class="line"><span>├── FreightAmount: decimal(18,2)?      # 运费</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── TotalQuantity: decimal(18,4)      # 发货总数量</span></span>
<span class="line"><span>├── TotalWeight: decimal(18,4)?       # 总重量 (kg)</span></span>
<span class="line"><span>├── TotalVolume: decimal(18,4)?       # 总体积 (m³)</span></span>
<span class="line"><span>├── PackageCount: int?                 # 包裹数</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── Status: DNStatus</span></span>
<span class="line"><span>├── VoucherId: Guid?                   # 成本结转凭证</span></span>
<span class="line"><span>├── ReceivedBy: string(50)?            # 签收人</span></span>
<span class="line"><span>├── ReceivedAt: DateTime?              # 签收时间</span></span>
<span class="line"><span>├── Remark: string(500)</span></span>
<span class="line"><span>└── Lines: List&lt;DNLine&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DNLine (发货行)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── DeliveryNoteId: Guid</span></span>
<span class="line"><span>├── LineNo: int</span></span>
<span class="line"><span>├── SOLineId: Guid                     # 关联 SO 行</span></span>
<span class="line"><span>├── ItemId: Guid</span></span>
<span class="line"><span>├── ItemCode: string(50)</span></span>
<span class="line"><span>├── ItemName: string(200)</span></span>
<span class="line"><span>├── UnitOfMeasure: string(20)</span></span>
<span class="line"><span>├── OrderedQuantity: decimal(18,4)    # 订单数量</span></span>
<span class="line"><span>├── DeliveryQuantity: decimal(18,4)   # 本次发货数量</span></span>
<span class="line"><span>├── WarehouseId: Guid                  # 行级发货仓库</span></span>
<span class="line"><span>├── LocationId: Guid?                  # 库位</span></span>
<span class="line"><span>├── BatchNo: string(50)?              # 批次</span></span>
<span class="line"><span>├── SerialNumbers: string(1000)?       # 序列号（逗号分隔）</span></span>
<span class="line"><span>├── UnitCost: decimal(18,6)?          # 出库单位成本</span></span>
<span class="line"><span>├── CostAmount: decimal(18,2)?        # 出库成本金额</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  ShippingMethod: Express=1(快递), Freight=2(货运), SelfPickup=3(自提),</span></span>
<span class="line"><span>                  ThirdPartyLogistics=4(第三方物流), Other=9</span></span>
<span class="line"><span>  DNStatus: Draft=0, Picking=1, Packed=2, Shipped=3, Delivered=4, Closed=5</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-物流跟踪" tabindex="-1"><a class="header-anchor" href="#_2-2-物流跟踪"><span>2.2 物流跟踪</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>ShipmentTracking (物流跟踪)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── DeliveryNoteId: Guid</span></span>
<span class="line"><span>├── TrackingNo: string(50)</span></span>
<span class="line"><span>├── Carrier: string(100)</span></span>
<span class="line"><span>├── TrackingTime: DateTime             # 物流时间</span></span>
<span class="line"><span>├── Location: string(200)              # 当前位置</span></span>
<span class="line"><span>├── StatusDescription: string(200)     # 状态描述</span></span>
<span class="line"><span>├── EventType: TrackingEvent           # 事件类型</span></span>
<span class="line"><span>└── RawData: string(2000)?             # 原始物流数据</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  TrackingEvent: PickedUp=1(揽件), InTransit=2(运输中), </span></span>
<span class="line"><span>                 ArrivedHub=3(到达中转), OutForDelivery=4(派送中),</span></span>
<span class="line"><span>                 Delivered=5(已签收), Exception=6(异常)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、出库成本结转" tabindex="-1"><a class="header-anchor" href="#三、出库成本结转"><span>三、出库成本结转</span></a></h2><p>发货确认时自动结转销售成本：</p><table><thead><tr><th>摘要</th><th>科目</th><th>借方</th><th>贷方</th></tr></thead><tbody><tr><td>结转销售成本</td><td>5401 主营业务成本</td><td>xxx</td><td></td></tr><tr><td>出库商品</td><td>1405 库存商品</td><td></td><td>xxx</td></tr></tbody></table><p>成本取值方式取决于存货计价方法（加权平均/FIFO/个别计价）。</p><h2 id="四、api-接口设计" tabindex="-1"><a class="header-anchor" href="#四、api-接口设计"><span>四、API 接口设计</span></a></h2><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/sales/delivery-notes</code></td><td>发货单列表</td></tr><tr><td>GET</td><td><code>/api/sales/delivery-notes/{id}</code></td><td>发货单详情</td></tr><tr><td>POST</td><td><code>/api/sales/delivery-notes</code></td><td>创建发货单</td></tr><tr><td>PUT</td><td><code>/api/sales/delivery-notes/{id}</code></td><td>修改发货单（Draft）</td></tr><tr><td>POST</td><td><code>/api/sales/delivery-notes/{id}/pick</code></td><td>开始拣货</td></tr><tr><td>POST</td><td><code>/api/sales/delivery-notes/{id}/pack</code></td><td>完成包装</td></tr><tr><td>POST</td><td><code>/api/sales/delivery-notes/{id}/ship</code></td><td>发运确认</td></tr><tr><td>POST</td><td><code>/api/sales/delivery-notes/{id}/deliver</code></td><td>签收确认</td></tr><tr><td>GET</td><td><code>/api/sales/delivery-notes/{id}/tracking</code></td><td>物流跟踪</td></tr><tr><td>POST</td><td><code>/api/sales/delivery-notes/{id}/tracking</code></td><td>更新物流信息</td></tr><tr><td>GET</td><td><code>/api/sales/delivery-notes/export/{id}</code></td><td>导出发货单</td></tr></tbody></table><h2 id="五、实体关系图" tabindex="-1"><a class="header-anchor" href="#五、实体关系图"><span>五、实体关系图</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────────┐     ┌──────────────┐     ┌────────────────┐</span></span>
<span class="line"><span>│ SalesOrder   │────▶│ DeliveryNote │────▶│ DNLine         │</span></span>
<span class="line"><span>│ 销售订单      │     │ 发货单        │ 1:N │ 发货行          │</span></span>
<span class="line"><span>└──────────────┘     └──────┬───────┘     └────────────────┘</span></span>
<span class="line"><span>                            │</span></span>
<span class="line"><span>                            │ 1:N</span></span>
<span class="line"><span>                            ▼</span></span>
<span class="line"><span>                     ┌────────────────┐</span></span>
<span class="line"><span>                     │ShipmentTracking│</span></span>
<span class="line"><span>                     │ 物流跟踪        │</span></span>
<span class="line"><span>                     └────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="六、业务规则" tabindex="-1"><a class="header-anchor" href="#六、业务规则"><span>六、业务规则</span></a></h2><table><thead><tr><th>规则</th><th>描述</th></tr></thead><tbody><tr><td>必须关联 SO</td><td>发货必须关联已审批的销售订单</td></tr><tr><td>库存充足</td><td>发货数量不得超过可用库存</td></tr><tr><td>超发限制</td><td>不得超过 SO 行剩余未发数量</td></tr><tr><td>批次追溯</td><td>启用批次管理的物料必须记录批次</td></tr><tr><td>发运后不可改</td><td>Shipped 之后不可修改发货内容</td></tr><tr><td>成本自动结转</td><td>发运确认自动生成成本结转凭证</td></tr><tr><td>SO 状态联动</td><td>发货后自动更新 SO 状态为 PartShipped/Shipped</td></tr><tr><td>签收确认</td><td>客户签收后发货单进入 Delivered 状态</td></tr></tbody></table>`,22)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};