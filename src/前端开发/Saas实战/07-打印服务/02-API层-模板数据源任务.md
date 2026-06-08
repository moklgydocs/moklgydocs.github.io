# 02 - API 层：模板、数据源、任务

> **这一步解决什么问题？** 我们要实现打印服务与后端通信的桥梁——API 层。三个 API 模块分别对应模板、数据源、任务三个后端 Controller。模板 API 最复杂，包含文件上传下载和状态流转；任务 API 最特殊，需要区分同步和异步两种渲染模式。

---

## 开篇引导

上一步我们搭建了路由和 HTTP 客户端。现在进入**最核心的 API 层** —— 它是页面和后端之间的桥梁。

在 ASP.NET Core 中，我们习惯定义 `IService` 接口来封装数据访问。在 React 项目中，API 层扮演同样的角色：

```
ASP.NET Core:                  React:
IService (接口)                 api/*.ts (对象)
├── GetListAsync()              ├── list()
├── GetByIdAsync()              ├── detail()
├── CreateAsync()               ├── create()
├── UpdateAsync()               ├── update()
└── DeleteAsync()               └── delete()
```

> **关键区别**：ASP.NET Core 的 Service 注入 DI 容器，通过构造函数注入使用；React 的 API 对象是**普通 ES Module 导出**，直接 `import { templatesApi } from "@/api/print/templates"` 使用 —— 更像静态工具类（`static class`）。

> **🤔 导师提问**：既然 React 的 API 对象类似 C# 的 `static class`，那它有没有和 static class 一样的"测试困难"问题？在 ASP.NET Core 中，我们可以用 `Moq` 替换 IService 来做单元测试。在 React 中，如果要 mock `templatesApi.list()` 来测试页面组件，你会用什么方式？（提示：考虑 `vi.mock` 或依赖注入模式）

打印服务有三个 API 模块，对应三个后端 Controller：

```
api/print/
├── templates.ts    → PrintTemplatesController（模板生命周期）
├── datasources.ts  → DataSourcesController（数据源配置）
└── jobs.ts         → PrintJobsController（渲染任务）
```

> **🤔 导师提问**：在 ASP.NET Core 中，三个 Controller 三个 Service 是常见分法。但在 React 中，这三个 API 模块是普通 ES Module 导出的对象，没有 DI 容器管理它们的生命周期。想想看：如果 `templatesApi` 需要依赖 `datasourcesApi` 的某些方法（比如导入模板时自动关联数据源），你会如何组织这种跨模块依赖？还能像后端那样通过构造函数注入吗？

---

## 概念讲解

### 1. 模板 API — 最复杂的生命周期

模板不是简单的 CRUD，它有一套**状态机**：

```
        创建                发布                归档
  [草稿] ────→ [草稿] ────→ [已发布] ────→ [已归档]
                  │                         ↑
                  └───── 删除（软删除）───────┘
```

此外还有**导入导出**操作 —— 模板是 `.frx` 文件，不能像普通 JSON 一样传输：

- **导入**：`multipart/form-data` 上传 .frx 文件
- **导出**：`responseType: "blob"` 下载 .frx 文件

> **🤔 导师提问**：模板导入用 `multipart/form-data`，导出用 `responseType: "blob"`。回顾一下 ASP.NET Core 中的 `[Consumes("multipart/form-data")]` 和 `File()` 返回值 —— 前后端在文件传输这件事上，协议层是完全对应的。你能说出 `instance.post` 和封装的 `post` 方法在处理文件上传时的关键差异吗？为什么文件上传不能用封装的 `post`？

### 2. 数据源 API — 四种类型，动态字段

数据源支持 JSON / HTTP API / Database / XML 四种类型，每种类型的配置字段完全不同：

```
            JSON          HTTP API       Database        XML
          ┌────────┐   ┌──────────┐   ┌───────────┐   ┌──────────┐
  专属字段 │ Schema │   │ URL      │   │ Provider  │   │ RootElem │
          │        │   │ Method   │   │ ConnStr   │   │ Schema   │
          │        │   │ Headers  │   │ Query     │   │          │
          │        │   │ AuthType │   │           │   │          │
          └────────┘   └──────────┘   └───────────┘   └──────────┘
  通用字段 │ name, code, description, type, parameterDefinitions │
```

> 这意味着**创建/编辑数据源时，表单字段要根据类型动态渲染** —— 我们在步骤 4 的页面中会看到如何处理。

> **🤔 导师提问**：`datasourcesApi` 的 `previewData` 方法返回类型是 `unknown`，因为不同数据源返回结构完全不同。在 ASP.NET Core 中，你会用泛型方法 `Task<T> PreviewData<T>()` 来解决。但前端 API 层为什么没有用泛型？想想看，泛型要求调用方在编译时就知道返回类型 —— 前端在运行时才知道数据源类型，这和后端有什么不同？

### 3. 任务 API — 同步 vs 异步渲染

报表渲染有两种模式，这是打印服务最独特的设计：

```
同步模式：  前端发请求 ──→ 后端渲染 ──→ 返回 Blob 文件 ──→ 前端下载/预览
            (适合简单报表，<10s)

异步模式：  前端发请求 ──→ 后端返回 { jobId, status } ──→ 前端轮询状态
            ──→ 渲染完成 ──→ 站内通知 ──→ 前端下载
            (适合复杂报表，可能 >30s)
```

> **ASP.NET Core 类比**：同步模式类似 `await service.RenderAsync()` 直接返回结果；异步模式类似 `Task.Run()` + `IJobQueue`，前端通过 `IHubContext<NotificationHub>` 通知。

> **🤔 导师提问**：`jobsApi.render()` 方法用一个 `async` 参数决定走同步还是异步路径，返回类型也因此不同（Blob vs `{ jobId, status }`）。在 C# 中，这种"一个方法两种返回类型"通常用方法重载或泛型解决。TypeScript 没有运行时方法重载 —— 你觉得当前的设计是否应该拆成 `renderSync()` 和 `renderAsync()` 两个方法？各有什么利弊？

---

## 完整代码

### templates.ts

以下代码来自 `AdminWeb/src/api/print/templates.ts`：

```tsx
import { get, post, put, del, default as instance } from "./http"
import type {
  ReportTemplateListDto,
  ReportTemplateDetailDto,
  CreateTemplateInput,
  UpdateTemplateInput,
} from "@/types"

/** 报表模板 API，用于管理打印报表模板的完整生命周期 */
export const templatesApi = {
  /**
   * 查询报表模板列表（分页）
   * @param params 查询参数
   * @param params.keyword 搜索关键词
   * @param params.category 模板分类筛选
   * @param params.status 模板状态筛选
   * @param params.skipCount 跳过条数
   * @param params.maxResultCount 每页最大条数
   */
  list(params: {
    keyword?: string
    category?: string
    status?: number
    skipCount?: number
    maxResultCount?: number
  }) {
    return get<{ items: ReportTemplateListDto[]; totalCount: number }>(
      "/api/print/templates",
      params as Record<string, unknown>
    )
  },

  /**
   * 获取模板详情（含 FrxContent 模板文件内容）
   * @param id 模板 ID
   */
  detail(id: string) {
    return get<ReportTemplateDetailDto>(`/api/print/templates/${id}`)
  },

  /**
   * 创建报表模板
   * @param data 模板创建请求数据
   */
  create(data: CreateTemplateInput) {
    return post<ReportTemplateDetailDto>("/api/print/templates", data)
  },

  /**
   * 更新模板元数据（名称、描述、分类等）
   * @param id 模板 ID
   * @param data 模板更新请求数据
   */
  update(id: string, data: UpdateTemplateInput) {
    return put<ReportTemplateDetailDto>(`/api/print/templates/${id}`, data)
  },

  /**
   * 删除模板（软删除）
   * @param id 模板 ID
   */
  delete(id: string) {
    return del<void>(`/api/print/templates/${id}`)
  },

  /**
   * 发布模板，使其可用于生成报表
   * @param id 模板 ID
   */
  publish(id: string) {
    return post<void>(`/api/print/templates/${id}/publish`)
  },

  /**
   * 归档模板，归档后不可用于生成报表
   * @param id 模板 ID
   */
  archive(id: string) {
    return post<void>(`/api/print/templates/${id}/archive`)
  },

  /**
   * 导入 .frx 模板文件（multipart/form-data 上传）
   * @param file FastReport .frx 模板文件
   */
  import(file: File) {
    const formData = new FormData()
    formData.append("file", file) // 将 .frx 文件追加到 FormData
    // 用 axios instance 直接发，支持 responseType
    return instance.post<ReportTemplateDetailDto>(
      "/api/print/templates/import",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    )
  },

  /**
   * 导出模板为 .frx 文件（Blob 下载）
   * @param id 模板 ID
   */
  exportFrx(id: string) {
    return instance.get(`/api/print/templates/${id}/export`, {
      responseType: "blob", // 以 Blob 方式接收 .frx 文件
    })
  },
}
```

### datasources.ts

以下代码来自 `AdminWeb/src/api/print/datasources.ts`：

```tsx
import { get, post, put, del } from "./http"
import type { DataSourceConfigDto, CreateDataSourceInput, UpdateDataSourceInput } from "@/types"

/** 数据源配置 API，用于管理报表打印服务的数据源连接 */
export const datasourcesApi = {
  /**
   * 查询数据源列表（分页）
   * @param params 查询参数
   * @param params.keyword 搜索关键词
   * @param params.type 数据源类型筛选
   * @param params.isActive 是否启用
   * @param params.skipCount 跳过条数
   * @param params.maxResultCount 每页最大条数
   */
  list(params: {
    keyword?: string
    type?: number
    isActive?: boolean
    skipCount?: number
    maxResultCount?: number
  }) {
    return get<{ items: DataSourceConfigDto[]; totalCount: number }>(
      "/api/print/datasources",
      params as Record<string, unknown>
    )
  },

  /**
   * 获取数据源详情
   * @param id 数据源 ID
   */
  detail(id: string) {
    return get<DataSourceConfigDto>(`/api/print/datasources/${id}`)
  },

  /**
   * 创建数据源
   * @param data 数据源创建请求数据
   */
  create(data: CreateDataSourceInput) {
    return post<DataSourceConfigDto>("/api/print/datasources", data)
  },

  /**
   * 更新数据源配置
   * @param id 数据源 ID
   * @param data 数据源更新请求数据
   */
  update(id: string, data: UpdateDataSourceInput) {
    return put<DataSourceConfigDto>(`/api/print/datasources/${id}`, data)
  },

  /**
   * 删除数据源
   * @param id 数据源 ID
   */
  delete(id: string) {
    return del<void>(`/api/print/datasources/${id}`)
  },

  /**
   * 测试数据源连接是否可用
   * @param id 数据源 ID
   * @returns 连接测试结果，包含是否成功和消息
   */
  testConnection(id: string) {
    return post<{ success: boolean; message: string }>(`/api/print/datasources/${id}/test`)
  },

  /**
   * 预览数据源数据（用于模板设计时查看字段和样本数据）
   * @param id 数据源 ID
   * @param parameters 查询参数（可选）
   */
  previewData(id: string, parameters?: Record<string, unknown>) {
    return post<unknown>(`/api/print/datasources/${id}/preview-data`, parameters ?? {})
  },
}
```

### jobs.ts

以下代码来自 `AdminWeb/src/api/print/jobs.ts`：

```tsx
import { get, post, default as instance } from "./http"
import type { PrintJobDto, RenderReportInput } from "@/types"

/** 打印任务 API，用于创建和管理报表渲染任务 */
export const jobsApi = {
  /**
   * 查询打印任务列表（分页）
   * @param params 查询参数
   * @param params.templateId 模板 ID 筛选
   * @param params.status 任务状态筛选
   * @param params.skipCount 跳过条数
   * @param params.maxResultCount 每页最大条数
   */
  list(params: {
    templateId?: string
    status?: number
    skipCount?: number
    maxResultCount?: number
  }) {
    return get<{ items: PrintJobDto[]; totalCount: number }>(
      "/api/print/jobs",
      params as Record<string, unknown>
    )
  },

  /**
   * 查询打印任务详情（可用于轮询异步任务状态）
   * @param id 任务 ID
   */
  detail(id: string) {
    return get<PrintJobDto>(`/api/print/jobs/${id}`)
  },

  /**
   * 渲染报表
   * - 同步模式（async=false/undefined）：直接返回文件流（Blob）
   * - 异步模式（async=true）：返回 jobId，后续通过 detail 轮询或 download 下载
   * @param input 渲染请求参数
   */
  render(input: RenderReportInput) {
    if (input.async) {
      // 异步模式：返回 { jobId, status }
      return post<{ jobId: string; status: number }>("/api/print/jobs/render", {
        ...input,
        async: true,
      })
    }
    // 同步模式：返回 blob 文件流
    return instance.post("/api/print/jobs/render", input, {
      responseType: "blob",
    })
  },

  /**
   * 下载异步渲染任务的结果文件
   * @param id 任务 ID
   */
  download(id: string) {
    return instance.get(`/api/print/jobs/${id}/download`, {
      responseType: "blob", // 以 Blob 方式接收文件
    })
  },
}
```

---

## 逐行解析

### templates.ts 关键行

| 行 | 代码 | 解析 |
|---|---|---|
| 1 | `import { ..., default as instance } from "./http"` | **【设计取舍】** 同时导入封装方法和原始实例。封装方法返回 `ApiResult<T>`，适合标准 CRUD；原始实例用于文件上传/下载等需要自定义配置的场景 |
| 27 | `params as Record<string, unknown>` | **【易错点】** TypeScript 类型断言。`get` 方法的第二个参数类型是 `Record<string, unknown>`，但我们的 `params` 有具体类型。这里断言是因为查询参数的值可能是 `string \| number \| undefined`，需要放宽为 `unknown` |
| 87-94 | `import(file: File) { ... FormData ... }` | **【易错点】** 文件上传不能用 `post` 封装方法！`post` 会设置 `Content-Type: application/json`，而文件上传需要 `multipart/form-data`。所以必须用原始 axios 实例 + 手动构建 FormData |
| 101-105 | `exportFrx(id: string) { ... responseType: "blob" ... }` | **【性能陷阱】** `responseType: "blob"` 让 axios 直接以 Blob 接收响应，而不是先转字符串再转 Blob。后者对大文件会造成内存峰值 |

### jobs.ts 关键行

| 行 | 代码 | 解析 |
|---|---|---|
| 40-52 | `render(input) { if (input.async) { ... } return instance.post(...) }` | **【设计取舍】** 同一个方法根据 `async` 参数走不同的代码路径。异步模式用封装的 `post`（返回 `ApiResult`），同步模式用原始 `instance.post`（返回 Blob）。这是 TypeScript 函数重载的替代方案 —— 用联合返回类型比函数重载更灵活 |
| 49-51 | `instance.post(..., { responseType: "blob" })` | 同步渲染返回的是二进制文件流。`responseType: "blob"` 确保 axios 不尝试 JSON 解析 |

### datasources.ts 关键行

| 行 | 代码 | 解析 |
|---|---|---|
| 66-68 | `testConnection(id: string)` | 返回 `{ success: boolean; message: string }`。类似 ASP.NET Core 的 `TryConnectAsync()` —— 先测试再保存，避免配置了错误连接字符串后才发现问题 |
| 75-77 | `previewData(id, parameters?)` | **【易错点】** 返回类型是 `unknown`，因为不同数据源返回的数据结构完全不同。JSON 类型返回数组，Database 类型返回 DataTable，XML 类型返回 XmlNode。前端只做 JSON 格式化展示 |

---

## 进阶思考

> **🔍 验证步骤**
>
> 1. 在浏览器 Console 中执行 `import("@/api/print/templates").then(m => console.log(Object.keys(m.templatesApi)))`，应输出 `['list', 'detail', 'create', 'update', 'delete', 'publish', 'archive', 'import', 'exportFrx']` 共 9 个方法
> 2. 执行 `import("@/api/print/datasources").then(m => console.log(Object.keys(m.datasourcesApi)))`，应输出 `['list', 'detail', 'create', 'update', 'delete', 'testConnection', 'previewData']` 共 7 个方法
> 3. 执行 `import("@/api/print/jobs").then(m => console.log(Object.keys(m.jobsApi)))`，应输出 `['list', 'detail', 'render', 'download']` 共 4 个方法
> 4. 在 Network 面板中筛选 `print-api`，调用 `templatesApi.list()` 后检查请求 URL 是否以 `/print-api/api/print/templates` 开头，确认 `createHttp` 的 baseURL 配置生效

1. **（概念）**：`templatesApi.import()` 为什么使用 `FormData` 而不是直接传 JSON？`Content-Type: multipart/form-data` 和 `application/json` 有什么区别？

2. **（推理）**：`jobsApi.render()` 方法根据 `async` 参数走不同代码路径，返回类型也不同（`ApiResult` vs `AxiosResponse<Blob>`）。如果将来要新增第三种模式（如 SSE 流式渲染），这个方法需要怎么改？是否应该拆成 `renderSync()` 和 `renderAsync()` 两个方法？

3. **（动手）**：`datasourcesApi.previewData()` 的返回类型是 `post<unknown>`。如果要在前端做类型安全的数据预览（比如根据数据源类型推断返回结构），你会如何改造这个 API？提示：考虑泛型 + 条件类型。

---

## 输出清单

| 文件 | 说明 |
|------|------|
| `src/api/print/http.ts` | 打印服务 HTTP 客户端（步骤 1 已创建） |
| `src/api/print/templates.ts` | 模板 API（CRUD + 发布/归档 + 导入/导出） |
| `src/api/print/datasources.ts` | 数据源 API（CRUD + 连接测试 + 数据预览） |
| `src/api/print/jobs.ts` | 任务 API（列表 + 渲染 + 下载） |

---

[← 上一节](01-模块概览与路由配置.md) | [下一节 →](03-类型系统定义.md)
