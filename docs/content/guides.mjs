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
          'The variable picker shows only the base tokens: surface, text and border colors, border width, spacing (gap and padding) and radius. Use these for your own shapes and frames.',
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
          'Optional, only when your brand has them: the exact color of the accent button (for a dark accent with white text), a heading color, a gray tint and your own colors for success, warning, error and information.',
          'Open the variables, go to the collection ↳ brand and add a mode with your brand name. Copy the values from figma-brand.json into that mode.',
          'Set that mode on your pages. All components follow.',
        ],
      },
      {
        heading: 'What a brand can change',
        paragraphs: [
          'Everything a brand can change is in the collection ↳ brand. You do not edit the other collections.',
          'Colors with your own values: brand/color/primary and brand/color/accent (12 steps each).',
          'Colors that follow MyUI until you change them: brand/color/neutral (grays), success, warning, error and info (12 steps each), brand/color/heading (titles in Light) and brand/color/accent-solid (the accent button: surface, hover, pressed and text color). In your mode they are a link to the MyUI default.',
          'To change one: select the value in your mode, detach the link and type or paste your own color. The other brands keep the default. To go back: link the value again to the same variable in ∙ color, or copy the link from the mode Iris.',
          'Fonts, font weights, radius and border width are in ↳ brand too.',
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
          'Load the fonts yourself. All styles use Inter. Forest also uses Source Serif 4 for titles. You can also set --brand-font-body and --brand-font-title to your own fonts.',
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
        heading: '5. Routing and Next.js',
        codeFirst: true,
        code: "import NextLink from 'next/link';\nimport { LinkProvider } from '@rbbds/ui';\n\n<LinkProvider component={NextLink}>\n  <App />\n</LinkProvider>",
        paragraphs: [
          'MyUI links (NavItem, Header, Mega menu, Breadcrumbs, Card, Bottom navigation, Stepper, Document list) render a plain <a href>. Put a LinkProvider around your app and they use the link of your router, so a click does not reload the page. For React Router, map href to to: component={({ href, ...p }) => <RouterLink to={href} {...p} />}.',
          'Next.js App Router: every file in the package starts with \'use client\'. You can import the components in a server component.',
        ],
      },
      {
        heading: '6. Your own brand',
        paragraphs: [
          'Make your brand CSS with the Brand builder in Storybook or the myui-brand skill (in node_modules/@rbbds/ui/skills). Load that CSS after styles.css.',
          'Only change --brand-* tokens: colors, fonts, radius, border width and font weight. Spacing and sizes stay the same, so the components keep working.',
          'Headings: --brand-color-heading sets the color of titles in Light (cards, modals, page headers and so on). In Dark titles keep the light text color. For your own headings use color: var(--base-color-foreground-heading).',
          'Grays and status colors are brand tokens too: --brand-color-neutral-*, -success-*, -warning-*, -error-* and -info-* (12 steps each). By default they point to the MyUI grays, green, orange, red and blue. Set them only when your brand has its own. The Brand builder makes the 12 steps from one color.',
          'The accent button uses accent 400 with dark text. Is your accent a dark color? Set --brand-color-accent-solid-surface, -surface-hover, -surface-pressed and -foreground. The Brand builder does this for you with "Use my exact accent color on buttons".',
        ],
        code: '/* The Brand builder writes all 12 steps of every scale. This shows one line per kind. */\n:root {\n  --brand-color-primary-600: #0284c7;\n  --brand-color-accent-400: #facc15;\n  --brand-font-body: "Manrope", system-ui, sans-serif;\n\n  /* Optional */\n  --brand-color-accent-solid-surface: #2f7d5b;    /* exact accent button color */\n  --brand-color-accent-solid-foreground: #ffffff;\n  --brand-color-heading: #36254b;                 /* titles in Light */\n  --brand-color-neutral-900: #1c1722;             /* your own grays */\n  --brand-color-error-600: #c8322f;               /* your own status color */\n}',
      },
      {
        heading: '7. Language and dates',
        codeFirst: true,
        code: 'import { LocaleProvider } from \'@rbbds/ui\';\nimport { nlNL } from \'@rbbds/ui/locales/nl-NL\';\n\n<LocaleProvider locale={nlNL}>\n  <App />\n</LocaleProvider>\n\n// Your own words on top of the locale\n<LocaleProvider\n  locale={nlNL}\n  labels={{ cartSummary: { total: "Totaal excl. btw" } }}\n  texts={{ "cartSummary.title": "Je bestelling" }}\n>\n  <App />\n</LocaleProvider>',
        paragraphs: [
          'All built-in texts are English, and dates, numbers and amounts use en-US.',
          'Put a LocaleProvider around your app to change that for every component at once. MyUI comes with Dutch: nlNL from @rbbds/ui/locales/nl-NL has every built-in text in Dutch (informal, "je") and sets the formats: an amount is € 1.234,56 and a date is 27-11-2026.',
          'Another language: pass only a tag, for example locale="de-DE". The formats change and the texts stay English until you pass your own.',
          'Your own texts go in labels, per component. The key is the name of the component: cartSummary, pagination, datePicker. Single texts, such as a title or a placeholder, go in texts as component.prop.',
          'A locale or labels prop on a component still wins over the provider. Without a provider nothing changes.',
          'Next.js App Router: put the LocaleProvider in your own client component (a file that starts with \'use client\'), next to your other providers. A locale has functions for plurals, and a server component cannot pass functions on.',
        ],
      },
      {
        heading: '8. Props that work the same everywhere',
        bullets: [
          'value, defaultValue and onValueChange: leave value out and the component keeps its own state from defaultValue. onValueChange gets the value. onChange on Input, Select, Textarea and Checkbox gets the native event.',
          'Open state: open, defaultOpen and onOpenChange (DropdownMenu, Popover). Modal and Slideout are always controlled.',
          'label: the accessible name of the component itself (Tabs, ButtonGroup, Pagination, Breadcrumbs, Stepper, BottomNavigation, Header, Sidebar). aria-label also works.',
          'locale: the format of dates, numbers and amounts, for example locale="nl-NL". Default: the LocaleProvider, else en-US.',
          'labels: all built-in texts in one object. The older single text props (closeLabel, clearLabel, …) still work but are deprecated.',
          'variant: the look (Tabs underline or pill, VariantPicker color or size). type is only the HTML type (Button) or the kind of input (SelectionCard radio or checkbox).',
          'actions: the slot for buttons or links (Alert, Banner, Card, CartSummary, DescriptionList, DocumentList, EmptyState, Popover).',
          'headingLevel: 2, 3 or 4. Default 2 for page sections (DescriptionList, DocumentList, Checklist, SettingsSection) and dialogs (Modal, Slideout); 3 for parts inside a section (Card, EmptyState, Accordion, FilterGroup).',
          'size: default md. Checkbox, Radio and Toggle default to sm, the size next to body text. AvatarGroup defaults to sm.',
          'className, ref and other HTML attributes go to the root element. Form components forward ref to the input.',
          'Deprecated props keep working until 2.0.0. Your editor shows them crossed out.',
        ],
      },
      {
        heading: '9. Updates',
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
          'A click area is at least 24 px (WCAG). Rows for touch screens, in Mobile nav and Bottom navigation, are 48 px. Menu items, nav items, Command items and Combobox options on desktop are 36 px.',
          'Controls have three heights: 36 px (sm), 40 px (md) and 48 px (lg). This goes for Button, Input, Select and Search input. Button group has one height: 40 px. Quantity stepper has two: 36 px (sm) and 40 px (md). Tag and Badge are 20, 24 and 28 px.',
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
          'Focus is the effect style Focus ring/default on the base. Use Focus ring/error for destructive actions.',
          'The ring is a shadow, so it does not move the layout. It follows one token for the color: effect-tokens/border/focus. In CSS this is --focus-ring.',
          'The focus color is blue in every brand (info 500 in Light, info 400 in Dark). It does not follow the brand color: people know blue as focus, and it stays clear next to a red error border.',
          'Do not add a focus border or a focus color to a single component. Inputs are the exception: their border also changes color on focus.',
          'Inside a scroll area the ring would be cut off. Use the inset ring there. In CSS this is --focus-ring-inset.',
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
      {
        heading: '8. Slots before fixed props',
        bullets: [
          'A place for content gets a name and is a slot. In React that is a prop of type ReactNode (badge, meta, aside, actions, children). In Figma it is a native slot. Do not add a prop with one fixed meaning when a slot does the same.',
          'Always use native Figma slots, never a home-made placeholder with an instance swap. Turn clip content off on the slot, so a focus ring or a shadow of the content is not cut off.',
          'Give a slot a Show property that is off by default, and a gap token. Look at Card first: slot Content with Show content.',
          'Buttons, links and fields never go inside a label. A component whose whole surface is a label (Selection card) gets a separate slot outside the label for that content.',
          'Business rules stay in the page. A component gives the slots; which option is recommended or not ideal is decided by the page. Show the whole flow as a pattern story.',
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
          'Small visual fixes that make a component match its design, and better contrast. A size correction of up to 2 px counts as a small fix.',
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
    version: '1.10.0',
    items: [
      'Selection card has a native Badge slot next to the title (Show badge), a Meta text below the explanation (Show meta) and a native Content slot below the option (Show content). All off by default.',
      'File upload has a native Files slot below the drop zone with File upload items in it (Show files, off by default). You no longer place File upload items yourself.',
      'File upload item has native slots Media, Actions and Content, a Show icon property and the new state Processing (a spinner with a text). In Complete the remove button stays, and the done icon lines up with the buttons.',
      'Clip content is off on all native slots in the file, so a focus ring or a shadow of the content is not cut off.',
      'New token selection-card/badge-gap.',
    ],
  },
  {
    version: '1.9.0',
    items: [
      'New page Tier pricing table: the unit price per quantity tier for bulk orders. The component has Density, State (Default, Loading) and Saving. The base components are _Tier row, _Tier header and _Tier row skeleton. 7 new tokens under e-commerce/tier-pricing; the rest of the look comes from the table tokens.',
      'Price has the properties Prefix, Show prefix, VAT and Show VAT (off by default). The default text of Suffix is "per piece".',
      'Quantity stepper has the properties Hint and Show hint (off by default). The number field has a minimum width and grows with the number.',
      'Add to cart has the properties Quantity hint, Show quantity hint, Show secondary action, Secondary hint and Show secondary hint. The new parts are off by default.',
      'Fixed: the icon in the Add to cart button, and in the disabled button of Product card (Horizontal, Sold out), now has the same color as the text.',
    ],
  },
  {
    version: '1.7.0',
    items: [
      'The focus color is blue in every brand: color/border/focus points to info 500 (Light) and info 400 (Dark) instead of the brand color. The focus ring, the focus border of Input and Verification code, and the active line of Menu item and Command item follow.',
      'The effect style Focus ring/brand is now called Focus ring/default. Layers that use it stay linked.',
    ],
  },
  {
    version: '1.6.0',
    items: [
      'New brand variable brand/color/heading: the color of titles in Light. It points to neutral 900 by default. In Dark titles use neutral 50. 24 title tokens (card, modal, page header, alert and more) now use color/foreground/heading. New base token color/foreground/heading for your own headings.',
      'New brand variables brand/color/neutral, success, warning, error and info (12 steps each). They point to ∙ color by default. Replace the alias with a color in the mode of your brand to give that brand its own grays or status colors. ↳ theme now points to these instead of to ∙ color.',
      'Dark: the primary and the destructive button get darker on hover and while pressed (steps 700 and 800), like in Light. White text on hover was below 4.5:1. The checked checkbox and radio, the toggle and the Bottom navigation action follow on hover.',
      'Button, Button destructive and Button icon have State=Pressed, in the column after Hover. New tokens button/<hierarchy>/surface-pressed, foreground-pressed and border-pressed.',
      'New brand variables brand/color/accent-solid/surface, surface-hover, surface-pressed and foreground: a brand can give the accent button its exact color and text color. Iris, Forest and Berry keep accent 400 with dark text.',
    ],
  },
  {
    version: '1.5.0',
    items: [
      'New tokens tab/indicator-width and avatar/status-ring-width: the line under the selected tab and the ring around the avatar status dot. The status ring is 2 px (was 1.5 px).',
      'Close button has State=Focus (xs, sm, md).',
    ],
  },
  {
    version: '1.4.0',
    items: [
      'New states: Date picker Disabled, Quantity stepper At maximum, Table header cell Focus.',
      'Nav item: the ring around the indicator dot is 2 px. Cart button: the count uses the 12 px text size.',
      'New Docs frame for Close button. The Docs frames of Table, Date picker, Mega menu and Quantity stepper are updated.',
    ],
  },
  {
    version: '1.3.0',
    items: [
      'The variable picker shows only the base tokens: surface, text and border colors, border width, spacing (gap and padding) and radius. Component tokens no longer show in the picker; they stay bound inside the components.',
      'New base tokens: spacing (2 to 80 px) and radius for control, containers and overlays, plus full. Radius follows the brand.',
    ],
  },
  {
    version: '1.2.0',
    items: [
      'Button group and Pagination: the current option has a 2 px ring and a background in the brand color. Before, only a light gray background showed it.',
    ],
  },
  {
    version: '1.1.0',
    items: [
      'New: Mega menu (panel with 2 to 4 columns and a featured block), Mobile nav (accordion for the mobile menu) and Header Show search.',
      'New states: _Header nav item Expanded and Has menu, _Mega menu link Current, _Mobile nav sublink, Input Error empty, Date picker Error, Quantity stepper Focus value and Focus button, _Field action Focus, Button group Disabled.',
      'Focus: effect style Focus ring/inset. A field shows one focus ring at a time. Focus states have a fill so the ring renders.',
      'Search input: the clear button is a _Field action (24 px with a 20 px icon). The base is Fill, so instances can be narrower than 320 px.',
      'Component tokens are grouped in category folders (component-tokens/<category>/...). Unbound and duplicate tokens are removed: every component token is bound in Figma and used in code.',
      'Control borders are lighter (color/border/control) and still WCAG. Checkbox and Radio follow the line height of their label.',
      'Close button, Checkbox group, Radio group and Selection card group are components. Docs frames are regenerated on every component page.',
      "Code: LinkProvider for router links, 'use client' for Next.js and labels on every component. Old props still work until 2.0.0.",
    ],
  },
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
