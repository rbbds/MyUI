import type { Meta, StoryObj } from '@storybook/react-vite';
import { Briefcase, Home, Plane } from 'lucide-react';
import { Combobox } from './Combobox';
import { useState } from 'react';
import { CountrySelect, Flag, flagCodes } from '../../flags';

const meta: Meta<typeof Combobox> = {
  title: 'Form inputs/Combobox',
  component: Combobox,
  args: {
    label: 'Situation',
    options: [
      { value: 'work', label: 'I am employed', icon: <Briefcase />, keywords: ['job'] },
      { value: 'home', label: 'I do not work', icon: <Home /> },
      { value: 'abroad', label: 'I live abroad', icon: <Plane /> },
      { value: 'other', label: 'Other', disabled: true },
    ],
  },
  decorators: [(S) => <div style={{ maxWidth: 360, minHeight: 320 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof Combobox>;
export const Playground: Story = {};
export const WithValue: Story = { args: { defaultValue: 'work' } };
export const WithError: Story = { args: { error: 'Choose your situation.' } };

/* ---------- Country select: Combobox preset with a flag per option ---------- */

const EU = ['AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'];
const country = { label: 'Country', hint: 'The country you live in.', preferred: ['NL', 'BE', 'DE'] };

/** `<CountrySelect>` from `@rbbds/ui/flags`: a Combobox with all countries, flags and names in the chosen locale. */
export const CountrySelectPlayground: Story = { name: 'Country select', render: () => <CountrySelect {...country} /> };
export const CountrySelectWithValue: Story = { name: 'Country select: with value', render: () => <CountrySelect {...country} defaultValue="NL" /> };
export const CountrySelectEurope: Story = { name: 'Country select: EU only', render: () => <CountrySelect label="Country in the EU" countries={EU} /> };
export const CountrySelectError: Story = { name: 'Country select: error', render: () => <CountrySelect {...country} error="Choose a country." /> };
export const CountrySelectControlled: Story = {
  name: 'Country select: controlled',
  render: () => {
    const [v, setV] = useState<string | null>('NL');
    return <div style={{ display: 'grid', gap: 12 }}><CountrySelect {...country} value={v} onChange={setV} /><span>Chosen: {v ?? '–'}</span></div>;
  },
};
export const FlagSizes: Story = {
  name: 'Flag: sizes',
  render: () => <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>{(['sm', 'md', 'lg', 'xl'] as const).map((s) => <Flag key={s} code="NL" size={s} title={`Netherlands, ${s}`} />)}</div>,
};
export const AllFlags: Story = {
  name: 'Flag: all flags',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(72px,1fr))', gap: 12 }}>
      {flagCodes.map((c) => <div key={c} style={{ display: 'grid', justifyItems: 'center', gap: 4, fontSize: 12 }}><Flag code={c} size="xl" /><code>{c}</code></div>)}
    </div>
  ),
};
