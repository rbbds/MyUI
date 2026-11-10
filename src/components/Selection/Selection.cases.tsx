import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Radio, RadioGroup, Toggle } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Selection controls/Checkbox',
  component: Checkbox,
  args: { label: 'I agree to the terms', hint: 'Read the terms before you continue.', size: 'sm', indeterminate: false, disabled: false },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Playground: Story = {};
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Checkbox label="Not selected" />
      <Checkbox label="Selected" defaultChecked />
      <Checkbox label="Partly selected" indeterminate />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled and selected" disabled defaultChecked />
    </div>
  ),
};
export const Radios: StoryObj<typeof Radio> = {
  render: () => (
    <RadioGroup legend="How do you want to pay?">
      <Radio name="payment" value="month" label="Monthly" hint="Pay a fixed amount every month." defaultChecked />
      <Radio name="payment" value="year" label="Yearly" hint="Pay once a year." />
      <Radio name="payment" value="one-off" label="One-off" disabled />
    </RadioGroup>
  ),
};
export const Toggles: StoryObj<typeof Toggle> = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Toggle label="Get notifications" hint="Get an email when there are new messages." defaultChecked />
      <Toggle size="md" label="Dark mode" />
      <Toggle label="Disabled" disabled />
    </div>
  ),
};
