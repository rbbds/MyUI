// Runs inside Figma (use_figma). Placeholders replaced by build-figma-payload.mjs:
// __PAGE_ID__, __DOCS__ (array of doc objects for this page)
const PAGE_ID = '__PAGE_ID__';
const DOCS = __DOCS__;
const W = 640;

const page = await figma.getNodeByIdAsync(PAGE_ID);
await figma.setCurrentPageAsync(page);

const fonts = await figma.listAvailableFontsAsync();
const has = (f, s) => fonts.some((x) => x.fontName.family === f && x.fontName.style === s);
const MONO = has('Roboto Mono', 'Regular') ? { family: 'Roboto Mono', style: 'Regular' } : { family: 'Inter', style: 'Regular' };
const F = {
  reg: { family: 'Inter', style: 'Regular' },
  med: { family: 'Inter', style: 'Medium' },
  semi: { family: 'Inter', style: 'Semi Bold' },
  bold: { family: 'Inter', style: 'Bold' },
  mono: MONO,
};
for (const f of Object.values(F)) await figma.loadFontAsync(f);

const theme = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => /theme/i.test(c.name));
const V = {};
for (const id of theme.variableIds) {
  const v = await figma.variables.getVariableByIdAsync(id);
  V[v.name] = v;
}
const pick = (...names) => names.map((n) => V[n]).find(Boolean);
const C = {
  text: pick('color/foreground/primary', 'color/text/primary'),
  text2: pick('color/foreground/secondary', 'color/text/secondary'),
  text3: pick('color/foreground/tertiary', 'color/foreground/secondary'),
  brand: pick('color/foreground/brand', 'color/foreground/brand-primary', 'color/border/brand'),
  surface: pick('color/surface/primary'),
  surface2: pick('color/surface/secondary'),
  border: pick('color/border/secondary', 'color/border/primary'),
  okBorder: pick('color/border/success'),
  okSurface: pick('color/surface/success-subtle'),
  errBorder: pick('color/border/error'),
  errSurface: pick('color/surface/error-subtle'),
  ok: pick('color/foreground/success'),
  err: pick('color/foreground/error'),
};
const paint = (v, fallback = { r: 0.2, g: 0.2, b: 0.2 }) => {
  const p = { type: 'SOLID', color: fallback };
  return v ? figma.variables.setBoundVariableForPaint(p, 'color', v) : p;
};

function text(parent, chars, { font = F.reg, size = 15, color = C.text2, lh = 150, width = 'FILL' } = {}) {
  const t = figma.createText();
  t.fontName = font;
  t.characters = String(chars);
  t.fontSize = size;
  t.lineHeight = { unit: 'PERCENT', value: lh };
  t.fills = [paint(color)];
  parent.appendChild(t);
  t.textAutoResize = 'HEIGHT';
  if (width === 'FILL') t.layoutSizingHorizontal = 'FILL';
  return t;
}
function col(parent, gap = 8, name = 'Group') {
  const f = figma.createAutoLayout('VERTICAL', { name, itemSpacing: gap });
  f.fills = [];
  parent.appendChild(f);
  f.layoutSizingHorizontal = 'FILL';
  return f;
}
function list(parent, items, numbered = false) {
  const g = col(parent, 6, numbered ? 'Numbered list' : 'List');
  items.forEach((it, i) => {
    const row = figma.createAutoLayout('HORIZONTAL', { name: 'Item', itemSpacing: 8 });
    row.fills = [];
    g.appendChild(row);
    row.layoutSizingHorizontal = 'FILL';
    const b = text(row, numbered ? `${i + 1}.` : '•', { width: 'HUG', color: C.text3 });
    b.textAutoResize = 'WIDTH_AND_HEIGHT';
    text(row, it);
  });
  return g;
}
function section(parent, title) {
  const s = col(parent, 12, title);
  const d = figma.createRectangle();
  d.name = 'Divider';
  d.resize(W - 96, 1);
  d.fills = [paint(C.border, { r: 0.9, g: 0.9, b: 0.9 })];
  s.appendChild(d);
  d.layoutSizingHorizontal = 'FILL';
  const h = text(s, title, { font: F.semi, size: 22, color: C.text, lh: 130 });
  return s;
}
function table(parent, head, rows, monoCols = [0]) {
  const t = col(parent, 0, 'Table');
  t.strokes = [paint(C.border, { r: 0.9, g: 0.9, b: 0.9 })];
  t.strokeWeight = 1;
  t.cornerRadius = 8;
  t.clipsContent = true;
  const widths = head.length === 3 ? [0.34, 0.3, 0.36] : [0.5, 0.5];
  [head, ...rows].forEach((r, ri) => {
    const row = figma.createAutoLayout('HORIZONTAL', { name: ri ? 'Row' : 'Header', itemSpacing: 12 });
    row.paddingLeft = row.paddingRight = 12;
    row.paddingTop = row.paddingBottom = 8;
    row.fills = ri ? [] : [paint(C.surface2, { r: 0.97, g: 0.97, b: 0.98 })];
    if (ri) {
      row.strokes = [paint(C.border, { r: 0.9, g: 0.9, b: 0.9 })];
      row.strokeTopWeight = 1; row.strokeBottomWeight = 0; row.strokeLeftWeight = 0; row.strokeRightWeight = 0;
    }
    t.appendChild(row);
    row.layoutSizingHorizontal = 'FILL';
    r.forEach((cell, ci) => {
      const isMono = ri > 0 && monoCols.includes(ci);
      const c = text(row, cell || '–', {
        font: ri === 0 ? F.semi : isMono ? F.mono : F.reg,
        size: ri === 0 ? 13 : isMono ? 13 : 14,
        color: ri === 0 ? C.text : isMono ? C.text : C.text2,
        width: 'HUG',
      });
      c.textAutoResize = 'HEIGHT';
      c.resize(Math.floor((W - 96 - 24 - 12 * (r.length - 1)) * widths[ci]), c.height);
    });
  });
  return t;
}
function doDont(parent, dos, donts) {
  const row = figma.createAutoLayout('HORIZONTAL', { name: "Do's & Don'ts", itemSpacing: 16 });
  row.fills = [];
  parent.appendChild(row);
  row.layoutSizingHorizontal = 'FILL';
  const card = (title, items, b, s, fg) => {
    const c = figma.createAutoLayout('VERTICAL', { name: title, itemSpacing: 8 });
    c.paddingLeft = c.paddingRight = c.paddingTop = c.paddingBottom = 16;
    c.cornerRadius = 8;
    c.fills = [paint(s, { r: 0.95, g: 0.99, b: 0.95 })];
    c.strokes = [paint(b, { r: 0.5, g: 0.8, b: 0.5 })];
    c.strokeWeight = 1;
    c.strokeTopWeight = 4; c.strokeBottomWeight = 0; c.strokeLeftWeight = 0; c.strokeRightWeight = 0;
    row.appendChild(c);
    c.layoutSizingHorizontal = 'FILL';
    c.layoutSizingVertical = 'FILL';
    text(c, title, { font: F.semi, size: 15, color: fg });
    list(c, items.length ? items : ['–']);
  };
  card('Do', dos, C.okBorder, C.okSurface, C.ok);
  card("Don't", donts, C.errBorder, C.errSurface, C.err);
}

// Placement: right of the existing component content, ignoring older docs/archive.
const isDoc = (n) => n.name.startsWith('Docs / ') || n.name.startsWith('Archief');
const content = page.children.filter((n) => !isDoc(n));
let startX = Math.max(...content.map((n) => n.x + n.width)) + 200;
const existing = page.children.filter((n) => n.name.startsWith('Docs / '));

const created = [];
for (const d of DOCS) {
  const name = `Docs / ${d.name}`;
  const prev = existing.find((n) => n.name === name);
  const keepX = prev ? prev.x : null;
  existing.filter((n) => n.name === name).forEach((n) => n.remove());
  const f = figma.createAutoLayout('VERTICAL', { name, itemSpacing: 32 });
  f.paddingLeft = f.paddingRight = 48;
  f.paddingTop = f.paddingBottom = 48;
  f.cornerRadius = 16;
  f.fills = [paint(C.surface, { r: 1, g: 1, b: 1 })];
  f.strokes = [paint(C.border, { r: 0.9, g: 0.9, b: 0.9 })];
  f.strokeWeight = 1;
  page.appendChild(f);
  f.resize(W, 100);
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'FIXED';

  const head = col(f, 12, 'Header');
  text(head, d.page.toUpperCase(), { font: F.semi, size: 12, color: C.brand || C.text3 });
  text(head, d.name, { font: F.bold, size: 40, color: C.text, lh: 120 });
  text(head, d.summary, { size: 18, color: C.text2 });
  const meta = [`Figma: ${d.figma.base ? 'base ' + d.figma.base : 'geen base (structureel verschillende varianten)'}`, `React: <${d.react}>`, `Storybook: Documentatie / ${d.page} / ${d.name}`];
  text(head, meta.join('   ·   '), { font: F.mono, size: 12, color: C.text3 });

  const s1 = section(f, 'Wanneer gebruiken');
  list(s1, d.use);
  text(s1, 'Niet gebruiken voor', { font: F.semi, size: 15, color: C.text });
  list(s1, d.avoid);

  list(section(f, 'Anatomie'), d.anatomy, true);
  table(section(f, 'Figma-properties'), ['Property', 'Waarden', 'Toelichting'], d.figmaProps, [0]);
  table(section(f, 'React-props'), ['Prop', 'Type', 'Toelichting'], d.reactProps, [0, 1]);
  list(section(f, 'Gedrag en states'), d.behaviour);
  list(section(f, 'Toegankelijkheid'), d.a11y);
  if (d.content.length) list(section(f, 'Tekst en content'), d.content);
  doDont(section(f, "Do's en don'ts"), d.do, d.dont);
  const tk = section(f, 'Tokens');
  d.tokens.forEach((t) => text(tk, t, { font: F.mono, size: 13, color: C.text }));
  if (d.related.length) text(section(f, 'Gerelateerd'), d.related.join(', '));
  if (d.open.length) list(section(f, 'Open punten'), d.open);

  if (keepX !== null) { f.x = keepX; } else { f.x = startX; startX += W + 80; }
  f.y = 0;
  created.push({ id: f.id, name, h: Math.round(f.height) });
}
return { page: page.name, created };
