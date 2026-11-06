import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'MyUI · @rbbds/ui',
    brandUrl: 'https://github.com/rbbds/MyUI',
    colorPrimary: '#4f46e0',
    colorSecondary: '#4f46e0',
    fontBase: '"Inter", ui-sans-serif, system-ui, sans-serif',
  }),
});
