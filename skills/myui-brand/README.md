# myui-brand skill

Turns a brand guide (PDF) or moodboard into MyUI brand tokens: CSS for code and values for Figma.

## Install

- **Claude Code:** copy this folder to `.claude/skills/myui-brand` in your project, or to `~/.claude/skills/myui-brand` for all projects.
- **Claude (web and desktop):** zip this folder and add it as a custom skill in your settings.
- **Other AI tools:** see `PROMPT.md`.

## Use

Ask: "Apply my brand to MyUI" and attach your brand guide or screenshots. The skill shows what it found, asks you to confirm, and then builds:

- `brand.json`: all values, 12-step color scales and contrast checks
- `brand-<name>.css`: load it after `@rbbds/ui/styles.css`
- `figma-brand.json`: values for the `↳ brand` collection in Figma

You can also run the script yourself (Node 18 or newer, no install needed):

```
node scripts/build-brand.mjs examples/brand-input.json brand-output
```

## Files

| File | What |
| --- | --- |
| `SKILL.md` | Instructions for the AI |
| `brand.schema.json` | Format of `brand-input.json` |
| `scripts/build-brand.mjs` | Builds the scales, CSS and Figma values. Same math as the Brand builder in Storybook. |
| `examples/brand-input.json` | Example input |
| `PROMPT.md` | How to use it in tools without skills |

## What it does not do

- It does not change spacing or components. Only the brand layer: colors, fonts and the base style.
- It does not check font licenses for you. It tells you when a font may need one.
- Colors taken from screenshots are estimates. Check them against the real brand colors.
