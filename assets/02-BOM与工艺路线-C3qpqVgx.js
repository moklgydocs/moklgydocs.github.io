import{O as e,d as t,p as n}from"./runtime-core.esm-bundler-jC72uHyJ.js";import{t as r}from"./app-D5e_MD-d.js";var i=JSON.parse(`{"path":"/%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F/ERP%E4%B8%9A%E5%8A%A1/03-%E7%94%9F%E4%BA%A7%E6%A8%A1%E5%9D%97/02-BOM%E4%B8%8E%E5%B7%A5%E8%89%BA%E8%B7%AF%E7%BA%BF.html","title":"BOM与工艺路线","lang":"zh-CN","frontmatter":{"title":"BOM与工艺路线","date":"2025-04-18T00:00:00.000Z","author":"Moklgy","category":["ERP业务"],"tag":["ERP","生产"],"order":2},"git":{"createdTime":1776517348000,"updatedTime":1776517348000,"contributors":[{"name":"moklgy","username":"moklgy","email":"moklgy@foxmail.com","commits":1,"url":"https://github.com/moklgy"}]},"readingTime":{"minutes":4.17,"words":1250},"filePathRelative":"业务系统/ERP业务/03-生产模块/02-BOM与工艺路线.md"}`),a={name:`02-BOM与工艺路线.md`};function o(r,i,a,o,s,c){return e(),t(`div`,null,[...i[0]||=[n(`<h1 id="bom-与工艺路线" tabindex="-1"><a class="header-anchor" href="#bom-与工艺路线"><span>BOM 与工艺路线</span></a></h1><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p>BOM（Bill of Materials，物料清单）定义了产品由哪些原材料和零部件组成，工艺路线（Routing）定义了产品的生产工序、所用设备和标准工时。它们是 MRP 运算、生产排程和成本核算的基础数据。</p><h2 id="一、bom-管理" tabindex="-1"><a class="header-anchor" href="#一、bom-管理"><span>一、BOM 管理</span></a></h2><h3 id="_1-1-bom-结构" tabindex="-1"><a class="header-anchor" href="#_1-1-bom-结构"><span>1.1 BOM 结构</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>产品 A (成品)</span></span>
<span class="line"><span>├── 组件 B × 2                    (二级)</span></span>
<span class="line"><span>│   ├── 原材料 D × 3              (三级)</span></span>
<span class="line"><span>│   └── 原材料 E × 1              (三级)</span></span>
<span class="line"><span>├── 组件 C × 1                    (二级)</span></span>
<span class="line"><span>│   ├── 原材料 F × 2              (三级)</span></span>
<span class="line"><span>│   └── 外购件 G × 1              (三级)</span></span>
<span class="line"><span>└── 原材料 H × 5                  (二级)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-bom-实体" tabindex="-1"><a class="header-anchor" href="#_1-2-bom-实体"><span>1.2 BOM 实体</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>BOM (物料清单)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── ProductId: Guid                    # 成品/半成品ID</span></span>
<span class="line"><span>├── ProductCode: string(50)</span></span>
<span class="line"><span>├── ProductName: string(200)</span></span>
<span class="line"><span>├── Version: int                       # BOM 版本号</span></span>
<span class="line"><span>├── BOMType: BOMType                   # BOM 类型</span></span>
<span class="line"><span>├── EffectiveDate: DateTime            # 生效日期</span></span>
<span class="line"><span>├── ExpiryDate: DateTime?              # 失效日期</span></span>
<span class="line"><span>├── Status: BOMStatus</span></span>
<span class="line"><span>├── BatchSize: decimal(18,4)          # 基准批量（标准产出量）</span></span>
<span class="line"><span>├── UnitOfMeasure: string(20)          # 产出单位</span></span>
<span class="line"><span>├── Remark: string(500)</span></span>
<span class="line"><span>└── Items: List&lt;BOMItem&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>BOMItem (BOM 行)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── BOMId: Guid</span></span>
<span class="line"><span>├── LineNo: int</span></span>
<span class="line"><span>├── ComponentId: Guid                  # 组件物料ID</span></span>
<span class="line"><span>├── ComponentCode: string(50)</span></span>
<span class="line"><span>├── ComponentName: string(200)</span></span>
<span class="line"><span>├── Level: int                         # 层级 (1=直接子件)</span></span>
<span class="line"><span>├── Quantity: decimal(18,4)           # 用量 (相对于基准批量)</span></span>
<span class="line"><span>├── UnitOfMeasure: string(20)</span></span>
<span class="line"><span>├── ScrapRate: decimal(5,2)           # 损耗率 (%)</span></span>
<span class="line"><span>├── NetQuantity: decimal(18,4)        # 净用量</span></span>
<span class="line"><span>├── OperationNo: int?                  # 所属工序号（工序在哪步投料）</span></span>
<span class="line"><span>├── SupplyType: SupplyType             # 供应方式</span></span>
<span class="line"><span>├── SubBOMId: Guid?                    # 子BOM (如组件B本身也有BOM)</span></span>
<span class="line"><span>├── IsPhantom: bool                    # 是否虚拟件（不入库，直接展开）</span></span>
<span class="line"><span>├── Alternatives: List&lt;BOMAlternative&gt; # 替代料</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>BOMAlternative (替代料)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── BOMItemId: Guid</span></span>
<span class="line"><span>├── AlternativeItemId: Guid            # 替代物料ID</span></span>
<span class="line"><span>├── AlternativeItemCode: string(50)</span></span>
<span class="line"><span>├── Priority: int                      # 优先级 (1=首选)</span></span>
<span class="line"><span>├── ConversionRate: decimal(18,4)     # 换算比例</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  BOMType: Production=1(生产BOM), Engineering=2(工程BOM), Costing=3(成本BOM)</span></span>
<span class="line"><span>  BOMStatus: Draft=0, Active=1, Expired=2, Obsolete=3</span></span>
<span class="line"><span>  SupplyType: Make=1(自制), Buy=2(外购), Phantom=3(虚拟件), Outsource=4(外协)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、工艺路线" tabindex="-1"><a class="header-anchor" href="#二、工艺路线"><span>二、工艺路线</span></a></h2><h3 id="_2-1-工艺路线实体" tabindex="-1"><a class="header-anchor" href="#_2-1-工艺路线实体"><span>2.1 工艺路线实体</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Routing (工艺路线)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── ProductId: Guid</span></span>
<span class="line"><span>├── ProductCode: string(50)</span></span>
<span class="line"><span>├── Version: int</span></span>
<span class="line"><span>├── EffectiveDate: DateTime</span></span>
<span class="line"><span>├── ExpiryDate: DateTime?</span></span>
<span class="line"><span>├── Status: RoutingStatus</span></span>
<span class="line"><span>├── Remark: string(500)</span></span>
<span class="line"><span>└── Operations: List&lt;RoutingOperation&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RoutingOperation (工序)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── RoutingId: Guid</span></span>
<span class="line"><span>├── OperationNo: int                   # 工序号 (10, 20, 30...)</span></span>
<span class="line"><span>├── OperationName: string(100)         # 工序名称</span></span>
<span class="line"><span>├── WorkCenterId: Guid                 # 工作中心</span></span>
<span class="line"><span>├── WorkCenterName: string(100)</span></span>
<span class="line"><span>├── SetupTime: decimal(18,2)          # 准备时间 (分钟)</span></span>
<span class="line"><span>├── RunTime: decimal(18,2)            # 单件加工时间 (分钟)</span></span>
<span class="line"><span>├── WaitTime: decimal(18,2)           # 等待时间 (分钟)</span></span>
<span class="line"><span>├── MoveTime: decimal(18,2)           # 移动时间 (分钟)</span></span>
<span class="line"><span>├── OverlapPercentage: decimal(5,2)?  # 重叠百分比（并行工序）</span></span>
<span class="line"><span>├── LaborCount: int                    # 需要人数</span></span>
<span class="line"><span>├── MachineCount: int                  # 需要机台数</span></span>
<span class="line"><span>├── ScrapRate: decimal(5,2)           # 工序损耗率</span></span>
<span class="line"><span>├── IsOutsourced: bool                 # 是否外协工序</span></span>
<span class="line"><span>├── OutsourceSupplierId: Guid?         # 外协供应商</span></span>
<span class="line"><span>├── Description: string(500)           # 工序说明</span></span>
<span class="line"><span>└── SortOrder: int</span></span>
<span class="line"><span></span></span>
<span class="line"><span>WorkCenter (工作中心)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── Code: string(20)                   # 编码</span></span>
<span class="line"><span>├── Name: string(100)                  # 名称</span></span>
<span class="line"><span>├── Type: WorkCenterType               # 类型</span></span>
<span class="line"><span>├── DepartmentId: Guid                 # 所属车间/部门</span></span>
<span class="line"><span>├── CostCenterId: Guid?                # 成本中心</span></span>
<span class="line"><span>├── Capacity: decimal(18,2)           # 日产能（标准小时）</span></span>
<span class="line"><span>├── Efficiency: decimal(5,2)          # 效率 (%)</span></span>
<span class="line"><span>├── MachineCount: int                  # 机台数</span></span>
<span class="line"><span>├── LaborCostRate: decimal(18,2)      # 人工费率 (元/小时)</span></span>
<span class="line"><span>├── MachineCostRate: decimal(18,2)    # 机器费率 (元/小时)</span></span>
<span class="line"><span>├── OverheadRate: decimal(18,2)       # 间接费率 (元/小时)</span></span>
<span class="line"><span>├── IsActive: bool</span></span>
<span class="line"><span>├── CalendarId: Guid?                  # 工作日历</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  RoutingStatus: Draft=0, Active=1, Expired=2</span></span>
<span class="line"><span>  WorkCenterType: Machine=1(机器), Assembly=2(装配线), Manual=3(手工), Mixed=4(混合)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-工时计算" tabindex="-1"><a class="header-anchor" href="#_2-2-工时计算"><span>2.2 工时计算</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>工单工时 = Σ(各工序工时)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>单工序工时:</span></span>
<span class="line"><span>  总工时 = 准备时间 + (单件加工时间 × 计划数量) + 等待时间 + 移动时间</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例: 加工 100 件产品</span></span>
<span class="line"><span>  工序10(下料): 准备30min + 100×2min + 等待10min + 移动5min = 245min</span></span>
<span class="line"><span>  工序20(加工): 准备60min + 100×5min + 等待15min + 移动10min = 585min</span></span>
<span class="line"><span>  工序30(组装): 准备20min + 100×3min + 等待5min  + 移动5min  = 330min</span></span>
<span class="line"><span>  总工时 = 245 + 585 + 330 = 1,160 min ≈ 19.3 小时</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、api-接口设计" tabindex="-1"><a class="header-anchor" href="#三、api-接口设计"><span>三、API 接口设计</span></a></h2><h3 id="_3-1-bom-管理" tabindex="-1"><a class="header-anchor" href="#_3-1-bom-管理"><span>3.1 BOM 管理</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/production/boms</code></td><td>BOM 列表</td></tr><tr><td>GET</td><td><code>/api/production/boms/{id}</code></td><td>BOM 详情</td></tr><tr><td>GET</td><td><code>/api/production/boms/product/{productId}</code></td><td>按产品查 BOM</td></tr><tr><td>POST</td><td><code>/api/production/boms</code></td><td>创建 BOM</td></tr><tr><td>PUT</td><td><code>/api/production/boms/{id}</code></td><td>修改 BOM</td></tr><tr><td>POST</td><td><code>/api/production/boms/{id}/activate</code></td><td>激活 BOM</td></tr><tr><td>POST</td><td><code>/api/production/boms/{id}/copy</code></td><td>复制为新版本</td></tr><tr><td>GET</td><td><code>/api/production/boms/{id}/explosion</code></td><td>BOM 展开（多层级）</td></tr><tr><td>GET</td><td><code>/api/production/boms/{id}/where-used</code></td><td>反查（物料用在哪些BOM）</td></tr></tbody></table><h3 id="_3-2-工艺路线" tabindex="-1"><a class="header-anchor" href="#_3-2-工艺路线"><span>3.2 工艺路线</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/production/routings</code></td><td>路线列表</td></tr><tr><td>GET</td><td><code>/api/production/routings/{id}</code></td><td>路线详情</td></tr><tr><td>POST</td><td><code>/api/production/routings</code></td><td>创建路线</td></tr><tr><td>PUT</td><td><code>/api/production/routings/{id}</code></td><td>修改路线</td></tr><tr><td>POST</td><td><code>/api/production/routings/{id}/activate</code></td><td>激活路线</td></tr></tbody></table><h3 id="_3-3-工作中心" tabindex="-1"><a class="header-anchor" href="#_3-3-工作中心"><span>3.3 工作中心</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/production/work-centers</code></td><td>工作中心列表</td></tr><tr><td>POST</td><td><code>/api/production/work-centers</code></td><td>新增工作中心</td></tr><tr><td>PUT</td><td><code>/api/production/work-centers/{id}</code></td><td>修改工作中心</td></tr><tr><td>GET</td><td><code>/api/production/work-centers/{id}/capacity</code></td><td>产能查询</td></tr></tbody></table><h2 id="四、实体关系图" tabindex="-1"><a class="header-anchor" href="#四、实体关系图"><span>四、实体关系图</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────────┐     ┌──────────────┐     ┌──────────────────┐</span></span>
<span class="line"><span>│ Product      │────▶│ BOM          │────▶│ BOMItem          │</span></span>
<span class="line"><span>│ 产品/物料     │     │ 物料清单      │ 1:N │ BOM行            │</span></span>
<span class="line"><span>└──────────────┘     └──────────────┘     └──────┬───────────┘</span></span>
<span class="line"><span>       │                                          │</span></span>
<span class="line"><span>       │                                          ▼</span></span>
<span class="line"><span>       │                                  ┌──────────────────┐</span></span>
<span class="line"><span>       │                                  │ BOMAlternative   │</span></span>
<span class="line"><span>       │                                  │ 替代料            │</span></span>
<span class="line"><span>       │                                  └──────────────────┘</span></span>
<span class="line"><span>       │</span></span>
<span class="line"><span>       ├────▶ Routing ────▶ RoutingOperation</span></span>
<span class="line"><span>       │      工艺路线       工序</span></span>
<span class="line"><span>       │                      │</span></span>
<span class="line"><span>       │                      ▼</span></span>
<span class="line"><span>       │               WorkCenter</span></span>
<span class="line"><span>       │               工作中心</span></span>
<span class="line"><span>       │</span></span>
<span class="line"><span>       └────▶ WorkOrder (引用 BOM + Routing)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="五、业务规则" tabindex="-1"><a class="header-anchor" href="#五、业务规则"><span>五、业务规则</span></a></h2><table><thead><tr><th>规则</th><th>描述</th></tr></thead><tbody><tr><td>同一产品单一有效 BOM</td><td>同一时间只能有一个 Active BOM</td></tr><tr><td>BOM 循环检测</td><td>创建/修改 BOM 时检测循环引用</td></tr><tr><td>版本控制</td><td>修改 BOM 需新建版本，旧版自动失效</td></tr><tr><td>虚拟件展开</td><td>MRP 运算时虚拟件自动展开到下一层</td></tr><tr><td>替代料优先级</td><td>首选替代料库存不足时启用次选</td></tr><tr><td>工序连续</td><td>工序号必须递增，不可跳号但可预留间隔</td></tr><tr><td>工作中心产能</td><td>排产不得超过工作中心日产能</td></tr><tr><td>BOM 展开完整</td><td>所有自制件必须有对应的 BOM</td></tr></tbody></table>`,24)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};