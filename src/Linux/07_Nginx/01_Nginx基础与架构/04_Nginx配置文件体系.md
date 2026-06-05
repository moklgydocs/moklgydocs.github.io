---
title: Nginx 配置文件体系
icon: fa6-solid:file-code
order: 4
category:
  - Linux
  - Nginx
tag:
  - Nginx
  - 配置文件
  - include
  - 目录组织
  - 多环境配置
---

# Nginx 配置文件体系

## 1. nginx.conf 全局结构

### 1.1 配置文件层次结构

Nginx 的配置文件采用树形嵌套结构，由多个上下文块（Context Block）组成，每个块包含特定功能域的指令。

```mermaid
graph TB
    MAIN["main（全局上下文）"] --> EVENTS["events {...}"]
    MAIN --> HTTP["http {...}"]
    MAIN --> STREAM["stream {...}"]
    MAIN --> MAIL["mail {...}"]

    HTTP --> UPSTREAM["upstream {...}"]
    HTTP --> SERVER["server {...}"]
    HTTP --> MAP["map {...}"]
    HTTP --> TYPES["types {...}"]
    HTTP --> SPLIT["split_clients {...}"]
    HTTP --> GEO["geo {...}"]
    HTTP --> LIMIT["limit_req_zone / limit_conn_zone"]

    SERVER --> LOCATION["location {...}"]
    SERVER --> IF["if {...}"]

    LOCATION --> UPSTREAM2["upstream（非标准）"]
    LOCATION --> IF2["if {...}"]

    STREAM --> UPSTREAM3["upstream {...}"]
    STREAM --> SERVER2["server {...}"]

    MAIL --> SERVER3["server {...}"]

    style MAIN fill:#FF5722,color:#fff
    style HTTP fill:#4CAF50,color:#fff
    style EVENTS fill:#2196F3,color:#fff
    style STREAM fill:#FF9800,color:#fff
    style MAIL fill:#9C27B0,color:#fff
```

### 1.2 完整配置文件结构

```nginx
# /etc/nginx/nginx.conf - 完整结构示例

# ===== main 上下文（全局配置） =====
user nginx;                          # Worker 进程运行用户
worker_processes auto;               # Worker 进程数
worker_rlimit_nofile 65535;         # 文件描述符限制
error_log /var/log/nginx/error.log warn;  # 错误日志
pid /var/run/nginx.pid;              # PID 文件

# ===== events 上下文 =====
events {
    worker_connections 4096;         # 每个 Worker 最大连接数
    multi_accept on;                  # 批量接受连接
    accept_mutex off;                 # 关闭互斥锁
    use epoll;                        # 事件模型
}

# ===== http 上下文 =====
http {
    # ---- 基础指令 ----
    include mime.types;               # MIME 类型
    default_type application/octet-stream;

    # ---- 日志格式 ----
    log_format main '$remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent"';

    access_log /var/log/nginx/access.log main;

    # ---- 性能优化 ----
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    client_max_body_size 20m;

    # ---- Gzip 压缩 ----
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json;

    # ---- 全局安全头 ----
    server_tokens off;
    add_header X-Content-Type-Options nosniff always;

    # ---- 限流区域定义 ----
    limit_req_zone $binary_remote_addr zone=global:10m rate=100r/s;

    # ---- map 定义 ----
    map $http_upgrade $connection_upgrade {
        default upgrade;
        '' close;
    }

    # ---- upstream 定义 ----
    upstream backend {
        server 10.0.0.1:8080;
        server 10.0.0.2:8080;
        keepalive 32;
    }

    # ---- 引入站点配置 ----
    include /etc/nginx/conf.d/*.conf;
    # include /etc/nginx/sites-enabled/*;

    # ---- server 定义 ----
    server {
        listen 80;
        server_name example.com;
        # ...
    }
}

# ===== stream 上下文（TCP/UDP 代理） =====
# stream {
#     upstream tcp_backend {
#         server 10.0.0.1:3306;
#         server 10.0.0.2:3306;
#     }
#
#     server {
#         listen 3306;
#         proxy_pass tcp_backend;
#     }
# }

# ===== mail 上下文（邮件代理） =====
# mail {
#     server {
#         listen 25;
#         protocol smtp;
#         proxy on;
#     }
# }
```

### 1.3 上下文嵌套规则

上下文之间存在严格的嵌套关系，违反嵌套规则的配置会导致语法错误：

| 上下文 | 允许的子上下文 | 说明 |
|--------|--------------|------|
| main | events, http, stream, mail | 顶层上下文 |
| events | 无 | 事件模型配置 |
| http | server, upstream, map, geo, split_clients, types, limit_req_zone, limit_conn_zone | HTTP 服务配置 |
| server | location, if | 虚拟主机配置 |
| location | if, upstream(有限) | 请求路由配置 |
| upstream | 无 | 后端服务器组 |
| stream | server, upstream | TCP/UDP 代理 |
| mail | server | 邮件代理 |

```nginx
# 错误示例：嵌套关系不正确

# 错误1：server 不能放在 main 上下文
# server { ... }  ← 必须放在 http 或 stream 中

# 错误2：location 不能放在 http 上下文
# http {
#     location / { ... }  ← 必须放在 server 中
# }

# 错误3：upstream 不能放在 server 上下文
# server {
#     upstream backend { ... }  ← 必须放在 http 中
# }
```

## 2. include 机制与目录组织

### 2.1 include 指令详解

`include` 指令将指定文件的内容插入到当前位置，支持通配符：

```nginx
# 引入单个文件
include /etc/nginx/mime.types;

# 引入目录下所有 .conf 文件（按字母序加载）
include /etc/nginx/conf.d/*.conf;

# 引入目录下所有文件
include /etc/nginx/sites-enabled/*;

# 使用相对路径（相对于 nginx.conf 所在目录）
include conf.d/*.conf;

# 使用通配符
include /etc/nginx/vhost.d/*.conf;
```

::: tip include 加载顺序
使用通配符 `*.conf` 时，文件按**字母顺序**加载。如果配置之间有依赖关系，建议使用数字前缀控制加载顺序：

```
00-default.conf
01-ssl.conf
02-proxy.conf
03-cache.conf
```
:::

### 2.2 两种主流目录组织方案

#### 方案一：Debian/Ubuntu 风格（sites-available/sites-enabled）

```
/etc/nginx/
├── nginx.conf                          # 主配置文件
├── sites-available/                    # 可用站点配置
│   ├── default                         # 默认站点
│   ├── example.com.conf               # 站点配置文件
│   ├── api.example.com.conf           # API 站点
│   └── blog.example.com.conf          # 博客站点
├── sites-enabled/                      # 已启用站点（符号链接）
│   ├── default -> ../sites-available/default
│   ├── example.com.conf -> ../sites-available/example.com.conf
│   └── api.example.com.conf -> ../sites-available/api.example.com.conf
├── snippets/                           # 配置片段
│   ├── ssl-params.conf                # SSL 参数片段
│   ├── proxy-params.conf              # 代理参数片段
│   └── security-headers.conf          # 安全头片段
├── conf.d/                             # 额外配置
│   └── gzip.conf                      # Gzip 配置
└── modules-enabled/                    # 动态模块
    └── *.conf
```

```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/example.com.conf \
           /etc/nginx/sites-enabled/example.com.conf

# 禁用站点
sudo rm /etc/nginx/sites-enabled/example.com.conf

# 站点状态管理
sudo nginx -t && sudo systemctl reload nginx
```

#### 方案二：RHEL/CentOS 风格（conf.d）

```
/etc/nginx/
├── nginx.conf                          # 主配置文件
├── conf.d/                             # 站点配置目录
│   ├── default.conf                    # 默认站点
│   ├── example.com.conf               # 站点配置
│   ├── api.example.com.conf           # API 站点
│   └── ssl.conf                       # SSL 全局配置
├── default.d/                          # 默认站点扩展
└── modules/                            # 动态模块
    └── *.so
```

```bash
# 禁用站点（重命名去掉 .conf 后缀）
sudo mv /etc/nginx/conf.d/example.com.conf \
        /etc/nginx/conf.d/example.com.conf.disabled

# 启用站点
sudo mv /etc/nginx/conf.d/example.com.conf.disabled \
        /etc/nginx/conf.d/example.com.conf

# 重新加载
sudo nginx -t && sudo systemctl reload nginx
```

### 2.3 推荐的目录组织方案

结合两种风格的优点，推荐的目录组织方案：

```mermaid
graph TB
    subgraph "/etc/nginx/"
        MAIN["nginx.conf<br/>主配置文件"]

        subgraph "conf.d/"
            CONF1["00-global.conf<br/>全局设置"]
            CONF2["01-gzip.conf<br/>压缩设置"]
            CONF3["01-ssl.conf<br/>SSL全局设置"]
            CONF4["02-logging.conf<br/>日志设置"]
        end

        subgraph "sites-available/"
            SA1["default.conf"]
            SA2["example.com.conf"]
            SA3["api.example.com.conf"]
        end

        subgraph "sites-enabled/"
            SE1["default.conf →"]
            SE2["example.com.conf →"]
        end

        subgraph "snippets/"
            SN1["proxy-params.conf"]
            SN2["ssl-params.conf"]
            SN3["security-headers.conf"]
            SN4["auth.conf"]
        end

        subgraph "upstream/"
            UP1["backend.conf"]
            UP2["api.conf"]
        end
    end

    MAIN -->|include| CONF1
    MAIN -->|include| SA1
    SN1 -->|include| SA2
    UP1 -->|include| SA2
```

```
/etc/nginx/
├── nginx.conf                    # 主配置（精简，只做include）
├── conf.d/                       # 全局配置
│   ├── 00-global.conf           # 全局HTTP设置
│   ├── 01-gzip.conf             # Gzip压缩
│   ├── 01-ssl.conf              # SSL全局参数
│   └── 02-logging.conf          # 日志配置
├── sites-available/              # 可用站点
│   ├── 00-default.conf          # 默认虚拟主机
│   ├── example.com.conf         # 示例站点
│   └── api.example.com.conf     # API站点
├── sites-enabled/                # 已启用站点（符号链接）
│   ├── 00-default.conf → ../sites-available/00-default.conf
│   └── example.com.conf → ../sites-available/example.com.conf
├── snippets/                     # 可复用配置片段
│   ├── proxy-params.conf        # 代理通用参数
│   ├── ssl-params.conf          # SSL通用参数
│   ├── security-headers.conf    # 安全响应头
│   └── auth-basic.conf          # 基本认证
├── upstream/                     # 上游服务器组
│   ├── backend.conf             # 后端应用
│   └── api.conf                 # API服务
├── ssl/                          # SSL证书
│   ├── example.com.crt
│   └── example.com.key
└── lua/                          # Lua脚本（OpenResty）
    └── *.lua
```

### 2.4 精简的 nginx.conf

```nginx
# /etc/nginx/nginx.conf - 精简主配置

user nginx;
worker_processes auto;
worker_rlimit_nofile 65535;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 4096;
    multi_accept on;
    accept_mutex off;
}

http {
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/upstream/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

## 3. 配置文件加载顺序与优先级

### 3.1 加载顺序

Nginx 配置的加载顺序决定了同名指令的覆盖关系：

```mermaid
flowchart TB
    A[1. nginx.conf main 上下文] --> B[2. nginx.conf events 块]
    A --> C[3. nginx.conf http 块]
    C --> D[4. conf.d/*.conf<br/>按字母序加载]
    D --> E[5. upstream/*.conf<br/>按字母序加载]
    E --> F[6. sites-enabled/*<br/>按字母序加载]
    F --> G[7. server 块匹配]
    G --> H[8. location 块匹配]
    H --> I[9. if 块（如存在）]

    style A fill:#FF5722,color:#fff
    style D fill:#FF9800,color:#fff
    style F fill:#4CAF50,color:#fff
    style H fill:#2196F3,color:#fff
```

### 3.2 指令优先级规则

#### 规则一：子上下文覆盖父上下文

```nginx
http {
    # 父上下文定义
    gzip on;                   # 全局启用 Gzip

    server {
        # 子上下文继承父上下文
        # gzip on 仍然有效

        location /api/ {
            # 可以覆盖父上下文
            gzip off;           # 此 location 禁用 Gzip
        }
    }
}
```

#### 规则二：同级别后加载覆盖先加载

```nginx
# 文件 conf.d/01-config.conf
server_tokens off;

# 文件 conf.d/02-config.conf
server_tokens on;    # 后加载的覆盖先加载的

# 最终生效：server_tokens on
```

#### 规则三：数组合并

某些指令在子上下文中不会覆盖，而是追加：

```nginx
http {
    # 父上下文
    include mime.types;                    # 定义了多种 MIME 类型

    server {
        # 子上下文的 types 会覆盖（不是追加）
        types {
            application/json json;
        }
        # 此时只有 json 类型生效，其他 MIME 类型丢失
    }
}
```

```nginx
# 正确做法：使用 include 保留父上下文
http {
    include mime.types;

    server {
        include mime.types;              # 保留原有类型
        # 追加自定义类型
        types {
            application/json json;
        }
    }
}
```

#### 规则四：add_header 指令的覆盖陷阱

```nginx
server {
    # 父级定义的安全头
    add_header X-Frame-Options "SAMEORIGIN";

    location /api/ {
        # 子级定义了 add_header
        # 此时父级的 X-Frame-Options 会被完全丢弃！
        add_header X-Custom-Header "value";

        # 必须重新声明所有需要的头
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-Custom-Header "value";
    }
}
```

::: warning add_header 覆盖陷阱
`add_header` 指令具有**继承但覆盖**的特性：如果子上下文（location）中定义了任何 `add_header`，则父上下文（server）中的 `add_header` 全部失效。这是 Nginx 配置中最常见的陷阱之一。

解决方案：
1. 在每个 location 中重复声明所有需要的头部
2. 使用 `headers-more` 第三方模块的 `more_set_headers` 指令
3. 使用 `include` 片段统一管理头部

参考：[https://nginx.org/en/docs/http/ngx_http_headers_module.html#add_header](https://nginx.org/en/docs/http/ngx_http_headers_module.html#add_header)
:::

### 3.3 server 块匹配优先级

当多个 server 块监听同一端口时，Nginx 按以下规则选择：

```
1. 精确匹配 server_name
   → server_name example.com;

2. 前缀通配符（最长优先）
   → server_name *.example.com;

3. 后缀通配符（最长优先）
   → server_name example.*;

4. 正则匹配（按配置顺序，第一个匹配的生效）
   → server_name ~^(www\.)?example\.com$;

5. 默认服务器（default_server）
   → listen 80 default_server;

6. 第一个定义的 server 块
```

```nginx
# server 匹配优先级示例
http {
    # 优先级5：默认服务器
    server {
        listen 80 default_server;
        server_name _;
        return 444;
    }

    # 优先级1：精确匹配
    server {
        listen 80;
        server_name example.com;
        # example.com 会匹配到这里
    }

    # 优先级2：前缀通配符
    server {
        listen 80;
        server_name *.example.com;
        # www.example.com, api.example.com 会匹配到这里
    }

    # 优先级3：后缀通配符
    server {
        listen 80;
        server_name example.*;
        # example.org, example.net 会匹配到这里
    }

    # 优先级4：正则匹配
    server {
        listen 80;
        server_name ~^(www\.)?(.+)$;
        # 正则匹配
    }
}
```

### 3.4 location 块匹配优先级

location 的匹配规则更为复杂：

```
1. 精确匹配 (=)：最高优先级，匹配后立即停止
2. 前缀匹配 (^~)：次高优先级，匹配后不检查正则
3. 正则匹配 (~ / ~*)：按配置顺序，第一个匹配的生效
4. 普通前缀匹配：最长匹配优先
```

```nginx
server {
    listen 80;

    # 优先级1：精确匹配
    location = / {
        # 只匹配 /，不匹配 /index.html
    }

    # 优先级2：前缀匹配（阻止正则）
    location ^~ /images/ {
        # /images/ 下的所有请求，不检查正则
    }

    # 优先级3：区分大小写正则
    location ~ \.php$ {
        # 匹配所有 .php 结尾的请求
    }

    # 优先级3：不区分大小写正则
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        # 匹配所有图片和静态资源
    }

    # 优先级4：普通前缀匹配
    location / {
        # 匹配所有请求（最长前缀匹配）
    }

    location /api/ {
        # /api/ 前缀匹配
    }

    location /api/v2/ {
        # 比 /api/ 更长的前缀，优先级更高
    }
}
```

```mermaid
flowchart TB
    REQ[请求URI] --> EXACT{精确匹配<br/>= /path ?}
    EXACT -->|匹配| R1[使用精确匹配的location]
    EXACT -->|不匹配| PREFIX{前缀匹配<br/>^~ /path ?}
    PREFIX -->|匹配| R2[使用前缀匹配的location<br/>不再检查正则]
    PREFIX -->|不匹配| REGEX{正则匹配<br/>~ / ~* ?}
    REGEX -->|匹配| R3[使用第一个匹配的正则location]
    REGEX -->|不匹配| LONGEST[使用最长普通前缀匹配]

    style R1 fill:#4CAF50,color:#fff
    style R2 fill:#2196F3,color:#fff
    style R3 fill:#FF9800,color:#fff
    style LONGEST fill:#9C27B0,color:#fff
```

## 4. 默认配置文件解读

### 4.1 Nginx 官方包默认配置

```nginx
# /etc/nginx/nginx.conf（官方仓库安装后的默认配置）

user  nginx;                    # Worker 进程以 nginx 用户运行
worker_processes  auto;         # 自动检测 CPU 核心数

error_log  /var/log/nginx/error.log notice;  # 错误日志，级别 notice
pid         /var/run/nginx.pid;               # PID 文件路径

events {
    worker_connections  1024;   # 每个 Worker 最大 1024 连接
}

http {
    include       /etc/nginx/mime.types;       # 引入 MIME 类型定义
    default_type  application/octet-stream;    # 默认 MIME 类型

    # 日志格式定义
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;  # 访问日志

    sendfile        on;       # 启用零拷贝
    #tcp_nopush     on;       # TCP 优化（注释掉了）
    keepalive_timeout  65;    # Keep-Alive 超时 65 秒
    #gzip  on;                # Gzip 压缩（注释掉了）

    include /etc/nginx/conf.d/*.conf;  # 引入站点配置
}
```

### 4.2 默认站点配置

```nginx
# /etc/nginx/conf.d/default.conf

server {
    listen       80;                    # 监听 80 端口
    server_name  localhost;             # 服务器名 localhost

    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;   # 站点根目录
        index  index.html index.htm;    # 默认首页
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```

### 4.3 mime.types 文件

```nginx
# /etc/nginx/mime.types（部分内容）
types {
    text/html                             html htm shtml;
    text/css                              css;
    text/xml                              xml;
    application/javascript                js;
    application/json                      json;
    application/xml                       rss atom;
    image/png                             png;
    image/jpeg                            jpeg jpg;
    image/gif                             gif;
    image/svg+xml                         svg svgz;
    image/x-icon                          ico;
    font/woff                             woff;
    font/woff2                            woff2;
    application/font-ttf                  ttf;
    application/vnd.ms-fontobject         eot;
    video/mp4                             mp4;
    video/webm                            webm;
    application/octet-stream             bin exe dll;
    application/zip                       zip;
    application/pdf                       pdf;
    # ... 更多 MIME 类型
}
```

## 5. 配置文件备份与版本管理

### 5.1 使用 Git 管理配置

```bash
# 初始化 Git 仓库
cd /etc/nginx
sudo git init
sudo git add -A
sudo git commit -m "Initial nginx configuration"

# 每次修改后提交
sudo git add -A
sudo git commit -m "Add SSL configuration for example.com"

# 查看修改历史
sudo git log --oneline

# 查看某次修改的详细内容
sudo git show HEAD

# 回滚到上一个版本
sudo git checkout HEAD~1 -- .
sudo nginx -t && sudo systemctl reload nginx
```

### 5.2 使用 etckeeper

```bash
# 安装 etckeeper（自动跟踪 /etc 目录的变更）
sudo apt install etckeeper   # Ubuntu
# sudo dnf install etckeeper  # RHEL

# 初始化
sudo etckeeper init

# 自动在每次包管理操作前提交
# /etc/etckeeper/etckeeper.conf
# VCS="git"
# AVOID_COMMIT_BEFORE_INSTALL=0
```

### 5.3 备份策略

```bash
# 定时备份脚本
#!/bin/bash
# /usr/local/bin/nginx-backup.sh

BACKUP_DIR="/var/backups/nginx"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# 备份整个配置目录
tar -czf $BACKUP_DIR/nginx_conf_$DATE.tar.gz /etc/nginx/

# 保留最近30天的备份
find $BACKUP_DIR -name "nginx_conf_*.tar.gz" -mtime +30 -delete

# 添加到 crontab
# 0 2 * * * /usr/local/bin/nginx-backup.sh
```

```bash
# 异地备份
rsync -avz /etc/nginx/ backup-server:/backups/nginx/
```

## 6. 多环境配置管理

### 6.1 方案一：环境变量 + envsubst

```nginx
# /etc/nginx/templates/proxy.conf.template
upstream ${APP_NAME} {
    server ${BACKEND_HOST}:${BACKEND_PORT};
    keepalive ${KEEPALIVE_COUNT};
}

server {
    listen ${LISTEN_PORT};
    server_name ${SERVER_NAME};

    location / {
        proxy_pass http://${APP_NAME};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# 使用 envsubst 生成实际配置
export APP_NAME=backend
export BACKEND_HOST=10.0.0.1
export BACKEND_PORT=8080
export KEEPALIVE_COUNT=32
export LISTEN_PORT=80
export SERVER_NAME=api.example.com

envsubst < /etc/nginx/templates/proxy.conf.template \
    > /etc/nginx/conf.d/proxy.conf

# 在 Docker 中使用
# docker-compose.yml
services:
  nginx:
    image: nginx:1.26-alpine
    environment:
      - APP_NAME=backend
      - BACKEND_HOST=app
      - BACKEND_PORT=8080
      - KEEPALIVE_COUNT=32
      - LISTEN_PORT=80
      - SERVER_NAME=api.example.com
    command: /bin/sh -c "envsubst < /etc/nginx/templates/proxy.conf.template > /etc/nginx/conf.d/proxy.conf && nginx -g 'daemon off;'"
```

::: warning envsubst 与 Nginx 变量冲突
`envsubst` 会替换所有 `$` 开头的变量，包括 Nginx 内置变量（如 `$host`、`$remote_addr`）。需要指定只替换特定变量：

```bash
# 只替换指定的环境变量
envsubst '${APP_NAME} ${BACKEND_HOST} ${BACKEND_PORT}' \
    < template.conf > actual.conf
```
:::

### 6.2 方案二：include 条件加载

```nginx
# /etc/nginx/nginx.conf

# 通过环境变量控制加载
# 在启动脚本中：
# if [ "$ENV" = "production" ]; then
#   cp /etc/nginx/env/prod.conf /etc/nginx/conf.d/00-env.conf
# else
#   cp /etc/nginx/env/dev.conf /etc/nginx/conf.d/00-env.conf
# fi

http {
    # 加载环境相关配置
    include /etc/nginx/conf.d/00-env.conf;
    include /etc/nginx/conf.d/*.conf;
}
```

```nginx
# /etc/nginx/env/prod.conf - 生产环境
gzip on;
gzip_comp_level 6;
keepalive_timeout 65;
client_max_body_size 50m;
server_tokens off;
```

```nginx
# /etc/nginx/env/dev.conf - 开发环境
gzip off;
keepalive_timeout 0;
client_max_body_size 100m;
server_tokens on;
```

### 6.3 方案三：Docker 多阶段构建

```dockerfile
# Dockerfile
FROM nginx:1.26-alpine AS base
COPY nginx.conf /etc/nginx/nginx.conf

# 开发环境
FROM base AS development
COPY env/dev/ /etc/nginx/conf.d/
EXPOSE 80

# 预发布环境
FROM base AS staging
COPY env/staging/ /etc/nginx/conf.d/
EXPOSE 80 443

# 生产环境
FROM base AS production
COPY env/prod/ /etc/nginx/conf.d/
EXPOSE 80 443
```

```bash
# 构建不同环境的镜像
docker build --target development -t nginx:dev .
docker build --target staging -t nginx:staging .
docker build --target production -t nginx:prod .
```

### 6.4 方案四：map 指令环境感知

```nginx
# 基于 Host 头自动切换环境
map $host $backend_name {
    default             backend_prod;
    dev.example.com     backend_dev;
    staging.example.com backend_staging;
    ~^api\.             backend_api;
}

upstream backend_prod {
    server 10.0.1.10:8080;
    server 10.0.1.11:8080;
}

upstream backend_dev {
    server 127.0.0.1:8080;
}

upstream backend_staging {
    server 10.0.2.10:8080;
}

upstream backend_api {
    server 10.0.3.10:8080;
    server 10.0.3.11:8080;
}

server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://$backend_name;
    }
}
```

## 7. 配置文件格式化与语法检查工具

### 7.1 nginx -t 语法检查

```bash
# 基本语法检查
sudo nginx -t
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# 输出完整配置（包含所有 include 的文件内容）
sudo nginx -T
# 输出所有配置文件的合并结果

# 静默模式（只输出错误）
sudo nginx -t -q
# 无输出表示配置正确
```

### 7.2 nginx -T 输出完整配置

```bash
# 查看运行时完整配置
sudo nginx -T 2>&1 | less

# 搜索特定配置
sudo nginx -T 2>&1 | grep "server_name"

# 检查某个模块是否加载
sudo nginx -T 2>&1 | grep "load_module"

# 导出完整配置
sudo nginx -T > /tmp/nginx_full_config.conf
```

### 7.3 配置格式化工具

#### nginx-crossplane

```bash
# 安装
pip install crossplane

# 格式化配置文件
crossplane format /etc/nginx/nginx.conf

# 检查配置
crossplane check /etc/nginx/nginx.conf

# 解析配置为 JSON
crossplane parse /etc/nginx/nginx.conf

# 构建配置（从 JSON 生成 Nginx 配置）
crossplane build config.json -o /etc/nginx/nginx.conf
```

#### nginxbeautifier

```bash
# 安装
npm install -g nginxbeautifier

# 格式化
nginxbeautifier -r /etc/nginx/

# 选项
# -r : 递归处理目录
# -s NUM : 缩进空格数（默认4）
# -t : 使用 Tab 缩进
```

#### nginxfmt

```bash
# Python 格式化工具
pip install nginxfmt

# 格式化单个文件
nginxfmt /etc/nginx/nginx.conf

# 格式化目录
nginxfmt /etc/nginx/conf.d/
```

### 7.4 配置语法高亮

#### Vim 语法高亮

```bash
# Nginx 源码自带 Vim 语法文件
cp -r /usr/local/src/nginx-1.26.2/contrib/vim/* ~/.vim/

# 或者手动安装
mkdir -p ~/.vim/syntax
mkdir -p ~/.vim/ftdetect
curl -o ~/.vim/syntax/nginx.vim \
    https://raw.githubusercontent.com/nginx/nginx/master/contrib/vim/syntax/nginx.vim
echo "au BufRead,BufNewFile /etc/nginx/* set ft=nginx" > ~/.vim/ftdetect/nginx.vim
```

#### VS Code 扩展

推荐安装以下 VS Code 扩展：

- **nginx.conf** - Nginx 配置语法高亮和补全
- **Nginx Configuration** - 语法检查和智能提示

## 8. 配置文件最佳实践

### 8.1 配置文件编写规范

```nginx
# ===== 命名规范 =====

# 1. 文件命名使用小写字母 + 连字符
# 正确：api-proxy.conf
# 错误：ApiProxy.conf, api_proxy.conf

# 2. 使用数字前缀控制加载顺序
# 00-default.conf
# 01-ssl.conf
# 02-api-proxy.conf

# 3. 站点配置以域名命名
# example.com.conf
# api.example.com.conf

# ===== 缩进规范 =====

# 使用 4 个空格缩进（不使用 Tab）
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://backend;
    }
}

# ===== 注释规范 =====

# 块注释：说明配置块的整体功能
# ============================================================
# API 反向代理配置
# 功能：将 /api/ 请求代理到后端应用服务器
# 创建时间：2024-01-15
# 最后修改：2024-06-01
# 负责人：运维团队
# ============================================================

# 行注释：说明单条指令的作用
server_tokens off;  # 隐藏 Nginx 版本号

# ===== 指令分组 =====

server {
    # ---- 监听与域名 ----
    listen 80;
    server_name example.com;

    # ---- SSL 配置 ----
    # ssl_certificate /etc/nginx/ssl/example.com.crt;
    # ssl_certificate_key /etc/nginx/ssl/example.com.key;

    # ---- 日志配置 ----
    access_log /var/log/nginx/example.com.access.log main;
    error_log /var/log/nginx/example.com.error.log warn;

    # ---- 安全配置 ----
    # include /etc/nginx/snippets/security-headers.conf;

    # ---- 路由配置 ----
    location / {
        proxy_pass http://backend;
        include /etc/nginx/snippets/proxy-params.conf;
    }
}
```

### 8.2 配置片段复用

```nginx
# /etc/nginx/snippets/proxy-params.conf
# 代理通用参数，可在多个 location 中 include

proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-Host $host;
proxy_set_header X-Forwarded-Port $server_port;

proxy_connect_timeout 5s;
proxy_send_timeout 30s;
proxy_read_timeout 60s;

proxy_buffering on;
proxy_buffer_size 4k;
proxy_buffers 8 4k;
proxy_busy_buffers_size 8k;
```

```nginx
# /etc/nginx/snippets/ssl-params.conf
# SSL 通用参数

ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1d;
ssl_session_tickets off;
```

```nginx
# /etc/nginx/snippets/security-headers.conf
# 安全响应头

add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'" always;
```

### 8.3 使用 include 组织配置

```nginx
# /etc/nginx/sites-available/example.com.conf
server {
    listen 80;
    server_name example.com www.example.com;

    # 引入代理通用参数
    include /etc/nginx/snippets/proxy-params.conf;

    location / {
        proxy_pass http://backend;
    }

    location /api/ {
        proxy_pass http://api_backend;
        # 覆盖特定参数
        proxy_read_timeout 120s;
    }
}
```

### 8.4 配置验证脚本

```bash
#!/bin/bash
# /usr/local/bin/nginx-validate.sh

# 验证 Nginx 配置
echo "===== Nginx 配置验证 ====="

# 1. 语法检查
echo -n "1. 语法检查: "
if sudo nginx -t 2>&1; then
    echo "✓ 通过"
else
    echo "✗ 失败"
    exit 1
fi

# 2. 检查默认服务器配置
echo -n "2. 默认服务器: "
if sudo nginx -T 2>&1 | grep -q "default_server"; then
    echo "✓ 已配置"
else
    echo "⚠ 未配置 default_server"
fi

# 3. 检查 server_tokens
echo -n "3. 版本隐藏: "
if sudo nginx -T 2>&1 | grep -q "server_tokens off"; then
    echo "✓ 已隐藏"
else
    echo "⚠ 未隐藏"
fi

# 4. 检查 SSL 配置
echo -n "4. SSL 配置: "
SSL_COUNT=$(sudo nginx -T 2>&1 | grep -c "listen.*443 ssl")
echo "$SSL_COUNT 个 SSL 站点"

# 5. 检查重复 server_name
echo -n "5. 重复域名: "
DUPES=$(sudo nginx -T 2>&1 | grep "server_name" | sort | uniq -d)
if [ -z "$DUPES" ]; then
    echo "✓ 无重复"
else
    echo "⚠ 发现重复:"
    echo "$DUPES"
fi

# 6. 统计配置
echo "6. 配置统计:"
echo "   - Server 块: $(sudo nginx -T 2>&1 | grep -c 'server {')"
echo "   - Location 块: $(sudo nginx -T 2>&1 | grep -c 'location ')"
echo "   - Upstream 块: $(sudo nginx -T 2>&1 | grep -c 'upstream ')"

echo "===== 验证完成 ====="
```

## 9. 配置文件安全

### 9.1 文件权限控制

```bash
# Nginx 配置文件权限设置
# 配置文件
sudo chmod 640 /etc/nginx/nginx.conf
sudo chmod 640 /etc/nginx/conf.d/*.conf
sudo chmod 640 /etc/nginx/sites-available/*
sudo chmod 640 /etc/nginx/snippets/*

# 目录权限
sudo chmod 750 /etc/nginx
sudo chmod 750 /etc/nginx/conf.d
sudo chmod 750 /etc/nginx/sites-available
sudo chmod 750 /etc/nginx/sites-enabled
sudo chmod 750 /etc/nginx/snippets

# 所有者
sudo chown -R root:nginx /etc/nginx

# SSL 证书（更严格的权限）
sudo chmod 600 /etc/nginx/ssl/*.key
sudo chmod 644 /etc/nginx/ssl/*.crt
sudo chown root:nginx /etc/nginx/ssl/*
```

### 9.2 敏感信息处理

```nginx
# 不要在配置文件中硬编码密码

# 错误：
# proxy_pass http://user:password@backend:8080;

# 正确：使用环境变量
# 在启动脚本中：
# export DB_PASSWORD=$(cat /run/secrets/db_password)

# 或者使用单独的认证文件
# /etc/nginx/.htpasswd（权限 640，属主 root:nginx）
auth_basic "Restricted Area";
auth_basic_user_file /etc/nginx/.htpasswd;
```

```bash
# 创建 .htpasswd 文件
sudo apt install apache2-utils  # 安装 htpasswd 工具
sudo htpasswd -c /etc/nginx/.htpasswd admin
sudo chmod 640 /etc/nginx/.htpasswd
sudo chown root:nginx /etc/nginx/.htpasswd
```

### 9.3 配置文件审计

```bash
# 检查配置文件中的敏感信息
grep -rn "password\|secret\|token\|api_key" /etc/nginx/

# 检查过于宽松的权限
find /etc/nginx/ -perm /o=r -type f
find /etc/nginx/ -perm /o=w -type f

# 检查符号链接
find /etc/nginx/ -type l -ls

# 检查空配置
find /etc/nginx/ -name "*.conf" -empty
```

## 10. 配置热加载机制

### 10.1 reload 的工作原理

```mermaid
sequenceDiagram
    participant Admin as 管理员
    participant Master as Master
    participant OldW as 旧Worker
    participant NewW as 新Worker

    Admin->>Master: nginx -s reload<br/>(发送 HUP 信号)

    Master->>Master: 1. 读取新配置文件
    Master->>Master: 2. 验证配置语法

    alt 配置有效
        Master->>NewW: 3. fork 新 Worker 进程
        Note over NewW: 新 Worker 使用新配置
        Master->>OldW: 4. 向旧 Worker 发送 QUIT
        OldW->>OldW: 5. 处理完当前请求
        OldW->>OldW: 6. 优雅退出
    else 配置无效
        Master->>Master: 保持旧配置运行
        Master->>Admin: 输出错误信息
        Note over OldW: 旧 Worker 继续运行
    end
```

### 10.2 reload 与 restart 的区别

| 操作 | 命令 | 影响 | 停机时间 | 适用场景 |
|------|------|------|---------|---------|
| reload | `nginx -s reload` | 优雅替换 Worker | 无 | 配置变更 |
| restart | `systemctl restart nginx` | 停止后重新启动 | 短暂 | 二进制升级 |
| stop | `nginx -s stop` | 立即终止 | 永久 | 紧急停止 |
| quit | `nginx -s quit` | 优雅关闭 | 永久 | 计划维护 |

### 10.3 reload 注意事项

```bash
# reload 前必须检查语法
sudo nginx -t && sudo systemctl reload nginx

# 如果不检查语法直接 reload
# 配置错误时：
# - 旧 Worker 继续运行
# - 新 Worker 无法启动
# - 但不会中断服务

# 但是，某些配置变更需要注意：
# 1. SSL 证书更新 - reload 即可
# 2. upstream 服务器变更 - reload 即可
# 3. 新增 listen 端口 - 需要 restart
# 4. 修改 worker_processes - reload 即可
# 5. 修改 worker_connections - reload 即可
```

::: tip reload 的安全机制
Nginx 的 reload 机制非常安全：如果新配置有语法错误，Master 进程会拒绝加载新配置，旧 Worker 继续运行，不会中断服务。但仍建议在 reload 前先执行 `nginx -t` 检查，以及时发现和修复配置问题。参考：[https://nginx.org/en/docs/control.html](https://nginx.org/en/docs/control.html)
:::

## 11. 本章小结

本章系统梳理了 Nginx 配置文件体系：

1. **全局结构**：main → events/http/stream/mail 的层次结构
2. **include 机制**：通过 include 实现配置分离与模块化
3. **目录组织**：sites-available/sites-enabled 和 conf.d 两种风格
4. **加载顺序**：理解 include 的加载顺序和指令覆盖规则
5. **优先级**：server 和 location 的匹配优先级规则
6. **默认配置**：逐行理解官方默认配置的含义
7. **版本管理**：使用 Git/etckeeper 管理配置变更
8. **多环境**：envsubst、条件加载、Docker 多阶段构建等方案
9. **格式化工具**：nginx -T、crossplane、nginxbeautifier 等
10. **安全加固**：文件权限、敏感信息处理、配置审计

下一章将进入核心配置指令的详细讲解。
