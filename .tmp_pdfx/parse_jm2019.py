# -*- coding: utf-8 -*-
# Parser for 简明日语.pdf (NHK 2019 edition) - plain-text stream approach.
# page.get_text() yields clean reading order; furigana lines (pure kana,
# short, preceded by kanji-ending line) are dropped and fragments rejoined.
import fitz
import re
import json

SRC = r'C:/Users/jackie.liu.ZURU/OneDrive/生活/语言学习/日语/简明日语/简明日语.pdf'

KANA = r'ぁ-んァ-ンー'
KANJI = r'一-龯々'
JP_RE = re.compile(f'[{KANA}{KANJI}]')
FURI_RE = re.compile(f'^[{KANA}]{{1,5}}$')
LATIN_RE = re.compile(r'[A-Za-z]')

FURNITURE = ('©NHK', 'https://', 'For more', 'www.nhk.or.jp')


def is_furi(s):
    return FURI_RE.match(s.strip().replace(' ', '')) is not None


def ends_kanji(s):
    return re.search(f'[{KANJI}]$', s.strip()) is not None


def starts_kana(s):
    return re.match(f'^[{KANA}]', s.strip().lstrip('、。？！　 ')) is not None


def starts_kanji_frag(s):
    t = s.strip()
    return 1 <= len(t) <= 4 and re.fullmatch(f'[{KANJI}]+', t) is not None


def clean_page_lines(page):
    raw = page.get_text()
    lines = []
    for l in raw.split('\n'):
        t = re.sub(r'[\x00-\x1f]', '', l).strip()
        if not t:
            continue
        if t.startswith(FURNITURE):
            continue
        if t in ('L', 'E', 'S', 'O', 'N', 'LESSON'):
            continue
        if re.fullmatch(r'\d{1,3}', t):
            continue
        lines.append(t)
    # drop furigana and rejoin fragments
    out = []
    i, n = 0, len(lines)
    while i < n:
        cur = lines[i]
        while i + 1 < n and is_furi(lines[i + 1]) and ends_kanji(cur):
            nxt = lines[i + 2] if i + 2 < n else ''
            if starts_kana(nxt) or '　' in nxt:
                cur = cur + nxt
                i += 2
            elif starts_kanji_frag(nxt) and i + 3 < n and is_furi(lines[i + 3]):
                cur = cur + nxt
                i += 2
            elif (re.match(r'^[、。？！…]', nxt.strip())
                  or (len(nxt.strip()) >= 2 and re.match(f'^[{KANJI}](?![{KANJI}])', nxt.strip()))):
                # sentence/word split across lines: 今晩/、…  今/日は、…
                cur = cur + nxt
                i += 2
            else:
                i += 1  # drop furigana only
                break
        out.append(cur)
        i += 1
    return out


def kind(line):
    t = re.sub(r'【[^】]*】', '', line)  # ignore 【placeholder】 content
    if LATIN_RE.search(t) and not JP_RE.search(t):
        return 'romaji'
    if re.search(f'[{KANA}]', t):
        return 'jp'
    return 'cn'


def clean_romaji(t):
    return t.replace('⎤', '').strip()


SECTION_LABELS = ['今日短剧', '单词和语句', '重点语句', '说说看！', '试试看！',
                  '常用语句', 'Can-do!', '答案', '进阶']

NAMES = {'タム': '心心', 'ミーヤー': '米亚', '海斗': '海斗', 'はる': '春奶奶',
         '悠輝': '悠辉', '悠': '悠辉', '輝': '悠辉', 'あやか': '绫香', '绫香': '绫香',
         'マイク': '迈克', '本田': '本田', '心心': '心心', '米亚': '米亚', '春奶奶': '春奶奶',
         '悠辉': '悠辉', '迈克': '迈克', '店员': '店员', '店員': '店员', '駅員': '站员',
         '係員': '工作人员', '社員': '职员', '担当者': '负责人', '站员': '站员'}


def is_name(line, following):
    """Name label: short fragment followed within 2 lines by a '：' line."""
    t = line.strip()
    if t in NAMES:
        return True
    if len(t) <= 5 and JP_RE.search(t) and not re.search(r'[。、？！　：:]', t):
        for f in following[:2]:
            fs = f.strip()
            if fs.startswith(('：', ':')):
                return True
            if fs in NAMES:
                continue
            if len(fs) <= 5 and JP_RE.search(fs) and not re.search(r'[。、？！　：:]', fs):
                continue
            return False
    return False


def parse_dialogue(lines):
    """Parse lines between 今日短剧 and 单词和语句 into turns."""
    turns = []
    cur = None
    pending = []
    i, n = 0, len(lines)
    while i < n:
        line = lines[i]
        if line.startswith(('：', ':')):
            speaker = pending[-1] if pending else (turns[-1]['speaker'] if turns else '')
            cur = {'speaker': speaker, 'parts': []}
            turns.append(cur)
            pending = []
            cur['parts'].append({'jp': line.lstrip('：:').strip(), 'romaji': '', 'cn': ''})
        elif is_name(line, lines[i + 1:i + 3]):
            pending.append(NAMES.get(line.strip(), line.strip()))
            cur = None  # speaker boundary
        else:
            k = kind(line)
            if k == 'romaji':
                if cur and cur['parts']:
                    p = cur['parts'][-1]
                    p['romaji'] = (p['romaji'] + ' ' + clean_romaji(line)).strip()
            elif k == 'jp':
                if cur and cur['parts'] and cur['parts'][-1]['romaji']:
                    cur['parts'].append({'jp': line, 'romaji': '', 'cn': ''})
                elif cur and cur['parts']:
                    cur['parts'][-1]['jp'] += line
            else:  # cn
                if cur and cur['parts'] and cur['parts'][-1]['jp'] and not cur['parts'][-1]['cn']:
                    cur['parts'][-1]['cn'] = line
                elif cur and cur['parts'] and cur['parts'][-1]['cn']:
                    cur['parts'][-1]['cn'] += line
        i += 1
    # merge parts whose sentence was split across lines (part without cn)
    for t in turns:
        merged = []
        for p in t['parts']:
            if merged and not merged[-1]['cn']:
                m = merged[-1]
                p = {'jp': m['jp'] + p['jp'],
                     'romaji': (m['romaji'] + ' ' + p['romaji']).strip(),
                     'cn': p['cn']}
                merged[-1] = p
            else:
                merged.append(p)
        t['parts'] = merged
    # echo lines: printed "translation" is romaji itself (e.g. えんむす・・・。)
    for t in turns:
        for p in t['parts']:
            if not p['cn'] and ' ' in p['romaji'].strip():
                head, _, tail = p['romaji'].rpartition('. ')
                if tail:
                    p['romaji'] = (head + '.') if head else ''
                    p['cn'] = tail
    return turns


def parse_vocab(lines):
    """Entry ends at romaji. Layout: word [／alt]* [gloss-line] romaji."""
    items = []
    i, n = 0, len(lines)
    while i < n:
        line = lines[i]
        if kind(line) == 'romaji':
            if items:
                items[-1]['romaji'] = (items[-1]['romaji'] + ' ' + clean_romaji(line)).strip()
                # romaji may wrap to next line when parens are unbalanced
                j = i + 1
                while j < n and (items[-1]['romaji'].count('（') > items[-1]['romaji'].count('）')
                                 or items[-1]['romaji'].count('(') > items[-1]['romaji'].count(')')):
                    items[-1]['romaji'] += lines[j].strip()
                    j += 1
                i = j
                continue
            i += 1
            continue
        # new item
        parts = re.split(r'　+| {2,}', line)
        word = parts[0].strip()
        gloss = '　'.join(parts[1:]).strip() if len(parts) > 1 else ''
        i += 1
        while i < n and lines[i].strip().startswith('／'):
            word += lines[i].strip()
            i += 1
        if i < n and not gloss and kind(lines[i]) == 'cn' and not lines[i].strip().startswith('／'):
            gloss = lines[i].strip()
            i += 1
        if word:
            items.append({'jp': word, 'cn': gloss, 'romaji': ''})
    return items


def find_label(lines, label):
    for i, l in enumerate(lines):
        if l.strip() == label:
            return i
    return -1


def parse_page2(lines):
    """Order-independent slicing: labels 说说看！/试试看！/常用语句|进阶/Can-do!
    may appear in any position; leftover (incl. after stray 重点语句) = key."""
    LABELS = ('说说看！', '试试看！', '常用语句', '进阶', 'Can-do!', '重点语句')
    segs = []
    cur_label, cur = None, []
    for l in lines:
        if l.strip() in LABELS:
            segs.append((cur_label, cur))
            cur_label, cur = l.strip(), []
        else:
            cur.append(l)
    segs.append((cur_label, cur))

    res = {'key': [], 'use': [], 'try': [], 'bonus': [], 'bonus_label': '常用语句', 'cando': []}
    key = []
    for label, seg in segs:
        if label is None or label == '重点语句':
            key += seg
        elif label == '说说看！':
            res['use'] = seg
        elif label == '试试看！':
            res['try'] = seg
        elif label in ('常用语句', '进阶'):
            res['bonus'] = seg
            res['bonus_label'] = label
        elif label == 'Can-do!':
            i = 0
            while i < len(seg) and kind(seg[i]) == 'cn':
                res['cando'].append(seg[i])
                i += 1
            key += seg[i:]
    res['key'] = key
    return res


def parse_page3(lines):
    """Returns dict with answers (list) and info (list of lines)."""
    idx = find_label(lines, '答案')
    if idx >= 0:
        ans = []
        rest_start = len(lines)
        for j in range(idx + 1, len(lines)):
            l = lines[j]
            if NUM_MARK.match(l) or (ans and (kind(l) in ('jp', 'romaji') or '⎤' in l)):
                ans.append(l)
            else:
                rest_start = j
                break
        info = lines[:idx] + lines[rest_start:]
        return {'answers': ans, 'info': info}
    return {'answers': [], 'info': lines}


def parse_toc(doc):
    toc = {}
    pending = None
    for pi in (4, 5):
        raw = doc[pi].get_text()
        for l in raw.split('\n'):
            t = l.strip()
            if not t or t.startswith(FURNITURE) or t in ('目录', 'LESSON'):
                continue
            if re.fullmatch(r'\d{1,2}', t):
                pending = int(t)
                continue
            m = re.match(r'^(.+?)\s*[·\s]+\s*\d{1,3}\s*$', t)
            if m and pending is not None and 1 <= pending <= 48:
                toc[pending] = m.group(1).strip('·　 ')
                pending = None
    return toc


def shape_phrase(lines):
    """[jp, romaji, cn, *explain_lines] -> dict; leading cn tolerated."""
    out = {'jp': '', 'romaji': '', 'cn': '', 'explain': ''}
    if not lines:
        return out
    i = 0
    pre = []
    while i < len(lines) and kind(lines[i]) != 'jp':
        pre.append(lines[i].strip())
        i += 1
    if i < len(lines):
        out['jp'] = lines[i].strip()
        i += 1
    rom = []
    while i < len(lines) and kind(lines[i]) == 'romaji':
        rom.append(lines[i].strip())
        i += 1
    out['romaji'] = clean_romaji(''.join(rom))
    if i < len(lines) and kind(lines[i]) == 'cn':
        out['cn'] = lines[i].strip()
        i += 1
    out['explain'] = ''.join(pre) + ''.join(l.strip() for l in lines[i:])
    return out


def shape_use(lines):
    """jp, romaji, jp, romaji, cn, cn -> list of {jp, romaji, cn}"""
    pairs = []
    i = 0
    while i < len(lines) and kind(lines[i]) == 'jp':
        jp = lines[i].strip()
        rom = []
        j = i + 1
        while j < len(lines) and kind(lines[j]) == 'romaji':
            rom.append(lines[j].strip())
            j += 1
        pairs.append({'jp': jp, 'romaji': clean_romaji(''.join(rom)), 'cn': ''})
        i = j
    cns = [l.strip() for l in lines[i:] if kind(l) == 'cn']
    for k, p in enumerate(pairs):
        if k < len(cns):
            p['cn'] = cns[k]
    return pairs


NUM_MARK = re.compile(r'^([①②③④⑤⑥⑦⑧⑨])\s*[\t ]*\s*(.*)$')


def shape_try(lines):
    """pattern triple + numbered items."""
    out = {'pattern': {'jp': '', 'romaji': '', 'cn': ''}, 'items': []}
    i = 0
    if i < len(lines) and kind(lines[i]) == 'jp':
        out['pattern']['jp'] = lines[i].strip()
        i += 1
    rom = []
    while i < len(lines) and kind(lines[i]) == 'romaji':
        rom.append(lines[i].strip())
        i += 1
    out['pattern']['romaji'] = clean_romaji(''.join(rom))
    cn = []
    while i < len(lines) and kind(lines[i]) == 'cn' and not NUM_MARK.match(lines[i]):
        cn.append(lines[i].strip())
        i += 1
    out['pattern']['cn'] = ''.join(cn)
    cur = None
    while i < len(lines):
        m = NUM_MARK.match(lines[i])
        if m:
            cur = {'marker': m.group(1), 'words': []}
            out['items'].append(cur)
            rest = m.group(2).strip()
            if rest:
                cur['words'].append({'jp': rest, 'romaji': '', 'cn': ''})
        elif cur is not None:
            k = kind(lines[i])
            if k == 'romaji':
                if cur['words']:
                    w = cur['words'][-1]
                    w['romaji'] = (w['romaji'] + clean_romaji(lines[i])).strip()
            elif k == 'cn':
                if cur['words'] and not cur['words'][-1]['cn']:
                    cur['words'][-1]['cn'] = lines[i].strip()
                elif cur['words'] and cur['words'][-1]['romaji']:
                    # kanji-only word starts a new entry (e.g. 空港 after バス)
                    cur['words'].append({'jp': lines[i].strip(), 'romaji': '', 'cn': ''})
                elif cur['words']:
                    cur['words'][-1]['cn'] += lines[i].strip()
            elif k == 'jp':
                cur['words'].append({'jp': lines[i].strip(), 'romaji': '', 'cn': ''})
        i += 1
    return out


def shape_answers(lines):
    """① jp + fragmented romaji -> [{marker, jp, romaji}]"""
    items = []
    cur = None
    for l in lines:
        m = NUM_MARK.match(l)
        if m:
            cur = {'marker': m.group(1), 'jp': m.group(2).strip(), 'romaji': ''}
            items.append(cur)
        elif cur is not None:
            k = kind(l)
            if k == 'romaji':
                cur['romaji'] += l.strip()
            elif k == 'jp' and not cur['romaji']:
                cur['jp'] += l.strip()
    for it in items:
        it['romaji'] = clean_romaji(it['romaji'])
    return items


def shape_info(lines):
    """Join wrapped CN paragraphs; keep jp/romaji lines separate."""
    out = []
    for l in lines:
        t = l.strip()
        k = kind(t)
        if k == 'cn' and out and isinstance(out[-1], str) and kind(out[-1]) == 'cn':
            prev = out[-1]
            if not prev.endswith(('。', '！', '？', '…')) and (prev.endswith(('，', '、', '：', '；', '」', '）')) or len(prev) >= 12):
                out[-1] = prev + t
                continue
        out.append(t)
    return out


def parse_lesson(doc, num, toc):
    p1 = 3 * num + 3  # printed page number == pdf index
    l1 = clean_page_lines(doc[p1])
    l2 = clean_page_lines(doc[p1 + 1])
    l3 = clean_page_lines(doc[p1 + 2])

    # page 1: first line is "N JP title"
    title_jp = ''
    if l1:
        m = re.match(rf'^{num}\s*(.+)$', l1[0])
        if m:
            title_jp = m.group(1).strip()
            l1 = l1[1:]
    idx_v = find_label(l1, '单词和语句')
    dia = l1[:idx_v] if idx_v >= 0 else l1
    voc = l1[idx_v + 1:] if idx_v >= 0 else []
    # drop stray 今日短剧 label wherever it is
    dia = [l for l in dia if l.strip() != '今日短剧']
    voc = [l for l in voc if l.strip() != '今日短剧']
    # trim footer: cn title line, then title romaji (directly follows last vocab romaji)
    title_cn = toc.get(num, '')
    norm = lambda s: s.strip().strip('·…．. ')
    if voc and title_cn and norm(voc[-1]) == norm(title_cn):
        voc = voc[:-1]
        i = len(voc) - 1
        while i > 0 and kind(voc[i]) == 'romaji' and kind(voc[i - 1]) == 'romaji':
            voc.pop(i)
            i -= 1
    turns = parse_dialogue(dia)
    vocab = parse_vocab(voc)

    p2 = parse_page2(l2)
    p3 = parse_page3(l3)

    return {
        'num': num,
        'title_jp': title_jp,
        'title_cn': toc.get(num, ''),
        'turns': turns,
        'vocab': vocab,
        'key': shape_phrase(p2['key']),
        'use': shape_use(p2['use']),
        'try': shape_try(p2['try']),
        'bonus': shape_phrase(p2['bonus']),
        'bonus_label': p2['bonus_label'],
        'bonus_raw': p2['bonus'],
        'cando': ''.join(p2['cando']),
        'answers': shape_answers(p3['answers']),
        'info': shape_info(p3['info']),
    }


def main():
    doc = fitz.open(SRC)
    toc = parse_toc(doc)
    print('TOC entries:', len(toc))
    out = [parse_lesson(doc, num, toc) for num in range(1, 49)]
    with open(r'E:/博客/moklgydocs.github.io/.tmp_pdfx/jm2019.json', 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print('parsed', len(out))


if __name__ == '__main__':
    main()
