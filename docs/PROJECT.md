# MyUI (@rbbds/ui): projectoverzicht

Stand: 9 november 2026. Werk dit bestand bij in elke PR die architectuur, conventies of open punten verandert. Een kopie staat in het Claude Project "MyUI · white label design system".

Eigen white-label design system van Robert Trimp: een Figma-library plus een React-library met Storybook, om te hergebruiken in eigen projecten en voor klanten. Los van PGGM.

---

## Deel 1: Inrichting nieuw Claude Project

### 1. Project aanmaken

- **Naam:** MyUI · white label design system
- **Omschrijving (plakken):**

> Eigen white label design system van Robert: Figma-library "WL Design System (rbbds)" plus React-library @rbbds/ui met Storybook (repo rbbds/MyUI). Doel: één herbruikbare basis voor eigen projecten en klanten. Per project kies je een stijl (Iris, Forest of Berry) en pas je kleuren, fonts en logo aan. Los van PGGM.

### 2. Projectinstructies (plakken)

```
Je bent mijn sparringpartner en bouwer voor MyUI, mijn eigen white label design system. Dit project staat los van PGGM: gebruik geen PGGM-bestanden, -merken of -afspraken, en schrijf nooit naar PGGM Figma-bestanden.

Bronnen
- Figma: WL Design System (rbbds), file key gV7OuQywH2cOUVfQagW6nC. Alleen in dit bestand werken.
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
| Figma-bestand | WL Design System (rbbds), `gV7OuQywH2cOUVfQagW6nC`. Staat in een aparte map in het PGGM Figma-account (geen extra betaalde seat). |
| Repo | https://github.com/rbbds/MyUI (GitHub-gebruiker `rbbds`) |
| npm-pakket | `@rbbds/ui`, versie 0.3.0 in package.json, registry GitHub Packages (nog niet gepubliceerd als release) |
| Storybook live | https://my-ui-two.vercel.app (main) |
| Storybook previews | Per branch via Vercel, link staat in de PR |

### Uitgangspunten (besluiten)

- Untitled UI is de referentie voor welke componenten erin horen.
- Zelfde 4 tokenlagen als bij PGGM, maar met eigen inhoud.
- Iconen: Lucide (outlined). Componentmaten: sm, md, lg.
- Figma-componenten op de PGGM-manier: een base component (`_Button (base)`) waarvan de varianten instances zijn, zodat je alleen de base aanpast. Native Figma slots voor inhoud (card, modal, slideout), geen nep-slots.
- Gebruik per klant: `npm install @rbbds/ui`, stijl kiezen, kleuren, fonts en logo aanpassen in code. Geen apart merk per klant in Figma nodig.
- Alles gratis.
- Templates per stijl (Iris, Forest, Berry) zijn uitgesteld. Robert komt erop terug.

### Stack

- Vite, React 18+, TypeScript, CSS-variabelen (geen CSS-in-JS).
- Storybook 10 (`@storybook/react-vite`), addons docs en a11y.
- Afhankelijkheden: `lucide-react`, `country-flag-icons` (alleen in entry `@rbbds/ui/flags`).
- Fonts in Storybook: Inter (variable), Source Serif 4 (400, 600, 700).
- Package-exports: `.`, `./flags`, `./styles.css`, `./tokens.css`.

### Repostructuur

```
src/
  components/
    Button/      Button, ButtonGroup
    Form/        Input, Select, Textarea, Slider, RangeSlider, SearchInput, DatePicker, Combobox, Field
    Selection/   Checkbox, Radio, Toggle, SelectionCard
    Display/     Badge, Tag, Avatar, Divider, Featured icon, Spinner, Skeleton, Kbd, Table
    Content/     Card, Accordion, Empty state, File upload
    Navigation/  Header, Sidebar, Nav item, Tabs, Breadcrumbs, Pagination, Stepper, AppShell
    Overlay/     Alert, Toast, Tooltip, Progress, Dropdown menu, Modal, Slideout, Command menu
    Commerce/    e-commerce (zie hieronder)
  flags/         Flag, CountrySelect
  docs/          Introduction.mdx, brand/ (Brand builder), components/*.mdx, data/*.json
  styles/        tokens.css (gegenereerd uit Figma), index.css
docs/
  content/*.mjs       bron van alle componentdocumentatie
  figma-pages.mjs     doc-naam naar Figma-pagina-id
scripts/
  figma-export-tokens.js       Figma-variabelen naar tokens.css
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
| 4. Mapped | `↳ mapped`: `component-tokens/*`, `typography-tokens/*`, `base-tokens/*`, `effect-tokens/*` | `--x-y`, `--text-*`, `--base-*`, `--effect-*` |

**Rules**
- Components and frames only use mapped tokens. Never alias or primitives.
- Mapped always points to an alias. Alias points to brand or primitives. Brand points to primitives.
- Designers only edit the brand layer: primary and accent color, fonts, font weights, radius, border width.
- Spacing is the same for all brands.
- Only mapped is published. The other collections are hidden and have no scopes.

**What a brand can change (all in `↳ brand`):**
- `brand/color/primary/*` and `brand/color/accent/*` (12-step scales)
- `brand/font/body`, `brand/font/title`, `brand/font-weight/*`
- `brand/radius/control|containers|overlays/*`
- `brand/border-width/*`

Breaking in 0.3.0: `--wl-*` is now `--brand-*` (`--wl-color-brand-*` is `--brand-color-primary-*`, `--wl-fonts-*` is `--brand-font-*`). A compat block keeps the old names until 0.4.0.

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
- Button op volle breedte: FILL op de wrapper-instance én op het binnenste kind; na een swap opnieuw zetten.
- Kleur koppelen: eerst de waarde ophalen (`resolveForConsumer`) en die als placeholder gebruiken, anders rendert het zwart.
- De huidige pagina kun je niet verwijderen; eerst wisselen.

### Componenten (stand 8 november 2026)

**Basis**
- Buttons: Button, Button destructive, Button icon, Button group
- Form inputs: Input (prefix, suffix), Select (ook met vlag), Textarea, Slider, Search input, Range slider, Date picker en Calendar (werkt als MUI), Combobox (met vlag, avatar of icoon per optie; vervangt Country select)
- Selection controls: Checkbox, Radio, Toggle, Selection card (met `aside`)
- Badges & tags, Avatars, Feedback (Alert, Toast, Tooltip, Progress)
- Overlays: Dropdown menu, Modal, Slideout, Command menu (⌘K)
- Navigation: Header (met mobiel menu), Sidebar, Nav item, Tabs, Breadcrumbs, Pagination, Stepper
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

- axe via Playwright op elke story in Light en Dark (wachttijd circa 1200 ms per story).
- Screenshots in Iris, Forest en Berry.
- `npm run typecheck` en `npm run build-storybook` moeten slagen.
- Laatste stand (PR #10): 0 axe-fouten op alle stories in Light en Dark.

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
- Notifications: tabs Alle/Ongelezen. Popover: pijltje naar de knop.
- Date range picker: begin- en einddatum typen.
- Table: gestapelde mobiele weergave; variant Empty splitsen in "geen data" en "geen resultaten".

**Tokens en Figma**
- Test what a Starter plan user can do with a copy of the file.
- Voorstel voor `on-warning` in Dark.
- 43 oudere Docs-frames opnieuw genereren, zodat het Storybook-pad "Categorie / Component / Docs" klopt.
- Brand builder: bij de standaardkleur precies de Forest- en Berry-tokens gebruiken (nu een iets andere tint).

**Werkafspraken (vastgelegd in november 2026)**
- Componenten met een andere opbouw krijgen een eigen base, ook als ze als varianten in één set staan.
- Een tabel: werkbalk en selectiebalk tegelijk zichtbaar; zoeken of filteren wist de selectie. De toevoegen-knop staat in de kop van de tabel of in de Page header, nooit in de werkbalk.
- Groepen in Figma: vaste maximale aantallen via toggles (Accordion) of vrij via een slot (Table, Description list).

**Proces**
- E-commerce is code-first gebouwd. Nog een design review in Figma doen en aanpassingen doorzetten naar code.
- Templates per stijl uitdenken (uitgesteld).
- Release v0.2.0 of v0.3.0 publiceren wanneer Robert dat vraagt.
- Figma-naar-code workflow voor token- en componentwijzigingen vastleggen.

**Fase 4: Engels (PR volgt)**
- Standaardlabels in code Engels, standaard locale en-US (bedragen, datums, landnamen). DatePicker kreeg een `locale`-prop; de getypte datum volgt de volgorde van de locale.
- Stories, voorbeelden en Introduction in het Engels, met neutrale voorbeeldcontent (geen pensioentermen).
- Storybook: "Portaal" heet nu "Account/Examples", "Voorbeelden" heet "Examples".
- Figma: voorbeeldteksten Engels en en-US; `icon-size/*` staat in `↳ screen-size`, `↳ size` kiest alleen de maat per component (modes op 183 varianten).
