import { useId, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useLabels, useLocale } from '../../utils/locale';
import { Badge } from '../Display/Display';
import { Skeleton } from '../Display/Feedback';
import { formatMoney } from './Basics';
import './Commerce.css';

/** One tier: from this quantity the unit price applies. The tier ends where the next one starts. */
export interface PriceTier {
  min: number;
  unitPrice: number;
}

export interface TierPricingLabels {
  quantity: string;
  unitPrice: string;
  saving: string;
  /** A tier with an end, e.g. "50 – 249". */
  range: (from: string, to: string) => string;
  /** The last tier, e.g. "1,000+". */
  openEnded: (from: string) => string;
  savingValue: (percent: number) => string;
  /** Hidden text in the active row, for screen readers. */
  yourPrice: string;
  /** Hidden text after the quantity when a row can be chosen, e.g. "set quantity to 250". */
  select: (quantity: string) => string;
  indicative: string;
  vatExcl: string;
  vatIncl: string;
  loading: string;
  /** Read out when the active tier changes. */
  announce: (price: string) => string;
  /** Hint to the next tier, from useTierPricing. */
  nextTier: (missing: string, price: string) => string;
  lowestPrice: string;
}
export const DEFAULT_TIER_PRICING_LABELS: TierPricingLabels = {
  quantity: 'Quantity',
  unitPrice: 'Price each',
  saving: 'Saving',
  range: (from, to) => `${from} – ${to}`,
  openEnded: (from) => `${from}+`,
  savingValue: (percent) => `${percent}%`,
  yourPrice: 'Your price',
  select: (quantity) => `set quantity to ${quantity}`,
  indicative: 'Indicative',
  vatExcl: 'Prices excl. VAT',
  vatIncl: 'Prices incl. VAT',
  loading: 'Loading prices',
  announce: (price) => `Your price: ${price} each`,
  nextTier: (missing, price) => `Add ${missing} more and pay ${price} each`,
  lowestPrice: 'You have the lowest price each',
};

export interface TierPricingOptions {
  currency?: string;
  locale?: string;
  /** Fixed number of decimals, as in Price. */
  decimals?: number;
  labels?: Partial<TierPricingLabels>;
}

const sortTiers = (tiers: PriceTier[]) => [...tiers].sort((a, b) => a.min - b.min);
const activeIndexOf = (sorted: PriceTier[], quantity: number | undefined) => {
  if (quantity === undefined) return -1;
  let index = -1;
  sorted.forEach((tier, i) => { if (quantity >= tier.min) index = i; });
  return index;
};

/**
 * The tier that matches a quantity, the next tier, and a ready-made hint such as
 * "Add 200 more and pay €0.48 each". Use the hint next to the quantity, for example in Add to cart.
 */
export function useTierPricing(tiers: PriceTier[], quantity: number, { currency = 'EUR', locale: localeProp, decimals, labels }: TierPricingOptions = {}) {
  const locale = useLocale(localeProp);
  const l = useLabels('tierPricing', DEFAULT_TIER_PRICING_LABELS, labels);
  const sorted = sortTiers(tiers);
  const activeIndex = activeIndexOf(sorted, quantity);
  const active = activeIndex >= 0 ? sorted[activeIndex] : undefined;
  const next = sorted[activeIndex + 1];
  const missing = next ? next.min - quantity : 0;
  const hint = next ? l.nextTier(missing.toLocaleString(locale), formatMoney(next.unitPrice, currency, locale, decimals)) : active ? l.lowestPrice : undefined;
  return { active, activeIndex, next, missing, hint };
}

export interface TierPricingTableProps extends TierPricingOptions {
  /** 2 to 8 tiers. The order does not matter. */
  tiers: PriceTier[];
  /** Current quantity. The matching row is marked. */
  quantity?: number;
  /** Makes the quantity of each row a button. Set your quantity to tier.min. */
  onTierSelect?: (tier: PriceTier) => void;
  title?: ReactNode;
  /** Extra line below the table, e.g. "Including one print position". */
  footnote?: ReactNode;
  /** Shows "Prices excl. VAT" or "Prices incl. VAT" below the table. */
  vat?: 'excl' | 'incl';
  /** Column with the saving in percent compared to the first tier. Default true. */
  showSaving?: boolean;
  /** Prices are an estimate, for example until a configuration is complete. Shows a badge. */
  indicative?: boolean;
  loading?: boolean;
  density?: 'default' | 'compact';
  className?: string;
}

/** Unit price per quantity tier, for bulk orders. A real table: the row that matches the quantity is marked. */
export function TierPricingTable({ tiers, quantity, onTierSelect, title, footnote, vat, showSaving = true, indicative, loading, density = 'default', currency = 'EUR', locale: localeProp, decimals, labels, className }: TierPricingTableProps) {
  const locale = useLocale(localeProp);
  const l = useLabels('tierPricing', DEFAULT_TIER_PRICING_LABELS, labels);
  const titleId = useId();
  const sorted = sortTiers(tiers);
  const activeIndex = loading ? -1 : activeIndexOf(sorted, quantity);
  const first = sorted[0];
  const number = (n: number) => n.toLocaleString(locale);
  const money = (n: number) => formatMoney(n, currency, locale, decimals);
  const note = [vat === 'excl' ? l.vatExcl : vat === 'incl' ? l.vatIncl : null, footnote].filter(Boolean);
  return (
    <div className={cx('rb-tier-pricing', density === 'compact' && 'rb-tier-pricing--compact', className)}>
      {(title || indicative) && (
        <div className="rb-tier-pricing__head">
          {title && <p id={titleId} className="rb-tier-pricing__title">{title}</p>}
          {indicative && <Badge size="sm">{l.indicative}</Badge>}
        </div>
      )}
      <div className="rb-tier-pricing__box">
        <table className="rb-tier-pricing__table" aria-labelledby={title ? titleId : undefined} aria-busy={loading || undefined}>
          <thead>
            <tr>
              <th scope="col">{l.quantity}</th>
              <th scope="col" className="rb-tier-pricing__num">{l.unitPrice}</th>
              {showSaving && <th scope="col" className="rb-tier-pricing__num">{l.saving}</th>}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: sorted.length || 4 }, (_, i) => (
                <tr key={i} aria-hidden="true">
                  <td><Skeleton width="60%" /></td>
                  <td className="rb-tier-pricing__num"><Skeleton width="50%" /></td>
                  {showSaving && <td className="rb-tier-pricing__num"><Skeleton width="30%" /></td>}
                </tr>
              ))
              : sorted.map((tier, i) => {
                const nextTier = sorted[i + 1];
                const range = nextTier ? l.range(number(tier.min), number(nextTier.min - 1)) : l.openEnded(number(tier.min));
                const saving = first && first.unitPrice > 0 ? Math.round((1 - tier.unitPrice / first.unitPrice) * 100) : 0;
                const active = i === activeIndex;
                return (
                  <tr key={tier.min} aria-current={active ? 'true' : undefined}>
                    <th scope="row">
                      {onTierSelect ? (
                        <button type="button" className="rb-tier-pricing__select" onClick={() => onTierSelect(tier)}>
                          {range}<span className="rb-visually-hidden">{' '}{l.select(number(tier.min))}</span>
                        </button>
                      ) : range}
                      {active && <span className="rb-visually-hidden">{' '}{l.yourPrice}</span>}
                    </th>
                    <td className="rb-tier-pricing__num">{money(tier.unitPrice)}</td>
                    {showSaving && <td className="rb-tier-pricing__num rb-tier-pricing__saving">{saving > 0 ? l.savingValue(saving) : null}</td>}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {note.length > 0 && <p className="rb-tier-pricing__footnote">{note.map((part, i) => <span key={i}>{part}</span>)}</p>}
      {/* Always in the page, so a screen reader announces the new price when the tier changes. */}
      <span className="rb-visually-hidden" role="status">{loading ? l.loading : activeIndex >= 0 ? l.announce(money(sorted[activeIndex].unitPrice)) : ''}</span>
    </div>
  );
}
