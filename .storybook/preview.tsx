import type { Preview } from '@storybook/react-vite';
import '@fontsource-variable/inter';
import '../src/styles/index.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color mode',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? 'light';
      document.documentElement.setAttribute('data-theme', theme);
      return (
        <div data-theme={theme} style={{ background: 'var(--color-surface-primary)', color: 'var(--color-foreground-primary)', padding: 24, minHeight: context.viewMode === 'docs' ? undefined : '100vh', boxSizing: 'border-box' }}>
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    a11y: { test: 'todo' },
    options: { storySort: { order: ['Introductie', 'Foundations', 'Buttons', ['Button', ['Docs', '*'], 'Button destructive', ['Docs', '*'], 'Button icon', ['Docs', '*'], 'Button group', ['Docs', '*']], 'Form inputs', ['Input', ['Docs', '*'], 'Select', ['Docs', '*'], 'Textarea', ['Docs', '*'], 'Slider', ['Docs', '*'], 'Search input', ['Docs', '*'], 'Date picker', ['Docs', '*'], 'Combobox', ['Docs', '*']], 'Selection controls', ['Checkbox', ['Docs', '*'], 'Radio', ['Docs', '*'], 'Toggle', ['Docs', '*'], 'Selection card', ['Docs', '*']], 'Badges & tags', ['Badge', ['Docs', '*'], 'Tag', ['Docs', '*']], 'Avatars', ['Avatar', ['Docs', '*'], 'Avatar group', ['Docs', '*']], 'Feedback', ['Alert', ['Docs', '*'], 'Toast', ['Docs', '*'], 'Tooltip', ['Docs', '*'], 'Progress', ['Docs', '*']], 'Overlays', ['Dropdown menu', ['Docs', '*'], 'Modal', ['Docs', '*'], 'Slideout', ['Docs', '*'], 'Command menu', ['Docs', '*']], 'Navigation', ['Header', ['Docs', '*'], 'Sidebar', ['Docs', '*'], 'Nav item', ['Docs', '*'], 'Tabs', ['Docs', '*'], 'Breadcrumbs', ['Docs', '*'], 'Pagination', ['Docs', '*'], 'Stepper', ['Docs', '*']], 'Data display', ['Table', ['Docs', '*']], 'Content', ['Card', ['Docs', '*'], 'Accordion', ['Docs', '*'], 'Empty state', ['Docs', '*'], 'File upload', ['Docs', '*']], 'Utilities', ['Divider', ['Docs', '*'], 'Featured icon', ['Docs', '*'], 'Spinner', ['Docs', '*'], 'Skeleton', ['Docs', '*'], 'Kbd', ['Docs', '*']]] } },
  },
};
export default preview;
