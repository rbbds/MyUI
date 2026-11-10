import { useId, useState, type FormEvent, type HTMLAttributes, type ReactNode } from 'react';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { cx } from '../../utils/cx';
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
  maxQuantity?: number;
  onQuantityChange?: (q: number) => void;
  onRemove?: () => void;
  /** Read-only version for the order summary in checkout. */
  readOnly?: boolean;
  size?: 'sm' | 'md';
  currency?: string;
}

/** Product line in the cart, mini cart or order summary. */
export function CartItem({ title, href, image, options, price, compareAt, quantity, maxQuantity = 99, onQuantityChange, onRemove, readOnly, size = 'md', currency, className, ...rest }: CartItemProps) {
  return (
    <div className={cx('rb-cart-item', `rb-cart-item--${size}`, className)} {...rest}>
      <div className="rb-cart-item__media">{image ? <img src={image.src} alt={image.alt ?? ''} /> : <span className="rb-product-card__placeholder" />}</div>
      <div className="rb-cart-item__main">
        <div className="rb-cart-item__text">
          <p className="rb-cart-item__title">{href ? <a href={href}>{title}</a> : title}</p>
          {options && options.length > 0 && <p className="rb-cart-item__options">{options.join(' · ')}</p>}
          {readOnly && <p className="rb-cart-item__options">Aantal: {quantity}</p>}
        </div>
        {!readOnly && (
          <div className="rb-cart-item__actions">
            <QuantityStepper size="sm" value={quantity} max={maxQuantity} onChange={onQuantityChange} label={`Quantity ${title}`} />
            {onRemove && <ButtonIcon hierarchy="tertiary" size="sm" icon={<Trash2 />} aria-label={`Remove ${title}`} onClick={onRemove} />}
          </div>
        )}
      </div>
      <Price className="rb-cart-item__price" amount={price * quantity} compareAt={compareAt ? compareAt * quantity : undefined} currency={currency} size="sm" />
    </div>
  );
}

/* ---------- Cart summary ---------- */
export interface SummaryLine { label: ReactNode; amount: number; /** Shown instead of the amount, e.g. "Free". */ note?: string }
export interface CartSummaryProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  subtotal: number;
  /** Shipping, payment fee, … Negative amounts are discounts. */
  lines?: SummaryLine[];
  total: number;
  /** Small text under the total, e.g. "Inclusief btw". */
  totalNote?: ReactNode;
  /** Slot for PromoCode. */
  promo?: ReactNode;
  /** Primary action, e.g. <Button fullWidth>Checkout</Button>. */
  action?: ReactNode;
  /** Slot above the rows, e.g. read-only CartItems in checkout (order summary). */
  children?: ReactNode;
  currency?: string;
}

/** Totals block for cart and checkout. Use children for the order summary in checkout. */
export function CartSummary({ title = 'Summary', subtotal, lines = [], total, totalNote = 'Including VAT', promo, action, children, currency = 'EUR', className, ...rest }: CartSummaryProps) {
  const id = useId();
  return (
    <section className={cx('rb-cart-summary', className)} aria-labelledby={id} {...rest}>
      <h2 id={id} className="rb-cart-summary__title">{title}</h2>
      {children && <div className="rb-cart-summary__items">{children}</div>}
      <dl className="rb-cart-summary__rows">
        <div className="rb-cart-summary__row"><dt>Subtotal</dt><dd>{formatMoney(subtotal, currency)}</dd></div>
        {lines.map((l, i) => (
          <div key={i} className={cx('rb-cart-summary__row', l.amount < 0 && 'is-discount')}>
            <dt>{l.label}</dt>
            <dd>{l.note ?? (l.amount < 0 ? `− ${formatMoney(-l.amount, currency)}` : formatMoney(l.amount, currency))}</dd>
          </div>
        ))}
        <div className="rb-cart-summary__row rb-cart-summary__row--total"><dt>Total</dt><dd>{formatMoney(total, currency)}</dd></div>
      </dl>
      {totalNote && <p className="rb-cart-summary__note">{totalNote}</p>}
      {promo}
      {action}
    </section>
  );
}

/* ---------- Promo code ---------- */
export interface PromoCodeProps {
  /** Return an error message to show, or nothing when the code is accepted. */
  onApply: (code: string) => string | void | Promise<string | void>;
  applied?: string | null;
  onRemove?: () => void;
  label?: string;
  buttonLabel?: string;
  className?: string;
}

/** Discount code field. After applying, the code is shown as a removable Tag. */
export function PromoCode({ onApply, applied, onRemove, label = 'Discount code', buttonLabel = 'Apply', className }: PromoCodeProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) { setError('Enter a discount code.'); return; }
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
          <Tag onRemove={onRemove} removeLabel={`Remove discount code ${applied}`}>{applied}</Tag>
        </div>
      ) : (
        <form className="rb-promo__form" onSubmit={submit} noValidate>
          <Input label={label} size="sm" value={code} onChange={(e) => { setCode(e.target.value); setError(undefined); }} error={error} autoComplete="off" />
          <Button type="submit" hierarchy="secondary" size="sm" loading={busy}>{buttonLabel}</Button>
        </form>
      )}
    </div>
  );
}

/* ---------- Cart button (header) ---------- */
export interface CartButtonProps { count: number; onClick?: () => void; label?: string; className?: string }
/** Header button with item count. The count is part of the accessible name. */
export function CartButton({ count, onClick, label = 'Cart', className }: CartButtonProps) {
  return (
    <span className={cx('rb-cart-button', className)}>
      <ButtonIcon hierarchy="tertiary" icon={<ShoppingBag />} aria-label={`${label}, ${count} ${count === 1 ? 'artikel' : 'artikelen'}`} onClick={onClick} />
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
  onCheckout?: () => void;
  cartHref?: string;
  /** Extra line in the footer, e.g. "€12.05 to go for free shipping". */
  note?: ReactNode;
}

/** Cart in a Slideout: opens from the header after "In winkelwagen" or a click on the CartButton. */
export function MiniCart({ open, onClose, children, itemCount, subtotal, currency = 'EUR', onCheckout, cartHref = '#', note }: MiniCartProps) {
  const empty = itemCount === 0;
  return (
    <Slideout
      open={open}
      onClose={onClose}
      size="sm"
      title={`Winkelwagen (${itemCount})`}
      footer={empty ? undefined : (
        <div className="rb-mini-cart__footer">
          {note && <p className="rb-mini-cart__note">{note}</p>}
          <div className="rb-cart-summary__row rb-cart-summary__row--total"><span>Subtotal</span><span>{formatMoney(subtotal, currency)}</span></div>
          <Button fullWidth onClick={onCheckout}>Checkout</Button>
          <Button fullWidth hierarchy="secondary" onClick={() => { window.location.href = cartHref; }}>View cart</Button>
        </div>
      )}
    >
      {empty ? (
        <EmptyState icon={<ShoppingBag />} title="Your cart is empty" description="Browse the shop and add something." actions={<Button hierarchy="secondary" onClick={onClose}>Continue shopping</Button>} />
      ) : (
        <div className="rb-mini-cart__items">{children}</div>
      )}
    </Slideout>
  );
}
