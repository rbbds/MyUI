// Pixelvergelijking van twee Storybook-builds: node scripts/compare-stories.mjs <oud> <nieuw> [filter]
// Vergelijkt elke story in Iris, Forest en Berry, in Light en Dark. Verschillen in /tmp/shots.
// filter (optioneel): alleen story-id's die deze tekst bevatten, bijvoorbeeld "button".
import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const [oldDir = '/tmp/sb-old', newDir = '/tmp/sb-new', filter = ''] = process.argv.slice(2);
const serve = (dir, port) => http.createServer((q, r) => { let p = path.join(dir, decodeURIComponent(q.url.split('?')[0])); if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html'); if (!fs.existsSync(p)) { r.writeHead(404); return r.end(); } const ext = path.extname(p); r.writeHead(200, { 'content-type': { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' }[ext] || 'application/octet-stream' }); fs.createReadStream(p).pipe(r); }).listen(port);
const s1 = serve(oldDir, 7101), s2 = serve(newDir, 7102);
const ids = (dir) => Object.values(JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8')).entries).filter((e) => e.type === 'story').map((e) => e.id);
const oldIds = new Set(ids(oldDir));
const all = ids(newDir).filter((id) => id.includes(filter));
const shared = all.filter((id) => oldIds.has(id)), added = all.filter((id) => !oldIds.has(id));
const COMBOS = ['iris', 'forest', 'berry'].flatMap((brand) => ['light', 'dark'].map((theme) => ({ brand, theme })));
const jobs = COMBOS.flatMap((c) => shared.map((id) => ({ id, ...c })));
const b = await chromium.launch(); fs.mkdirSync('/tmp/shots', { recursive: true });
const out = []; let next = 0;
const shot = async (pg, port, j) => { try { await pg.goto(`http://localhost:${port}/iframe.html?id=${j.id}&viewMode=story&globals=theme:${j.theme};brand:${j.brand}`, { waitUntil: 'networkidle', timeout: 15000 }); await pg.addStyleTag({ content: '*{animation:none!important;transition:none!important}' }); await pg.waitForTimeout(150); return await pg.screenshot({ fullPage: true }); } catch { return null; } };
const worker = async () => { const pg = await b.newPage({ viewport: { width: 1000, height: 800 } });
  while (next < jobs.length) { const j = jobs[next++]; const key = `${j.id}--${j.brand}-${j.theme}`;
    let a = await shot(pg, 7101, j), c = await shot(pg, 7102, j);
    // Een story met een plaatje of font dat net te laat laadt, verschilt soms één keer. Daarom bij een verschil nog één keer.
    if (a && c && !a.equals(c)) { a = await shot(pg, 7101, j); c = await shot(pg, 7102, j); }
    if (!a || !c) { out.push(key + ' ERR'); continue; }
    if (!a.equals(c)) { out.push(key); fs.writeFileSync(`/tmp/shots/${key}-old.png`, a); fs.writeFileSync(`/tmp/shots/${key}-new.png`, c); } }
  await pg.close(); };
await Promise.all(Array.from({ length: 4 }, worker));
console.log(`${shared.length} stories x ${COMBOS.length} (Iris, Forest, Berry x Light, Dark) = ${jobs.length} vergelijkingen, verschillend: ${out.length}\n${out.sort().join('\n')}`);
if (added.length) console.log(`\nNieuw in de branch, niet vergeleken (${added.length}):\n${added.join('\n')}`);
await b.close(); s1.close(); s2.close();
