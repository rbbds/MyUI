// Writes docs/reports/figma-bindings.md from docs/reports/figma-bindings.json (output of scripts/figma-binding-scan.js)
// and checks it against tokens.css and the token-lint config (keuze 18b).
// Usage: npm run report:figma-bindings [-- --strict]   (--strict exits 1 on an unbound token that is not pending)
import { readFileSync, writeFileSync } from 'node:fs';
import config from './token-lint.config.mjs';

const scan = JSON.parse(readFileSync('docs/reports/figma-bindings.json', 'utf8'));
const css = readFileSync('src/styles/tokens.css', 'utf8');
const CATEGORIES = new Set(['action', 'forms', 'selection-controls', 'badges-and-tags', 'avatars', 'feedback', 'overlays', 'navigation', 'data-display', 'content', 'e-commerce', 'utilities']);
const cssName = (n) => { const [cat, ...rest] = n.split('/'); return (CATEGORIES.has(cat) ? rest.join('/') : n).toLowerCase().replace(/[\/, ]+/g, '-'); };
const pending = (name) => config.unusedPending.find((p) => p.prefixes.some((x) => name.startsWith(x)));

const rows = scan.unbound.map((n) => {
  const c = cssName(n);
  const p = pending(c);
  return { name: n, css: `--${c}`, inCss: css.includes(`--${c}:`), pending: p ? p.until : null };
});
const open = rows.filter((r) => !r.pending);

const md = [
  '# Figma binding scan',
  '',
  `File: ${scan.file}. Scanned ${scan.scannedAt} with \`${scan.script}\` (read-only): ${scan.pages} pages, ${scan.nodes} layers, ${scan.componentTokens} component tokens.`,
  'Counted: layer fields, fills, strokes, effects and text ranges (also hidden layers in instances), aliases and styles.',
  '',
  '| Check | Result |',
  '| --- | ---: |',
  `| Component tokens without a binding | ${scan.unbound.length} |`,
  `| … of which pending (token-lint \`unusedPending\`) | ${rows.length - open.length} |`,
  `| Code syntax differs from the CSS name | ${scan.codeSyntaxMismatch.length} |`,
  '',
  rows.length ? '## Without a binding\n\n| Token | CSS | In tokens.css | Pending |\n| --- | --- | --- | --- |\n' + rows.map((r) => `| \`${r.name}\` | \`${r.css}\` | ${r.inCss ? 'yes' : 'no'} | ${r.pending ?? '–'} |`).join('\n') + '\n' : '',
  scan.codeSyntaxMismatch.length ? '## Code syntax\n\n' + scan.codeSyntaxMismatch.map((m) => `- \`${m.name}\`: ${m.codeSyntax} (expected ${m.expected})`).join('\n') + '\n' : '',
  '## Exceptions',
  '',
  ...scan.exceptions.map((e) => `- ${e.where}: ${e.binding}. ${e.reason}`),
  '',
  'Run the scan again after every token export and commit the new JSON (keuze 18b).',
  '',
].join('\n');
writeFileSync('docs/reports/figma-bindings.md', md);
console.log(`Figma bindings: ${scan.unbound.length} unbound (${open.length} not pending), ${scan.codeSyntaxMismatch.length} code syntax mismatches`);
if (process.argv.includes('--strict') && (open.length || scan.codeSyntaxMismatch.length)) process.exit(1);
