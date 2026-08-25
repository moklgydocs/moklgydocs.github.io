import { defineClientConfig, resolveRoute } from "vuepress/client";
import Test from "./components/Test.vue";
import Note from "./components/Note.vue";
import Tense from "./components/Tense.vue";
import IpaPlayer from "./components/IpaPlayer.vue";
import KanaPlayer from "./components/KanaPlayer.vue";
import VocabTable from "./components/VocabTable.vue";
import ReadingPassage from "./components/ReadingPassage.vue";
import VocabList from "./components/VocabList.vue";
import WordAudio from "./components/WordAudio.vue";
import StickyAudio from "./components/StickyAudio.vue";
import AudioButton from "./components/AudioButton.vue";
import GrammarTip from "./components/GrammarTip.vue";
import GrammarExpandAll from "./components/GrammarExpandAll.vue";
import VerbDrill from "./components/VerbDrill.vue";
import ReadingMode from "./components/ReadingMode.vue";

export default defineClientConfig({
  rootComponents: [ReadingMode],
  enhance({ app, router }) {
    // 分片构建产物合包后,跨分片链接在本分片路由表中不存在(SPA 客户端导航会渲 404)。
    // 不用路由守卫(往返/bfcache 场景不稳),改在捕获阶段拦截点击:
    // 目标不在本分片路由表 → 阻断 SPA 导航,强制整页加载,目标分片 bundle 接管。
    if (typeof window !== "undefined") {
      window.addEventListener(
        "click",
        (e) => {
          const a = (e.target as HTMLElement).closest?.("a[href]");
          if (!a) return;
          const href = a.getAttribute("href") || "";
          if (!href.startsWith("/") || href.startsWith("//")) return;
          const p = href.split(/[#?]/)[0];
          if (!resolveRoute(p).notFound) return;
          e.preventDefault();
          e.stopPropagation();
          window.location.assign(href);
        },
        true,
      );
    }
    app.component("Test", Test);
    app.component("Note", Note);
    app.component("Tense", Tense);
    app.component("IpaPlayer", IpaPlayer);
    app.component("KanaPlayer", KanaPlayer);
    app.component("VocabTable", VocabTable);
    app.component("ReadingPassage", ReadingPassage);
    app.component("VocabList", VocabList);
    app.component("WordAudio", WordAudio);
    app.component("StickyAudio", StickyAudio);
    app.component("AudioButton", AudioButton);
    app.component("GrammarTip", GrammarTip);
    app.component("GrammarExpandAll", GrammarExpandAll);
    app.component("VerbDrill", VerbDrill);
  },
});
