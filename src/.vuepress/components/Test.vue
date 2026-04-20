<template>
  <!-- Display-only mode: just show the question text (n prop) -->
  <div v-if="isDisplayOnly" class="test-display">
    <p class="test-question" v-html="q"></p>
  </div>

  <!-- Interactive test mode -->
  <div v-else class="test-card" :class="{ 'test-card--no-question': !q }">
    <!-- Question -->
    <div v-if="q" class="test-question-row">
      <p class="test-question" v-html="q"></p>
    </div>

    <!-- Multiple choice options -->
    <div v-if="choices && choices.length" class="test-choices">
      <label
        v-for="(choice, index) in choices"
        :key="index"
        class="test-choice"
        :class="{ 'test-choice--selected': selected === index }"
        @click="selected = index"
      >
        <span class="test-choice-radio">
          <span v-if="selected === index" class="test-choice-radio-dot"></span>
        </span>
        <span class="test-choice-label">{{ optionLetters[index] }}. </span>
        <span class="test-choice-text">{{ choice }}</span>
      </label>
    </div>

    <!-- Show answer button -->
    <div class="test-actions">
      <button class="test-btn" @click="showAnswer = !showAnswer">
        {{ showAnswer ? '隐藏答案' : '显示答案' }}
      </button>
    </div>

    <!-- Answer reveal -->
    <div v-if="showAnswer" class="test-answer-area">
      <div v-if="a" class="test-answer">
        <span class="test-answer-label">答案：</span>
        <span class="test-answer-text">{{ a }}</span>
      </div>
      <div v-if="hasSlotContent" class="test-explanation">
        <span class="test-explanation-label">解析：</span>
        <span class="test-explanation-text"><slot /></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useSlots } from 'vue'

const props = defineProps<{
  q?: string
  a?: string
  c?: string[]
  n?: boolean | string
}>()

const slots = useSlots()
const showAnswer = ref(false)
const selected = ref<number | null>(null)

const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F']

const choices = computed(() => props.c || [])

// n prop can be boolean attribute (empty string when present) or true
const isDisplayOnly = computed(() => {
  return props.n !== undefined && props.n !== false
})

const hasSlotContent = computed(() => {
  return !!slots.default
})
</script>

<style scoped>
.test-display {
  margin: 0.3em 0;
}

.test-display .test-question {
  margin: 0;
  line-height: 1.8;
}

.test-card {
  border: 1px solid var(--border-color, #eaecef);
  border-radius: 8px;
  padding: 16px 20px;
  margin: 0.6em 0;
  background: var(--bg-color-secondary, #f8f9fa);
  transition: box-shadow 0.2s;
}

.test-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.test-card--no-question {
  padding: 12px 20px;
  margin-top: -0.3em;
  border-top: none;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.test-question-row {
  margin-bottom: 0.5em;
}

.test-question {
  margin: 0;
  line-height: 1.8;
  font-size: 1em;
}

.test-choices {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0;
  padding-left: 8px;
}

.test-choice {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  line-height: 1.6;
}

.test-choice:hover {
  background: var(--bg-color-tertiary, #eef0f4);
}

.test-choice--selected {
  background: var(--bg-color-tertiary, #eef0f4);
}

.test-choice-radio {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  min-width: 18px;
  border: 2px solid var(--border-color, #ccc);
  border-radius: 50%;
  margin-top: 3px;
  transition: border-color 0.15s;
}

.test-choice--selected .test-choice-radio {
  border-color: var(--theme-color, #3eaf7c);
}

.test-choice-radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--theme-color, #3eaf7c);
}

.test-choice-label {
  font-weight: 600;
  color: var(--text-color-lighter, #666);
  min-width: 1.5em;
}

.test-choice-text {
  flex: 1;
}

.test-actions {
  margin-top: 8px;
}

.test-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 16px;
  border: 1px solid var(--theme-color, #3eaf7c);
  border-radius: 6px;
  background: transparent;
  color: var(--theme-color, #3eaf7c);
  font-size: 0.9em;
  cursor: pointer;
  transition: all 0.2s;
}

.test-btn:hover {
  background: var(--theme-color, #3eaf7c);
  color: #fff;
}

.test-answer-area {
  margin-top: 12px;
  padding: 12px 16px;
  background: var(--bg-color, #fff);
  border-radius: 6px;
  border-left: 4px solid var(--theme-color, #3eaf7c);
}

.test-answer {
  margin-bottom: 8px;
  font-size: 1em;
  line-height: 1.8;
}

.test-answer-label {
  font-weight: 700;
  color: var(--theme-color, #3eaf7c);
}

.test-answer-text {
  font-weight: 600;
}

.test-explanation {
  font-size: 0.95em;
  line-height: 1.8;
  color: var(--text-color-lighter, #555);
}

.test-explanation-label {
  font-weight: 700;
  color: var(--text-color, #333);
}

/* Dark mode support */
:root.dark .test-card {
  background: var(--bg-color-secondary, #1e1e1e);
}

:root.dark .test-answer-area {
  background: var(--bg-color, #252525);
}

:root.dark .test-choice:hover,
:root.dark .test-choice--selected {
  background: var(--bg-color-tertiary, #2a2a2a);
}
</style>
