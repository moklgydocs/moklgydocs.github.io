# MCP Apps —— 通过 `ui://` 交付交互式 UI 资源

> 纯文本的工具输出，封顶了智能体能展示的东西。MCP Apps(SEP-1724,2026 年 1 月 26 日正式发布）让工具可以返回沙箱化的交互式 HTML，内联渲染在 Claude Desktop、ChatGPT、Cursor、Goose 和 VS Code 里。仪表盘、表单、地图、3D 场景，全靠这一个扩展。本课走完 `ui://` 资源 scheme、`text/html;profile=mcp-app` 这个 MIME、iframe 沙箱的 postMessage 协议，以及"让服务器渲染 HTML"所带来的安全面。

**类型：** Build
**编程语言：** Python（标准库，UI 资源发射器）、HTML（示例应用）
**前置要求：** 第 13 阶段 · 07(MCP 服务器）、第 13 阶段 · 10（资源）
**预计耗时：** 约 75 分钟

## 学习目标

- 从工具调用返回一个 `ui://` 资源，并设置正确的 MIME 和元数据
- 用 `_meta.ui.resourceUri`、`_meta.ui.csp` 和 `_meta.ui.permissions` 声明工具关联的 UI
- 实现 iframe 沙箱的 postMessage JSON-RPC，用于 UI 与宿主通信
- 应用能防御 UI 发起攻击的 CSP 和 permissions-policy 默认值

## 问题

2025 年时代的 `visualize_timeline` 工具只能返回"以下按时间顺序排列的 14 条笔记：……"——那是一段文字。用户真正想要的是可交互的时间线。MCP Apps 之前，选项只有：各客户端私有的 widget API(Claude artifacts、OpenAI Custom GPT HTML)，或者干脆没有 UI。

MCP Apps(SEP-1724,2026 年 1 月 26 日发布）把这份契约标准化了。工具结果里包含一个 URI 为 `ui://...`、MIME 为 `text/html;profile=mcp-app` 的 `resource`。宿主把它渲染进一个沙箱化 iframe,CSP 受限，除非显式授予否则无网络访问。iframe 里的 UI 通过一个极小的 postMessage JSON-RPC 方言与宿主通信。

每一个兼容客户端（Claude Desktop、ChatGPT、Goose、VS Code）都以同样的方式渲染同一个 `ui://` 资源。一个服务器，一个 HTML 包，全平台 UI。

## 概念

### `ui://` 资源 scheme

工具返回：

```json
{
  "content": [
    {"type": "text", "text": "Here is your notes timeline:"},
    {"type": "ui_resource", "uri": "ui://notes/timeline"}
  ],
  "_meta": {
    "ui": {
      "resourceUri": "ui://notes/timeline",
      "csp": {
        "defaultSrc": "'self'",
        "scriptSrc": "'self' 'unsafe-inline'",
        "connectSrc": "'self'"
      },
      "permissions": []
    }
  }
}
```

宿主随后对该 `ui://notes/timeline` URI 调 `resources/read`，拿回：

```json
{
  "contents": [{
    "uri": "ui://notes/timeline",
    "mimeType": "text/html;profile=mcp-app",
    "text": "<!doctype html>..."
  }]
}
```

### iframe 沙箱

宿主把 HTML 渲染进一个沙箱化 `<iframe>`:

- `sandbox="allow-scripts allow-same-origin"`（或按服务器声明更严）
- 服务器声明的 CSP 通过响应头应用。
- 没有 cookie，没有来自宿主 origin 的 localStorage。
- 网络访问被限制在 CSP 的 `connectSrc` 内。

### postMessage 协议

iframe 通过 `window.postMessage` 与宿主通信。一个极小的 JSON-RPC 2.0 方言：

永远把 `targetOrigin` 钉在对端的精确 origin 上；接收侧在处理任何载荷前，按白名单校验 `event.origin`。这条通道的两端都永远不要用 `"*"`——消息体里装的可是工具调用和资源读取。

```js
// iframe to host  (pin to host origin)
window.parent.postMessage({
  jsonrpc: "2.0",
  id: 1,
  method: "host.callTool",
  params: { name: "notes_update", arguments: { id: "note-14", title: "..." } }
}, "https://host.example.com");

// host to iframe  (pin to iframe origin)
iframe.contentWindow.postMessage({
  jsonrpc: "2.0",
  id: 1,
  result: { content: [...] }
}, "https://iframe.example.com");

// receiver on both sides
window.addEventListener("message", (event) => {
  if (event.origin !== "https://expected-peer.example.com") return;
  // safe to process event.data
});
```

UI 可调用的宿主侧方法：

- `host.callTool(name, arguments)` —— 调用一个服务器工具。
- `host.readResource(uri)` —— 读取一个 MCP 资源。
- `host.getPrompt(name, arguments)` —— 获取一个提示词模板。
- `host.close()` —— 关闭这个 UI。

每一次调用都仍走 MCP 协议，继承服务器的权限。

### 权限（Permissions)

`_meta.ui.permissions` 列表申请额外能力：

- `camera` —— 访问用户摄像头（扫文档类 UI 用）。
- `microphone` —— 语音输入。
- `geolocation` —— 位置。
- `network:*` —— 比 `connectSrc` 单独允许的更宽的网络访问。

每项权限都是 UI 渲染前用户会看到的一次询问。

### 安全风险

iframe 里的 HTML 终究是 HTML。新的攻击面：

- **经 UI 的提示词注入。** 恶意的服务器 UI 可以显示一段长得像系统消息的文本，骗过用户。宿主渲染时必须在视觉上把服务器 UI 和宿主 UI 区分开。
- **经 `connectSrc` 的外泄。** 如果 CSP 允许 `connect-src: *`,UI 可以把数据发到任何地方。默认值必须严格。
- **点击劫持。** UI 覆盖在宿主界面上层。宿主必须防止 z-index 操纵并强制不透明规则。
- **偷焦点。** UI 抢走键盘焦点，截获下一条消息。宿主必须拦截。

第 13 阶段 · 15 在 MCP 安全一章深挖这些；本课只做引入。

### `ui/initialize` 握手

iframe 加载完成后，通过 postMessage 发送 `ui/initialize`:

```json
{"jsonrpc": "2.0", "id": 0, "method": "ui/initialize",
 "params": {"theme": "dark", "locale": "en-US", "sessionId": "..."}}
```

宿主响应能力和一个会话令牌。UI 在之后每次宿主调用中都带上这个令牌。

### AppRenderer / AppFrame SDK 原语

ext-apps SDK 暴露两个便利原语：

- `AppRenderer`（服务器侧）—— 包装一个 React / Vue / Solid 组件，发出带正确 MIME 和元数据的 `ui://` 资源。
- `AppFrame`（客户端侧）—— 接收资源、挂载 iframe、中转 postMessage。

你可以用它们，也可以手写 HTML 和 JSON-RPC。

### 生态现状

MCP Apps 于 2026 年 1 月 26 日发布。截至 2026 年 4 月的客户端支持：

- **Claude Desktop。** 2026 年 1 月起完整支持。
- **ChatGPT。** 通过 Apps SDK 完整支持（底层就是同一个 MCP Apps 协议）。
- **Cursor。** Beta；在设置里开启。
- **VS Code。** 仅 Insider 构建。
- **Goose。** 完整支持。
- **Zed、Windsurf。** 在路线图上。

生产中的服务器：仪表盘、地图可视化、数据表格、图表构建器、沙箱 IDE 预览。

```figure
t3-ui-sandbox
```

## 投入使用

`code/main.py` 给笔记服务器加了一个返回 `ui://notes/timeline` 资源的 `visualize_timeline` 工具，外加该 URI 的 `resources/read` 处理器——返回一个小而全的 HTML 包，内含 SVG 时间线。HTML 用标准库模板生成，不用构建系统。postMessage 在 JS 注释里勾画（标准库没法驱动浏览器）。

要看的地方：

- 工具响应上的 `_meta.ui` 携带 resourceUri、CSP、permissions。
- HTML 在无网络访问下渲染；所有数据内联。
- JS 通过 `window.parent.postMessage` 调 `host.callTool`（有文档，但在这个标准库演示里是惰性的）。

## 交付

本课产出 `outputs/skill-mcp-apps-spec.md`。给它一个能受益于交互式 UI 的工具，这个 skill 产出完整的 MCP Apps 契约：`ui://` URI、CSP、权限、postMessage 入口点和一份安全检查清单。

## 练习

1. 跑 `code/main.py`，检查发出的 HTML。直接在浏览器里打开这个 HTML，验证 SVG 正常渲染。然后勾画 UI 调 `host.callTool("notes_update", ...)` 会用的 postMessage 契约。

2. 收紧 CSP：去掉 `'unsafe-inline'`，改用基于 nonce 的脚本策略。HTML 生成代码要改什么？

3. 加第二个 UI 资源 `ui://notes/editor`，带一个就地编辑笔记的表单。用户提交时，iframe 调用 `host.callTool("notes_update", ...)`。

4. 审计这个 UI 的攻击面。恶意服务器能在哪里注入内容？iframe 沙箱防住了什么、没防住什么？

5. 读 SEP-1724 规范，找出 MCP Apps SDK 里这个玩具实现没用上的一个能力。（提示：组件级状态同步。)

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|------------------------|
| MCP Apps | "交互式 UI 资源" | 2026-01-26 发布的 SEP-1724 扩展 |
| `ui://` | "应用 URI scheme" | UI 包的资源 scheme |
| `text/html;profile=mcp-app` | "那个 MIME" | MCP App HTML 的 content-type |
| iframe 沙箱 | "渲染容器" | 用 CSP 和权限对 UI 做的浏览器沙箱化 |
| postMessage JSON-RPC | "UI 到宿主的线" | 跑在 postMessage 上的极小 JSON-RPC 方言，用于宿主调用 |
| `_meta.ui` | "工具-UI 绑定" | 把工具结果和 UI 资源关联起来的元数据 |
| CSP | "内容安全策略" | 声明脚本、网络、样式的允许来源 |
| AppRenderer | "服务器 SDK 原语" | 把框架组件转成 `ui://` 资源 |
| AppFrame | "客户端 SDK 原语" | 挂载 iframe 并中转 postMessage 的帮手 |
| `ui/initialize` | "握手" | UI 发给宿主的第一条 postMessage |

## 延伸阅读

- [MCP ext-apps —— GitHub](https://github.com/modelcontextprotocol/ext-apps) —— 参考实现与 SDK
- [MCP Apps 规范 2026-01-26](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx) —— 正式规范文档
- [MCP —— Apps 扩展概览](https://modelcontextprotocol.io/extensions/apps/overview) —— 高层文档
- [MCP 博客 —— MCP Apps 发布](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/) —— 2026 年 1 月发布文章
- [MCP Apps API 参考](https://apps.extensions.modelcontextprotocol.io/api/) —— JSDoc 风格的 SDK 参考
