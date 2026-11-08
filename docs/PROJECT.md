# MyUI (@rbbds/ui): projectoverzicht

Stand: 8 november 2026. Werk dit bestand bij in elke PR die architectuur, conventies of open punten verandert. Een kopie staat in het Claude Project "MyUI · white label design system".

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
| npm-pakket | `@rbbds/ui`, versie 0.2.0 in package.json, registry GitHub Packages (nog niet gepubliceerd als release) |
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
  docs/          Introductie.mdx, brand/ (Brand builder), components/*.mdx, data/*.json
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

### Tokenarchitectuur

| Laag | Figma | CSS |
| --- | --- | --- |
| 1. Primitives | ruwe waarden | `:root` |
| 2. Brand | collectie `brand/wl`, modes Iris, Forest, Berry | `--wl-*`; Forest en Berry in `:root[data-brand="forest"\|"berry"]` |
| 3. Theme (alias) | modes Light, Dark | gelijk in beide thema's op `:root`; Light op `:root,[data-theme="light"]`; Dark-verschillen op `[data-theme="dark"]` |
| 4. Mapped | `component-tokens/*` | `--component-onderdeel` (bv. `component-tokens/x/y` wordt `--x-y`) |

**Wat een merk mag aanpassen (alles in brand/wl):**
- `WL/color/*` (brandkleur, 12-staps schaal)
- `WL/fonts/body`, `WL/fonts/title`
- `WL/radius/control|containers|overlays/*`
- `WL/border-width/*/default|strong`
- `WL/font-weight/titles|paragraph/*`

Spacing en maten blijven gelijk voor alle merken. De theme-laag verwijst naar brand/wl.

**Stijlen (presets):**
- **Iris:** standaard, licht afgerond, indigo.
- **Forest:** hoekig, groen, serif-titels.
- **Berry:** rond, roze.

**Figma-limiet modes per collectie:** Professional 10, Organization 20, Enterprise onbeperkt (via extended collections).

### Storybook-conventies

- Sidebar: `Categorie / Component / Docs` plus stories. Volgorde staat in `storySort` in `.storybook/preview.tsx`.
- Categorieën: Introductie, Brand builder, Foundations, Buttons, Form inputs, Selection controls, Badges & tags, Avatars, Feedback, Overlays, Navigation, Data display, Content, E-commerce, Utilities.
- Stories voor meerdere componenten staan in `*.cases.tsx`. Per component een dun `*.stories.tsx`: `export default { ...meta, title: 'Cat/Comp' } as typeof meta;`
- MDX: `<Meta of={Stories} name="Docs" />`.
- Een storynaam mag niet gelijk zijn aan de componenttitel (vandaar `ProgressBars`).
- Toolbar: Theme (Light, Dark) en Brand (Iris, Forest, Berry). Op de Brand builder-pagina staat de Brand-knop vast (`brandControlledByStory`).

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
- Iconen: Lucide-vectoren met naam "Icon", fill gekoppeld aan de icon-kleurvariabele.

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
- Laatste stand: 0 axe-fouten op de e-commerce stories.

### Geschiedenis

| PR | Inhoud |
| --- | --- |
| #1 | Eerste batch componenten en tokens |
| #2 | Date picker, Combobox, flags, eigen pagina per component, accordion-fix, rebranding (brand/wl, stijlen Iris/Forest/Berry), Brand builder |
| #3 | E-commerce componenten, docs en Figma Docs-frames |
| #4 | Fix: Brand builder negeert de Brand-knop in de toolbar |
| #5 | Projectoverzicht (`docs/PROJECT.md`) en README bijgewerkt |

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

**Tokens en Figma**
- Ongeveer 1.613 directe koppelingen aan theme-variabelen omzetten naar mapped tokens (rebind-PR), plus effects en focus ring als mapped tokens.
- Voorstel voor `on-warning` in Dark.
- 43 oudere Docs-frames opnieuw genereren, zodat het Storybook-pad "Categorie / Component / Docs" klopt.
- Brand builder: bij de standaardkleur precies de Forest- en Berry-tokens gebruiken (nu een iets andere tint).

**Proces**
- E-commerce is code-first gebouwd. Nog een design review in Figma doen en aanpassingen doorzetten naar code.
- Templates per stijl uitdenken (uitgesteld).
- Release v0.2.0 of v0.3.0 publiceren wanneer Robert dat vraagt.
- Figma-naar-code workflow voor token- en componentwijzigingen vastleggen.
