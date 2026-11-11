import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Bell, Briefcase, ChartColumn, CircleHelp, FileText, FolderKanban, House, ListChecks, ListFilter, Settings, Users, Wallet } from 'lucide-react';
import { Logo as BrandLogo } from '../docs/brand/Logo';
import { Button, ButtonIcon } from '../components/Button/Button';
import { Avatar, FeaturedIcon } from '../components/Display/Display';
import { Input } from '../components/Form/Input';
import { Select } from '../components/Form/Select';
import { Textarea } from '../components/Form/Textarea';
import { Checkbox } from '../components/Selection/Checkbox';
import { SelectionCard, SelectionCardGroup } from '../components/Selection/SelectionCard';
import { Breadcrumbs, NavItem, Pagination } from '../components/Navigation/Navigation';
import { Header, Sidebar, SidebarUser } from '../components/Navigation/AppShell';
import { BottomNavigation, BottomNavItem } from '../components/Navigation/BottomNavigation';
import { Stepper } from '../components/Navigation/Stepper';
import { Slideout } from '../components/Overlay/Slideout';
import { Banner } from '../components/Portal/Banner';
import { PageHeader } from '../components/Portal/PageHeader';
import { MetricCard } from '../components/Portal/MetricCard';
import { ActivityFeed, ActivityItem } from '../components/Portal/ActivityFeed';
import { DescriptionItem, DescriptionList } from '../components/Portal/DescriptionList';
import { DocumentItem, DocumentList } from '../components/Portal/DocumentList';
import { ProductCard, ProductGrid } from '../components/Commerce/ProductCard';
import { ActiveFilters, FilterGroup } from '../components/Commerce/Filters';
import { products } from '../components/Commerce/demo-data';
import './templates.css';

const meta: Meta = {
  title: 'Templates',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Page templates, the same as the Templates page in Figma. Every spacing and width comes from the layout tokens (`--layout-*`), so the pages follow the breakpoints. Resize the viewport to see them adapt.' } },
  },
};
export default meta;
type Story = StoryObj;

const Logo = () => (
  <a href="#" aria-label="MyUI home" style={{ display: 'inline-flex', textDecoration: 'none' }}>
    <BrandLogo size="small" tagline="" label="MyUI" />
  </a>
);

/** True while the media query matches. */
function useMedia(query: string) {
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches;
  const [match, setMatch] = useState(get);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [query]);
  return match;
}

/* ---------- Dashboard ---------- */
export const Dashboard: Story = {
  render: () => {
    const collapsed = useMedia('(max-width:899px)');
    return (
      <div className="rb-template rb-template--app">
        <div className="rb-template__mobile-header">
          <Header logo={<Logo />} actions={<ButtonIcon hierarchy="tertiary" icon={<Bell />} aria-label="Notifications" />} />
        </div>
        <div className="rb-template__body">
          <div className="rb-template__sidebar">
            <Sidebar
              logo={<Logo />}
              collapsed={collapsed}
              footer={<><NavItem href="#" icon={<Settings />}>Settings</NavItem><NavItem href="#" icon={<CircleHelp />}>Help</NavItem></>}
              user={<SidebarUser avatar={<Avatar name="Sanne de Vries" initials="SV" />} name="Sanne de Vries" email="sanne@example.com" />}
              userCollapsed={<Avatar name="Sanne de Vries" initials="SV" />}
            >
              <NavItem href="#" icon={<House />} active>Home</NavItem>
              <NavItem href="#" icon={<FolderKanban />} count={12}>Projects</NavItem>
              <NavItem href="#" icon={<ListChecks />}>Tasks</NavItem>
              <NavItem href="#" icon={<ChartColumn />}>Reports</NavItem>
              <NavItem href="#" icon={<Users />}>Team</NavItem>
            </Sidebar>
          </div>
          <main className="rb-template__main">
            <PageHeader title="Dashboard" description="Overview of your workspace." actions={<Button size="sm">New project</Button>} />
            <section aria-labelledby="tpl-kpi">
              <h2 id="tpl-kpi" className="rb-visually-hidden">Key figures</h2>
              <div className="rb-template__row">
                <MetricCard label="Team members" value="1,204" delta="+18" trend="up" meta="this month" icon={<FeaturedIcon size="sm" icon={<Users />} />} />
                <MetricCard label="Monthly invoice" value="€24,580" delta="+2.1%" trend="up" meta="vs last month" icon={<FeaturedIcon size="sm" icon={<Wallet />} />} />
                <MetricCard label="Open tasks" value="7" delta="−3" trend="down" meta="to do" icon={<FeaturedIcon size="sm" icon={<Briefcase />} />} />
                <MetricCard label="Documents" value="42" delta="0" trend="neutral" meta="new" icon={<FeaturedIcon size="sm" icon={<FileText />} />} />
              </div>
            </section>
            <div className="rb-template__row">
              <DocumentList title="Recent documents" action={<Button hierarchy="link" size="sm">View all</Button>}>
                <DocumentItem title="Quarterly report Q3" href="#" meta="PDF, Oct 12" unread />
                <DocumentItem title="Invoice October" href="#" meta="PDF, Oct 1" />
                <DocumentItem title="Project plan" href="#" meta="PDF, Sep 18" />
              </DocumentList>
              <section aria-labelledby="tpl-activity">
                <h2 id="tpl-activity" className="rb-visually-hidden">Activity</h2>
                <ActivityFeed>
                  <ActivityItem title="Sanne added 3 tasks" time="9:14 AM" />
                  <ActivityItem title="Invoice October was paid" time="Yesterday" />
                  <ActivityItem title="Tom joined the team" time="Oct 10" />
                </ActivityFeed>
              </section>
            </div>
          </main>
        </div>
        <div className="rb-template__bottom-nav">
          <BottomNavigation>
            <BottomNavItem href="#" icon={<House />} active>Home</BottomNavItem>
            <BottomNavItem href="#" icon={<FolderKanban />}>Projects</BottomNavItem>
            <BottomNavItem href="#" icon={<ListChecks />} badge>Tasks</BottomNavItem>
            <BottomNavItem href="#" icon={<ChartColumn />}>Reports</BottomNavItem>
            <BottomNavItem href="#" icon={<Users />}>Team</BottomNavItem>
          </BottomNavigation>
        </div>
      </div>
    );
  },
};

const siteHeader = <Header logo={<Logo />} links={[{ label: 'Home', href: '#' }, { label: 'Projects', href: '#', current: true }, { label: 'Team', href: '#' }]} actions={<Avatar name="Sanne de Vries" initials="SV" />} />;

/* ---------- Account ---------- */
export const Account: Story = {
  render: () => (
    <div className="rb-template">
      {siteHeader}
      <Banner color="info" title="Maintenance on Saturday.">The app is unavailable from 8:00 AM to 12:00 PM.</Banner>
      <main className="rb-template__page">
        <div className="rb-template__content">
          <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Workspace', href: '#' }, { label: 'Account', href: '#' }, { label: 'My details' }]} />} title="My details" description="Check your details and change them right away." />
          <div className="rb-template__row">
            <DescriptionList title="Personal details" action={<Button hierarchy="secondary" size="sm">Change</Button>}>
              <DescriptionItem label="Name">Sanne de Vries</DescriptionItem>
              <DescriptionItem label="Email address">sanne@example.com</DescriptionItem>
              <DescriptionItem label="Member since">11/06/2026</DescriptionItem>
            </DescriptionList>
            <DocumentList title="Documents">
              <DocumentItem title="Invoice October" href="#" meta="PDF, Oct 1" unread />
              <DocumentItem title="Terms of service" href="#" meta="PDF, Jan 4" />
            </DocumentList>
          </div>
        </div>
      </main>
    </div>
  ),
};

/* ---------- Shop ---------- */
const brandOptions = [{ value: 'Northlight', label: 'Northlight', count: 8 }, { value: 'Clay Studio', label: 'Clay Studio', count: 5 }, { value: 'Stride', label: 'Stride', count: 3 }];

export const Shop: Story = {
  render: () => {
    const [brands, setBrands] = useState<string[]>(['Northlight']);
    const [open, setOpen] = useState(false);
    const filters = <FilterGroup title="Brand" options={brandOptions} value={brands} onChange={setBrands} />;
    return (
      <div className="rb-template">
        {siteHeader}
        <main className="rb-template__page">
          <div className="rb-template__content">
            <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '#' }, { label: 'Products' }]} />} title="Products" divider={false} />
            <div className="rb-template__shop">
              <aside className="rb-template__filters" aria-labelledby="tpl-filters"><h2 id="tpl-filters" className="rb-visually-hidden">Filters</h2>{filters}</aside>
              <div className="rb-template__results">
                <div className="rb-template__toolbar">
                  <ActiveFilters resultCount={products.length} filters={brands.map((b) => ({ id: b, label: b }))} onRemove={(id) => setBrands((x) => x.filter((y) => y !== id))} onClear={() => setBrands([])} />
                  <Button className="rb-template__filter-button" hierarchy="secondary" size="sm" iconLeading={<ListFilter aria-hidden />} onClick={() => setOpen(true)}>Filters</Button>
                </div>
                <h2 className="rb-visually-hidden">Results</h2>
                <ProductGrid aria-label="Products">
                  {products.map((p) => <ProductCard key={p.id} href="#" title={p.title} meta={p.meta} price={p.price} compareAt={p.compareAt} rating={p.rating} reviewCount={p.reviewCount} image={{ src: p.image }} stock={p.stock} />)}
                </ProductGrid>
                <Pagination page={1} pageCount={10} onPageChange={() => undefined} />
              </div>
            </div>
          </div>
        </main>
        <Slideout open={open} onClose={() => setOpen(false)} title="Filters" size="sm">{filters}</Slideout>
      </div>
    );
  },
};

/* ---------- Form ---------- */
export const Form: Story = {
  render: () => (
    <div className="rb-template">
      {siteHeader}
      <main className="rb-template__page">
        <div className="rb-template__content rb-template__content--form">
          <Stepper current={2} steps={[{ title: 'Account', href: '#' }, { title: 'Company', href: '#' }, { title: 'Details' }, { title: 'Review' }]} />
          <PageHeader title="Your details" description="We use these details for your invoices." divider={false} />
          <form className="rb-template__fields" onSubmit={(e) => e.preventDefault()}>
            <Input label="Full name" autoComplete="name" required />
            <Input label="Email" type="email" autoComplete="email" required />
            <Select label="Country" options={[{ value: 'nl', label: 'Netherlands' }, { value: 'be', label: 'Belgium' }, { value: 'de', label: 'Germany' }]} />
            <Textarea label="Notes" hint="Optional" />
            <SelectionCardGroup legend="Billing" columns={2}>
              <SelectionCard name="billing" value="monthly" title="Pay monthly" description="€29 per month" defaultChecked />
              <SelectionCard name="billing" value="yearly" title="Pay yearly" description="€290 per year" />
            </SelectionCardGroup>
            <Checkbox label="I agree to the terms of service" required />
            <div className="rb-template__actions">
              <Button hierarchy="secondary" type="button">Previous</Button>
              <Button type="submit">Continue</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  ),
};
