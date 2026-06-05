---
title: HTTP 基本认证与 JWT 验证
icon: fa6-solid:key
order: 3
category:
  - Linux
  - Nginx
tag:
  - 认证
  - JWT
  - auth_basic
  - auth_request
  - OAuth2
---

# HTTP 基本认证与 JWT 验证

## 认证与授权概述

在 Web 应用中，认证（Authentication）验证用户身份，授权（Authorization）决定用户可以访问哪些资源。Nginx 可以在网关层实现多种认证机制，将认证逻辑前置，减少后端压力。

```
认证方式对比：
┌──────────────┬────────────┬────────────┬──────────────┐
│ 认证方式      │ 复杂度     │ 安全性     │ 适用场景      │
├──────────────┼────────────┼────────────┼──────────────┤
│ HTTP Basic   │ 低         │ 低         │ 简单保护      │
│ auth_request │ 中         │ 高         │ 统一认证网关  │
│ JWT          │ 中         │ 中高       │ API 认证      │
│ OAuth2 代理   │ 高         │ 高         │ SSO/第三方登录│
└──────────────┴────────────┴────────────┴──────────────┘
```

---

## HTTP Basic 认证

### HTTP Basic 认证原理

HTTP Basic 认证是最简单的认证方式，客户端在请求头中发送 Base64 编码的用户名和密码：

```mermaid
sequenceDiagram
    participant C as 客户端
    participant N as Nginx
    participant B as 后端服务

    C->>N: GET /protected/ (无认证头)
    N->>C: 401 Unauthorized<br/>WWW-Authenticate: Basic realm="Restricted"

    Note over C: 弹出用户名/密码输入框

    C->>N: GET /protected/<br/>Authorization: Basic dXNlcjpwYXNz
    Note right of C: Base64(user:pass)<br/>dXNlcjpwYXNz = user:pass

    N->>N: 验证用户名密码<br/>与 htpasswd 文件比对

    alt 验证成功
        N->>B: 转发请求
        B->>N: 响应
        N->>C: 200 OK + 内容
    else 验证失败
        N->>C: 401 Unauthorized
    end
```

### 创建 htpasswd 文件

```bash
# 使用 htpasswd 命令创建密码文件

# 安装 apache2-utils（提供 htpasswd 命令）
# Ubuntu/Debian
sudo apt install apache2-utils

# CentOS/RHEL
sudo yum install httpd-tools

# 创建新文件并添加用户（-c 创建新文件）
sudo htpasswd -c /etc/nginx/.htpasswd admin
# 输入密码：******

# 添加更多用户（不加 -c，否则会覆盖文件）
sudo htpasswd /etc/nginx/.htpasswd user1
sudo htpasswd /etc/nginx/.htpasswd user2

# 使用 MD5 加密（默认）
sudo htpasswd -m /etc/nginx/.htpasswd user3

# 使用 bcrypt 加密（推荐，更安全）
sudo htpasswd -B /etc/nginx/.htpasswd user4

# 使用 SHA 加密
sudo htpasswd -s /etc/nginx/.htpasswd user5

# 查看密码文件
cat /etc/nginx/.htpasswd
# admin:$apr1$xxxxx$xxxxx
# user1:$apr1$xxxxx$xxxxx
# user4:$2y$05$xxxxx（bcrypt）
```

::: tip 密码加密方式选择
- **bcrypt**（推荐）：计算成本可调，抗暴力破解
- **apr1**（MD5-based）：Nginx 默认，兼容性好
- **SHA**：不推荐，安全性较低
- **crypt**：不推荐，仅支持 8 位密码
:::

### auth_basic 配置

```nginx
# 参考：https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html

# 语法
# auth_basic string | off;
# auth_basic_user_file file;

# 全局认证
server {
    listen 80;
    server_name example.com;

    # 启用认证
    auth_basic "Restricted Area";

    # 指定密码文件
    auth_basic_user_file /etc/nginx/.htpasswd;

    location / {
        root /var/www/html;
    }
}
```

### 按路径差异化认证

```nginx
server {
    listen 80;
    server_name example.com;

    # 全局认证
    auth_basic "Restricted Area";
    auth_basic_user_file /etc/nginx/.htpasswd;

    # 公开路径（关闭认证）
    location /public/ {
        auth_basic off;
        root /var/www/html;
    }

    # 管理后台（使用不同的密码文件）
    location /admin/ {
        auth_basic "Admin Area";
        auth_basic_user_file /etc/nginx/.htpasswd_admin;
        proxy_pass http://admin_backend;
    }

    # API（关闭 Basic 认证，使用 JWT）
    location /api/ {
        auth_basic off;
        proxy_pass http://api_backend;
    }

    location / {
        root /var/www/html;
    }
}
```

### 认证变量与日志

```nginx
# 认证成功后，$remote_user 变量包含用户名

log_format auth_log '$remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent';

server {
    listen 80;
    auth_basic "Restricted";
    auth_basic_user_file /etc/nginx/.htpasswd;

    access_log /var/log/nginx/auth_access.log auth_log;

    location / {
        root /var/www/html;
    }
}
```

::: warning HTTP Basic 的安全局限
- 密码以 Base64 编码传输（非加密），必须配合 HTTPS 使用
- 无法实现会话管理（每次请求都发送密码）
- 无法实现注销（浏览器缓存凭据）
- 不适合复杂的认证需求
- Base64 可以被轻易解码，仅相当于明文传输
:::

---

## auth_request 子请求认证

### auth_request 原理

`auth_request` 模块通过发送子请求到认证服务来实现认证，将认证逻辑与业务逻辑完全解耦：

```mermaid
sequenceDiagram
    participant C as 客户端
    participant N as Nginx
    participant A as 认证服务
    participant B as 后端服务

    C->>N: GET /api/data<br/>Authorization: Bearer token

    N->>A: GET /auth/verify<br/>（子请求，携带原始请求头）
    Note right of N: auth_request /auth/verify

    alt 认证成功 (2xx)
        A->>N: 200 OK<br/>X-User-Id: user123
        N->>B: GET /api/data<br/>X-User-Id: user123
        B->>N: 200 OK + 数据
        N->>C: 200 OK + 数据
    else 认证失败 (401/403)
        A->>N: 401 Unauthorized
        N->>C: 401 Unauthorized
    end
```

### auth_request 配置

```nginx
# 参考：https://nginx.org/en/docs/http/ngx_http_auth_request_module.html

server {
    listen 80;
    server_name api.example.com;

    # 认证子请求
    auth_request /auth/verify;

    # 将认证服务返回的头传递给后端
    auth_request_set $user_id $upstream_http_x_user_id;
    auth_request_set $user_role $upstream_http_x_user_role;

    # 认证服务地址
    location = /auth/verify {
        internal;  # 仅接受内部子请求
        proxy_pass http://auth-service:8080/verify;
        proxy_pass_request_body off;  # 不转发请求体
        proxy_set_header Content-Length "";
        proxy_set_header X-Original-URI $request_uri;
        proxy_set_header X-Original-Method $request_method;
        proxy_set_header Authorization $http_authorization;
    }

    # 业务接口
    location /api/ {
        proxy_pass http://api_backend;
        proxy_set_header X-User-Id $user_id;
        proxy_set_header X-User-Role $user_role;
    }
}
```

### auth_request_set 详解

```nginx
# auth_request_set 将子请求响应头映射到变量
# 语法：auth_request_set $variable value;

server {
    auth_request /auth/verify;

    # 从认证服务响应头提取用户信息
    auth_request_set $user_id $upstream_http_x_user_id;
    auth_request_set $user_role $upstream_http_x_user_role;
    auth_request_set $user_email $upstream_http_x_user_email;

    location = /auth/verify {
        internal;
        proxy_pass http://auth-service:8080/verify;
        proxy_pass_request_body off;
        proxy_set_header Content-Length "";
    }

    location /api/ {
        proxy_pass http://api_backend;
        # 将用户信息传递给后端
        proxy_set_header X-User-Id $user_id;
        proxy_set_header X-User-Role $user_role;
        proxy_set_header X-User-Email $user_email;
    }
}
```

### 认证服务实现示例

```python
# Flask 认证服务示例
from flask import Flask, request, jsonify
import jwt

app = Flask(__name__)
SECRET_KEY = "your-secret-key"

@app.route('/verify', methods=['GET'])
def verify():
    auth_header = request.headers.get('Authorization', '')

    if not auth_header.startswith('Bearer '):
        return '', 401

    token = auth_header[7:]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        # 认证成功，返回用户信息头
        response = jsonify({})
        response.headers['X-User-Id'] = payload.get('user_id', '')
        response.headers['X-User-Role'] = payload.get('role', '')
        response.headers['X-User-Email'] = payload.get('email', '')
        return response, 200
    except jwt.ExpiredSignatureError:
        return '', 401
    except jwt.InvalidTokenError:
        return '', 401

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
```

### 认证错误页面

```nginx
server {
    listen 80;

    auth_request /auth/verify;

    # 自定义 401 错误页面
    error_page 401 = @login;
    error_page 403 = @forbidden;

    location = /auth/verify {
        internal;
        proxy_pass http://auth-service:8080/verify;
        proxy_pass_request_body off;
        proxy_set_header Content-Length "";
    }

    location @login {
        return 302 https://auth.example.com/login?redirect=$scheme://$host$request_uri;
    }

    location @forbidden {
        default_type application/json;
        return 403 '{"error": "Forbidden", "message": "You do not have permission to access this resource."}';
    }

    location / {
        proxy_pass http://backend;
    }
}
```

---

## JWT 验证

### JWT 原理

JWT（JSON Web Token）是一种开放标准（RFC 7519），用于在各方之间安全地传输信息：

```
JWT 结构：header.payload.signature

Header:  {"alg": "HS256", "typ": "JWT"}
Payload: {"sub": "user123", "name": "John", "role": "admin", "exp": 1700000000}
Signature: HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)

示例 Token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwibmFtZSI6IkpvaG4iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MDAwMDAwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Nginx Lua JWT 验证

```nginx
# 参考：https://nginx.org/en/docs/http/ngx_http_lua_module.html
# 需要安装 lua-resty-jwt 库

server {
    listen 80;
    server_name api.example.com;

    location /api/ {
        access_by_lua_block {
            local jwt = require "resty.jwt"
            local cjson = require "cjson"

            -- 获取 Authorization 头
            local auth_header = ngx.var.http_authorization
            if not auth_header then
                ngx.status = 401
                ngx.header["WWW-Authenticate"] = 'Bearer realm="API"'
                ngx.say('{"error": "Missing authorization header"}')
                ngx.exit(401)
            end

            -- 提取 Token
            local _, _, token = string.find(auth_header, "Bearer%s+(.+)")
            if not token then
                ngx.status = 401
                ngx.say('{"error": "Invalid authorization header format"}')
                ngx.exit(401)
            end

            -- 验证 JWT
            local jwt_obj = jwt:verify("your-secret-key", token)

            if not jwt_obj.verified then
                ngx.status = 401
                ngx.say('{"error": "Invalid token: ' .. (jwt_obj.reason or "unknown") .. '"}')
                ngx.exit(401)
            end

            -- 检查过期时间
            local exp = jwt_obj.payload and jwt_obj.payload.exp
            if exp and exp < ngx.time() then
                ngx.status = 401
                ngx.say('{"error": "Token expired"}')
                ngx.exit(401)
            end

            -- 将用户信息传递给后端
            ngx.req.set_header("X-User-Id", jwt_obj.payload.sub or "")
            ngx.req.set_header("X-User-Role", jwt_obj.payload.role or "")
        }

        proxy_pass http://api_backend;
    }
}
```

### JWT 验证（nginx-jwt-module）

```nginx
# 使用第三方 nginx-jwt-module
# https://github.com/TeslaGov/nginx-jwt-module
#
# 注意：以下配置为概念示意。nginx-jwt-module 实际主指令为 auth_jwt，
# 支持 on/off 控制启用与关闭，以及 auth_jwt_key / auth_jwt_key_file
# 设置 HMAC 密钥或 RSA 公钥。其他指令如 auth_jwt_claim 为示意用法，
# 实际 claim 传递需通过 $jwt_claim_* 变量在 proxy_set_header 中完成。

server {
    listen 80;
    server_name api.example.com;

    # JWT 验证配置
    auth_jwt_key "your-secret-key";    # HMAC 密钥
    # auth_jwt_key_file /etc/nginx/jwt-key.pem;  # RSA 公钥文件

    location /api/ {
        auth_jwt on;

        # 将 JWT claim 传递给后端
        proxy_pass http://api_backend;
        proxy_set_header X-User-Id $jwt_claim_sub;
        proxy_set_header X-User-Role $jwt_claim_role;
    }

    # 登录接口不需要 JWT
    location /api/auth/login {
        auth_jwt off;
        proxy_pass http://auth_backend;
    }
}
```

### RSA 公钥验证 JWT

```nginx
# 使用 RSA 非对称签名时，Nginx 只需要公钥验证

server {
    listen 80;

    location /api/ {
        access_by_lua_block {
            local jwt = require "resty.jwt"

            local auth_header = ngx.var.http_authorization
            if not auth_header then
                ngx.exit(401)
            end

            local _, _, token = string.find(auth_header, "Bearer%s+(.+)")

            -- 使用 RSA 公钥验证
            local public_key = io.open("/etc/nginx/keys/public.pem"):read("*a")

            local jwt_obj = jwt:verify(public_key, token, {
                claim_specs = {
                    exp = jwt.claims.exp.required
                }
            })

            if not jwt_obj.verified then
                ngx.status = 401
                ngx.say('{"error": "Invalid token"}')
                ngx.exit(401)
            end

            ngx.req.set_header("X-User-Id", jwt_obj.payload.sub)
        }

        proxy_pass http://api_backend;
    }
}
```

---

## 基于 Cookie 的路由

### Cookie 路由原理

通过检查 Cookie 值来决定请求路由，常用于 A/B 测试、灰度发布、已登录/未登录用户分流：

```nginx
# 使用 map 基于 Cookie 值选择后端
map $cookie_version $backend_name {
    default  main_backend;
    "v2"     v2_backend;
    "beta"   beta_backend;
}

upstream main_backend {
    server 10.0.0.1:8080;
}

upstream v2_backend {
    server 10.0.0.2:8080;
}

upstream beta_backend {
    server 10.0.0.3:8080;
}

server {
    listen 80;

    location / {
        proxy_pass http://$backend_name;
    }
}
```

### 基于 Cookie 的认证路由

```nginx
# 已登录/未登录用户路由到不同服务
map $cookie_session $auth_status {
    default  "unauthenticated";
    ""       "unauthenticated";
    "~.+"    "authenticated";   # 非空 Cookie = 已登录
}

server {
    listen 80;

    # 认证用户
    location /api/ {
        if ($auth_status = "unauthenticated") {
            return 401;
        }

        proxy_pass http://api_backend;
        proxy_set_header X-Auth-Status $auth_status;
    }

    # 登录页面
    location /login {
        if ($auth_status = "authenticated") {
            return 302 /dashboard;
        }

        proxy_pass http://auth_backend;
    }
}
```

### 设置认证 Cookie

```nginx
# 登录成功后设置 Cookie
location /auth/login {
    proxy_pass http://auth_backend;

    # 认证成功后设置 Cookie
    add_header Set-Cookie "session=$cookie_value; Path=/; HttpOnly; Secure; SameSite=Strict" always;
}
```

---

## OAuth2 代理：oauth2-proxy 集成

### oauth2-proxy 简介

oauth2-proxy 是一个反向代理，为没有原生 OAuth2 支持的应用提供认证：

```mermaid
sequenceDiagram
    participant U as 用户浏览器
    participant N as Nginx
    participant O as oauth2-proxy
    participant P as OAuth2 Provider<br/>(GitHub/Google)
    participant B as 后端服务

    U->>N: GET /app/
    N->>O: 反向代理到 oauth2-proxy
    O->>U: 302 → OAuth2 Provider 登录

    U->>P: 登录并授权
    P->>O: 回调 + 授权码
    O->>P: 交换 Token
    P->>O: Access Token + 用户信息
    O->>U: 设置 Cookie + 302 → /app/

    U->>N: GET /app/ (带 Cookie)
    N->>O: 验证 Cookie
    O->>B: 转发请求 + 用户信息头
    B->>O: 响应
    O->>N: 响应
    N->>U: 200 OK + 内容
```

### oauth2-proxy 安装

```bash
# 下载 oauth2-proxy
# https://github.com/oauth2-proxy/oauth2-proxy/releases

wget https://github.com/oauth2-proxy/oauth2-proxy/releases/download/v7.5.1/oauth2-proxy-v7.5.1.linux-amd64.tar.gz
tar xzf oauth2-proxy-v7.5.1.linux-amd64.tar.gz
sudo mv oauth2-proxy /usr/local/bin/

# 或使用 Docker
docker pull quay.io/oauth2-proxy/oauth2-proxy:v7.5.1
```

### oauth2-proxy 配置

```bash
# /etc/oauth2-proxy/config

# Provider 配置（以 GitHub 为例）
--provider=github
--client-id=your-github-client-id
--client-secret=your-github-client-secret

# 回调 URL
--redirect-url=https://example.com/oauth2/callback

# Cookie 配置
--cookie-domain=example.com
--cookie-secret=$(openssl rand -base64 32 | head -c 32)
--cookie-secure=true
--cookie-httponly=true
--cookie-samesite=lax

# 监听地址
--http-address=127.0.0.1:4180

# 邮箱域限制
--email-domain=example.com

# 跳过认证的路径
--skip-provider-button=true

# 后端签名
--set-xauthrequest=true
--set-authorization-header=true
```

### Nginx + oauth2-proxy 配置

```nginx
# oauth2-proxy 认证网关

server {
    listen 443 ssl;
    server_name app.example.com;

    ssl_certificate     /etc/nginx/ssl/app.example.com.pem;
    ssl_certificate_key /etc/nginx/ssl/app.example.com.key;

    # 应用路径 - 通过 oauth2-proxy 认证
    location / {
        proxy_pass http://127.0.0.1:4180;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # OAuth2 回调路径
    location /oauth2/ {
        proxy_pass http://127.0.0.1:4180;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### auth_request + oauth2-proxy

```nginx
# 使用 auth_request 模式集成 oauth2-proxy
# 后端服务直接暴露，认证由 Nginx 子请求完成

server {
    listen 443 ssl;
    server_name app.example.com;

    # 认证子请求
    auth_request /oauth2/auth;

    # 将认证信息传递给后端
    auth_request_set $user $upstream_http_x_auth_request_user;
    auth_request_set $email $upstream_http_x_auth_request_email;
    auth_request_set $groups $upstream_http_x_auth_request_groups;

    # 认证失败重定向到登录
    error_page 401 = /oauth2/sign_in;

    # oauth2-proxy 认证端点
    location = /oauth2/auth {
        internal;
        proxy_pass http://127.0.0.1:4180/oauth2/auth;
        proxy_pass_request_body off;
        proxy_set_header Content-Length "";
        proxy_set_header X-Original-URL $scheme://$http_host$request_uri;
    }

    # oauth2-proxy 登录/回调
    location /oauth2/ {
        proxy_pass http://127.0.0.1:4180;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 后端服务
    location / {
        proxy_pass http://app_backend;
        proxy_set_header X-User $user;
        proxy_set_header X-Email $email;
        proxy_set_header X-Groups $groups;
    }
}
```

---

## 认证缓存与性能

### 认证性能问题

每次请求都进行认证会带来性能开销：

- HTTP Basic：每次请求读取 htpasswd 文件
- auth_request：每次请求发送子请求
- JWT：每次请求验证签名

### auth_basic 缓存

```nginx
# 参考：https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html

# auth_basic 本身不提供缓存
# 但 htpasswd 文件在启动时加载到内存
# 文件修改后需要 reload 才生效

# 对于大量用户的场景，考虑使用 auth_request 替代
```

### auth_request 缓存

```nginx
# 使用 proxy_cache 缓存认证结果

# 定义认证缓存
proxy_cache_path /var/cache/nginx/auth levels=1:2
                 keys_zone=auth_cache:10m max_size=100m
                 inactive=5m use_temp_path=off;

server {
    listen 80;

    auth_request /auth/verify;

    # 缓存认证结果
    location = /auth/verify {
        internal;

        # 基于认证头生成缓存 key
        proxy_cache auth_cache;
        proxy_cache_key "$http_authorization";
        proxy_cache_valid 200 5m;    # 认证成功缓存 5 分钟
        proxy_cache_valid 401 1m;    # 认证失败缓存 1 分钟

        proxy_pass http://auth-service:8080/verify;
        proxy_pass_request_body off;
        proxy_set_header Content-Length "";
        proxy_set_header Authorization $http_authorization;
    }

    location /api/ {
        proxy_pass http://api_backend;
    }
}
```

::: warning 认证缓存的风险
- 用户权限变更后，缓存可能导致旧权限仍然生效
- Token 撤销后，缓存可能导致已撤销的 Token 仍被接受
- 建议缓存时间不超过 5 分钟
- 高安全场景不建议缓存
:::

### JWT 性能优化

```nginx
# JWT 验证本身很快（纯计算，无网络请求）
# 优化点：

# 1. 使用 HMAC (HS256) 而非 RSA (RS256) 提高验证速度
# HMAC: 微秒级
# RSA: 毫秒级

# 2. 在 Lua 中缓存 JWT 验证结果
lua_shared_dict jwt_cache 1m;

server {
    location /api/ {
        access_by_lua_block {
            local cache = ngx.shared.jwt_cache
            local auth_header = ngx.var.http_authorization

            if not auth_header then
                ngx.exit(401)
            end

            local _, _, token = string.find(auth_header, "Bearer%s+(.+)")

            -- 检查缓存
            local cached = cache:get(token)
            if cached then
                ngx.req.set_header("X-User-Id", cached)
                return
            end

            -- JWT 验证
            local jwt = require "resty.jwt"
            local jwt_obj = jwt:verify("secret", token)

            if jwt_obj.verified then
                local user_id = jwt_obj.payload.sub
                -- 缓存 60 秒
                cache:set(token, user_id, 60)
                ngx.req.set_header("X-User-Id", user_id)
            else
                ngx.exit(401)
            end
        end

        proxy_pass http://api_backend;
    }
}
```

---

## 多因素认证方案

### 双因素认证架构

```
认证层次：
第一层：用户名 + 密码（知识因素）
第二层：OTP/短信/TOTP（持有因素）
第三层：证书/生物特征（固有因素）
```

### Nginx 实现多因素认证

```nginx
# 结合 HTTP Basic + auth_request 实现双因素认证

server {
    listen 443 ssl;
    server_name secure.example.com;

    # 第一层：HTTP Basic 认证
    auth_basic "First Factor";
    auth_basic_user_file /etc/nginx/.htpasswd;

    # 第二层：auth_request 验证 OTP
    auth_request /auth/otp-verify;

    auth_request_set $otp_status $upstream_http_x_otp_status;

    location = /auth/otp-verify {
        internal;
        proxy_pass http://auth-service:8080/otp/verify;
        proxy_pass_request_body off;
        proxy_set_header Content-Length "";
        proxy_set_header X-User $remote_user;
        proxy_set_header X-OTP $http_x_otp;
    }

    location / {
        proxy_pass http://secure_backend;
        proxy_set_header X-User $remote_user;
        proxy_set_header X-OTP-Status $otp_status;
    }
}
```

### 客户端证书认证

```nginx
# 参考：https://nginx.org/en/docs/http/ngx_http_ssl_module.html

server {
    listen 443 ssl;
    server_name secure.example.com;

    ssl_certificate     /etc/nginx/ssl/server.pem;
    ssl_certificate_key /etc/nginx/ssl/server.key;

    # 客户端证书认证
    ssl_client_certificate /etc/nginx/ssl/ca.pem;  # CA 证书
    ssl_verify_client on;                           # 要求客户端证书
    ssl_verify_depth 2;                             # 证书链深度

    # 客户端证书信息变量
    # $ssl_client_fingerprint  证书指纹
    # $ssl_client_s_dn         证书主题 DN
    # $ssl_client_i_dn         证书签发者 DN
    # $ssl_client_v_end        证书过期时间
    # $ssl_client_v_start      证书生效时间
    # $ssl_client_serial       证书序列号

    location / {
        # 将客户端证书信息传递给后端
        proxy_pass http://backend;
        proxy_set_header X-Client-DN $ssl_client_s_dn;
        proxy_set_header X-Client-Verify $ssl_client_verify;
        proxy_set_header X-Client-Fingerprint $ssl_client_fingerprint;
    }
}
```

### 可选客户端证书

```nginx
# 允许有证书和无证书的客户端同时访问
server {
    listen 443 ssl;

    ssl_certificate     /etc/nginx/ssl/server.pem;
    ssl_certificate_key /etc/nginx/ssl/server.key;
    ssl_client_certificate /etc/nginx/ssl/ca.pem;

    # optional：请求证书但非必需
    ssl_verify_client optional;

    # 使用 map 基于证书验证结果选择后端
    # 避免在 if 中使用 proxy_pass 的反模式
    map $ssl_client_verify $cert_backend {
        default      basic_backend;
        SUCCESS      premium_backend;
    }

    location / {
        proxy_pass http://$cert_backend;
    }
}
```

---

## 完整认证网关配置

```nginx
# 参考：
# https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html
# https://nginx.org/en/docs/http/ngx_http_auth_request_module.html

# 统一认证网关配置

# JWT 黑名单共享内存
lua_shared_dict jwt_blacklist 1m;
lua_shared_dict jwt_cache 5m;

server {
    listen 443 ssl;
    http2 on;
    server_name api.example.com;

    ssl_certificate     /etc/nginx/ssl/api.example.com-fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/api.example.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    # ===== 公开接口（不需要认证）=====
    location = /api/auth/login {
        proxy_pass http://auth_backend;
    }

    location = /api/auth/register {
        proxy_pass http://auth_backend;
    }

    location = /health {
        return 200 "OK";
    }

    # ===== 受保护接口（JWT 认证）=====
    location /api/ {
        access_by_lua_block {
            local jwt = require "resty.jwt"
            local cache = ngx.shared.jwt_cache
            local blacklist = ngx.shared.jwt_blacklist

            local auth_header = ngx.var.http_authorization
            if not auth_header then
                ngx.status = 401
                ngx.header["WWW-Authenticate"] = 'Bearer realm="API"'
                ngx.say('{"error": "Missing authorization header"}')
                ngx.exit(401)
            end

            local _, _, token = string.find(auth_header, "Bearer%s+(.+)")
            if not token then
                ngx.status = 401
                ngx.say('{"error": "Invalid authorization format"}')
                ngx.exit(401)
            end

            -- 检查黑名单
            if blacklist:get(token) then
                ngx.status = 401
                ngx.say('{"error": "Token revoked"}')
                ngx.exit(401)
            end

            -- 检查缓存
            local cached_user = cache:get(token)
            if cached_user then
                ngx.req.set_header("X-User-Id", cached_user)
                return
            end

            -- 验证 JWT
            local jwt_obj = jwt:verify("your-secret-key", token)
            if not jwt_obj.verified then
                ngx.status = 401
                ngx.say('{"error": "Invalid token"}')
                ngx.exit(401)
            end

            -- 检查过期
            if jwt_obj.payload.exp and jwt_obj.payload.exp < ngx.time() then
                ngx.status = 401
                ngx.say('{"error": "Token expired"}')
                ngx.exit(401)
            end

            -- 缓存验证结果
            local user_id = jwt_obj.payload.sub or ""
            cache:set(token, user_id, 60)

            ngx.req.set_header("X-User-Id", user_id)
            ngx.req.set_header("X-User-Role", jwt_obj.payload.role or "")
        }

        proxy_pass http://api_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # ===== 管理接口（Basic 认证 + IP 白名单）=====
    location /admin/ {
        allow 192.168.0.0/16;
        allow 10.0.0.0/8;
        deny all;

        auth_basic "Admin Area";
        auth_basic_user_file /etc/nginx/.htpasswd_admin;

        proxy_pass http://admin_backend;
        proxy_set_header X-User $remote_user;
    }

    # ===== 内部工具（客户端证书认证）=====
    location /internal/ {
        ssl_verify_client on;
        proxy_pass http://internal_backend;
        proxy_set_header X-Client-DN $ssl_client_s_dn;
    }
}
```

---

## 延伸阅读

- [Nginx Auth Basic Module 官方文档](https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html)
- [Nginx Auth Request Module 官方文档](https://nginx.org/en/docs/http/ngx_http_auth_request_module.html)
- [Nginx SSL Module 官方文档](https://nginx.org/en/docs/http/ngx_http_ssl_module.html)
- [RFC 7519 - JSON Web Token](https://tools.ietf.org/html/rfc7519)
- [RFC 6750 - OAuth 2.0 Bearer Token](https://tools.ietf.org/html/rfc6750)
- [oauth2-proxy 官方文档](https://oauth2-proxy.github.io/oauth2-proxy/)
- [OpenResty Lua JWT](https://github.com/jkeys089/lua-resty-hmac)
