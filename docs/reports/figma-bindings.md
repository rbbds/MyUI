# Figma binding scan

File: WL Design System (rbbds). Scanned 2026-11-16T11:08:31.557Z with `scripts/figma-binding-scan.js` (read-only): 113 pages, 57680 layers, 1243 component tokens.
Counted: layer fields, fills, strokes, effects and text ranges (also hidden layers in instances), aliases and styles.

| Check | Result |
| --- | ---: |
| Component tokens without a binding | 0 |
| … of which pending (token-lint `unusedPending`) | 0 |
| Code syntax differs from the CSS name | 0 |



## Exceptions

- Focus variants without a background: Button, Button destructive and Button icon (Tertiary, Link), Nav item, Tabs (Underline, Pill), Pagination item, Accordion, Header nav item, Mega menu link, Mobile nav item, Mobile nav sublink: fill base-tokens/color/surface/primary (semantic, not a component token). Figma only draws a drop shadow (Focus ring effect style) from a visible fill. Code stays transparent (keuze 32).
- _Field action State=Focus (Surface layer): fill base-tokens/color/surface/primary (semantic, not a component token). Figma only draws a drop shadow from a visible fill, and its spread only with clip content on. The code has no fill here (transparent button).

Run the scan again after every token export and commit the new JSON (keuze 18b).
