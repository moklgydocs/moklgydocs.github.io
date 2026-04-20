import { defineClientConfig } from "vuepress/client";
import Test from "./components/Test.vue";
import Note from "./components/Note.vue";
import Tense from "./components/Tense.vue";

export default defineClientConfig({
  enhance({ app }) {
    app.component("Test", Test);
    app.component("Note", Note);
    app.component("Tense", Tense);
  },
});
