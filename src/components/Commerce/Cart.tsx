import { useId, useState, type FormEvent, type HTMLAttributes, type ReactNode } from 'react';
import { Link } from '../../utils/link';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { cx } from '../../utils/cx';
import { useLabels, useLocale, useText } from '../../utils/locale';
import { Button, ButtonIcon } from '../Button/Button';
import { Input } from '../Form/Input';
import { Tag } from '../Display/Display';
import { Slideout } from '../Overlay/Slideout';
import { EmptyState } from '../Content/Content';
import { Price, QuantityStepper, formatMoney } from './Basics';
import './Commerce.css';

/* ---------- Cart item ---------- */
export interface CartItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: string;
  href?: string;
  image?: { src: string; alt?: string };
  /** Chosen options, e.g. ["Color: blue", "Size: M"]. */
  options?: string[];
  /** Price per piece. The line shows price × quantity. */
  price: number;
  compareAt?: number;
  quantity: number;
  /** Minimum order. Default 1. */
  minQuantity?: number;
  maxQuantity?: number;
  /** Order unit, e.g. 25 when the product is sold per 25. Default 1. */
  quantityStep?: number;
  onQuantityChange?: (q: number) => void;
  onRemove?: () => void;
  /** Read-only version for the order summary in checkout. */
  readOnly?: boolean;
  size?: 'sm' | 'md';
  currency?: string;
  labels?: Partial<CartItemLabels>;
}
export interface CartItemLabels { quantity: (quantity: number) => string; quantityOf: (title: string) => string; remove: (title: string) => string }
export const DEFAULT_CART_ITEM_LABELS: CartItemLabels = {
  quantity: (quantity) => `Quantity: ${quantity}`,
  quantityOf: (title) => `Quantity ${title}`,
  remove: (title) => `Remove ${title}`,
};

/** Product line in the cart, mini cart or order summary. */
export function CartItem({ title, href, image, options, price, compareAt, quantity, minQuantity = 1, maxQuantity = 99, quantityStep = 1, onQuantityChange, onRemove, readOnly, size = 'md', currency, labels, className, ...rest }: CartItemProps) {
  const l = useLabels('cartItem', DEFAULT_CART_ITEM_LABELS, labels);
  const name = typeof title === 'string' ? title : '';
  return (
    <div className={cx('rb-cart-item', `rb-cart-item--${size}`, className)} {...rest}>
      <div className="rb-cart-item__media" data-size={size}>{image ? <img src={image.src} alt={image.alt ?? ''} /> : <span className="rb-product-card__placeholder" />}</div>
      <div className="rb-cart-item__main">
        <div className="rb-cart-item__text">
          <p className="rb-cart-item__title">{href ? <Link href={href}>{title}</Link> : title}</p>
          {options && options.length > 0 && <p className="rb-cart-item__options">{options.join(' · ')}</p>}
          {readOnly && <p className="rb-cart-item__options">{l.quantity(quantity)}</p>}
        </div>
        {!readOnly && (
          <div className="rb-cart-item__actions">
            <QuantityStepper size="sm" value={quantity} min={minQuantity} max={maxQuantity} step={quantityStep} onValueChange={onQuantityChange} label={l.quantityOf(name)} />
            {onRemove && <ButtonIcon hierarchy="tertiary" size="sm" icon={<Trash2 />} aria-label={l.remove(name)} onClick={onRemove} />}
          </div>
        )}
      </div>
      <Price className="rb-cart-item__price" amount={price * quantity} compareAt={compareAt ? compareAt * quantity : undefined} currency={currency} size="sm" />
    </div>
  );
}

/* ---------- Cart summary ---------- */
export interface CartSummaryLabels { subtotal: string; total: string }
export const DEFAULT_CART_SUMMARY_LABELS: CartSummaryLabels = { subtotal: 'Subtotal', total: 'Total' };
export interface SummaryLine { label: ReactNode; amount: number; /** Shown instead of the amount, e.g. "Free". */ note?: string }
export interface CartSummaryProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  subtotal: number;
  /** Shipping, payment fee, … Negative amounts are discounts. */
  lines?: SummaryLine[];
  total: number;
  /** Small text under the total, e.g. "Including VAT". */
  totalNote?: ReactNode;
  /** Slot for PromoCode. */
  promo?: ReactNode;
  /** Primary action, e.g. <Button fullWidth>Checkout</Button>. */
  actions?: ReactNode;
  /** @deprecated Use actions. Removed in 2.0.0. */
  action?: ReactNode;
  /** Slot above the rows, e.g. read-only CartItems in checkout (order summary). */
  children?: ReactNode;
  currency?: string;
  /** Locale for the amounts, for example `nl-NL`. Default: the LocaleProvider, else en-US. */
  locale?: string;
  labels?: Partial<CartSummaryLabels>;
}

/** Totals block for cart and checkout. Use children for the order summary in checkout. */
export function CartSummary({ title: titleProp, subtotal, lines = [], total, totalNote: totalNoteProp, promo, actions, action, children, currency = 'EUR', locale: localeProp, labels, className, ...rest }: CartSummaryProps) {
  const locale = useLocale(localeProp);
  const totalNote = useText('cartSummary.totalNote', totalNoteProp);
  const title = useText('cartSummary.title', titleProp);
  const l = useLabels('cartSummary', DEFAULT_CART_SUMMARY_LABELS, labels);
  const id = useId();
  return (
    <section className={cx('rb-cart-summary', className)} aria-labelledby={id} {...rest}>
      <h2 id={id} className="rb-cart-summary__title">{title}</h2>
      {children && <div className="rb-cart-summary__items">{children}</div>}
      <dl className="rb-cart-summary__rows">
        <div className="rb-cart-summary__row"><dt>{l.subtotal}</dt><dd>{formatMoney(subtotal, currency, locale)}</dd></div>
        {lines.map((l, i) => (
          <div key={i} className={cx('rb-cart-summary__row', l.amount < 0 && 'is-discount')}>
            <dt>{l.label}</dt>
            <dd>{l.note ?? (l.amount < 0 ? `− ${formatMoney(-l.amount, currency, locale)}` : formatMoney(l.amount, currency, locale))}</dd>
          </div>
        ))}
        <div className="rb-cart-summary__row rb-cart-summary__row--total"><dt>{l.total}</dt><dd>{formatMoney(total, currency, locale)}</dd></div>
      </dl>
      {totalNote && <p className="rb-cart-summary__note">{totalNote}</p>}
      {promo}
      {actions ?? action}
    </section>
  );
}

/* ---------- Promo code ---------- */
export interface PromoCodeLabels { empty: string; remove: (code: string) => string; apply: string }
export const DEFAULT_PROMO_CODE_LABELS: PromoCodeLabels = { empty: 'Enter a discount code.', remove: (code) => `Remove discount code ${code}`, apply: 'Apply' };
export interface PromoCodeProps {
  /** Return an error message to show, or nothing when the code is accepted. */
  onApply: (code: string) => string | void | Promise<string | void>;
  applied?: string | null;
  onRemove?: () => void;
  label?: string;
  className?: string;
  labels?: Partial<PromoCodeLabels>;
  /** @deprecated Use labels.apply. Removed in 2.0.0. */
  buttonLabel?: string;
}

/** Discount code field. After applying, the code is shown as a removable Tag. */
export function PromoCode({ onApply, applied, onRemove, label: labelProp, buttonLabel, labels, className }: PromoCodeProps) {
  const label = useText('promoCode.label', labelProp);
  const l = useLabels('promoCode', DEFAULT_PROMO_CODE_LABELS, labels, { apply: buttonLabel });
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) { setError(l.empty); return; }
    setBusy(true);
    const res = await onApply(code.trim());
    setBusy(false);
    if (res) setError(res); else { setError(undefined); setCode(''); }
  };
  return (
    <div className={cx('rb-promo', className)}>
      {applied ? (
        <div className="rb-promo__applied" role="status">
          <span>{label}:</span>
          <Tag onRemove={onRemove} labels={{ remove: () => l.remove(applied) }}>{applied}</Tag>
        </div>
      ) : (
        <form className="rb-promo__form" onSubmit={submit} noValidate>
          <Input label={label} size="sm" value={code} onChange={(e) => { setCode(e.target.value); setError(undefined); }} error={error} autoComplete="off" />
          <Button type="submit" hierarchy="secondary" size="sm" loading={busy}>{l.apply}</Button>
        </form>
      )}
    </div>
  );
}

/* ---------- Cart button (header) ---------- */
export interface CartButtonProps { count: number; onClick?: () => void; label?: string; labels?: Partial<CartButtonLabels>; className?: string }
export interface CartButtonLabels { count: (count: number) => string }
export const DEFAULT_CART_BUTTON_LABELS: CartButtonLabels = { count: (count) => `${count} ${count === 1 ? 'item' : 'items'}` };
/** Header button with item count. The count is part of the accessible name. */
export function CartButton({ count, onClick, label: labelProp, labels, className }: CartButtonProps) {
  const label = useText('cartButton.label', labelProp);
  const l = useLabels('cartButton', DEFAULT_CART_BUTTON_LABELS, labels);
  return (
    <span className={cx('rb-cart-button', className)}>
      <ButtonIcon hierarchy="tertiary" icon={<ShoppingBag />} aria-label={`${label}, ${l.count(count)}`} onClick={onClick} />
      {count > 0 && <span className="rb-cart-button__count" aria-hidden="true">{count > 99 ? '99+' : count}</span>}
    </span>
  );
}

/* ---------- Mini cart ---------- */
export interface MiniCartProps {
  open: boolean;
  onClose: () => void;
  /** CartItems (size sm). Empty → empty state. */
  children?: ReactNode;
  itemCount: number;
  subtotal: number;
  currency?: string;
  /** Locale for the amounts, for example `nl-NL`. Default: the LocaleProvider, else en-US. */
  locale?: string;
  onCheckout?: () => void;
  cartHref?: string;
  /** Extra line in the footer, e.g. "€12.05 to go for free shipping". */
  note?: ReactNode;
  labels?: Partial<MiniCartLabels>;
}
export interface MiniCartLabels { title: (count: number) => string; subtotal: string; checkout: string; viewCart: string; emptyTitle: string; emptyText: string; continueShopping: string }
export const DEFAULT_MINI_CART_LABELS: MiniCartLabels = {
  title: (count) => `Cart (${count})`, subtotal: 'Subtotal', checkout: 'Checkout', viewCart: 'View cart',
  emptyTitle: 'Your cart is empty', emptyText: 'Browse the shop and add something.', continueShopping: 'Continue shopping',
};

/** Cart in a Slideout: opens from the header after "Add to cart" or a click on the CartButton. */
export function MiniCart({ open, onClose, children, itemCount, subtotal, currency = 'EUR', locale: localeProp, onCheckout, cartHref = '#', note, labels }: MiniCartProps) {
  const locale = useLocale(localeProp);
  const l = useLabels('miniCart', DEFAULT_MINI_CART_LABELS, labels);
  const empty = itemCount === 0;
  return (
    <Slideout
      open={open}
      onClose={onClose}
      size="sm"
      title={l.title(itemCount)}
      footer={empty ? undefined : (
        <div className="rb-mini-cart__footer">
          <div className="rb-mini-cart__totals">
            {note && <p className="rb-mini-cart__note">{note}</p>}
            <div className="rb-cart-summary__row rb-cart-summary__row--total"><span>{l.subtotal}</span><span>{formatMoney(subtotal, currency, locale)}</span></div>
          </div>
          <Button fullWidth onClick={onCheckout}>{l.checkout}</Button>
          <Button fullWidth hierarchy="secondary" onClick={() => { window.location.href = cartHref; }}>{l.viewCart}</Button>
        </div>
      )}
    >
      {empty ? (
        <EmptyState icon={<ShoppingBag />} title={l.emptyTitle} description={l.emptyText} actions={<Button hierarchy="secondary" onClick={onClose}>{l.continueShopping}</Button>} />
      ) : (
        <div className="rb-mini-cart__items">{children}</div>
      )}
    </Slideout>
  );
}
