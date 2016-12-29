import { createSelector } from 'reselect';
import { List, Map } from 'immutable';
import {
  brandEntitiesSelector,
  createEntitiesByRelationSelector,
  currentVideoIdSelector,
  globalAppearanceEntitiesSelector,
  productSearchRelationsSelector,
  globalProductSearchStringSelector,
  hoveredAppearanceSelector,
  productEntitiesSelector,
  selectedAppearanceSelector,
  videoHasGlobalProductsRelationsSelector
} from './common';

/**
 * Extracts the products of the current video from the state tree.
 */
const productsSelector = createSelector(
  currentVideoIdSelector,
  videoHasGlobalProductsRelationsSelector,
  globalAppearanceEntitiesSelector,
  brandEntitiesSelector,
  productEntitiesSelector,
  (videoId, videoHasGlobalProducts, globalAppearances, brands, products) => {
    // videoHasGlobalProducts and products are always present, but can be empty Immutable Map's.
    const globalProductAppearances = videoId && videoHasGlobalProducts.get(videoId);
    if (globalProductAppearances) {
      return globalProductAppearances.map((appearanceId) => {
        // A video product has an appearanceId, id (product id) and relavance.
        const videoProduct = globalAppearances.get(appearanceId);
        const product = products.get(videoProduct.get('id'));
        const brand = product && brands.get(product.get('brandId'));
        return Map({ brand, videoProduct, product });
      });
    }
    return List();
  }
);

/**
  * @returnExample
  * Map({ _error, _status, data: List(productMaps)})
  */
const productSearchResultSelector = createEntitiesByRelationSelector(productSearchRelationsSelector, globalProductSearchStringSelector, productEntitiesSelector);

export default (state) => ({
  hoveredAppearance: hoveredAppearanceSelector(state),
  productTuples: productsSelector(state),
  products: productEntitiesSelector(state),
  productSearchResult: productSearchResultSelector(state),
  selectedAppearance: selectedAppearanceSelector(state)
});
