import { useEffect, useState } from 'react';
import { addons } from 'storybook/preview-api';

type Globals = { theme?: string; brand?: string };

function initialGlobals(): Globals {
  // MDX pages without stories do not run decorators, so read the globals from the preview store.
  const store = (window as unknown as { __STORYBOOK_PREVIEW__?: { storyStore?: { userGlobals?: { get?: () => Globals } } } }).__STORYBOOK_PREVIEW__?.storyStore;
  return store?.userGlobals?.get?.() ?? {};
}

/** Applies the Theme and Brand toolbar to a docs-only page, like the decorator in preview.tsx does for stories. */
export function useDocsGlobals() {
  const [globals, setGlobals] = useState<Globals>(initialGlobals);
  useEffect(() => {
    const channel = addons.getChannel();
    const update = ({ globals: g }: { globals: Globals }) => setGlobals(g);
    channel.on('globalsUpdated', update);
    channel.on('setGlobals', update);
    return () => { channel.off('globalsUpdated', update); channel.off('setGlobals', update); };
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', globals.theme ?? 'light');
    const brand = globals.brand ?? 'iris';
    if (brand === 'iris') root.removeAttribute('data-brand');
    else root.setAttribute('data-brand', brand);
  }, [globals.theme, globals.brand]);
  return globals;
}
