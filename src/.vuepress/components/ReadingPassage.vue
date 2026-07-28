<template>
  <div class="rp">
    <header class="rp-head">
      <p class="rp-eyebrow">JAPANESE READING · {{ level || 'N5' }}</p>
      <h2 class="rp-title">{{ passage.title }}</h2>
      <p v-if="passage.titleCn" class="rp-title-cn">{{ passage.titleCn }}</p>
      <p v-if="passage.intro" class="rp-intro">{{ passage.intro }}</p>
      <div v-if="passage.audio" class="rp-audio">
        <span class="rp-audio-label">全文朗读</span>
        <audio :src="passage.audio" controls preload="none" class="rp-audio-player"></audio>
      </div>
    </header>
    <ol class="rp-list">
      <li v-for="(s, i) in passage.sentences" :key="i" class="rp-item">
        <ReadingSentence :sentence="s" />
      </li>
    </ol>
    <footer v-if="passage.source" class="rp-source">{{ passage.source }}</footer>
  </div>
</template>

<script setup lang="ts">
import type { ReadingPassageData } from './reading-types'
import ReadingSentence from './ReadingSentence.vue'

defineProps<{ passage: ReadingPassageData; level?: string }>()
</script>

<style scoped>
.rp {
  margin: 1.5rem 0;
}
.rp-head {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--vp-c-border, #e3e5e8);
}
.rp-eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--theme-color, #3eaf7c);
  margin: 0 0 0.3rem;
  font-weight: 600;
}
.rp-title {
  font-size: 1.8rem;
  margin: 0 0 0.2rem;
  font-weight: 700;
}
.rp-title-cn {
  font-size: 1rem;
  color: var(--vp-c-text-2, #4e5969);
  margin: 0 0 0.5rem;
}
.rp-intro {
  font-size: 0.9rem;
  color: var(--vp-c-text-2, #4e5969);
  margin: 0.5rem 0 0;
  line-height: 1.6;
}
.rp-audio {
  margin-top: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.rp-audio-label {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--theme-color, #3eaf7c);
  font-weight: 600;
  white-space: nowrap;
}
.rp-audio-player {
  height: 2.2rem;
  max-width: 100%;
  flex: 1;
  min-width: 220px;
}
.rp-list {
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: rp-item;
}
.rp-item {
  position: relative;
  padding-left: 2.2rem;
  margin: 0.8rem 0;
  counter-increment: rp-item;
}
.rp-item::before {
  content: counter(rp-item);
  position: absolute;
  left: 0;
  top: 0.2em;
  width: 1.6rem;
  height: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--vp-c-bg-soft, #f6f8fa);
  color: var(--vp-c-text-3, #8a919f);
  font-size: 0.75rem;
  font-weight: 600;
}
.rp-source {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--vp-c-border, #e3e5e8);
  font-size: 0.8rem;
  color: var(--vp-c-text-3, #8a919f);
}
</style>
