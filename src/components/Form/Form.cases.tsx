import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail, User } from 'lucide-react';
import { Input } from './Input';
import { Select } from './Select';
import { Textarea } from './Textarea';
import { Slider } from './Slider';

const meta: Meta<typeof Input> = {
  title: 'Components/Form inputs/Input',
  component: Input,
  args: { label: 'Email address', placeholder: 'name@example.com', hint: 'We never share your email address.', size: 'md', type: 'email', autoComplete: 'email' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] }, iconLeading: { control: false } },
  decorators: [(S) => <div style={{ maxWidth: 360 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Playground: Story = {};
export const WithIcon: Story = { args: { iconLeading: <Mail /> } };
export const WithError: Story = { args: { defaultValue: 'robert@', error: 'Enter a valid email address, for example name@example.com.' } };
export const PrefixSuffix: Story = { args: { label: 'Monthly amount', type: 'text', inputMode: 'decimal', placeholder: '0,00', prefix: '€', suffix: 'per month', hint: undefined, autoComplete: 'off' } };
export const Disabled: Story = { args: { disabled: true } };
export const Required: Story = { args: { required: true } };

export const SelectField: StoryObj<typeof Select> = {
  render: () => (
    <Select label="Country" placeholder="Choose a country" hint="Where do you live?" iconLeading={<User />} options={[{ value: 'nl', label: 'Netherlands' }, { value: 'be', label: 'Belgium' }, { value: 'de', label: 'Germany' }]} />
  ),
};
export const SelectError: StoryObj<typeof Select> = {
  render: () => <Select label="Country" placeholder="Choose a country" error="Choose a country." options={[{ value: 'nl', label: 'Netherlands' }]} />,
};
export const TextareaField: StoryObj<typeof Textarea> = {
  render: () => <Textarea label="Explanation" placeholder="Write your explanation here…" hint="Up to 500 characters." />,
};
export const SliderField: StoryObj<typeof Slider> = {
  render: () => <Slider label="Monthly amount" min={0} max={1000} step={50} defaultValue={650} formatValue={(v) => `€ ${v}`} />,
};
