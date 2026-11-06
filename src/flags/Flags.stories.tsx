import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Flag, flagCodes } from './Flag';
import { CountrySelect } from './CountrySelect';

const meta: Meta<typeof CountrySelect> = {
  title: 'Form inputs/Country select',
  component: CountrySelect,
  args: { label: 'Land', hint: 'Het land waar je woont.', preferred: ['NL', 'BE', 'DE'] },
  decorators: [(S) => <div style={{ maxWidth: 360, minHeight: 440 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof CountrySelect>;

export const Playground: Story = {};
export const WithValue: Story = { args: { defaultValue: 'NL' } };
export const Europe: Story = { args: { label: 'Land binnen de EU', preferred: [], countries: ['AT','BE','BG','CY','CZ','DE','DK','EE','ES','FI','FR','GR','HR','HU','IE','IT','LT','LU','LV','MT','NL','PL','PT','RO','SE','SI','SK'] } };
export const WithError: Story = { args: { error: 'Kies een land.' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'BE' } };
export const Controlled: Story = {
  render: (args) => {
    const [v, setV] = useState<string | null>('NL');
    return <div style={{ display: 'grid', gap: 12 }}><CountrySelect {...args} value={v} onChange={setV} /><span>Gekozen: {v ?? '–'}</span></div>;
  },
};

export const FlagSizes: StoryObj<typeof Flag> = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {(['sm', 'md', 'lg', 'xl'] as const).map((s) => <Flag key={s} code="NL" size={s} title={`Nederland, ${s}`} />)}
    </div>
  ),
};
export const AllFlags: StoryObj<typeof Flag> = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(72px,1fr))', gap: 12 }}>
      {flagCodes.map((c) => <div key={c} style={{ display: 'grid', justifyItems: 'center', gap: 4, fontSize: 12 }}><Flag code={c} size="xl" /><code>{c}</code></div>)}
    </div>
  ),
};
