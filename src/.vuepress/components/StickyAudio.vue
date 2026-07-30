<template>
  <div ref="anchor" class="sa">
    <audio
      ref="audioEl"
      :src="src"
      controls
      preload="none"
      class="sa-player"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @timeupdate="onTime"
      @loadedmetadata="onMeta"
    ></audio>

    <Teleport to="body">
      <transition name="sa-float">
        <div v-if="showFloat" class="sa-float" role="region" aria-label="悬浮播放器">
          <button
            type="button"
            class="sa-float-btn"
            :title="playing ? '暂停' : '播放'"
            @click="toggle"
          >
            <svg v-if="!playing" viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M8 5v14l11-7z" />
            </svg>
            <svg v-else viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M6 5h4v14H6zM14 5h4v14h-4z" />
            </svg>
          </button>
          <div class="sa-float-info">
            <div v-if="title" class="sa-float-title">{{ title }}</div>
            <div class="sa-float-bar" @click="seek">
              <div class="sa-float-bar-fill" :style="{ width: percent + '%' }"></div>
            </div>
            <div class="sa-float-time">{{ fmt(current) }} / {{ fmt(duration) }}</div>
          </div>
          <button type="button" class="sa-float-close" title="关闭" @click="dismiss">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path
                fill="currentColor"
                d="M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z"
              />
            </svg>
          </button>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

defineProps<{ src: string; title?: string }>()

const anchor = ref<HTMLElement | null>(null)
const audioEl = ref<HTMLAudioElement | null>(null)

const playing = ref(false)
const current = ref(0)
const duration = ref(0)
const interacted = ref(false)
const dismissed = ref(false)
const anchorVisible = ref(true)

let observer: IntersectionObserver | null = null

const percent = computed(() =>
  duration.value > 0 ? (current.value / duration.value) * 100 : 0,
)

const showFloat = computed(
  () =>
    !anchorVisible.value &&
    interacted.value &&
    !dismissed.value &&
    duration.value > 0,
)

function onPlay() {
  playing.value = true
  interacted.value = true
  dismissed.value = false
}
function onPause() {
  playing.value = false
}
function onEnded() {
  playing.value = false
  current.value = 0
}
function onTime() {
  if (audioEl.value) current.value = audioEl.value.currentTime
}
function onMeta() {
  if (audioEl.value) duration.value = audioEl.value.duration || 0
}

function toggle() {
  const el = audioEl.value
  if (!el) return
  if (el.paused) el.play().catch(() => {})
  else el.pause()
}

function seek(e: MouseEvent) {
  const el = audioEl.value
  if (!el || !duration.value) return
  const bar = e.currentTarget as HTMLElement
  const rect = bar.getBoundingClientRect()
  const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
  el.currentTime = ratio * duration.value
}

function dismiss() {
  dismissed.value = true
}

function fmt(sec: number) {
  if (!isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

onMounted(() => {
  if (!anchor.value) return
  observer = new IntersectionObserver(
    (entries) => {
      anchorVisible.value = entries[0]?.isIntersecting ?? true
    },
    { threshold: 0 },
  )
  observer.observe(anchor.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<style scoped>
.sa {
  display: block;
}
.sa-player {
  width: 100%;
  height: 2.2rem;
}

.sa-float {
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.6rem;
  background: var(--vp-c-bg, #fff);
  border: 1px solid var(--vp-c-border, #e3e5e8);
  border-radius: 999px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  max-width: min(360px, calc(100vw - 2rem));
}
.sa-float-btn {
  flex: 0 0 auto;
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: var(--theme-color, #3eaf7c);
  color: #fff;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s;
}
.sa-float-btn:hover {
  transform: scale(1.06);
}
.sa-float-info {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sa-float-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-1, #1f2329);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}
.sa-float-bar {
  height: 4px;
  background: var(--vp-c-bg-soft, #f0f2f5);
  border-radius: 2px;
  cursor: pointer;
  overflow: hidden;
}
.sa-float-bar-fill {
  height: 100%;
  background: var(--theme-color, #3eaf7c);
  transition: width 0.2s linear;
}
.sa-float-time {
  font-size: 0.7rem;
  color: var(--vp-c-text-3, #8a919f);
  font-variant-numeric: tabular-nums;
}
.sa-float-close {
  flex: 0 0 auto;
  width: 1.4rem;
  height: 1.4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--vp-c-text-3, #8a919f);
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}
.sa-float-close:hover {
  color: var(--vp-c-text-1, #1f2329);
  background: var(--vp-c-bg-soft, #f0f2f5);
}

.sa-float-enter-active,
.sa-float-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.sa-float-enter-from,
.sa-float-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 640px) {
  .sa-float {
    right: 0.75rem;
    bottom: 0.75rem;
    left: 0.75rem;
    max-width: none;
    border-radius: 12px;
  }
  .sa-float-title {
    max-width: none;
  }
}
</style>
