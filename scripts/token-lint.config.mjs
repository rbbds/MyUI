// Settings for scripts/lint-tokens.mjs. Keep the allowlist short and give every entry a reason.
export default {
  // Token sources (generated from Figma). Not linted as component CSS.
  tokenFiles: ['src/styles/tokens.css', 'src/styles/effects.css'],

  // Component CSS: rules 1 to 3 apply here.
  componentCss: ['src/components', 'src/flags'],

  // Where a token counts as used (rule 4). Storybook docs (src/docs) do not count:
  // a token that only a docs page shows is still unused by the library.
  usageSources: ['src/components', 'src/flags', 'src/styles', 'src/templates'],

  // Rule 4 only checks these layers (keuze 18b): primitives, brand and the semantic alias layer may
  // be unused; component tokens must be used in code (and bound in Figma).
  unusedLayers: ['component'],

  // Temporary: component tokens for components that are in Figma but not in code yet.
  // Remove the entry in the PR that builds the component.
  unusedPending: [
    { prefixes: ['mega-menu', 'mobile-nav', 'header-nav-item'], until: 'PR 8 (Mega menu and Mobile nav in React)' },
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
  ],

  // px values that are allowed in component CSS: technical CSS that Figma cannot set with a variable
  // (keuze 16 en 18d). Match on property (regex), value (exact px), px (regex on the px value),
  // declValue (regex on the whole value), selector (regex) and file. Every entry has a reason.
  pxAllow: [
    { property: '^flex(-basis)?$', reason: 'Wrap point of a flex layout (flex: 1 1 280px). Layout logic, not a design value.' },
    { property: '^grid-template-columns$', declValue: 'minmax\\(', reason: 'Wrap point of a grid (minmax(240px, 1fr)). Layout logic, like flex-basis.' },
    { property: '^text-underline-offset$', reason: 'Figma has no variable for underline offset.' },
    { property: '^margin', px: '^-', reason: 'Margin correction: pulls a padded hit area back into line. Figma draws the result, not the correction.' },
    { property: '^(top|right|bottom|left|inset|transform)$', reason: 'Position or offset of a layer (arrow, badge on an icon, toast region, toggle knob travel). Figma sets positions without variables.' },
    { property: '^background-image$', reason: 'Gradient stop (strike-through line, shimmer). Figma has no variables for gradient geometry.' },
    { property: '^box-shadow$', reason: 'Box-shadow line used as a ring or an inside border (tab track, avatar ring, flag edge). Figma draws these as strokes or effects.' },
    { declValue: 'calc\\(100(vw|dvh) - 32px\\)', px: '^32px$', reason: 'Screen margin: an overlay never touches the edge of a small screen.' },
    { declValue: '- 1px\\)', px: '^1px$', reason: 'Padding minus the 1 px border, so the outer size stays on the 4 px grid.' },
    { selector: '\\.rb-variant__input$', reason: 'Visually hidden native input (1 x 1 px).' },
    { selector: '::after$', property: '^(width|height)$', value: '24px', reason: 'Invisible hit area of 24 x 24 px (WCAG 2.5.8 target size).' },
    { selector: '\\.rb-code__input$', property: '^font-size$', value: '16px', reason: 'Inputs below 16 px make iOS zoom in on focus.' },
    { selector: '^\\.rb-close--(xs|sm|md)$', property: '^--_p$', reason: 'Hit area around the close icon (padding with an equal negative margin), keuze 25. In Figma the hover surface sits outside the icon.' },
    { selector: '^\\.rb-command$', property: '^margin-top$', reason: 'Position of the command menu on small screens (distance from the top edge), keuze 25.' },
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
