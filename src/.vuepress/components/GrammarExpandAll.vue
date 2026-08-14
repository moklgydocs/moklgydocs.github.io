<template>
  <button type="button" class="grammar-expand-all" @click="toggle">
    {{ expanded ? "▾ 全部收起" : "▸ 全部展开" }}
  </button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { grammarExpandAll } from "./grammar-expand-state";

const expanded = ref(false);

function toggle() {
  expanded.value = !expanded.value;
  grammarExpandAll.value = expanded.value;
}
</script>

<style scoped>
.grammar-expand-all {
  display: inline-flex;
  align-items: center;
  padding: 2px 12px;
  border: 1px solid var(--vp-c-divider, #d8d3c8);
  border-radius: 999px;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
  line-height: 1.8;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}
.grammar-expand-all:hover {
  border-color: var(--theme-color, #3eaf7c);
  color: var(--theme-color, #3eaf7c);
  background: var(--vp-c-bg-soft, #faf8f5);
}
[data-theme="dark"] .grammar-expand-all {
  border-color: var(--vp-c-divider, #3a3a3a);
}
[data-theme="dark"] .grammar-expand-all:hover {
  background: var(--vp-c-bg-soft, #2a2723);
}
</style>
