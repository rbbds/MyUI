import { useMemo } from 'react';
import { Combobox, type ComboboxProps } from '../components/Form/Combobox';
import { Flag, flagCodes } from './Flag';

export interface CountrySelectProps extends Omit<ComboboxProps, 'options'> {
  /** Limit the list to these ISO codes. Defaults to all countries with a flag. */
  countries?: string[];
  /** Codes shown first, in their own group, e.g. ['NL', 'BE', 'DE']. */
  preferred?: string[];
  /** Locale for country names (Intl.DisplayNames). Default nl-NL. */
  locale?: string;
  preferredLabel?: string;
  allLabel?: string;
  /** Hide the flags (e.g. very long forms on slow devices). */
  hideFlags?: boolean;
}

/** Country picker with flags and search. Names come from the browser (Intl), so no data files are needed. */
export function CountrySelect({ countries, preferred = [], locale = 'nl-NL', preferredLabel = 'Veelgekozen', allLabel = 'Alle landen', hideFlags, placeholder = 'Kies een land', ...rest }: CountrySelectProps) {
  const options = useMemo(() => {
    const names = new Intl.DisplayNames([locale], { type: 'region' });
    const en = new Intl.DisplayNames(['en'], { type: 'region' });
    const codes = (countries ?? flagCodes).map((c) => c.toUpperCase());
    const make = (code: string, group?: string) => {
      const label = names.of(code) ?? code;
      return { value: code, label, group, icon: hideFlags ? undefined : <Flag code={code} size="md" />, keywords: [code, en.of(code) ?? ''] };
    };
    const pref = preferred.map((c) => c.toUpperCase()).filter((c) => codes.includes(c));
    const rest = codes.filter((c) => !pref.includes(c)).map((c) => make(c, pref.length ? allLabel : undefined))
      .filter((o) => o.label !== o.value)
      .sort((a, b) => a.label.localeCompare(b.label, locale));
    return [...pref.map((c) => make(c, preferredLabel)), ...rest];
  }, [countries, preferred, locale, preferredLabel, allLabel, hideFlags]);

  return <Combobox options={options} placeholder={placeholder} {...rest} />;
}
