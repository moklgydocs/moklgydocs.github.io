# -*- coding: utf-8 -*-
"""S02-S10 格式归一化(为音频管线做准备):
1. 中文伪台词行 `**中文名:** 中文` -> `> 中文`(不再是台词,不生成音频)
2. 裸英文台词行 `Name: text`(名字在全库粗体名字白名单内) -> `**Name:** text`(纳入音频)
3. 裸中文行(无 > 前缀、非台词) -> `> ...`(渲染一致)
4. 片头credit行(`**Written by:** X` 等)去掉粗体,避免被当成台词

用法: python _fix_seasons_format.py          # dry-run 只打印统计
      python _fix_seasons_format.py --apply  # 实际写入
"""
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent
SEASONS = ["S02", "S03", "S04", "S05", "S06", "S07", "S08", "S09", "S10"]

DIALOG_RE = re.compile(r"^(?:<AudioButton[^>]*/>\s*)?\*\*([^*]+?)[:：]\*\*\s*(.+)$")
CJK = re.compile(r"[一-鿿]")
PLAIN_NAME_RE = re.compile(r"^([A-Za-z][A-Za-z0-9 .''-]{0,40}?):\s+(\S.*)$")
CREDIT_RE = re.compile(r"\bby$", re.I)
NON_DIALOGUE_NAMES = {
    "note", "scene", "closing credits", "opening credits", "end", "commercial break",
    "written by", "transcribed by", "directed by", "story by", "teleplay by",
    "with minor adjustments by", "additional transcribing by",
}

# 第一遍: 收集全库(S01-S10)粗体名字作为说话人白名单
def build_whitelist() -> set[str]:
    names = set()
    dialog_m = re.compile(DIALOG_RE.pattern, re.M)
    for season in ["S01"] + SEASONS:
        d = BASE / season
        if not d.exists():
            continue
        for md in d.glob("*.md"):
            for m in dialog_m.finditer(md.read_text(encoding="utf-8")):
                n = m.group(1).strip().lower()
                if not CREDIT_RE.search(n) and n not in NON_DIALOGUE_NAMES:
                    names.add(n)
    return names


def transform(text: str, whitelist: set[str]) -> tuple[str, dict]:
    stats = {"zh_dialog": 0, "bolded_en": 0, "bare_zh": 0, "unbold_credit": 0}
    out = []
    in_frontmatter = False
    fm_done = False
    for line in text.split("\n"):
        # 跳过 frontmatter 区块
        if not fm_done:
            if line.strip() == "---":
                in_frontmatter = not in_frontmatter
                if not in_frontmatter:
                    fm_done = True
                out.append(line)
                continue
            if in_frontmatter:
                out.append(line)
                continue
            fm_done = True
        m = DIALOG_RE.match(line)
        if m:
            name, body = m.group(1).strip(), m.group(2)
            # credit 行去粗体
            if CREDIT_RE.search(name) or name.lower() in NON_DIALOGUE_NAMES:
                stats["unbold_credit"] += 1
                out.append(line.replace(f"**{m.group(1)}**", m.group(1), 1))
                continue
            # 中文伪台词 -> 引用
            if CJK.search(body):
                stats["zh_dialog"] += 1
                out.append(f"> {body.strip()}")
                continue
            out.append(line)
            continue
        # 非台词行
        if line.strip() and not line.lstrip().startswith(">"):
            pm = PLAIN_NAME_RE.match(line)
            if pm and pm.group(1).strip().lower() in whitelist:
                stats["bolded_en"] += 1
                out.append(f"**{pm.group(1)}:** {pm.group(2)}")
                continue
            if CJK.search(line) and not line.startswith((" ", "#", "---", "-", "*", "|")):
                stats["bare_zh"] += 1
                out.append(f"> {line.strip()}")
                continue
        out.append(line)
    return "\n".join(out), stats


def main() -> int:
    apply = "--apply" in sys.argv
    whitelist = build_whitelist()
    print(f"whitelist speakers: {len(whitelist)}")
    total = {"zh_dialog": 0, "bolded_en": 0, "bare_zh": 0, "unbold_credit": 0}
    for season in SEASONS:
        for md in sorted((BASE / season).glob(f"{season}E*.md")):
            text = md.read_text(encoding="utf-8")
            new_text, stats = transform(text, whitelist)
            if any(stats.values()):
                print(f"{season}/{md.name}: {stats}")
                for k in total:
                    total[k] += stats[k]
            if apply and new_text != text:
                md.write_text(new_text, encoding="utf-8")
    print(f"TOTAL {'APPLIED' if apply else '(dry-run)'}: {total}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
