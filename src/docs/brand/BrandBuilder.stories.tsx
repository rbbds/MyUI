import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrandBuilder } from './BrandBuilder';

const meta: Meta<typeof BrandBuilder> = {
  title: 'Brand builder',
  component: BrandBuilder,
  parameters: { layout: 'padded', controls: { disable: true }, brandControlledByStory: true },
  // You choose the style in the builder itself; the Brand button in the toolbar is fixed here.
  globals: { brand: 'iris' },
};
export default meta;

/** Choose a style, fill in the brand color, fonts and logo, and copy the CSS and the Figma values. */
export const Builder: StoryObj<typeof BrandBuilder> = { name: 'Brand builder' };
