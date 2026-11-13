// Settings for scripts/lint-tokens.mjs. Keep the allowlist short and give every entry a reason.
export default {
  // Token sources (generated from Figma). Not linted as component CSS.
  tokenFiles: ['src/styles/tokens.css', 'src/styles/effects.css'],

  // Component CSS: rules 1 to 3 apply here.
  componentCss: ['src/components', 'src/flags'],

  // Where a token counts as used (rule 4). Storybook docs (src/docs) do not count:
  // a token that only a docs page shows is still unused by the library.
  usageSources: ['src/components', 'src/flags', 'src/styles', 'src/templates'],

  // Tokens outside the component layer that component CSS may use.
  // text-*: text styles (Figma text styles). shadow-*, focus-ring*: effect styles.
  allowedNonComponent: ['text', 'shadow', 'focus-ring'],

  // px values that are allowed in component CSS. Match on property (regex), value, selector (regex), file.
  pxAllow: [
    { property: '^flex(-basis)?$', reason: 'Wrap point of a flex layout (flex: 1 1 280px). Layout logic, not a design value.' },
    { property: '^text-underline-offset$', reason: 'Figma has no variable for underline offset.' },
  ],

  // CSS block names that differ from the token prefix (scripts/suggest-component-tokens.mjs).
  blockAliases: { file: 'file-upload-item', upload: 'file-upload', notif: 'notification', dlist: 'description-list', qty: 'qty', metric: 'metric-card', password: 'password-input', code: 'code-input', copy: 'copy-input', gallery: 'gallery', setting: 'setting-row', promo: 'promo-code', variant: 'variant', daterange: 'date-range', doclist: 'document-list', doc: 'document-item', datepicker: 'date-picker', control: 'input', field: 'input', range: 'range-slider', 'notif-panel': 'notification-panel', 'notif-button': 'notification-button', check: 'selection' },

  // When several tokens fit, use this one.
  suggestPrefer: [
    { selector: '.rb-cart-summary__row--total', property: 'border-top', token: 'cart-summary-total-border-width' },
    { selector: '.rb-password__reqs svg', property: 'width', token: 'password-input-requirement-icon-size' },
    { selector: '.rb-password__reqs svg', property: 'height', token: 'password-input-requirement-icon-size' },
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
