# Changelog

## Unreleased

### New
- `@rbbds/ui/tokens.json`: all tokens in the Design Tokens (DTCG) format, with value, type, CSS name and values per brand, theme and screen size. Built with every release.
- `llms.txt` in the package: how MyUI is built and the rules for AI assistants (layers, naming, sizes, accessibility).
- Tokens `--qty-size-md` (40 px) and `--qty-size-sm` (36 px).
- Docs: guide **Building components** with the build rules for Figma: variant and base, padding on the element you click, containers and groups, indent and alignment, the 4 px grid (half steps allowed), focus and tokens.
- Tokens `--notification-empty-padding-vertical`, `--notification-empty-gap` and `--mini-cart-totals-padding-top`.

### Changed
- **Control heights follow the 4 px grid: 36 (sm), 40 (md), 48 (lg).** The border is now inside the height, in Figma and in CSS (`calc(padding - border width)`). Most controls get 2 px lower; Button lg gets 2 px higher (46 to 48).
  - Button: 36 / 40 / 48. `--button-lg-padding-vertical` is 12 px (was 10). Icon-only buttons are square: 36 / 40 / 48, with icons of 16 / 20 / 24 px.
  - Input, Select, Search input: 36 / 40 / 48. `--input-lg-padding-vertical` is 12 px (was 10).
  - Button group: 40. Quantity stepper: 40 (md, was 44) and 36 (sm).
  - Tag and Badge: 20 / 24 / 28 (were 22 / 26 / 30). Kbd: 20. Link buttons have no border, so they are as high as their text.
- Tag: the close button has a click area of 24 × 24 px (WCAG 2.5.8). It looks the same.
- Figma: borders do not count in the layout in any component. Tab is 36 px: the indicator lies over the bottom edge, like in CSS.
- Guide Building components: control heights and the border rule.
- `Kbd`: vertical padding is 2 px (was 1 px), so it fits the 4 px grid with half steps. The key is 2 px higher.
- Notification panel: the empty state uses its own tokens. It looks the same.
- Variant swatch: the focus ring uses `--focus-ring`, like all other components.
- Figma: every Focus variant uses the effect style Focus ring/brand (Focus ring/error for destructive buttons). Mobile nav item and Bottom nav item had a 2 px focus border instead; Code digit and Swatch had no ring.

## 1.0.1

### Fixed
- `package.json`: the repository URL uses the format npm expects (`git+https://…`). No change in code.
- First release through GitHub Actions and npm trusted publishing (no token), with provenance.

## 1.0.0 (12 November 2026)

First public release. It includes everything below, from 0.4.0 on.

### Breaking
- The package moves from GitHub Packages to **npmjs.com**. Remove the `@rbbds:registry` line from your `.npmrc` and install with `npm install @rbbds/ui`.
- License: the React package is now **MIT**. The Figma file has its own license.

### New
- **Getting started** in Storybook: guides for designers and developers, and the versioning policy (semver for the package and the Figma file, with the same number). Source: `docs/content/guides.mjs`, built by `npm run docs:build`.
- Figma: page **📖 How to use** with the same guides and the version of the file, and a file thumbnail.
- `publish.yml` publishes to npmjs.com with npm trusted publishing (OIDC, no token) and provenance, and checks that the tag matches `package.json`.
- README in English, with install, styles, brand and release steps.

## 0.4.0 (part of 1.0.0)

### Breaking
- **English defaults.** All built-in labels, screen reader names and messages are now English, for example `Close`, `Loading`, `Breadcrumb`, `Previous` / `Next`, `Add to cart`, `Clear search`, `Show password`. Every label is still a prop: pass your own text for another language.
- **en-US by default.** `Price`, `Rating`, `formatMoney`, `Calendar`, `DatePicker`, `DateRangePicker` and `CountrySelect` use `locale = 'en-US'`. Amounts show as `€79.95`, dates as `11/06/2026`. Pass `locale="nl-NL"` for the old output.
- **DatePicker** has a new `locale` prop. The typed date follows the order of the locale (mm/dd/yyyy for en-US, dd-mm-yyyy for nl-NL). `formatDate(date, locale)` and `parseDate(text, locale)` take the locale as a second argument, and the new `datePlaceholder(locale)` gives the matching placeholder. The default placeholder is no longer `dd-mm-jjjj`.
- Storybook: "Introductie" is now "Introduction", "Voorbeelden" is now "Examples", and the "Portaal" examples are under "Account/Examples". Links to the old story ids no longer work.
- **The old `--wl-*` names are removed**, as announced in 0.3.0. Use `--brand-*`: `--wl-color-brand-*` is `--brand-color-primary-*`, `--wl-fonts-*` is `--brand-font-*`. README and Introduction show the new names.
- **Stepper**: `orientation="horizontal"` now becomes compact below 600px (short titles above a bar) instead of vertical. Use `orientation="vertical"` if you want the old mobile layout.

### Changed (accent)
- **The accent color is bright yellow for every style** (Iris, Forest and Berry): `--brand-color-accent-*` is a yellow scale from #fefdf0 to #422006. The Accent button is accent 400 with dark text (`--color-foreground-on-accent` is now gray 900), hover is accent 500. Accent text is accent 700 in Light and 300 in Dark. Contrast: dark text on accent 400 is 11.6:1, on 500 9.3:1.
- Brand builder and the myui-brand skill use #facc15 as the default accent and check dark text on accent 400.

### New
- **Button** `hierarchy="accent"`: the brand accent color for the action that sells (Add to cart, Buy now). Tokens `--button-accent-*`, and in the theme layer `--color-surface-accent-solid`, `--color-surface-accent-solid-hover`, `--color-foreground-on-accent`, `--color-foreground-accent` and `--color-border-accent`. Hover uses accent 700 in Light and Dark, because white text on accent 500 is below 4.5:1 for Iris and Berry. ButtonIcon has no accent.
- **AddToCart** `hierarchy` prop, default `'accent'`. Product cards keep the secondary button.
- **BottomNavigation** `action` prop: a raised round button in the middle for the main action (`{ icon, label, onClick?, href? }`). Tokens `--bottom-nav-action-*`.
- 10 more base tokens for designers: `--base-color-surface-accent-solid`, `-brand-subtle`, `-warning-subtle`, `-info-subtle`, `--base-color-foreground-accent`, `-warning`, `-info`, `--base-color-border-primary`, `-brand`, `-warning`.
- Figma: Slider has Position=Start, Middle, End, and separate text properties Value, Min value and Max value.
- Figma: Bottom navigation has Show center action (off by default) and Action icon.
- Figma: every component page has an `Example / <name>` frame with instances to try the properties, so nobody needs to touch the base or the variants.
- **BottomNavigation** and **BottomNavItem**: app navigation at the bottom of the screen on phones, with icon, label, active state (`aria-current="page"`) and an optional badge dot. Figma page `🧩 Bottom navigation`, tokens `--bottom-nav-*` and `--bottom-nav-item-*`.
- **Stepper** `orientation="compact"`: number and short title above a bar per step. Figma: Orientation=Compact with `_Step compact (base)`. Tokens `--stepper-compact-bar-height`, `--stepper-compact-gap`, `--stepper-foreground-complete`.
- **Breadcrumbs** `back` prop for a back link before the trail, and `homeLabel` for the screen reader name of the home link.
- **Pagination** `pageStatus` and `pageLabel` props, so the mobile text ("Page 1 of 10") and the page names can be translated.
- **Templates** in Storybook: Dashboard, Account, Shop and Form, the same as the Templates page in Figma. They use the new layout tokens and follow the breakpoints: the Sidebar collapses below 900px and makes way for Bottom navigation below 600px, Shop filters move into a Slideout below 900px.
- **Layout tokens** `--layout-*` (Figma: `mapped/layout-tokens`), a mapped copy of the screen-size tokens for templates: template spacings, component spacings, container sizes, `--layout-screen-size-min-height` and `--layout-screen-size-min-width`.
- New tokens `--screen-size-min-height`, `--screen-size-container-size-card-min-width`, `--responsive-components-product-grid-card-min-width` and `--product-grid-card-min-width`.
- Figma: Pagination is a component set with Breakpoint=Desktop, Mobile, a Page status text and Show page 3 to 7 booleans.
- Figma: Breadcrumbs has booleans Back button, Show home, 1st to 4th level, and the items are exposed in the properties panel. Page header uses this Breadcrumbs.
- Figma: a properties pass over all component pages: 60 text properties, 199 exposed nested instances and Show booleans for repeated items (Show page N, Show row N, Show option N and so on).

### Changed
- Templates: Bottom navigation and the mobile header now show below 900px (was 600px), and the Sidebar is hidden there. Figma: `responsive-components/bottom-nav/show`, `app-header/show` and `sidebar/show` follow this at sm.
- Figma: building blocks that are only used inside another component start with `_` and are hidden in the library: Button group item, Calendar day, Calendar cell, Combobox option, Code digit, Notification item, Header nav item, Tab, Breadcrumb item, Pagination item, Step, Bottom nav item, Document item, Accordion item, File upload item. Items that go into a slot (Nav item, Menu item, Command item, Activity item, Checklist item, Table column) stay visible.
- Figma: only the base tokens show up in the variable picker. All other variables have no scope, because the components already use them.
- Figma: every page has ↳ brand = Iris and ↳ theme = Light set.
- **ProductGrid**: `minItemWidth` has no fixed default anymore. Without it the grid uses `--product-grid-card-min-width` (200px).
- Breadcrumbs use their tokens for padding, radius and icon sizes instead of fixed values.
- Figma: Header, Banner, Page header, Description list, Document list, Product card, Stepper, Step, Selection card and Active filters scale with their container (fixed root width, base fills). Active filters wrap.
- Figma: templates bind width and min height to `layout-tokens/screen-size/*` and their variants to `layout-tokens/breakpoint/*` and `responsive-components/*`, so they follow the screen-size mode.
- Token export (`scripts/figma-export-tokens.js`): `layout-tokens/*` becomes `--layout-*`, `layout-tokens/breakpoint/*` is skipped, and the compatibility block is gone.
- All stories, examples and the Introduction page are in English, with neutral example content (projects, team, plan, invoices) instead of pension terms.
- Figma: all example texts are in English, with the same neutral content and en-US notation.
- Figma: `icon-size/xs|sm|md|lg` moved from `↳ style` to `↳ screen-size`, so icon sizes can differ per breakpoint. `↳ size` now only picks the size per component (Button, Button destructive, Button icon, Featured icon) and points to `icon-size/*`. The variable modes are set only on the variants (183) instead of 956 nodes. CSS names stay the same (`--icon-size-*`).

### Earlier in this release

### New
- **myui-brand skill** (`skills/myui-brand`): an AI skill that reads a brand guide (PDF) or moodboard and turns it into MyUI brand tokens. It proposes primary color, accent color, fonts and base style, asks the user to confirm, and then builds `brand.json`, `brand-<name>.css` and `figma-brand.json`. Includes `brand.schema.json`, an example, `PROMPT.md` for tools without skills, and `scripts/build-brand.mjs` (Node, no dependencies, same color math as the Brand builder).
- The skill is part of the npm package (`node_modules/@rbbds/ui/skills/myui-brand`).
- **Brand builder**: "Import brand.json" to paste or pick a file from the skill. Fonts outside the list are added to the font choice.
- Brand builder: the Figma tip now says to overwrite the values of the matching mode, which also works on plans with few modes.

### Fixed
- Storybook "Show code" now shows the JSX of the example, for example `<ButtonIcon hierarchy="primary" … />`. Before, it often showed only `S.IconOnly`, because the thin `*.stories.tsx` files pass on stories from `*.cases.tsx`.
- The Storybook build keeps component names, so the code shows `<Logo />` instead of a short name like `<W />`.

### Documentation
- All component documentation is now in B1 English: `docs/content/*.mjs`, the Storybook Docs pages and the 77 `Docs / <name>` frames in Figma.
- Section titles in Storybook and Figma are English too (When to use, Anatomy, Accessibility, and so on).
- Figma Docs frames now use the mapped `base-tokens` instead of the theme layer.
- `docs/README.md` in English, with a short writing guide.

### New
- **VerificationCode**: a 6-digit code shows as two groups of 3 with a dash between them (`grouped`, default true for length 6). It is still one input; the groups are visual only.
- **Popover**: new prop `arrow` for an arrow that points to the middle of the trigger. New tokens `--popover-arrow-width`, `--popover-arrow-height`, `--popover-arrow-offset`, `--popover-arrow-overlap`.
- Figma: Popover is now a component set with property Arrow (None, Top, Bottom, Left, Right), built on `_Popover (base)` and `_Popover arrow`.
- Figma: the Header uses the `_Logo` instance (Size=Large, tagline off) instead of a placeholder.
- New tokens `--code-input-group-gap` and `--code-input-separator-foreground`.

### Fixed
- Popover border width uses `--popover-border-width`.
- Storybook: Stepper sat alone under "Components". It is now under Navigation. The first example step has a real title again.


### Changed
- Figma: the `↳ icon-context` collection is removed. Every icon now uses the foreground token of its own component, the same token as its label. 2,331 icon fills are rebound.
- Icon size mode xs (12px) is removed. Rule: an icon next to text is as high as the line height of that text. `[data-size="xs"]` is gone from `tokens.css`.
- Table sort icon is now 16px (`--table-sort-icon-size` follows `--icon-size-sm`) and uses tokens instead of hardcoded 12px and 4px.
- Checkbox check icon keeps 12px through `checkbox/indicator-icon-size`.

### Breaking
- **StatusIndicator**: `color="brand"` is removed, and so is `--status-indicator-brand-dot`. Use `info` for "in progress". A brand color can look like success or error (Forest is green).

## 0.3.0

### Breaking: new token architecture
- Four layers: primitives, brand, alias (theme, style, screen-size, size), mapped. Components only use mapped tokens. See `docs/TOKEN-ARCHITECTURE.md`.
- `--wl-*` is renamed to `--brand-*`: `--wl-color-brand-*` is now `--brand-color-primary-*`, `--wl-fonts-*` is `--brand-font-*`, `--wl-radius-*` is `--brand-radius-*`. The old names still work until 0.4.0.
- New accent color per brand: `--brand-color-accent-*` (Iris teal, Forest orange, Berry violet).
- New tokens: `--base-*` (page frames), `--effect-*`, `--size-icon` with `[data-size="sm|lg|xs"]`.
- Figma: every binding goes through mapped (8,817 rebinds). One `Icon` component set with all icons as variants; icon size via the `↳ size` mode.

### New
- **Sidebar**: `collapsed` and `onCollapsedChange` with a collapse button (`aria-expanded`). Collapsed shows icons, a dot for counts and a tooltip on hover and focus. Focus stays on the button after a toggle.
- **DualSidebar**: two-level sidebar with a rail of sections and a panel with the pages of one section.
- **NavItem**: compact mode inside a collapsed sidebar, new prop `countLabel`.
- Brand builder in English, with an accent color and its contrast check.

### Fixed
- Berry: Textarea, checklist item and accordion item no longer get the full (pill) radius.
- Button and Featured icon: icon size follows the component size through tokens.
- Sidebar stories are no longer cut off at the top.

### Nieuw: logo en cover
- Storybook toont het MyUI-logo (met tagline "Eyes on every detail") in de zijbalk en als favicon.
- De Introductie-pagina opent met een cover, hetzelfde ontwerp als de Cover-pagina in Figma: tagline "One system, many faces.", echte componenten en chips die de stijl wisselen. De cover volgt de Theme- en Brand-knop.
- Sectie Logo op de Introductie-pagina. Het logo (`src/docs/brand/Logo.tsx`) volgt de merkkleur en hoekafronding van de actieve stijl en zit niet in de library-export.
- Docs-pagina's zonder stories volgen nu de toolbar via `useDocsGlobals`.
- Figma: Foundations bijgewerkt met de portaalcomponenten (Light, Dark en Brand preview); Metric card rekt mee met zijn container.

### Nieuw: portaal, ronde 2
- **StatusIndicator**: stip en tekst in 6 kleuren.
- **DocumentList** en **DocumentItem**: documenten met meta, ongelezen-stip en downloadlink.
- **ActivityFeed** en **ActivityItem**: tijdlijn met icoon, avatar of stip.
- **NotificationMenu**, **NotificationButton**, **NotificationPanel**, **NotificationItem**: meldingen met aantal ongelezen.
- **Popover** (met `useDismiss`): paneel bij een knop met uitleg of een klein formulier.
- **SettingsSection** en **SettingRow**: instellingenblok; de control krijgt label en uitleg van de rij.
- **Checklist** en **ChecklistItem**: onboarding-voortgang.
- **VerificationCode**: eenmalige code als vakjes, één input met `autocomplete="one-time-code"`.
- **PasswordInput**: tonen/verbergen, optioneel sterktemeter en eisen.
- **CopyInput**: alleen-lezen waarde met kopieerknop.
- Storybook-voorbeelden: Documenten, Aanvraag volgen, Inloggen met code.
- Figma: string-variabelen `breakpoint/<component>` in screen-size-(alias) om Breakpoint-varianten mee te laten wisselen; het export-script slaat ze over.

### Nieuw: dashboards en portalen
- **MetricCard**: KPI-tegel met label, waarde, trend (up, down, neutral) en context. Raster met `rb-metric-grid`.
- **PageHeader**: broodkruimel, h1, beschrijving, acties en optioneel tabs.
- **DescriptionList** en **DescriptionItem**: gegevens als label en waarde (`<dl>`), voor "Mijn gegevens".
- **Banner**: paginabrede melding in 6 kleuren, met actie en sluitknop.
- **TableToolbar**, **TableBulkActions**, **TableSkeletonRows**, **TableEmptyRow**. **TableCard** krijgt `actions`, `toolbar` en `headingLevel`; `<tr aria-selected>` krijgt de selectiekleur.
- **DateRangePicker**: snelkeuzes, twee maanden, Annuleren en Toepassen; op mobiel één maand.
- **Calendar**: nieuwe props `rangeStart`, `rangeEnd`, `onDayHover`, `month`, `onMonthChange`, `hidePrevious`, `hideNext`.
- Storybook: voorbeeldpagina's Portaal / Voorbeelden (Dashboard en Mijn gegevens).
- Figma: Table opnieuw opgebouwd met Table column (kolommen via een slot, rijen via Rows), Table toolbar en Table bulk actions als losse componenten, Accordion-groep met 10 items, Calendar day met range-states.

### Nieuw: e-commerce
- **Kern**: `ProductCard` (vertical, horizontal, sold out), `ProductGrid`, `Price` (met van-prijs en `formatMoney`), `Rating` (alleen lezen, halve sterren), `QuantityStepper`, `StockIndicator`.
- **Productpagina**: `ProductGallery` (pijlen, teller, miniaturen met roving tabindex), `VariantPicker` (kleur en maat, niet-beschikbaar blijft zichtbaar), `AddToCart`.
- **Winkelwagen en checkout**: `CartItem` (bewerkbaar of read-only), `CartSummary`, `PromoCode`, `CartButton`, `MiniCart` (in Slideout), `AddressFields` (NL-postcode, autocomplete).
- **Overzicht**: `FilterGroup` (met `headingLevel`), `ActiveFilters`, `RangeSlider` (twee bolletjes).
- **SelectionCard**: nieuwe prop `aside` voor prijs of logo rechts (checkout-opties).
- Storybook-categorie E-commerce met voorbeeldpagina's: productoverzicht, productpagina, winkelwagen en checkout.
- Figma: alle componenten op een eigen pagina onder ---- E-commerce ----, met Docs-frames.

### Opgelost
- QuantityStepper: rekte op tot de volle breedte in een flex-kolom (zoals de Storybook-voorbeelden). Hij is nu altijd zo breed als de inhoud, zoals in Figma.
- Brand builder: de Brand-knop in de Storybook-toolbar staat op die pagina vast. Eerder wisselde alleen de vorm en bleven de kleuren van de builder staan.

### Documentatie
- `docs/PROJECT.md`: projectoverzicht met architectuur, conventies en open punten.
- README: componentenlijst en rebranding (stijlen en Brand builder) bijgewerkt.

### Tokens
- 90 nieuwe component-tokens voor ronde 2: `--status-indicator-*`, `--document-list-*`, `--activity-*`, `--notification-*`, `--popover-*`, `--settings-*`, `--checklist-*`, `--code-input-*`, `--password-strength-*`, `--copy-input-*`.
- 69 nieuwe component-tokens voor dashboards en portalen: `--metric-card-*`, `--page-header-*`, `--description-list-*`, `--banner-*`, `--table-surface-selected`, `--table-toolbar-*`, `--table-bulk-*`, `--calendar-day-*-range`, `--date-range-*`, `--accordion-item-gap`.
- 74 nieuwe component-tokens: `--product-card-*`, `--product-grid-*`, `--price-*`, `--rating-*`, `--qty-*`, `--stock-*`, `--gallery-*`, `--variant-*`, `--cart-item-*`, `--cart-summary-*`, `--cart-button-*`, `--filter-*`.

## 0.2.0 (november 2026)

### Nieuw
- **SearchInput**: zoekveld met wisknop en sneltoets-hint.
- **DatePicker** en **Calendar**: datumveld (dd-mm-jjjj) met kalender, volledig met toetsenbord te bedienen. Werkt zoals MUI DateCalendar: view switch (maand jaar ▾) naar jaar- en maandoverzicht, pijlen rechts, dagen buiten de maand standaard leeg, vandaag als ring. Props `views`, `openTo`, `disablePast`, `disableFuture`, `shouldDisableDate`, `showDaysOutsideCurrentMonth`, `fixedWeekNumber`, `yearsPerRow`, `yearsOrder`.
- **Combobox**: select met zoeken en een visual per optie (vlag, avatar, icoon), APG combobox-patroon.
- **Flag** en **CountrySelect** in nieuwe entry `@rbbds/ui/flags`: ruim 250 vlaggen (country-flag-icons, MIT) en landkeuze met Nederlandse namen via Intl. Alleen geladen als je de entry importeert.
- **SelectionCard** en **SelectionCardGroup**: grote radio- of checkbox-opties met titel en toelichting.
- **Stepper**: voortgang in stappen, horizontaal of verticaal.
- **Header** (met mobiel menu), **Sidebar** en **SidebarUser**.
- **Slideout**: zijpaneel op native `<dialog>`.
- **CommandMenu** en `useCommandShortcut`: ⌘K-zoeken over pagina’s en acties.
- **Skeleton** en **Kbd**.
- **Input**: nieuwe props `prefix` en `suffix`.
- **Slider**: handle wordt groter tijdens vasthouden.
- Componentdocumentatie voor alle componenten in Storybook (Documentatie) en Figma (Docs-frames).

### Tokens
- 104 nieuwe component-tokens (o.a. `--search-*`, `--kbd-*`, `--skeleton-*`, `--selection-card-*`, `--stepper-*`, `--header-*`, `--sidebar-*`, `--slideout-*`, `--calendar-*`, `--command-*`, `--slider-handle-size*`, `--input-addon-foreground`, `--calendar-cell-*`, `--calendar-day-border-*`, `--combobox-*`, `--flag-*`). Verwijderd t.o.v. eerdere preview van deze branch: `--calendar-day-surface-today` en `--calendar-day-foreground-today` (vandaag is nu een ring).

### Brands
- Alles wat een merk mag aanpassen staat nu in brand/wl (Figma) en `--wl-*` (CSS): kleuren, fonts, en nieuw `--wl-radius-*`, `--wl-border-width-*`, `--wl-font-weight-*`. De theme-laag verwijst ernaar.
- Stijlen (brand-modes): Iris (standaard, licht afgerond), Forest (hoekig) en Berry (rond), in Figma als mode en in CSS als `:root[data-brand="…"]`. Storybook heeft een Brand-knop in de toolbar.
- Brand builder in Storybook: kies een stijl, merkkleur (schaal 25 t/m 950 wordt berekend in OKLCH, met contrastcheck), lettertypen en logo; download brand-<naam>.css en kopieer de waarden voor Figma.

### Opgelost
- Figma: icoonkleuren in Button-varianten (o.a. Pagination, File upload) waren wit op wit in Light na een icon-swap. De mode staat nu op de base-instance van elke variant.
- Figma: focus ring van Calendar day was onzichtbaar (geen vulling).

## 0.1.0
- Eerste release: tokens, 37 componenten en Storybook.
