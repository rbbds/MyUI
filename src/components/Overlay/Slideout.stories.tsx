import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button/Button';
import { Checkbox } from '../Selection/Checkbox';
import { Select } from '../Form/Select';
import { Slideout } from './Slideout';

const meta: Meta<typeof Slideout> = {
  title: 'Components/Feedback & overlays/Slideout',
  component: Slideout,
  args: { title: 'Filters', description: 'Verfijn de resultaten in de lijst.', size: 'md', side: 'right' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] }, side: { control: 'inline-radio', options: ['right', 'left'] } },
};
export default meta;
type Story = StoryObj<typeof Slideout>;
export const Playground: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button hierarchy="secondary" onClick={() => setOpen(true)}>Filters</Button>
        <Slideout {...args} open={open} onClose={() => setOpen(false)} footer={<><Button hierarchy="secondary" onClick={() => setOpen(false)}>Annuleren</Button><Button onClick={() => setOpen(false)}>Toepassen</Button></>}>
          <Select label="Status" placeholder="Alle statussen" options={[{ value: 'actief', label: 'Actief' }, { value: 'concept', label: 'Concept' }]} />
          <Checkbox label="Alleen mijn projecten" />
          <Checkbox label="Gearchiveerde projecten tonen" />
        </Slideout>
      </>
    );
  },
};
