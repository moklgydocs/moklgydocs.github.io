# -*- coding: utf-8 -*-
# Generate Lesson01-48.md for 简明日语 (NHK 2019) from jm2019.json
import json
import os
import re

OUT = r'E:/博客/moklgydocs.github.io/src/语言/日语/课本/简明日语'
DATA = r'E:/博客/moklgydocs.github.io/.tmp_pdfx/jm2019.json'

KANA = r'ぁ-んァ-ンー'
KANJI = r'一-龯々'


def esc(t):
    return t.replace('|', '\\|').replace('\n', '<br>')


def tight_jp(s):
    """Remove artifact spaces inside Japanese text."""
    return re.sub(f'(?<=[{KANA}{KANJI}。、？！…（）「」])\\s+(?=[{KANA}{KANJI}。、？！…（）「」])', '', s)


def romaji(s):
    return s.replace('⎤', '').strip()


def render_bonus(les):
    label = les['bonus_label']
    lines = les['bonus_raw']
    if not lines:
        return ''
    out = [f'## {label}', '']
    if label == '常用语句':
        b = les['bonus']
        out.append(f"> **{tight_jp(b['jp'])}**  ")
        out.append(f"> {romaji(b['romaji'])}  ")
        out.append(f"> {b['cn']}")
        out.append('')
        if b['explain']:
            out.append(b['explain'])
            out.append('')
        return '\n'.join(out)
    # 进阶: small reference blocks
    title = lines[0]
    out.append(f'**{title}**')
    out.append('')
    rest = lines[1:]
    jp_terms, rom_toks, cn_cells = [], [], []
    for l in rest:
        k = 'romaji' if re.search(r'[A-Za-z]', l) and not re.search(f'[{KANA}{KANJI}]', l) else ('jp' if re.search(f'[{KANA}]', l) else 'cn')
        if k == 'romaji':
            rom_toks.append(l.replace('⎤', '').strip())
        elif k == 'jp':
            jp_terms.append(tight_jp(l))
        else:
            cn_cells.append(l)
    # romaji split across two lines per term (e.g. getsu- + yo⎤obi)
    if jp_terms and len(rom_toks) == 2 * len(jp_terms):
        rom_toks = [rom_toks[i] + rom_toks[i + 1] for i in range(0, len(rom_toks), 2)]
    if cn_cells and len(cn_cells) == len(jp_terms) and len(jp_terms) == len(rom_toks):
        out.append('| 中文 | 日语 | 罗马音 |')
        out.append('| --- | --- | --- |')
        for c, j, r in zip(cn_cells, jp_terms, rom_toks):
            out.append(f'| {esc(c)} | {esc(j)} | {esc(r)} |')
        out.append('')
    elif jp_terms and len(jp_terms) == len(rom_toks):
        out.append('| 日语 | 罗马音 |')
        out.append('| --- | --- |')
        for j, r in zip(jp_terms, rom_toks):
            out.append(f'| {esc(j)} | {esc(r)} |')
        out.append('')
    elif rom_toks and not jp_terms and cn_cells and len(rom_toks) == len(cn_cells):
        out.append('| 日语（罗马音） | 中文 |')
        out.append('| --- | --- |')
        for r, c in zip(rom_toks, cn_cells):
            out.append(f'| {esc(r)} | {esc(c)} |')
        out.append('')
    else:
        # fallback: faithful lines (romaji keeps ⎤ accent marks, as in the book)
        for l in rest:
            if re.search(r'[A-Za-z]', l) and not re.search(f'[{KANA}{KANJI}]', l):
                out.append(f'*{l.strip()}*  ')
            else:
                out.append(f'{tight_jp(l)}  ')
        out.append('')
    return '\n'.join(out)


def render(les):
    n = les['num']
    md = []
    md.append('---')
    md.append(f'title: 第{n}课 {les["title_jp"]}')
    md.append('icon: fa6-solid:book')
    md.append('category:')
    md.append('  - 语言')
    md.append('  - 日语')
    md.append(f'order: {n}')
    md.append('---')
    md.append('')
    md.append(f'# 第{n}课　{les["title_jp"]}')
    md.append('')
    md.append(f'**{les["title_cn"]}**　｜　**Can-do**：{les["cando"]}')
    md.append('')

    # dialogue
    md.append('## 今日短剧')
    md.append('')
    md.append('| 角色 | 日语 | 罗马音 | 中文 |')
    md.append('| --- | --- | --- | --- |')
    for t in les['turns']:
        for i, p in enumerate(t['parts']):
            sp = f'**{t["speaker"]}**' if i == 0 else ''
            md.append(f'| {sp} | {esc(tight_jp(p["jp"]))} | {esc(romaji(p["romaji"]))} | {esc(p["cn"])} |')
    md.append('')

    # vocab
    md.append('## 单词和语句')
    md.append('')
    md.append('| 日语 | 罗马音 | 中文 |')
    md.append('| --- | --- | --- |')
    for v in les['vocab']:
        md.append(f'| {esc(tight_jp(v["jp"]))} | {esc(romaji(v["romaji"]))} | {esc(v["cn"])} |')
    md.append('')

    # key phrase
    k = les['key']
    md.append('## 重点语句')
    md.append('')
    md.append(f'> **{tight_jp(k["jp"])}**  ')
    md.append(f'> {romaji(k["romaji"])}  ')
    md.append(f'> {k["cn"]}')
    md.append('')
    if k['explain']:
        md.append(k['explain'])
        md.append('')

    # use it
    if les['use']:
        md.append('## 说说看！')
        md.append('')
        for i, u in enumerate(les['use'], 1):
            md.append(f'{i}. **{tight_jp(u["jp"])}**  ')
            md.append(f'   {romaji(u["romaji"])}  ')
            md.append(f'   {u["cn"]}')
        md.append('')

    # try it
    tr = les['try']
    if tr['pattern']['jp'] or tr['items']:
        md.append('## 试试看！')
        md.append('')
        if tr['pattern']['jp']:
            md.append(f'**句型**：{tight_jp(tr["pattern"]["jp"])}（{romaji(tr["pattern"]["romaji"])}）{tr["pattern"]["cn"]}')
            md.append('')
        for it in tr['items']:
            words = '　'.join(
                f'{tight_jp(w["jp"])}（{romaji(w["romaji"])}：{w["cn"]}）' if w['romaji'] or w['cn']
                else tight_jp(w['jp'])
                for w in it['words'])
            md.append(f'- {it["marker"]} {words}')
        md.append('')
        if les['answers']:
            md.append('::: details 查看答案')
            for a in les['answers']:
                line = f'{a["marker"]} {tight_jp(a["jp"])}'
                if a['romaji']:
                    line += f'（{a["romaji"]}）'
                md.append(line + '  ')
            md.append(':::')
            md.append('')

    # bonus
    b = render_bonus(les)
    if b:
        md.append(b)

    # info
    if les['info']:
        info = list(les['info'])
        heading = '拓展阅读'
        # trailing short cn title (e.g. 日语的语音) used as subtitle if last
        if info and len(info[-1]) <= 10 and not re.search(r'[A-Za-z]', info[-1]) and not info[-1].endswith(('。', '！', '？')):
            heading = f'拓展阅读 · {info[-1]}' if len(info) > 1 else heading
            if len(info) > 1:
                info = info[:-1]
        md.append(f'## {heading}')
        md.append('')
        for l in info:
            t = l if not re.search(r'[A-Za-z]', l) or re.search(f'[{KANA}{KANJI}]', l) else l
            if re.search(r'[A-Za-z]', t) and not re.search(f'[{KANA}{KANJI}]', t) and len(t) < 40:
                md.append(f'*{t}*  ')
            else:
                md.append(f'{tight_jp(t)}  ')
        md.append('')

    return '\n'.join(md)


def main():
    data = json.load(open(DATA, encoding='utf-8'))
    os.makedirs(OUT, exist_ok=True)
    for les in data:
        n = les['num']
        md = render(les)
        with open(os.path.join(OUT, f'Lesson{n:02d}.md'), 'w', encoding='utf-8') as f:
            f.write(md)
    print('generated', len(data), 'lessons ->', OUT)


if __name__ == '__main__':
    main()
