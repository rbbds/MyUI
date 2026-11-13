import { useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/styles/index.css';
import { Button, ButtonIcon, Combobox, DatePicker, DateRangePicker, DropdownMenu, Modal, Popover, Toast, ToastRegion, Tooltip } from '../../src';
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
  daterange: <DateRangePicker label="Period" defaultValue={{ start: new Date(2026, 10, 1), end: new Date(2026, 10, 7) }} />,
};

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
