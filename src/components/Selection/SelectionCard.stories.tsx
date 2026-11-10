import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarDays, CreditCard, Repeat } from 'lucide-react';
import { FeaturedIcon } from '../Display/Display';
import { SelectionCard, SelectionCardGroup } from './SelectionCard';

const meta: Meta<typeof SelectionCard> = {
  title: 'Selection controls/Selection card',
  component: SelectionCard,
  args: { type: 'radio', title: 'Pay monthly', description: 'A fixed amount every month, paid automatically.', name: 'demo' },
  argTypes: { type: { control: 'inline-radio', options: ['radio', 'checkbox'] } },
  decorators: [(S) => <div style={{ maxWidth: 400 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof SelectionCard>;
export const Playground: Story = {};
export const RadioGroupCards: Story = {
  render: () => (
    <SelectionCardGroup legend="How do you want to pay?">
      <SelectionCard name="payment" value="month" defaultChecked title="Monthly" description="A fixed amount every month." icon={<FeaturedIcon size="sm" color="gray" icon={<Repeat />} />} />
      <SelectionCard name="payment" value="year" title="Yearly" description="Once a year, with a 5% discount." icon={<FeaturedIcon size="sm" color="gray" icon={<CalendarDays />} />} />
      <SelectionCard name="payment" value="one-off" title="One-off" description="Not available for this product." disabled icon={<FeaturedIcon size="sm" color="gray" icon={<CreditCard />} />} />
    </SelectionCardGroup>
  ),
};
export const CheckboxCards: Story = {
  render: () => (
    <SelectionCardGroup legend="What do you want notifications about?" columns={2}>
      <SelectionCard type="checkbox" defaultChecked title="New messages" description="An email right away." />
      <SelectionCard type="checkbox" title="Weekly summary" description="Every Monday." />
    </SelectionCardGroup>
  ),
  decorators: [(S) => <div style={{ maxWidth: 640 }}><S /></div>],
};
