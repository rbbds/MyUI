/**
 * Figma binding scan (read-only, keuze 18b). Changes nothing in the file.
 *
 * Run in "WL Design System (rbbds)" as a plugin snippet (Figma MCP use_figma, or Scripter).
 * Returns JSON. Save it as reports/figma-bindings.json and run
 * `npm run report:figma-bindings` to write reports/figma-bindings.md.
 *
 * Counts, for every component token (component-tokens/…), where it is used:
 * - layer fields (boundVariables), fills, strokes, effects and text ranges on every page,
 *   including hidden layers inside instances;
 * - aliases from other variables;
 * - paint, effect, text and grid styles.
 * A component token with 0 uses breaks rule 18b: bind it or remove it.
 */
figma.skipInvisibleInstanceChildren = false;
const PREFIX = 'component-tokens/';
const CATEGORIES = new Set(['action', 'forms', 'selection-controls', 'badges-and-tags', 'avatars', 'feedback', 'overlays', 'navigation', 'data-display', 'content', 'e-commerce', 'utilities']);
const vars = await figma.variables.getLocalVariablesAsync();
const ct = vars.filter((v) => v.name.startsWith(PREFIX));
const uses = Object.fromEntries(ct.map((v) => [v.id, { layers: 0, aliases: 0, styles: 0 }]));
const add = (id, kind) => { if (id && uses[id]) uses[id][kind]++; };
const fromBound = (bv, kind) => {
  if (!bv) return;
  for (const k in bv) {
    const b = bv[k];
    if (Array.isArray(b)) b.forEach((x) => x && add(x.id, kind));
    else if (b && b.id) add(b.id, kind);
    else if (b && typeof b === 'object') fromBound(b, kind);
  }
};
const fromPaints = (arr, kind) => { if (Array.isArray(arr)) arr.forEach((p) => fromBound(p.boundVariables, kind)); };

// Aliases
for (const v of vars) for (const m in v.valuesByMode) { const val = v.valuesByMode[m]; if (val && val.type === 'VARIABLE_ALIAS') add(val.id, 'aliases'); }
// Styles
for (const s of [...await figma.getLocalPaintStylesAsync(), ...await figma.getLocalEffectStylesAsync(), ...await figma.getLocalTextStylesAsync(), ...await figma.getLocalGridStylesAsync()]) {
  fromBound(s.boundVariables, 'styles'); fromPaints(s.paints, 'styles'); fromPaints(s.effects, 'styles');
}
// Layers on every page
let nodes = 0;
for (const page of figma.root.children) {
  await page.loadAsync();
  for (const n of page.findAll(() => true)) {
    nodes++;
    fromBound(n.boundVariables, 'layers');
    fromPaints(n.fills, 'layers'); fromPaints(n.strokes, 'layers'); fromPaints(n.effects, 'layers');
    if (n.type === 'TEXT' && (n.fills === figma.mixed || n.fontSize === figma.mixed)) {
      for (const seg of n.getStyledTextSegments(['boundVariables', 'fills'])) { fromBound(seg.boundVariables, 'layers'); fromPaints(seg.fills, 'layers'); }
    }
  }
}
const css = (name) => { let s = name.slice(PREFIX.length); const [cat, ...rest] = s.split('/'); if (CATEGORIES.has(cat)) s = rest.join('/'); return '--' + s.toLowerCase().replace(/[\/, ]+/g, '-'); };
const tokens = ct.map((v) => ({ name: v.name.slice(PREFIX.length), css: css(v.name), codeSyntax: v.codeSyntax.WEB || null, ...uses[v.id] }));
return {
  file: 'WL Design System (rbbds)',
  scannedAt: new Date().toISOString(),
  pages: figma.root.children.length,
  nodes,
  componentTokens: ct.length,
  unbound: tokens.filter((t) => t.layers + t.aliases + t.styles === 0).map((t) => t.name),
  codeSyntaxMismatch: tokens.filter((t) => t.codeSyntax !== `var(${t.css})`).map((t) => ({ name: t.name, codeSyntax: t.codeSyntax, expected: `var(${t.css})` })),
  tokens: tokens.map((t) => [t.css, t.layers, t.aliases, t.styles]),
};
