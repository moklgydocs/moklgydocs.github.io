import { CodeTabs } from "E:/博客/moklgydocs.github.io/vuepress-starter/node_modules/.pnpm/@vuepress+plugin-markdown-t_70d3e68bd400fab96ec3b4223d7e6152/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/CodeTabs.js";
import { Tabs } from "E:/博客/moklgydocs.github.io/vuepress-starter/node_modules/.pnpm/@vuepress+plugin-markdown-t_70d3e68bd400fab96ec3b4223d7e6152/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/Tabs.js";
import "E:/博客/moklgydocs.github.io/vuepress-starter/node_modules/.pnpm/@vuepress+plugin-markdown-t_70d3e68bd400fab96ec3b4223d7e6152/node_modules/@vuepress/plugin-markdown-tab/lib/client/styles/vars.css";

export default {
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Tabs", Tabs);
  },
};
