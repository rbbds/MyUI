import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ArrowRight, Plus, Trash2, Pencil } from 'lucide-react';
import { Button, ButtonIcon } from './Button';
import { ButtonGroup } from './ButtonGroup';

const meta: Meta<typeof Button> = {
  title: 'Components/Buttons/Button',
  component: Button,
  args: { children: 'Button', hierarchy: 'primary', size: 'md', destructive: false, loading: false, disabled: false },
  argTypes: {
    hierarchy: { control: 'inline-radio', options: ['primary', 'secondary', 'tertiary', 'link'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    iconLeading: { control: false },
    iconTrailing: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Hierarchies: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button {...args} size={size} hierarchy="primary">Primary</Button>
          <Button {...args} size={size} hierarchy="secondary">Secondary</Button>
          <Button {...args} size={size} hierarchy="tertiary">Tertiary</Button>
          <Button {...args} size={size} hierarchy="link">Link</Button>
        </div>
      ))}
    </div>
  ),
};

export const Destructive: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} destructive hierarchy="primary" iconLeading={<Trash2 aria-hidden />}>Verwijderen</Button>
      <Button {...args} destructive hierarchy="secondary">Verwijderen</Button>
      <Button {...args} destructive hierarchy="tertiary">Verwijderen</Button>
      <Button {...args} destructive hierarchy="link">Verwijderen</Button>
    </div>
  ),
};

export const WithIcons: Story = { args: { iconLeading: <Plus aria-hidden />, children: 'Nieuw project' } };
export const TrailingIcon: Story = { args: { iconTrailing: <ArrowRight aria-hidden />, children: 'Volgende', hierarchy: 'secondary' } };
export const Loading: Story = { args: { loading: true, children: 'Opslaan…' } };
export const Disabled: Story = { args: { disabled: true } };

export const IconOnly: StoryObj<typeof ButtonIcon> = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {(['primary', 'secondary', 'tertiary'] as const).map((h) => (
        <ButtonIcon key={h} hierarchy={h} icon={<Pencil aria-hidden />} aria-label="Bewerken" />
      ))}
      <ButtonIcon hierarchy="secondary" destructive icon={<Trash2 aria-hidden />} aria-label="Verwijderen" />
    </div>
  ),
};

export const Group: StoryObj<typeof ButtonGroup> = {
  render: () => {
    const [v, setV] = useState('week');
    return (
      <ButtonGroup aria-label="Periode" value={v} onChange={setV} options={[{ value: 'dag', label: 'Dag' }, { value: 'week', label: 'Week' }, { value: 'maand', label: 'Maand' }, { value: 'jaar', label: 'Jaar' }]} />
    );
  },
};
