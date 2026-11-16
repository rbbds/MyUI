import type { Meta, StoryObj } from '@storybook/react-vite';
import { MobileNav } from './MegaMenu';
import { siteLinks } from './MegaMenu.cases';

const meta: Meta<typeof MobileNav> = {
  title: 'Navigation/Mobile nav',
  component: MobileNav,
  args: { label: 'Main menu', items: siteLinks },
  decorators: [(S) => <div style={{ maxWidth: 360 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof MobileNav>;

/** The navigation of the mobile menu. The section with the current page (Product) starts open. */
export const Default: Story = {};
