import type { HTMLAttributes, ReactNode } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Button, ButtonIcon } from '../Button/Button';
import { Price, Rating, StockIndicator, type StockStatus } from './Basics';
import './Commerce.css';

export interface ProductCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: string;
  /** Product page. The title link makes the whole card clickable (one tab stop). */
  href: string;
  image?: { src: string; alt?: string };
  /** Small line above the title, e.g. the brand. */
  meta?: ReactNode;
  price: number;
  compareAt?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  /** Top-left label, usually a Badge ("Sale", "Nieuw"). */
  badge?: ReactNode;
  /** Available colors as CSS colors; shown as dots (decorative, the count is announced). */
  swatches?: string[];
  stock?: StockStatus;
  wishlisted?: boolean;
  onToggleWishlist?: () => void;
  onAddToCart?: () => void;
  addToCartLabel?: string;
  layout?: 'vertical' | 'horizontal';
}

/** Product tile for grids and carousels. */
export function ProductCard({
  title, href, image, meta, price, compareAt, currency, rating, reviewCount, badge, swatches, stock,
  wishlisted, onToggleWishlist, onAddToCart, addToCartLabel = 'In winkelwagen', layout = 'vertical', className, ...rest
}: ProductCardProps) {
  const shown = swatches?.slice(0, 4) ?? [];
  return (
    <article className={cx('rb-product-card', `rb-product-card--${layout}`, stock === 'out' && 'rb-product-card--out', className)} {...rest}>
      <div className="rb-product-card__media">
        {image ? <img src={image.src} alt={image.alt ?? ''} loading="lazy" /> : <span className="rb-product-card__placeholder" />}
        {badge && <span className="rb-product-card__badge">{badge}</span>}
        {onToggleWishlist && (
          <ButtonIcon
            className="rb-product-card__wish"
            hierarchy="secondary"
            size="sm"
            icon={<Heart fill={wishlisted ? 'currentColor' : 'none'} />}
            aria-label={`Bewaar ${title} in verlanglijst`}
            aria-pressed={!!wishlisted}
            onClick={onToggleWishlist}
          />
        )}
      </div>
      <div className="rb-product-card__body">
        {meta && <p className="rb-product-card__meta">{meta}</p>}
        <h3 className="rb-product-card__title"><a href={href}>{title}</a></h3>
        {rating !== undefined && <Rating value={rating} count={reviewCount} size="sm" />}
        {shown.length > 0 && (
          <p className="rb-product-card__swatches">
            {shown.map((c) => <span key={c} className="rb-product-card__swatch" style={{ background: c }} aria-hidden="true" />)}
            {swatches!.length > shown.length && <span aria-hidden="true">+{swatches!.length - shown.length}</span>}
            <span className="rb-visually-hidden">{swatches!.length} kleuren</span>
          </p>
        )}
        <div className="rb-product-card__footer">
          <Price amount={price} compareAt={compareAt} currency={currency} size="md" />
          {stock && stock !== 'in-stock' && <StockIndicator status={stock} />}
        </div>
        {onAddToCart && (
          <Button className="rb-product-card__cta" hierarchy="secondary" size="sm" iconLeading={<ShoppingCart />} disabled={stock === 'out'} onClick={onAddToCart} aria-label={`${addToCartLabel}: ${title}`}>
            {addToCartLabel}
          </Button>
        )}
      </div>
    </article>
  );
}

/* ---------- Product grid ---------- */
export interface ProductGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Minimum card width; the grid fills the row with as many columns as fit. */
  minItemWidth?: number;
  children: ReactNode;
}
/** Responsive list of ProductCards. Renders a list, so screen readers announce the number of products. */
export function ProductGrid({ minItemWidth = 220, className, children, style, ...rest }: ProductGridProps) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <div className={cx('rb-product-grid', className)} style={{ ['--_min' as string]: `${minItemWidth}px`, ...style }} {...rest}>
      <ul className="rb-product-grid__list">{items.map((c, i) => <li key={i}>{c}</li>)}</ul>
    </div>
  );
}
