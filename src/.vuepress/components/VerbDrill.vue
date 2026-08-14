<template>
  <div class="drill-shell">
    <!-- 设置栏 -->
    <section class="drill-settings">
      <div class="drill-setting">
        <span class="setting-label">变形</span>
        <button
          v-for="f in formOptions"
          :key="f.key"
          class="drill-chip"
          :class="{ 'is-active': selectedForm === f.key }"
          @click="selectedForm = f.key"
        >{{ f.short }}</button>
      </div>
      <div class="drill-setting">
        <span class="setting-label">词类</span>
        <button
          v-for="c in classOptions"
          :key="c.key"
          class="drill-chip"
          :class="{ 'is-active': selectedClass === c.key }"
          @click="selectedClass = c.key"
        >{{ c.label }}</button>
      </div>
    </section>

    <!-- 题目卡片 -->
    <section class="drill-card">
      <div class="drill-meta">
        <span class="drill-tag">{{ currentClassLabel }}</span>
        <span class="drill-tag drill-tag--form">{{ currentFormLabel }}</span>
        <span class="drill-score">已答 {{ answered }} · 答对 {{ correct }}</span>
      </div>

      <div class="drill-question">
        <p class="drill-verb">
          <span class="drill-verb-text">{{ question.verb.dict }}</span>
          <span class="drill-verb-yomi">{{ question.verb.yomi }}</span>
        </p>
        <p class="drill-verb-meaning">{{ question.verb.meaning }}</p>
        <p class="drill-prompt">请写出它的<strong>{{ currentFormLabel }}</strong></p>
      </div>

      <form class="drill-input-row" @submit.prevent="onEnter">
        <input
          v-model="input"
          type="text"
          class="drill-input"
          :class="{ 'is-right': state === 'right', 'is-wrong': state === 'wrong' }"
          placeholder="输入变形（汉字形或全假名均可）"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          :disabled="state !== 'idle'"
          @keydown.enter="onKeydownEnter"
          @compositionstart="composing = true"
          @compositionend="composing = false"
        />
        <button v-if="state === 'idle'" type="submit" class="drill-btn drill-btn--primary" :disabled="!input.trim()">判定</button>
        <button v-else type="button" class="drill-btn drill-btn--primary" @click="next">下一题 →</button>
      </form>

      <!-- 反馈 -->
      <div v-if="state !== 'idle'" class="drill-feedback" :class="state">
        <p class="drill-feedback-line">
          <template v-if="state === 'right'">✓ 正确！</template>
          <template v-else-if="state === 'wrong'">✗ 正确答案：<strong>{{ answer.display }}</strong>（{{ answer.yomi }}）</template>
          <template v-else>答案：<strong>{{ answer.display }}</strong>（{{ answer.yomi }}）</template>
        </p>
        <p v-if="ruleHint" class="drill-rule">{{ ruleHint }}</p>
      </div>
      <div v-else class="drill-actions">
        <button type="button" class="drill-btn drill-btn--ghost" @click="reveal">显示答案</button>
        <button type="button" class="drill-btn drill-btn--ghost" @click="next">跳过 →</button>
        <button type="button" class="drill-btn drill-btn--ghost" @click="resetScore">重置计分</button>
      </div>
    </section>

    <p class="drill-footnote">一类（五段）＝う动词 ｜ 二类（一段）＝る动词 ｜ 三类＝する・来る。含「買う→買わない」「行く→行って」「ある→ない」等例外。</p>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

// ── 五段动词词尾映射 ──
const GODAN = {
  う: { i: "い", a: "わ", e: "え", o: "お" }, // 注意：あ段是 わ 不是 あ
  く: { i: "き", a: "か", e: "け", o: "こ" },
  ぐ: { i: "ぎ", a: "が", e: "げ", o: "ご" },
  す: { i: "し", a: "さ", e: "せ", o: "そ" },
  つ: { i: "ち", a: "た", e: "て", o: "と" },
  ぬ: { i: "に", a: "な", e: "ね", o: "の" },
  ぶ: { i: "び", a: "ば", e: "べ", o: "ぼ" },
  む: { i: "み", a: "ま", e: "め", o: "も" },
  る: { i: "り", a: "ら", e: "れ", o: "ろ" },
};
const TE_TA = {
  く: ["いて", "いた"],
  ぐ: ["いで", "いだ"],
  う: ["って", "った"],
  つ: ["って", "った"],
  る: ["って", "った"],
  ぬ: ["んで", "んだ"],
  ぶ: ["んで", "んだ"],
  む: ["んで", "んだ"],
  す: ["して", "した"],
};

const FORM_OPTIONS = [
  { key: "random", short: "随机", label: "随机变形" },
  { key: "masu", short: "ます形", label: "ます形（礼貌体）" },
  { key: "te", short: "て形", label: "て形" },
  { key: "ta", short: "た形", label: "た形（过去）" },
  { key: "nai", short: "ない形", label: "ない形（否定）" },
  { key: "potential", short: "可能", label: "可能形" },
  { key: "ba", short: "仮定", label: "仮定形（～ば）" },
  { key: "volitional", short: "意志", label: "意志形" },
  { key: "imperative", short: "命令", label: "命令形" },
];
const CLASS_OPTIONS = [
  { key: "all", label: "全部" },
  { key: "g1", label: "一类（五段）" },
  { key: "g2", label: "二类（一段）" },
  { key: "g3", label: "三类（不规则）" },
];

// cls: g1=一类(五段) g2=二类(一段) g3=三类；over=逐形例外覆盖 [display, yomi]
const VERBS = [
  { dict: "書く", yomi: "かく", meaning: "写", cls: "g1" },
  { dict: "聞く", yomi: "きく", meaning: "听；问", cls: "g1" },
  { dict: "泳ぐ", yomi: "およぐ", meaning: "游泳", cls: "g1" },
  { dict: "話す", yomi: "はなす", meaning: "说", cls: "g1" },
  { dict: "待つ", yomi: "まつ", meaning: "等待", cls: "g1" },
  { dict: "買う", yomi: "かう", meaning: "买", cls: "g1" },
  { dict: "遊ぶ", yomi: "あそぶ", meaning: "玩", cls: "g1" },
  { dict: "飲む", yomi: "のむ", meaning: "喝", cls: "g1" },
  { dict: "死ぬ", yomi: "しぬ", meaning: "死", cls: "g1" },
  { dict: "行く", yomi: "いく", meaning: "去（て/た形例外）", cls: "g1", over: { te: ["行って", "いって"], ta: ["行った", "いった"] } },
  { dict: "ある", yomi: "ある", meaning: "有（无生命；否定例外）", cls: "g1", over: { nai: ["ない", "ない"] }, exclude: ["potential", "imperative"] },
  { dict: "分かる", yomi: "わかる", meaning: "懂（五段例外）", cls: "g1" },
  { dict: "帰る", yomi: "かえる", meaning: "回家（五段例外）", cls: "g1" },
  { dict: "走る", yomi: "はしる", meaning: "跑（五段例外）", cls: "g1" },
  { dict: "入る", yomi: "はいる", meaning: "进入（五段例外）", cls: "g1" },
  { dict: "切る", yomi: "きる", meaning: "切（五段例外）", cls: "g1" },
  { dict: "知る", yomi: "しる", meaning: "知道（五段例外）", cls: "g1" },
  { dict: "食べる", yomi: "たべる", meaning: "吃", cls: "g2" },
  { dict: "見る", yomi: "みる", meaning: "看", cls: "g2" },
  { dict: "寝る", yomi: "ねる", meaning: "睡觉", cls: "g2" },
  { dict: "起きる", yomi: "おきる", meaning: "起床", cls: "g2" },
  { dict: "考える", yomi: "かんがえる", meaning: "思考", cls: "g2" },
  { dict: "教える", yomi: "おしえる", meaning: "教", cls: "g2" },
  { dict: "出る", yomi: "でる", meaning: "出去", cls: "g2" },
  { dict: "着る", yomi: "きる", meaning: "穿（上衣）", cls: "g2" },
  { dict: "いる", yomi: "いる", meaning: "在（有生命）", cls: "g2" },
  { dict: "開ける", yomi: "あける", meaning: "打开", cls: "g2" },
  { dict: "する", yomi: "する", meaning: "做", cls: "g3" },
  { dict: "来る", yomi: "くる", meaning: "来", cls: "g3" },
];

const G3_FORMS = {
  する: {
    masu: ["します", "します"], te: ["して", "して"], ta: ["した", "した"],
    nai: ["しない", "しない"], potential: ["できる", "できる"], ba: ["すれば", "すれば"],
    volitional: ["しよう", "しよう"], imperative: ["しろ", "しろ"],
  },
  来る: {
    masu: ["来ます", "きます"], te: ["来て", "きて"], ta: ["来た", "きた"],
    nai: ["来ない", "こない"], potential: ["来られる", "こられる"], ba: ["来れば", "くれば"],
    volitional: ["来よう", "こよう"], imperative: ["来い", "こい"],
  },
};

function conjugate(verb, formKey) {
  if (verb.over && verb.over[formKey]) return verb.over[formKey];
  if (verb.cls === "g3") return G3_FORMS[verb.dict][formKey];
  if (verb.cls === "g2") {
    const sd = verb.dict.slice(0, -1);
    const sy = verb.yomi.slice(0, -1);
    switch (formKey) {
      case "masu": return [sd + "ます", sy + "ます"];
      case "te": return [sd + "て", sy + "て"];
      case "ta": return [sd + "た", sy + "た"];
      case "nai": return [sd + "ない", sy + "ない"];
      case "potential": return [sd + "られる", sy + "られる"];
      case "ba": return [sd + "れば", sy + "れば"];
      case "volitional": return [sd + "よう", sy + "よう"];
      case "imperative": return [sd + "ろ", sy + "ろ"];
    }
  }
  // g1 五段
  const last = verb.dict.slice(-1);
  const sd = verb.dict.slice(0, -1);
  const sy = verb.yomi.slice(0, -1);
  const m = GODAN[last];
  switch (formKey) {
    case "masu": return [sd + m.i + "ます", sy + m.i + "ます"];
    case "te": return [sd + TE_TA[last][0], sy + TE_TA[last][0]];
    case "ta": return [sd + TE_TA[last][1], sy + TE_TA[last][1]];
    case "nai": return [sd + m.a + "ない", sy + m.a + "ない"];
    case "potential": return [sd + m.e + "る", sy + m.e + "る"];
    case "ba": return [sd + m.e + "ば", sy + m.e + "ば"];
    case "volitional": return [sd + m.o + "う", sy + m.o + "う"];
    case "imperative": return [sd + m.e, sy + m.e];
  }
  return ["", ""];
}

// ── 状态 ──
const selectedForm = ref("random");
const selectedClass = ref("all");
const input = ref("");
const state = ref("idle"); // idle | right | wrong | revealed
const answered = ref(0);
const correct = ref(0);
const composing = ref(false);
const question = ref({ verb: VERBS[0], formKey: "masu" });
let lastDict = "";

const formPool = computed(() => FORM_OPTIONS.filter((f) => f.key !== "random").map((f) => f.key));
const currentFormLabel = computed(() => (FORM_OPTIONS.find((f) => f.key === question.value.formKey) || FORM_OPTIONS[1]).label);
const currentClassLabel = computed(() => (CLASS_OPTIONS.find((c) => c.key === question.value.verb.cls) || CLASS_OPTIONS[1]).label);
const answer = computed(() => {
  const [display, yomi] = conjugate(question.value.verb, question.value.formKey);
  return { display, yomi };
});
const ruleHint = computed(() => {
  const v = question.value.verb;
  const f = question.value.formKey;
  if (v.over && v.over[f]) {
    if (v.dict === "行く") return "「行く」的て形/た形是促音便「行って/行った」，不是「行いて」——五段里唯一的例外。";
    if (v.dict === "ある") return "「ある」的否定是「ない」，不是「あらない」。";
  }
  if (v.cls === "g1" && (f === "te" || f === "ta")) return "五段て形口诀：く→いて、ぐ→いで、うつる→って、ぬぶむ→んで、す→して。";
  if (v.cls === "g1" && f === "nai") return "五段否定：词尾变あ段＋ない。注意「う」结尾变「わ」（買う→買わない）。";
  if (v.cls === "g1") return "五段变形：词尾う段移到同行 い/あ/え/お 段再加后缀。";
  if (v.cls === "g2") return "一段（る动词）最简单：去掉「る」直接加后缀。";
  return "する・来る是不规则动词，单独记忆。来る所有变形从「こ/き/く」变化。";
});

function pickQuestion() {
  const pool = VERBS.filter((v) => selectedClass.value === "all" || v.cls === selectedClass.value);
  let verb = pool[Math.floor(Math.random() * pool.length)];
  if (pool.length > 1) {
    while (verb.dict === lastDict) verb = pool[Math.floor(Math.random() * pool.length)];
  }
  let forms = selectedForm.value === "random" ? formPool.value : [selectedForm.value];
  if (verb.exclude) forms = forms.filter((f) => !verb.exclude.includes(f));
  const formKey = forms[Math.floor(Math.random() * forms.length)];
  lastDict = verb.dict;
  question.value = { verb, formKey };
}

function judge() {
  const val = input.value.trim().replace(/\s+/g, "");
  if (!val) return;
  const ok = val === answer.value.display || val === answer.value.yomi;
  state.value = ok ? "right" : "wrong";
  answered.value += 1;
  if (ok) correct.value += 1;
}

function reveal() {
  state.value = "revealed";
}

function next() {
  input.value = "";
  state.value = "idle";
  pickQuestion();
}

function resetScore() {
  answered.value = 0;
  correct.value = 0;
}

function onEnter() {
  if (state.value === "idle") judge();
  else next();
}
function onKeydownEnter(e) {
  // 日文输入法选词中的 Enter 不能触发提交
  if (e.isComposing || composing.value) e.preventDefault();
}

// 初始题静态（保证 SSR 与 hydration 一致），挂载后再随机换题
onMounted(() => pickQuestion());
</script>

<style scoped>
.drill-shell {
  margin: 1rem 0 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}

/* ── 设置栏 ── */
.drill-settings {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg-soft, #f6f6f7);
  border: 1px solid var(--vp-c-border, #e3e5e8);
  border-radius: 10px 10px 0 0;
  border-bottom: none;
}
.drill-setting { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
.setting-label { font-weight: 600; font-size: 0.8rem; color: var(--vp-c-text-3, #8a919f); white-space: nowrap; }
.drill-chip {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0.1rem 0.7rem;
  border: 1px solid var(--vp-c-border, #e3e5e8);
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-2, #4e5969);
  border-radius: 999px;
  font-size: 0.82rem;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.drill-chip:hover { border-color: var(--theme-color, #3eaf7c); color: var(--vp-c-text-1, #1f2329); }
.drill-chip.is-active {
  background: var(--theme-color, #3eaf7c);
  border-color: var(--theme-color, #3eaf7c);
  color: #fff;
  font-weight: 600;
}

/* ── 题目卡片 ── */
.drill-card {
  background: var(--vp-c-bg, #fff);
  border: 1px solid var(--vp-c-border, #e3e5e8);
  border-radius: 0 0 10px 10px;
  padding: 1.25rem 1.5rem 1.5rem;
}
.drill-meta { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.drill-tag {
  font-size: 0.75rem;
  padding: 0.1rem 0.6rem;
  border-radius: 999px;
  background: var(--vp-c-bg-soft, #f6f6f7);
  border: 1px solid var(--vp-c-border, #e3e5e8);
  color: var(--vp-c-text-2, #4e5969);
}
.drill-tag--form {
  background: var(--theme-color, #3eaf7c);
  border-color: var(--theme-color, #3eaf7c);
  color: #fff;
  font-weight: 600;
}
.drill-score { margin-left: auto; font-size: 0.82rem; color: var(--vp-c-text-3, #8a919f); }

.drill-question { text-align: center; padding: 1rem 0 0.75rem; }
.drill-verb { margin: 0; display: flex; flex-direction: column; align-items: center; gap: 0.15rem; }
.drill-verb-text {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--vp-c-text-1, #1f2329);
  font-family: "Hiragino Sans", "Yu Gothic", "Meiryo", "Noto Sans JP", sans-serif;
  line-height: 1.2;
}
.drill-verb-yomi { font-size: 0.95rem; color: var(--vp-c-text-3, #8a919f); font-family: "SF Mono", Menlo, monospace; }
.drill-verb-meaning { margin: 0.3rem 0 0; font-size: 0.9rem; color: var(--vp-c-text-2, #4e5969); }
.drill-prompt { margin: 0.75rem 0 0; font-size: 1rem; color: var(--vp-c-text-1, #1f2329); }
.drill-prompt strong { color: var(--theme-color, #3eaf7c); }

.drill-input-row { display: flex; gap: 0.6rem; max-width: 460px; margin: 0.75rem auto 0; }
.drill-input {
  flex: 1;
  min-height: 42px;
  padding: 0.3rem 0.9rem;
  border: 1.5px solid var(--vp-c-border, #e3e5e8);
  border-radius: 8px;
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-1, #1f2329);
  font-size: 1.15rem;
  font-family: "Hiragino Sans", "Yu Gothic", "Meiryo", "Noto Sans JP", sans-serif;
  outline: none;
  transition: border-color 0.15s;
}
.drill-input:focus { border-color: var(--theme-color, #3eaf7c); }
.drill-input.is-right { border-color: #3eaf7c; background: rgba(62, 175, 124, 0.08); }
.drill-input.is-wrong { border-color: #f26d6d; background: rgba(242, 109, 109, 0.08); }

.drill-btn {
  min-height: 42px;
  padding: 0 1.2rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-border, #e3e5e8);
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-2, #4e5969);
  font-size: 0.95rem;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  white-space: nowrap;
}
.drill-btn--primary {
  background: var(--theme-color, #3eaf7c);
  border-color: var(--theme-color, #3eaf7c);
  color: #fff;
  font-weight: 600;
}
.drill-btn--primary:disabled { opacity: 0.5; cursor: not-allowed; }
.drill-btn--ghost:hover { border-color: var(--theme-color, #3eaf7c); color: var(--theme-color, #3eaf7c); }

.drill-feedback {
  max-width: 460px;
  margin: 0.9rem auto 0;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
}
.drill-feedback.right { background: rgba(62, 175, 124, 0.12); border: 1px solid rgba(62, 175, 124, 0.4); }
.drill-feedback.wrong, .drill-feedback.revealed { background: rgba(242, 109, 109, 0.08); border: 1px solid rgba(242, 109, 109, 0.35); }
.drill-feedback.revealed { background: var(--vp-c-bg-soft, #f6f6f7); border-color: var(--vp-c-border, #e3e5e8); }
.drill-feedback-line { margin: 0; }
.drill-rule { margin: 0.4rem 0 0; font-size: 0.85rem; color: var(--vp-c-text-3, #8a919f); }

.drill-actions { display: flex; gap: 0.6rem; justify-content: center; margin-top: 0.9rem; flex-wrap: wrap; }
.drill-actions .drill-btn { min-height: 34px; font-size: 0.85rem; padding: 0 0.9rem; }

.drill-footnote {
  margin: 0.6rem 0 0;
  font-size: 0.78rem;
  color: var(--vp-c-text-3, #8a919f);
  text-align: center;
}

@media (max-width: 520px) {
  .drill-verb-text { font-size: 1.8rem; }
  .drill-input-row { flex-direction: column; }
  .drill-btn--primary { width: 100%; }
}
</style>
