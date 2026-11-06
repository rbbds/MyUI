// Generates one use_figma script per Figma page in docs/figma-payload/.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { transformSync } from 'esbuild';
import { docs } from '../../docs/content/index.mjs';
const PAGES = { 'Buttons': '16944:5', 'Form inputs': '16944:6', 'Selection controls': '16944:7', 'Badges & tags': '16944:8', 'Avatars': '16944:9', 'Feedback': '16944:10', 'Overlays': '16944:11', 'Navigation': '16944:12', 'Data display': '16944:13', 'Content': '16944:14', 'Utilities': '16944:15' };
const tpl = readFileSync(new URL('./figma-builder.js', import.meta.url), 'utf8').split('\n').filter(l => !l.trim().startsWith('//')).join('\n');
mkdirSync('docs/figma-payload', { recursive: true });
for (const [name, id] of Object.entries(PAGES)) {
  const list = docs.filter(d => d.page === name);
  if (!list.length) continue;
  const slim = list.map(({ id: _i, stories: _s, ...d }) => d);
  const src = tpl.replace('__PAGE_ID__', id).replace('__DOCS__', JSON.stringify(slim));
  // wrap so esbuild accepts top-level await/return, then unwrap
  const min = transformSync(`async function __m(){${src}}`, { minify: true, loader: 'js', charset: 'utf8' }).code.trim();
  const out = min.slice(min.indexOf('{') + 1, min.lastIndexOf('}'));
  const file = `docs/figma-payload/${name.replace(/[^a-z]+/gi, '-').toLowerCase()}.js`;
  writeFileSync(file, out);
  console.log(file, list.length, out.length);
}
