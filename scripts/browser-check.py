#!/usr/bin/env python3
"""Browser integration checks against the compiled app, never production debug hooks.

Requires Python playwright and its browsers (or /usr/bin/chromium). Build first.
Run: python3 scripts/browser-check.py [--browser chromium|webkit|all]
"""
from __future__ import annotations

import argparse
import copy
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time
import traceback
import urllib.request

PROJECT = Path(__file__).resolve().parents[1]
RESULTS = PROJECT / "test-results"
SAVE_KEY = "merge-gems.save.v2"
PORT = int(os.environ.get("MERGE_GEMS_TEST_PORT", "4173"))
BASE = f"http://127.0.0.1:{PORT}/Merge-Gems/"

# These optional paths describe the managed test environment, not app dependencies.
if not os.environ.get("PLAYWRIGHT_BROWSERS_PATH") and Path("/tmp/merge-gems-browsers").exists():
    os.environ["PLAYWRIGHT_BROWSERS_PATH"] = "/tmp/merge-gems-browsers"
local_libs = Path("/tmp/merge-gems-webkit-libs/root/usr/lib/x86_64-linux-gnu")
if local_libs.exists():
    os.environ["LD_LIBRARY_PATH"] = str(local_libs) + ":" + os.environ.get("LD_LIBRARY_PATH", "")

from playwright.sync_api import sync_playwright  # noqa: E402


def fixture(*, reference=False, language="fr"):
    """Explicit valid save fixture; amounts are serialized integer milli-coins."""
    now = int(time.time() * 1000)
    worlds = {}
    for world in ("gemland", "moonland", "aztecland"):
        cells = [None] * 24
        cells[:3] = [
            {"kind": "gem", "rank": 0, "bornAt": now},
            {"kind": "gem", "rank": 0, "bornAt": now},
            {"kind": "crate", "rank": 0},
        ]
        worlds[world] = {
            "coins": "2000000", "incomeRemainder": "0", "cells": cells,
            "maxRank": 0, "xp": 0, "level": 1, "purchases": [0] * 39,
            "nextCrateAt": now + 600_000, "lastAccruedAt": now,
        }
    if reference:
        world = worlds["gemland"]
        world.update(coins="56170000", maxRank=8, level=6, xp=138)
        ranks = ["crate", 8, "crate", 5, 2, None, 6, 3, 1, None, 2]
        world["cells"] = [
            None if rank is None else {"kind": "crate", "rank": 0} if rank == "crate"
            else {"kind": "gem", "rank": rank, "bornAt": now}
            for rank in ranks
        ] + [None] * 13
    return {
        "version": 2, "id": "browser-fixture", "revision": 0, "savedAt": now,
        "activeWorld": "gemland", "worlds": worlds,
        "settings": {"language": language, "sound": False}, "tutorialStep": 4,
    }


def saved(page):
    return page.evaluate("key => JSON.parse(localStorage.getItem(key))", SAVE_KEY)


def writer_ready(page):
    page.wait_for_selector("#board .tile")
    page.wait_for_function("document.querySelector('#status').hidden === true")


def new_page(browser, *, state=None, size=(390, 844), locale="fr-FR", base=BASE):
    context = browser.new_context(viewport={"width": size[0], "height": size[1]},
                                  device_scale_factor=2, locale=locale, accept_downloads=True)
    if state is not None:
        context.add_init_script(f"""if (location.pathname.startsWith('/Merge-Gems/') && !localStorage.getItem({json.dumps(SAVE_KEY)})) localStorage.setItem({json.dumps(SAVE_KEY)}, {json.dumps(json.dumps(state))});""")
    page = context.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(base)
    writer_ready(page)
    return context, page, errors


def close_context(context, engine):
    if sys.exc_info()[0]:
        import inspect
        check = inspect.currentframe().f_back.f_code.co_name
        for index, page in enumerate(context.pages):
            try:
                page.screenshot(path=RESULTS / f"{engine}-{check}-failure-{index}.png")
                (RESULTS / f"{engine}-{check}-failure-{index}.html").write_text(page.content())
                diagnostics = page.evaluate("""async () => ({html:document.documentElement.outerHTML, scripts:[...document.scripts].map(s=>s.src), caches:await Promise.all((await caches.keys()).map(async key=>({key,urls:(await (await caches.open(key)).keys()).map(r=>r.url)})))})""")
                (RESULTS / f"{engine}-{check}-diagnostics-{index}.json").write_text(json.dumps(diagnostics,indent=2))
            except Exception:
                pass
    context.close()


def close_modal(page):
    if page.locator("#modal").evaluate("el => el.open"):
        page.locator("#close-modal").click()


def gem_signature(page):
    return page.locator("#board .gem").evaluate_all("els => els.map(el=>el.getAttribute('aria-label')).sort()")


def point(locator):
    box = locator.bounding_box()
    assert box, "Element has no visible box"
    return box["x"] + box["width"] / 2, box["y"] + box["height"] / 2


def drag(page, source, target):
    sx, sy = point(page.locator(source))
    tx, ty = point(page.locator(target))
    page.mouse.move(sx, sy)
    page.mouse.down()
    page.mouse.move(tx, ty, steps=10)
    page.mouse.up()


def assert_layout(page):
    sizes = page.evaluate("""() => ({w:innerWidth,h:innerHeight,sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight})""")
    assert sizes["sw"] <= sizes["w"], f"Horizontal overflow: {sizes}"
    assert sizes["sh"] <= sizes["h"] + 1, f"Vertical overflow: {sizes}"
    for selector in ("#settings", "#collection", "#shop", "#generate", "#area"):
        box = page.locator(selector).bounding_box()
        assert box and box["x"] >= 0 and box["y"] >= 0, f"Clipped {selector}: {box}"
        assert box["x"] + box["width"] <= sizes["w"] + 1, f"Right-clipped {selector}: {box}"
        assert box["y"] + box["height"] <= sizes["h"] + 1, f"Bottom-clipped {selector}: {box}"


def journey(browser, engine):
    context, page, errors = new_page(browser)
    try:
        initial = page.locator("#board .crate").count()
        page.locator("#generate").click()
        page.locator("#generate").click()
        page.wait_for_function("n => document.querySelectorAll('#board .crate').length > n", arg=initial)
        page.locator("#board .crate").first.click()
        assert page.locator("#board .gem").count() == 3
        drag(page, '[data-cell="0"]', '[data-cell="1"]')
        page.locator("#continue").wait_for()
        assert page.locator("#board .gem").count() == 2
        page.locator("#continue").click()
        assert saved(page)["worlds"]["gemland"]["maxRank"] == 1
        page.locator("#shop").click()
        page.locator('[data-buy="1"]').click()
        assert page.locator("#toast").is_visible()
        assert saved(page)["worlds"]["gemland"]["purchases"][1] == 0
        close_modal(page)
        before = gem_signature(page)
        page.reload(); writer_ready(page)
        assert gem_signature(page) == before
        page.locator("#settings").click()
        page.locator("#language").select_option("en")
        assert page.locator("html").get_attribute("lang") == "en"
        assert page.locator(".modal-heading h2").inner_text() == "Settings"
        close_modal(page)
        assert gem_signature(page) != before  # labels are translated, ranks remain saved
        assert saved(page)["settings"]["language"] == "en"
        page.reload(); writer_ready(page)
        assert page.locator("html").get_attribute("lang") == "en"
        assert not errors, errors
        page.screenshot(path=RESULTS / f"{engine}-journey.png")
    finally:
        close_context(context, engine)


def purchases_and_files(browser, engine):
    context, page, errors = new_page(browser, state=fixture(reference=True))
    try:
        initial = page.locator("#board .gem").count()
        page.locator("#shop").click()
        page.locator('[data-buy="1"]').click()
        assert page.locator("#board .gem").count() == initial + 1
        assert saved(page)["worlds"]["gemland"]["purchases"][1] == 1
        close_modal(page)
        page.reload(); writer_ready(page)
        assert saved(page)["worlds"]["gemland"]["purchases"][1] == 1
        page.locator("#settings").click()
        with page.expect_download() as transfer:
            page.locator("#export-save").click()
        path = RESULTS / f"{engine}-export.json"
        transfer.value.save_as(path)
        exported = json.loads(path.read_text())
        assert exported["format"] == "merge-gems-save"
        assert exported["game"]["worlds"]["gemland"]["purchases"][1] == 1
        identity = saved(page)["id"]
        page.locator("#import-file").set_input_files({"name": "invalid.json", "mimeType": "application/json", "buffer": b'{"version":999}'})
        page.wait_for_function("document.querySelector('#toast').hidden === false")
        assert saved(page)["id"] == identity
        assert saved(page)["worlds"]["gemland"]["purchases"][1] == 1
        # Valid imports still require explicit confirmation; refusing preserves the game.
        incoming = copy.deepcopy(exported)
        incoming["game"]["id"] = "imported-browser-fixture"
        payload = json.dumps(incoming).encode()
        page.once("dialog", lambda dialog: dialog.dismiss())
        page.locator("#import-file").set_input_files({"name": "valid.json", "mimeType": "application/json", "buffer": payload})
        page.wait_for_timeout(100)
        assert saved(page)["id"] == identity
        page.once("dialog", lambda dialog: dialog.accept())
        page.locator("#import-file").set_input_files({"name": "valid.json", "mimeType": "application/json", "buffer": payload})
        page.wait_for_function("key => JSON.parse(localStorage.getItem(key)).id === 'imported-browser-fixture'", arg=SAVE_KEY)
        assert saved(page)["worlds"]["gemland"]["purchases"][1] == 1
        page.locator("#settings").click()
        page.once("dialog", lambda dialog: dialog.dismiss())
        page.locator("#reset-save").click()
        assert saved(page)["id"] == "imported-browser-fixture"
        assert not errors, errors
    finally:
        close_context(context, engine)


def gestures_and_tabs(browser, engine):
    state = fixture()
    state["worlds"]["gemland"]["xp"] = 29
    context, page, errors = new_page(browser, state=state)
    try:
        before = gem_signature(page)
        sx, sy = point(page.locator('[data-cell="0"]'))
        page.mouse.move(sx, sy); page.mouse.down(); page.mouse.move(sx + 20, sy + 20, steps=3)
        page.locator('[data-cell="0"]').dispatch_event("pointercancel", {"pointerId": 1, "pointerType": "mouse", "isPrimary": True})
        page.mouse.up()
        assert gem_signature(page) == before
        assert page.locator(".drag-ghost").count() == 0
        sx, sy = point(page.locator('[data-cell="0"]'))
        page.mouse.move(sx, sy); page.mouse.down(); page.mouse.move(4, 4, steps=8); page.mouse.up()
        assert gem_signature(page) == before
        assert page.locator(".drag-ghost").count() == 0
        # Dropping onto a crate is invalid and preserves both gems.
        drag(page, '[data-cell="0"]', '[data-cell="2"]')
        assert gem_signature(page) == before
        drag(page, '[data-cell="0"]', '[data-cell="1"]')
        page.locator('#continue').click()
        assert saved(page)['worlds']['gemland']['level'] == 2
        assert page.locator('#board .tile').count() == 7
        follower = context.new_page(); follower.goto(BASE)
        follower.wait_for_selector("#status:not([hidden])")
        count = follower.locator("#board .crate").count()
        follower.locator("#generate").click()
        assert follower.locator("#board .crate").count() == count
        page.close()
        writer_ready(follower)
        assert follower.locator("#status").is_hidden()
        assert not errors, errors
        follower.screenshot(path=RESULTS / f"{engine}-takeover.png")
    finally:
        close_context(context, engine)


def storage_failures(browser, engine):
    def deny_primary_writes(page):
        page.evaluate("""() => {
            const set = Storage.prototype.setItem;
            Storage.prototype.setItem = function(key,value) {
                if (key === 'merge-gems.save.v2') throw new DOMException('quota','QuotaExceededError');
                return set.call(this,key,value);
            };
        }""")
    context, page, errors = new_page(browser)
    try:
        before = saved(page)
        gems = page.locator('#board .gem').count()
        page.locator('#settings').click()
        deny_primary_writes(page)
        page.once('dialog', lambda dialog: dialog.accept())
        page.locator('#reset-save').click()
        assert saved(page)['id'] == before['id']
        assert page.locator('#board .gem').count() == gems
        assert page.locator('#status').is_visible()
        incoming = copy.deepcopy(before)
        incoming['id'] = 'quota-replacement'
        page.once('dialog', lambda dialog: dialog.accept())
        page.locator('#import-file').set_input_files({'name':'valid.json','mimeType':'application/json','buffer':json.dumps(incoming).encode()})
        page.wait_for_timeout(200)
        assert saved(page)['id'] == before['id']
        assert page.locator('#board .gem').count() == gems
        assert 'restaurée' not in page.locator('#toast').inner_text()
        assert not errors, errors
    finally:
        close_context(context, engine)
    context, page, errors = new_page(browser)
    try:
        page.evaluate("""key => {
            localStorage.setItem('merge-gems.save.previous',localStorage.getItem(key));
            localStorage.setItem(key,'{broken');
        }""",SAVE_KEY)
        page.reload()
        page.locator('#recover').wait_for()
        deny_primary_writes(page)
        page.locator('#recover').click()
        assert page.evaluate('key=>localStorage.getItem(key)', SAVE_KEY) == '{broken'
        assert page.locator('#recover').is_visible()
        assert page.locator('#status').is_visible()
        assert not errors, errors
    finally:
        close_context(context, engine)
    context = browser.new_context(locale='fr-FR')
    context.add_init_script("Object.defineProperty(navigator,'locks',{value:undefined})")
    page = context.new_page()
    try:
        page.goto(BASE); writer_ready(page)
        before = saved(page)
        page.locator('#settings').click()
        page.evaluate("""() => {
            const text=Blob.prototype.text;
            Blob.prototype.text=async function() {
                const result=await text.call(this);
                await new Promise(resolve=>setTimeout(resolve,500)); return result;
            };
        }""")
        incoming=copy.deepcopy(before); incoming['id']='lost-session-import'
        page.locator('#import-file').set_input_files({'name':'valid.json','mimeType':'application/json','buffer':json.dumps(incoming).encode()})
        page.evaluate("localStorage.setItem('merge-gems.writer-lease.v2',JSON.stringify({owner:'another-tab',expiresAt:Date.now()+6000}))")
        page.wait_for_timeout(700)
        assert saved(page)['id'] == before['id']
        assert 'autre fenêtre' in page.locator('#toast').inner_text()
    finally:
        close_context(context, engine)


def offline(browser, engine):
    server = None
    temporary = None
    base = BASE
    if engine == "webkit":
        # Playwright WPE's context.set_offline() rejects a controlled navigation
        # before consulting its worker. Instead remove the actual HTTP origin.
        from functools import partial
        from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
        from threading import Thread
        import tempfile
        temporary = tempfile.TemporaryDirectory(prefix='merge-gems-offline-')
        directory = Path(temporary.name)
        (directory/'Merge-Gems').symlink_to(PROJECT/'dist', target_is_directory=True)
        class Quiet(SimpleHTTPRequestHandler):
            def log_message(self, *_):
                pass
        server = ThreadingHTTPServer(('127.0.0.1',0), partial(Quiet,directory=str(directory)))
        Thread(target=server.serve_forever,daemon=True).start()
        base = f'http://127.0.0.1:{server.server_port}/Merge-Gems/'
    context, page, errors = new_page(browser, state=fixture(), base=base)
    try:
        page.evaluate("navigator.serviceWorker.ready")
        page.wait_for_function("navigator.serviceWorker.controller !== null")
        manifest = page.evaluate("fetch('./manifest.webmanifest').then(r=>r.json())")
        assert manifest["scope"] == "./" and manifest["start_url"] == "./"
        for filename in ("icon-192.png", "icon-512.png", "apple-touch-icon.png"):
            status = page.evaluate("name => fetch('./assets/'+name).then(r=>r.status)", filename)
            assert status == 200, (filename, status)
        scope = page.evaluate("navigator.serviceWorker.getRegistration().then(r=>r.scope)")
        assert scope.endswith("/Merge-Gems/")
        identity = saved(page)["id"]
        if server:
            server.shutdown(); server.server_close(); server = None
        else:
            context.set_offline(True)
        page.reload(); writer_ready(page)
        assert saved(page)["id"] == identity
        page.locator("#settings").click()
        page.locator("#language").select_option("en")
        assert page.locator(".modal-heading h2").inner_text() == "Settings"
        assert not errors, errors
        page.screenshot(path=RESULTS / f"{engine}-offline.png")
    finally:
        close_context(context, engine)
        if server:
            server.shutdown(); server.server_close()
        if temporary:
            temporary.cleanup()


def touch_controls(browser, engine):
    context = browser.new_context(viewport={"width":390,"height":844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='fr-FR')
    page = context.new_page()
    try:
        page.goto(BASE); writer_ready(page)
        initial = page.locator('#board .crate').count()
        for _ in range(2):
            x,y=point(page.locator('#generate'));page.touchscreen.tap(x,y)
        page.wait_for_function('n=>document.querySelectorAll("#board .crate").length>n',arg=initial)
        x,y=point(page.locator('#board .crate').first);page.touchscreen.tap(x,y)
        assert page.locator('#board .gem').count()==3
        if engine=='chromium':
            # Actual browser touch input, rather than synthetic DOM pointer events.
            client=context.new_cdp_session(page)
            sx,sy=point(page.locator('[data-cell="0"]'))
            tx,ty=point(page.locator('[data-cell="1"]'))
            client.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':sx,'y':sy}]})
            for step in range(1,11):
                client.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':sx+(tx-sx)*step/10,'y':sy+(ty-sy)*step/10}]})
            client.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
            page.locator('#continue').wait_for()
            assert page.locator('#board .gem').count()==2
            assert page.evaluate('scrollY')==0
        else:
            # WebKit's portable Playwright API exposes taps, not a touch-drag path.
            x,y=point(page.locator('[data-cell="0"]'));page.touchscreen.tap(x,y)
            x,y=point(page.locator('[data-cell="1"]'));page.touchscreen.tap(x,y)
            page.locator('#continue').wait_for()
            assert page.locator('#board .gem').count()==2
        page.screenshot(path=RESULTS/f'{engine}-touch-discovery.png')
    finally:
        close_context(context, engine)


def generator_timer(browser, engine):
    for land, interval in (('gemland', 10_000), ('moonland', 20_000)):
        state = fixture()
        now = state['savedAt']
        state['activeWorld'] = land
        state['worlds']['gemland']['level'] = 8 if land == 'moonland' else 1
        world = state['worlds'][land]
        world['nextCrateAt'] = now + interval
        world['cells'][:6] = [{'kind':'gem','rank':0,'bornAt':now} for _ in range(6)]
        context = browser.new_context(viewport={'width':390 if land=='gemland' else 320,'height':844 if land=='gemland' else 568},locale='fr-FR')
        context.add_init_script(f'if (!localStorage.getItem({json.dumps(SAVE_KEY)})) localStorage.setItem({json.dumps(SAVE_KEY)}, {json.dumps(json.dumps(state))});')
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        # Fixed Date, real browser timers: no slow waits and no dependence on FPS.
        def set_time(timestamp_ms):
            # ISO strings avoid second/millisecond conversion and float rounding.
            instant = datetime.fromtimestamp(timestamp_ms//1000, timezone.utc)
            page.clock.set_fixed_time(instant.strftime("%Y-%m-%dT%H:%M:%S") + f".{timestamp_ms%1000:03d}Z")
        set_time(now)
        def expect_countdown(text):
            page.wait_for_function('text => document.querySelector("#countdown").textContent === text',arg=str(text))
        try:
            page.goto(BASE); writer_ready(page)
            expect_countdown(interval//1000)
            assert page.locator('#generate').get_attribute('data-ready') == 'false'
            set_time(now+1000)
            expect_countdown(interval//1000-1)
            set_time(now+interval//2)
            expect_countdown(interval//2000)
            assert float(page.locator('#generate').evaluate('el=>el.style.getPropertyValue("--crate-hidden").replace("%", "")')) == 50
            page.wait_for_function('Math.abs(parseFloat(getComputedStyle(document.querySelector(".generator-art")).clipPath.slice(6)) - 50) < .05')
            page.screenshot(path=RESULTS/f'{engine}-timer-{land}-half.png')
            set_time(now+interval)
            expect_countdown('PLEIN')
            assert page.locator('#generate').get_attribute('data-blocked') == 'true'
            page.screenshot(path=RESULTS/f'{engine}-timer-{land}-full.png')
            assert page.locator('#board .crate').count() == 0
            held_at = now+interval*6
            set_time(held_at)
            expect_countdown('PLEIN')
            # A ready crate arrives immediately after a merge; only one is held.
            drag(page,'[data-cell="0"]','[data-cell="1"]')
            page.locator('#continue').wait_for();page.locator('#continue').click()
            expect_countdown(interval//1000)
            assert page.locator('#board .crate').count() == 1
            drag(page,'[data-cell="2"]','[data-cell="3"]')
            assert page.locator('#board .crate').count() == 1
            assert page.locator('#board .empty').count() == 1
            page.locator('#generate').click()
            expect_countdown(interval//1000-5)
            set_time(held_at+interval-5001)
            expect_countdown(1)
            assert page.locator('#board .crate').count() == 1
            set_time(held_at+interval-5000)
            expect_countdown(interval//1000)
            assert page.locator('#board .crate').count() == 2
            page.reload();writer_ready(page)
            assert page.locator('#board .crate').count() == 2
            expect_countdown(interval//1000)
            assert_layout(page)
            assert not errors, errors
        finally:
            close_context(context,engine)


def cheats(browser, engine):
    # The legacy v2 fixture has no cheats field: loading it must opt out.
    context, page, errors = new_page(browser, state=fixture())
    try:
        assert page.locator('#cheat-menu').count() == 0
        page.locator('#settings').click()
        assert page.locator('#cheats-toggle').get_attribute('aria-checked') == 'false'
        page.locator('#cheats-toggle').click()
        assert saved(page)['settings']['cheatsEnabled'] is True
        close_modal(page)
        button = page.locator('#cheat-menu').bounding_box()
        logo = page.locator('.logo').bounding_box()
        assert button['x'] < 50 and button['y'] + button['height'] <= logo['y']
        page.reload(); writer_ready(page)
        assert page.locator('#cheat-menu').is_visible()
        before = int(saved(page)['worlds']['gemland']['coins'])
        page.locator('#cheat-menu').click()
        page.locator('[data-cheat-coins="1000000"]').click()
        assert int(saved(page)['worlds']['gemland']['coins']) >= before + 1_000_000
        page.locator('#cheat-rank').select_option('38')
        page.locator('#cheat-add-gem').click()
        world = saved(page)['worlds']['gemland']
        assert world['maxRank'] == 38
        assert any(tile and tile['kind'] == 'gem' and tile['rank'] == 38 for tile in world['cells'])
        page.locator('#cheat-level').click()
        assert saved(page)['worlds']['gemland']['level'] == 2
        assert page.locator('.tile').count() == 7
        page.locator('#cheat-unlock').click()
        assert saved(page)['worlds']['gemland']['level'] == 16
        close_modal(page)
        page.locator('#area').click()
        assert all(not page.locator(f'.world-list button[data-world="{world}"]').is_disabled() for world in ('gemland','moonland','aztecland'))
        page.locator('.world-list button[data-world="moonland"]').click()
        assert saved(page)['activeWorld'] == 'moonland'
        moon_before = int(saved(page)['worlds']['moonland']['coins'])
        page.locator('#cheat-menu').click()
        page.locator('[data-cheat-coins="1000000"]').click()
        assert int(saved(page)['worlds']['moonland']['coins']) >= moon_before + 1_000_000
        close_modal(page)
        page.locator('#area').click()
        page.locator('.world-list button[data-world="gemland"]').click()
        page.locator('#settings').click()
        with page.expect_download() as downloaded:
            page.locator('#export-save').click()
        exported = downloaded.value
        destination = RESULTS / f'{engine}-cheat-export.json'
        exported.save_as(destination)
        assert json.loads(destination.read_text())['game']['settings']['cheatsEnabled'] is True
        page.locator('#language').select_option('en')
        assert page.locator('#cheats-toggle').inner_text() == 'Cheat menu'
        close_modal(page)
        assert page.locator('#cheat-menu').inner_text() == 'Cheats'
        page.locator('#cheat-menu').click()
        assert page.locator('#cheat-add-gem').inner_text() == 'Add gem'
        page.screenshot(path=RESULTS / f'{engine}-cheats.png')
        close_modal(page)
        page.locator('#settings').click()
        page.locator('#cheats-toggle').click()
        close_modal(page)
        assert page.locator('#cheat-menu').count() == 0
        page.reload(); writer_ready(page)
        assert saved(page)['settings']['cheatsEnabled'] is False
        assert saved(page)['worlds']['gemland']['maxRank'] == 38
        page.locator('#settings').click()
        page.once('dialog', lambda dialog: dialog.accept())
        page.locator('#import-file').set_input_files(destination)
        page.wait_for_function('document.querySelector("#cheat-menu") !== null')
        assert saved(page)['settings']['cheatsEnabled'] is True
        for size in ((320,568),(375,667),(390,844),(430,932)):
            page.set_viewport_size({'width':size[0],'height':size[1]})
            assert_layout(page)
            launcher = page.locator('#cheat-menu').bounding_box()
            heading = page.locator('.logo').bounding_box()
            assert launcher['y'] + launcher['height'] <= heading['y']
        assert not errors, errors
    finally:
        close_context(context, engine)


def viewports(browser, engine):
    for size in ((320, 568), (375, 667), (390, 844), (430, 932)):
        for language in ("fr", "en"):
            context, page, errors = new_page(browser, state=fixture(reference=True, language=language), size=size)
            try:
                assert_layout(page)
                page.screenshot(path=RESULTS / f"{engine}-{size[0]}x{size[1]}-{language}.png")
                page.locator("#settings").click()
                assert page.locator("#language").is_visible()
                assert page.locator("#export-save").is_visible()
                page.screenshot(path=RESULTS / f"{engine}-{size[0]}x{size[1]}-{language}-settings.png")
                assert not errors, errors
            finally:
                close_context(context, engine)


def reference_comparisons(browser, engine):
    # Designer screenshot1 is 720x1280: compare at the same 9:16 aspect ratio.
    state = fixture(reference=True, language="en")
    state["worlds"]["gemland"]["nextCrateAt"] = int(time.time()*1000)+7000
    context, page, errors = new_page(browser, state=state, size=(360, 640))
    try:
        page.screenshot(path=RESULTS / f"{engine}-reference-gemland-level6.png")
        assert not errors, errors
    finally:
        close_context(context, engine)
    state = fixture(language="en")
    state["worlds"]["gemland"]["level"] = 8
    state["activeWorld"] = "moonland"
    world = state["worlds"]["moonland"]
    world.update(level=2, xp=19, maxRank=5, nextCrateAt=int(time.time()*1000)+7000)
    ranks = ["crate", 0, 1, 0, 1, 0, 5]
    now = world["lastAccruedAt"]
    world["cells"] = [
        {"kind":"crate", "rank":0} if rank == "crate" else {"kind":"gem", "rank":rank, "bornAt":now}
        for rank in ranks
    ] + [None]*17
    context, page, errors = new_page(browser, state=state, size=(360, 640))
    try:
        page.screenshot(path=RESULTS / f"{engine}-reference-moonland-level2.png")
        assert not errors, errors
    finally:
        close_context(context, engine)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--browser", choices=("all", "chromium", "webkit"), default="all")
    args = parser.parse_args()
    if not (PROJECT / "dist/index.html").exists():
        parser.error("Run npm run build before browser checks")
    RESULTS.mkdir(exist_ok=True)
    report = {"url": BASE, "realIPhone": False, "offlineStrategy": {"chromium":"Playwright context offline", "webkit":"HTTP origin stopped; WPE offline mode rejects navigation internally"}, "browserVersions": {}, "checks": [], "launchFailures": {}}
    log = (RESULTS / "preview.log").open("w")
    server = subprocess.Popen(["npm", "run", "preview", "--", "--port", str(PORT), "--strictPort"], cwd=PROJECT,
                              stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
    try:
        deadline = time.monotonic() + 20
        while True:
            try:
                urllib.request.urlopen(BASE, timeout=1).close()
                break
            except Exception:
                if server.poll() is not None or time.monotonic() > deadline:
                    raise RuntimeError("Preview server unavailable; inspect test-results/preview.log")
                time.sleep(.1)
        with sync_playwright() as p:
            for engine in (("chromium", "webkit") if args.browser == "all" else (args.browser,)):
                try:
                    options = {"headless": True}
                    if engine == "chromium":
                        chromium_path = os.environ.get("MERGE_GEMS_CHROMIUM_PATH") or shutil.which("chromium")
                        if chromium_path:
                            options.update(executable_path=chromium_path, args=["--no-sandbox"])
                    if engine == "webkit":
                        webkit_path = os.environ.get("MERGE_GEMS_WEBKIT_PATH")
                        if not webkit_path and Path("/tmp/merge-gems-browsers/webkit-2336/pw_run.sh").exists():
                            webkit_path = "/tmp/merge-gems-browsers/webkit-2336/pw_run.sh"
                        if webkit_path:
                            options["executable_path"] = webkit_path
                    browser = getattr(p, engine).launch(**options)
                    report["browserVersions"][engine] = browser.version
                except Exception as error:
                    report["launchFailures"][engine] = str(error)
                    print(f"UNAVAILABLE {engine}: {error}", flush=True)
                    continue
                try:
                    for check in (journey, purchases_and_files, gestures_and_tabs, storage_failures, offline, touch_controls, generator_timer, cheats, viewports, reference_comparisons):
                        started = time.monotonic()
                        try:
                            check(browser, engine)
                            result = {"browser": engine, "check": check.__name__, "status": "passed"}
                            print(f"PASS {engine}: {check.__name__}", flush=True)
                        except Exception as error:
                            result = {"browser": engine, "check": check.__name__, "status": "failed", "error": str(error), "traceback": traceback.format_exc()}
                            print(f"FAIL {engine}: {check.__name__}: {error}", flush=True)
                        result["seconds"] = round(time.monotonic() - started, 2)
                        report["checks"].append(result)
                finally:
                    browser.close()
    finally:
        import signal
        try:
            os.killpg(server.pid, signal.SIGTERM)
            server.wait(timeout=5)
        except (ProcessLookupError, subprocess.TimeoutExpired):
            pass
        log.close()
        (RESULTS / "browser-report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False))
    failed = any(result["status"] == "failed" for result in report["checks"])
    unavailable = bool(report["launchFailures"])
    print("Report: test-results/browser-report.json. Browser emulation, not a real iPhone.")
    return 1 if failed or unavailable or not report["checks"] else 0


if __name__ == "__main__":
    sys.exit(main())
