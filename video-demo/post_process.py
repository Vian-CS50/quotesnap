#!/usr/bin/env python3
"""
QuoteSnap Demo Post-Processing — Hardcoded subtitles, no timestamps.
"""

import os
import subprocess
from pathlib import Path

os.environ["FFMPEG_BINARY"] = "/Users/viankruger/Library/Python/3.9/lib/python/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1"

from moviepy import VideoFileClip, TextClip, ColorClip, CompositeVideoClip

RAW_DIR = Path(__file__).parent / "raw"
OUTPUT_DIR = Path(__file__).parent / "output"
MUSIC_PATH = Path(__file__).parent / "assets" / "bg_music.wav"
FFMPEG_BIN = os.environ["FFMPEG_BINARY"]

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

FONT = "/System/Library/Fonts/SFCompact.ttf"
BG_COLOR = (15, 23, 42)
ACCENT_COLOR = (34, 197, 94)

# Hardcoded subtitles — timings match the Playwright script exactly
OVERLAYS = [
    (0.0, 5.0, "Describe the job. AI does the rest.", "subtle"),
    (5.0, 13.0, "Fine-tune with advanced options", "subtle"),
    (13.0, 16.0, "Hit 'Write My Quote'", "subtle"),
    (16.0, 20.0, "Full quote in seconds", "subtle"),
    (20.0, 26.0, "Line items, labour, GST — calculated", "subtle"),
    (26.0, 32.0, "Edit anything. Save. Done.", "subtle"),
    (32.0, 38.0, "Get your first 3 quotes free", "cta"),
]


def dot_subtitle(text, start, end, style, video_w, video_h):
    duration = end - start
    if duration <= 0:
        return []

    font_size = 32 if style == "cta" else 26
    box_pad = 16 if style == "cta" else 12
    stroke_w = 3 if style == "cta" else 2

    txt = TextClip(
        text=f"•  {text}",
        font=FONT,
        font_size=font_size,
        color="white",
        stroke_color=BG_COLOR,
        stroke_width=stroke_w,
        text_align="left",
        size=(video_w - 80, None),
        method="caption",
    )

    box_w = txt.w + box_pad * 2
    box_h = txt.h + box_pad * 2 + 6  # extra for descenders
    x = 24
    y = video_h - box_h - 40

    bg = ColorClip(size=(box_w, box_h), color=BG_COLOR)
    bg = bg.with_start(start).with_duration(duration).with_position((x, y))

    accent = ColorClip(size=(4, box_h), color=ACCENT_COLOR)
    accent = accent.with_start(start).with_duration(duration).with_position((x, y))

    txt = txt.with_start(start).with_duration(duration)
    txt = txt.with_position((x + box_pad + 4, y + box_pad))

    return [bg, accent, txt]


def main():
    videos = list(RAW_DIR.glob("*.webm")) + list(RAW_DIR.glob("*.mp4"))
    if not videos:
        raise FileNotFoundError("No raw video found")
    raw = max(videos, key=lambda p: p.stat().st_mtime)

    video = VideoFileClip(str(raw))
    w, h = video.w, video.h
    dur = video.duration
    print(f"Raw: {w}x{h}, {dur:.1f}s")

    clips = [video]
    for start, end, text, style in OVERLAYS:
        if start < dur:
            end = min(end, dur)
            clips.extend(dot_subtitle(text, start, end, style, w, h))

    final = CompositeVideoClip(clips, size=(w, h))

    silent = OUTPUT_DIR / "quotesnap_demo_silent.mp4"
    out = OUTPUT_DIR / "quotesnap_demo_final.mp4"

    print(f"Exporting silent video...")
    final.write_videofile(str(silent), fps=30, codec="libx264", preset="fast", threads=4)
    final.close()
    video.close()

    if MUSIC_PATH.exists():
        print("Mixing music...")
        cmd = [
            FFMPEG_BIN, "-y",
            "-i", str(silent),
            "-stream_loop", "-1",
            "-i", str(MUSIC_PATH),
            "-c:v", "copy",
            "-c:a", "aac",
            "-b:a", "128k",
            "-af", "volume=0.25",
            "-t", str(dur),
            str(out),
        ]
        subprocess.run(cmd, check=True, capture_output=True)
        silent.unlink()
    else:
        silent.rename(out)

    print(f"\n✅ Done: {out}")
    print(f"   Size: {out.stat().st_size / 1024 / 1024:.1f} MB")

    result = subprocess.run([FFMPEG_BIN, "-i", str(out)], capture_output=True, text=True)
    for line in result.stderr.split("\n"):
        if "Duration" in line:
            print(f"   {line.strip()}")


if __name__ == "__main__":
    main()
