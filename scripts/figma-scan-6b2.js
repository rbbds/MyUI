/**
 * PR 6b-2 scan (read-only). Changes nothing in the file.
 *
 * Run in "WL Design System (rbbds)" as a plugin snippet: Figma MCP use_figma,
 * or the Scripter plugin in Figma desktop. The result is printed as JSON
 * (Scripter: print, otherwise console and the return value).
 *
 * Reads:
 * 1. Pages per category ("⤵️ Category ⤵️" header pages).
 * 2. Component token groups (component-tokens/<group>/...) and how many are already nested.
 * 3. The duplicate tokens from the PR 6 decision list: where each one is bound (page > component > layer > field).
 * 4. The pages of the 18a choices: a compact tree with sizes, gaps, padding, radius and bound tokens.
 */
async function scan() {
  // Without this, bindings on hidden layers inside instances are missed.
  figma.skipInvisibleInstanceChildren = false;
  const PREFIX = 'component-tokens/';
  const DUPES = ['header/header-border-width', 'slideout/slideout-border-width', 'selection-card/selection-card-border-width', 'selection-card/selection-card-border-width-2', 'step-horizontal/indicator-border-width', 'step-vertical/indicator-border-width', 'stepper/indicator-border-width', 'command/kbd-border-width', 'command/shortcut-border-width', 'search/shortcut-border-width', 'notification/border-width-2', 'date-picker/calendar-border-width', 'mini-cart/totals-border-width', 'mini-cart/totals-padding-top', 'code-input/label-foreground', 'code-input/hint-foreground', 'code-input/error-message-foreground', 'file-upload/text-gap', 'file-upload/progress-gap', 'file-upload/track-radius', 'file-upload/indicator-radius', 'file-upload/percent-foreground', 'file-upload/icon-surface', 'alert/foreground-action', 'select/leading-icon-size', 'input/help-icon-size'];
  const DETAIL_PAGES = ['Filter group', 'Variant picker', 'Password input', 'Avatar', 'Mini cart', 'Date picker'];

  const cols = await figma.variables.getLocalVariableCollectionsAsync();
  const vars = await figma.variables.getLocalVariablesAsync();
  const byId = Object.fromEntries(vars.map(v => [v.id, v]));
  const short = id => { const v = byId[id]; return v ? v.name.replace(PREFIX, 'ct/') : 'ext:' + id; };

  // 1. Pages
  let cat = null; const pages = [];
  for (const p of figma.root.children) {
    const m = p.name.match(/^⤵️\s*(.+?)\s*⤵️$/);
    if (m) { cat = m[1]; continue; }
    pages.push({ page: p, cat });
  }

  // 2. Groups
  const ct = vars.filter(v => v.name.startsWith(PREFIX));
  const groups = {};
  for (const v of ct) { const g = v.name.split('/')[1]; groups[g] = (groups[g] || 0) + 1; }

  // 3. Duplicate token bindings
  const nameToId = Object.fromEntries(ct.map(v => [v.name.slice(PREFIX.length), v.id]));
  const dupeIds = new Set(DUPES.map(n => nameToId[n]).filter(Boolean));
  const dupes = Object.fromEntries(DUPES.map(n => [n, nameToId[n] ? { value: null, bound: [] } : 'MISSING']));
  for (const n of DUPES) {
    const v = byId[nameToId[n]]; if (!v) continue;
    const c = cols.find(x => x.id === v.variableCollectionId);
    const val = v.valuesByMode[c.modes[0].modeId];
    dupes[n].value = val && val.type === 'VARIABLE_ALIAS' ? '-> ' + short(val.id) : val;
  }
  const ids = b => (Array.isArray(b) ? b : [b]).flatMap(x => (x && x.id ? [x.id] : []));
  const owner = n => { let x = n; while (x && x.type !== 'COMPONENT' && x.type !== 'COMPONENT_SET' && x.type !== 'PAGE') x = x.parent; if (x && x.type === 'COMPONENT' && x.parent && x.parent.type === 'COMPONENT_SET') x = x.parent; return x ? x.name : '?'; };

  // 4. Detail trees
  const details = {};
  const num = x => (typeof x === 'number' ? Math.round(x * 100) / 100 : x);
  const tree = (n, depth, out, indent) => {
    if (depth < 0 || out.length > 400) return;
    const bv = n.boundVariables || {};
    const b = Object.entries(bv).map(([k, v]) => k + '=' + ids(v).map(short).join('|')).join(' ');
    let s = `${indent}${n.type} "${n.name}" ${num(n.width)}x${num(n.height)}`;
    if ('layoutMode' in n && n.layoutMode !== 'NONE') s += ` ${n.layoutMode[0]} gap=${num(n.itemSpacing)} pad=${[n.paddingTop, n.paddingRight, n.paddingBottom, n.paddingLeft].map(num).join(',')}`;
    if ('cornerRadius' in n && n.cornerRadius) s += ` r=${typeof n.cornerRadius === 'number' ? num(n.cornerRadius) : 'mixed'}`;
    if ('strokes' in n && n.strokes.length) s += ` stroke=${typeof n.strokeWeight === 'number' ? num(n.strokeWeight) : 'mixed'}/${n.strokeAlign}`;
    if (n.type === 'TEXT') s += ` "${n.characters.slice(0, 30)}"`;
    if (n.type === 'INSTANCE' && n.mainComponent) s += ` <${n.mainComponent.parent && n.mainComponent.parent.type === 'COMPONENT_SET' ? n.mainComponent.parent.name : n.mainComponent.name}>`;
    if (b) s += ` {${b}}`;
    out.push(s);
    if ('children' in n && n.type !== 'INSTANCE') for (const c of n.children) tree(c, depth - 1, out, indent + '  ');
  };

  for (const { page, cat: pc } of pages) {
    await page.loadAsync();
    for (const n of page.findAll(() => true)) {
      const bv = n.boundVariables; if (!bv) continue;
      for (const [field, b] of Object.entries(bv)) for (const id of ids(b)) if (dupeIds.has(id)) {
        dupes[short(id).slice(3)].bound.push(`${page.name} > ${owner(n)} > ${n.name} [${field}]`);
      }
      if ('fills' in n && Array.isArray(n.fills)) for (const f of n.fills) if (f.boundVariables && f.boundVariables.color && dupeIds.has(f.boundVariables.color.id)) dupes[short(f.boundVariables.color.id).slice(3)].bound.push(`${page.name} > ${owner(n)} > ${n.name} [fill]`);
      if ('strokes' in n && Array.isArray(n.strokes)) for (const f of n.strokes) if (f.boundVariables && f.boundVariables.color && dupeIds.has(f.boundVariables.color.id)) dupes[short(f.boundVariables.color.id).slice(3)].bound.push(`${page.name} > ${owner(n)} > ${n.name} [stroke]`);
    }
    if (DETAIL_PAGES.includes(page.name)) {
      const out = [];
      for (const c of page.children.filter(x => x.type === 'COMPONENT_SET' || x.type === 'COMPONENT' || (x.type === 'SECTION' && x.name === 'Base components'))) {
        if (c.type === 'COMPONENT_SET') { out.push(`SET "${c.name}" variants=${c.children.length}`); tree(c.children[0], 6, out, '  '); }
        else tree(c, 6, out, '');
      }
      details[page.name] = out;
    }
  }

  // Bindings are reported per layer; collapse duplicates (variants) to counts.
  for (const n of DUPES) if (dupes[n] !== 'MISSING') {
    const cnt = {}; for (const s of dupes[n].bound) cnt[s] = (cnt[s] || 0) + 1;
    dupes[n].bound = Object.entries(cnt).map(([s, k]) => (k > 1 ? `${s} x${k}` : s));
  }

  return {
    collections: cols.map(c => `${c.name} (${c.variableIds.length}) modes=${c.modes.map(m => m.name).join(',')}`),
    pagesPerCategory: pages.reduce((a, { page, cat: c }) => { (a[c || '(none)'] = a[c || '(none)'] || []).push(page.name); return a; }, {}),
    componentTokenGroups: groups,
    componentTokensDeeperThan2: ct.filter(v => v.name.split('/').length > 3).map(v => v.name).slice(0, 40),
    dupes,
    details,
  };
}

const result = await scan();
const json = JSON.stringify(result, null, 1);
if (typeof print === 'function') print(json); else console.log(json);
return result;
