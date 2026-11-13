import type React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ArrowUpRight, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { Accordion, Card, EmptyState, FileUpload, FileUploadItem, PersonCell, Table, TableCard, TableHeader } from './Content';
import { Avatar, Badge, FeaturedIcon } from '../Display/Display';
import { Button, ButtonIcon } from '../Button/Button';

const meta: Meta<typeof Card> = {
  title: 'Components/Content/Card',
  component: Card,
  args: { meta: 'Design · 5 min read', title: 'A design system that grows with you', description: 'How tokens, components and documentation work together for consistent products.', elevated: false },
};
export default meta;
const narrow = [(S: React.ComponentType) => <div style={{ maxWidth: 360 }}><S /></div>];
type Story = StoryObj<typeof Card>;

export const Default: Story = { decorators: narrow, args: { media: <div className="rb-card__media" role="presentation" />, action: <Button hierarchy="link" iconTrailing={<ArrowUpRight aria-hidden />}>Read more</Button> } };
export const ClickableCard: Story = { decorators: narrow, args: { href: '#', media: <div className="rb-card__media" role="presentation" /> } };
export const Elevated: Story = { decorators: narrow, args: { elevated: true } };

const people = [
  { name: 'Anne de Vries', email: 'anne@example.com', role: 'Designer', active: true },
  { name: 'Jan Bakker', email: 'jan@example.com', role: 'Developer', active: true },
  { name: 'Mila Kok', email: 'mila@example.com', role: 'Product owner', active: false },
];
export const DataTable: StoryObj<typeof Table> = {
  render: () => {
    const [sort, setSort] = useState<'ascending' | 'descending'>('ascending');
    const rows = [...people].sort((a, b) => (sort === 'ascending' ? 1 : -1) * a.name.localeCompare(b.name));
    return (
      <TableCard title="Team members" badge={<Badge color="brand" size="sm">{people.length} members</Badge>}>
        <Table>
          <thead><tr><TableHeader sort={sort} onSort={() => setSort(sort === 'ascending' ? 'descending' : 'ascending')}>Name</TableHeader><TableHeader>Status</TableHeader><TableHeader>Role</TableHeader><TableHeader><span className="rb-visually-hidden">Actions</span></TableHeader></tr></thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.email}>
                <td><PersonCell avatar={<Avatar name={p.name} />} name={p.name} secondary={p.email} /></td>
                <td><Badge color={p.active ? 'success' : 'gray'} size="sm" dot>{p.active ? 'Active' : 'Inactive'}</Badge></td>
                <td>{p.role}</td>
                <td className="rb-table__align-right"><ButtonIcon hierarchy="tertiary" size="sm" icon={<Pencil aria-hidden />} aria-label={`Edit ${p.name}`} /> <ButtonIcon hierarchy="tertiary" size="sm" icon={<Trash2 aria-hidden />} aria-label={`Remove ${p.name}`} /></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableCard>
    );
  },
};
export const FAQ: StoryObj<typeof Accordion> = {
  decorators: [(S) => <div style={{ maxWidth: 640 }}><S /></div>],
  render: () => <Accordion defaultOpen={['a']} items={[
    { id: 'a', title: 'How long does it take to set up my account?', content: 'Usually a few minutes. You get an email as soon as it is ready.' },
    { id: 'b', title: 'Can I change my plan later?', content: 'Yes, as long as the status is "In progress".' },
    { id: 'c', title: 'Who can I call with questions?', content: 'Call us on working days between 9 AM and 5 PM.' },
  ]} />,
};
export const Empty: StoryObj<typeof EmptyState> = {
  render: () => <EmptyState icon={<FeaturedIcon color="gray" size="lg" icon={<Search />} />} title="No results found" description='We found nothing for "annual report". Check the spelling or try another search term.' actions={<><Button hierarchy="secondary">Clear search</Button><Button iconLeading={<Plus aria-hidden />}>New project</Button></>} />,
};
export const Upload: StoryObj<typeof FileUpload> = {
  decorators: [(S) => <div style={{ maxWidth: 512, display: 'grid', gap: 12 }}><S /></div>],
  render: () => (
    <>
      <FileUpload onFiles={() => {}} accept=".pdf,.jpg,.png" hint="PDF, JPG or PNG (max. 10 MB)" />
      <FileUploadItem name="project-brief.pdf" size="720 KB" progress={40} onRemove={() => {}} />
      <FileUploadItem name="invoice-october.pdf" size="320 KB" status="complete" />
      <FileUploadItem name="moodboard.jpg" status="error" onRemove={() => {}} />
    </>
  ),
};
