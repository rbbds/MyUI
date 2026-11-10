import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type React from 'react';
import { Calendar, DatePicker, formatDate } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Form inputs/Date picker',
  component: DatePicker,
  args: { label: 'Start date', hint: 'For example 12/31/2027.' },
  decorators: [(S) => <div style={{ maxWidth: 320, minHeight: 480 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof DatePicker>;
export const Playground: Story = {};
export const WithValue: Story = { args: { defaultValue: new Date(2026, 10, 12) } };
export const MinMax: Story = { args: { label: 'Appointment date', hint: 'Choose a date in the next 30 days.', min: new Date(), max: new Date(Date.now() + 30 * 864e5) } };
export const WithError: Story = { args: { error: 'Enter a date as mm/dd/yyyy, for example 12/31/2027.' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: new Date(2026, 10, 6) } };
export const CalendarOnly: StoryObj<typeof Calendar> = {
  render: () => {
    const [d, setD] = useState<Date | null>(new Date(2026, 10, 12));
    return <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}><Calendar value={d} onChange={setD} /><span>Chosen: {d ? formatDate(d) : '–'}</span></div>;
  },
};

const CalDemo = (props: Partial<React.ComponentProps<typeof Calendar>>) => {
  const [d, setD] = useState<Date | null>(new Date(2026, 10, 12));
  return <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}><Calendar value={d} onChange={setD} {...props} /><span>Chosen: {d ? formatDate(d) : '–'}</span></div>;
};
/** Click "November 2026 ▾" to choose a year, then a month, then a day. */
export const YearMonthDay: StoryObj<typeof Calendar> = { render: () => <CalDemo views={['year', 'month', 'day']} /> };
/** Opens on the year view, useful for a date of birth. */
export const BirthDate: StoryObj<typeof Calendar> = { render: () => <CalDemo views={['year', 'month', 'day']} openTo="year" disableFuture yearsOrder="desc" /> };
export const OutsideDays: StoryObj<typeof Calendar> = { render: () => <CalDemo showDaysOutsideCurrentMonth fixedWeekNumber={6} /> };
export const DisablePastAndWeekends: StoryObj<typeof Calendar> = { render: () => <CalDemo disablePast shouldDisableDate={(d) => d.getDay() === 0 || d.getDay() === 6} /> };
