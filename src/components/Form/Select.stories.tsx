// Stories for Select. The story code lives in Form.cases.tsx (shared with related components).
import meta, * as S from './Form.cases';

export default { ...meta, title: 'Form inputs/Select' } as typeof meta;
export const SelectField = S.SelectField;
export const SelectError = S.SelectError;

/* Flag in the leading slot: same as Figma (Select › Icon leading on, Leading icon swapped to Flag/XX).
   A native select cannot show images inside the options, so only the chosen country shows a flag.
   Need a flag per option or search? Use Country select. */
import { useState } from 'react';
import type { StoryObj } from '@storybook/react-vite';
import { Select } from './Select';
import { Flag } from '../../flags';

const countries = [{ value: 'NL', label: 'Nederland' }, { value: 'BE', label: 'België' }, { value: 'DE', label: 'Duitsland' }, { value: 'FR', label: 'Frankrijk' }, { value: 'GB', label: 'Verenigd Koninkrijk' }];
export const WithFlag: StoryObj<typeof Select> = {
  render: () => {
    const [code, setCode] = useState('NL');
    return <Select label="Land" hint="Het land waar je woont." value={code} onChange={(e) => setCode(e.target.value)} iconLeading={<Flag code={code} />} options={countries} />;
  },
};
