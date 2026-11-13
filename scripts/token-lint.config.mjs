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
};
