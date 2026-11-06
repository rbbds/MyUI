import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Calendar, DatePicker, formatDate } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/Form inputs/Date picker',
  component: DatePicker,
  args: { label: 'Ingangsdatum', hint: 'Bijvoorbeeld 01-01-2027.' },
  decorators: [(S) => <div style={{ maxWidth: 320, minHeight: 440 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof DatePicker>;
export const Playground: Story = {};
export const WithValue: Story = { args: { defaultValue: new Date(2026, 10, 12) } };
export const MinMax: Story = { args: { label: 'Afspraakdatum', hint: 'Kies een datum in de komende 30 dagen.', min: new Date(), max: new Date(Date.now() + 30 * 864e5) } };
export const WithError: Story = { args: { error: 'Vul een datum in als dd-mm-jjjj, bijvoorbeeld 01-01-2027.' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: new Date(2026, 10, 6) } };
export const CalendarOnly: StoryObj<typeof Calendar> = {
  render: () => {
    const [d, setD] = useState<Date | null>(new Date(2026, 10, 12));
    return <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}><Calendar value={d} onChange={setD} /><span>Gekozen: {d ? formatDate(d) : '–'}</span></div>;
  },
};
