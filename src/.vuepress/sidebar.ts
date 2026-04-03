import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "后端开发",
      icon: "code",
      prefix: "后端开发/",
      collapsible: true,
      children: "structure",
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
      text: "思维训练",
      icon: "brain",
      prefix: "思维训练/",
      collapsible: true,
      children: "structure"
    }
  ],
});

