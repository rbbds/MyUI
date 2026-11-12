// Guides: Getting started for designers and developers, and the versioning policy.
// One source for Storybook (src/docs/guides/*.mdx) and the Figma page "How to use".
// Run `npm run docs:build` after a change. B1 English, short sentences.

export const guides = [
  {
    id: 'designers',
    title: 'For designers',
    intro: 'MyUI in Figma: one library with three styles (Iris, Forest, Berry), Light and Dark, components and page templates. This guide takes you from the first file to your own brand.',
    sections: [
      {
        heading: '1. Add the library to your files',
        steps: [
          'Put the MyUI file in your own Figma team, for example by importing the .fig file.',
          'Publish it as a library: Assets panel > Libraries > Publish.',
          'In your project file, turn the library on: Assets panel > Libraries > MyUI.',
        ],
        note: 'What you can publish depends on your Figma plan. Check the plan details on figma.com.',
      },
      {
        heading: '2. Pick a style and a theme',
        paragraphs: [
          'Select a page or a frame. In the right panel, under Layer, set the modes: ↳ brand (Iris, Forest or Berry, or your own brand) and ↳ theme (Light or Dark).',
          'Components inside that page or frame follow these modes. A mode on a frame wins over the mode on the page.',
        ],
      },
      {
        heading: '3. Use the components',
        bullets: [
          'Insert components from the Assets panel. Change them with the properties in the right panel: variants, text, booleans and icons.',
          'Each component page has an Example frame. Try the properties there, not in the components themselves.',
          'Do not edit the base components or the variants. Layers that start with _ are building blocks. They are hidden in the library on purpose.',
          'Some components have a slot, for example Sidebar, Dropdown menu and Table. Put the matching items in the slot: Nav item, Menu item or Table column.',
        ],
      },
      {
        heading: '4. Colors and text',
        bullets: [
          'The variable picker shows only the base tokens: a short list of surface, text and border colors. Use these for your own shapes and frames.',
          'All other tokens are already inside the components. You do not need to pick them.',
          'Use the text styles for text. They follow the style and the screen size.',
        ],
      },
      {
        heading: '5. Templates and screen sizes',
        paragraphs: [
          'The Templates page has a dashboard, an account page, a shop and a form. Set the mode ↳ screen-size on a template frame to see it at another breakpoint: Desktop (xl), Desktop (lg), Tablet landscape (md), Tablet portrait (sm) or Mobile (xs).',
          'Screen-size is only for templates and full pages. Leave it on the default for single components.',
        ],
      },
      {
        heading: '6. Your own brand',
        steps: [
          'Make your brand values with the Brand builder in Storybook, or let your AI tool read your brand guide with the myui-brand skill.',
          'Both give you a primary color, an accent color (bright yellow by default) and fonts, with a contrast check.',
          'Open the variables, go to the collection ↳ brand and add a mode with your brand name. Copy the values from figma-brand.json into that mode.',
          'Set that mode on your pages. All components follow.',
        ],
      },
      {
        heading: '7. Updates',
        paragraphs: [
          'Each update comes with a version number and a changelog. Read the changelog first: it says what changed and if you need to do something.',
          'Put the new file in your team and publish it. In your project files, use Swap library in the Libraries panel to move to the new file. Then accept the updates in the Assets panel.',
          'See Versioning for what a major, minor or patch update means.',
        ],
      },
    ],
  },
  {
    id: 'developers',
    title: 'For developers',
    intro: '@rbbds/ui is the React version of MyUI: components, design tokens as CSS custom properties, Light and Dark, and TypeScript types. It works with React 18 and newer.',
    sections: [
      {
        heading: '1. Install',
        codeFirst: true,
        code: 'npm install @rbbds/ui lucide-react',
        paragraphs: ['lucide-react is the icon set the components use. Install it too, so you can pass icons to components.'],
      },
      {
        heading: '2. Load the styles and a font',
        codeFirst: true,
        code: "import '@rbbds/ui/styles.css';\nimport '@fontsource-variable/inter';",
        paragraphs: [
          'Import styles.css once, for example in main.tsx. It holds the tokens and the component styles.',
          'Load the fonts yourself. Iris and Forest use Inter. Berry uses Source Serif 4 for titles. You can also set --brand-font-body and --brand-font-title to your own fonts.',
        ],
      },
      {
        heading: '3. Use the components',
        codeFirst: true,
        code: "import { Button, Input } from '@rbbds/ui';\nimport { Plus } from 'lucide-react';\n\nexport function NewProject() {\n  return (\n    <form>\n      <Input label=\"Project name\" required />\n      <Button type=\"submit\" iconLeading={<Plus aria-hidden />}>Create project</Button>\n    </form>\n  );\n}",
        paragraphs: ['Every component has a Docs page in Storybook with its props, states and accessibility notes.', 'For tools and AI assistants: @rbbds/ui/tokens.json has all tokens with their values, types and modes (Design Tokens format). llms.txt in the package explains the layers, the naming and the rules.'],
      },
      {
        heading: '4. Style and theme',
        bullets: [
          'Style: set data-brand="forest" or data-brand="berry" on <html>. Iris needs no attribute.',
          'Theme: set data-theme="dark" on <html>, or on any element for a dark section.',
          'Screen size: nothing to do. Type and spacing follow the screen width through media queries.',
        ],
      },
      {
        heading: '5. Your own brand',
        paragraphs: [
          'Make your brand CSS with the Brand builder in Storybook or the myui-brand skill (in node_modules/@rbbds/ui/skills). Load that CSS after styles.css.',
          'Only change --brand-* tokens: colors, fonts, radius, border width and font weight. Spacing and sizes stay the same, so the components keep working.',
        ],
        code: ':root {\n  --brand-color-primary-600: #0284c7;\n  --brand-color-accent-400: #facc15;\n  --brand-font-body: "Manrope", system-ui, sans-serif;\n}',
      },
      {
        heading: '6. Language and dates',
        paragraphs: ['All built-in labels are English and dates and amounts use en-US. Every label is a prop. Components with dates or amounts have a locale prop, for example locale="nl-NL".'],
      },
      {
        heading: '7. Updates',
        codeFirst: true,
        code: 'npm outdated @rbbds/ui\nnpm install @rbbds/ui@latest',
        paragraphs: ['Read the changelog before you update. A major update can need changes in your code; the changelog lists them under Breaking. See Versioning.'],
      },
    ],
  },
  {
    id: 'building',
    title: 'Building components',
    intro: 'Rules for anyone who adds or changes a component in the Figma file. They keep spacing, click areas and focus the same in every component, and they match the CSS.',
    sections: [
      {
        heading: '1. Variant and base',
        bullets: [
          'A component with states or sizes has a base: _Name (base). The base holds all padding, gaps, radius, borders and effects.',
          'A variant is a wrapper with padding 0 and one base instance in it. A variant only changes properties of the base. It may add a part next to the base, for example the subpages in Mobile nav item, State=Expanded.',
          'Composed components are built from parts and have no single base: for example Tabs, Pagination, Stepper, Sidebar, Calendar, Tooltip and Popover. Simple shapes need no base: Divider, Spinner and Progress bar.',
          'Building blocks start with _. They are hidden in the library.',
        ],
      },
      {
        heading: '2. Padding belongs to the element you click',
        bullets: [
          'A button, row, link, tab or nav item has its own padding. Hover, focus and the click area are then always the same size.',
          'Elements with a fixed size, such as a pagination item, a calendar day or a swatch, have a fixed width and height and center their content.',
          'Never put padding on text. Put the text in an auto layout frame.',
          'A click area is at least 24 px (WCAG). Rows for touch screens, in Mobile nav and Bottom navigation, are 48 px. Menu items and nav items on desktop are 36 px.',
          'Controls have three heights: 36 px (sm), 40 px (md) and 48 px (lg). This goes for Button, Input, Select, Search input, Button group and Quantity stepper. Tag and Badge are 20, 24 and 28 px.',
        ],
      },
      {
        heading: '3. Containers have padding, groups only a gap',
        bullets: [
          'The outer container (panel, sidebar, menu, card) has padding and a gap.',
          'Groups inside it (a list of items, a header, a button row) have padding 0 and only a gap.',
          'Items you click directly next to each other have a gap of 0. The space comes from their own padding, so there is no dead space between click areas.',
          'Use an inset on the container only when a hover surface must not touch the edge. Example: the subpages in Mobile nav.',
        ],
      },
      {
        heading: '4. Indent and alignment',
        bullets: [
          'An indent (sub items, subpages) is padding on the row itself, with its own token. The list around it does not indent.',
          'Content below a heading uses the same horizontal padding token as the heading. Text then lines up under the title.',
          'The page margin is set once, on the outer frame of a template or header. Everything inside has padding 0.',
        ],
      },
      {
        heading: '5. The 4 px grid',
        bullets: [
          'Spacing and radius use steps of 4 px. Half steps (2 px) are fine, for example spacing/1,5 or radius/1,5 = 6 px. Other values are not.',
          'The one exception is a technical offset of 1 px, for example the popover arrow that overlaps the border.',
          'Borders do not count in the layout. In Figma, turn off Include stroke in layout. In CSS, the padding is calc(padding - border width), so a 48 px button stays 48 px.',
        ],
      },
      {
        heading: '6. Focus',
        bullets: [
          'Focus is the effect style Focus ring/brand on the base. Use Focus ring/error for destructive actions.',
          'The ring is a shadow, so it does not move the layout. It follows one token for the color: effect-tokens/border/focus. In CSS this is --focus-ring.',
          'Do not add a focus border or a focus color to a single component. Inputs are the exception: their border also changes color on focus.',
        ],
      },
      {
        heading: '7. Tokens',
        bullets: [
          'Bind every padding, gap, radius, border width and color to a component token. Component tokens point to the mapped tokens, never to primitives.',
          'Name tokens after the part: mobile-nav-item/sub-padding-horizontal, mega-menu/columns-gap.',
          'Content areas that people fill themselves are slots with a fixed gap token.',
        ],
      },
    ],
  },
  {
    id: 'versioning',
    title: 'Versioning',
    intro: 'MyUI uses semantic versioning (major.minor.patch) for the React package and the Figma file. Both get the same number, so you always know which Figma file matches which package.',
    sections: [
      {
        heading: 'What a number means',
        table: {
          head: ['Update', 'Example', 'What changes', 'What you do'],
          rows: [
            ['Patch', '1.0.0 to 1.0.1', 'Fixes. No change in props, tokens or Figma properties.', 'Update. Nothing else.'],
            ['Minor', '1.0.0 to 1.1.0', 'New components, props, variants or tokens. Old ones keep working.', 'Update. Use the new parts when you want.'],
            ['Major', '1.0.0 to 2.0.0', 'Breaking changes: a prop, token, variant or component is renamed or removed.', 'Read Breaking in the changelog and change your code or files.'],
          ],
        },
      },
      {
        heading: 'Breaking changes',
        bullets: [
          'React: a removed or renamed prop, component, export or CSS custom property, or a changed default that changes how a page looks or works.',
          'Figma: a renamed or removed component, variant or property. Instances can lose their overrides after such a change.',
          'Before a breaking change, the old name stays for at least one minor version and is marked as deprecated in the changelog.',
        ],
      },
      {
        heading: 'Not breaking',
        bullets: [
          'New components, props, variants, properties and tokens.',
          'Small visual fixes that make a component match its design, and better contrast.',
          'Changes in Storybook, docs, examples and templates.',
        ],
      },
      {
        heading: 'Changelog',
        paragraphs: ['Every release has a section in CHANGELOG.md with Breaking, New, Changed and Fixed. In the Figma file, the How to use page shows the version and the Changelog page lists the changes.'],
      },
    ],
  },
];

// Figma changelog: shown on the page "📝 Changelog" in the Figma file. Newest first.
export const figmaChangelog = [
  {
    version: '1.0.0',
    items: [
      'New page How to use with guides for designers and developers, and the versioning policy.',
      'Every component page has an Example frame to try the properties.',
      'Building blocks start with _ and are hidden in the library: for example _Step, _Tab, _Breadcrumb item and _Bottom nav item.',
      'Only the base tokens show in the variable picker. There are 26: surface, text and border colors, plus accent, warning and info.',
      'Button has Hierarchy=Accent for the action that sells. The accent is bright yellow with dark text in every style. Add to cart uses it.',
      'New component Bottom navigation, with an optional raised center action.',
      'Stepper has Orientation=Compact. Pagination has Breakpoint=Mobile. Slider has Position=Start, Middle, End.',
      'Templates: dashboard, account, shop and form. They follow ↳ screen-size: below Tablet landscape the sidebar makes way for a header and Bottom navigation.',
      'All example texts are English, with en-US dates and amounts.',
    ],
  },
];
