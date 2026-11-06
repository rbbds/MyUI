// Generates one use_figma script per component page in docs/figma-payload/<id>.js.
// Optional: node build-figma-payload.mjs date-picker combobox → only those docs.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { transformSync } from 'esbuild';
import { docs } from '../../docs/content/index.mjs';
import { FIGMA_PAGES } from '../../docs/figma-pages.mjs';
const tpl = readFileSync(new URL('./figma-builder.js', import.meta.url), 'utf8').split('\n').filter(l => !l.trim().startsWith('//')).join('\n');
mkdirSync('docs/figma-payload', { recursive: true });
const only = process.argv.slice(2);
for (const d of docs) {
  if (only.length && !only.includes(d.id)) continue;
  const pageId = FIGMA_PAGES[d.name];
  if (!pageId) { console.warn('No Figma page for', d.name); continue; }
  const { id: _i, stories: _s, ...slim } = d;
  const src = tpl.replace('__PAGE_ID__', pageId).replace('__DOCS__', JSON.stringify([slim]));
  // wrap so esbuild accepts top-level await/return, then unwrap
  const min = transformSync(`async function __m(){${src}}`, { minify: true, loader: 'js', charset: 'utf8' }).code.trim();
  const out = min.slice(min.indexOf('{') + 1, min.lastIndexOf('}'));
  writeFileSync(`docs/figma-payload/${d.id}.js`, out);
  console.log(`docs/figma-payload/${d.id}.js`, out.length);
}
