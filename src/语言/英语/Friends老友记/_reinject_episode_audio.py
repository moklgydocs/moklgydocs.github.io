# -*- coding: utf-8 -*-
"""把各季 md 中旧的逐句 AudioButton 全部剥除,按 _segments 片段表
重新注入整集音频的片段播放按钮:
  <AudioButton src="/audio/episodes/{season}/{ep}.mp3" start="S" duration="D" /> **Name:** ...
依赖: 先运行 _pack_episode_audio.py 生成 _segments/*.json
用法: python _reinject_episode_audio.py [S01 S02 ...]  (默认全部)
"""
import json
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent
SEG_BASE = BASE / "_segments"

DIALOG_LINE_RE = re.compile(r"^(\*\*[^*]+?[:：]\*\*\s+.+)$")
OLD_BTN_RE = re.compile(r"<AudioButton[^>]*/>\s*")


def transform(md_path: Path, season: str) -> tuple[int, str]:
    ep = md_path.stem
    seg_file = SEG_BASE / season / f"{ep}.json"
    if not seg_file.exists():
        return 0, "no-segments"
    segments = json.loads(seg_file.read_text(encoding="utf-8"))["segments"]

    text = OLD_BTN_RE.sub("", md_path.read_text(encoding="utf-8"))
    lines = text.splitlines(keepends=True)
    out: list[str] = []
    idx = 0
    for line in lines:
        content = line.rstrip("\r\n")
        ending = line[len(content):]
        if not DIALOG_LINE_RE.match(content):
            out.append(line)
            continue
        if idx >= len(segments):
            return idx, "count-mismatch"
        seg = segments[idx]
        idx += 1
        src = f"/audio/episodes/{season}/{ep}.mp3"
        out.append(
            f'<AudioButton src="{src}" start="{seg["start"]}" duration="{seg["duration"]}" /> {content}{ending}'
        )
    if idx != len(segments):
        return idx, f"count-mismatch(segments={len(segments)})"
    md_path.write_text("".join(out), encoding="utf-8")
    return idx, "ok"


def main(seasons: list[str]) -> int:
    bad = []
    total = 0
    for season in seasons:
        s_dir = BASE / season
        if not s_dir.exists():
            continue
        for md in sorted(s_dir.glob(f"{season}E*.md")):
            n, status = transform(md, season)
            total += n
            if status != "ok":
                bad.append(f"{season}/{md.name}: {status} idx={n}")
    print(f"TOTAL injected: {total}")
    if bad:
        print("PROBLEMS:")
        print("\n".join(bad))
        return 1
    print("[done] all episodes reinjected")
    return 0


if __name__ == "__main__":
    seasons = sys.argv[1:] or ["S01", "S02", "S03", "S04", "S05", "S06", "S07", "S08", "S09", "S10"]
    sys.exit(main(seasons))
