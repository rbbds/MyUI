// Builds dist/tokens.json from src/styles/tokens.css, in the Design Tokens (DTCG) format.
// One file that tools and AI assistants can read without parsing CSS.
// - Groups: primitive, brand, semantic, component (see LAYER below).
// - Aliases use DTCG references: "{semantic.color-surface-primary}".
// - Values for other modes (brand, theme, size, viewport) are in $extensions["com.rbbds"].modes.
// Run after the build: node scripts/build-tokens-json.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const css = readFileSync('src/styles/tokens.css', 'utf8');
const version = JSON.parse(readFileSync('package.json', 'utf8')).version;

// 1. Read blocks: selector (or media query) and the declarations in it.
const modeOf = (sel, media) => {
  if (media) return 'viewport:' + media.match(/max-width:\s*(\d+)px/)[1].replace(/^/, 'max-');
  const s = sel.replace(/\s+/g, '');
  if (/data-brand="(\w+)"/.test(s) && !s.includes(',')) return 'brand:' + s.match(/data-brand="(\w+)"/)[1];
  if (s.includes('data-theme="light"')) return 'theme:light';
  if (s.includes('data-theme="dark"')) return 'theme:dark';
  if (/^\[data-size="(\w+)"\]$/.test(s)) return 'size:' + s.match(/data-size="(\w+)"/)[1];
  return 'default';
};
const values = {}; // name -> { mode: value }
const re = /(@media[^{]+)\{\s*:root\{([^}]*)\}\s*\}|([^{}@]+)\{([^}]*)\}/g;
for (const m of css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(re)) {
  const mode = m[1] ? modeOf('', m[1]) : modeOf(m[3].trim());
  const body = m[1] ? m[2] : m[4];
  for (const d of body.split(';')) {
    const i = d.indexOf(':');
    const name = d.slice(0, i).trim();
    if (!name.startsWith('--')) continue;
    const key = name.slice(2);
    const value = d.slice(i + 1).trim();
    (values[key] ??= {})[mode === 'theme:light' ? 'default' : mode] ??= value;
  }
}

// 2. Layer per token.
const SEMANTIC = /^(color|spacing|border|font|size|shadow|focus|effect|layout|base|typography|responsive|icon|screen|opacity|motion|z)-/;
const layerOf = (key, v) => {
  if (key.startsWith('brand-')) return 'brand';
  const def = v.default ?? Object.values(v)[0];
  if (!def.includes('var(')) return 'primitive';
  if (SEMANTIC.test(key)) return 'semantic';
  return 'component';
};
const layer = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, layerOf(k, v)]));

// 3. Values: var(--x) becomes a DTCG reference {layer.x}.
const toValue = (v) => {
  const only = v.match(/^var\(--([\w-]+)\)$/);
  if (only && layer[only[1]]) return `{${layer[only[1]]}.${only[1]}}`;
  return v.replace(/var\(--([\w-]+)\)/g, (_, k) => (layer[k] ? `{${layer[k]}.${k}}` : `var(--${k})`));
};
const resolve = (key, seen = new Set()) => {
  const v = values[key]?.default ?? Object.values(values[key] ?? {})[0];
  if (!v || seen.has(key)) return v;
  seen.add(key);
  const only = v.match(/^var\(--([\w-]+)\)$/);
  return only ? resolve(only[1], seen) : v;
};
const typeOf = (key) => {
  const v = resolve(key) ?? '';
  if (/^(#|rgba?\(|hsla?\(|transparent$)/.test(v)) return 'color';
  if (/font-family|font-body|font-title/.test(key) || /["',]/.test(v) && !/\d+px/.test(v)) return 'fontFamily';
  if (/font-weight/.test(key) || /^[1-9]00$/.test(v)) return 'fontWeight';
  if (/\d+px\s+\d+px|inset /.test(v)) return 'shadow';
  if (/^-?[\d.]+(px|rem|em|%)$/.test(v) || v === '0') return 'dimension';
  if (/^-?[\d.]+(ms|s)$/.test(v)) return 'duration';
  if (/^-?[\d.]+$/.test(v)) return 'number';
  return undefined;
};

const groups = { primitive: {}, brand: {}, semantic: {}, component: {} };
for (const [key, v] of Object.entries(values)) {
  const def = v.default ?? Object.values(v)[0];
  const token = { $value: toValue(def) };
  const t = typeOf(key);
  if (t) token.$type = t;
  const modes = Object.fromEntries(Object.entries(v).filter(([m]) => m !== 'default').map(([m, val]) => [m, toValue(val)]));
  token.$extensions = { 'com.rbbds': { css: `--${key}`, ...(Object.keys(modes).length ? { modes } : {}) } };
  groups[layer[key]][key] = token;
}

const out = {
  $description: `@rbbds/ui ${version} design tokens. Generated from src/styles/tokens.css (which is generated from Figma). Use the css name in code: var(--name). In components, use component and semantic tokens. Only change brand tokens to make your own brand.`,
  $extensions: {
    'com.rbbds': {
      version,
      layers: {
        primitive: 'Raw values: color scales, spacing scale (spacings-*), radius, font sizes. Do not use directly in components.',
        brand: 'Per style (Iris, Forest, Berry): primary and accent colors, fonts, radius, border width. Override these for your own brand.',
        semantic: 'Meaning: color-surface-*, color-foreground-*, color-border-*, spacing-*, border-radius-*, text-*. Follows theme (Light, Dark).',
        component: 'Per component and part: <component>-<part>-<property>-<state>, for example button-primary-surface-hover.',
      },
      modes: {
        'brand:forest': 'data-brand="forest" on <html>. Iris is the default.',
        'brand:berry': 'data-brand="berry" on <html>.',
        'theme:dark': 'data-theme="dark" on <html> or on a section.',
        'size:sm': 'data-size="sm" on an element.',
        'size:lg': 'data-size="lg" on an element.',
        'viewport:max-*': 'Applies below that screen width (media query).',
      },
      naming: 'Figma variable path with "/" becomes "-" in CSS. A decimal comma becomes "-": spacing/1,5 is --spacing-1-5 (6 px). State is always last: surface-hover, border-checked-hover.',
    },
  },
  ...groups,
};

mkdirSync('dist', { recursive: true });
writeFileSync('dist/tokens.json', JSON.stringify(out, null, 2) + '\n');
const count = Object.fromEntries(Object.entries(groups).map(([g, t]) => [g, Object.keys(t).length]));
console.log('tokens.json', count);
