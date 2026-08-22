import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/ai-eng/",
  lang: "zh-CN",
  title: "AI 工程实战",
  description: "从零到生产的 AI 工程课程(503 课中文全译本)",
  head: [["link", { rel: "icon", href: "/ai-eng/logo.svg" }]],
  theme,
  pagePatterns: ["**/*.md", "!_.md", "!.vuepress", "!node_modules"],
  shouldPrefetch: false,
});
