import { Fragment, type ReactNode } from 'react';

/** Shape of a generated file in src/docs/data (source: docs/content/*.mjs). */
export interface DocData {
  name: string;
  page: string;
  react: string;
  figma: { node: string; base: string | null };
  summary: string;
  use: string[];
  avoid: string[];
  anatomy: string[];
  figmaProps: string[][];
  reactProps: string[][];
  behaviour: string[];
  a11y: string[];
  content: string[];
  do: string[];
  dont: string[];
  tokens: string[];
  related: string[];
  open: string[];
}

const FIGMA_FILE = 'https://www.figma.com/design/gV7OuQywH2cOUVfQagW6nC/WL-Design-System--rbbds-';

/** Renders <tags>, `code` and --token-names as inline code. */
function rich(text: string): ReactNode {
  const parts = text.split(/(<[^>]+>|`[^`]+`|--[a-z0-9{}|*[\]-]+)/g);
  return parts.map((p, i) => {
    if (!p) return null;
    if (/^(<[^>]+>|--)/.test(p)) return <code key={i}>{p}</code>;
    if (p.startsWith('`')) return <code key={i}>{p.slice(1, -1)}</code>;
    return <Fragment key={i}>{p}</Fragment>;
  });
}

const List = ({ items, ordered }: { items: string[]; ordered?: boolean }) => {
  const Tag = ordered ? 'ol' : 'ul';
  return <Tag>{items.map((t, i) => <li key={i}>{rich(t)}</li>)}</Tag>;
};

const Table = ({ head, rows, codeCols = [0] }: { head: string[]; rows: string[][]; codeCols?: number[] }) => (
  <table>
    <thead>
      <tr>{head.map((h) => <th key={h} style={{ textAlign: 'left' }}>{h}</th>)}</tr>
    </thead>
    <tbody>
      {rows.map((r, i) => (
        <tr key={i}>
          {r.map((c, j) => (
            <td key={j}>{c ? (codeCols.includes(j) ? <code>{c}</code> : rich(c)) : '–'}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

const box = (border: string, bg: string) => ({
  borderTop: `4px solid ${border}`,
  background: bg,
  borderRadius: 8,
  padding: '12px 16px',
});

export function DocHeader({ doc }: { doc: DocData }) {
  const node = doc.figma.node.replace(':', '-');
  return (
    <>
      <h1>{doc.name}</h1>
      <p style={{ fontSize: 18 }}>{doc.summary}</p>
      <p style={{ fontSize: 13, opacity: 0.8 }}>
        React: <code>{`<${doc.react}>`}</code> · Figma:{' '}
        <a href={`${FIGMA_FILE}?node-id=${node}`} target="_blank" rel="noreferrer">
          {doc.page} / {doc.name}
        </a>
        {doc.figma.base ? <> (base <code>{doc.figma.base}</code>)</> : null}
      </p>
    </>
  );
}

export function ComponentDoc({ doc }: { doc: DocData }) {
  return (
    <>
      <h2>Wanneer gebruiken</h2>
      <List items={doc.use} />
      <h3>Niet gebruiken voor</h3>
      <List items={doc.avoid} />

      <h2>Anatomie</h2>
      <List items={doc.anatomy} ordered />

      <h2>Props</h2>
      <h3>React</h3>
      <Table head={['Prop', 'Type', 'Toelichting']} rows={doc.reactProps} codeCols={[0, 1]} />
      <h3>Figma</h3>
      <Table head={['Property', 'Waarden', 'Toelichting']} rows={doc.figmaProps} />

      <h2>Gedrag en states</h2>
      <List items={doc.behaviour} />

      <h2>Toegankelijkheid</h2>
      <List items={doc.a11y} />

      {doc.content.length > 0 && (
        <>
          <h2>Tekst en content</h2>
          <List items={doc.content} />
        </>
      )}

      <h2>Do&apos;s en don&apos;ts</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        <div style={box('var(--color-border-success)', 'var(--color-surface-success-subtle)')}>
          <strong>Do</strong>
          <List items={doc.do.length ? doc.do : ['–']} />
        </div>
        <div style={box('var(--color-border-error)', 'var(--color-surface-error-subtle)')}>
          <strong>Don&apos;t</strong>
          <List items={doc.dont.length ? doc.dont : ['–']} />
        </div>
      </div>

      <h2>Tokens</h2>
      <ul>{doc.tokens.map((t) => <li key={t}>{t.startsWith('--') ? <code>{t}</code> : rich(t)}</li>)}</ul>

      {doc.related.length > 0 && (
        <>
          <h2>Gerelateerd</h2>
          <p>{doc.related.join(', ')}</p>
        </>
      )}

      {doc.open.length > 0 && (
        <>
          <h2>Open punten</h2>
          <List items={doc.open} />
        </>
      )}
    </>
  );
}
