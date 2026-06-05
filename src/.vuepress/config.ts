import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import { webpackBundler } from "@vuepress/bundler-webpack";
import theme from "./theme.js";

const useWebpack = process.env.DOCS_BUNDLER === "webpack";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "Moklgy 的异星基站",
  description: "Moklgy 个人文档与技术博客",
  head: [
    ["link", { rel: "icon", href: "/logo.svg" }]
  ],

  bundler: useWebpack
    ? webpackBundler()
    : viteBundler(),

  theme, pagePatterns: ['**/*.md', '!_.md', '!.vuepress', '!node_modules'],

  shouldPrefetch: false,
});

