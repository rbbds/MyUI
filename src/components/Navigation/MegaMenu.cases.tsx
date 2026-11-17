// Example content for the Mega menu and Mobile nav stories (Figma: 🧩 Mega menu, Example).
import { BookOpen, Building2, ChartColumn, File, FileText, Grid2x2, Inbox, LayoutTemplate, Rocket, Star, Users } from 'lucide-react';
import { Button } from '../Button/Button';
import type { HeaderLink } from './AppShell';
import { MegaMenuFeatured, type MegaMenuData } from './MegaMenu';

export const productMenu: MegaMenuData = {
  columns: [
    { heading: 'Features', links: [
      { label: 'Analytics', href: '#', description: 'See how your projects perform.', icon: <ChartColumn />, current: true },
      { label: 'Projects', href: '#', description: 'Plan and track your work.', icon: <Grid2x2 /> },
      { label: 'Reports', href: '#', description: 'Share results with your team.', icon: <FileText /> },
      { label: 'Inbox', href: '#', description: 'All messages in one place.', icon: <Inbox /> },
    ] },
    { heading: 'Use cases', links: [
      { label: 'For teams', href: '#', description: 'Work together in one workspace.', icon: <Users /> },
      { label: 'For agencies', href: '#', description: 'Run projects for many clients.', icon: <Building2 /> },
      { label: 'For enterprises', href: '#', description: 'Security and control at scale.', icon: <Star /> },
      { label: 'For startups', href: '#', description: 'Start fast, grow later.', icon: <Rocket /> },
    ] },
    { heading: 'Learn', links: [
      { label: 'Documentation', href: '#', description: 'Learn how everything works.', icon: <BookOpen /> },
      { label: 'Templates', href: '#', description: 'Start from a ready-made page.', icon: <LayoutTemplate /> },
      { label: 'Guides', href: '#', description: 'Step by step to your goal.', icon: <File /> },
    ] },
  ],
  featured: (
    <MegaMenuFeatured title="New: page templates" actions={<Button hierarchy="link" size="sm">Explore templates</Button>}>
      Start faster with a dashboard, account, shop and form template.
    </MegaMenuFeatured>
  ),
};

const smallMenu = (items: string[]): MegaMenuData => ({ columns: [{ heading: 'Pages', links: items.map((label) => ({ label, href: '#' })) }] });

export const siteLinks: HeaderLink[] = [
  { label: 'Product', menu: productMenu },
  { label: 'Solutions', menu: smallMenu(['For teams', 'For agencies', 'For enterprises']) },
  { label: 'Resources', menu: smallMenu(['Documentation', 'Guides', 'Community']) },
  { label: 'Pricing', href: '#' },
];
