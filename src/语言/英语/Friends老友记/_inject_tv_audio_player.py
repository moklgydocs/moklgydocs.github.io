# -*- coding: utf-8 -*-
"""给每集 md 在 frontmatter 后注入 StickyAudio 整集原声播放器。
仅当 public/audio/friends-tv/{season}/{ep}.mp3 存在时注入。幂等。
用法: python _inject_tv_audio_player.py [S01 S02 ...]
"""
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent
AUDIO_BASE = BASE.parent.parent.parent / ".vuepress" / "public" / "audio" / "friends-tv"

TITLE_RE = re.compile(r'^title:\s*["\']?(.*?)["\']?\s*$', re.M)


def transform(md: Path, season: str) -> str:
    ep = md.stem
    mp3 = AUDIO_BASE / season / f"{ep}.mp3"
    if not mp3.exists():
        return "no-audio"
    text = md.read_text(encoding="utf-8")
    if "StickyAudio" in text:
        return "skip"
    m = TITLE_RE.search(text)
    title = (m.group(1) if m else ep).replace('"', "'")
    player = f'\n<StickyAudio src="/audio/friends-tv/{season}/{ep}.mp3" title="{title}" />\n'
    # 插到 frontmatter 结束 --- 之后;无 frontmatter 则插到文件头
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            close = text.index("\n", end + 1)
            text = text[:close] + player + text[close:]
        else:
            text = player + text
    else:
        text = player + text
    md.write_text(text, encoding="utf-8")
    return "ok"


def main(seasons: list[str]) -> int:
    from collections import Counter
    stats = Counter()
    for season in seasons:
        for md in sorted((BASE / season).glob(f"{season}E*.md")):
            r = transform(md, season)
            stats[r] += 1
            if r not in ("ok", "skip"):
                print(f"{season}/{md.name}: {r}")
    print(f"[done] {dict(stats)}")
    return 0


if __name__ == "__main__":
    seasons = sys.argv[1:] or ["S01", "S02", "S03", "S04", "S05", "S06", "S07", "S08", "S09", "S10"]
    sys.exit(main(seasons))
