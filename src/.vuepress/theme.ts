import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  author: {
    name: "Moclgy",
    url: "https://github.com/moklgydocs",
  },
  themeColor: {
    blue: "#2196f3",
    cyan: "#00ffcc", // Added cyber cyan
    red: "#f26d6d",
    green: "#3eaf7c",
    orange: "#fb9b5f",
  },

  logo: "/logo.svg",

  repo: "moklgydocs/moklgydocs.github.io",

  docsDir: "src",

  navbar,
  sidebar,

  footer: "Transmission Clear",
  displayFooter: true,

  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  markdown: {
    align: true,
    attrs: true,
    codeTabs: true,
    component: true,
    demo: true,
    figure: true,
    gfm: true,
    imgLazyload: true,
    imgSize: true,
    include: true,
    mark: true,
    plantuml: true,
    spoiler: true,
    sub: true,
    sup: true,
    tabs: true,
    tasklist: true,
    vPre: true,
    highlighter: {
      type: "shiki",
      theme: "one-dark-pro", // 苹果浅色 
    },
  },

  encrypt: {
    config: {
      "/Linux/配置云服务器.html": ["967552"],
    },
  },

  plugins: {
    slimsearch: {
      locales: {
        "/": {
          placeholder: "搜索...",
        },
      },
    },
    components: {
      components: ["Badge", "VPCard"],
    },
    icon: {
      prefix: "fa6-solid:",
    },
  },
});
