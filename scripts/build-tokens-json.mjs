// Builds dist/tokens.json from src/styles/tokens.css and effects.css, in the Design Tokens (DTCG) format.
// One file that tools and AI assistants can read without parsing CSS.
// - Groups: primitive, brand, semantic, component (see LAYER below).
// - Aliases use DTCG references: "{semantic.color-surface-primary}".
// - Values for other modes (brand, theme, size, viewport) are in $extensions["com.rbbds"].modes.
// Run after the build: node scripts/build-tokens-json.mjs
// Reads tokens.css and effects.css (shadows, focus rings) through scripts/lib/tokens.mjs.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { readTokens, layerOf } from './lib/tokens.mjs';

const version = JSON.parse(readFileSync('package.json', 'utf8')).version;

// 1. Read all token declarations, per mode. The last declaration wins, like in CSS.
const { values } = readTokens();

// 2. Layer per token.
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
  if (/^(shadow|focus-ring)(-|$)/.test(key)) return 'shadow';
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
  $description: `@rbbds/ui ${version} design tokens. Generated from src/styles/tokens.css (Figma variables) and src/styles/effects.css (Figma effect styles: shadows and focus rings). Use the css name in code: var(--name). In components, use component and semantic tokens. Only change brand tokens to make your own brand.`,
  $extensions: {
    'com.rbbds': {
      version,
      layers: {
        primitive: 'Raw values: color scales, spacing scale (spacings-*), radius, font sizes. Do not use directly in components.',
        brand: 'Per style (Iris, Forest, Berry): primary and accent colors, fonts, radius, border width. Override these for your own brand.',
        semantic: 'Meaning: color-surface-*, color-foreground-*, color-border-*, spacing-*, border-radius-*, text-*, shadow-*, focus-ring*. Follows theme (Light, Dark).',
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
