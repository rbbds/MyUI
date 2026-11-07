import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Heart, Search } from 'lucide-react';
import { Badge } from '../Display/Display';
import { Button, ButtonIcon } from '../Button/Button';
import { Select } from '../Form/Select';
import { RangeSlider } from '../Form/RangeSlider';
import { SelectionCard, SelectionCardGroup } from '../Selection/SelectionCard';
import { Checkbox } from '../Selection/Checkbox';
import { Header } from '../Navigation/AppShell';
import { Breadcrumbs, Pagination } from '../Navigation/Navigation';
import { Stepper } from '../Navigation/Stepper';
import { Accordion } from '../Content/Content';
import { Price, Rating, QuantityStepper, StockIndicator, formatMoney } from './Basics';
import { ProductCard, ProductGrid } from './ProductCard';
import { CartItem, CartSummary, PromoCode, CartButton, MiniCart } from './Cart';
import { ProductGallery, VariantPicker, AddToCart } from './Product';
import { FilterGroup, ActiveFilters } from './Filters';
import { AddressFields } from './Checkout';
import { img, products } from './demo-data';

const meta: Meta = { title: 'E-commerce/Cases', parameters: { layout: 'padded' } };
export default meta;
type Story = StoryObj;

const grid = (min = 220): React.CSSProperties => ({ display: 'grid', gridTemplateColumns: `repeat(auto-fill,minmax(${min}px,1fr))`, gap: 24, alignItems: 'start' });
const col: React.CSSProperties = { display: 'grid', gap: 16, maxWidth: 420 };

/* ---------- Product card ---------- */
export const ProductCards: Story = {
  render: () => {
    const [wish, setWish] = useState<string[]>(['mok']);
    return (
      <div style={grid(240)}>
        {products.slice(0, 3).map((p) => (
          <ProductCard key={p.id} href="#" title={p.title} meta={p.meta} price={p.price} compareAt={p.compareAt} rating={p.rating} reviewCount={p.reviewCount} image={{ src: p.image, alt: '' }} swatches={p.swatches}
            badge={p.badge && <Badge color={p.badge === 'Sale' ? 'error' : 'brand'} size="sm">{p.badge}</Badge>}
            wishlisted={wish.includes(p.id)} onToggleWishlist={() => setWish((w) => (w.includes(p.id) ? w.filter((x) => x !== p.id) : [...w, p.id]))}
            onAddToCart={() => undefined} />
        ))}
      </div>
    );
  },
};
export const ProductCardHorizontal: Story = {
  render: () => <div style={{ maxWidth: 520 }}><ProductCard layout="horizontal" href="#" title={products[3].title} meta={products[3].meta} price={products[3].price} rating={products[3].rating} reviewCount={products[3].reviewCount} image={{ src: products[3].image }} stock="low" /></div>,
};
export const ProductCardSoldOut: Story = {
  render: () => <div style={{ maxWidth: 280 }}><ProductCard href="#" title={products[5].title} meta={products[5].meta} price={products[5].price} image={{ src: products[5].image }} stock="out" onAddToCart={() => undefined} /></div>,
};
export const ProductGridExample: Story = {
  render: () => (
    <ProductGrid aria-label="Producten">
      {products.map((p) => <ProductCard key={p.id} href="#" title={p.title} meta={p.meta} price={p.price} compareAt={p.compareAt} rating={p.rating} reviewCount={p.reviewCount} image={{ src: p.image }} stock={p.stock} badge={p.badge && <Badge color={p.badge === 'Sale' ? 'error' : 'brand'} size="sm">{p.badge}</Badge>} />)}
    </ProductGrid>
  ),
};

/* ---------- Basics ---------- */
export const Prices: Story = {
  render: () => (
    <div style={col}>
      <Price amount={14.5} size="sm" />
      <Price amount={79.95} compareAt={99.95} />
      <Price amount={129} size="lg" suffix="incl. btw" />
      <Price amount={9.99} suffix="per maand" />
    </div>
  ),
};
export const Ratings: Story = {
  render: () => (
    <div style={col}>
      <Rating value={4.5} count={128} />
      <Rating value={3} size="sm" count={12} />
      <Rating value={4.8} showValue count={64} />
    </div>
  ),
};
export const QuantitySteppers: Story = {
  render: () => {
    const [q, setQ] = useState(2);
    return (
      <div style={col}>
        <QuantityStepper value={q} onChange={setQ} max={5} label="Aantal mokken" />
        <span>Aantal: {q} (max 5)</span>
        <QuantityStepper size="sm" defaultValue={1} label="Aantal klein" />
        <QuantityStepper disabled defaultValue={1} label="Aantal uitgeschakeld" />
      </div>
    );
  },
};
export const StockStatuses: Story = {
  render: () => (
    <div style={col}>
      <StockIndicator status="in-stock" />
      <StockIndicator status="low">Nog 3 op voorraad</StockIndicator>
      <StockIndicator status="out" />
      <StockIndicator status="preorder">Pre-order, levering vanaf 1 december</StockIndicator>
    </div>
  ),
};

/* ---------- Cart ---------- */
const cartLines = [
  { id: 'trui', title: products[0].title, image: { src: products[0].image }, options: ['Kleur: blauw', 'Maat: M'], price: 79.95, compareAt: 99.95, quantity: 1 },
  { id: 'mok', title: products[1].title, image: { src: products[1].image }, options: ['Kleur: terracotta'], price: 14.5, quantity: 2 },
];
export const CartItems: Story = {
  render: () => {
    const [lines, setLines] = useState(cartLines);
    return (
      <div style={{ display: 'grid', gap: 24, maxWidth: 640 }}>
        {lines.map((l) => (
          <CartItem key={l.id} href="#" {...l} onQuantityChange={(q) => setLines((ls) => ls.map((x) => (x.id === l.id ? { ...x, quantity: q } : x)))} onRemove={() => setLines((ls) => ls.filter((x) => x.id !== l.id))} />
        ))}
        {lines.length === 0 && <p>Alle artikelen verwijderd.</p>}
        <hr />
        <CartItem size="sm" readOnly {...cartLines[1]} />
      </div>
    );
  },
};
export const CartSummaryExample: Story = {
  render: () => {
    const [code, setCode] = useState<string | null>(null);
    const discount = code ? -10.9 : 0;
    return (
      <div style={{ maxWidth: 380 }}>
        <CartSummary subtotal={108.95} lines={[{ label: 'Verzending', amount: 0, note: 'Gratis' }, ...(code ? [{ label: `Korting (${code})`, amount: discount }] : [])]} total={108.95 + discount}
          promo={<PromoCode applied={code} onRemove={() => setCode(null)} onApply={(c) => (c.toUpperCase() === 'WELKOM10' ? void setCode('WELKOM10') : 'Deze code kennen we niet. Probeer WELKOM10.')} />}
          action={<Button fullWidth>Afrekenen</Button>} />
      </div>
    );
  },
};
export const OrderSummary: Story = {
  render: () => (
    <div style={{ maxWidth: 380 }}>
      <CartSummary title="Je bestelling" subtotal={108.95} lines={[{ label: 'Verzending', amount: 4.95 }, { label: 'Korting', amount: -10.9 }]} total={102.99}>
        {cartLines.map((l) => <CartItem key={l.id} size="sm" readOnly {...l} />)}
      </CartSummary>
    </div>
  ),
};
export const PromoCodeExample: Story = {
  render: () => {
    const [code, setCode] = useState<string | null>(null);
    return <div style={{ maxWidth: 380 }}><PromoCode applied={code} onRemove={() => setCode(null)} onApply={async (c) => { await new Promise((r) => setTimeout(r, 600)); return c.toUpperCase() === 'WELKOM10' ? void setCode('WELKOM10') : 'Deze code kennen we niet.'; }} /><p style={{ fontSize: 13 }}>Probeer WELKOM10.</p></div>;
  },
};
export const MiniCartExample: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [lines, setLines] = useState(cartLines);
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const sub = lines.reduce((n, l) => n + l.price * l.quantity, 0);
    return (
      <>
        <Header logo={<strong>Winkel</strong>} links={[{ label: 'Nieuw', href: '#' }, { label: 'Wonen', href: '#' }]} actions={<CartButton count={count} onClick={() => setOpen(true)} />} />
        <MiniCart open={open} onClose={() => setOpen(false)} itemCount={count} subtotal={sub} note={sub < 50 ? `Nog ${formatMoney(50 - sub)} tot gratis verzending` : 'Je bestelling wordt gratis verzonden'}>
          {lines.map((l) => <CartItem key={l.id} size="sm" {...l} onQuantityChange={(q) => setLines((ls) => ls.map((x) => (x.id === l.id ? { ...x, quantity: q } : x)))} onRemove={() => setLines((ls) => ls.filter((x) => x.id !== l.id))} />)}
        </MiniCart>
      </>
    );
  },
};

/* ---------- Product page parts ---------- */
const galleryImages = [
  { src: img('sweater', '#eef2f7', '#3b5b8c'), alt: 'Trui, voorkant' },
  { src: img('sweater', '#e5ebf3', '#2c4770'), alt: 'Trui, achterkant' },
  { src: img('sweater', '#f3efe8', '#3b5b8c'), alt: 'Trui, detail van de stof' },
  { src: img('sweater', '#e9eef0', '#3b5b8c'), alt: 'Trui, gedragen' },
];
export const Gallery: Story = { render: () => <div style={{ maxWidth: 480 }}><ProductGallery label="Wollen trui" images={galleryImages} /></div> };
const colors = [
  { value: 'blauw', label: 'Blauw', color: '#3b5b8c' }, { value: 'rood', label: 'Roestrood', color: '#b5473a' },
  { value: 'creme', label: 'Crème', color: '#e6dccb' }, { value: 'zwart', label: 'Zwart', color: '#2f2f2f', unavailable: true },
];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => ({ value: s, label: s, unavailable: s === 'XS' || s === 'XXL' }));
export const VariantPickers: Story = {
  render: () => (
    <div style={col}>
      <VariantPicker type="color" label="Kleur" options={colors} defaultValue="blauw" />
      <VariantPicker label="Maat" options={sizes} aside={<Button hierarchy="link" size="sm">Maattabel</Button>} />
      <VariantPicker label="Maat" options={sizes} error="Kies een maat." />
    </div>
  ),
};
export const AddToCartExample: Story = {
  render: () => {
    const [msg, setMsg] = useState('');
    return (
      <div style={col}>
        <AddToCart productName="Wollen trui" stock="low" stockText="Nog 3 op voorraad" delivery="Voor 22:00 besteld, morgen in huis" onAdd={(q) => setMsg(`${q} toegevoegd aan je winkelwagen`)} aside={<ButtonIcon hierarchy="secondary" icon={<Heart />} aria-label="Bewaar in verlanglijst" />} />
        <p role="status">{msg}</p>
        <AddToCart stock="out" onAdd={() => undefined} />
      </div>
    );
  },
};

/* ---------- Checkout parts ---------- */
export const DeliveryAndPayment: Story = {
  name: 'Delivery and payment options',
  render: () => {
    const [d, setD] = useState('thuis');
    const [p, setP] = useState('ideal');
    return (
      <div style={{ display: 'grid', gap: 32, maxWidth: 520 }}>
        <SelectionCardGroup legend="Bezorging">
          <SelectionCard name="d" value="thuis" checked={d === 'thuis'} onChange={() => setD('thuis')} title="Thuisbezorgd" description="Morgen tussen 9:00 en 18:00" aside="Gratis" />
          <SelectionCard name="d" value="avond" checked={d === 'avond'} onChange={() => setD('avond')} title="Avondlevering" description="Morgen tussen 18:00 en 22:00" aside="€ 2,95" />
          <SelectionCard name="d" value="punt" checked={d === 'punt'} onChange={() => setD('punt')} title="Afhalen bij een afhaalpunt" description="Vanaf overmorgen, kies een punt bij de volgende stap" aside="Gratis" />
        </SelectionCardGroup>
        <SelectionCardGroup legend="Betaalmethode">
          <SelectionCard name="p" value="ideal" checked={p === 'ideal'} onChange={() => setP('ideal')} title="iDEAL" description="Betaal direct via je eigen bank" />
          <SelectionCard name="p" value="kaart" checked={p === 'kaart'} onChange={() => setP('kaart')} title="Creditcard" description="Visa of Mastercard" />
          <SelectionCard name="p" value="achteraf" checked={p === 'achteraf'} onChange={() => setP('achteraf')} title="Achteraf betalen" description="Binnen 14 dagen" aside="€ 1,00" />
        </SelectionCardGroup>
      </div>
    );
  },
};
export const Address: Story = {
  render: () => {
    const [a, setA] = useState({});
    return <div style={{ maxWidth: 520 }}><AddressFields value={a} onChange={setA} /></div>;
  },
};

/* ---------- Filters ---------- */
const brandOptions = ['Noorderlicht', 'Atelier Klei', 'Draagwerk', 'Licht & Co', 'Groenhuis', 'Stapwijs', 'Huis & Haard', 'Linnenkast'].map((b, i) => ({ value: b, label: b, count: 40 - i * 4 }));
export const Filters: Story = {
  render: () => {
    const [brands, setBrands] = useState<string[]>(['Noorderlicht']);
    const [price, setPrice] = useState<[number, number]>([20, 150]);
    return (
      <div style={{ maxWidth: 300 }}>
        <FilterGroup title="Merk" options={brandOptions} value={brands} onChange={setBrands} limit={5} />
        <FilterGroup title="Prijs">
          <RangeSlider label="Prijs" hideLabel min={0} max={250} step={5} value={price} onChange={setPrice} formatValue={(v) => formatMoney(v)} minLabel="Minimumprijs" maxLabel="Maximumprijs" />
        </FilterGroup>
        <FilterGroup title="Beschikbaarheid" defaultOpen={false} options={[{ value: 'voorraad', label: 'Op voorraad', count: 182 }, { value: 'sale', label: 'In de sale', count: 23 }]} />
      </div>
    );
  },
};
export const ActiveFilterTags: Story = {
  render: () => {
    const [f, setF] = useState([{ id: 'b', label: 'Noorderlicht' }, { id: 'c', label: 'Blauw' }, { id: 'p', label: '€ 20 tot € 150' }]);
    return <ActiveFilters filters={f} resultCount={24 + f.length * 10} onRemove={(id) => setF((x) => x.filter((y) => y.id !== id))} onClear={() => setF([])} />;
  },
};
export const PriceRange: Story = {
  render: () => <div style={{ maxWidth: 360 }}><RangeSlider label="Prijs" min={0} max={250} step={5} defaultValue={[25, 175]} formatValue={(v) => formatMoney(v)} hint="Sleep beide bolletjes of gebruik de pijltjestoetsen." minLabel="Minimumprijs" maxLabel="Maximumprijs" /></div>,
};

/* ---------- Example pages ---------- */
const shopHeader = (count: number, onCart?: () => void) => (
  <Header logo={<strong>Winkel</strong>} links={[{ label: 'Nieuw', href: '#' }, { label: 'Kleding', href: '#', current: true }, { label: 'Wonen', href: '#' }]}
    actions={<><ButtonIcon hierarchy="tertiary" icon={<Search />} aria-label="Zoeken" /><CartButton count={count} onClick={onCart} /></>} />
);
const page: React.CSSProperties = { display: 'grid', gap: 24, maxWidth: 1200, margin: '0 auto', padding: '24px 0' };

export const ProductListingPage: Story = {
  name: 'Voorbeeld: productoverzicht',
  parameters: { layout: 'fullscreen' },
  render: () => {
    const [brands, setBrands] = useState<string[]>(['Noorderlicht']);
    return (
      <>
        {shopHeader(3)}
        <main style={{ ...page, padding: 24 }}>
          <Breadcrumbs items={[{ label: 'Home', href: '#' }, { label: 'Kleding', href: '#' }, { label: 'Truien' }]} />
          <h1 style={{ margin: 0, fontFamily: 'var(--text-headings-h2-font-family)', fontSize: 'var(--text-headings-h2-font-size)', lineHeight: 'var(--text-headings-h2-line-height)', fontWeight: 'var(--text-headings-h2-font-weight)' as never }}>Truien</h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px,260px) 1fr', gap: 32 }}>
            <aside aria-labelledby="flt-h">
              <h2 id="flt-h" className="rb-visually-hidden">Filters</h2>
              <FilterGroup title="Merk" options={brandOptions} value={brands} onChange={setBrands} limit={5} />
              <FilterGroup title="Prijs"><RangeSlider label="Prijs" hideLabel min={0} max={250} step={5} defaultValue={[0, 250]} formatValue={(v) => formatMoney(v)} minLabel="Minimumprijs" maxLabel="Maximumprijs" /></FilterGroup>
            </aside>
            <div style={{ display: 'grid', gap: 24, alignContent: 'start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16, flexWrap: 'wrap' }}>
                <ActiveFilters resultCount={24} filters={brands.map((b) => ({ id: b, label: b }))} onRemove={(id) => setBrands((x) => x.filter((y) => y !== id))} onClear={() => setBrands([])} />
                <div style={{ width: 220 }}><Select label="Sorteer op" size="sm" options={[{ value: 'pop', label: 'Populair' }, { value: 'low', label: 'Prijs laag naar hoog' }, { value: 'high', label: 'Prijs hoog naar laag' }, { value: 'new', label: 'Nieuwste' }]} /></div>
              </div>
              <ProductGrid aria-label="Truien">{products.map((p) => <ProductCard key={p.id} href="#" title={p.title} meta={p.meta} price={p.price} compareAt={p.compareAt} rating={p.rating} reviewCount={p.reviewCount} image={{ src: p.image }} stock={p.stock} />)}</ProductGrid>
              <Pagination page={1} pageCount={4} onPageChange={() => undefined} />
            </div>
          </div>
        </main>
      </>
    );
  },
};

export const ProductDetailPage: Story = {
  name: 'Voorbeeld: productpagina',
  parameters: { layout: 'fullscreen' },
  render: () => {
    const [open, setOpen] = useState(false);
    const [count, setCount] = useState(3);
    return (
      <>
        {shopHeader(count, () => setOpen(true))}
        <main style={{ ...page, padding: 24 }}>
          <Breadcrumbs items={[{ label: 'Home', href: '#' }, { label: 'Truien', href: '#' }, { label: 'Wollen trui met ronde hals' }]} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 48, alignItems: 'start' }}>
            <ProductGallery label="Wollen trui met ronde hals" images={galleryImages} />
            <div style={{ display: 'grid', gap: 20 }}>
              <div style={{ display: 'grid', gap: 8 }}>
                <span style={{ color: 'var(--color-foreground-tertiary)' }}>Noorderlicht</span>
                <h1 style={{ margin: 0, fontFamily: 'var(--text-headings-h3-font-family)', fontSize: 'var(--text-headings-h3-font-size)', lineHeight: 'var(--text-headings-h3-line-height)', fontWeight: 'var(--text-headings-h3-font-weight)' as never }}>Wollen trui met ronde hals</h1>
                <Rating value={4.5} count={128} showValue />
              </div>
              <Price amount={79.95} compareAt={99.95} size="lg" />
              <VariantPicker type="color" label="Kleur" options={colors} defaultValue="blauw" />
              <VariantPicker label="Maat" options={sizes} defaultValue="M" aside={<Button hierarchy="link" size="sm">Maattabel</Button>} />
              <AddToCart productName="Wollen trui" stock="in-stock" delivery="Voor 22:00 besteld, morgen in huis" onAdd={(q) => { setCount((c) => c + q); setOpen(true); }} />
              <Accordion headingLevel={2} items={[{ id: 'm', title: 'Materiaal en onderhoud', content: '100% merinowol. Wassen op 30 graden, wolprogramma.' }, { id: 'v', title: 'Verzenden en retourneren', content: 'Gratis verzending vanaf € 50. Binnen 30 dagen gratis retour.' }]} />
            </div>
          </div>
        </main>
        <MiniCart open={open} onClose={() => setOpen(false)} itemCount={count} subtotal={108.95 + (count - 3) * 79.95} note="Je bestelling wordt gratis verzonden">
          {cartLines.map((l) => <CartItem key={l.id} size="sm" {...l} onRemove={() => undefined} />)}
        </MiniCart>
      </>
    );
  },
};

export const CartPage: Story = {
  name: 'Voorbeeld: winkelwagen',
  parameters: { layout: 'fullscreen' },
  render: () => {
    const [lines, setLines] = useState(cartLines);
    const [code, setCode] = useState<string | null>(null);
    const sub = lines.reduce((n, l) => n + l.price * l.quantity, 0);
    const disc = code ? -Math.round(sub * 10) / 100 : 0;
    return (
      <>
        {shopHeader(lines.reduce((n, l) => n + l.quantity, 0))}
        <main style={{ ...page, padding: 24, gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', alignItems: 'start' }}>
          <section aria-labelledby="cart-h" style={{ display: 'grid', gap: 24, gridColumn: 'span 1' }}>
            <h1 id="cart-h" style={{ margin: 0, fontFamily: 'var(--text-headings-h3-font-family)', fontSize: 'var(--text-headings-h3-font-size)', fontWeight: 'var(--text-headings-h3-font-weight)' as never }}>Winkelwagen</h1>
            {lines.map((l) => <CartItem key={l.id} href="#" {...l} onQuantityChange={(q) => setLines((ls) => ls.map((x) => (x.id === l.id ? { ...x, quantity: q } : x)))} onRemove={() => setLines((ls) => ls.filter((x) => x.id !== l.id))} />)}
          </section>
          <CartSummary subtotal={sub} lines={[{ label: 'Verzending', amount: 0, note: sub >= 50 ? 'Gratis' : formatMoney(4.95) }, ...(code ? [{ label: `Korting (${code})`, amount: disc }] : [])]} total={sub + disc + (sub >= 50 ? 0 : 4.95)}
            promo={<PromoCode applied={code} onRemove={() => setCode(null)} onApply={(c) => (c.toUpperCase() === 'WELKOM10' ? void setCode('WELKOM10') : 'Deze code kennen we niet.')} />}
            action={<Button fullWidth>Verder naar afrekenen</Button>} />
        </main>
      </>
    );
  },
};

export const CheckoutPage: Story = {
  name: 'Voorbeeld: afrekenen',
  parameters: { layout: 'fullscreen' },
  render: () => {
    const [a, setA] = useState({});
    const [d, setD] = useState('thuis');
    return (
      <>
        {shopHeader(3)}
        <main style={{ ...page, padding: 24 }}>
          <Stepper steps={[{ title: 'Gegevens' }, { title: 'Bezorging' }, { title: 'Betalen' }, { title: 'Klaar' }]} current={1} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 48, alignItems: 'start' }}>
            <form style={{ display: 'grid', gap: 32, minWidth: 0 }} onSubmit={(e) => e.preventDefault()}>
              <section style={{ display: 'grid', gap: 16 }}>
                <h2 style={{ margin: 0, fontFamily: 'var(--text-headings-h4-font-family)', fontSize: 'var(--text-headings-h4-font-size)', fontWeight: 'var(--text-headings-h4-font-weight)' as never }}>Bezorgadres</h2>
                <AddressFields value={a} onChange={setA} />
                <Checkbox label="Factuuradres is hetzelfde" defaultChecked />
              </section>
              <SelectionCardGroup legend="Bezorging">
                <SelectionCard name="d2" value="thuis" checked={d === 'thuis'} onChange={() => setD('thuis')} title="Thuisbezorgd" description="Morgen tussen 9:00 en 18:00" aside="Gratis" />
                <SelectionCard name="d2" value="avond" checked={d === 'avond'} onChange={() => setD('avond')} title="Avondlevering" description="Morgen tussen 18:00 en 22:00" aside="€ 2,95" />
              </SelectionCardGroup>
              <div><Button type="submit">Verder naar betalen</Button></div>
            </form>
            <CartSummary title="Je bestelling" subtotal={108.95} lines={[{ label: 'Verzending', amount: d === 'avond' ? 2.95 : 0, note: d === 'avond' ? undefined : 'Gratis' }]} total={108.95 + (d === 'avond' ? 2.95 : 0)}>
              {cartLines.map((l) => <CartItem key={l.id} size="sm" readOnly {...l} />)}
            </CartSummary>
          </div>
        </main>
      </>
    );
  },
};
