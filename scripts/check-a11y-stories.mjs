// axe on every story of a Storybook build, in Light and Dark and in Iris, Forest and Berry.
// Usage: npm run build-storybook && npm run check:a11y [-- --dir storybook-static --workers 6]
// Fails on any violation, on a story that does not render, and when theme or brand is not applied.
// Page rules are off because a story is not a page: landmark-one-main, page-has-heading-one, region.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, appendFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';
import { chromium } from '@playwright/test';

const require = createRequire(import.meta.url);
const arg = (name, def) => { const i = process.argv.indexOf(`--${name}`); return i > -1 ? process.argv[i + 1] : def; };
const dir = arg('dir', 'storybook-static');
const workers = Number(arg('workers', 6));
const THEMES = ['light', 'dark'];
const BRANDS = ['iris', 'forest', 'berry'];
// Stories that set the brand themselves (Brand builder): skip the brand check, still run axe.
const OWN_BRAND = /^brand-builder/;
const RULES = { 'landmark-one-main': { enabled: false }, 'page-has-heading-one': { enabled: false }, region: { enabled: false } };

if (!existsSync(join(dir, 'index.json'))) { console.error(`No Storybook build in ${dir}. Run npm run build-storybook first.`); process.exit(1); }
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const stories = Object.values(JSON.parse(readFileSync(join(dir, 'index.json'), 'utf8')).entries).filter((e) => e.type === 'story').map((e) => e.id);

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff' };
const server = createServer((req, res) => {
  let p = join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' });
  res.end(readFileSync(p));
}).listen(0);
const base = `http://localhost:${server.address().port}`;

const jobs = [];
for (const theme of THEMES) for (const brand of BRANDS) for (const id of stories) jobs.push({ id, theme, brand });
const total = jobs.length;
const failures = [];
const browser = await chromium.launch();
async function worker() {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  while (jobs.length) {
    const j = jobs.shift();
    try {
      await page.goto(`${base}/iframe.html?id=${j.id}&viewMode=story&globals=theme:${j.theme};brand:${j.brand}`, { waitUntil: 'load' });
      await page.waitForSelector('#storybook-root > *', { timeout: 15000 });
      await page.waitForTimeout(800);
      const [theme, brand] = await page.evaluate(() => [document.documentElement.getAttribute('data-theme'), document.documentElement.getAttribute('data-brand')]);
      if (theme !== j.theme) failures.push({ ...j, problem: `data-theme is ${theme}` });
      if (!OWN_BRAND.test(j.id) && (j.brand === 'iris' ? brand !== null : brand !== j.brand)) failures.push({ ...j, problem: `data-brand is ${brand}` });
      if (!(await page.evaluate(() => typeof window.axe?.run === 'function'))) await page.addScriptTag({ content: axeSource });
      const violations = await page.evaluate(async (rules) => (await window.axe.run('#storybook-root', { rules })).violations.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes[0]?.target.join(' ')}`), RULES);
      for (const v of violations) failures.push({ ...j, problem: v });
    } catch (e) {
      failures.push({ ...j, problem: `did not render: ${String(e.message).split('\n')[0]}` });
    }
  }
}
await Promise.all(Array.from({ length: workers }, worker));
await browser.close();
server.close();

const line = `axe: ${total} runs (${stories.length} stories × ${THEMES.length} themes × ${BRANDS.length} brands), ${failures.length} problems`;
console.log(line);
for (const f of failures) console.log(`  ${f.id} [${f.theme}/${f.brand}] ${f.problem}`);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### ${line}\n${failures.map((f) => `- \`${f.id}\` ${f.theme}/${f.brand}: ${f.problem}`).join('\n')}\n`);
process.exit(failures.length ? 1 : 0);
