import { sidebar } from "vuepress-theme-hope";

export default sidebar({


  "/": [
    "",
    {
      text: "后端开发",
      icon: "code",
      prefix: "后端开发/",
      collapsible: true,
      children: [
        { text: "CSharp",       icon: "fa6-brands:microsoft",   prefix: "CSharp/",        collapsible: true, children: "structure" },
        { text: "ABP框架",      icon: "lineicons:vs-code",       prefix: "ABP框架/",       collapsible: true, children: "structure" },
        { text: "ASP.NET Core", icon: "typcn:vendor-microsoft",  prefix: "ASP.NET_Core/",  collapsible: true, children: "structure" },
        // 算法单独显式声明，保证七个模块顺序固定
        {
          text: "C# 算法知识库",
          icon: "code",
          prefix: "算法/",
          collapsible: true,
          children: [
            "",
            { text: "01. 数据结构基础", icon: "box",              prefix: "01_数据结构基础/", collapsible: true, children: "structure" },
            { text: "02. 排序算法",     icon: "sort",             prefix: "02_排序算法/",     collapsible: true, children: "structure" },
            { text: "03. 查找算法",     icon: "oui:search",           prefix: "03_查找算法/",     collapsible: true, children: "structure" },
            { text: "04. 核心算法思想", icon: "lightbulb",        prefix: "04_核心算法思想/", collapsible: true, children: "structure" },
            { text: "05. 树与图算法",   icon: "diagram-project",  prefix: "05_树与图算法/",   collapsible: true, children: "structure" },
            { text: "06. 字符串算法",   icon: "font",             prefix: "06_字符串算法/",   collapsible: true, children: "structure" },
            { text: "07. 数学算法",     icon: "calculator",       prefix: "07_数学算法/",     collapsible: true, children: "structure" },
          ],
        },
        // 权限设计单独显式声明，保证六个模块顺序固定
        {
          text: "权限系统设计",
          icon: "fa6-solid:shield-halved",
          prefix: "权限设计/",
          collapsible: true,
          children: [
            "",
            { text: "01. 权限模型演进",    icon: "fa6-solid:timeline",     prefix: "01_权限模型演进/",    collapsible: true, children: "structure" },
            { text: "02. RBAC 深度解析",   icon: "fa6-solid:id-badge",     prefix: "02_RBAC深度解析/",    collapsible: true, children: "structure" },
            { text: "03. ABAC 细粒度控制", icon: "fa6-solid:filter",        prefix: "03_ABAC细粒度控制/",  collapsible: true, children: "structure" },
            { text: "04. PBAC 策略引擎",   icon: "fa6-solid:gavel",         prefix: "04_PBAC策略引擎/",    collapsible: true, children: "structure" },
            { text: "05. 混合架构落地",    icon: "fa6-solid:layer-group",   prefix: "05_混合架构落地/",    collapsible: true, children: "structure" },
            { text: "06. 性能与工程实践",  icon: "fa6-solid:gauge-high",    prefix: "06_性能与工程实践/",  collapsible: true, children: "structure" },
          ],
        },
      ],
    },
    {
      text: "前端开发",
      icon: "laptop-code",
      prefix: "前端开发/",
      collapsible: true,
      children: "structure"
    },
    {
      text: "架构与设计",
      icon: "sitemap",
      prefix: "架构与设计/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "语言",
      icon: "language",
      prefix: "语言/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "面试题",
      icon: "fa6-solid:file-circle-question",
      prefix: "面试题/",
      collapsible: true,
      children: "structure"
    },
    {
      text: "Linux",
      icon: "fa6-brands:linux",
      prefix: "Linux/",
      collapsible: true,
      children: "structure"
    },
    {
      text: "运维与部署",
      icon: "rocket",
      prefix: "运维与部署/",
      collapsible: true,
      children: "structure"
    },
    {
      text: "业务系统",
      icon: "building",
      prefix: "业务系统/",
      collapsible: true,
      children: "structure"
    },
    {
      text: "AI 实践",
      icon: "fa6-solid:robot",
      prefix: "AI实践/",
      collapsible: true,
      children: [
        { text: "第一阶段：基础",     icon: "fa6-solid:seedling",      prefix: "01_基础阶段/",  collapsible: true, children: "structure" },
        { text: "第二阶段：核心",     icon: "fa6-solid:fire",          prefix: "02_核心阶段/",  collapsible: true, children: "structure" },
        { text: "第三阶段：进阶",     icon: "fa6-solid:bolt",          prefix: "03_进阶阶段/",  collapsible: true, children: "structure" },
        { text: "第四阶段：架构",     icon: "fa6-solid:building-columns", prefix: "04_架构阶段/", collapsible: true, children: "structure" },
        { text: "第五阶段：业务落地", icon: "fa6-solid:briefcase",         prefix: "05_业务落地/",  collapsible: true, children: "structure" },
      ],
    }
  ],
});

