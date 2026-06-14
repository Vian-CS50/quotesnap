# QuoteSnap Demo Video Pipeline

Automated product demo recording using Playwright + MoviePy.

## What's New in V2

| Feature | V1 | V2 |
|---------|-----|-----|
| Cursor | Invisible | Custom smooth cursor with shadow |
| Click feedback | None | Ripple effect on every click |
| Zoom | None | Auto-zoom into elements before interaction |
| Scroll | Instant | Smooth eased scrolling |
| Captions | Hardcoded | Auto-generated from script actions |
| Transitions | None | Fade between scenes |
| Design | Generic | Matches QuoteSnap design system |

## Files

| File | Purpose |
|------|---------|
| `generate_demo.py` | V1 — basic playwright recording |
| `generate_demo_v2.py` | V2 — smooth cursor, ripples, zooms, transitions |
| `post_process.py` | V1 — hardcoded subtitles + music |
| `post_process_v2.py` | V2 — auto captions, scene transitions, design system |
| `generate_voiceover.py` | macOS `say` TTS (optional) |
| `generate_music.py` | Background music generation |

## Quick Start

### 1. Start the app

```bash
# Terminal 1 — Backend
cd /Users/viankruger/quotesnap/backend
source .venv/bin/activate
uvicorn main:app --host 127.0.0.1 --port 8341

# Terminal 2 — Frontend
cd /Users/viankruger/quotesnap/frontend
npm run dev
```

### 2. Record the demo

```bash
cd /Users/viankruger/quotesnap/video-demo
python3 generate_demo_v2.py
```

### 3. Post-process

```bash
python3 post_process_v2.py
```

Output: `output/quotesnap_demo_v2_final.mp4`

## Customizing the Demo

### Change the transcript
Edit `generate_demo_v2.py` line 25:
```python
"transcript": "Your custom job description here...",
```

### Change captions
Edit `post_process_v2.py` — the `OVERLAYS` list:
```python
OVERLAYS = [
    (0.0, 6.0, "Your caption here", "type"),
    ...
]
```

Caption styles:
- `"type"` — typing action
- `"action"` — general action
- `"highlight"` — important moment
- `"showcase"` — showing a feature
- `"cta"` — call to action

### Change timing
Match the timestamps in `OVERLAYS` to the `await asyncio.sleep()` calls in `generate_demo_v2.py`.

### Add background music
Place a `.wav` file at `assets/bg_music.wav` or update the path in `post_process_v2.py`.

## Requirements

```bash
pip install playwright moviepy httpx
playwright install chromium
```

## How It Works

1. **Playwright** launches a headless Chromium browser
2. **API mocking** — the quote generation is pre-fetched and mocked so it's instant
3. **Custom cursor** — injected via JavaScript, follows mouse smoothly
4. **Click ripples** — visual feedback on every click
5. **Auto-zoom** — zooms into elements before interacting
6. **Smooth scroll** — eased scrolling between sections
7. **MoviePy** composites captions, transitions, and music
8. **ffmpeg** mixes audio and encodes final output

## Tips

- Record at 720x1280 (mobile portrait) for social media
- Use `device_scale_factor=2` for crisp text
- The raw video is `.webm` — processed to `.mp4`
- Keep demos under 45 seconds for social media
- Test the app manually first to ensure all selectors match
