import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ChartColumn, House, Inbox, Layers, Settings, Users } from 'lucide-react';
import { Breadcrumbs, NavItem, Pagination, Tabs } from './Navigation';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  args: {
    'aria-label': 'Projectonderdelen',
    type: 'underline',
    items: [
      { id: 'overzicht', label: 'Overzicht', content: 'Inhoud van Overzicht' },
      { id: 'details', label: 'Details', content: 'Inhoud van Details' },
      { id: 'documenten', label: 'Documenten', count: 3, content: 'Inhoud van Documenten' },
      { id: 'instellingen', label: 'Instellingen', content: 'Inhoud van Instellingen' },
    ],
  },
  argTypes: { type: { control: 'inline-radio', options: ['underline', 'pill'] } },
};
export default meta;
type Story = StoryObj<typeof Tabs>;
export const Underline: Story = {};
export const Pill: Story = { args: { type: 'pill' } };

export const Breadcrumb: StoryObj<typeof Breadcrumbs> = {
  render: () => <Breadcrumbs homeHref="#" items={[{ label: 'Projecten', href: '#' }, { label: 'Klant A', href: '#' }, { label: 'Design system' }]} />,
};
export const PaginationExample: StoryObj<typeof Pagination> = {
  render: () => { const [p, setP] = useState(1); return <Pagination page={p} pageCount={10} onPageChange={setP} />; },
};
export const Sidebar: StoryObj<typeof NavItem> = {
  render: () => (
    <nav aria-label="Hoofdmenu" style={{ width: 272, display: 'grid', gap: 4 }}>
      <NavItem href="#" icon={<House aria-hidden />} active>Dashboard</NavItem>
      <NavItem href="#" icon={<Layers aria-hidden />}>Projecten</NavItem>
      <NavItem href="#" icon={<Inbox aria-hidden />} count={10}>Inbox</NavItem>
      <NavItem href="#" icon={<ChartColumn aria-hidden />}>Rapportages</NavItem>
      <NavItem href="#" icon={<Users aria-hidden />}>Team</NavItem>
      <NavItem href="#" icon={<Settings aria-hidden />}>Instellingen</NavItem>
    </nav>
  ),
};
