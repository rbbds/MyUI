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

const meta: Meta = { title: 'Account/Cases', parameters: { layout: 'padded' } };
export default meta;
type Story = StoryObj;

const menu = (label: string) => (
  <DropdownMenu trigger={<ButtonIcon hierarchy="tertiary" size="sm" icon={<EllipsisVertical />} aria-label={`Options ${label}`} />} align="end"
    items={[{ label: 'View details', onSelect: () => {} }, { label: 'Export', onSelect: () => {} }]} />
);

/* ---------- Metric card ---------- */
export const MetricCards: Story = {
  render: () => (
    <div className="rb-metric-grid">
      <MetricCard label="Total revenue" value="€24,580" delta="+12.4%" trend="up" meta="vs last month" icon={<FeaturedIcon size="sm" icon={<Wallet />} />} menu={menu('Total revenue')} />
      <MetricCard label="Open requests" value="18" delta="−4.2%" trend="down" meta="vs last month" icon={<FeaturedIcon size="sm" icon={<FileText />} />} menu={menu('Open requests')} />
      <MetricCard label="Active users" value="1.204" delta="0%" trend="neutral" meta="vs last month" icon={<FeaturedIcon size="sm" icon={<Users />} />} footer={<Button hierarchy="link" size="sm">View details</Button>} />
    </div>
  ),
};

/* ---------- Page header ---------- */
export const PageHeaders: Story = {
  render: () => (
    <PageHeader
      breadcrumbs={<Breadcrumbs items={[{ label: 'My account', href: '#' }, { label: 'Details', href: '#' }, { label: 'Personal details' }]} />}
      title="Personal details"
      description="View and change your details. Changes are saved right away."
      actions={<><Button hierarchy="secondary" iconLeading={<Download aria-hidden />}>Export</Button><Button>Change details</Button></>}
    />
  ),
};
export const PageHeaderSimple: Story = { name: 'Title only', render: () => <PageHeader title="Dashboard" /> };

/* ---------- Description list ---------- */
export const DescriptionLists: Story = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <DescriptionList title="Personal details" description="We use these details for your account and invoices." action={<Button hierarchy="secondary" size="sm">Change</Button>}>
        <DescriptionItem label="Name">Robert Jansen</DescriptionItem>
        <DescriptionItem label="Member since">March 12, 2024</DescriptionItem>
        <DescriptionItem label="Email address" action={<Button hierarchy="link" size="sm">Change<span className="rb-visually-hidden"> email address</span></Button>}>robert@example.com</DescriptionItem>
        <DescriptionItem label="Address">Lange Voorhout 1<br />2514 EA Den Haag</DescriptionItem>
        <DescriptionItem label="Phone number"><span style={{ color: 'var(--color-foreground-tertiary)' }}>Not filled in</span></DescriptionItem>
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
        {open && <Banner color="warning" title="Your details are incomplete." action={<Button hierarchy="link" size="sm">Complete details</Button>} onClose={() => setOpen(false)}>Add a billing address to keep your plan active.</Banner>}
        <Banner color="brand" title="New:">you can now download your documents as PDF.</Banner>
        <Banner color="info" title="Maintenance on Saturday, November 14.">Your account is unavailable from 8:00 to 12:00.</Banner>
        <Banner color="error" title="Your payment failed." action={<Button hierarchy="link" size="sm">Pay again</Button>}>Check your card details and try again.</Banner>
        <Banner color="success" title="Your request has been sent.">We process it within 2 working days.</Banner>
        <Banner color="gray">You are viewing the account of Anne de Vries as an admin.</Banner>
      </div>
    );
  },
};

/* ---------- Table with toolbar, selection, loading, empty ---------- */
const team = [
  { id: '1', name: 'Anne de Vries', email: 'anne@example.com', role: 'Designer', active: true },
  { id: '2', name: 'Jan Bakker', email: 'jan@example.com', role: 'Developer', active: true },
  { id: '3', name: 'Mila Kok', email: 'mila@example.com', role: 'Product owner', active: false },
  { id: '4', name: 'Sem de Jong', email: 'sem@example.com', role: 'Developer', active: true },
  { id: '5', name: 'Noor Visser', email: 'noor@example.com', role: 'Tester', active: true },
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
      title="Team members"
      badge={<Badge color="brand" size="sm">{data.length} members</Badge>}
      actions={actions && data.length > 0 && <Button size="sm" iconLeading={<Plus aria-hidden />}>Add team member</Button>}
      toolbar={<>
        <TableToolbar end={<><Button hierarchy="secondary" size="sm">Columns</Button><ButtonIcon hierarchy="secondary" size="sm" icon={<Download />} aria-label="Export" /></>}>
          <SearchInput label="Search team members" size="sm" value={query} onChange={search} />
          <Button hierarchy="secondary" size="sm" iconLeading={<ListFilter aria-hidden />}>Filters</Button>
        </TableToolbar>
        <TableBulkActions count={selected.length} onClear={() => setSelected([])}
          actions={<><Button hierarchy="secondary" size="sm">Export</Button><Button destructive size="sm" iconLeading={<Trash2 aria-hidden />}>Delete</Button></>} />
      </>}
    >
      <Table aria-busy={loading || undefined} aria-label="Team members">
        <thead>
          <tr>
            <th scope="col" style={{ width: 48 }}><Checkbox aria-label="Select all team members" checked={all} indeterminate={!all && some} disabled={loading || rows.length === 0} onChange={() => setSelected(all ? [] : rows.map((r) => r.id))} /></th>
            <TableHeader>Name</TableHeader><TableHeader>Status</TableHeader><TableHeader>Role</TableHeader><TableHeader><span className="rb-visually-hidden">Actions</span></TableHeader>
          </tr>
        </thead>
        <tbody>
          {loading ? <TableSkeletonRows columns={cols} /> : rows.length === 0 ? (
            <TableEmptyRow colSpan={cols}>
              {query
                ? <EmptyState title="No results found" description={`We found nothing for "${query}". Check the spelling or try another search term.`} actions={<Button hierarchy="secondary" onClick={() => search('')}>Clear search</Button>} />
                : <EmptyState title="No team members yet" description="Add your first team member. They get an invite by email." actions={<Button iconLeading={<Plus aria-hidden />}>Add team member</Button>} />}
            </TableEmptyRow>
          ) : rows.map((p) => (
            <tr key={p.id} aria-selected={selected.includes(p.id)}>
              <td><Checkbox aria-label={`Select ${p.name}`} checked={selected.includes(p.id)} onChange={() => toggle(p.id)} /></td>
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
}
export const TableWithToolbar: Story = { name: 'With toolbar and selection', render: () => <TeamTable /> };
export const TableLoading: Story = { name: 'Loading', render: () => <TeamTable loading /> };
export const TableEmpty: Story = { name: 'Empty', render: () => <TeamTable data={[]} /> };

/* ---------- Date range picker ---------- */
export const DateRangePickers: Story = {
  render: () => {
    const [r, setR] = useState<DateRange>({ start: new Date(2026, 10, 23), end: new Date(2026, 11, 4) });
    return (
      <div style={{ minHeight: 520 }}>
        <DateRangePicker label="Period" value={r} onChange={setR} hint="Choose a quick pick or click a start and end date." />
      </div>
    );
  },
};

/* ---------- Example pages ---------- */
export const Dashboard: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => {
    const [period, setPeriod] = useState('month');
    return (
      <div>
        <Banner color="info" title="Maintenance on Saturday, November 14.">The app is unavailable from 8:00 to 12:00.</Banner>
        <main style={{ display: 'grid', gap: 32, padding: '32px clamp(16px,4vw,48px)', maxWidth: 1280, margin: '0 auto' }}>
          <PageHeader title="Dashboard" description="Overview of your workspace."
            actions={<ButtonGroup aria-label="Period" value={period} onChange={setPeriod} options={[{ value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }, { value: 'year', label: 'Year' }]} />} />
          <section aria-labelledby="kpi"><h2 id="kpi" className="rb-visually-hidden">Key figures</h2>
            <div className="rb-metric-grid">
              <MetricCard label="Team members" value="1.204" delta="+18" trend="up" meta={`this ${period}`} icon={<FeaturedIcon size="sm" icon={<Users />} />} />
              <MetricCard label="Monthly invoice" value="€312,480" delta="+2.1%" trend="up" meta={`vs last ${period}`} icon={<FeaturedIcon size="sm" icon={<Wallet />} />} />
              <MetricCard label="Open changes" value="7" delta="−3" trend="down" meta="to process" icon={<FeaturedIcon size="sm" icon={<Briefcase />} />} footer={<Button hierarchy="link" size="sm">View changes</Button>} />
              <MetricCard label="Documents" value="42" delta="0" trend="neutral" meta="new" icon={<FeaturedIcon size="sm" icon={<FileText />} />} />
            </div>
          </section>
          <TeamTable />
          <Pagination page={1} pageCount={3} onPageChange={() => {}} />
        </main>
      </div>
    );
  },
};

export const MyDetails: Story = {
  name: 'My details',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div>
      <Banner color="warning" title="Your details are incomplete." action={<Button hierarchy="link" size="sm">Complete details</Button>}>Add a billing address to keep your plan active.</Banner>
      <main style={{ display: 'grid', gap: 32, padding: '32px clamp(16px,4vw,48px)', maxWidth: 960, margin: '0 auto' }}>
        <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'My account', href: '#' }, { label: 'My details' }]} />} title="My details" description="Check your details. Is something wrong? Change it right away." />
        <DescriptionList title="Personal details" action={<Button hierarchy="secondary" size="sm">Change</Button>}>
          <DescriptionItem label="Name">Robert Jansen</DescriptionItem>
          <DescriptionItem label="Member since">March 12, 2024</DescriptionItem>
          <DescriptionItem label="Account ID">ACC-2048-7731</DescriptionItem>
        </DescriptionList>
        <DescriptionList title="Contact and address" action={<Button hierarchy="secondary" size="sm">Change</Button>}>
          <DescriptionItem label="Email address">robert@example.com</DescriptionItem>
          <DescriptionItem label="Phone number">+31 6 12 34 56 78</DescriptionItem>
          <DescriptionItem label="Address">Lange Voorhout 1<br />2514 EA Den Haag</DescriptionItem>
        </DescriptionList>
        <DescriptionList title="Billing" description="We charge your plan to this card.">
          <DescriptionItem label="Payment card" action={<Button hierarchy="link" size="sm">Add<span className="rb-visually-hidden"> payment card</span></Button>}><span style={{ color: 'var(--color-foreground-tertiary)' }}>Not filled in</span></DescriptionItem>
        </DescriptionList>
      </main>
    </div>
  ),
};
