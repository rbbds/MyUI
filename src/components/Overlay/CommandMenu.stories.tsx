import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useState } from 'react';
import { House, Layers, LogOut, Plus, Settings, UserPlus } from 'lucide-react';
import { Button } from '../Button/Button';
import { Kbd } from '../Display/Feedback';
import { CommandMenu, useCommandShortcut, type CommandItem } from './CommandMenu';

const items: CommandItem[] = [
  { id: 'dashboard', group: "Pagina's", label: 'Dashboard', icon: <House />, onSelect: () => {} },
  { id: 'projecten', group: "Pagina's", label: 'Projecten', icon: <Layers />, keywords: ['werk'], onSelect: () => {} },
  { id: 'instellingen', group: "Pagina's", label: 'Instellingen', icon: <Settings />, keywords: ['profiel', 'account'], onSelect: () => {} },
  { id: 'nieuw', group: 'Acties', label: 'Nieuw project', icon: <Plus />, shortcut: '⌘N', onSelect: () => {} },
  { id: 'uitnodigen', group: 'Acties', label: 'Teamlid uitnodigen', icon: <UserPlus />, onSelect: () => {} },
  { id: 'uitloggen', group: 'Acties', label: 'Uitloggen', icon: <LogOut />, disabled: true, onSelect: () => {} },
];

const meta: Meta<typeof CommandMenu> = {
  title: 'Components/Feedback & overlays/Command menu',
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
        <Button hierarchy="secondary" onClick={openMenu}>Zoeken <Kbd>⌘K</Kbd></Button>
        <span className="rb-text-md">Laatst gekozen: {last}</span>
        <CommandMenu open={open} onClose={() => setOpen(false)} items={withLog} />
      </div>
    );
  },
};
