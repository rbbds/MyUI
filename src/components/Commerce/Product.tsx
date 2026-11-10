import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Truck } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Button, ButtonIcon } from '../Button/Button';
import { QuantityStepper, StockIndicator, type StockStatus } from './Basics';
import './Commerce.css';

/* ---------- Product gallery ---------- */
export interface GalleryImage { src: string; alt: string; thumb?: string }
export interface ProductGalleryProps {
  images: GalleryImage[];
  /** Accessible name of the gallery, usually the product name. */
  label: string;
  className?: string;
}

/** Main image with thumbnails. Arrows and thumbnails both switch; arrow keys work on the thumbnails. */
export function ProductGallery({ images, label, className }: ProductGalleryProps) {
  const [i, setI] = useState(0);
  const thumbs = useRef<HTMLDivElement>(null);
  const n = images.length;
  const go = (k: number, focus = false) => {
    const next = (k + n) % n;
    setI(next);
    if (focus) thumbs.current?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();
  };
  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowLeft: i - 1, ArrowRight: i + 1, Home: 0, End: n - 1 };
    if (e.key in map) { e.preventDefault(); go(map[e.key], true); }
  };
  if (!n) return null;
  return (
    <section className={cx('rb-gallery', className)} aria-label={`Images ${label}`} aria-roledescription="carousel">
      <div className="rb-gallery__stage">
        <img src={images[i].src} alt={images[i].alt} />
        {n > 1 && (
          <>
            <ButtonIcon className="rb-gallery__nav rb-gallery__nav--prev" hierarchy="secondary" size="sm" icon={<ChevronLeft />} aria-label="Previous image" onClick={() => go(i - 1)} />
            <ButtonIcon className="rb-gallery__nav rb-gallery__nav--next" hierarchy="secondary" size="sm" icon={<ChevronRight />} aria-label="Next image" onClick={() => go(i + 1)} />
            <p className="rb-gallery__counter" aria-live="polite">{i + 1} / {n}</p>
          </>
        )}
      </div>
      {n > 1 && (
        <div ref={thumbs} className="rb-gallery__thumbs" onKeyDown={onKey}>
          {images.map((img, k) => (
            <button key={k} type="button" className="rb-gallery__thumb" aria-current={k === i || undefined} aria-label={`Image ${k + 1} of ${n}: ${img.alt}`} tabIndex={k === i ? 0 : -1} onClick={() => go(k)}>
              <img src={img.thumb ?? img.src} alt="" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------- Variant picker ---------- */
export interface VariantOption {
  value: string;
  label: string;
  /** CSS color for type="color". */
  color?: string;
  /** Not available in this combination: still visible, crossed out, not selectable. */
  unavailable?: boolean;
}
export interface VariantPickerProps {
  /** Group label, e.g. "Color" or "Size". */
  label: string;
  type?: 'color' | 'size';
  options: VariantOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  /** Link or button next to the label, e.g. "Size guide". */
  aside?: ReactNode;
  error?: string;
  className?: string;
}

/** Color swatches or size chips. A native radio group, so arrow keys and screen readers work out of the box. */
export function VariantPicker({ label, type = 'size', options, value, defaultValue, onChange, name, aside, error, className }: VariantPickerProps) {
  const [own, setOwn] = useState(defaultValue);
  const v = value ?? own;
  const auto = useId();
  const current = options.find((o) => o.value === v);
  return (
    <fieldset className={cx('rb-variant', `rb-variant--${type}`, className)} aria-describedby={error ? `${auto}-e` : undefined}>
      <div className="rb-variant__head">
        <legend className="rb-variant__legend">
          {label}{type === 'color' && current ? <span className="rb-variant__current">: {current.label}</span> : null}
        </legend>
        {aside}
      </div>
      <div className="rb-variant__options">
        {options.map((o) => (
          <label key={o.value} className={cx('rb-variant__option', o.unavailable && 'is-unavailable')} title={type === 'color' ? o.label : undefined}>
            <input
              type="radio"
              className="rb-variant__input"
              name={name ?? auto}
              value={o.value}
              checked={v === o.value}
              disabled={o.unavailable}
              onChange={() => { if (value === undefined) setOwn(o.value); onChange?.(o.value); }}
            />
            {type === 'color' ? (
              <span className="rb-variant__swatch" style={{ ['--_c' as string]: o.color }}>
                <span className="rb-visually-hidden">{o.label}{o.unavailable ? ', not available' : ''}</span>
              </span>
            ) : (
              <span className="rb-variant__chip">{o.label}{o.unavailable && <span className="rb-visually-hidden">, not available</span>}</span>
            )}
          </label>
        ))}
      </div>
      {error && <p id={`${auto}-e`} className="rb-variant__error">{error}</p>}
    </fieldset>
  );
}

/* ---------- Add to cart ---------- */
export interface AddToCartProps {
  onAdd: (quantity: number) => void;
  stock?: StockStatus;
  /** Override for the stock text, e.g. "Only 3 left". */
  stockText?: ReactNode;
  /** Delivery promise, e.g. "Order before 22:00, delivered tomorrow". */
  delivery?: ReactNode;
  maxQuantity?: number;
  label?: string;
  productName?: string;
  /** Extra actions next to the button, e.g. a wishlist ButtonIcon. */
  aside?: ReactNode;
  loading?: boolean;
  className?: string;
}

/** Purchase block on the product page: stock, quantity, add-to-cart button and delivery promise. */
export function AddToCart({ onAdd, stock = 'in-stock', stockText, delivery, maxQuantity = 10, label = 'Add to cart', productName, aside, loading, className }: AddToCartProps) {
  const [q, setQ] = useState(1);
  const out = stock === 'out';
  return (
    <div className={cx('rb-add-to-cart', className)}>
      <StockIndicator status={stock}>{stockText}</StockIndicator>
      <div className="rb-add-to-cart__row">
        <QuantityStepper value={q} onChange={setQ} max={maxQuantity} disabled={out} label={productName ? `Quantity ${productName}` : 'Quantity'} />
        <Button className="rb-add-to-cart__button" iconLeading={<ShoppingCart />} disabled={out} loading={loading} onClick={() => onAdd(q)}>
          {out ? 'Sold out' : label}
        </Button>
        {aside}
      </div>
      {delivery && !out && <p className="rb-add-to-cart__delivery"><Truck aria-hidden="true" />{delivery}</p>}
    </div>
  );
}
