// Stories for Table. The story code lives in Content.cases.tsx (shared with related components).
import meta, * as S from './Content.cases';
import * as P from '../Portal/Portal.cases';

export default { ...meta, title: 'Data display/Table' } as typeof meta;
export const DataTable = S.DataTable;
export const TableWithToolbar = P.TableWithToolbar;
export const TableLoading = P.TableLoading;
export const TableEmpty = P.TableEmpty;
