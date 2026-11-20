// Runs the myui-brand examples through build-brand.mjs. Fails (exit 1) when an example is not valid, a contrast
// check fails, or the accent button tokens show up where they should not (or are missing where they should be).
//   npm run check:brand
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { buildBrand } from '../skills/myui-brand/scripts/build-brand.mjs';

const dir = 'skills/myui-brand/examples';
const problems = [];
for (const file of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
  const input = JSON.parse(readFileSync(join(dir, file), 'utf8'));
  const r = buildBrand(input);
  if (r.errors) { problems.push(`${file}: ${r.errors.join(' ')}`); continue; }
  for (const c of r.brand.checks) if (!c.pass) problems.push(`${file}: ${c.label} is ${c.ratio}:1`);
  const hasTokens = r.css.includes('--brand-color-accent-solid-');
  const wants = Boolean(input.colors.accentButton);
  if (hasTokens !== wants) problems.push(`${file}: accent button tokens ${hasTokens ? 'written without' : 'missing with'} colors.accentButton`);
  console.log(`${file}: ${r.brand.checks.length} checks${wants ? `, accent button ${r.brand.accent.button.surface} with ${r.brand.accent.button.foreground} text` : ''}`);
}
if (problems.length) { console.error(`\n${problems.length} problem(s):\n  ${problems.join('\n  ')}`); process.exit(1); }
