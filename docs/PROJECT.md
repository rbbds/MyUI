# MyUI (@rbbds/ui): projectoverzicht

Stand: 21 november 2026. Werk dit bestand bij in elke PR die architectuur, conventies of open punten verandert. Een kopie staat in het Claude Project "MyUI · white label design system".

Eigen white-label design system van Robert Trimp: een Figma-library plus een React-library met Storybook, om te hergebruiken in eigen projecten en voor klanten. Los van PGGM.

---

## Deel 1: Inrichting nieuw Claude Project

### 1. Project aanmaken

- **Naam:** MyUI · white label design system
- **Omschrijving (plakken):**

> Eigen white label design system van Robert: Figma-library "MyUI Design System" plus React-library @rbbds/ui met Storybook (repo rbbds/MyUI). Doel: één herbruikbare basis voor eigen projecten en klanten. Per project kies je een stijl (Iris, Forest of Berry) en pas je kleuren, fonts en logo aan. Los van PGGM.

### 2. Projectinstructies (plakken)

```
Je bent mijn sparringpartner en bouwer voor MyUI, mijn eigen white label design system. Dit project staat los van PGGM: gebruik geen PGGM-bestanden, -merken of -afspraken, en schrijf nooit naar PGGM Figma-bestanden.

Bronnen
- Figma: MyUI Design System, file key gV7OuQywH2cOUVfQagW6nC. Alleen in dit bestand werken.
- Repo: github.com/rbbds/MyUI (koppel hem aan de sessie). npm: @rbbds/ui.
- Storybook live: https://my-ui-two.vercel.app (build van main via Vercel).
- MyUI-projectoverdracht.md in dit project: architectuur, conventies en open punten. Lees die eerst.

Werkwijze
- Volgorde: eerst Figma (componenten met alle states en tokens), ik review, dan React en Storybook. Wijk alleen af als ik dat zeg.
- Token-first: geen hardcoded kleuren, radius of spacing; alles via tokens.
- Toegankelijkheid is standaard: toetsenbord, focus, schermlezernamen, contrast. Test met axe in Light en Dark en kijk naar Iris, Forest en Berry.
- Documentatie: tekst alleen in docs/content/*.mjs, daarna npm run docs:build (Storybook) en de Figma-payload (Docs-frames).
- Alles moet gratis blijven: geen betaalde plannen of diensten.

Git
- Nooit direct op main. Na een merge altijd een nieuwe branch vanaf main en eerst checken of de vorige PR nog open staat.
- Commits met auteur "Robert Trimp <robert.trimp@gmail.com>". PR's via gh api (REST).
- Werk CHANGELOG.md bij bij elke wijziging.
- Releases: Claude maakt de release-PR (versie, kop in CHANGELOG.md, `figmaChangelog` in docs/content/guides.mjs). Robert mergt. Daarna maakt Claude de GitHub Release (tag `vX.Y.Z` op main), en alleen als package.json op main die versie heeft en CI op main groen is. Mergen blijft bij Robert.

Antwoorden
- Nederlands, geen em dashes, kort en scanbaar, concreet.
- Sluit af met [Betrouwbaarheid: hoog/middel/laag] en een korte noot wat zeker en wat onzeker is.
```

### 3. Bestanden in het project zetten

| Bestand | Waarom |
| --- | --- |
| `MyUI-projectoverdracht.md` (kopie van `docs/PROJECT.md`) | Alle context in één document. |
| `CHANGELOG.md` uit de repo | Wat er per versie veranderd is. |
| `README.md` en `docs/README.md` uit de repo | Installatie en documentatie-workflow. |

Niet nodig: code en tokens. Die staan in de repo en in Figma, en een kopie raakt snel verouderd.

### 4. Koppelingen

- **GitHub:** de repo rbbds/MyUI per sessie koppelen (Claude vraagt dat zelf aan via de repo-koppeling).
- **Figma:** dezelfde Figma-connector als nu; file key staat in de instructies.
- **Vercel:** geen koppeling nodig, deploys gaan automatisch via GitHub.

### 5. Geheugen

- In het PGGM-project staat een notitie over MyUI. Die blijft daar staan, maar gaat niet vanzelf mee naar het nieuwe project.
- Of het nieuwe project je algemene geheugen ziet, hangt af van de geheugeninstelling op de projectpagina in claude.ai. Kies "gescheiden" als je MyUI en PGGM strikt uit elkaar wilt houden.
- Wil je de MyUI-notitie uit het PGGM-project weg? Zeg het in dat project, dan verwijder ik hem.

---

## Deel 2: Projectinformatie

### Links en sleutels

| Wat | Waar |
| --- | --- |
| Figma-bestand | MyUI Design System, `gV7OuQywH2cOUVfQagW6nC`. Staat in een aparte map in het PGGM Figma-account (geen extra betaalde seat). |
| Repo | https://github.com/rbbds/MyUI (GitHub-gebruiker `rbbds`) |
| npm-pakket | `@rbbds/ui`, MIT. Versie in package.json en CHANGELOG.md (semver, zie Getting started / Versioning in Storybook). Een GitHub Release met tag `vX.Y.Z` start `publish.yml`, dat via npm trusted publishing (OIDC, geen token) publiceert |
| Storybook live | https://my-ui-two.vercel.app (main) |
| Storybook previews | Per branch via Vercel, link staat in de PR |

### Uitgangspunten (besluiten)

- Untitled UI is de referentie voor welke componenten erin horen.
- Zelfde 4 tokenlagen als bij PGGM, maar met eigen inhoud.
- Iconen: Lucide (outlined). Componentmaten: sm, md, lg.
- Figma-componenten op de PGGM-manier: een base component (`_Button (base)`) waarvan de varianten instances zijn, zodat je alleen de base aanpast. Altijd native Figma slots voor inhoud (`createSlot`, property van het type slot), nooit een zelfgemaakte placeholder met instance swap. Clip content staat uit op elk slot. Kijk eerst hoe een bestaand component het doet (Card: slot `Content` met `Show content`, gap via een token, standaard leeg).
- Gebruik per klant: `npm install @rbbds/ui`, stijl kiezen, kleuren, fonts en logo aanpassen in code. Geen apart merk per klant in Figma nodig.
- Alles gratis.
- Templates per stijl (Iris, Forest, Berry) zijn uitgesteld. Robert komt erop terug.

### Stack

- Vite, React 18+, TypeScript, CSS-variabelen (geen CSS-in-JS).
- Storybook 10 (`@storybook/react-vite`), addons docs en a11y.
- Afhankelijkheden: `lucide-react`, `country-flag-icons` (alleen in entry `@rbbds/ui/flags`).
- Fonts in Storybook: Inter (variable), Source Serif 4 (400, 600, 700).
- Package-exports: `.`, `./flags`, `./styles.css`, `./tokens.css`, `./tokens.json`.

### Repostructuur

```
src/
  components/
    Button/      Button, ButtonGroup, CloseButton (intern)
    Form/        Input, Select, Textarea, Slider, RangeSlider, SearchInput, DatePicker, Combobox, Field
    Selection/   Checkbox, Radio, Toggle, SelectionCard
    Display/     Badge, Tag, Avatar, Divider, Featured icon, Spinner, Skeleton, Kbd, Table
    Content/     Card, Accordion, Empty state, File upload
    Navigation/  Header, Mega menu, Mobile nav, Sidebar, Nav item, Tabs, Breadcrumbs, Pagination, Stepper, AppShell
    Overlay/     Alert, Toast, Tooltip, Progress, Dropdown menu, Modal, Slideout, Command menu
    Commerce/    e-commerce (zie hieronder)
  flags/         Flag, CountrySelect
  utils/         panel.ts (Escape, focus-out, top layer, positie), dialog.ts (Modal, Slideout, Command menu), link.tsx (LinkProvider), labels.ts, useControlled.ts, cx.ts
  templates/     voorbeeldpagina's (Dashboard, Shop, enz.)
  docs/          Introduction.mdx, brand/ (Brand builder), components/*.mdx, data/*.json
  styles/        tokens.css (gegenereerd uit Figma), effects.css (schaduwen, focus ring), index.css
docs/
  content/*.mjs       bron van alle componentdocumentatie
  figma-pages.mjs     doc-naam naar Figma-pagina-id
scripts/
  figma-export-tokens.js       Figma-variabelen naar tokens.css
  lib/tokens.mjs               leest tokens.css en effects.css (voor tokens.json en de lint)
  build-tokens-json.mjs        dist/tokens.json
  lint-tokens.mjs              token-lint (npm run lint:tokens), regels in token-lint.config.mjs
  check-contrast.mjs           contrast control-randen en actieve optie (npm run check:contrast)
  check-literal-strings.mjs    geen vaste tekst in component-JSX (npm run check:strings)
  check-a11y-stories.mjs       axe op alle stories × thema × merk (npm run check:a11y)
  strip-dts-css.mjs            haalt CSS-imports uit dist/types (onderdeel van npm run build)
  suggest-component-tokens.mjs veilige koppelingen losse waarde → component token (--apply schrijft ze)
  lib/css.mjs                  CSS-parser met posities (lint en suggesties)
  docs/build-mdx.mjs           docs naar Storybook (npm run docs:build)
  docs/build-figma-payload.mjs docs naar Figma-script (npm run docs:figma)
  docs/figma-builder.js        bouwt de Docs-frames in Figma
```

### Token architecture

Full plan and rules: `docs/TOKEN-ARCHITECTURE.md`.

| Layer | Figma collection | CSS |
| --- | --- | --- |
| 1. Primitives | `∙ color`, `∙ spacing`, `∙ border`, `∙ typography`, ... (no modes) | `:root` |
| 2. Brand | `↳ brand`, modes Iris, Forest, Berry | `--brand-*`; Forest and Berry on `:root[data-brand="forest"\|"berry"]` |
| 3. Alias | `↳ theme` (Light, Dark: colors), `↳ style` (spacing, radius, border, font, icon size), `↳ screen-size`, `↳ size` (md, sm, lg) | theme on `[data-theme]`, size on `[data-size]` |
| 4. Mapped | `↳ mapped`: `component-tokens/<category>/*` (export skips the category), `typography-tokens/*`, `base-tokens/*`, `effect-tokens/*` | `--x-y`, `--text-*`, `--base-*`, `--effect-*` |

**Rules**
- Components and frames only use mapped tokens. Never alias or primitives.
- Mapped points to an alias. Exception: fixed sizes point to `∙ sizing` and fixed stroke widths to `∙ border` (see rule 2 in `docs/TOKEN-ARCHITECTURE.md`). Alias points to brand or primitives. Brand points to primitives.
- Designers only edit the brand layer: primary and accent color, fonts, font weights, radius, border width.
- Spacing is the same for all brands.
- Mapped and `↳ size` are published, the rest is hidden. Only base tokens (`base-tokens/*`: colors, border width, spacing, radius) have scopes, so designers see a short set in the picker. Component tokens have no scopes.

**What a brand can change (all in `↳ brand`):**
- `brand/color/primary/*` and `brand/color/accent/*` (12-step scales)
- `brand/color/heading`: color of titles in Light (default neutral 900; in Dark titles use neutral 50)
- `brand/color/neutral/*`, `success/*`, `warning/*`, `error/*`, `info/*` (12 steps each, default an alias to `∙ color`): own grays and status colors per brand
- `brand/color/accent-solid/*`: color, hover, pressed and text color of the accent button (default accent 400, 500, 600 and gray 900)
- `brand/font/body`, `brand/font/title`, `brand/font-weight/*`
- `brand/radius/control|containers|overlays/*`
- `brand/border-width/*`

Breaking in 0.3.0: `--wl-*` is now `--brand-*` (`--wl-color-brand-*` is `--brand-color-primary-*`, `--wl-fonts-*` is `--brand-font-*`). The compat block with the old names is removed in 0.4.0.

**Stijlen (presets):**
- **Iris:** standaard, licht afgerond, indigo.
- **Forest:** hoekig, groen, serif-titels.
- **Berry:** rond, roze.

**Figma-limiet modes per collectie:** Professional 10, Organization 20, Enterprise onbeperkt (via extended collections).

### Storybook-conventies

- Sidebar: `Categorie / Component / Docs` plus stories. Volgorde staat in `storySort` in `.storybook/preview.tsx`.
- Categorieën: Introduction, Brand builder, Foundations, Buttons, Form inputs, Selection controls, Badges & tags, Avatars, Feedback, Overlays, Navigation, Data display, Content, E-commerce, Utilities.
- Stories voor meerdere componenten staan in `*.cases.tsx`. Per component een dun `*.stories.tsx`: `export default { ...meta, title: 'Cat/Comp' } as typeof meta;`
- MDX: `<Meta of={Stories} name="Docs" />`.
- Een storynaam mag niet gelijk zijn aan de componenttitel (vandaar `ProgressBars`).
- Toolbar: Theme (Light, Dark) en Brand (Iris, Forest, Berry). Op de Brand builder-pagina staat de Brand-knop vast (`brandControlledByStory`).
- MDX-pagina's zonder stories draaien de decorator niet. Wil zo'n pagina de toolbar volgen, gebruik dan `useDocsGlobals()` uit `src/docs/brand/useDocsGlobals.ts` (zoals de cover doet).
- Huisstijl van MyUI zelf: logo (`src/docs/brand/Logo.tsx`, Figma: _Logo op pagina Logo) en cover (`src/docs/brand/Cover.tsx`, Figma: pagina _Cover). Zijbalklogo en favicon staan als statische SVG in `.storybook/public` (Iris-kleuren, de manager kan geen tokens lezen). Tagline logo: "Eyes on every detail"; tagline cover: "One system, many faces."

### Brand builder

Storybook-pagina waar je een stijl kiest, een huisstijlkleur, fonts en logo invult, en de CSS en Figma-waarden kopieert.
- Kleurschaal in OKLCH, 12 stappen; de ingevoerde kleur blijft op de dichtstbijzijnde stap.
- WCAG-contrastchecks.
- Fonts via Google Fonts in de preview.

### Figma-conventies

- Elke component op een eigen pagina onder een kopje `---- Categorie ----`.
- Op een pagina: links de sectie "Base components", midden de component sets, rechts het frame `Docs / <naam>`.
- Wrapper-varianten: elke variant is een COMPONENT met verticale auto layout om een instance van `_X (base)` (exposed instance).
- Tekst gekoppeld aan `typography-tokens/<groep>/<stijl>/{font-family,font-size,line-height,font-weight}`.
- Icons: one component set `Icon` (page Icons) with all Lucide icons as variants (property Icon). Width and height are bound to `component-tokens/icon/size`. Change the size with the `↳ size` mode on the parent frame (md 20, sm 16, lg 24), not with scaling. Rule: an icon next to text is as high as the line height of that text. Fill color: the foreground token of the component the icon sits in (the same token as the label). It is set on the instance and stays after a swap. There is no icon-context collection anymore.
- Build rules: only the component's own tokens (for example `sidebar/*`), never alias or primitives. No spacer frames or thin lines to fake space: use auto layout with SPACE_BETWEEN or gap. `control` radius only for single-line elements (Input, Select); Textarea and cards use their own radius token.
- Responsive varianten: componenten met een property Breakpoint (Desktop, Mobile) hebben een string-variabele `breakpoint/<component>` in de collectie screen-size-(alias). Xs geeft Mobile, de rest Desktop. Koppel de property via Apply variable; dan wisselt de variant mee met de schermmaat-mode van het frame. Alleen voor Figma, niet in tokens.css.

**Valkuilen bij bouwen via de Figma-API**
- Een script is atomair: één fout draait alles terug.
- Per script maar één paginawissel; je kunt wel nodes aan andere pagina's toevoegen.
- In instances kun je x/y en layoutMode niet overschrijven. Voor een andere layout: aparte base maken en swappen.
- Geen property-koppelingen op sublagen of slot-inhoud in instances.
- Slots boven vaste props: een plek voor inhoud krijgt een naam en is een slot (in React een `ReactNode`-prop, in Figma een native slot). Geen prop met een vaste betekenis als een slot hetzelfde kan. Interactieve inhoud nooit in een `<label>`: geef die een eigen slot buiten het label.
- Een meting in Figma direct na een wijziging kan verouderd zijn. Lees maten in een aparte stap opnieuw voordat je meldt dat iets gelijk is gebleven.
- Button op volle breedte: FILL op de wrapper-instance én op het binnenste kind; na een swap opnieuw zetten.
- Kleur koppelen: eerst de waarde ophalen (`resolveForConsumer`) en die als placeholder gebruiken, anders rendert het zwart.
- De huidige pagina kun je niet verwijderen; eerst wisselen.

### Componenten (stand 16 november 2026)

**Basis**
- Buttons: Button, Button destructive, Button icon, Button group
- Form inputs: Input (prefix, suffix), Select (ook met vlag), Textarea, Slider, Search input, Range slider, Date picker en Calendar (werkt als MUI), Combobox (met vlag, avatar of icoon per optie; vervangt Country select)
- Selection controls: Checkbox, Radio, Toggle, Selection card (met `aside`)
- Badges & tags, Avatars, Feedback (Alert, Toast, Tooltip, Progress)
- Overlays: Dropdown menu, Modal, Slideout, Command menu (⌘K)
- Navigation: Header (met mobiel menu en `search`), Mega menu, Mobile nav, Sidebar (inklapbaar, twee niveaus, Dual), Nav item, Tabs, Breadcrumbs, Pagination, Stepper, Bottom navigation
- Routing: `LinkProvider` geeft alle MyUI-links je router-link (Next.js, React Router). Build heeft `'use client'`.
- Taal: `LocaleProvider` zet de locale (Intl-opmaak) en de teksten voor alle componenten. Componenten lezen ze met `useLocale`, `useLabels('key', DEFAULT_…_LABELS, labels)` en `useText('component.prop', prop)` uit `src/utils/locale.tsx`. Elke tekstset staat in `src/locales/registry.ts`. Nederlands staat in `src/locales/nl-NL.ts` (aparte import `@rbbds/ui/locales/nl-NL`, je-vorm); het type `CompleteLocale` laat de typecheck falen als er een tekst ontbreekt.
- Data display: Table. Content: Card, Accordion, Empty state, File upload
- Utilities: Divider, Featured icon, Spinner, Skeleton, Kbd
- Flags: 250+ vlaggen en CountrySelect (aparte entry)

**Dashboards en portalen (PR #7)**
- Metric card, Page header, Description list, Banner, Date range picker
- Table: werkbalk (Table toolbar), selectiebalk (Table bulk actions), states Selected, Loading, Empty. In Figma kolommen via een slot en rijen via Rows (Table column)
- Accordion-groep in Figma (10 items, toggles)
- Voorbeeldpagina's: Dashboard, Mijn gegevens
- Segmented control bestaat al als Button group

**Portaal, ronde 2 (PR #8)**
- Status indicator, Document list, Activity feed, Notifications (knop, paneel, item), Popover, Settings section, Checklist
- Verification code, Password input, Copy input
- Voorbeeldpagina's: Documenten, Aanvraag volgen, Inloggen met code

**E-commerce (PR #3)**
- Kern: Product card, Product grid, Price, Rating, Quantity stepper, Stock indicator
- Productpagina: Product gallery, Variant picker, Add to cart
- Checkout: Cart item, Cart summary, Promo code, Cart button, Mini cart, Address fields (NL-postcode), Checkout options
- Overzicht: Filter group, Active filters, Range slider
- Voorbeeldpagina's: productoverzicht, productpagina, winkelwagen, checkout
- 74 mapped tokens (`--product-card-*`, `--price-*`, `--cart-*`, `--filter-*` enz.)

### Kwaliteitscheck (zo testen we)

- `npm run check:a11y` (na `npm run build-storybook`): axe op elke story in Light en Dark × Iris, Forest en Berry, controleert ook of thema en merk staan. In CI als eigen job.
- Screenshots in Iris, Forest en Berry.
- `npm run typecheck` en `npm run build-storybook` moeten slagen.
- `npm run test:browser`: Playwright in Chromium en WebKit voor gedrag dat axe niet ziet (Escape in panelen, focus, schermlezernamen). Scenario's staan in `tests/harness/main.tsx`, tests in `tests/browser/`.
- Review van 12 november 2026 met alle bevindingen en de volgorde van oplossen: `claude/MyUI-review-2026-11-12.md` in het Claude Project.
- Vaste checks in elke PR: `npx tsc --noEmit -p .`, `npm run build`, `npm run lint:tokens -- --strict`, `npm run check:strings`, `npm run check:contrast`, `npm run report:figma-bindings -- --strict`, `npm run docs:build` (CI faalt als `src/docs` daarna verschilt), Playwright (64 tests), `npm run check:a11y`. De token-lint controleert naast px ook z-index, duren en radius in % (`rawAllow`).
- Visuele regressie: Storybook van main en van de branch bouwen en vergelijken met `node scripts/compare-stories.mjs <oud> <nieuw>`.
- Laatste stand (17 november): axe op alle 163 stories in Light en Dark, Iris, Forest en Berry (978 runs): 0 fouten. Schermlezers (VoiceOver, NVDA) zijn nog niet met de hand getest.
- Onafhankelijke controle van 17 november: `claude/MyUI-controle-2026-11-17.md` in het Claude Project.

### Geschiedenis

| PR | Inhoud |
| --- | --- |
| #1 | Eerste batch componenten en tokens |
| #2 | Date picker, Combobox, flags, eigen pagina per component, accordion-fix, rebranding (brand/wl, stijlen Iris/Forest/Berry), Brand builder |
| #3 | E-commerce componenten, docs en Figma Docs-frames |
| #4 | Fix: Brand builder negeert de Brand-knop in de toolbar |
| #5 | Projectoverzicht (`docs/PROJECT.md`) en README bijgewerkt |
| #6 | Fix: QuantityStepper hugt zijn inhoud |
| #7 | Dashboard- en portaalcomponenten, Table met kolommen-slot |
| #8 | Portaal ronde 2 (prio 2 en 3) en breakpoint-variabelen |
| #9 | Logo en cover in Storybook, Foundations in Figma bijgewerkt |
| #10 | Token architecture 0.3.0 (brand, alias, mapped), Icon set, collapsible and two-level Sidebar, Berry radius fixes |
| #11–#16 | Status indicator zonder brand, gegroepeerde Verification code, Popover-pijl, docs in B1-Engels, Show code, myui-brand skill |
| #17 | Fase 4: Engelse standaardteksten, en-US, neutrale voorbeelden |
| #18–#20 | Templates, Bottom navigation, responsive tokens, Accent button, gele accentkleur |
| #21–#24 | Getting started, versiebeleid, npm trusted publishing, release 1.0.0 en 1.0.1 |
| #25–#27 | Building components guide, control-hoogtes op 4 px, tokens.json, llms.txt |
| #28–#41 | Review 12 november, PR 1 t/m 8: browsertests, token-lint, contrast, panelenlaag, teksten als prop (`labels`), component tokens in CSS, strikte token-checks, API-afstemming met deprecations, Input help, toegankelijkheid (focus, aria-disabled, hit areas), Mega menu, Mobile nav en Header search |
| #42 | `LinkProvider` (router-links), `'use client'`, L2/L6/L9, Docs-frames opnieuw gegenereerd |
| #58 | F1a: accent-knop per merk (`--brand-color-accent-solid-*`), pressed-state voor Button, Button destructive en Button icon, contrastcheck voor knoplabels, `check:brand`, pixelvergelijking in zes combinaties |
| #59 | F1b: grijzen en statuskleuren per merk (`--brand-color-neutral-*`, `-success-*`, `-warning-*`, `-error-*`, `-info-*`), Brand builder en brand.json, contrastfix hover en pressed in Dark |
| #60 | F1c: kopkleur per merk (`--brand-color-heading`, `--color-foreground-heading`, 24 title-tokens), Getting started en README bijgewerkt voor alle F1-stappen |
| #61 | Release 1.6.0 |
| #62 | Focuskleur is blauw in elk merk (`--color-border-focus` naar info 500 en 400), contrastcheck voor focus |
| #63 | Release 1.7.0 |
| #64 | F2a: `LocaleProvider` (locale en teksten voor alle componenten), bedragen in Cart summary en Mini cart volgen de locale, Locale-schakelaar in Storybook |
| #65 | F2b: Nederlands (`@rbbds/ui/locales/nl-NL`): 53 tekstsets en 21 losse teksten, Locale-schakelaar in Storybook toont nu ook de teksten |
| #66 | Release 1.8.0 |
| #67 | Price: `prefix`, `decimals` (stukprijzen zoals € 0,523) en `vat` (excl. of incl. btw, uit de labels) |
| #68 | Quantity stepper: `step` (verpakkingseenheid), melding na een correctie, `hint`, veld groeit mee met het grootste getal |
| #69 | Add to cart: `minQuantity`, `quantityStep`, `quantityHint`, aantal naar de pagina, tweede actie met uitleg. Cart item: `minQuantity`, `quantityStep`. Hint en melding onder de hele rij |
| #70 | Nieuw: Tier pricing table (`TierPricingTable`, `useTierPricing`), tokens `--tier-pricing-*`, Figma-pagina |
| #71 | Story: de koopflow met staffels volledig in het Nederlands |
| #72 | Release 1.9.0 |
| #73 | Figma-changelog voor 1.9.0. Releases: Claude maakt voortaan ook de GitHub Release aan, na de merge van de release-PR |
| #74 | Selection card: slots `badge`, `meta` en `children` (content). Patroon "decoration method" als story. Figma: clip content uit op alle 31 slots |
| #75 | File upload: bestanden als slot in het component. File upload item: slots `media`, `actions`, `children`, status `processing`, verwijderen na complete. Patroon "artwork check" als story |
| #43–#44 | Release 1.1.0, Figma-bestandsnaam in de docs |
| #45–#46 | L5: zichtbare actieve optie in Button group en Pagination, release 1.2.0 |
| #47–#49 | Base tokens voor spacing en radius, scopes alleen op base tokens, release 1.3.0 |
| #50 | Figma-states (Date picker Disabled, Quantity stepper At maximum, Table header cell Focus), L8, TableCard-tabstop, `MegaMenuFeatured actions`, Close button-docs, docs-correcties |
| #51–#53 | Release 1.4.0, types zonder CSS-imports, axe en docs-check in CI, lintregel `raw`, release 1.4.1 |
| #54 | Tokens `tab/indicator-width` en `avatar/status-ring-width`, Close button Focus-state, timeout op de a11y-job |

Na een deploy kan een open Storybook-tab "Importing a module script failed" geven. Dat komt door de cache: hard verversen (Cmd + Shift + R).

### Open punten

**Componenten**
- Carrousel voor productrijen
- Interactieve rating (zelf beoordelen)
- Betaallogo's (iDEAL, Visa en dergelijke)
- Postcode-API voor straat en plaats
- Filterpaneel als Slideout op mobiel
- "Mail me als het weer leverbaar is"
- Inzoomen en vegen in Product gallery

**Dashboards en portalen**
- Grafieken (lijn, staaf, donut, sparkline): on hold. Keuze tussen Recharts of eigen SVG, plus een token-reeks voor grafiekkleuren.
- Notifications: tabs Alle/Ongelezen.
- Date range picker: begin- en einddatum typen.
- Table: gestapelde mobiele weergave; variant Empty splitsen in "geen data" en "geen resultaten".

**Tokens en Figma**
- Test what a Starter plan user can do with a copy of the file.
- Voorstel voor `on-warning` in Dark.
- Brand builder: bij de standaardkleur precies de Forest- en Berry-tokens gebruiken (nu een iets andere tint).

**Werkafspraken (vastgelegd in november 2026)**
- Componenten met een andere opbouw krijgen een eigen base, ook als ze als varianten in één set staan.
- Een tabel: werkbalk en selectiebalk tegelijk zichtbaar; zoeken of filteren wist de selectie. De toevoegen-knop staat in de kop van de tabel of in de Page header, nooit in de werkbalk.
- Groepen in Figma: vaste maximale aantallen via toggles (Accordion) of vrij via een slot (Table, Description list).

**Proces**
- E-commerce is code-first gebouwd. Nog een design review in Figma doen en aanpassingen doorzetten naar code.
- Templates per stijl uitdenken (uitgesteld).
- Figma-naar-code workflow voor token- en componentwijzigingen vastleggen.

**Toegankelijkheid (na de review)**
- Handmatige test met VoiceOver (macOS, iOS) en NVDA (Windows) en een ronde in echte Safari.
- L7 is vastgelegd in de lintregel `raw` (z-index, duren en radius in % alleen met reden). L10 (volgt Figma) blijft bewust zoals hij is.
