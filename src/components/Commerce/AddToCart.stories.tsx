// Stories for Add to cart. The story code lives in Commerce.cases.tsx (shared with related components).
import meta, * as S from './Commerce.cases';

export default { ...meta, title: 'E-commerce/Add to cart' } as typeof meta;
export const AddToCartExample = S.AddToCartExample;
export const BulkOrder = { ...S.BulkOrder, name: 'Bulk order with a second action' };
