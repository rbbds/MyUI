import type { Meta, StoryObj } from '@storybook/react-vite';
import { Briefcase, Home, Plane } from 'lucide-react';
import { Combobox } from './Combobox';
import { useState } from 'react';
import { CountrySelect, Flag, flagCodes } from '../../flags';

const meta: Meta<typeof Combobox> = {
  title: 'Form inputs/Combobox',
  component: Combobox,
  args: {
    label: 'Situatie',
    options: [
      { value: 'werk', label: 'Ik werk in loondienst', icon: <Briefcase />, keywords: ['baan'] },
      { value: 'thuis', label: 'Ik werk niet', icon: <Home /> },
      { value: 'buitenland', label: 'Ik woon in het buitenland', icon: <Plane /> },
      { value: 'anders', label: 'Anders', disabled: true },
    ],
  },
  decorators: [(S) => <div style={{ maxWidth: 360, minHeight: 320 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof Combobox>;
export const Playground: Story = {};
export const WithValue: Story = { args: { defaultValue: 'werk' } };
export const WithError: Story = { args: { error: 'Kies je situatie.' } };

/* ---------- Country select: Combobox preset with a flag per option ---------- */

const EU = ['AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'];
const country = { label: 'Land', hint: 'Het land waar je woont.', preferred: ['NL', 'BE', 'DE'] };

/** `<CountrySelect>` uit `@rbbds/ui/flags`: Combobox met alle landen, vlaggen en Nederlandse namen. */
export const CountrySelectPlayground: Story = { name: 'Country select', render: () => <CountrySelect {...country} /> };
export const CountrySelectWithValue: Story = { name: 'Country select: met waarde', render: () => <CountrySelect {...country} defaultValue="NL" /> };
export const CountrySelectEurope: Story = { name: 'Country select: alleen EU', render: () => <CountrySelect label="Land binnen de EU" countries={EU} /> };
export const CountrySelectError: Story = { name: 'Country select: fout', render: () => <CountrySelect {...country} error="Kies een land." /> };
export const CountrySelectControlled: Story = {
  name: 'Country select: controlled',
  render: () => {
    const [v, setV] = useState<string | null>('NL');
    return <div style={{ display: 'grid', gap: 12 }}><CountrySelect {...country} value={v} onChange={setV} /><span>Gekozen: {v ?? '–'}</span></div>;
  },
};
export const FlagSizes: Story = {
  name: 'Flag: maten',
  render: () => <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>{(['sm', 'md', 'lg', 'xl'] as const).map((s) => <Flag key={s} code="NL" size={s} title={`Nederland, ${s}`} />)}</div>,
};
export const AllFlags: Story = {
  name: 'Flag: alle vlaggen',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(72px,1fr))', gap: 12 }}>
      {flagCodes.map((c) => <div key={c} style={{ display: 'grid', justifyItems: 'center', gap: 4, fontSize: 12 }}><Flag code={c} size="xl" /><code>{c}</code></div>)}
    </div>
  ),
};
