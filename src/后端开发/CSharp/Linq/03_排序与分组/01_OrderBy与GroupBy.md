---
title: OrderBy 与 GroupBy
icon: fa6-solid:arrow-down-a-z
order: 1
category:
  - CSharp
  - Linq
tag:
  - OrderBy
  - ThenBy
  - GroupBy
  - ToLookup
  - 排序
  - 分组
---

# OrderBy 与 GroupBy

## 一、排序操作

LINQ提供了一套完整的排序操作符：`OrderBy`/`OrderByDescending` 用于主排序，`ThenBy`/`ThenByDescending` 用于次排序，`Reverse` 用于反转序列。

### OrderBy / OrderByDescending — 主排序

```csharp
// 升序
var sorted = products.OrderBy(p => p.Price);

// 降序
var sorted = products.OrderByDescending(p => p.Price);

// 查询语法
var sorted = from p in products
             orderby p.Price descending
             select p;
```

::: info OrderBy的返回类型
`OrderBy` 返回 `IOrderedEnumerable<T>` 而不是 `IEnumerable<T>`，这是为了支持 `ThenBy` 链式调用。`IOrderedEnumerable<T>` 继承自 `IEnumerable<T>`，所以可以继续使用其他LINQ操作。
:::

### ThenBy / ThenByDescending — 次排序

`ThenBy` 在主排序的基础上追加次要排序条件：

```csharp
// 先按分类排序，同分类按价格升序
var sorted = products
    .OrderBy(p => p.Category)
    .ThenBy(p => p.Price);

// 先按分类，同分类按价格降序，同价格按名称升序
var sorted = products
    .OrderBy(p => p.Category)
    .ThenByDescending(p => p.Price)
    .ThenBy(p => p.Name);

// 查询语法等价
var sorted = from p in products
             orderby p.Category, p.Price descending, p.Name
             select p;
```

### Reverse — 反转序列

```csharp
var numbers = new[] { 1, 2, 3, 4, 5 };
var reversed = numbers.Reverse();  // 5, 4, 3, 2, 1
```

### 多字段排序的正确写法

::: danger 不要链式OrderBy！
链式 `OrderBy` 时，**后者会覆盖前者**，不是追加排序条件。多字段排序必须用 `ThenBy`。
:::

```csharp
// ❌ 错误：第二个OrderBy覆盖了第一个
var wrong = products
    .OrderBy(p => p.Category)    // 被覆盖！
    .OrderBy(p => p.Price);      // 只按Price排序

// ✅ 正确：用ThenBy追加排序条件
var correct = products
    .OrderBy(p => p.Category)
    .ThenBy(p => p.Price);       // 先按Category，再按Price
```

### 自定义比较器

`OrderBy` 支持传入自定义 `IComparer<T>` 来实现特殊的排序逻辑：

```csharp
// 自定义排序：按字符串长度排序，相同长度按字母序
public class StringLengthComparer : IComparer<string>
{
    public int Compare(string x, string y)
    {
        int lenDiff = x.Length.CompareTo(y.Length);
        return lenDiff != 0 ? lenDiff : string.Compare(x, y, StringComparison.Ordinal);
    }
}

var sorted = products.OrderBy(p => p.Name, new StringLengthComparer());

// 按拼音排序（中文场景）
var sorted = products.OrderBy(p => p.Name, StringComparer.GetComparer(CultureInfo.GetCultureInfo("zh-CN")));
```

### 业务场景

#### 场景1：商品列表排序

```csharp
// 电商商品列表：按销量降序 → 同销量按价格升序
var hotProducts = products
    .Where(p => p.IsActive)
    .OrderByDescending(p => p.Sales)
    .ThenBy(p => p.Price)
    .Take(50)
    .ToList();

// 价格从低到高（价格敏感用户）
var affordable = products
    .Where(p => p.IsActive && p.Stock > 0)
    .OrderBy(p => p.Price)
    .ThenByDescending(p => p.Rating)
    .ToList();

// 最新上架
var newest = products
    .Where(p => p.IsActive)
    .OrderByDescending(p => p.CreatedAt)
    .Take(20)
    .ToList();
```

#### 场景2：员工排名

```csharp
// 按部门 → 按入职日期 → 按薪资
var employeeRank = employees
    .OrderBy(e => e.Department)
    .ThenBy(e => e.HireDate)
    .ThenByDescending(e => e.Salary)
    .Select((e, index) => new
    {
        Rank = index + 1,
        e.Name,
        e.Department,
        e.HireDate,
        e.Salary
    })
    .ToList();
```

#### 场景3：日志排序

```csharp
// 日志：按时间降序 → 同时间按级别降序
var logLevelOrder = new Dictionary<LogLevel, int>
{
    [LogLevel.Critical] = 5,
    [LogLevel.Error] = 4,
    [LogLevel.Warning] = 3,
    [LogLevel.Information] = 2,
    [LogLevel.Debug] = 1
};

var sortedLogs = logs
    .OrderByDescending(l => l.Timestamp)
    .ThenByDescending(l => logLevelOrder[l.Level])
    .Take(100)
    .ToList();
```

## 二、GroupBy — 分组

`GroupBy` 按指定的键值将序列中的元素分组，返回 `IEnumerable<IGrouping<TKey, TElement>>`。

### IGrouping结构详解

```csharp
// IGrouping<TKey, TElement> 是一个带Key属性的集合
public interface IGrouping<TKey, TElement> : IEnumerable<TElement>
{
    TKey Key { get; }  // 分组键
}

// 遍历分组结果
var groups = products.GroupBy(p => p.Category);

foreach (var group in groups)
{
    Console.WriteLine($"分类: {group.Key}");     // Key是分组键
    Console.WriteLine($"数量: {group.Count()}");  // Count()是组内元素数

    foreach (var product in group)                // 遍历组内元素
    {
        Console.WriteLine($"  - {product.Name}: {product.Price}");
    }
}
```

### 基本分组

```csharp
// 按 Category 分组
var byCategory = products.GroupBy(p => p.Category);

// 查询语法
var byCategory = from p in products
                 group p by p.Category;

// 遍历
foreach (var g in byCategory)
{
    Console.WriteLine($"{g.Key}: {g.Count()}件商品");
}
```

### 分组+投影

```csharp
// elementSelector：指定组内元素只保留哪些属性
var byCategory = products.GroupBy(
    p => p.Category,           // keySelector
    p => p.Name                // elementSelector：只保留Name
);

// 遍历
foreach (var g in byCategory)
{
    Console.WriteLine($"{g.Key}: {string.Join(", ", g)}");
}
```

### 分组+结果投影

```csharp
// resultSelector：直接对每个分组进行聚合
var categoryStats = products.GroupBy(
    p => p.Category,             // keySelector
    p => p.Price,                // elementSelector
    (key, prices) => new         // resultSelector
    {
        Category = key,
        Count = prices.Count(),
        AvgPrice = prices.Average(),
        MaxPrice = prices.Max()
    }
);

// 查询语法等价
var categoryStats = from p in products
                    group p.Price by p.Category into g
                    select new
                    {
                        Category = g.Key,
                        Count = g.Count(),
                        AvgPrice = g.Average(),
                        MaxPrice = g.Max()
                    };
```

### 多字段分组

```csharp
// 按分类+年份分组
var byCategoryYear = products.GroupBy(p => new
{
    p.Category,
    Year = p.CreatedAt.Year
});

foreach (var g in byCategoryYear)
{
    Console.WriteLine($"{g.Key.Category} - {g.Key.Year}: {g.Count()}件");
}

// 查询语法
var byCategoryYear = from p in products
                     group p by new { p.Category, p.CreatedAt.Year } into g
                     select new { g.Key.Category, g.Key.Year, Count = g.Count() };
```

::: tip 匿名类型Key的注意点
使用匿名类型作为分组Key时，C#会自动重写 `Equals` 和 `GetHashCode`，确保相同属性值的匿名类型实例被视为相同的Key。但**不要用可变类型**（如List）作为Key。
:::

### 业务场景

#### 场景1：销售按月分组统计

```csharp
// 每月销售额统计
var monthlySales = orders
    .GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month })
    .Select(g => new
    {
        g.Key.Year,
        g.Key.Month,
        OrderCount = g.Count(),
        TotalAmount = g.Sum(o => o.Amount),
        AvgAmount = g.Average(o => o.Amount)
    })
    .OrderBy(x => x.Year)
    .ThenBy(x => x.Month)
    .ToList();

// 输出示例：
// 2024-01: 156笔, 总额¥234,500, 均价¥1,503
// 2024-02: 189笔, 总额¥298,700, 均价¥1,580
```

#### 场景2：员工按部门分组

```csharp
var deptEmployees = employees
    .GroupBy(e => e.Department)
    .Select(g => new
    {
        Department = g.Key,
        HeadCount = g.Count(),
        AvgSalary = g.Average(e => e.Salary),
        TopEarner = g.OrderByDescending(e => e.Salary).First().Name
    })
    .OrderByDescending(d => d.HeadCount)
    .ToList();
```

#### 场景3：订单按客户+年份分组

```csharp
var customerYearOrders = orders
    .GroupBy(o => new { o.CustomerId, o.OrderDate.Year })
    .Select(g => new
    {
        g.Key.CustomerId,
        g.Key.Year,
        OrderCount = g.Count(),
        TotalAmount = g.Sum(o => o.Amount)
    })
    .ToList();
```

#### 场景4：多级分组（GroupBy嵌套）

```csharp
// 先按部门分组，再按职级分组
var hierarchy = employees
    .GroupBy(e => e.Department)
    .Select(deptGroup => new
    {
        Department = deptGroup.Key,
        ByLevel = deptGroup.GroupBy(e => e.Level)
            .Select(levelGroup => new
            {
                Level = levelGroup.Key,
                Count = levelGroup.Count(),
                AvgSalary = levelGroup.Average(e => e.Salary)
            })
    });

// 遍历
foreach (var dept in hierarchy)
{
    Console.WriteLine($"部门: {dept.Department}");
    foreach (var level in dept.ByLevel)
    {
        Console.WriteLine($"  {level.Level}: {level.Count}人, 均薪{level.AvgSalary:C}");
    }
}
```

## 三、ToLookup — 立即执行的分组

`ToLookup` 是 `GroupBy` 的立即执行版本，返回 `ILookup<TKey, TElement>`——一个不可变的一键多值字典。

### 与GroupBy的区别

| 维度 | GroupBy | ToLookup |
|------|---------|----------|
| 执行方式 | 延迟执行 | 立即执行 |
| 返回类型 | `IEnumerable<IGrouping<TKey, TElement>>` | `ILookup<TKey, TElement>` |
| 多次遍历 | 每次重新计算 | 一次计算，多次使用 |
| 按Key查找 | 需要遍历或ToDictionary | 直接 `lookup[key]` |
| 不可变性 | 返回延迟迭代器 | 结果是不可变的 |

### ILookup vs IEnumerable<IGrouping>

```csharp
// GroupBy：延迟执行，每次遍历重新分组
var groups = products.GroupBy(p => p.Category);
// groups的类型：IEnumerable<IGrouping<string, Product>>

// ToLookup：立即执行，结果缓存
var lookup = products.ToLookup(p => p.Category);
// lookup的类型：ILookup<string, Product>

// ILookup支持按键查找
var electronics = lookup["电子"];  // 直接获取，O(1)
// 即使Key不存在也不报错，返回空序列
var notExist = lookup["不存在"];   // 返回空序列，不是null
```

### 适用场景

**场景：需要多次查询分组结果**

```csharp
// 订单按客户分组，需要多次查询不同客户的订单
var ordersByCustomer = orders.ToLookup(o => o.CustomerId);

// 快速查找——O(1)复杂度
var aliceOrders = ordersByCustomer[1001];   // 客户1001的订单
var bobOrders = ordersByCustomer[1002];     // 客户1002的订单

// 遍历所有分组
foreach (var group in ordersByCustomer)
{
    Console.WriteLine($"客户{group.Key}: {group.Count()}笔订单");
}

// 检查Key是否存在
if (ordersByCustomer.Contains(1003))
{
    var orders = ordersByCustomer[1003];
}
```

### 性能优势

```csharp
// ❌ 用GroupBy：每次查询都要重新分组
var groups = products.GroupBy(p => p.Category).ToList();
var electronics = groups.First(g => g.Key == "电子");  // 线性查找

// ✅ 用ToLookup：一次分组，多次O(1)查找
var lookup = products.ToLookup(p => p.Category);
var electronics = lookup["电子"];  // 哈希查找，O(1)
```

### ToLookup的投影重载

```csharp
// 指定elementSelector
var nameLookup = products.ToLookup(
    p => p.Category,    // keySelector
    p => p.Name         // elementSelector：只保留Name
);

// lookup["电子"] 返回 IEnumerable<string> 而非 IEnumerable<Product>
```

## 四、排序与分组的组合

### 分组后排序

```csharp
// 按分类分组，然后按组内数量降序排列
var result = products
    .GroupBy(p => p.Category)
    .Select(g => new { Category = g.Key, Count = g.Count() })
    .OrderByDescending(x => x.Count);
```

### 分组内排序

```csharp
// 按分类分组，每组内按价格降序
var result = products
    .GroupBy(p => p.Category)
    .Select(g => new
    {
        Category = g.Key,
        Products = g.OrderByDescending(p => p.Price).ToList()
    });
```

### 业务场景：各部门员工按薪资排名

```csharp
var deptRanking = employees
    .GroupBy(e => e.Department)
    .Select(g => new
    {
        Department = g.Key,
        HeadCount = g.Count(),
        AvgSalary = g.Average(e => e.Salary),
        // 组内排序：按薪资降序取前3
        Top3 = g
            .OrderByDescending(e => e.Salary)
            .Take(3)
            .Select(e => new { e.Name, e.Salary })
            .ToList()
    })
    .OrderByDescending(d => d.AvgSalary)
    .ToList();

// 输出：
// 研发部 (25人, 均薪¥18,500)
//   张三: ¥32,000
//   李四: ¥28,000
//   王五: ¥25,000
// 市场部 (18人, 均薪¥15,200)
//   赵六: ¥26,000
//   ...
```

## 五、常见陷阱

### 陷阱1：链式OrderBy

```csharp
// ❌ 错误：第二个OrderBy覆盖第一个
var wrong = products
    .OrderBy(p => p.Category)
    .OrderBy(p => p.Price);     // 只按Price排序，Category排序丢失

// ✅ 正确：用ThenBy
var correct = products
    .OrderBy(p => p.Category)
    .ThenBy(p => p.Price);      // 先Category，再Price

// ✅ 如果确实需要替换排序，用OrderBy（但要明确意图）
var reordered = products
    .OrderBy(p => p.Category)   // 初始排序
    .ToList()                   // 固化结果
    .OrderBy(p => p.Price);     // 重新排序（这是替换，不是追加）
```

### 陷阱2：GroupBy的Key是匿名类型时的注意点

```csharp
// ✅ 匿名类型作为Key是安全的
var groups = products.GroupBy(p => new { p.Category, p.Brand });

// ❌ 不要用可变类型或无法正确比较的类型作为Key
var badGroups = items.GroupBy(x => x.Tags);  // List<string> 作为Key
// 问题：两个内容相同的List不会被判断为相同的Key

// ✅ 如果需要按多个值分组，用匿名类型或元组
var goodGroups = items.GroupBy(x => string.Join(",", x.Tags));  // 转为string
```

### 陷阱3：GroupBy空集合的行为

```csharp
// 空集合GroupBy返回空序列，不会报错
var emptyGroups = Enumerable.Empty<Product>().GroupBy(p => p.Category);
// 结果：空序列，foreach不会执行

// ToLookup同理
var emptyLookup = Enumerable.Empty<Product>().ToLookup(p => p.Category);
// lookup是空的，查找任何Key都返回空序列
var result = emptyLookup["不存在"];  // 空序列，不是null
```

### 陷阱4：排序null值

```csharp
// 默认行为：null值排在最前面（升序）或最后面（降序）
var productsWithNull = new List<Product?>
{
    new() { Name = "B", Price = 100 },
    null,
    new() { Name = "A", Price = 200 }
};

// 升序：null在最前
var asc = productsWithNull.OrderBy(p => p?.Price);
// 结果：null, B(100), A(200)

// 降序：null在最后
var desc = productsWithNull.OrderByDescending(p => p?.Price);
// 结果：A(200), B(100), null

// 自定义null排序
var nullLast = productsWithNull.OrderBy(p => p?.Price == null ? 1 : 0)
                               .ThenBy(p => p?.Price);
// 结果：B(100), A(200), null
```

```csharp
// 可空值类型的排序
var prices = new decimal?[] { 100, null, 200, null, 50 };

var asc = prices.OrderBy(p => p);          // null, null, 50, 100, 200
var desc = prices.OrderByDescending(p => p); // 200, 100, 50, null, null

// 将null排到最后（升序）
var nullLast = prices.OrderBy(p => p ?? decimal.MaxValue);
// 结果：50, 100, 200, null, null（null被替换为最大值排到最后）
```

## 总结

| 要点 | 说明 |
|------|------|
| OrderBy/ThenBy | 主排序+次排序，不要链式OrderBy |
| ThenBy | 追加排序条件，必须在OrderBy之后 |
| GroupBy | 延迟执行分组，返回IGrouping序列 |
| ToLookup | 立即执行分组，支持O(1)按键查找 |
| 多字段分组 | 使用匿名类型作为Key |
| null排序 | 默认null在最前（升序），可自定义 |
| 分组内排序 | GroupBy后Select中对每组排序 |
