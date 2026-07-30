import { defineClientConfig } from "vuepress/client";
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

export default defineClientConfig({
  enhance({ app }) {
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
  },
});
