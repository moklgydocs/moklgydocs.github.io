---
title: Shell 脚本编程
icon: fa6-solid:code
order: 4
category:
  - Linux
  - Linux进阶
tag:
  - Shell
  - Bash
  - 脚本编程
  - 自动化
---

# Shell 脚本编程

> Shell 脚本是系统管理员的瑞士军刀——自动化一切重复劳动，让机器替你干活。
>
> 本章参考：《Linux 命令行与 Shell 脚本编程大全》（第四版）、《Advanced Bash-Scripting Guide》。

## 一、Bash 脚本基础

### 1.1 Shebang 与脚本结构

```bash
#!/usr/bin/env bash
# ========================================
# 脚本名称: example.sh
# 描    述: 示例脚本
# 作    者: author
# 日    期: 2024-01-01
# 版    本: 1.0
# ========================================

# 严格模式（推荐每个脚本都加上）
set -euo pipefail
# -e: 命令失败时立即退出
# -u: 使用未定义变量时报错
# -o pipefail: 管道中任一命令失败则整个管道失败

# 脚本目录（无论从哪里运行都能找到同目录的文件）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 脚本入口
main() {
    echo "Hello, Shell Scripting!"
}

# 只有直接执行时才运行 main，被 source 时不运行
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
```

::: tip 为什么用 `#!/usr/bin/env bash` 而非 `#!/bin/bash`？
- `#!/bin/bash`：硬编码路径，在某些系统上 bash 可能不在 `/bin/`
- `#!/usr/bin/env bash`：通过 `env` 在 PATH 中搜索 bash，可移植性更好
- macOS、FreeBSD 等系统上 bash 可能安装在不同位置
:::

### 1.2 变量与引号

```bash
#!/usr/bin/env bash

# ========== 变量定义 ==========
# 等号两边不能有空格！
name="张三"
age=28
score=95.5

# ========== 引号的区别 ==========
# 双引号：允许变量展开和命令替换
echo "姓名: $name, 年龄: $age"        # 姓名: 张三, 年龄: 28

# 单引号：原样输出，不做任何展开
echo '姓名: $name, 年龄: $age'        # 姓名: $name, 年龄: $age

# 反引号/$(...)：命令替换
echo "当前目录: $(pwd)"                # 当前目录: /home/user
echo "当前目录: `pwd`"                 # 同上，但不推荐（嵌套困难）

# ========== 变量使用 ==========
# 推荐使用 ${} 明确边界
file_prefix="report"
echo "文件: ${file_prefix}_2024.txt"   # 文件: report_2024.txt
echo "文件: $file_prefix_2024.txt"     # 文件: .txt（变量名混淆）

# ========== 特殊变量 ==========
echo "脚本名: $0"           # 脚本文件名
echo "第一个参数: $1"       # 第一个参数
echo "参数个数: $#"         # 参数数量
echo "所有参数: $@"         # 所有参数（各自独立）
echo "所有参数: $*"         # 所有参数（合为一个字符串）
echo "当前PID: $$"          # 进程 ID
echo "上一个命令返回值: $?" # 退出状态码
echo "后台最后一个PID: $!"  # 最后一个后台进程 PID

# ========== $@ vs $* ==========
# 用双引号包围时区别明显
show_args() {
    echo "--- 使用 \"\$@\" ---"
    for arg in "$@"; do
        echo "  参数: [$arg]"
    done

    echo "--- 使用 \"\$*\" ---"
    for arg in "$*"; do
        echo "  参数: [$arg]"
    done
}

# 执行: ./script.sh "hello world" foo bar
# "$@" → 三个参数: [hello world] [foo] [bar]
# "$*" → 一个参数: [hello world foo bar]
```

### 1.3 变量作用域

```bash
#!/usr/bin/env bash

# ========== 全局变量 ==========
global_var="我是全局变量"

# ========== 局部变量（函数内）==========
test_scope() {
    local local_var="我是局部变量"
    local_var_modified="我修改了全局变量"  # 没加 local，是全局变量！

    echo "函数内 - global_var: $global_var"
    echo "函数内 - local_var: $local_var"
}

test_scope

echo "函数外 - global_var: $global_var"
echo "函数外 - local_var: $local_var"         # 空（局部变量已销毁）
echo "函数外 - local_var_modified: $local_var_modified"  # 有值（未用 local）

# ========== 环境变量（导出给子进程）==========
export MY_CONFIG="可以被子进程访问"

# 子进程可以继承
bash -c 'echo "子进程看到: $MY_CONFIG"'

# 未 export 的变量子进程看不到
not_exported="子进程看不到"
bash -c 'echo "子进程看到: $not_exported"'   # 空

# ========== 只读变量 ==========
readonly PI=3.14159
# PI=3.14  # 报错：readonly variable

# ========== 声明整数变量 ==========
declare -i count=0
count=count+1    # 不需要 $，直接计算
echo "count: $count"   # count: 1
```

## 二、条件测试

### 2.1 test / [ ] / [[ ]]

```bash
#!/usr/bin/env bash

# ========== 文件测试 ==========
file="/etc/passwd"

# 推荐使用 [[ ]]
if [[ -f "$file" ]]; then echo "文件存在"; fi
if [[ -d "$file" ]]; then echo "是目录"; fi
if [[ -r "$file" ]]; then echo "可读"; fi
if [[ -w "$file" ]]; then echo "可写"; fi
if [[ -x "$file" ]]; then echo "可执行"; fi
if [[ -s "$file" ]]; then echo "非空"; fi
if [[ -L "$file" ]]; then echo "符号链接"; fi

# 文件比较
if [[ file1 -nt file2 ]]; then echo "file1 更新"; fi   # newer than
if [[ file1 -ot file2 ]]; then echo "file1 更旧"; fi   # older than

# ========== 字符串测试 ==========
str="hello"

if [[ -z "$str" ]]; then echo "空字符串"; fi     # 长度为 0
if [[ -n "$str" ]]; then echo "非空字符串"; fi   # 长度非 0
if [[ "$str" == "hello" ]]; then echo "相等"; fi # 字符串相等
if [[ "$str" != "world" ]]; then echo "不等"; fi # 字符串不等

# 模式匹配（[[ ]] 独有）
if [[ "$str" == h* ]]; then echo "以 h 开头"; fi
if [[ "$str" == ???o ]]; then echo "匹配 ? 模式"; fi

# 正则匹配（[[ ]] 独有）
if [[ "$str" =~ ^[a-z]+$ ]]; then echo "全是小写字母"; fi
if [[ "192.168.1.1" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "IP 格式正确"
fi

# ========== 数值比较 ==========
# 在 [[ ]] 中使用 -eq/-ne/-lt/-le/-gt/-ge
a=10
b=20

if [[ $a -eq $b ]]; then echo "相等"; fi
if [[ $a -ne $b ]]; then echo "不等"; fi
if [[ $a -lt $b ]]; then echo "a 小于 b"; fi
if [[ $a -le $b ]]; then echo "a 小于等于 b"; fi
if [[ $a -gt $b ]]; then echo "a 大于 b"; fi
if [[ $a -ge $b ]]; then echo "a 大于等于 b"; fi

# 推荐：数值比较使用 (( ))
if (( a < b )); then echo "a 小于 b"; fi
if (( a == 10 )); then echo "a 等于 10"; fi
if (( a != b )); then echo "a 不等于 b"; fi
if (( a >= 5 && a <= 15 )); then echo "a 在 5-15 之间"; fi
```

### 2.2 [ ] vs [[ ]] 完整对比

| 特性 | [ ] (POSIX) | [[ ]] (Bash) |
|------|-------------|--------------|
| 变量引号 | 必须加 | 可不加（但推荐加） |
| 逻辑与 | -a | && |
| 逻辑或 | -o | \|\| |
| 模式匹配 | 不支持 | == 和通配符 |
| 正则匹配 | 不支持 | =~ |
| 空变量安全 | 需要引号保护 | 安全 |
| 可移植性 | POSIX 兼容 | 仅 Bash |

::: important 优先使用 [[ ]] 和 (())
- `[[ ]]` 用于字符串和文件测试，更安全更强大
- `(( ))` 用于数值比较和算术运算，更直观
- `[ ]` 仅在需要 POSIX 兼容时使用
:::

## 三、流程控制

### 3.1 if/elif/else

```bash
#!/usr/bin/env bash

# ========== 基本 if ==========
score=85

if (( score >= 90 )); then
    echo "优秀"
elif (( score >= 80 )); then
    echo "良好"
elif (( score >= 70 )); then
    echo "中等"
elif (( score >= 60 )); then
    echo "及格"
else
    echo "不及格"
fi

# ========== 组合条件 ==========
port=8080
host="localhost"

if [[ "$host" == "localhost" ]] && (( port > 1024 )); then
    echo "本地开发环境"
fi

if [[ "$host" != "localhost" ]] || (( port == 80 )); then
    echo "生产环境或标准端口"
fi

# ========== 嵌套 if ==========
check_service() {
    local service="$1"

    if systemctl is-active "$service" &>/dev/null; then
        if systemctl is-enabled "$service" &>/dev/null; then
            echo "$service: 运行中（已启用开机自启）"
        else
            echo "$service: 运行中（未启用开机自启）"
        fi
    else
        echo "$service: 未运行"
    fi
}

check_service sshd
```

### 3.2 case 语句

```bash
#!/usr/bin/env bash

# ========== 基本 case ==========
action="${1:-}"

case "$action" in
    start)
        echo "启动服务..."
        ;;
    stop)
        echo "停止服务..."
        ;;
    restart)
        echo "重启服务..."
        ;;
    status)
        echo "查看状态..."
        ;;
    *)
        echo "用法: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac

# ========== 模式匹配 ==========
file="document.pdf"

case "$file" in
    *.txt)       echo "文本文件" ;;
    *.pdf)       echo "PDF 文件" ;;
    *.tar.gz)    echo "Gzip 压缩包" ;;
    *.zip)       echo "ZIP 压缩包" ;;
    *.sh)        echo "Shell 脚本" ;;
    Makefile)    echo "Make 构建文件" ;;
    *)           echo "未知文件类型" ;;
esac

# ========== 合并模式 ==========
os="ubuntu"

case "$os" in
    ubuntu|debian|linuxmint)
        echo "Debian 系发行版"
        sudo apt update
        ;;
    centos|rhel|rocky|almalinux)
        echo "RedHat 系发行版"
        sudo yum makecache
        ;;
    arch|manjaro)
        echo "Arch 系发行版"
        sudo pacman -Sy
        ;;
    *)
        echo "未知发行版: $os"
        ;;
esac
```

### 3.3 for 循环

```bash
#!/usr/bin/env bash

# ========== 遍历列表 ==========
for fruit in "苹果" "香蕉" "橙子"; do
    echo "水果: $fruit"
done

# ========== 遍历文件 ==========
for file in /etc/*.conf; do
    if [[ -f "$file" ]]; then
        echo "配置文件: $file"
    fi
done

# ========== 数字序列 ==========
# 大括号扩展
for i in {1..10}; do
    echo "序号: $i"
done

# 带步长
for i in {0..100..5}; do
    echo "步长5: $i"
done

# C 风格（推荐用于数值循环）
for ((i = 0; i < 10; i++)); do
    echo "C风格: $i"
done

# 多变量
for ((i = 0, j = 10; i < j; i++, j--)); do
    echo "i=$i, j=$j"
done

# ========== 遍历数组 ==========
servers=("web01" "web02" "db01" "cache01")

for server in "${servers[@]}"; do
    echo "服务器: $server"
done

# 带索引
for i in "${!servers[@]}"; do
    echo "[$i] ${servers[$i]}"
done

# ========== 遍历命令输出 ==========
# 安全方式：处理含空格的文件名
while IFS= read -r -d '' file; do
    echo "文件: $file"
done < <(find /var/log -name "*.log" -print0)

# ========== break 和 continue ==========
for i in {1..20}; do
    if (( i % 2 == 0 )); then
        continue    # 跳过偶数
    fi
    if (( i > 15 )); then
        break       # 大于15停止
    fi
    echo "奇数: $i"
done
```

### 3.4 while 和 until 循环

```bash
#!/usr/bin/env bash

# ========== while 循环 ==========
count=1
while (( count <= 5 )); do
    echo "计数: $count"
    ((count++))
done

# ========== 逐行读取文件 ==========
while IFS= read -r line; do
    echo "行: $line"
done < /etc/hostname

# ========== 读取命令输出 ==========
while IFS= read -r pid comm; do
    echo "PID: $pid, 命令: $comm"
done < <(ps -eo pid=,comm= | head -10)

# ========== until 循环（条件为真时停止）==========
wait_count=0
until curl -s http://localhost:8080/health > /dev/null 2>&1; do
    ((wait_count++))
    if (( wait_count > 30 )); then
        echo "等待超时！"
        exit 1
    fi
    echo "等待服务就绪... ($wait_count)"
    sleep 2
done
echo "服务已就绪！"

# ========== 无限循环 ==========
while true; do
    # 监控逻辑
    if ! systemctl is-active myapp &>/dev/null; then
        echo "服务异常，尝试重启..."
        systemctl restart myapp
    fi
    sleep 60
done
```

## 四、函数

### 4.1 函数定义与调用

```bash
#!/usr/bin/env bash

# ========== 函数定义 ==========
# 方式1
greet() {
    local name="${1:-世界}"
    echo "你好, $name!"
}

# 方式2
function farewell() {
    local name="${1:-世界}"
    echo "再见, $name!"
}

# 调用
greet "张三"
farewell "李四"

# ========== 返回值 ==========
# 方式1：退出状态码（0-255）
is_even() {
    local num="$1"
    if (( num % 2 == 0 )); then
        return 0    # 成功
    else
        return 1    # 失败
    fi
}

if is_even 4; then
    echo "4 是偶数"
fi

# 方式2：通过 echo 输出（推荐）
get_timestamp() {
    date '+%Y%m%d_%H%M%S'
}

ts=$(get_timestamp)
echo "时间戳: $ts"

# 方式3：通过引用参数返回
get_system_info() {
    local -n _hostname=$1
    local -n _kernel=$2
    _hostname=$(hostname)
    _kernel=$(uname -r)
}

declare hostname kernel
get_system_info hostname kernel
echo "主机: $hostname, 内核: $kernel"
```

### 4.2 函数最佳实践

```bash
#!/usr/bin/env bash

# 1. 函数名使用小写+下划线
check_disk_space() {
    local path="${1:-/}"
    local threshold="${2:-80}"

    local usage
    usage=$(df "$path" | awk 'NR==2 {gsub(/%/,""); print $5}')

    if (( usage >= threshold )); then
        echo "告警: $path 使用率 ${usage}% (阈值 ${threshold}%)"
        return 1
    fi

    echo "正常: $path 使用率 ${usage}%"
    return 0
}

# 2. 参数验证
validate_port() {
    local port="$1"

    if [[ -z "$port" ]]; then
        echo "错误: 端口号不能为空" >&2
        return 1
    fi

    if ! [[ "$port" =~ ^[0-9]+$ ]]; then
        echo "错误: 端口号必须是数字" >&2
        return 2
    fi

    if (( port < 1 || port > 65535 )); then
        echo "错误: 端口号范围 1-65535" >&2
        return 3
    fi

    return 0
}

# 3. 日志函数
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    case "$level" in
        INFO)  echo "[$timestamp] [INFO]  $message" ;;
        WARN)  echo "[$timestamp] [WARN]  $message" ;;
        ERROR) echo "[$timestamp] [ERROR] $message" >&2 ;;
        *)     echo "[$timestamp] [????]  $message" ;;
    esac
}

log INFO "应用启动"
log WARN "磁盘空间不足"
log ERROR "数据库连接失败"
```

## 五、数组与字符串处理

### 5.1 数组操作

```bash
#!/usr/bin/env bash

# ========== 索引数组 ==========
# 创建
fruits=("苹果" "香蕉" "橙子" "葡萄")

# 访问
echo "第一个: ${fruits[0]}"
echo "最后一个: ${fruits[-1]}"
echo "所有元素: ${fruits[@]}"

# 长度
echo "元素数量: ${#fruits[@]}"
echo "第一个元素长度: ${#fruits[0]}"

# 添加
fruits+=("梨")
fruits+=("西瓜" "芒果")

# 删除
unset 'fruits[1]'    # 删除索引1

# 切片
subset=("${fruits[@]:1:3}")   # 从索引1取3个

# 遍历
for fruit in "${fruits[@]}"; do
    echo "水果: $fruit"
done

# 所有索引
echo "索引: ${!fruits[@]}"

# ========== 关联数组（Bash 4+）==========
declare -A server_map

# 赋值
server_map[web]="192.168.1.10"
server_map[db]="192.168.1.20"
server_map[cache]="192.168.1.30"

# 访问
echo "Web 服务器: ${server_map[web]}"

# 遍历
for role in "${!server_map[@]}"; do
    echo "$role → ${server_map[$role]}"
done

# 检查键是否存在
if [[ -v server_map[web] ]]; then
    echo "web 键存在"
fi
```

### 5.2 字符串处理

```bash
#!/usr/bin/env bash

str="Hello, World! Hello, Shell!"

# ========== 长度 ==========
echo "长度: ${#str}"

# ========== 截取 ==========
echo "从位置7取5个: ${str:7:5}"       # World
echo "从位置7到末尾: ${str:7}"         # World! Hello, Shell!
echo "倒数6个字符: ${str: -6}"         # hell!（注意空格）

# ========== 默认值 ==========
unset my_var
echo "${my_var:-默认值}"               # 默认值（不赋值）
echo "${my_var:=默认值}"               # 默认值（同时赋值）
echo "${my_var:+有值时替换}"           # 有值时替换
# echo "${my_var:?变量未定义}"         # 未定义时报错退出

# ========== 删除模式 ==========
path="/home/user/documents/file.txt"

# 从头删除最短匹配
echo "${path#*/}"           # home/user/documents/file.txt

# 从头删除最长匹配
echo "${path##*/}"          # file.txt

# 从尾删除最短匹配
echo "${path%/*}"           # /home/user/documents

# 从尾删除最长匹配
echo "${path%%/*}"          # （空）

# ========== 替换 ==========
text="数据库主机是localhost，应用主机也是localhost"

# 替换第一个
echo "${text/localhost/192.168.1.1}"
# 数据库主机是192.168.1.1，应用主机也是localhost

# 替换全部
echo "${text//localhost/192.168.1.1}"
# 数据库主机是192.168.1.1，应用主机也是192.168.1.1

# 替换开头
echo "${text/#数据库/缓存}"

# 替换结尾
echo "${text/%localhost/127.0.0.1}"

# ========== 大小写转换（Bash 4+）==========
name="Hello World"
echo "${name,,}"       # 全小写: hello world
echo "${name^^}"       # 全大写: HELLO WORLD
echo "${name~~}"       # 大小写互换: hELLO wORLD

# ========== 实用技巧 ==========
# 获取文件名（不含路径）
filepath="/path/to/archive.tar.gz"
filename="${filepath##*/}"
echo "文件名: $filename"                     # archive.tar.gz

# 获取文件扩展名
extension="${filename##*.}"
echo "扩展名: $extension"                     # gz

# 获取不含扩展名的文件名
basename="${filename%.*}"
echo "不含扩展名: $basename"                  # archive.tar

# 获取主文件名（去掉所有扩展名）
mainname="${filename%%.*}"
echo "主文件名: $mainname"                    # archive
```

## 六、Here Document 与重定向

### 6.1 Here Document

```bash
#!/usr/bin/env bash

# ========== 基本用法 ==========
cat << EOF
这是 Here Document 的内容
支持变量展开: $HOME
支持命令替换: $(date)
EOF

# ========== 禁止变量展开 ==========
cat << 'EOF'
这里面的 $HOME 不会被展开
$(date) 也不会执行
EOF

# ========== 缩进对齐 ==========
# <<- 可以忽略前导 Tab（注意是 Tab 不是空格）
if true; then
	cat <<- EOF
		缩进的内容
		看起来更整齐
	EOF
fi

# ========== 写入文件 ==========
cat << EOF > /tmp/config.ini
[database]
host = localhost
port = 3306
name = myapp
EOF

# ========== 追加到文件 ==========
cat << EOF >> /tmp/config.ini
[cache]
host = 127.0.0.1
port = 6379
EOF

# ========== 传递给函数 ==========
process_data() {
    while IFS='=' read -r key value; do
        echo "键: $key, 值: $value"
    done
}

process_data << EOF
name=MyApp
version=1.0
debug=true
EOF

# ========== Here String ==========
# 将字符串作为标准输入
grep "hello" <<< "hello world"
wc -w <<< "one two three four"
```

### 6.2 文件描述符与重定向

```bash
#!/usr/bin/env bash

# ========== 标准流 ==========
# 0 = stdin（标准输入）
# 1 = stdout（标准输出）
# 2 = stderr（标准错误）

# ========== 输出重定向 ==========
command > file         # stdout → file（覆盖）
command >> file        # stdout → file（追加）
command 2> file        # stderr → file
command 2>> file       # stderr → file（追加）
command &> file        # stdout+stderr → file
command >> file 2>&1   # stdout+stderr → file（追加）

# ========== 输入重定向 ==========
command < file         # stdin ← file
command << EOF         # stdin ← Here Document
command <<< "string"   # stdin ← Here String

# ========== 丢弃输出 ==========
command > /dev/null 2>&1    # 丢弃所有输出
command 2>/dev/null         # 只丢弃错误

# ========== 文件描述符操作 ==========
# 打开文件描述符
exec 3>/tmp/output.log      # FD3 → 写入文件
exec 4</tmp/input.txt       # FD4 ← 读取文件
exec 5>>/tmp/append.log     # FD5 → 追加文件

# 使用文件描述符
echo "写入 FD3" >&3
read line <&4
echo "从 FD4 读取: $line"
echo "追加到 FD5" >&5

# 关闭文件描述符
exec 3>&-    # 关闭 FD3
exec 4<&-    # 关闭 FD4
exec 5>&-    # 关闭 FD5

# ========== 交换 stdout 和 stderr ==========
command 3>&1 1>&2 2>&3 3>&-
# 原理：FD3暂存stdout → stdout指向stderr → stderr指向FD3(原stdout) → 关闭FD3

# ========== 进程替换 ==========
# 将命令输出作为文件参数
diff <(sort file1.txt) <(sort file2.txt)

# 同时读取多个命令输出
while read -r left right; do
    echo "$left | $right"
done < <(paste <(command1) <(command2))
```

### 6.3 管道与子 Shell

```bash
#!/usr/bin/env bash

# ========== 管道中的子 Shell 问题 ==========
count=0
echo -e "a\nb\nc" | while read -r line; do
    ((count++))
done
echo "count = $count"    # 0！管道中的 while 在子 Shell 中运行

# ========== 解决方案1：进程替换 ==========
count=0
while read -r line; do
    ((count++))
done < <(echo -e "a\nb\c")
echo "count = $count"    # 3

# ========== 解决方案2：lastpipe ==========
shopt -s lastpipe        # Bash 4.2+
set +m                   # 关闭作业控制（交互模式下需要）
count=0
echo -e "a\nb\nc" | while read -r line; do
    ((count++))
done
echo "count = $count"    # 3

# ========== 解决方案3：临时文件 ==========
count=0
tmpfile=$(mktemp)
echo -e "a\nb\nc" > "$tmpfile"
while read -r line; do
    ((count++))
done < "$tmpfile"
rm -f "$tmpfile"
echo "count = $count"    # 3

# ========== tee 命令 ==========
# 同时输出到终端和文件
echo "重要信息" | tee /tmp/log.txt

# 追加模式
echo "追加信息" | tee -a /tmp/log.txt

# 同时输出到多个文件
echo "数据" | tee >(command1) >(command2) /tmp/file1.txt
```

## 七、命令替换与算术运算

### 7.1 命令替换

```bash
#!/usr/bin/env bash

# ========== 基本用法 ==========
# $(command) — 推荐
current_dir=$(pwd)
file_count=$(ls | wc -l)
kernel_version=$(uname -r)

# `command` — 旧语法，不推荐
current_dir=`pwd`

# ========== 嵌套 ==========
# $() 支持嵌套
word_count=$(wc -l < "$(find /etc -name '*.conf' | head -1)")

# ========== 与变量结合 ==========
backup_dir="/backup/$(date '+%Y%m%d')"
mkdir -p "$backup_dir"

# ========== 赋值给数组 ==========
files=($(find . -maxdepth 1 -type f))
echo "文件数: ${#files[@]}"
```

### 7.2 算术运算

```bash
#!/usr/bin/env bash

# ========== $(( )) 算术扩展 ==========
echo $((1 + 2))          # 3
echo $((10 - 3))         # 7
echo $((6 * 7))          # 42
echo $((17 / 5))         # 3（整数除法）
echo $((17 % 5))         # 2（取余）
echo $((2 ** 10))        # 1024（幂运算）

# 变量运算（不需要 $）
x=10
y=3
echo $((x + y))          # 13
echo $((x * y))          # 30
echo $((x++))            # 10（先返回后自增）
echo $((++x))            # 12（先自增后返回）

# 复合赋值
total=0
((total += 10))          # total = total + 10
((total -= 3))           # total = total - 3
((total *= 2))           # total = total * 2
echo "total: $total"

# 位运算
echo $((0xFF & 0x0F))    # 15
echo $((1 << 8))         # 256

# 比较运算（返回 0 或 1）
echo $((5 > 3))           # 1
echo $((5 < 3))           # 0
echo $((5 == 5))          # 1
echo $((5 != 3))          # 1

# ========== let 命令 ==========
let a=5+3                 # a=8
let a++                   # a=9
let a*=2                  # a=18
echo "a = $a"

# ========== declare -i ==========
declare -i num=10
num=num+5                 # 自动算术运算
echo "num = $num"         # 15

# ========== 浮点运算（需要 bc）==========
echo "scale=2; 17/5" | bc     # 3.40
echo "scale=4; 3.14159 * 2" | bc  # 6.28318

# 比较浮点数
compare_float() {
    local a="$1" b="$2"
    local result
    result=$(echo "$a > $b" | bc)
    if (( result == 1 )); then
        echo "$a > $b"
    else
        echo "$a <= $b"
    fi
}
compare_float 3.14 2.72
```

## 八、脚本调试

### 8.1 调试选项

```bash
# ========== 运行时调试 ==========
# 显示每行执行的命令
bash -x script.sh

# 语法检查（不执行）
bash -n script.sh

# 详细模式（类似 -x 但更详细）
bash -v script.sh

# ========== 脚本内设置 ==========
#!/usr/bin/env bash

# 全局调试
set -x        # 开启命令跟踪
# ... 脚本代码 ...
set +x        # 关闭命令跟踪

# 仅调试某个函数
my_function() {
    set -x
    # 函数代码
    set +x
}

# ========== 严格模式 ==========
set -euo pipefail

# -e: 命令失败时退出（避免错误累积）
# -u: 使用未定义变量时报错（避免拼写错误）
# -o pipefail: 管道中任一命令失败则管道失败

# ========== 调试输出 ==========
# 使用 BASH_LINENO 获取行号
debug() {
    echo "[DEBUG:${BASH_LINENO[0]}] $*" >&2
}

debug "变量值: my_var=$my_var"
```

### 8.2 常见陷阱与解决

```bash
#!/usr/bin/env bash

# ========== 陷阱1：变量未加引号 ==========
# 错误
file="my document.txt"
# rm $file    # 会删除 my 和 document.txt 两个文件！

# 正确
rm "$file"

# ========== 陷阱2：shellcheck 检查 ==========
# 安装 shellcheck
sudo apt install shellcheck

# 检查脚本
shellcheck myscript.sh

# ========== 陷阱3：管道中的 set -e ==========
# set -e 默认只检查管道最后一个命令
set -e
false | true     # 不会退出！因为 true 返回 0

# 使用 pipefail 解决
set -eo pipefail
false | true     # 会退出！false 返回非 0

# ========== 陷阱4：命令替换吞噬错误 ==========
# 错误：set -e 在命令替换中不生效
output=$(some_command)    # 如果 some_command 失败，脚本继续运行

# 解决：显式检查
if ! output=$(some_command); then
    echo "命令执行失败"
    exit 1
fi

# ========== 陷阱5：循环中的 set -e ==========
# set -e 在 while/until 条件中不生效
while false; do     # false 返回非 0，但脚本不会退出
    echo "这不会执行"
done
echo "但脚本继续运行"

# ========== 陷阱6：子 Shell 中的变量修改 ==========
count=0
echo "data" | while read line; do
    ((count++))     # 修改的是子 Shell 中的 count
done
echo "count=$count" # 0！
```

## 九、Shell 脚本执行流程

```mermaid
flowchart TD
    START["脚本启动"] --> SHEBANG["解析 Shebang\n确定解释器"]
    SHEBANG --> PARSE["语法解析\n词法分析"]
    PARSE -->|"语法错误"| SYNTAX_ERR["报错退出"]
    PARSE -->|"语法正确"| INIT["初始化环境\n设置变量/函数"]
    INIT --> EXEC["逐行执行"]

    EXEC --> CMD{"命令类型？"}

    CMD -->|"内置命令"| BUILTIN["Shell 内部执行\ncd/echo/export等"]
    CMD -->|"函数调用"| FUNC["执行函数体\n创建局部变量作用域"]
    CMD -->|"外部命令"| FORK["fork + exec\n创建子进程执行"]
    CMD -->|"控制结构"| CTRL["if/case/for/while\n根据条件跳转"]

    BUILTIN --> CHECK
    FUNC --> CHECK
    FORK --> WAIT["wait 等待子进程\n获取退出状态码"]
    CTRL --> EXEC
    WAIT --> CHECK

    CHECK{"检查退出码\n和 set 选项"}
    CHECK -->|"set -e 且失败"| EXIT_ERR["报错退出"]
    CHECK ->|"正常"| MORE{"还有更多命令？"}
    MORE -->|"是"| EXEC
    MORE -->|"否"| EXIT_OK["正常退出\nexit 0"]

    style START fill:#4CAF50,color:#fff
    style SYNTAX_ERR fill:#f44336,color:#fff
    style EXIT_ERR fill:#f44336,color:#fff
    style EXIT_OK fill:#2196F3,color:#fff
```

## 十、实战脚本

### 10.1 自动备份脚本

```bash
#!/usr/bin/env bash
# ========================================
# 自动备份脚本
# 功能：备份指定目录到远程服务器
# ========================================

set -euo pipefail

# ========== 配置 ==========
BACKUP_SOURCES=("/etc" "/home" "/opt/myapp")
BACKUP_DIR="/backup"
REMOTE_HOST="backup.example.com"
REMOTE_USER="backup"
REMOTE_DIR="/data/backups/$(hostname)"
RETENTION_DAYS=30
LOG_FILE="/var/log/backup.log"

# ========== 日志函数 ==========
log() {
    local level="$1"
    shift
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $*" | tee -a "$LOG_FILE"
}

# ========== 前置检查 ==========
preflight_check() {
    # 检查必要命令
    for cmd in rsync ssh; do
        if ! command -v "$cmd" &>/dev/null; then
            log ERROR "必要命令未安装: $cmd"
            exit 1
        fi
    done

    # 检查备份目录
    mkdir -p "$BACKUP_DIR"

    # 检查磁盘空间（至少需要 1GB）
    local available
    available=$(df "$BACKUP_DIR" | awk 'NR==2 {print $4}')
    if (( available < 1048576 )); then
        log ERROR "磁盘空间不足: ${available}KB"
        exit 1
    fi

    # 检查远程连接
    if ! ssh -o ConnectTimeout=5 "${REMOTE_USER}@${REMOTE_HOST}" true 2>/dev/null; then
        log ERROR "无法连接远程服务器: ${REMOTE_HOST}"
        exit 1
    fi

    log INFO "前置检查通过"
}

# ========== 执行备份 ==========
do_backup() {
    local timestamp
    timestamp=$(date '+%Y%m%d_%H%M%S')
    local backup_name="backup_${timestamp}"

    log INFO "开始备份: $backup_name"

    for source in "${BACKUP_SOURCES[@]}"; do
        if [[ ! -e "$source" ]]; then
            log WARN "源目录不存在，跳过: $source"
            continue
        fi

        local source_name
        source_name=$(echo "$source" | tr '/' '_' | sed 's/^_//')

        log INFO "备份: $source"

        # 使用 rsync 增量备份
        if rsync -az --delete \
            --exclude='*.tmp' \
            --exclude='*.log' \
            --exclude='.git' \
            "$source" "${BACKUP_DIR}/${source_name}/"; then
            log INFO "本地备份完成: $source"
        else
            log ERROR "本地备份失败: $source"
            return 1
        fi
    done

    # 创建压缩归档
    local archive="${BACKUP_DIR}/${backup_name}.tar.gz"
    log INFO "创建归档: $archive"

    tar czf "$archive" -C "$BACKUP_DIR" \
        --exclude='*.tar.gz' \
        .

    log INFO "归档完成: $(du -sh "$archive" | cut -f1)"

    # 传输到远程
    log INFO "传输到远程服务器..."
    if rsync -az "$archive" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"; then
        log INFO "远程传输完成"
    else
        log ERROR "远程传输失败"
        return 1
    fi

    # 清理本地归档（保留最近3天）
    find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +3 -delete
    log INFO "本地归档清理完成"

    # 清理远程归档
    ssh "${REMOTE_USER}@${REMOTE_HOST}" \
        "find '${REMOTE_DIR}' -name 'backup_*.tar.gz' -mtime +${RETENTION_DAYS} -delete"
    log INFO "远程归档清理完成（保留 ${RETENTION_DAYS} 天）"
}

# ========== 主流程 ==========
main() {
    log INFO "===== 备份任务开始 ====="
    preflight_check
    do_backup
    log INFO "===== 备份任务完成 ====="
}

main "$@"
```

### 10.2 系统监控脚本

```bash
#!/usr/bin/env bash
# ========================================
# 系统监控脚本
# 功能：监控 CPU/内存/磁盘/网络/进程，异常时告警
# ========================================

set -euo pipefail

# ========== 配置 ==========
CPU_THRESHOLD=80          # CPU 使用率阈值 %
MEM_THRESHOLD=85          # 内存使用率阈值 %
DISK_THRESHOLD=80         # 磁盘使用率阈值 %
LOAD_THRESHOLD=$(nproc)   # 负载阈值（= CPU 核心数）
ZOMBIE_THRESHOLD=5        # 僵尸进程数阈值
ALERT_LOG="/var/log/system_monitor.log"

# ========== 工具函数 ==========
log() {
    local level="$1"
    shift
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $*" | tee -a "$ALERT_LOG"
}

send_alert() {
    local subject="[ALERT] $(hostname): $1"
    local body="$2"
    log ALERT "$subject - $body"
    # 可集成邮件/webhook 等通知
}

# ========== CPU 监控 ==========
check_cpu() {
    # 取 1 秒内的平均 CPU 使用率
    local cpu_idle
    cpu_idle=$(top -b -n 1 | awk 'NR==3 {print $8}')
    cpu_idle=${cpu_idle%.*}    # 取整
    local cpu_used=$((100 - cpu_idle))

    if (( cpu_used >= CPU_THRESHOLD )); then
        # 获取 CPU 占用 TOP 5
        local top_procs
        top_procs=$(ps -eo pid,user,%cpu,comm --sort=-%cpu | head -6)
        send_alert "CPU 使用率 ${cpu_used}%" "TOP进程:\n$top_procs"
        return 1
    fi

    log INFO "CPU 使用率: ${cpu_used}% (阈值 ${CPU_THRESHOLD}%)"
    return 0
}

# ========== 内存监控 ==========
check_memory() {
    local mem_total mem_used mem_percent
    mem_total=$(free | awk '/^Mem:/ {print $2}')
    mem_used=$(free | awk '/^Mem:/ {print $3}')
    mem_percent=$((mem_used * 100 / mem_total))

    if (( mem_percent >= MEM_THRESHOLD )); then
        local top_procs
        top_procs=$(ps -eo pid,user,%mem,rss,comm --sort=-%mem | head -6)
        send_alert "内存使用率 ${mem_percent}%" "TOP进程:\n$top_procs"
        return 1
    fi

    log INFO "内存使用率: ${mem_percent}% (阈值 ${MEM_THRESHOLD}%)"
    return 0
}

# ========== 磁盘监控 ==========
check_disk() {
    local has_alert=false

    while read -r line; do
        local usage
        usage=$(echo "$line" | awk '{print $5}' | tr -d '%')
        local mount
        mount=$(echo "$line" | awk '{print $6}')

        if (( usage >= DISK_THRESHOLD )); then
            send_alert "磁盘使用率 ${usage}%" "挂载点: $mount"
            has_alert=true
        fi
    done < <(df -h | grep '^/dev')

    if ! $has_alert; then
        log INFO "磁盘使用率正常 (阈值 ${DISK_THRESHOLD}%)"
    fi
}

# ========== 负载监控 ==========
check_load() {
    local load1
    load1=$(awk '{print $1}' /proc/loadavg | cut -d. -f1)

    if (( load1 >= LOAD_THRESHOLD )); then
        local load_avg
        load_avg=$(cat /proc/loadavg | awk '{print $1, $2, $3}')
        send_alert "系统负载 ${load_avg}" "CPU核心数: $(nproc)"
        return 1
    fi

    log INFO "系统负载正常: $(cat /proc/loadavg | awk '{print $1, $2, $3}')"
    return 0
}

# ========== 僵尸进程监控 ==========
check_zombie() {
    local zombie_count
    zombie_count=$(ps ax -o stat= | grep -c "^Z" || true)

    if (( zombie_count >= ZOMBIE_THRESHOLD )); then
        send_alert "僵尸进程数 ${zombie_count}" "阈值: ${ZOMBIE_THRESHOLD}"
        return 1
    fi

    log INFO "僵尸进程数: ${zombie_count}"
    return 0
}

# ========== 主流程 ==========
main() {
    log INFO "===== 系统监控检查 ====="
    check_cpu
    check_memory
    check_disk
    check_load
    check_zombie
    log INFO "===== 监控检查完成 ====="
}

main "$@"
```

### 10.3 自动部署脚本

```bash
#!/usr/bin/env bash
# ========================================
# 自动部署脚本
# 功能：拉取代码 → 构建 → 部署 → 健康检查
# ========================================

set -euo pipefail

# ========== 配置 ==========
APP_NAME="myapp"
DEPLOY_DIR="/opt/${APP_NAME}"
REPO_URL="https://github.com/example/myapp.git"
BRANCH="main"
BACKUP_DIR="/opt/backups/${APP_NAME}"
HEALTH_URL="http://localhost:8080/health"
HEALTH_TIMEOUT=30

# ========== 颜色输出 ==========
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*" >&2; }

# ========== 步骤1：备份当前版本 ==========
backup_current() {
    if [[ ! -d "$DEPLOY_DIR" ]]; then
        warn "部署目录不存在，跳过备份"
        return 0
    fi

    local timestamp
    timestamp=$(date '+%Y%m%d_%H%M%S')
    local backup_path="${BACKUP_DIR}/${APP_NAME}_${timestamp}"

    info "备份当前版本到 $backup_path"
    mkdir -p "$BACKUP_DIR"
    cp -a "$DEPLOY_DIR" "$backup_path"

    # 只保留最近 5 个备份
    ls -dt "${BACKUP_DIR}/${APP_NAME}"_* | tail -n +6 | xargs rm -rf

    info "备份完成"
}

# ========== 步骤2：拉取代码 ==========
pull_code() {
    info "拉取代码: $REPO_URL ($BRANCH)"

    if [[ -d "${DEPLOY_DIR}/.git" ]]; then
        # 已有仓库，拉取更新
        cd "$DEPLOY_DIR"
        git fetch origin "$BRANCH"
        git reset --hard "origin/${BRANCH}"
    else
        # 新部署，克隆仓库
        mkdir -p "$(dirname "$DEPLOY_DIR")"
        git clone -b "$BRANCH" "$REPO_URL" "$DEPLOY_DIR"
        cd "$DEPLOY_DIR"
    fi

    local commit_hash
    commit_hash=$(git rev-parse --short HEAD)
    info "当前版本: $commit_hash"
}

# ========== 步骤3：构建 ==========
build() {
    info "开始构建..."
    cd "$DEPLOY_DIR"

    # 安装依赖
    if [[ -f "package.json" ]]; then
        npm install --production
    elif [[ -f "requirements.txt" ]]; then
        pip install -r requirements.txt
    elif [[ -f "go.mod" ]]; then
        go build -o "${APP_NAME}" .
    elif [[ -f "pom.xml" ]]; then
        mvn package -DskipTests
    fi

    info "构建完成"
}

# ========== 步骤4：部署 ==========
deploy() {
    info "停止旧服务..."
    systemctl stop "$APP_NAME" 2>/dev/null || true

    info "启动新服务..."
    systemctl start "$APP_NAME"

    info "服务已启动"
}

# ========== 步骤5：健康检查 ==========
health_check() {
    info "等待服务就绪（超时 ${HEALTH_TIMEOUT}s）..."

    local elapsed=0
    while (( elapsed < HEALTH_TIMEOUT )); do
        if curl -sf "$HEALTH_URL" > /dev/null 2>&1; then
            info "健康检查通过！"
            return 0
        fi
        sleep 2
        ((elapsed += 2))
        echo -n "."
    done

    echo ""
    error "健康检查失败！服务可能未正常启动"

    # 显示最近的日志
    error "最近的日志:"
    journalctl -u "$APP_NAME" -n 20 --no-pager >&2

    # 询问是否回滚
    read -rp "是否回滚到上一版本？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rollback
    fi

    return 1
}

# ========== 回滚 ==========
rollback() {
    warn "执行回滚..."

    systemctl stop "$APP_NAME" 2>/dev/null || true

    # 找到最近的备份
    local latest_backup
    latest_backup=$(ls -dt "${BACKUP_DIR}/${APP_NAME}"_* | head -1)

    if [[ -z "$latest_backup" ]]; then
        error "没有可用的备份"
        exit 1
    fi

    warn "回滚到: $latest_backup"
    rm -rf "$DEPLOY_DIR"
    cp -a "$latest_backup" "$DEPLOY_DIR"

    systemctl start "$APP_NAME"
    info "回滚完成"
}

# ========== 主流程 ==========
main() {
    info "===== 部署开始 ====="
    backup_current
    pull_code
    build
    deploy
    health_check
    info "===== 部署完成 ====="
}

main "$@"
```

## 总结

```mermaid
mindmap
  root((Shell 脚本编程))
    基础语法
      Shebang
      变量与引号
      特殊变量
      作用域
    条件测试
      文件测试
      字符串测试
      数值比较
      [[ ]] vs [ ]
    流程控制
      if/elif/else
      case
      for
      while/until
      break/continue
    函数
      定义与调用
      参数传递
      返回值
      局部变量
    数据处理
      索引数组
      关联数组
      字符串截取
      字符串替换
    I/O
      Here Document
      重定向
      管道
      进程替换
    调试
      set -x/-e/-u
      shellcheck
      常见陷阱
    实战
      备份脚本
      监控脚本
      部署脚本
```

::: info 参考书籍
- 《Linux 命令行与 Shell 脚本编程大全》（第四版）：Richard Blum / Christine Bresnahan
- 《Advanced Bash-Scripting Guide》：Mendel Cooper
- 《Shell 脚本专家指南》：Ron Peters
- Bash 官方手册：`man bash`
:::
