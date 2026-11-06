# Componentdocumentatie

Eén bron voor de documentatie in Figma én Storybook.

- **Bron:** `docs/content/*.mjs` (één object per component, Nederlands).
- **Storybook:** `npm run docs:build` genereert `src/docs/data/*.json` en `src/docs/components/*.mdx` (sidebar: Documentatie).
- **Figma:** `npm run docs:figma` genereert per Figma-pagina een script in `docs/figma-payload/` (niet in git). Dat script bouwt de frames `Docs / <naam>` rechts naast de componenten in de WL-file en vervangt bestaande frames met dezelfde naam.

Pas tekst dus altijd aan in `docs/content`, en draai daarna beide scripts.
