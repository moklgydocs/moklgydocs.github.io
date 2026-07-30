<template>
  <button
    type="button"
    class="wa"
    :class="{ 'is-playing': playing }"
    :title="`播放 ${kana}`"
    @click.stop.prevent="toggle"
  >
    <svg
      class="wa-icon"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'

const props = defineProps<{ kana: string }>()

let el: HTMLAudioElement | null = null
const playing = ref(false)

function url() {
  return '/audio/words/' + encodeURIComponent(props.kana) + '.mp3'
}

async function toggle() {
  if (playing.value && el) {
    el.pause()
    el.currentTime = 0
    playing.value = false
    return
  }
  if (!el) {
    el = new Audio(url())
    el.preload = 'none'
    el.onended = () => { playing.value = false }
    el.onerror = () => { playing.value = false }
  } else {
    el.src = url()
  }
  playing.value = true
  try {
    await el.play()
  } catch {
    playing.value = false
  }
}

onBeforeUnmount(() => {
  if (el) {
    el.pause()
    el = null
  }
})
</script>

<style scoped>
.wa {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.4em;
  height: 1.4em;
  margin: 0 0.15em;
  padding: 0;
  vertical-align: -0.2em;
  border: 1px solid var(--vp-c-border, #d0d7de);
  border-radius: 50%;
  background: transparent;
  color: var(--vp-c-text-2, #4e5969);
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}
.wa:hover {
  color: var(--theme-color, #3eaf7c);
  border-color: var(--theme-color, #3eaf7c);
  background: var(--vp-c-bg-soft, #f6f8fa);
}
.wa.is-playing {
  color: #fff;
  background: var(--theme-color, #3eaf7c);
  border-color: var(--theme-color, #3eaf7c);
}
.wa-icon {
  display: block;
}
</style>
