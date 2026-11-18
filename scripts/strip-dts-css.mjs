// Removes CSS side-effect imports (`import './Button.css';`) from the generated type declarations in dist/types.
// tsc copies them from the source, but the CSS files are not next to the types. In TypeScript 6+ without a
// `declare module '*.css'` and with skipLibCheck off, that gives error TS2882 in the consumer's project.
// The CSS itself ships in dist/styles.css; the types do not need it.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../dist/types/', import.meta.url).pathname;
const CSS_IMPORT = /^import\s+['"][^'"]+\.css['"];?\s*\n/gm;
let files = 0, removed = 0;
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!p.endsWith('.d.ts')) continue;
    const src = readFileSync(p, 'utf8');
    const out = src.replace(CSS_IMPORT, () => { removed++; return ''; });
    if (out !== src) { writeFileSync(p, out); files++; }
  }
};
walk(root);
console.log(`strip-dts-css: ${removed} CSS imports removed from ${files} declaration files`);
