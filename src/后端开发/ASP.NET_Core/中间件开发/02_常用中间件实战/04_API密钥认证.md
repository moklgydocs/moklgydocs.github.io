---
title: API密钥认证
icon: fa6-solid:key
order: 4
category:
  - ASP.NET Core
  - 中间件开发
tag:
  - 中间件
  - API Key
  - 认证
  - 开放平台
---

# API密钥认证

> API Key认证是开放平台和第三方对接中最常见的认证方式。相比OAuth2的复杂流程，API Key简单直接——一个字符串标识一个调用者。但简单不等于粗糙，生产级的API Key认证需要支持多种传递方式、自定义验证逻辑、速率限制和权限绑定。

---

## 一、API Key认证中间件

### 1.1 传递方式

API Key有三种常见的传递方式：

| 方式 | 示例 | 优点 | 缺点 |
|------|------|------|------|
| Header | `X-API-Key: abc123` | 不暴露在URL中，不进日志 | 需要客户端支持自定义Header |
| QueryString | `?api_key=abc123` | 简单易用，浏览器直接测试 | 会出现在URL、日志、Referrer中 |
| Header优先+QueryString兜底 | 先查Header，没有再查QueryString | 兼顾安全和便利 | 实现稍复杂 |

::: warning 安全建议
生产环境优先使用Header方式。QueryString中的API Key会被浏览器历史记录、服务器访问日志、Referrer头等记录，存在泄露风险。
:::

### 1.2 基础中间件实现

```csharp
/// <summary>
/// API Key认证中间件配置
/// </summary>
public class ApiKeyOptions
{
    /// <summary>Header名称，默认X-API-Key</summary>
    public string HeaderName { get; set; } = "X-API-Key";

    /// <summary>QueryString参数名，默认api_key</summary>
    public string QueryParameterName { get; set; } = "api_key";

    /// <summary>是否允许QueryString方式（默认允许，作为兜底）</summary>
    public bool AllowQueryString { get; set; } = true;

    /// <summary>未提供API Key时的响应消息</summary>
    public string MissingKeyMessage { get; set; } = "API Key is required";

    /// <summary>API Key无效时的响应消息</summary>
    public string InvalidKeyMessage { get; set; } = "Invalid API Key";

    /// <summary>排除的路径（不需要API Key的公开接口）</summary>
    public List<string> ExcludedPaths { get; set; } = new();

    /// <summary>排除的HTTP方法（如OPTIONS预检请求）</summary>
    public List<string> ExcludedMethods { get; set; } = new() { "OPTIONS" };

    /// <summary>自定义验证函数</summary>
    public Func<string, Task<ApiKeyValidationResult>>? ValidateKey { get; set; }

    /// <summary>静态API Key列表（简单场景，不做数据库校验时使用）</summary>
    public Dictionary<string, ApiKeyInfo>? StaticKeys { get; set; }
}

/// <summary>
/// API Key验证结果
/// </summary>
public class ApiKeyValidationResult
{
    public bool IsValid { get; set; }
    public string? ClientId { get; set; }
    public string[]? Permissions { get; set; }
    public string? ErrorMessage { get; set; }

    public static ApiKeyValidationResult Success(
        string clientId, string[]? permissions = null) => new()
    {
        IsValid = true,
        ClientId = clientId,
        Permissions = permissions ?? Array.Empty<string>()
    };

    public static ApiKeyValidationResult Fail(string message) => new()
    {
        IsValid = false,
        ErrorMessage = message
    };
}

/// <summary>
/// API Key信息
/// </summary>
public class ApiKeyInfo
{
    public string ClientId { get; set; } = string.Empty;
    public string[] Permissions { get; set; } = Array.Empty<string>();
    public DateTime? ExpiresAt { get; set; }
    public bool IsEnabled { get; set; } = true;
}
```

中间件实现：

```csharp
/// <summary>
/// API Key认证中间件
/// </summary>
public class ApiKeyMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ApiKeyOptions _options;
    private readonly ILogger<ApiKeyMiddleware> _logger;

    public ApiKeyMiddleware(
        RequestDelegate next,
        IOptions<ApiKeyOptions> options,
        ILogger<ApiKeyMiddleware> logger)
    {
        _next = next;
        _options = options.Value;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // 检查排除的路径
        if (IsExcludedPath(context.Request.Path))
        {
            await _next(context);
            return;
        }

        // 检查排除的HTTP方法
        if (_options.ExcludedMethods.Contains(
            context.Request.Method, StringComparer.OrdinalIgnoreCase))
        {
            await _next(context);
            return;
        }

        // 提取API Key
        var apiKey = ExtractApiKey(context);

        if (string.IsNullOrEmpty(apiKey))
        {
            _logger.LogDebug("API Key缺失：{Method} {Path}",
                context.Request.Method, context.Request.Path);

            await WriteUnauthorized(context, _options.MissingKeyMessage);
            return;
        }

        // 验证API Key
        var result = await ValidateApiKey(apiKey);

        if (!result.IsValid)
        {
            _logger.LogWarning("API Key无效：{Method} {Path}, Key={KeyPrefix}...",
                context.Request.Method, context.Request.Path,
                apiKey.Length > 8 ? apiKey[..8] : "***");

            await WriteUnauthorized(context,
                result.ErrorMessage ?? _options.InvalidKeyMessage);
            return;
        }

        // 将客户端信息写入HttpContext.Items，供后续中间件/Controller使用
        context.Items["ApiClientId"] = result.ClientId;
        context.Items["ApiPermissions"] = result.Permissions;

        // 设置Claims（兼容认证体系）
        var claims = new List<Claim>
        {
            new("ApiClientId", result.ClientId!),
            new("ApiKeyAuthenticated", "true")
        };

        foreach (var permission in result.Permissions ?? Array.Empty<string>())
        {
            claims.Add(new("ApiPermission", permission));
        }

        context.Items["ApiClaims"] = claims;

        await _next(context);
    }

    /// <summary>
    /// 从请求中提取API Key
    /// </summary>
    private string? ExtractApiKey(HttpContext context)
    {
        // 优先从Header获取
        var headerKey = context.Request.Headers[_options.HeaderName]
            .FirstOrDefault();
        if (!string.IsNullOrEmpty(headerKey))
            return headerKey;

        // 从QueryString获取
        if (_options.AllowQueryString)
        {
            var queryKey = context.Request.Query[_options.QueryParameterName]
                .FirstOrDefault();
            if (!string.IsNullOrEmpty(queryKey))
                return queryKey;
        }

        return null;
    }

    /// <summary>
    /// 验证API Key
    /// </summary>
    private async Task<ApiKeyValidationResult> ValidateApiKey(string apiKey)
    {
        // 自定义验证函数优先
        if (_options.ValidateKey != null)
        {
            return await _options.ValidateKey(apiKey);
        }

        // 静态Key列表验证
        if (_options.StaticKeys != null &&
            _options.StaticKeys.TryGetValue(apiKey, out var keyInfo))
        {
            if (!keyInfo.IsEnabled)
                return ApiKeyValidationResult.Fail("API Key is disabled");

            if (keyInfo.ExpiresAt.HasValue &&
                keyInfo.ExpiresAt.Value < DateTime.UtcNow)
                return ApiKeyValidationResult.Fail("API Key has expired");

            return ApiKeyValidationResult.Success(
                keyInfo.ClientId, keyInfo.Permissions);
        }

        return ApiKeyValidationResult.Fail(_options.InvalidKeyMessage);
    }

    /// <summary>
    /// 写入401响应
    /// </summary>
    private static async Task WriteUnauthorized(HttpContext context, string message)
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new
        {
            status = 401,
            message
        });
    }

    private bool IsExcludedPath(PathString path)
    {
        return _options.ExcludedPaths.Any(excluded =>
            path.StartsWithSegments(excluded, StringComparison.OrdinalIgnoreCase));
    }
}
```

### 1.3 自定义验证函数

生产环境中，API Key通常存储在数据库或Redis中，需要自定义验证逻辑：

**数据库校验**：

```csharp
builder.Services.Configure<ApiKeyOptions>(options =>
{
    options.ValidateKey = async (apiKey) =>
    {
        using var scope = builder.Build().Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var keyEntity = await db.ApiKeys
            .FirstOrDefaultAsync(k => k.Key == apiKey && k.IsEnabled);

        if (keyEntity == null)
            return ApiKeyValidationResult.Fail("Invalid API Key");

        if (keyEntity.ExpiresAt < DateTime.UtcNow)
            return ApiKeyValidationResult.Fail("API Key has expired");

        var permissions = await db.ApiKeyPermissions
            .Where(p => p.ApiKeyId == keyEntity.Id)
            .Select(p => p.PermissionCode)
            .ToArrayAsync();

        return ApiKeyValidationResult.Success(keyEntity.ClientId, permissions);
    };
});
```

**Redis校验**：

```csharp
builder.Services.Configure<ApiKeyOptions>(options =>
{
    options.ValidateKey = async (apiKey) =>
    {
        var redis = builder.Build().Services.GetRequiredService<IConnectionMultiplexer>();
        var db = redis.GetDatabase();

        // Key格式：apikey:{hash}
        var hash = Sha256(apiKey);
        var jsonData = await db.StringGetAsync($"apikey:{hash}");

        if (!jsonData.HasValue)
            return ApiKeyValidationResult.Fail("Invalid API Key");

        var keyInfo = JsonSerializer.Deserialize<ApiKeyInfo>(jsonData!);

        if (keyInfo is null || !keyInfo.IsEnabled)
            return ApiKeyValidationResult.Fail("API Key is disabled");

        if (keyInfo.ExpiresAt.HasValue &&
            keyInfo.ExpiresAt.Value < DateTime.UtcNow)
            return ApiKeyValidationResult.Fail("API Key has expired");

        return ApiKeyValidationResult.Success(keyInfo.ClientId, keyInfo.Permissions);
    };
});

static string Sha256(string input)
{
    var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(input));
    return Convert.ToHexString(bytes).ToLowerInvariant();
}
```

### 1.4 路径排除

公开接口（如健康检查、公开文档、Swagger UI）不需要API Key：

```csharp
builder.Services.Configure<ApiKeyOptions>(options =>
{
    options.ExcludedPaths = new List<string>
    {
        "/health",
        "/swagger",
        "/api/public",       // 公开API前缀
        "/.well-known"       // OIDC发现端点
    };
});
```

### 1.5 业务场景

**场景一：开放平台API**

SaaS平台提供开放API给第三方开发者，每个开发者分配独立的API Key：

```json
{
    "ApiKey": {
        "HeaderName": "X-API-Key",
        "AllowQueryString": true,
        "ExcludedPaths": [ "/health", "/swagger" ],
        "ValidateKey": null
    }
}
```

每个API Key绑定：
- 开发者ID（ClientId）
- 调用配额（RateLimit）
- 接口权限（Permissions）
- 有效期（ExpiresAt）

**场景二：第三方对接**

与第三方系统对接时，使用固定的API Key进行双向认证：

```csharp
builder.Services.Configure<ApiKeyOptions>(options =>
{
    options.StaticKeys = new Dictionary<string, ApiKeyInfo>
    {
        ["partner-a-secret-key-001"] = new()
        {
            ClientId = "partner-a",
            Permissions = new[] { "orders:read", "orders:write" },
            ExpiresAt = new DateTime(2026, 12, 31, 23, 59, 59, DateTimeKind.Utc)
        },
        ["partner-b-secret-key-002"] = new()
        {
            ClientId = "partner-b",
            Permissions = new[] { "orders:read" },
            ExpiresAt = null
        }
    };
});
```

---

## 二、增强功能

### 2.1 API Key速率限制

在认证的同时进行速率限制，防止单个Key过度调用：

```csharp
/// <summary>
/// API Key速率限制服务
/// </summary>
public class ApiKeyRateLimiter
{
    private readonly ConcurrentDictionary<string, RateLimitCounter> _counters = new();
    private readonly int _maxRequestsPerMinute;
    private readonly Timer _cleanupTimer;

    public ApiKeyRateLimiter(int maxRequestsPerMinute = 100)
    {
        _maxRequestsPerMinute = maxRequestsPerMinute;
        // 每分钟清理过期计数器
        _cleanupTimer = new Timer(_ => CleanupExpired(), null,
            TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(1));
    }

    /// <summary>
    /// 检查是否超过速率限制
    /// </summary>
    public (bool IsAllowed, int Remaining, TimeSpan RetryAfter) CheckRateLimit(string clientId)
    {
        var now = DateTime.UtcNow;
        var windowStart = new DateTime(now.Year, now.Month, now.Day,
            now.Hour, now.Minute, 0, DateTimeKind.Utc);

        var counter = _counters.AddOrUpdate(
            clientId,
            _ => new RateLimitCounter { WindowStart = windowStart, Count = 1 },
            (_, existing) =>
            {
                if (existing.WindowStart < windowStart)
                {
                    // 新的窗口，重置计数
                    return new RateLimitCounter { WindowStart = windowStart, Count = 1 };
                }
                return new RateLimitCounter
                {
                    WindowStart = existing.WindowStart,
                    Count = existing.Count + 1
                };
            });

        var isAllowed = counter.Count <= _maxRequestsPerMinute;
        var remaining = Math.Max(0, _maxRequestsPerMinute - counter.Count);
        var windowEnd = windowStart.AddMinutes(1);
        var retryAfter = windowEnd - now;

        return (isAllowed, remaining, retryAfter);
    }

    private void CleanupExpired()
    {
        var threshold = DateTime.UtcNow.AddMinutes(-2);
        foreach (var kvp in _counters)
        {
            if (kvp.Value.WindowStart < threshold)
            {
                _counters.TryRemove(kvp.Key, out _);
            }
        }
    }

    private class RateLimitCounter
    {
        public DateTime WindowStart { get; set; }
        public int Count { get; set; }
    }
}
```

在中间件中集成：

```csharp
// 在ApiKeyMiddleware中添加速率限制检查
private readonly ApiKeyRateLimiter _rateLimiter;

public async Task InvokeAsync(HttpContext context)
{
    // ... API Key验证逻辑 ...

    // 速率限制检查
    var (isAllowed, remaining, retryAfter) =
        _rateLimiter.CheckRateLimit(result.ClientId!);

    // 添加速率限制响应头
    context.Response.Headers["X-RateLimit-Remaining"] = remaining.ToString();

    if (!isAllowed)
    {
        context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        context.Response.Headers["Retry-After"] =
            ((int)retryAfter.TotalSeconds).ToString();

        await context.Response.WriteAsJsonAsync(new
        {
            status = 429,
            message = "Rate limit exceeded. Please retry later.",
            retryAfterSeconds = (int)retryAfter.TotalSeconds
        });
        return;
    }

    await _next(context);
}
```

### 2.2 Key与权限绑定

API Key携带权限信息，后续中间件或Controller可以据此进行权限校验：

```csharp
/// <summary>
/// API Key权限检查扩展方法
/// </summary>
public static class ApiKeyPermissionExtensions
{
    /// <summary>
    /// 检查当前请求是否拥有指定API权限
    /// </summary>
    public static bool HasApiPermission(this HttpContext context, string permission)
    {
        var permissions = context.Items["ApiPermissions"] as string[];
        return permissions?.Contains(permission) == true;
    }

    /// <summary>
    /// 获取当前请求的客户端ID
    /// </summary>
    public static string? GetApiClientId(this HttpContext context)
    {
        return context.Items["ApiClientId"] as string;
    }
}
```

在Controller中使用：

```csharp
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        // 检查是否有读权限
        if (!HttpContext.HasApiPermission("orders:read"))
        {
            return StatusCode(403, new { message = "Insufficient permissions" });
        }

        var clientId = HttpContext.GetApiClientId();
        // 根据clientId查询该客户的订单
        var orders = await _orderService.GetOrdersByClientAsync(clientId!);
        return Ok(orders);
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        // 检查是否有写权限
        if (!HttpContext.HasApiPermission("orders:write"))
        {
            return StatusCode(403, new { message = "Insufficient permissions" });
        }

        var clientId = HttpContext.GetApiClientId();
        var order = await _orderService.CreateOrderAsync(clientId!, request);
        return CreatedAtAction(nameof(GetOrders), new { id = order.Id }, order);
    }
}
```

### 2.3 Key过期检查

API Key应支持过期时间，强制定期轮换：

```csharp
// 在验证函数中检查过期
private async Task<ApiKeyValidationResult> ValidateApiKey(string apiKey)
{
    // ... 获取keyInfo ...

    if (keyInfo.ExpiresAt.HasValue)
    {
        var now = DateTime.UtcNow;
        if (keyInfo.ExpiresAt.Value < now)
        {
            _logger.LogWarning(
                "API Key已过期：ClientId={ClientId}, ExpiredAt={ExpiredAt}",
                keyInfo.ClientId, keyInfo.ExpiresAt.Value);

            return ApiKeyValidationResult.Fail(
                "API Key has expired. Please request a new one.");
        }

        // 即将过期提醒（7天内）
        if ((keyInfo.ExpiresAt.Value - now).TotalDays < 7)
        {
            context.Response.Headers["X-API-Key-Expiring"] =
                keyInfo.ExpiresAt.Value.ToString("O");
        }
    }

    return ApiKeyValidationResult.Success(keyInfo.ClientId, keyInfo.Permissions);
}
```

---

## 三、与ASP.NET Core认证集成

上面的中间件方案虽然可行，但它独立于ASP.NET Core的认证体系，无法使用 `[Authorize]` 特性、无法与策略授权集成。更好的方式是实现 `AuthenticationHandler`。

### 3.1 实现AuthenticationHandler

```csharp
/// <summary>
/// API Key认证处理器
/// </summary>
public class ApiKeyAuthenticationHandler : AuthenticationHandler<ApiKeyAuthenticationOptions>
{
    private readonly IApiKeyValidator _apiKeyValidator;
    private readonly ILogger<ApiKeyAuthenticationHandler> _logger;

    public ApiKeyAuthenticationHandler(
        IOptionsMonitor<ApiKeyAuthenticationOptions> options,
        ILoggerFactory loggerFactory,
        UrlEncoder encoder,
        ISystemClock clock,
        IApiKeyValidator apiKeyValidator)
        : base(options, loggerFactory, encoder, clock)
    {
        _apiKeyValidator = apiKeyValidator;
        _logger = loggerFactory.CreateLogger<ApiKeyAuthenticationHandler>();
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        // 检查排除路径
        if (Options.ExcludedPaths.Any(p =>
            Request.Path.StartsWithSegments(p, StringComparison.OrdinalIgnoreCase)))
        {
            return AuthenticateResult.NoResult();
        }

        // 提取API Key
        var apiKey = ExtractApiKey();
        if (string.IsNullOrEmpty(apiKey))
        {
            return AuthenticateResult.Fail("API Key is missing");
        }

        // 验证
        var result = await _apiKeyValidator.ValidateAsync(apiKey);
        if (!result.IsValid)
        {
            _logger.LogWarning("API Key验证失败：{Reason}", result.ErrorMessage);
            return AuthenticateResult.Fail(result.ErrorMessage ?? "Invalid API Key");
        }

        // 构建Claims
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, result.ClientId!),
            new(ClaimTypes.Name, result.ClientId!),
            new("auth_method", "api_key")
        };

        foreach (var permission in result.Permissions ?? Array.Empty<string>())
        {
            claims.Add(new("api_permission", permission));
        }

        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return AuthenticateResult.Success(ticket);
    }

    protected override async Task HandleChallengeAsync(AuthenticationProperties properties)
    {
        Response.StatusCode = StatusCodes.Status401Unauthorized;
        Response.ContentType = "application/json";
        await Response.WriteAsJsonAsync(new
        {
            status = 401,
            message = "API Key is required. Provide via X-API-Key header or api_key query parameter."
        });
    }

    protected override async Task HandleForbiddenAsync(AuthenticationProperties properties)
    {
        Response.StatusCode = StatusCodes.Status403Forbidden;
        Response.ContentType = "application/json";
        await Response.WriteAsJsonAsync(new
        {
            status = 403,
            message = "Insufficient API permissions"
        });
    }

    private string? ExtractApiKey()
    {
        // 从Header获取
        var headerKey = Request.Headers[Options.HeaderName].FirstOrDefault();
        if (!string.IsNullOrEmpty(headerKey))
            return headerKey;

        // 从QueryString获取
        if (Options.AllowQueryString)
        {
            var queryKey = Request.Query[Options.QueryParameterName].FirstOrDefault();
            if (!string.IsNullOrEmpty(queryKey))
                return queryKey;
        }

        return null;
    }
}

/// <summary>
/// API Key认证配置
/// </summary>
public class ApiKeyAuthenticationOptions : AuthenticationSchemeOptions
{
    public string HeaderName { get; set; } = "X-API-Key";
    public string QueryParameterName { get; set; } = "api_key";
    public bool AllowQueryString { get; set; } = true;
    public List<string> ExcludedPaths { get; set; } = new();
}
```

### 3.2 验证器接口与实现

```csharp
/// <summary>
/// API Key验证器接口
/// </summary>
public interface IApiKeyValidator
{
    Task<ApiKeyValidationResult> ValidateAsync(string apiKey);
}

/// <summary>
/// 基于数据库的API Key验证器
/// </summary>
public class DatabaseApiKeyValidator : IApiKeyValidator
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<DatabaseApiKeyValidator> _logger;

    public DatabaseApiKeyValidator(
        IServiceProvider serviceProvider,
        ILogger<DatabaseApiKeyValidator> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    public async Task<ApiKeyValidationResult> ValidateAsync(string apiKey)
    {
        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var keyHash = Sha256(apiKey);

        var keyEntity = await db.ApiKeys
            .Include(k => k.Permissions)
            .FirstOrDefaultAsync(k => k.KeyHash == keyHash && k.IsEnabled);

        if (keyEntity == null)
        {
            _logger.LogWarning("API Key不存在或已禁用：Hash={Hash}", keyHash[..16]);
            return ApiKeyValidationResult.Fail("Invalid API Key");
        }

        if (keyEntity.ExpiresAt.HasValue &&
            keyEntity.ExpiresAt.Value < DateTime.UtcNow)
        {
            _logger.LogWarning("API Key已过期：ClientId={ClientId}", keyEntity.ClientId);
            return ApiKeyValidationResult.Fail("API Key has expired");
        }

        var permissions = keyEntity.Permissions
            .Select(p => p.PermissionCode)
            .ToArray();

        return ApiKeyValidationResult.Success(keyEntity.ClientId, permissions);
    }

    private static string Sha256(string input)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }
}
```

### 3.3 注册为认证方案

```csharp
// Program.cs

// 注册验证器
builder.Services.AddScoped<IApiKeyValidator, DatabaseApiKeyValidator>();

// 注册API Key认证方案
builder.Services.AddAuthentication()
    .AddScheme<ApiKeyAuthenticationOptions, ApiKeyAuthenticationHandler>(
        "ApiKey", options =>
    {
        options.HeaderName = "X-API-Key";
        options.AllowQueryString = true;
        options.ExcludedPaths = new List<string>
        {
            "/health",
            "/swagger"
        };
    });

// 如果同时支持JWT和API Key，设置默认方案为动态选择
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "Smart";  // 自定义方案选择器
    options.DefaultChallengeScheme = "ApiKey";
})
.AddScheme<ApiKeyAuthenticationOptions, ApiKeyAuthenticationHandler>("ApiKey", null)
.AddJwtBearer("Bearer", options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = "https://your-app.com",
        ValidAudience = "https://your-app.com",
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes("your-signing-key"))
    };
})
.AddPolicyScheme("Smart", "ApiKey or Bearer", options =>
{
    // 动态选择认证方案
    options.ForwardDefaultSelector = context =>
    {
        // 如果有X-API-Key头部，使用API Key认证
        if (context.Request.Headers.ContainsKey("X-API-Key"))
            return "ApiKey";

        // 如果有Authorization: Bearer头部，使用JWT认证
        var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
        if (authHeader?.StartsWith("Bearer ") == true)
            return "Bearer";

        // 默认使用API Key方案（返回401）
        return "ApiKey";
    };
});
```

### 3.4 在Controller上使用Authorize

```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    // API Key或JWT均可访问
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetProducts()
    {
        var clientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var products = await _productService.GetProductsAsync(clientId!);
        return Ok(products);
    }

    // 仅限API Key认证，且需要products:write权限
    [HttpPost]
    [Authorize(AuthenticationSchemes = "ApiKey")]
    [Authorize(Policy = "CanWriteProducts")]
    public async Task<IActionResult> CreateProduct(
        [FromBody] CreateProductRequest request)
    {
        var product = await _productService.CreateAsync(request);
        return CreatedAtAction(nameof(GetProducts), product);
    }
}

// 注册策略
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("CanWriteProducts", policy =>
        policy.RequireClaim("api_permission", "products:write"));

    options.AddPolicy("CanReadOrders", policy =>
        policy.RequireClaim("api_permission", "orders:read"));
});
```

### 3.5 两种方案对比

| 特性 | 中间件方案 | AuthenticationHandler方案 |
|------|-----------|--------------------------|
| 实现复杂度 | 低 | 中 |
| 与[Authorize]集成 | 不支持 | 完整支持 |
| 与策略授权集成 | 不支持 | 完整支持 |
| 多认证方案共存 | 需手动处理 | PolicyScheme自动选择 |
| ClaimsPrincipal | 需手动构建 | 框架自动构建 |
| HttpContext.User | 不可用 | 可用 |
| 适合场景 | 简单API、快速原型 | 生产环境、需与认证体系集成 |

**建议**：新项目直接使用 `AuthenticationHandler` 方案。它与ASP.NET Core认证体系无缝集成，支持 `[Authorize]`、策略授权、多方案切换等特性。中间件方案仅适合快速原型或不需要授权集成的简单场景。

---

## 四、最佳实践

### 4.1 API Key安全存储

数据库中不应存储明文API Key，应存储哈希值：

```csharp
// 生成API Key时
var rawKey = $"ak_{Guid.NewGuid():N}{Guid.NewGuid():N}";  // ak_ + 64位随机字符串
var keyHash = Sha256(rawKey);

// 存储到数据库
var entity = new ApiKeyEntity
{
    KeyHash = keyHash,      // 存储哈希
    KeyPrefix = rawKey[..8], // 存储前8位用于识别
    ClientId = clientId,
    // ...
};

// 仅在创建时返回明文Key，之后无法恢复
return rawKey;
```

### 4.2 API Key格式设计

```
ak_live_1234567890abcdef1234567890abcdef
││  │    │
││  │    └── 32位随机字符串
││  └── 环境标识（live/test）
│└── 前缀（标识这是API Key，便于日志识别）
└── 固定前缀
```

- 前缀标识：`ak_` 让日志和安全扫描能识别这是一个API Key
- 环境标识：`live_` / `test_` 区分生产与测试Key
- 随机部分：32位以上十六进制字符串，保证足够熵值

### 4.3 响应头规范

```csharp
// 认证成功后，在响应头中返回调用者信息（便于调试）
context.Response.Headers["X-Api-Client-Id"] = clientId;
context.Response.Headers["X-RateLimit-Limit"] = maxRequests.ToString();
context.Response.Headers["X-RateLimit-Remaining"] = remaining.ToString();
```

### 4.4 日志与审计

```csharp
// 记录API Key调用日志（不要记录完整Key）
_logger.LogInformation(
    "API调用：ClientId={ClientId}, KeyPrefix={KeyPrefix}, " +
    "Method={Method}, Path={Path}, StatusCode={StatusCode}",
    clientId, keyPrefix, method, path, statusCode);
```
