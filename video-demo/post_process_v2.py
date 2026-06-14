#!/usr/bin/env python3
"""
QuoteSnap Demo Post-Processing V2 — Auto captions, transitions, click highlights.
Uses PIL for text rendering to avoid MoviePy TextClip descender clipping.
"""

import os
import subprocess
from pathlib import Path

os.environ["FFMPEG_BINARY"] = "/Users/viankruger/Library/Python/3.9/lib/python/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1"

from moviepy import VideoFileClip, ImageClip, ColorClip, CompositeVideoClip, concatenate_videoclips
from PIL import Image, ImageDraw, ImageFont
import numpy as np

RAW_DIR = Path(__file__).parent / "raw"
OUTPUT_DIR = Path(__file__).parent / "output"
MUSIC_PATH = Path(__file__).parent / "assets" / "bg_music.wav"
FFMPEG_BIN = os.environ["FFMPEG_BINARY"]

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Design system matching QuoteSnap
FONT_PATH = "/System/Library/Fonts/SFCompact.ttf"
BG_COLOR = (26, 26, 26)  # #1A1A1A
PRIMARY_COLOR = (27, 77, 62)  # #1B4D3E
ACCENT_COLOR = (212, 160, 23)  # #D4A017
TEXT_COLOR = (245, 241, 235)  # #F5F1EB
# Auto-generated captions from script actions
OVERLAYS = [
    (0.0, 8.0, "Describe the job in your own words", "type"),
    (8.0, 12.0, "Add job details for accuracy", "action"),
    (12.0, 16.0, "Fine-tune with advanced options", "action"),
    (16.0, 22.0, "Select materials and site conditions", "action"),
    (22.0, 26.0, "AI generates your quote in seconds", "highlight"),
    (26.0, 34.0, "Full breakdown: labour, materials, GST", "showcase"),
    (34.0, 40.0, "Edit anything on the spot", "action"),
    (40.0, 48.0, "Download PDF, email or share", "showcase"),
    (48.0, 54.0, "Get your first 3 quotes free", "cta"),
]


def render_text_to_image(text, font_size, box_w, box_h, box_pad, accent_width, is_accent):
    """Render text + background box using PIL for accurate descender handling."""
    img = Image.new("RGBA", (box_w, box_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background
    bg_rgba = BG_COLOR + (int(0.85 * 255),)
    draw.rounded_rectangle([0, 0, box_w, box_h], radius=8, fill=bg_rgba)
    
    # Accent bar
    bar_color = ACCENT_COLOR if is_accent else PRIMARY_COLOR
    draw.rectangle([0, 0, accent_width, box_h], fill=bar_color)
    
    # Text
    try:
        font = ImageFont.truetype(FONT_PATH, font_size)
    except:
        font = ImageFont.load_default()
    
    # Get text bounding box with proper descender space
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    
    # Center text in remaining box space
    text_x = accent_width + (box_w - accent_width - text_w) // 2
    text_y = (box_h - text_h) // 2 - bbox[1]  # Offset by bbox[1] to account for ascent
    
    # Draw text with outline for readability
    for dx, dy in [(-1, -1), (-1, 1), (1, -1), (1, 1)]:
        draw.text((text_x + dx, text_y + dy), text, font=font, fill=BG_COLOR)
    draw.text((text_x, text_y), text, font=font, fill=TEXT_COLOR)
    
    return img


def create_caption(text, start, end, style, video_w, video_h):
    """Create a styled caption overlay using PIL rendering."""
    duration = end - start
    if duration <= 0:
        return []
    
    styles = {
        "type": {"font_size": 28, "bg_alpha": 0.85, "accent": False},
        "action": {"font_size": 26, "bg_alpha": 0.75, "accent": False},
        "highlight": {"font_size": 32, "bg_alpha": 0.9, "accent": True},
        "showcase": {"font_size": 28, "bg_alpha": 0.8, "accent": True},
        "cta": {"font_size": 34, "bg_alpha": 0.95, "accent": True},
    }
    
    cfg = styles.get(style, styles["action"])
    font_size = cfg["font_size"]
    box_pad = 18 if style == "cta" else 14
    accent_width = 4 if cfg["accent"] else 2
    
    # Measure text with PIL first to get accurate size
    try:
        font = ImageFont.truetype(FONT_PATH, font_size)
    except:
        font = ImageFont.load_default()
    
    temp_img = Image.new("RGBA", (1, 1))
    temp_draw = ImageDraw.Draw(temp_img)
    bbox = temp_draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    
    # Box size
    box_w = min(text_w + box_pad * 2 + accent_width, video_w - 40)
    box_h = text_h + box_pad * 2 + 8  # Extra padding for descenders
    
    x = (video_w - box_w) // 2
    y = video_h - box_h - 80  # Position from bottom
    
    # Render the caption image
    img = render_text_to_image(text, font_size, box_w, box_h, box_pad, accent_width, cfg["accent"])
    
    # Convert to MoviePy clip
    clip = ImageClip(np.array(img)).with_start(start).with_duration(duration).with_position((x, y))
    
    return [clip]


def add_scene_transitions(clips, transition_duration=0.4):
    """Add fade transitions between clips."""
    if len(clips) < 2:
        return clips
    
    result = [clips[0]]
    for i in range(1, len(clips)):
        prev = result[-1]
        curr = clips[i]
        
        faded = prev.with_end(prev.duration - transition_duration).crossfadeout(transition_duration)
        result[-1] = faded
        
        curr_faded = curr.with_start(0).crossfadein(transition_duration)
        result.append(curr_faded)
    
    return result


def main():
    videos = list(RAW_DIR.glob("*.webm")) + list(RAW_DIR.glob("*.mp4"))
    if not videos:
        raise FileNotFoundError("No raw video found")
    raw = max(videos, key=lambda p: p.stat().st_mtime)
    
    video = VideoFileClip(str(raw))
    w, h = video.w, video.h
    dur = video.duration
    print(f"Raw: {w}x{h}, {dur:.1f}s")
    
    # Build caption overlays
    clips = [video]
    for start, end, text, style in OVERLAYS:
        if start < dur:
            end = min(end, dur)
            clips.extend(create_caption(text, start, end, style, w, h))
    
    # Composite
    final = CompositeVideoClip(clips, size=(w, h))
    
    silent = OUTPUT_DIR / "quotesnap_demo_v2_silent.mp4"
    out = OUTPUT_DIR / "quotesnap_demo_v2_final.mp4"
    
    print(f"Exporting silent video...")
    final.write_videofile(str(silent), fps=30, codec="libx264", preset="fast", threads=4)
    final.close()
    video.close()
    
    # Mix with music
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
            "-af", "volume=0.20",
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
