# -*- coding: utf-8 -*-
"""
把 Friends 各季 S{NN}E*.md 里每句对白 (**Name:** text) 前注入 <AudioButton src="..." />。
幂等：若行已含 AudioButton 则跳过。
用法: python _inject_friends_audio.py [S01 S02 ...]   (默认全部季)
"""
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent

# **Name:** text   （不含已注入的 <AudioButton.../> 前缀）
DIALOG_LINE_RE = re.compile(r"^(\*\*[^*]+?[:：]\*\*\s+.+)$")

# 用来统计/对齐 idx 的提取正则（兼容已注入的行）
EXTRACT_RE = re.compile(
    r"^(?:<AudioButton[^>]*/>\s*)?\*\*[^*]+?[:：]\*\*\s*(.+)$"
)


def transform(md_path: Path, season: str) -> tuple[int, int]:
    ep = md_path.stem  # S02E01
    text = md_path.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)
    out: list[str] = []
    touched = 0
    skipped = 0
    idx = 0  # 该集内对白序号
    for line in lines:
        content = line.rstrip("\r\n")
        ending = line[len(content):]
        # 已注入：跳过但仍然递增 idx 以保持序号对齐
        if "AudioButton" in content:
            if EXTRACT_RE.match(content):
                idx += 1
            out.append(line)
            skipped += 1
            continue
        m = DIALOG_LINE_RE.match(content)
        if not m:
            out.append(line)
            continue
        idx += 1
        src = f"/audio/friends/{season}/{ep}/{idx:03d}.mp3"
        out.append(f'<AudioButton src="{src}" /> {content}{ending}')
        touched += 1
    if touched > 0:
        md_path.write_text("".join(out), encoding="utf-8")
    return touched, skipped


def main(seasons: list[str]) -> int:
    total_touched = 0
    total_skipped = 0
    for season in seasons:
        s_dir = BASE / season
        if not s_dir.exists():
            print(f"{season}: dir not found, skipped")
            continue
        for md in sorted(s_dir.glob(f"{season}E*.md")):
            t, s = transform(md, season)
            total_touched += t
            total_skipped += s
            print(f"{md.name}: touched={t} skipped={s}")
    print(f"TOTAL: touched={total_touched} skipped={total_skipped}")
    return 0


if __name__ == "__main__":
    seasons = sys.argv[1:] or ["S01", "S02", "S03", "S04", "S05", "S06", "S07", "S08", "S09", "S10"]
    sys.exit(main(seasons))
