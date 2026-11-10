import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd, Skeleton } from './Feedback';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Display/Skeleton',
  component: Skeleton,
  args: { variant: 'text', lines: 3 },
  argTypes: { variant: { control: 'inline-radio', options: ['text', 'circle', 'rect'] } },
  decorators: [(S) => <div style={{ maxWidth: 360 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof Skeleton>;
export const Playground: Story = {};
export const CardLoading: Story = {
  render: () => (
    <div aria-busy="true" style={{ display: 'grid', gap: 16, padding: 24, border: '1px solid var(--card-border)', borderRadius: 12 }}>
      <span className="rb-visually-hidden" role="status">Loading projects</span>
      <Skeleton variant="rect" />
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Skeleton variant="circle" />
        <div style={{ flex: 1 }}><Skeleton lines={2} /></div>
      </div>
    </div>
  ),
};
export const Shortcuts: StoryObj<typeof Kbd> = {
  render: () => <p style={{ display: 'flex', gap: 8, alignItems: 'center', margin: 0 }}>Open search with <Kbd>⌘K</Kbd> of <Kbd>Ctrl</Kbd><Kbd>K</Kbd></p>,
};
