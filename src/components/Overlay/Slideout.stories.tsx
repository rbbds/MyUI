import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button/Button';
import { Checkbox } from '../Selection/Checkbox';
import { Select } from '../Form/Select';
import { Slideout } from './Slideout';

const meta: Meta<typeof Slideout> = {
  title: 'Overlays/Slideout',
  component: Slideout,
  args: { title: 'Filters', description: 'Narrow down the results in the list.', size: 'md', side: 'right' },
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
        <Slideout {...args} open={open} onClose={() => setOpen(false)} footer={<><Button hierarchy="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => setOpen(false)}>Apply</Button></>}>
          <Select label="Status" placeholder="All statuses" options={[{ value: 'active', label: 'Active' }, { value: 'draft', label: 'Draft' }]} />
          <Checkbox label="Only my projects" />
          <Checkbox label="Show archived projects" />
        </Slideout>
      </>
    );
  },
};
