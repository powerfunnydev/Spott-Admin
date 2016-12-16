import { createSelector, createStructuredSelector } from 'reselect';
import { brandEntitiesSelector, productEntitiesSelector } from '../common';

export const activeTabSelector = (state) => state.getIn([ 'tagger', 'tagger', 'quickies', 'activeTab' ]);
export const selectedProductIdSelector = (state) => state.getIn([ 'tagger', 'tagger', 'quickies', 'selectedProductId' ]);

const selectedProductSelector = createSelector(
  selectedProductIdSelector,
  productEntitiesSelector,
  brandEntitiesSelector,
  (productId, products, brands) => {
    const product = products.get(productId);
    if (product) {
      return product.set('brand', brands.get(product.get('brandId')));
    }
  }
);

export default createStructuredSelector({
  activeTab: activeTabSelector,
  selectedProduct: selectedProductSelector
});
