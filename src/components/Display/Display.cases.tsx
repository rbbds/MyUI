import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CircleAlert, CircleCheck, Info, Pencil, Star, TriangleAlert } from 'lucide-react';
import { Avatar, AvatarGroup, Badge, Divider, FeaturedIcon, ProgressBar, Spinner, Tag, Tooltip, type StatusColor } from './Display';
import { ButtonIcon } from '../Button/Button';

const colors: StatusColor[] = ['gray', 'brand', 'error', 'warning', 'success', 'info'];
const row = { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' as const };

const meta: Meta<typeof Badge> = {
  title: 'Components/Display/Badge',
  component: Badge,
  args: { children: 'Active', color: 'success', size: 'md', dot: true },
  argTypes: { color: { control: 'select', options: colors }, size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Playground: Story = {};
export const AllColors: Story = { render: () => <div style={{ display: 'grid', gap: 12 }}>{(['sm', 'md', 'lg'] as const).map((s) => <div key={s} style={row}>{colors.map((c) => <Badge key={c} color={c} size={s} dot>{c}</Badge>)}</div>)}</div> };

export const Tags: StoryObj<typeof Tag> = {
  render: () => {
    const [tags, setTags] = useState(['Design', 'Tokens', 'React']);
    return <div style={row}>{tags.map((t) => <Tag key={t} onRemove={() => setTags(tags.filter((x) => x !== t))}>{t}</Tag>)}<Tag dot size="sm">Online</Tag></div>;
  },
};

export const Avatars: StoryObj<typeof Avatar> = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={row}>{(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((s) => <Avatar key={s} size={s} name="Robert Trimp" status="online" />)}</div>
      <div style={row}><Avatar name="Unknown" initials="" /><Avatar name="Anne de Vries" status="offline" /></div>
      <AvatarGroup size="md" max={4}>
        {['Robert Trimp', 'Anne de Vries', 'Jan Bakker', 'Mila Kok', 'Sam Jansen', 'Eva Smit'].map((n) => <Avatar key={n} name={n} />)}
      </AvatarGroup>
    </div>
  ),
};

export const Dividers: StoryObj<typeof Divider> = { render: () => <div style={{ display: 'grid', gap: 24, maxWidth: 480 }}><Divider /><Divider label="of" /></div> };

export const FeaturedIcons: StoryObj<typeof FeaturedIcon> = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div key={s} style={row}>
          <FeaturedIcon size={s} color="gray" icon={<Star />} />
          <FeaturedIcon size={s} color="brand" icon={<Star />} />
          <FeaturedIcon size={s} color="error" icon={<CircleAlert />} />
          <FeaturedIcon size={s} color="warning" icon={<TriangleAlert />} />
          <FeaturedIcon size={s} color="success" icon={<CircleCheck />} />
          <FeaturedIcon size={s} color="info" icon={<Info />} />
        </div>
      ))}
    </div>
  ),
};

export const Spinners: StoryObj<typeof Spinner> = { render: () => <div style={row}><Spinner size="sm" /><Spinner /><Spinner size="lg" /></div> };

export const Progress: StoryObj<typeof ProgressBar> = {
  render: () => <div style={{ display: 'grid', gap: 24, maxWidth: 360 }}><ProgressBar label="Progress" value={40} valuePosition="none" /><ProgressBar label="Progress" value={40} /><ProgressBar label="Progress" value={40} valuePosition="bottom" /></div>,
};

export const Tooltips: StoryObj<typeof Tooltip> = {
  render: () => (
    <div style={{ ...row, gap: 48, padding: 64 }}>
      {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
        <Tooltip key={p} placement={p} title="Edit" text={p === 'top' ? 'Change the details of this project.' : undefined}>
          <ButtonIcon icon={<Pencil aria-hidden />} aria-label="Edit" />
        </Tooltip>
      ))}
    </div>
  ),
};
