import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CalendarDays, CreditCard, Repeat } from 'lucide-react';
import { Badge, FeaturedIcon } from '../Display/Display';
import { Skeleton } from '../Display/Feedback';
import { Alert } from '../Overlay/Alert';
import { Button } from '../Button/Button';
import { LocaleProvider } from '../../utils/locale';
import { nlNL } from '../../locales/nl-NL';
import { SelectionCard, SelectionCardGroup } from './SelectionCard';

const meta: Meta<typeof SelectionCard> = {
  title: 'Selection controls/Selection card',
  component: SelectionCard,
  args: { type: 'radio', title: 'Pay monthly', description: 'A fixed amount every month, paid automatically.', name: 'demo' },
  argTypes: { type: { control: 'inline-radio', options: ['radio', 'checkbox'] } },
  decorators: [(S) => <div style={{ maxWidth: 400 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof SelectionCard>;
export const Playground: Story = {};
export const RadioGroupCards: Story = {
  render: () => (
    <SelectionCardGroup legend="How do you want to pay?">
      <SelectionCard name="payment" value="month" defaultChecked title="Monthly" description="A fixed amount every month." icon={<FeaturedIcon size="sm" color="gray" icon={<Repeat />} />} />
      <SelectionCard name="payment" value="year" title="Yearly" description="Once a year, with a 5% discount." icon={<FeaturedIcon size="sm" color="gray" icon={<CalendarDays />} />} />
      <SelectionCard name="payment" value="one-off" title="One-off" description="Not available for this product." disabled icon={<FeaturedIcon size="sm" color="gray" icon={<CreditCard />} />} />
    </SelectionCardGroup>
  ),
};
export const CheckboxCards: Story = {
  render: () => (
    <SelectionCardGroup legend="What do you want notifications about?" columns={2}>
      <SelectionCard type="checkbox" defaultChecked title="New messages" description="An email right away." />
      <SelectionCard type="checkbox" title="Weekly summary" description="Every Monday." />
    </SelectionCardGroup>
  ),
  decorators: [(S) => <div style={{ maxWidth: 640 }}><S /></div>],
};

/** The three slots: badge next to the title, meta below the description, and free content below the option. */
export const Slots: Story = {
  render: () => (
    <SelectionCardGroup legend="How do you want to pay?">
      <SelectionCard name="slots" value="month" defaultChecked title="Monthly" badge={<Badge size="sm" color="brand">Most chosen</Badge>} description="A fixed amount every month." meta="First payment on the 1st of next month." aside="€12">
        <Alert color="info" title="You can switch to yearly at any time." />
      </SelectionCard>
      <SelectionCard name="slots" value="year" title="Yearly" description="Once a year, with a 5% discount." aside="€137" />
      <SelectionCard name="slots" value="one-off" title="One-off" description="Pay the whole amount now." meta="Not available for this product." disabled />
    </SelectionCardGroup>
  ),
};

interface Method { value: string; title: string; description: string; meta: string; price: string; maxColors?: number; unavailable?: boolean }
interface DecorationTexts { legend: string; recommended: string; notIdeal: string; mismatchTitle: (colors: number) => string; mismatchText: (max: number) => string; chooseRecommended: string; fewerColors: string; status: (title: string) => string; loading: string; showLoading: string; methods: Method[] }
const english: DecorationTexts = {
  legend: 'Decoration method',
  recommended: 'Recommended',
  notIdeal: 'Not ideal',
  mismatchTitle: (colors) => `Your logo has ${colors} colors`,
  mismatchText: (max) => `This method supports ${max}. Small details can get lost.`,
  chooseRecommended: 'Choose the recommended method',
  fewerColors: 'Use fewer colors',
  status: (title) => `Chosen: ${title}`,
  loading: 'Loading methods',
  showLoading: 'Show loading',
  methods: [
    { value: 'print', title: 'Full color print', description: 'Printed straight onto the product. Best for photos and gradients.', meta: 'Any number of colors · 8 working days', price: '+ €0.18' },
    { value: 'screen', title: 'Screen print', description: 'Sharp, solid colors. Best for simple logos.', meta: 'Max. 4 colors · 10 working days', price: '+ €0.12', maxColors: 4 },
    { value: 'engraving', title: 'Engraving', description: 'Lasered into the material.', meta: 'Not available for this material.', price: '', unavailable: true },
  ],
};
const dutch: DecorationTexts = {
  legend: 'Drukmethode',
  recommended: 'Aanbevolen',
  notIdeal: 'Niet ideaal',
  mismatchTitle: (colors) => `Je logo heeft ${colors} kleuren`,
  mismatchText: (max) => `Deze methode ondersteunt er ${max}. Kleine details kunnen wegvallen.`,
  chooseRecommended: 'Kies de aanbevolen methode',
  fewerColors: 'Minder kleuren gebruiken',
  status: (title) => `Gekozen: ${title}`,
  loading: 'Methodes laden',
  showLoading: 'Laden tonen',
  methods: [
    { value: 'print', title: 'Full colour druk', description: 'Direct op het product gedrukt. Geschikt voor foto\'s en kleurverlopen.', meta: 'Onbeperkt kleuren · 8 werkdagen', price: '+ € 0,18' },
    { value: 'screen', title: 'Zeefdruk', description: 'Scherpe, dekkende kleuren. Geschikt voor eenvoudige logo\'s.', meta: 'Max. 4 kleuren · 10 werkdagen', price: '+ € 0,12', maxColors: 4 },
    { value: 'engraving', title: 'Graveren', description: 'Met een laser in het materiaal.', meta: 'Niet beschikbaar voor dit materiaal.', price: '', unavailable: true },
  ],
};
/**
 * Pattern, not a component: the rules (which method is recommended, when a method is not ideal) live in your page.
 * Selection card only gives the slots.
 */
function DecorationMethods({ t }: { t: DecorationTexts }) {
  const logoColors = 6;
  const recommended = 'print';
  const [value, setValue] = useState(recommended);
  const [loading, setLoading] = useState(false);
  const chosen = t.methods.find((m) => m.value === value);
  if (loading) {
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <span className="rb-visually-hidden" role="status">{t.loading}</span>
        {t.methods.map((m) => <Skeleton key={m.value} variant="rect" height={96} />)}
        <div><Button hierarchy="secondary" size="sm" onClick={() => setLoading(false)}>{t.legend}</Button></div>
      </div>
    );
  }
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <SelectionCardGroup legend={t.legend}>
        {t.methods.map((m) => {
          const mismatch = m.maxColors !== undefined && logoColors > m.maxColors;
          return (
            <SelectionCard
              key={m.value}
              name="method"
              value={m.value}
              checked={value === m.value}
              onChange={() => setValue(m.value)}
              disabled={m.unavailable}
              title={m.title}
              badge={m.value === recommended ? <Badge size="sm" color="success">{t.recommended}</Badge> : mismatch ? <Badge size="sm" color="warning">{t.notIdeal}</Badge> : undefined}
              description={m.description}
              meta={m.meta}
              aside={m.price || undefined}
            >
              {mismatch && value === m.value && (
                <Alert
                  color="warning"
                  role="status"
                  title={t.mismatchTitle(logoColors)}
                  actions={<><Button size="sm" hierarchy="secondary" onClick={() => setValue(recommended)}>{t.chooseRecommended}</Button><Button size="sm" hierarchy="tertiary">{t.fewerColors}</Button></>}
                >
                  {t.mismatchText(m.maxColors ?? 0)}
                </Alert>
              )}
            </SelectionCard>
          );
        })}
      </SelectionCardGroup>
      <p role="status">{chosen ? t.status(chosen.title) : ''}</p>
      <div><Button hierarchy="tertiary" size="sm" onClick={() => setLoading(true)}>{t.showLoading}</Button></div>
    </div>
  );
}
export const DecorationMethod: Story = {
  name: 'Pattern: decoration method',
  render: () => <DecorationMethods t={english} />,
  decorators: [(S) => <div style={{ maxWidth: 480 }}><S /></div>],
};
export const DecorationMethodDutch: Story = {
  name: 'Pattern: decoration method, in Dutch',
  render: () => <LocaleProvider locale={nlNL}><DecorationMethods t={dutch} /></LocaleProvider>,
  decorators: [(S) => <div style={{ maxWidth: 480 }}><S /></div>],
};
