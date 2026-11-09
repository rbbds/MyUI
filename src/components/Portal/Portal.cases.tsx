import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import { Download, EllipsisVertical, FileText, ListFilter, Pencil, Plus, Trash2, Users, Wallet, Briefcase } from 'lucide-react';
import { Avatar, Badge, FeaturedIcon } from '../Display/Display';
import { Button, ButtonIcon } from '../Button/Button';
import { ButtonGroup } from '../Button/ButtonGroup';
import { SearchInput } from '../Form/SearchInput';
import { Checkbox } from '../Selection/Checkbox';
import { Breadcrumbs, Pagination } from '../Navigation/Navigation';
import { DropdownMenu } from '../Overlay/DropdownMenu';
import { EmptyState, PersonCell, Table, TableCard, TableHeader } from '../Content/Content';
import { MetricCard } from './MetricCard';
import { PageHeader } from './PageHeader';
import { DescriptionItem, DescriptionList } from './DescriptionList';
import { Banner } from './Banner';
import { TableBulkActions, TableEmptyRow, TableSkeletonRows, TableToolbar } from './TableTools';
import { DateRangePicker, type DateRange } from './DateRangePicker';

const meta: Meta = { title: 'Portaal/Cases', parameters: { layout: 'padded' } };
export default meta;
type Story = StoryObj;

const menu = (label: string) => (
  <DropdownMenu trigger={<ButtonIcon hierarchy="tertiary" size="sm" icon={<EllipsisVertical />} aria-label={`Opties ${label}`} />} align="end"
    items={[{ label: 'Bekijk details', onSelect: () => {} }, { label: 'Exporteren', onSelect: () => {} }]} />
);

/* ---------- Metric card ---------- */
export const MetricCards: Story = {
  render: () => (
    <div className="rb-metric-grid">
      <MetricCard label="Totaal vermogen" value="€ 24.580" delta="+12,4%" trend="up" meta="t.o.v. vorige maand" icon={<FeaturedIcon size="sm" icon={<Wallet />} />} menu={menu('Totaal vermogen')} />
      <MetricCard label="Openstaande aanvragen" value="18" delta="−4,2%" trend="down" meta="t.o.v. vorige maand" icon={<FeaturedIcon size="sm" icon={<FileText />} />} menu={menu('Openstaande aanvragen')} />
      <MetricCard label="Actieve deelnemers" value="1.204" delta="0%" trend="neutral" meta="t.o.v. vorige maand" icon={<FeaturedIcon size="sm" icon={<Users />} />} footer={<Button hierarchy="link" size="sm">Bekijk details</Button>} />
    </div>
  ),
};

/* ---------- Page header ---------- */
export const PageHeaders: Story = {
  render: () => (
    <PageHeader
      breadcrumbs={<Breadcrumbs items={[{ label: 'Mijn omgeving', href: '#' }, { label: 'Gegevens', href: '#' }, { label: 'Persoonsgegevens' }]} />}
      title="Persoonsgegevens"
      description="Bekijk en wijzig je gegevens. Wijzigingen zijn binnen twee werkdagen verwerkt."
      actions={<><Button hierarchy="secondary" iconLeading={<Download aria-hidden />}>Exporteren</Button><Button>Gegevens wijzigen</Button></>}
    />
  ),
};
export const PageHeaderSimple: Story = { name: 'Alleen titel', render: () => <PageHeader title="Dashboard" /> };

/* ---------- Description list ---------- */
export const DescriptionLists: Story = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <DescriptionList title="Persoonsgegevens" description="Deze gegevens gebruiken we voor je pensioen en post." action={<Button hierarchy="secondary" size="sm">Wijzigen</Button>}>
        <DescriptionItem label="Naam">Robert Jansen</DescriptionItem>
        <DescriptionItem label="Geboortedatum">12 maart 1984</DescriptionItem>
        <DescriptionItem label="E-mailadres" action={<Button hierarchy="link" size="sm">Wijzigen<span className="rb-visually-hidden"> e-mailadres</span></Button>}>robert@voorbeeld.nl</DescriptionItem>
        <DescriptionItem label="Adres">Lange Voorhout 1<br />2514 EA Den Haag</DescriptionItem>
        <DescriptionItem label="Telefoonnummer"><span style={{ color: 'var(--color-foreground-tertiary)' }}>Niet ingevuld</span></DescriptionItem>
      </DescriptionList>
    </div>
  ),
};

/* ---------- Banner ---------- */
export const Banners: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ display: 'grid', gap: 16 }}>
        {open && <Banner color="warning" title="Je gegevens zijn onvolledig." action={<Button hierarchy="link" size="sm">Gegevens aanvullen</Button>} onClose={() => setOpen(false)}>Vul je IBAN aan, anders kunnen we niet uitbetalen.</Banner>}
        <Banner color="brand" title="Nieuw:">je kunt nu je documenten downloaden als pdf.</Banner>
        <Banner color="info" title="Onderhoud op zaterdag 14 november.">Mijn omgeving is dan van 8:00 tot 12:00 niet bereikbaar.</Banner>
        <Banner color="error" title="Je betaling is mislukt." action={<Button hierarchy="link" size="sm">Opnieuw betalen</Button>}>Controleer je rekening en probeer het opnieuw.</Banner>
        <Banner color="success" title="Je aanvraag is ingediend.">We verwerken hem binnen 2 werkdagen.</Banner>
        <Banner color="gray">Je bekijkt de gegevens van Anne de Vries als gemachtigde.</Banner>
      </div>
    );
  },
};

/* ---------- Table with toolbar, selection, loading, empty ---------- */
const team = [
  { id: '1', name: 'Anne de Vries', email: 'anne@voorbeeld.nl', role: 'Ontwerper', active: true },
  { id: '2', name: 'Jan Bakker', email: 'jan@voorbeeld.nl', role: 'Developer', active: true },
  { id: '3', name: 'Mila Kok', email: 'mila@voorbeeld.nl', role: 'Product owner', active: false },
  { id: '4', name: 'Sem de Jong', email: 'sem@voorbeeld.nl', role: 'Developer', active: true },
  { id: '5', name: 'Noor Visser', email: 'noor@voorbeeld.nl', role: 'Tester', active: true },
];

function TeamTable({ loading = false, data = team, actions = true }: { loading?: boolean; data?: typeof team; actions?: boolean }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const rows = useMemo(() => data.filter((p) => `${p.name} ${p.email} ${p.role}`.toLowerCase().includes(query.toLowerCase())), [data, query]);
  const search = (q: string) => { setQuery(q); setSelected([]); }; // filtering clears the selection
  const all = rows.length > 0 && rows.every((r) => selected.includes(r.id));
  const some = rows.some((r) => selected.includes(r.id));
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const cols = 5;
  return (
    <TableCard
      title="Teamleden"
      badge={<Badge color="brand" size="sm">{data.length} leden</Badge>}
      actions={actions && data.length > 0 && <Button size="sm" iconLeading={<Plus aria-hidden />}>Teamlid toevoegen</Button>}
      toolbar={<>
        <TableToolbar end={<><Button hierarchy="secondary" size="sm">Kolommen</Button><ButtonIcon hierarchy="secondary" size="sm" icon={<Download />} aria-label="Exporteren" /></>}>
          <SearchInput label="Zoek teamleden" size="sm" value={query} onChange={search} />
          <Button hierarchy="secondary" size="sm" iconLeading={<ListFilter aria-hidden />}>Filters</Button>
        </TableToolbar>
        <TableBulkActions count={selected.length} onClear={() => setSelected([])}
          actions={<><Button hierarchy="secondary" size="sm">Exporteren</Button><Button destructive size="sm" iconLeading={<Trash2 aria-hidden />}>Verwijderen</Button></>} />
      </>}
    >
      <Table aria-busy={loading || undefined} aria-label="Teamleden">
        <thead>
          <tr>
            <th scope="col" style={{ width: 48 }}><Checkbox aria-label="Selecteer alle teamleden" checked={all} indeterminate={!all && some} disabled={loading || rows.length === 0} onChange={() => setSelected(all ? [] : rows.map((r) => r.id))} /></th>
            <TableHeader>Naam</TableHeader><TableHeader>Status</TableHeader><TableHeader>Rol</TableHeader><TableHeader><span className="rb-visually-hidden">Acties</span></TableHeader>
          </tr>
        </thead>
        <tbody>
          {loading ? <TableSkeletonRows columns={cols} /> : rows.length === 0 ? (
            <TableEmptyRow colSpan={cols}>
              {query
                ? <EmptyState title="Geen resultaten gevonden" description={`We vonden niets voor "${query}". Controleer de spelling of probeer een andere zoekterm.`} actions={<Button hierarchy="secondary" onClick={() => search('')}>Zoekopdracht wissen</Button>} />
                : <EmptyState title="Nog geen teamleden" description="Voeg je eerste teamlid toe. Diegene krijgt een uitnodiging per e-mail." actions={<Button iconLeading={<Plus aria-hidden />}>Teamlid toevoegen</Button>} />}
            </TableEmptyRow>
          ) : rows.map((p) => (
            <tr key={p.id} aria-selected={selected.includes(p.id)}>
              <td><Checkbox aria-label={`Selecteer ${p.name}`} checked={selected.includes(p.id)} onChange={() => toggle(p.id)} /></td>
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
}
export const TableWithToolbar: Story = { name: 'Met werkbalk en selectie', render: () => <TeamTable /> };
export const TableLoading: Story = { name: 'Laden', render: () => <TeamTable loading /> };
export const TableEmpty: Story = { name: 'Leeg', render: () => <TeamTable data={[]} /> };

/* ---------- Date range picker ---------- */
export const DateRangePickers: Story = {
  render: () => {
    const [r, setR] = useState<DateRange>({ start: new Date(2026, 10, 23), end: new Date(2026, 11, 4) });
    return (
      <div style={{ minHeight: 520 }}>
        <DateRangePicker label="Periode" value={r} onChange={setR} hint="Kies een snelkeuze of klik op een begin- en einddatum." />
      </div>
    );
  },
};

/* ---------- Example pages ---------- */
export const Dashboard: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => {
    const [period, setPeriod] = useState('maand');
    return (
      <div>
        <Banner color="info" title="Onderhoud op zaterdag 14 november.">Het portaal is dan van 8:00 tot 12:00 niet bereikbaar.</Banner>
        <main style={{ display: 'grid', gap: 32, padding: '32px clamp(16px,4vw,48px)', maxWidth: 1280, margin: '0 auto' }}>
          <PageHeader title="Dashboard" description="Overzicht van je werkgeversportaal."
            actions={<ButtonGroup aria-label="Periode" value={period} onChange={setPeriod} options={[{ value: 'week', label: 'Week' }, { value: 'maand', label: 'Maand' }, { value: 'jaar', label: 'Jaar' }]} />} />
          <section aria-labelledby="kpi"><h2 id="kpi" className="rb-visually-hidden">Kerncijfers</h2>
            <div className="rb-metric-grid">
              <MetricCard label="Werknemers" value="1.204" delta="+18" trend="up" meta={`deze ${period}`} icon={<FeaturedIcon size="sm" icon={<Users />} />} />
              <MetricCard label="Premie-afdracht" value="€ 312.480" delta="+2,1%" trend="up" meta={`t.o.v. vorige ${period}`} icon={<FeaturedIcon size="sm" icon={<Wallet />} />} />
              <MetricCard label="Open mutaties" value="7" delta="−3" trend="down" meta="te verwerken" icon={<FeaturedIcon size="sm" icon={<Briefcase />} />} footer={<Button hierarchy="link" size="sm">Bekijk mutaties</Button>} />
              <MetricCard label="Documenten" value="42" delta="0" trend="neutral" meta="nieuw" icon={<FeaturedIcon size="sm" icon={<FileText />} />} />
            </div>
          </section>
          <TeamTable />
          <Pagination page={1} pageCount={3} onPageChange={() => {}} />
        </main>
      </div>
    );
  },
};

export const MijnGegevens: Story = {
  name: 'Mijn gegevens',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div>
      <Banner color="warning" title="Je gegevens zijn onvolledig." action={<Button hierarchy="link" size="sm">Gegevens aanvullen</Button>}>Vul je IBAN aan, anders kunnen we niet uitbetalen.</Banner>
      <main style={{ display: 'grid', gap: 32, padding: '32px clamp(16px,4vw,48px)', maxWidth: 960, margin: '0 auto' }}>
        <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Mijn omgeving', href: '#' }, { label: 'Mijn gegevens' }]} />} title="Mijn gegevens" description="Controleer je gegevens. Klopt er iets niet? Wijzig het direct." />
        <DescriptionList title="Persoonsgegevens" action={<Button hierarchy="secondary" size="sm">Wijzigen</Button>}>
          <DescriptionItem label="Naam">Robert Jansen</DescriptionItem>
          <DescriptionItem label="Geboortedatum">12 maart 1984</DescriptionItem>
          <DescriptionItem label="BSN">•••• ••• 12</DescriptionItem>
        </DescriptionList>
        <DescriptionList title="Contact en adres" action={<Button hierarchy="secondary" size="sm">Wijzigen</Button>}>
          <DescriptionItem label="E-mailadres">robert@voorbeeld.nl</DescriptionItem>
          <DescriptionItem label="Telefoonnummer">06 12 34 56 78</DescriptionItem>
          <DescriptionItem label="Adres">Lange Voorhout 1<br />2514 EA Den Haag</DescriptionItem>
        </DescriptionList>
        <DescriptionList title="Uitbetaling" description="Hierop ontvang je je pensioen.">
          <DescriptionItem label="IBAN" action={<Button hierarchy="link" size="sm">Toevoegen<span className="rb-visually-hidden"> IBAN</span></Button>}><span style={{ color: 'var(--color-foreground-tertiary)' }}>Niet ingevuld</span></DescriptionItem>
        </DescriptionList>
      </main>
    </div>
  ),
};
