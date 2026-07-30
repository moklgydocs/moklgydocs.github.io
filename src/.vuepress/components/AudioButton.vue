<template>
  <button
    type="button"
    class="ab"
    :class="{ 'is-playing': isCurrent && isPlaying }"
    :title="title || '播放'"
    @click.stop.prevent="toggle"
  >
    <svg class="ab-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"
      />
    </svg>
  </button>
</template>

<script lang="ts">
import { ref } from 'vue'

// 模块级共享：所有 AudioButton 实例共用一个 Audio 元素
const sharedEl: { el: HTMLAudioElement | null } = { el: null }
const sharedSrc = ref('')
const sharedPlaying = ref(false)
// 当前播放片段的结束点(null = 播放到文件尾)
let sharedEnd: number | null = null

function ensureEl(): HTMLAudioElement {
  if (!sharedEl.el) {
    const el = new Audio()
    el.preload = 'none'
    el.addEventListener('ended', () => {
      sharedPlaying.value = false
      sharedSrc.value = ''
    })
    el.addEventListener('error', () => {
      sharedPlaying.value = false
      sharedSrc.value = ''
    })
    el.addEventListener('pause', () => {
      sharedPlaying.value = false
    })
    el.addEventListener('play', () => {
      sharedPlaying.value = true
    })
    el.addEventListener('timeupdate', () => {
      if (sharedEnd != null && el.currentTime >= sharedEnd) {
        sharedEnd = null
        el.pause()
        sharedSrc.value = ''
      }
    })
    sharedEl.el = el
  }
  return sharedEl.el
}

export default {
  name: 'AudioButton',
}
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'

const props = defineProps<{ src: string; title?: string; start?: number | string; duration?: number | string }>()

const startSec = computed(() => Number(props.start ?? 0))
const durSec = computed(() => (props.duration != null ? Number(props.duration) : null))

// 同一集音频的不同句子用 src+start 区分
const segKey = computed(() => `${props.src}#${startSec.value}`)
const isCurrent = computed(() => sharedSrc.value === segKey.value)
const isPlaying = sharedPlaying

async function playSegment(el: HTMLAudioElement, absolute: string, start: number) {
  await new Promise<void>((resolve) => {
    const onReady = () => {
      el.currentTime = start
      resolve()
    }
    if (el.src === absolute && el.readyState >= 1) {
      onReady()
      return
    }
    el.src = absolute
    el.addEventListener('loadedmetadata', onReady, { once: true })
  })
  await el.play()
}

async function toggle() {
  const el = ensureEl()
  if (isCurrent.value && sharedPlaying.value) {
    el.pause()
    el.currentTime = 0
    sharedSrc.value = ''
    sharedEnd = null
    return
  }
  const start = startSec.value
  sharedSrc.value = segKey.value
  sharedEnd = durSec.value != null ? start + durSec.value : null
  const absolute = new URL(props.src, location.href).href
  try {
    await playSegment(el, absolute, start)
  } catch {
    sharedSrc.value = ''
    sharedPlaying.value = false
    sharedEnd = null
  }
}

onBeforeUnmount(() => {
  if (isCurrent.value && sharedEl.el) {
    sharedEl.el.pause()
    sharedSrc.value = ''
    sharedEnd = null
  }
})
</script>

<style scoped>
.ab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.4em;
  height: 1.4em;
  margin: 0 0.2em;
  padding: 0;
  vertical-align: -0.2em;
  border: 1px solid var(--vp-c-border, #d0d7de);
  border-radius: 50%;
  background: transparent;
  color: var(--vp-c-text-2, #4e5969);
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
  flex: 0 0 auto;
}
.ab:hover {
  color: var(--theme-color, #3eaf7c);
  border-color: var(--theme-color, #3eaf7c);
  background: var(--vp-c-bg-soft, #f6f8fa);
}
.ab.is-playing {
  color: #fff;
  background: var(--theme-color, #3eaf7c);
  border-color: var(--theme-color, #3eaf7c);
}
.ab-icon {
  display: block;
}
</style>
