#!/usr/bin/env python3
"""Generate voiceover narration using macOS say command."""

import subprocess
from pathlib import Path

OUTPUT = Path(__file__).parent / "assets" / "music" / "voiceover.aiff"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

VOICE = "Karen"
RATE = 175

SCRIPT = """Adelaide landscapers. Stop writing quotes by hand.

Just tap the mic and talk for thirty seconds.

AI writes the full quote. Line items, labour, materials, GST. All calculated automatically.

See crew size, days on site, rate breakdown. Every detail transparent.

Add job details for more accuracy. Built-in material calculator too.

One click. Tax Invoice.

Quotesnap dot com dot a u."""


def main():
    print(f"Generating voiceover with voice '{VOICE}'...")
    subprocess.run([
        "say", "-v", VOICE, "-r", str(RATE), "-o", str(OUTPUT), SCRIPT,
    ], check=True)

    mp3_out = OUTPUT.with_suffix(".mp3")
    ffmpeg = "/Users/viankruger/Library/Python/3.9/lib/python/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1"
    subprocess.run([
        ffmpeg, "-y", "-i", str(OUTPUT),
        "-codec:a", "libmp3lame", "-b:a", "192k", str(mp3_out)
    ], check=True, capture_output=True)
    OUTPUT.unlink()

    print(f"✅ Voiceover: {mp3_out}")


if __name__ == "__main__":
    main()
