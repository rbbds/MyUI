import { Star } from 'lucide-react';
import tokensCss from '../../styles/tokens.css?raw';
import { Button } from '../../components/Button/Button';
import { Toggle } from '../../components/Selection/Checkbox';
import { FeaturedIcon } from '../../components/Display/Display';
import { NotificationButton } from '../../components/Portal/Notifications';
import { MetricCard } from '../../components/Portal/MetricCard';
import { StatusIndicator } from '../../components/Portal/StatusIndicator';
import { LogoMark } from './Logo';
import { useDocsGlobals } from './useDocsGlobals';
import './Cover.css';

/** Reads --brand-color-primary-600 per brand mode from tokens.css, so the chips never hold their own colors. */
function brandColor(brand: string): string | undefined {
  const selector = brand === 'iris' ? ':root{' : `:root[data-brand="${brand}"]{`;
  const start = tokensCss.indexOf(selector);
  if (start < 0) return undefined;
  const block = tokensCss.slice(start, tokensCss.indexOf('}', start));
  return block.match(/--brand-color-primary-600:([^;]+);/)?.[1];
}

const BRANDS = [
  { id: 'iris', name: 'Iris' },
  { id: 'forest', name: 'Forest' },
  { id: 'berry', name: 'Berry' },
];

/** Docs cover, same design as the Cover page in Figma. Follows the Theme and Brand toolbar. */
export function Cover() {
  const globals = useDocsGlobals();
  const active = globals.brand ?? 'iris';
  return (
    <section className="myui-cover sb-unstyled" aria-labelledby="myui-cover-title">
      <span className="myui-cover__circle myui-cover__circle--1" aria-hidden="true" />
      <span className="myui-cover__circle myui-cover__circle--2" aria-hidden="true" />
      <div className="myui-cover__intro">
        <span className="myui-cover__logo"><LogoMark /></span>
        <div>
          <h1 id="myui-cover-title" className="myui-cover__title">MyUI</h1>
          <p className="myui-cover__tagline">One system, many faces.</p>
        </div>
        <p className="myui-cover__sub">White label design system voor Figma, React en Storybook</p>
        <ul className="myui-cover__brands" aria-label="Stijlen">
          {BRANDS.map((b) => (
            <li key={b.id}>
              <a className="myui-cover__chip" href={`./?path=/docs/introductie--docs&globals=brand:${b.id}`} target="_top" aria-current={active === b.id ? 'true' : undefined}>
                <span className="myui-cover__dot" style={{ background: brandColor(b.id) }} aria-hidden="true" />
                {b.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="myui-cover__showcase" role="group" aria-label="Voorbeeld van MyUI-componenten">
        <div className="myui-cover__row">
          <Button>Opslaan</Button>
          <Button hierarchy="secondary">Annuleren</Button>
          <NotificationButton count={3} className="myui-cover__bell" />
        </div>
        <Toggle label="Meldingen ontvangen" hint="Ontvang een e-mail bij nieuwe berichten." defaultChecked />
        <MetricCard label="Totaal vermogen" value="€ 24.580" delta="+12,4%" trend="up" meta="t.o.v. vorige maand" icon={<FeaturedIcon size="sm" icon={<Star />} />} />
        <div className="myui-cover__row">
          <StatusIndicator color="brand">In behandeling</StatusIndicator>
          <StatusIndicator color="success">Actief</StatusIndicator>
          <StatusIndicator color="warning">Wacht op jou</StatusIndicator>
        </div>
      </div>
    </section>
  );
}
