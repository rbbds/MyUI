import type { Preview } from '@storybook/react-vite';
import '@fontsource-variable/inter';
import '../src/styles/index.css';
import '@fontsource/source-serif-4/400.css';
import '@fontsource/source-serif-4/600.css';
import '@fontsource/source-serif-4/700.css';

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
    brand: {
      description: 'Brand mode (Figma: brand/wl collection)',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: [
          { value: 'iris', title: 'Iris (standaard, licht afgerond)' },
          { value: 'forest', title: 'Forest (hoekig)' },
          { value: 'berry', title: 'Berry (rond)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light', brand: 'iris' },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? 'light';
      document.documentElement.setAttribute('data-theme', theme);
      // The Brand builder sets data-brand and the brand colors itself; the toolbar must not interfere.
      if (!context.parameters.brandControlledByStory) {
        const brand = context.globals.brand ?? 'iris';
        if (brand === 'iris') document.documentElement.removeAttribute('data-brand');
        else document.documentElement.setAttribute('data-brand', brand);
      }
      return (
        <div data-theme={theme} style={{ background: 'var(--color-surface-primary)', color: 'var(--color-foreground-primary)', fontFamily: 'var(--brand-font-body)', padding: 24, minHeight: context.viewMode === 'docs' ? undefined : '100vh', boxSizing: 'border-box' }}>
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    a11y: { test: 'todo' },
    options: { storySort: { order: ['Introductie', 'Brand builder', 'Foundations', 'Buttons', ['Button', ['Docs', '*'], 'Button destructive', ['Docs', '*'], 'Button icon', ['Docs', '*'], 'Button group', ['Docs', '*']], 'Form inputs', ['Input', ['Docs', '*'], 'Select', ['Docs', '*'], 'Textarea', ['Docs', '*'], 'Slider', ['Docs', '*'], 'Search input', ['Docs', '*'], 'Range slider', ['Docs', '*'], 'Date picker', ['Docs', '*'], 'Date range picker', ['Docs', '*'], 'Combobox', ['Docs', '*'], 'Verification code', ['Docs', '*'], 'Password input', ['Docs', '*'], 'Copy input', ['Docs', '*']], 'Selection controls', ['Checkbox', ['Docs', '*'], 'Radio', ['Docs', '*'], 'Toggle', ['Docs', '*'], 'Selection card', ['Docs', '*']], 'Badges & tags', ['Badge', ['Docs', '*'], 'Tag', ['Docs', '*'], 'Status indicator', ['Docs', '*']], 'Avatars', ['Avatar', ['Docs', '*'], 'Avatar group', ['Docs', '*']], 'Feedback', ['Banner', ['Docs', '*'], 'Alert', ['Docs', '*'], 'Toast', ['Docs', '*'], 'Tooltip', ['Docs', '*'], 'Progress', ['Docs', '*']], 'Overlays', ['Dropdown menu', ['Docs', '*'], 'Modal', ['Docs', '*'], 'Slideout', ['Docs', '*'], 'Command menu', ['Docs', '*'], 'Notifications', ['Docs', '*'], 'Popover', ['Docs', '*']], 'Navigation', ['Page header', ['Docs', '*'], 'Header', ['Docs', '*'], 'Sidebar', ['Docs', '*'], 'Nav item', ['Docs', '*'], 'Tabs', ['Docs', '*'], 'Breadcrumbs', ['Docs', '*'], 'Pagination', ['Docs', '*'], 'Stepper', ['Docs', '*']], 'Data display', ['Table', ['Docs', '*'], 'Metric card', ['Docs', '*'], 'Description list', ['Docs', '*'], 'Document list', ['Docs', '*'], 'Activity feed', ['Docs', '*']], 'Content', ['Card', ['Docs', '*'], 'Accordion', ['Docs', '*'], 'Empty state', ['Docs', '*'], 'File upload', ['Docs', '*'], 'Settings section', ['Docs', '*'], 'Checklist', ['Docs', '*']], 'E-commerce', ['Product card', ['Docs', '*'], 'Product grid', ['Docs', '*'], 'Price', ['Docs', '*'], 'Rating', ['Docs', '*'], 'Quantity stepper', ['Docs', '*'], 'Stock indicator', ['Docs', '*'], 'Product gallery', ['Docs', '*'], 'Variant picker', ['Docs', '*'], 'Add to cart', ['Docs', '*'], 'Cart item', ['Docs', '*'], 'Cart summary', ['Docs', '*'], 'Promo code', ['Docs', '*'], 'Mini cart', ['Docs', '*'], 'Checkout options', ['Docs', '*'], 'Address fields', ['Docs', '*'], 'Filter group', ['Docs', '*'], 'Active filters', ['Docs', '*'], 'Voorbeelden', ['Docs', '*']], 'Portaal', ['Voorbeelden', ['Docs', '*']], 'Utilities', ['Divider', ['Docs', '*'], 'Featured icon', ['Docs', '*'], 'Spinner', ['Docs', '*'], 'Skeleton', ['Docs', '*'], 'Kbd', ['Docs', '*']]] } },
  },
};
export default preview;
