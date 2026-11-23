// Stories for File upload. The story code lives in Content.cases.tsx (shared with related components).
import meta, * as S from './Content.cases';

export default { ...meta, title: 'Content/File upload' } as typeof meta;
export const Upload = S.Upload;
export const WithFiles = { ...S.WithFiles, name: 'With files' };
export const ItemSlots = { ...S.ItemSlots, name: 'Item slots' };
export const ArtworkCheckPattern = { ...S.ArtworkCheckPattern, name: 'Pattern: artwork check' };
export const ArtworkCheckPatternDutch = { ...S.ArtworkCheckPatternDutch, name: 'Pattern: artwork check, in Dutch' };
