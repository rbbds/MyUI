// Stories for Account/Examples. The story code lives in Portal.cases.tsx and Portal2.cases.tsx (shared with related components).
import meta, * as S from './Portal.cases';
import * as T from './Portal2.cases';

export default { ...meta, title: 'Account/Examples' } as typeof meta;
export const Dashboard = S.Dashboard;
export const MyDetails = S.MyDetails;
export const Documents = T.Documents;
export const TrackRequest = T.TrackRequest;
export const LogIn = T.LogIn;
