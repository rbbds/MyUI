import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type React from 'react';
import { Calendar, DatePicker, formatDate } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Form inputs/Date picker',
  component: DatePicker,
  args: { label: 'Ingangsdatum', hint: 'Bijvoorbeeld 01-01-2027.' },
  decorators: [(S) => <div style={{ maxWidth: 320, minHeight: 480 }}><S /></div>],
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

const CalDemo = (props: Partial<React.ComponentProps<typeof Calendar>>) => {
  const [d, setD] = useState<Date | null>(new Date(2026, 10, 12));
  return <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}><Calendar value={d} onChange={setD} {...props} /><span>Gekozen: {d ? formatDate(d) : '–'}</span></div>;
};
/** Klik op "november 2026 ▾" om een jaar te kiezen, daarna een maand, daarna een dag. */
export const YearMonthDay: StoryObj<typeof Calendar> = { render: () => <CalDemo views={['year', 'month', 'day']} /> };
/** Opent direct op het jaaroverzicht, handig voor een geboortedatum. */
export const BirthDate: StoryObj<typeof Calendar> = { render: () => <CalDemo views={['year', 'month', 'day']} openTo="year" disableFuture yearsOrder="desc" /> };
export const OutsideDays: StoryObj<typeof Calendar> = { render: () => <CalDemo showDaysOutsideCurrentMonth fixedWeekNumber={6} /> };
export const DisablePastAndWeekends: StoryObj<typeof Calendar> = { render: () => <CalDemo disablePast shouldDisableDate={(d) => d.getDay() === 0 || d.getDay() === 6} /> };
