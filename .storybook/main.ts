import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  staticDirs: ['./public'],
  framework: { name: '@storybook/react-vite', options: {} },
  // Keep function and component names in the build, so "Show code" shows <Logo /> and not <W />.
  viteFinal: async (cfg) => ({ ...cfg, esbuild: { ...(cfg.esbuild || {}), keepNames: true }, build: { ...(cfg.build || {}), minify: false } }),
};
export default config;
