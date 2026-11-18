// Settings for scripts/lint-tokens.mjs. Keep the allowlist short and give every entry a reason.
export default {
  // Token sources (generated from Figma). Not linted as component CSS.
  tokenFiles: ['src/styles/tokens.css', 'src/styles/effects.css'],

  // Component CSS: rules 1 to 3 apply here.
  componentCss: ['src/components', 'src/flags', 'src/docs/brand/Logo.css'],

  // Where a token counts as used (rule 4). Storybook docs (src/docs) do not count, except the MyUI logo (same tokens as _Logo in Figma):
  // a token that only a docs page shows is still unused by the library.
  usageSources: ['src/components', 'src/flags', 'src/styles', 'src/templates', 'src/docs/brand/Logo.css'],

  // Rule 4 only checks these layers (keuze 18b): primitives, brand and the semantic alias layer may
  // be unused; component tokens must be used in code (and bound in Figma).
  unusedLayers: ['component'],

  // Temporary: component tokens for components that are in Figma but not in code yet.
  // Remove the entry in the PR that builds the component.
  unusedPending: [
  ],

  // Rule 6 (check of 17 November, review L7): values Figma has no variable for. Only these values may appear in component CSS.
  // A new value needs an entry here with a reason, or a token.
  rawAllow: [
    { kind: 'z-index', values: ['1', '2', '3', '4', '5'], reason: 'Stacking inside one component, for example a focused or current item above the shared border of its neighbours.' },
    { kind: 'z-index', values: ['20', '30', '40', '50', '60'], reason: 'Layer order without popover support (fallback): 20 date and combobox panels, 30 popover and notifications, 40 menu and header panel, 50 tooltip, 60 toasts. With popover support these panels sit in the top layer and z-index does not matter.' },
    { kind: 'duration', values: ['.12s', '.15s', '.2s', '.22s'], reason: 'Short transitions (hover, open, slide). Figma has no motion tokens; base.css turns motion off with prefers-reduced-motion.' },
    { kind: 'duration', values: ['.8s', '1s', '1.6s'], reason: 'Loop speed of Spinner (.8s), Button loading (1s) and Skeleton shimmer (1.6s).' },
    { kind: 'radius', values: ['50%'], reason: 'A circle (status dot, slider thumb, radio, avatar ring). Figma draws these as an ellipse or with border/radius/full; 50% stays round at every size.' },
  ],

  // Tokens outside the component layer that component CSS may use.
  // text-*: text styles (Figma text styles). shadow-*, focus-ring*: effect styles.
  allowedNonComponent: ['text', 'shadow', 'focus-ring'],
  // A non-component token in one place, with a reason (technical, like pxAllow).
  layerAllow: [
    { selector: '\\.rb-control__input', token: 'font-size-400', reason: 'Inputs below 16 px make iOS zoom in on focus; small inputs keep 16 px on touch screens.' },
    { selector: '^\\.rb-menu$', token: 'spacing-1', reason: 'Distance between trigger and panel (--rb-layer-gap), keuze 25. Figma draws the panel without its trigger.' },
    { selector: '^\\.rb-(popover|popover--arrow|notif-menu__panel)$', token: 'spacing-2', reason: 'Fallback position below the trigger without popover support, keuze 25.' },
    { selector: '^\\.rb-tooltip::before$', token: 'spacing-2', reason: 'Invisible hover bridge to the trigger (WCAG 1.4.13), keuze 25.' },
    { selector: '^\\.rb-nav-item__dot$', token: 'spacing-1', reason: 'Position of the indicator on the collapsed nav item (top, right), keuze 25.' },
    { selector: '^\\.rb-nav-item__tip$', token: 'spacing-2', reason: 'Position of the tooltip next to the collapsed nav item, keuze 25.' },
    { selector: '^\\.rb-product-card__badge$', token: 'spacing-3', reason: 'Position of the badge on the product image, keuze 25.' },
    { selector: '^\\.rb-product-card__wish$', token: 'spacing-2', reason: 'Position of the wishlist button on the product image, keuze 25.' },
    { selector: '^\\.rb-gallery__(nav--prev|nav--next|counter)$', token: 'spacing-3', reason: 'Position of the arrows and counter on the gallery image, keuze 25.' },
    { selector: '^\\.rb-cart-summary__row$', token: 'spacing-4', reason: 'Minimum space between label and amount (justify-content: space-between). Figma uses Auto spacing.' },
    { selector: '^\\.rb-promo__form>\\.rb-button$', token: 'spacing-1-5', reason: 'Aligns the button with the input below the label (margin correction, keuze 16).' },
    { selector: '^\\.rb-skeleton$', token: 'color-surface-secondary', reason: 'Highlight in the shimmer gradient (keuze 16: gradients are technical CSS).' },
    { selector: '^\\.rb-pagination$', token: 'spacing-3', reason: 'Minimum space between previous, pages and next (justify-content: space-between). Figma uses Auto spacing, which has no minimum.' },
  ],

  // px values that are allowed in component CSS: technical CSS that Figma cannot set with a variable
  // (keuze 16 en 18d). Match on property (regex), value (exact px), px (regex on the px value),
  // declValue (regex on the whole value), selector (regex) and file. Every entry has a reason.
  pxAllow: [
    { property: '^flex(-basis)?$', reason: 'Wrap point of a flex layout (flex: 1 1 280px). Layout logic, not a design value.' },
    { property: '^grid-template-columns$', declValue: 'minmax\\(', reason: 'Wrap point of a grid (minmax(240px, 1fr)). Layout logic, like flex-basis.' },
    { property: '^text-underline-offset$', reason: 'Figma has no variable for underline offset.' },
    { property: '^margin', px: '^-', reason: 'Margin correction: pulls a padded hit area back into line. Figma draws the result, not the correction.' },
    // Positions and offsets (check of 17 November: was one rule for every position; now per selector, so a new value is visible).
    { property: '^(top|right|bottom|left)$', selector: '^\\.rb-toast-region$', reason: 'Screen margin of the toast region (16 px, 24 px from 600 px). Figma places it on the frame without variables.' },
    { property: '^(top|right|bottom|left)$', selector: '^\\.rb-tooltip--(top|right|bottom|left)$', px: '^8px$', reason: 'Fallback distance of a tooltip without popover support (keuze 25).' },
    { property: '^top$', selector: '^\\.rb-menu$', px: '^4px$', reason: 'Fallback distance of a menu without popover support (keuze 25).' },
    { property: '^(top|right)$', selector: '^\\.rb-notif-button__count$', px: '^2px$', reason: 'Offset of the count on the bell icon. Figma places it absolute without variables.' },
    { property: '^bottom$', selector: '^\\.rb-activity__item:not\\(:last-child\\)::before$', px: '^4px$', reason: 'End of the timeline line, just above the next dot.' },
    { property: '^transform$', selector: 'rb-toggle__knob$', px: '^20px$', reason: 'Knob travel of the md toggle (track minus knob minus inset). Figma uses two variants, no variable.' },
    { property: '^background-image$', reason: 'Gradient stop (strike-through line, shimmer). Figma has no variables for gradient geometry.' },
    // Box-shadow lines (per selector since the check of 17 November).
    { property: '^box-shadow$', selector: '^\\.rb-flag::after$', px: '^1px$', reason: 'Hairline edge so a white flag stays visible on white. Figma: inside stroke on the flag.' },
    { property: '^box-shadow$', selector: '^\\.rb-tabs__list--underline$', px: '^-1px$', reason: 'Track under the tabs drawn as an inset line, so it does not add height.' },
    { property: '^box-shadow$', selector: '^\\.rb-tabs__list--underline \\.rb-tab\\[aria-selected="true"\\](:focus-visible)?$', px: '^-2px$', reason: 'Indicator of the selected tab, drawn inside the tab. Candidate for a token (tabs/indicator-width): Figma first.' },
    { property: '^box-shadow$', selector: '^\\.rb-avatar__status$', px: '^1\\.5px$', reason: 'Ring between the status dot and the avatar. Off the grid; candidate for a token (avatar/status-ring-width): Figma first.' },
    { declValue: 'calc\\(100(vw|dvh) - 32px\\)', px: '^32px$', reason: 'Screen margin: an overlay never touches the edge of a small screen.' },
    { declValue: '- 1px\\)', px: '^1px$', reason: 'Padding minus the 1 px border, so the outer size stays on the 4 px grid.' },
    { selector: '\\.rb-variant__input$', reason: 'Visually hidden native input (1 x 1 px).' },
    { selector: '::after$', property: '^(width|height)$', value: '24px', reason: 'Invisible hit area of 24 x 24 px (WCAG 2.5.8 target size).' },
    { selector: '\\.rb-code__input$', property: '^font-size$', value: '16px', reason: 'Inputs below 16 px make iOS zoom in on focus.' },
    { selector: '^\\.rb-close--(xs|sm|md)$', property: '^--_p$', reason: 'Hit area around the close icon (padding with an equal negative margin), keuze 25. In Figma the hover surface sits outside the icon.' },
    { selector: '^\\.rb-combobox__toggle$', property: '^--_toggle-w$', reason: 'Hit area of the toggle button inside the field (keuze 25; Figma token removed in 6b-2).' },
    { selector: '^\\.rb-add-to-cart__button$', property: '^min-width$', reason: 'Wrap point: the button moves below the quantity stepper under 180 px. Layout logic.' },
    { selector: '^\\.rb-daterange \\.rb-control$', property: '^min-width$', reason: 'Minimum width of the trigger so a full range fits on one line. Layout logic.' },
    { selector: '^\\.rb-flag--xl$', property: '^--_flag-w$', reason: 'Deprecated size xl (32), kept until 2.0.0. Figma has sm, md and lg.' },
    { selector: '^\\.rb-bottom-nav__action$', property: '^--_raise$', reason: 'How far the center action rises above the bar (transform offset), keuze 25.' },
    { selector: '^\\.rb-table-toolbar__start>\\.rb-field$', property: '^min-width$', reason: 'Wrap point of the search field in the toolbar (with flex-basis 280px). Layout logic.' },
    { selector: '^\\.rb-activity__title$', property: '^min-width$', reason: 'Wrap point of the title row (title and time wrap below 160 px). Layout logic.' },
    { selector: '^\\.rb-stepper--vertical \\.rb-step__connector$', property: '^min-height$', reason: 'Minimum length of the vertical connector when a step has little text. Figma draws a fixed step height.' },
    { selector: '^\\.rb-command$', property: '^margin-top$', reason: 'Position of the command menu on small screens (distance from the top edge), keuze 25.' },
    { selector: '^\\.rb-gallery__thumbs$', property: '^padding$', reason: 'Room for the thumbnail border and focus ring inside the scroll row (overflow clips them). Figma does not scroll (keuze 32).' },
    { selector: '^\\.rb-daterange__panel$', property: '^width$', reason: 'Mobile fallback width of the date range panel (one month). Figma shows the desktop panel (keuze 32).' },
    { selector: '^\\.myui-logo__mark$', property: '^(inline|block)-size$', reason: 'Logo artwork drawn on a 32 grid (viewBox 0 0 32 32). Fixed artwork size, not a design value.' },
    { selector: '(\\.rb-accordion__trigger svg|\\.rb-notif__dot)$', property: '^margin-top$', reason: 'Optical alignment of an icon or dot with the first line of text.' },
  ],

  // CSS block names that differ from the token prefix (scripts/suggest-component-tokens.mjs).
  blockAliases: { file: 'file-upload-item', upload: 'file-upload', notif: 'notification', dlist: 'description-list', qty: 'qty', metric: 'metric-card', password: 'password-input', code: 'code-input', copy: 'copy-input', gallery: 'gallery', setting: 'setting-row', promo: 'promo-code', variant: 'variant', daterange: 'date-range', doclist: 'document-list', doc: 'document-item', datepicker: 'date-picker', control: 'input', field: 'input', range: 'range-slider', 'notif-panel': 'notification-panel', 'notif-button': 'notification-button', check: 'selection' },

  // When several tokens fit, use this one.
  suggestPrefer: [
    { selector: '.rb-cart-summary__row--total', property: 'border-top', token: 'cart-summary-total-border-width' },
  ],

  // Suggestions with the same value but another meaning. Do not apply them.
  suggestExclude: [
    { selector: '.rb-combobox__toggle svg', property: 'width', token: 'combobox-check-icon-size', reason: 'Chevron, not the check icon.' },
    { selector: '.rb-combobox__toggle svg', property: 'height', token: 'combobox-check-icon-size', reason: 'Chevron, not the check icon.' },
    { selector: '.rb-calendar__header', property: 'gap', token: 'calendar-cells-gap', reason: 'Header, not the grid.' },
    { selector: '.rb-calendar__header', property: 'padding-inline-start', token: 'calendar-view-switch-padding-horizontal', reason: 'Header, not the switch.' },
    { selector: '.rb-upload__icon svg', property: 'width', token: 'file-upload-done-icon-size', reason: 'Upload icon, not the done icon.' },
    { selector: '.rb-upload__icon svg', property: 'height', token: 'file-upload-done-icon-size', reason: 'Upload icon, not the done icon.' },
    { selector: '.rb-control__chevron svg', property: 'width', token: 'input-leading-icon-size', reason: 'Chevron, not the leading icon.' },
    { selector: '.rb-control__chevron svg', property: 'height', token: 'input-leading-icon-size', reason: 'Chevron, not the leading icon.' },
    { selector: '.rb-control__trigger svg', property: 'width', token: 'input-leading-icon-size', reason: 'Calendar button, not the leading icon.' },
    { selector: '.rb-control__trigger svg', property: 'height', token: 'input-leading-icon-size', reason: 'Calendar button, not the leading icon.' },
    { selector: '.rb-notif__dot', property: 'border-radius', token: 'notification-count-radius', reason: 'Unread dot, not the count badge.' },
    { selector: '.rb-cart-summary__row', property: 'gap', token: 'cart-summary-gap', reason: 'Unclear if this token is for the row or the summary.' },
    { selector: '.rb-filter__list', property: 'gap', token: 'filter-gap', reason: 'Unclear if this token is for the list or the filter group.' },
  ],
};
