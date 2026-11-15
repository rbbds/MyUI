# Figma binding scan

File: WL Design System (rbbds). Scanned 2026-11-15T20:48:30.840Z with `scripts/figma-binding-scan.js` (read-only): 113 pages, 57118 layers, 1236 component tokens.
Counted: layer fields, fills, strokes, effects and text ranges (also hidden layers in instances), aliases and styles.

| Check | Result |
| --- | ---: |
| Component tokens without a binding | 1 |
| … of which pending (token-lint `unusedPending`) | 1 |
| Code syntax differs from the CSS name | 0 |

## Without a binding

| Token | CSS | In tokens.css | Pending |
| --- | --- | --- | --- |
| `navigation/mega-menu-link/icon-foreground` | `--mega-menu-link-icon-foreground` | yes | PR 8 (Mega menu and Mobile nav in React) |


## Exceptions

- Focus variants without a background: Button, Button destructive and Button icon (Tertiary, Link), Nav item, Tabs (Underline, Pill), Pagination item, Accordion: fill base-tokens/color/surface/primary (semantic, not a component token). Figma only draws a drop shadow (Focus ring effect style) from a visible fill. Code stays transparent (keuze 32).

Run the scan again after every token export and commit the new JSON (keuze 18b).
