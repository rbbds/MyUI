# @rbbds/ui

White label React component library and design tokens. Built from the Figma file **MyUI Design System**, with Storybook for documentation.

- React 18+ components, TypeScript types, no runtime CSS-in-JS
- Design tokens as CSS custom properties, Light and Dark mode, responsive type and spacing
- Icons: [Lucide](https://lucide.dev) (`lucide-react`)
- Storybook 10 with Theme (Light, Dark) and Brand (Iris, Forest, Berry) toolbar toggles and the a11y addon

**Storybook:** https://my-ui-two.vercel.app (start at Getting started) · **Changes:** [CHANGELOG.md](CHANGELOG.md) · **npm:** [@rbbds/ui](https://www.npmjs.com/package/@rbbds/ui)

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
- **Your own brand:** make the CSS with the Brand builder in Storybook, or let your AI tool do it with the **myui-brand skill** (`skills/myui-brand`, also in the npm package). Only change `--brand-*` tokens: colors, fonts, radius, border width and font weight. Optional, only when your brand has them: the exact accent button color, a heading color, a gray tint and your own status colors.

```css
:root {
  --brand-color-primary-600: #0284c7;
  --brand-color-accent-400: #facc15;
  --brand-font-body: "Manrope", system-ui, sans-serif;

  /* Optional. The Brand builder writes all 12 steps of every scale. */
  --brand-color-accent-solid-surface: #2f7d5b;   /* exact accent button color */
  --brand-color-accent-solid-foreground: #ffffff;
  --brand-color-heading: #36254b;                /* titles in Light */
  --brand-color-neutral-900: #1c1722;            /* your own grays */
  --brand-color-error-600: #c8322f;              /* your own status color */
}
```

Full guides for designers and developers, and the versioning policy, are in Storybook under **Getting started**: https://my-ui-two.vercel.app

### Routing

Wrap your app in `LinkProvider` so every MyUI link (NavItem, Header, Mega menu, Breadcrumbs, Card and more) uses your router and does not reload the page. Without it, MyUI renders a plain `<a href>`. The build has `'use client'`, so this works in the Next.js App Router.

```tsx
import { LinkProvider } from '@rbbds/ui';

// Next.js
import NextLink from 'next/link';
<LinkProvider component={NextLink}>{children}</LinkProvider>

// React Router: map href to to
import { Link as RouterLink } from 'react-router';
<LinkProvider component={({ href, ...props }) => <RouterLink to={href} {...props} />}>{children}</LinkProvider>
```

### Language

All built-in texts are English, and dates, numbers and amounts use `en-US`. Wrap your app in `LocaleProvider` to change that for every component at once. A `locale` or `labels` prop on a component still wins.

Dutch is included: `nlNL` has every built-in text and sets the formats (€ 1.234,56, 27-11-2026). For another language pass a tag such as `locale="de-DE"` and your own `labels`.

```tsx
import { LocaleProvider } from '@rbbds/ui';
import { nlNL } from '@rbbds/ui/locales/nl-NL';

<LocaleProvider locale={nlNL} labels={{ cartSummary: { total: 'Totaal excl. btw' } }}>
  {children}
</LocaleProvider>
```

### Not in MyUI yet

Charts, a carousel for product rows, a postcode API for street and city, and payment logos. Ask before you build one of these yourself, so it can become part of MyUI.

### Questions and bugs

Open an issue in [rbbds/MyUI](https://github.com/rbbds/MyUI/issues). What changed per version is in [CHANGELOG.md](CHANGELOG.md).

More context (architecture, conventions, open points): [docs/PROJECT.md](docs/PROJECT.md).

## Token architecture

Same four layers as in Figma:

| Layer | Figma collection | CSS prefix | Example |
|---|---|---|---|
| Primitives + brand | `color`, `brand`, `spacing`, `border`, `typography` | `--gray-*`, `--brand-*`, `--spacings-*`, `--radius-*`, `--font-*` | `--brand-color-primary-600` |
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
| Form inputs | `Input`, `Select`, `Textarea`, `Slider`, `RangeSlider`, `SearchInput`, `DatePicker`, `DateRangePicker`, `Calendar`, `Combobox`, `Field`, `PasswordInput`, `CopyInput`, `VerificationCode` |
| Selection | `Checkbox`, `Radio`, `RadioGroup`, `Toggle`, `SelectionCard`, `SelectionCardGroup` |
| Display | `Badge`, `Tag`, `Avatar`, `AvatarGroup`, `Divider`, `FeaturedIcon`, `Spinner`, `Skeleton`, `Kbd`, `ProgressBar`, `Tooltip`, `StatusIndicator` |
| Feedback and overlays | `Alert`, `Banner`, `Toast`, `ToastRegion`, `Modal`, `Slideout`, `Popover`, `DropdownMenu`, `CommandMenu` |
| Navigation | `Header`, `MegaMenu`, `MobileNav`, `Sidebar`, `DualSidebar`, `SidebarUser`, `Tabs`, `Breadcrumbs`, `Pagination`, `NavItem`, `Stepper`, `BottomNavigation`, `LinkProvider` |
| Content | `Card`, `Accordion`, `EmptyState`, `FileUpload`, `FileUploadItem`, `TableCard`, `Table`, `TableHeader`, `PersonCell`, `TableToolbar`, `TableBulkActions` |
| Dashboards and portals | `PageHeader`, `MetricCard`, `DescriptionList`, `DocumentList`, `ActivityFeed`, `NotificationButton`, `NotificationPanel`, `SettingsSection`, `Checklist` |
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
