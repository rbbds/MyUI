// Generates one use_figma script per component page in docs/figma-payload/<id>.js.
// Optional: node build-figma-payload.mjs date-picker combobox → only those docs.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { transformSync } from 'esbuild';
import { docs } from '../../docs/content/index.mjs';
import { FIGMA_PAGES } from '../../docs/figma-pages.mjs';
const tpl = readFileSync(new URL('./figma-builder.js', import.meta.url), 'utf8').split('\n').filter(l => !l.trim().startsWith('//')).join('\n');
mkdirSync('docs/figma-payload', { recursive: true });
const only = process.argv.slice(2);
// Docs are grouped into scripts of at most ~45k characters (use_figma limit is 50k).
const pick = docs.filter((d) => !only.length || only.includes(d.id)).map((d) => {
  const pageId = FIGMA_PAGES[d.name];
  if (!pageId) { console.warn('No Figma page for', d.name); return null; }
  const { id: _i, stories: _s, ...slim } = d;
  return { ...slim, _page: pageId, _id: d.id };
}).filter(Boolean);
const build = (list) => {
  const src = tpl.replace('__DOCS__', JSON.stringify(list.map(({ _id, ...x }) => x)));
  const min = transformSync(`async function __m(){${src}}`, { minify: true, loader: 'js', charset: 'utf8' }).code.trim();
  return min.slice(min.indexOf('{') + 1, min.lastIndexOf('}'));
};
let chunk = [], n = 1;
const flush = () => { if (!chunk.length) return; const out = build(chunk); writeFileSync(`docs/figma-payload/part-${n}.js`, out); console.log(`part-${n}.js`, out.length, chunk.map((c) => c._id).join(',')); n++; chunk = []; };
for (const d of pick) { if (chunk.length && build([...chunk, d]).length > 45000) flush(); chunk.push(d); }
flush();
