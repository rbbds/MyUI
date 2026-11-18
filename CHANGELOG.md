# Changelog

## 1.4.1 (18 November 2026)

### Fixed
- **Type declarations** no longer import CSS (`import './Button.css'` in `dist/types`). In TypeScript 6 or later without a `declare module '*.css'` and with `skipLibCheck` off, that gave 47 errors TS2882 in your project. Build step `scripts/strip-dts-css.mjs`.

### Changed (tooling, no change in components)
- CI: `npm run docs:build` must leave `src/docs` unchanged, and a new job runs axe on every story in Light and Dark and in Iris, Forest and Berry (`npm run check:a11y`, 984 runs, 0 problems).
- Token-lint rule 6 (`raw`): z-index, durations and a percentage radius are only allowed with a value and reason in `rawAllow` (review L7). The allowlist for positions and box-shadow lines is now per selector instead of per property.

## 1.4.0 (18 November 2026)

### Added
- **TableCard** `labels.region` (default "Table"): names the scroll area of a wide table that has no `title`. Exported `DEFAULT_TABLE_CARD_LABELS`.
- **MegaMenuFeatured** `actions`, like the other components (7a). `action` is deprecated (removed in 2.0.0).
- Figma: Date picker State=Disabled, Quantity stepper State=At maximum (md and sm), Table header cell State=Focus (focus ring on the sort button). Docs page and Figma Docs frame for the internal **Close button** (Utilities / Close button).

### Changed
- **TableCard**: the scroll area is only a tab stop (and a named region) when the table is wider than the card. Before, it was always a tab stop, also when there was nothing to scroll.
- **Nav item** (collapsed, with indicator): the ring around the dot is 2 px (was 1.5 px), `--nav-item-indicator-border-width` → `var(--width-2)`. Review L8.
- **Cart button** count: 12 px text (was 11 px), `--cart-button-count-font-size` → `var(--typography-body-description)`. Review L8.

### Docs
- Quantity stepper md is 40 px (said 44). Date picker: removed the open point about the popover position (it flips since PR 4). Table header cell State, Date picker Disabled, Quantity stepper At maximum.
- `PROJECT.md`: package exports with `./tokens.json`, repo structure (`utils/`, `templates/`, Mega menu, Close button), history to #50, no more `test.fail()`, L5 done. `TOKEN-ARCHITECTURE.md`: only the avatar-group overlaps are still raw values.

## 1.3.0 (17 November 2026)

### Added
- **Base tokens for spacing and radius** (Figma `base-tokens/*`, CSS `--base-*`): `--base-spacing-{0-5|1|1-5|2|2-5|3|4|5|6|8|10|12|15|20}` (2 to 80 px) and `--base-radius-{control|containers|overlays}-{xs|sm|md|lg}` plus `--base-radius-full`. For your own frames and layouts. Radius follows the brand.

### Changed
- Figma: only base tokens have scopes, so the variable picker shows a short set (colors, border width, spacing, radius). Component tokens no longer show in pickers; they stay bound inside the components. Every base token has a WEB code syntax.
- Tokens: `--spinner-{sm|md|lg}-stroke-width` now point to `--width-2`, `--width-3` and `--width-4` (same values). In Figma `variant/swatch-size` points to `sizing/8` (CSS unchanged, 32px).
- Docs: `TOKEN-ARCHITECTURE.md` rules 2 and 5 match how the file works (fixed sizes may point to `∙ sizing`, `↳ size` is published, scopes only on base tokens, the remaining raw values listed). `PROJECT.md` and the designer guide updated.

## 1.2.0 (17 November 2026)

### Changed
- **Button group and Pagination, current option (L5, WCAG 1.4.11)**: the active option has a 2 px ring in the brand color, a brand-tinted background and brand-colored text. Before, only a light gray background showed it (1.11:1 against the other options). The ring is an `outline` with a negative offset, so it is equally thick on every side and sits over the shared border; a focused active option keeps it. Figma: `_Button group item` and `_Pagination item` State=Current use the same ring as a 2 px inside stroke.
  - New tokens: `--button-group-border-current`, `--button-group-border-width-current`, `--pagination-border-current`, `--pagination-border-width-current` (brand border color, `--border-width-control-strong`).
  - Changed tokens: `--button-group-surface-current` and `--pagination-surface-current` now use `--color-surface-brand-subtle` (was `--color-surface-tertiary`), `--button-group-foreground-current` and `--pagination-foreground-current` use `--color-foreground-brand` (was `--color-foreground-primary`).
  - `npm run check:contrast` also checks the ring on the page and on its own background: at least 3.82:1 in Iris, Forest and Berry, Light and Dark.
  - Figma: the icon in Button group Current follows the current text color.
- Docs: the Figma file is called **MyUI Design System** (was named WL Design System (rbbds) in README, Introduction, PROJECT.md and the scan scripts). The file key is unchanged.

## 1.1.0 (16 November 2026)

### Added (PR 9, links and cleanup)
- **`LinkProvider`** (M20): pass your router link once (for example Next.js `Link` or React Router `Link`) and every MyUI link uses it: Header, Mega menu, Mobile nav, Nav item, Breadcrumbs, Stepper, Bottom navigation, Product card, Cart, Document list, Notifications and content links. Without a provider MyUI renders a plain `<a>`. Download links stay a plain `<a>`. Types `LinkComponent`, `LinkComponentProps`, `LinkProviderProps`.
- **`'use client'`** at the top of every built file, so the components work in the Next.js App Router without a wrapper.
- Developer guide: section "Routing and Next.js". llms.txt: routing, site navigation (Header menu, Mega menu, Mobile nav, search).

### Changed (PR 9)
- **FileUploadItem** (L6): the row is no longer a live region. A hidden status reads out "{name} uploaded" or "{name}: upload failed" once (`labels.uploadedFile`, `labels.failedFile`), not every progress step.
- **PasswordInput** (L9): the eye button has no `aria-pressed` anymore. Its name already switches between "Show password" and "Hide password", so screen readers no longer read the state twice.
- **Textarea and File upload** (L2): the padding subtracts the border width, so a thicker border (File upload active) no longer moves the content.
- Figma: Docs frames regenerated for all components, including Mega menu and Mobile nav.
- `docs/PROJECT.md` brought up to date (history, components, checks, open points).

### Added (PR 8, Mega menu and Mobile nav)
- **Mega menu** (`MegaMenu`, `MegaMenuLink`, `MegaMenuFeatured`): a panel below the Header with 2 to 4 columns of links (icon, title, description) and an optional featured block. Header renders it for a link with `menu: { columns, featured }`; the link becomes a button with `aria-expanded` (a disclosure with plain links, no ARIA menu). Opens on click, closes on Escape (focus back to the button), a click outside, focus leaving the navigation or a click on a link. One menu at a time. Story Navigation/Mega menu and Header/WithMegaMenu.
- **Mobile nav** (`MobileNav`): the navigation in the Header mobile menu. Items with a menu expand in place (accordion, one at a time, the section with the current page starts open); subpages show the same icons as the Mega menu.
- **Header `search`**: usually a SearchInput (sm). Right side on desktop (`--header-search-width`, 240 px), at the top of the mobile menu. Both in a `role="search"` landmark.
- `_Header nav item` State=Expanded and Has menu, `_Mega menu link` State=Current, `_Mobile nav sublink` (Default, Hover, Focus, Current, with an optional icon), Header `Show search` in Figma.
- Tokens: `--mega-menu-link-surface-current`, `--mega-menu-featured-width`, `--mega-menu-featured-image-height`, `--mega-menu-featured-image-radius`, `--mobile-nav-item-sub-foreground-current`, `--mobile-nav-item-sub-icon-size`, `--mobile-nav-item-sub-icon-gap`, `--mobile-nav-item-sub-icon-foreground`, `--header-search-width`. The Mega menu, Mobile nav and Header nav item tokens are now used (off the pending list).

### Changed (PR 8)
- **Header mobile menu** uses Mobile nav instead of Nav items. `links[].icon` is no longer shown and is deprecated (removed in 2.0.0). `links[].href` is optional for an item with a `menu`.
- `--mega-menu-link-icon-foreground` is `--color-foreground-secondary` (was brand): calmer with many links.
- Removed tokens `--mega-menu-column-gap` (the padding of a link is the spacing between links) and `--mobile-nav-padding-horizontal` (the Slideout gives the padding).
- Figma: Search input variants have a Fill base, so an instance can be narrower than 320 px. Instances in Sidebar (248), Table (280) and the templates now show their set width instead of running to 320.
- Figma: focus states of Header nav item, Mega menu link and Mobile nav item show the ring (fill and clip content).

### Added (PR 7c, accessibility)
- **DatePicker checks what you type** (M6): text that is not a date gives "Enter a date as MM/DD/YYYY.", a date outside `min`/`max` (or disabled through `calendarProps`) gives "Choose a date between … and …." The `error` prop wins. Texts in `labels.invalid`, `labels.unavailable`. Figma: Date picker State=Error. Story Form/DatePicker/BuiltInErrors.
- **DatePicker format in the hint**: "Format: MM/DD/YYYY" after the hint (`labels.format`, `hideFormat`). The placeholder disappears while you type; the hint does not.
- **`onValueChange(date, { reason })`** on DatePicker: `'valid' | 'empty' | 'invalid' | 'unavailable'`. Existing handlers with one argument keep working.
- **Input `State=Error empty`** in Figma (a required field left empty, placeholder stays) next to `Error` (invalid input, the value stays dark). Story Forms/Input/ErrorEmpty.
- **Figma**: effect style `Focus ring/inset` (`--focus-ring-inset`), Quantity stepper `Focus value` and `Focus button`, `_Field action` State=Focus.

### Changed (PR 7c, accessibility)
- **Buttons that switch themselves off keep focus** (M9): QuantityStepper − and + at the limit, Pagination Previous and Next, and Button/ButtonIcon `loading` use `aria-disabled` instead of `disabled`. Button ignores clicks (and form submit) when `loading` or `aria-disabled` is set.
- **One focus ring at a time** (M8): a field (`.rb-control`) shows its ring only when the input has focus; the clear, help or calendar button gets its own ring. QuantityStepper: a ring inside the focused button (`--focus-ring-inset`), the ring around the stepper only while typing in the value.
- **Hit areas of 24 px** (M10): Checkbox, Radio and Toggle controls and the Table sort button get an invisible 24 px hit area. The SearchInput clear button is now a field action of 24 px with a 20 px icon, like the other buttons in a field.
- **Calendar**: unavailable days use `aria-disabled` and the arrow keys skip them, so the grid never loses its tab stop (M6).
- **Table** (M11): the scroll area is focusable (`tabindex="0"`, focus ring inside) and is a region named after the TableCard title. TableBulkActions keeps an (empty) live region on the page, so the first "1 selected" is read out.
- Removed token `--search-clear-icon-size`: the clear button uses `--input-action-icon-size`, in Figma too.
- Figma: `_Field action` is 20 × 20 with the 24 px button on top (like the negative margin in code). A field no longer grows by 4 px when it has a field action. Calendar weekday letters are English (M T W T F S S), like the code.

### Added (PR 7b)
- **Input `help`** (keuze 19): a help icon in the field (Figma: Help icon) that shows the text in a Tooltip on hover and focus. The button is named by `labels.help` ("More information"). Uses `--input-help-icon-size`. Story Forms/Input/WithHelp.
- **ButtonGroup `disabled`**, for the whole group or per option (`options[].disabled`). New tokens `--button-group-foreground-disabled` and `--button-group-border-disabled`; Figma: `_Button group item` State=Disabled. Story Button group/GroupDisabled.
- **DualSidebar expand button** (M19): when collapsed, the rail shows a button below the logo that opens the panel again (Figma: Sidebar Dual, Collapsed, Show expand button). `labels.expand` ("Expand panel"). The focus moves between the collapse and expand buttons, so it is never lost.

### Changed (PR 7b)
- ButtonGroup: vertical padding minus `--button-group-border-width` instead of a fixed 1 px (M14).
- Removed token `--command-item-shortcut-border-width`: the shortcut in a Command item is a Kbd and uses `--kbd-border-width`, in Figma too.

### Changed (PR 7a, API alignment, M19)
New names work now; the old ones still work, are marked `@deprecated` and go in 2.0.0 (keuze 5). No visual change.
- **`onValueChange`** with the value on ButtonGroup, Tabs, SearchInput, PasswordInput, Slider, RangeSlider, Combobox, Calendar, DatePicker, DateRangePicker, VerificationCode, QuantityStepper, VariantPicker, FilterGroup and AddressFields. `onChange` with a value is deprecated; on SearchInput, PasswordInput and Slider it becomes the native change event in 2.0.0, like Input.
- **Controlled or not, one rule:** new `useControlled` hook (exported). Leave `value` out and the component keeps its own state from `defaultValue`. New: `value`/`onValueChange` on Accordion (`defaultOpen` deprecated, use `defaultValue`), `defaultValue` on ButtonGroup, FilterGroup and AddressFields, `open`/`defaultOpen`/`onOpenChange` on DropdownMenu, `defaultOpen` on Popover.
- **`label`** is the accessible name of the component itself: Tabs, ButtonGroup (both accept `aria-label` too, one of the two is required), Pagination, Breadcrumbs, Stepper, BottomNavigation, Header and Sidebar (`navLabel` deprecated).
- **`labels`** holds all texts. Deprecated single props: `closeLabel` (Alert, Toast, Modal, Slideout, Banner, Popover), `regionLabel`, `clearLabel`, `toggleLabel`, `hintLabels`, `calendarLabel`, `previousLabel`/`nextLabel`/`switchViewLabel` (Calendar), `previousLabel`/`nextLabel`/`pageStatus`/`pageLabel` (Pagination), `homeLabel`/`backLabel`, `statusLabels`, `menuLabel`/`menuTitle`, `footerLabel`/`collapseLabel`/`expandLabel`, `railLabel`/`railFooterLabel`, `dialogLabel`, `minLabel`/`maxLabel`, `copyLabel`/`copiedLabel`/`copiedMessage`, `trendLabels`, `countLabel` (NotificationButton, TableBulkActions), `unreadLabel`, `markAllLabel`, `downloadLabel`, `doneLabel`, `progressLabel`, `actionLabel`/`dropLabel`, `decreaseLabel`/`increaseLabel`, `buttonLabel` (PromoCode), `addToCartLabel`, `removeLabel` (Tag). New exported defaults (`DEFAULT_PAGINATION_LABELS` and so on).
- **PasswordInput:** `showLabel` and `hideLabelText` become `labels.show` and `labels.hide`. **SearchInput:** `showLabel` becomes `hideLabel` (default true), like Field.
- **`variant`** for the look: Tabs and VariantPicker (`type` deprecated).
- **`actions`** for button slots: Banner, Card, CartSummary, DescriptionList, DescriptionItem, DocumentList, ChecklistItem, SidebarUser (`action` deprecated). Card shows its actions also when `href` is set (they used to disappear).
- **`headingLevel`** is `2 | 3 | 4` everywhere (type `HeadingLevel`). New on Card, EmptyState (default 3), Modal and Slideout (default 2). Checklist and SettingsSection now accept 4.
- **`className`, `ref` and other HTML attributes** on Modal, Slideout, CommandMenu (to the `<dialog>`), Tabs, Accordion, Pagination, Breadcrumbs, EmptyState, RangeSlider, Stepper, BottomNavigation and ButtonGroup. Combobox and DatePicker forward `ref` to the input. DropdownMenu accepts `className`.
- **Fixes:** Slider without `defaultValue` starts in the middle between `min` and `max` (was always 50). NavItem reads the count word (`countLabel`) also in the full variant.
- Docs: "Props that work the same everywhere" in For developers, and the props tables. Not changed: the default `size` (sm for Checkbox, Radio, Toggle and AvatarGroup) is now documented instead.

### Added (PR 6c)
- **Checkbox group** (`CheckboxGroup`, keuze 32): checkboxes in a fieldset with a legend, like `RadioGroup` and `SelectionCardGroup`. `hideLegend` hides the legend visually (screen readers still read it). Tokens `--checkbox-group-gap`, `--checkbox-group-legend-gap`, `--checkbox-group-legend-foreground`. Figma: `Checkbox group` with Legend, Show legend and Show option 1 to 6. Story Selection controls/Checkbox/Group.

### Changed (PR 6c)
- **Token checks are strict (keuze 18b):** CI runs `npm run lint:tokens -- --strict` (0 findings) and `npm run report:figma-bindings -- --strict`. New `scripts/figma-binding-scan.js` (read-only Figma scan: layers, text ranges, aliases and styles) and `scripts/figma-binding-report.mjs` (writes `docs/reports/figma-bindings.md`). First scan: 1,236 component tokens, 1 without a binding (`mega-menu-link/icon-foreground`, pending until PR 8), code syntax all correct. See `docs/TOKEN-ARCHITECTURE.md`.
- **Round 4, choices (15 November):**
  - Rating: star size from `--rating-star-size` with the size mode (`size/rating-star`: sm 16, md 20). Figma: half-star variants are named `Stars=4.5` etc. (the comma broke the variant names).
  - Quantity stepper: the value field is as wide as a button in both sizes (sm 36, was 40).
  - Cart item title focus radius `--focus-radius-inline`. Cart summary: no extra space above the total (8 px less); the note sits `--cart-summary-note-gap` (4) below the rows.
  - Filter group: the options are a `CheckboxGroup` with a hidden legend; the count sits in the label after a space (the wrapper with an 8 px gap is gone). Title and selected count with `--filter-heading-gap`, panel with `--filter-panel-gap`, range slider gap `--filter-range-gap`.
  - Badge: a trailing icon gets `--badge-trailing-icon-size`. Kbd: `--kbd-min-width` (20).
  - Combobox groups: 6 px above every group (`--combobox-group-padding-top`), 4 px around the line between groups (`--combobox-listbox-gap`).
  - Modal and Popover body: blocks are a column with `--modal-content-gap` and `--popover-content-gap` (8). Banner: title and text wrap with `--banner-text-gap` (6) between them.
  - Storybook logo (`src/docs/brand/Logo.css`) uses the `--logo-*` tokens and falls under the token lint. `_Logo` has no padding any more and `--logo-padding` is removed: the layout around the logo (Header, Sidebar) gives the space. The docs demo surface moved to `LogoDemo.css`.
  - Checkout options is a pattern, not a component: Figma keeps an example with two Selection card groups; the docs say so.
  - Figma only: placeholder icons removed from Product card, Gallery and Cart item; Swatch focus uses the focus ring effect; Checkout options built from Selection card group, then removed as a component; Spinner indicator is an arc without radii; Kbd min-width bound; Popover arrow overlap is a fixed −1. Focus variants without a background (Button tertiary and link, Nav item, Tabs, Pagination, Accordion) keep a surface fill in Figma, because Figma only draws a drop shadow from a visible fill; code stays transparent.
  - Removed tokens: `--product-card-icon-surface`, `--product-card-placeholder-icon-size`, `--gallery-icon-surface`, `--gallery-placeholder-icon-size`, `--cart-item-icon-surface`, `--cart-item-placeholder-icon-size`, `--swatch-swatch-border`, `--checkout-options-gap`, `--focus-surface-fallback`, `--popover-arrow-overlap`, `--logo-padding`.
  - Token lint: allowlist for the gallery thumbnail padding, the mobile date range panel and the logo mark size; `command-item-shortcut-*` and `input-help-icon-*` pending until PR 7. Lint config entries can be single files.
- **Round 4 (E-commerce, Utilities), values that Figma and code already shared:** new component tokens in Figma, bound to their layer, used in CSS: `--divider-width` (Divider, its label lines, Dropdown menu separator, Combobox group line, Page header line), `--featured-icon-sm|md|lg-size`, `--spinner-sm|md|lg-size`, `--spinner-sm|md|lg-stroke-width`, `--skeleton-text-height`, `--skeleton-circle-size`, `--skeleton-rect-height`, `--stock-dot-size`, `--product-card-swatch-size`, `--size-chip-min-width`, `--size-chip-height`, `--cart-button-count-size`, `--cart-button-count-font-size` (new primitives `sizing/3,5` = 14 and `sizing/30` = 120). CSS now also uses tokens that Figma already had: `--variant-options-row-gap`, `--variant-sizes-gap`, `--variant-sizes-row-gap`, `--variant-padding-vertical`, `--variant-radius`, `--filter-filters-gap`, `--filter-row-gap`, `--date-range-field-gap`, `--focus-radius-inline` (filter trigger), text token for the cart count weight. Figma fixes without visual change in code: Divider Label variant hugs its text (was 1 px high), Skeleton Lines variant hugs its lines (was 10 px high). Allowlist: product card and gallery overlay positions, minimum gap in cart summary rows, margin corrections of cart summary note and promo button, shimmer highlight, Combobox toggle hit area, wrap points of Add to cart and Date range trigger, deprecated flag xl. Token lint: `size-chip-*` count as component tokens. Nothing changes on screen.
- **Round 3, choices (15 November):** Breadcrumbs back link gap `--breadcrumb-gap` (8, was 4). Pagination compact text `--pagination-foreground` (tertiary, was secondary). Sidebar bottom group gap `--sidebar-gap` (24, was 16). Tabs panel `--tabs-panel-gap` (Figma: Tabs has a Panel slot and boolean Show panel). Table header actions `--table-header-actions-gap`; new `.rb-table__actions` with `--table-gap` for action buttons in a cell. Document download link and File upload icon use the Button icon-only classes (download: tertiary sm, icon 16, was 20; upload icon: secondary md, 40 incl. border, was 42). Metric card header without min-height. Metric grid `--metric-card-grid-gap` (Figma: Metric grid component). Focus radius `--focus-radius-inline` (Table sort, step link, document title) and `--focus-radius-panel` (tabs panel); Figma: `_Focus ring` on Foundations. Now also used: `--accordion-item-gap`, `--accordion-panel-gap` (open panel is a flex column), `--activity-content-gap` (2 px between title row and text, as Figma), `--activity-marker-column-gap` (connector position), `--card-content-gap` (Card children in `.rb-card__content`), `--description-list-description-list-padding-horizontal`. Removed: `--tag-surface-hover`, `--card-icon-surface`, `--card-media-icon-size`, `--page-header-breadcrumbs-gap`. Token lint: `focus-*` tokens in the mapped block count as component tokens.
- **Round 3 (Navigation, Data display, Content), values that Figma and code already shared:** new component tokens in Figma, bound to their layer, used in CSS: `--sidebar-width`, `--sidebar-panel-width`, `--nav-item-count-border-width`, `--nav-item-indicator-size`, `--nav-item-indicator-border-width`, `--tab-count-surface-selected`, `--tab-count-foreground-selected`, `--pagination-item-size`, `--step-indicator-size`, `--step-connector-width`, `--activity-marker-size`, `--activity-dot-size`, `--activity-connector-width`, `--document-list-dot-size`, `--accordion-border-width`, `--card-border-width`, `--empty-state-max-width`, `--file-upload-border-width`, `--file-upload-border-width-active` (new primitive `sizing/2,5` = 10). CSS now also uses tokens that Figma already had: `--table-border-width` (table card, header, toolbar, bulk bar; Figma table and cells bound too), `--table-header-gap`, `--table-search-and-filter-controls-gap`, `--table-table-view-controls-gap` (Figma: toolbar Tools gap on `table/toolbar-gap`), `--accordion-padding-horizontal`, `--file-upload-gap`, `--stepper-connector-radius`, text tokens for the person cell and the upload action. Figma: the Empty state in the Table sits in a centring frame (480 wide, as in code). Allowlist: nav item indicator and tooltip position, minimum gap of Pagination, Bottom navigation raise, wrap points of the toolbar search and activity title, minimum length of the vertical step connector (keuze 25). Nothing changes on screen.
- **Round 2, choices (15 November):** one close button (`_Close button` in Figma, internal `CloseButton` in code, `.rb-close` xs/sm/md) for Tag, Alert, Toast, Modal and Slideout, with `--close-button-*` tokens; the hit area stays outside the icon (negative margin, on the allowlist). Hover is now the same everywhere: surface plus darker icon (Alert had only a colour change, Modal and Slideout only a surface). Tag close icon 12 px in all sizes (was 14 at md and lg). Banner and Popover close and the Notification button use `ButtonIcon` (tertiary, sm and md): Popover close 36/16 (was 32/18), Banner close icon 16 (was 20), icon colour tertiary. Notification footer `--notification-footer-padding-vertical` and `--notification-footer-border-width`, list `--notification-items-max-height`. Command menu `--command-max-height`, `--command-foreground-input`, `--command-empty-padding-*` (Figma: set with State Default, Filled, No results). Dropdown menu `--menu-min-width`. Body colour `--modal-foreground-body`, `--slideout-foreground-body`. Tooltip `--tooltip-max-width`, arrow as a 12 x 6 triangle (`--tooltip-arrow-width`, `--tooltip-arrow-height`, was a rotated 8 px square). Toast region `--toast-region-gap`. Avatar group ring `--avatar-group-ring-width`, overlap `--avatar-group-xs|sm|md-overlap` (same values as before). Avatar status without min size. Removed: `--alert-close-icon-size`, `--alert-foreground-close`, `--modal-close-icon-size`, `--modal-foreground-close`, `--slideout-close-icon-size`, `--slideout-foreground-close`, `--tag-close-icon-size`, `--tag-foreground-icon`, `--avatar-avatar-padding-*`, `--avatar-more-padding-*`.
- **Round 2 (Badges & tags, Avatars, Feedback, Overlays), values that Figma and code already shared:** new component tokens in Figma, bound to their layer, used in CSS: `--badge-border-width`, `--badge-dot-size`, `--tag-border-width`, `--tag-dot-size`, `--status-indicator-dot-size`, `--avatar-border-width`, `--avatar-xs-size` to `--avatar-2xl-size` (also Avatar group), `--progress-track-height`, `--alert-border-width`, `--toast-width`, `--command-width`, `--modal-sm-width`, `--modal-md-width`, `--modal-lg-width`, `--slideout-sm-width`, `--slideout-md-width`, `--slideout-lg-width`, `--notification-count-size`, `--notification-panel-width`, `--notification-dot-size`, `--popover-width`. Figma: Dropdown menu panel now uses `menu/border-width`; new primitives `sizing/1,5` (6), `sizing/90` (360), `sizing/140` (560), `sizing/160` (640), `sizing/180` (720). Command item: active icon uses `--command-item-foreground` (as Figma). Avatar initials use the text token `--text-body-description-semibold-font-weight` (as Figma). Status and unread dots use `border-radius:50%` (an ellipse in Figma). Token lint allowlist: trigger distance of Dropdown menu, fallback position of Popover and Notification menu, Tooltip hover bridge, Command menu position on small screens (keuze 25). Nothing changes on screen: 152 stories, only the known round 1 differences against main.
- Tooling: `scripts/compare-stories.mjs` compares two Storybook builds pixel by pixel (`node scripts/compare-stories.mjs <old> <new>`, differences in `/tmp/shots`).
- **Round 1 (Action, Forms, Selection controls), values that Figma and code already shared:** new component tokens in Figma, bound to their layer, used in CSS: `--button-group-border-width`, `--slider-track-height`, `--slider-handle-border-width`, `--date-range-presets-width`, `--code-input-digit-width`, `--code-input-digit-height`, `--password-strength-segment-height`, `--calendar-switch-height`, `--calendar-weekday-height`, `--calendar-day-size`, `--calendar-cell-height`. CSS also uses existing tokens: `--button-icon-size` (icon-only buttons), `--select-chevron-icon-size` (Combobox chevron, select padding), `--input-leading-icon-size` and the input colours without fallback (Date range picker), `--password-input-gap`, `--calendar-row-gap`. Nothing changes on screen: 152 stories pixel-identical.
- **Round 1, choices (keuze 27):** Toggle size from `--toggle-track-width`, `--toggle-track-height` and `--toggle-knob-size` (size modes sm and md, `data-size` on the toggle; the knob travel is calculated, so md now slides all the way). Calendar: day 36 px in a 40 px cell (`--calendar-day-size`, `--calendar-day-cell-size`), header like Figma (no min-height and no correction). Password input: toggle from `--password-input-toggle-*` tokens and `aria-pressed`; 12 px between strength and requirements. Verification code: digit size from the screen-size mode (40 x 48 below 600 px, was below 400 px). Slider (`--slider-gap`, `--slider-row-gap`), required mark (`--input-required-foreground`, `--input-required-gap`), field actions (`--input-action-*`), Radio group and Selection card group (`--radio-group-*`, `--selection-card-group-*`), Selection card aside image (`--selection-card-aside-media-height`), Combobox empty text (`--combobox-empty-padding-vertical`).
- Figma: `_Password toggle` (Pressed and State), `_Field action`, Input slot Trailing action and boolean Required, Slider field, Radio group and Selection card group (6 options, show option 1 to 6), `_Combobox empty`, Selection card aside media, Calendar day as a 40 cell with a 36 circle.
- Token lint: `layerAllow` for a non-component token in one place with a reason (16 px input font on touch screens).
- Token reader (`scripts/lib/tokens.mjs`): a token in the mapped block is a component token, also when its value is a plain number (values from "∙ sizing" are exported as numbers). `tokens.json` now counts these as component.
- Token lint: technical CSS that Figma cannot set with a variable is on the allowlist, each with a reason (margin corrections, positions, gradients, box-shadow lines, screen margin of overlays, padding minus a 1 px border, visually hidden input, 24 px hit areas, 16 px input font for iOS, optical alignment). New match options `px` and `declValue`. Rule 4 (unused) only checks component tokens (keuze 18b). Report: px 271 → 190, unused 242 → 101.

### Changed (PR 6b-2, code)
- **Token export skips the category folder** (`scripts/figma-export-tokens.js`), so CSS names stay the same. `tokens.css` is exported again: 41 duplicate or obsolete tokens gone, 19 new (see below). `scripts/figma-lib.js` finds component tokens without the category too.
- Filter group: 8 px between options (`--filter-options-gap`, was 12). Variant picker: 8 px between label and action (`--variant-head-gap`, was 12); swatch ring and size chip from `--variant-swatch-ring-offset`, `--variant-swatch-ring-width`, `--size-chip-border-width` and `--size-chip-inset-width-checked`. Selection card: checked border from `--selection-card-border-width-checked`.
- Password input: requirement icon 20 px (`--password-input-icon-size`, was 16). File upload: 4 px between the text and the hint (`--file-upload-text-gap`), icon and percentage from `--file-upload-foreground-icon` and `--file-upload-percent-foreground`.
- Mini cart: note and subtotal grouped with 8 px (`--mini-cart-totals-gap`), 12 px to the buttons (`--mini-cart-footer-gap`). Cart item: image size from `--cart-item-media-size` (size mode on the image).
- Calendar cells padding from `--calendar-cells-padding-vertical(-sm)` and `--calendar-cells-padding-horizontal`. Slider track and fill radius from `--slider-track-radius` and `--slider-fill-radius`. Notification panel border from `--notification-panel-border-width`. Page header divider in the Divider colour.
- **Flag:** one token `--flag-width` with the size modes sm 16, md 20, lg 24 (`data-size` on the flag). `size="xl"` keeps working with a local value and is deprecated (removed in 2.0.0).
- Removed tokens: `--flag-sm-width`, `--flag-md-width`, `--flag-lg-width`, `--flag-xl-width`, `--skeleton-highlight`, `--combobox-toggle-width`, `--bottom-nav-action-offset` (technical values are local CSS variables now), `--combobox-foreground-icon` (Combobox uses `--input-foreground-icon`), `--page-header-border`, `--metric-card-icon-size`, `--password-input-requirement-icon-size`, `--alert-foreground-action`, `--avatar-icon-size` and the duplicates listed under the Figma part.

### Changed (Figma, PR 6b-2, part 2)
- Featured icon: the icon has the colour of its variant (was grey in every colour). Calendar size, Combobox list max height and Metric card trend icon bound to their tokens. New states: Avatar status Offline, Table cell State=Hover, Date range preset (Default, Hover, Current), Bottom nav action Hover, Skeleton Type=Lines. Flags: width from `size/flag`, placeholder flag added.

### Changed (Figma, PR 6b-2)
- **Component tokens in folders per category** (`component-tokens/<category>/<component>/…`), like the Figma pages: action, forms, selection-controls, badges-and-tags, avatars, feedback, overlays, navigation, data-display, content, e-commerce, utilities. CSS names stay the same: the token export will skip the category level (code step of PR 6b-2). Until then, do not run the old export.
- **Duplicate component tokens removed.** Layers now use the token the code uses: `header/border-width`, `slideout/border-width`, `selection-card/border-width`, `step/indicator-border-width`, `kbd/border-width` (Command menu, Search input, Sidebar, Table), `calendar/border-width`, `input/foreground-label`, `-hint`, `-error` (Verification code), `progress/gap` and `progress/radius` (File upload), `input/leading-icon-size` (Select). 22 duplicates deleted, among them `size-chip/size-chip-border-width`, `variant/size-chip-border-width`, `swatch/swatch-border-width`, `password-input/requirement-icon-size`, `alert/foreground-action`, `avatar/icon-size`, `mini-cart/totals-padding-top` and `mini-cart/totals-border-width`.
- Renamed: `selection-card/border-width-checked`, `variant/swatch-ring-width`, `notification/panel-border-width`, `file-upload/foreground-icon`, `calendar/cells-padding-vertical` and `-sm`.
- New: `filter/options-gap` (8), `variant/head-gap` (8), `variant/swatch-ring-offset` (2), `size-chip/inset-width-checked` (1), `calendar/cells-padding-horizontal` (4), `mini-cart/footer-gap` (12).
- Filter group: options in their own frame with 8 px between them; slider track and fill fully rounded; the range shows one row with the chosen values, like the code.
- Variant picker: the swatch ring is a stroke with padding (2 px ring, 2 px gap); a selected size chip has the control border plus a 1 px inner shadow; 8 px between the label and the action.
- Password input: requirement icon 20 px. Avatar: the icon is half the avatar size in every size; initials stay centered. Cart item: the image follows the size (md 96 px, sm 64 px, new `size/cart-item-media` and `cart-item/media-size`), so the actions fit in the Mini cart. Calendar: month and year views have padding at the bottom and sides too.
- Slideout: the footer is a slot. Mini cart uses it: totals (8 px) and full-width Checkout and View cart buttons, 12 px apart.
- Alert and Toast: the actions are Link buttons (sm), like the code.

### Added
- `scripts/figma-scan-6b2.js`: read-only scan of the Figma file for PR 6b-2. Lists pages per category, component token groups, where each duplicate component token is bound, and the layer tree of the components in the Figma ≠ code choices. Run it with the Figma MCP `use_figma` tool or the Scripter plugin.

### Fixed
- **Badge, Cart button, Active filters follow Figma (4 px grid):** the icon in a large Badge is 12 px (was 14 px). The Cart button count has 4 px side padding (was 5 px), from `--cart-button-count-padding-horizontal`. Active filters that wrap have 8 px between rows (was 12 px), from `--filter-row-gap`; the space between filters stays 12 px (`--filter-gap`).
- Component CSS uses 46 more component tokens that were bound in Figma but not used in code, for example the File upload item padding, the Checklist item padding, the Notification header and count, the Stepper text and indicator, the Select chevron, the Search icons and the Modal close icon. Nothing changes on screen: 304 screenshots are pixel-identical, and every token has the same value in all styles, themes, sizes and screen sizes.
- Component CSS uses the component tokens from Figma in 189 more places (padding, gap, border width, radius, icon size, colors), so a change in Figma reaches the code. Nothing changes on screen: 304 screenshots (152 stories in Iris Light and Berry Dark) are pixel-identical before and after.
- **Every text is a prop (H6).** Components with fixed English text get a `labels` prop. The English defaults are exported as `DEFAULT_<COMPONENT>_LABELS`, so you pass only what you change: Price, Rating, StockIndicator, CartItem, CartSummary, PromoCode, CartButton, MiniCart, AddressFields, FilterGroup, ActiveFilters, ProductGallery, VariantPicker, AddToCart, ProductCard, FileUploadItem, Tag, Avatar, AvatarGroup, DateRangePicker, PasswordInput, NotificationPanel, CommandMenu and Combobox. Breadcrumbs (`backLabel`, `aria-label`), Pagination, Stepper and BottomNavigation (`aria-label`) and Banner (`regionLabel`) get a single prop. `defaultDateRangePresets(today, labels)` and `passwordRequirements(labels)` translate the quick picks and the password rules.
- **Modal, Slideout and Command menu (M2):** a click on the backdrop closes only when the press also started there, so selecting text and letting go outside keeps them open. A `<form method="dialog">` inside closes them through `onClose`, so they open again. The page behind does not scroll. Modal: no empty spacer without a footer.
- **Command menu:** the dialog, the search field (Search) and the result list (Results) have their own names. Item ids with a space or other characters give valid ids.
- **Combobox (M3):** one live region outside the list announces the number of results (it was inside the list and appeared with its text). `required` checks the chosen option, not the typed text. Leaving the field empty clears the value: `onChange(null, null)`. The list is named by the label, also when the label is not a string.
- **Tooltip** opens in the top layer: a Modal or a table no longer clips it. It moves to the other side when there is no room.
- **Escape in a panel inside a Modal closes only the panel**: Dropdown menu, Popover, Date picker, Date range picker and Tooltip. Before, the Modal closed too.
- **A Toast stays visible and is read while a Modal, Slideout or Command menu is open.** `ToastRegion` renders inside the open dialog. A toast has no `role="status"` of its own anymore: the region is the live region, so it is not announced twice.
- **Panels are no longer clipped** by a Modal, a scroll area or a table: Dropdown menu, Popover, Date picker, Date range picker, Notification menu and the Combobox list open in the top layer (`popover` attribute). They open above the trigger when there is no room below, and stay inside the screen.
- Popover, Date picker, Date range picker and Notification menu close when the focus leaves them (Tab) (WCAG 2.4.11). A click outside closes them without moving the focus back to the trigger.
- Tooltip: the pointer can move onto the tooltip, and Escape hides it also when it is open by hover (WCAG 1.4.13).
- Dropdown menu: the own `onClick` and `ref` of the trigger keep working. Arrow down or up on the trigger opens the menu on the first or last item. Typing a letter moves to the next item that starts with it. Removed items no longer stay in the arrow-key order.
- `--table-header-padding-vertical` is declared once (12 px). The Figma variable for the table card header got its own name.
- Figma: Input in State=Error focus has the Focus ring/error effect style. Command item and Combobox option are 36 px, like in CSS.
- `@rbbds/ui/tokens.css` and `tokens.json` now include the effect styles: `--shadow-xs` to `--shadow-2xl`, `--focus-ring`, `--focus-ring-error` and `--focus-ring-inset`. Before, they were only in `styles.css`.
- `tokens.json`: `--effects-shadows-*` (shadow colours per theme) are in the semantic group, not component.
- `FileUploadItem`: the remove button said "Verwijder …" in Dutch. It now says "Remove …".
- `DateRangePicker`: screen readers now hear the label and the chosen period on the button. Before, only the label was read.
- `Input`, `Select`, `Textarea`: your own `aria-describedby` is added to the hint or error. Before, it replaced them.
- `NotificationItem`: the focus ring is fully visible. It was cut off at the sides of the list. New effect token `--focus-ring-inset`.
- `Avatar`: no `role="img"` without a name. `Checkbox`: no `aria-checked` on the native checkbox. `Divider` with a label: the label is read (no `role="separator"`). `PasswordInput`: the show/hide button changes its name only (no `aria-pressed`).
- `Tabs`: a `value` that matches no tab falls back to the first tab, so the tab list can always be reached with Tab. `Accordion`: panels are a region only with 6 items or fewer.
- `tokens.json`: when a token is declared twice, it now takes the last value, like the browser. `--table-header-padding-vertical` was 20 px in tokens.json and 12 px in CSS.
- `scripts/figma-export-tokens.js` stops when two Figma variables give the same CSS name.
- `llms.txt` and the guides: Forest (not Berry) uses Source Serif 4; Button group is 40 px and Quantity stepper 36 or 40 px; a token name that did not exist is replaced; fixed texts that are not a prop yet are listed.
- Versioning guide: a size correction of up to 2 px is a small visual fix, not a breaking change.

### New
- `scripts/suggest-component-tokens.mjs`: finds a component token for a loose value in component CSS. It only suggests a token with exactly the same value in every style, theme, size and screen size; `--apply` writes them. Settings (block aliases, preferred and excluded matches) in `scripts/token-lint.config.mjs`.
- `initialFocus` on Modal and Slideout: the element that gets focus when they open, e.g. the first field of a form.
- `npm run check:strings` in CI: fails on fixed user-facing text in component JSX (JSX text, aria-label, title, placeholder, label and other text props, and text built in a variable).
- `src/utils/panel.ts`: one shared layer for panels (Escape for the topmost panel only, focus out, click outside, top layer and placement). Covered by `tests/browser` in Chromium and WebKit.
- `npm run check:contrast`: checks control borders and the active option for 3:1 in every style and theme. Runs in CI and fails below 3:1.
- Tokens for Mega menu, Mobile nav and the expanded Header nav item (from Figma). The React components follow later.
- `npm run lint:tokens`: token-lint in CI, as a report in the job summary and an artifact (it does not fail the build yet). Rules: no px in component CSS outside a short allowlist, only component tokens in component CSS (plus `--text-*`, `--shadow-*`, `--focus-ring*`), no `var()` to a token that does not exist, unused tokens and duplicate tokens. Settings and allowlist in `scripts/token-lint.config.mjs`.
- `npm run test:browser`: Playwright tests in Chromium and WebKit for keyboard and screen reader behaviour that axe cannot check. They run in CI.
- `@rbbds/ui/tokens.json`: all tokens in the Design Tokens (DTCG) format, with value, type, CSS name and values per brand, theme and screen size. Built with every release.
- `llms.txt` in the package: how MyUI is built and the rules for AI assistants (layers, naming, sizes, accessibility).
- Tokens `--qty-size-md` (40 px) and `--qty-size-sm` (36 px).
- Docs: guide **Building components** with the build rules for Figma: variant and base, padding on the element you click, containers and groups, indent and alignment, the 4 px grid (half steps allowed), focus and tokens.
- Tokens `--notification-empty-padding-vertical`, `--notification-empty-gap` and `--mini-cart-totals-padding-top`.

### Removed
- 15 component and text tokens that no layer in Figma and no CSS used: `--text-body-link-bold-*` (4), `--sidebar-foreground-heading`, `--date-range-gap`, `--settings-gap`, `--code-input-foreground-placeholder`, `--copy-input-foreground-copied`, `--header-logo-mark-gap`, `--header-mark-radius`, `--header-mark-surface`, `--header-wordmark-foreground`, `--page-header-icon-size` and `--page-header-icon-surface`. If you used one in your own CSS, use the semantic token it pointed to.

### Changed
- `useDismiss` (exported from Popover) is deprecated and will be removed in 2.0.0. It now also closes when the focus leaves the element.
- **Control heights follow the 4 px grid: 36 (sm), 40 (md), 48 (lg).** The border is now inside the height, in Figma and in CSS (`calc(padding - border width)`). Most controls get 2 px lower; Button lg gets 2 px higher (46 to 48).
  - Button: 36 / 40 / 48. `--button-lg-padding-vertical` is 12 px (was 10). Icon-only buttons are square: 36 / 40 / 48, with icons of 16 / 20 / 24 px.
  - Input, Select, Search input: 36 / 40 / 48. `--input-lg-padding-vertical` is 12 px (was 10).
  - Button group: 40. Quantity stepper: 40 (md, was 44) and 36 (sm).
  - Tag and Badge: 20 / 24 / 28 (were 22 / 26 / 30). Kbd: 20. Link buttons have no border, so they are as high as their text.
- Tag: the close button has a click area of 24 × 24 px (WCAG 2.5.8). It looks the same.
- Button link sm and md: the click area is 24 px high (the text is 20 px). It looks the same. Link lg is already 24 px.
- Figma: borders do not count in the layout in any component. Tab is 36 px: the indicator lies over the bottom edge, like in CSS.
- Guide Building components: control heights and the border rule.
- `Kbd`: vertical padding is 2 px (was 1 px), so it fits the 4 px grid with half steps. The key is 2 px higher.
- Notification panel: the empty state uses its own tokens. It looks the same.
- Variant swatch: the focus ring uses `--focus-ring`, like all other components.
- Figma: every Focus variant uses the effect style Focus ring/brand (Focus ring/error for destructive buttons). Mobile nav item and Bottom nav item had a 2 px focus border instead; Code digit and Swatch had no ring.
- **Form controls have a border of at least 3:1** (WCAG 1.4.11) in every style and theme. New tokens `--color-border-control` and `--color-border-control-hover`. Input, Select, Search input, Combobox, Code input, Checkbox, Radio and the off track of Toggle use them. `--gray-400` is a little darker (`#9aa4b2` to `#838d9a`) so it reaches 3:1; this also makes `--color-border-strong` and disabled text a little darker in Light.
- **Checkbox and Radio are as high as the line height of their label**: 20 px (sm) and 24 px (md) on desktop, 16 and 20 px on small screens. The control no longer needs a top offset. New tokens `--selection-control-size`, `--selection-border-width`, `--radio-indicator-size`; `--checkbox-indicator-icon-size` follows the size. `--selection-control-offset` is removed.
- Button: the border width follows the style (`--brand-border-width-control-default`): 1 px in Iris and Forest, 2 px in Berry. The height stays the same.
- Combobox and Command menu: the option you reach with the arrow keys has a 2 px inside border in the focus color (WCAG 2.4.7). Before, only the background changed (1.05:1). New tokens `--menu-item-border-active`, `--menu-item-border-width-active`, `--command-item-border-active`, `--command-item-border-width-active`.
- Dropdown menu and Combobox list: the border width uses the new token `--menu-border-width`.
- Table card: the header above the table uses `--table-card-header-padding-vertical` (20 px, as before).

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
