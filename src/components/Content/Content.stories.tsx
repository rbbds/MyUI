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
  args: { meta: 'Ontwerp · 5 min lezen', title: 'Een design system dat met je meegroeit', description: 'Hoe tokens, componenten en documentatie samen zorgen voor consistente producten.', elevated: false },
};
export default meta;
const narrow = [(S: React.ComponentType) => <div style={{ maxWidth: 360 }}><S /></div>];
type Story = StoryObj<typeof Card>;

export const Default: Story = { decorators: narrow, args: { media: <div className="rb-card__media" role="presentation" />, action: <Button hierarchy="link" iconTrailing={<ArrowUpRight aria-hidden />}>Lees verder</Button> } };
export const ClickableCard: Story = { decorators: narrow, args: { href: '#', media: <div className="rb-card__media" role="presentation" /> } };
export const Elevated: Story = { decorators: narrow, args: { elevated: true } };

const people = [
  { name: 'Anne de Vries', email: 'anne@voorbeeld.nl', role: 'Ontwerper', active: true },
  { name: 'Jan Bakker', email: 'jan@voorbeeld.nl', role: 'Developer', active: true },
  { name: 'Mila Kok', email: 'mila@voorbeeld.nl', role: 'Product owner', active: false },
];
export const DataTable: StoryObj<typeof Table> = {
  render: () => {
    const [sort, setSort] = useState<'ascending' | 'descending'>('ascending');
    const rows = [...people].sort((a, b) => (sort === 'ascending' ? 1 : -1) * a.name.localeCompare(b.name));
    return (
      <TableCard title="Teamleden" badge={<Badge color="brand" size="sm">{people.length} leden</Badge>}>
        <Table>
          <thead><tr><TableHeader sort={sort} onSort={() => setSort(sort === 'ascending' ? 'descending' : 'ascending')}>Naam</TableHeader><TableHeader>Status</TableHeader><TableHeader>Rol</TableHeader><TableHeader><span className="rb-visually-hidden">Acties</span></TableHeader></tr></thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.email}>
                <td><PersonCell avatar={<Avatar name={p.name} />} name={p.name} secondary={p.email} /></td>
                <td><Badge color={p.active ? 'success' : 'gray'} size="sm" dot>{p.active ? 'Actief' : 'Inactief'}</Badge></td>
                <td>{p.role}</td>
                <td className="rb-table__align-right"><ButtonIcon hierarchy="tertiary" size="sm" icon={<Pencil aria-hidden />} aria-label={`Bewerk ${p.name}`} /> <ButtonIcon hierarchy="tertiary" size="sm" icon={<Trash2 aria-hidden />} aria-label={`Verwijder ${p.name}`} /></td>
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
    { id: 'a', title: 'Hoe lang duurt de verwerking van mijn aanvraag?', content: 'Meestal binnen 5 werkdagen. Je krijgt een e-mail zodra er een besluit is.' },
    { id: 'b', title: 'Kan ik mijn aanvraag nog aanpassen?', content: 'Ja, zolang de status "In behandeling" is.' },
    { id: 'c', title: 'Wie kan ik bellen met vragen?', content: 'Bel ons op werkdagen tussen 9.00 en 17.00 uur.' },
  ]} />,
};
export const Empty: StoryObj<typeof EmptyState> = {
  render: () => <EmptyState icon={<FeaturedIcon color="gray" size="lg" icon={<Search />} />} title="Geen resultaten gevonden" description='We vonden niets voor "pensioen 2027". Controleer de spelling of probeer een andere zoekterm.' actions={<><Button hierarchy="secondary">Zoekopdracht wissen</Button><Button iconLeading={<Plus aria-hidden />}>Nieuw project</Button></>} />,
};
export const Upload: StoryObj<typeof FileUpload> = {
  decorators: [(S) => <div style={{ maxWidth: 512, display: 'grid', gap: 12 }}><S /></div>],
  render: () => (
    <>
      <FileUpload onFiles={() => {}} accept=".pdf,.jpg,.png" hint="PDF, JPG of PNG (max. 10 MB)" />
      <FileUploadItem name="jaaropgave-2026.pdf" size="720 KB" progress={40} onRemove={() => {}} />
      <FileUploadItem name="loonstrook-oktober.pdf" size="320 KB" status="complete" />
      <FileUploadItem name="paspoort.jpg" status="error" onRemove={() => {}} />
    </>
  ),
};
