---
title: 08 · 错误处理 Result 与 ?
icon: fa6-solid:triangle-exclamation
order: 8
category:
  - Rust基础
tag:
  - Result
  - 错误处理
  - thiserror
  - anyhow
---

# 08 · 错误处理 Result 与 ?

## 一、【PM】为什么 Rust 没有 try/catch？

C# 用异常（exception）处理错误：`throw new Exception()`，调用栈展开，`try/catch` 捕获。这有几个问题：
- 异常是**不可见的**：函数签名没有写"我可能失败"，调用方容易忘记处理
- 异常有**性能开销**：栈展开、构造对象（虽然通常不是瓶颈）
- 区分"预期的业务错误"和"不可恢复的 bug"全靠约定

Rust 的答案：**错误是值**。

- `Result<T, E>`：可能失败的操作 → 返回类型强制调用方处理
- `panic!`：不可恢复的 bug（类似 C# 的 `InvalidOperationException` + `Debug.Assert`）
- `?` 运算符：自动传播错误，干净地替代 try/catch 的机械代码

---

## 二、【Arch】错误处理层次设计

```mermaid
flowchart TD
    A[调用底层 IO / 网络 / 数据库]
    A --> B{Result<T, E>}
    B -->|Ok(value)| C[继续处理]
    B -->|Err(e)| D{如何处理？}

    D -->|"可以恢复\n（文件不存在→用默认值）"| E["match/if let\nunwrap_or/unwrap_or_else"]
    D -->|"向上传播\n（让调用方决定）"| F["? 运算符\n自动 From 转换"]
    D -->|"不可恢复\n（程序 bug）"| G["panic!\nunwrap()\nexpect('说明')"]

    F --> H[函数签名声明 Result<T, MyError>]
    H --> I[thiserror：定义业务错误类型]
    H --> J[anyhow：脚本/main 快速错误处理]
```

---

## 三、【Dev】对比代码：C# vs Rust

### 场景 1：基本 Result 使用

```csharp
// C# — 用 bool+out 或抛异常
int.TryParse("42", out int result);   // TryParse 模式
int.Parse("not a number");            // 抛 FormatException

// C# 更常见：try/catch
try {
    var content = File.ReadAllText("config.txt");
    ProcessContent(content);
} catch (FileNotFoundException e) {
    Console.Error.WriteLine($"文件不存在：{e.FileName}");
} catch (Exception e) {
    Console.Error.WriteLine($"未知错误：{e.Message}");
}
```

```rust
// Rust — Result<T, E> 是普通枚举：Ok(value) 或 Err(error)
use std::num::ParseIntError;

// 基本解析（返回 Result）
let n: Result<i32, ParseIntError> = "42".parse::<i32>();
match n {
    Ok(num)  => println!("解析成功：{}", num),
    Err(e)   => println!("解析失败：{}", e),
}

// 读取文件（标准库函数都返回 Result）
use std::fs;
match fs::read_to_string("config.txt") {
    Ok(content) => println!("{}", content),
    Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
        eprintln!("文件不存在");
    }
    Err(e) => eprintln!("读取失败：{}", e),
}
```

### 场景 2：? 运算符——错误传播

```csharp
// C# — 手动传播（通常靠异常自动冒泡）
string ReadConfig(string path) {
    return File.ReadAllText(path);   // 异常自动往上抛
}
// 如果想转换错误类型：
MyError ParseConfig(string path) {
    try { return Parse(File.ReadAllText(path)); }
    catch (IOException e) { throw new MyError("读取失败", e); }
}
```

```rust
// Rust — ? 运算符：Err 时立即返回，Ok 时解包
use std::io;
use std::fs;

// ? 等同于：match result { Ok(v) => v, Err(e) => return Err(e.into()) }
fn read_config(path: &str) -> Result<String, io::Error> {
    let content = fs::read_to_string(path)?;   // Err 时直接 return Err(...)
    Ok(content.trim().to_string())
}

// 链式 ?（每步都可能失败）
fn parse_port(path: &str) -> Result<u16, Box<dyn std::error::Error>> {
    let content = fs::read_to_string(path)?;       // io::Error
    let port: u16 = content.trim().parse()?;       // ParseIntError
    Ok(port)
}
```

### 场景 3：thiserror——定义业务错误类型

```csharp
// C# — 自定义异常类
public class ConfigError : Exception {
    public ConfigError(string message, Exception inner = null)
        : base(message, inner) {}
}
```

```rust
// Rust — thiserror 自动生成样板代码
// Cargo.toml: thiserror = "1"
use thiserror::Error;

#[derive(Debug, Error)]
pub enum ConfigError {
    #[error("配置文件不存在：{path}")]
    NotFound { path: String },

    #[error("配置格式错误（第 {line} 行）：{message}")]
    ParseError { line: usize, message: String },

    #[error("IO 错误")]
    Io(#[from] std::io::Error),   // #[from] 自动实现 From<io::Error>，? 可用
}

// 返回自定义错误
fn load_config(path: &str) -> Result<String, ConfigError> {
    let content = std::fs::read_to_string(path)?;   // io::Error → ConfigError::Io（From）
    if content.is_empty() {
        return Err(ConfigError::ParseError {
            line: 1,
            message: "配置文件为空".to_string(),
        });
    }
    Ok(content)
}
```

### 场景 4：anyhow——应用层快速错误处理

```rust
// anyhow 适合：应用入口、脚本、main 函数，不需要精确区分错误类型时
// Cargo.toml: anyhow = "1"
use anyhow::{Context, Result, anyhow, bail};

fn main() -> Result<()> {   // anyhow::Result 是 Result<T, anyhow::Error> 的别名
    let content = std::fs::read_to_string("config.txt")
        .context("读取配置文件失败")?;   // context 添加额外说明，类比 C# Exception.Message

    let port: u16 = content.trim().parse()
        .context("端口号必须是 0-65535 的数字")?;

    if port < 1024 {
        bail!("端口 {} 是特权端口，需要 root 权限", port);
        // bail! 等同于 return Err(anyhow!(...))
    }

    println!("服务器将监听端口 {}", port);
    Ok(())
}

// anyhow::Error 保存完整的错误链，可以在日志中打印
// eprintln!("{:#}", err);   // 打印含完整链的错误信息
```

### 场景 5：panic! 的适用场景

```rust
// panic! 适合：程序 bug（不该发生的情况）
// 类比 C# 的 Debug.Assert + Environment.FailFast

// unwrap()：明确知道值不会是 None/Err 时（若出错 = 程序有 bug）
let config = init_config();   // 返回 Option<Config>
let host = config.unwrap();   // 如果 None → panic（应该在初始化阶段就失败）

// expect("说明")：带说明的 unwrap（bug 信息更清晰）
let val = some_option.expect("初始化时已保证非 None，出现 None 是 bug");

// 不要在业务逻辑中用 unwrap/expect（用 ? 传播给调用方处理）
// 不要用 panic! 处理外部输入错误（文件不存在、网络超时）
// ✅ 用 unwrap：测试代码中（测试失败就是期望的 panic）
// ✅ 用 unwrap：快速原型（之后再改为 ? 传播）
// ❌ 不用 unwrap：生产代码的业务路径

// unreachable!() / todo!() / unimplemented!()
fn process(state: State) {
    match state {
        State::Active => handle_active(),
        State::Closed => handle_closed(),
        _ => unreachable!("状态机不会进入此分支"),
    }
}
```

### 场景 6：Result 的常用方法

```rust
let result: Result<i32, &str> = Ok(42);

// map：对 Ok 值变换（类比 C# LINQ Select）
let doubled = result.map(|n| n * 2);    // Ok(84)

// map_err：对 Err 变换
let mapped = result.map_err(|e| format!("Error: {}", e));

// unwrap_or：Err 时用默认值（类比 C# ??)
let val = result.unwrap_or(0);

// unwrap_or_else：Err 时用闭包（延迟计算）
let val = result.unwrap_or_else(|e| { log_error(e); 0 });

// and_then：Ok 时继续链式操作（类比 C# LINQ SelectMany / 异步链）
let chained = "42"
    .parse::<i32>()                         // Result<i32, ParseIntError>
    .and_then(|n| if n > 0 { Ok(n) } else { Err("42".parse::<i32>().unwrap_err()) });

// collect：Vec<Result<T, E>> → Result<Vec<T>, E>
// 任一 Err 就整体 Err
let strings = vec!["1", "2", "3"];
let numbers: Result<Vec<i32>, _> = strings.iter().map(|s| s.parse::<i32>()).collect();
```

---

## 四、Rustlings 对应练习

```bash
rustlings watch exercises/error_handling/
```

| 练习文件 | 考察点 |
|---------|--------|
| `errors1.rs` | 返回 Option → 返回 Result |
| `errors2.rs` | `?` 运算符传播错误 |
| `errors3.rs` | main 函数返回 Result |
| `errors4.rs` | 自定义 Error 类型（From 实现）|
| `errors5.rs` | `Box<dyn Error>` 擦除错误类型 |
| `errors6.rs` | thiserror 等效写法 |

---

## 五、Rust by Example 速查

对应章节：[18. Error Handling](https://doc.rust-lang.org/rust-by-example/error.html)

---

## 六、【QA】常见错误

| 错误 | 来源 | 修复 |
|------|------|------|
| `cannot use ? in a function that returns ()` | 在返回 `()` 的函数中用 `?` | 改函数签名为 `-> Result<(), E>` 或 `-> anyhow::Result<()>` |
| `the trait From<X> is not implemented for Y` | `?` 用于不兼容的错误类型 | 实现 `From<X> for Y`，或用 `map_err(|e| Y::from(e))` |
| `called unwrap() on an Err value` | `unwrap()` 在 Err 上 | 用 `match` 正确处理 Err |
| `expected Result<T, E>, found Option<T>` | 混用 `?` 在不同返回类型的函数中 | `.ok_or(ErrorType::xxx)?` 将 Option 转 Result |

---

## 七、【QA】自测题

**Q1**：以下 ? 运算符的行为是什么？

```rust
fn parse_number(s: &str) -> Result<i32, std::num::ParseIntError> {
    let n = s.parse::<i32>()?;
    Ok(n * 2)
}
```

A. ? 等同于 unwrap()，失败时 panic  
B. 解析成功时继续执行，失败时立即从函数返回 `Err(e)`  
C. 总是返回 Ok  
D. ? 只能用于 Option，不能用于 Result

<details><summary>答案</summary>

**B**。`?` 展开后等同于：
```rust
let n = match s.parse::<i32>() {
    Ok(val) => val,
    Err(e)  => return Err(e.into()),   // 立即函数返回
};
```
成功时 n 得到解析值，失败时整个函数返回 Err。它不 panic（那是 unwrap 的行为）。

</details>

**Q2**：`thiserror` 和 `anyhow` 各适合什么场景？

A. thiserror 用于库，anyhow 用于应用  
B. thiserror 用于应用，anyhow 用于库  
C. 两者完全等价，随便选  
D. anyhow 性能更好，所有场景都用 anyhow

<details><summary>答案</summary>

**A**。
- **库（lib crate）**：用 `thiserror` 定义精确的错误枚举，让库的使用者能够 `match` 具体错误类型。库不应该用 `anyhow`（隐藏错误类型信息）。
- **应用（bin crate / 脚本 / `main`）**：用 `anyhow` 快速收集所有错误，`context()` 添加说明，`{:#}` 打印完整错误链。应用只需要最终告诉用户什么出错了，不需要精确 match 每种错误。

</details>

**Q3**：什么情况下用 `panic!` / `unwrap()` 是合理的？

A. 永远不应该用，所有错误都应该用 Result  
B. 当错误**确实是程序 bug**（不是外部输入）时，且无法从中恢复  
C. 当你懒得处理错误时  
D. 只在测试代码中可以用

<details><summary>答案</summary>

**B**（同时 D 补充也是合理的）。合理的 panic/unwrap 场景：
1. 程序不变量被破坏（"这个状态在正确代码中不可能出现"）
2. 测试代码（用 `unwrap()` 让测试在错误时明确 panic）
3. `main` 函数的初始化阶段（数据库连不上就应该直接退出，不是"优雅处理"）
4. 快速原型（之后系统化替换为 ? 传播）
不合理：处理用户输入、文件 IO、网络请求等**外部来源**的错误。

</details>
