// Finds fixed user-facing text in component JSX. Every text a user sees or hears must come from a prop
// (a `labels` prop with English defaults, or a single prop such as `closeLabel`), so a Dutch site can
// translate it. Defaults live outside JSX (a DEFAULT_LABELS object or a default parameter value).
//   node scripts/check-literal-strings.mjs   fails (exit 1) when it finds text
// What counts as text:
//   - JSX text with a letter: <span>Sold out</span>
//   - text attributes: aria-label, aria-valuetext, aria-roledescription, title, placeholder, alt
//   - string and template literals inside {…} in JSX children or in those attributes:
//     {inStock ? 'In stock' : 'Sold out'}, aria-label={`Remove ${name}`}
//   - text built outside JSX and shown later: const summary = 'Choose an end date'
// Allowed places for English defaults: a default parameter value (closeLabel = 'Close') and an object
// whose name ends in LABELS (const DEFAULT_LABELS = { cancel: 'Cancel' }).
// A literal counts when it has a letter and a space or a capital (so 'sm', 'rb-x' and 'button' do not).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';

const DIRS = ['src/components', 'src/flags'];
const SKIP = /\.(stories|cases)\.tsx$/;
// Attributes and props that hold text: native ones and the text props of MyUI components.
const TEXT_ATTR_NAMES = new Set(['aria-label', 'aria-valuetext', 'aria-roledescription', 'title', 'placeholder', 'alt', 'label', 'name', 'hint', 'description', 'text', 'summary', 'error']);
const TEXT_ATTRS = { has: (n) => TEXT_ATTR_NAMES.has(n) || /Label$/.test(n) };
// Text that is the same in every language. Keep this list short.
const ALLOW = new Set(['·', '–', '—', '×', '/', '…', '+', '-', '%', ':', ',']);

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : p.endsWith('.tsx') && !SKIP.test(p) ? [p] : []; });
// Inside a text context (a text attribute, or a part of a template that is text) every word counts: 'item'.
const hasLetter = (s) => /\p{L}/u.test(s) && !ALLOW.has(s.trim()) && !/^rb-/.test(s.trim());
const isText = (s) => {
  const t = s.replace(/\s+/g, ' ').trim();
  if (!t || ALLOW.has(t) || !/\p{L}/u.test(t)) return false;
  if (/^rb-/.test(t)) return false;
  return /\s/.test(t) || /^\p{Lu}/u.test(t);
};

const findings = [];
for (const file of DIRS.flatMap(walk)) {
  const src = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const report = (node, text) => {
    const { line } = src.getLineAndCharacterOfPosition(node.getStart());
    findings.push(`${relative('.', file)}:${line + 1}  ${JSON.stringify(text.replace(/\s+/g, ' ').trim())}`);
  };
  // Literals inside an expression. Nested JSX is visited by the main walk; className-like calls are skipped.
  const literals = (node, strict = false) => {
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node) || ts.isJsxFragment(node)) return;
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'cx') return;
    // Arguments of a call are options or keys, not text on their own: toLocaleDateString(l, { weekday: 'long' }), view('month').
    if (ts.isCallExpression(node)) { ts.forEachChild(node, (c) => literals(c, false)); return; }
    if (ts.isElementAccessExpression(node)) { literals(node.expression, strict); return; }
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) { if (strict ? hasLetter(node.text) : isText(node.text)) report(node, node.text); return; }
    if (ts.isTemplateExpression(node)) {
      const parts = [node.head.text, ...node.templateSpans.map((s) => s.literal.text)].join(' ');
      if (strict ? hasLetter(parts) : isText(parts)) report(node, node.getText());
      node.templateSpans.forEach((s) => literals(s.expression, true));
      return;
    }
    // Object keys and comparisons are code, not text: { type: 'Item' }, x === 'Done'.
    if (ts.isPropertyAssignment(node)) { literals(node.initializer, strict); return; }
    if (ts.isBinaryExpression(node) && [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken].includes(node.operatorToken.kind)) return;
    ts.forEachChild(node, (c) => literals(c, strict));
  };
  const visit = (node) => {
    if (ts.isJsxText(node) && isText(node.text)) report(node, node.text);
    if (ts.isJsxAttribute(node)) {
      const name = node.name.getText();
      const init = node.initializer;
      if (TEXT_ATTRS.has(name) && init) {
        if (ts.isStringLiteral(init)) { if (hasLetter(init.text)) report(init, init.text); }
        else if (ts.isJsxExpression(init) && init.expression) literals(init.expression, true);
      }
      if (init && ts.isJsxExpression(init) && init.expression) ts.forEachChild(init.expression, visit);
      return;
    }
    if (ts.isJsxExpression(node) && node.expression && (ts.isJsxElement(node.parent) || ts.isJsxFragment(node.parent))) literals(node.expression, true);
    ts.forEachChild(node, visit);
  };
  visit(src);

  // Second pass: text outside JSX (built in a variable or helper and shown later).
  const seen = new Set(findings);
  const CODE_CALLS = /^(cx|matchMedia|querySelector|querySelectorAll|closest|getPropertyValue|setProperty|addEventListener|removeEventListener|setAttribute|getAttribute|removeAttribute|createElement|toLocaleDateString|toLocaleString|DateTimeFormat|NumberFormat|escape|replace|split|join|startsWith|endsWith|includes|test|match|padStart|scrollIntoView|Error|focus)$/;
  const allowedPlace = (node) => {
    for (let p = node.parent; p; p = p.parent) {
      if (ts.isImportDeclaration(p) || ts.isExportDeclaration(p) || ts.isLiteralTypeNode(p) || ts.isCaseClause(p)) return true;
      if ((ts.isParameter(p) || ts.isBindingElement(p)) && p.initializer && (p.initializer === node || p.initializer.pos <= node.pos && node.end <= p.initializer.end)) return true;
      if (ts.isVariableDeclaration(p) && /labels?$/i.test(p.name.getText())) return true;
      if (ts.isJsxAttribute(p)) return !TEXT_ATTRS.has(p.name.getText());
      if (ts.isJsxElement(p) || ts.isJsxSelfClosingElement(p)) return true; // handled by the first pass
      if (ts.isBinaryExpression(p) && [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.SyntaxKind.InKeyword].includes(p.operatorToken.kind)) return true;
      if (ts.isElementAccessExpression(p) && p.argumentExpression === node) return true;
      if (ts.isCallExpression(p)) { const callee = p.expression.getText().split('.').pop(); if (CODE_CALLS.test(callee)) return true; }
      if (ts.isNewExpression(p) && CODE_CALLS.test(p.expression.getText().split('.').pop())) return true;
      if (ts.isExpressionStatement(p) && ts.isStringLiteral(p.expression)) return true; // 'use client'
    }
    return false;
  };
  const loose = (node) => {
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && isText(node.text) && !allowedPlace(node)) report(node, node.text);
    else if (ts.isTemplateExpression(node) && !allowedPlace(node)) {
      const parts = [node.head.text, ...node.templateSpans.map((s) => s.literal.text)].join(' ');
      if (isText(parts)) report(node, node.getText());
      // Words inside a template are text too: `${n} ${n === 1 ? 'day' : 'days'}`.
      const strictIn = (n) => { if ((ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) && hasLetter(n.text) && !allowedPlace(n)) report(n, n.text); else if (!ts.isTemplateExpression(n)) ts.forEachChild(n, strictIn); };
      node.templateSpans.forEach((sp) => strictIn(sp.expression));
    }
    ts.forEachChild(node, loose);
  };
  loose(src);
  // A literal found by both passes is reported once.
  const uniq = [...new Set(findings)];
  findings.length = 0;
  findings.push(...uniq);
  void seen;
}

if (findings.length) {
  console.error(`Fixed text in JSX (${findings.length}). Make it a prop, for example in a labels prop with an English default:\n  ${findings.join('\n  ')}`);
  process.exit(1);
}
console.log('No fixed text in component JSX.');
