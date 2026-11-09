// Stories for Portaal/Voorbeelden. The story code lives in Portal.cases.tsx (shared with related components).
import meta, * as S from './Portal.cases';
import * as T from './Portal2.cases';

export default { ...meta, title: 'Portaal/Voorbeelden' } as typeof meta;
export const Dashboard = S.Dashboard;
export const MijnGegevens = S.MijnGegevens;
export const Documenten = T.Documenten;
export const Aanvraag = T.Aanvraag;
export const Inloggen = T.Inloggen;
