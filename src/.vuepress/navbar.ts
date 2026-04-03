import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "前端开发",
    icon: "laptop-code",
    prefix: "/前端开发/",
    children: [
      {
        text: "TypeScript 从零实现 axios",
        icon: "bolt",
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
      }
    ]
  },
  {
    text: "后端开发",
    icon: "code",
    prefix: "/后端开发/",
    children: [
      {
        text: "ASP.NET Core",
        icon: "server",
        link: "ASP.NET_Core/",
      },
      {
        text: "ABP框架",
        icon: "layer-group",
        link: "ABP框架/",
      },
    ],
  },
  {
    text: "架构与设计",
    icon: "sitemap",
    prefix: "/架构与设计/",
    children: [
      {
         text: "设计模式",
         icon: "object-group",
         link: "设计模式/"
      }
    ]
  },
  {
     text: "Linux",
     icon: "fa6-brands:linux",
     link: "/Linux/"
  },
  {
     text: "语言",
     icon: "language",
     prefix: "/语言/",
     children: [
       {
         text: "日语",
         icon: "language",
         link: "日语/"
       }
     ]
  },
  {
     text: "面试题",
     icon: "fa6-solid:file-circle-question",
     prefix: "/面试题/",
     children: [
       {
         text: "后端面试题",
         icon: "fa6-solid:server",
         link: "后端面试题/"
       }
     ]
  },
  {
     text: "运维与部署",
     icon: "rocket",
     link: "/运维与部署/"
  },
  {
     text: "思维训练",
     icon: "brain",
     link: "/思维训练/"
  },
  {
     text: "关于我",
     icon: "user",
     link: "/portfolio"
  }
]);
