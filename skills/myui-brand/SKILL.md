---
name: myui-brand
description: Turn a brand guide (PDF) or moodboard screenshots into MyUI brand tokens. Use when someone wants to apply their brand, house style or style guide to the MyUI design system (@rbbds/ui), or asks for brand.css, brand.json or Figma brand values for MyUI.
---

# MyUI brand

You help a designer or developer put their brand into MyUI. MyUI has one layer that holds a brand: primary color, accent color, fonts and a base style (the shape). Everything else (spacing, components, light and dark mode) follows from it. Your job is to read their material, propose those few choices, let them confirm, and then build the files.

## What you deliver

1. `brand-input.json`: the choices, in the format of `brand.schema.json` (next to this file).
2. After the user confirms, run `scripts/build-brand.mjs`. It writes:
   - `brand.json`: all values, 12-step color scales and contrast checks
   - `brand-<name>.css`: CSS for the project
   - `figma-brand.json`: values for the `↳ brand` collection in Figma
3. A short summary with the contrast results and what to do next.

## Steps

### 1. Collect the material

Ask for a brand guide (PDF), a website URL, screenshots or a moodboard. One good source is enough. If there is nothing, ask for the main brand color and a font, and stop guessing.

### 2. Find the choices

Work through these in order. For each choice, write down where it came from and how sure you are:
`stated` (written in the guide), `measured` (sampled from an image), or `estimated` (your interpretation).

**Primary color.** The color used for the main actions: buttons, links, the logo color. Prefer a hex code written in the guide. If the guide gives RGB or CMYK only, convert to hex and say so. If you sample from an image, say it is measured and may be off because of compression and lighting.
- Do not pick black, white, a gray or a pure status color (red for errors, green for success) as primary, unless the guide clearly makes it the brand color.

**Accent color (optional).** A second brand color with a clearly different hue, used for highlights. Leave it out if the brand has only one color. Do not use an accent that looks like a warning (amber) or an error (red), and say why if you skip one.

**Fonts.** Use the font names from the guide. If a font is commercial (for example a paid typeface), keep the name, and add a note: the user needs a web license, and can use a free look-alike from Google Fonts until then (name one). Never claim a font is free unless you know it is.

**Style (shape).** Pick one:
- `forest`: square corners. Straight buttons, square photo crops, a businesslike look.
- `iris`: soft corners (small radius). The safe default if you cannot tell.
- `berry`: round, pill-shaped buttons and fields, heavier titles, 2 px borders. A friendly, playful look.

Base it on buttons, cards and photo crops in the material. This is always `estimated` unless the guide gives corner sizes.

### 3. Let the user confirm

Show a small table before you build anything:

| Choice | Value | From | Sure? |
| --- | --- | --- | --- |
| Primary | #0e5e6f | Brand guide p. 4 | stated |
| Accent | #e07a2f | Brand guide p. 4 | stated |
| Text font | Work Sans | Brand guide p. 7 | stated |
| Title font | Fraunces | Brand guide p. 7 | stated |
| Style | forest | Moodboard, straight buttons | estimated |

Ask: "Shall I build the brand with these values, or do you want to change something?" Wait for the answer. Change what they ask.

### 4. Build

Write `brand-input.json` (see `examples/brand-input.json`). Then:

```
node scripts/build-brand.mjs brand-input.json brand-output
```

If you cannot run code, give the user `brand-input.json` and tell them to paste it into the Brand builder in Storybook (page "Brand builder", button "Import brand.json"). It does the same calculation and shows a preview.

### 5. Report

- List the four contrast checks with PASS or FAIL. The rule is at least 4.5:1.
- If a check fails, show the suggested color from the warning and ask if they want to use it. Do not change the brand color without asking.
- Repeat any notes about font licenses.
- Explain how to use the files:
  - **Code:** load `brand-<name>.css` after `@rbbds/ui/styles.css`. For forest or berry, put `data-brand="forest"` (or `berry`) on `<html>`. Host the fonts yourself, for example with `@fontsource`.
  - **Figma:** in the `↳ brand` collection, overwrite the values of the mode that matches the style (Iris, Forest or Berry) with the values from `figma-brand.json`, or use the Brand import plugin. Overwriting an existing mode also works on Figma plans with few modes.

## Rules

- Never invent a hex code and present it as stated. If you guess, say so.
- Never change spacing, component tokens or anything outside the brand layer. MyUI keeps those the same for every brand on purpose.
- Keep the conversation short. Ask at most one round of questions before the confirm table.
- Brand material can be confidential. Do not repeat more of it than you need.
