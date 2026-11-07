import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrandBuilder } from './BrandBuilder';

const meta: Meta<typeof BrandBuilder> = {
  title: 'Brand builder',
  component: BrandBuilder,
  parameters: { layout: 'padded', controls: { disable: true }, brandControlledByStory: true },
  // Stijl kies je in de builder zelf; de Brand-knop in de toolbar staat hier vast.
  globals: { brand: 'iris' },
};
export default meta;

/** Kies een stijl, vul huisstijlkleur, lettertypes en logo in, en kopieer de CSS en de Figma-waarden. */
export const Builder: StoryObj<typeof BrandBuilder> = { name: 'Brand builder' };
