import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartColumn, FolderKanban, House, ListChecks, Plus, Users } from 'lucide-react';
import { BottomNavigation, BottomNavItem } from './BottomNavigation';

const meta: Meta<typeof BottomNavigation> = {
  title: 'Navigation/Bottom navigation',
  component: BottomNavigation,
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'mobile1' } },
  decorators: [(S) => <div style={{ maxWidth: 375 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof BottomNavigation>;

export const Default: Story = {
  render: () => (
    <BottomNavigation>
      <BottomNavItem href="#" icon={<House />} active>Home</BottomNavItem>
      <BottomNavItem href="#" icon={<FolderKanban />}>Projects</BottomNavItem>
      <BottomNavItem href="#" icon={<ListChecks />} badge>Tasks</BottomNavItem>
      <BottomNavItem href="#" icon={<ChartColumn />}>Reports</BottomNavItem>
      <BottomNavItem href="#" icon={<Users />}>Team</BottomNavItem>
    </BottomNavigation>
  ),
};

export const ThreeItems: Story = {
  render: () => (
    <BottomNavigation>
      <BottomNavItem href="#" icon={<House />}>Home</BottomNavItem>
      <BottomNavItem href="#" icon={<FolderKanban />} active>Projects</BottomNavItem>
      <BottomNavItem href="#" icon={<Users />}>Team</BottomNavItem>
    </BottomNavigation>
  ),
};

export const WithAction: Story = {
  render: () => (
    <div style={{ paddingTop: 24 }}>
      <BottomNavigation action={{ icon: <Plus />, label: 'New project', onClick: () => undefined }}>
        <BottomNavItem href="#" icon={<House />} active>Home</BottomNavItem>
        <BottomNavItem href="#" icon={<FolderKanban />}>Projects</BottomNavItem>
        <BottomNavItem href="#" icon={<ListChecks />}>Tasks</BottomNavItem>
        <BottomNavItem href="#" icon={<ChartColumn />}>Reports</BottomNavItem>
      </BottomNavigation>
    </div>
  ),
};
