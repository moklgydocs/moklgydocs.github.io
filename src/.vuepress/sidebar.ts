import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "后端开发",
      icon: "code",
      prefix: "后端开发/",
      children: "structure",
    },
    {
      text: "前端开发",
      icon: "laptop-code",
      prefix: "前端开发/",
      children: "structure"
    },
    {
      text: "架构与设计",
      icon: "sitemap",
      prefix: "架构与设计/",
      children: "structure",
    },
    {
      text: "Linux",
      icon: "linux",
      prefix: "Linux/",
      children: "structure"
    },
    {
      text: "运维与部署",
      icon: "rocket",
      prefix: "运维与部署/",
      children: "structure"
    }
  ],
});