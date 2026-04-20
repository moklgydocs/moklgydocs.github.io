<template>
  <div class="tense-diagram">
    <img :src="img" :alt="alt || '时态示意图'" loading="lazy" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  img: string
  alt?: string
}>()
</script>

<style scoped>
.tense-diagram {
  text-align: center;
  margin: 0.8em 0;
}

.tense-diagram img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}
</style>
