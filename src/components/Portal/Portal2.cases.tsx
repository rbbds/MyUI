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

const meta: Meta = { title: 'Account/Cases 2', parameters: { layout: 'padded' } };
export default meta;
type Story = StoryObj;

export const StatusIndicators: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      <StatusIndicator color="gray">Draft</StatusIndicator>
      <StatusIndicator color="info">In progress</StatusIndicator>
      <StatusIndicator color="success">Active</StatusIndicator>
      <StatusIndicator color="warning">Waiting for you</StatusIndicator>
      <StatusIndicator color="error">Rejected</StatusIndicator>
      <StatusIndicator color="info">Scheduled</StatusIndicator>
    </div>
  ),
};

const docs = [
  { id: '1', title: 'Invoice October 2026', meta: 'PDF · 240 kB · Oct 12, 2026', unread: true },
  { id: '2', title: 'Project proposal', meta: 'PDF · 1.2 MB · Oct 1, 2026', unread: true },
  { id: '3', title: 'Brand guidelines', meta: 'PDF · 88 kB · Sep 14, 2026' },
  { id: '4', title: 'Invoice September 2026', meta: 'PDF · 236 kB · Oct 10, 2026' },
];
export const DocumentLists: Story = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <DocumentList title="Documents" action={<Button hierarchy="link" size="sm">All documents</Button>}>
        {docs.map((d) => <DocumentItem key={d.id} title={d.title} href="#" meta={d.meta} unread={d.unread} downloadHref="#" />)}
      </DocumentList>
    </div>
  ),
};

export const ActivityFeeds: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <ActivityFeed aria-label="Progress of your request">
        <ActivityItem title="Request received" time="Oct 12, 9:14 AM" dateTime="2026-10-12T09:14" icon={<Send />}>We received your request to upgrade your plan.</ActivityItem>
        <ActivityItem title="Document added" time="Oct 12, 9:20 AM" dateTime="2026-10-12T09:20">You uploaded the project brief.</ActivityItem>
        <ActivityItem title="In progress with Sanne" time="Oct 13, 11:02 AM" dateTime="2026-10-13T11:02" avatar={<Avatar size="sm" name="Sanne van Dijk" />}>Sanne from the support team is reviewing your request.</ActivityItem>
        <ActivityItem title="Request approved" time="Oct 16, 3:40 PM" dateTime="2026-10-16T15:40" icon={<CircleCheck />}>You get a confirmation by email.</ActivityItem>
      </ActivityFeed>
    </div>
  ),
};

const notes = [
  { id: 'a', title: 'Sanne van Dijk', text: 'commented on your design. View the comment.', time: '2 hours ago', unread: true, avatar: <Avatar size="sm" name="Sanne van Dijk" /> },
  { id: 'b', title: 'New document', text: 'Your invoice for October is ready.', time: 'yesterday', unread: true, avatar: <FeaturedIcon size="sm" color="gray" icon={<FileText />} /> },
  { id: 'c', title: 'Change saved', text: 'Your new password is saved.', time: '3 days ago', avatar: <FeaturedIcon size="sm" color="gray" icon={<CircleCheck />} /> },
];
export const NotificationMenuExample: Story = {
  name: "Notifications",
  render: () => {
    const [items, setItems] = useState(notes);
    const unread = items.filter((n) => n.unread).length;
    const read = (id?: string) => setItems((xs) => xs.map((n) => (!id || n.id === id ? { ...n, unread: false } : n)));
    return (
      <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap', minHeight: 460 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: 420 }}>
          <NotificationMenu count={unread} onMarkAllRead={() => read()} footer={<Button hierarchy="link" size="sm">View all notifications</Button>}>
            {items.map((n) => <NotificationItem key={n.id} title={n.title} time={n.time} unread={n.unread} avatar={n.avatar} onClick={() => read(n.id)}>{n.text}</NotificationItem>)}
          </NotificationMenu>
        </div>
        <div style={{ width: 400 }}><NotificationPanel title="Notifications (empty example)">{[]}</NotificationPanel></div>
      </div>
    );
  },
};

export const Popovers: Story = {
  render: () => (
    <div style={{ minHeight: 240 }}>
      <p style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
        Workspaces
        <Popover title="What is a workspace?" trigger={<button type="button" className="rb-popover-help" aria-label="About workspaces" style={{ display: 'inline-flex', padding: 4, border: 0, background: 'none', color: 'var(--color-foreground-tertiary)', cursor: 'pointer' }}><Info size={16} aria-hidden /></button>}
          arrow actions={<Button size="sm">Read more</Button>}>
          A workspace keeps your projects, files and team members in one place.
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
        <SettingsSection title="Notifications" description="Choose how and when we keep you up to date.">
          <SettingRow label="Email for new documents" description="We send you an email when a new document is ready for you." control={<Toggle size="md" checked={mail} onChange={(e) => setMail(e.target.checked)} />} />
          <SettingRow label="Weekly summary" description="Get a short overview of your activity every Monday." control={<Toggle size="md" checked={post} onChange={(e) => setPost(e.target.checked)} />} />
          <SettingRow label="Newsletter" description="Product news and tips, once a month." control={<Toggle size="md" checked={news} onChange={(e) => setNews(e.target.checked)} />} />
        </SettingsSection>
        <SettingsSection title="Language" description="The language of your account and emails." actions={<><Button hierarchy="secondary">Cancel</Button><Button>Save</Button></>}>
          <div style={{ padding: '16px 0' }}><Select label="Language" options={[{ value: 'nl', label: 'Dutch' }, { value: 'en', label: 'English' }]} defaultValue="en" /></div>
        </SettingsSection>
      </div>
    );
  },
};

export const Checklists: Story = {
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <Checklist title="Complete your account" done={2} total={5}>
        <ChecklistItem status="done" title="Account created" />
        <ChecklistItem status="done" title="Email address confirmed" />
        <ChecklistItem status="current" title="Add company details" description="Add your company details so your invoices are correct." action={<Button hierarchy="link" size="sm">Check now</Button>} />
        <ChecklistItem status="open" title="Add a billing address" />
        <ChecklistItem status="open" title="Invite your team" />
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
        <VerificationCode label="Verification code" hint="We sent a code to +31 6 •• •• •• 78." value={v} error={err}
          onChange={(x) => { setV(x); setErr(undefined); }} onComplete={(x) => { if (x !== '123456') setErr('This code is not right. Check the digits or ask for a new code.'); }} />
        <p style={{ margin: 0, fontSize: 14, color: 'var(--color-foreground-tertiary)' }}>Tip: 123456 is right, any other code shows an error.</p>
        <VerificationCode label="Disabled" defaultValue="482" disabled />
      </div>
    );
  },
};

export const PasswordInputs: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 32, maxWidth: 360 }}>
      <PasswordInput label="New password" showStrength />
      <PasswordInput label="Password" hint="When logging in: only the field, no meter." />
    </div>
  ),
};

export const CopyInputs: Story = {
  render: () => <div style={{ maxWidth: 400 }}><CopyInput label="Account ID" value="1234 5678 90" /></div>,
};

/* ---------- Example pages ---------- */
export const Documents: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <main style={{ display: 'grid', gap: 24, padding: '32px clamp(16px,4vw,48px)', maxWidth: 960, margin: '0 auto' }}>
        <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'My account', href: '#' }, { label: 'Documents' }]} />} title="Documents" description="All your files and reports in one place."
          actions={<Button hierarchy="secondary" iconLeading={<Upload aria-hidden />}>Upload document</Button>} />
        <DocumentList headingLevel={2} title="All documents">
          {[...docs, ...docs.map((d) => ({ ...d, id: d.id + 'b', unread: false }))].map((d) => <DocumentItem key={d.id} title={d.title} href="#" meta={d.meta} unread={d.unread} downloadHref="#" />)}
        </DocumentList>
        <Pagination page={page} pageCount={4} onPageChange={setPage} />
      </main>
    );
  },
};

export const TrackRequest: Story = {
  name: 'Track request',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <main style={{ display: 'grid', gap: 32, padding: '32px clamp(16px,4vw,48px)', maxWidth: 960, margin: '0 auto' }}>
      <PageHeader title="Workspaces" description={<>Status: <StatusIndicator color="info">In progress</StatusIndicator></>} />
      <section aria-labelledby="progress"><h2 id="progress" style={{ margin: '0 0 16px', fontSize: 'var(--text-headings-h4-font-size)', fontFamily: 'var(--text-headings-h4-font-family)' }}>Progress</h2>
        <ActivityFeed>
          <ActivityItem title="Request received" time="Oct 12, 9:14 AM" icon={<Send />}>We received your request.</ActivityItem>
          <ActivityItem title="In progress with Sanne" time="Oct 13, 11:02 AM" avatar={<Avatar size="sm" name="Sanne van Dijk" />}>You will hear from us within 5 working days.</ActivityItem>
        </ActivityFeed>
      </section>
      <div style={{ maxWidth: 440 }}><CopyInput label="Reference number" value="WO-2026-004812" hint="Mention this ID when you contact us." /></div>
    </main>
  ),
};

export const LogIn: Story = {
  name: 'Log in with a code',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <main style={{ display: 'grid', gap: 24, padding: '64px 24px', maxWidth: 400, margin: '0 auto' }}>
      <h1 style={{ margin: 0, fontFamily: 'var(--text-headings-h2-font-family)', fontSize: 'var(--text-headings-h2-font-size)' }}>Check your phone</h1>
      <p style={{ margin: 0, color: 'var(--color-foreground-secondary)' }}>Enter the 6-digit code we sent by text message.</p>
      <VerificationCode label="Verification code" hint="The code is valid for 10 minutes." autoFocus />
      <Button fullWidth>Log in</Button>
      <Button hierarchy="link" size="sm">Send a new code</Button>
    </main>
  ),
};
