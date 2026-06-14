#!/usr/bin/env python3
"""
QuoteSnap Demo — Correct two-level toggle flow.
Target: ~40 seconds.
"""

import asyncio
import json
import re
from pathlib import Path
import httpx
from playwright.async_api import async_playwright

FRONTEND_URL = "http://localhost:3000"
API_URL = "http://localhost:8341"
VIEWPORT_W, VIEWPORT_H = 720, 1280
VIDEO_DIR = Path(__file__).parent / "raw"
VIDEO_DIR.mkdir(parents=True, exist_ok=True)


def fetch_quote():
    res = httpx.post(
        f"{API_URL}/api/generate-quote",
        json={
            "transcript": "Retaining wall 12m, turf 40sqm, mulch and hedges for the Johnsons in Burnside.",
            "job_details": {"client_name": "The Johnsons", "site_address": "Burnside"}
        },
        timeout=30.0
    )
    return res.json()


async def scroll(page, pixels: int, duration_ms: int = 1500):
    await page.evaluate(f"window.scrollBy({{top: {pixels}, behavior: 'smooth'}});")
    await asyncio.sleep(duration_ms / 1000)


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

        # Mock API
        async def handle(route, request):
            if request.method == "POST" and "/api/generate-quote" in request.url:
                await route.fulfill(status=200, content_type="application/json",
                                    body=json.dumps(quote))
            else:
                await route.continue_()
        await page.route("**/api/generate-quote", handle)

        # Scroll to form area — centre the textarea in viewport
        await page.evaluate("""
            const el = document.querySelector('textarea');
            if (el) el.scrollIntoView({behavior: 'instant', block: 'center'});
        """)
        await asyncio.sleep(0.5)

        # 0–5s: Type transcript
        textarea = page.locator("textarea").first
        await textarea.fill("Retaining wall 12m, turf 40sqm, mulch and hedges for the Johnsons in Burnside.")
        await asyncio.sleep(4.5)

        # 5–7s: Click OUTER toggle "Add job details (optional)"
        outer_btn = page.locator("button", has_text=re.compile(r"Add job details", re.I))
        if await outer_btn.count() > 0:
            await outer_btn.first.click()
        await asyncio.sleep(2.0)

        # 7–9s: Click INNER toggle "Advanced (optional)"
        inner_btn = page.locator("button[data-advanced-toggle]")
        if await inner_btn.count() == 0:
            inner_btn = page.locator("button", has_text=re.compile(r"Advanced", re.I))
        if await inner_btn.count() > 0:
            await inner_btn.first.click()
        await asyncio.sleep(2.0)

        # 9–13s: Scroll down so dropdowns are visible, pick options
        await scroll(page, 350, 1200)
        await asyncio.sleep(0.5)

        # Now select dropdowns — they're native <select> elements inside the expanded form
        selects = page.locator("select")
        count = await selects.count()
        print(f"Found {count} select elements")

        if count >= 2:
            # First select after Job Type is Materials
            await selects.nth(1).select_option("Concrete pavers")
            await asyncio.sleep(2.0)

            await selects.nth(2).select_option("Grass lawn")
            await asyncio.sleep(2.0)

        # 13–16s: Scroll to Generate and click
        await page.evaluate("""
            const btns = Array.from(document.querySelectorAll('button'));
            const gen = btns.find(b => b.textContent.toLowerCase().includes('write my quote'));
            if (gen) gen.scrollIntoView({behavior: 'smooth', block: 'center'});
        """)
        await asyncio.sleep(1.0)
        btn = page.locator("button", has_text=re.compile(r"Write My Quote", re.I))
        await btn.click()
        await asyncio.sleep(3.0)

        # 16–20s: Scroll down to quote
        await scroll(page, 900, 1500)
        await asyncio.sleep(1.5)

        # 20–26s: Dwell on quote
        await asyncio.sleep(6.0)

        # 26–32s: Edit quote
        edit_btn = page.locator("button[title='Edit quote']")
        if await edit_btn.count() > 0:
            await edit_btn.first.click()
            await asyncio.sleep(2.5)

            price_input = page.locator("input[type='number']").nth(2)
            if await price_input.count() > 0:
                await price_input.first.fill("185")
                await asyncio.sleep(0.8)
                await price_input.first.press("Tab")
                await asyncio.sleep(1.5)

            save_btn = page.locator("button", has_text=re.compile(r"Save", re.I))
            if await save_btn.count() > 0:
                await save_btn.first.click()
                await asyncio.sleep(2.5)
        else:
            await asyncio.sleep(6.0)

        # 32–38s: CTA — scroll to bottom
        await page.evaluate("window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})")
        await asyncio.sleep(6.0)

        # Buffer for Playwright to finish writing frames
        await asyncio.sleep(3.0)
        await context.close()
        await browser.close()

        videos = list(VIDEO_DIR.glob("*.webm")) + list(VIDEO_DIR.glob("*.mp4"))
        latest = max(videos, key=lambda p: p.stat().st_mtime)
        print(f"\n✅ Raw: {latest} ({latest.stat().st_size / 1024 / 1024:.1f} MB)")


if __name__ == "__main__":
    asyncio.run(record())
