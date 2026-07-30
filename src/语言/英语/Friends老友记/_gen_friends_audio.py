# -*- coding: utf-8 -*-
"""
解析 Friends 各季 S{NN}E*.md，为每句对白生成 edge-tts 音频。
输出: src/.vuepress/public/audio/friends/{season}/{ep}/{idx:03d}.mp3
idx = 该集内对白的 1-based 序号

v3: 全季支持;六主角(及常驻角色)分配不同嗓音(大小写不敏感);
    TTS 前剥离 (on phone) 等舞台提示;乱码 � 按撇号处理;失败重试,断点续跑。
用法: python _gen_friends_audio.py [S01 S02 ...]   (默认全部季)
"""
import asyncio
import re
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent.parent.parent
MD_BASE = ROOT / "语言" / "英语" / "Friends老友记"
OUT_ROOT = ROOT / ".vuepress" / "public" / "audio" / "friends"
CONCURRENCY = 12

# 角色 -> 嗓音(键为小写)
VOICES = {
    "rachel green": "en-US-JennyNeural",
    "monica geller": "en-US-AriaNeural",
    "phoebe buffay": "en-US-EmmaNeural",
    "ross geller": "en-US-ChristopherNeural",
    "chandler bing": "en-US-EricNeural",
    "joey tribbiani": "en-US-GuyNeural",
    "all": "en-US-AndrewMultilingualNeural",
    "carol willick": "en-US-AvaNeural",
    "susan bunch": "en-US-AnaNeural",
    "janice": "en-US-MichelleNeural",
    "mike": "en-US-BrianNeural",
}
DEFAULT_VOICE = "en-US-AndrewMultilingualNeural"

# **Name:** text   或   <AudioButton .../> **Name:** text
DIALOG_RE = re.compile(
    r"^(?:<AudioButton[^>]*/>\s*)?\*\*([^*]+?)[:：]\*\*\s*(.+)$", re.M
)

STAGE_RE = re.compile(r"\([^)]*\)")


def extract_dialogs(md_path: Path) -> list[tuple[str, str]]:
    """返回 [(speaker, text)]"""
    text = md_path.read_text(encoding="utf-8")
    return DIALOG_RE.findall(text)


def tts_text(text: str) -> str:
    """剥离舞台提示 (on phone)/(pause);乱码 � 多为丢失的撇号,还原为 '。"""
    t = STAGE_RE.sub(" ", text).replace("�", "'")
    t = re.sub(r"\s+", " ", t).strip()
    return t or text.strip()


async def gen_one(sem: asyncio.Semaphore, voice: str, text: str, out_path: Path):
    if out_path.exists() and out_path.stat().st_size > 0:
        return text, True, "skip"
    async with sem:
        for attempt in range(3):
            try:
                await edge_tts.Communicate(text, voice).save(str(out_path))
                return text, True, "ok"
            except Exception as e:  # noqa: BLE001
                if attempt == 2:
                    return text, False, f"{type(e).__name__}: {e}"
                await asyncio.sleep(2.0 * (attempt + 1))
    return text, False, "unreachable"


async def main(seasons: list[str]) -> int:
    sem = asyncio.Semaphore(CONCURRENCY)
    tasks = []
    total = 0
    for season in seasons:
        md_dir = MD_BASE / season
        out_base = OUT_ROOT / season
        out_base.mkdir(parents=True, exist_ok=True)
        md_files = sorted(md_dir.glob(f"{season}E*.md"))
        print(f"[plan] {season}: {len(md_files)} episodes", flush=True)
        for md in md_files:
            ep = md.stem  # S02E01
            dialogs = extract_dialogs(md)
            ep_dir = out_base / ep
            ep_dir.mkdir(parents=True, exist_ok=True)
            for i, (speaker, line) in enumerate(dialogs, 1):
                out = ep_dir / f"{i:03d}.mp3"
                voice = VOICES.get(speaker.strip().lower(), DEFAULT_VOICE)
                tasks.append(gen_one(sem, voice, tts_text(line), out))
                total += 1
    print(f"[plan] {total} dialogue lines", flush=True)

    done = 0
    failed: list[tuple[str, str]] = []
    for coro in asyncio.as_completed(tasks):
        text, ok, msg = await coro
        done += 1
        if not ok:
            failed.append((text[:60], msg))
        if done % 500 == 0 or done == total:
            print(f"[progress] {done}/{total} (failed={len(failed)})", flush=True)

    if failed:
        print("[failed]")
        for t, m in failed[:20]:
            print(f"  {t}: {m}")
        return 1
    print("[done] all generated")
    return 0


if __name__ == "__main__":
    seasons = sys.argv[1:] or ["S01", "S02", "S03", "S04", "S05", "S06", "S07", "S08", "S09", "S10"]
    sys.exit(asyncio.run(main(seasons)))
