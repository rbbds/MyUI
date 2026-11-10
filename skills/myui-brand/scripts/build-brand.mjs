#!/usr/bin/env node
// MyUI brand builder for the command line. No dependencies, Node 18 or newer.
//
//   node build-brand.mjs <brand-input.json> [output folder]
//
// Reads the brand input (see ../brand.schema.json) and writes to the output folder (default: ./brand-output):
//   brand.json             everything resolved: input, 12-step scales, font stacks, contrast checks
//   brand-<slug>.css       CSS to load after @rbbds/ui/styles.css
//   figma-brand.json       values for the ↳ brand collection in Figma (also read by the Brand import plugin)
// It prints a short report. The exit code is 1 when the input is not valid, 0 otherwise (contrast warnings do not fail).
//
// The color math is the same as the Brand builder in Storybook (src/docs/brand/color.ts). Keep them in sync.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

/* ---------- color math (copy of src/docs/brand/color.ts) ---------- */
const STEPS = ['25', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
const L = { 25: 0.985, 50: 0.965, 100: 0.93, 200: 0.87, 300: 0.78, 400: 0.68, 500: 0.6, 600: 0.53, 700: 0.47, 800: 0.4, 900: 0.35, 950: 0.25 };
const C = { 25: 0.08, 50: 0.16, 100: 0.3, 200: 0.55, 300: 0.8, 400: 0.95, 500: 1, 600: 1, 700: 0.92, 800: 0.78, 900: 0.66, 950: 0.5 };
const toLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex).trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}
const rgbToHex = (rgb) => '#' + rgb.map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, '0')).join('');
function rgbToOklch([r, g, b]) {
  const [lr, lg, lb] = [toLin(r), toLin(g), toLin(b)];
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L_ = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const b2 = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L_, Math.hypot(a, b2), (Math.atan2(b2, a) * 180) / Math.PI];
}
function oklchToRgb(Lv, Cv, H) {
  const a = Cv * Math.cos((H * Math.PI) / 180);
  const b = Cv * Math.sin((H * Math.PI) / 180);
  const l = (Lv + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (Lv - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (Lv - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    toGam(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    toGam(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    toGam(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}
const inGamut = (rgb) => rgb.every((c) => c >= -0.0005 && c <= 1.0005);
function fit(Lv, Cv, H) {
  let c = Cv;
  let rgb = oklchToRgb(Lv, c, H);
  while (!inGamut(rgb) && c > 0.001) { c *= 0.95; rgb = oklchToRgb(Lv, c, H); }
  return rgb;
}
function brandScale(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const [l0, c0, h0] = rgbToOklch(rgb);
  const anchor = STEPS.reduce((best, s) => (Math.abs(L[s] - l0) < Math.abs(L[best] - l0) ? s : best), '600');
  const shift = l0 - L[anchor];
  const scale = {};
  for (const s of STEPS) {
    const w = 1 - Math.min(1, Math.abs(STEPS.indexOf(s) - STEPS.indexOf(anchor)) / 4);
    scale[s] = s === anchor ? rgbToHex(rgb) : rgbToHex(fit(Math.min(0.99, L[s] + shift * w), c0 * C[s], h0));
  }
  return { scale, anchor };
}
const lum = (rgb) => { const [r, g, b] = rgb.map(toLin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
function contrast(a, b) {
  const A = hexToRgb(a), B = hexToRgb(b);
  if (!A || !B) return 0;
  const [x, y] = [lum(A), lum(B)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/* ---------- brand ---------- */
const STYLES = { iris: 'Iris', forest: 'Forest', berry: 'Berry' };
const DARK_SURFACE = '#0b0f17';
const KNOWN_SERIF = ['Source Serif 4', 'Merriweather', 'Lora', 'Playfair Display', 'Fraunces', 'DM Serif Display', 'Libre Baskerville', 'EB Garamond', 'Crimson Pro', 'Noto Serif', 'PT Serif', 'Roboto Serif'];
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'my-brand';
const isHex = (v) => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v);

function validate(input) {
  const errors = [];
  if (!input || typeof input !== 'object') return ['The input is not a JSON object.'];
  if (!input.name || typeof input.name !== 'string') errors.push('name is missing.');
  if (!STYLES[input.style]) errors.push('style must be "iris", "forest" or "berry".');
  if (!input.colors || !isHex(input.colors.primary)) errors.push('colors.primary must be a hex color like #0e5e6f.');
  if (input.colors?.accent !== undefined && !isHex(input.colors.accent)) errors.push('colors.accent must be a hex color like #e07a2f, or left out.');
  if (!input.fonts || typeof input.fonts.body !== 'string' || typeof input.fonts.title !== 'string') errors.push('fonts.body and fonts.title are required.');
  return errors;
}

function checksFor(primary, accent) {
  const list = [
    { id: 'button-text', label: 'White text on a primary button (primary 600)', ratio: contrast('#ffffff', primary['600']) },
    { id: 'link-light', label: 'Link on white (primary 600)', ratio: contrast(primary['600'], '#ffffff') },
    { id: 'link-dark', label: 'Link in Dark (primary 400 on dark)', ratio: contrast(primary['400'], DARK_SURFACE) },
  ];
  if (accent) list.push({ id: 'accent-text', label: 'Accent text on white (accent 700)', ratio: contrast(accent['700'], '#ffffff') });
  return list.map((c) => ({ ...c, ratio: Math.round(c.ratio * 100) / 100, pass: c.ratio >= 4.5 }));
}

/* Nearest darker or lighter version of the primary color that passes the light-mode checks. */
function suggestPrimary(hex) {
  const [l0, c0, h0] = rgbToOklch(hexToRgb(hex));
  for (let i = 1; i <= 40; i++) {
    for (const dir of [-1, 1]) {
      const cand = rgbToHex(fit(l0 + dir * i * 0.01, c0, h0));
      const s = brandScale(cand).scale;
      if (contrast('#ffffff', s['600']) >= 4.5 && contrast(s['400'], DARK_SURFACE) >= 4.5) return cand;
    }
  }
  return null;
}

export function buildBrand(input) {
  const errors = validate(input);
  if (errors.length) return { errors };
  const serif = new Set([...(input.fonts.serif || []), ...KNOWN_SERIF]);
  const stack = (f) => (serif.has(f) ? `"${f}", ui-serif, Georgia, serif` : `"${f}", ui-sans-serif, system-ui, sans-serif`);
  const primary = brandScale(input.colors.primary);
  const accent = input.colors.accent ? brandScale(input.colors.accent) : null;
  const checks = checksFor(primary.scale, accent?.scale);
  const warnings = [];
  const failing = checks.filter((c) => !c.pass);
  if (failing.some((c) => c.id !== 'accent-text')) {
    const s = suggestPrimary(input.colors.primary);
    warnings.push(`Contrast too low: ${failing.map((f) => `${f.label} ${f.ratio}:1`).join(', ')}. Need 4.5:1.${s ? ` A close color that passes: ${s}.` : ''}`);
  } else if (failing.length) {
    warnings.push(`Accent text on white is ${failing[0].ratio}:1. Use the accent for shapes and backgrounds, not for small text, or pick a darker accent.`);
  }
  const brandSlug = slug(input.name);
  const name = STYLES[input.style];
  const selector = input.style === 'iris' ? ':root' : `:root[data-brand="${input.style}"]`;
  const fontPkgs = [...new Set([input.fonts.body, input.fonts.title])].filter((f) => f !== 'Inter').map((f) => `@fontsource/${slug(f)}`);
  const css = `/* ${input.name}: brand based on the style ${name}. Generated by the MyUI brand skill.
   1. Load this file after @rbbds/ui/styles.css.
${input.style === 'iris' ? '   2. You do not need data-brand: Iris is the default.' : `   2. Put data-brand="${input.style}" on <html>.`}
${fontPkgs.length ? `   3. Host the fonts yourself, for example: npm i ${fontPkgs.join(' ')} (check the font license first).` : '   3. Inter: npm i @fontsource-variable/inter'} */
${selector} {
${STEPS.map((s) => `  --brand-color-primary-${s}: ${primary.scale[s]};`).join('\n')}
${accent ? STEPS.map((s) => `  --brand-color-accent-${s}: ${accent.scale[s]};`).join('\n') + '\n' : ''}  --brand-font-body: ${stack(input.fonts.body)};
  --brand-font-title: ${stack(input.fonts.title)};
}
`;
  const figma = {
    collection: '↳ brand',
    mode: input.name,
    basedOn: name,
    values: {
      ...Object.fromEntries(STEPS.map((s) => [`brand/color/primary/${s}`, primary.scale[s]])),
      ...(accent ? Object.fromEntries(STEPS.map((s) => [`brand/color/accent/${s}`, accent.scale[s]])) : {}),
      'brand/font/body': input.fonts.body,
      'brand/font/title': input.fonts.title,
    },
  };
  const brand = {
    ...input,
    generator: 'myui-brand 1.0',
    primary: { input: input.colors.primary, anchor: primary.anchor, scale: primary.scale },
    accent: accent ? { input: input.colors.accent, anchor: accent.anchor, scale: accent.scale } : null,
    fontStacks: { body: stack(input.fonts.body), title: stack(input.fonts.title) },
    checks,
    warnings: [...(input.notes || []), ...warnings],
  };
  return { brand, css, figma, slug: brandSlug };
}

/* ---------- CLI ---------- */
const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname);
if (isMain) {
  const [file, out = 'brand-output'] = process.argv.slice(2);
  if (!file) { console.error('Usage: node build-brand.mjs <brand-input.json> [output folder]'); process.exit(1); }
  let input;
  try { input = JSON.parse(readFileSync(file, 'utf8')); } catch (e) { console.error(`Cannot read ${file}: ${e.message}`); process.exit(1); }
  const r = buildBrand(input);
  if (r.errors) { console.error('The brand input is not valid:\n- ' + r.errors.join('\n- ')); process.exit(1); }
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, 'brand.json'), JSON.stringify(r.brand, null, 2) + '\n');
  writeFileSync(join(out, `brand-${r.slug}.css`), r.css);
  writeFileSync(join(out, 'figma-brand.json'), JSON.stringify(r.figma, null, 2) + '\n');
  console.log(`Brand "${input.name}" (style ${STYLES[input.style]})`);
  console.log(`Primary ${input.colors.primary} is step ${r.brand.primary.anchor}.${r.brand.accent ? ` Accent ${input.colors.accent} is step ${r.brand.accent.anchor}.` : ''}`);
  for (const c of r.brand.checks) console.log(`${c.pass ? 'PASS' : 'FAIL'}  ${c.label}: ${c.ratio}:1`);
  for (const w of r.brand.warnings) console.log(`NOTE  ${w}`);
  console.log(`Files in ${out}/: brand.json, brand-${r.slug}.css, figma-brand.json`);
}
