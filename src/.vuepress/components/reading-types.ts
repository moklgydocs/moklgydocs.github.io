// 日语阅读组件的类型定义与工具函数

export interface ReadingToken {
  // 表层形（漢字交じり，含附着助词）e.g. "お婆さんは"
  surface: string
  // 全假名读法（含附着助词，用于绘线）e.g. "おばあさんは"
  reading: string
  // 声调核位置：0=平板 / 1=頭高 / n=中高·尾高；-1=标点（不绘线）
  accent: number
  // 词级中文释义 e.g. "老奶奶(主题)"
  gloss?: string
}

export interface ReadingSentenceData {
  tokens: ReadingToken[]
  translation: string
  note?: string
}

export interface ReadingPassageData {
  title: string
  titleCn?: string
  intro?: string
  source?: string
  sentences: ReadingSentenceData[]
}

// 小假名（拗音/促音/拨音的附属拍）
const SMALL = 'ゃゅょャュョぁぃぅぇぉァィゥェォ'

// 把假名字符串拆成拍（morae）数组，小假名并入前一个拍
export function splitMorae(s: string): string[] {
  const out: string[] = []
  for (const ch of s) {
    if (SMALL.includes(ch) && out.length) out[out.length - 1] += ch
    else out.push(ch)
  }
  return out
}

export type Pitch = 'H' | 'L'

// 声调核 a，拍数 n → H/L 序列
// a=0 平板：[L,H,H,...]
// a=1 頭高：[H,L,L,...]
// a=n 尾高：[L,H,H,...,H]（词内同平板，差异在后续助词——已并入）
// 1<a<n 中高：[L,H,...,H,L,...,L]（第 a 拍后降为 L）
export function accentPattern(a: number, n: number): Pitch[] {
  if (n === 0) return []
  const p: Pitch[] = new Array(n)
  p[0] = a === 1 ? 'H' : 'L'
  for (let i = 1; i < n; i++) p[i] = a === 0 || i < a ? 'H' : 'L'
  return p
}

const CIRCLED = ['⓪', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫']

export function accentCircle(a: number): string {
  return CIRCLED[a] ?? String(a)
}
