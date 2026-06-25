<template>
  <div class="kana-shell">
    <!-- Hero -->
    <section class="kana-hero">
      <div class="kana-hero-main">
        <p class="kana-eyebrow">JAPANESE GOJŪON · 五十音</p>
        <h1 class="kana-hero-title">日语五十音图</h1>
        <p class="kana-hero-lead">点击假名卡片即可播放发音 · 含平假名、片假名、清音、浊音、半浊音、拗音</p>
      </div>
      <div class="kana-hero-panel">
        <div class="kana-summary">
          <div class="kana-summary-item">
            <span class="kana-summary-number">46</span>
            <span class="kana-summary-label">清音</span>
          </div>
          <div class="kana-summary-item">
            <span class="kana-summary-number">25</span>
            <span class="kana-summary-label">浊/半浊音</span>
          </div>
          <div class="kana-summary-item">
            <span class="kana-summary-number">33</span>
            <span class="kana-summary-label">拗音</span>
          </div>
        </div>
        <div class="kana-status" :data-state="error ? 'error' : playing ? 'playing' : 'idle'">
          <span class="status-dot"></span>
          <span class="status-text">{{ statusText }}</span>
        </div>
      </div>
    </section>

    <!-- 设置栏 -->
    <section class="kana-settings">
      <div class="kana-setting">
        <span class="setting-label">假名</span>
        <button class="kana-chip" :class="{ 'is-active': kanaMode === 'hiragana' }" @click="kanaMode = 'hiragana'">平假名</button>
        <button class="kana-chip" :class="{ 'is-active': kanaMode === 'katakana' }" @click="kanaMode = 'katakana'">片假名</button>
        <button class="kana-chip" :class="{ 'is-active': kanaMode === 'both' }" @click="kanaMode = 'both'">Both</button>
      </div>
      <div class="kana-setting">
        <span class="setting-label">罗马音</span>
        <button class="kana-chip" :class="{ 'is-active': showRomaji }" @click="showRomaji = !showRomaji">{{ showRomaji ? '显示' : '隐藏' }}</button>
      </div>
      <div class="kana-setting">
        <span class="setting-label">循环</span>
        <select v-model.number="repeatCount" class="kana-select">
          <option v-for="n in 5" :key="n" :value="n">{{ n }} 次</option>
        </select>
      </div>
    </section>

    <!-- 清音 五十音图表格 -->
    <section class="kana-group">
      <header class="kana-group-header">
        <p class="kana-group-eyebrow">Seion · 清音</p>
        <h2 class="kana-group-title">清音（五十音图）</h2>
        <span class="kana-group-count">46 个</span>
      </header>
      <div class="kana-table-scroll">
        <table class="kana-table">
          <thead>
            <tr>
              <th class="kana-corner">段</th>
              <th v-for="col in ['あ', 'い', 'う', 'え', 'お']" :key="col" class="kana-col-head">{{ col }}段</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in seionRows" :key="row.row">
              <th class="kana-row-head">{{ row.row }}行</th>
              <td v-for="(item, ci) in row.items" :key="ci" class="kana-cell">
                <button
                  v-if="item"
                  class="kana-card"
                  :class="{
                    'is-playing': playingId === item.romaji,
                    'is-loading': loadingId === item.romaji,
                  }"
                  @click="play(item)"
                >
                  <span class="kana-card-kana">
                    <template v-if="kanaMode === 'hiragana'">{{ item.hira }}</template>
                    <template v-else-if="kanaMode === 'katakana'">{{ item.kata }}</template>
                    <template v-else><span class="kana-hira">{{ item.hira }}</span><span class="kana-kata">{{ item.kata }}</span></template>
                  </span>
                  <span v-if="showRomaji" class="kana-card-romaji">{{ item.romaji }}</span>
                  <span class="kana-play-icon"><span class="play-dot"></span></span>
                </button>
                <div v-else class="kana-empty"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 浊音/半浊音 -->
    <section class="kana-group">
      <header class="kana-group-header">
        <p class="kana-group-eyebrow">Dakuon · Handakuon</p>
        <h2 class="kana-group-title">浊音 · 半浊音</h2>
        <span class="kana-group-count">25 个</span>
      </header>
      <div class="kana-grid">
        <button
          v-for="item in dakuonList"
          :key="item.romaji"
          class="kana-card kana-card--grid"
          :class="{
            'is-playing': playingId === item.romaji,
            'is-loading': loadingId === item.romaji,
          }"
          @click="play(item)"
        >
          <span class="kana-card-kana">
                    <template v-if="kanaMode === 'hiragana'">{{ item.hira }}</template>
                    <template v-else-if="kanaMode === 'katakana'">{{ item.kata }}</template>
                    <template v-else><span class="kana-hira">{{ item.hira }}</span><span class="kana-kata">{{ item.kata }}</span></template>
                  </span>
          <span v-if="showRomaji" class="kana-card-romaji">{{ item.romaji }}</span>
          <span class="kana-play-icon"><span class="play-dot"></span></span>
        </button>
      </div>
    </section>

    <!-- 拗音 -->
    <section class="kana-group">
      <header class="kana-group-header">
        <p class="kana-group-eyebrow">Yōon · 拗音</p>
        <h2 class="kana-group-title">拗音</h2>
        <span class="kana-group-count">33 个</span>
      </header>
      <div class="kana-grid">
        <button
          v-for="item in yoonList"
          :key="item.romaji"
          class="kana-card kana-card--grid"
          :class="{
            'is-playing': playingId === item.romaji,
            'is-loading': loadingId === item.romaji,
          }"
          @click="play(item)"
        >
          <span class="kana-card-kana">
                    <template v-if="kanaMode === 'hiragana'">{{ item.hira }}</template>
                    <template v-else-if="kanaMode === 'katakana'">{{ item.kata }}</template>
                    <template v-else><span class="kana-hira">{{ item.hira }}</span><span class="kana-kata">{{ item.kata }}</span></template>
                  </span>
          <span v-if="showRomaji" class="kana-card-romaji">{{ item.romaji }}</span>
          <span class="kana-play-icon"><span class="play-dot"></span></span>
        </button>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="kana-footer">
      <p>音频来源：convertjapanese.com · 本页面仅用于日语学习</p>
    </footer>

    <audio ref="player" preload="none"></audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

// ── 清音数据（五十音图）──
const seionRows = [
  { row: "あ", items: [
    { hira: "あ", kata: "ア", romaji: "a" },
    { hira: "い", kata: "イ", romaji: "i" },
    { hira: "う", kata: "ウ", romaji: "u" },
    { hira: "え", kata: "エ", romaji: "e" },
    { hira: "お", kata: "オ", romaji: "o" },
  ]},
  { row: "か", items: [
    { hira: "か", kata: "カ", romaji: "ka" },
    { hira: "き", kata: "キ", romaji: "ki" },
    { hira: "く", kata: "ク", romaji: "ku" },
    { hira: "け", kata: "ケ", romaji: "ke" },
    { hira: "こ", kata: "コ", romaji: "ko" },
  ]},
  { row: "さ", items: [
    { hira: "さ", kata: "サ", romaji: "sa" },
    { hira: "し", kata: "シ", romaji: "shi" },
    { hira: "す", kata: "ス", romaji: "su" },
    { hira: "せ", kata: "セ", romaji: "se" },
    { hira: "そ", kata: "ソ", romaji: "so" },
  ]},
  { row: "た", items: [
    { hira: "た", kata: "タ", romaji: "ta" },
    { hira: "ち", kata: "チ", romaji: "chi" },
    { hira: "つ", kata: "ツ", romaji: "tsu" },
    { hira: "て", kata: "テ", romaji: "te" },
    { hira: "と", kata: "ト", romaji: "to" },
  ]},
  { row: "な", items: [
    { hira: "な", kata: "ナ", romaji: "na" },
    { hira: "に", kata: "ニ", romaji: "ni" },
    { hira: "ぬ", kata: "ヌ", romaji: "nu" },
    { hira: "ね", kata: "ネ", romaji: "ne" },
    { hira: "の", kata: "ノ", romaji: "no" },
  ]},
  { row: "は", items: [
    { hira: "は", kata: "ハ", romaji: "ha" },
    { hira: "ひ", kata: "ヒ", romaji: "hi" },
    { hira: "ふ", kata: "フ", romaji: "fu" },
    { hira: "へ", kata: "ヘ", romaji: "he" },
    { hira: "ほ", kata: "ホ", romaji: "ho" },
  ]},
  { row: "ま", items: [
    { hira: "ま", kata: "マ", romaji: "ma" },
    { hira: "み", kata: "ミ", romaji: "mi" },
    { hira: "む", kata: "ム", romaji: "mu" },
    { hira: "め", kata: "メ", romaji: "me" },
    { hira: "も", kata: "モ", romaji: "mo" },
  ]},
  { row: "や", items: [
    { hira: "や", kata: "ヤ", romaji: "ya" },
    null,
    { hira: "ゆ", kata: "ユ", romaji: "yu" },
    null,
    { hira: "よ", kata: "ヨ", romaji: "yo" },
  ]},
  { row: "ら", items: [
    { hira: "ら", kata: "ラ", romaji: "ra" },
    { hira: "り", kata: "リ", romaji: "ri" },
    { hira: "る", kata: "ル", romaji: "ru" },
    { hira: "れ", kata: "レ", romaji: "re" },
    { hira: "ろ", kata: "ロ", romaji: "ro" },
  ]},
  { row: "わ", items: [
    { hira: "わ", kata: "ワ", romaji: "wa" },
    null,
    null,
    null,
    { hira: "を", kata: "ヲ", romaji: "wo" },
  ]},
  { row: "ん", items: [
    { hira: "ん", kata: "ン", romaji: "n" },
    null,
    null,
    null,
    null,
  ]},
];

// ── 浊音/半浊音 ──
const dakuonList = [
  { hira: "が", kata: "ガ", romaji: "ga" },
  { hira: "ぎ", kata: "ギ", romaji: "gi" },
  { hira: "ぐ", kata: "グ", romaji: "gu" },
  { hira: "げ", kata: "ゲ", romaji: "ge" },
  { hira: "ご", kata: "ゴ", romaji: "go" },
  { hira: "ざ", kata: "ザ", romaji: "za" },
  { hira: "じ", kata: "ジ", romaji: "ji" },
  { hira: "ず", kata: "ズ", romaji: "zu" },
  { hira: "ぜ", kata: "ゼ", romaji: "ze" },
  { hira: "ぞ", kata: "ゾ", romaji: "zo" },
  { hira: "だ", kata: "ダ", romaji: "da" },
  { hira: "ぢ", kata: "ヂ", romaji: "di" },
  { hira: "づ", kata: "ヅ", romaji: "du" },
  { hira: "で", kata: "デ", romaji: "de" },
  { hira: "ど", kata: "ド", romaji: "do" },
  { hira: "ば", kata: "バ", romaji: "ba" },
  { hira: "び", kata: "ビ", romaji: "bi" },
  { hira: "ぶ", kata: "ブ", romaji: "bu" },
  { hira: "べ", kata: "ベ", romaji: "be" },
  { hira: "ぼ", kata: "ボ", romaji: "bo" },
  { hira: "ぱ", kata: "パ", romaji: "pa" },
  { hira: "ぴ", kata: "ピ", romaji: "pi" },
  { hira: "ぷ", kata: "プ", romaji: "pu" },
  { hira: "ぺ", kata: "ペ", romaji: "pe" },
  { hira: "ぽ", kata: "ポ", romaji: "po" },
];

// ── 拗音 ──
const yoonList = [
  { hira: "きゃ", kata: "キャ", romaji: "kya" },
  { hira: "きゅ", kata: "キュ", romaji: "kyu" },
  { hira: "きょ", kata: "キョ", romaji: "kyo" },
  { hira: "しゃ", kata: "シャ", romaji: "sha" },
  { hira: "しゅ", kata: "シュ", romaji: "shu" },
  { hira: "しょ", kata: "ショ", romaji: "sho" },
  { hira: "ちゃ", kata: "チャ", romaji: "cha" },
  { hira: "ちゅ", kata: "チュ", romaji: "chu" },
  { hira: "ちょ", kata: "チョ", romaji: "cho" },
  { hira: "にゃ", kata: "ニャ", romaji: "nya" },
  { hira: "にゅ", kata: "ニュ", romaji: "nyu" },
  { hira: "にょ", kata: "ニョ", romaji: "nyo" },
  { hira: "ひゃ", kata: "ヒャ", romaji: "hya" },
  { hira: "ひゅ", kata: "ヒュ", romaji: "hyu" },
  { hira: "ひょ", kata: "ヒョ", romaji: "hyo" },
  { hira: "みゃ", kata: "ミャ", romaji: "mya" },
  { hira: "みゅ", kata: "ミュ", romaji: "myu" },
  { hira: "みょ", kata: "ミョ", romaji: "myo" },
  { hira: "りゃ", kata: "リャ", romaji: "rya" },
  { hira: "りゅ", kata: "リュ", romaji: "ryu" },
  { hira: "りょ", kata: "リョ", romaji: "ryo" },
  { hira: "ぎゃ", kata: "ギャ", romaji: "gya" },
  { hira: "ぎゅ", kata: "ギュ", romaji: "gyu" },
  { hira: "ぎょ", kata: "ギョ", romaji: "gyo" },
  { hira: "じゃ", kata: "ジャ", romaji: "ja" },
  { hira: "じゅ", kata: "ジュ", romaji: "ju" },
  { hira: "じょ", kata: "ジョ", romaji: "jo" },
  { hira: "びゃ", kata: "ビャ", romaji: "bya" },
  { hira: "びゅ", kata: "ビュ", romaji: "byu" },
  { hira: "びょ", kata: "ビョ", romaji: "byo" },
  { hira: "ぴゃ", kata: "ピャ", romaji: "pya" },
  { hira: "ぴゅ", kata: "ピュ", romaji: "pyu" },
  { hira: "ぴょ", kata: "ピョ", romaji: "pyo" },
];

// ── 状态 ──
const player = ref(null);
const kanaMode = ref("hiragana");
const showRomaji = ref(true);
const repeatCount = ref(1);
const playingId = ref(null);
const loadingId = ref(null);
const playing = ref(false);
const error = ref(false);
const statusText = ref("点击任意假名卡片即可播放发音");
const repeatIndex = ref(0);

function getAudioUrl(item) {
  return "/audio/kana/" + item.romaji + ".mp3";
}

async function play(item) {
  const el = player.value;
  if (!el) return;
  if (playingId.value === item.romaji) { stopPlay(); return; }
  el.pause();
  playingId.value = item.romaji;
  loadingId.value = item.romaji;
  playing.value = false;
  error.value = false;
  repeatIndex.value = 0;
  const display = kanaMode.value === "hiragana" ? item.hira
    : kanaMode.value === "katakana" ? item.kata
    : item.hira + " / " + item.kata;
  statusText.value = "加载中：" + display + " (" + item.romaji + ")";
  el.src = getAudioUrl(item);
  el.load();
  try {
    await el.play();
    loadingId.value = null;
    playing.value = true;
    statusText.value = "播放中：" + display + " (" + item.romaji + ")";
  } catch (e) {
    loadingId.value = null;
    playingId.value = null;
    error.value = true;
    statusText.value = "音频加载失败";
  }
}

function stopPlay() {
  const el = player.value;
  if (el) { el.pause(); el.currentTime = 0; }
  playingId.value = null;
  loadingId.value = null;
  playing.value = false;
  repeatIndex.value = 0;
  statusText.value = "已停止";
  setTimeout(() => { if (!playingId.value) statusText.value = "点击任意假名卡片即可播放发音"; }, 1500);
}

function onEnded() {
  const el = player.value;
  if (!el || !playingId.value) return;
  repeatIndex.value += 1;
  if (repeatIndex.value >= repeatCount.value) {
    playingId.value = null;
    playing.value = false;
    repeatIndex.value = 0;
    statusText.value = "播放完毕";
    setTimeout(() => { if (!playingId.value) statusText.value = "点击任意假名卡片即可播放发音"; }, 1500);
    return;
  }
  el.currentTime = 0;
  el.play().catch(() => {});
  statusText.value = "播放中 · 第 " + (repeatIndex.value + 1) + "/" + repeatCount.value + " 次";
}

function onError() {
  playingId.value = null;
  loadingId.value = null;
  playing.value = false;
  error.value = true;
  repeatIndex.value = 0;
  statusText.value = "音频加载失败";
}

onMounted(() => {
  const el = player.value;
  if (el) {
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onError);
  }
});

onBeforeUnmount(() => {
  const el = player.value;
  if (el) {
    el.removeEventListener("ended", onEnded);
    el.removeEventListener("error", onError);
    el.pause();
  }
});
</script>

<style scoped>
.kana-shell {
  max-width: 1120px;
  margin: 1.5rem auto 3rem;
  padding: 0 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}

.kana-eyebrow {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--vp-c-text-3, #8a919f);
  text-transform: uppercase;
  margin: 0 0 0.3rem;
  font-family: "SF Mono", Menlo, monospace;
}

/* ── Hero ── */
.kana-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 380px);
  gap: 1.5rem;
  align-items: stretch;
  margin-bottom: 1.5rem;
  background: var(--vp-c-bg-soft, #f6f6f7);
  border: 1px solid var(--vp-c-border, #e3e5e8);
  border-radius: 12px;
  padding: 2rem 1.75rem;
}
.kana-hero-main { display: flex; flex-direction: column; justify-content: center; }
.kana-hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.1;
  margin: 0.2rem 0 0.5rem;
  color: var(--vp-c-text-1, #1f2329);
}
.kana-hero-lead {
  font-size: 1rem;
  color: var(--vp-c-text-2, #4e5969);
  margin: 0;
}
.kana-hero-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  padding: 1.25rem;
  background: var(--vp-c-bg, #fff);
  border-radius: 10px;
  border: 1px solid var(--vp-c-border, #e3e5e8);
}
.kana-summary { display: flex; gap: 1.25rem; flex-wrap: wrap; }
.kana-summary-item { display: flex; flex-direction: column; }
.kana-summary-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--theme-color, #3eaf7c);
  line-height: 1.1;
}
.kana-summary-label { font-size: 0.8rem; color: var(--vp-c-text-3, #8a919f); }
.kana-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.85rem;
  background: var(--vp-c-bg, #fff);
  border: 1px solid var(--vp-c-border, #e3e5e8);
  border-radius: 6px;
  font-size: 0.85rem;
  color: var(--vp-c-text-2, #4e5969);
  transition: all 0.2s;
}
.kana-status .status-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--vp-c-text-3, #8a919f);
  flex-shrink: 0;
}
.kana-status[data-state="playing"] { border-color: var(--theme-color, #3eaf7c); color: var(--theme-color, #3eaf7c); }
.kana-status[data-state="playing"] .status-dot { background: var(--theme-color, #3eaf7c); }
.kana-status[data-state="error"] { border-color: #f26d6d; color: #f26d6d; }
.kana-status[data-state="error"] .status-dot { background: #f26d6d; }

/* ── 设置栏 ── */
.kana-settings {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  padding: 0.85rem 1.25rem;
  background: var(--vp-c-bg-soft, #f6f6f7);
  border: 1px solid var(--vp-c-border, #e3e5e8);
  border-radius: 10px;
  margin-bottom: 1.5rem;
  align-items: center;
}
.kana-setting { display: flex; align-items: center; gap: 0.5rem; }
.setting-label {
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--vp-c-text-3, #8a919f);
  white-space: nowrap;
}
.kana-chip {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0.15rem 0.85rem;
  border: 1px solid var(--vp-c-border, #e3e5e8);
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-2, #4e5969);
  border-radius: 999px;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.kana-chip:hover { border-color: var(--theme-color, #3eaf7c); color: var(--vp-c-text-1, #1f2329); }
.kana-chip.is-active {
  background: var(--theme-color, #3eaf7c);
  border-color: var(--theme-color, #3eaf7c);
  color: #fff;
  font-weight: 600;
}
.kana-select {
  min-height: 30px;
  padding: 0.15rem 0.6rem;
  border: 1px solid var(--vp-c-border, #e3e5e8);
  border-radius: 6px;
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-1, #1f2329);
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
}

/* ── 分组 ── */
.kana-group {
  background: var(--vp-c-bg, #fff);
  border: 1px solid var(--vp-c-border, #e3e5e8);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
.kana-group-header {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--vp-c-border, #e3e5e8);
  flex-wrap: wrap;
}
.kana-group-eyebrow {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: var(--vp-c-text-3, #8a919f);
  margin: 0;
  text-transform: uppercase;
  font-family: "SF Mono", Menlo, monospace;
}
.kana-group-title {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0;
  color: var(--vp-c-text-1, #1f2329);
}
.kana-group-count {
  margin-left: auto;
  font-size: 0.85rem;
  color: var(--vp-c-text-3, #8a919f);
  background: var(--vp-c-bg-soft, #f6f6f7);
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
}

/* ── 五十音图表格 ── */
.kana-table-scroll { overflow-x: auto; }
.kana-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0.4rem;
  table-layout: fixed;
}
.kana-corner, .kana-col-head, .kana-row-head {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-3, #8a919f);
  text-align: center;
  padding: 0.4rem;
  background: var(--vp-c-bg-soft, #f6f6f7);
  border-radius: 8px;
}
.kana-corner { min-width: 3rem; }
.kana-col-head { width: 18%; }
.kana-row-head { width: 3rem; font-family: "Hiragino Sans", "Yu Gothic", "Meiryo", sans-serif; }
.kana-cell { padding: 0; text-align: center; }
.kana-empty { min-height: 3.5rem; }

/* ── 假名卡片 ── */
.kana-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  width: 100%;
  min-height: 3.75rem;
  padding: 0.5rem 0.3rem;
  background: var(--vp-c-bg-soft, #f6f6f7);
  border: 1px solid var(--vp-c-border, #e3e5e8);
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  color: var(--vp-c-text-1, #1f2329);
}
.kana-card:hover {
  border-color: var(--theme-color, #3eaf7c);
  background: var(--vp-c-bg, #fff);
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}
.kana-card.is-playing, .kana-card.is-loading {
  border-color: var(--theme-color, #3eaf7c);
  background: rgba(62, 175, 124, 0.12);
  box-shadow: 0 0 0 2px var(--theme-color, #3eaf7c);
}
.kana-card-kana {
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 1.2;
  color: var(--vp-c-text-1, #1f2329);
  font-family: "Hiragino Sans", "Yu Gothic", "Meiryo", "Noto Sans JP", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
}
.kana-card.is-playing .kana-card-kana, .kana-card.is-loading .kana-card-kana {
  color: var(--theme-color, #3eaf7c);
}
.kana-hira, .kana-kata { display: inline-block; }
.kana-kata { font-size: 0.85em; color: var(--vp-c-text-3, #8a919f); }
.kana-card.is-playing .kana-kata, .kana-card.is-loading .kana-kata {
  color: var(--theme-color, #3eaf7c);
  opacity: 0.8;
}
.kana-card-romaji {
  font-size: 0.72rem;
  color: var(--vp-c-text-3, #8a919f);
  font-family: "SF Mono", Menlo, monospace;
  letter-spacing: 0.02em;
}
.kana-play-icon {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid var(--vp-c-border, #e3e5e8);
  color: var(--vp-c-text-3, #8a919f);
  transition: all 0.15s;
}
.kana-card:hover .kana-play-icon { border-color: var(--theme-color, #3eaf7c); color: var(--theme-color, #3eaf7c); }
.is-playing .kana-play-icon, .is-loading .kana-play-icon {
  border-color: var(--theme-color, #3eaf7c);
  background: var(--theme-color, #3eaf7c);
}
.play-dot {
  width: 0; height: 0;
  border-block: 3px solid transparent;
  border-left: 4px solid currentColor;
  margin-left: 1px;
}
.is-playing .play-dot { display: none; }
.is-loading .play-dot {
  width: 6px; height: 6px;
  border: 1.5px solid #fff;
  border-right-color: transparent;
  border-radius: 50%;
  animation: kana-spin 700ms linear infinite;
}
@keyframes kana-spin { to { transform: rotate(360deg); } }

/* ── 网格布局（浊音/拗音）── */
.kana-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 0.6rem;
}
.kana-card--grid { min-height: 3.5rem; }

/* ── 页脚 ── */
.kana-footer {
  text-align: center;
  font-size: 0.82rem;
  color: var(--vp-c-text-3, #8a919f);
  padding: 1rem;
  line-height: 1.8;
  border-top: 1px solid var(--vp-c-border, #e3e5e8);
  margin-top: 1rem;
}
.kana-footer p { margin: 0.2rem 0; }

/* ── 响应式 ── */
@media (max-width: 820px) {
  .kana-hero { grid-template-columns: 1fr; padding: 1.5rem 1.25rem; }
}
@media (max-width: 460px) {
  .kana-shell { padding: 0 0.5rem; }
  .kana-hero, .kana-group, .kana-settings { padding: 1rem; }
  .kana-card-kana { font-size: 1.35rem; }
  .kana-grid { grid-template-columns: repeat(auto-fill, minmax(72px, 1fr)); }
  .kana-table { border-spacing: 0.25rem; }
  .kana-col-head, .kana-row-head { font-size: 0.72rem; padding: 0.25rem; }
}
</style>
