// Finds component tokens for loose values in component CSS (px or a semantic token).
// A suggestion is only made when the component token has exactly the same value in every
// style, theme, size and screen size, so applying it changes nothing on screen.
//   node scripts/suggest-component-tokens.mjs                  report to reports/token-suggestions.{md,json}
//   node scripts/suggest-component-tokens.mjs --apply          also write the safe suggestions into the CSS
// Matching: the component part comes from the last rb- class in the selector (.rb-command__search
// looks at command-search-* and command-*), the property part from the CSS property
// (padding: 0 16px → *-padding-vertical and *-padding-horizontal).
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { readTokens, layerOf } from './lib/tokens.mjs';
import { parseCss } from './lib/css.mjs';
import config from './token-lint.config.mjs';

const apply = process.argv.includes('--apply');
const { values } = readTokens();
const layer = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, layerOf(k, v)]));

// ---- Resolve a token in every combination of modes ------------------------------------------
const BRANDS = ['', 'brand:forest', 'brand:berry'];
const THEMES = ['', 'theme:dark'];
const SIZES = ['', 'size:sm', 'size:lg'];
const VIEWPORTS = ['viewport:max-1535', 'viewport:max-1199', 'viewport:max-899', 'viewport:max-599'];
const COMBOS = [];
for (const b of BRANDS) for (const t of THEMES) for (const s of SIZES) for (let v = 0; v <= VIEWPORTS.length; v++) COMBOS.push({ b, t, s, v: VIEWPORTS.slice(0, v).reverse() });
const pick = (modes, c) => {
  for (const vp of c.v) if (vp in modes) return modes[vp];
  if (c.t && c.t in modes) return modes[c.t];
  if (c.b && c.b in modes) return modes[c.b];
  if (c.s && c.s in modes) return modes[c.s];
  return modes.default ?? Object.values(modes)[0];
};
const norm = (v) => v.trim().replace(/\s+/g, ' ').replace(/^0px$/, '0');
const resolveIn = (expr, c, depth = 0) => {
  if (depth > 30) return expr;
  return norm(expr.replace(/var\(--([\w-]+)\)/g, (m, k) => (values[k] ? resolveIn(pick(values[k], c), c, depth + 1) : m)));
};
const signature = (expr) => COMBOS.map((c) => resolveIn(expr, c)).join('|');
const sigCache = new Map();
const sigOf = (token) => { if (!sigCache.has(token)) sigCache.set(token, signature(`var(--${token})`)); return sigCache.get(token); };

// ---- Which token suffixes fit a CSS property and a position in a shorthand -------------------
const split = (v) => { const out = []; let d = 0, cur = ''; for (const ch of v) { if (ch === '(') d++; if (ch === ')') d--; if (ch === ' ' && !d) { if (cur) out.push(cur); cur = ''; } else cur += ch; } if (cur) out.push(cur); return out; };
const SLOTS = {
  padding: (n) => (n === 1 ? [['padding']] : n === 2 ? [['padding-vertical', 'padding-y'], ['padding-horizontal', 'padding-x']] : n === 4 ? [['padding-top', 'padding-vertical'], ['padding-right', 'padding-horizontal'], ['padding-bottom', 'padding-vertical'], ['padding-left', 'padding-horizontal']] : null),
  'padding-top': () => [['padding-top', 'padding-vertical']], 'padding-bottom': () => [['padding-bottom', 'padding-vertical']],
  'padding-left': () => [['padding-left', 'padding-horizontal']], 'padding-right': () => [['padding-right', 'padding-horizontal']],
  'padding-inline': () => [['padding-horizontal']], 'padding-block': () => [['padding-vertical']],
  'padding-inline-start': () => [['padding-left', 'padding-horizontal', 'inset', 'indent']], 'padding-inline-end': () => [['padding-right', 'padding-horizontal']],
  gap: (n) => (n === 1 ? [['gap']] : [['row-gap', 'gap'], ['column-gap', 'gap']]), 'row-gap': () => [['row-gap', 'gap']], 'column-gap': () => [['column-gap', 'gap']],
  width: () => [['width', 'size', 'icon-size']], height: () => [['height', 'size', 'icon-size']],
  'min-width': () => [['min-width', 'width', 'size']], 'min-height': () => [['min-height', 'height', 'size']],
  'max-width': () => [['max-width', 'width']], 'max-height': () => [['max-height', 'height']],
  'border-width': () => [['border-width']], 'border-radius': (n) => (n === 1 ? [['radius']] : null),
  background: (n) => (n === 1 ? [['surface', 'background', 'track', 'fill']] : null), 'background-color': () => [['surface', 'background']],
  color: () => [['foreground', 'color', 'text']], 'border-color': () => [['border']],
};
// border: 1px solid var(--x) → width and color.
const borderSlots = (parts) => parts.map((p) => (/^-?[\d.]+px$|^0$|^var\(--[\w-]*width/.test(p) ? ['border-width'] : /^(solid|dashed|dotted|none)$/.test(p) ? null : ['border']));

const STATES = ['hover', 'active', 'focus', 'disabled', 'checked', 'selected', 'current', 'open', 'error', 'pressed', 'expanded'];
const stateOf = (selector) => STATES.filter((s) => new RegExp(`(:${s}|\\.is-${s}|\\[aria-${s}|--${s}\\b|:${s === 'checked' ? 'checked' : s})`).test(selector));

const allComponent = Object.keys(values).filter((k) => layer[k] === 'component');
// Token prefixes of other components: .rb-button must not take a button-group-* token.
let knownBlocks = [];
const blocksOf = (selector) => {
  const last = selector.split(',').map((s) => s.trim()).flatMap((s) => [...s.matchAll(/\.rb-([a-z0-9-]+?)(?:__([a-z0-9-]+))?(?:--[a-z0-9-]+)?(?=[.:\[\s>+~)]|$)/g)].slice(-1));
  const prefixes = new Set();
  for (const m of last) {
    const [, block, elem] = m;
    if (elem) prefixes.add(`${block}-${elem}`);
    prefixes.add(block);
    // Common short forms: rb-notif → notification, rb-dlist → description-list …
    for (const [a, b] of Object.entries(config.blockAliases ?? {})) if (block === a) { if (elem) prefixes.add(`${b}-${elem}`); prefixes.add(b); }
  }
  return [...prefixes].sort((a, b) => b.length - a.length);
};

// ---- Find suggestions --------------------------------------------------------------------------
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : p.endsWith('.css') ? [p] : []; });
const files = config.componentCss.flatMap(walk).sort();
knownBlocks = [...new Set(files.flatMap((f) => [...readFileSync(f, 'utf8').matchAll(/\.rb-([a-z0-9]+(?:-[a-z0-9]+)*?)(?=__|--|[^a-z0-9-]|$)/g)].map((m) => m[1])))];
const knownElems = [...new Set(files.flatMap((f) => [...readFileSync(f, 'utf8').matchAll(/\.rb-([a-z0-9-]+?)__([a-z0-9-]+)/g)].map((m) => `${m[1]}-${m[2]}`)))];
// A token of another component (.rb-button must not take button-group-*) or of another element of the
// same component (.rb-command__input must not take command-item-*).
const otherComponent = (k, prefix, own) => [...knownBlocks, ...knownElems].some((b) => b !== own && b.length > prefix.length && b.startsWith(prefix + '-') && k.startsWith(b + '-'));
const COLOR_PROPS = new Set(['background', 'background-color', 'color', 'border-color']);
const allowedPrefix = (k) => config.allowedNonComponent.some((p) => k === p || k.startsWith(p + '-'));
const needsWork = (part) => /^-?[\d.]+px$/.test(part) && !/^-?0+(\.0+)?px$/.test(part) || [...part.matchAll(/var\(--([\w-]+)\)/g)].some(([, k]) => layer[k] && layer[k] !== 'component' && !allowedPrefix(k));

const suggestions = [];
const unmatched = [];
const usedNow = new Set();
for (const file of files) {
  for (const d of parseCss(file)) {
    if (d.property.startsWith('--')) continue;
    let parts = split(d.value);
    // padding with one value: try vertical + horizontal tokens (written out as two values).
    if (d.property === 'padding' && parts.length === 1 && needsWork(parts[0])) { d.expand = true; parts = [parts[0], parts[0]]; }
    let slots = d.property === 'border' || /^border-(top|right|bottom|left)$/.test(d.property) ? borderSlots(parts) : SLOTS[d.property]?.(parts.length);
    const pending = [];
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!needsWork(part)) continue;
      const rel = relative('.', file);
      const where = { file: rel, line: d.line, selector: d.selector, property: d.property, value: d.value, part, index: i };
      const want = slots?.[i];
      if (!want || /calc\(|[*/+]/.test(part)) { unmatched.push({ ...where, why: want ? 'expression' : 'no token property for this CSS property' }); continue; }
      const sig = signature(part);
      let prefixes = blocksOf(d.selector);
      const own = prefixes[0];
      // A color on an element needs a token of that element; the component's own color is for its root.
      if (COLOR_PROPS.has(d.property) && /__/.test(d.selector.split(/\s|>|\+|~/).pop() ?? '')) prefixes = prefixes.slice(0, 1);
      const states = stateOf(d.selector);
      let found = [];
      // A preferred token from the config wins when its value is the same.
      const forced = (config.suggestPrefer ?? []).find((x) => d.selector.includes(x.selector) && d.property === x.property && values[x.token] && sigOf(x.token) === sig);
      if (forced) found = [forced.token];
      else for (const prefix of prefixes) {
        const cands = allComponent.filter((k) => k.startsWith(prefix + '-') && !otherComponent(k, prefix, own) && want.some((w) => {
          const rest = k.slice(prefix.length + 1);
          const base = rest.replace(new RegExp(`-(${STATES.join('|')})$`), '');
          return base === w || base.endsWith('-' + w) || rest === w;
        }));
        found = cands.filter((k) => sigOf(k) === sig);
        // Several with the same value: take the one named exactly <prefix>-<property>, e.g. qty-border-width.
        if (found.length > 1) { const exact = found.filter((k) => want.includes(k.slice(prefix.length + 1))); if (exact.length === 1) found = exact; }
        if (found.length) break;
      }
      if (found.length > 1) {
        // Prefer the token whose state matches the selector, then the one without a state.
        const byState = found.filter((k) => states.some((s) => k.endsWith('-' + s)));
        const plain = found.filter((k) => !STATES.some((s) => k.endsWith('-' + s)) && !/-default$/.test(k));
        const def = found.filter((k) => k.endsWith('-default'));
        found = byState.length ? byState : def.length ? def : plain.length ? plain : found;
      }
      if (found.length === 1 && (config.suggestExclude ?? []).some((x) => d.selector.includes(x.selector) && d.property === x.property && found[0] === x.token)) { unmatched.push({ ...where, why: `excluded: ${found[0]} has the same value but another meaning` }); continue; }
      if (found.length === 1) pending.push({ ...where, token: found[0], expand: !!d.expand });
      else {
        // Tokens that fit by name but have another value: Figma and code differ here.
        const byName = [];
        for (const prefix of prefixes) {
          const c = allComponent.filter((k) => k.startsWith(prefix + '-') && !otherComponent(k, prefix, own) && want.some((w) => { const rest = k.slice(prefix.length + 1); const base = rest.replace(new RegExp(`-(${STATES.join('|')})$`), ''); return base === w || base.endsWith('-' + w); }));
          if (c.length) { byName.push(...c); break; }
        }
        unmatched.push({ ...where, why: found.length ? `several tokens: ${found.join(', ')}` : byName.length ? 'token with another value' : 'no component token with this value', differs: byName.map((k) => ({ token: k, value: COMBOS[0] ? resolveIn(`var(--${k})`, COMBOS[0]) : '' })), current: resolveIn(part, COMBOS[0]) });
      }
    }
    // An expanded padding is only safe when both halves found a token.
    if (d.expand && pending.length !== 2) { pending.forEach((x) => unmatched.push({ ...x, why: 'padding: only one of vertical and horizontal has a token' })); continue; }
    for (const x of pending) { suggestions.push(x); usedNow.add(x.token); }
  }
}

// ---- Report ------------------------------------------------------------------------------------
mkdirSync('reports', { recursive: true });
writeFileSync('reports/token-suggestions.json', JSON.stringify({ suggestions, unmatched }, null, 2));
const by = (list, f) => list.reduce((m, x) => ((m[f(x)] ??= []).push(x), m), {});
const md = ['# Component token suggestions', '', `Safe suggestions (same value in every mode): ${suggestions.length}. Not matched: ${unmatched.length}.`, ''];
md.push('## Not matched, by reason', '');
for (const [why, l] of Object.entries(by(unmatched, (x) => x.why.startsWith('several') ? 'several tokens' : x.why))) md.push(`- ${why}: ${l.length}`);
writeFileSync('reports/token-suggestions.md', md.join('\n') + '\n');
console.log(`Suggestions: ${suggestions.length}, not matched: ${unmatched.length}, tokens that become used: ${usedNow.size}`);

// ---- Apply ---------------------------------------------------------------------------------------
if (apply) {
  const perFile = by(suggestions, (s) => s.file);
  for (const [file, list] of Object.entries(perFile)) {
    let src = readFileSync(file, 'utf8');
    const decls = parseCss(file);
    // Group by declaration, rewrite each value once, from the end of the file to the start.
    const byDecl = by(list, (s) => `${s.line}|${s.selector}|${s.property}|${s.value}`);
    const edits = [];
    for (const group of Object.values(byDecl)) {
      const s0 = group[0];
      const d = decls.find((x) => x.line === s0.line && x.selector === s0.selector && x.property === s0.property && x.value === s0.value);
      if (!d) continue;
      const parts = group[0].expand ? [d.value, d.value] : split(d.value);
      for (const s of group) parts[s.index] = parts[s.index].replace(s.part, `var(--${s.token})`);
      edits.push({ start: d.valueStart, end: d.valueEnd, text: parts.join(' ') });
    }
    edits.sort((a, b) => b.start - a.start);
    for (const e of edits) src = src.slice(0, e.start) + e.text + src.slice(e.end);
    writeFileSync(file, src);
  }
  console.log(`Applied to ${Object.keys(perFile).length} files.`);
}
