/**
 * Regenerates src/styles/tokens.css from the Figma variables in "WL Design System (rbbds)".
 *
 * How to run: in Figma, open the file and run this script as a plugin snippet
 * (for example with the Figma MCP use_figma tool, or the "Scripter" plugin).
 * It returns the CSS in parts of 45 kB. Set PART to 0, 1, 2 … and paste the parts
 * in order over src/styles/tokens.css.
 *
 * Layers (see docs/TOKEN-ARCHITECTURE.md):
 * - ∙ primitives (color, spacing, border, typography)  -> :root
 * - ↳ brand, first mode                                  -> :root
 *   other brand modes                                    -> :root[data-brand="<mode>"] (only values that differ)
 * - ↳ style                                              -> :root
 * - ↳ theme Light                                        -> :root,[data-theme="light"]
 *   ↳ theme Dark                                         -> [data-theme="dark"] (only values that differ)
 * - ↳ screen-size, first mode                            -> :root, other modes as max-width media queries
 * - ↳ size, mode md                                      -> :root, other modes -> [data-size="<mode>"]
 * - ↳ mapped                                             -> :root,[data-theme],[data-brand],[data-size]
 *   (so mapped values re-resolve inside a themed, branded or sized subtree)
 *
 * Names:
 * - component-tokens/x/y  -> --x-y
 * - typography-tokens/x/y -> --text-x-y
 * - base-tokens/x/y       -> --base-x-y
 * - effect-tokens/x/y     -> --effect-x-y
 * - layout-tokens/x/y     -> --layout-x-y
 * - everything else       -> --name-with-dashes (slashes, commas and spaces become "-")
 *
 * Skipped: ∙ shadows, ∙ opacity, ∙ sizing (resolved to values),
 * breakpoint/* strings, also layout-tokens/breakpoint/* (Figma only), shadow geometry (blur, position, spread) and booleans.
 */
const PART = 0, SIZE = 45000;
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const all = await figma.variables.getLocalVariablesAsync();
const byId = Object.fromEntries(all.map(v => [v.id, v]));
const colName = Object.fromEntries(cols.map(c => [c.id, c.name]));
const C = Object.fromEntries(cols.map(c => [c.name, c]));
const SKIP = new Set(['∙ shadows', '∙ opacity', '∙ sizing']);
const cssName = n => {
  let s = n;
  if (s.startsWith('component-tokens/')) s = s.slice(17);
  else if (s.startsWith('typography-tokens/')) s = 'text/' + s.slice(18);
  else if (s.startsWith('base-tokens/')) s = 'base/' + s.slice(12);
  else if (s.startsWith('effect-tokens/')) s = 'effect/' + s.slice(14);
  else if (s.startsWith('layout-tokens/')) s = 'layout/' + s.slice(14);
  return s.toLowerCase().replace(/[\/, ]+/g, '-');
};
const keep = v => !SKIP.has(colName[v.variableCollectionId]) && !/(^|\/)breakpoint\//.test(v.name) && !/^effects\/shadows\/(blur-amount|position|spread)/.test(v.name) && v.resolvedType !== 'BOOLEAN';
const hex = c => { const h = x => Math.round(x * 255).toString(16).padStart(2, '0'); return (c.a === undefined || c.a >= 1) ? '#' + h(c.r) + h(c.g) + h(c.b) : `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${Math.round(c.a * 100) / 100})`; };
const unitless = v => /font-weight/.test(v.name) || v.name === 'layout-columns' || v.scopes.includes('FONT_WEIGHT');
const fmt = (v, val) => {
  if (val && val.type === 'VARIABLE_ALIAS') { const t = byId[val.id]; if (!keep(t)) return fmt(t, Object.values(t.valuesByMode)[0]); return `var(--${cssName(t.name)})`; }
  if (v.resolvedType === 'COLOR') return hex(val);
  if (v.resolvedType === 'STRING') return /font\//.test(v.name) ? (/serif/i.test(val) && !/sans/i.test(val) ? `"${val}", ui-serif, Georgia, serif` : `"${val}", ui-sans-serif, system-ui, sans-serif`) : `"${val}"`;
  return unitless(v) ? String(val) : val + 'px';
};
const vars = all.filter(keep);
const inCol = n => vars.filter(v => colName[v.variableCollectionId] === n).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
const line = (v, m) => `--${cssName(v.name)}:${fmt(v, v.valuesByMode[m])};`;
const diff = (v, a, b) => JSON.stringify(v.valuesByMode[a]) !== JSON.stringify(v.valuesByMode[b]);
const slug = s => s.toLowerCase().replace(/\s+/g, '-');
const out = ['/* @rbbds/ui tokens. Generated from Figma by scripts/figma-export-tokens.js. Do not edit by hand. */'];

// 1. Primitives, first brand, style, first screen size, size md
out.push(':root{');
for (const n of ['∙ color', '∙ spacing', '∙ border', '∙ typography']) for (const v of inCol(n)) out.push(line(v, C[n].modes[0].modeId));
const brand = C['↳ brand']; const B0 = brand.modes[0].modeId;
for (const v of inCol(brand.name)) out.push(line(v, B0));
for (const v of inCol('↳ style')) out.push(line(v, C['↳ style'].modes[0].modeId));
const ss = C['↳ screen-size']; for (const v of inCol(ss.name)) out.push(line(v, ss.modes[0].modeId));
const size = C['↳ size']; const md = size.modes.find(m => m.name === 'md').modeId;
for (const v of inCol(size.name)) out.push(line(v, md));
out.push('}');

// 2. Other brands
for (const m of brand.modes.slice(1)) { const ls = inCol(brand.name).filter(v => diff(v, m.modeId, B0)).map(v => line(v, m.modeId)); if (ls.length) out.push(`:root[data-brand="${slug(m.name)}"]{\n${ls.join('\n')}\n}`); }

// 3. Theme
const th = C['↳ theme']; const L = th.modes.find(m => m.name === 'Light').modeId, D = th.modes.find(m => m.name === 'Dark').modeId;
out.push(':root,[data-theme="light"]{color-scheme:light;'); for (const v of inCol(th.name)) out.push(line(v, L)); out.push('}');
out.push('[data-theme="dark"]{color-scheme:dark;'); for (const v of inCol(th.name)) if (diff(v, L, D)) out.push(line(v, D)); out.push('}');

// 4. Size modes
for (const m of size.modes) { if (m.modeId === md) continue; const ls = inCol(size.name).filter(v => diff(v, m.modeId, md)).map(v => line(v, m.modeId)); if (ls.length) out.push(`[data-size="${slug(m.name)}"]{\n${ls.join('\n')}\n}`); }

// 5. Mapped
const mp = C['↳ mapped'];
out.push(':root,[data-theme],[data-brand],[data-size]{'); for (const v of inCol(mp.name)) out.push(line(v, mp.modes[0].modeId)); out.push('}');

// 6. Screen sizes
const bps = [1535, 1199, 899, 599];
for (let i = 1; i < ss.modes.length; i++) { const ls = inCol(ss.name).filter(v => diff(v, ss.modes[i - 1].modeId, ss.modes[i].modeId)).map(v => line(v, ss.modes[i].modeId)); if (ls.length) out.push(`@media (max-width:${bps[i - 1]}px){:root{\n${ls.join('\n')}\n}}`); }


const css = out.join('\n');
// Two Figma variables that give the same CSS name in one block: the last one silently wins in the browser. Stop instead.
const collisions = [];
for (const block of css.split('}')) { const seen = new Set(); for (const m of block.matchAll(/(?:^|\n)(--[\w-]+):/g)) { if (seen.has(m[1])) collisions.push(m[1]); seen.add(m[1]); } }
if (collisions.length) throw new Error('Token name collision, rename in Figma: ' + [...new Set(collisions)].join(', '));
return { total: css.length, parts: Math.ceil(css.length / SIZE), chunk: css.slice(PART * SIZE, (PART + 1) * SIZE) };
