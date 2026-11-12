import { useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/styles/index.css';
import { Button, Combobox, DatePicker, DateRangePicker, DropdownMenu, Modal, Popover, Toast, ToastRegion } from '../../src';

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
  daterange: <DateRangePicker label="Period" defaultValue={{ start: new Date(2026, 10, 1), end: new Date(2026, 10, 7) }} />,
};

const name = new URLSearchParams(location.search).get('s') ?? '';
createRoot(document.getElementById('root')!).render(<div className="rb-root" style={{ padding: 24 }}>{scenarios[name] ?? <p>Unknown scenario</p>}</div>);
