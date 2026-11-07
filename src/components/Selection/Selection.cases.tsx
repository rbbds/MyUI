import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Radio, RadioGroup, Toggle } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Selection controls/Checkbox',
  component: Checkbox,
  args: { label: 'Ik ga akkoord met de voorwaarden', hint: 'Lees de voorwaarden voordat je verdergaat.', size: 'sm', indeterminate: false, disabled: false },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Playground: Story = {};
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Checkbox label="Niet geselecteerd" />
      <Checkbox label="Geselecteerd" defaultChecked />
      <Checkbox label="Deels geselecteerd" indeterminate />
      <Checkbox label="Uitgeschakeld" disabled />
      <Checkbox label="Uitgeschakeld en geselecteerd" disabled defaultChecked />
    </div>
  ),
};
export const Radios: StoryObj<typeof Radio> = {
  render: () => (
    <RadioGroup legend="Hoe wil je betalen?">
      <Radio name="betaling" value="maand" label="Maandelijks" hint="Betaal elke maand een vast bedrag." defaultChecked />
      <Radio name="betaling" value="jaar" label="Jaarlijks" hint="Betaal één keer per jaar." />
      <Radio name="betaling" value="eenmalig" label="Eenmalig" disabled />
    </RadioGroup>
  ),
};
export const Toggles: StoryObj<typeof Toggle> = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Toggle label="Meldingen ontvangen" hint="Ontvang een e-mail bij nieuwe berichten." defaultChecked />
      <Toggle size="md" label="Donkere modus" />
      <Toggle label="Uitgeschakeld" disabled />
    </div>
  ),
};
