import{E as e,d as t,l as n,s as r}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as i}from"./app-DzEYf-SQ.js";var a=JSON.parse(`{"path":"/%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F/ERP%E4%B8%9A%E5%8A%A1/05-%E5%BA%93%E5%AD%98%E6%A8%A1%E5%9D%97/02-%E4%BB%93%E5%BA%93%E4%B8%8E%E5%BA%93%E4%BD%8D%E7%AE%A1%E7%90%86.html","title":"仓库与库位管理","lang":"zh-CN","frontmatter":{"title":"仓库与库位管理","date":"2025-04-18T00:00:00.000Z","author":"Moklgy","category":["ERP业务"],"tag":["ERP","库存"],"order":2},"git":{"createdTime":1776517348000,"updatedTime":1776517348000,"contributors":[{"name":"moklgy","username":"moklgy","email":"moklgy@foxmail.com","commits":1,"url":"https://github.com/moklgy"}]},"readingTime":{"minutes":7.57,"words":2271},"filePathRelative":"业务系统/ERP业务/05-库存模块/02-仓库与库位管理.md"}`),o={name:`02-仓库与库位管理.md`};function s(i,a,o,s,c,l){return e(),n(`div`,null,[...a[0]||=[t(`<h1 id="仓库与库位管理" tabindex="-1"><a class="header-anchor" href="#仓库与库位管理"><span>仓库与库位管理</span></a></h1><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p>仓库与库位管理是库存模块的物理基础，定义企业物料存储的空间结构。系统支持多级仓库层级（仓库→库区→排→货架→库位），配合上架策略和条码/RFID 集成，实现物料的精确定位和高效流转。</p><h2 id="一、仓库层级体系" tabindex="-1"><a class="header-anchor" href="#一、仓库层级体系"><span>一、仓库层级体系</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>企业 (Tenant)</span></span>
<span class="line"><span>├── 原材料仓库 (RM-WH)</span></span>
<span class="line"><span>│   ├── 库区A: 收货暂存区 (Receiving)</span></span>
<span class="line"><span>│   │   ├── 收货码头 A-DOCK-01</span></span>
<span class="line"><span>│   │   └── 收货码头 A-DOCK-02</span></span>
<span class="line"><span>│   ├── 库区B: 待检区 (QC)</span></span>
<span class="line"><span>│   ├── 库区C: 合格品存储区 (Storage)</span></span>
<span class="line"><span>│   │   ├── 排01</span></span>
<span class="line"><span>│   │   │   ├── 货架01</span></span>
<span class="line"><span>│   │   │   │   ├── 库位 C-01-01-01 (排-架-层)</span></span>
<span class="line"><span>│   │   │   │   ├── 库位 C-01-01-02</span></span>
<span class="line"><span>│   │   │   │   └── ...</span></span>
<span class="line"><span>│   │   │   └── 货架02</span></span>
<span class="line"><span>│   │   └── 排02</span></span>
<span class="line"><span>│   ├── 库区D: 不合格品区 (Rejected)</span></span>
<span class="line"><span>│   └── 库区E: 危化品区 (Hazmat)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── 半成品仓库 (WIP-WH)</span></span>
<span class="line"><span>│   ├── 车间线边仓</span></span>
<span class="line"><span>│   └── 半成品暂存区</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── 成品仓库 (FG-WH)</span></span>
<span class="line"><span>│   ├── 库区A: 常规存储区</span></span>
<span class="line"><span>│   ├── 库区B: 待发货区 (Staging)</span></span>
<span class="line"><span>│   └── 库区C: 大件区</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── 备品备件仓 (SP-WH)</span></span>
<span class="line"><span>├── 退货仓 (RT-WH)</span></span>
<span class="line"><span>├── 寄售仓 (CS-WH)</span></span>
<span class="line"><span>└── 在途虚拟仓 (IT-WH)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-1-层级关系" tabindex="-1"><a class="header-anchor" href="#_1-1-层级关系"><span>1.1 层级关系</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────┐</span></span>
<span class="line"><span>│ Warehouse│ 仓库: 物理仓库或虚拟仓库</span></span>
<span class="line"><span>└────┬─────┘</span></span>
<span class="line"><span>     │ 1:N</span></span>
<span class="line"><span>     ▼</span></span>
<span class="line"><span>┌──────────┐</span></span>
<span class="line"><span>│   Zone   │ 库区: 按功能/存储条件划分</span></span>
<span class="line"><span>└────┬─────┘</span></span>
<span class="line"><span>     │ 1:N</span></span>
<span class="line"><span>     ▼</span></span>
<span class="line"><span>┌──────────┐</span></span>
<span class="line"><span>│ Location │ 库位: 最小存储单元 (排-架-层 或自定义编码)</span></span>
<span class="line"><span>└──────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、核心实体" tabindex="-1"><a class="header-anchor" href="#二、核心实体"><span>二、核心实体</span></a></h2><h3 id="_2-1-仓库" tabindex="-1"><a class="header-anchor" href="#_2-1-仓库"><span>2.1 仓库</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Warehouse (仓库)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── Code: string(20)                   # 仓库编码 (如 RM-WH)</span></span>
<span class="line"><span>├── Name: string(100)                  # 仓库名称</span></span>
<span class="line"><span>├── Type: WarehouseType                # 仓库类型</span></span>
<span class="line"><span>├── IsVirtual: bool                    # 是否虚拟仓 (在途仓、寄售仓)</span></span>
<span class="line"><span>├── Address: string(300)               # 地址</span></span>
<span class="line"><span>├── City: string(50)</span></span>
<span class="line"><span>├── Province: string(50)</span></span>
<span class="line"><span>├── Latitude: decimal(10,7)?           # 纬度</span></span>
<span class="line"><span>├── Longitude: decimal(10,7)?          # 经度</span></span>
<span class="line"><span>├── ContactName: string(50)?           # 联系人</span></span>
<span class="line"><span>├── ContactPhone: string(30)?</span></span>
<span class="line"><span>├── ManagerId: Guid?                   # 仓管负责人</span></span>
<span class="line"><span>├── OperatingStartTime: TimeOnly?      # 运营开始时间</span></span>
<span class="line"><span>├── OperatingEndTime: TimeOnly?        # 运营结束时间</span></span>
<span class="line"><span>├── MaxVolume: decimal(18,2)?         # 最大容积 (m³)</span></span>
<span class="line"><span>├── MaxWeight: decimal(18,2)?         # 最大承重 (kg)</span></span>
<span class="line"><span>├── AllowNegativeStock: bool           # 是否允许负库存</span></span>
<span class="line"><span>├── IsDefault: bool                    # 是否默认仓库</span></span>
<span class="line"><span>├── IsActive: bool</span></span>
<span class="line"><span>├── SortOrder: int</span></span>
<span class="line"><span>└── Remark: string(500)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  WarehouseType:</span></span>
<span class="line"><span>    RawMaterial=1(原材料仓), WIP=2(半成品仓), FinishedGoods=3(成品仓),</span></span>
<span class="line"><span>    Spare=4(备品备件仓), Return=5(退货仓), Consignment=6(寄售仓),</span></span>
<span class="line"><span>    Transit=7(在途仓), QualityHold=8(质量冻结仓), Other=9</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-库区" tabindex="-1"><a class="header-anchor" href="#_2-2-库区"><span>2.2 库区</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Zone (库区)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── WarehouseId: Guid</span></span>
<span class="line"><span>├── Code: string(20)                   # 库区编码 (如 C)</span></span>
<span class="line"><span>├── Name: string(100)                  # 库区名称</span></span>
<span class="line"><span>├── ZoneType: ZoneType                 # 库区类型</span></span>
<span class="line"><span>├── StorageClass: StorageClass         # 存储类别</span></span>
<span class="line"><span>├── TemperatureMin: decimal(5,1)?     # 最低温度 (°C)</span></span>
<span class="line"><span>├── TemperatureMax: decimal(5,1)?     # 最高温度 (°C)</span></span>
<span class="line"><span>├── HumidityMin: decimal(5,1)?        # 最低湿度 (%)</span></span>
<span class="line"><span>├── HumidityMax: decimal(5,1)?        # 最高湿度 (%)</span></span>
<span class="line"><span>├── IsHazmat: bool                     # 是否危化品区</span></span>
<span class="line"><span>├── MaxCapacity: decimal(18,2)?       # 最大库位数</span></span>
<span class="line"><span>├── IsActive: bool</span></span>
<span class="line"><span>├── SortOrder: int</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  ZoneType:</span></span>
<span class="line"><span>    Receiving=1(收货区), Storage=2(存储区), Picking=3(拣选区),</span></span>
<span class="line"><span>    Packing=4(打包区), Shipping=5(发货区), QualityCheck=6(质检区),</span></span>
<span class="line"><span>    Staging=7(暂存区), Hazmat=8(危化品区), ColdChain=9(冷链区)</span></span>
<span class="line"><span>  StorageClass:</span></span>
<span class="line"><span>    General=1(常规), ColdChain=2(冷链,2-8°C), Frozen=3(冷冻,&lt;-18°C),</span></span>
<span class="line"><span>    Hazmat=4(危化品), HighValue=5(高值), Bulk=6(散装)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-库位" tabindex="-1"><a class="header-anchor" href="#_2-3-库位"><span>2.3 库位</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Location (库位)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── WarehouseId: Guid</span></span>
<span class="line"><span>├── ZoneId: Guid</span></span>
<span class="line"><span>├── Code: string(30)                   # 库位编码 (如 C-01-02-03)</span></span>
<span class="line"><span>├── Name: string(100)</span></span>
<span class="line"><span>├── Aisle: string(10)?                 # 通道/排</span></span>
<span class="line"><span>├── Rack: string(10)?                  # 货架</span></span>
<span class="line"><span>├── Level: string(10)?                 # 层</span></span>
<span class="line"><span>├── Position: string(10)?              # 位</span></span>
<span class="line"><span>├── LocationType: LocationType         # 库位类型</span></span>
<span class="line"><span>├── StorageClass: StorageClass         # 存储类别 (继承库区或覆盖)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── MaxWeight: decimal(18,2)?         # 最大承重 (kg)</span></span>
<span class="line"><span>├── MaxVolume: decimal(18,4)?         # 最大容积 (m³)</span></span>
<span class="line"><span>├── MaxPallets: int?                   # 最大托盘数</span></span>
<span class="line"><span>├── CurrentWeight: decimal(18,2)?     # 当前重量</span></span>
<span class="line"><span>├── CurrentVolume: decimal(18,4)?     # 当前容积</span></span>
<span class="line"><span>├── CurrentPallets: int?               # 当前托盘数</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── IsPickable: bool                   # 可拣选</span></span>
<span class="line"><span>├── IsPutawayable: bool                # 可上架</span></span>
<span class="line"><span>├── IsMixed: bool                      # 允许混放不同物料</span></span>
<span class="line"><span>├── IsFrozen: bool                     # 是否冻结</span></span>
<span class="line"><span>├── FrozenReason: string(200)?</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── Barcode: string(50)?              # 库位条码</span></span>
<span class="line"><span>├── ABCClass: string(1)?              # 库位 ABC 分级 (A/B/C)</span></span>
<span class="line"><span>├── PickSequence: int?                 # 拣货顺序号</span></span>
<span class="line"><span>├── IsActive: bool</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  LocationType:</span></span>
<span class="line"><span>    Storage=1(存储位), PickFace=2(拣选位), ReceivingDock=3(收货码头),</span></span>
<span class="line"><span>    ShippingDock=4(发货码头), QCArea=5(质检位), StagingArea=6(暂存位),</span></span>
<span class="line"><span>    CrossDock=7(越库位), ReturnArea=8(退货位), DamageArea=9(损坏品位)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、上架策略" tabindex="-1"><a class="header-anchor" href="#三、上架策略"><span>三、上架策略</span></a></h2><h3 id="_3-1-策略实体" tabindex="-1"><a class="header-anchor" href="#_3-1-策略实体"><span>3.1 策略实体</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>PutawayStrategy (上架策略)</span></span>
<span class="line"><span>├── Id: Guid</span></span>
<span class="line"><span>├── TenantId: Guid</span></span>
<span class="line"><span>├── Code: string(20)</span></span>
<span class="line"><span>├── Name: string(100)</span></span>
<span class="line"><span>├── StrategyType: PutawayStrategyType</span></span>
<span class="line"><span>├── Priority: int                      # 优先级 (数字越小优先级越高)</span></span>
<span class="line"><span>├── ApplicableWarehouseId: Guid?       # 适用仓库 (空=所有)</span></span>
<span class="line"><span>├── ApplicableItemCategoryId: Guid?    # 适用物料类别</span></span>
<span class="line"><span>├── ApplicableStorageClass: StorageClass?</span></span>
<span class="line"><span>├── PreferZoneId: Guid?                # 优先库区</span></span>
<span class="line"><span>├── AllowMixedItems: bool              # 允许混放</span></span>
<span class="line"><span>├── MaxLocationUtilization: decimal(5,2)? # 最大库位利用率</span></span>
<span class="line"><span>├── IsActive: bool</span></span>
<span class="line"><span>└── Remark: string(200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>枚举:</span></span>
<span class="line"><span>  PutawayStrategyType:</span></span>
<span class="line"><span>    FixedLocation=1(固定库位),     # 物料有固定存放位，直接上架</span></span>
<span class="line"><span>    NearestEmpty=2(最近空位),      # 距收货区最近的空库位</span></span>
<span class="line"><span>    ClassBased=3(分类上架),        # 按存储类别匹配库区</span></span>
<span class="line"><span>    ZoneBased=4(指定库区),         # 上架到指定库区</span></span>
<span class="line"><span>    Consolidate=5(合并上架),       # 已有同物料的库位优先</span></span>
<span class="line"><span>    Random=6(随机分配)             # 任意可用空库位</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-上架推荐流程" tabindex="-1"><a class="header-anchor" href="#_3-2-上架推荐流程"><span>3.2 上架推荐流程</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>收货确认</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ▼</span></span>
<span class="line"><span>获取物料信息 (存储类别、危化品标识、温度要求)</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ▼</span></span>
<span class="line"><span>匹配上架策略 (按优先级排序)</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ├── 策略1: 固定库位 → 查找物料的固定库位</span></span>
<span class="line"><span>    │   └── 有空间 → 推荐此库位</span></span>
<span class="line"><span>    │   └── 无空间 → 下一策略</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ├── 策略2: 合并上架 → 查找已有同物料的库位</span></span>
<span class="line"><span>    │   └── 有空间 → 推荐此库位</span></span>
<span class="line"><span>    │   └── 无空间 → 下一策略</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ├── 策略3: 分类上架 → 按存储类别筛选库区</span></span>
<span class="line"><span>    │   └── 查找该库区空位 → 推荐</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    └── 兜底: 最近空位 → 任意满足条件的空库位</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ▼</span></span>
<span class="line"><span>生成上架任务 (PutawayTask)</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ▼</span></span>
<span class="line"><span>仓管员执行上架 → 扫码确认</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="四、库位容量与利用率" tabindex="-1"><a class="header-anchor" href="#四、库位容量与利用率"><span>四、库位容量与利用率</span></a></h2><h3 id="_4-1-利用率计算" tabindex="-1"><a class="header-anchor" href="#_4-1-利用率计算"><span>4.1 利用率计算</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>库位利用率:</span></span>
<span class="line"><span>  重量利用率 = CurrentWeight / MaxWeight × 100%</span></span>
<span class="line"><span>  体积利用率 = CurrentVolume / MaxVolume × 100%</span></span>
<span class="line"><span>  托盘利用率 = CurrentPallets / MaxPallets × 100%</span></span>
<span class="line"><span>  综合利用率 = Max(重量利用率, 体积利用率, 托盘利用率)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>库区利用率:</span></span>
<span class="line"><span>  = 已使用库位数 / 总库位数 × 100%</span></span>
<span class="line"><span></span></span>
<span class="line"><span>仓库利用率:</span></span>
<span class="line"><span>  = Σ(各库区已使用库位) / Σ(各库区总库位) × 100%</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-容量预警" tabindex="-1"><a class="header-anchor" href="#_4-2-容量预警"><span>4.2 容量预警</span></a></h3><table><thead><tr><th>级别</th><th>利用率范围</th><th>动作</th></tr></thead><tbody><tr><td>正常</td><td>0 - 70%</td><td>无</td></tr><tr><td>预警</td><td>70% - 85%</td><td>系统提醒</td></tr><tr><td>警告</td><td>85% - 95%</td><td>限制新上架</td></tr><tr><td>满载</td><td>&gt; 95%</td><td>禁止上架</td></tr></tbody></table><h2 id="五、条码-rfid-集成" tabindex="-1"><a class="header-anchor" href="#五、条码-rfid-集成"><span>五、条码/RFID 集成</span></a></h2><h3 id="_5-1-条码体系" tabindex="-1"><a class="header-anchor" href="#_5-1-条码体系"><span>5.1 条码体系</span></a></h3>`,26),r(`table`,null,[r(`thead`,null,[r(`tr`,null,[r(`th`,null,`对象`),r(`th`,null,`条码类型`),r(`th`,null,`格式`),r(`th`,null,`示例`)])]),r(`tbody`,null,[r(`tr`,null,[r(`td`,null,`库位`),r(`td`,null,`Code128`),r(`td`,{库位编码:``},`LOC-{仓库编码}-`),r(`td`,null,`LOC-RMWH-C010203`)]),r(`tr`,null,[r(`td`,null,`物料`),r(`td`,null,`Code128/EAN13`),r(`td`,{物料编码:``}),r(`td`,null,`MAT-20240001`)]),r(`tr`,null,[r(`td`,null,`批次`),r(`td`,null,`Code128`),r(`td`,{批次号:``},`BAT-{物料编码}-`),r(`td`,null,`BAT-MAT001-20240115`)]),r(`tr`,null,[r(`td`,null,`序列号`),r(`td`,null,`Code128`),r(`td`,{序列号:``},`SN-{物料编码}-`),r(`td`,null,`SN-MAT001-00001`)]),r(`tr`,null,[r(`td`,null,`入库单`),r(`td`,null,`QR Code`),r(`td`,{行号:``},`{入库单号}-`),r(`td`,null,`RO-20240115-0001-01`)]),r(`tr`,null,[r(`td`,null,`出库单`),r(`td`,null,`QR Code`),r(`td`,{行号:``},`{出库单号}-`),r(`td`,null,`IO-20240115-0001-01`)]),r(`tr`,null,[r(`td`,null,`托盘`),r(`td`,null,`Code128`),r(`td`,{SEQ:``},`PLT-{YYYYMMDD}-`),r(`td`,null,`PLT-20240115-0001`)])])],-1),t(`<h3 id="_5-2-手持终端操作" tabindex="-1"><a class="header-anchor" href="#_5-2-手持终端操作"><span>5.2 手持终端操作</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>扫描工作流:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>上架操作:</span></span>
<span class="line"><span>  ① 扫描入库单条码 → 加载待上架物料</span></span>
<span class="line"><span>  ② 扫描目标库位条码 → 确认库位</span></span>
<span class="line"><span>  ③ 扫描物料条码 → 确认物料</span></span>
<span class="line"><span>  ④ 输入数量 → 确认上架</span></span>
<span class="line"><span>  ⑤ 系统更新库存 → 打印上架标签</span></span>
<span class="line"><span></span></span>
<span class="line"><span>拣货操作:</span></span>
<span class="line"><span>  ① 扫描拣货任务条码 → 加载待拣物料清单</span></span>
<span class="line"><span>  ② 按拣货路径导航到库位</span></span>
<span class="line"><span>  ③ 扫描库位条码 → 确认位置</span></span>
<span class="line"><span>  ④ 扫描物料条码 → 确认物料</span></span>
<span class="line"><span>  ⑤ 输入拣取数量 → 确认拣货</span></span>
<span class="line"><span>  ⑥ 下一个库位 → 重复③-⑤</span></span>
<span class="line"><span></span></span>
<span class="line"><span>盘点操作:</span></span>
<span class="line"><span>  ① 扫描盘点单条码 → 加载待盘物料</span></span>
<span class="line"><span>  ② 扫描库位条码 → 定位库位</span></span>
<span class="line"><span>  ③ 扫描物料条码 → 确认物料</span></span>
<span class="line"><span>  ④ 输入实盘数量 → 提交</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="六、api-接口设计" tabindex="-1"><a class="header-anchor" href="#六、api-接口设计"><span>六、API 接口设计</span></a></h2><h3 id="_6-1-仓库管理" tabindex="-1"><a class="header-anchor" href="#_6-1-仓库管理"><span>6.1 仓库管理</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/inventory/warehouses</code></td><td>仓库列表</td></tr><tr><td>POST</td><td><code>/api/inventory/warehouses</code></td><td>创建仓库</td></tr><tr><td>GET</td><td><code>/api/inventory/warehouses/{id}</code></td><td>仓库详情</td></tr><tr><td>PUT</td><td><code>/api/inventory/warehouses/{id}</code></td><td>修改仓库</td></tr><tr><td>DELETE</td><td><code>/api/inventory/warehouses/{id}</code></td><td>删除仓库</td></tr><tr><td>GET</td><td><code>/api/inventory/warehouses/{id}/utilization</code></td><td>仓库利用率</td></tr></tbody></table><h3 id="_6-2-库区管理" tabindex="-1"><a class="header-anchor" href="#_6-2-库区管理"><span>6.2 库区管理</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/inventory/warehouses/{id}/zones</code></td><td>库区列表</td></tr><tr><td>POST</td><td><code>/api/inventory/warehouses/{id}/zones</code></td><td>创建库区</td></tr><tr><td>GET</td><td><code>/api/inventory/zones/{id}</code></td><td>库区详情</td></tr><tr><td>PUT</td><td><code>/api/inventory/zones/{id}</code></td><td>修改库区</td></tr><tr><td>DELETE</td><td><code>/api/inventory/zones/{id}</code></td><td>删除库区</td></tr></tbody></table><h3 id="_6-3-库位管理" tabindex="-1"><a class="header-anchor" href="#_6-3-库位管理"><span>6.3 库位管理</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/inventory/locations</code></td><td>库位列表 (支持多维筛选)</td></tr><tr><td>POST</td><td><code>/api/inventory/locations</code></td><td>创建库位</td></tr><tr><td>POST</td><td><code>/api/inventory/locations/batch-create</code></td><td>批量创建库位</td></tr><tr><td>GET</td><td><code>/api/inventory/locations/{id}</code></td><td>库位详情</td></tr><tr><td>PUT</td><td><code>/api/inventory/locations/{id}</code></td><td>修改库位</td></tr><tr><td>POST</td><td><code>/api/inventory/locations/{id}/freeze</code></td><td>冻结库位</td></tr><tr><td>POST</td><td><code>/api/inventory/locations/{id}/unfreeze</code></td><td>解冻库位</td></tr><tr><td>GET</td><td><code>/api/inventory/locations/{id}/inventory</code></td><td>库位库存</td></tr><tr><td>GET</td><td><code>/api/inventory/locations/empty</code></td><td>空闲库位查询</td></tr><tr><td>GET</td><td><code>/api/inventory/locations/{id}/capacity</code></td><td>库位容量</td></tr></tbody></table><h3 id="_6-4-上架策略" tabindex="-1"><a class="header-anchor" href="#_6-4-上架策略"><span>6.4 上架策略</span></a></h3><table><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody><tr><td>GET</td><td><code>/api/inventory/putaway-strategies</code></td><td>策略列表</td></tr><tr><td>POST</td><td><code>/api/inventory/putaway-strategies</code></td><td>创建策略</td></tr><tr><td>PUT</td><td><code>/api/inventory/putaway-strategies/{id}</code></td><td>修改策略</td></tr><tr><td>DELETE</td><td><code>/api/inventory/putaway-strategies/{id}</code></td><td>删除策略</td></tr><tr><td>POST</td><td><code>/api/inventory/putaway-strategies/suggest</code></td><td>推荐上架库位</td></tr></tbody></table><h2 id="七、实体关系图" tabindex="-1"><a class="header-anchor" href="#七、实体关系图"><span>七、实体关系图</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────────┐     ┌──────────────┐     ┌──────────────┐</span></span>
<span class="line"><span>│  Warehouse   │────▶│    Zone      │────▶│  Location    │</span></span>
<span class="line"><span>│  仓库         │ 1:N │    库区       │ 1:N │  库位         │</span></span>
<span class="line"><span>└──────┬───────┘     └──────────────┘     └──────┬───────┘</span></span>
<span class="line"><span>       │                                         │</span></span>
<span class="line"><span>       │                                         │ 1:N</span></span>
<span class="line"><span>       │                                         ▼</span></span>
<span class="line"><span>       │                                  ┌──────────────┐</span></span>
<span class="line"><span>       │                                  │InventoryItem │</span></span>
<span class="line"><span>       │                                  │ 库存物料       │</span></span>
<span class="line"><span>       │                                  └──────────────┘</span></span>
<span class="line"><span>       │</span></span>
<span class="line"><span>       └──────────────────────────────┐</span></span>
<span class="line"><span>                                      │</span></span>
<span class="line"><span>┌──────────────────┐                  │</span></span>
<span class="line"><span>│ PutawayStrategy  │──────────────────┘</span></span>
<span class="line"><span>│ 上架策略          │  适用于仓库/库区</span></span>
<span class="line"><span>└──────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="八、业务规则" tabindex="-1"><a class="header-anchor" href="#八、业务规则"><span>八、业务规则</span></a></h2><table><thead><tr><th>规则</th><th>描述</th></tr></thead><tbody><tr><td>编码唯一</td><td>仓库编码租户内唯一，库位编码仓库内唯一</td></tr><tr><td>层级完整</td><td>库位必须属于某个库区，库区必须属于某个仓库</td></tr><tr><td>存储类别兼容</td><td>物料存储类别必须与库位存储类别兼容</td></tr><tr><td>容量约束</td><td>上架不可超过库位最大重量/体积/托盘数</td></tr><tr><td>冻结约束</td><td>冻结库位禁止上架和拣货操作</td></tr><tr><td>危化品隔离</td><td>危化品只能存放在危化品库区</td></tr><tr><td>温控验证</td><td>冷链/冷冻物料只能存放在对应温控库区</td></tr><tr><td>虚拟仓限制</td><td>虚拟仓库不可进行物理上架/拣货操作</td></tr><tr><td>删除约束</td><td>有库存的仓库/库区/库位不可删除</td></tr><tr><td>默认仓库</td><td>每个租户只能有一个默认仓库</td></tr><tr><td>混放控制</td><td>非混放库位只能存放单一物料</td></tr><tr><td>拣选位补货</td><td>拣选位库存低于下限时触发补货提醒</td></tr></tbody></table>`,15)]])}var c=i(o,[[`render`,s]]);export{a as _pageData,c as default};