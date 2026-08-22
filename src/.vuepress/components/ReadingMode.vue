<template>
  <!-- 顶部阅读进度条 -->
  <div class="reading-progress" :style="{ width: progress + '%' }" />

  <!-- 阅读设置浮动按钮 -->
  <div class="reading-fab" @click="open = !open" :title="'阅读设置'">
    <span v-if="!open">阅</span>
    <span v-else>×</span>
  </div>

  <!-- 设置面板 -->
  <transition name="reading-panel">
    <div v-if="open" class="reading-panel">
      <div class="rp-row">
        <span class="rp-label">字体</span>
        <button :class="{ on: serif }" @click="serif = !serif">{{ serif ? "衬线(书卷)" : "无衬线" }}</button>
      </div>
      <div class="rp-row">
        <span class="rp-label">字号</span>
        <div class="rp-group">
          <button @click="scaleDown">A−</button>
          <span class="rp-val">{{ Math.round(scale * 100) }}%</span>
          <button @click="scaleUp">A+</button>
        </div>
      </div>
      <div class="rp-row">
        <span class="rp-label">护眼纸色</span>
        <button :class="{ on: sepia }" @click="sepia = !sepia">{{ sepia ? "已开启" : "已关闭" }}</button>
      </div>
      <div class="rp-row">
        <span class="rp-label">专注阅读</span>
        <button :class="{ on: focus }" @click="focus = !focus">{{ focus ? "已开启" : "已关闭" }}</button>
      </div>
      <div class="rp-tip">设置自动保存在本机</div>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";

const open = ref(false);
const progress = ref(0);
const serif = ref(false);
const sepia = ref(false);
const focus = ref(false);
const scale = ref(1);

const KEY = "reading-mode-settings";

function apply() {
  const b = document.body;
  b.classList.toggle("reading-serif", serif.value);
  b.classList.toggle("reading-sepia", sepia.value);
  b.classList.toggle("reading-focus", focus.value);
  b.style.setProperty("--reading-font-scale", String(scale.value));
  localStorage.setItem(KEY, JSON.stringify({
    serif: serif.value, sepia: sepia.value, focus: focus.value, scale: scale.value,
  }));
}

function scaleUp() { scale.value = Math.min(1.2, +(scale.value + 0.06).toFixed(2)); }
function scaleDown() { scale.value = Math.max(0.85, +(scale.value - 0.06).toFixed(2)); }

function onScroll() {
  const el = document.documentElement;
  const max = el.scrollHeight - el.clientHeight;
  progress.value = max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0;
}

watch([serif, sepia, focus, scale], apply);

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
    if (typeof saved.serif === "boolean") serif.value = saved.serif;
    if (typeof saved.sepia === "boolean") sepia.value = saved.sepia;
    if (typeof saved.focus === "boolean") focus.value = saved.focus;
    if (typeof saved.scale === "number") scale.value = saved.scale;
  } catch { /* 忽略损坏的存档 */ }
  apply();
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});

onUnmounted(() => window.removeEventListener("scroll", onScroll));
</script>

<style lang="scss">
/* ===== 进度条 ===== */
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 2.5px;
  z-index: 999;
  background: linear-gradient(90deg, #c9a063, #a0522d);
  transition: width 0.1s linear;
  pointer-events: none;
}

/* ===== 浮动按钮 ===== */
.reading-fab {
  position: fixed;
  right: 22px;
  bottom: 88px;
  z-index: 998;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  user-select: none;
  color: #fff;
  background: #8b6f47;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
  opacity: 0.85;
  transition: opacity 0.2s, transform 0.2s;

  &:hover { opacity: 1; transform: scale(1.06); }
}

/* ===== 设置面板 ===== */
.reading-panel {
  position: fixed;
  right: 22px;
  bottom: 142px;
  z-index: 998;
  width: 210px;
  padding: 14px 16px;
  border-radius: 10px;
  background: var(--bg-color, #fff);
  border: 1px solid var(--border-color, #eaecef);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.16);
  font-size: 14px;

  .rp-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 8px 0;

    .rp-label { color: var(--text-color, #2c3e50); font-weight: 600; }

    button {
      padding: 3px 10px;
      border-radius: 6px;
      border: 1px solid var(--border-color, #ddd);
      background: transparent;
      color: var(--text-color, #2c3e50);
      cursor: pointer;
      font-size: 13px;

      &.on { background: #8b6f47; border-color: #8b6f47; color: #fff; }
    }

    .rp-group { display: flex; align-items: center; gap: 8px; }
    .rp-val { min-width: 42px; text-align: center; color: var(--text-color-light, #666); }
  }

  .rp-tip { margin-top: 10px; font-size: 12px; color: var(--text-color-lighter, #999); }
}

.reading-panel-enter-active, .reading-panel-leave-active { transition: all 0.18s ease; }
.reading-panel-enter-from, .reading-panel-leave-to { opacity: 0; transform: translateY(8px); }

/* ===== 阅读模式全局样式 ===== */
body {
  /* 字号缩放:只作用于正文 */
  .vp-content { font-size: calc(1rem * var(--reading-font-scale, 1)); }
}

/* 衬线书卷字体 */
body.reading-serif .vp-content {
  font-family: "Source Han Serif SC", "Noto Serif SC", "Noto Serif CJK SC", "Songti SC", "SimSun", Georgia, serif;
  line-height: 2;

  h1, h2, h3, h4 { font-family: inherit; letter-spacing: 0.02em; }
}

/* 护眼纸色 */
body.reading-sepia {
  background-color: #f5efdf !important;

  .vp-navbar { background-color: #efe7d3 !important; }
  .vp-sidebar { background-color: #f2ecdc !important; }
  .vp-content {
    background-color: #f5efdf;
    color: #4b3f2f;

    h1, h2, h3, h4, h5, h6, strong { color: #3d3325; }

    code { background-color: rgba(139, 111, 71, 0.14); color: #6b4f2a; }

    div[class*="language-"] { background-color: #efe6cf; }

    blockquote {
      background-color: rgba(139, 111, 71, 0.1);
      border-left-color: #a08c5b;
      color: #5d4f3a;
    }

    table, th, td { border-color: #d8cbae; }
    tr:nth-child(2n) { background-color: #eee5d0; }

    hr { border-color: #d8cbae; }
  }
}

/* 专注阅读:隐藏侧栏/目录/评论,正文居中加宽 */
body.reading-focus {
  .vp-sidebar, .vp-toc-wrapper, .vp-toc-placeholder, .vp-breadcrumb,
  .vp-page-meta, .vp-page-nav, .vp-comment, .reading-fab-panel-hide { display: none !important; }

  .vp-page { padding-left: 0 !important; padding-right: 0 !important; }

  .vp-content {
    max-width: 780px !important;
    margin: 0 auto !important;
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

@media (max-width: 719px) {
  .reading-fab { bottom: 70px; }
  .reading-panel { bottom: 124px; }
}
</style>
