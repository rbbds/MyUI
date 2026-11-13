import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Truck } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Button, ButtonIcon } from '../Button/Button';
import { QuantityStepper, StockIndicator, type StockStatus } from './Basics';
import './Commerce.css';

/* ---------- Product gallery ---------- */
export interface GalleryImage { src: string; alt: string; thumb?: string }
export interface ProductGalleryLabels { gallery: (label: string) => string; roleDescription: string; previous: string; next: string; image: (index: number, total: number, alt: string) => string }
export const DEFAULT_PRODUCT_GALLERY_LABELS: ProductGalleryLabels = {
  gallery: (label) => `Images ${label}`, roleDescription: 'carousel', previous: 'Previous image', next: 'Next image',
  image: (index, total, alt) => `Image ${index} of ${total}: ${alt}`,
};
export interface ProductGalleryProps {
  images: GalleryImage[];
  /** Accessible name of the gallery, usually the product name. */
  label: string;
  className?: string;
  labels?: Partial<ProductGalleryLabels>;
}

/** Main image with thumbnails. Arrows and thumbnails both switch; arrow keys work on the thumbnails. */
export function ProductGallery({ images, label, labels, className }: ProductGalleryProps) {
  const l = { ...DEFAULT_PRODUCT_GALLERY_LABELS, ...labels };
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
    <section className={cx('rb-gallery', className)} aria-label={l.gallery(label)} aria-roledescription={l.roleDescription}>
      <div className="rb-gallery__stage">
        <img src={images[i].src} alt={images[i].alt} />
        {n > 1 && (
          <>
            <ButtonIcon className="rb-gallery__nav rb-gallery__nav--prev" hierarchy="secondary" size="sm" icon={<ChevronLeft />} aria-label={l.previous} onClick={() => go(i - 1)} />
            <ButtonIcon className="rb-gallery__nav rb-gallery__nav--next" hierarchy="secondary" size="sm" icon={<ChevronRight />} aria-label={l.next} onClick={() => go(i + 1)} />
            <p className="rb-gallery__counter" aria-live="polite">{i + 1} / {n}</p>
          </>
        )}
      </div>
      {n > 1 && (
        <div ref={thumbs} className="rb-gallery__thumbs" onKeyDown={onKey}>
          {images.map((img, k) => (
            <button key={k} type="button" className="rb-gallery__thumb" aria-current={k === i || undefined} aria-label={l.image(k + 1, n, img.alt)} tabIndex={k === i ? 0 : -1} onClick={() => go(k)}>
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
export interface VariantPickerLabels { unavailable: string }
export const DEFAULT_VARIANT_PICKER_LABELS: VariantPickerLabels = { unavailable: ', not available' };
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
  labels?: Partial<VariantPickerLabels>;
}

/** Color swatches or size chips. A native radio group, so arrow keys and screen readers work out of the box. */
export function VariantPicker({ label, type = 'size', options, value, defaultValue, onChange, name, aside, error, labels, className }: VariantPickerProps) {
  const l = { ...DEFAULT_VARIANT_PICKER_LABELS, ...labels };
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
                <span className="rb-visually-hidden">{o.label}{o.unavailable ? l.unavailable : ''}</span>
              </span>
            ) : (
              <span className="rb-variant__chip">{o.label}{o.unavailable && <span className="rb-visually-hidden">{l.unavailable}</span>}</span>
            )}
          </label>
        ))}
      </div>
      {error && <p id={`${auto}-e`} className="rb-variant__error">{error}</p>}
    </fieldset>
  );
}

/* ---------- Add to cart ---------- */
export interface AddToCartLabels { quantity: string; quantityOf: (productName: string) => string; soldOut: string }
export const DEFAULT_ADD_TO_CART_LABELS: AddToCartLabels = { quantity: 'Quantity', quantityOf: (productName) => `Quantity ${productName}`, soldOut: 'Sold out' };
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
  /** Button style. Accent (default) makes the buy action stand out from the brand color. */
  hierarchy?: 'accent' | 'primary';
  className?: string;
  labels?: Partial<AddToCartLabels>;
}

/** Purchase block on the product page: stock, quantity, add-to-cart button and delivery promise. */
export function AddToCart({ onAdd, stock = 'in-stock', stockText, delivery, maxQuantity = 10, label = 'Add to cart', productName, aside, loading, hierarchy = 'accent', labels, className }: AddToCartProps) {
  const l = { ...DEFAULT_ADD_TO_CART_LABELS, ...labels };
  const [q, setQ] = useState(1);
  const out = stock === 'out';
  return (
    <div className={cx('rb-add-to-cart', className)}>
      <StockIndicator status={stock}>{stockText}</StockIndicator>
      <div className="rb-add-to-cart__row">
        <QuantityStepper value={q} onChange={setQ} max={maxQuantity} disabled={out} label={productName ? l.quantityOf(productName) : l.quantity} />
        <Button className="rb-add-to-cart__button" hierarchy={hierarchy} iconLeading={<ShoppingCart />} disabled={out} loading={loading} onClick={() => onAdd(q)}>
          {out ? l.soldOut : label}
        </Button>
        {aside}
      </div>
      {delivery && !out && <p className="rb-add-to-cart__delivery"><Truck aria-hidden="true" />{delivery}</p>}
    </div>
  );
}
