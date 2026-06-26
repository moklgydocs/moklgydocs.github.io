<template>
  <span class="pw" :class="{ 'is-punct': isPunct }" @click="onToggle" @mouseenter="on" @mouseleave="off">
    <span class="pw-surface">{{ token.surface }}</span>
    <sup v-if="!isPunct" class="pw-num">{{ circle }}</sup>
    <span v-if="!isPunct && expanded" class="pw-pop">
      <svg
        class="pw-line"
        :viewBox="`0 0 ${morae.length * 16} 16`"
        :style="{ width: morae.length * 1.2 + 'em' }"
      >
        <polyline
          :points="points"
          fill="none"
          stroke="var(--theme-color, #3eaf7c)"
          stroke-width="1.6"
          stroke-linejoin="round"
        />
        <circle
          v-for="(p, i) in pattern"
          :key="i"
          :cx="i * 16 + 8"
          :cy="p === 'H' ? 3 : 13"
          r="1.7"
          fill="var(--theme-color, #3eaf7c)"
        />
      </svg>
      <span class="pw-kana">
        <span
          v-for="(m, i) in morae"
          :key="i"
          class="pw-mora"
          :class="pattern[i]"
        >{{ m }}</span>
      </span>
      <span v-if="token.gloss" class="pw-gloss">{{ token.gloss }}</span>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ReadingToken } from './reading-types'
import { splitMorae, accentPattern, accentCircle } from './reading-types'

const props = defineProps<{ token: ReadingToken }>()
const expanded = ref(false)
const on = () => {
  expanded.value = true
}
const off = () => {
  expanded.value = false
}
const onToggle = () => {
  if (!isPunct.value) expanded.value = !expanded.value
}

const isPunct = computed(() => props.token.accent < 0)
const morae = computed(() => splitMorae(props.token.reading))
const pattern = computed(() => accentPattern(props.token.accent, morae.value.length))
const circle = computed(() => accentCircle(props.token.accent))
const points = computed(() =>
  pattern.value.map((p, i) => `${i * 16 + 8},${p === 'H' ? 3 : 13}`).join(' '),
)
</script>

<style scoped>
.pw {
  position: relative;
  display: inline;
}
.pw-surface {
  border-bottom: 1px dotted var(--vp-c-border, #e3e5e8);
  cursor: help;
}
.pw.is-punct .pw-surface {
  border-bottom: none;
  cursor: default;
}
.pw-num {
  color: var(--theme-color, #3eaf7c);
  font-weight: 700;
  font-size: 0.7em;
  margin-left: 1px;
}
.pw-pop {
  position: absolute;
  left: 0;
  bottom: 100%;
  z-index: 20;
  transform: translateY(-4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 4px 6px;
  min-width: max-content;
  background: var(--vp-c-bg, #fff);
  border: 1px solid var(--theme-color, #3eaf7c);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  white-space: nowrap;
}
.pw-line {
  display: block;
  height: 1.1em;
  overflow: visible;
}
.pw-kana {
  display: flex;
}
.pw-mora {
  width: 1.2em;
  text-align: center;
  font-size: 0.85em;
  color: var(--vp-c-text-2, #4e5969);
}
.pw-mora.H {
  color: var(--theme-color, #3eaf7c);
  font-weight: 600;
}
.pw-gloss {
  font-size: 0.7em;
  color: var(--vp-c-text-3, #8a919f);
  border-top: 1px dashed var(--vp-c-border, #e3e5e8);
  padding-top: 2px;
  margin-top: 1px;
}
</style>
