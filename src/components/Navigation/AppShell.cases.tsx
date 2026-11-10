import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Bell, ChartColumn, CircleHelp, EllipsisVertical, House, Inbox, Layers, Lock, LogOut, Search, Settings, User, Users } from 'lucide-react';
import { ButtonIcon } from '../Button/Button';
import { Avatar } from '../Display/Display';
import { SearchInput } from '../Form/SearchInput';
import { NavItem } from './Navigation';
import { Logo as BrandLogo } from '../../docs/brand/Logo';
import { DualSidebar, Header, Sidebar, SidebarUser } from './AppShell';

const Logo = ({ size = 'large' }: { size?: 'large' | 'small' }) => (
  <a href="#" aria-label="MyUI home" style={{ display: 'inline-flex', textDecoration: 'none' }}>
    <BrandLogo size={size} tagline="" label="MyUI" />
  </a>
);

const meta: Meta<typeof Header> = {
  title: 'Components/Navigation/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
  args: {
    logo: <Logo />,
    links: [
      { label: 'Overview', href: '#', current: true, icon: <House /> },
      { label: 'Projects', href: '#', icon: <Layers /> },
      { label: 'Team', href: '#', icon: <Users /> },
      { label: 'Reports', href: '#', icon: <ChartColumn /> },
    ],
    actions: <><ButtonIcon hierarchy="tertiary" icon={<Bell />} aria-label="Notifications" /><Avatar size="sm" name="Sanne de Vries" initials="SV" /></>,
  },
  decorators: [(S) => <div style={{ margin: -24 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof Header>;
export const Desktop: Story = {};
export const Mobile: Story = { globals: { viewport: { value: 'mobile1', isRotated: false } } };

export const AppSidebar: StoryObj<typeof Sidebar> = {
  render: () => (
    <div style={{ height: 760, display: 'flex' }}>
      <Sidebar
        logo={<Logo />}
        search={<form role="search" onSubmit={(e) => e.preventDefault()}><SearchInput label="Search" size="sm" shortcut="⌘K" /></form>}
        footer={<><NavItem href="#" icon={<Settings />}>Settings</NavItem><NavItem href="#" icon={<CircleHelp />}>Help</NavItem></>}
        user={<SidebarUser avatar={<Avatar name="Sanne de Vries" initials="SV" />} name="Sanne de Vries" email="sanne@example.com" action={<ButtonIcon hierarchy="tertiary" size="sm" icon={<LogOut />} aria-label="Log out" />} />}
      >
        <NavItem href="#" icon={<House />} active>Dashboard</NavItem>
        <NavItem href="#" icon={<Layers />} count={12}>Projects</NavItem>
        <NavItem href="#" icon={<Inbox />}>Taken</NavItem>
        <NavItem href="#" icon={<ChartColumn />}>Reports</NavItem>
        <NavItem href="#" icon={<Users />}>Team</NavItem>
      </Sidebar>
    </div>
  ),
};

const mainNav = (
  <>
    <NavItem href="#" icon={<House />} active>Dashboard</NavItem>
    <NavItem href="#" icon={<Layers />} count={12}>Projects</NavItem>
    <NavItem href="#" icon={<Inbox />}>Tasks</NavItem>
    <NavItem href="#" icon={<ChartColumn />}>Reports</NavItem>
    <NavItem href="#" icon={<Users />}>Team</NavItem>
  </>
);

function CollapsibleDemo() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div style={{ height: 760, display: 'flex' }}>
      <Sidebar
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        logo={<Logo />}
        logoCollapsed={<Logo size="small" />}
        search={<form role="search" onSubmit={(e) => e.preventDefault()}><SearchInput label="Search" size="sm" shortcut="⌘K" /></form>}
        searchCollapsed={<ButtonIcon hierarchy="tertiary" size="sm" icon={<Search />} aria-label="Search" />}
        footer={<><NavItem href="#" icon={<Settings />}>Settings</NavItem><NavItem href="#" icon={<CircleHelp />}>Help</NavItem></>}
        user={<SidebarUser avatar={<Avatar name="Sanne de Vries" initials="SV" />} name="Sanne de Vries" email="sanne@example.com" action={<ButtonIcon hierarchy="tertiary" size="sm" icon={<LogOut />} aria-label="Log out" />} />}
        userCollapsed={<Avatar name="Sanne de Vries" initials="SV" />}
      >
        {mainNav}
      </Sidebar>
    </div>
  );
}
export const CollapsibleSidebar: StoryObj<typeof Sidebar> = { name: 'Collapsible', render: () => <CollapsibleDemo /> };
export const CollapsedSidebar: StoryObj<typeof Sidebar> = {
  name: 'Collapsed',
  render: () => (
    <div style={{ height: 760, display: 'flex' }}>
      <Sidebar collapsed onCollapsedChange={() => {}} logo={<Logo />} logoCollapsed={<Logo size="small" />} searchCollapsed={<ButtonIcon hierarchy="tertiary" size="sm" icon={<Search />} aria-label="Search" />} footer={<><NavItem href="#" icon={<Settings />}>Settings</NavItem><NavItem href="#" icon={<CircleHelp />}>Help</NavItem></>} user={<span />} userCollapsed={<Avatar name="Sanne de Vries" initials="SV" />}>
        {mainNav}
      </Sidebar>
    </div>
  ),
};

function DualDemo() {
  const [collapsed, setCollapsed] = useState(false);
  const open = () => setCollapsed(false);
  return (
    <div style={{ height: 760, display: 'flex' }}>
      <DualSidebar
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        logo={<Logo size="small" />}
        rail={<>
          <NavItem href="#" icon={<House />} onClick={open}>Dashboard</NavItem>
          <NavItem href="#" icon={<Layers />} count={12} onClick={open}>Projects</NavItem>
          <NavItem href="#" icon={<Inbox />} onClick={open}>Tasks</NavItem>
          <NavItem href="#" icon={<ChartColumn />} onClick={open}>Reports</NavItem>
          <NavItem href="#" icon={<Users />} onClick={open}>Team</NavItem>
        </>}
        railFooter={<><NavItem href="#" icon={<Settings />} active onClick={open}>Settings</NavItem><NavItem href="#" icon={<CircleHelp />} onClick={open}>Help</NavItem></>}
        avatar={<Avatar name="Sanne de Vries" initials="SV" />}
        title="Settings"
        user={<SidebarUser name="Sanne de Vries" email="sanne@example.com" action={<ButtonIcon hierarchy="tertiary" size="sm" icon={<EllipsisVertical />} aria-label="Account menu" />} />}
      >
        <NavItem href="#" icon={<User />}>Profile</NavItem>
        <NavItem href="#" icon={<Lock />} active>Security</NavItem>
        <NavItem href="#" icon={<Bell />}>Notifications</NavItem>
        <NavItem href="#" icon={<Users />}>Team members</NavItem>
      </DualSidebar>
    </div>
  );
}
export const TwoLevelSidebar: StoryObj<typeof DualSidebar> = { name: 'Two levels (dual)', render: () => <DualDemo /> };
