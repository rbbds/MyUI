import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, ChartColumn, CircleHelp, House, Inbox, Layers, LogOut, Settings, Users } from 'lucide-react';
import { ButtonIcon } from '../Button/Button';
import { Avatar } from '../Display/Display';
import { SearchInput } from '../Form/SearchInput';
import { NavItem } from './Navigation';
import { Header, Sidebar, SidebarUser } from './AppShell';

const Logo = () => (
  <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--color-foreground-primary)', textDecoration: 'none', fontFamily: 'var(--text-body-paragraph-semibold-font-family)', fontWeight: 600 }}>
    <span aria-hidden="true" style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-surface-brand-solid)' }} />
    rbbds
  </a>
);

const meta: Meta<typeof Header> = {
  title: 'Components/Navigation/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
  args: {
    logo: <Logo />,
    links: [
      { label: 'Overzicht', href: '#', current: true, icon: <House /> },
      { label: 'Projecten', href: '#', icon: <Layers /> },
      { label: 'Team', href: '#', icon: <Users /> },
      { label: 'Rapportages', href: '#', icon: <ChartColumn /> },
    ],
    actions: <><ButtonIcon hierarchy="tertiary" icon={<Bell />} aria-label="Meldingen" /><Avatar size="sm" name="Sanne de Vries" initials="SV" /></>,
  },
  decorators: [(S) => <div style={{ margin: -24 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof Header>;
export const Desktop: Story = {};
export const Mobile: Story = { globals: { viewport: { value: 'mobile1', isRotated: false } } };

export const AppSidebar: StoryObj<typeof Sidebar> = {
  render: () => (
    <div style={{ height: 760, margin: -24, display: 'flex' }}>
      <Sidebar
        logo={<Logo />}
        search={<form role="search" onSubmit={(e) => e.preventDefault()}><SearchInput label="Zoeken" size="sm" shortcut="⌘K" /></form>}
        footer={<><NavItem href="#" icon={<Settings />}>Instellingen</NavItem><NavItem href="#" icon={<CircleHelp />}>Help</NavItem></>}
        user={<SidebarUser avatar={<Avatar name="Sanne de Vries" initials="SV" />} name="Sanne de Vries" email="sanne@voorbeeld.nl" action={<ButtonIcon hierarchy="tertiary" size="sm" icon={<LogOut />} aria-label="Uitloggen" />} />}
      >
        <NavItem href="#" icon={<House />} active>Dashboard</NavItem>
        <NavItem href="#" icon={<Layers />} count={12}>Projecten</NavItem>
        <NavItem href="#" icon={<Inbox />}>Taken</NavItem>
        <NavItem href="#" icon={<ChartColumn />}>Rapportages</NavItem>
        <NavItem href="#" icon={<Users />}>Team</NavItem>
      </Sidebar>
    </div>
  ),
};
