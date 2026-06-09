# 文件API层

[← 上一篇：文件服务架构](01-文件服务架构.md) | [下一篇：文件管理器 →](03-文件管理器.md)

---

> **这一步解决什么问题？** 架构搞清楚了，现在要建起前端与后端之间的"管道"。类比 ASP.NET Core 中你在 Controller 里注入 `HttpClient` 调用微服务，这里我们需要一个类型安全的 HTTP 客户端层，封装所有文件服务的 API 调用。⚠️ 文件服务的 API 比之前权限中心和网关都复杂——它涉及**文件上传（二进制流）、分片上传、Blob 下载、预签名 URL**等特殊场景，不能简单用 `get/post/put/del` 四个方法搞定。

## 前置知识

- 01 篇文件服务架构：`createHttp("/file-api")` 工厂函数、存储后端概念、配额和访问控制模型
- ASP.NET Core `IHttpClientFactory` 的命名客户端模式：每个模块一个 HTTP 客户端实例，隔离 baseURL 和拦截器配置
- axios 拦截器基础：请求拦截（加 Token）、响应拦截（401 刷新）

---

## 为什么先写 API 层？

后端开发者常犯的错误是"先写页面，遇到 API 调用再临时加"。这就像先写 Razor 页面再去定义 Service 接口——页面会充斥着零散的 `fetch` 调用，改一个接口要翻遍所有组件。

API 层是**契约**，先定义契约，页面的数据流才有章法。

> **🤔 导师提问**：你在 ASP.NET Core 中习惯先定义 Service 接口再写 Controller，这里的 API 层和 Service 接口有什么异同？如果跳过 API 层直接在组件里写 `fetch`，会出现什么问题？

---

## HTTP 客户端

来源：`src/api/file/http.ts`

```typescript
// FileService 模块 HTTP 客户端
// 代理路径：/file-api/* → http://moklgy.me:10004/*
import { createHttp } from "@/lib/create-http"

/** 文件服务 HTTP 客户端，基础路径为 /file-api */
const fileHttp = createHttp("/file-api")

/** 导出常用 HTTP 方法 */
export const { get, post, put, del } = fileHttp
/** 导出 axios 实例，供需要自定义配置（如 responseType、onUploadProgress）的场景使用 */
export default fileHttp.instance
```

逐行讲解：

- **`createHttp("/file-api")`**：工厂函数创建带 baseURL 的 axios 实例。类比 ASP.NET Core 的 `IHttpClientFactory.CreateClient("FileService")`。【设计取舍】每个模块一个 HTTP 客户端，而非全局共享，是为了隔离 baseURL 和拦截器配置。
- **`export const { get, post, put, del } = fileHttp`**：解构导出简化方法，用于常规 JSON 请求。
- **`export default fileHttp.instance`**：导出原始 axios 实例，用于**需要自定义配置**的场景——文件上传需要 `onUploadProgress`，文件下载需要 `responseType: "blob"`。

> **🤔 导师提问**：`createHttp("/file-api")` 类比 ASP.NET Core 的 `IHttpClientFactory.CreateClient("FileService")`。后端中你用命名客户端隔离不同服务的 baseURL 和拦截器，前端这里每个模块一个 HTTP 客户端，如果改成全局共享一个 axios 实例，会遇到什么问题？

---

## 文件操作 API

来源：`src/api/file/files.ts`

```typescript
import { get, post, put, del } from "./http"
import fileHttpInstance from "./http"
import type {
  ApiResult,
  FileObjectDto,
  UploadFileResponse,
  InstantUploadRequest,
  FileListParams,
  PagedResult,
  BatchOperationResult,
} from "@/types"

/**
 * FileService 后端使用自定义 PagedResult，字段名与前端标准不同：
 *   后端: { items, total, pageIndex, pageSize }
 *   前端: { items, totalCount, page, pageSize }
 * 此函数将后端响应映射为前端标准格式。
 */
function normalizePagedResult<T>(
  res: ApiResult<{ items: T[]; total: number; pageIndex: number; pageSize: number }>
): ApiResult<PagedResult<T>> {
  if (!res.data) return res as unknown as ApiResult<PagedResult<T>>
  return {
    ...res,
    data: {
      items: res.data.items,
      totalCount: res.data.total,
      page: res.data.pageIndex,
      pageSize: res.data.pageSize,
    },
  }
}

/** 文件操作 API */
export const filesApi = {
  /** 分页查询文件列表 */
  async list(params: FileListParams) {
    const res = await get<{ items: FileObjectDto[]; total: number; pageIndex: number; pageSize: number }>(
      "/api/files", params as Record<string, unknown>
    )
    return normalizePagedResult(res)
  },

  /** 获取单文件详情 */
  detail(fileId: string) {
    return get<FileObjectDto>(`/api/files/${fileId}`)
  },

  /** 秒传检测——根据文件哈希判断是否已存在相同文件 */
  async instantUpload(data: InstantUploadRequest) {
    try {
      return await post<UploadFileResponse>("/api/files/instant-upload", data)
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 404) {
        return { success: false, code: 404, message: "未命中秒传", data: null as unknown as UploadFileResponse }
      }
      throw err
    }
  },

  /** 上传文件（multipart/form-data），支持进度回调 */
  upload(
    file: File,
    options?: {
      accessLevel?: number
      folderId?: string
      tag?: string
      externalRef?: string
      onUploadProgress?: (percent: number) => void
    }
  ) {
    const formData = new FormData()
    formData.append("file", file)

    const params: Record<string, string> = {}
    if (options?.accessLevel !== undefined) {
      params.accessLevel = String(options.accessLevel)
    }
    if (options?.folderId) params.folderId = options.folderId
    if (options?.tag) params.tag = options.tag
    if (options?.externalRef) params.externalRef = options.externalRef

    return fileHttpInstance.post<{ code: number; success: boolean; message: string; data: UploadFileResponse }>(
      "/api/files/upload",
      formData,
      {
        params: Object.keys(params).length > 0 ? params : undefined,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (options?.onUploadProgress && evt.total) {
            const percent = Math.round((evt.loaded / evt.total) * 100)
            options.onUploadProgress(percent)
          }
        },
      }
    )
  },

  /** 重命名文件 */
  rename(fileId: string, newDisplayName: string) {
    return put<void>(`/api/files/${fileId}/rename`, { newDisplayName })
  },

  /** 移动文件到指定文件夹 */
  move(fileId: string, targetFolderId: string | null) {
    return put<void>(`/api/files/${fileId}/move`, { targetFolderId })
  },

  /** 删除文件（移入回收站） */
  delete(fileId: string) {
    return del<void>(`/api/files/${fileId}`)
  },

  /** 批量删除文件（移入回收站） */
  batchDelete(fileIds: string[]) {
    return post<BatchOperationResult>("/api/files/batch-delete", { fileIds })
  },

  /** 批量移动文件 */
  batchMove(fileIds: string[], targetFolderId: string | null) {
    return post<BatchOperationResult>("/api/files/batch-move", { fileIds, targetFolderId })
  },

  /** 打包下载多个文件为 ZIP */
  packageDownload(fileIds: string[], zipFileName?: string) {
    return fileHttpInstance.post(
      "/api/files/package",
      { fileIds, zipFileName },
      { responseType: "blob" }
    )
  },

  /** 下载单文件（blob 方式，适用于小文件） */
  download(fileId: string) {
    return fileHttpInstance.get(`/api/files/${fileId}/download`, {
      responseType: "blob",
    })
  },

  /** 获取预签名下载 URL（适用于大文件，浏览器直接从存储后端下载） */
  getPresignedDownloadUrl(fileId: string) {
    return get<{ url: string }>(`/api/files/${fileId}/url`)
  },

  /** 获取回收站文件列表（分页） */
  async recycleBin(params: { pageIndex?: number; pageSize?: number; fileName?: string }) {
    const res = await get<{ items: FileObjectDto[]; total: number; pageIndex: number; pageSize: number }>(
      "/api/files/recycle-bin", params as Record<string, unknown>
    )
    return normalizePagedResult(res)
  },

  /** 从回收站恢复文件 */
  restore(fileId: string) {
    return post<void>(`/api/files/${fileId}/restore`)
  },

  /** 永久删除文件（不可恢复） */
  purge(fileId: string) {
    return del<void>(`/api/files/${fileId}/purge`)
  },

  /** 批量从回收站恢复文件 */
  batchRestore(fileIds: string[]) {
    return post<BatchOperationResult>("/api/files/recycle-bin/batch-restore", { fileIds })
  },

  /** 批量永久删除回收站文件（不可恢复） */
  batchPurge(fileIds: string[]) {
    return del<BatchOperationResult>("/api/files/recycle-bin/batch-purge", { data: { fileIds } })
  },
}
```

> **🤔 导师提问**：`filesApi.upload` 使用 `FormData` 上传文件，类比后端的 `MultipartFormDataContent`。如果你手动设置 `Content-Type: multipart/form-data; boundary=...`，会发生什么？为什么浏览器自动加 boundary 更安全？

---

## 文件夹操作 API

来源：`src/api/file/folders.ts`

```typescript
import { get, post, put, del } from "./http"
import type { FolderDto, FolderTreeNode, CreateFolderRequest } from "@/types"

/** 文件夹操作 API */
export const foldersApi = {
  /** 创建文件夹 */
  create(data: CreateFolderRequest) {
    return post<FolderDto>("/api/folders", data)
  },

  /** 获取文件夹详情 */
  detail(folderId: string) {
    return get<FolderDto>(`/api/folders/${folderId}`)
  },

  /** 获取指定父文件夹下的子文件夹列表 */
  children(parentId?: string) {
    return get<FolderDto[]>("/api/folders/children", parentId ? { parentId } : {})
  },

  /** 获取完整的文件夹树形结构 */
  tree() {
    return get<FolderTreeNode[]>("/api/folders/tree")
  },

  /** 重命名文件夹 */
  rename(folderId: string, newName: string) {
    return put<string>(`/api/folders/${folderId}/rename`, { newName })
  },

  /** 删除文件夹（必须为空文件夹才能删除） */
  delete(folderId: string) {
    return del<string>(`/api/folders/${folderId}`)
  },
}
```

> **🤔 导师提问**：`foldersApi.tree()` 返回完整的文件夹树形结构，而 `foldersApi.children(parentId?)` 只返回指定父级的子文件夹。类比后端，这就像 EF Core 的 `.Include(f => f.Children)` 立即加载 vs `.Where(f => f.ParentId == id)` 按需加载。什么场景下应该用 `children` 而不是 `tree`？

---

## 配额管理 API

来源：`src/api/file/quota.ts`

```typescript
import { get, put } from "./http"
import type { QuotaDto, StorageStatsDto, TenantStorageStatsDto, AdjustQuotaRequest } from "@/types"

/** 配额管理 API */
export const quotaApi = {
  /** 获取当前租户的配额信息 */
  getCurrent() {
    return get<QuotaDto>("/api/quota")
  },

  /** 获取当前租户的存储使用统计 */
  getStats() {
    return get<StorageStatsDto>("/api/quota/stats")
  },

  /** 获取所有租户的存储统计（管理员权限） */
  getAllStats() {
    return get<TenantStorageStatsDto[]>("/api/quota/stats/all")
  },

  /** 管理员调整租户配额上限 */
  adjustQuota(data: AdjustQuotaRequest) {
    return put<void>("/api/quota/adjust", data)
  },
}
```

---

## 文件分享 API

来源：`src/api/file/share.ts`

```typescript
import { get, post, del } from "./http"
import type { ShareLinkDto, CreateShareRequest } from "@/types"

/** 文件分享 API */
export const shareApi = {
  /** 创建文件分享链接 */
  create(data: CreateShareRequest) {
    return post<ShareLinkDto>("/api/share", data)
  },

  /** 列出指定文件的所有分享链接 */
  listByFile(fileId: string) {
    return get<ShareLinkDto[]>(`/api/share/file/${fileId}`)
  },

  /** 撤销分享链接，使链接失效 */
  revoke(shareId: string) {
    return del<string>(`/api/share/${shareId}`)
  },
}
```

---

## 分片上传管理 API

来源：`src/api/file/multipart.ts`

```typescript
import { get, del } from "./http"
import type { MultipartTaskDto } from "@/types"

/** 分片上传管理 API */
export const multipartApi = {
  /** 列出当前用户进行中的分片上传任务 */
  listMyTasks() {
    return get<MultipartTaskDto[]>("/api/multipart/my-tasks")
  },

  /** 查询分片上传任务详情 */
  getTask(taskId: string) {
    return get<MultipartTaskDto>(`/api/multipart/${taskId}`)
  },

  /** 取消分片上传任务，清理已上传的分片 */
  cancel(taskId: string) {
    return del<void>(`/api/multipart/${taskId}`)
  },
}
```

---

## 文件访问控制 API

来源：`src/api/file/file-access.ts`

```typescript
import { get, post, del } from "./http"
import type { FileAccessGrantDto, GrantAccessRequest } from "@/types"

/** 文件级 ACL（访问控制列表）API */
export const fileAccessApi = {
  /** 授予用户对文件的访问权限 */
  grant(data: GrantAccessRequest) {
    return post<FileAccessGrantDto>("/api/file-access/grant", data)
  },

  /** 撤销用户对文件的访问授权 */
  revoke(grantId: string) {
    return del<void>(`/api/file-access/${grantId}`)
  },

  /** 列出指定文件的所有授权记录 */
  listByFile(fileId: string) {
    return get<FileAccessGrantDto[]>(`/api/file-access/file/${fileId}`)
  },

  /** 列出当前用户被授予的所有文件权限 */
  listMyGrants() {
    return get<FileAccessGrantDto[]>("/api/file-access/my-grants")
  },

  /** 检查用户对文件是否拥有指定权限 */
  checkPermission(fileId: string, userId: string, permission: string) {
    return get<{ hasPermission: boolean }>("/api/file-access/check", {
      fileId,
      userId,
      permission,
    })
  },
}
```

---

## 工具函数

来源：`src/lib/file-utils.ts`

```typescript
import { ACCESS_LEVEL, type AccessLevel } from "@/types"
import {
  File, Image, FileVideo, FileAudio, FileText, FileArchive,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

/** 格式化文件大小（中文习惯：小数两位，单位 KB/MB/GB/TB）*/
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/** 根据 ContentType 返回对应的 lucide 文件图标组件 */
export function getFileIcon(contentType: string | null | undefined): LucideIcon {
  if (!contentType) return File
  if (contentType.startsWith("image/")) return Image
  if (contentType.startsWith("video/")) return FileVideo
  if (contentType.startsWith("audio/")) return FileAudio
  if (contentType === "application/pdf") return FileText
  if (contentType.includes("word") || contentType.includes("document") || contentType.includes("text/"))
    return FileText
  if (contentType.includes("excel") || contentType.includes("spreadsheet") || contentType.includes("csv"))
    return FileArchive
  if (contentType.includes("zip") || contentType.includes("rar") || contentType.includes("7z"))
    return FileArchive
  return File
}

/** 访问级别对应的中文标签映射 */
export const ACCESS_LEVEL_LABELS: Partial<Record<AccessLevel, string>> = {
  [ACCESS_LEVEL.Private]: "私有",
  [ACCESS_LEVEL.TenantPublic]: "租户内公开",
  [ACCESS_LEVEL.Public]: "全平台公开",
}

/**
 * 获取缩略图/预览图的 Blob URL（带 Bearer Token 认证）。
 * <img src> 直接请求不会携带 Token，所以需要先 fetch 再创建 Object URL。
 */
export async function fetchImageBlobUrl(
  fileId: string,
  maxWidth = 1024,
  maxHeight = 1024
): Promise<string> {
  const token = (await import("@/stores/auth-store")).useAuthStore.getState().accessToken
  const url = `/file-api/api/files/${fileId}/thumbnail?maxWidth=${maxWidth}&maxHeight=${maxHeight}`
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) throw new Error(`图片加载失败: ${res.status}`)
  const blob = await res.blob()
  return URL.createObjectURL(blob)
}
```

---

## 逐行讲解：关键设计点

### `normalizePagedResult` — 分页格式适配

```typescript
function normalizePagedResult<T>(
  res: ApiResult<{ items: T[]; total: number; pageIndex: number; pageSize: number }>
): ApiResult<PagedResult<T>> {
  if (!res.data) return res as unknown as ApiResult<PagedResult<T>>
  return {
    ...res,
    data: {
      items: res.data.items,
      totalCount: res.data.total,    // 后端 total → 前端 totalCount
      page: res.data.pageIndex,      // 后端 pageIndex → 前端 page
      pageSize: res.data.pageSize,
    },
  }
}
```

- **字段映射**：后端用 `total/pageIndex`，前端统一用 `totalCount/page`。类比后端的 DTO 映射层，把数据库字段名映射为 API 契约字段名。【设计取舍】在 API 层做映射而非让每个页面适配后端格式，改一次全局生效。
- **泛型 `<T>`**：让函数适用于任何分页数据类型——文件列表、回收站列表都能复用。

### `instantUpload` — 秒传的 404 处理

```typescript
async instantUpload(data: InstantUploadRequest) {
  try {
    return await post<UploadFileResponse>("/api/files/instant-upload", data)
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status
    if (status === 404) {
      return { success: false, code: 404, message: "未命中秒传", data: null as unknown as UploadFileResponse }
    }
    throw err
  }
}
```

- **404 不是错误**：秒传检测时 404 表示"未命中"，需要走普通上传，这是正常的业务分支。【易错点】如果不在 API 层拦截 404，上层调用方会进入 `catch` 分支，误以为请求失败。
- **`null as unknown as UploadFileResponse`**：类型双断言绕过 TS 检查，因为 `success: false` 时 data 确实为空。

### `upload` — FormData + 进度回调

```typescript
upload(file: File, options?: { ... onUploadProgress?: (percent: number) => void }) {
  const formData = new FormData()
  formData.append("file", file)

  const params: Record<string, string> = {}
  if (options?.folderId) params.folderId = options.folderId
  // ...

  return fileHttpInstance.post("/api/files/upload", formData, {
    params: Object.keys(params).length > 0 ? params : undefined,
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (evt) => {
      if (options?.onUploadProgress && evt.total) {
        options.onUploadProgress(Math.round((evt.loaded / evt.total) * 100))
      }
    },
  })
}
```

- **`FormData`**：浏览器原生 API，类比后端的 `MultipartFormDataContent`。【易错点】不能手动设 `Content-Type: multipart/form-data; boundary=...`，浏览器会自动加 boundary，手动设反而破坏。
- **`fileHttpInstance.post`**：不用封装的 `post()`，因为需要 `onUploadProgress` 和自定义 `headers`，这只有原始 axios 实例才支持。

### `fetchImageBlobUrl` — 认证图片加载

```typescript
export async function fetchImageBlobUrl(fileId: string, maxWidth = 1024, maxHeight = 1024): Promise<string> {
  const token = (await import("@/stores/auth-store")).useAuthStore.getState().accessToken
  const url = `/file-api/api/files/${fileId}/thumbnail?maxWidth=${maxWidth}&maxHeight=${maxHeight}`
  const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
  if (!res.ok) throw new Error(`图片加载失败: ${res.status}`)
  const blob = await res.blob()
  return URL.createObjectURL(blob)
}
```

- **动态导入 `@/stores/auth-store`**：`await import(...)` 避免循环依赖。【性能陷阱】如果 `file-utils.ts` 在模块顶层直接 `import { useAuthStore }`，当 auth-store 反向引用 file-utils 时会形成循环，导致 `undefined`。
- **`URL.createObjectURL(blob)`**：将 Blob 转为可供 `<img src>` 使用的临时 URL。⚠️ 用完必须调 `URL.revokeObjectURL()` 释放内存，否则每次预览都泄漏一个 Blob 引用。

> **🤔 导师提问**：`fetchImageBlobUrl` 用 `await import("@/stores/auth-store")` 动态导入而不是在文件顶部直接 `import`，这是为了避免循环依赖。类比后端，你在什么情况下会用 `Lazy<T>` 延迟初始化而不是构造函数直接注入？两者的动机有什么相似之处？

---

## 验证步骤
> 1. 在浏览器 DevTools Console 中执行 `import("@/api/file/files").then(m => console.log(Object.keys(m.filesApi)))`，确认打印出所有文件 API 方法名（list、detail、upload、rename 等）
> 2. 执行 `import("@/api/file/http").then(m => console.log(m.default?.defaults?.baseURL))`，确认输出为 `/file-api`，验证 HTTP 客户端的基础路径配置
> 3. 在 Network 面板中调用任意 `filesApi` 方法，检查请求头中是否自动携带 `Authorization: Bearer <token>`，验证拦截器是否生效
> 4. 调用 `filesApi.upload` 上传一个文件，检查请求头中 `Content-Type` 是否为 `multipart/form-data` 且包含 `boundary`，确认浏览器自动添加了 boundary

---

## 踩坑提醒

1. **`instantUpload` 的 404 不是错误**：秒传检测时后端返回 404 表示"未命中"，需要走普通上传，这是正常业务分支。如果不在 API 层拦截 404 转为 `success: false`，上层调用方会进入 `catch` 分支误以为请求失败。
2. **`upload` 方法必须用 `fileHttpInstance.post`**：封装的 `post()` 方法不支持 `onUploadProgress` 和自定义 `headers`（如 `Content-Type: multipart/form-data`），文件上传场景必须用原始 axios 实例。同理，下载方法需要 `responseType: "blob"`，也只能用 `fileHttpInstance`。
3. **`normalizePagedResult` 字段映射**：后端用 `total/pageIndex`，前端统一用 `totalCount/page`。如果忘记做映射，分页组件会因为找不到 `totalCount` 而显示总数为 0。

---

## 🤔 思考题

**概念级**：`filesApi.upload` 为什么使用 `fileHttpInstance.post` 而不是封装的 `post()` 方法？

**推理级**：`instantUpload` 方法为什么要把 404 错误"吞掉"并返回一个 `success: false` 的对象，而不是让它正常抛出异常？

**动手级**：假设后端新增了一个批量复制文件的接口 `POST /api/files/batch-copy`，接受 `{ fileIds: string[], targetFolderId: string | null }`，返回 `BatchOperationResult`。请在 `filesApi` 中添加这个方法。

---

## ✅ 输出检查清单

完成本篇学习后，确认我们能够：

- [ ] 说明文件服务 HTTP 客户端的创建方式和 baseURL 配置
- [ ] 区分封装方法（`get/post/put/del`）和原始 axios 实例的使用场景
- [ ] 理解 `normalizePagedResult` 的字段映射逻辑（后端 `total/pageIndex` → 前端 `totalCount/page`）
- [ ] 知道 `instantUpload` 为什么拦截 404 并转为 `success: false`
- [ ] 理解 `fetchImageBlobUrl` 中 `dynamic import` 的必要性
- [ ] 能列出所有 7 个 API 子模块的方法清单

---

## 📋 本步产出清单

| 文件 | 说明 |
|------|------|
| `src/api/file/http.ts` | FileService HTTP 客户端 |
| `src/api/file/files.ts` | 文件操作 API（CRUD、上传、下载、回收站、打包下载） |
| `src/api/file/folders.ts` | 文件夹操作 API（树结构、CRUD） |
| `src/api/file/quota.ts` | 配额管理 API |
| `src/api/file/share.ts` | 文件分享 API |
| `src/api/file/multipart.ts` | 分片上传任务管理 API |
| `src/api/file/file-access.ts` | 文件级 ACL 授权 API |
| `src/lib/file-utils.ts` | 文件工具函数（格式化、图标、认证图片加载） |

---

[← 上一篇：文件服务架构](01-文件服务架构.md) | [下一篇：文件管理器 →](03-文件管理器.md)
