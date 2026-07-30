# -*- coding: utf-8 -*-
"""把逐句 mp3 无损拼接成每集一个 mp3(ffmpeg -c copy,不重新编码),
并输出每句的 (start, duration) 片段表(_segments/{season}/{ep}.json)。
输出: src/.vuepress/public/audio/episodes/{season}/{ep}.mp3
用法: python _pack_episode_audio.py [S01 S02 ...]  (默认全部)
"""
import json
import re
import subprocess
import sys
from pathlib import Path

from mutagen.mp3 import MP3

BASE = Path(__file__).resolve().parent
SRC_ROOT = BASE.parent.parent.parent  # src/
AUDIO_BASE = SRC_ROOT / ".vuepress" / "public" / "audio" / "friends"
OUT_BASE = SRC_ROOT / ".vuepress" / "public" / "audio" / "episodes"
SEG_BASE = BASE / "_segments"
FFMPEG = "ffmpeg"

IDX_RE = re.compile(r"^(\d{3})\.mp3$")


def duration_of(f: Path) -> float:
    """mutagen 优先,异常文件回退 ffprobe。"""
    try:
        return MP3(str(f)).info.length
    except Exception:
        r = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "csv=p=0", str(f)],
            capture_output=True, text=True, check=True,
        )
        return float(r.stdout.strip())


def pack_episode(season: str, ep_dir: Path) -> dict:
    ep = ep_dir.name  # S01E01
    files = sorted(
        (f for f in ep_dir.iterdir() if IDX_RE.match(f.name)),
        key=lambda f: f.name,
    )
    if not files:
        return {"ep": ep, "lines": 0, "skip": True}

    durations = [duration_of(f) for f in files]
    starts = []
    t = 0.0
    for d in durations:
        starts.append(round(t, 3))
        t += d
    total = t

    out_dir = OUT_BASE / season
    out_dir.mkdir(parents=True, exist_ok=True)
    out_mp3 = out_dir / f"{ep}.mp3"
    if not (out_mp3.exists() and out_mp3.stat().st_size > 0):
        list_file = ep_dir / "_concat_list.txt"
        list_file.write_text(
            "\n".join(f"file '{f.name}'" for f in files), encoding="utf-8"
        )
        subprocess.run(
            [FFMPEG, "-y", "-f", "concat", "-safe", "0",
             "-i", list_file.name, "-c", "copy", str(out_mp3)],
            cwd=ep_dir, check=True, capture_output=True,
        )
        list_file.unlink()

    seg_dir = SEG_BASE / season
    seg_dir.mkdir(parents=True, exist_ok=True)
    (seg_dir / f"{ep}.json").write_text(
        json.dumps(
            {"ep": ep, "src": f"/audio/episodes/{season}/{ep}.mp3",
             "segments": [{"start": s, "duration": round(d, 3)}
                          for s, d in zip(starts, durations)]},
            ensure_ascii=False, indent=0,
        ),
        encoding="utf-8",
    )
    return {"ep": ep, "lines": len(files), "total": round(total, 1)}


def main(seasons: list[str]) -> int:
    grand_lines = 0
    for season in seasons:
        s_dir = AUDIO_BASE / season
        if not s_dir.exists():
            print(f"{season}: not found, skipped")
            continue
        n_eps = n_lines = 0
        for ep_dir in sorted(s_dir.iterdir()):
            if not ep_dir.is_dir():
                continue
            r = pack_episode(season, ep_dir)
            if r.get("skip"):
                continue
            n_eps += 1
            n_lines += r["lines"]
        grand_lines += n_lines
        print(f"{season}: {n_eps} episodes, {n_lines} lines packed", flush=True)
    print(f"[done] {grand_lines} lines packed total")
    return 0


if __name__ == "__main__":
    seasons = sys.argv[1:] or ["S01", "S02", "S03", "S04", "S05", "S06", "S07", "S08", "S09", "S10"]
    sys.exit(main(seasons))
