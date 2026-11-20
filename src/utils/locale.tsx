import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { LabelSets } from '../locales/registry';
import { mergeLabels } from './labels';

/**
 * Single texts that are a prop of their own (a label, title or placeholder) and not part of a `labels` object.
 * English defaults. A locale can translate them under `texts`.
 */
export const DEFAULT_TEXT_LABELS = {
  'addToCart.label': 'Add to cart',
  'bottomNavigation.label': 'Main menu',
  'cartButton.label': 'Cart',
  'cartSummary.title': 'Summary',
  'cartSummary.totalNote': 'Including VAT',
  'combobox.emptyText': 'No results',
  'combobox.placeholder': 'Choose or type to search',
  'commandMenu.emptyText': 'No results found.',
  'commandMenu.label': 'Commands',
  'commandMenu.placeholder': 'Search or type a command…',
  'countrySelect.allLabel': 'All countries',
  'countrySelect.placeholder': 'Choose a country',
  'countrySelect.preferredLabel': 'Popular',
  'dateRangePicker.placeholder': 'Choose a period',
  'notificationButton.label': 'Notifications',
  'notificationPanel.title': 'Notifications',
  'promoCode.label': 'Discount code',
  'quantityStepper.label': 'Quantity',
  'searchInput.placeholder': 'Search',
  'spinner.label': 'Loading',
  'toastRegion.label': 'Notifications',
} as const;
export type TextKey = keyof typeof DEFAULT_TEXT_LABELS;

/** Texts per component, by the key of its label set: `{ cartSummary: { total: 'Totaal' } }`. */
export type LocaleLabels = { [K in keyof LabelSets]?: Partial<LabelSets[K]> };
/** Single texts, by `component.prop`: `{ 'cartSummary.title': 'Overzicht' }`. */
export type LocaleTexts = Partial<Record<TextKey, string>>;

/** A language for MyUI: the locale for dates, numbers and amounts, and the translated texts. */
export interface LocaleDefinition {
  /** BCP 47 tag, for example `nl-NL`. Used for `Intl`: dates, numbers and amounts. */
  locale: string;
  labels?: LocaleLabels;
  texts?: LocaleTexts;
}
/** A locale with every text filled in. Locale files use this type, so a missing text fails the type check. */
export interface CompleteLocale extends LocaleDefinition {
  labels: { [K in keyof LabelSets]: LabelSets[K] };
  texts: Record<TextKey, string>;
}

export const DEFAULT_LOCALE = 'en-US';
const LocaleContext = createContext<LocaleDefinition | null>(null);

export interface LocaleProviderProps {
  /** A locale object such as `nlNL` from `@rbbds/ui/locales/nl-NL`, or only a tag such as `"nl-NL"` (formats only, texts stay English). */
  locale: LocaleDefinition | string;
  /** Your own texts on top of the locale, per component. */
  labels?: LocaleLabels;
  /** Your own single texts on top of the locale. */
  texts?: LocaleTexts;
  children?: ReactNode;
}

/**
 * Sets the language for every MyUI component inside it: the format of dates, numbers and amounts, and the built-in texts.
 * A `locale` or `labels` prop on a component still wins. Without a provider everything is en-US.
 *
 * ```tsx
 * import { LocaleProvider } from '@rbbds/ui';
 * import { nlNL } from '@rbbds/ui/locales/nl-NL';
 *
 * <LocaleProvider locale={nlNL} labels={{ cartSummary: { total: 'Totaal excl. btw' } }}>…</LocaleProvider>
 * ```
 */
export function LocaleProvider({ locale, labels, texts, children }: LocaleProviderProps) {
  const value = useMemo<LocaleDefinition>(() => {
    const base: LocaleDefinition = typeof locale === 'string' ? { locale } : locale;
    if (!labels && !texts) return base;
    const merged: Record<string, object> = { ...base.labels };
    for (const key of Object.keys(labels ?? {}) as Array<keyof LabelSets>) merged[key] = { ...(base.labels?.[key] as object), ...(labels![key] as object) };
    return { locale: base.locale, labels: merged as LocaleLabels, texts: { ...base.texts, ...texts } };
  }, [locale, labels, texts]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

/** The locale for `Intl`: the prop of the component, else the provider, else en-US. */
export function useLocale(locale?: string): string {
  const ctx = useContext(LocaleContext);
  return locale ?? ctx?.locale ?? DEFAULT_LOCALE;
}

/** The texts of a component: English defaults, then the provider, then `labels`, then the older single text props. */
export function useLabels<K extends keyof LabelSets>(key: K, defaults: LabelSets[K], labels?: Partial<LabelSets[K]>, legacy?: Partial<LabelSets[K]>): LabelSets[K] {
  const ctx = useContext(LocaleContext);
  return mergeLabels(mergeLabels(defaults as object, ctx?.labels?.[key] as object | undefined), labels as object | undefined, legacy as object | undefined) as LabelSets[K];
}

/** A single text prop: the value of the prop, else the provider, else the English default. */
export function useText<T = string>(key: TextKey, value?: T): T | string {
  const ctx = useContext(LocaleContext);
  return value ?? ctx?.texts?.[key] ?? DEFAULT_TEXT_LABELS[key];
}
