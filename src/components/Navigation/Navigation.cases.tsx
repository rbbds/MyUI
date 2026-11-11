import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ChartColumn, House, Inbox, Layers, Settings, Users } from 'lucide-react';
import { Breadcrumbs, NavItem, Pagination, Tabs } from './Navigation';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  args: {
    'aria-label': 'Project sections',
    type: 'underline',
    items: [
      { id: 'overview', label: 'Overview', content: 'Overview content' },
      { id: 'details', label: 'Details', content: 'Details content' },
      { id: 'documents', label: 'Documents', count: 3, content: 'Documents content' },
      { id: 'settings', label: 'Settings', content: 'Settings content' },
    ],
  },
  argTypes: { type: { control: 'inline-radio', options: ['underline', 'pill'] } },
};
export default meta;
type Story = StoryObj<typeof Tabs>;
export const Underline: Story = {};
export const Pill: Story = { args: { type: 'pill' } };

export const Breadcrumb: StoryObj<typeof Breadcrumbs> = {
  render: () => <Breadcrumbs homeHref="#" items={[{ label: 'Projects', href: '#' }, { label: 'Client A', href: '#' }, { label: 'Design system' }]} />,
};
export const BreadcrumbWithBack: StoryObj<typeof Breadcrumbs> = {
  render: () => <Breadcrumbs back={{ href: '#', label: 'Back' }} items={[{ label: 'Workspace', href: '#' }, { label: 'Projects', href: '#' }, { label: 'Design system' }]} />,
};
export const PaginationExample: StoryObj<typeof Pagination> = {
  render: () => { const [p, setP] = useState(1); return <Pagination page={p} pageCount={10} onPageChange={setP} />; },
};
export const Sidebar: StoryObj<typeof NavItem> = {
  render: () => (
    <nav aria-label="Main menu" style={{ width: 272, display: 'grid', gap: 4 }}>
      <NavItem href="#" icon={<House aria-hidden />} active>Dashboard</NavItem>
      <NavItem href="#" icon={<Layers aria-hidden />}>Projects</NavItem>
      <NavItem href="#" icon={<Inbox aria-hidden />} count={10}>Inbox</NavItem>
      <NavItem href="#" icon={<ChartColumn aria-hidden />}>Reports</NavItem>
      <NavItem href="#" icon={<Users aria-hidden />}>Team</NavItem>
      <NavItem href="#" icon={<Settings aria-hidden />}>Settings</NavItem>
    </nav>
  ),
};
