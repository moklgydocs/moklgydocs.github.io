# -*- coding: utf-8 -*-
"""E:\\教程\\老友记音频 十季 WMA -> mp3(96k),输出 public/audio/friends-tv/{season}/{ep}.mp3
断点续跑: 已存在且非空的跳过。仅本地使用,该目录已 gitignore。
"""
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

SRC = Path(r"E:/教程/老友记音频")
OUT = Path(r"E:/博客/moklgydocs.github.io/src/.vuepress/public/audio/friends-tv")

SEASON_MAP = {
    "第一季": "S01", "第二季": "S02", "第三季": "S03", "第四季": "S04", "第五季": "S05",
    "第六季": "S06", "第七季": "S07", "第八季": "S08", "第九季": "S09", "第十季": "S10",
}
EP_RE = re.compile(r"(S\d{2}E\d{2})", re.I)


def convert(src: Path, dst: Path) -> str:
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.exists() and dst.stat().st_size > 0:
        return "skip"
    r = subprocess.run(
        ["ffmpeg", "-y", "-i", str(src), "-b:a", "96k", "-ar", "44100", str(dst)],
        capture_output=True,
    )
    return "ok" if r.returncode == 0 else f"FAIL {r.stderr[-150:]!r}"


def main() -> int:
    jobs = []
    for season_cn, season in SEASON_MAP.items():
        d = SRC / season_cn
        if not d.exists():
            print(f"{season_cn}: 目录不存在,跳过")
            continue
        for wma in sorted(d.glob("*.wma")):
            m = EP_RE.search(wma.name)
            if not m:
                print(f"无法识别集数: {wma.name}")
                continue
            ep = m.group(1).upper()
            jobs.append((wma, OUT / season / f"{ep}.mp3"))
    print(f"[plan] {len(jobs)} episodes")

    ok = skip = fail = 0
    with ThreadPoolExecutor(max_workers=8) as ex:
        for (wma, dst), result in zip(jobs, ex.map(lambda j: convert(*j), jobs)):
            if result == "ok":
                ok += 1
            elif result == "skip":
                skip += 1
            else:
                fail += 1
                print(f"  FAIL {wma.name}: {result}")
    print(f"[done] ok={ok} skip={skip} fail={fail}")
    return 1 if fail else 0


if __name__ == "__main__":
    sys.exit(main())
