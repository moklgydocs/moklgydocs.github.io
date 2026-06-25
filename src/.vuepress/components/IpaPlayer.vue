<template>
  <div class="ipa-shell">
    <!-- Hero -->
    <section class="ipa-hero">
      <div class="ipa-hero-main">
        <p class="ipa-eyebrow">ENGLISH IPA · 48 PHONETIC SYMBOLS</p>
        <h1 class="ipa-hero-title">音标有谱</h1>
        <p class="ipa-hero-lead">点击音标听一遍，停下来模仿，再继续下一个声音。</p>
        <p class="ipa-hero-tip">建议顺序：先听元音，再听辅音；遇到相近音时连续点听，比较口型和气流差别。</p>
      </div>
      <div class="ipa-hero-panel">
        <div class="ipa-summary">
          <div class="ipa-summary-item">
            <span class="ipa-summary-number">48</span>
            <span class="ipa-summary-label">音标</span>
          </div>
          <div class="ipa-summary-item">
            <span class="ipa-summary-number">2</span>
            <span class="ipa-summary-label">大类</span>
          </div>
        </div>
        <div class="ipa-status" :data-state="error ? 'error' : playing ? 'playing' : 'idle'">
          <span class="status-dot"></span>
          <span class="status-text">{{ statusText }}</span>
        </div>
      </div>
    </section>

    <!-- 设置栏 -->
    <section class="ipa-settings">
      <div class="ipa-setting">
        <span class="setting-label">括号</span>
        <button class="ipa-chip" :class="{ 'is-active': wrapper === 'bracket' }" @click="setWrapper('bracket')">[ ]</button>
        <button class="ipa-chip" :class="{ 'is-active': wrapper === 'slash' }" @click="setWrapper('slash')">/ /</button>
      </div>
      <div class="ipa-setting">
        <span class="setting-label">循环</span>
        <select v-model.number="repeatCount" class="ipa-select">
          <option v-for="n in 5" :key="n" :value="n">{{ n }} 次</option>
        </select>
      </div>
    </section>

    <!-- 字母读音 -->
    <section class="ipa-letter-section">
      <header class="ipa-section-header">
        <p class="ipa-eyebrow">letter sounds</p>
        <h2 class="ipa-section-title">字母读音</h2>
        <p class="ipa-section-desc">示例词音标使用美式国际音标（IPA）</p>
      </header>
      <div class="letter-tabs">
        <button
          v-for="g in letterPronunciations"
          :key="g.letter"
          class="letter-tab"
          :class="{ 'is-active': activeLetter === g.letter }"
          @click="activeLetter = g.letter"
        >{{ g.letter }}</button>
      </div>
      <div
        v-if="currentLetterGroup"
        :key="currentLetterGroup.letter"
        class="letter-panel"
      >
        <div class="letter-panel-head">
          <span class="letter-big">{{ currentLetterGroup.letter }}</span>
          <span class="letter-count">{{ currentLetterGroup.pronunciations.length }} 种读音</span>
        </div>
        <div class="letter-sounds">
          <button
            v-for="(item, idx) in currentLetterGroup.pronunciations"
            :key="idx"
            class="letter-sound"
            :class="{
              'is-playing': playingId === (item.phonemeId || currentLetterGroup.letter + '-' + idx),
              'is-loading': loadingId === (item.phonemeId || currentLetterGroup.letter + '-' + idx),
            }"
            :disabled="!item.phonemeId"
            @click="playLetter(item, currentLetterGroup.letter + '-' + idx)"
          >
            <div class="letter-sound-head">
              <span class="letter-sound-symbol">{{ formatSymbol(item.symbol) }}</span>
              <span v-if="item.kind" class="letter-kind-badge">{{ letterKindLabels[item.kind] }}</span>
              <span class="play-indicator">
                <span class="play-icon"><span></span><span></span></span>
              </span>
            </div>
            <div class="letter-sound-examples">
              <span v-for="(ex, i) in item.examples" :key="i" class="letter-sound-word">
                <span class="word-text">{{ ex.w }}</span>
                <span class="word-ipa">{{ ex.ipa }}</span>
              </span>
            </div>
            <p v-if="item.note" class="letter-sound-note">{{ item.note }}</p>
          </button>
        </div>
      </div>
    </section>

    <!-- 筛选 -->
    <section class="ipa-filters">
      <div class="ipa-filter-row">
        <span class="ipa-filter-label">范围</span>
        <button v-for="opt in rangeFilters" :key="opt.id" class="ipa-chip" :class="{ 'is-active': activeFilter === opt.id }" @click="activeFilter = opt.id">{{ opt.label }}</button>
      </div>
      <div class="ipa-filter-row">
        <span class="ipa-filter-label">元音</span>
        <button v-for="opt in vowelFilters" :key="opt.id" class="ipa-chip" :class="{ 'is-active': activeFilter === opt.id }" @click="activeFilter = opt.id">{{ opt.label }}</button>
      </div>
      <div class="ipa-filter-row">
        <span class="ipa-filter-label">辅音方式</span>
        <button v-for="opt in mannerFilters" :key="opt.id" class="ipa-chip" :class="{ 'is-active': activeFilter === opt.id }" @click="activeFilter = opt.id">{{ opt.label }}</button>
      </div>
      <div class="ipa-filter-row">
        <span class="ipa-filter-label">清浊</span>
        <button v-for="opt in voicingFilters" :key="opt.id" class="ipa-chip" :class="{ 'is-active': activeFilter === opt.id }" @click="activeFilter = opt.id">{{ opt.label }}</button>
      </div>
    </section>

    <!-- 音标分组 -->
    <section class="ipa-groups">
      <article
        v-for="group in visibleGroups"
        :key="group.category"
        class="ipa-group"
      >
        <header class="ipa-group-header">
          <p class="ipa-group-eyebrow">{{ group.eyebrow }}</p>
          <h2 class="ipa-group-title">{{ group.title }}</h2>
          <span class="ipa-group-count">{{ group.items.length }} 个</span>
        </header>
        <div class="ipa-grid">
          <button
            v-for="item in group.items"
            :key="item.id"
            class="ipa-symbol"
            :class="{
              'is-playing': playingId === item.id,
              'is-loading': loadingId === item.id,
            }"
            @click="play(item)"
          >
            <span class="play-indicator">
              <span class="play-icon"><span></span><span></span></span>
            </span>
            <span class="ipa-symbol-text">{{ formatSymbol(item.symbol) }}</span>
          </button>
        </div>
      </article>
    </section>

    <!-- 页脚 -->
    <footer class="ipa-footer">
      <p>本项目仅用于学习目的，音频内容版权归 <a href="https://www.yyybabc.com/" target="_blank" rel="noopener">yyybabc.com</a> 所有。</p>
      <p>参考：<a href="https://github.com/resetsix/english-ipa" target="_blank" rel="noopener">resetsix/english-ipa</a></p>
    </footer>

    <audio ref="player" preload="none"></audio>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

// ── 数据 ──
const phoneticSymbols = [
  // 单元音 12
  { id: "vowel-i-long", symbol: "iː", letters: ["ee", "ea", "e"], category: "monophthong", family: "vowel", audio: "/audio/vowel-i-long.mp3", length: "long", examples: ["see", "tree", "green"] },
  { id: "vowel-i-short", symbol: "ɪ", letters: ["i", "y"], category: "monophthong", family: "vowel", audio: "/audio/vowel-i-short.mp3", length: "short", examples: ["sit", "big", "city"] },
  { id: "vowel-e-short", symbol: "e", letters: ["e", "ea"], category: "monophthong", family: "vowel", audio: "/audio/vowel-e-short.mp3", length: "short", examples: ["bed", "head", "red"] },
  { id: "vowel-ae-short", symbol: "æ", letters: ["a"], category: "monophthong", family: "vowel", audio: "/audio/vowel-ae-short.mp3", length: "short", examples: ["cat", "map", "bad"] },
  { id: "vowel-er-long", symbol: "ɜː", letters: ["er", "ir", "ur"], category: "monophthong", family: "vowel", audio: "/audio/vowel-er-long.mp3", length: "long", examples: ["her", "bird", "turn"] },
  { id: "vowel-schwa-short", symbol: "ə", letters: ["a", "e", "o"], category: "monophthong", family: "vowel", audio: "/audio/vowel-schwa-short.mp3", length: "short", examples: ["about", "open", "teacher"] },
  { id: "vowel-uh-short", symbol: "ʌ", letters: ["u", "o", "ou"], category: "monophthong", family: "vowel", audio: "/audio/vowel-uh-short.mp3", length: "short", examples: ["cup", "love", "come"] },
  { id: "vowel-a-long", symbol: "ɑː", letters: ["ar", "a"], category: "monophthong", family: "vowel", audio: "/audio/vowel-a-long.mp3", length: "long", examples: ["car", "father", "arm"] },
  { id: "vowel-o-short", symbol: "ɒ", letters: ["o", "a"], category: "monophthong", family: "vowel", audio: "/audio/vowel-o-short.mp3", length: "short", examples: ["hot", "box", "watch"] },
  { id: "vowel-aw-long", symbol: "ɔː", letters: ["aw", "or", "au"], category: "monophthong", family: "vowel", audio: "/audio/vowel-aw-long.mp3", length: "long", examples: ["law", "door", "autumn"] },
  { id: "vowel-u-short", symbol: "ʊ", letters: ["oo", "u"], category: "monophthong", family: "vowel", audio: "/audio/vowel-u-short.mp3", length: "short", examples: ["book", "good", "put"] },
  { id: "vowel-u-long", symbol: "uː", letters: ["oo", "u", "ew"], category: "monophthong", family: "vowel", audio: "/audio/vowel-u-long.mp3", length: "long", examples: ["food", "blue", "new"] },
  // 双元音 8
  { id: "diphthong-ei", symbol: "eɪ", letters: ["a", "ai", "ay"], category: "diphthong", family: "vowel", audio: "/audio/diphthong-ei.mp3", examples: ["day", "rain", "play"] },
  { id: "diphthong-ai", symbol: "aɪ", letters: ["i", "y", "igh"], category: "diphthong", family: "vowel", audio: "/audio/diphthong-ai.mp3", examples: ["my", "time", "high"] },
  { id: "diphthong-oi", symbol: "ɔɪ", letters: ["oi", "oy"], category: "diphthong", family: "vowel", audio: "/audio/diphthong-oi.mp3", examples: ["boy", "oil", "toy"] },
  { id: "diphthong-ou", symbol: "əʊ", letters: ["o", "oa", "ow"], category: "diphthong", family: "vowel", audio: "/audio/diphthong-ou.mp3", examples: ["go", "boat", "low"] },
  { id: "diphthong-au", symbol: "aʊ", letters: ["ou", "ow"], category: "diphthong", family: "vowel", audio: "/audio/diphthong-au.mp3", examples: ["now", "house", "cow"] },
  { id: "diphthong-ear", symbol: "ɪə", letters: ["ear", "eer", "ere"], category: "diphthong", family: "vowel", audio: "/audio/diphthong-ear.mp3", examples: ["ear", "beer", "here"] },
  { id: "diphthong-air", symbol: "eə", letters: ["air", "are", "ear"], category: "diphthong", family: "vowel", audio: "/audio/diphthong-air.mp3", examples: ["air", "care", "hair"] },
  { id: "diphthong-ure", symbol: "ʊə", letters: ["ure", "our"], category: "diphthong", family: "vowel", audio: "/audio/diphthong-ure.mp3", examples: ["sure", "tour", "pure"] },
  // 爆破音 6
  { id: "consonant-p", symbol: "p", letters: ["p", "pp"], category: "consonant", family: "consonant", audio: "/audio/consonant-p.mp3", manner: "plosive", voicing: "voiceless", examples: ["pen", "happy", "cup"] },
  { id: "consonant-b", symbol: "b", letters: ["b", "bb"], category: "consonant", family: "consonant", audio: "/audio/consonant-b.mp3", manner: "plosive", voicing: "voiced", examples: ["book", "rabbit", "cab"] },
  { id: "consonant-t", symbol: "t", letters: ["t", "tt"], category: "consonant", family: "consonant", audio: "/audio/consonant-t.mp3", manner: "plosive", voicing: "voiceless", examples: ["tea", "better", "cat"] },
  { id: "consonant-d", symbol: "d", letters: ["d", "dd"], category: "consonant", family: "consonant", audio: "/audio/consonant-d.mp3", manner: "plosive", voicing: "voiced", examples: ["day", "ladder", "bed"] },
  { id: "consonant-k", symbol: "k", letters: ["c", "k", "ck"], category: "consonant", family: "consonant", audio: "/audio/consonant-k.mp3", manner: "plosive", voicing: "voiceless", examples: ["key", "cat", "back"] },
  { id: "consonant-g", symbol: "g", letters: ["g", "gg"], category: "consonant", family: "consonant", audio: "/audio/consonant-g.mp3", manner: "plosive", voicing: "voiced", examples: ["go", "bigger", "bag"] },
  // 摩擦音 10
  { id: "consonant-f", symbol: "f", letters: ["f", "ff", "ph"], category: "consonant", family: "consonant", audio: "/audio/consonant-f.mp3", manner: "fricative", voicing: "voiceless", examples: ["fish", "coffee", "phone"] },
  { id: "consonant-v", symbol: "v", letters: ["v", "ve"], category: "consonant", family: "consonant", audio: "/audio/consonant-v.mp3", manner: "fricative", voicing: "voiced", examples: ["van", "love", "very"] },
  { id: "consonant-s", symbol: "s", letters: ["s", "ss", "c"], category: "consonant", family: "consonant", audio: "/audio/consonant-s.mp3", manner: "fricative", voicing: "voiceless", examples: ["sun", "miss", "city"] },
  { id: "consonant-z", symbol: "z", letters: ["z", "s"], category: "consonant", family: "consonant", audio: "/audio/consonant-z.mp3", manner: "fricative", voicing: "voiced", examples: ["zoo", "nose", "is"] },
  { id: "consonant-th-soft", symbol: "θ", letters: ["th"], category: "consonant", family: "consonant", audio: "/audio/consonant-th-soft.mp3", manner: "fricative", voicing: "voiceless", examples: ["think", "bath", "three"] },
  { id: "consonant-th-voice", symbol: "ð", letters: ["th"], category: "consonant", family: "consonant", audio: "/audio/consonant-th-voice.mp3", manner: "fricative", voicing: "voiced", examples: ["this", "mother", "the"] },
  { id: "consonant-sh", symbol: "ʃ", letters: ["sh", "ti", "ci"], category: "consonant", family: "consonant", audio: "/audio/consonant-sh.mp3", manner: "fricative", voicing: "voiceless", examples: ["she", "nation", "special"] },
  { id: "consonant-zh", symbol: "ʒ", letters: ["s", "si"], category: "consonant", family: "consonant", audio: "/audio/consonant-zh.mp3", manner: "fricative", voicing: "voiced", examples: ["measure", "vision", "pleasure"] },
  { id: "consonant-h", symbol: "h", letters: ["h", "wh"], category: "consonant", family: "consonant", audio: "/audio/consonant-h.mp3", manner: "fricative", voicing: "voiceless", examples: ["hat", "who", "behind"] },
  { id: "consonant-r", symbol: "r", letters: ["r", "rr"], category: "consonant", family: "consonant", audio: "/audio/consonant-r.mp3", manner: "fricative", voicing: "voiced", examples: ["red", "sorry", "write"] },
  // 破擦音 6
  { id: "consonant-ch", symbol: "tʃ", letters: ["ch", "tch"], category: "consonant", family: "consonant", audio: "/audio/consonant-ch.mp3", manner: "affricate", voicing: "voiceless", examples: ["chair", "watch", "church"] },
  { id: "consonant-j", symbol: "dʒ", letters: ["j", "g", "dge"], category: "consonant", family: "consonant", audio: "/audio/consonant-j.mp3", manner: "affricate", voicing: "voiced", examples: ["jump", "giant", "bridge"] },
  { id: "consonant-tr", symbol: "tr", letters: ["tr"], category: "consonant", family: "consonant", audio: "/audio/consonant-tr.mp3", manner: "affricate", voicing: "voiceless", examples: ["tree", "try", "train"] },
  { id: "consonant-dr", symbol: "dr", letters: ["dr"], category: "consonant", family: "consonant", audio: "/audio/consonant-dr.mp3", manner: "affricate", voicing: "voiced", examples: ["drink", "drive", "dream"] },
  { id: "consonant-ts", symbol: "ts", letters: ["ts"], category: "consonant", family: "consonant", audio: "/audio/consonant-ts.mp3", manner: "affricate", voicing: "voiceless", examples: ["cats", "bits", "sports"] },
  { id: "consonant-dz", symbol: "dz", letters: ["ds", "dz"], category: "consonant", family: "consonant", audio: "/audio/consonant-dz.mp3", manner: "affricate", voicing: "voiced", examples: ["beds", "birds", "words"] },
  // 鼻音 3
  { id: "consonant-m", symbol: "m", letters: ["m", "mm"], category: "consonant", family: "consonant", audio: "/audio/consonant-m.mp3", manner: "nasal", voicing: "voiced", examples: ["man", "summer", "swim"] },
  { id: "consonant-n", symbol: "n", letters: ["n", "nn"], category: "consonant", family: "consonant", audio: "/audio/consonant-n.mp3", manner: "nasal", voicing: "voiced", examples: ["no", "dinner", "sun"] },
  { id: "consonant-ng", symbol: "ŋ", letters: ["ng", "n"], category: "consonant", family: "consonant", audio: "/audio/consonant-ng.mp3", manner: "nasal", voicing: "voiced", examples: ["sing", "ring", "think"] },
  // 边音 1
  { id: "consonant-l", symbol: "l", letters: ["l", "ll"], category: "consonant", family: "consonant", audio: "/audio/consonant-l.mp3", manner: "lateral", voicing: "voiced", examples: ["love", "tall", "light"] },
  // 半元音 2
  { id: "consonant-w", symbol: "w", letters: ["w", "wh"], category: "consonant", family: "consonant", audio: "/audio/consonant-w.mp3", manner: "semivowel", voicing: "voiced", examples: ["we", "white", "window"] },
  { id: "consonant-y", symbol: "j", letters: ["y"], category: "consonant", family: "consonant", audio: "/audio/consonant-y.mp3", manner: "semivowel", voicing: "voiced", examples: ["yes", "yellow", "you"] },
];

const letterKindLabels = {
  common: "常见音", hard: "硬音", soft: "软音",
  reduced: "弱读", cluster: "组合音", silent: "静音", minor: "少数词",
};

// 字母读音数据：examples 每项为 { w: 单词, ipa: 单词音标 }
const letterPronunciations = [
  { letter: "A", pronunciations: [
    { phonemeId: "diphthong-ei", symbol: "eɪ", kind: "common", examples: [{w:"name",ipa:"/neɪm/"},{w:"cake",ipa:"/keɪk/"},{w:"late",ipa:"/leɪt/"},{w:"game",ipa:"/geɪm/"}] },
    { phonemeId: "vowel-ae-short", symbol: "æ", kind: "common", examples: [{w:"cat",ipa:"/kæt/"},{w:"apple",ipa:"/ˈæpəl/"},{w:"bag",ipa:"/bæg/"},{w:"hat",ipa:"/hæt/"}] },
    { phonemeId: "vowel-a-long", symbol: "ɑː", kind: "common", examples: [{w:"car",ipa:"/kɑːr/"},{w:"father",ipa:"/ˈfɑːðər/"},{w:"class",ipa:"/klæs/"},{w:"park",ipa:"/pɑːrk/"}] },
    { phonemeId: "vowel-aw-long", symbol: "ɔː", kind: "common", examples: [{w:"all",ipa:"/ɔːl/"},{w:"water",ipa:"/ˈwɔːtər/"},{w:"talk",ipa:"/tɔːk/"},{w:"ball",ipa:"/bɔːl/"}] },
    { phonemeId: "vowel-schwa-short", symbol: "ə", kind: "reduced", examples: [{w:"about",ipa:"/əˈbaʊt/"},{w:"ago",ipa:"/əˈgoʊ/"},{w:"sofa",ipa:"/ˈsoʊfə/"},{w:"banana",ipa:"/bəˈnænə/"}] },
  ]},
  { letter: "B", pronunciations: [
    { phonemeId: "consonant-b", symbol: "b", kind: "common", examples: [{w:"bad",ipa:"/bæd/"},{w:"boy",ipa:"/bɔɪ/"},{w:"book",ipa:"/bʊk/"},{w:"baby",ipa:"/ˈbeɪbi/"}] },
  ]},
  { letter: "C", pronunciations: [
    { phonemeId: "consonant-k", symbol: "k", kind: "hard", examples: [{w:"cat",ipa:"/kæt/"},{w:"cup",ipa:"/kʌp/"},{w:"music",ipa:"/ˈmjuːzɪk/"},{w:"coat",ipa:"/koʊt/"}] },
    { phonemeId: "consonant-s", symbol: "s", kind: "soft", examples: [{w:"city",ipa:"/ˈsɪti/"},{w:"cell",ipa:"/sel/"},{w:"face",ipa:"/feɪs/"},{w:"nice",ipa:"/naɪs/"}] },
    { phonemeId: "consonant-ch", symbol: "tʃ", kind: "common", examples: [{w:"cello",ipa:"/ˈtʃeloʊ/"},{w:"church",ipa:"/tʃɜːrtʃ/"},{w:"much",ipa:"/mʌtʃ/"},{w:"child",ipa:"/tʃaɪld/"}] },
  ]},
  { letter: "D", pronunciations: [
    { phonemeId: "consonant-d", symbol: "d", kind: "common", examples: [{w:"dog",ipa:"/dɔːɡ/"},{w:"day",ipa:"/deɪ/"},{w:"desk",ipa:"/desk/"},{w:"red",ipa:"/red/"}] },
    { phonemeId: "consonant-j", symbol: "dʒ", kind: "common", examples: [{w:"educate",ipa:"/ˈedʒukeɪt/"},{w:"soldier",ipa:"/ˈsoʊldʒər/"},{w:"procedure",ipa:"/prəˈsiːdʒər/"},{w:"edge",ipa:"/edʒ/"}] },
  ]},
  { letter: "E", pronunciations: [
    { phonemeId: "vowel-e-short", symbol: "e", kind: "common", examples: [{w:"bed",ipa:"/bed/"},{w:"pen",ipa:"/pen/"},{w:"egg",ipa:"/eɡ/"},{w:"red",ipa:"/red/"}] },
    { phonemeId: "vowel-i-long", symbol: "iː", kind: "common", examples: [{w:"he",ipa:"/hiː/"},{w:"she",ipa:"/ʃiː/"},{w:"even",ipa:"/ˈiːvən/"},{w:"me",ipa:"/miː/"}] },
    { phonemeId: "vowel-schwa-short", symbol: "ə", kind: "reduced", examples: [{w:"open",ipa:"/ˈoʊpən/"},{w:"silent",ipa:"/ˈsaɪlənt/"},{w:"problem",ipa:"/ˈprɑːbləm/"},{w:"moment",ipa:"/ˈmoʊmənt/"}] },
    { phonemeId: "vowel-er-long", symbol: "ɜː", kind: "common", examples: [{w:"her",ipa:"/hɜːr/"},{w:"term",ipa:"/tɜːrm/"},{w:"serve",ipa:"/sɜːrv/"},{w:"verb",ipa:"/vɜːrb/"}] },
    { phonemeId: "diphthong-ear", symbol: "ɪə", kind: "common", examples: [{w:"here",ipa:"/hɪər/"},{w:"mere",ipa:"/mɪər/"},{w:"sphere",ipa:"/sfɪər/"},{w:"deer",ipa:"/dɪər/"}] },
  ]},
  { letter: "F", pronunciations: [
    { phonemeId: "consonant-f", symbol: "f", kind: "common", examples: [{w:"fish",ipa:"/fɪʃ/"},{w:"food",ipa:"/fuːd/"},{w:"leaf",ipa:"/liːf/"},{w:"four",ipa:"/fɔːr/"}] },
  ]},
  { letter: "G", pronunciations: [
    { phonemeId: "consonant-g", symbol: "g", kind: "hard", examples: [{w:"go",ipa:"/ɡoʊ/"},{w:"game",ipa:"/ɡeɪm/"},{w:"big",ipa:"/bɪɡ/"},{w:"green",ipa:"/ɡriːn/"}] },
    { phonemeId: "consonant-j", symbol: "dʒ", kind: "soft", examples: [{w:"giant",ipa:"/ˈdʒaɪənt/"},{w:"gym",ipa:"/dʒɪm/"},{w:"age",ipa:"/eɪdʒ/"},{w:"gem",ipa:"/dʒem/"}] },
  ]},
  { letter: "H", pronunciations: [
    { phonemeId: "consonant-h", symbol: "h", kind: "common", examples: [{w:"he",ipa:"/hiː/"},{w:"hat",ipa:"/hæt/"},{w:"house",ipa:"/haʊs/"},{w:"home",ipa:"/hoʊm/"}] },
  ]},
  { letter: "I", pronunciations: [
    { phonemeId: "diphthong-ai", symbol: "aɪ", kind: "common", examples: [{w:"time",ipa:"/taɪm/"},{w:"bike",ipa:"/baɪk/"},{w:"find",ipa:"/faɪnd/"},{w:"like",ipa:"/laɪk/"}] },
    { phonemeId: "vowel-i-short", symbol: "ɪ", kind: "common", examples: [{w:"sit",ipa:"/sɪt/"},{w:"fish",ipa:"/fɪʃ/"},{w:"milk",ipa:"/mɪlk/"},{w:"big",ipa:"/bɪɡ/"}] },
    { phonemeId: "vowel-er-long", symbol: "ɜː", kind: "common", examples: [{w:"bird",ipa:"/bɜːrd/"},{w:"girl",ipa:"/ɡɜːrl/"},{w:"first",ipa:"/fɜːrst/"},{w:"shirt",ipa:"/ʃɜːrt/"}] },
    { phonemeId: "vowel-schwa-short", symbol: "ə", kind: "reduced", examples: [{w:"pencil",ipa:"/ˈpensəl/"},{w:"possible",ipa:"/ˈpɑːsəbl/"},{w:"family",ipa:"/ˈfæməli/"},{w:"cousin",ipa:"/ˈkʌzən/"}] },
    { phonemeId: "vowel-i-long", symbol: "iː", kind: "common", examples: [{w:"machine",ipa:"/məˈʃiːn/"},{w:"police",ipa:"/pəˈliːs/"},{w:"ski",ipa:"/skiː/"},{w:"taxi",ipa:"/ˈtæksi/"}] },
  ]},
  { letter: "J", pronunciations: [
    { phonemeId: "consonant-j", symbol: "dʒ", kind: "common", examples: [{w:"jam",ipa:"/dʒæm/"},{w:"job",ipa:"/dʒɑːb/"},{w:"June",ipa:"/dʒuːn/"},{w:"jump",ipa:"/dʒʌmp/"}] },
  ]},
  { letter: "K", pronunciations: [
    { phonemeId: "consonant-k", symbol: "k", kind: "common", examples: [{w:"kite",ipa:"/kaɪt/"},{w:"keep",ipa:"/kiːp/"},{w:"book",ipa:"/bʊk/"},{w:"key",ipa:"/kiː/"}] },
  ]},
  { letter: "L", pronunciations: [
    { phonemeId: "consonant-l", symbol: "l", kind: "common", examples: [{w:"leg",ipa:"/leɡ/"},{w:"light",ipa:"/laɪt/"},{w:"full",ipa:"/fʊl/"},{w:"tall",ipa:"/tɔːl/"}] },
  ]},
  { letter: "M", pronunciations: [
    { phonemeId: "consonant-m", symbol: "m", kind: "common", examples: [{w:"man",ipa:"/mæn/"},{w:"moon",ipa:"/muːn/"},{w:"time",ipa:"/taɪm/"},{w:"milk",ipa:"/mɪlk/"}] },
  ]},
  { letter: "N", pronunciations: [
    { phonemeId: "consonant-n", symbol: "n", kind: "common", examples: [{w:"no",ipa:"/noʊ/"},{w:"name",ipa:"/neɪm/"},{w:"ten",ipa:"/ten/"},{w:"nine",ipa:"/naɪn/"}] },
    { phonemeId: "consonant-ng", symbol: "ŋ", kind: "common", examples: [{w:"bank",ipa:"/bæŋk/"},{w:"think",ipa:"/θɪŋk/"},{w:"uncle",ipa:"/ˈʌŋkl/"},{w:"long",ipa:"/lɔːŋ/"}] },
  ]},
  { letter: "O", pronunciations: [
    { phonemeId: "diphthong-ou", symbol: "əʊ", kind: "common", examples: [{w:"go",ipa:"/ɡoʊ/"},{w:"home",ipa:"/hoʊm/"},{w:"note",ipa:"/noʊt/"},{w:"old",ipa:"/oʊld/"}] },
    { phonemeId: "vowel-o-short", symbol: "ɒ", kind: "common", examples: [{w:"hot",ipa:"/hɑːt/"},{w:"dog",ipa:"/dɔːɡ/"},{w:"box",ipa:"/bɑːks/"},{w:"not",ipa:"/nɑːt/"}] },
    { phonemeId: "vowel-uh-short", symbol: "ʌ", kind: "common", examples: [{w:"son",ipa:"/sʌn/"},{w:"love",ipa:"/lʌv/"},{w:"come",ipa:"/kʌm/"},{w:"money",ipa:"/ˈmʌni/"}] },
    { phonemeId: "vowel-u-long", symbol: "uː", kind: "common", examples: [{w:"do",ipa:"/duː/"},{w:"move",ipa:"/muːv/"},{w:"who",ipa:"/huː/"},{w:"shoe",ipa:"/ʃuː/"}] },
    { phonemeId: "vowel-aw-long", symbol: "ɔː", kind: "common", examples: [{w:"or",ipa:"/ɔːr/"},{w:"horse",ipa:"/hɔːrs/"},{w:"more",ipa:"/mɔːr/"},{w:"door",ipa:"/dɔːr/"}] },
    { phonemeId: "vowel-schwa-short", symbol: "ə", kind: "reduced", examples: [{w:"today",ipa:"/təˈdeɪ/"},{w:"common",ipa:"/ˈkɑːmən/"},{w:"control",ipa:"/kənˈtroʊl/"},{w:"lemon",ipa:"/ˈlemən/"}] },
  ]},
  { letter: "P", pronunciations: [
    { phonemeId: "consonant-p", symbol: "p", kind: "common", examples: [{w:"pen",ipa:"/pen/"},{w:"map",ipa:"/mæp/"},{w:"happy",ipa:"/ˈhæpi/"},{w:"park",ipa:"/pɑːrk/"}] },
  ]},
  { letter: "Q", pronunciations: [
    { phonemeId: "consonant-k", symbol: "k", kind: "common", examples: [{w:"quit",ipa:"/kwɪt/"},{w:"queen",ipa:"/kwiːn/"},{w:"question",ipa:"/ˈkwestʃən/"},{w:"quick",ipa:"/kwɪk/"}] },
  ]},
  { letter: "R", pronunciations: [
    { phonemeId: "consonant-r", symbol: "r", kind: "common", examples: [{w:"red",ipa:"/red/"},{w:"rain",ipa:"/reɪn/"},{w:"write",ipa:"/raɪt/"},{w:"run",ipa:"/rʌn/"}] },
  ]},
  { letter: "S", pronunciations: [
    { phonemeId: "consonant-s", symbol: "s", kind: "common", examples: [{w:"see",ipa:"/siː/"},{w:"sun",ipa:"/sʌn/"},{w:"bus",ipa:"/bʌs/"},{w:"class",ipa:"/klæs/"}] },
    { phonemeId: "consonant-z", symbol: "z", kind: "common", examples: [{w:"is",ipa:"/ɪz/"},{w:"rose",ipa:"/roʊz/"},{w:"music",ipa:"/ˈmjuːzɪk/"},{w:"his",ipa:"/hɪz/"}] },
    { phonemeId: "consonant-sh", symbol: "ʃ", kind: "common", examples: [{w:"sugar",ipa:"/ˈʃʊɡər/"},{w:"sure",ipa:"/ʃʊr/"},{w:"Asia",ipa:"/ˈeɪʒə/"},{w:"issue",ipa:"/ˈɪʃuː/"}] },
    { phonemeId: "consonant-zh", symbol: "ʒ", kind: "common", examples: [{w:"vision",ipa:"/ˈvɪʒən/"},{w:"usual",ipa:"/ˈjuːʒuəl/"},{w:"measure",ipa:"/ˈmeʒər/"},{w:"treasure",ipa:"/ˈtreʒər/"}] },
  ]},
  { letter: "T", pronunciations: [
    { phonemeId: "consonant-t", symbol: "t", kind: "common", examples: [{w:"tea",ipa:"/tiː/"},{w:"top",ipa:"/tɑːp/"},{w:"cat",ipa:"/kæt/"},{w:"ten",ipa:"/ten/"}] },
    { phonemeId: "consonant-sh", symbol: "ʃ", kind: "common", examples: [{w:"nation",ipa:"/ˈneɪʃən/"},{w:"patient",ipa:"/ˈpeɪʃənt/"},{w:"station",ipa:"/ˈsteɪʃən/"},{w:"action",ipa:"/ˈækʃən/"}] },
    { phonemeId: "consonant-ch", symbol: "tʃ", kind: "common", examples: [{w:"nature",ipa:"/ˈneɪtʃər/"},{w:"question",ipa:"/ˈkwestʃən/"},{w:"future",ipa:"/ˈfjuːtʃər/"},{w:"picture",ipa:"/ˈpɪktʃər/"}] },
  ]},
  { letter: "U", pronunciations: [
    { phonemeId: "vowel-uh-short", symbol: "ʌ", kind: "common", examples: [{w:"cup",ipa:"/kʌp/"},{w:"sun",ipa:"/sʌn/"},{w:"much",ipa:"/mʌtʃ/"},{w:"bus",ipa:"/bʌs/"}] },
    { phonemeId: "vowel-u-long", symbol: "uː", kind: "common", examples: [{w:"rule",ipa:"/ruːl/"},{w:"June",ipa:"/dʒuːn/"},{w:"blue",ipa:"/bluː/"},{w:"use",ipa:"/juːz/"}] },
    { phonemeId: "vowel-u-short", symbol: "ʊ", kind: "common", examples: [{w:"put",ipa:"/pʊt/"},{w:"push",ipa:"/pʊʃ/"},{w:"full",ipa:"/fʊl/"},{w:"pull",ipa:"/pʊl/"}] },
    { phonemeId: "vowel-er-long", symbol: "ɜː", kind: "common", examples: [{w:"turn",ipa:"/tɜːrn/"},{w:"burn",ipa:"/bɜːrn/"},{w:"nurse",ipa:"/nɜːrs/"},{w:"fur",ipa:"/fɜːr/"}] },
    { phonemeId: "vowel-schwa-short", symbol: "ə", kind: "reduced", examples: [{w:"support",ipa:"/səˈpɔːrt/"},{w:"upon",ipa:"/əˈpɑːn/"},{w:"campus",ipa:"/ˈkæmpəs/"},{w:"focus",ipa:"/ˈfoʊkəs/"}] },
    { phonemeId: "diphthong-ure", symbol: "ʊə", kind: "common", examples: [{w:"pure",ipa:"/pjʊər/"},{w:"cure",ipa:"/kjʊər/"},{w:"secure",ipa:"/sɪˈkjʊər/"},{w:"sure",ipa:"/ʃʊər/"}] },
  ]},
  { letter: "V", pronunciations: [
    { phonemeId: "consonant-v", symbol: "v", kind: "common", examples: [{w:"very",ipa:"/ˈveri/"},{w:"voice",ipa:"/vɔɪs/"},{w:"five",ipa:"/faɪv/"},{w:"van",ipa:"/væn/"}] },
  ]},
  { letter: "W", pronunciations: [
    { phonemeId: "consonant-w", symbol: "w", kind: "common", examples: [{w:"we",ipa:"/wiː/"},{w:"water",ipa:"/ˈwɔːtər/"},{w:"twin",ipa:"/twɪn/"},{w:"win",ipa:"/wɪn/"}] },
  ]},
  { letter: "X", pronunciations: [
    { symbol: "ks", kind: "cluster", note: "组合音，无单独音频", examples: [{w:"box",ipa:"/bɑːks/"},{w:"six",ipa:"/sɪks/"},{w:"text",ipa:"/tekst/"},{w:"next",ipa:"/nekst/"}] },
    { symbol: "gz", kind: "cluster", note: "组合音，无单独音频", examples: [{w:"exam",ipa:"/ɪɡˈzæm/"},{w:"exist",ipa:"/ɪɡˈzɪst/"},{w:"exactly",ipa:"/ɪɡˈzæktli/"}] },
    { phonemeId: "consonant-z", symbol: "z", kind: "minor", examples: [{w:"xylophone",ipa:"/ˈzaɪləfoʊn/"},{w:"xylem",ipa:"/ˈzaɪləm/"}] },
  ]},
  { letter: "Y", pronunciations: [
    { phonemeId: "diphthong-ai", symbol: "aɪ", kind: "common", examples: [{w:"my",ipa:"/maɪ/"},{w:"try",ipa:"/traɪ/"},{w:"sky",ipa:"/skaɪ/"},{w:"fly",ipa:"/flaɪ/"}] },
    { phonemeId: "vowel-i-short", symbol: "ɪ", kind: "common", examples: [{w:"gym",ipa:"/dʒɪm/"},{w:"myth",ipa:"/mɪθ/"},{w:"system",ipa:"/ˈsɪstəm/"},{w:"symbol",ipa:"/ˈsɪmbəl/"}] },
    { phonemeId: "vowel-i-long", symbol: "iː", kind: "common", examples: [{w:"happy",ipa:"/ˈhæpi/"},{w:"city",ipa:"/ˈsɪti/"},{w:"baby",ipa:"/ˈbeɪbi/"},{w:"funny",ipa:"/ˈfʌni/"}] },
    { phonemeId: "consonant-y", symbol: "j", kind: "common", examples: [{w:"yes",ipa:"/jes/"},{w:"yellow",ipa:"/ˈjeloʊ/"},{w:"young",ipa:"/jʌŋ/"},{w:"you",ipa:"/juː/"}] },
  ]},
  { letter: "Z", pronunciations: [
    { phonemeId: "consonant-z", symbol: "z", kind: "common", examples: [{w:"zoo",ipa:"/zuː/"},{w:"zero",ipa:"/ˈzɪroʊ/"},{w:"buzz",ipa:"/bʌz/"},{w:"zip",ipa:"/zɪp/"}] },
  ]},
];

// 筛选器对应的标题映射
const filterHeadings = {
  all: null, // 用默认分组
  vowel: null,
  consonant: null,
  monophthong: { title: "单元音", eyebrow: "Monophthongs" },
  diphthong: { title: "双元音", eyebrow: "Diphthongs" },
  long: { title: "长单元音", eyebrow: "Long monophthongs" },
  short: { title: "短单元音", eyebrow: "Short monophthongs" },
  plosive: { title: "爆破音", eyebrow: "Plosives" },
  fricative: { title: "摩擦音", eyebrow: "Fricatives" },
  affricate: { title: "破擦音", eyebrow: "Affricates" },
  nasal: { title: "鼻音", eyebrow: "Nasals" },
  lateral: { title: "舌侧音", eyebrow: "Lateral consonants" },
  semivowel: { title: "半元音", eyebrow: "Semivowels" },
  voiceless: { title: "清辅音", eyebrow: "Voiceless consonants" },
  voiced: { title: "浊辅音", eyebrow: "Voiced consonants" },
};

const categoryLabels = {
  monophthong: { title: "单元音", eyebrow: "Monophthongs" },
  diphthong: { title: "双元音", eyebrow: "Diphthongs" },
  consonant: { title: "辅音", eyebrow: "Consonants" },
};

// ── 筛选器 ──
const rangeFilters = [
  { id: "all", label: "全部" },
  { id: "vowel", label: "元音" },
  { id: "consonant", label: "辅音" },
];
const vowelFilters = [
  { id: "monophthong", label: "单元音" },
  { id: "diphthong", label: "双元音" },
  { id: "long", label: "长单元音" },
  { id: "short", label: "短单元音" },
];
const mannerFilters = [
  { id: "plosive", label: "爆破音" },
  { id: "fricative", label: "摩擦音" },
  { id: "affricate", label: "破擦音" },
  { id: "nasal", label: "鼻音" },
  { id: "lateral", label: "舌侧音" },
  { id: "semivowel", label: "半元音" },
];
const voicingFilters = [
  { id: "voiceless", label: "清辅音" },
  { id: "voiced", label: "浊辅音" },
];

// ── 状态 ──
const player = ref(null);
const activeFilter = ref("all");
const wrapper = ref("bracket");
const repeatCount = ref(1);
const playingId = ref(null);
const loadingId = ref(null);
const playing = ref(false);
const error = ref(false);
const statusText = ref("点击任意音标卡片即可播放发音");
const repeatIndex = ref(0);
const activeLetter = ref("A");

const currentLetterGroup = computed(() =>
  letterPronunciations.find((g) => g.letter === activeLetter.value) || letterPronunciations[0]
);

function formatSymbol(s) {
  return wrapper.value === "bracket" ? "[" + s + "]" : "/" + s + "/";
}

function setWrapper(val) {
  wrapper.value = val;
  try { localStorage.setItem("english-ipa-symbol-wrapper", val); } catch (e) {}
}

function matchesFilter(item, filter) {
  if (filter === "all") return true;
  if (filter === "vowel") return item.family === "vowel";
  if (filter === "consonant") return item.family === "consonant";
  if (filter === "monophthong") return item.category === "monophthong";
  if (filter === "diphthong") return item.category === "diphthong";
  if (filter === "long") return item.length === "long";
  if (filter === "short") return item.length === "short";
  if (filter === "voiceless") return item.voicing === "voiceless";
  if (filter === "voiced") return item.voicing === "voiced";
  if (["plosive", "fricative", "affricate", "nasal", "lateral", "semivowel"].includes(filter)) {
    return item.manner === filter;
  }
  return true;
}

const filteredSymbols = computed(() =>
  activeFilter.value === "all" ? phoneticSymbols : phoneticSymbols.filter((s) => matchesFilter(s, activeFilter.value))
);

const visibleGroups = computed(() => {
  const filter = activeFilter.value;
  const heading = filterHeadings[filter];

  // 特定筛选（如爆破音、长单元音等）：单个分组，用筛选器对应的标题
  if (heading) {
    return [{
      category: filter,
      title: heading.title,
      eyebrow: heading.eyebrow,
      items: filteredSymbols.value,
    }];
  }

  // 全部/元音/辅音：按默认分类分组
  let cats = ["monophthong", "diphthong", "consonant"];
  if (filter === "vowel") cats = ["monophthong", "diphthong"];
  if (filter === "consonant") cats = ["consonant"];

  return cats
    .map((cat) => ({
      category: cat,
      title: categoryLabels[cat].title,
      eyebrow: categoryLabels[cat].eyebrow,
      items: filteredSymbols.value.filter((s) => s.category === cat),
    }))
    .filter((g) => g.items.length > 0);
});

async function play(item) {
  const el = player.value;
  if (!el) return;
  if (playingId.value === item.id) { stopPlay(); return; }
  el.pause();
  playingId.value = item.id;
  loadingId.value = item.id;
  playing.value = false;
  error.value = false;
  repeatIndex.value = 0;
  statusText.value = "加载中：" + formatSymbol(item.symbol);
  el.src = item.audio;
  el.load();
  try {
    await el.play();
    loadingId.value = null;
    playing.value = true;
    statusText.value = "播放中：" + formatSymbol(item.symbol) + (item.examples && item.examples[0] ? " · " + item.examples[0] : "");
  } catch (e) {
    loadingId.value = null;
    playingId.value = null;
    error.value = true;
    statusText.value = "音频加载失败：" + item.audio;
  }
}

async function playLetter(item, fallbackId) {
  if (!item.phonemeId) return;
  const target = phoneticSymbols.find((s) => s.id === item.phonemeId);
  if (!target) return;
  const id = item.phonemeId || fallbackId;
  const el = player.value;
  if (!el) return;
  if (playingId.value === id) { stopPlay(); return; }
  el.pause();
  playingId.value = id;
  loadingId.value = id;
  playing.value = false;
  error.value = false;
  repeatIndex.value = 0;
  statusText.value = "加载中：" + formatSymbol(item.symbol);
  el.src = target.audio;
  el.load();
  try {
    await el.play();
    loadingId.value = null;
    playing.value = true;
    statusText.value = "播放中：" + formatSymbol(item.symbol) + " · " + (item.examples[0] || "");
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
  setTimeout(() => { if (!playingId.value) statusText.value = "点击任意音标卡片即可播放发音"; }, 1500);
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
    setTimeout(() => { if (!playingId.value) statusText.value = "点击任意音标卡片即可播放发音"; }, 1500);
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
  statusText.value = "音频加载失败，请确认音频文件存在";
}

onMounted(() => {
  const el = player.value;
  if (el) {
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onError);
  }
  try {
    const w = localStorage.getItem("english-ipa-symbol-wrapper");
    if (w === "slash" || w === "bracket") wrapper.value = w;
  } catch (e) {}
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
.ipa-shell {
  max-width: 1120px;
  margin: 1.5rem auto 3rem;
  padding: 0 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}

/* ── 通用 eyebrow ── */
.ipa-eyebrow {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--vp-c-text-3, #8a919f);
  text-transform: uppercase;
  margin: 0 0 0.3rem;
  font-family: "SF Mono", Menlo, monospace;
}

/* ── Hero ── */
.ipa-hero {
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
.ipa-hero-main { display: flex; flex-direction: column; justify-content: center; }
.ipa-hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.1;
  margin: 0.2rem 0 0.5rem;
  color: var(--vp-c-text-1, #1f2329);
}
.ipa-hero-lead {
  font-size: 1rem;
  color: var(--vp-c-text-2, #4e5969);
  margin: 0 0 0.3rem;
}
.ipa-hero-tip {
  font-size: 0.88rem;
  color: var(--vp-c-text-3, #8a919f);
  margin: 0;
}
.ipa-hero-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  padding: 1.25rem;
  background: var(--vp-c-bg, #fff);
  border-radius: 10px;
  border: 1px solid var(--vp-c-border, #e3e5e8);
}
.ipa-summary { display: flex; gap: 1.5rem; }
.ipa-summary-item { display: flex; flex-direction: column; }
.ipa-summary-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--theme-color, #3eaf7c);
  line-height: 1.1;
}
.ipa-summary-label { font-size: 0.85rem; color: var(--vp-c-text-3, #8a919f); }
.ipa-status {
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
.ipa-status .status-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--vp-c-text-3, #8a919f);
  flex-shrink: 0;
}
.ipa-status[data-state="playing"] { border-color: var(--theme-color, #3eaf7c); color: var(--theme-color, #3eaf7c); }
.ipa-status[data-state="playing"] .status-dot { background: var(--theme-color, #3eaf7c); }
.ipa-status[data-state="error"] { border-color: #f26d6d; color: #f26d6d; }
.ipa-status[data-state="error"] .status-dot { background: #f26d6d; }

/* ── 设置栏 ── */
.ipa-settings {
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
.ipa-setting { display: flex; align-items: center; gap: 0.5rem; }
.setting-label {
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--vp-c-text-3, #8a919f);
  white-space: nowrap;
}

/* ── 通用 chip ── */
.ipa-chip {
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
.ipa-chip:hover {
  border-color: var(--theme-color, #3eaf7c);
  color: var(--vp-c-text-1, #1f2329);
}
.ipa-chip.is-active {
  background: var(--theme-color, #3eaf7c);
  border-color: var(--theme-color, #3eaf7c);
  color: #fff;
  font-weight: 600;
}
.ipa-select {
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

/* ── 字母读音区 ── */
.ipa-letter-section {
  background: var(--vp-c-bg, #fff);
  border: 1px solid var(--vp-c-border, #e3e5e8);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
.ipa-section-header { margin-bottom: 1rem; }
.ipa-section-title {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0 0 0.3rem;
  color: var(--vp-c-text-1, #1f2329);
}
.ipa-section-desc { font-size: 0.88rem; color: var(--vp-c-text-3, #8a919f); margin: 0; }
.letter-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 1rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--vp-c-border, #e3e5e8);
}
.letter-tab {
  width: 2.25rem;
  height: 2.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--vp-c-border, #e3e5e8);
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-2, #4e5969);
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.letter-tab:hover { border-color: var(--theme-color, #3eaf7c); color: var(--vp-c-text-1, #1f2329); }
.letter-tab.is-active {
  background: var(--theme-color, #3eaf7c);
  color: #fff;
  border-color: var(--theme-color, #3eaf7c);
}
.letter-panel-head {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
}
.letter-big {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1, #1f2329);
  line-height: 1;
}
.letter-count { font-size: 0.85rem; color: var(--vp-c-text-3, #8a919f); }
.letter-sounds {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.65rem;
}
.letter-sound {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  background: var(--vp-c-bg-soft, #f6f6f7);
  border: 1px solid var(--vp-c-border, #e3e5e8);
  border-radius: 10px;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  color: var(--vp-c-text-1, #1f2329);
  min-height: 4.75rem;
  transition: all 0.15s;
}
.letter-sound:hover:not(:disabled) {
  border-color: var(--theme-color, #3eaf7c);
  background: var(--vp-c-bg, #fff);
}
.letter-sound:disabled { cursor: default; opacity: 0.7; }
.letter-sound.is-playing, .letter-sound.is-loading {
  border-color: var(--theme-color, #3eaf7c);
  background: rgba(62, 175, 124, 0.1);
}
.letter-sound-head { display: flex; align-items: center; gap: 0.5rem; }
.letter-sound-symbol {
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 1.1;
  color: var(--vp-c-text-1, #1f2329);
  font-family: "Charter", "Times New Roman", "Noto Serif", Georgia, ui-serif, serif;
}
.letter-sound.is-playing .letter-sound-symbol, .letter-sound.is-loading .letter-sound-symbol {
  color: var(--theme-color, #3eaf7c);
}
.letter-kind-badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.1rem 0.5rem;
  border: 1px solid var(--vp-c-border, #e3e5e8);
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-3, #8a919f);
  border-radius: 999px;
  white-space: nowrap;
}
.letter-sound-examples { display: flex; flex-wrap: wrap; gap: 0.5rem 0.65rem; }
.letter-sound-word {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
  font-size: 0.82rem;
  line-height: 1.3;
}
.letter-sound-word .word-text {
  color: var(--vp-c-text-2, #4e5969);
  font-weight: 500;
}
.letter-sound-word .word-ipa {
  color: var(--vp-c-text-3, #8a919f);
  font-size: 0.76rem;
  font-style: italic;
  font-family: "Charter", "Times New Roman", "Noto Serif", Georgia, ui-serif, serif;
}
.letter-sound-note { font-size: 0.75rem; color: var(--vp-c-text-3, #8a919f); margin: 0; font-style: italic; }

/* ── 筛选区 ── */
.ipa-filters {
  background: var(--vp-c-bg, #fff);
  border: 1px solid var(--vp-c-border, #e3e5e8);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.ipa-filter-row { display: flex; align-items: center; flex-wrap: wrap; gap: 0.4rem; }
.ipa-filter-label {
  font-weight: 600;
  font-size: 0.78rem;
  color: var(--vp-c-text-3, #8a919f);
  margin-right: 0.25rem;
  min-width: 3.5rem;
}

/* ── 音标分组 ── */
.ipa-groups { display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 1.5rem; }
.ipa-group {
  background: var(--vp-c-bg, #fff);
  border: 1px solid var(--vp-c-border, #e3e5e8);
  border-radius: 12px;
  padding: 1.5rem;
}
.ipa-group-header {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--vp-c-border, #e3e5e8);
  flex-wrap: wrap;
}
.ipa-group-eyebrow {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: var(--vp-c-text-3, #8a919f);
  margin: 0;
  text-transform: uppercase;
  font-family: "SF Mono", Menlo, monospace;
}
.ipa-group-title {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0;
  color: var(--vp-c-text-1, #1f2329);
}
.ipa-group-count {
  margin-left: auto;
  font-size: 0.85rem;
  color: var(--vp-c-text-3, #8a919f);
  background: var(--vp-c-bg-soft, #f6f6f7);
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
}
.ipa-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.6rem;
}
.ipa-symbol {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-height: 2.5rem;
  width: 100%;
  padding: 0.3rem 0.7rem;
  background: var(--vp-c-bg-soft, #f6f6f7);
  border: 1px solid var(--vp-c-border, #e3e5e8);
  border-radius: 8px;
  color: var(--vp-c-text-1, #1f2329);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.ipa-symbol:hover {
  border-color: var(--theme-color, #3eaf7c);
  background: var(--vp-c-bg, #fff);
}
.ipa-symbol.is-playing, .ipa-symbol.is-loading {
  border-color: var(--theme-color, #3eaf7c);
  background: rgba(62, 175, 124, 0.12);
}
.ipa-symbol-text {
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.05;
  white-space: nowrap;
  color: var(--vp-c-text-1, #1f2329);
  font-family: "Charter", "Times New Roman", "Noto Serif", Georgia, ui-serif, serif;
}
.ipa-symbol.is-playing .ipa-symbol-text, .ipa-symbol.is-loading .ipa-symbol-text {
  color: var(--theme-color, #3eaf7c);
}

/* ── 播放指示器 ── */
.play-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1px solid var(--vp-c-border, #e3e5e8);
  color: var(--vp-c-text-3, #8a919f);
  transition: all 0.15s;
}
.ipa-symbol:hover .play-indicator, .letter-sound:hover .play-indicator {
  border-color: var(--theme-color, #3eaf7c);
  color: var(--theme-color, #3eaf7c);
}
.is-playing .play-indicator, .is-loading .play-indicator {
  border-color: var(--theme-color, #3eaf7c);
  color: var(--theme-color, #3eaf7c);
  background: rgba(62, 175, 124, 0.15);
}
.play-icon {
  position: relative;
  display: block;
  width: 8px;
  height: 8px;
}
.play-icon::before {
  content: "";
  position: absolute;
  top: 50%; left: 55%;
  width: 0; height: 0;
  border-block: 4px solid transparent;
  border-left: 6px solid currentColor;
  transform: translate(-50%, -50%);
}
.is-playing .play-icon::before { display: none; }
.is-playing .play-icon span {
  position: absolute;
  display: block;
  width: 2px;
  border-radius: 999px;
  background: currentColor;
  animation: ipa-pulse 680ms ease-in-out infinite;
}
.is-playing .play-icon span:first-child { top: 1px; left: 1px; height: 6px; animation-delay: -160ms; }
.is-playing .play-icon span:last-child { top: 0.5px; left: 5px; height: 7px; animation-delay: -80ms; }
.is-loading .play-icon {
  width: 8px; height: 8px;
  border: 1.5px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ipa-spin 700ms linear infinite;
}
.is-loading .play-icon::before { display: none; }
@keyframes ipa-spin { to { transform: rotate(360deg); } }
@keyframes ipa-pulse { 0%, 100% { transform: scaleY(0.62); } 50% { transform: scaleY(1); } }

/* ── 页脚 ── */
.ipa-footer {
  text-align: center;
  font-size: 0.82rem;
  color: var(--vp-c-text-3, #8a919f);
  padding: 1rem;
  line-height: 1.8;
  border-top: 1px solid var(--vp-c-border, #e3e5e8);
  margin-top: 1rem;
}
.ipa-footer a {
  color: var(--theme-color, #3eaf7c);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}
.ipa-footer p { margin: 0.2rem 0; }

/* ── 响应式 ── */
@media (max-width: 820px) {
  .ipa-hero { grid-template-columns: 1fr; padding: 1.5rem 1.25rem; }
}
@media (max-width: 460px) {
  .ipa-shell { padding: 0 0.5rem; }
  .ipa-hero, .ipa-letter-section, .ipa-group, .ipa-filters, .ipa-settings { padding: 1rem; }
  .letter-sounds { grid-template-columns: 1fr; }
  .ipa-grid { grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); }
}
</style>
