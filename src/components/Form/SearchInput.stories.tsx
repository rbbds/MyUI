import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SearchInput } from './SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: 'Form inputs/Search input',
  component: SearchInput,
  args: { label: 'Zoeken in projecten', placeholder: 'Zoeken', shortcut: '⌘K', size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  decorators: [(S) => <form role="search" style={{ maxWidth: 360 }} onSubmit={(e) => e.preventDefault()}><S /></form>],
};
export default meta;
type Story = StoryObj<typeof SearchInput>;
export const Playground: Story = {};
export const Filled: Story = { args: { defaultValue: 'pensioen' } };
export const WithLabel: Story = { args: { showLabel: true, shortcut: undefined } };
export const Disabled: Story = { args: { disabled: true } };
export const Controlled: Story = {
  render: (args) => {
    const [q, setQ] = useState('');
    return <><SearchInput {...args} value={q} onChange={setQ} /><p style={{ font: 'inherit', color: 'var(--color-foreground-tertiary)' }}>Zoekterm: {q || '–'}</p></>;
  },
};
