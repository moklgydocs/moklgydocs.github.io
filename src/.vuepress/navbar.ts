import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "前端开发",
    icon: "fa6-solid:laptop-code",
    prefix: "/前端开发/",
    children: [
      {
        text: "React 19 教程",
        icon: "fa6-brands:react",
        link: "react19教程/"
      },
      {
        text: "React 中后台架构",
        icon: "fa6-brands:react",
        link: "React中后台架构知识库/"
      },
      {
        text: "TypeScript 从零实现 axios",
        icon: "fa6-brands:js",
        link: "TypeScript 从零实现 axios/"
      },
      {
        text: "JavaScript 教程",
        icon: "fa6-brands:square-js",
        link: "JavaScript教程/"
      },
      {
        text: "ES6 教程",
        icon: "fa6-brands:js",
        link: "ES6教程/"
      },
      {
        text: "SaaS 实战",
        icon: "fa6-solid:building",
        link: "Saas实战/"
      },
      {
        text: "TailwindCSS",
        icon: "fa6-brands:css3-alt",
        link: "TailwindCSS/"
      },
      {
        text: "前端面试题",
        icon: "fa6-solid:file-circle-question",
        link: "/面试题/前端面试题/"
      },
    ]
  },
  {
    text: "后端开发",
    icon: "fa6-solid:code",
    prefix: "/后端开发/",
    children: [
      {
        text: "ASP.NET Core",
        icon: "fa6-brands:microsoft",
        link: "ASP.NET_Core/",
      },
      {
        text: "ABP 框架",
        icon: "fa6-brands:microsoft",
        link: "ABP框架/",
      },
      {
        text: ".NET IoT",
        icon: "fa6-solid:microchip",
        link: "DotNet_IoT/"
      },
      {
        text: "RabbitMQ",
        icon: "fa6-solid:envelope",
        link: "RabbitMQ/"
      },
      {
        text: "数据库",
        icon: "fa6-solid:database",
        link: "数据库/"
      },
      {
        text: "Redis",
        icon: "fa6-solid:bolt",
        link: "Redis/"
      },
      {
        text: "后端面试题",
        icon: "fa6-solid:file-circle-question",
        link: "/面试题/后端面试题/"
      },
    ],
  },
  {
    text: "架构与设计",
    icon: "fa6-solid:sitemap",
    prefix: "/架构与设计/",
    children: [
      {
        text: "设计模式",
        icon: "fa6-solid:shapes",
        link: "设计模式/"
      }
    ]
  },
  {
    text: "计算机学科",
    icon: "fa6-solid:graduation-cap",
    prefix: "/计算机学科/",
    children: [
      {
        text: "计算机网络",
        icon: "fa6-solid:network-wired",
        link: "计算机网络/"
      },
      {
        text: "汇编语言",
        icon: "fa6-solid:microchip",
        link: "汇编语言/"
      },
      {
        text: "操作系统",
        icon: "fa6-solid:desktop",
        link: "操作系统/"
      },
      {
        text: "计算机组成原理",
        icon: "fa6-solid:memory",
        link: "计算机组成原理/"
      },
      {
        text: "数字电路",
        icon: "fa6-solid:toggle-on",
        link: "数字电路/"
      },
    ]
  },
  {
    text: "AI 实践",
    icon: "fa6-solid:robot",
    link: "/AI实践/"
  },
  {
    text: "AI 书籍",
    icon: "fa6-solid:book",
    children: [
      {
        text: "AI 知识库 (JavaGuide)",
        icon: "fa6-solid:book-open-reader",
        link: "/AI知识库/"
      },
      {
        text: "从零构建智能体 (Hello-Agents)",
        icon: "fa6-solid:robot",
        link: "/从零构建智能体/"
      },
      {
        text: "深入理解 AI Agent",
        icon: "fa6-solid:wand-magic-sparkles",
        link: "/深入理解AIAgent/"
      },
      {
        text: "动手学深度学习 (d2l-zh)",
        icon: "fa6-solid:brain",
        link: "/d2l/"
      },
      {
        text: "AI 工程实战(从零到生产)",
        icon: "fa6-solid:gears",
        link: "/ai-eng/"
      },
    ]
  },
  {
    text: "语言",
    icon: "fa6-solid:language",
    prefix: "/语言/",
    children: [
      {
        text: "英语 · 语法俱乐部",
        icon: "fa6-solid:book",
        link: "英语/语法俱乐部/"
      },
      {
        text: "英语 · 音标有谱",
        icon: "fa6-solid:music",
        link: "英语/音标/"
      },
      {
        text: "英语 · Friends 老友记",
        icon: "fa6-solid:tv",
        link: "英语/Friends老友记/"
      },
      {
        text: "日语",
        icon: "fa6-solid:book-open",
        link: "日语/"
      }
    ]
  },
  {
    text: "运维与部署",
    icon: "fa6-solid:rocket",
    children: [
      {
        text: "Docker & K8s",
        icon: "fa6-brands:docker",
        link: "Docker_K8s/"
      }
    ]
  },
  {
    text: "Linux",
    icon: "fa6-brands:linux",
    link: "/Linux/"
  },
  {
    text: "关于我",
    icon: "fa6-solid:user",
    link: "/portfolio"
  }
]);
