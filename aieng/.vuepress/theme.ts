import { hopeTheme } from "vuepress-theme-hope";
import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "https://moklgydocs.github.io",
  author: { name: "Moklgy" },
  logo: "/ai-eng/logo.svg",
  repo: "moklgydocs/moklgydocs.github.io",
  docsDir: "aieng",
  navbar: [
    { text: "课程首页", icon: "fa6-solid:house", link: "/" },
    { text: "回主站", icon: "fa6-solid:arrow-left", link: "https://moklgydocs.github.io/" },
  ],
  sidebar,
  displayFooter: true,
  copyright: false,
  markdown: {
    figure: true,
    gfm: true,
    imgLazyload: true,
    imgSize: true,
    mark: true,
    math: { type: "katex" },
    spoiler: true,
    sub: true,
    sup: true,
    tabs: true,
    tasklist: true,
    vPre: true,
    highlighter: { type: "shiki", theme: "one-dark-pro" },
    mermaid: true,
  },
  plugins: {
    components: { components: ["Badge", "VPCard"] },
    icon: { prefix: "fa6-solid:" },
  },
});
