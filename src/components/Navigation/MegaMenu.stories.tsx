import type { Meta, StoryObj } from '@storybook/react-vite';
import { MegaMenu, MegaMenuLink } from './MegaMenu';
import { productMenu } from './MegaMenu.cases';
import { ChartColumn } from 'lucide-react';

const meta: Meta<typeof MegaMenu> = {
  title: 'Navigation/Mega menu',
  component: MegaMenu,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof MegaMenu>;

/** The panel on its own. In a Header it opens below the nav item (see Header/WithMegaMenu). Analytics is the current page. */
export const Panel: Story = { args: { ...productMenu } };

/** Two columns, no featured block. */
export const TwoColumns: Story = { args: { columns: productMenu.columns.slice(0, 2) } };

export const Link: StoryObj<typeof MegaMenuLink> = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, padding: 24 }}>
      <MegaMenuLink label="Analytics" href="#" description="See how your projects perform." icon={<ChartColumn />} />
      <MegaMenuLink label="Analytics" href="#" description="See how your projects perform." icon={<ChartColumn />} current />
    </div>
  ),
};
