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
    // 分片构建产物合包后,跨分片链接在本分片路由表里不存在(resolveRoute 判 notFound)。
    // 守卫:notFound 时强制整页跳转,让目标页所属分片的 bundle 接管;一次性标记防死循环。
    const FLAG = "vp-cross-shard-reload:";
    router.beforeEach((to) => {
      if (!resolveRoute(to.fullPath).notFound) return true;
      const key = FLAG + to.fullPath;
      if (sessionStorage.getItem(key)) return true;
      sessionStorage.setItem(key, "1");
      window.location.assign(to.fullPath);
      return false;
    });
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
