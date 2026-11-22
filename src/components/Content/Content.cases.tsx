import type React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { Accordion, Card, EmptyState, FileUpload, FileUploadItem, PersonCell, Table, TableCard, TableHeader } from './Content';
import { Avatar, Badge, FeaturedIcon } from '../Display/Display';
import { Button, ButtonIcon } from '../Button/Button';
import { Alert } from '../Overlay/Alert';
import { LocaleProvider } from '../../utils/locale';
import { nlNL } from '../../locales/nl-NL';

const meta: Meta<typeof Card> = {
  title: 'Components/Content/Card',
  component: Card,
  args: { meta: 'Design · 5 min read', title: 'A design system that grows with you', description: 'How tokens, components and documentation work together for consistent products.', elevated: false },
};
export default meta;
const narrow = [(S: React.ComponentType) => <div style={{ maxWidth: 360 }}><S /></div>];
type Story = StoryObj<typeof Card>;

export const Default: Story = { decorators: narrow, args: { media: <div className="rb-card__media" role="presentation" />, actions: <Button hierarchy="link" iconTrailing={<ArrowUpRight aria-hidden />}>Read more</Button> } };
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
                <td className="rb-table__align-right"><span className="rb-table__actions"><ButtonIcon hierarchy="tertiary" size="sm" icon={<Pencil aria-hidden />} aria-label={`Edit ${p.name}`} /><ButtonIcon hierarchy="tertiary" size="sm" icon={<Trash2 aria-hidden />} aria-label={`Remove ${p.name}`} /></span></td>
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

/** File upload as one component: the drop zone with the files below it, as a list. */
export const WithFiles: StoryObj<typeof FileUpload> = {
  name: 'With files',
  decorators: [(S) => <div style={{ maxWidth: 512 }}><S /></div>],
  render: () => (
    <FileUpload onFiles={() => {}} accept=".pdf,.jpg,.png" hint="PDF, JPG or PNG (max. 10 MB)">
      <FileUploadItem name="project-brief.pdf" size="720 KB" progress={40} onRemove={() => {}} />
      <FileUploadItem name="invoice-october.pdf" size="320 KB" status="processing" onRemove={() => {}} />
      <FileUploadItem name="contract-signed.pdf" size="1.1 MB" status="complete" onRemove={() => {}} />
      <FileUploadItem name="moodboard.jpg" status="error" error="The file is larger than 10 MB." actions={<Button size="sm" hierarchy="tertiary">Try again</Button>} onRemove={() => {}} />
    </FileUpload>
  ),
};

/* Thumbnail on a checkered background, so a transparent logo stays visible. Page code, not part of MyUI. */
const checker = { width: 40, height: 40, borderRadius: 6, border: '1px solid var(--color-border-secondary)', backgroundColor: 'var(--color-surface-primary)', backgroundImage: 'linear-gradient(45deg, var(--color-surface-tertiary) 25%, transparent 25%, transparent 75%, var(--color-surface-tertiary) 75%), linear-gradient(45deg, var(--color-surface-tertiary) 25%, transparent 25%, transparent 75%, var(--color-surface-tertiary) 75%)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 5px 5px', display: 'grid', placeItems: 'center', fontWeight: 700, color: 'var(--color-foreground-brand)' } as const;
const Thumb = ({ label }: { label: string }) => <span style={checker} role="img" aria-label={label}>A</span>;

/** The three slots of File upload item: media, actions and free content below the file. */
export const ItemSlots: StoryObj<typeof FileUpload> = {
  name: 'Item slots',
  decorators: [(S) => <div style={{ maxWidth: 512 }}><S /></div>],
  render: () => (
    <FileUpload onFiles={() => {}} hint="PNG, JPG or SVG (max. 25 MB)">
      <FileUploadItem name="logo-acme-final-version-3-approved-by-marketing-and-legal-department-2026.png" size="1.2 MB · 640 × 480 px" status="complete" media={<Thumb label="Preview of the logo" />} actions={<Button size="sm" hierarchy="tertiary">Replace</Button>} onRemove={() => {}}>
        <Alert color="warning" title="Low resolution for this print size">The print can look blurry. Upload a larger file if you have one.</Alert>
      </FileUploadItem>
    </FileUpload>
  ),
};

type CheckStatus = 'ok' | 'warning' | 'unknown';
interface ArtworkTexts {
  hint: string; pickExample: string; scenarios: string; scenario: Record<'warning' | 'ok' | 'wrongType' | 'timeout' | 'empty', string>;
  fileName: string; meta: string; preview: string; replace: string; retry: string;
  status: Record<CheckStatus, string>; checksTitle: string;
  checks: { label: string; value: string; status: CheckStatus }[]; okChecks: { label: string; value: string; status: CheckStatus }[];
  warningTitle: string; warningText: string; uploadBetter: string; continueAnyway: string;
  okTitle: string; wrongType: string; timeoutTitle: string; timeoutText: string; askDesigner: string;
}
const artworkEnglish: ArtworkTexts = {
  hint: 'AI, EPS, PDF, SVG, PNG or JPG (max. 25 MB)', pickExample: 'Use an example file', scenarios: 'Show:',
  scenario: { warning: 'Warning', ok: 'All good', wrongType: 'Wrong file type', timeout: 'Check timed out', empty: 'Empty' },
  fileName: 'logo-acme.png', meta: '1.2 MB · 640 × 480 px', preview: 'Preview of logo-acme.png', replace: 'Replace', retry: 'Try again',
  status: { ok: 'OK', warning: 'Check', unknown: 'Unknown' }, checksTitle: 'File check',
  checks: [
    { label: 'Quality', value: 'Low resolution for this print size', status: 'warning' },
    { label: 'Colors', value: '6 colors (estimated)', status: 'warning' },
    { label: 'Background', value: 'Transparent', status: 'ok' },
    { label: 'File type', value: 'Pixels, not vector', status: 'unknown' },
  ],
  okChecks: [
    { label: 'Quality', value: 'Sharp enough for this print size', status: 'ok' },
    { label: 'Colors', value: '2 colors', status: 'ok' },
    { label: 'Background', value: 'Transparent', status: 'ok' },
    { label: 'File type', value: 'Vector', status: 'ok' },
  ],
  warningTitle: 'This file may not print well', warningText: 'The resolution is low and we count more colors than the chosen method supports. For a photo file the color count is an estimate.',
  uploadBetter: 'Upload a better file', continueAnyway: 'Continue anyway',
  okTitle: 'This file is ready to print', wrongType: 'We cannot use a .docx file. Upload an AI, EPS, PDF, SVG, PNG or JPG.',
  timeoutTitle: 'We could not check this file', timeoutText: 'The check took too long. You can try again, or continue and let our designer check the file.', askDesigner: 'Let our designer check it',
};
const artworkDutch: ArtworkTexts = {
  hint: 'AI, EPS, PDF, SVG, PNG of JPG (max. 25 MB)', pickExample: 'Gebruik een voorbeeldbestand', scenarios: 'Toon:',
  scenario: { warning: 'Waarschuwing', ok: 'Alles goed', wrongType: 'Verkeerd bestandstype', timeout: 'Controle duurt te lang', empty: 'Leeg' },
  fileName: 'logo-acme.png', meta: '1,2 MB · 640 × 480 px', preview: 'Voorbeeld van logo-acme.png', replace: 'Vervangen', retry: 'Opnieuw proberen',
  status: { ok: 'Goed', warning: 'Let op', unknown: 'Onbekend' }, checksTitle: 'Controle van je bestand',
  checks: [
    { label: 'Kwaliteit', value: 'Lage resolutie voor dit drukformaat', status: 'warning' },
    { label: 'Kleuren', value: '6 kleuren (geschat)', status: 'warning' },
    { label: 'Achtergrond', value: 'Transparant', status: 'ok' },
    { label: 'Bestandstype', value: 'Pixels, geen vector', status: 'unknown' },
  ],
  okChecks: [
    { label: 'Kwaliteit', value: 'Scherp genoeg voor dit drukformaat', status: 'ok' },
    { label: 'Kleuren', value: '2 kleuren', status: 'ok' },
    { label: 'Achtergrond', value: 'Transparant', status: 'ok' },
    { label: 'Bestandstype', value: 'Vector', status: 'ok' },
  ],
  warningTitle: 'Dit bestand drukt mogelijk niet goed af', warningText: 'De resolutie is laag en we tellen meer kleuren dan de gekozen methode aankan. Bij een fotobestand is het aantal kleuren een schatting.',
  uploadBetter: 'Beter bestand uploaden', continueAnyway: 'Toch doorgaan',
  okTitle: 'Dit bestand is klaar om te drukken', wrongType: 'Een .docx-bestand kunnen we niet gebruiken. Upload een AI, EPS, PDF, SVG, PNG of JPG.',
  timeoutTitle: 'We konden dit bestand niet controleren', timeoutText: 'De controle duurde te lang. Probeer het opnieuw, of ga door en laat onze ontwerper het bestand nakijken.', askDesigner: 'Laat onze ontwerper het nakijken',
};
type ArtworkStep = 'empty' | 'uploading' | 'processing' | 'warning' | 'ok' | 'wrongType' | 'timeout';
const badgeColor = { ok: 'success', warning: 'warning', unknown: 'gray' } as const;
/**
 * Pattern, not a component: which checks exist and what a warning means is decided by your page.
 * File upload item gives the slots (media, actions, content) and the processing status.
 */
function ArtworkCheck({ t }: { t: ArtworkTexts }) {
  const [step, setStep] = useState<ArtworkStep>('warning');
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (step === 'uploading') { const id = window.setTimeout(() => (progress >= 100 ? setStep('processing') : setProgress(progress + 25)), 300); return () => window.clearTimeout(id); }
    if (step === 'processing') { const id = window.setTimeout(() => setStep('warning'), 1500); return () => window.clearTimeout(id); }
    return undefined;
  }, [step, progress]);
  const start = () => { setProgress(0); setStep('uploading'); };
  const onFiles = (files: File[]) => { if (files[0] && !/\.(ai|eps|pdf|svg|png|jpe?g)$/i.test(files[0].name)) setStep('wrongType'); else start(); };
  const checks = (rows: ArtworkTexts['checks']) => (
    <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '8px 12px', margin: 0, alignItems: 'center' }} aria-label={t.checksTitle}>
      {rows.map((row) => (
        <div key={row.label} style={{ display: 'contents' }}>
          <dt className="rb-text-sm" style={{ color: 'var(--color-foreground-tertiary)' }}>{row.label}</dt>
          <dd className="rb-text-sm" style={{ margin: 0 }}>{row.value}</dd>
          <dd style={{ margin: 0, justifySelf: 'end' }}><Badge size="sm" color={badgeColor[row.status]}>{t.status[row.status]}</Badge></dd>
        </div>
      ))}
    </dl>
  );
  const thumb = <Thumb label={t.preview} />;
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <FileUpload onFiles={onFiles} hint={t.hint}>
        {step === 'uploading' && <FileUploadItem name={t.fileName} size={t.meta} progress={progress} onRemove={() => setStep('empty')} />}
        {step === 'processing' && <FileUploadItem name={t.fileName} size={t.meta} status="processing" media={thumb} onRemove={() => setStep('empty')} />}
        {step === 'warning' && (
          <FileUploadItem name={t.fileName} size={t.meta} status="complete" media={thumb} actions={<Button size="sm" hierarchy="tertiary" onClick={start}>{t.replace}</Button>} onRemove={() => setStep('empty')}>
            {checks(t.checks)}
            <Alert color="warning" title={t.warningTitle} actions={<><Button size="sm" hierarchy="secondary" onClick={start}>{t.uploadBetter}</Button><Button size="sm" hierarchy="tertiary">{t.continueAnyway}</Button></>}>{t.warningText}</Alert>
          </FileUploadItem>
        )}
        {step === 'ok' && (
          <FileUploadItem name="logo-acme.svg" size="48 KB" status="complete" media={thumb} actions={<Button size="sm" hierarchy="tertiary" onClick={start}>{t.replace}</Button>} onRemove={() => setStep('empty')}>
            {checks(t.okChecks)}
            <Alert color="success" title={t.okTitle} />
          </FileUploadItem>
        )}
        {step === 'wrongType' && <FileUploadItem name="logo-acme.docx" status="error" error={t.wrongType} onRemove={() => setStep('empty')} />}
        {step === 'timeout' && (
          <FileUploadItem name={t.fileName} size={t.meta} status="complete" media={thumb} actions={<Button size="sm" hierarchy="tertiary" onClick={start}>{t.retry}</Button>} onRemove={() => setStep('empty')}>
            <Alert color="gray" title={t.timeoutTitle} actions={<Button size="sm" hierarchy="secondary">{t.askDesigner}</Button>}>{t.timeoutText}</Alert>
          </FileUploadItem>
        )}
      </FileUpload>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <span className="rb-text-sm">{t.scenarios}</span>
        {(['warning', 'ok', 'wrongType', 'timeout', 'empty'] as const).map((key) => <Button key={key} size="sm" hierarchy={step === key ? 'secondary' : 'tertiary'} aria-pressed={step === key} onClick={() => setStep(key)}>{t.scenario[key]}</Button>)}
        <Button size="sm" hierarchy="link" onClick={start}>{t.pickExample}</Button>
      </div>
    </div>
  );
}
export const ArtworkCheckPattern: StoryObj<typeof FileUpload> = {
  name: 'Pattern: artwork check',
  decorators: [(S) => <div style={{ maxWidth: 560 }}><S /></div>],
  render: () => <ArtworkCheck t={artworkEnglish} />,
};
export const ArtworkCheckPatternDutch: StoryObj<typeof FileUpload> = {
  name: 'Pattern: artwork check, in Dutch',
  decorators: [(S) => <div style={{ maxWidth: 560 }}><S /></div>],
  render: () => <LocaleProvider locale={nlNL}><ArtworkCheck t={artworkDutch} /></LocaleProvider>,
};
