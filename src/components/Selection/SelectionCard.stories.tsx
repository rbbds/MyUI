import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarDays, CreditCard, Repeat } from 'lucide-react';
import { FeaturedIcon } from '../Display/Display';
import { SelectionCard, SelectionCardGroup } from './SelectionCard';

const meta: Meta<typeof SelectionCard> = {
  title: 'Selection controls/Selection card',
  component: SelectionCard,
  args: { type: 'radio', title: 'Maandelijks betalen', description: 'Elke maand een vast bedrag, automatisch afgeschreven.', name: 'demo' },
  argTypes: { type: { control: 'inline-radio', options: ['radio', 'checkbox'] } },
  decorators: [(S) => <div style={{ maxWidth: 400 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof SelectionCard>;
export const Playground: Story = {};
export const RadioGroupCards: Story = {
  render: () => (
    <SelectionCardGroup legend="Hoe wil je betalen?">
      <SelectionCard name="betalen" value="maand" defaultChecked title="Maandelijks" description="Elke maand een vast bedrag." icon={<FeaturedIcon size="sm" color="gray" icon={<Repeat />} />} />
      <SelectionCard name="betalen" value="jaar" title="Jaarlijks" description="Eén keer per jaar, met 5% korting." icon={<FeaturedIcon size="sm" color="gray" icon={<CalendarDays />} />} />
      <SelectionCard name="betalen" value="eenmalig" title="Eenmalig" description="Niet beschikbaar voor dit product." disabled icon={<FeaturedIcon size="sm" color="gray" icon={<CreditCard />} />} />
    </SelectionCardGroup>
  ),
};
export const CheckboxCards: Story = {
  render: () => (
    <SelectionCardGroup legend="Waar wil je meldingen over?" columns={2}>
      <SelectionCard type="checkbox" defaultChecked title="Nieuwe berichten" description="Direct een e-mail." />
      <SelectionCard type="checkbox" title="Wekelijkse samenvatting" description="Elke maandag." />
    </SelectionCardGroup>
  ),
  decorators: [(S) => <div style={{ maxWidth: 640 }}><S /></div>],
};
