// Stories for Tier pricing table. The story code lives in Commerce.cases.tsx (shared with related components).
import meta, * as S from './Commerce.cases';

export default { ...meta, title: 'E-commerce/Tier pricing table' } as typeof meta;
export const TierPricingTables = { ...S.TierPricingTables, name: 'Tier pricing table' };
export const TierPricingWithAddToCart = { ...S.TierPricingWithAddToCart, name: 'Tier pricing with Add to cart' };
export const TierPricingDutch = { ...S.TierPricingDutch, name: 'Tier pricing with Add to cart, in Dutch' };
