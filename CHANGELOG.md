# Changelog

## Unreleased

### Nieuw: e-commerce
- **Kern**: `ProductCard` (vertical, horizontal, sold out), `ProductGrid`, `Price` (met van-prijs en `formatMoney`), `Rating` (alleen lezen, halve sterren), `QuantityStepper`, `StockIndicator`.
- **Productpagina**: `ProductGallery` (pijlen, teller, miniaturen met roving tabindex), `VariantPicker` (kleur en maat, niet-beschikbaar blijft zichtbaar), `AddToCart`.
- **Winkelwagen en checkout**: `CartItem` (bewerkbaar of read-only), `CartSummary`, `PromoCode`, `CartButton`, `MiniCart` (in Slideout), `AddressFields` (NL-postcode, autocomplete).
- **Overzicht**: `FilterGroup` (met `headingLevel`), `ActiveFilters`, `RangeSlider` (twee bolletjes).
- **SelectionCard**: nieuwe prop `aside` voor prijs of logo rechts (checkout-opties).
- Storybook-categorie E-commerce met voorbeeldpagina's: productoverzicht, productpagina, winkelwagen en checkout.
- Figma: alle componenten op een eigen pagina onder ---- E-commerce ----, met Docs-frames.

### Tokens
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
