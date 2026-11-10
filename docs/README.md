# Component documentation

One source for the documentation in Figma and Storybook.

- **Source:** `docs/content/*.mjs` (one object per component, in B1 English).
- **Storybook:** `npm run docs:build` creates `src/docs/data/*.json` and `src/docs/components/*.mdx` (sidebar: per category and component, with Docs at the top).
- **Figma:** `npm run docs:figma` creates scripts in `docs/figma-payload/` (not in git). Each script builds the frames `Docs / <name>` to the right of the components in the WL file, and replaces frames with the same name.

So always change text in `docs/content`, then run both scripts.

## Writing style

- B1 English: short sentences, common words, active voice.
- Default labels that come from code (like `'Sluiten'`) stay as they are in the code. Quote them, do not translate them.

## Structure

- **Figma:** each component has its own page under a heading `---- Category ----`. On the page: the Base components section on the left, the sets in the middle, the Docs frame on the right. The page ids are in `docs/figma-pages.mjs`.
- **Storybook:** `Category / Component / Docs` plus the stories. Files with stories for several components are called `*.cases.tsx`. Each component has a thin `*.stories.tsx` that passes on the right stories.
- **Docs to Figma:** `node scripts/docs/build-figma-payload.mjs <id>` builds the script for only that component.
