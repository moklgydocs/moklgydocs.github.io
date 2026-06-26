<template>
  <details class="vl" :open="open">
    <summary class="vl-summary">
      <span class="vl-icon">{{ open ? '▼' : '▶' }}</span>
      <span class="vl-title">{{ title || '重点词汇' }}</span>
      <span class="vl-count">（{{ items.length }} 词）</span>
    </summary>
    <table class="vl-table">
      <thead>
        <tr>
          <th class="vl-th vl-col-word">词语</th>
          <th class="vl-th vl-col-reading">读法</th>
          <th class="vl-th vl-col-accent">声调</th>
          <th v-if="hasPos" class="vl-th vl-col-pos">词性</th>
          <th class="vl-th vl-col-cn">中文</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in items" :key="i" class="vl-row">
          <td class="vl-td vl-col-word">{{ item.surface }}</td>
          <td class="vl-td vl-col-reading">{{ item.reading }}</td>
          <td class="vl-td vl-col-accent">
            <span v-if="item.accent >= 0" class="vl-accent">{{ circle(item.accent) }}</span>
            <span v-else class="vl-accent-dash">—</span>
          </td>
          <td v-if="hasPos" class="vl-td vl-col-pos">{{ item.pos || '' }}</td>
          <td class="vl-td vl-col-cn">{{ item.cn }}</td>
        </tr>
      </tbody>
    </table>
  </details>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { VocabItem } from './reading-types'
import { accentCircle } from './reading-types'

const props = defineProps<{
  items: VocabItem[]
  title?: string
  open?: boolean
}>()

const hasPos = computed(() => props.items.some((it) => it.pos))
const circle = accentCircle
</script>

<style scoped>
.vl {
  margin: 2rem 0 1rem;
  border: 1px solid var(--vp-c-border, #e3e5e8);
  border-radius: 8px;
  overflow: hidden;
}
.vl-summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  background: var(--vp-c-bg-soft, #f6f8fa);
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--vp-c-text-1, #1f2329);
  user-select: none;
  list-style: none;
}
.vl-summary::-webkit-details-marker {
  display: none;
}
.vl-icon {
  color: var(--theme-color, #3eaf7c);
  font-size: 0.7em;
}
.vl-title {
  color: var(--theme-color, #3eaf7c);
}
.vl-count {
  color: var(--vp-c-text-3, #8a919f);
  font-weight: 400;
  font-size: 0.85em;
}
.vl-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}
.vl-th {
  padding: 0.5rem 0.75rem;
  text-align: left;
  background: var(--vp-c-bg-soft, #f6f8fa);
  border-bottom: 1px solid var(--vp-c-border, #e3e5e8);
  font-weight: 600;
  color: var(--vp-c-text-2, #4e5969);
  font-size: 0.8rem;
}
.vl-td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider, #f0f2f5);
  color: var(--vp-c-text-1, #1f2329);
}
.vl-row:last-child .vl-td {
  border-bottom: none;
}
.vl-row:hover .vl-td {
  background: var(--vp-c-bg-soft, #f6f8fa);
}
.vl-col-word {
  font-weight: 600;
  white-space: nowrap;
}
.vl-col-reading {
  color: var(--vp-c-text-2, #4e5969);
  font-size: 0.85em;
}
.vl-col-accent {
  text-align: center;
  width: 3rem;
}
.vl-accent {
  color: var(--theme-color, #3eaf7c);
  font-weight: 700;
}
.vl-accent-dash {
  color: var(--vp-c-text-3, #8a919f);
}
.vl-col-pos {
  color: var(--vp-c-text-3, #8a919f);
  font-size: 0.85em;
  width: 4rem;
}
.vl-col-cn {
  color: var(--vp-c-text-2, #4e5969);
}
</style>
