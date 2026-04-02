import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
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
    text: "前端开发",
    icon: "laptop-code",
    link: "/前端开发/",
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
     icon: "linux",
     link: "/Linux/"
  },
  {
     text: "运维与部署",
     icon: "rocket",
     link: "/运维与部署/"
  },
  {
     text: "关于我",
     icon: "user",
     link: "/portfolio"
  }
]);