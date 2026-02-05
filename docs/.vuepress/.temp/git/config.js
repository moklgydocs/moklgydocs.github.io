import { GitContributors } from "E:/博客/moklgydocs.github.io/vuepress-starter/node_modules/.pnpm/@vuepress+plugin-git@2.0.0-_0d668c3c2946b3199fc2b25af018fb22/node_modules/@vuepress/plugin-git/lib/client/components/GitContributors.js";
import { GitChangelog } from "E:/博客/moklgydocs.github.io/vuepress-starter/node_modules/.pnpm/@vuepress+plugin-git@2.0.0-_0d668c3c2946b3199fc2b25af018fb22/node_modules/@vuepress/plugin-git/lib/client/components/GitChangelog.js";

export default {
  enhance: ({ app }) => {
    app.component("GitContributors", GitContributors);
    app.component("GitChangelog", GitChangelog);
  },
};
