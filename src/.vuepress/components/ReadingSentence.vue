<template>
  <span class="rs">
    <span class="rs-jp">
      <PitchWord v-for="(t, i) in sentence.tokens" :key="i" :token="t" />
    </span>
    <span class="rs-trans">
      <button
        class="rs-toggle"
        :class="{ 'is-on': showTrans }"
        @click="showTrans = !showTrans"
      >
        {{ showTrans ? '隐藏译文' : '显示译文' }}
      </button>
      <span v-if="showTrans" class="rs-cn">
        {{ sentence.translation }}
        <em v-if="sentence.note" class="rs-note"> —— {{ sentence.note }}</em>
      </span>
    </span>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ReadingSentenceData } from './reading-types'
import PitchWord from './PitchWord.vue'

defineProps<{ sentence: ReadingSentenceData }>()
const showTrans = ref(false)
</script>

<style scoped>
.rs {
  display: block;
  margin: 0.5em 0;
  line-height: 2.2;
}
.rs-jp {
  font-size: 1.15rem;
}
.rs-trans {
  display: inline-block;
  margin-left: 0.5em;
  vertical-align: middle;
}
.rs-toggle {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 0 0.7rem;
  border: 1px solid var(--vp-c-border, #e3e5e8);
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-3, #8a919f);
  border-radius: 999px;
  font-size: 0.75rem;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.rs-toggle:hover {
  border-color: var(--theme-color, #3eaf7c);
  color: var(--theme-color, #3eaf7c);
}
.rs-toggle.is-on {
  background: var(--theme-color, #3eaf7c);
  border-color: var(--theme-color, #3eaf7c);
  color: #fff;
}
.rs-cn {
  display: block;
  margin-top: 0.3em;
  font-size: 0.9rem;
  color: var(--vp-c-text-2, #4e5969);
}
.rs-note {
  font-style: italic;
  color: var(--vp-c-text-3, #8a919f);
}
</style>
