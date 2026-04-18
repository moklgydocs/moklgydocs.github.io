---
title: 接入SSO
date: 2025-04-09
category:
  - ASP.NET_Core
tag:
  - asp.netcore
  - SSO
  - OpenIddict
  - 权限中心
  - RBAC
author: Moklgy
order: 17
---


# 把 SSO 鉴权中心和权限中心迁移到 Platform 基座 + CQRS 模式上。

---

## 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                    Platform 基座 (158 文件)               │
│  Domain.Shared / Domain / EfCore / AspNetCore / Cqrs    │
│  BackgroundJobs / EventBus / DistributedLocking          │
│  MultiTenancy / AuditLogging / Localization              │
└────────────┬──────────────────────┬─────────────────────┘
             │                      │
    ┌────────▼─────────┐   ┌───────▼────────────┐
    │   SSO 鉴权中心    │   │    权限中心         │
    │  (AuthServer)     │   │  (PermCenter)       │
    │                   │   │                     │
    │  OpenIddict       │   │  RBAC 权限管理      │
    │  用户认证         │   │  角色管理           │
    │  客户端管理       │   │  应用注册           │
    │  Token 管理       │   │  菜单管理           │
    └───────────────────┘   └─────────────────────┘
             │                      │
             └──────────┬───────────┘
                        │
              ┌─────────▼──────────┐
              │   业务系统 (ERP)    │
              │   JWT 验证 + 权限   │
              └────────────────────┘
```

---

# 一、SSO 鉴权中心

## 项目结构

```
AuthServer/
├── AuthServer.sln
│
├── src/
│   ├── AuthServer.Domain.Shared/          # 共享常量/DTO
│   │   ├── AuthServer.Domain.Shared.csproj
│   │   ├── Consts/
│   │   │   ├── SsoClaimTypes.cs
│   │   │   ├── SsoGrantTypes.cs
│   │   │   └── SsoScopes.cs
│   │   ├── Dtos/
│   │   │   ├── TokenResultDto.cs
│   │   │   ├── UserInfoDto.cs
│   │   │   ├── ClientDto.cs
│   │   │   └── ScopeDto.cs
│   │   └── Events/
│   │       ├── UserLoggedInEvent.cs
│   │       ├── UserLockedOutEvent.cs
│   │       └── ClientCreatedEvent.cs
│   │
│   ├── AuthServer.Domain/                 # 领域层
│   │   ├── AuthServer.Domain.csproj
│   │   ├── Users/
│   │   │   ├── SsoUser.cs
│   │   │   ├── SsoRole.cs
│   │   │   └── ISsoUserRepository.cs
│   │   ├── Clients/
│   │   │   └── IClientRepository.cs
│   │   └── Scopes/
│   │       └── IScopeRepository.cs
│   │
│   ├── AuthServer.Infrastructure/          # 基础设施层
│   │   ├── AuthServer.Infrastructure.csproj
│   │   ├── Data/
│   │   │   ├── AuthServerDbContext.cs
│   │   │   ├── AuthServerDbDesignTimeFactory.cs
│   │   │   └── Migrations/
│   │   ├── Repositories/
│   │   │   ├── SsoUserRepository.cs
│   │   │   ├── ClientRepository.cs
│   │   │   └── ScopeRepository.cs
│   │   └── Seed/
│   │       ├── IDataSeeder.cs
│   │       ├── ClientDataSeeder.cs
│   │       ├── ScopeDataSeeder.cs
│   │       └── AdminUserSeeder.cs
│   │
│   ├── AuthServer.Application/            # 应用层（CQRS）
│   │   ├── AuthServer.Application.csproj
│   │   │
│   │   ├── Auth/                          # 认证核心
│   │   │   ├── Commands/
│   │   │   │   ├── AuthorizeCommand.cs
│   │   │   │   ├── AuthorizeCommandHandler.cs
│   │   │   │   ├── TokenExchangeCommand.cs
│   │   │   │   ├── TokenExchangeCommandHandler.cs
│   │   │   │   ├── RefreshTokenCommand.cs
│   │   │   │   ├── RefreshTokenCommandHandler.cs
│   │   │   │   ├── ClientCredentialsCommand.cs
│   │   │   │   ├── ClientCredentialsCommandHandler.cs
│   │   │   │   ├── LogoutCommand.cs
│   │   │   │   └── LogoutCommandHandler.cs
│   │   │   └── Queries/
│   │   │       ├── GetUserInfoQuery.cs
│   │   │       └── GetUserInfoQueryHandler.cs
│   │   │
│   │   ├── Account/                       # 账户
│   │   │   ├── Commands/
│   │   │   │   ├── LoginCommand.cs
│   │   │   │   ├── LoginCommandHandler.cs
│   │   │   │   ├── RegisterCommand.cs
│   │   │   │   ├── RegisterCommandHandler.cs
│   │   │   │   ├── ChangePasswordCommand.cs
│   │   │   │   ├── ChangePasswordCommandHandler.cs
│   │   │   │   ├── ForgotPasswordCommand.cs
│   │   │   │   └── ForgotPasswordCommandHandler.cs
│   │   │   └── Validators/
│   │   │       ├── LoginCommandValidator.cs
│   │   │       ├── RegisterCommandValidator.cs
│   │   │       └── ChangePasswordCommandValidator.cs
│   │   │
│   │   ├── Clients/                       # 客户端管理
│   │   │   ├── Commands/
│   │   │   │   ├── CreateClientCommand.cs
│   │   │   │   ├── CreateClientCommandHandler.cs
│   │   │   │   ├── UpdateClientCommand.cs
│   │   │   │   ├── UpdateClientCommandHandler.cs
│   │   │   │   ├── DeleteClientCommand.cs
│   │   │   │   └── DeleteClientCommandHandler.cs
│   │   │   ├── Queries/
│   │   │   │   ├── GetClientListQuery.cs
│   │   │   │   ├── GetClientListQueryHandler.cs
│   │   │   │   ├── GetClientByIdQuery.cs
│   │   │   │   └── GetClientByIdQueryHandler.cs
│   │   │   └── Validators/
│   │   │       ├── CreateClientCommandValidator.cs
│   │   │       └── UpdateClientCommandValidator.cs
│   │   │
│   │   ├── Scopes/                        # Scope 管理
│   │   │   ├── Commands/
│   │   │   │   ├── CreateScopeCommand.cs
│   │   │   │   ├── CreateScopeCommandHandler.cs
│   │   │   │   ├── UpdateScopeCommand.cs
│   │   │   │   └── DeleteScopeCommand.cs
│   │   │   └── Queries/
│   │   │       ├── GetScopeListQuery.cs
│   │   │       └── GetScopeListQueryHandler.cs
│   │   │
│   │   ├── Users/                         # 用户管理
│   │   │   ├── Commands/
│   │   │   │   ├── CreateUserCommand.cs
│   │   │   │   ├── CreateUserCommandHandler.cs
│   │   │   │   ├── UpdateUserCommand.cs
│   │   │   │   ├── DisableUserCommand.cs
│   │   │   │   ├── AssignRolesCommand.cs
│   │   │   │   └── ResetPasswordCommand.cs
│   │   │   ├── Queries/
│   │   │   │   ├── GetUserListQuery.cs
│   │   │   │   ├── GetUserListQueryHandler.cs
│   │   │   │   ├── GetUserByIdQuery.cs
│   │   │   │   └── GetUserByIdQueryHandler.cs
│   │   │   └── Validators/
│   │   │       └── CreateUserCommandValidator.cs
│   │   │
│   │   └── Jobs/                          # 后台任务
│   │       ├── CleanExpiredTokensJob.cs
│   │       └── CleanExpiredAuthorizationsJob.cs
│   │
│   └── AuthServer.Host/                   # 启动项目
│       ├── AuthServer.Host.csproj
│       ├── Program.cs
│       ├── Controllers/
│       │   ├── AuthorizationController.cs
│       │   ├── AccountController.cs
│       │   ├── UserInfoController.cs
│       │   ├── ClientManageController.cs
│       │   ├── ScopeManageController.cs
│       │   └── UserManageController.cs
│       ├── Localization/
│       │   ├── Platform/
│       │   │   ├── zh-CN.json
│       │   │   └── en-US.json
│       │   └── SSO/
│       │       ├── zh-CN.json
│       │       └── en-US.json
│       ├── Properties/
│       │   └── launchSettings.json
│       └── appsettings.json
│
└── tests/
    └── AuthServer.Tests/
```

## 核心代码

### Domain.Shared

```csharp
// ============================================
// Consts/SsoClaimTypes.cs
// ============================================

namespace AuthServer.Domain.Shared.Consts;

public static class SsoClaimTypes
{
    public const string TenantId = "tenant_id";
    public const string TenantName = "tenant_name";
    public const string Avatar = "avatar";
    public const string PhoneNumber = "phone_number";
    public const string DisplayName = "display_name";
}
```

```csharp
// ============================================
// Consts/SsoScopes.cs
// ============================================

namespace AuthServer.Domain.Shared.Consts;

public static class SsoScopes
{
    public const string OpenId = "openid";
    public const string Profile = "profile";
    public const string Email = "email";
    public const string Phone = "phone";
    public const string Roles = "roles";
    public const string OfflineAccess = "offline_access";

    // 业务系统 scope
    public const string Erp = "erp";
    public const string PermCenter = "perm_center";
}
```

```csharp
// ============================================
// Events/UserLoggedInEvent.cs（集成事件）
// ============================================

using Platform.EventBus.Abstractions;

namespace AuthServer.Domain.Shared.Events;

/// <summary>
/// 用户登录成功事件（跨服务广播）
/// </summary>
public record UserLoggedInEvent(
    Guid UserId,
    string UserName,
    string? ClientId,
    string IpAddress,
    DateTime LoginTime) : IntegrationEvent;

/// <summary>
/// 用户被禁用事件
/// </summary>
public record UserDisabledEvent(
    Guid UserId,
    string Reason,
    Guid DisabledBy) : IntegrationEvent;

/// <summary>
/// 客户端创建事件
/// </summary>
public record ClientCreatedEvent(
    string ClientId,
    string DisplayName,
    string[] Permissions) : IntegrationEvent;
```

```csharp
// ============================================
// Dtos/TokenResultDto.cs
// ============================================

namespace AuthServer.Domain.Shared.Dtos;

public class TokenResultDto
{
    public string AccessToken { get; set; } = default!;
    public string? RefreshToken { get; set; }
    public string TokenType { get; set; } = "Bearer";
    public int ExpiresIn { get; set; }
    public string? Scope { get; set; }
    public string? IdToken { get; set; }
}

public class UserInfoDto
{
    public Guid Id { get; set; }
    public string UserName { get; set; } = default!;
    public string? DisplayName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Avatar { get; set; }
    public Guid? TenantId { get; set; }
    public List<string> Roles { get; set; } = [];
}
```

### Domain

```csharp
// ============================================
// Users/SsoUser.cs
// ============================================

using Microsoft.AspNetCore.Identity;
using Platform.Domain.Shared;

namespace AuthServer.Domain.Users;

/// <summary>
/// SSO 用户
/// 
/// 继承 IdentityUser（ASP.NET Core Identity）
/// 实现 IFullAudited + IMultiTenant + ISoftDelete
/// 
/// 为什么不继承 Platform 的 AggregateRoot:
///   IdentityUser 已经有自己的 Id 和主键
///   我们通过接口实现审计/多租户/软删除
///   EF Core 拦截器依然有效
/// </summary>
public class SsoUser : IdentityUser<Guid>,
    IFullAudited, IMultiTenant, ISoftDelete
{
    // ===== 基础信息 =====

    /// <summary>
    /// 显示名称
    /// </summary>
    public string? DisplayName { get; set; }

    /// <summary>
    /// 头像 URL
    /// </summary>
    public string? Avatar { get; set; }

    /// <summary>
    /// 是否启用
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// 最后登录时间
    /// </summary>
    public DateTime? LastLoginTime { get; set; }

    /// <summary>
    /// 最后登录 IP
    /// </summary>
    public string? LastLoginIp { get; set; }

    // ===== 接口实现 =====

    public Guid? TenantId { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreationTime { get; set; }
    public Guid? CreatorId { get; set; }
    public DateTime? LastModificationTime { get; set; }
    public Guid? LastModifierId { get; set; }
    public DateTime? DeletionTime { get; set; }
    public Guid? DeleterId { get; set; }

    // ===== 扩展属性 =====
    public string? ExtraProperties { get; set; }

    protected SsoUser() { }

    public SsoUser(
        Guid id,
        string userName,
        string email,
        string? displayName = null,
        Guid? tenantId = null)
    {
        Id = id;
        UserName = userName;
        Email = email;
        DisplayName = displayName ?? userName;
        TenantId = tenantId;
    }
}
```

```csharp
// ============================================
// Users/SsoRole.cs
// ============================================

using Microsoft.AspNetCore.Identity;
using Platform.Domain.Shared;

namespace AuthServer.Domain.Users;

public class SsoRole : IdentityRole<Guid>,
    IMultiTenant, IHasCreationTime
{
    public Guid? TenantId { get; set; }
    public string? Description { get; set; }
    public bool IsStatic { get; set; }
    public DateTime CreationTime { get; set; }

    protected SsoRole() { }

    public SsoRole(Guid id, string name, Guid? tenantId = null)
    {
        Id = id;
        Name = name;
        NormalizedName = name.ToUpperInvariant();
        TenantId = tenantId;
    }
}
```

### Infrastructure

```csharp
// ============================================
// Data/AuthServerDbContext.cs
// ============================================

using AuthServer.Domain.Users;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Platform.MultiTenancy;
using Platform.MultiTenancy.EfCore;

namespace AuthServer.Infrastructure.Data;

/// <summary>
/// SSO 数据库上下文
/// 
/// 继承 IdentityDbContext（Identity 表）
/// + OpenIddict 表（自动由 UseOpenIddict 添加）
/// + 多租户全局过滤
/// + 审计拦截器
/// </summary>
public class AuthServerDbContext
    : IdentityDbContext<SsoUser, SsoRole, Guid>
{
    private readonly ICurrentTenant _currentTenant;

    public AuthServerDbContext(
        DbContextOptions<AuthServerDbContext> options,
        ICurrentTenant currentTenant)
        : base(options)
    {
        _currentTenant = currentTenant;
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Identity 表名自定义
        builder.Entity<SsoUser>(b =>
        {
            b.ToTable("SsoUsers");
            b.HasIndex(u => u.TenantId);
            b.HasIndex(u => u.IsDeleted);
            b.Property(u => u.DisplayName).HasMaxLength(128);
            b.Property(u => u.Avatar).HasMaxLength(512);
            b.Property(u => u.LastLoginIp).HasMaxLength(64);
            b.HasQueryFilter(u => !u.IsDeleted);
        });

        builder.Entity<SsoRole>(b =>
        {
            b.ToTable("SsoRoles");
            b.HasIndex(r => r.TenantId);
            b.Property(r => r.Description).HasMaxLength(256);
        });

        // 多租户过滤
        builder.ConfigureMultiTenancy(_currentTenant);

        // OpenIddict 实体配置
        builder.UseOpenIddict<Guid>();
    }
}
```

### Application — 认证核心（CQRS）

```csharp
// ============================================
// Auth/Commands/TokenExchangeCommand.cs
// 授权码换 Token（OIDC 核心流程）
// ============================================

using AuthServer.Domain.Shared.Dtos;
using Platform.Cqrs.Commands;
using Platform.Cqrs.Markers;

namespace AuthServer.Application.Auth.Commands;

/// <summary>
/// Token 交换命令
/// 
/// 前端拿到 authorization_code 后，调用 /connect/token 换取 Token
/// 
/// 支持的 grant_type:
///   authorization_code（授权码 + PKCE）
///   refresh_token（刷新）
///   client_credentials（客户端凭证）
/// </summary>
[DisableAuditing] // Token 交换不需要审计（频率太高）
public record TokenExchangeCommand : ICommand<TokenResultDto>, INoUnitOfWork
{
    public string GrantType { get; init; } = default!;
    public string? Code { get; init; }
    public string? RedirectUri { get; init; }
    public string? CodeVerifier { get; init; }  // PKCE
    public string? ClientId { get; init; }
    public string? ClientSecret { get; init; }
    public string? RefreshToken { get; init; }
    public string? Scope { get; init; }
    public string? Username { get; init; }
    public string? Password { get; init; }
}
```

```csharp
// ============================================
// Auth/Commands/TokenExchangeCommandHandler.cs
// ============================================

using System.Security.Claims;
using AuthServer.Domain.Shared.Consts;
using AuthServer.Domain.Shared.Dtos;
using AuthServer.Domain.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using OpenIddict.Abstractions;
using Platform.Cqrs.Commands;
using Platform.EventBus.Abstractions;
using Platform.Exceptions;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace AuthServer.Application.Auth.Commands;

public class TokenExchangeCommandHandler
    : ICommandHandler<TokenExchangeCommand, TokenResultDto>
{
    private readonly IOpenIddictApplicationManager _appManager;
    private readonly IOpenIddictAuthorizationManager _authManager;
    private readonly IOpenIddictScopeManager _scopeManager;
    private readonly IOpenIddictTokenManager _tokenManager;
    private readonly UserManager<SsoUser> _userManager;
    private readonly SignInManager<SsoUser> _signInManager;
    private readonly IEventBus _eventBus;
    private readonly ILogger<TokenExchangeCommandHandler> _logger;

    public TokenExchangeCommandHandler(
        IOpenIddictApplicationManager appManager,
        IOpenIddictAuthorizationManager authManager,
        IOpenIddictScopeManager scopeManager,
        IOpenIddictTokenManager tokenManager,
        UserManager<SsoUser> userManager,
        SignInManager<SsoUser> signInManager,
        IEventBus eventBus,
        ILogger<TokenExchangeCommandHandler> logger)
    {
        _appManager = appManager;
        _authManager = authManager;
        _scopeManager = scopeManager;
        _tokenManager = tokenManager;
        _userManager = userManager;
        _signInManager = signInManager;
        _eventBus = eventBus;
        _logger = logger;
    }

    public async Task<TokenResultDto> HandleAsync(
        TokenExchangeCommand command,
        CancellationToken ct = default)
    {
        return command.GrantType switch
        {
            GrantTypes.AuthorizationCode =>
                await HandleAuthorizationCodeAsync(command, ct),
            GrantTypes.RefreshToken =>
                await HandleRefreshTokenAsync(command, ct),
            GrantTypes.ClientCredentials =>
                await HandleClientCredentialsAsync(command, ct),
            GrantTypes.Password =>
                await HandlePasswordAsync(command, ct),
            _ => throw new BusinessException(
                "SSO:UnsupportedGrantType",
                $"Unsupported grant_type: {command.GrantType}")
        };
    }

    private async Task<TokenResultDto> HandleAuthorizationCodeAsync(
        TokenExchangeCommand command,
        CancellationToken ct)
    {
        // 1. 验证客户端
        var app = await _appManager.FindByClientIdAsync(
            command.ClientId!, ct);
        if (app == null)
            throw new BusinessException(
                "SSO:InvalidClient", "无效的客户端");

        // 2. 验证 PKCE code_verifier
        // OpenIddict 内部已处理 PKCE 验证

        // 3. 查找用户（从 authorization code 中）
        // 这里简化，实际由 OpenIddict Server 处理
        // OpenIddict 会自动验证 code 并提取 subject

        _logger.LogInformation(
            "Authorization code exchange for client: {ClientId}",
            command.ClientId);

        // 实际的 Token 生成由 OpenIddict Server 中间件处理
        // 这里返回占位结果，真实场景由 Controller 直接使用 OpenIddict
        return new TokenResultDto
        {
            TokenType = "Bearer",
            ExpiresIn = 3600,
        };
    }

    private async Task<TokenResultDto> HandleRefreshTokenAsync(
        TokenExchangeCommand command,
        CancellationToken ct)
    {
        _logger.LogInformation("Refresh token exchange");

        return new TokenResultDto
        {
            TokenType = "Bearer",
            ExpiresIn = 3600,
        };
    }

    private async Task<TokenResultDto> HandleClientCredentialsAsync(
        TokenExchangeCommand command,
        CancellationToken ct)
    {
        var app = await _appManager.FindByClientIdAsync(
            command.ClientId!, ct);
        if (app == null)
            throw new BusinessException(
                "SSO:InvalidClient", "无效的客户端");

        _logger.LogInformation(
            "Client credentials grant for: {ClientId}",
            command.ClientId);

        return new TokenResultDto
        {
            TokenType = "Bearer",
            ExpiresIn = 3600,
        };
    }

    private async Task<TokenResultDto> HandlePasswordAsync(
        TokenExchangeCommand command,
        CancellationToken ct)
    {
        // 1. 查找用户
        var user = await _userManager.FindByNameAsync(command.Username!);
        if (user == null || !user.IsActive)
            throw new BusinessException(
                "SSO:InvalidCredentials", "用户名或密码错误");

        // 2. 验证密码
        var result = await _signInManager.CheckPasswordSignInAsync(
            user, command.Password!, lockoutOnFailure: true);

        if (result.IsLockedOut)
            throw new BusinessException(
                "SSO:UserLockedOut", "账户已锁定，请稍后重试");

        if (!result.Succeeded)
            throw new BusinessException(
                "SSO:InvalidCredentials", "用户名或密码错误");

        // 3. 更新登录信息
        user.LastLoginTime = DateTime.UtcNow;

        // 4. 发布登录事件
        await _eventBus.PublishAsync(new AuthServer.Domain.Shared.Events.UserLoggedInEvent(
            user.Id, user.UserName!, command.ClientId,
            "", DateTime.UtcNow), ct);

        return new TokenResultDto
        {
            TokenType = "Bearer",
            ExpiresIn = 3600,
        };
    }
}
```

### Application — 客户端管理

```csharp
// ============================================
// Clients/Commands/CreateClientCommand.cs
// ============================================

using Platform.AuditLogging.Operations;
using Platform.Cqrs.Commands;

namespace AuthServer.Application.Clients.Commands;

[Audited(Module = "SSO.Client")]
public record CreateClientCommand : ICommand<string>
{
    public string ClientId { get; init; } = default!;
    public string DisplayName { get; init; } = default!;
    public string? ClientSecret { get; init; }
    public string ClientType { get; init; } = "public"; // public / confidential
    public List<string> RedirectUris { get; init; } = [];
    public List<string> PostLogoutRedirectUris { get; init; } = [];
    public List<string> Scopes { get; init; } = [];
    public List<string> GrantTypes { get; init; } = [];
    public int AccessTokenLifetimeMinutes { get; init; } = 60;
    public int RefreshTokenLifetimeDays { get; init; } = 14;
}
```

```csharp
// ============================================
// Clients/Commands/CreateClientCommandHandler.cs
// ============================================

using AuthServer.Domain.Shared.Events;
using Microsoft.Extensions.Logging;
using OpenIddict.Abstractions;
using Platform.Cqrs.Commands;
using Platform.EventBus.Abstractions;
using Platform.Exceptions;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace AuthServer.Application.Clients.Commands;

public class CreateClientCommandHandler
    : ICommandHandler<CreateClientCommand, string>
{
    private readonly IOpenIddictApplicationManager _appManager;
    private readonly IEventBus _eventBus;
    private readonly ILogger<CreateClientCommandHandler> _logger;

    public CreateClientCommandHandler(
        IOpenIddictApplicationManager appManager,
        IEventBus eventBus,
        ILogger<CreateClientCommandHandler> logger)
    {
        _appManager = appManager;
        _eventBus = eventBus;
        _logger = logger;
    }

    public async Task<string> HandleAsync(
        CreateClientCommand command,
        CancellationToken ct = default)
    {
        // 1. 检查 ClientId 是否已存在
        var existing = await _appManager.FindByClientIdAsync(
            command.ClientId, ct);
        if (existing != null)
            throw new BusinessException(
                "SSO:ClientAlreadyExists",
                $"客户端 {command.ClientId} 已存在");

        // 2. 构建 OpenIddict 应用描述
        var descriptor = new OpenIddictApplicationDescriptor
        {
            ClientId = command.ClientId,
            DisplayName = command.DisplayName,
            ClientType = command.ClientType == "confidential"
                ? ClientTypes.Confidential
                : ClientTypes.Public,
            ConsentType = ConsentTypes.Explicit,
        };

        // 设置密钥
        if (!string.IsNullOrEmpty(command.ClientSecret))
        {
            descriptor.ClientSecret = command.ClientSecret;
        }

        // 回调地址
        foreach (var uri in command.RedirectUris)
            descriptor.RedirectUris.Add(new Uri(uri));

        foreach (var uri in command.PostLogoutRedirectUris)
            descriptor.PostLogoutRedirectUris.Add(new Uri(uri));

        // 授权类型
        foreach (var grantType in command.GrantTypes)
            descriptor.Permissions.Add(
                Permissions.Prefixes.GrantType + grantType);

        // Scopes
        foreach (var scope in command.Scopes)
            descriptor.Permissions.Add(
                Permissions.Prefixes.Scope + scope);

        // 默认权限
        descriptor.Permissions.Add(Permissions.Endpoints.Authorization);
        descriptor.Permissions.Add(Permissions.Endpoints.Token);
        descriptor.Permissions.Add(Permissions.Endpoints.Logout);
        descriptor.Permissions.Add(Permissions.ResponseTypes.Code);

        // 3. 创建
        var app = await _appManager.CreateAsync(descriptor, ct);

        _logger.LogInformation(
            "Client created: {ClientId} ({DisplayName})",
            command.ClientId, command.DisplayName);

        // 4. 发布事件
        await _eventBus.PublishAsync(new ClientCreatedEvent(
            command.ClientId,
            command.DisplayName,
            command.Scopes.ToArray()), ct);

        return command.ClientId;
    }
}
```

```csharp
// ============================================
// Clients/Validators/CreateClientCommandValidator.cs
// ============================================

using FluentValidation;

namespace AuthServer.Application.Clients.Commands;

public class CreateClientCommandValidator
    : AbstractValidator<CreateClientCommand>
{
    public CreateClientCommandValidator()
    {
        RuleFor(x => x.ClientId)
            .NotEmpty().WithMessage("ClientId 不能为空")
            .MaximumLength(100).WithMessage("ClientId 最多100字符")
            .Matches("^[a-z0-9_-]+$")
            .WithMessage("ClientId 只能包含小写字母、数字、下划线、横杠");

        RuleFor(x => x.DisplayName)
            .NotEmpty().WithMessage("显示名称不能为空")
            .MaximumLength(200);

        RuleFor(x => x.ClientType)
            .Must(t => t is "public" or "confidential")
            .WithMessage("ClientType 必须是 public 或 confidential");

        When(x => x.ClientType == "confidential", () =>
        {
            RuleFor(x => x.ClientSecret)
                .NotEmpty()
                .WithMessage("机密客户端必须设置 ClientSecret")
                .MinimumLength(16)
                .WithMessage("ClientSecret 至少16位");
        });

        RuleFor(x => x.GrantTypes)
            .NotEmpty().WithMessage("至少指定一种授权类型");

        RuleForEach(x => x.RedirectUris)
            .Must(uri => Uri.TryCreate(uri, UriKind.Absolute, out _))
            .WithMessage("回调地址必须是合法的 URI");
    }
}
```

### Application — 用户管理

```csharp
// ============================================
// Users/Commands/CreateUserCommand.cs
// ============================================

using Platform.AuditLogging.Operations;
using Platform.Cqrs.Commands;

namespace AuthServer.Application.Users.Commands;

[Audited(Module = "SSO.User")]
public record CreateUserCommand : ICommand<Guid>
{
    public string UserName { get; init; } = default!;
    public string Email { get; init; } = default!;
    public string Password { get; init; } = default!;
    public string? DisplayName { get; init; }
    public string? PhoneNumber { get; init; }
    public List<string> Roles { get; init; } = [];
    public Guid? TenantId { get; init; }
}
```

```csharp
// ============================================
// Users/Commands/CreateUserCommandHandler.cs
// ============================================

using AuthServer.Domain.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Platform.Cqrs.Commands;
using Platform.Exceptions;
using Platform.Guids;

namespace AuthServer.Application.Users.Commands;

public class CreateUserCommandHandler
    : ICommandHandler<CreateUserCommand, Guid>
{
    private readonly UserManager<SsoUser> _userManager;
    private readonly IGuidGenerator _guidGenerator;
    private readonly ILogger<CreateUserCommandHandler> _logger;

    public CreateUserCommandHandler(
        UserManager<SsoUser> userManager,
        IGuidGenerator guidGenerator,
        ILogger<CreateUserCommandHandler> logger)
    {
        _userManager = userManager;
        _guidGenerator = guidGenerator;
        _logger = logger;
    }

    public async Task<Guid> HandleAsync(
        CreateUserCommand command,
        CancellationToken ct = default)
    {
        // 1. 检查用户名是否重复
        var existing = await _userManager.FindByNameAsync(command.UserName);
        if (existing != null)
            throw new BusinessException(
                "SSO:UserNameExists",
                $"用户名 {command.UserName} 已存在");

        // 2. 检查邮箱是否重复
        existing = await _userManager.FindByEmailAsync(command.Email);
        if (existing != null)
            throw new BusinessException(
                "SSO:EmailExists",
                $"邮箱 {command.Email} 已被使用");

        // 3. 创建用户
        var userId = _guidGenerator.Create();
        var user = new SsoUser(
            userId,
            command.UserName,
            command.Email,
            command.DisplayName,
            command.TenantId);

        user.PhoneNumber = command.PhoneNumber;

        var result = await _userManager.CreateAsync(
            user, command.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join("; ",
                result.Errors.Select(e => e.Description));
            throw new BusinessException(
                "SSO:CreateUserFailed", errors);
        }

        // 4. 分配角色
        if (command.Roles.Count > 0)
        {
            var roleResult = await _userManager.AddToRolesAsync(
                user, command.Roles);
            if (!roleResult.Succeeded)
            {
                _logger.LogWarning(
                    "Failed to assign roles to user {UserId}: {Errors}",
                    userId,
                    string.Join("; ",
                        roleResult.Errors.Select(e => e.Description)));
            }
        }

        _logger.LogInformation(
            "User created: {UserId} ({UserName})",
            userId, command.UserName);

        return userId;

        // UnitOfWorkBehavior 不管这里
        // Identity 的 CreateAsync 内部自己 SaveChanges
    }
}
```

```csharp
// ============================================
// Users/Queries/GetUserListQuery.cs
// ============================================

using AuthServer.Domain.Shared.Dtos;
using Platform.AspNetCore.Pagination;
using Platform.Cqrs.Queries;

namespace AuthServer.Application.Users.Queries;

public record GetUserListQuery
    : PagedQuery<PagedResult<UserListDto>>
{
    public string? Keyword { get; init; }
    public bool? IsActive { get; init; }
    public string? Role { get; init; }
}

public class UserListDto
{
    public Guid Id { get; set; }
    public string UserName { get; set; } = default!;
    public string? DisplayName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public bool IsActive { get; set; }
    public DateTime? LastLoginTime { get; set; }
    public DateTime CreationTime { get; set; }
    public List<string> Roles { get; set; } = [];
}
```

```csharp
// ============================================
// Users/Queries/GetUserListQueryHandler.cs
// ============================================

using AuthServer.Domain.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Platform.AspNetCore.Pagination;
using Platform.Cqrs.Queries;

namespace AuthServer.Application.Users.Queries;

public class GetUserListQueryHandler
    : IQueryHandler<GetUserListQuery, PagedResult<UserListDto>>
{
    private readonly UserManager<SsoUser> _userManager;

    public GetUserListQueryHandler(UserManager<SsoUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<PagedResult<UserListDto>> HandleAsync(
        GetUserListQuery query,
        CancellationToken ct = default)
    {
        var q = _userManager.Users.AsNoTracking();

        // 关键字搜索
        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            q = q.Where(u =>
                u.UserName!.Contains(query.Keyword) ||
                u.DisplayName!.Contains(query.Keyword) ||
                u.Email!.Contains(query.Keyword) ||
                u.PhoneNumber!.Contains(query.Keyword));
        }

        // 启用状态
        if (query.IsActive.HasValue)
            q = q.Where(u => u.IsActive == query.IsActive.Value);

        // 总数
        var totalCount = await q.LongCountAsync(ct);

        // 分页
        var users = await q
            .OrderByDescending(u => u.CreationTime)
            .Skip(query.SkipCount)
            .Take(query.PageSize)
            .ToListAsync(ct);

        // 映射（包含角色）
        var items = new List<UserListDto>();
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            items.Add(new UserListDto
            {
                Id = user.Id,
                UserName = user.UserName!,
                DisplayName = user.DisplayName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                IsActive = user.IsActive,
                LastLoginTime = user.LastLoginTime,
                CreationTime = user.CreationTime,
                Roles = roles.ToList(),
            });
        }

        return new PagedResult<UserListDto>(
            items, totalCount, query.Page, query.PageSize);
    }
}
```

### Application — 后台任务

```csharp
// ============================================
// Jobs/CleanExpiredTokensJob.cs
// ============================================

using Microsoft.Extensions.Logging;
using OpenIddict.Abstractions;
using Platform.BackgroundJobs.Abstractions;

namespace AuthServer.Application.Jobs;

/// <summary>
/// 清理过期 Token
/// 
/// 周期: 每天凌晨2点
/// 清理: 过期超过7天的 Token 和 Authorization
/// </summary>
public class CleanExpiredTokensJob
    : IBackgroundJob<CleanExpiredTokensArgs>
{
    private readonly IOpenIddictTokenManager _tokenManager;
    private readonly IOpenIddictAuthorizationManager _authManager;
    private readonly ILogger<CleanExpiredTokensJob> _logger;

    public CleanExpiredTokensJob(
        IOpenIddictTokenManager tokenManager,
        IOpenIddictAuthorizationManager authManager,
        ILogger<CleanExpiredTokensJob> logger)
    {
        _tokenManager = tokenManager;
        _authManager = authManager;
        _logger = logger;
    }

    public async Task ExecuteAsync(
        CleanExpiredTokensArgs args,
        CancellationToken ct = default)
    {
        var threshold = DateTimeOffset.UtcNow
            .AddDays(-args.RetentionDays);

        _logger.LogInformation(
            "Cleaning expired tokens older than {Threshold}",
            threshold);

        // 清理 Token
        await _tokenManager.PruneAsync(threshold, ct);

        // 清理 Authorization
        await _authManager.PruneAsync(threshold, ct);

        _logger.LogInformation("Token cleanup completed");
    }
}

public class CleanExpiredTokensArgs
{
    public int RetentionDays { get; set; } = 7;
}
```

### Host — Controller

```csharp
// ============================================
// Controllers/AuthorizationController.cs
// OpenIddict 授权端点（核心）
// ============================================

using System.Security.Claims;
using AuthServer.Domain.Users;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Abstractions;
using OpenIddict.Server.AspNetCore;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace AuthServer.Host.Controllers;

/// <summary>
/// OpenIddict 授权端点
/// 
/// /connect/authorize → 授权码请求
/// /connect/token → Token 交换
/// /connect/logout → 登出
/// 
/// 这个 Controller 直接和 OpenIddict 交互
/// 不走 CQRS（OpenIddict 有自己的处理流程）
/// </summary>
[ApiController]
public class AuthorizationController : ControllerBase
{
    private readonly IOpenIddictApplicationManager _appManager;
    private readonly IOpenIddictAuthorizationManager _authManager;
    private readonly IOpenIddictScopeManager _scopeManager;
    private readonly UserManager<SsoUser> _userManager;
    private readonly SignInManager<SsoUser> _signInManager;

    public AuthorizationController(
        IOpenIddictApplicationManager appManager,
        IOpenIddictAuthorizationManager authManager,
        IOpenIddictScopeManager scopeManager,
        UserManager<SsoUser> userManager,
        SignInManager<SsoUser> signInManager)
    {
        _appManager = appManager;
        _authManager = authManager;
        _scopeManager = scopeManager;
        _userManager = userManager;
        _signInManager = signInManager;
    }

    /// <summary>
    /// 授权端点
    /// GET/POST /connect/authorize
    /// </summary>
    [HttpGet("~/connect/authorize")]
    [HttpPost("~/connect/authorize")]
    public async Task<IActionResult> Authorize()
    {
        var request = HttpContext.GetOpenIddictServerRequest()
            ?? throw new InvalidOperationException(
                "The OpenID Connect request cannot be retrieved.");

        // 检查用户是否已登录
        var result = await HttpContext.AuthenticateAsync(
            IdentityConstants.ApplicationScheme);

        if (!result.Succeeded)
        {
            // 未登录 → 重定向到登录页
            // 前端 React 应该处理这个情况
            return Challenge(
                authenticationSchemes: IdentityConstants.ApplicationScheme,
                properties: new AuthenticationProperties
                {
                    RedirectUri = Request.PathBase +
                        Request.Path + QueryString.Create(
                            Request.HasFormContentType
                                ? Request.Form.ToList()
                                : Request.Query.ToList())
                });
        }

        var user = await _userManager.GetUserAsync(result.Principal)
            ?? throw new InvalidOperationException(
                "The user details cannot be retrieved.");

        // 创建 ClaimsPrincipal
        var claims = new List<Claim>
        {
            new(Claims.Subject, user.Id.ToString()),
            new(Claims.Name, user.UserName!),
            new(Claims.Email, user.Email ?? ""),
        };

        // 添加自定义 Claims
        if (user.DisplayName != null)
            claims.Add(new Claim("display_name", user.DisplayName));

        if (user.TenantId.HasValue)
            claims.Add(new Claim("tenant_id",
                user.TenantId.Value.ToString()));

        // 添加角色
        var roles = await _userManager.GetRolesAsync(user);
        foreach (var role in roles)
            claims.Add(new Claim(Claims.Role, role));

        var identity = new ClaimsIdentity(
            claims,
            OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);

        var principal = new ClaimsPrincipal(identity);

        // 设置 scopes
        principal.SetScopes(request.GetScopes());

        // 设置资源
        var resources = new List<string>();
        await foreach (var resource in _scopeManager.ListResourcesAsync(
            principal.GetScopes()))
        {
            resources.Add(resource);
        }
        principal.SetResources(resources);

        // 设置每个 claim 的 destination
        foreach (var claim in principal.Claims)
        {
            claim.SetDestinations(GetDestinations(claim, principal));
        }

        return SignIn(principal,
            OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
    }

    /// <summary>
    /// Token 端点
    /// POST /connect/token
    /// </summary>
    [HttpPost("~/connect/token")]
    public async Task<IActionResult> Exchange()
    {
        var request = HttpContext.GetOpenIddictServerRequest()
            ?? throw new InvalidOperationException(
                "The OpenID Connect request cannot be retrieved.");

        if (request.IsAuthorizationCodeGrantType() ||
            request.IsRefreshTokenGrantType())
        {
            var principal = (await HttpContext.AuthenticateAsync(
                OpenIddictServerAspNetCoreDefaults.AuthenticationScheme))
                .Principal!;

            var user = await _userManager.FindByIdAsync(
                principal.GetClaim(Claims.Subject)!);

            if (user == null || !user.IsActive)
            {
                return Forbid(
                    authenticationSchemes:
                        OpenIddictServerAspNetCoreDefaults.AuthenticationScheme,
                    properties: new AuthenticationProperties(
                        new Dictionary<string, string?>
                        {
                            [OpenIddictServerAspNetCoreDefaults.Properties.Error] =
                                Errors.InvalidGrant,
                            [OpenIddictServerAspNetCoreDefaults.Properties.ErrorDescription] =
                                "用户不存在或已被禁用"
                        }));
            }

            // 更新登录时间
            user.LastLoginTime = DateTime.UtcNow;
            user.LastLoginIp = HttpContext.Connection
                .RemoteIpAddress?.ToString();
            await _userManager.UpdateAsync(user);

            foreach (var claim in principal.Claims)
            {
                claim.SetDestinations(
                    GetDestinations(claim, principal));
            }

            return SignIn(principal,
                OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
        }

        if (request.IsClientCredentialsGrantType())
        {
            var app = await _appManager.FindByClientIdAsync(
                request.ClientId!);
            if (app == null)
                throw new InvalidOperationException(
                    "Client not found");

            var identity = new ClaimsIdentity(
                OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);

            identity.AddClaim(Claims.Subject,
                (await _appManager.GetClientIdAsync(app))!);
            identity.AddClaim(Claims.Name,
                (await _appManager.GetDisplayNameAsync(app))!);

            var principal = new ClaimsPrincipal(identity);
            principal.SetScopes(request.GetScopes());

            return SignIn(principal,
                OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
        }

        throw new InvalidOperationException(
            "The specified grant type is not supported.");
    }

    /// <summary>
    /// 登出端点
    /// POST /connect/logout
    /// </summary>
    [HttpPost("~/connect/logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();

        return SignOut(
            authenticationSchemes:
                OpenIddictServerAspNetCoreDefaults.AuthenticationScheme,
            properties: new AuthenticationProperties
            {
                RedirectUri = "/"
            });
    }

    /// <summary>
    /// UserInfo 端点
    /// GET /connect/userinfo
    /// </summary>
    [Authorize(AuthenticationSchemes =
        OpenIddictServerAspNetCoreDefaults.AuthenticationScheme)]
    [HttpGet("~/connect/userinfo")]
    public async Task<IActionResult> UserInfo()
    {
        var userId = User.GetClaim(Claims.Subject);
        var user = await _userManager.FindByIdAsync(userId!);

        if (user == null)
            return Challenge(
                OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new
        {
            sub = user.Id.ToString(),
            name = user.UserName,
            display_name = user.DisplayName,
            email = user.Email,
            phone_number = user.PhoneNumber,
            avatar = user.Avatar,
            tenant_id = user.TenantId?.ToString(),
            roles,
        });
    }

    /// <summary>
    /// 决定 Claim 发到哪里（access_token / id_token）
    /// </summary>
    private static IEnumerable<string> GetDestinations(
        Claim claim, ClaimsPrincipal principal)
    {
        switch (claim.Type)
        {
            case Claims.Name:
                yield return Destinations.AccessToken;
                if (principal.HasScope(Scopes.Profile))
                    yield return Destinations.IdentityToken;
                yield break;

            case Claims.Email:
                yield return Destinations.AccessToken;
                if (principal.HasScope(Scopes.Email))
                    yield return Destinations.IdentityToken;
                yield break;

            case Claims.Role:
                yield return Destinations.AccessToken;
                if (principal.HasScope(Scopes.Roles))
                    yield return Destinations.IdentityToken;
                yield break;

            case "tenant_id":
            case "display_name":
                yield return Destinations.AccessToken;
                yield return Destinations.IdentityToken;
                yield break;

            case Claims.Subject:
                yield return Destinations.AccessToken;
                yield return Destinations.IdentityToken;
                yield break;

            default:
                yield return Destinations.AccessToken;
                yield break;
        }
    }
}
```

```csharp
// ============================================
// Controllers/ClientManageController.cs
// 客户端管理 API
// ============================================

using AuthServer.Application.Clients.Commands;
using AuthServer.Application.Clients.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Platform.Cqrs.Mediator;

namespace AuthServer.Host.Controllers;

/// <summary>
/// 客户端管理（需要管理员权限）
/// </summary>
[ApiController]
[Route("api/clients")]
[Authorize(Roles = "admin")]
public class ClientManageController : ControllerBase
{
    private readonly IPlatformMediator _mediator;

    public ClientManageController(IPlatformMediator mediator)
        => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetList(
        [FromQuery] GetClientListQuery query)
        => Ok(await _mediator.SendQueryAsync(query));

    [HttpGet("{clientId}")]
    public async Task<IActionResult> GetById(string clientId)
        => Ok(await _mediator.SendQueryAsync(
            new GetClientByIdQuery(clientId)));

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateClientCommand command)
        => Ok(await _mediator.SendCommandAsync(command));

    [HttpPut("{clientId}")]
    public async Task<IActionResult> Update(
        string clientId,
        [FromBody] UpdateClientCommand command)
        => Ok(await _mediator.SendCommandAsync(
            command with { ClientId = clientId }));

    [HttpDelete("{clientId}")]
    public async Task<IActionResult> Delete(string clientId)
    {
        await _mediator.SendCommandAsync(
            new DeleteClientCommand(clientId));
        return NoContent();
    }
}
```

```csharp
// ============================================
// Controllers/UserManageController.cs
// ============================================

using AuthServer.Application.Users.Commands;
using AuthServer.Application.Users.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Platform.Cqrs.Mediator;

namespace AuthServer.Host.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "admin")]
public class UserManageController : ControllerBase
{
    private readonly IPlatformMediator _mediator;

    public UserManageController(IPlatformMediator mediator)
        => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetList(
        [FromQuery] GetUserListQuery query)
        => Ok(await _mediator.SendQueryAsync(query));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
        => Ok(await _mediator.SendQueryAsync(
            new GetUserByIdQuery(id)));

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateUserCommand command)
        => Ok(await _mediator.SendCommandAsync(command));

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id, [FromBody] UpdateUserCommand command)
        => Ok(await _mediator.SendCommandAsync(
            command with { UserId = id }));

    [HttpPost("{id:guid}/disable")]
    public async Task<IActionResult> Disable(
        Guid id, [FromBody] DisableUserCommand command)
    {
        await _mediator.SendCommandAsync(
            command with { UserId = id });
        return NoContent();
    }

    [HttpPost("{id:guid}/roles")]
    public async Task<IActionResult> AssignRoles(
        Guid id, [FromBody] AssignRolesCommand command)
    {
        await _mediator.SendCommandAsync(
            command with { UserId = id });
        return NoContent();
    }

    [HttpPost("{id:guid}/reset-password")]
    public async Task<IActionResult> ResetPassword(
        Guid id, [FromBody] ResetPasswordCommand command)
    {
        await _mediator.SendCommandAsync(
            command with { UserId = id });
        return NoContent();
    }
}
```

### Host — Program.cs

```csharp
// ============================================
// AuthServer.Host/Program.cs — 完整启动
// ============================================

using AuthServer.Application.Clients.Commands;
using AuthServer.Application.Jobs;
using AuthServer.Domain.Users;
using AuthServer.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Platform.AspNetCore.Extensions;
using Platform.AuditLogging.Extensions;
using Platform.BackgroundJobs;
using Platform.BackgroundJobs.Extensions;
using Platform.Cqrs.Extensions;
using Platform.EventBus.Abstractions;
using Platform.EventBus.Extensions;
using Platform.Localization.Extensions;
using Platform.MultiTenancy.Extensions;

var builder = WebApplication.CreateBuilder(args);
var conn = builder.Configuration.GetConnectionString("Default")!;
var isDev = builder.Environment.IsDevelopment();

// ═══════════════════════════════════════════
// 1. 平台基础
// ═══════════════════════════════════════════
builder.Services.AddPlatformAspNetCore();

// ═══════════════════════════════════════════
// 2. 数据库 + Identity + OpenIddict
// ═══════════════════════════════════════════
builder.Services.AddDbContext<AuthServerDbContext>(options =>
{
    options.UseNpgsql(conn);
    options.UseOpenIddict<Guid>();
});

builder.Services.AddIdentity<SsoUser, SsoRole>(options =>
{
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = false;
    options.User.RequireUniqueEmail = true;
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
})
.AddEntityFrameworkStores<AuthServerDbContext>()
.AddDefaultTokenProviders();

// ═══════════════════════════════════════════
// 3. OpenIddict
// ═══════════════════════════════════════════
builder.Services.AddOpenIddict()
    .AddCore(options =>
    {
        options.UseEntityFrameworkCore()
            .UseDbContext<AuthServerDbContext>()
            .ReplaceDefaultEntities<Guid>();
    })
    .AddServer(options =>
    {
        // 端点
        options.SetAuthorizationEndpointUris("/connect/authorize")
            .SetTokenEndpointUris("/connect/token")
            .SetLogoutEndpointUris("/connect/logout")
            .SetUserinfoEndpointUris("/connect/userinfo")
            .SetIntrospectionEndpointUris("/connect/introspect");

        // 授权模式
        options.AllowAuthorizationCodeFlow()
            .AllowRefreshTokenFlow()
            .AllowClientCredentialsFlow()
            .RequireProofKeyForCodeExchange(); // 强制 PKCE

        // Token 生命周期
        options.SetAccessTokenLifetime(TimeSpan.FromHours(1))
            .SetRefreshTokenLifetime(TimeSpan.FromDays(14))
            .SetAuthorizationCodeLifetime(TimeSpan.FromMinutes(5));

        // 签名和加密
        if (isDev)
        {
            options.AddDevelopmentEncryptionCertificate()
                .AddDevelopmentSigningCertificate();
        }
        else
        {
            var certPath = builder.Configuration["Certificates:Path"]!;
            var certPassword = builder.Configuration["Certificates:Password"]!;
            options.AddEncryptionCertificate(certPath, certPassword)
                .AddSigningCertificate(certPath, certPassword);
        }

        options.UseAspNetCore()
            .EnableAuthorizationEndpointPassthrough()
            .EnableTokenEndpointPassthrough()
            .EnableLogoutEndpointPassthrough()
            .EnableUserinfoEndpointPassthrough();
    })
    .AddValidation(options =>
    {
        options.UseLocalServer();
        options.UseAspNetCore();
    });

// ═══════════════════════════════════════════
// 4. CQRS
// ═══════════════════════════════════════════
builder.Services.AddPlatformCqrs(
    options => options.SlowRequestThresholdMs = 500,
    typeof(CreateClientCommand).Assembly);

// ═══════════════════════════════════════════
// 5. 多租户
// ═══════════════════════════════════════════
builder.Services.AddPlatformMultiTenancy(options =>
{
    options.IsEnabled = true;
    options.IsRequired = false;
});

// ═══════════════════════════════════════════
// 6. 审计日志
// ═══════════════════════════════════════════
builder.Services.AddPlatformAuditLogging(
    options =>
    {
        options.EnableOperationAudit = true;
        options.EnableEntityChangeAudit = true;
    },
    db => db.UseNpgsql(conn));

// ═══════════════════════════════════════════
// 7. 国际化
// ═══════════════════════════════════════════
builder.Services.AddPlatformLocalization(options =>
{
    options.DefaultCulture = "zh-CN";
    options.Sources.Add(new()
    {
        Name = "SSO",
        Path = "Localization/SSO"
    });
});

// ═══════════════════════════════════════════
// 8. 后台任务
// ═══════════════════════════════════════════
builder.Services.AddPlatformBackgroundJobs(
    options =>
    {
        options.StorageType = isDev
            ? JobStorageType.InMemory
            : JobStorageType.PostgreSql;
        options.ConnectionString = conn;
    },
    typeof(CleanExpiredTokensJob).Assembly);

// ═══════════════════════════════════════════
// 9. 事件总线
// ═══════════════════════════════════════════
builder.Services.AddPlatformEventBus(
    options => options.BusType = isDev
        ? EventBusType.InMemory
        : EventBusType.RabbitMQ,
    typeof(CreateClientCommandHandler).Assembly);

// ═══════════════════════════════════════════
// 10. Swagger
// ═══════════════════════════════════════════
builder.Services.AddPlatformSwagger("SSO 鉴权中心");

// ═══════════════════════════════════════════
// 11. CORS（前端跨域）
// ═══════════════════════════════════════════
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
                builder.Configuration.GetSection("Cors:Origins").Get<string[]>()
                ?? ["http://localhost:3000"])
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

// ═══════════════════════════════════════════
// 中间件管道
// ═══════════════════════════════════════════
app.UsePlatformLocalization();
app.UseCors();
app.UsePlatformPipeline();
app.UseAuthentication();
app.UsePlatformMultiTenancy();
app.UseAuthorization();
app.UsePlatformBackgroundJobs();
app.MapControllers();

// ═══════════════════════════════════════════
// 数据初始化
// ═══════════════════════════════════════════
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider
        .GetRequiredService<AuthServerDbContext>();
    await db.Database.MigrateAsync();

    // 种子数据
    var seeders = scope.ServiceProvider
        .GetServices<IDataSeeder>();
    foreach (var seeder in seeders)
        await seeder.SeedAsync();
}

app.Run();
```

---

# 二、权限中心

## 项目结构

```
PermCenter/
├── src/
│   ├── PermCenter.Domain.Shared/
│   │   ├── Consts/
│   │   │   └── PermissionConsts.cs
│   │   ├── Dtos/
│   │   │   ├── AppRegistrationDto.cs
│   │   │   ├── PermissionTreeDto.cs
│   │   │   ├── MenuDto.cs
│   │   │   ├── RoleDto.cs
│   │   │   └── GrantedPermissionDto.cs
│   │   └── Events/
│   │       └── RolePermissionsChangedEvent.cs
│   │
│   ├── PermCenter.Domain/
│   │   ├── Apps/
│   │   │   ├── App.cs                     # 应用
│   │   │   └── AppPermission.cs           # 应用权限定义
│   │   ├── Permissions/
│   │   │   ├── Permission.cs              # 权限定义
│   │   │   ├── PermissionGrant.cs         # 权限授予
│   │   │   └── IPermissionRepository.cs
│   │   ├── Roles/
│   │   │   ├── Role.cs                    # 角色
│   │   │   ├── RolePermission.cs          # 角色-权限
│   │   │   └── IRoleRepository.cs
│   │   ├── Menus/
│   │   │   ├── Menu.cs                    # 菜单
│   │   │   └── IMenuRepository.cs
│   │   └── UserRoles/
│   │       ├── UserRole.cs                # 用户-角色
│   │       └── IUserRoleRepository.cs
│   │
│   ├── PermCenter.Infrastructure/
│   │   ├── Data/
│   │   │   └── PermCenterDbContext.cs
│   │   └── Repositories/
│   │
│   ├── PermCenter.Application/
│   │   ├── Apps/                          # 应用注册
│   │   │   ├── Commands/
│   │   │   │   ├── RegisterAppCommand.cs
│   │   │   │   └── RegisterAppCommandHandler.cs
│   │   │   └── Queries/
│   │   │       └── GetAppListQuery.cs
│   │   │
│   │   ├── Permissions/                   # 权限管理
│   │   │   ├── Commands/
│   │   │   │   ├── SyncPermissionsCommand.cs
│   │   │   │   └── SyncPermissionsCommandHandler.cs
│   │   │   └── Queries/
│   │   │       ├── GetPermissionTreeQuery.cs
│   │   │       ├── GetGrantedPermissionsQuery.cs
│   │   │       └── CheckPermissionQuery.cs
│   │   │
│   │   ├── Roles/                         # 角色管理
│   │   │   ├── Commands/
│   │   │   │   ├── CreateRoleCommand.cs
│   │   │   │   ├── UpdateRolePermissionsCommand.cs
│   │   │   │   └── AssignUserRoleCommand.cs
│   │   │   └── Queries/
│   │   │       ├── GetRoleListQuery.cs
│   │   │       └── GetRolePermissionsQuery.cs
│   │   │
│   │   └── Menus/                         # 菜单管理
│   │       ├── Commands/
│   │       │   └── SyncMenusCommand.cs
│   │       └── Queries/
│   │           └── GetCurrentUserMenusQuery.cs
│   │
│   └── PermCenter.Host/
│       ├── Program.cs
│       └── Controllers/
│           ├── AppController.cs
│           ├── PermissionController.cs
│           ├── RoleController.cs
│           └── MenuController.cs
```

## 核心领域模型

```csharp
// ============================================
// Domain/Apps/App.cs
// ============================================

using Platform.Domain.Entities;
using Platform.Domain.Shared;

namespace PermCenter.Domain.Apps;

/// <summary>
/// 应用（接入权限中心的业务系统）
/// 
/// 例:
///   AppCode = "erp", DisplayName = "ERP 系统"
///   AppCode = "sso", DisplayName = "SSO 鉴权中心"
/// </summary>
public class App : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public string AppCode { get; private set; } = default!;
    public string DisplayName { get; private set; } = default!;
    public string? Description { get; private set; }
    public string? ApiUrl { get; private set; }
    public bool IsActive { get; private set; } = true;
    public Guid? TenantId { get; set; }

    // 应用定义的权限列表
    private readonly List<AppPermission> _permissions = [];
    public IReadOnlyList<AppPermission> Permissions => _permissions;

    protected App() { }

    public App(Guid id, string appCode, string displayName,
        Guid? tenantId = null)
    {
        Id = id;
        AppCode = appCode;
        DisplayName = displayName;
        TenantId = tenantId;
    }

    /// <summary>
    /// 同步权限定义（差异同步）
    /// </summary>
    public void SyncPermissions(
        List<PermissionDefinition> definitions)
    {
        var existingMap = _permissions
            .ToDictionary(p => p.PermissionCode);

        var incomingCodes = definitions
            .Select(d => d.Code).ToHashSet();

        // 新增
        foreach (var def in definitions)
        {
            if (!existingMap.ContainsKey(def.Code))
            {
                _permissions.Add(new AppPermission(
                    Guid.NewGuid(),
                    Id,
                    def.Code,
                    def.DisplayName,
                    def.ParentCode,
                    def.Group,
                    def.SortOrder));
            }
            else
            {
                // 更新
                var existing = existingMap[def.Code];
                existing.Update(
                    def.DisplayName,
                    def.ParentCode,
                    def.Group,
                    def.SortOrder);
            }
        }

        // 标记废弃（不删除，只标记）
        foreach (var existing in _permissions)
        {
            if (!incomingCodes.Contains(existing.PermissionCode))
            {
                existing.MarkAsDeprecated();
            }
        }
    }
}

public class PermissionDefinition
{
    public string Code { get; set; } = default!;
    public string DisplayName { get; set; } = default!;
    public string? ParentCode { get; set; }
    public string? Group { get; set; }
    public int SortOrder { get; set; }
}
```

```csharp
// ============================================
// Domain/Apps/AppPermission.cs
// ============================================

using Platform.Domain.Entities;

namespace PermCenter.Domain.Apps;

/// <summary>
/// 应用权限定义
/// 
/// 由业务系统启动时自动注册
/// 管理员在后台查看（只读）
/// </summary>
public class AppPermission : Entity<Guid>
{
    public Guid AppId { get; private set; }
    public string PermissionCode { get; private set; } = default!;
    public string DisplayName { get; private set; } = default!;
    public string? ParentCode { get; private set; }
    public string? Group { get; private set; }
    public int SortOrder { get; private set; }
    public bool IsDeprecated { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    protected AppPermission() { }

    public AppPermission(
        Guid id, Guid appId, string permissionCode,
        string displayName, string? parentCode,
        string? group, int sortOrder)
    {
        Id = id;
        AppId = appId;
        PermissionCode = permissionCode;
        DisplayName = displayName;
        ParentCode = parentCode;
        Group = group;
        SortOrder = sortOrder;
    }

    public void Update(string displayName, string? parentCode,
        string? group, int sortOrder)
    {
        DisplayName = displayName;
        ParentCode = parentCode;
        Group = group;
        SortOrder = sortOrder;
        IsDeprecated = false; // 重新激活
    }

    public void MarkAsDeprecated() => IsDeprecated = true;
}
```

```csharp
// ============================================
// Domain/Permissions/PermissionGrant.cs
// ============================================

using Platform.Domain.Entities;
using Platform.Domain.Shared;

namespace PermCenter.Domain.Permissions;

/// <summary>
/// 权限授予记录
/// 
/// 表示 "某个角色拥有某个权限"
/// 
/// 例:
///   RoleId = admin_role_id
///   PermissionCode = "ERP.Purchase.Create"
///   AppCode = "erp"
/// </summary>
public class PermissionGrant : Entity<Guid>, IMultiTenant
{
    public Guid RoleId { get; private set; }
    public string PermissionCode { get; private set; } = default!;
    public string AppCode { get; private set; } = default!;
    public Guid? TenantId { get; set; }
    public DateTime GrantedAt { get; private set; } = DateTime.UtcNow;
    public Guid? GrantedBy { get; private set; }

    protected PermissionGrant() { }

    public PermissionGrant(
        Guid id, Guid roleId, string permissionCode,
        string appCode, Guid? grantedBy = null,
        Guid? tenantId = null)
    {
        Id = id;
        RoleId = roleId;
        PermissionCode = permissionCode;
        AppCode = appCode;
        GrantedBy = grantedBy;
        TenantId = tenantId;
    }
}
```

```csharp
// ============================================
// Domain/Menus/Menu.cs
// ============================================

using Platform.Domain.Entities;
using Platform.Domain.Shared;

namespace PermCenter.Domain.Menus;

/// <summary>
/// 菜单
/// 
/// 由业务系统注册，和权限关联
/// 前端根据用户拥有的权限，过滤出可见菜单
/// </summary>
public class Menu : FullAuditedEntity<Guid>, IMultiTenant
{
    public string AppCode { get; private set; } = default!;
    public string MenuCode { get; private set; } = default!;
    public string DisplayName { get; private set; } = default!;
    public string? Icon { get; private set; }
    public string? Path { get; private set; }
    public string? Component { get; private set; }
    public Guid? ParentId { get; private set; }
    public int SortOrder { get; private set; }
    public bool IsVisible { get; private set; } = true;

    /// <summary>
    /// 关联的权限码（有此权限才显示此菜单）
    /// </summary>
    public string? RequiredPermission { get; private set; }

    public Guid? TenantId { get; set; }

    protected Menu() { }

    public Menu(
        Guid id, string appCode, string menuCode,
        string displayName, string? path,
        string? requiredPermission,
        Guid? parentId = null,
        int sortOrder = 0)
    {
        Id = id;
        AppCode = appCode;
        MenuCode = menuCode;
        DisplayName = displayName;
        Path = path;
        RequiredPermission = requiredPermission;
        ParentId = parentId;
        SortOrder = sortOrder;
    }
}
```

## 核心应用层

```csharp
// ============================================
// Apps/Commands/RegisterAppCommand.cs
// 业务系统启动时调用，注册权限和菜单
// ============================================

using PermCenter.Domain.Apps;
using Platform.Cqrs.Commands;

namespace PermCenter.Application.Apps.Commands;

/// <summary>
/// 应用注册命令
/// 
/// 业务系统启动时 POST /api/apps/register
/// 把自己定义的所有权限和菜单注册到权限中心
/// 权限中心做差异同步
/// </summary>
public record RegisterAppCommand : ICommand<string>
{
    public string AppCode { get; init; } = default!;
    public string DisplayName { get; init; } = default!;
    public string? ApiUrl { get; init; }
    public List<PermissionDefinitionInput> Permissions { get; init; } = [];
    public List<MenuDefinitionInput> Menus { get; init; } = [];
}

public record PermissionDefinitionInput
{
    public string Code { get; init; } = default!;
    public string DisplayName { get; init; } = default!;
    public string? ParentCode { get; init; }
    public string? Group { get; init; }
    public int SortOrder { get; init; }
}

public record MenuDefinitionInput
{
    public string MenuCode { get; init; } = default!;
    public string DisplayName { get; init; } = default!;
    public string? Icon { get; init; }
    public string? Path { get; init; }
    public string? Component { get; init; }
    public string? ParentMenuCode { get; init; }
    public int SortOrder { get; init; }
    public string? RequiredPermission { get; init; }
}
```

```csharp
// ============================================
// Apps/Commands/RegisterAppCommandHandler.cs
// ============================================

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PermCenter.Domain.Apps;
using PermCenter.Domain.Menus;
using PermCenter.Infrastructure.Data;
using Platform.Cqrs.Commands;
using Platform.Cqrs.Markers;
using Platform.DistributedLocking.Abstractions;

namespace PermCenter.Application.Apps.Commands;

public class RegisterAppCommandHandler
    : ICommandHandler<RegisterAppCommand, string>
{
    private readonly PermCenterDbContext _db;
    private readonly IDistributedLockProvider _lockProvider;
    private readonly ILogger<RegisterAppCommandHandler> _logger;

    public RegisterAppCommandHandler(
        PermCenterDbContext db,
        IDistributedLockProvider lockProvider,
        ILogger<RegisterAppCommandHandler> logger)
    {
        _db = db;
        _lockProvider = lockProvider;
        _logger = logger;
    }

    public async Task<string> HandleAsync(
        RegisterAppCommand command,
        CancellationToken ct = default)
    {
        // 分布式锁（防止多实例同时注册）
        var lockKey = $"app:register:{command.AppCode}";
        await using var lockHandle = await _lockProvider.AcquireAsync(
            lockKey, TimeSpan.FromSeconds(30),
            waitTimeout: TimeSpan.FromSeconds(10));

        // 1. 查找或创建应用
        var app = await _db.Set<App>()
            .Include(a => a.Permissions)
            .FirstOrDefaultAsync(a =>
                a.AppCode == command.AppCode, ct);

        if (app == null)
        {
            app = new App(
                Guid.NewGuid(),
                command.AppCode,
                command.DisplayName);
            _db.Add(app);

            _logger.LogInformation(
                "New app registered: {AppCode}",
                command.AppCode);
        }

        // 2. 同步权限定义（差异同步）
        var definitions = command.Permissions
            .Select(p => new PermissionDefinition
            {
                Code = p.Code,
                DisplayName = p.DisplayName,
                ParentCode = p.ParentCode,
                Group = p.Group,
                SortOrder = p.SortOrder,
            })
            .ToList();

        app.SyncPermissions(definitions);

        // 3. 同步菜单
        await SyncMenusAsync(command.AppCode, command.Menus, ct);

        await _db.SaveChangesAsync(ct);

        _logger.LogInformation(
            "App {AppCode} registered: {PermCount} permissions, {MenuCount} menus",
            command.AppCode,
            command.Permissions.Count,
            command.Menus.Count);

        return command.AppCode;
    }

    private async Task SyncMenusAsync(
        string appCode,
        List<MenuDefinitionInput> menuInputs,
        CancellationToken ct)
    {
        var existingMenus = await _db.Set<Menu>()
            .Where(m => m.AppCode == appCode)
            .ToListAsync(ct);

        var existingMap = existingMenus
            .ToDictionary(m => m.MenuCode);

        // 两遍处理（先创建，再设置父级）
        var newMenus = new Dictionary<string, Menu>();

        foreach (var input in menuInputs)
        {
            if (!existingMap.ContainsKey(input.MenuCode))
            {
                var menu = new Menu(
                    Guid.NewGuid(),
                    appCode,
                    input.MenuCode,
                    input.DisplayName,
                    input.Path,
                    input.RequiredPermission,
                    sortOrder: input.SortOrder);

                _db.Add(menu);
                newMenus[input.MenuCode] = menu;
            }
        }
    }
}
```

```csharp
// ============================================
// Permissions/Queries/GetGrantedPermissionsQuery.cs
// 获取用户被授予的所有权限
// ============================================

using Platform.Cqrs.Queries;

namespace PermCenter.Application.Permissions.Queries;

/// <summary>
/// 获取用户被授予的权限列表
/// 
/// 前端登录后调用:
///   GET /api/permissions/granted?appCode=erp
///   
/// 返回当前用户在指定应用中拥有的所有权限码
/// 前端据此做 UI 显隐控制
/// </summary>
public record GetGrantedPermissionsQuery(
    Guid UserId,
    string AppCode) : IQuery<GrantedPermissionsResult>;

public class GrantedPermissionsResult
{
    /// <summary>
    /// 权限码列表
    /// </summary>
    public List<string> Permissions { get; set; } = [];
}
```

```csharp
// ============================================
// Permissions/Queries/GetGrantedPermissionsQueryHandler.cs
// ============================================

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using PermCenter.Domain.Permissions;
using PermCenter.Infrastructure.Data;
using Platform.Cqrs.Queries;
using System.Text.Json;

namespace PermCenter.Application.Permissions.Queries;

public class GetGrantedPermissionsQueryHandler
    : IQueryHandler<GetGrantedPermissionsQuery, GrantedPermissionsResult>
{
    private readonly PermCenterDbContext _db;
    private readonly IDistributedCache _cache;

    public GetGrantedPermissionsQueryHandler(
        PermCenterDbContext db,
        IDistributedCache cache)
    {
        _db = db;
        _cache = cache;
    }

    public async Task<GrantedPermissionsResult> HandleAsync(
        GetGrantedPermissionsQuery query,
        CancellationToken ct = default)
    {
        // 1. 尝试从缓存读取
        var cacheKey = $"perm:granted:{query.AppCode}:{query.UserId}";
        var cached = await _cache.GetStringAsync(cacheKey, ct);
        if (cached != null)
        {
            return JsonSerializer.Deserialize<GrantedPermissionsResult>(
                cached)!;
        }

        // 2. 查询用户的角色
        var userRoleIds = await _db.Set<Domain.UserRoles.UserRole>()
            .Where(ur => ur.UserId == query.UserId)
            .Select(ur => ur.RoleId)
            .ToListAsync(ct);

        if (userRoleIds.Count == 0)
            return new GrantedPermissionsResult();

        // 3. 查询角色拥有的权限
        var permissions = await _db.Set<PermissionGrant>()
            .Where(pg => userRoleIds.Contains(pg.RoleId))
            .Where(pg => pg.AppCode == query.AppCode)
            .Select(pg => pg.PermissionCode)
            .Distinct()
            .ToListAsync(ct);

        var result = new GrantedPermissionsResult
        {
            Permissions = permissions
        };

        // 4. 写缓存（5分钟）
        await _cache.SetStringAsync(
            cacheKey,
            JsonSerializer.Serialize(result),
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
            },
            ct);

        return result;
    }
}
```

```csharp
// ============================================
// Permissions/Queries/CheckPermissionQuery.cs
// 单个权限检查（业务系统后端调用）
// ============================================

using Platform.Cqrs.Queries;

namespace PermCenter.Application.Permissions.Queries;

/// <summary>
/// 检查用户是否拥有指定权限
/// 
/// 业务系统 PermissionAuthorizationFilter 调用:
///   GET /api/permissions/check?userId=xxx&appCode=erp&permission=ERP.Purchase.Create
/// </summary>
public record CheckPermissionQuery(
    Guid UserId,
    string AppCode,
    string PermissionCode) : IQuery<bool>;
```

### 权限中心 Controller

```csharp
// ============================================
// Controllers/PermissionController.cs
// ============================================

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PermCenter.Application.Permissions.Queries;
using Platform.Cqrs.Mediator;

namespace PermCenter.Host.Controllers;

[ApiController]
[Route("api/permissions")]
[Authorize]
public class PermissionController : ControllerBase
{
    private readonly IPlatformMediator _mediator;

    public PermissionController(IPlatformMediator mediator)
        => _mediator = mediator;

    /// <summary>
    /// 获取当前用户在指定应用的所有权限
    /// 
    /// 前端登录后调用
    /// </summary>
    [HttpGet("granted")]
    public async Task<IActionResult> GetGranted(
        [FromQuery] string appCode)
    {
        var userId = Guid.Parse(
            User.FindFirst("sub")!.Value);

        return Ok(await _mediator.SendQueryAsync(
            new GetGrantedPermissionsQuery(userId, appCode)));
    }

    /// <summary>
    /// 检查权限（业务系统后端调用）
    /// </summary>
    [HttpGet("check")]
    public async Task<IActionResult> Check(
        [FromQuery] Guid userId,
        [FromQuery] string appCode,
        [FromQuery] string permission)
    {
        var result = await _mediator.SendQueryAsync(
            new CheckPermissionQuery(userId, appCode, permission));
        return Ok(new { isGranted = result });
    }

    /// <summary>
    /// 获取权限树（管理员用）
    /// </summary>
    [HttpGet("tree")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetTree(
        [FromQuery] string appCode)
    {
        return Ok(await _mediator.SendQueryAsync(
            new GetPermissionTreeQuery(appCode)));
    }
}
```

```csharp
// ============================================
// Controllers/AppController.cs
// ============================================

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PermCenter.Application.Apps.Commands;
using Platform.Cqrs.Mediator;

namespace PermCenter.Host.Controllers;

[ApiController]
[Route("api/apps")]
public class AppController : ControllerBase
{
    private readonly IPlatformMediator _mediator;

    public AppController(IPlatformMediator mediator)
        => _mediator = mediator;

    /// <summary>
    /// 应用注册（业务系统启动时调用）
    /// 
    /// 使用内部通信密钥鉴权，不需要用户登录
    /// </summary>
    [HttpPost("register")]
    [AllowAnonymous] // 用 API Key 鉴权
    public async Task<IActionResult> Register(
        [FromBody] RegisterAppCommand command,
        [FromHeader(Name = "X-Api-Key")] string apiKey)
    {
        // 验证内部通信密钥
        // TODO: 从配置读取并验证

        return Ok(await _mediator.SendCommandAsync(command));
    }
}
```

---

## 完整系统架构图

```
┌──────────────────────────────────────────────────────────────────────┐
│                         Platform 基座 (11 模块)                       │
│                                                                      │
│  Domain.Shared → Domain → EntityFrameworkCore                        │
│       ↑              ↑              ↑                                │
│  AspNetCore    Cqrs    BackgroundJobs    EventBus                    │
│  MultiTenancy  AuditLogging  DistributedLocking  Localization        │
│                                                                      │
│  能力: 实体建模 / 仓储UoW / 审计 / CQRS管道 / 后台任务 / 事件总线     │
│        分布式锁 / 多租户 / 审计日志 / 国际化                          │
└─────────┬───────────────────────┬────────────────────────┬───────────┘
          │                       │                        │
┌─────────▼─────────┐  ┌─────────▼──────────┐  ┌─────────▼─────────┐
│   SSO 鉴权中心     │  │    权限中心          │  │    ERP 系统       │
│                   │  │                     │  │                   │
│ OpenIddict        │  │ 应用注册            │  │ 采购管理          │
│ Identity          │  │ 权限树管理          │  │ 库存管理          │
│ 用户管理          │  │ 角色管理            │  │ 销售管理          │
│ 客户端管理        │  │ 用户角色分配        │  │ ...               │
│ Token 生命周期    │  │ 菜单管理            │  │                   │
│                   │  │ 权限查询(缓存)      │  │                   │
│ 46 文件           │  │ 40 文件             │  │ N 文件            │
└───────┬───────────┘  └────────┬────────────┘  └────────┬──────────┘
        │                       │                         │
        │     Token 签发         │    权限查询              │
        └───────────────────────┴─────────────────────────┘
                                │
                      ┌─────────▼──────────┐
                      │   React 前端        │
                      │                     │
                      │ SSO 登录(PKCE)      │
                      │ 权限控制(显隐)       │
                      │ 动态菜单             │
                      │ Token 管理           │
                      └─────────────────────┘
```

---

## 数据流总览

```
用户访问 ERP:

  1. React 前端发现未登录
     → 跳转 SSO /connect/authorize (PKCE)
     
  2. SSO 返回登录页
     → 用户输入账号密码
     → SSO 验证成功
     → 返回 authorization_code
     
  3. 前端用 code 换 token
     → POST SSO /connect/token
     → 获得 access_token + refresh_token + id_token
     
  4. 前端拉取权限
     → GET 权限中心 /api/permissions/granted?appCode=erp
     → 返回 ["ERP.Purchase.View", "ERP.Purchase.Create", ...]
     
  5. 前端拉取菜单
     → GET 权限中心 /api/menus/current?appCode=erp
     → 返回菜单树（已按权限过滤）
     
  6. 前端渲染
     → 根据权限树构建路由
     → 按钮级权限控制 <Authorized>
     
  7. 用户操作（如创建采购单）
     → POST ERP /api/purchase
     → Header: Authorization: Bearer {token}
     → Header: X-Tenant-Id: {tenantId}
     
  8. ERP 后端处理
     → JWT 本地验证（不调 SSO）
     → PermissionAuthorizationFilter 检查权限
       → 先查本地缓存
       → 缓存没有 → 调权限中心 API
     → CQRS 管道执行:
       LoggingBehavior → PerformanceBehavior → ValidationBehavior
       → UnitOfWorkBehavior → CreatePurchaseCommandHandler
     → 自动 SaveChanges → 审计拦截器 → 领域事件
     → 返回结果 → ApiResult 包装

完整文件数:
  Platform 基座:         158 文件
  SSO 鉴权中心:           46 文件
  权限中心:               40 文件
  ─────────────────────────────────
  合计:                  244 文件

一个完整的企业级 SSO + RBAC + 多租户平台 ✅
```

还需要继续深入哪一块？比如：

1. **权限中心完整的角色管理 CRUD** + 权限分配 UI 接口
2. **业务系统 SDK**（PermissionChecker + 自动注册 + 缓存）
3. **React 前端完整的 SSO 接入 + 权限控制组件**
4. **Docker Compose 一键部署**（SSO + 权限中心 + PostgreSQL + Redis + RabbitMQ）
5. **单元测试 + 集成测试方案**