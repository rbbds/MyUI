// Small CSS reader for the token scripts. Returns every declaration with its selector, at-rule,
// line and the exact position of the value in the file (valueStart, valueEnd), so a script can
// replace a value without touching anything else.
import { readFileSync } from 'node:fs';

export function parseCss(file) {
  const raw = readFileSync(file, 'utf8');
  // Blank out comments but keep the length, so positions stay right.
  const src = raw.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));
  const out = [];
  const stack = [];
  let buf = '';
  let bufStart = 0;
  const lineAt = (i) => src.slice(0, i).split('\n').length;
  const flush = (text, start) => {
    let offset = start;
    for (const d of text.split(';')) {
      const at = offset;
      offset += d.length + 1;
      const i = d.indexOf(':');
      if (i < 0 || !d.trim()) continue;
      const property = d.slice(0, i).trim();
      const rawValue = d.slice(i + 1);
      const lead = rawValue.length - rawValue.trimStart().length;
      const value = rawValue.trim();
      const valueStart = at + i + 1 + lead;
      const selector = [...stack].reverse().find((s) => !s.startsWith('@')) ?? '';
      const atRule = stack.filter((s) => s.startsWith('@')).join(' ');
      out.push({ file, line: lineAt(at + (d.length - d.trimStart().length)), selector, atRule, property, value, valueStart, valueEnd: valueStart + value.length });
    }
  };
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === '{') {
      const cut = buf.lastIndexOf(';');
      if (cut >= 0) flush(buf.slice(0, cut), bufStart);
      stack.push(buf.slice(cut + 1).trim().replace(/\s+/g, ' '));
      buf = '';
      bufStart = i + 1;
    } else if (c === '}') {
      flush(buf, bufStart);
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
