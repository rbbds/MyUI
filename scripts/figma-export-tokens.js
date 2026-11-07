/**
 * Regenerates src/styles/tokens.css from the Figma variables in "WL Design System (rbbds)".
 *
 * How to run: in Figma, open the file and run this script as a plugin snippet
 * (e.g. via the Figma MCP use_figma tool, or the "Scripter" plugin). It returns the CSS
 * (in parts of 45 kB if large). Paste the result over src/styles/tokens.css.
 *
 * Rules (keep in sync with the CSS naming in Figma's WEB code syntax):
 * - component-tokens/x/y  -> --x-y
 * - typography-tokens/x/y -> --text-x-y
 * - everything else       -> --name-with-dashes (slashes, commas and spaces become "-")
 * - Theme tokens equal in Light and Dark on :root (brand-overridable); Light-only values on :root,[data-theme="light"]; Dark diffs on [data-theme="dark"]
 * - Mapped tokens on :root,[data-theme] so they re-resolve inside themed subtrees
 * - Extra brand/wl modes become :root[data-brand="<mode>"] blocks (only differing values)
 * - Screen-size modes become max-width media queries (1535 / 1199 / 899 / 599)
 */
const PART = 0, SIZE = 45000;
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const all = await figma.variables.getLocalVariablesAsync();
const byId = Object.fromEntries(all.map(v => [v.id, v]));
const colName = Object.fromEntries(cols.map(c => [c.id, c.name]));
const SKIP = new Set(['∙ shadows', '∙ opacity', '∙ sizing']);
const cssName = n => { let s = n; if (s.startsWith('component-tokens/')) s = s.slice(17); else if (s.startsWith('typography-tokens/')) s = 'text/' + s.slice(18); return s.toLowerCase().replace(/[\/, ]+/g, '-'); };
const keep = v => !SKIP.has(colName[v.variableCollectionId]) && !/^effects\/shadows\/(blur-amount|position|spread)/.test(v.name) && v.resolvedType !== 'BOOLEAN';
const hex = c => { const h = x => Math.round(x * 255).toString(16).padStart(2, '0'); return (c.a === undefined || c.a >= 1) ? '#' + h(c.r) + h(c.g) + h(c.b) : `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${Math.round(c.a * 100) / 100})`; };
const unitless = v => /^font-weight\//.test(v.name) || v.name === 'layout-columns' || v.scopes.includes('FONT_WEIGHT') || /font-weight$/.test(v.name);
const fmt = (v, val) => { if (val && val.type === 'VARIABLE_ALIAS') { const t = byId[val.id]; if (!keep(t)) return fmt(t, Object.values(t.valuesByMode)[0]); return `var(--${cssName(t.name)})`; } if (v.resolvedType === 'COLOR') return hex(val); if (v.resolvedType === 'STRING') return /fonts\//.test(v.name) ? (/serif/i.test(val) && !/sans/i.test(val) ? `"${val}", ui-serif, Georgia, serif` : `"${val}", ui-sans-serif, system-ui, sans-serif`) : `"${val}"`; return unitless(v) ? String(val) : val + 'px'; };
const vars = all.filter(keep);
const inCol = n => vars.filter(v => colName[v.variableCollectionId] === n).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
const C = Object.fromEntries(cols.map(c => [c.name, c]));
const line = (v, m) => `--${cssName(v.name)}:${fmt(v, v.valuesByMode[m])};`;
const out = ['/* @rbbds/ui tokens. Generated from Figma. Do not edit by hand. */', ':root{'];
for (const n of ['↳ brand/wl', '∙ spacing', '∙ border', '∙ typography', '↳ screen-size-(alias)']) for (const v of inCol(n)) out.push(line(v, C[n].modes[0].modeId));
out.push('}');
// Extra brand modes (demo or client brands) → :root[data-brand="slug"], only values that differ from the first mode.
{ const b = C['↳ brand/wl']; for (const m of b.modes.slice(1)) { const ls = []; for (const v of inCol(b.name)) if (JSON.stringify(v.valuesByMode[m.modeId]) !== JSON.stringify(v.valuesByMode[b.modes[0].modeId])) ls.push(line(v, m.modeId)); if (ls.length) out.push(`:root[data-brand="${m.name.toLowerCase().replace(/\s+/g, '-')}"]{\n${ls.join('\n')}\n}`); } }
const th = C['↳ theme-(alias)']; const [L, D] = th.modes;
const same = (v) => JSON.stringify(v.valuesByMode[L.modeId]) === JSON.stringify(v.valuesByMode[D.modeId]);
// Theme tokens that are equal in Light and Dark (radius, border width, font weight, spacing…) live on plain :root,
// so a brand can override them on :root without [data-theme] subtrees resetting them.
out.push(':root{'); for (const v of inCol(th.name)) if (same(v)) out.push(line(v, L.modeId)); out.push('}');
out.push(':root,[data-theme="light"]{color-scheme:light;'); for (const v of inCol(th.name)) if (!same(v)) out.push(line(v, L.modeId)); out.push('}');
out.push('[data-theme="dark"]{color-scheme:dark;'); for (const v of inCol(th.name)) if (JSON.stringify(v.valuesByMode[L.modeId]) !== JSON.stringify(v.valuesByMode[D.modeId])) out.push(line(v, D.modeId)); out.push('}');
out.push(':root,[data-theme]{'); for (const v of inCol('↳ mapped')) out.push(line(v, C['↳ mapped'].modes[0].modeId)); out.push('}');
const ss = C['↳ screen-size-(alias)']; const bps = [1535, 1199, 899, 599];
for (let i = 1; i < ss.modes.length; i++) { const ls = []; for (const v of inCol(ss.name)) if (JSON.stringify(v.valuesByMode[ss.modes[i - 1].modeId]) !== JSON.stringify(v.valuesByMode[ss.modes[i].modeId])) ls.push(line(v, ss.modes[i].modeId)); if (ls.length) out.push(`@media (max-width:${bps[i - 1]}px){:root{\n${ls.join('\n')}\n}}`); }
const css = out.join('\n');
return { total: css.length, parts: Math.ceil(css.length / SIZE), chunk: css.slice(PART * SIZE, (PART + 1) * SIZE) };
