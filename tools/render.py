import asyncio, sys, threading, http.server, functools, socketserver
from pathlib import Path
from playwright.async_api import async_playwright
ROOT = Path(__file__).resolve().parent.parent
async def main(what):
    async with async_playwright() as p:
        b = await p.chromium.launch()
        if what in ('og','all'):
            pg = await b.new_page(viewport={'width':1200,'height':630})
            await pg.goto((ROOT/'tools/og.html').as_uri()); await pg.evaluate('document.fonts.ready')
            # fit the name to the measure
            await pg.evaluate("""()=>{const n=document.getElementById('n');const w=1200-112;let fs=196;n.style.fontSize=fs+'px';const r=()=>Math.max(...[...n.childNodes].map(()=>n.scrollWidth));const range=document.createRange();range.selectNodeContents(n);const cw=range.getBoundingClientRect().width;n.style.fontSize=(fs*w/cw*0.99)+'px'}""")
            await pg.wait_for_timeout(200)
            await pg.screenshot(path=str(ROOT/'public/og.png'))
            print('og ok')
        if what in ('pdf','all'):
            Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT/'dist'))
            class Q(socketserver.TCPServer): allow_reuse_address = True
            srv = Q(('127.0.0.1', 4399), Handler); th = threading.Thread(target=srv.serve_forever, daemon=True); th.start()
            pg = await b.new_page(viewport={'width':1100,'height':1400})
            await pg.emulate_media(media='print', reduced_motion='reduce')
            await pg.goto('http://127.0.0.1:4399/resume/'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(400)
            await pg.pdf(path=str(ROOT/'public/ujjwal-sharma-resume.pdf'), format='A4', print_background=True, margin={'top':'14mm','bottom':'14mm','left':'14mm','right':'14mm'})
            srv.shutdown(); print('pdf ok')
        await b.close()
asyncio.run(main(sys.argv[1] if len(sys.argv)>1 else 'all'))
