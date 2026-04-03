import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "Moklgy 的异星基站",
  description: "Moklgy 个人文档与技术博客",
  head: [
    ["link", { rel: "icon", href: "/logo.svg" }]
  ],

  theme, pagePatterns: ['**/*.md', '!_.md', '!.vuepress', '!node_modules'],

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});

