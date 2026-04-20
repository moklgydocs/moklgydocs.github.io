<template>
  <span class="grammar-note" :class="{ 'has-label': note }">
    <span class="grammar-note-text"><slot /></span>
    <sup v-if="note" class="grammar-note-label">{{ note }}</sup>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  note?: string
}>()
</script>

<style scoped>
.grammar-note {
  position: relative;
  display: inline;
}

.grammar-note .grammar-note-text {
  border-bottom: 2px solid var(--theme-color, #3eaf7c);
  font-weight: 600;
  padding-bottom: 1px;
}

.grammar-note.has-label .grammar-note-text {
  border-bottom: 2px solid var(--theme-color, #3eaf7c);
}

.grammar-note-label {
  color: var(--theme-color, #3eaf7c);
  font-weight: 700;
  font-size: 0.75em;
  margin-left: 1px;
}
</style>
