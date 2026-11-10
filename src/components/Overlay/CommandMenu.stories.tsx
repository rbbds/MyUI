import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useState } from 'react';
import { House, Layers, LogOut, Plus, Settings, UserPlus } from 'lucide-react';
import { Button } from '../Button/Button';
import { Kbd } from '../Display/Feedback';
import { CommandMenu, useCommandShortcut, type CommandItem } from './CommandMenu';

const items: CommandItem[] = [
  { id: 'dashboard', group: "Pages", label: 'Dashboard', icon: <House />, onSelect: () => {} },
  { id: 'projects', group: "Pages", label: 'Projects', icon: <Layers />, keywords: ['work'], onSelect: () => {} },
  { id: 'settings', group: "Pages", label: 'Settings', icon: <Settings />, keywords: ['profile', 'account'], onSelect: () => {} },
  { id: 'new', group: 'Actions', label: 'New project', icon: <Plus />, shortcut: '⌘N', onSelect: () => {} },
  { id: 'invite', group: 'Actions', label: 'Invite team member', icon: <UserPlus />, onSelect: () => {} },
  { id: 'log out', group: 'Actions', label: 'Log out', icon: <LogOut />, disabled: true, onSelect: () => {} },
];

const meta: Meta<typeof CommandMenu> = {
  title: 'Overlays/Command menu',
  component: CommandMenu,
};
export default meta;
export const Playground: StoryObj<typeof CommandMenu> = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [last, setLast] = useState('–');
    const openMenu = useCallback(() => setOpen(true), []);
    useCommandShortcut(openMenu);
    const withLog = items.map((i) => ({ ...i, onSelect: () => setLast(i.label) }));
    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <Button hierarchy="secondary" onClick={openMenu}>Search <Kbd>⌘K</Kbd></Button>
        <span className="rb-text-md">Last chosen: {last}</span>
        <CommandMenu open={open} onClose={() => setOpen(false)} items={withLog} />
      </div>
    );
  },
};
