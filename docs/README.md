# Componentdocumentatie

Eén bron voor de documentatie in Figma én Storybook.

- **Bron:** `docs/content/*.mjs` (één object per component, Nederlands).
- **Storybook:** `npm run docs:build` genereert `src/docs/data/*.json` en `src/docs/components/*.mdx` (sidebar: per categorie en component, met Docs bovenaan).
- **Figma:** `npm run docs:figma` genereert per Figma-pagina een script in `docs/figma-payload/` (niet in git). Dat script bouwt de frames `Docs / <naam>` rechts naast de componenten in de WL-file en vervangt bestaande frames met dezelfde naam.

Pas tekst dus altijd aan in `docs/content`, en draai daarna beide scripts.

## Structuur

- **Figma:** elke component heeft een eigen pagina onder een kopje `---- Categorie ----`. Op de pagina: links de sectie Base components, in het midden de sets, rechts het Docs-frame. De pagina-id's staan in `docs/figma-pages.mjs`.
- **Storybook:** `Categorie / Component / Docs` plus de stories. Bestanden met stories van meerdere componenten heten `*.cases.tsx`; per component is er een dun `*.stories.tsx` dat de juiste stories doorgeeft.
- **Docs naar Figma:** `node scripts/docs/build-figma-payload.mjs <id>` maakt per component een script in `docs/figma-payload/<id>.js`.
