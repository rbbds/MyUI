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
    options: { storySort: { order: ['Introductie', 'Documentatie', ['Buttons', 'Form inputs', 'Selection controls', 'Badges & tags', 'Avatars', 'Feedback', 'Overlays', 'Navigation', 'Data display', 'Content', 'Utilities'], 'Foundations', 'Components'] } },
  },
};
export default preview;
