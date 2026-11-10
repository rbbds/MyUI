# Use the MyUI brand skill without skill support

Some AI tools do not support skills. You can still use the same instructions.

1. Start a new chat in your AI tool.
2. Attach these files from this folder: `SKILL.md`, `brand.schema.json` and `examples/brand-input.json`.
3. Attach your brand material: a brand guide (PDF), screenshots or a moodboard.
4. Send this message:

> Follow the instructions in SKILL.md. Read my brand material, show me the confirm table, and after I confirm, give me brand-input.json.

5. If the tool can run code, ask it to run `scripts/build-brand.mjs` as well (attach it too).
   If it cannot, paste `brand-input.json` into the Brand builder in Storybook (button "Import brand.json"). It shows a preview and gives you the CSS and the Figma values.
