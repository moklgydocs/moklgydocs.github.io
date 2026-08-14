import { ref } from "vue";

/** 所有 GrammarTip 共享的"全部展开/收起"信号；null = 未干预（各自维护状态） */
export const grammarExpandAll = ref<boolean | null>(null);
