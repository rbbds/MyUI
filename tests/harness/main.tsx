import { useRef, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/styles/index.css';
import { AddToCart, Alert, Badge, Breadcrumbs, Button, ButtonGroup, ButtonIcon, Calendar, Card, CartButton, CartItem, CartSummary, Combobox, CommandMenu, DatePicker, DateRangePicker, DropdownMenu, DualSidebar, Header, Input, LinkProvider, LocaleProvider, MobileNav, Modal, NavItem, NavItem as NavItemLink, Pagination, Popover, Price, QuantityStepper, SearchInput, SelectionCard, SelectionCardGroup, Spinner, Table, TableBulkActions, TableCard, Tabs, TierPricingTable, Toast, ToastRegion, Tooltip, useTierPricing } from '../../src';
import { Info } from 'lucide-react';
import { nlNL } from '../../src/locales/nl-NL';

/** One scenario per test, picked with ?s=name. Keep them small: one question each. */
function InModal({ children, toast }: { children?: ReactNode; toast?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Modal title">{children}</Modal>
      {toast && <ToastRegion><Toast title="Saved" color="success" /></ToastRegion>}
    </>
  );
}

const megaLinks = [
  { label: 'Product', menu: { columns: [{ heading: 'Features', links: [{ label: 'Analytics', href: '#a' }, { label: 'Projects', href: '#p', current: true }] }, { heading: 'Learn', links: [{ label: 'Guides', href: '#g' }] }] } },
  { label: 'Solutions', menu: { columns: [{ heading: 'Pages', links: [{ label: 'For teams', href: '#t' }] }] } },
  { label: 'Pricing', href: '#price' },
];

const options = [{ value: 'nl', label: 'Netherlands' }, { value: 'be', label: 'Belgium' }, { value: 'de', label: 'Germany' }];

function BuyBulk() {
  const [q, setQ] = useState(50);
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  return (
    <div style={{ width: 440 }}>
      <AddToCart productName="Pen" quantity={q} onQuantityChange={setQ} minQuantity={50} maxQuantity={5000} quantityStep={25} quantityHint={`Hint for ${q}`} onAdd={(n) => setLog((l) => [...l, `add ${n}`])} aside={<ButtonIcon icon={<Info />} aria-label="Save" />} secondaryAction={{ label: 'Request a quote', loading: busy, onClick: (n) => { setBusy(true); setLog((l) => [...l, `quote ${n}`]); } }} secondaryHint="For large orders." />
      <p data-testid="log">{log.join(', ')}</p>
      <Button onClick={() => setBusy(false)}>Done</Button>
    </div>
  );
}
function TierHintNl() { const { hint } = useTierPricing(tiers, 300, { decimals: 3 }); return <p data-testid="hint">{hint}</p>; }
const tiers = [{ min: 250, unitPrice: 0.48 }, { min: 50, unitPrice: 0.52 }, { min: 1000, unitPrice: 0.41 }];
function TierDemo() {
  const [q, setQ] = useState(50);
  const { hint } = useTierPricing(tiers, q, { decimals: 3 });
  return (
    <div style={{ width: 360 }}>
      <TierPricingTable title="Volume prices" tiers={tiers} quantity={q} onTierSelect={(t) => setQ(t.min)} decimals={3} vat="excl" footnote="One print included" />
      <p data-testid="q">{q}</p>
      <p data-testid="hint">{hint}</p>
      <Button onClick={() => setQ(20)}>Below</Button>
    </div>
  );
}
function CardSlots() {
  const [v, setV] = useState('a');
  const [clicks, setClicks] = useState(0);
  return (
    <div style={{ width: 420 }}>
      <SelectionCardGroup legend="Method">
        <SelectionCard name="m" value="a" checked={v === 'a'} onChange={() => setV('a')} title="Print" badge={<Badge size="sm">Recommended</Badge>} description="Any colors." meta="8 working days" />
        <SelectionCard name="m" value="b" checked={v === 'b'} onChange={() => setV('b')} title="Screen" description="Solid colors." meta="Max. 4 colors">
          {v === 'b' && <Alert color="warning" title="Your logo has 6 colors" actions={<Button size="sm" onClick={() => setClicks((n) => n + 1)}>Use fewer colors</Button>} />}
        </SelectionCard>
        <SelectionCard name="m" value="c" title="Engraving" description="Lasered." meta="Not available for this material." disabled />
      </SelectionCardGroup>
      <p data-testid="state">{v} {clicks}</p>
    </div>
  );
}
function CartMin() {
  const [q, setQ] = useState(50);
  return <CartItem title="Pen" price={0.52} quantity={q} minQuantity={50} maxQuantity={5000} quantityStep={25} onQuantityChange={setQ} onRemove={() => {}} />;
}

const scenarios: Record<string, ReactNode> = {
  'tier': <TierDemo />,
  'tier-static': <div style={{ width: 360 }}><TierPricingTable tiers={tiers} quantity={300} showSaving={false} indicative density="compact" /><div data-testid="loading"><TierPricingTable tiers={tiers} loading /></div></div>,
  'tier-nl': <LocaleProvider locale={nlNL}><div style={{ width: 360 }}><TierPricingTable title="Staffelprijzen" tiers={tiers} quantity={1200} decimals={3} vat="excl" /><TierHintNl /></div></LocaleProvider>,
  'card-slots': <CardSlots />,
  'buy-plain': <div style={{ width: 440 }}><AddToCart onAdd={() => {}} aside={<ButtonIcon icon={<Info />} aria-label="Save" />} /></div>,
  'buy-bulk': <BuyBulk />,
  'cart-min': <div style={{ width: 480 }}><CartMin /></div>,
  'qty-step': <><div data-testid="plain"><QuantityStepper defaultValue={2} max={5} label="Plain" /></div><div data-testid="unit"><QuantityStepper defaultValue={50} min={50} max={5000} step={25} label="Pens" hint="Add more for a lower price" /></div><LocaleProvider locale={nlNL}><div data-testid="nl"><QuantityStepper defaultValue={12} min={1} max={120} step={12} /></div></LocaleProvider></>,
  'price-unit': <><p data-testid="en"><Price prefix="From" amount={0.523} decimals={3} suffix="per piece" vat="excl" /></p><p data-testid="pad"><Price amount={0.52} decimals={3} /></p><p data-testid="plain"><Price amount={79.95} /></p><LocaleProvider locale={nlNL}><p data-testid="nl"><Price prefix="v.a." amount={0.523} decimals={3} suffix="per stuk" vat="incl" /></p></LocaleProvider></>,
  'locale-nl-full': <LocaleProvider locale={nlNL}><CartSummary subtotal={1234.56} total={1234.56} /><QuantityStepper /><Spinner /><Pagination page={2} pageCount={8} onPageChange={() => {}} /></LocaleProvider>,
  'locale-nl': <LocaleProvider locale="nl-NL" labels={{ cartSummary: { total: 'Totaal' } }} texts={{ 'cartSummary.title': 'Overzicht', 'spinner.label': 'Laden' }}><CartSummary subtotal={1234.56} total={1234.56} /><p data-testid="own-locale"><Price amount={2} locale="en-US" /></p><QuantityStepper /><Spinner /></LocaleProvider>,
  'locale-none': <><CartSummary subtotal={1234.56} total={1234.56} /><QuantityStepper /><Spinner /></>,
  'heading-color': <Alert title="Heads up">Body text</Alert>,
  'button-pressed': <div style={{ display: 'flex', gap: 16 }}><Button>Primary</Button><Button hierarchy="accent">Accent</Button><Button hierarchy="secondary">Secondary</Button><Button destructive>Delete</Button><Button aria-disabled>Switched off</Button></div>,
  'modal-dropdown': <InModal><DropdownMenu label="Actions" trigger={<Button hierarchy="secondary">Menu</Button>} items={[{ label: 'Edit', onSelect: () => {} }, { label: 'Delete', onSelect: () => {} }]} /></InModal>,
  'modal-popover': <InModal><Popover title="Help" trigger={<Button hierarchy="secondary">Info</Button>}>Text</Popover></InModal>,
  'modal-datepicker': <InModal><DatePicker label="Date" /></InModal>,
  'modal-daterange': <InModal><DateRangePicker label="Period" /></InModal>,
  'modal-combobox': <InModal><Combobox label="Country" options={options} /></InModal>,
  'modal-toast': <InModal toast />,
  combobox: <Combobox label="Country" options={options} />,
  'popover-focus': <><Popover title="Help" trigger={<Button hierarchy="secondary">Info</Button>}>Text</Popover><Button>After</Button></>,
  'modal-clip': (
    <InModal>
      {/* A small box that clips its content, like a scroll area or a table cell. */}
      <div style={{ height: 48, overflow: 'hidden' }}>
        <DropdownMenu label="Actions" trigger={<Button hierarchy="secondary">Menu</Button>} items={['Edit', 'Duplicate', 'Archive', 'Delete'].map((label) => ({ label, onSelect: () => {} }))} />
      </div>
    </InModal>
  ),
  dropdown: <DropdownKeys />,
  tooltip: <Tooltip title="More info"><ButtonIcon aria-label="Info" icon={<Info />} /></Tooltip>,
  'modal-tooltip': (
    <InModal>
      <div style={{ height: 40, overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
        <Tooltip title="More info" placement="top"><ButtonIcon aria-label="Info" icon={<Info />} /></Tooltip>
      </div>
    </InModal>
  ),
  'modal-text': <div style={{ height: 3000 }}><InModal><p>Some text you can select.</p></InModal></div>,
  'modal-form': <FormModal />,
  'modal-focus': <FocusModal />,
  command: <CommandScenario />,
  'combobox-form': <ComboboxForm />,
  labels: <CartButton count={3} labels={{ count: (n) => `${n} artikelen` }} label="Winkelwagen" />,
  api: <ApiScenario />,
  'components-7b': <Scenario7b />,
  'a11y-7c': <Scenario7c />,
  'mega-menu': <Header logo={<a href="#">Logo</a>} links={megaLinks} search={<SearchInput label="Search" size="sm" />} actions={<Button hierarchy="secondary">After</Button>} />,
  'link-provider': (
    <LinkProvider component={({ href, ...p }) => <a {...p} href={href} data-router="yes" />}>
      <NavItemLink href="#home">Home</NavItemLink>
      <Breadcrumbs items={[{ label: 'Docs', href: '#docs' }, { label: 'Page' }]} />
      <Header logo={<span>Logo</span>} links={megaLinks} />
    </LinkProvider>
  ),
  'mobile-nav': <MobileNav label="Main menu" items={megaLinks} />,
  daterange: <DateRangePicker label="Period" defaultValue={{ start: new Date(2026, 10, 1), end: new Date(2026, 10, 7) }} />,
};

function FormModal() {
  const [open, setOpen] = useState(false);
  const [closes, setCloses] = useState(0);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <p>Closed: {closes}</p>
      <Modal open={open} onClose={() => { setOpen(false); setCloses((c) => c + 1); }} title="Modal title">
        <form method="dialog"><Button type="submit">Done</Button></form>
      </Modal>
    </>
  );
}

function FocusModal() {
  const [open, setOpen] = useState(false);
  const name = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Modal title" initialFocus={name}>
        <Input ref={name} label="Name" />
      </Modal>
    </>
  );
}

function CommandScenario() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open commands</Button>
      <CommandMenu open={open} onClose={() => setOpen(false)} items={[
        { id: 'new project', label: 'New project', onSelect: () => {} },
        { id: 'settings', label: 'Settings', onSelect: () => {} },
        { id: 'log out', label: 'Log out', onSelect: () => {} },
      ]} />
    </>
  );
}

function ComboboxForm() {
  const [value, setValue] = useState<string | null>('be');
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Combobox label="Country" options={options} value={value} onValueChange={(v) => setValue(v)} required />
      <p>Value: {value ?? 'none'}</p>
      <Button type="submit">Send</Button>
    </form>
  );
}

function DropdownKeys() {
  const [clicks, setClicks] = useState(0);
  return (
    <>
      <DropdownMenu label="Actions" trigger={<Button hierarchy="secondary" onClick={() => setClicks((c) => c + 1)}>Menu</Button>}
        items={['Edit', 'Download', 'Delete'].map((label) => ({ label, onSelect: () => {} }))} />
      <p>Trigger clicks: {clicks}</p>
    </>
  );
}

const name = new URLSearchParams(location.search).get('s') ?? '';
createRoot(document.getElementById('root')!).render(<div className="rb-root" style={{ padding: 24 }}>{scenarios[name] ?? <p>Unknown scenario</p>}</div>);

/* PR 7a: new props, deprecated props that still work, uncontrolled state. */
function ApiScenario() {
  const [last, setLast] = useState('');
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 480 }}>
      <ButtonGroup label="Period" defaultValue="week" onValueChange={setLast} options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }]} />
      <p data-testid="last">{last}</p>
      <Tabs label="Sections" variant="pill" items={[{ id: 'a', label: 'A', content: 'Panel A' }, { id: 'b', label: 'B', content: 'Panel B' }]} />
      <Pagination page={2} pageCount={5} onPageChange={() => undefined} labels={{ previous: 'Vorige', next: 'Volgende' }} label="Paginering" />
      <Alert title="Old prop" onClose={() => undefined} closeLabel="Sluiten" />
      <SearchInput label="Zoeken" clearLabel="Wissen" defaultValue="abc" />
      <Card title="Card with link" href="#card" actions={<Button size="sm" onClick={() => setLast('card action')}>Action</Button>} />
    </div>
  );
}

/* PR 7b: Input help, ButtonGroup disabled, DualSidebar expand. */
function Scenario7c() {
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [reason, setReason] = useState('');
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 480 }}>
      <QuantityStepper label="Quantity" defaultValue={2} min={1} max={3} />
      <Pagination page={page} pageCount={3} onPageChange={setPage} />
      <Button loading={saving} onClick={() => { setClicks((c) => c + 1); setSaving(true); }}>Save</Button>
      <output data-testid="clicks">{clicks}</output>
      <DatePicker label="Appointment" min={new Date(2026, 10, 1)} max={new Date(2026, 10, 30)} onValueChange={(_, d) => setReason(d.reason)} />
      <output data-testid="reason">{reason}</output>
      <Calendar defaultMonth={new Date(2026, 10, 6)} value={new Date(2026, 10, 6)} shouldDisableDate={(d) => d.getDay() === 0 || d.getDay() === 6} />
      <SearchInput label="Search" defaultValue="report" />
      <div style={{ width: 400 }}>
        <TableCard title="Orders" toolbar={<TableBulkActions count={0} onClear={() => {}} />}>
          <Table><tbody><tr><td style={{ minWidth: 1200 }}>One</td></tr></tbody></Table>
        </TableCard>
        <TableCard title="Small">
          <Table><tbody><tr><td>Two</td></tr></tbody></Table>
        </TableCard>
        <TableCard labels={{ region: 'Invoices' }}>
          <Table><tbody><tr><td style={{ minWidth: 1200 }}>Three</td></tr></tbody></Table>
        </TableCard>
      </div>
    </div>
  );
}

function Scenario7b() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <DualSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} logo={<span>Logo</span>} title="Projects" rail={<NavItem href="#" icon={<Info />}>Home</NavItem>}>
        <NavItem href="#">All projects</NavItem>
      </DualSidebar>
      <div style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
        <Input label="IBAN" help="On your bank card." />
        <ButtonGroup label="View" defaultValue="list" options={[{ value: 'list', label: 'List' }, { value: 'map', label: 'Map', disabled: true }]} />
      </div>
    </div>
  );
}

