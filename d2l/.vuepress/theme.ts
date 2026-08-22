import { hopeTheme } from "vuepress-theme-hope";

export default hopeTheme({
  hostname: "https://moklgydocs.github.io",
  author: { name: "Moklgy" },
  logo: "/d2l/logo.svg",
  repo: "moklgydocs/moklgydocs.github.io",
  docsDir: "d2l",
  navbar: [
    { text: "首页", icon: "fa6-solid:house", link: "/" },
    { text: "回主站", icon: "fa6-solid:arrow-left", link: "https://moklgydocs.github.io/" },
  ],
  sidebar: {
    "/": [
      "",
      {
        text: "章节",
        icon: "fa6-solid:book-open",
        prefix: "",
        collapsible: false,
        sidebarSorter: ["readme", "order", "filename"],
        children: "structure",
      },
    ],
  },
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
