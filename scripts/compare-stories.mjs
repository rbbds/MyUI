// Pixelvergelijking van twee Storybook-builds: node scripts/compare-stories.mjs <oud> <nieuw>. Verschillen in /tmp/shots.
import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const serve = (dir, port) => http.createServer((q, r) => { let p = path.join(dir, decodeURIComponent(q.url.split('?')[0])); if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html'); if (!fs.existsSync(p)) { r.writeHead(404); return r.end(); } const ext = path.extname(p); r.writeHead(200, { 'content-type': { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' }[ext] || 'application/octet-stream' }); fs.createReadStream(p).pipe(r); }).listen(port);
const s1 = serve(process.argv[2] || '/tmp/sb-old', 7101), s2 = serve(process.argv[3] || '/tmp/sb-new', 7102);
const idx = JSON.parse(fs.readFileSync(path.join(process.argv[3] || '/tmp/sb-new', 'index.json'), 'utf8'));
const ids = Object.values(idx.entries).filter(e => e.type === 'story').map(e => e.id);
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1000, height: 800 } });
const out = []; fs.mkdirSync('/tmp/shots', { recursive: true });
for (const id of ids) { const bufs = [];
  for (const port of [7101, 7102]) { try { await pg.goto(`http://localhost:${port}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle', timeout: 15000 }); await pg.addStyleTag({ content: '*{animation:none!important;transition:none!important}' }); await pg.waitForTimeout(150); bufs.push(await pg.screenshot({ fullPage: true })); } catch (e) { bufs.push(null); } }
  if (!bufs[0] || !bufs[1]) { out.push(id + ' ERR'); continue; }
  if (!bufs[0].equals(bufs[1])) { out.push(id); fs.writeFileSync(`/tmp/shots/${id}-old.png`, bufs[0]); fs.writeFileSync(`/tmp/shots/${id}-new.png`, bufs[1]); } }
console.log(ids.length + ' stories, different: ' + out.length + '\n' + out.join('\n'));
await b.close(); s1.close(); s2.close();
