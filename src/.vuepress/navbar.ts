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
    ]
  },
  {
    text: "AI 实践",
    icon: "fa6-solid:robot",
    link: "/AI实践/"
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
        text: "日语",
        icon: "fa6-solid:book-open",
        link: "日语/"
      }
    ]
  },
  {
    text: "运维与部署",
    icon: "fa6-solid:rocket",
    link: "/运维与部署/"
  },
  {
    text: "关于我",
    icon: "fa6-solid:user",
    link: "/portfolio"
  }
]);
