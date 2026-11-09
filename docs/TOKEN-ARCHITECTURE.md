# MyUI token architecture (plan)

Status: phases 1, 2 and 3 done (9 November 2026, PR #10, version 0.3.0). Phase 4 (English) is next. Written in B1 English.

## Progress

- **Phase 1 (done):**
  - New **∙ color** with 79 primitives (gray, status, base, alpha).
  - **brand/wl** renamed to **↳ brand**:
    - names are `brand/color/primary/*`, `brand/font/*`, `brand/radius/*`, `brand/border-width/*` and `brand/font-weight/*`
    - new **accent** scale: Iris teal, Forest orange, Berry violet
  - New **↳ style** with 95 variables moved out of Theme.
  - Mapped now only points to alias collections. Size points to primitives.
  - Icon sizes in Button, Featured icon and the Icon component use Mapped tokens.
  - All collections except Mapped are hidden from publishing, with empty scopes.
- **Phase 2 (done):** every binding in the file goes through Mapped (8,817 rebinds). The `deprecated/*` variables are deleted. 
- **Phase 3 (done):** export script with one CSS block per layer, `--wl-*` renamed to `--brand-*` (compat block until 0.4.0), Brand builder in English with accent color, Sidebar collapsed and two-level, Berry radius fixes. axe: 0 violations.
- **Still open:** **brand/dark/*** tuning in the Brand builder.
- **After phase 3 (done):** icon-context is removed. 2,331 icon fills now use the foreground token of their own component (the same token as the label, for example `button/secondary/foreground-hover`). Size mode xs is removed.
- **Test result:** in the Icon set, a color or size override on an icon stays when you swap to another icon through the Icon property. So a component can color its icons with its own Mapped foreground token, and icon-context is not needed for that.

## Goal

- One Figma library and one React library that work for many brands.
- Every brand has a Light and a Dark mode.
- To add a brand, a designer only fills in the **Brand** collection. They do not touch anything else.
- Components, text styles, effect styles, layout guides and templates only use **Mapped** tokens.

## Rules

1. Components and styles only bind to **Mapped** variables. Never to an alias or a primitive.
2. Mapped only points to **alias** collections (Theme, Style, Screen size, Size). Never to primitives or Brand.
3. Alias collections point to **Primitives** and **Brand**.
4. Each collection changes along **one** axis only:
   - Brand: which brand
   - Theme: Light or Dark
   - Screen size: breakpoint
   - Size: component size
5. Only Mapped is published. All other collections are hidden from publishing and have empty scopes, so they do not show up in pickers.
6. Spacing is the same for every brand.

## Layers

```
Primitives  ──┬─> Brand (Iris | Forest | Berry | …)
              │        │
              ├────────┼─> Theme (Light | Dark)      colors only
              ├────────┼─> Style (Value)             shape, type, spacing, icon sizes
              ├─> Screen size (xl … xs)              responsive values
              └─> Size (sm | md | lg)                component sizes
                                   │
                                   ▼
                     Mapped (component, typography, effect, layout tokens)
                                   │
                                   ▼
      Components, text styles, effect styles, layout guides, templates
```

### 1. Primitives (∙, no modes, hidden)

| Collection | Content |
| --- | --- |
| ∙ color | gray, base (white, black), success, warning, error, info. Scales 25 to 950. **No brand colors.** |
| ∙ spacing | spacing scale |
| ∙ sizing | sizing scale |
| ∙ border | radius scale, width scale |
| ∙ typography | font sizes, line heights, font weights |
| ∙ shadows | blur, x, y, spread |
| ∙ opacity | opacity scale |

### 2. Brand (↳ brand, one mode per brand, hidden)

This is the only place a designer edits. The Brand builder in Storybook creates all values.

| Group | Type | What the designer does |
| --- | --- | --- |
| brand/color/primary/25 … 950 | color (hex) | Paste from the Brand builder |
| brand/color/accent/25 … 950 | color (hex) | Paste from the Brand builder |
| brand/font/body, brand/font/title | string | Type the font name |
| brand/font-weight/* | alias to ∙ typography | Pick from a list |
| brand/radius/control, containers, overlays (xs … lg) | alias to ∙ border | Pick a style: square, soft, round |
| brand/border-width/default, strong | alias to ∙ border | Pick from a list |
| brand/dark/* | alias to the brand scale | Set by the Brand builder (which step works on a dark background) |

**Primary** is the main brand color: buttons, links, focus, active states.
**Accent** is a second brand color: highlights, badges, tags, illustrations and, later, charts.

### 3. Alias collections (hidden)

| Collection | Modes | Content |
| --- | --- | --- |
| ↳ theme | Light, Dark | Only colors: color/surface, color/foreground, color/border, color/focus, color/overlay, shadow colors. Points to Brand and ∙ color. |
| ↳ style | Value | border/radius/*, border/width/*, font/family/*, font/weight/*, spacing/*, effects/shadow geometry, icon-size/* |
| ↳ screen-size | xl, lg, md, sm, xs | Responsive type, spacing, containers, breakpoint strings |
| ↳ size | sm, md, lg | icon/size (16, 20, 24) and, later, control sizes |

### 4. Mapped (↳ mapped, one mode, published)

- component-tokens/…: every value a component uses, including border widths, effects and icon sizes.
- typography-tokens/…, effect-tokens/…, layout-tokens/….
- Only points to Theme, Style, Screen size or Size.

## What changes compared to today

| Today | Change |
| --- | --- |
| No primitive color collection. Gray and status colors live in brand/wl. | New **∙ color**. Move gray, base and status scales there. |
| brand/wl (modes Iris, Forest, Berry), names start with WL/ | Rename to **brand**, names start with brand/. Add the **accent** scale and the **dark** tuning. |
| theme-(alias) holds colors **and** spacing, radius, border width, fonts, shadows, icon sizes | Keep only colors in **theme**. Move the rest to the new **style**. |
| size holds icon/size plus two component tokens | **size** keeps icon/size. Move button/icon-size and featured-icon/icon-size to Mapped. |
| icon-context has 14 modes (icon color per context) | Removed. Icons use the foreground token of their component. |
| Mapped points 6 times to ∙ sizing and 2 times to brand/wl | Point to alias collections only. |
| Components bind directly to theme (border widths, effects and about 1,600 older bindings) and to size (Icon) | Rebind everything to Mapped. |
| Collections are not hidden from publishing | Hide all except Mapped. Set empty scopes on primitives and aliases. |

## Code changes

- Export script writes one CSS block per layer:
  - primitives and style in `:root`
  - brand in `[data-brand="…"]`
  - theme in `[data-theme="dark"]`
  - size in size classes
  - mapped in `:root`
- CSS names follow Figma names: `--wl-*` becomes `--brand-*`. This is a breaking change. Version 0.3.0 keeps the old names as aliases for one version.
- Brand builder also creates the accent scale and the dark tuning, and outputs Figma values and CSS from one source.

## Plan (each phase ends with a review)

1. **Figma variables.** Create ∙ color and ↳ style. Rename brand/wl to brand. Add accent and dark tuning. Move variables out of theme. Fix Mapped references. Set publishing and scopes.
2. **Figma bindings.** Rebind components, text styles and effect styles to Mapped only. Run an audit: zero bindings outside Mapped.
3. **Code.** Export script, CSS layers, renamed variables, Brand builder, Storybook check (axe in Light and Dark for Iris, Forest and Berry). This PR also brings the Sidebar, the Berry radius fix, the new component tokens and the icon sizes to code.
4. **English.** Token names, Figma Docs frames, docs/content, Storybook stories and example text in B1 English.

## Open points

1. **Icon color and size (decided 9 November 2026):**
   - icon-context is removed. An icon uses the foreground token of the component it sits in, the same token as the label next to it.
   - An icon next to text is as high as the line height of that text: 16 for 12px text, 20 for 14px text, 24 for 16px text. So there is no 12px size mode. Only icons inside a control, like the check in a Checkbox, can be 12px, through their own token (`checkbox/indicator-icon-size`).
2. Accent colors for the example brands (chosen; amber is not used because it looks like warning):
   - Iris: indigo + teal
   - Forest: green + orange
   - Berry: pink + violet
3. Starter plan: test what a free user can do with a copy of the file (use or edit existing modes). Write the result in the docs.
