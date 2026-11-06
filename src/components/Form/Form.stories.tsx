import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail, User } from 'lucide-react';
import { Input } from './Input';
import { Select } from './Select';
import { Textarea } from './Textarea';
import { Slider } from './Slider';

const meta: Meta<typeof Input> = {
  title: 'Components/Form inputs/Input',
  component: Input,
  args: { label: 'E-mailadres', placeholder: 'naam@voorbeeld.nl', hint: 'We delen je e-mailadres nooit.', size: 'md', type: 'email', autoComplete: 'email' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] }, iconLeading: { control: false } },
  decorators: [(S) => <div style={{ maxWidth: 360 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Playground: Story = {};
export const WithIcon: Story = { args: { iconLeading: <Mail /> } };
export const WithError: Story = { args: { defaultValue: 'robert@', error: 'Vul een geldig e-mailadres in, bijvoorbeeld naam@voorbeeld.nl.' } };
export const Disabled: Story = { args: { disabled: true } };
export const Required: Story = { args: { required: true } };

export const SelectField: StoryObj<typeof Select> = {
  render: () => (
    <Select label="Land" placeholder="Kies een land" hint="Waar woon je?" iconLeading={<User />} options={[{ value: 'nl', label: 'Nederland' }, { value: 'be', label: 'België' }, { value: 'de', label: 'Duitsland' }]} />
  ),
};
export const SelectError: StoryObj<typeof Select> = {
  render: () => <Select label="Land" placeholder="Kies een land" error="Kies een land." options={[{ value: 'nl', label: 'Nederland' }]} />,
};
export const TextareaField: StoryObj<typeof Textarea> = {
  render: () => <Textarea label="Toelichting" placeholder="Schrijf hier je toelichting…" hint="Maximaal 500 tekens." />,
};
export const SliderField: StoryObj<typeof Slider> = {
  render: () => <Slider label="Maandbedrag" min={0} max={1000} step={50} defaultValue={650} formatValue={(v) => `€ ${v}`} />,
};
