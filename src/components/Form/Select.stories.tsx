// Stories for Select. The story code lives in Form.cases.tsx (shared with related components).
import meta, * as S from './Form.cases';

export default { ...meta, title: 'Form inputs/Select' } as typeof meta;
export const SelectField = S.SelectField;
export const SelectError = S.SelectError;

/* Flag in the leading slot: same as Figma (Select › Icon leading on, Leading icon swapped to Flag/XX).
   A native select cannot show images inside the options, so only the chosen country shows a flag.
   Need a flag per option or search? Use CountrySelect (Combobox). */
import { useState } from 'react';
import type { StoryObj } from '@storybook/react-vite';
import { Select } from './Select';
import { Flag } from '../../flags';

const countries = [{ value: 'NL', label: 'Netherlands' }, { value: 'BE', label: 'Belgium' }, { value: 'DE', label: 'Germany' }, { value: 'FR', label: 'France' }, { value: 'GB', label: 'United Kingdom' }];
export const WithFlag: StoryObj<typeof Select> = {
  render: () => {
    const [code, setCode] = useState('NL');
    return <Select label="Country" hint="The country you live in." value={code} onChange={(e) => setCode(e.target.value)} iconLeading={<Flag code={code} />} options={countries} />;
  },
};
