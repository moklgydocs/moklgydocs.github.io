---
title: Where 与 OfType
icon: fa6-solid:funnel-dollar
order: 2
category:
  - CSharp
  - Linq
tag:
  - Where
  - OfType
  - Cast
  - 筛选
---

# Where 与 OfType

## 一、Where — 条件筛选

`Where` 是LINQ中使用频率最高的操作符，它根据条件从序列中筛选出满足条件的元素。

### 基本用法

```csharp
// 方法语法
var activeProducts = products.Where(p => p.IsActive);

// 查询语法
var activeProducts = from p in products
                     where p.IsActive
                     select p;
```

### 索引重载

`Where` 提供带索引的重载 `Where((item, index) => ...)`，可以在条件中使用元素的位置：

```csharp
// 获取偶数位置的元素（第0、2、4...个）
var evenIndexed = products.Where((p, index) => index % 2 == 0);

// 跳过前5个之后的所有元素（模拟Skip）
var after5 = products.Where((_, index) => index >= 5);

// 取前10个（模拟Take）
var first10 = products.Where((_, index) => index < 10);
```

::: warning 索引重载的限制
索引是基于原始序列的位置，排序后索引不会重新计算。如果需要排序后的索引，请先排序再使用索引。
:::

### 多条件组合

```csharp
// && — 逻辑与（同时满足）
var result = products.Where(p => p.IsActive && p.Price > 100);

// || — 逻辑或（满足其一）
var result = products.Where(p => p.Price < 50 || p.Price > 1000);

// 复合条件
var result = products.Where(p =>
    p.IsActive
    && (p.Category == "电子" || p.Category == "家电")
    && p.Stock > 0
);
```

### 业务场景

#### 场景1：订单状态筛选

```csharp
public enum OrderStatus
{
    Pending,      // 待处理
    Processing,   // 处理中
    Shipped,      // 已发货
    Delivered,    // 已送达
    Cancelled     // 已取消
}

// 筛选需要处理的订单
var pendingOrders = orders.Where(o =>
    o.Status == OrderStatus.Pending || o.Status == OrderStatus.Processing
);

// 筛选未取消的活跃订单
var activeOrders = orders.Where(o => o.Status != OrderStatus.Cancelled);

// 使用集合包含判断
var targetStatuses = new[] { OrderStatus.Pending, OrderStatus.Processing };
var toProcess = orders.Where(o => targetStatuses.Contains(o.Status));
```

#### 场景2：价格区间筛选

```csharp
// 价格区间
var midRange = products.Where(p => p.Price >= 100 && p.Price <= 500);

// 折扣商品（价格低于原价的70%）
var discounted = products.Where(p => p.CurrentPrice < p.OriginalPrice * 0.7m);

// 阶梯价格筛选
var priceRanges = new[]
{
    new { Label = "0-100", Min = 0m, Max = 100m },
    new { Label = "100-500", Min = 100m, Max = 500m },
    new { Label = "500+", Min = 500m, Max = decimal.MaxValue }
};
```

#### 场景3：日期范围筛选

```csharp
// 今日订单
var today = orders.Where(o => o.CreatedAt.Date == DateTime.Today);

// 本月订单
var thisMonth = orders.Where(o =>
    o.CreatedAt.Year == DateTime.Now.Year &&
    o.CreatedAt.Month == DateTime.Now.Month
);

// 最近7天
var recentWeek = orders.Where(o =>
    o.CreatedAt >= DateTime.Now.AddDays(-7)
);

// 自定义日期范围
var range = orders.Where(o =>
    o.CreatedAt >= startDate && o.CreatedAt < endDate.AddDays(1)
);
```

#### 场景4：多条件组合查询（动态Where）

```csharp
// 后台管理系统常见的多条件组合搜索
public IQueryable<Product> SearchProducts(ProductSearchRequest request)
{
    var query = _db.Products.AsQueryable();

    // 关键词搜索
    if (!string.IsNullOrEmpty(request.Keyword))
    {
        query = query.Where(p =>
            p.Name.Contains(request.Keyword) ||
            p.Description.Contains(request.Keyword)
        );
    }

    // 分类筛选
    if (request.CategoryId.HasValue)
        query = query.Where(p => p.CategoryId == request.CategoryId);

    // 价格区间
    if (request.MinPrice.HasValue)
        query = query.Where(p => p.Price >= request.MinPrice);
    if (request.MaxPrice.HasValue)
        query = query.Where(p => p.Price <= request.MaxPrice);

    // 状态筛选
    if (request.IsActive.HasValue)
        query = query.Where(p => p.IsActive == request.IsActive);

    // 日期范围
    if (request.StartDate.HasValue)
        query = query.Where(p => p.CreatedAt >= request.StartDate);

    return query;
}
```

## 二、OfType — 类型筛选

`OfType<T>` 从序列中筛选出指定类型的元素，主要用于非泛型集合或混合类型序列。

### 基本用法

```csharp
// 从非泛型ArrayList中筛选int
ArrayList mixed = new() { 1, "hello", 2.5, 3, "world", 4 };

var ints = mixed.OfType<int>();       // 结果：1, 3, 4
var strings = mixed.OfType<string>(); // 结果："hello", "world"
var doubles = mixed.OfType<double>(); // 结果：2.5
```

### 与IEnumerable的配合

```csharp
// 从object数组中筛选特定类型
object[] items = { 1, "text", true, 3.14, null, "more" };

var numbers = items.OfType<int>();           // 1
var texts = items.OfType<string>();          // "text", "more"
var bools = items.OfType<bool>();            // true
var nullableInts = items.OfType<int?>();     // (空，没有int?)
```

::: info OfType自动过滤null
`OfType<T>` 会自动跳过 `null` 元素（对于引用类型）和类型不匹配的元素，不会抛出异常。
:::

### 业务场景

#### 场景1：混合类型列表筛选

```csharp
// 消息系统中不同类型的消息
public abstract class Message { public DateTime Timestamp { get; set; } }
public class TextMessage : Message { public string Content { get; set; } }
public class ImageMessage : Message { public string Url { get; set; } }
public class SystemMessage : Message { public string Code { get; set; } }

List<Message> messages = GetMessages();

// 只获取文本消息
var textMessages = messages.OfType<TextMessage>();

// 只获取图片消息
var imageMessages = messages.OfType<ImageMessage>();

// 分别处理不同类型
foreach (var text in messages.OfType<TextMessage>())
    Console.WriteLine($"文本: {text.Content}");

foreach (var img in messages.OfType<ImageMessage>())
    Console.WriteLine($"图片: {img.Url}");
```

#### 场景2：接口类型筛选

```csharp
// 从不同控件中筛选可点击的
public interface IClickable { void Click(); }
public interface IVisible { bool IsVisible { get; } }

public class Button : IClickable, IVisible { ... }
public class Label : IVisible { ... }
public class TextBox : IClickable, IVisible { ... }

var controls = GetControls();  // List<object>

// 筛选所有可点击的控件
var clickables = controls.OfType<IClickable>();

// 筛选所有可见的控件
var visibles = controls.OfType<IVisible>();
```

#### 场景3：遗留代码中非泛型集合的处理

```csharp
// 遗留API返回非泛型集合
public ArrayList GetLegacyData()
{
    return new ArrayList { "item1", 42, "item2", 99, "item3" };
}

// 使用OfType转为泛型序列
var strings = GetLegacyData().OfType<string>();  // IEnumerable<string>
var stringList = strings.ToList();               // List<string>
```

## 三、Cast — 类型转换

`Cast<T>` 将序列中的所有元素强制转换为指定类型，类型不匹配时抛出 `InvalidCastException`。

### 基本用法

```csharp
// 从ArrayList转为IEnumerable<int>
ArrayList numbers = new() { 1, 2, 3, 4, 5 };
var ints = numbers.Cast<int>();  // 可以使用LINQ

// 转换后可以链式调用
var sum = numbers.Cast<int>().Where(n => n > 2).Sum();
```

### OfType vs Cast

| 维度 | OfType | Cast |
|------|--------|------|
| 类型不匹配 | 跳过不匹配的元素 | 抛出InvalidCastException |
| null处理 | 跳过null | 引用类型保留null |
| 返回类型 | IEnumerable<T> | IEnumerable<T> |
| 使用场景 | 不确定类型一致性时 | 确定所有元素都能转换时 |
| 安全性 | 安全 | 可能异常 |

```csharp
ArrayList mixed = new() { 1, "hello", 2, "world" };

// OfType：安全，只取匹配的
mixed.OfType<int>();      // 1, 2（跳过字符串）

// Cast：危险，遇到不匹配的类型就炸
mixed.Cast<int>();        // 抛出InvalidCastException："hello"不是int

// Cast在确定类型一致时使用
ArrayList pureInts = new() { 1, 2, 3 };
pureInts.Cast<int>();     // 安全：1, 2, 3
```

::: tip 选择建议
- 不确定集合元素类型 → 用 `OfType<T>`
- 确定所有元素都是T类型 → 用 `Cast<T>`
- 实际开发中，`OfType` 几乎总是更安全的选择
:::

## 四、动态筛选技巧

### 基本模式：条件叠加

```csharp
// 最常见的动态Where模式
public IQueryable<Product> FilterProducts(ProductFilter filter)
{
    var query = _db.Products.AsQueryable();

    if (!string.IsNullOrEmpty(filter.Name))
        query = query.Where(p => p.Name.Contains(filter.Name));

    if (filter.CategoryId.HasValue)
        query = query.Where(p => p.CategoryId == filter.CategoryId);

    if (filter.MinPrice.HasValue)
        query = query.Where(p => p.Price >= filter.MinPrice);

    if (filter.MaxPrice.HasValue)
        query = query.Where(p => p.Price <= filter.MaxPrice);

    return query;
}
```

### Expression动态构建

```csharp
using System.Linq.Expressions;

// 动态构建Where条件
public static class DynamicWhereBuilder
{
    public static IQueryable<T> WhereIf<T>(
        this IQueryable<T> source,
        bool condition,
        Expression<Func<T, bool>> predicate)
    {
        return condition ? source.Where(predicate) : source;
    }
}

// 使用
var result = _db.Products
    .WhereIf(!string.IsNullOrEmpty(keyword), p => p.Name.Contains(keyword))
    .WhereIf(categoryId.HasValue, p => p.CategoryId == categoryId)
    .WhereIf(minPrice.HasValue, p => p.Price >= minPrice)
    .ToList();
```

### 组合多个表达式

```csharp
// 将多个Expression合并为一个
public static Expression<Func<T, bool>> CombineAnd<T>(
    params Expression<Func<T, bool>>[] expressions)
{
    if (expressions.Length == 0)
        return _ => true;

    Expression<Func<T, bool>> result = expressions[0];
    foreach (var expr in expressions.Skip(1))
    {
        var parameter = Expression.Parameter(typeof(T));

        var leftVisitor = new ReplaceExpressionVisitor(result.Parameters[0], parameter);
        var left = leftVisitor.Visit(result.Body);

        var rightVisitor = new ReplaceExpressionVisitor(expr.Parameters[0], parameter);
        var right = rightVisitor.Visit(expr.Body);

        result = Expression.Lambda<Func<T, bool>>(
            Expression.AndAlso(left, right), parameter);
    }
    return result;
}

// 使用
var conditions = new List<Expression<Func<Product, bool>>>();

if (!string.IsNullOrEmpty(keyword))
    conditions.Add(p => p.Name.Contains(keyword));
if (minPrice.HasValue)
    conditions.Add(p => p.Price >= minPrice);

var combinedExpr = CombineAnd(conditions.ToArray());
var result = _db.Products.Where(combinedExpr).ToList();
```

### 业务场景：后台管理系统的多条件组合查询

```csharp
[HttpGet("products")]
public async Task<PagedResult<ProductDto>> Search([FromQuery] ProductSearchRequest req)
{
    var query = _db.Products.AsQueryable();

    // 关键词
    if (!string.IsNullOrWhiteSpace(req.Keyword))
    {
        var kw = req.Keyword.Trim();
        query = query.Where(p =>
            p.Name.Contains(kw) ||
            p.SKU.Contains(kw) ||
            p.Description.Contains(kw));
    }

    // 多选分类
    if (req.CategoryIds?.Any() == true)
        query = query.Where(p => req.CategoryIds.Contains(p.CategoryId));

    // 价格区间
    query = query.WhereIf(req.MinPrice.HasValue, p => p.Price >= req.MinPrice)
                 .WhereIf(req.MaxPrice.HasValue, p => p.Price <= req.MaxPrice);

    // 品牌
    if (req.BrandIds?.Any() == true)
        query = query.Where(p => req.BrandIds.Contains(p.BrandId));

    // 状态
    if (req.Status.HasValue)
        query = query.Where(p => p.Status == req.Status);

    // 创建时间
    query = query.WhereIf(req.StartDate.HasValue, p => p.CreatedAt >= req.StartDate)
                 .WhereIf(req.EndDate.HasValue, p => p.CreatedAt <= req.EndDate);

    // 排序
    query = req.SortBy switch
    {
        "price" => req.SortDesc ? query.OrderByDescending(p => p.Price) : query.OrderBy(p => p.Price),
        "sales" => req.SortDesc ? query.OrderByDescending(p => p.Sales) : query.OrderBy(p => p.Sales),
        _ => query.OrderByDescending(p => p.CreatedAt)
    };

    var total = await query.CountAsync();
    var items = await query
        .Skip((req.Page - 1) * req.PageSize)
        .Take(req.PageSize)
        .Select(p => new ProductDto { ... })
        .ToListAsync();

    return new PagedResult<ProductDto>(items, total);
}
```

## 五、Where的性能考虑

### Where不创建新集合

`Where` 是延迟执行的，它不会创建新的集合，而是在遍历时逐个判断：

```csharp
// Where返回的是迭代器，不是新List
var query = products.Where(p => p.Price > 100);
// query的类型是 IEnumerable<Product>，内部是一个迭代器
// 遍历时才判断每个元素是否满足条件
```

### 链式Where vs 复合条件

```csharp
// 方式1：链式Where
var result = products
    .Where(p => p.IsActive)
    .Where(p => p.Price > 100)
    .Where(p => p.Stock > 0);

// 方式2：复合条件
var result = products
    .Where(p => p.IsActive && p.Price > 100 && p.Stock > 0);
```

**性能**：两者在 `IEnumerable` 上性能等价——编译器优化后都是逐个元素判断所有条件。

**可读性**：
- 链式Where：每个条件独立一行，更容易注释和增删
- 复合条件：更紧凑，条件间关系一目了然

**EF Core**：在 `IQueryable` 中，两种写法生成的SQL相同。

```csharp
// 推荐：动态条件用链式Where（方便条件判断）
if (isActive)
    query = query.Where(p => p.IsActive);
if (minPrice.HasValue)
    query = query.Where(p => p.Price >= minPrice);

// 推荐：固定条件用复合条件（更紧凑）
query = query.Where(p => p.IsActive && !p.IsDeleted);
```

### IQueryable中Where的SQL翻译

```csharp
// LINQ查询
var result = db.Products
    .Where(p => p.Price > 100 && p.IsActive)
    .OrderBy(p => p.Name)
    .Select(p => new { p.Id, p.Name })
    .Take(20);

// 生成的SQL
// SELECT TOP(20) [p].[Id], [p].[Name]
// FROM [Products] AS [p]
// WHERE [p].[Price] > 100.0 AND [p].[IsActive] = 1
// ORDER BY [p].[Name]
```

::: warning 无法翻译的Where条件
EF Core无法将所有C#表达式翻译为SQL。以下情况会导致**客户端评估**（先从数据库加载全部数据，再在内存中过滤）：

```csharp
// ❌ 无法翻译的方法调用
query.Where(p => IsValidProduct(p))              // 自定义方法
query.Where(p => p.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase)) // 某些重载

// ✅ 可以翻译的写法
query.Where(p => p.Price > 100 && p.IsActive)    // 简单比较
query.Where(p => p.Name.Contains(keyword))        // 简单Contains
query.Where(p => EF.Functions.Like(p.Name, $"%{keyword}%")) // SQL LIKE
```
:::

## 总结

| 要点 | 说明 |
|------|------|
| Where | 条件筛选，最常用的LINQ操作 |
| 索引重载 | Where((item, index) => ...)，使用元素位置 |
| OfType | 类型筛选，安全跳过不匹配类型 |
| Cast | 类型强制转换，不匹配时抛异常 |
| 动态Where | 条件叠加模式，WhereIf扩展方法 |
| 性能 | 链式Where与复合条件等价，IQueryable注意SQL翻译 |
