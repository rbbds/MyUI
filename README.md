# @rbbds/ui

White label React component library and design tokens. Built from the Figma file **WL Design System (rbbds)**, with Storybook for documentation.

- React 18+ components, TypeScript types, no runtime CSS-in-JS
- Design tokens as CSS custom properties, Light and Dark mode, responsive type and spacing
- Icons: [Lucide](https://lucide.dev) (`lucide-react`)
- Storybook 10 with a Light/Dark toolbar toggle and the a11y addon

## Getting started

```bash
npm install @rbbds/ui lucide-react
```

```tsx
import '@rbbds/ui/styles.css';
import { Button, Input } from '@rbbds/ui';
import { Plus } from 'lucide-react';

export function NewProject() {
  return (
    <form>
      <Input label="Project name" required />
      <Button type="submit" iconLeading={<Plus aria-hidden />}>Create project</Button>
    </form>
  );
}
```

Load the fonts yourself (for example `@fontsource-variable/inter`), or set `--brand-font-body` and `--brand-font-title` to your own fonts.

- **Style:** `data-brand="forest"` or `data-brand="berry"` on `<html>`. Iris needs no attribute.
- **Theme:** `data-theme="dark"` on `<html>`, or on any element for a dark section.
- **Your own brand:** make the CSS with the Brand builder in Storybook, or let your AI tool do it with the **myui-brand skill** (`skills/myui-brand`, also in the npm package). Only change `--brand-*` tokens: colors, fonts, radius, border width and font weight.

```css
:root {
  --brand-color-primary-600: #0284c7;
  --brand-color-accent-400: #facc15;
  --brand-font-body: "Manrope", system-ui, sans-serif;
}
```

Full guides for designers and developers, and the versioning policy, are in Storybook under **Getting started**: https://my-ui-two.vercel.app

More context (architecture, conventions, open points): [docs/PROJECT.md](docs/PROJECT.md).

## Token architecture

Same four layers as in Figma:

| Layer | Figma collection | CSS prefix | Example |
|---|---|---|---|
| Primitives + brand | `brand`, `spacing`, `border`, `typography` | `--brand-*`, `--spacings-*`, `--radius-*`, `--font-*` | `--brand-color-primary-600` |
| Theme alias (Light/Dark) | `theme-(alias)` | `--color-*`, `--spacing-*`, `--border-*` | `--color-surface-primary` |
| Screen size alias | `screen-size-(alias)` | `--typography-*`, `--responsive-*` | `--typography-titles-h1` |
| Mapped (component) | `mapped` | `--{component}-*`, `--text-*` | `--button-primary-surface-default` |

The CSS names match the **WEB code syntax** on each Figma variable, so Dev Mode shows the same name as the code.

`@rbbds/ui/tokens.css` has all variables plus the effect styles: `--shadow-*`, `--focus-ring`, `--focus-ring-error` and `--focus-ring-inset` (from `src/styles/effects.css`).

The build also writes `dist/tokens.json` (import `@rbbds/ui/tokens.json`): every token in the Design Tokens (DTCG) format with its value, type, CSS name and its values per brand, theme and screen size. In that file the layers are named `primitive`, `brand`, `semantic` (theme and screen size alias) and `component` (mapped). `llms.txt` in the package explains the layers, the naming and the rules for AI assistants.

### Updating tokens from Figma

1. Change variables in Figma.
2. Run `scripts/figma-export-tokens.js` in the Figma file (as a plugin snippet, e.g. via Claude with the Figma connector).
3. Replace `src/styles/tokens.css` with the output and open a pull request.
4. Check the token-lint report in the CI job summary (or run `npm run lint:tokens`).

## Components

| Group | Components |
|---|---|
| Buttons | `Button`, `ButtonIcon`, `ButtonGroup` |
| Form inputs | `Input`, `Select`, `Textarea`, `Slider`, `RangeSlider`, `SearchInput`, `DatePicker`, `Calendar`, `Combobox`, `Field` |
| Selection | `Checkbox`, `Radio`, `RadioGroup`, `Toggle`, `SelectionCard`, `SelectionCardGroup` |
| Display | `Badge`, `Tag`, `Avatar`, `AvatarGroup`, `Divider`, `FeaturedIcon`, `Spinner`, `Skeleton`, `Kbd`, `ProgressBar`, `Tooltip` |
| Feedback and overlays | `Alert`, `Toast`, `ToastRegion`, `Modal`, `Slideout`, `DropdownMenu`, `CommandMenu` |
| Navigation | `Header`, `Sidebar`, `SidebarUser`, `Tabs`, `Breadcrumbs`, `Pagination`, `NavItem`, `Stepper` |
| Content | `Card`, `Accordion`, `EmptyState`, `FileUpload`, `FileUploadItem`, `TableCard`, `Table`, `TableHeader`, `PersonCell` |
| E-commerce | `ProductCard`, `ProductGrid`, `Price`, `Rating`, `QuantityStepper`, `StockIndicator`, `ProductGallery`, `VariantPicker`, `AddToCart`, `CartItem`, `CartSummary`, `PromoCode`, `CartButton`, `MiniCart`, `AddressFields`, `FilterGroup`, `ActiveFilters` |
| Flags (`@rbbds/ui/flags`) | `Flag`, `CountrySelect` |

## Development

```bash
npm install
npm run dev              # Storybook on http://localhost:6006
npm run build            # library to dist/ (index.js, styles.css, tokens.css, types)
npm run build-storybook  # static Storybook to storybook-static/
npm run lint:tokens      # token-lint report to reports/ (px, layers, unused and duplicate tokens)
npm run check:contrast   # 3:1 for control borders and the active option, every style and theme
npm run check:strings    # no fixed user-facing text in component JSX
npm run test:browser     # Playwright, Chromium and WebKit
```

## Releasing a new version

MyUI follows semantic versioning (see Getting started / Versioning in Storybook).

1. Update `CHANGELOG.md` and bump `version` in `package.json`. Merge to `main`.
2. Create a GitHub Release with tag `vX.Y.Z` (the same number). The workflow `publish.yml` checks the tag and publishes to npmjs.com through npm trusted publishing, with provenance. No token is needed.
3. Give the Figma file the same version number on the How to use page and publish the library.

Trusted publishing is set up once on npmjs.com (package settings > Trusted publisher: GitHub Actions, `rbbds/MyUI`, `publish.yml`). Version 1.0.0 was published by hand, because npm can only add a trusted publisher to a package that exists.

## License

The React package is MIT licensed, see [LICENSE](LICENSE). The Figma file is sold separately under its own license.
