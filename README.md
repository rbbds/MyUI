# @rbbds/ui

White label React component library and design tokens. Built from the Figma file **WL Design System (rbbds)**, with Storybook for documentation.

- React 18+ components, TypeScript types, no runtime CSS-in-JS
- Design tokens as CSS custom properties, Light and Dark mode, responsive type and spacing
- Icons: [Lucide](https://lucide.dev) (`lucide-react`)
- Storybook 10 with a Light/Dark toolbar toggle and the a11y addon

## Using it in a project

The package is published to **GitHub Packages** (private, free). Consumers need a token to install it.

1. Create a GitHub personal access token (classic) with the `read:packages` scope.
2. Add an `.npmrc` to the project (do not commit the token itself, use an env var):

   ```
   @rbbds:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```

3. Install:

   ```bash
   npm install @rbbds/ui
   ```

4. Import the styles once (e.g. in `main.tsx`) and use the components:

   ```tsx
   import '@rbbds/ui/styles.css';
   import { Button, Input } from '@rbbds/ui';
   import { Plus } from 'lucide-react';

   export function Example() {
     return (
       <form>
         <Input label="E-mailadres" type="email" autoComplete="email" />
         <Button iconLeading={<Plus aria-hidden />}>Nieuw project</Button>
       </form>
     );
   }
   ```

   Load the Inter font yourself (e.g. `@fontsource-variable/inter`), or set `--wl-fonts-body` to another font.

On Vercel or in CI, add `GITHUB_TOKEN` (with `read:packages`) as an environment variable so the install works.

### Dark mode

Set `data-theme="dark"` on `<html>` (or on any element for a dark section). Without it, Light is used.

### Rebranding per project

1. Kies een stijl. Die bepaalt de vorm (hoeken, randen, letterdikte):
   - **Iris** (standaard, licht afgerond): geen attribuut nodig.
   - **Forest** (hoekig): `<html data-brand="forest">`.
   - **Berry** (rond): `<html data-brand="berry">`.
2. Zet je eigen kleuren en fonts. Gebruik de **Brand builder** in Storybook: die berekent de kleurschaal, checkt contrast en geeft de CSS.

```css
:root {
  --wl-color-brand-500: #0ea5e9;
  --wl-color-brand-600: #0284c7;
  --wl-color-brand-700: #0369a1;
  --wl-fonts-body: "Manrope", system-ui, sans-serif;
}
```

Alles wat een merk mag aanpassen begint met `--wl-`: kleuren, fonts, radius, randdikte en letterdikte. Spacing en maten blijven gelijk.

Meer context (architectuur, conventies, open punten): [docs/PROJECT.md](docs/PROJECT.md).

## Token architecture

Same four layers as in Figma:

| Layer | Figma collection | CSS prefix | Example |
|---|---|---|---|
| Primitives | `brand/wl`, `spacing`, `border`, `typography` | `--wl-*`, `--spacings-*`, `--radius-*`, `--font-*` | `--wl-color-brand-600` |
| Theme alias (Light/Dark) | `theme-(alias)` | `--color-*`, `--spacing-*`, `--border-*` | `--color-surface-primary` |
| Screen size alias | `screen-size-(alias)` | `--typography-*`, `--responsive-*` | `--typography-titles-h1` |
| Mapped (component) | `mapped` | `--{component}-*`, `--text-*` | `--button-primary-surface-default` |

The CSS names match the **WEB code syntax** on each Figma variable, so Dev Mode shows the same name as the code.

### Updating tokens from Figma

1. Change variables in Figma.
2. Run `scripts/figma-export-tokens.js` in the Figma file (as a plugin snippet, e.g. via Claude with the Figma connector).
3. Replace `src/styles/tokens.css` with the output and open a pull request.

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
```

## Releasing a new version

1. Bump `version` in `package.json` and merge to `main`.
2. Create a GitHub Release with tag `vX.Y.Z`.
3. The **Publish package** workflow publishes it to GitHub Packages.

## Storybook on Vercel

Import the repo in Vercel (Hobby plan). `vercel.json` already sets the build command (`npm run build-storybook`) and output directory (`storybook-static`). Every push to `main` deploys; every pull request gets a preview URL.
