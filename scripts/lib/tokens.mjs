// Shared reader for the token files. Used by build-tokens-json.mjs and lint-tokens.mjs,
// so both see the same tokens, layers and modes.
// - tokens.css: generated from Figma variables (scripts/figma-export-tokens.js).
// - effects.css: effect styles from Figma (--shadow-*, --focus-ring*).
import { readFileSync } from 'node:fs';

export const TOKEN_FILES = ['src/styles/tokens.css', 'src/styles/effects.css'];

const modeOf = (sel, media) => {
  if (media) return 'viewport:max-' + media.match(/max-width:\s*(\d+)px/)[1];
  const s = sel.replace(/\s+/g, '');
  if (/data-brand="(\w+)"/.test(s) && !s.includes(',')) return 'brand:' + s.match(/data-brand="(\w+)"/)[1];
  if (s.includes('data-theme="light"')) return 'default';
  if (s.includes('data-theme="dark"')) return 'theme:dark';
  if (/^\[data-size="(\w+)"\]$/.test(s)) return 'size:' + s.match(/data-size="(\w+)"/)[1];
  return 'default';
};

// Returns { values: name -> { mode: value }, declarations: [{ name, value, mode, file, line }] }.
// Names are without the leading "--". The last declaration wins, like in CSS.
export function readTokens(files = TOKEN_FILES) {
  const values = {};
  const declarations = [];
  const re = /(@media[^{]+)\{\s*:root\{([^}]*)\}\s*\}|([^{}@]+)\{([^}]*)\}/g;
  for (const file of files) {
    // Blank out comments but keep newlines, so line numbers stay right.
    const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));
    for (const m of css.matchAll(re)) {
      const mode = m[1] ? modeOf('', m[1]) : modeOf(m[3].trim());
      const body = m[1] ? m[2] : m[4];
      let offset = m.index + m[0].indexOf(body);
      for (const d of body.split(';')) {
        const start = offset;
        offset += d.length + 1;
        const i = d.indexOf(':');
        const name = d.slice(0, i).trim();
        if (!name.startsWith('--')) continue;
        const key = name.slice(2);
        const value = d.slice(i + 1).trim();
        const line = css.slice(0, start + d.indexOf('--')).split('\n').length;
        declarations.push({ name: key, value, mode, file, line });
        (values[key] ??= {})[mode] = value;
      }
    }
  }
  return { values, declarations };
}

// Layer per token: primitive, brand, semantic or component.
const SEMANTIC = /^(color|spacing|border|font|size|shadow|focus|effect|effects|layout|base|typography|responsive|icon|screen|opacity|motion|z)-/;
export function layerOf(key, modes) {
  if (key.startsWith('brand-')) return 'brand';
  const def = modes.default ?? Object.values(modes)[0];
  if (!def.includes('var(')) return 'primitive';
  if (SEMANTIC.test(key)) return 'semantic';
  return 'component';
}

export const refsIn = (value) => [...value.matchAll(/var\(\s*--([\w-]+)/g)].map((m) => m[1]);
