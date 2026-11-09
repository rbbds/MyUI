# Changelog

## Unreleased

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
