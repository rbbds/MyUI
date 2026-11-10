import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Bell, ChevronDown, CircleAlert, LogOut, Settings, Trash2, User } from 'lucide-react';
import { Alert, Toast, ToastRegion } from './Alert';
import { Modal } from './Modal';
import { DropdownMenu } from './DropdownMenu';
import { Button } from '../Button/Button';
import { FeaturedIcon, type StatusColor } from '../Display/Display';

const meta: Meta<typeof Alert> = {
  title: 'Components/Feedback & overlays/Alert',
  component: Alert,
  args: { color: 'success', title: 'Your changes are saved', children: 'A short explanation of what happened and what you can do now.' },
  argTypes: { color: { control: 'select', options: ['gray', 'brand', 'error', 'warning', 'success', 'info'] } },
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Playground: Story = { args: { onClose: () => {}, actions: <><Button hierarchy="link" size="sm" style={{ color: 'var(--alert-foreground-text)' }}>Close</Button><Button hierarchy="link" size="sm">View details</Button></> } };
export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 640 }}>
      {(['gray', 'brand', 'error', 'warning', 'success', 'info'] as StatusColor[]).map((c) => <Alert key={c} color={c} title={`Message (${c})`} onClose={() => {}}>A short explanation and what you can do now.</Alert>)}
    </div>
  ),
};
export const ToastExample: StoryObj<typeof Toast> = {
  render: () => <div style={{ display: 'grid', gap: 12 }}><Toast color="success" title="Project saved" onClose={() => {}}>Your changes are saved.</Toast><Toast color="error" title="Upload failed" onClose={() => {}} actions={<Button hierarchy="link" size="sm">Try again</Button>}>The file is larger than 10 MB.</Toast></div>,
};
export const ToastInRegion: StoryObj<typeof ToastRegion> = {
  render: () => {
    const [items, setItems] = useState<number[]>([]);
    return (
      <>
        <Button onClick={() => setItems((s) => [...s, Date.now()])}>Show message</Button>
        <ToastRegion>{items.map((id) => <Toast key={id} color="success" title="Saved" onClose={() => setItems((s) => s.filter((x) => x !== id))} />)}</ToastRegion>
      </>
    );
  },
};
export const ModalExample: StoryObj<typeof Modal> = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button destructive onClick={() => setOpen(true)} iconLeading={<Trash2 aria-hidden />}>Delete project</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          size="sm"
          icon={<FeaturedIcon color="error" size="lg" icon={<CircleAlert />} />}
          title="Delete project?"
          description="This project and all its files will be deleted. You cannot undo this."
          footer={<><Button hierarchy="secondary" size="lg" onClick={() => setOpen(false)}>Cancel</Button><Button destructive size="lg" onClick={() => setOpen(false)}>Delete</Button></>}
        />
      </>
    );
  },
};
export const Dropdown: StoryObj<typeof DropdownMenu> = {
  render: () => (
    <div style={{ minHeight: 260 }}>
      <DropdownMenu
        label="Account"
        trigger={<Button hierarchy="secondary" iconTrailing={<ChevronDown aria-hidden />}>Account</Button>}
        items={[
          { label: 'View profile', icon: <User aria-hidden />, shortcut: '⌘P', onSelect: () => {} },
          { label: 'Settings', icon: <Settings aria-hidden />, onSelect: () => {} },
          { label: 'Notifications', icon: <Bell aria-hidden />, disabled: true, onSelect: () => {} },
          { type: 'separator' },
          { label: 'Log out', icon: <LogOut aria-hidden />, destructive: true, onSelect: () => {} },
        ]}
      />
    </div>
  ),
};
