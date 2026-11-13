// Token lint: checks that component CSS is token-first. Report mode by default (exit 0).
//   node scripts/lint-tokens.mjs            report, never fails
//   node scripts/lint-tokens.mjs --strict   fails on any finding (for later, when the report is clean)
//   node scripts/lint-tokens.mjs --json reports/token-lint.json --md reports/token-lint.md
// Rules (see scripts/token-lint.config.mjs):
//   1. px     No px values in component CSS, except the allowlist.
//   2. layer  Component CSS uses component tokens only (plus the allowed prefixes, such as --text-*).
//   3. unknown  A var() that is no token and not local (defined in component CSS, or private: --_name).
//   4. unused Tokens that nothing uses: not component CSS, not TSX, not another token.
//   5. duplicate  The same token declared twice in the same mode.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { readTokens, layerOf, refsIn } from './lib/tokens.mjs';
import config from './token-lint.config.mjs';

const args = process.argv.slice(2);
const arg = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const strict = args.includes('--strict');

const walk = (dir, ext) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return walk(p, ext);
    return ext.some((e) => p.endsWith(e)) ? [p] : [];
  });
const filesIn = (dirs, ext) => dirs.flatMap((d) => walk(d, ext)).sort();

// --- Tokens -------------------------------------------------------------------------------
const { values, declarations } = readTokens();
const layer = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, layerOf(k, v)]));

// --- Component CSS: declarations with selector, at-rule and line ----------------------------
function parseCss(file) {
  const src = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));
  const out = [];
  const stack = []; // selectors and at-rules
  let buf = '';
  let bufStart = 0;
  const lineAt = (i) => src.slice(0, i).split('\n').length;
  const flushDecls = (text, start) => {
    let offset = start;
    for (const d of text.split(';')) {
      const at = offset;
      offset += d.length + 1;
      const i = d.indexOf(':');
      if (i < 0 || !d.trim()) continue;
      const property = d.slice(0, i).trim();
      const value = d.slice(i + 1).trim();
      const lead = d.length - d.trimStart().length;
      const selector = [...stack].reverse().find((s) => !s.startsWith('@')) ?? '';
      const atRule = stack.filter((s) => s.startsWith('@')).join(' ');
      out.push({ file, line: lineAt(at + lead), selector, atRule, property, value });
    }
  };
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === '{') {
      // Declarations before a nested rule end at the last ';'.
      const cut = buf.lastIndexOf(';');
      if (cut >= 0) flushDecls(buf.slice(0, cut), bufStart);
      stack.push(buf.slice(cut + 1).trim().replace(/\s+/g, ' '));
      buf = '';
      bufStart = i + 1;
    } else if (c === '}') {
      flushDecls(buf, bufStart);
      stack.pop();
      buf = '';
      bufStart = i + 1;
    } else {
      if (!buf) bufStart = i;
      buf += c;
    }
  }
  return out;
}

const cssFiles = filesIn(config.componentCss, ['.css']);
const decls = cssFiles.flatMap(parseCss).map((d) => ({ ...d, file: relative('.', d.file) }));

// Custom properties defined in component CSS itself (--_bg, --myui-logo-mark-size) are local.
// Names that start with "_" are private by convention; TSX can also set them with style (--_lo, --_c).
const definedInCss = new Set(decls.filter((d) => d.property.startsWith('--')).map((d) => d.property.slice(2)));
const isLocal = (k) => k.startsWith('_') || definedInCss.has(k);

const findings = { px: [], layer: [], unknown: [], unused: [], duplicate: [] };

// Rule 1: px.
const matchesAllow = (d, px, a) =>
  (!a.property || new RegExp(a.property).test(d.property)) &&
  (!a.value || a.value === px) &&
  (!a.selector || new RegExp(a.selector).test(d.selector)) &&
  (!a.file || d.file.includes(a.file));
for (const d of decls) {
  const plain = d.value.replace(/var\([^)]*\)/g, ''); // var names never hold a px value
  for (const [px] of plain.matchAll(/-?\d*\.?\d+px\b/g)) {
    if (/^-?0*\.?0+px$/.test(px)) continue; // 0px is just 0
    if (config.pxAllow.some((a) => matchesAllow(d, px, a))) continue;
    findings.px.push({ ...d, px });
  }
}

// Rules 2 and 3: which tokens component CSS may use.
const allowedPrefix = (k) => config.allowedNonComponent.some((p) => k === p || k.startsWith(p + '-'));
for (const d of decls) {
  for (const k of refsIn(d.value)) {
    if (isLocal(k) && !(k in layer)) continue;
    if (!(k in layer)) findings.unknown.push({ ...d, token: k });
    else if (layer[k] !== 'component' && !allowedPrefix(k)) findings.layer.push({ ...d, token: k, layer: layer[k] });
  }
}

// Rule 4: unused tokens. A token is used when component CSS, TSX/TS or global styles name it,
// or when another token that is used refers to it.
const usedDirect = new Set();
for (const f of filesIn(config.usageSources, ['.css', '.tsx', '.ts'])) {
  if (config.tokenFiles.includes(f)) continue;
  for (const m of readFileSync(f, 'utf8').matchAll(/--([a-z][\w-]*)/g)) if (m[1] in layer) usedDirect.add(m[1]);
}
const used = new Set();
const visit = (k) => {
  if (used.has(k)) return;
  used.add(k);
  for (const v of Object.values(values[k] ?? {})) for (const r of refsIn(v)) visit(r);
};
usedDirect.forEach(visit);
// Brand tokens are the knobs for a client brand; semantic tokens are public API. Report them
// only when nothing at all refers to them.
const referencedByToken = new Set(Object.values(values).flatMap((m) => Object.values(m).flatMap(refsIn)));
for (const k of Object.keys(values)) {
  if (used.has(k)) continue;
  if (layer[k] !== 'component' && referencedByToken.has(k)) continue;
  const first = declarations.find((d) => d.name === k);
  findings.unused.push({ token: k, layer: layer[k], file: first.file, line: first.line });
}

// Rule 5: duplicates in the same mode.
const seen = new Map();
for (const d of declarations) {
  const key = `${d.mode} ${d.name}`;
  if (seen.has(key)) {
    const a = seen.get(key);
    findings.duplicate.push({ token: d.name, mode: d.mode, first: `${a.file}:${a.line} ${a.value}`, file: d.file, line: d.line, value: d.value });
  } else seen.set(key, d);
}

// --- Report -------------------------------------------------------------------------------
const count = Object.fromEntries(Object.entries(findings).map(([k, v]) => [k, v.length]));
const total = Object.values(count).reduce((a, b) => a + b, 0);
const by = (list, key) => list.reduce((m, x) => ((m[x[key]] ??= []).push(x), m), {});
const top = (obj, n = 15) => Object.entries(obj).sort((a, b) => b[1].length - a[1].length).slice(0, n);

const label = {
  px: 'px buiten de allowlist',
  layer: 'Geen component token in component-CSS',
  unknown: 'var() naar een token die niet bestaat',
  unused: 'Ongebruikte tokens',
  duplicate: 'Dubbele tokens (zelfde mode)',
};
const md = [];
md.push('# Token-lint', '');
md.push(strict ? 'Modus: strict (faalt bij bevindingen).' : 'Modus: rapport (faalt niet). Zie `scripts/token-lint.config.mjs` voor de regels en de allowlist.', '');
md.push('| Regel | Aantal |', '| --- | ---: |');
for (const k of Object.keys(findings)) md.push(`| ${label[k]} | ${count[k]} |`);
md.push('');

const section = (k, render) => {
  if (!findings[k].length) return;
  md.push(`## ${label[k]} (${count[k]})`, '');
  render(findings[k]);
  md.push('');
};
section('px', (list) => {
  md.push('Per bestand:', '', '| Bestand | Aantal |', '| --- | ---: |');
  for (const [f, l] of top(by(list, 'file'), 50)) md.push(`| \`${f}\` | ${l.length} |`);
  md.push('', 'Per eigenschap:', '', '| Eigenschap | Aantal | Waarden |', '| --- | ---: | --- |');
  for (const [p, l] of top(by(list, 'property'), 20)) md.push(`| \`${p}\` | ${l.length} | ${[...new Set(l.map((x) => x.px))].slice(0, 8).join(', ')} |`);
});
section('layer', (list) => {
  md.push('| Token | Laag | Aantal | Eerste plek |', '| --- | --- | ---: | --- |');
  for (const [t, l] of top(by(list, 'token'), 40)) md.push(`| \`--${t}\` | ${l[0].layer} | ${l.length} | \`${l[0].file}:${l[0].line}\` |`);
  if (Object.keys(by(list, 'token')).length > 40) md.push('', `En nog ${Object.keys(by(list, 'token')).length - 40} tokens. Volledige lijst in de JSON.`);
});
section('unknown', (list) => {
  md.push('| Token | Plek |', '| --- | --- |');
  for (const x of list) md.push(`| \`--${x.token}\` | \`${x.file}:${x.line}\` |`);
});
section('unused', (list) => {
  const byLayer = by(list, 'layer');
  md.push('| Laag | Aantal |', '| --- | ---: |');
  for (const [l, xs] of Object.entries(byLayer)) md.push(`| ${l} | ${xs.length} |`);
  md.push('', 'Per component (eerste deel van de naam):', '', '| Prefix | Aantal |', '| --- | ---: |');
  const prefix = by(list.map((x) => ({ ...x, prefix: x.token.split('-')[0] })), 'prefix');
  for (const [p, l] of top(prefix, 30)) md.push(`| \`${p}\` | ${l.length} |`);
});
section('duplicate', (list) => {
  md.push('| Token | Mode | Eerst | Daarna |', '| --- | --- | --- | --- |');
  for (const x of list) md.push(`| \`--${x.token}\` | ${x.mode} | \`${x.first}\` | \`${x.file}:${x.line} ${x.value}\` |`);
});
const report = md.join('\n') + '\n';

console.log(`Token-lint: ${total} bevindingen`, count);
for (const [k, list] of Object.entries(findings)) {
  for (const x of list.slice(0, 5)) {
    const where = `${x.file}:${x.line}`;
    const what = k === 'px' ? `${x.property}: ${x.px}` : k === 'unused' ? `--${x.token} (${x.layer})` : k === 'duplicate' ? `--${x.token} (${x.mode})` : `--${x.token}`;
    console.log(`  ${k.padEnd(9)} ${where}  ${what}`);
  }
  if (list.length > 5) console.log(`  ${k.padEnd(9)} … en nog ${list.length - 5}`);
}

const write = (path, text) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
};
if (arg('--md')) write(arg('--md'), report);
if (arg('--json')) write(arg('--json'), JSON.stringify({ count, findings }, null, 2) + '\n');
if (process.env.GITHUB_STEP_SUMMARY) writeFileSync(process.env.GITHUB_STEP_SUMMARY, report, { flag: 'a' });

if (strict && total > 0) process.exit(1);
