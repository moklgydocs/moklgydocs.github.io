import { defineClientConfig } from "vuepress/client";
import Test from "./components/Test.vue";
import Note from "./components/Note.vue";
import Tense from "./components/Tense.vue";
import IpaPlayer from "./components/IpaPlayer.vue";
import KanaPlayer from "./components/KanaPlayer.vue";

export default defineClientConfig({
  enhance({ app }) {
    app.component("Test", Test);
    app.component("Note", Note);
    app.component("Tense", Tense);
    app.component("IpaPlayer", IpaPlayer);
    app.component("KanaPlayer", KanaPlayer);
  },
});
