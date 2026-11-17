// Stories for the internal Close button (Figma: _Close button). Used by Tag, Alert, Toast, Modal and Slideout.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CloseButton } from './CloseButton';

const meta = {
  title: 'Utilities/Close button',
  component: CloseButton,
  args: { size: 'sm', 'aria-label': 'Close' },
} satisfies Meta<typeof CloseButton>;
export default meta;

export const Sizes: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'center' }}>
      <CloseButton size="xs" aria-label="Remove Design" />
      <CloseButton size="sm" aria-label="Close alert" />
      <CloseButton size="md" aria-label="Close dialog" />
    </div>
  ),
};
