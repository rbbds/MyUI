import type { Meta, StoryObj } from '@storybook/react-vite';
import { Briefcase, Home, Plane } from 'lucide-react';
import { Combobox } from './Combobox';

const meta: Meta<typeof Combobox> = {
  title: 'Components/Form inputs/Combobox',
  component: Combobox,
  args: {
    label: 'Situatie',
    options: [
      { value: 'werk', label: 'Ik werk in loondienst', icon: <Briefcase />, keywords: ['baan'] },
      { value: 'thuis', label: 'Ik werk niet', icon: <Home /> },
      { value: 'buitenland', label: 'Ik woon in het buitenland', icon: <Plane /> },
      { value: 'anders', label: 'Anders', disabled: true },
    ],
  },
  decorators: [(S) => <div style={{ maxWidth: 360, minHeight: 320 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof Combobox>;
export const Playground: Story = {};
export const WithValue: Story = { args: { defaultValue: 'werk' } };
export const WithError: Story = { args: { error: 'Kies je situatie.' } };
