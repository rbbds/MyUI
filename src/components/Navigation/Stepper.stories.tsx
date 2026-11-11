import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper } from './Stepper';

const steps = [
  { title: 'Details', description: 'Personal details filled in', href: '#' },
  { title: 'Situation', description: 'Team size', href: '#' },
  { title: 'Plan', description: 'Choose your plan' },
  { title: 'Review', description: 'Check and send' },
];
const meta: Meta<typeof Stepper> = {
  title: 'Navigation/Stepper',
  component: Stepper,
  args: { steps, current: 2, orientation: 'horizontal' },
  argTypes: { orientation: { control: 'inline-radio', options: ['horizontal', 'vertical', 'compact'] }, current: { control: { type: 'range', min: 0, max: 4 } } },
};
export default meta;
type Story = StoryObj<typeof Stepper>;
export const Horizontal: Story = {};
export const Vertical: Story = { args: { orientation: 'vertical' } };
export const Compact: Story = {
  args: { orientation: 'compact' },
  decorators: [(S) => <div style={{ maxWidth: 375 }}><S /></div>],
};
