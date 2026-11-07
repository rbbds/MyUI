import { useState } from 'react';
import { cx } from '../../utils/cx';
import { Input } from '../Form/Input';
import './Commerce.css';

export interface Address { postcode: string; houseNumber: string; addition?: string; street: string; city: string }
export interface AddressFieldsProps {
  value?: Partial<Address>;
  onChange?: (value: Partial<Address>) => void;
  /** Prefix for name/autocomplete sections, e.g. "shipping" or "billing". */
  section?: 'shipping' | 'billing';
  /** Field errors, e.g. from server validation. */
  errors?: Partial<Record<keyof Address, string>>;
  className?: string;
}

const PC = /^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/;

/** Dutch address: postcode + house number first (that is how people know their address), then street and city. Uses autocomplete tokens so browsers can fill it in. */
export function AddressFields({ value = {}, onChange, section = 'shipping', errors = {}, className }: AddressFieldsProps) {
  const [touched, setTouched] = useState<Partial<Record<keyof Address, boolean>>>({});
  const set = (k: keyof Address, v: string) => onChange?.({ ...value, [k]: v });
  const pcError = errors.postcode ?? (touched.postcode && value.postcode && !PC.test(value.postcode) ? 'Vul een postcode in als 1234 AB.' : undefined);
  const ac = (t: string) => `${section} ${t}`;
  return (
    <div className={cx('rb-address', className)}>
      <div className="rb-address__row rb-address__row--pc">
        <Input label="Postcode" required value={value.postcode ?? ''} onChange={(e) => set('postcode', e.target.value.toUpperCase())} onBlur={() => setTouched({ ...touched, postcode: true })} autoComplete={ac('postal-code')} error={pcError} maxLength={7} />
        <Input label="Huisnummer" required inputMode="numeric" value={value.houseNumber ?? ''} onChange={(e) => set('houseNumber', e.target.value)} autoComplete={ac('address-line2')} error={errors.houseNumber} />
        <Input label="Toevoeging" value={value.addition ?? ''} onChange={(e) => set('addition', e.target.value)} hint="Bijv. A of 2-hoog" error={errors.addition} />
      </div>
      <Input label="Straat" required value={value.street ?? ''} onChange={(e) => set('street', e.target.value)} autoComplete={ac('address-line1')} error={errors.street} />
      <Input label="Plaats" required value={value.city ?? ''} onChange={(e) => set('city', e.target.value)} autoComplete={ac('address-level2')} error={errors.city} />
    </div>
  );
}
