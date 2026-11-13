import { useRef, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/styles/index.css';
import { Button, ButtonIcon, CartButton, Combobox, CommandMenu, DatePicker, DateRangePicker, DropdownMenu, Input, Modal, Popover, Toast, ToastRegion, Tooltip } from '../../src';
import { Info } from 'lucide-react';

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

const options = [{ value: 'nl', label: 'Netherlands' }, { value: 'be', label: 'Belgium' }, { value: 'de', label: 'Germany' }];

const scenarios: Record<string, ReactNode> = {
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
      <Combobox label="Country" options={options} value={value} onChange={(v) => setValue(v)} required />
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
