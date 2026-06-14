#!/usr/bin/env python3
"""
QuoteSnap Demo V2 — Smooth cursor, click ripples, transitions.
Target: ~40 seconds, cinematic feel.
"""

import asyncio
import json
from pathlib import Path
import httpx
from playwright.async_api import async_playwright, Page

FRONTEND_URL = "http://localhost:3000"
API_URL = "http://localhost:8341"
VIEWPORT_W, VIEWPORT_H = 720, 1280
VIDEO_DIR = Path(__file__).parent / "raw"
VIDEO_DIR.mkdir(parents=True, exist_ok=True)

# Detailed quote transcript
QUOTE_TRANSCRIPT = """We need a 12 metre retaining wall along the back boundary, about 800mm high with concrete sleepers and steel posts. Then 40 square metres of premium Sir Walter buffalo turf laid, plus 3 cubic metres of organic mulch in the garden beds and hedge trimming for the lilly pillys along the fence. Client is the Johnsons at 42 Oak Street, Burnside. Access is tight down the side driveway so we'll need to barrow everything through."""


def fetch_quote():
    res = httpx.post(
        f"{API_URL}/api/generate-quote",
        json={
            "transcript": QUOTE_TRANSCRIPT,
            "job_details": {"client_name": "The Johnsons", "site_address": "42 Oak Street, Burnside"}
        },
        timeout=30.0
    )
    return res.json()


async def smooth_scroll(page: Page, pixels: int, duration_ms: int = 1500):
    """Smooth scroll by relative pixels."""
    await page.evaluate(f"""
        new Promise(resolve => {{
            const start = window.scrollY;
            const target = start + {pixels};
            const duration = {duration_ms};
            const startTime = performance.now();
            
            function ease(t) {{
                return t < 0.5 ? 2*t*t : -1 + (4-2*t)*t;
            }}
            
            function step(now) {{
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = ease(progress);
                window.scrollTo(0, start + (target - start) * eased);
                
                if (progress < 1) {{
                    requestAnimationFrame(step);
                }} else {{
                    resolve();
                }}
            }}
            
            requestAnimationFrame(step);
        }});
    """)
    await asyncio.sleep(duration_ms / 1000)


async def scroll_to_element(page: Page, selector: str, offset: int = 100, duration_ms: int = 1000):
    """Smooth scroll to bring element into view with offset from top."""
    await page.evaluate("""
        (args) => new Promise(resolve => {
            const elem = document.querySelector(args.selector);
            if (!elem) { resolve(); return; }
            const target = elem.getBoundingClientRect().top + window.scrollY - args.offset;
            const start = window.scrollY;
            const duration = args.duration;
            const startTime = performance.now();
            
            function ease(t) {
                return t < 0.5 ? 2*t*t : -1 + (4-2*t)*t;
            }
            
            function step(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = ease(progress);
                window.scrollTo(0, start + (target - start) * eased);
                
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    resolve();
                }
            }
            
            requestAnimationFrame(step);
        });
    """, {"selector": selector, "offset": offset, "duration": duration_ms})
    await asyncio.sleep(duration_ms / 1000)


async def add_cursor(page: Page):
    """Inject a custom smooth cursor."""
    await page.add_style_tag(content="""
        #demo-cursor {
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(27, 77, 62, 0.8);
            border-radius: 50%;
            background: rgba(27, 77, 62, 0.15);
            pointer-events: none;
            z-index: 999999;
            transition: transform 0.15s ease-out, opacity 0.2s ease;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 10px rgba(27, 77, 62, 0.3);
        }
        #demo-cursor.clicking {
            transform: translate(-50%, -50%) scale(0.7);
            background: rgba(27, 77, 62, 0.4);
        }
        .click-ripple {
            position: fixed;
            border: 2px solid rgba(27, 77, 62, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 999998;
            animation: ripple-expand 0.6s ease-out forwards;
        }
        @keyframes ripple-expand {
            0% { width: 0; height: 0; opacity: 1; }
            100% { width: 60px; height: 60px; opacity: 0; }
        }
    """)
    await page.evaluate("""
        const cursor = document.createElement('div');
        cursor.id = 'demo-cursor';
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
        document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
    """)


async def click_with_ripple(page: Page, selector: str, delay: float = 0.5):
    """Click with visual ripple effect."""
    elem = page.locator(selector).first
    box = await elem.bounding_box()
    if box:
        x = box["x"] + box["width"] / 2
        y = box["y"] + box["height"] / 2
        
        await page.evaluate(f"""
            const cursor = document.getElementById('demo-cursor');
            if (cursor) {{
                cursor.style.left = '{x}px';
                cursor.style.top = '{y}px';
            }}
        """)
        await asyncio.sleep(0.3)
        
        await page.evaluate(f"""
            const ripple = document.createElement('div');
            ripple.className = 'click-ripple';
            ripple.style.left = '{x - 30}px';
            ripple.style.top = '{y - 30}px';
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        """)
    
    await elem.click()
    await asyncio.sleep(delay)


async def type_with_cursor(page: Page, selector: str, text: str, delay_ms: int = 25):
    """Type text with visible cursor movement."""
    elem = page.locator(selector).first
    await elem.focus()
    await asyncio.sleep(0.2)
    
    for char in text:
        await elem.type(char, delay=delay_ms)
        await page.evaluate("""
            const cursor = document.getElementById('demo-cursor');
            const active = document.activeElement;
            if (cursor && active) {
                const rect = active.getBoundingClientRect();
                cursor.style.left = (rect.right - 10) + 'px';
                cursor.style.top = (rect.top + rect.height/2) + 'px';
            }
        """)
    
    await asyncio.sleep(0.5)


async def record():
    quote = fetch_quote()

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": VIEWPORT_W, "height": VIEWPORT_H},
            device_scale_factor=2,
            record_video_dir=str(VIDEO_DIR),
            record_video_size={"width": VIEWPORT_W, "height": VIEWPORT_H},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
        )
        page = await context.new_page()

        # Load page
        await page.goto(FRONTEND_URL, wait_until="networkidle")
        
        # Add custom cursor
        await add_cursor(page)

        # Mock API
        async def handle(route, request):
            if request.method == "POST" and "/api/generate-quote" in request.url:
                await route.fulfill(status=200, content_type="application/json",
                                    body=json.dumps(quote))
            else:
                await route.continue_()
        await page.route("**/api/generate-quote", handle)

        # SCENE 1: Scroll to textarea + type detailed quote (0–8s)
        await scroll_to_element(page, "textarea", offset=120, duration_ms=1200)
        await asyncio.sleep(0.3)
        
        await type_with_cursor(page, "textarea", QUOTE_TRANSCRIPT, delay_ms=15)
        await asyncio.sleep(1.5)

        # SCENE 2: Expand job details (8–12s)
        await click_with_ripple(page, "button:has-text('Add job details (optional)')", delay=1.5)
        
        # SCENE 3: Advanced options (12–16s)
        await click_with_ripple(page, "button:has-text('Advanced Details')", delay=1.5)
        
        # SCENE 4: Select dropdowns (16–22s)
        await smooth_scroll(page, 300, 1000)
        await asyncio.sleep(0.3)
        
        selects = page.locator("select")
        if await selects.count() >= 2:
            await selects.nth(1).select_option("Concrete pavers")
            await asyncio.sleep(1.5)
            
            await selects.nth(4).select_option("Grass lawn")
            await asyncio.sleep(1.5)

        # SCENE 5: Generate quote (22–26s)
        await smooth_scroll(page, -200, 800)
        await asyncio.sleep(0.3)
        await click_with_ripple(page, "button:has-text('Generate Quote')", delay=2.5)

        # SCENE 6: Scroll to show generated quote + dwell (26–34s)
        await smooth_scroll(page, 500, 1200)
        await asyncio.sleep(6.0)

        # SCENE 7: Edit quote (34–40s)
        await click_with_ripple(page, "button:has-text('Edit')", delay=2.0)
        
        price_input = page.locator("input[type='number']").nth(2)
        if await price_input.count() > 0:
            await price_input.first.fill("185")
            await asyncio.sleep(0.8)
            await price_input.first.press("Tab")
            await asyncio.sleep(1.0)
        
        await click_with_ripple(page, "button:has-text('Save')", delay=1.5)

        # SCENE 8: Download PDF + Share (40–48s)
        await smooth_scroll(page, -300, 800)
        await asyncio.sleep(0.3)
        await click_with_ripple(page, "button:has-text('PDF')", delay=2.0)
        await click_with_ripple(page, "button:has-text('Email')", delay=2.0)

        # SCENE 9: CTA scroll (48–54s)
        await smooth_scroll(page, 800, 1200)
        await asyncio.sleep(4.0)

        # Buffer
        await asyncio.sleep(2.0)
        await context.close()
        await browser.close()

        videos = list(VIDEO_DIR.glob("*.webm")) + list(VIDEO_DIR.glob("*.mp4"))
        latest = max(videos, key=lambda p: p.stat().st_mtime)
        print(f"\n✅ Raw: {latest} ({latest.stat().st_size / 1024 / 1024:.1f} MB)")


if __name__ == "__main__":
    asyncio.run(record())
