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
  labels?: Partial<AddressFieldsLabels>;
  className?: string;
}
export interface AddressFieldsLabels { postcode: string; houseNumber: string; addition: string; additionHint: string; street: string; city: string; postcodeInvalid: string }
export const DEFAULT_ADDRESS_FIELDS_LABELS: AddressFieldsLabels = {
  postcode: 'Postcode', houseNumber: 'House number', addition: 'Addition', additionHint: 'For example A or 2nd floor',
  street: 'Street', city: 'City', postcodeInvalid: 'Enter a postcode like 1234 AB.',
};

const PC = /^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/;

/** Dutch address: postcode + house number first (that is how people know their address), then street and city. Uses autocomplete tokens so browsers can fill it in. */
export function AddressFields({ value = {}, onChange, section = 'shipping', errors = {}, labels, className }: AddressFieldsProps) {
  const l = { ...DEFAULT_ADDRESS_FIELDS_LABELS, ...labels };
  const [touched, setTouched] = useState<Partial<Record<keyof Address, boolean>>>({});
  const set = (k: keyof Address, v: string) => onChange?.({ ...value, [k]: v });
  const pcError = errors.postcode ?? (touched.postcode && value.postcode && !PC.test(value.postcode) ? l.postcodeInvalid : undefined);
  const ac = (t: string) => `${section} ${t}`;
  return (
    <div className={cx('rb-address', className)}>
      <div className="rb-address__row rb-address__row--pc">
        <Input label={l.postcode} required value={value.postcode ?? ''} onChange={(e) => set('postcode', e.target.value.toUpperCase())} onBlur={() => setTouched({ ...touched, postcode: true })} autoComplete={ac('postal-code')} error={pcError} maxLength={7} />
        <Input label={l.houseNumber} required inputMode="numeric" value={value.houseNumber ?? ''} onChange={(e) => set('houseNumber', e.target.value)} autoComplete={ac('address-line2')} error={errors.houseNumber} />
        <Input label={l.addition} value={value.addition ?? ''} onChange={(e) => set('addition', e.target.value)} hint={l.additionHint} error={errors.addition} />
      </div>
      <Input label={l.street} required value={value.street ?? ''} onChange={(e) => set('street', e.target.value)} autoComplete={ac('address-line1')} error={errors.street} />
      <Input label={l.city} required value={value.city ?? ''} onChange={(e) => set('city', e.target.value)} autoComplete={ac('address-level2')} error={errors.city} />
    </div>
  );
}
