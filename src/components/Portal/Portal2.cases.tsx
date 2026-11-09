import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CircleCheck, FileText, Info, Send, Upload } from 'lucide-react';
import { Avatar, FeaturedIcon } from '../Display/Display';
import { Button } from '../Button/Button';
import { Toggle } from '../Selection/Checkbox';
import { Select } from '../Form/Select';
import { Breadcrumbs, Pagination } from '../Navigation/Navigation';
import { PageHeader } from './PageHeader';
import { StatusIndicator } from './StatusIndicator';
import { DocumentItem, DocumentList } from './DocumentList';
import { ActivityFeed, ActivityItem } from './ActivityFeed';
import { NotificationItem, NotificationMenu, NotificationPanel } from './Notifications';
import { Popover } from './Popover';
import { SettingRow, SettingsSection } from './Settings';
import { Checklist, ChecklistItem } from './Checklist';
import { VerificationCode } from './VerificationCode';
import { PasswordInput } from './PasswordInput';
import { CopyInput } from './CopyInput';

const meta: Meta = { title: 'Portaal/Cases 2', parameters: { layout: 'padded' } };
export default meta;
type Story = StoryObj;

export const StatusIndicators: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      <StatusIndicator color="gray">Concept</StatusIndicator>
      <StatusIndicator color="brand">In behandeling</StatusIndicator>
      <StatusIndicator color="success">Actief</StatusIndicator>
      <StatusIndicator color="warning">Wacht op jou</StatusIndicator>
      <StatusIndicator color="error">Afgewezen</StatusIndicator>
      <StatusIndicator color="info">Ingepland</StatusIndicator>
    </div>
  ),
};

const docs = [
  { id: '1', title: 'Jaaropgave 2025', meta: 'PDF · 240 kB · 12 okt. 2026', unread: true },
  { id: '2', title: 'Uniform pensioenoverzicht 2026', meta: 'PDF · 1,2 MB · 1 okt. 2026', unread: true },
  { id: '3', title: 'Bevestiging adreswijziging', meta: 'PDF · 88 kB · 14 sep. 2026' },
  { id: '4', title: 'Jaaropgave 2024', meta: 'PDF · 236 kB · 10 okt. 2025' },
];
export const DocumentLists: Story = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <DocumentList title="Documenten" action={<Button hierarchy="link" size="sm">Alle documenten</Button>}>
        {docs.map((d) => <DocumentItem key={d.id} title={d.title} href="#" meta={d.meta} unread={d.unread} downloadHref="#" />)}
      </DocumentList>
    </div>
  ),
};

export const ActivityFeeds: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <ActivityFeed aria-label="Verloop van je aanvraag">
        <ActivityItem title="Aanvraag ontvangen" time="12 okt., 09:14" dateTime="2026-10-12T09:14" icon={<Send />}>We hebben je aanvraag voor waardeoverdracht ontvangen.</ActivityItem>
        <ActivityItem title="Document toegevoegd" time="12 okt., 09:20" dateTime="2026-10-12T09:20">Je hebt een kopie van je identiteitsbewijs geüpload.</ActivityItem>
        <ActivityItem title="In behandeling bij Sanne" time="13 okt., 11:02" dateTime="2026-10-13T11:02" avatar={<Avatar size="sm" name="Sanne van Dijk" />}>Sanne van de klantenservice bekijkt je aanvraag.</ActivityItem>
        <ActivityItem title="Besluit verstuurd" time="16 okt., 15:40" dateTime="2026-10-16T15:40" icon={<CircleCheck />}>Je ontvangt de brief ook per post.</ActivityItem>
      </ActivityFeed>
    </div>
  ),
};

const notes = [
  { id: 'a', title: 'Sanne van Dijk', text: 'heeft je aanvraag beoordeeld. Bekijk het besluit.', time: '2 uur geleden', unread: true, avatar: <Avatar size="sm" name="Sanne van Dijk" /> },
  { id: 'b', title: 'Nieuw document', text: 'Je jaaropgave 2025 staat klaar.', time: 'gisteren', unread: true, avatar: <FeaturedIcon size="sm" color="gray" icon={<FileText />} /> },
  { id: 'c', title: 'Wijziging verwerkt', text: 'Je nieuwe adres is opgeslagen.', time: '3 dagen geleden', avatar: <FeaturedIcon size="sm" color="gray" icon={<CircleCheck />} /> },
];
export const NotificationMenuExample: Story = {
  name: "Meldingen",
  render: () => {
    const [items, setItems] = useState(notes);
    const unread = items.filter((n) => n.unread).length;
    const read = (id?: string) => setItems((xs) => xs.map((n) => (!id || n.id === id ? { ...n, unread: false } : n)));
    return (
      <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap', minHeight: 460 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: 420 }}>
          <NotificationMenu count={unread} onMarkAllRead={() => read()} footer={<Button hierarchy="link" size="sm">Alle meldingen bekijken</Button>}>
            {items.map((n) => <NotificationItem key={n.id} title={n.title} time={n.time} unread={n.unread} avatar={n.avatar} onClick={() => read(n.id)}>{n.text}</NotificationItem>)}
          </NotificationMenu>
        </div>
        <div style={{ width: 400 }}><NotificationPanel title="Meldingen (leeg voorbeeld)">{[]}</NotificationPanel></div>
      </div>
    );
  },
};

export const Popovers: Story = {
  render: () => (
    <div style={{ minHeight: 240 }}>
      <p style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
        Waardeoverdracht
        <Popover title="Wat is waardeoverdracht?" trigger={<button type="button" className="rb-popover-help" aria-label="Uitleg waardeoverdracht" style={{ display: 'inline-flex', padding: 4, border: 0, background: 'none', color: 'var(--color-foreground-tertiary)', cursor: 'pointer' }}><Info size={16} aria-hidden /></button>}
          actions={<Button size="sm">Lees meer</Button>}>
          Je neemt het pensioen dat je bij een vorige werkgever hebt opgebouwd mee naar je nieuwe pensioenfonds.
        </Popover>
      </p>
    </div>
  ),
};

export const SettingsSections: Story = {
  render: () => {
    const [mail, setMail] = useState(true);
    const [post, setPost] = useState(true);
    const [news, setNews] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 40, maxWidth: 1040 }}>
        <SettingsSection title="Meldingen" description="Kies hoe en wanneer we je op de hoogte houden.">
          <SettingRow label="E-mail bij nieuwe documenten" description="We sturen je een e-mail als er een nieuw document voor je klaarstaat." control={<Toggle size="md" checked={mail} onChange={(e) => setMail(e.target.checked)} />} />
          <SettingRow label="Ook een brief per post" description="Naast de digitale versie ontvang je belangrijke brieven op papier." control={<Toggle size="md" checked={post} onChange={(e) => setPost(e.target.checked)} />} />
          <SettingRow label="Nieuwsbrief" description="Vier keer per jaar nieuws over je pensioen." control={<Toggle size="md" checked={news} onChange={(e) => setNews(e.target.checked)} />} />
        </SettingsSection>
        <SettingsSection title="Taal" description="De taal van je omgeving en brieven." actions={<><Button hierarchy="secondary">Annuleren</Button><Button>Opslaan</Button></>}>
          <div style={{ padding: '16px 0' }}><Select label="Taal" options={[{ value: 'nl', label: 'Nederlands' }, { value: 'en', label: 'English' }]} defaultValue="nl" /></div>
        </SettingsSection>
      </div>
    );
  },
};

export const Checklists: Story = {
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <Checklist title="Maak je account compleet" done={2} total={5}>
        <ChecklistItem status="done" title="Account aangemaakt" />
        <ChecklistItem status="done" title="E-mailadres bevestigd" />
        <ChecklistItem status="current" title="Controleer je adres" description="Klopt je adres? Dan komt je post goed aan." action={<Button hierarchy="link" size="sm">Nu controleren</Button>} />
        <ChecklistItem status="open" title="Voeg je IBAN toe" />
        <ChecklistItem status="open" title="Kies hoe je post ontvangt" />
      </Checklist>
    </div>
  ),
};

export const VerificationCodes: Story = {
  render: () => {
    const [v, setV] = useState('');
    const [err, setErr] = useState<string | undefined>();
    return (
      <div style={{ display: 'grid', gap: 32 }}>
        <VerificationCode label="Verificatiecode" hint="We hebben een code gestuurd naar 06 •• •• •• 78." value={v} error={err}
          onChange={(x) => { setV(x); setErr(undefined); }} onComplete={(x) => { if (x !== '123456') setErr('Deze code klopt niet. Controleer de cijfers of vraag een nieuwe code aan.'); }} />
        <p style={{ margin: 0, fontSize: 14, color: 'var(--color-foreground-tertiary)' }}>Tip: 123456 is goed, elke andere code geeft een foutmelding.</p>
        <VerificationCode label="Uitgeschakeld" defaultValue="482" disabled />
      </div>
    );
  },
};

export const PasswordInputs: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 32, maxWidth: 360 }}>
      <PasswordInput label="Nieuw wachtwoord" showStrength />
      <PasswordInput label="Wachtwoord" hint="Bij inloggen alleen het veld, zonder meter." />
    </div>
  ),
};

export const CopyInputs: Story = {
  render: () => <div style={{ maxWidth: 400 }}><CopyInput label="Klantnummer" value="1234 5678 90" /></div>,
};

/* ---------- Example pages ---------- */
export const Documenten: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <main style={{ display: 'grid', gap: 24, padding: '32px clamp(16px,4vw,48px)', maxWidth: 960, margin: '0 auto' }}>
        <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Mijn omgeving', href: '#' }, { label: 'Documenten' }]} />} title="Documenten" description="Al je brieven en overzichten op één plek."
          actions={<Button hierarchy="secondary" iconLeading={<Upload aria-hidden />}>Document uploaden</Button>} />
        <DocumentList headingLevel={2} title="Alle documenten">
          {[...docs, ...docs.map((d) => ({ ...d, id: d.id + 'b', unread: false }))].map((d) => <DocumentItem key={d.id} title={d.title} href="#" meta={d.meta} unread={d.unread} downloadHref="#" />)}
        </DocumentList>
        <Pagination page={page} pageCount={4} onPageChange={setPage} />
      </main>
    );
  },
};

export const Aanvraag: Story = {
  name: 'Aanvraag volgen',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <main style={{ display: 'grid', gap: 32, padding: '32px clamp(16px,4vw,48px)', maxWidth: 960, margin: '0 auto' }}>
      <PageHeader title="Waardeoverdracht" description={<>Status: <StatusIndicator color="brand">In behandeling</StatusIndicator></>} />
      <section aria-labelledby="verloop"><h2 id="verloop" style={{ margin: '0 0 16px', fontSize: 'var(--text-headings-h4-font-size)', fontFamily: 'var(--text-headings-h4-font-family)' }}>Verloop</h2>
        <ActivityFeed>
          <ActivityItem title="Aanvraag ontvangen" time="12 okt., 09:14" icon={<Send />}>We hebben je aanvraag ontvangen.</ActivityItem>
          <ActivityItem title="In behandeling bij Sanne" time="13 okt., 11:02" avatar={<Avatar size="sm" name="Sanne van Dijk" />}>Je hoort binnen 5 werkdagen van ons.</ActivityItem>
        </ActivityFeed>
      </section>
      <div style={{ maxWidth: 440 }}><CopyInput label="Dossiernummer" value="WO-2026-004812" hint="Noem dit nummer als je contact opneemt." /></div>
    </main>
  ),
};

export const Inloggen: Story = {
  name: 'Inloggen met code',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <main style={{ display: 'grid', gap: 24, padding: '64px 24px', maxWidth: 400, margin: '0 auto' }}>
      <h1 style={{ margin: 0, fontFamily: 'var(--text-headings-h2-font-family)', fontSize: 'var(--text-headings-h2-font-size)' }}>Controleer je telefoon</h1>
      <p style={{ margin: 0, color: 'var(--color-foreground-secondary)' }}>Vul de code van 6 cijfers in die we per sms hebben gestuurd.</p>
      <VerificationCode label="Verificatiecode" hint="De code is 10 minuten geldig." autoFocus />
      <Button fullWidth>Inloggen</Button>
      <Button hierarchy="link" size="sm">Nieuwe code sturen</Button>
    </main>
  ),
};
