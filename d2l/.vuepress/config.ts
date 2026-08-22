import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/d2l/",
  lang: "zh-CN",
  title: "动手学深度学习",
  description: "动手学深度学习(d2l-zh)在线阅读",
  head: [["link", { rel: "icon", href: "/d2l/logo.svg" }]],
  theme,
  pagePatterns: ["**/*.md", "!_.md", "!.vuepress", "!node_modules"],
  shouldPrefetch: false,
});
