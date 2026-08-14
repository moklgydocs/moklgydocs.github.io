<template>
  <div class="grammar-tip" :class="[`is-${type}`, { open: isOpen }]">
    <button type="button" class="gt-toggle" :aria-expanded="isOpen" @click="isOpen = !isOpen">
      <span class="gt-icon">{{ type === 'long' ? '🔬' : type === 'pattern' ? '🏗️' : '🖊️' }}</span>
      <span class="gt-title">{{ type === 'long' ? '长难句分析' : type === 'pattern' ? '句型 SVOC' : '语法' }}</span>
      <span v-if="tagList.length" class="gt-tags">
        <span v-for="tag in tagList" :key="tag" class="gt-tag">{{ tag }}</span>
      </span>
      <span class="gt-arrow" aria-hidden="true">▾</span>
    </button>
    <div class="gt-panel">
      <div class="gt-inner">
        <div class="gt-content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { grammarExpandAll } from './grammar-expand-state'

const props = withDefaults(
  defineProps<{
    points?: string
    type?: 'note' | 'long' | 'pattern'
  }>(),
  {
    points: '',
    type: 'note',
  },
)

const isOpen = ref(false)

const tagList = computed(() =>
  props.points
    .split(/[,，]/)
    .map((t) => t.trim())
    .filter(Boolean),
)

watch(grammarExpandAll, (v) => {
  if (v !== null) isOpen.value = v
})
</script>

<style scoped>
.grammar-tip {
  margin: 2px 0 6px;
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif;
}

.gt-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 1px 10px 1px 8px;
  border: 1px solid var(--vp-c-divider, #d8d3c8);
  border-radius: 999px;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
  line-height: 1.7;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}
.gt-toggle:hover {
  border-color: var(--theme-color, #3eaf7c);
  color: var(--theme-color, #3eaf7c);
  background: var(--vp-c-bg-soft, #faf8f5);
}
.open .gt-toggle {
  border-color: var(--theme-color, #3eaf7c);
  color: var(--theme-color, #3eaf7c);
}

.is-long .gt-toggle:hover,
.is-long.open .gt-toggle {
  border-color: #b0722a;
  color: #b0722a;
}

.is-pattern .gt-toggle:hover,
.is-pattern.open .gt-toggle {
  border-color: #2f6f8f;
  color: #2f6f8f;
}

.gt-icon {
  font-size: 0.85em;
}
.gt-title {
  font-weight: 600;
  letter-spacing: 0.05em;
}

.gt-tags {
  display: inline-flex;
  gap: 4px;
  flex-wrap: wrap;
}
.gt-tag {
  padding: 0 6px;
  border-radius: 3px;
  background: var(--vp-c-bg-soft, #f0ede6);
  color: var(--vp-c-text-2);
  font-size: 0.92em;
  line-height: 1.6;
}
.is-long .gt-tag {
  background: rgba(176, 114, 42, 0.12);
  color: #b0722a;
}
.is-pattern .gt-tag {
  background: rgba(47, 111, 143, 0.12);
  color: #2f6f8f;
}

.gt-arrow {
  font-size: 0.8em;
  transition: transform 0.25s ease;
}
.open .gt-arrow {
  transform: rotate(180deg);
}

.gt-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
}
.open .gt-panel {
  grid-template-rows: 1fr;
}
.gt-inner {
  overflow: hidden;
  min-height: 0;
}

.gt-content {
  margin: 4px 0 2px;
  padding: 8px 14px;
  border-left: 2px solid var(--theme-color, #3eaf7c);
  background: var(--vp-c-bg-soft, #faf8f5);
  border-radius: 0 6px 6px 0;
  font-size: 0.88rem;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}
.is-long .gt-content {
  border-left-color: #b0722a;
}
.is-pattern .gt-content {
  border-left-color: #2f6f8f;
}

/* ── SVOC 成分标记（slot 内 <p class="svoc"> 使用） ── */
.gt-content :deep(.svoc) {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
  margin: 0.4em 0;
  line-height: 2;
}
.gt-content :deep(.svoc span) {
  position: relative;
  padding-bottom: 2px;
  border-bottom: 2px solid transparent;
}
.gt-content :deep(.svoc span::after) {
  position: absolute;
  left: 0;
  bottom: -1.4em;
  font-size: 0.68em;
  font-weight: 700;
  letter-spacing: 0.03em;
  white-space: nowrap;
}
.gt-content :deep(.svoc .s) {
  border-bottom-color: #c0392b;
}
.gt-content :deep(.svoc .s::after) {
  content: "S 主语";
  color: #c0392b;
}
.gt-content :deep(.svoc .v) {
  border-bottom-color: #2471a3;
}
.gt-content :deep(.svoc .v::after) {
  content: "V 谓语";
  color: #2471a3;
}
.gt-content :deep(.svoc .o) {
  border-bottom-color: #7d3c98;
}
.gt-content :deep(.svoc .o::after) {
  content: "O 宾语";
  color: #7d3c98;
}
.gt-content :deep(.svoc .c) {
  border-bottom-color: #1e8449;
}
.gt-content :deep(.svoc .c::after) {
  content: "C 补语";
  color: #1e8449;
}
.gt-content :deep(.svoc .a) {
  border-bottom-color: #9a7d0a;
  border-bottom-style: dotted;
}
.gt-content :deep(.svoc .a::after) {
  content: "Adv 状语";
  color: #9a7d0a;
}
.gt-content :deep(.svoc .conj) {
  color: var(--vp-c-text-3);
  font-style: italic;
}

.gt-content :deep(p) {
  margin: 0.3em 0;
  line-height: 1.8;
}
.gt-content :deep(ul),
.gt-content :deep(ol) {
  margin: 0.3em 0;
  padding-left: 1.4em;
}
.gt-content :deep(li) {
  margin: 0.15em 0;
}
.gt-content :deep(code) {
  font-size: 0.88em;
}
.gt-content :deep(strong) {
  color: var(--vp-c-text-1);
}

/* 暗色模式 */
[data-theme="dark"] .gt-toggle {
  border-color: var(--vp-c-divider, #3a3a3a);
}
[data-theme="dark"] .gt-toggle:hover {
  background: var(--vp-c-bg-soft, #2a2723);
}
[data-theme="dark"] .gt-tag {
  background: rgba(255, 255, 255, 0.08);
}
[data-theme="dark"] .is-long .gt-tag {
  background: rgba(176, 114, 42, 0.25);
  color: #d99a52;
}
[data-theme="dark"] .gt-content {
  background: var(--vp-c-bg-soft, #2a2723);
}
[data-theme="dark"] .is-long .gt-toggle:hover,
[data-theme="dark"] .is-long.open .gt-toggle {
  border-color: #d99a52;
  color: #d99a52;
}
[data-theme="dark"] .is-pattern .gt-toggle:hover,
[data-theme="dark"] .is-pattern.open .gt-toggle {
  border-color: #5da8cf;
  color: #5da8cf;
}
[data-theme="dark"] .is-pattern .gt-tag {
  background: rgba(47, 111, 143, 0.35);
  color: #5da8cf;
}

@media (max-width: 768px) {
  .gt-toggle {
    font-size: 0.74rem;
  }
  .gt-content {
    padding: 6px 10px;
    font-size: 0.84rem;
  }
}
</style>
