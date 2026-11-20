// Contrast check for non-text parts (WCAG 1.4.11, 2.4.7): control borders and the active option,
// and for button labels on their fill in every state (WCAG 1.4.3).
// Resolves the tokens from tokens.css for every style (Iris, Forest, Berry) and theme (Light, Dark).
//   node scripts/check-contrast.mjs   fails (exit 1) when a pair is below its minimum
// Pairs live in PAIRS below. Add a pair when a part only shows itself through a color.
import { readTokens } from './lib/tokens.mjs';

const MIN = 3, TEXT = 4.5;
const SURFACES = ['color-surface-primary', 'color-surface-secondary'];
const PAIRS = [
  ...['input-border-default', 'selection-border-default', 'code-input-border', 'toggle-track-off'].flatMap((fg) => SURFACES.map((bg) => [fg, bg])),
  ['menu-item-border-active', 'menu-item-surface-hover'],
  ['command-item-border-active', 'command-item-surface-active'],
  // L5: the ring of the current option in Button group and Pagination, on the page and on its own fill.
  ...['button-group', 'pagination'].flatMap((c) => [...SURFACES, `${c}-surface-current`].map((bg) => [`${c}-border-current`, bg])),
  // The focus ring and the focus border of a field on every surface, 3:1.
  ...['effect-border-focus', 'input-border-focus'].flatMap((fg) => SURFACES.map((bg) => [fg, bg])),
  // Button label on its own fill, 4.5:1. Transparent fills (tertiary, link) fall through to the page.
  ...['primary', 'accent', 'secondary', 'tertiary', 'link', 'primary-destructive', 'secondary-destructive', 'tertiary-destructive', 'link-destructive']
    .flatMap((h) => ['default', 'hover', 'pressed'].map((st) => [`button-${h}-foreground-${st}`, `button-${h}-surface-${st}`, TEXT])),
];

const { values } = readTokens();
const BRANDS = ['default', 'brand:forest', 'brand:berry'];
const THEMES = ['default', 'theme:dark'];
const label = { default: '', 'brand:forest': 'Forest', 'brand:berry': 'Berry', 'theme:dark': 'Dark' };

const resolve = (name, brand, theme, depth = 0) => {
  const modes = values[name];
  if (!modes || depth > 20) throw new Error(`Unknown token --${name}`);
  const v = (theme !== 'default' && modes[theme]) || (brand !== 'default' && modes[brand]) || modes.default;
  const ref = v.match(/^var\(--([\w-]+)\)$/);
  return ref ? resolve(ref[1], brand, theme, depth + 1) : v;
};
const parse = (c) => {
  const hex = c.match(/^#([0-9a-f]{6})$/i);
  if (hex) return [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16) / 255).concat(1);
  const rgba = c.match(/^rgba?\(([^)]+)\)$/);
  if (rgba) { const [r, g, b, a = 1] = rgba[1].split(',').map(Number); return [r / 255, g / 255, b / 255, a]; }
  throw new Error(`Not a color: ${c}`);
};
const over = (fg, bg) => fg.slice(0, 3).map((x, i) => x * fg[3] + bg[i] * (1 - fg[3])).concat(1);
const lum = ([r, g, b]) => [r, g, b].map((u) => (u <= 0.03928 ? u / 12.92 : ((u + 0.055) / 1.055) ** 2.4)).reduce((s, x, i) => s + x * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const fails = [];
const rows = [];
for (const [fg, bg, min = MIN] of PAIRS) {
  const cells = [];
  for (const theme of THEMES) for (const brand of BRANDS) {
    const page = parse(resolve('color-surface-primary', brand, theme));
    const b = over(parse(resolve(bg, brand, theme)), page);
    const f = over(parse(resolve(fg, brand, theme)), b);
    const r = ratio(f, b);
    cells.push(r);
    if (r < min) fails.push(`--${fg} on --${bg} (${[label[brand] || 'Iris', label[theme] || 'Light'].join(', ')}): ${r.toFixed(2)}:1, needs ${min}:1`);
  }
  rows.push(`  ${`--${fg} on --${bg}`.padEnd(62)} min ${Math.min(...cells).toFixed(2)}:1${min === MIN ? '' : ` (needs ${min}:1)`}`);
}
console.log(`Contrast (minimum ${MIN}:1, button labels ${TEXT}:1, Iris/Forest/Berry x Light/Dark):\n${rows.join('\n')}`);
if (fails.length) { console.error(`\n${fails.length} below the minimum:\n  ${fails.join('\n  ')}`); process.exit(1); }
