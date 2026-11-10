import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper } from './Stepper';

const steps = [
  { title: 'Gegevens', description: 'Persoonsgegevens ingevuld', href: '#' },
  { title: 'Situatie', description: 'Werk en inkomen', href: '#' },
  { title: 'Keuzes', description: 'Kies je bedrag' },
  { title: 'Controleren', description: 'Bekijk en verstuur' },
];
const meta: Meta<typeof Stepper> = {
  title: 'Navigation/Stepper',
  component: Stepper,
  args: { steps, current: 2, orientation: 'horizontal' },
  argTypes: { orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] }, current: { control: { type: 'range', min: 0, max: 4 } } },
};
export default meta;
type Story = StoryObj<typeof Stepper>;
export const Horizontal: Story = {};
export const Vertical: Story = { args: { orientation: 'vertical' } };
