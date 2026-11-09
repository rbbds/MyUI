// Stories for Sidebar. The story code lives in AppShell.cases.tsx (shared with related components).
import meta, * as S from './AppShell.cases';

export default { ...meta, title: 'Navigation/Sidebar' } as typeof meta;
export const AppSidebar = S.AppSidebar;
export const CollapsibleSidebar = S.CollapsibleSidebar;
export const CollapsedSidebar = S.CollapsedSidebar;
export const TwoLevelSidebar = S.TwoLevelSidebar;
